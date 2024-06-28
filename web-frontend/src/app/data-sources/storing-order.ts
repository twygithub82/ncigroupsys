import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { CustomerCompanyItem } from './customer-company';
import { StoringOrderTankItem } from './storing-order-tank';

export class StoringOrderItem {
  public guid?: string;
  public customer_company_guid?: string;
  public haulier?: string;
  public so_no?: string;
  public so_notes?: string;
  public status_cv?: string;
  public storing_order_tank?: StoringOrderTankItem[];
  public customer_company?: CustomerCompanyItem;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<StoringOrderItem> = {}) {
    this.guid = item.guid;
    this.customer_company_guid = item.customer_company_guid;
    this.haulier = item.haulier || '';
    this.so_no = item.so_no || '';
    this.so_notes = item.so_notes || '';
    this.status_cv = item.status_cv || '';
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export interface StoringOrderResult {
  items: StoringOrderItem[];
  totalCount: number;
}

export const GET_STORING_ORDERS = gql`
  query allStoringOrders($where: storing_orderFilterInput, $first: Int, $after: String, $last: Int, $before: String) {
    soList: allStoringOrders(where: $where, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        guid
        so_no
        customer_company {
          code
          name
        }
        storing_order_tank {
          guid
        }
        status_cv
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

export const GET_STORING_ORDER_BY_ID = gql`
  query getStoringOrderById($id: String!) {
    soList: storingOrdersById(id: $id) {
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
        last_test_guid
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
      }
    }
  }
`;

export const CREATE_STORING_ORDER = gql`
  mutation CreateStoringOrder($so: SOTypeInput!, $soTanks: [SOTTypeInput!]) {
    createStoringOrder(so: $so, soTanks: $soTanks) {
      success
      message
      storingOrder {
        guid
        so_no
        so_notes
        status_cv
        haulier
        remarks
        delete_dt
        customer_company_guid
        tanks {
          certificate_cv
          clean_status_cv
          estimate_cv
          eta_dt
          etr_dt
          job_no
          last_cargo_guid
          last_test_guid
          purpose_cleaning
          purpose_repair_cv
          purpose_steam
          purpose_storage
          required_temp
          status_cv
          tank_no
          unit_type_guid
        }
      }
    }
  }
`;

export class StoringOrderDS extends DataSource<StoringOrderItem> {
  private soItemsSubject = new BehaviorSubject<StoringOrderItem[]>([]);
  private soLoadingSubject = new BehaviorSubject<boolean>(false);
  public soLoading$ = this.soLoadingSubject.asObservable();
  public totalCount = 0;
  constructor(private apollo: Apollo) {
    super();
  }

  searchStoringOrder(where: any, first: number = 10, after?: string, last?: number, before?: string) {
    this.soLoadingSubject.next(true);
    this.apollo
      .query<any>({
        query: GET_STORING_ORDERS,
        variables: { where, first, after, last, before }
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.soLoadingSubject.next(false))
      )
      .subscribe((result) => {
        this.soItemsSubject.next(result.soList.nodes);
        this.totalCount = result.totalCount;
      });
  }

  getStoringOrderByID(id: string) {
    this.soLoadingSubject.next(true);
    this.apollo
      .query<any>({
        query: GET_STORING_ORDER_BY_ID,
        variables: { id }
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.soLoadingSubject.next(false))
      )
      .subscribe((result) => {
        this.soItemsSubject.next(result.soList);
        this.totalCount = result.totalCount;
      });
  }

  createStoringOrder(so: any, soTanks: any): Observable<any> {
    return this.apollo.mutate({
      mutation: CREATE_STORING_ORDER,
      variables: {
        so,
        soTanks
      }
    });
  }

  connect(): Observable<StoringOrderItem[]> {
    return this.soItemsSubject.asObservable();
  }

  disconnect(): void {
    this.soItemsSubject.complete();
    this.soLoadingSubject.complete();
  }
}
