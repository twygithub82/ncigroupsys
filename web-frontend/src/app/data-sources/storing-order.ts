import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { CustomerCompanyItem } from './customer-company';
import { StoringOrderTankItem } from './storing-order-tank';
import { PageInfo } from '@core/models/pageInfo';
import { BaseDataSource } from './base-ds';

export class StoringOrderGO {
  public guid?: string;
  public customer_company_guid?: string;
  public haulier?: string;
  public so_no?: string;
  public so_notes?: string;
  public remarks?: string;
  public status_cv?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<StoringOrderGO> = {}) {
    this.guid = item.guid;
    this.customer_company_guid = item.customer_company_guid;
    this.haulier = item.haulier || '';
    this.so_no = item.so_no || '';
    this.so_notes = item.so_notes || '';
    this.remarks = item.remarks || '';
    this.status_cv = item.status_cv || '';
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class StoringOrderItem extends StoringOrderGO {
  public customer_company?: CustomerCompanyItem;
  public storing_order_tank?: StoringOrderTankItem[];

  constructor(item: Partial<StoringOrderItem> = {}) {
    super(item);
    this.customer_company = item.customer_company;
    this.storing_order_tank = item.storing_order_tank;
  }
}

export interface StoringOrderResult {
  items: StoringOrderItem[];
  totalCount: number;
}

export const GET_STORING_ORDERS = gql`
  query queryStoringOrder($where: storing_orderFilterInput, $first: Int, $after: String, $last: Int, $before: String) {
    soList: queryStoringOrder(where: $where, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        guid
        so_no
        customer_company {
          code
          name
        }
        storing_order_tank {
          guid
          tank_no
          tank_status_cv
          status_cv
        }
        status_cv
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

export const SEARCH_STORING_ORDER_BY_ID = gql`
  query queryStoringOrder($where: storing_orderFilterInput) {
    soList: queryStoringOrder(where: $where) {
      nodes {
        guid
        haulier
        so_no
        so_notes
        customer_company_guid
        remarks
        status_cv
        create_by
        create_dt
        delete_dt
        update_by
        update_dt
        customer_company {
          code
          name
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
        status_cv
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

export const ADD_STORING_ORDER = gql`
  mutation AddStoringOrder($so: StoringOrderRequestInput!, $soTanks: [StoringOrderTankRequestInput!]!) {
    addStoringOrder(so: $so, soTanks: $soTanks)
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

export class  StoringOrderDS extends BaseDataSource<StoringOrderItem> {
  private soItemsSubject = new BehaviorSubject<StoringOrderItem[]>([]);
  private soLoadingSubject = new BehaviorSubject<boolean>(false);
  public soLoading$ = this.soLoadingSubject.asObservable();
  public totalCount = 0;
  public pageInfo?: PageInfo;
  constructor(private apollo: Apollo) {
    super();
  }

  searchStoringOrder(where: any, first: number = 10, after?: string, last?: number, before?: string): Observable<StoringOrderItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_STORING_ORDERS,
        variables: { where, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ soList: { nodes: [], totalCount: 0 } })),
        finalize(() => this.soLoadingSubject.next(false)),
        map((result) => {
          const soList = result.soList || { nodes: [], totalCount: 0 };
          this.soItemsSubject.next(soList.nodes);
          this.totalCount = soList.totalCount;
          this.pageInfo = soList.pageInfo;
          return soList.nodes;
        })
      );
  }

  getStoringOrderByID(id: string): Observable<StoringOrderItem[]> {
    this.soLoadingSubject.next(true);
    let where = this.addDeleteDtCriteria({ guid: { eq: id } });
    return this.apollo
      .query<any>({
        //query: GET_STORING_ORDER_BY_ID,
        query: SEARCH_STORING_ORDER_BY_ID,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ soList: [] })),
        finalize(() => this.soLoadingSubject.next(false)),
        map((result) => {
          // const soList = result.soList;
          // this.soItemsSubject.next(soList);
          // this.totalCount = soList.length;
          // return soList;
          const soList = result.soList || { nodes: [], totalCount: 0 };
          this.soItemsSubject.next(soList.nodes);
          this.totalCount = soList.totalCount;
          return soList.nodes;
        })
      );
  }

  addStoringOrder(so: any, soTanks: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_STORING_ORDER,
      variables: {
        so,
        soTanks
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

  canCancel(so: StoringOrderItem): boolean {
    return so && (!so.status_cv || so.status_cv === 'PENDING');
  }

  canAdd(so: StoringOrderItem): boolean {
    return !so.status_cv || so.status_cv === 'PENDING' || so.status_cv === 'PROCESSING';
  }

  canRemove(so: StoringOrderItem): boolean {
    return !so.status_cv;
  }
}
