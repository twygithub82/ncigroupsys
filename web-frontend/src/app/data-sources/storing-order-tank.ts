import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StoringOrderItem } from './storing-order';
import { TariffCleaningItem } from './tariff_cleaning';

export class StoringOrderTankGO {
  public guid?: string;
  public so_guid?: string;
  public unit_type_guid?: string;
  public tank_no?: string;
  public last_cargo_guid?: string;
  public job_no?: string;
  public eta_dt?: number | Date;
  public purpose_storage: boolean = false;
  public purpose_steam: boolean = false;
  public purpose_cleaning: boolean = false;
  public purpose_repair_cv?: string;
  public clean_status_cv?: string;
  public certificate_cv?: string;
  public required_temp?: number;
  public remarks?: string;
  public etr_dt?: number | Date;
  public status_cv?: string;
  public storing_order?: StoringOrderItem
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<StoringOrderTankGO> = {}) {
    this.guid = item.guid;
    this.so_guid = item.so_guid;
    this.unit_type_guid = item.unit_type_guid || '';
    this.tank_no = item.tank_no || '';
    this.last_cargo_guid = item.last_cargo_guid || '';
    this.job_no = item.job_no || '';
    this.eta_dt = item.eta_dt || undefined;
    this.purpose_storage = item.purpose_storage !== undefined ? !!item.purpose_storage : false;
    this.purpose_steam = item.purpose_steam !== undefined ? !!item.purpose_steam : false;
    this.purpose_cleaning = item.purpose_cleaning !== undefined ? !!item.purpose_cleaning : false;
    this.purpose_repair_cv = item.purpose_repair_cv || '';
    this.clean_status_cv = item.clean_status_cv || '';
    this.certificate_cv = item.certificate_cv || '';
    this.required_temp = item.required_temp || undefined;
    this.remarks = item.remarks || '';
    this.etr_dt = item.etr_dt || undefined;
    this.status_cv = item.status_cv || '';
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class StoringOrderTankItem extends StoringOrderTankGO {
  public tariff_cleaning?: TariffCleaningItem;
  public edited: boolean = false;

  constructor(item: Partial<StoringOrderTankItem> = {}) {
    super(item); // Call the constructor of the parent class
    this.tariff_cleaning = item.tariff_cleaning;
    this.edited = item.edited ?? false;
  }
}

export interface StoringOrderResult {
  items: StoringOrderTankItem[];
  totalCount: number;
}

const GET_STORING_ORDER_TANKS = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput) {
    sotList: queryStoringOrderTank(where: $where) {
      nodes {
        job_no
        guid
        tank_no
        so_guid
        tariff_cleaning {
          guid
          open_on_gate_cv
          cargo
        }
        storing_order {
          so_no
          so_notes
          customer_company {
            code
            guid
            name
            alias
          }
        }
      }
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANK_BY_ID = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput) {
    sotList: queryStoringOrderTank(where: $where) {
      nodes {
        job_no
        guid
        tank_no
        so_guid
        tariff_cleaning {
          guid
          open_on_gate_cv
          cargo
        }
        storing_order {
          so_no
          so_notes
          customer_company {
            code
            guid
            name
            alias
          }
        }
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
  constructor(private apollo: Apollo) {
    super();
  }
  searchStoringOrderTanks(where: any, first: number = 10, after?: string, last?: number, before?: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS,
        variables: { where, first, after, last, before },
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.itemsSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          return sotList.nodes;
        })
      );
  }

  getStoringOrderTankByID(id: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);
    let where: any = {guid: { eq: id }}
    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANK_BY_ID,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ soList: [] })),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.itemsSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          return sotList.nodes;
        })
      );
  }
  connect(): Observable<StoringOrderTankItem[]> {
    return this.itemsSubject.asObservable();
  }

  disconnect(): void {
    this.itemsSubject.complete();
    this.loadingSubject.complete();
  }
}
