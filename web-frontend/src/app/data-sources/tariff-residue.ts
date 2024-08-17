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
export class TariffResidueItem {
  public guid?: string;
  
  public description?: string;
  public cost?: number;
  public remarks?:string;
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
    this.remarks=item.remarks;
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


  addNewTariffBuffer(td: any): Observable<any> {
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

    updateTariffBuffer(td: any): Observable<any> {
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
}
