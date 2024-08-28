import { Injectable, EventEmitter } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { BaseDataSource } from 'app/data-sources/base-ds';
import { catchError, finalize, map, Observable, of } from 'rxjs';
import { ApolloError } from '@apollo/client/errors';
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

const NEW_NOTIFICATION_SUBSCRIPTION = gql`
  subscription {
   notificationTriggered {
    create_by
    create_dt
    date
    delete_dt
    guid
    id
    is_read
    message
    module_cv
    title
    update_by
    update_dt
    notification_uid
  }
}
`;

const GET_NOTIFICATION_DATA = gql`
  query {
    notificationItems: queryNotifications {
    totalCount
    nodes {
      create_by
      create_dt
      date
      delete_dt
      guid
      id
      is_read
      message
      module_cv
      title
      update_by
      update_dt
    }
   }
  }
`;

// @Injectable({
//     providedIn: 'root',
//   })

  export class NotificationItem {
    public guid?: string;
    public id?: number;
    public message?: string;
    public module_cv?: string;
    public date?: number;
    public is_read?: boolean;
    public type_cv?: string;
    public title?: string;
   
    public create_dt?: number;
    public create_by?: string;
    public update_dt?: number;
    public update_by?: string;
    public delete_dt?: number;
  
    constructor(item: Partial<NotificationItem> = {}) {
      this.guid = item.guid;
      if (!this.guid) this.guid = '';
      this.id = item.id;
      this.message = item.message;
      this.module_cv = item.module_cv;
      this.date = item.date;
      this.is_read = item.is_read;
      this.type_cv = item.type_cv;
      this.title = item.title;

     
      this.create_dt = item.create_dt;
      this.create_by = item.create_by;
      this.update_dt = item.update_dt;
      this.update_by = item.update_by;
      this.delete_dt = item.delete_dt;
    }
  }
  
  export class GraphqlNotificationService extends BaseDataSource<NotificationItem> {
    newMessageReceived = new EventEmitter<any>();
    notificationTriggered = new EventEmitter<any>();
  
    constructor(private apollo: Apollo) {
      super();
      this.subscribeToNewMessages();
      this.subscribeToNotificationTriggered();
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

    private subscribeToNotificationTriggered() {
      this.apollo.subscribe({
        query: NEW_NOTIFICATION_SUBSCRIPTION,
      }).subscribe({
        next: (response) => {
          this.notificationTriggered.emit(response.data);
        },
        error: (error) => console.error(error),
      });
    }

    SearchNotificationData(where?: any, order?: any, first?: number , after?: string, last?: number, before?: string): Observable<NotificationItem[]> {
      this.loadingSubject.next(true);
      if(!last) 
        if(!first)
            first=10;
      return this.apollo
        .query<any>({
          query: GET_NOTIFICATION_DATA,
          variables: { where, order, first, after, last, before },
          fetchPolicy: 'no-cache' // Ensure fresh data
        })
        .pipe(
          map((result) => result.data),
          catchError((error: ApolloError) => {
            console.error('GraphQL Error:', error);
            return of([] as NotificationItem[]); // Return an empty array on error
          }),
          finalize(() => this.loadingSubject.next(false)),
          map((result) => {
            const notificationItems = result.notificationItems || { nodes: [], totalCount: 0 };
            this.dataSubject.next(notificationItems.nodes);
            this.pageInfo = notificationItems.pageInfo;
            return notificationItems.nodes;
          })
        );
    }
  }