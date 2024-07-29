import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StoringOrderItem } from './storing-order';
import { TARIFF_CLEANING_FRAGMENT, TariffCleaningItem } from './tariff-cleaning';
import { BaseDataSource } from './base-ds';
import { InGateItem } from './in-gate';
import { StoringOrderTankItem } from './storing-order-tank';

export class BookingGO {
  public guid?: string;
  public action_dt?: number | null;
  public booking_type_cv?: string;
  public booking_dt?: number | null;
  public reference?: string;
  public sot_guid?: string;
  public status_cv?: string;
  public surveyor_guid?: string | null;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<BookingGO> = {}) {
    this.guid = item.guid;
    this.action_dt = item.action_dt;
    this.booking_type_cv = item.booking_type_cv;
    this.booking_dt = item.booking_dt;
    this.reference = item.reference;
    this.sot_guid = item.sot_guid;
    this.status_cv = item.status_cv;
    this.surveyor_guid = item.surveyor_guid;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class BookingItem extends BookingGO {
  public storing_order_tank?: StoringOrderTankItem

  constructor(item: Partial<BookingItem> = {}) {
    super(item)
    this.storing_order_tank = item.storing_order_tank || undefined;
  }
}

const GET_STORING_ORDER_TANKS_COUNT = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput) {
    sotList: queryStoringOrderTank(where: $where) {
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANKS = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput, $order: [storing_order_tankSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    sotList: queryStoringOrderTank(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
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

const GET_STORING_ORDER_TANKS_FOR_BOOKING = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput, $order: [storing_order_tankSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    sotList: queryStoringOrderTank(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      totalCount
      nodes {
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
        storing_order {
          customer_company {
            code
            name
          }
        }
        in_gate {
          eir_no
          eir_dt
          delete_dt
          in_gate_survey {
            tare_weight
            capacity
          }
        }
        booking {
          book_type_cv
          booking_dt
          create_by
          create_dt
          delete_dt
          guid
          reference
          sot_guid
          status_cv
          surveyor_guid
          update_by
          update_dt
          action_dt
        }
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

const RELOAD_STORING_ORDER_TANKS = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput) {
    sotList: queryStoringOrderTank(where: $where) {
      nodes {
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
      totalCount
    }
  }
`;

const GET_STORING_ORDER_TANK_BY_ID = gql`
  ${TARIFF_CLEANING_FRAGMENT}
  query getStoringOrderTanks($where: storing_order_tankFilterInput) {
    sotList: queryStoringOrderTank(where: $where) {
      nodes {
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
        in_gate {
          create_by
          create_dt
          delete_dt
          driver_name
          eir_dt
          eir_no
          guid
          haulier
          lolo_cv
          preinspection_cv
          so_tank_guid
          update_by
          update_dt
          vehicle_no
          yard_cv
        }
        tariff_cleaning {
          ...TariffCleaningFields
        }
        storing_order {
          so_no
          so_notes
          haulier
          create_dt
          status_cv
          customer_company_guid
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

const CHECK_ANY_ACTIVE_SOT = gql`
  query getStoringOrderTanks($where: storing_order_tankFilterInput) {
    sotList: queryStoringOrderTank(where: $where) {
      nodes {
        guid
        so_guid
        status_cv
        tank_status_cv
        tank_no
      }
      totalCount
    }
  }
`;

export const CANCEL_STORING_ORDER_TANK = gql`
  mutation CancelStoringOrderTank($sot: [StoringOrderTankRequestInput!]!) {
    cancelStoringOrderTank(sot: $sot)
  }
`;

export const ROLLBACK_STORING_ORDER_TANK = gql`
  mutation RollbackStoringOrderTank($sot: [StoringOrderTankRequestInput!]!) {
    rollbackStoringOrderTank(sot: $sot)
  }
`;

export class StoringOrderTankDS extends BaseDataSource<StoringOrderTankItem> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: StoringOrderTankItem[] = [];
  renderedData: StoringOrderTankItem[] = [];
  public totalCount = 0;
  constructor(private apollo: Apollo) {
    super();
  }
  searchStoringOrderTanks(where: any, order?: any, first: number = 10, after?: string, last?: number, before?: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          return sotList.nodes;
        })
      );
  }

  reloadStoringOrderTanks(where: any): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: RELOAD_STORING_ORDER_TANKS,
        variables: { where },
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          return sotList.nodes;
        })
      );
  }

  getStoringOrderTankByID(id: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);
    let where: any = { guid: { eq: id } }
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
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          return sotList.nodes;
        })
      );
  }

  getWaitingStoringOrderTankCount(): Observable<number> {
    this.loadingSubject.next(true);
    let where: any = { status_cv: { eq: "WAITING" } }
    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_COUNT,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ soList: [] })),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          return sotList.totalCount;
        })
      );
  }

  searchStoringOrderTanksForBooking(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_STORING_ORDER_TANKS_FOR_BOOKING,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          this.pageInfo = sotList.pageInfo;
          console.log(this.pageInfo);
          return sotList.nodes;
        })
      );
  }

  isTankNoAvailableToAdd(tank_no: string): Observable<StoringOrderTankItem[]> {
    this.loadingSubject.next(true);
    let where: any = {
      and: [
        { tank_no: { eq: tank_no } },
        {
          or: [
            { status_cv: { in: ["WAITING", "PREBOOK"] } },
            {
              and: [{ status_cv: { eq: "ACCEPTED" } }, { tank_status_cv: { neq: "RO_GENERATED" } }]
            }
          ]
        }
      ]
    }
    return this.apollo
      .query<any>({
        query: CHECK_ANY_ACTIVE_SOT,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ soList: [] })),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const sotList = result.sotList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(sotList.nodes);
          this.totalCount = sotList.totalCount;
          return sotList.nodes;
        })
      );
  }

  cancelStoringOrderTank(sot: any): Observable<any> {
    return this.apollo.mutate({
      mutation: CANCEL_STORING_ORDER_TANK,
      variables: {
        sot
      }
    });
  }

  rollbackStoringOrderTank(sot: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ROLLBACK_STORING_ORDER_TANK,
      variables: {
        sot
      }
    });
  }

  canAddRemove(sot: StoringOrderTankItem): boolean {
    return sot && !sot.status_cv;
  }

  canCancel(sot: StoringOrderTankItem): boolean {
    return sot && sot.status_cv === 'WAITING';
  }

  canRollbackStatus(sot: StoringOrderTankItem): boolean {
    return sot && sot.status_cv === 'CANCELED' || sot.status_cv === 'ACCEPTED';
  }
}
