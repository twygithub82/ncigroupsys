import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, delay, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { CustomerCompanyItem } from './customer-company';
import { StoringOrderTankItem } from './storing-order-tank';
import { PageInfo } from '@core/models/pageInfo';
import { BaseDataSource } from './base-ds';
import { SchedulingItem, SchedulingUpdateItem } from './scheduling';
import { ReleaseOrderSotItem } from './release-order-sot';

export class ReleaseOrderGO {
  public guid?: string;
  public customer_company_guid?: string;
  public haulier?: string;
  public release_dt?: number | null;
  public remarks?: string;
  public ro_generated?: boolean;
  public ro_no?: string;
  public ro_notes?: string;
  public status_cv?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<ReleaseOrderGO> = {}) {
    this.guid = item.guid;
    this.customer_company_guid = item.customer_company_guid;
    this.haulier = item.haulier || '';
    this.release_dt = item.release_dt;
    this.remarks = item.remarks || '';
    this.ro_generated = item.ro_generated;
    this.ro_no = item.ro_no || '';
    this.ro_notes = item.ro_notes || '';
    this.status_cv = item.status_cv || '';
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class ReleaseOrderItem extends ReleaseOrderGO {
  public customer_company?: CustomerCompanyItem;
  public release_order_sot?: ReleaseOrderSotItem[];

  constructor(item: Partial<ReleaseOrderItem> = {}) {
    super(item);
    this.release_order_sot = item.release_order_sot;
  }
}

export const GET_RELEASE_ORDERS = gql`
  query QueryReleaseOrder($where: release_orderFilterInput, $order: [release_orderSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    roList: queryReleaseOrder(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        create_by
        create_dt
        customer_company_guid
        delete_dt
        guid
        haulier
        release_dt
        remarks
        ro_generated
        ro_no
        ro_notes
        status_cv
        update_by
        update_dt
        customer_company {
          code
          name
          guid
        }
        release_order_sot {
          create_by
          create_dt
          delete_dt
          guid
          ro_guid
          sot_guid
          status_cv
          update_by
          update_dt
          storing_order_tank {
            certificate_cv
            clean_status_cv
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
            booking {
              book_type_cv
              booking_dt
              guid
              reference
              sot_guid
              status_cv
              test_class_cv
            }
            scheduling_sot {
              guid
              scheduling_guid
              sot_guid
              status_cv
              reference
              scheduling_dt
              scheduling {
                book_type_cv
                guid
                status_cv
              }
            }
            in_gate {
              eir_dt
              eir_no
              yard_cv
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
      totalCount
    }
  }
`;

export const GET_RELEASE_ORDER_BY_ID = gql`
  query QueryReleaseOrder($where: release_orderFilterInput) {
    roList: queryReleaseOrder(where: $where) {
      nodes {
        create_by
        create_dt
        customer_company_guid
        delete_dt
        guid
        haulier
        release_dt
        remarks
        ro_generated
        ro_no
        ro_notes
        status_cv
        update_by
        update_dt
        customer_company {
          code
          name
          guid
        }
        release_order_sot(where: { delete_dt: { eq: null } }) {
          create_by
          create_dt
          delete_dt
          guid
          remarks
          ro_guid
          sot_guid
          status_cv
          update_by
          update_dt
          storing_order_tank {
            certificate_cv
            clean_status_cv
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
            booking {
              book_type_cv
              booking_dt
              guid
              reference
              sot_guid
              status_cv
              test_class_cv
            }
            scheduling_sot {
              guid
              scheduling_guid
              sot_guid
              status_cv
              reference
              scheduling_dt
              scheduling {
                book_type_cv
                guid
                status_cv
              }
            }
            in_gate {
              eir_dt
              eir_no
              yard_cv
              delete_dt
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
      totalCount
    }
  }
`;

export const ADD_RELEASE_ORDER = gql`
  mutation AddReleaseOrder($ro: ReleaseOrderRequestInput!, $ro_SotList: [ReleaseOrderSOTRequestInput!]!) {
    addReleaseOrder(releaseOrder: $ro, ro_SotList: $ro_SotList)
  }
`;

export const UPDATE_RELEASE_ORDER = gql`
  mutation UpdateReleaseOrder($ro: ReleaseOrderRequestInput!, $ro_SotList: [ReleaseOrderSOTRequestInput!]!) {
    updateReleaseOrder(releaseOrder: $ro, ro_SotList: $ro_SotList)
  }
`;

export const CANCEL_RELEASE_ORDER = gql`
  mutation cancelReleaseOrder($ro: [ReleaseOrderRequestInput!]!) {
    cancelReleaseOrder(releaseOrderList: $ro)
  }
`;

export class ReleaseOrderDS extends BaseDataSource<ReleaseOrderItem> {
  constructor(private apollo: Apollo) {
    super();
  }

  searchReleaseOrder(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<ReleaseOrderItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_RELEASE_ORDERS,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ roList: { nodes: [], totalCount: 0 } })),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const roList = result.roList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(roList.nodes);
          this.totalCount = roList.totalCount;
          this.pageInfo = roList.pageInfo;
          return roList.nodes;
        })
      );
  }

  getReleaseOrderByID(id: string): Observable<ReleaseOrderItem[]> {
    this.loadingSubject.next(true);
    let where = this.addDeleteDtCriteria({ guid: { eq: id } });
    return this.apollo
      .query<any>({
        query: GET_RELEASE_ORDER_BY_ID,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ roList: [] })),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const roList = result.roList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(roList.nodes);
          this.totalCount = roList.totalCount;
          return roList.nodes;
        })
      );
  }

  addReleaseOrder(ro: any, ro_SotList: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: ADD_RELEASE_ORDER,
      variables: {
        ro,
        ro_SotList
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  updateReleaseOrder(ro: any, ro_SotList: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: UPDATE_RELEASE_ORDER,
      variables: {
        ro,
        ro_SotList
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  cancelReleaseOrder(ro: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: CANCEL_RELEASE_ORDER,
      variables: {
        ro
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  canCancel(ro: any): boolean {
    return ro && ro.status_cv === 'PENDING';
  }

  canAddTank(ro: any): boolean {
    return !ro || !ro.status_cv || ro.status_cv === 'PENDING' || ro.status_cv === 'PROCESSING';
  }
}
