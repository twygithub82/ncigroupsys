import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
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
import { StoringOrderTankItem } from './storing-order-tank';
import { Utility } from 'app/utilities/utility';
import { SteamPartItem } from './steam-part';
import { SteamTemp } from './steam';

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
  public qc_dt?: number;
  public qc_by?: string;
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
    this.qc_dt = item.qc_dt;
    this.qc_by = item.qc_by;
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
  public total_hour?: number;
  public working_hour?: number;
  public process_guid?: string;
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
    this.sot_guid = item.sot_guid;
    this.status_cv = item.status_cv;
    this.team_guid = item.team_guid;
    this.total_hour = item.total_hour;
    this.working_hour = item.working_hour;
    this.process_guid = item.process_guid;
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
  public storing_order_tank?: StoringOrderTankItem;
  public repair_part?: RepairPartItem[];
  public cleaning?: InGateCleaningItem[];
  public residue_part?: ResiduePartItem[];
  public steaming_part?: SteamPartItem[];
  public steaming_temp?: SteamTemp[];

  public time_table?: TimeTableItem[];
  constructor(item: Partial<JobOrderItem> = {}) {
    super(item);
    this.team = item.team;
    this.repair_part = item.repair_part;
    this.cleaning = item.cleaning;
    this.residue_part = item.residue_part;
    this.time_table = item.time_table;
    this.storing_order_tank = item.storing_order_tank;
    this.steaming_part = item.steaming_part;
    this.steaming_temp = item.steaming_temp;
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

export class ClnJobOrderRequest {
  public guid?: string;
  public job_order?: JobOrderGO[];
  public remarks?: string;
  public sot_guid?: string;
  public sot_status?:string;

  constructor(item: Partial<ClnJobOrderRequest> = {}) {
    this.guid = item.guid;
    this.job_order = item.job_order;
    this.remarks = item.remarks;
    this.sot_guid = item.sot_guid;
    this.sot_status = item.sot_status;
  }
}

export class RepJobOrderRequest {
  public estimate_no?: string;
  public guid?: string;
  public job_order?: JobOrderGO[];
  public remarks?: string;
  public sot_guid?: string;
  public sot_status?: string;
  constructor(item: Partial<RepJobOrderRequest> = {}) {
    this.estimate_no = item.estimate_no;
    this.guid = item.guid;
    this.job_order = item.job_order;
    this.remarks = item.remarks;
    this.sot_guid = item.sot_guid;
    this.sot_status = item.sot_status;
  }
}

export class ResJobOrderRequest {
  public estimate_no?: string;
  public guid?: string;
  public job_order?: JobOrderGO[];
  public remarks?: string;
  public sot_guid?: string;
  public sot_status?: string;
  constructor(item: Partial<ResJobOrderRequest> = {}) {
    this.estimate_no = item.estimate_no;
    this.guid = item.guid;
    this.job_order = item.job_order;
    this.remarks = item.remarks;
    this.sot_guid = item.sot_guid;
    this.sot_status=item.sot_status;
  }
}

export class SteamJobOrderRequest {
  // public estimate_no?: string;
  public guid?: string;
  public job_order?: JobOrderGO[];
  public remarks?: string;
  public sot_guid?: string;
  public sot_status?:string;
  constructor(item: Partial<SteamJobOrderRequest> = {}) {
    // this.estimate_no = item.estimate_no;
    this.guid = item.guid;
    this.job_order = item.job_order;
    this.remarks = item.remarks;
    this.sot_guid = item.sot_guid;
    this.sot_status=item.sot_status;
  }
}

export interface JobOrderResult {
  items: JobOrderItem[];
  totalCount: number;
}

const GET_JOB_ORDER = gql`
  query queryJobOrder($where: job_orderFilterInput, $order: [job_orderSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryJobOrder(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        complete_dt
        create_by
        create_dt
        delete_dt
        guid
        qc_by
        qc_dt
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
          guid
          tank_no
          storing_order {
            customer_company {
              name
              code
            }
          }
          tariff_cleaning {
            cargo
            nature_cv
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

const GET_JOB_ORDER_FOR_REPAIR = gql`
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
          guid
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
            status_cv
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

const GET_STARTED_JOB_ORDER = gql`
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
        cleaning {
          guid
          job_no
        }
        team {
          description
          guid
        }
        storing_order_tank {
          tank_no
          guid
          tank_status_cv
          storing_order {
            customer_company {
              name
              code
            }
          }
          tariff_cleaning{
            cargo
            cleaning_category {
              guid
              name
            }
            cleaning_method {
              guid
              description
            }
          }  
        }
        steaming_part {
          steaming {
            guid
            estimate_no
            approve_by
            status_cv
          }
          tariff_steaming_guid
          steaming_guid
        }
        residue_part {
          residue {
            guid
            estimate_no
            status_cv
          }
          residue_guid
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
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;

const GET_JOB_ORDER_BY_ID = gql`
  query queryJobOrder($where: job_orderFilterInput, $order: [job_orderSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryJobOrder(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        complete_dt
        create_by
        create_dt
        delete_dt
        guid
        sot_guid
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
        steaming_part {
          steaming {
            guid
            estimate_no
            approve_by
            status_cv
          }
          tariff_steaming_guid
          steaming_guid
        }
        residue_part {
          residue {
            guid
            estimate_no
            status_cv
          }
          residue_guid
        }
        storing_order_tank {
          guid
        }
        repair_part {
          guid
          repair {
            guid
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

const GET_JOB_ORDER_BY_ID_FOR_REPAIR = gql`
  query queryJobOrder($where: job_orderFilterInput, $order: [job_orderSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryJobOrder(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        complete_dt
        create_by
        create_dt
        delete_dt
        guid
        sot_guid
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
          guid
        }
        repair_part {
          guid
          repair {
            guid
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
        time_table(where: { delete_dt: { eq: null } }) {
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

const ON_JOB_STARTSTOP_SUBSCRIPTION = gql`
  subscription onJobStartStop($team_guid: String!) {
    onJobStartStop(team_guid: $team_guid) {
      complete_dt
      item_guid
      job_order_guid
      job_status
      job_type
      start_time
      stop_time
      time_table_guid
    }
  }
`;

const ON_JOB_STARTED_SUBSCRIPTION = gql`
  subscription onJobStarted($job_order_guid: String!) {
    onJobStarted(job_order_guid: $job_order_guid) {
      job_order_guid
      job_status
      start_time
      stop_time
      time_table_guid
    }
  }
`;

const ON_JOB_STOPPED_SUBSCRIPTION = gql`
  subscription onJobStarted($job_order_guid: String!) {
    onJobStopped(job_order_guid: $job_order_guid) {
      job_order_guid
      job_status
      start_time
      stop_time
      time_table_guid
    }
  }
`;

const ON_JOB_COMPLETED_SUBSCRIPTION = gql`
  subscription onJobCompleted($job_order_guid: String!) {
    onJobCompleted(job_order_guid: $job_order_guid) {
      complete_dt
      item_guid
      job_order_guid
      job_status
      job_type
      start_time
      stop_time
      time_table_guid
    }
  }
`;

const ON_JOB_ITEM_COMPLETED_SUBSCRIPTION = gql`
  subscription onJobCompleted($item_guid: String!, $job_type: String!) {
    onJobItemCompleted(item_guid: $item_guid, job_type: $job_type) {
      complete_dt
      item_guid
      job_order_guid
      job_status
      job_type
      start_time
      stop_time
      time_table_guid
    }
  }
`;

const ASSIGN_JOB_ORDER = gql`
  mutation assignJobOrder($jobOrderRequest: [JobOrderRequestInput!]!) {
    assignJobOrder(jobOrderRequest: $jobOrderRequest)
  }
`

const UPDATE_JOB_PROCESS_STATUS = gql`
  mutation updateJobProcessStatus($jobProcessRequest: JobProcessRequestInput!) {
    updateJobProcessStatus(jobProcessRequest: $jobProcessRequest)
  }
`

const COMPLETE_JOB_ITEM = gql`
  mutation completeJobItem($jobItemRequest: [JobItemRequestInput!]!) {
    completeJobItem(jobItemRequest: $jobItemRequest)
  }
`

const COMPLETE_JOB_ORDER = gql`
  mutation completeJobOrder($jobOrderRequest: [UpdateJobOrderRequestInput!]!) {
    completeJobOrder(jobOrderRequest: $jobOrderRequest)
  }
`

const QC_COMPLETE_REPAIR_JOB_ORDER = gql`
  mutation completeQCRepair($repJobOrder: [RepJobOrderRequestInput!]!) {
    completeQCRepair(repJobOrder: $repJobOrder)
  }
`

const QC_COMPLETE_RESIDUE_JOB_ORDER = gql`
  mutation completeQCResidue($resJobOrder: [ResJobOrderRequestInput!]!) {
    completeQCResidue(residueJobOrder: $resJobOrder)
  }
`

const QC_COMPLETE_CLEANING_JOB_ORDER = gql`
  mutation completeQCCleaning($clnJobOrder: CleaningJobOrderInput!) {
    completeQCCleaning(cleaningJobOrder: $clnJobOrder)
  }
`

const QC_COMPLETE_STEAMING_JOB_ORDER = gql`
  mutation completeQCSteaming($steamingJobOrder: [SteamJobOrderRequestInput!]!) {
    completeQCSteaming(steamingJobOrder: $steamingJobOrder)
  }
`

const DELETE_JOB_ORDER = gql`
  mutation deleteJobOrder($jobOrderGuid: [String!]!) {
    deleteJobOrder(jobOrderGuid: $jobOrderGuid)
  }
`

const ROLLBACK_REPAIR_JOB_IN_PROGRESS_JOB_ORDER = gql`
  mutation rollbackJobInProgressRepair($repJobOrder: [RepJobOrderRequestInput!]!) {
    rollbackJobInProgressRepair(repJobOrder: $repJobOrder)
  }
`

const ROLLBACK_CLEANING_JOB_IN_PROGRESS_JOB_ORDER = gql`
  mutation rollbackJobInProgressCleaning($clnJobOrder: CleaningJobOrderInput!) {
    rollbackJobInProgressCleaning(cleaningJobOrder: $clnJobOrder)
  }
`

const ROLLBACK_RESIDUE_JOB_IN_PROGRESS_JOB_ORDER = gql`
  mutation rollbackJobInProgressResidue($residueJobOrder: [ResJobOrderRequestInput!]!) {
    rollbackJobInProgressResidue(residueJobOrder: $residueJobOrder)
  }
`

const ROLLBACK_STEAMING_JOB_IN_PROGRESS_JOB_ORDER = gql`
  mutation rollbackJobInProgressSteaming($steamingJobOrder: [SteamJobOrderRequestInput!]!) {
    rollbackJobInProgressSteaming(steamingJobOrder: $steamingJobOrder)
  }
`

export class JobOrderDS extends BaseDataSource<JobOrderItem> {
  constructor(private apollo: Apollo) {
    super();
  }
  searchJobOrder(where?: any, order?: any, first?: any, after?: any, last?: any, before?: any): Observable<JobOrderItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_JOB_ORDER,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
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
      .query<any>({
        query: GET_JOB_ORDER_FOR_REPAIR,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as JobOrderItem[]); // Return an empty array on error
        }),
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

  searchStartedJobOrder(where?: any, order?: any, first?: any, after?: any, last?: any, before?: any): Observable<JobOrderItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_STARTED_JOB_ORDER,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
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

  getJobOrderByIDForRepair(id: string): Observable<JobOrderItem[]> {
    this.loadingSubject.next(true);
    const where: any = { guid: { eq: id } }
    return this.apollo
      .query<any>({
        query: GET_JOB_ORDER_BY_ID_FOR_REPAIR,
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

  subscribeToJobStartStop(team_guid: string): Observable<any> {
    return this.apollo.subscribe({
      query: ON_JOB_STARTSTOP_SUBSCRIPTION,
      variables: { team_guid }
    });
  }

  subscribeToJobOrderStarted(job_order_guid: string): Observable<any> {
    return this.apollo.subscribe({
      query: ON_JOB_STARTED_SUBSCRIPTION,
      variables: { job_order_guid }
    });
  }

  subscribeToJobOrderStopped(job_order_guid: string): Observable<any> {
    return this.apollo.subscribe({
      query: ON_JOB_STOPPED_SUBSCRIPTION,
      variables: { job_order_guid }
    });
  }

  subscribeToJobOrderCompleted(job_order_guid: string): Observable<any> {
    return this.apollo.subscribe({
      query: ON_JOB_COMPLETED_SUBSCRIPTION,
      variables: { job_order_guid }
    });
  }

  subscribeToJobItemCompleted(item_guid: string, job_type: string): Observable<any> {
    return this.apollo.subscribe({
      query: ON_JOB_ITEM_COMPLETED_SUBSCRIPTION,
      variables: { item_guid, job_type }
    });
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

  completeQCRepair(repJobOrder: RepJobOrderRequest[]): Observable<any> {
    return this.apollo.mutate({
      mutation: QC_COMPLETE_REPAIR_JOB_ORDER,
      variables: {
        repJobOrder
      }
    });
  }

  completeQCResidue(resJobOrder: ResJobOrderRequest): Observable<any> {
    return this.apollo.mutate({
      mutation: QC_COMPLETE_RESIDUE_JOB_ORDER,
      variables: {
        resJobOrder
      }
    });
  }

  completeQCCleaning(clnJobOrder: ClnJobOrderRequest): Observable<any> {
    return this.apollo.mutate({
      mutation: QC_COMPLETE_CLEANING_JOB_ORDER,
      variables: {
        clnJobOrder
      }
    });
  }

  completeQCSteaming(steamingJobOrder: SteamJobOrderRequest): Observable<any> {
    return this.apollo.mutate({
      mutation: QC_COMPLETE_STEAMING_JOB_ORDER,
      variables: {
        steamingJobOrder
      }
    });
  }

  deleteJobOrder(jobOrderGuid: string[]): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_JOB_ORDER,
      variables: {
        jobOrderGuid
      }
    });
  }

  rollbackJobInProgressRepair(repJobOrder: any[]): Observable<any> {
    return this.apollo.mutate({
      mutation: ROLLBACK_REPAIR_JOB_IN_PROGRESS_JOB_ORDER,
      variables: {
        repJobOrder
      }
    });
  }

  rollbackJobInProgressCleaning(clnJobOrder: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ROLLBACK_CLEANING_JOB_IN_PROGRESS_JOB_ORDER,
      variables: {
        clnJobOrder
      }
    });
  }

  rollbackJobInProgressResidue(residueJobOrder: any[]): Observable<any> {
    return this.apollo.mutate({
      mutation: ROLLBACK_RESIDUE_JOB_IN_PROGRESS_JOB_ORDER,
      variables: {
        residueJobOrder
      }
    });
  }

  rollbackJobInProgressSteaming(steamingJobOrder: any[]): Observable<any> {
    return this.apollo.mutate({
      mutation: ROLLBACK_STEAMING_JOB_IN_PROGRESS_JOB_ORDER,
      variables: {
        steamingJobOrder
      }
    });
  }

  canStartJob(jobOrderItem: JobOrderItem | undefined) {
    return !jobOrderItem || jobOrderItem?.status_cv === 'JOB_IN_PROGRESS' || jobOrderItem?.status_cv === 'PENDING';
  }

  canRollbackJob(jobOrderItem: JobOrderItem | undefined) {
    return !jobOrderItem || jobOrderItem?.status_cv === 'JOB_IN_PROGRESS';
  }

  canCompleteJob(jobOrderItem: JobOrderItem | undefined) {
    return !jobOrderItem || jobOrderItem?.status_cv === 'JOB_IN_PROGRESS' && this.canStartJob(jobOrderItem);
  }

  canJobAllocate(jobOrderItem: JobOrderItem | undefined): boolean {
    return !jobOrderItem?.status_cv || jobOrderItem?.status_cv === 'JOB_IN_PROGRESS' || jobOrderItem?.status_cv === 'PENDING';
  }

  getEstimateJobOrder(rpList: RepairPartItem[] | undefined) {
    const firstValidJobOrder = rpList?.find(
      (rp) => rp.job_order && rp.job_order.create_dt !== null && rp.job_order.create_by !== null
    );
    return firstValidJobOrder?.job_order;
  }

  getQCJobOrder(rpList: RepairPartItem[] | undefined) {
    const firstValidJobOrder = rpList?.find(
      (rp) => rp.job_order && rp.job_order.qc_dt !== null && rp.job_order.qc_by !== null
    );
    return firstValidJobOrder?.job_order;
  }

  getJobOrderDuration(jo: JobOrderItem | undefined): string | undefined {
    if (jo?.start_dt && jo?.complete_dt) {
      const timeTakenMs = jo?.complete_dt - jo?.start_dt;

      if (timeTakenMs === undefined || timeTakenMs < 0) {
        return "Invalid time data";
      }

      const days = Math.floor(timeTakenMs / (3600 * 24));
      const hours = Math.floor((timeTakenMs % (3600 * 24)) / 3600);
      const minutes = Math.floor((timeTakenMs % 3600) / 60);

      return `${days} day${days !== 1 ? 's' : ''} ${hours} hr${hours !== 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
    } else {
      return undefined;
    }
  }
}
