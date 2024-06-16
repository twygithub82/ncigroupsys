import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AdvanceTable } from 'app/advance-table/advance-table.model';
import { StoringOrderService } from 'app/services/storing-order.service';

export interface StoringOrderTankItem {
  guid?: string;
  so_guid?: string;
  unit_type_guid: string;
  tank_no: string;
  last_cargo_guid: string;
  job_no: string;
  eta_date: string;
  purpose_storage: boolean;
  purpose_steam: boolean;
  purpose_cleaning: boolean;
  repair: string;
  cleaan_status: string;
  certificate: string;
  required_temp: string;
  flash_point?: string;
  remarks: string;
  etr_date: string;
  st: string;
  o2_level: string;
  open_on_gate: string;
  create_dt?: number;
  create_by?: string;
  update_dt?: number;
  update_by?: string;
  delete_dt?: number;
}

export interface StoringOrderResult {
  items: StoringOrderTankItem[];
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

export class StoringOrderTankDS extends DataSource<StoringOrderTankItem> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: StoringOrderTankItem[] = [];
  renderedData: StoringOrderTankItem[] = [];
  private itemsSubject = new BehaviorSubject<StoringOrderTankItem[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  public totalCount = 0;
  constructor(
    public exampleDatabase: StoringOrderService,
    public paginator: MatPaginator,
    public _sort: MatSort,
    private apollo: Apollo) {
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
  connect(): Observable<StoringOrderTankItem[]> {
    return this.itemsSubject.asObservable();
  }

  disconnect(): void {
    this.itemsSubject.complete();
    this.loadingSubject.complete();
  }
}
