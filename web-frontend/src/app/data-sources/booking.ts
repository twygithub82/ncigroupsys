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
  public book_type_cv?: string;
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
    this.book_type_cv = item.book_type_cv;
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

export class BookingDS extends BaseDataSource<BookingItem> {
  constructor(private apollo: Apollo) {
    super();
  }
  searchBooking(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<BookingItem[]> {
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

  canCancel(sot: StoringOrderTankItem): boolean {
    return sot && sot.status_cv === 'WAITING';
  }

  canRollbackStatus(sot: StoringOrderTankItem): boolean {
    return sot && sot.status_cv === 'CANCELED' || sot.status_cv === 'ACCEPTED';
  }
}
