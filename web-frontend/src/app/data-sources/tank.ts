import { ApolloError } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { BaseDataSource } from './base-ds';
import { StoringOrderTank } from './storing-order-tank';

export class TankItem {
  public guid?: string;
  public tariff_depot_guid?: string;
  public unit_type?: string;
  public description?: string;
  public preinspect?: boolean;
  public lift_on?: boolean;
  public lift_off?: boolean;
  public gate_in?: boolean;
  public gate_out?: boolean;
  public iso_format?: boolean;
  public flat_rate?: boolean;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;
  public sot?:StoringOrderTank;

  constructor(item: Partial<TankItem> = {}) {
    this.guid = item.guid;
    this.tariff_depot_guid = item.tariff_depot_guid;
    this.unit_type = item.unit_type;
    this.description = item.description || '';
    this.preinspect = item.preinspect;
    this.lift_on = item.lift_on;
    this.lift_off = item.lift_off;
    this.gate_in = item.gate_in;
    this.gate_out = item.gate_out;
    this.iso_format = item.iso_format;
    this.flat_rate=item.flat_rate;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export interface TankResult {
  items: TankItem[];
  totalCount: number;
}

export const GET_TANK_Where = gql`
  query queryTank($where: tankFilterInput, $order:[tankSortInput!]) {
    queryTank(where: $where, order:$order) {
      guid
      unit_type
      tariff_depot_guid
      description
      preinspect
      lift_on
      lift_off
      gate_in
      gate_out
      iso_format
      flat_rate
    }
  }
`;

export const GET_TANK_Where_r1 = gql`
  query queryTank($where: tankFilterInput, $order:[tankSortInput!],$first: Int, $after: String, $last: Int, $before: String ) {
    queryTank(where: $where, order:$order,first: $first, after: $after, last: $last, before: $before) {
      nodes {
        create_by
        create_dt
        delete_dt
        description
        gate_in
        gate_out
        guid
        iso_format
        lift_off
        lift_on
        preinspect
        tariff_depot_guid
        unit_type
        update_by
        update_dt
        flat_rate
        sot{
          guid
          tank_no
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

export const GET_TANK = gql`
  query queryTank {
    queryTank(where: {delete_dt:  { eq: null }}, first: 100) {
      nodes {
        guid
        unit_type
        description
        preinspect
        lift_on
        lift_off
        gate_in
        gate_out
        iso_format
        flat_rate
      }
      totalCount
    }
  }
`;

export const ADD_TANK = gql`
  mutation addTank ($newTank:tankInput!){
    addTank (newTank:$newTank) 
  }
`;

export const UPDATE_TANK = gql`
  mutation updateTank ($updateTank:tankInput!){
    updateTank (updateTank:$updateTank) 
  }
`;

export const DELETE_TANK = gql`
  mutation deleteTank ($tankGuid:String!){
    deleteTank (tankGuid:$tankGuid) 
  }
`;

export class TankDS extends BaseDataSource<TankItem> {
  constructor(private apollo: Apollo) {
    super();
  }

  loadItems(): Observable<TankItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_TANK,
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const tankList = result.queryTank || { nodes: [], totalCount: 0 };
          this.dataSubject.next(tankList);
          this.totalCount = tankList.totalCount;
          this.pageInfo = tankList.pageInfo;
          return tankList.nodes;
        })
      );
  }

  search_r1(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<TankItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_TANK_Where_r1,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const tankList = result.queryTank || { nodes: [], totalCount: 0 };
          this.dataSubject.next(tankList);
          this.totalCount = tankList.totalCount;
          this.pageInfo = tankList.pageInfo;
          return tankList.nodes;
        })
      );
  }

  search(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<TankItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_TANK_Where_r1,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of({ items: [], totalCount: 0 }); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const tankList = result.queryTank || { nodes: [], totalCount: 0 };
          this.dataSubject.next(tankList);
          this.totalCount = tankList.totalCount;
          this.pageInfo = tankList.pageInfo;
          return tankList.nodes;
        })
      );
  }

  addNewTank(newTank: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_TANK,
      variables: {
        newTank
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }

  updateTank(updateTank: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_TANK,
      variables: {
        updateTank
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }

  deleteTank(tankGuid: any): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_TANK,
      variables: {
        tankGuid
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }
}
