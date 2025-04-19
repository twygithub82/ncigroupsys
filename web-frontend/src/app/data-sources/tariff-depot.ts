import { ApolloError } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { BaseDataSource } from './base-ds';
import { TankItem } from './tank';
export class TariffDepotGO {
  public guid?: string;
  public profile_name?: string;
  public description?: string;
  public preinspection_cost?: number;
  public lolo_cost?: number;
  public storage_cost?: number;
  public free_storage?: number;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;
  public gate_in_cost?: number;
  public gate_out_cost?: number;

  constructor(item: Partial<TariffDepotGO> = {}) {
    this.guid = item.guid;
    if (!this.guid) this.guid = '';
    this.profile_name = item.profile_name;
    this.description = item.description;
    this.preinspection_cost = item.preinspection_cost;
    this.lolo_cost = item.lolo_cost;
    this.storage_cost = item.storage_cost;
    this.free_storage = item.free_storage;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
    this.gate_in_cost = item.gate_in_cost;
    this.gate_out_cost = item.gate_out_cost;
  }
}

export class TariffDepotItem extends TariffDepotGO {
  public tanks?: TankItem[] = [];

  constructor(item: Partial<TariffDepotItem> = {}) {
    super(item);
    this.tanks = item.tanks;
  }
}

export interface TariffDepotResult {
  items: TariffDepotItem[];
  totalCount: number;
}

export const GET_TARIFF_DEPOT_QUERY_WITH_TANK = gql`
  query queryTariffDepot($where: tariff_depotFilterInput, $order:[tariff_depotSortInput!], $first: Int, $after: String, $last: Int, $before: String ) {
    tariffDepotResult : queryTariffDepot(where: $where, order:$order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        create_by
        create_dt
        delete_dt
        description
        free_storage
        guid
        lolo_cost
        preinspection_cost
        gate_in_cost
        gate_out_cost
        profile_name
        storage_cost
        update_by
        update_dt
        tanks {
          create_by
          create_dt
          delete_dt
          description
          guid
          tariff_depot_guid
          unit_type
          update_by
          update_dt
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

export const GET_TARIFF_DEPOT_QUERY_WITH_TANK_WITH_COUNT = gql`
  query queryTariffDepotWithCount($where: TariffDepotResultFilterInput, $order:[TariffDepotResultSortInput!], $first: Int, $after: String, $last: Int, $before: String ) {
    tariffDepotResult : queryTariffDepotWithCount(where: $where, order:$order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        tank_count
        tariff_depot {
          create_by
          create_dt
          delete_dt
          description
          free_storage
          gate_in_cost
          gate_out_cost
          guid
          lolo_cost
          preinspection_cost
          profile_name
          storage_cost
          update_by
          update_dt
          tanks {
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

export const ADD_TARIFF_DEPOT = gql`
  mutation addTariffDepot($td: tariff_depotInput!) {
    addTariffDepot(newTariffDepot: $td)
  }
`;

export const UPDATE_TARIFF_DEPOT = gql`
  mutation updateTariffDepot($td: tariff_depotInput!) {
    updateTariffDepot(updateTariffDepot: $td)
  }
`;

export const DELETE_TARIFF_DEPOT = gql`
  mutation deleteTariffDepot($deleteTariffDepot_guids: [String!]!) {
    deleteTariffDepot(deleteTariffDepot_guids: $deleteTariffDepot_guids)
  }
`;

export class TariffDepotDS extends BaseDataSource<TariffDepotItem> {
  constructor(private apollo: Apollo) {
    super();
  }

  SearchTariffDepot(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<TariffDepotItem[]> {
    this.loadingSubject.next(true);
    if (!last)
      if (!first)
        first = 10;
    return this.apollo
      .query<any>({
        query: GET_TARIFF_DEPOT_QUERY_WITH_TANK,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as TariffDepotItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const tariffDepotResult = result.tariffDepotResult || { nodes: [], totalCount: 0 };
          this.dataSubject.next(tariffDepotResult.nodes);
          this.pageInfo = tariffDepotResult.pageInfo;
          this.totalCount = tariffDepotResult.totalCount;
          return tariffDepotResult.nodes;
        })
      );
  }

  SearchTariffDepotWithCount(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<TariffDepotItem[]> {
    this.loadingSubject.next(true);
    if (!last)
      if (!first)
        first = 10;
    return this.apollo
      .query<any>({
        query: GET_TARIFF_DEPOT_QUERY_WITH_TANK_WITH_COUNT,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as TariffDepotItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const tariffDepotResult = result.tariffDepotResult || { nodes: [], totalCount: 0 };
          this.dataSubject.next(tariffDepotResult.nodes);
          this.pageInfo = tariffDepotResult.pageInfo;
          this.totalCount = tariffDepotResult.totalCount;
          return tariffDepotResult.nodes;
        })
      );
  }

  addNewTariffDepot(td: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_TARIFF_DEPOT,
      variables: {
        td
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }

  updateTariffDepot(td: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_TARIFF_DEPOT,
      variables: {
        td
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }

  deleteTariffDepot(deleteTariffDepot_guids: any): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_TARIFF_DEPOT,
      variables: {
        deleteTariffDepot_guids
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }
}