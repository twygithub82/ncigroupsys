import { Injectable, EventEmitter } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { BaseDataSource } from 'app/data-sources/base-ds';
import { catchError, finalize, map, Observable, of } from 'rxjs';
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

export class SingletonNotificationService extends BaseDataSource<MessageItem>{
  
   subscribers: Array<{
    topic: string;
    event: Subscriber;
    }> = [];

  constructor(private apollo: Apollo) {
   super();
    this.subscribeToMessages();
  }

  public subscribe(topic: string, handler: (message: MessageItem) => void) {

    const emitter = new EventEmitter<MessageItem>();

  emitter.subscribe({
    next: handler,
    complete: () => {
      sub.event.closed = true;
    }
  });

  const sub: any = {
    topic,
    event: {
      emitter,
      closed: false
    }
  };

  this.subscribers.push(sub);

    // const sub :any = { topic, event: { emitter:emit , closed:false } };
    // sub.event.emitter.on('close', () => { sub.event.closed = true; });
    // this.subscribers.push(sub);
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
    if (active) 
    {
        const jsonString = `${message.payload}`;
        message.payload= JSON.parse(jsonString);
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

