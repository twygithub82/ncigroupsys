import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client/core';
import { BaseDataSource } from './base-ds';
import { CurrencyItem } from './currency';
import { ContactPersonItem } from './contact-person';
import { JobOrderItem } from './job-order';

export class TimeTableGO {
  public guid?: string;
  public job_order_guid?: string;
  public start_time?: number;
  public stop_time?: number;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<TimeTableGO> = {}) {
    this.guid = item.guid;
    this.job_order_guid = item.job_order_guid;
    this.start_time = item.start_time;
    this.stop_time = item.stop_time;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export const START_JOB_TIMER = gql`
  mutation startJobTimer($timeTable: [time_tableInput!]!) {
    startJobTimer(timeTable: $timeTable)
  }
`

export const STOP_JOB_TIMER = gql`
  mutation stopJobTimer($timeTable: [time_tableInput!]!) {
    stopJobTimer(timeTable: $timeTable)
  }
`

export class TimeTableItem extends TimeTableGO {
  public job_order?: JobOrderItem;
  constructor(item: Partial<TimeTableItem> = {}) {
    super(item);
    this.job_order = item.job_order;
  }
}

export interface TimeTableResult {
  items: TimeTableItem[];
  totalCount: number;
}

export class TimeTableDS extends BaseDataSource<TimeTableItem> {
  constructor(private apollo: Apollo) {
    super();
  }

  startJobTimer(timeTable: any): Observable<any> {
    return this.apollo.mutate({
      mutation: START_JOB_TIMER,
      variables: {
        timeTable
      }
    });
  }

  stopJobTimer(timeTable: any): Observable<any> {
    return this.apollo.mutate({
      mutation: STOP_JOB_TIMER,
      variables: {
        timeTable
      }
    });
  }
}
