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

export class TimeTableItem extends TimeTableGO {
  constructor(item: Partial<TimeTableItem> = {}) {
    super(item);
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
}
