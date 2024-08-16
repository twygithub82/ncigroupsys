import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client/core';
import { CleaningCategoryItem } from './cleaning-category';
import { CleaningMethodItem } from './cleaning-method';
import { TankItem } from './tank';
import { CLEANING_CATEGORY_FRAGMENT, CLEANING_METHOD_FRAGMENT } from './fragments';
import { PageInfo } from '@core/models/pageInfo';
import { BaseDataSource } from './base-ds';
export class TariffBufferItem {
  public guid?: string;
  
  public buffer_type?: string;
  public cost?: number;
  public remarks?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;
  
  constructor(item: Partial<TariffBufferItem> = {}) {
    this.guid = item.guid;
    if (!this.guid) this.guid = '';
    this.buffer_type = item.buffer_type;
    this.cost = item.cost;
    this.remarks=item.remarks;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export interface TariffBufferResult {
  items: TariffBufferItem[];
  totalCount: number;
}



export const GET_TARIFF_BUFFER_QUERY = gql`
  query queryTariffBuffer($where: tariff_bufferFilterInput, $order:[tariff_bufferSortInput!], $first: Int, $after: String, $last: Int, $before: String ) {
    tariffBufferResult : queryTariffBuffer(where: $where, order:$order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
      buffer_type
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


export const ADD_TARIFF_BUFFER = gql`
  mutation addTariffBuffer($td: tariff_bufferInput!) {
    addTariffBuffer(newTariffBuffer: $td)
  }
`;

export const UPDATE_TARIFF_BUFFER = gql`
  mutation updateTariffBuffer($td: tariff_bufferInput!) {
    updateTariffBuffer(updateTariffBuffer: $td)
  }
`;


export class TariffBufferDS extends BaseDataSource<TariffBufferItem> {
  constructor(private apollo: Apollo) {
    super();
  }
  
  SearchTariffBuffer(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<TariffBufferItem[]> {
    this.loadingSubject.next(true);
    if (!last)
      if (!first)
        first = 10;
    return this.apollo
      .query<any>({
        query: GET_TARIFF_BUFFER_QUERY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as TariffBufferItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const tariffBufferResult = result.tariffBufferResult || { nodes: [], totalCount: 0 };
          this.dataSubject.next(tariffBufferResult.nodes);
          this.pageInfo = tariffBufferResult.pageInfo;
          this.totalCount = tariffBufferResult.totalCount;
          return tariffBufferResult.nodes;
        })
      );
  }


  addNewTariffBuffer(td: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_TARIFF_BUFFER,
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

    updateTariffBuffer(td: any): Observable<any> {
      return this.apollo.mutate({
        mutation: UPDATE_TARIFF_BUFFER,
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
