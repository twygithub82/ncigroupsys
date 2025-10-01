import { ApolloError } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { BaseDataSource } from './base-ds';
export class TariffLabourItem {
  public guid?: string;
  
  public description?: string;
  public cost?: number;
  public remarks?:string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;
  
  constructor(item: Partial<TariffLabourItem> = {}) {
    this.guid = item.guid;
    if (!this.guid) this.guid = '';
    this.description = item.description;
    this.cost = item.cost;
    this.remarks=item.remarks;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export interface TariffLabourResult {
  items: TariffLabourItem[];
  totalCount: number;
}



export const GET_TARIFF_LABOUR_QUERY = gql`
  query queryTariffLabour($where: tariff_labourFilterInput, $order:[tariff_labourSortInput!], $first: Int, $after: String, $last: Int, $before: String ) {
    tariffLabourResult : queryTariffLabour(where: $where, order:$order, first: $first, after: $after, last: $last, before: $before) {
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


export const ADD_TARIFF_LABOUR = gql`
  mutation addTariffLabour($td: tariff_labourInput!) {
    addTariffLabour(newTariffLabour: $td)
  }
`;

export const UPDATE_TARIFF_LABOUR = gql`
  mutation updateTariffLabour($td: tariff_labourInput!) {
    updateTariffLabour(updateTariffLabour: $td)
  }
`;


export class TariffLabourDS extends BaseDataSource<TariffLabourItem> {
  constructor(private apollo: Apollo) {
    super();
  }
  
  SearchTariffLabour(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<TariffLabourItem[]> {
    this.loadingSubject.next(true);
    if (!last)
      if (!first)
        first = 10;
    return this.apollo
      .query<any>({
        query: GET_TARIFF_LABOUR_QUERY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as TariffLabourItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const tariffLabourResult = result.tariffLabourResult || { nodes: [], totalCount: 0 };
          this.dataSubject.next(tariffLabourResult.nodes);
          this.pageInfo = tariffLabourResult.pageInfo;
          this.totalCount = tariffLabourResult.totalCount;
          return tariffLabourResult.nodes;
        })
      );
  }


  addNewTariffLabour(td: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_TARIFF_LABOUR,
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

    updateTariffLabour(td: any): Observable<any> {
      return this.apollo.mutate({
        mutation: UPDATE_TARIFF_LABOUR,
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
}
