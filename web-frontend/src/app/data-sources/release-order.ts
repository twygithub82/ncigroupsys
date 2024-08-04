import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, delay, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { CustomerCompanyItem } from './customer-company';
import { StoringOrderTankItem } from './storing-order-tank';
import { PageInfo } from '@core/models/pageInfo';
import { BaseDataSource } from './base-ds';
import { SchedulingItem } from './scheduling';

export class ReleaseOrderGO {
  public guid?: string;
  public booking_dt?: number | null;
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
    this.booking_dt = item.booking_dt;
    this.customer_company_guid = item.customer_company_guid;
    this.haulier = item.haulier || '';
    this.release_dt = item.release_dt;
    this.remarks = item.remarks || '';
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
  public scheduling?: SchedulingItem[];

  constructor(item: Partial<ReleaseOrderItem> = {}) {
    super(item);
    this.customer_company = item.customer_company;
    this.scheduling = item.scheduling;
  }
}

export const GET_RELEASE_ORDERS = gql`
  query QueryReleaseOrder($where: release_orderFilterInput, $order: [release_orderSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    roList: queryReleaseOrder(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        booking_dt
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
        }
        scheduling {
          guid
          status_cv
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
        booking_dt
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
        }
        scheduling {
          guid
          status_cv
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

export const GET_STORING_ORDER_BY_ID = gql`
  query queryStoringOrderById($id: String!) {
    soList: queryStoringOrderById(id: $id) {
      guid
      haulier
      so_no
      so_notes
      customer_company {
        code
        name
        guid
      }
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
        purpose_cleaning
        purpose_repair_cv
        purpose_steam
        purpose_storage
        remarks
        required_temp
        so_guid
        status_cv
        tank_no
        tank_status_cv
        unit_type_guid
        update_by
        update_dt
        tariff_cleaning {
          guid
          cargo
          flash_point
          remarks
          open_on_gate_cv
        }
      }
    }
  }
`;

export const ADD_RELEASE_ORDER = gql`
  mutation AddReleaseOrder($ro: ReleaseOrderRequestInput!, $schedulings: [SchedulingRequestInput!]!) {
    addReleaseOrder(releaseOrder: $ro, schedulings: $schedulings)
  }
`;

export const UPDATE_STORING_ORDER = gql`
  mutation UpdateStoringOrder($so: StoringOrderRequestInput!, $soTanks: [StoringOrderTankRequestInput!]!) {
    updateStoringOrder(so: $so, soTanks: $soTanks)
  }
`;

export const CANCEL_STORING_ORDER = gql`
  mutation CancelStoringOrder($so: [StoringOrderRequestInput!]!) {
    cancelStoringOrder(so: $so)
  }
`;

export class ReleaseOrderDS extends BaseDataSource<ReleaseOrderItem> {
  constructor(private apollo: Apollo) {
    super();
  }

  searchReleaseOrder(where: any, order?: any, first: number = 10, after?: string, last?: number, before?: string): Observable<ReleaseOrderItem[]> {
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
        //query: GET_STORING_ORDER_BY_ID,
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

  addReleaseOrder(ro: any, schedulings: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_RELEASE_ORDER,
      variables: {
        ro,
        schedulings
      }
    });
  }

  updateStoringOrder(so: any, soTanks: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_STORING_ORDER,
      variables: {
        so,
        soTanks
      }
    });
  }

  cancelStoringOrder(so: any): Observable<any> {
    return this.apollo.mutate({
      mutation: CANCEL_STORING_ORDER,
      variables: {
        so
      }
    });
  }

  canCancel(ro: any): boolean {
    return ro && ro.status_cv === 'PENDING';
  }
}
