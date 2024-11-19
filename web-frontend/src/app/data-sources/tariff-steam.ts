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
export class TariffSteamingItem {
  public guid?: string;
  public temp_min?:number;
  public temp_max?:number;
  //public description?: string;
  public cost?: number;
  public remarks?:string;
  public labour?:number;

  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;
  
  constructor(item: Partial<TariffSteamingItem> = {}) {
    this.guid = item.guid;
    if (!this.guid) this.guid = '';
    //this.description = item.description;
    this.temp_min=item.temp_min;
    this.temp_max=item.temp_max;
    this.labour=item.labour;

    this.cost = item.cost;
    this.remarks=item.remarks;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export interface TariffSteamResult {
  items: TariffSteamingItem[];
  totalCount: number;
}



export const GET_TARIFF_STEAM_QUERY = gql`
  query queryTariffSteaming($where: tariff_steamingFilterInput, $order:[tariff_steamingSortInput!], $first: Int, $after: String, $last: Int, $before: String ) {
    tariffSteamResult : queryTariffSteaming(where: $where, order:$order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
      cost
      create_by
      create_dt
      delete_dt
      guid
      labour
      remarks
      temp_max
      temp_min
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


export const ADD_TARIFF_STEAMING = gql`
  mutation addTariffSteaming($ts: tariff_steamingInput!) {
    addTariffSteaming(newTariffSteaming: $ts)
  }
`;

export const UPDATE_TARIFF_STEAMING = gql`
  mutation updateTariffSteaming($ts: tariff_steamingInput!) {
    updateTariffSteaming(updateTariffSteaming: $ts)
  }
`;


export class TariffSteamingDS extends BaseDataSource<TariffSteamingItem> {
  constructor(private apollo: Apollo) {
    super();
  }
  
  SearchTariffSteam(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<TariffSteamingItem[]> {
    this.loadingSubject.next(true);
    if (!last)
      if (!first)
        first = 10;
    return this.apollo
      .query<any>({
        query: GET_TARIFF_STEAM_QUERY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as TariffSteamingItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const tariffSteamResult = result.tariffSteamResult || { nodes: [], totalCount: 0 };
          this.dataSubject.next(tariffSteamResult.nodes);
          this.pageInfo = tariffSteamResult.pageInfo;
          this.totalCount = tariffSteamResult.totalCount;
          return tariffSteamResult.nodes;
        })
      );
  }


  addNewTariffSteam(ts: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_TARIFF_STEAMING,
      variables: {
        ts
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }

    updateTariffSteam(ts: any): Observable<any> {
      return this.apollo.mutate({
        mutation: UPDATE_TARIFF_STEAMING,
        variables: {
          ts
        }
      }).pipe(
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of(0); // Return an empty array on error
        }),
      );
    }
}
