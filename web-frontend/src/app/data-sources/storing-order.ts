import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';

export interface StoringOrderItem {
  guid: string;
  customer_company_guid: string;
  so_notes: string;
  so_no: string;
  contact_person_guid: string;
  haulier: string;
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

const GET_ITEMS_QUERY = gql`
  query GetItems($pageIndex: Int, $pageSize: Int, $sortField: String, $sortDirection: String) {
    items(pageIndex: $pageIndex, pageSize: $pageSize, sortField: $sortField, sortDirection: $sortDirection) {
      items {
        id
        name
        value
      }
      totalCount
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
  loadItems(pageIndex: number, pageSize: number, sortField: string, sortDirection: string) {
    this.loadingSubject.next(true);

    this.apollo
      .watchQuery<StoringOrderResult>({
        query: GET_ITEMS_QUERY,
        variables: { pageIndex, pageSize, sortField, sortDirection },
      })
      .valueChanges.pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((result) => {
        this.itemsSubject.next(result.items);
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
