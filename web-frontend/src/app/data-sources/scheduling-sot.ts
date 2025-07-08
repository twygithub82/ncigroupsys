import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { BaseDataSource } from './base-ds';
import { StoringOrderTankItem } from './storing-order-tank';
import { SchedulingItem } from './scheduling';

export class SchedulingSotGO {
  public guid?: string;
  public sot_guid?: string;
  public scheduling_guid?: string;
  public status_cv?: string;
  public remarks?: string;
  public reference?: string;
  public scheduling_dt?: number;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<SchedulingSotGO> = {}) {
    this.guid = item.guid;
    this.sot_guid = item.sot_guid;
    this.scheduling_guid = item.scheduling_guid;
    this.status_cv = item.status_cv;
    this.remarks = item.remarks;
    this.reference = item.reference;
    this.scheduling_dt = item.scheduling_dt;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class SchedulingSotItem extends SchedulingSotGO {
  public scheduling?: SchedulingItem;
  public storing_order_tank?: StoringOrderTankItem;
  public actions?: string[]
  constructor(item: Partial<SchedulingSotItem> = {}) {
    super(item)
    this.scheduling = item.scheduling;
    this.storing_order_tank = item.storing_order_tank;
    this.actions = item.actions;
  }
}

export class SchedulingSotUpdateItem extends SchedulingSotItem {
  public action?: string

  constructor(item: Partial<SchedulingSotUpdateItem> = {}) {
    super(item)
    this.action = item.action || undefined;
  }
}

export const GET_SCHEDULING_SOT = gql`
  query QueryScheduling($where: scheduling_sotFilterInput, $order: [scheduling_sotSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: querySchedulingSOT(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      nodes {
        create_by
        create_dt
        delete_dt
        guid
        scheduling_guid
        sot_guid
        status_cv
        reference
        scheduling_dt
        update_by
        update_dt
        scheduling {
          book_type_cv
          create_by
          create_dt
          delete_dt
          guid
          status_cv
          update_by
          update_dt
        }
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
          tank_no
          tank_status_cv
          unit_type_guid
          update_by
          update_dt
          in_gate {
            eir_no
            eir_dt
            yard_cv
          }
          tariff_cleaning {
            cargo
          }
          storing_order {
            customer_company {
              code
              name
            }
          }
        }
      }
    }
  }
`;

export const GET_SCHEDULING_SOT_FOR_MOVEMENT = gql`
  query QueryScheduling($where: scheduling_sotFilterInput, $order: [scheduling_sotSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: querySchedulingSOT(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      nodes {
        create_by
        create_dt
        delete_dt
        guid
        scheduling_guid
        sot_guid
        status_cv
        reference
        scheduling_dt
        update_by
        update_dt
        scheduling {
          book_type_cv
          create_by
          create_dt
          delete_dt
          guid
          status_cv
          update_by
          update_dt
        }
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
          tank_no
          tank_status_cv
          unit_type_guid
          update_by
          update_dt
        }
      }
    }
  }
`;

export const DELETE_SCHEDULING_SOT = gql`
  mutation DeleteSchedulingSOT($schedulingSOTGuids: [String!]!) {
    deleteSchedulingSOT(schedulingSOTGuids: $schedulingSOTGuids)
  }
`;

export class SchedulingSotDS extends BaseDataSource<SchedulingSotItem> {
  constructor(private apollo: Apollo) {
    super();
  }
  searchSchedulingSot(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<SchedulingItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_SCHEDULING_SOT,
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

  getSchedulingSotForMovement(sot_guid: any, order?: any): Observable<SchedulingItem[]> {
    this.loadingSubject.next(true);
    const where = {
      sot_guid: { eq: sot_guid },
      delete_dt: { eq: null }
    }

    return this.apollo
      .query<any>({
        query: GET_SCHEDULING_SOT_FOR_MOVEMENT,
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

  deleteScheduleSOT(schedulingSOTGuids: string[]): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_SCHEDULING_SOT,
      variables: {
        schedulingSOTGuids
      }
    });
  }

  getSchedulingSotReleaseOrder(schedulingSot: SchedulingSotItem[] | undefined): SchedulingSotItem | undefined {
    return this.getSchedulingSotWithType(schedulingSot, "RELEASE_ORDER");
  }

  // getSchedulingSotReleaseJobNo(schedulingSot: SchedulingSotItem[] | undefined): string | undefined {
  //   const releaseScheduling = this.getSchedulingSotWithType(schedulingSot, "RELEASE_ORDER");
  //   return releaseScheduling?.scheduling?.reference;
  // }

  getSchedulingSotWithType(schedulingSot: SchedulingSotItem[] | undefined, type: string): SchedulingSotItem | undefined {
    return schedulingSot?.find(item => item.scheduling?.book_type_cv === type);
  }

  canCancel(schedulingSot: SchedulingSotItem): boolean {
    return true;
    return schedulingSot && schedulingSot.status_cv === 'NEW';
  }

  checkScheduling(schedulingSot: SchedulingSotItem[] | undefined): boolean {
    if (!schedulingSot || !schedulingSot.length) return false;
    if (schedulingSot.some(schedulingSot => schedulingSot.status_cv === "NEW" || schedulingSot.status_cv === "MATCH"))
      return true;
    return false;
  }
}
