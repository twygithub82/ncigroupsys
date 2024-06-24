import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { CustomerCompanyItem } from './customer-company';
import { StoringOrderTankItem } from './storing-order-tank';

export interface StoringOrderItem {
  guid: string;
  customer_company: CustomerCompanyItem;
  customer_company_guid: string;
  contact_person: string;
  haulier: string;
  so_no: string;
  so_notes: string;
  status_cv: string;
  storing_order_tank: StoringOrderTankItem[];
  create_dt: number;
  create_by: string;
  update_dt: number;
  update_by: string;
  delete_dt: number;
}

export interface StoringOrderResult {
  items: StoringOrderItem[];
  totalCount: number;
}

export const GET_STORING_ORDERS = gql`
  query allStoringOrders($where: storing_orderFilterInput, $first: Int, $after: String, $last: Int, $before: String) {
    soList: allStoringOrders(where: $where, first: $first, after: $after, last: $last, before: $before) {
      nodes {
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

export class StoringOrderDS extends DataSource<StoringOrderItem> {
  private itemsSubject = new BehaviorSubject<StoringOrderItem[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  public totalCount = 0;
  constructor(private apollo: Apollo) {
    super();
  }

  loadItems(where: any, first: number = 10, after?: string, last?: number, before?: string) {
    this.loadingSubject.next(true);

    this.apollo
      .query<any>({
        query: GET_STORING_ORDERS,
        variables: { where, first, after, last, before }
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((result) => {
        this.itemsSubject.next(result.soList.nodes);
        this.totalCount = result.totalCount;
      });
  }

  connect(): Observable<StoringOrderItem[]> {
    return this.itemsSubject.asObservable();
  }

  disconnect(): void {
    this.itemsSubject.complete();
    this.loadingSubject.complete();
  }
}
