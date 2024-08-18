import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StoringOrderItem } from './storing-order';
import { TARIFF_CLEANING_FRAGMENT, TariffCleaningItem } from './tariff-cleaning';
import { BaseDataSource } from './base-ds';
import { InGateItem } from './in-gate';
import { StoringOrderTankItem } from './storing-order-tank';
import { ReleaseOrderItem } from './release-order';
import { SchedulingSotItem } from './scheduling-sot';

export class SchedulingGO {
  public guid?: string;
  public reference?: string;
  public book_type_cv?: string;
  public scheduling_dt?: number;
  public status_cv?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<SchedulingGO> = {}) {
    this.guid = item.guid;
    this.reference = item.reference;
    this.book_type_cv = item.book_type_cv;
    this.scheduling_dt = item.scheduling_dt;
    this.status_cv = item.status_cv;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class SchedulingItem extends SchedulingGO {
  public scheduling_sot?: SchedulingSotItem[]

  constructor(item: Partial<SchedulingItem> = {}) {
    super(item)
    this.scheduling_sot = item.scheduling_sot || undefined;
  }
}

export class SchedulingUpdateItem extends SchedulingItem {
  public action?: string

  constructor(item: Partial<SchedulingUpdateItem> = {}) {
    super(item)
    this.action = item.action || undefined;
  }
}

export const GET_SCHEDULING = gql`
  query QueryScheduling($where: schedulingFilterInput, $order: [schedulingSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryScheduling(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      totalCount
      nodes {
        book_type_cv
        create_by
        create_dt
        delete_dt
        guid
        reference
        scheduling_dt
        status_cv
        update_by
        update_dt
        scheduling_sot {
          guid
          scheduling_guid
          sot_guid
          status_cv
          storing_order_tank {
            certificate_cv
            clean_status_cv
            create_by
            create_dt
            delete_dt
            estimate_cv
            eta_dt
            etr_dt
            guid
            job_no
            last_cargo_guid
            last_test_guid
            liftoff_job_no
            lifton_job_no
            preinspect_job_no
            purpose_cleaning
            purpose_repair_cv
            purpose_steam
            purpose_storage
            release_job_no
            remarks
            required_temp
            so_guid
            status_cv
            takein_job_no
            tank_no
            tank_status_cv
            unit_type_guid
            update_by
            update_dt
            storing_order {
              customer_company {
                code
                name
              }
            }
            in_gate {
              eir_no
              eir_dt
              yard_cv
            }
            tariff_cleaning {
              cargo
            }
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export const ADD_SCHEDULING = gql`
  mutation AddScheduling($scheduling: SchedulingRequestInput!, $scheduling_sots: [SchedulingSOTRequestInput!]!) {
    addScheduling(scheduling: $scheduling, scheduling_sots: $scheduling_sots)
  }
`;

export const UPDATE_SCHEDULING = gql`
  mutation UpdateScheduling($scheduling: SchedulingRequestInput!, $scheduling_sots: [SchedulingSOTRequestInput!]!) {
    updateScheduling(scheduling: $scheduling, scheduling_sots: $scheduling_sots)
  }
`;

export class SchedulingDS extends BaseDataSource<SchedulingItem> {
  constructor(private apollo: Apollo) {
    super();
  }
  searchScheduling(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<SchedulingItem[]> {
    this.loadingSubject.next(true);
    
    return this.apollo
      .query<any>({
        query: GET_SCHEDULING,
        variables: { where, order, first, after, last, before },
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

  addScheduling(scheduling: any, scheduling_sots: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_SCHEDULING,
      variables: {
        scheduling,
        scheduling_sots
      }
    });
  }

  updateScheduling(scheduling: any, scheduling_sots: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_SCHEDULING,
      variables: {
        scheduling,
        scheduling_sots
      }
    });
  }

  canCancel(schedule: SchedulingItem | undefined): boolean {
    if (!schedule) return false;
    return schedule && schedule.status_cv === 'PENDING';
  }

  canCancels(schedule: SchedulingItem[] | undefined): boolean {
    if (!schedule) return false;
    return schedule.some(item => item.status_cv === 'PENDING');
  }
}
