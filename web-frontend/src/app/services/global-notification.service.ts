import { Injectable, EventEmitter } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const NEW_MESSAGES_SUBSCRIPTION = gql`
  subscription {
   messageReceived {
    event_id
    event_name
    event_dt
    count
   }
  }
`;

@Injectable({
    providedIn: 'root',
  })
  
  export class GraphqlNotificationService {
    newMessageReceived = new EventEmitter<any>();
  
    constructor(private apollo: Apollo) {
      this.subscribeToNewMessages();
    }
  
    private subscribeToNewMessages() {
      this.apollo.subscribe({
        query: NEW_MESSAGES_SUBSCRIPTION,
      }).subscribe({
        next: (response) => {
          this.newMessageReceived.emit(response.data);
        },
        error: (error) => console.error(error),
      });
    }
  }