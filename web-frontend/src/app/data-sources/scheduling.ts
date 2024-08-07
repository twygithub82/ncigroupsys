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
import { ReleaseOrderItem } from './release-order';

export class SchedulingGO {
  public guid?: string;
  public reference?: string;
  public release_order_guid?: string;
  public sot_guid?: string;
  public status_cv?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<SchedulingGO> = {}) {
    this.guid = item.guid;
    this.reference = item.reference;
    this.release_order_guid = item.release_order_guid;
    this.sot_guid = item.sot_guid;
    this.status_cv = item.status_cv;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class SchedulingItem extends SchedulingGO {
  public storing_order_tank?: StoringOrderTankItem
  public release_order?: ReleaseOrderItem

  constructor(item: Partial<SchedulingItem> = {}) {
    super(item)
    this.storing_order_tank = item.storing_order_tank || undefined;
    this.release_order = item.release_order || undefined;
  }
}

export class SchedulingUpdateItem extends SchedulingItem {
  public action?: string

  constructor(item: Partial<SchedulingUpdateItem> = {}) {
    super(item)
    this.action = item.action || undefined;
  }
}

const GET_BOOKING = gql`
  query getBooking($where: bookingFilterInput, $order: [bookingSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    bookingList: queryBooking(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      nodes {
        action_dt
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
        storing_order_tank {
          tank_no
          tank_status_cv
          tariff_cleaning {
            cargo
          }
          storing_order {
            customer_company {
              code
              name
            }
          }
          in_gate {
            eir_dt
            eir_no
            yard_cv
          }
          purpose_repair_cv
          purpose_steam
          purpose_storage
          purpose_cleaning
        }
      }
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

export const ADD_BOOKING = gql`
  mutation AddBooking($booking: BookingRequestInput!) {
    addBooking(booking: $booking)
  }
`;

export class SchedulingDS extends BaseDataSource<SchedulingItem> {
  constructor(private apollo: Apollo) {
    super();
  }
  searchBooking(where: any, order?: any, first: number = 10, after?: string, last?: number, before?: string): Observable<SchedulingItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_BOOKING,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const bookingList = result.bookingList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(bookingList.nodes);
          this.totalCount = bookingList.totalCount;
          this.pageInfo = bookingList.pageInfo;
          return bookingList.nodes;
        })
      );
  }

  cancelBooking(sot: any): Observable<any> {
    return this.apollo.mutate({
      mutation: CANCEL_STORING_ORDER_TANK,
      variables: {
        sot
      }
    });
  }

  addBooking(booking: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_BOOKING,
      variables: {
        booking
      }
    });
  }

  canAddRemove(sot: StoringOrderTankItem): boolean {
    return sot && !sot.status_cv;
  }

  canCancel(schedule: SchedulingItem | undefined): boolean {
    if (!schedule) return false;
    return schedule && schedule.status_cv === 'PENDING';
  }

  canCancels(schedule: SchedulingItem[] | undefined): boolean {
    if (!schedule) return false;
    return schedule.some(item => item.status_cv === 'PENDING');
  }

  canRollbackStatus(sot: StoringOrderTankItem): boolean {
    return sot && sot.status_cv === 'CANCELED' || sot.status_cv === 'ACCEPTED';
  }
}
