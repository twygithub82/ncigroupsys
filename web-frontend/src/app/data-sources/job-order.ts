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
import { RepairPartItem } from './repair-part';
import { InGateCleaningItem } from './in-gate-cleaning';
import { ResiduePartItem } from './residue-part';
import { TimeTableItem } from './time-table';

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

export class JobOrderRequest {
  public guid?: string;
  public job_type_cv?: string;
  public part_guid?: (string | undefined)[];
  public remarks?: string;
  public sot_guid?: string;
  public status_cv?: string;
  public team_guid?: string;
  //public process_guid?:string;
  public total_hour?: number;
  public working_hour?: number;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<JobOrderRequest> = {}) {
    this.guid = item.guid;
    this.job_type_cv = item.job_type_cv;
    this.part_guid = item.part_guid;
    this.remarks = item.remarks;
    //this.process_guid=item.process_guid;
    this.sot_guid = item.sot_guid;
    this.status_cv = item.status_cv;
    this.team_guid = item.team_guid;
    this.total_hour = item.total_hour;
    this.working_hour = item.working_hour;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class JobProcessRequest {
  public guid?: string;
  public job_type_cv?: string;
  public process_status?: string;

  constructor(item: Partial<JobProcessRequest> = {}) {
    this.guid = item.guid;
    this.job_type_cv = item.job_type_cv;
    this.process_status = item.process_status;
  }
}

export class JobOrderItem extends JobOrderGO {
  public team?: TeamItem;
  public repair_part?: RepairPartItem[];
  public cleaning?: InGateCleaningItem[];
  public residue_part?: ResiduePartItem[];

  public time_table?: TimeTableItem[];
  constructor(item: Partial<JobOrderItem> = {}) {
    super(item);
    this.team = item.team;
    this.repair_part = item.repair_part;
    this.cleaning = item.cleaning;
    this.residue_part = item.residue_part;
    this.time_table = item.time_table;
  }
}

export class JobItemRequest {
  public guid?: string;
  public job_order_guid?: string;
  public job_type_cv?: string;
  constructor(item: Partial<JobItemRequest> = {}) {
    this.guid = item.guid;
    this.job_order_guid = item.job_order_guid;
    this.job_type_cv = item.job_type_cv;
  }
}

export class UpdateJobOrderRequest {
  public guid?: string;
  public remarks?: string;
  public start_dt?: number;
  public complete_dt?: number;
  constructor(item: Partial<UpdateJobOrderRequest> = {}) {
    this.guid = item.guid;
    this.remarks = item.remarks;
    this.start_dt = item.start_dt;
    this.complete_dt = item.complete_dt;
  }
}

export interface JobOrderResult {
  items: JobOrderItem[];
  totalCount: number;
}

export const GET_JOB_ORDER = gql`
  query queryJobOrder($where: job_orderFilterInput, $order: [job_orderSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryJobOrder(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        complete_dt
        create_by
        create_dt
        delete_dt
        guid
        job_order_no
        job_type_cv
        remarks
        sot_guid
        start_dt
        status_cv
        team_guid
        total_hour
        update_by
        update_dt
        working_hour
        team {
          description
          guid
        }
        storing_order_tank {
          tank_no
          storing_order {
            customer_company {
              name
              code
            }
          }
        }
        repair_part {
          repair {
            guid
            estimate_no
          }
        }
        cleaning {
          allocate_by
          allocate_dt
          approve_by
          approve_dt
          bill_to_guid
          buffer_cost
          cleaning_cost
          complete_by
          complete_dt
          create_by
          create_dt
          delete_dt
          guid
          job_no
          job_order_guid
          na_dt
          remarks
          sot_guid
          status_cv
          update_by
          update_dt
        }
        time_table(
          where: { start_time: { neq: null }, stop_time: { eq: null } }
        ) {
          create_by
          create_dt
          delete_dt
          guid
          job_order_guid
          start_time
          stop_time
          update_by
          update_dt
        }
      }
    }
  }
`;

export const GET_JOB_ORDER_FOR_REPAIR = gql`
  query queryJobOrder($where: job_orderFilterInput, $order: [job_orderSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryJobOrder(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        complete_dt
        create_by
        create_dt
        delete_dt
        guid
        job_order_no
        job_type_cv
        remarks
        sot_guid
        start_dt
        status_cv
        team_guid
        total_hour
        update_by
        update_dt
        working_hour
        team {
          description
          guid
        }
        storing_order_tank {
          tank_no
          storing_order {
            customer_company {
              name
              code
            }
          }
        }
        repair_part {
          repair {
            guid
            estimate_no
          }
        }
        time_table(
          where: { start_time: { neq: null }, stop_time: { eq: null } }
        ) {
          create_by
          create_dt
          delete_dt
          guid
          job_order_guid
          start_time
          stop_time
          update_by
          update_dt
        }
      }
    }
  }
`;

export const GET_JOB_ORDER_BY_ID = gql`
  query queryJobOrder($where: job_orderFilterInput, $order: [job_orderSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryJobOrder(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        complete_dt
        create_by
        create_dt
        delete_dt
        guid
        job_order_no
        job_type_cv
        remarks
        sot_guid
        start_dt
        status_cv
        team_guid
        total_hour
        update_by
        update_dt
        working_hour
        team {
          description
          guid
        }
        repair_part {
          repair {
            estimate_no
          }
          approve_cost
          approve_hour
          approve_part
          approve_qty
          comment
          complete_dt
          description
          hour
          location_cv
          material_cost
          quantity
          remarks
          owner
          delete_dt
          rp_damage_repair {
            action
            code_cv
            code_type
            create_by
            create_dt
            delete_dt
            guid
            rp_guid
            update_by
            update_dt
          }
          update_by
          update_dt
          tariff_repair {
            group_name_cv
            alias
            subgroup_name_cv
          }
        }
        time_table {
          create_by
          create_dt
          delete_dt
          guid
          job_order_guid
          start_time
          stop_time
          update_by
          update_dt
        }
      }
    }
  }
`;

export const ASSIGN_JOB_ORDER = gql`
  mutation assignJobOrder($jobOrderRequest: [JobOrderRequestInput!]!) {
    assignJobOrder(jobOrderRequest: $jobOrderRequest)
  }
`

export const UPDATE_JOB_PROCESS_STATUS = gql`
  mutation updateJobProcessStatus($jobProcessRequest: JobProcessRequestInput!) {
    updateJobProcessStatus(jobProcessRequest: $jobProcessRequest)
  }
`

export const COMPLETE_JOB_ITEM = gql`
  mutation completeJobItem($jobItemRequest: [JobItemRequestInput!]!) {
    completeJobItem(jobItemRequest: $jobItemRequest)
  }
`

export const COMPLETE_JOB_ORDER = gql`
  mutation completeJobOrder($jobOrderRequest: [UpdateJobOrderRequestInput!]!) {
    completeJobOrder(jobOrderRequest: $jobOrderRequest)
  }
`

export class JobOrderDS extends BaseDataSource<JobOrderItem> {
  constructor(private apollo: Apollo) {
    super();
  }
  searchJobOrder(where?: any, order?: any, first?: any, after?: any, last?: any, before?: any): Observable<JobOrderItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .watchQuery<any>({
        query: GET_JOB_ORDER,
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

  searchJobOrderForRepair(where?: any, order?: any, first?: any, after?: any, last?: any, before?: any): Observable<JobOrderItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .watchQuery<any>({
        query: GET_JOB_ORDER_FOR_REPAIR,
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

  getJobOrderByID(id: string): Observable<JobOrderItem[]> {
    this.loadingSubject.next(true);
    const where: any = { guid: { eq: id } }
    return this.apollo
      .query<any>({
        query: GET_JOB_ORDER_BY_ID,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const resultList = result.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList.nodes);
          this.totalCount = resultList.totalCount;
          this.pageInfo = resultList.pageInfo;
          return resultList.nodes;
        })
      );
  }

  assignJobOrder(jobOrderRequest: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ASSIGN_JOB_ORDER,
      variables: {
        jobOrderRequest
      }
    });
  }

  updateJobProcessStatus(jobProcessRequest: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_JOB_PROCESS_STATUS,
      variables: {
        jobProcessRequest
      }
    });
  }

  completeJobItem(jobItemRequest: JobItemRequest[]): Observable<any> {
    return this.apollo.mutate({
      mutation: COMPLETE_JOB_ITEM,
      variables: {
        jobItemRequest
      }
    });
  }

  completeJobOrder(jobOrderRequest: UpdateJobOrderRequest[]): Observable<any> {
    return this.apollo.mutate({
      mutation: COMPLETE_JOB_ORDER,
      variables: {
        jobOrderRequest
      }
    });
  }
}
