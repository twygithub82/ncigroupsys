import { ApolloError } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { BaseDataSource } from './base-ds';
export class TariffResidueItem {
  public guid?: string;

  public description?: string;
  public cost?: number;
  public remarks?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<TariffResidueItem> = {}) {
    this.guid = item.guid;
    if (!this.guid) this.guid = '';
    this.description = item.description;
    this.cost = item.cost;
    this.remarks = item.remarks;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export interface TariffLabourResult {
  items: TariffResidueItem[];
  totalCount: number;
}

export const GET_TARIFF_RESIDUE_QUERY = gql`
  query queryTariffResidue($where: tariff_residueFilterInput, $order:[tariff_residueSortInput!], $first: Int, $after: String, $last: Int, $before: String ) {
    tariffResidueResult : queryTariffResidue(where: $where, order:$order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
      description
      cost
      create_by
      create_dt
      delete_dt
      guid
      remarks
      update_by
      update_dt
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

export const GET_TARIFF_RESIDUE_QUERY_WITH_COUNT = gql`
  query queryTariffResidueWithCount($where: TariffResidueResultFilterInput, $order:[TariffResidueResultSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    tariffResidueResult : queryTariffResidueWithCount(where: $where, order:$order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        tank_count
        tariff_residue {
          cost
          create_by
          create_dt
          delete_dt
          description
          guid
          remarks
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

export const ADD_TARIFF_RESIDUE = gql`
  mutation addTariffResidue($td: tariff_residueInput!) {
    addTariffResidue(newTariffResidue: $td)
  }
`;

export const UPDATE_TARIFF_RESIDUE = gql`
  mutation updateTariffResidue($td: tariff_residueInput!) {
    updateTariffResidue(updateTariffResidue: $td)
  }
`;

export const DELETE_TARIFF_RESIDUE = gql`
  mutation deleteTariffResidue($deleteTariffResidue_guids: [String!]!) {
    deleteTariffResidue(deleteTariffResidue_guids: $deleteTariffResidue_guids)
  }
`;

export class TariffResidueDS extends BaseDataSource<TariffResidueItem> {
  constructor(private apollo: Apollo) {
    super();
  }

  SearchTariffResidue(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<TariffResidueItem[]> {
    this.loadingSubject.next(true);
    if (!last)
      if (!first)
        first = 10;
    return this.apollo
      .query<any>({
        query: GET_TARIFF_RESIDUE_QUERY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as TariffResidueItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const tariffResidueResult = result.tariffResidueResult || { nodes: [], totalCount: 0 };
          this.dataSubject.next(tariffResidueResult.nodes);
          this.pageInfo = tariffResidueResult.pageInfo;
          this.totalCount = tariffResidueResult.totalCount;
          return tariffResidueResult.nodes;
        })
      );
  }

  SearchTariffResidueWithCount(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<TariffResidueItem[]> {
    this.loadingSubject.next(true);
    if (!last)
      if (!first)
        first = 10;
    return this.apollo
      .query<any>({
        query: GET_TARIFF_RESIDUE_QUERY_WITH_COUNT,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as TariffResidueItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const tariffResidueResult = result.tariffResidueResult || { nodes: [], totalCount: 0 };
          this.dataSubject.next(tariffResidueResult.nodes);
          this.pageInfo = tariffResidueResult.pageInfo;
          this.totalCount = tariffResidueResult.totalCount;
          return tariffResidueResult.nodes;
        })
      );
  }

  addNewTariffResidue(td: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_TARIFF_RESIDUE,
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

  updateTariffResidue(td: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_TARIFF_RESIDUE,
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

  deleteTariffResidue(deleteTariffResidue_guids: any): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_TARIFF_RESIDUE,
      variables: {
        deleteTariffResidue_guids
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }
}
