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
import { TeamItem } from './teams';

export class JobOrderGO {
  public guid?: string;
  public sot_guid?: string;
  public team_guid?: string;
  public job_order_no?: string;
  public working_hour?: number;
  public total_hour?: number;
  public job_type_cv?: string;
  public status_cv?: string;
  public remarks?: string;
  public start_dt?: number;
  public complete_dt?: number;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<JobOrderGO> = {}) {
    this.guid = item.guid;
    this.sot_guid = item.sot_guid;
    this.team_guid = item.team_guid;
    this.job_order_no = item.job_order_no;
    this.working_hour = item.working_hour;
    this.total_hour = item.total_hour;
    this.job_type_cv = item.job_type_cv;
    this.status_cv = item.status_cv;
    this.remarks = item.remarks;
    this.start_dt = item.start_dt;
    this.complete_dt = item.complete_dt;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class JobOrderItem extends JobOrderGO {
  public team?: TeamItem;
  constructor(item: Partial<JobOrderItem> = {}) {
    super(item);
    this.team = item.team;
  }
}

export interface JobOrderResult {
  items: JobOrderItem[];
  totalCount: number;
}

export const GET_TEAM_QUERY = gql`
  query queryTeams($where: teamFilterInput, $order: [teamSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryTeams(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        create_by
        create_dt
        delete_dt
        department_cv
        description
        guid
        update_by
        update_dt
      }
    }
  }
`;

export const GET_TEAM_BY_DEPARTMENT_QUERY = gql`
  query queryTeams($where: teamFilterInput, $order: [teamSortInput!]) {
    resultList: queryTeams(where: $where, order: $order) {
      nodes {
        create_by
        create_dt
        delete_dt
        department_cv
        description
        guid
        update_by
        update_dt
      }
    }
  }
`;

export class JobOrderDS extends BaseDataSource<JobOrderItem> {
  constructor(private apollo: Apollo) {
    super();
  }
  loadItems(where?: any, order?: any, first?: any, after?: any, last?: any, before?: any): Observable<JobOrderItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .watchQuery<any>({
        query: GET_TEAM_QUERY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .valueChanges
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as JobOrderItem[]); // Return an empty array on error
        }),
        finalize(() =>
          this.loadingSubject.next(false)
        ),
        map((result) => {
          const resultList = result.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList.nodes);
          this.totalCount = resultList.totalCount;
          this.pageInfo = resultList.pageInfo;
          return resultList.nodes;
        })
      );
  }

  getTeamListByDepartment(department_cv?: string[]): Observable<JobOrderItem[]> {
    this.loadingSubject.next(true);
    const where = {
      department_cv: { in: department_cv }
    }
    const order = { description: "ASC" }
    return this.apollo
      .watchQuery<any>({
        query: GET_TEAM_BY_DEPARTMENT_QUERY,
        variables: { where, order },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .valueChanges
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as JobOrderItem[]); // Return an empty array on error
        }),
        finalize(() =>
          this.loadingSubject.next(false)
        ),
        map((result) => {
          const resultList = result.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList.nodes);
          this.totalCount = resultList.totalCount;
          this.pageInfo = resultList.pageInfo;
          return resultList.nodes;
        })
      );
  }
}