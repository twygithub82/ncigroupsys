import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StoringOrderItem } from './storing-order';

export class StoringOrderTankItem {
  public guid?: string;
  public so_guid?: string;
  public unit_type_guid?: string;
  public tank_no?: string;
  public last_cargo_guid?: string;
  public job_no?: string;
  public eta_dt?: number;
  public purpose_storage?: boolean;
  public purpose_steam?: boolean;
  public purpose_cleaning?: boolean;
  public purpose_repair_cv?: string;
  public clean_status_cv?: string;
  public certificate_cv?: string;
  public required_temp?: string;
  public flash_point?: string;
  public remarks?: string;
  public etr_dt?: number;
  public st?: string;
  public o2_level?: string;
  public open_on_gate_cv?: string;
  public status_cv?: string;
  public storing_order?: StoringOrderItem
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<StoringOrderTankItem> = {}) {
    this.guid = item.guid;
    this.so_guid = item.so_guid;
    this.unit_type_guid = item.unit_type_guid || '';
    this.tank_no = item.tank_no || '';
    this.last_cargo_guid = item.last_cargo_guid || '';
    this.job_no = item.job_no || '';
    this.eta_dt = item.eta_dt || undefined;
    this.purpose_storage = item.purpose_storage || false;
    this.purpose_steam = item.purpose_steam || false;
    this.purpose_cleaning = item.purpose_cleaning || false;
    this.purpose_repair_cv = item.purpose_repair_cv || '';
    this.clean_status_cv = item.clean_status_cv || '';
    this.certificate_cv = item.certificate_cv || '';
    this.required_temp = item.required_temp || '';
    this.flash_point = item.flash_point;
    this.remarks = item.remarks || '';
    this.etr_dt = item.etr_dt || undefined;
    this.st = item.st || '';
    this.o2_level = item.o2_level || '';
    this.open_on_gate_cv = item.open_on_gate_cv || '';
    this.status_cv = item.status_cv || '';
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
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
