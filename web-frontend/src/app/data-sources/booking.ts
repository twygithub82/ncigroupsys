import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { BaseDataSource } from './base-ds';
import { StoringOrderTankItem } from './storing-order-tank';

export class BookingGO {
  public guid?: string;
  public book_type_cv?: string;
  public booking_dt?: number;
  public reference?: string;
  public sot_guid?: string;
  public status_cv?: string;
  public remarks?: string;
  public test_class_cv?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<BookingGO> = {}) {
    this.guid = item.guid;
    this.book_type_cv = item.book_type_cv;
    this.booking_dt = item.booking_dt;
    this.reference = item.reference;
    this.sot_guid = item.sot_guid;
    this.status_cv = item.status_cv;
    this.remarks = item.remarks;
    this.test_class_cv = item.test_class_cv;
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
        book_type_cv
        booking_dt
        create_by
        create_dt
        delete_dt
        guid
        reference
        sot_guid
        status_cv
        test_class_cv
        remarks
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

const GET_BOOKING_FOR_MOVEMENT = gql`
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
        book_type_cv
        booking_dt
        create_by
        create_dt
        delete_dt
        guid
        reference
        sot_guid
        status_cv
        test_class_cv
        remarks
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

export const ADD_BOOKING = gql`
  mutation AddBooking($booking: BookingRequestInput!) {
    addBooking(booking: $booking)
  }
`;

export const UPDATE_BOOKING = gql`
  mutation UpdateBooking($bookingList: [BookingRequestInput!]!) {
    updateBooking(bookingList: $bookingList)
  }
`;

export const CANCEL_BOOKING = gql`
  mutation CancelBooking($bookingList: [BookingRequestInput!]!) {
    cancelBooking(bookingList: $bookingList)
  }
`;

export const DELETE_BOOKING = gql`
  mutation DeleteBooking($bkGuids: [String!]!) {
    deleteBooking(bkGuids: $bkGuids)
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

  getBookingForMovement(sot_guid: any, order?: any): Observable<BookingItem[]> {
    this.loadingSubject.next(true);

    const where = {
      sot_guid: { eq: sot_guid }
    }

    return this.apollo
      .query<any>({
        query: GET_BOOKING_FOR_MOVEMENT,
        variables: { where, order },
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

  addBooking(booking: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_BOOKING,
      variables: {
        booking
      }
    });
  }

  updateBooking(bookingList: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_BOOKING,
      variables: {
        bookingList
      }
    });
  }

  cancelBooking(bookingList: any): Observable<any> {
    return this.apollo.mutate({
      mutation: CANCEL_BOOKING,
      variables: {
        bookingList
      }
    });
  }

  deleteBooking(bkGuids: any): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_BOOKING,
      variables: {
        bkGuids
      }
    });
  }

  canCancel(booking: BookingItem): boolean {
    return true;
    return booking && booking.status_cv === 'NEW';
  }

  canRollbackStatus(sot: StoringOrderTankItem): boolean {
    return sot && sot.status_cv === 'CANCELED' || sot.status_cv === 'ACCEPTED';
  }

  getBookingReleaseOrder(booking: BookingItem[] | undefined): BookingItem | undefined {
    return this.getBookingWithType(booking, "RELEASE_ORDER");
  }

  getBookingWithType(booking: BookingItem[] | undefined, type: string): BookingItem | undefined {
    return booking?.find(item => item.book_type_cv === type);
  }

  checkBooking(bookings: BookingItem[] | undefined): boolean {
    if (!bookings || !bookings.length) return false;
    if (bookings.some(booking => booking.status_cv === "NEW" || booking.status_cv === "MATCH"))
      return true;
    return false;
  }
}
