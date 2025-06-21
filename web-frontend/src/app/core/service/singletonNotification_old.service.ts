import { Injectable, EventEmitter } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { BaseDataSource } from 'app/data-sources/base-ds';
import { catchError, finalize, map, Observable, of, Subscription } from 'rxjs';
import { ApolloError } from '@apollo/client/errors';
const NEW_MESSAGES_R1_SUBSCRIPTION = gql`
  subscription {
    messageReceived_r1 {
      count
      event_dt
      event_id
      event_name
      payload
      topic
    }
  }
`;

const NEW_MESSAGES_SUBSCRIPTION = gql`
  subscription {
    messageReceived {
      count
      event_dt
      event_id
      event_name
    }
  }
`;

@Injectable({
  providedIn: 'root',
})

export class SingletonNotificationService_old extends BaseDataSource<MessageItem> {
  private emitterMap = new Map<string, EventEmitter<MessageItem>>();
  subscribers: Array<{
    topic: string;
    event: Subscriber;
  }> = [];

  constructor(private apollo: Apollo) {
    super();
    this.subscribeToMessages();
  }

  public subscribe(topic: string, handler: (message: MessageItem) => void): Subscription {
    let emitter = this.emitterMap.get(topic);
    if (!emitter) {
      emitter = new EventEmitter<MessageItem>();
      this.emitterMap.set(topic, emitter);
    }

    const existing = this.subscribers.find(
      sub => sub.topic === topic && sub.event.emitter === emitter && !sub.event.closed
    );

    // Optional: avoid duplicate handlers for same topic
    if (existing) {
      console.warn(`[NotificationService] Duplicate subscription ignored for topic: ${topic}`);
      const subscription = emitter.subscribe({ next: handler });
      return new Subscription(() => {
        subscription.unsubscribe();
      });
    }

    const subscription = emitter.subscribe({
      next: handler,
      complete: () => {
        const s = this.subscribers.find(sub => sub.topic === topic && sub.event.emitter === emitter);
        if (s) s.event.closed = true;
      }
    });

    this.subscribers.push({ topic, event: { emitter, closed: false } });

    return new Subscription(() => {
      subscription.unsubscribe();
      this.subscribers = this.subscribers.filter(
        sub => !(sub.topic === topic && sub.event.emitter === emitter)
      );
    });
  }

  private subscribeToMessages() {
    this.apollo.subscribe({
      query: NEW_MESSAGES_R1_SUBSCRIPTION,
    }).subscribe({
      next: (response) => {
        const msg = (response?.data as any)?.messageReceived_r1 || {};
        this.broadcastMessage(msg as any);
      },
      error: (error) => console.error(error),
    });
  }

  private broadcastMessage(message: MessageItem) {
    this.subscribers = this.subscribers.filter(sub => {
      const active = !sub.event.closed && this.topicMatches(sub.topic, message?.topic!);
      if (active) {
        if (typeof message.payload === 'string') {
          message.payload = JSON.parse(message.payload);
        } else if (typeof message.payload === 'object') {
          // already a JS object – no action needed
        } else {
          // optionally handle unexpected formats
          console.log('Unsupported payload type:', typeof message.payload);
        }
        sub.event.emitter.emit(message);
      }
      return !sub.event.closed; // Keep only active ones
    });
  }

  topicMatches(subscriptionTopic: string, messageTopic: string): boolean {
    // Exact match
    if (subscriptionTopic === messageTopic) return true;

    // Global wildcard
    if (subscriptionTopic === "#") return true;

    const subParts = subscriptionTopic.split('/');
    const msgParts = messageTopic.split('/');

    for (let i = 0; i < subParts.length; i++) {
      // Single-level wildcard
      if (subParts[i] === "+") continue;

      // Multi-level wildcard
      if (subParts[i] === "#") return true;

      // Segment mismatch
      if (subParts[i] !== msgParts[i]) return false;
    }

    return subParts.length === msgParts.length;
  }
}

interface Subscriber {
  emitter: EventEmitter<MessageItem>;
  closed?: boolean; // You manage this manually
}

export class MessageItem {
  public event_id?: string;
  public event_dt?: number;
  public event_name?: string;
  public payload?: any;
  public count?: number;
  public topic?: string;

  constructor(item: Partial<MessageItem> = {}) {
    this.event_id = item.event_id;
    this.event_dt = item.event_dt;
    this.event_name = item.event_name;
    this.payload = item.payload;
    this.count = item.count;
    this.topic = item.topic;
  }
}

