import { ApolloError } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { BaseDataSource } from './base-ds';
import { StoringOrderTankGO, StoringOrderTankItem } from './storing-order-tank';

export class Transfer {
  public guid?: string = '';
  public sot_guid?: string;
  public driver_name?: string;
  public vehicle_no?: string;
  public location_from_cv?: string;
  public location_to_cv?: string;
  public haulier?: string;
  public remarks?: string;
  public transfer_in_dt?: number;
  public transfer_out_dt?: number;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<Transfer> = {}) {
    this.guid = item?.guid || '';
    this.sot_guid = item?.sot_guid;
    this.driver_name = item?.driver_name;
    this.vehicle_no = item?.vehicle_no;
    this.location_from_cv = item?.location_from_cv;
    this.location_to_cv = item?.location_to_cv;
    this.haulier = item?.haulier;
    this.remarks = item?.remarks;
    this.transfer_in_dt = item?.transfer_in_dt;
    this.transfer_out_dt = item?.transfer_out_dt;
    this.create_dt = item?.create_dt;
    this.create_by = item?.create_by;
    this.update_dt = item?.update_dt;
    this.update_by = item?.update_by;
    this.delete_dt = item?.delete_dt;
  }
}

export class TransferGO extends Transfer {
  public storing_order_tank?: StoringOrderTankGO;

  constructor(item: Partial<TransferGO> = {}) {
    super(item)
    this.storing_order_tank = item?.storing_order_tank;
  }
}

export class TransferItem extends TransferGO {
  public override storing_order_tank?: StoringOrderTankItem;
  public action?: string;

  constructor(item: Partial<TransferItem> = {}) {
    super(item);
    this.storing_order_tank = item.storing_order_tank;
    this.action = item.action;
  }
}

export interface TransferResult {
  items: TransferItem[];
  totalCount: number;
}

export const GET_TRANSFER_BY_SOT_ID_FOR_MOVEMENT = gql`
  query queryTransfer($where: transferFilterInput, $order: [transferSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryTransfer(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      nodes {
        create_by
        create_dt
        delete_dt
        driver_name
        guid
        haulier
        location_from_cv
        location_to_cv
        remarks
        sot_guid
        transfer_in_dt
        transfer_out_dt
        update_by
        update_dt
        vehicle_no
      }
    }
  }
`;

export const GET_TRANSFER_BY_SOT_ID_FOR_TRANSFER = gql`
  query queryTransfer($where: transferFilterInput, $order: [transferSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryTransfer(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      nodes {
        create_by
        create_dt
        delete_dt
        driver_name
        guid
        haulier
        location_from_cv
        location_to_cv
        remarks
        sot_guid
        transfer_in_dt
        transfer_out_dt
        update_by
        update_dt
        vehicle_no
      }
    }
  }
`;

export const UPDATE_TRANSFER = gql`
  mutation updateTransfer($transfer: transferInput!) {
    updateTransfer(transfer: $transfer)
  }
`;

export class TransferDS extends BaseDataSource<TransferItem> {
  constructor(private apollo: Apollo) {
    super();
  }

  getTransferBySotIDForMovement(sot_guid: any): Observable<TransferItem[]> {
    this.loadingSubject.next(true);
    const where = {
      sot_guid: { eq: sot_guid }
    }
    return this.apollo
      .query<any>({
        query: GET_TRANSFER_BY_SOT_ID_FOR_MOVEMENT,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => {
          const retResult = result.data.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(retResult.nodes);
          this.totalCount = retResult.totalCount;
          this.pageInfo = retResult.pageInfo;
          return retResult.nodes;
        }),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as TransferItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
      );
  }

  getTransferBySotIDForTransfer(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<TransferItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_TRANSFER_BY_SOT_ID_FOR_TRANSFER,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => {
          const retResult = result.data.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(retResult.nodes);
          this.totalCount = retResult.totalCount;
          this.pageInfo = retResult.pageInfo;
          return retResult.nodes;
        }),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as TransferItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
      );
  }

  updateTransfer(transfer: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: UPDATE_TRANSFER,
      variables: {
        transfer
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  getLastTransfer(transfer: TransferItem[]): TransferItem | undefined {
    if (!transfer?.length) return undefined;

    const validTransfers = transfer.filter(t => t.transfer_in_dt === null);

    if (validTransfers.length) return validTransfers[0];

    const latestTransfer = transfer.reduce((latest, current) => {
      return (current.transfer_in_dt ?? 0) > (latest.transfer_in_dt ?? 0) ? current : latest;
    });

    return latestTransfer;
  }

  getLastLocation(transfer: TransferItem[]): string {
    if (!transfer?.length) return "";

    const validTransfers = transfer.filter(t => t.transfer_in_dt != null);

    if (!validTransfers.length) return "";

    const latestTransfer = validTransfers.reduce((latest, current) => {
      return (current.transfer_in_dt ?? 0) > (latest.transfer_in_dt ?? 0) ? current : latest;
    });

    return latestTransfer?.location_to_cv || "";
  }

  getDays(transfer: TransferItem): string {
    if (!transfer.transfer_out_dt || !transfer.transfer_in_dt) return "";
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const differenceInMilliseconds = Math.abs(transfer.transfer_in_dt - transfer.transfer_out_dt) * 1000;
    return Math.ceil(differenceInMilliseconds / millisecondsPerDay).toString();
  }

  canCompleteTransfer(transfer: TransferItem): boolean {
    return !transfer.transfer_in_dt;
  }

  canRollback(transfer: TransferItem, transferList: TransferItem[]): boolean {
    if (transferList?.length) {
      const lastTransfer = this.getLastTransfer(transferList);
      if (lastTransfer?.guid === transfer?.guid && lastTransfer?.transfer_in_dt) {
        return true;
      }
      return false;
    }
    return transfer.transfer_in_dt !== undefined && transfer.transfer_in_dt !== null;
  }

  canCancel(transfer: TransferItem): boolean {
    return !transfer.transfer_in_dt;
  }

  isAnyTransferNotDone(transfer: TransferItem[]): boolean {
    return transfer.some(item => !item.transfer_in_dt);
  }
}


