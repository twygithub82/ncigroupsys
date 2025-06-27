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

export class SingletonNotificationService extends BaseDataSource<MessageItem> {
  private emitterMap = new Map<string, EventEmitter<MessageItem>>();
  subscribers: Array<{
    topics: string[];  // Changed from single topic to array of topics
    event: Subscriber;
  }> = [];

  constructor(private apollo: Apollo) {
    super();
    this.subscribeToMessages();
  }

  public subscribe(topics: string | string[], handler: (message: MessageItem) => void): Subscription {
    // Normalize to array if single topic provided
    const topicArray = Array.isArray(topics) ? topics : [topics];

    // Create or get emitters for each topic
    const emitters: EventEmitter<MessageItem>[] = [];

    topicArray.forEach(topic => {
      let emitter = this.emitterMap.get(topic);
      if (!emitter) {
        emitter = new EventEmitter<MessageItem>();
        this.emitterMap.set(topic, emitter);
      }
      emitters.push(emitter);
    });

    // Check for existing subscription with the exact same topics
    const existing = this.subscribers.find(
      sub => this.arraysEqual(sub.topics, topicArray) && !sub.event.closed
    );

    if (existing) {
      console.warn(`[NotificationService] Duplicate subscription ignored for topics: ${topicArray.join(', ')}`);
      const subscriptions = emitters.map(emitter =>
        emitter.subscribe({ next: handler })
      );

      return new Subscription(() => {
        subscriptions.forEach(sub => sub.unsubscribe());
      });
    }

    // Create new subscriptions
    const subscriptions = emitters.map(emitter =>
      emitter.subscribe({
        next: handler,
        complete: () => {
          const s = this.subscribers.find(sub => this.arraysEqual(sub.topics, topicArray));
          if (s) s.event.closed = true;
        }
      })
    );

    this.subscribers.push({
      topics: topicArray,
      event: {
        emitters,  // Changed from single emitter to array of emitters
        closed: false
      }
    });

    return new Subscription(() => {
      subscriptions.forEach(sub => sub.unsubscribe());
      this.subscribers = this.subscribers.filter(
        sub => !this.arraysEqual(sub.topics, topicArray)
      );
    });
  }

  private arraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
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
      // Check if any of the subscribed topics match the message topic
      const hasMatchingTopic = sub.topics.some(topic =>
        this.topicMatches(topic, message?.topic!)
      );

      const active = !sub.event.closed && hasMatchingTopic;

      if (active) {
        if (typeof message.payload === 'string') {
          message.payload = JSON.parse(message.payload);
        } else if (typeof message.payload === 'object') {
          // already a JS object - no action needed
        } else {
          // optionally handle unexpected formats
          console.log('Unsupported payload type:', typeof message.payload);
        }

        // Emit the message through all matching emitters
        sub.event.emitters.forEach(emitter => {
          if (sub.topics.some(topic =>
            this.topicMatches(topic, message?.topic!)
          )) {
            emitter.emit(message);
          }
        });
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
  emitters: EventEmitter<MessageItem>[];  // Changed to array of emitters
  closed?: boolean;
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