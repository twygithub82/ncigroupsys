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
export class TariffRepairItem {
  public guid?: string;
  
  public group_name_cv?: string;
  public subgroup_name_cv?: string;
  public part_name?: string;
  public dimension?: number;
  public width_diameter?: number;
  public thickness?: number;
  public length?: number;
  public length_unit_cv?: string;
  public labour_hour?:number;
  public material_cost?: number;
  public remarks?:string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;
  
  constructor(item: Partial<TariffRepairItem> = {}) {
    this.guid = item.guid;
    if (!this.guid) this.guid = '';
    this.group_name_cv = item.group_name_cv;
    this.subgroup_name_cv=item.subgroup_name_cv;
    this.part_name=item.part_name;
    this.dimension=item.dimension;
    this.width_diameter=item.width_diameter;
    this.thickness=item.thickness;
    this.length=item.length;
    this.length_unit_cv=item.length_unit_cv;
    this.labour_hour=item.labour_hour;
    this.material_cost=item.material_cost;
    this.remarks=item.remarks;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export interface TariffLabourResult {
  items: TariffRepairItem[];
  totalCount: number;
}



export const GET_TARIFF_REPAIR_QUERY = gql`
  query queryTariffRepair($where: tariff_repairFilterInput, $order:[tariff_repairSortInput!], $first: Int, $after: String, $last: Int, $before: String ) {
    tariffRepairResult : queryTariffRepair(where: $where, order:$order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
      create_by
      create_dt
      delete_dt
      dimension
      group_name_cv
      guid
      labour_hour
      length
      length_unit_cv
      material_cost
      part_name
      remarks
      subgroup_name_cv
      thickness
      update_by
      update_dt
      width_diameter
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


export const ADD_TARIFF_REPAIR = gql`
  mutation addTariffRepair($td: tariff_repairInput!) {
    addTariffRepair(newTariffRepair: $td)
  }
`;

export const UPDATE_TARIFF_REPAIR = gql`
  mutation updateTariffRepair($td: tariff_repairInput!) {
    updateTariffRepair(updateTariffRepair: $td)
  }
`;


export class TariffRepairDS extends BaseDataSource<TariffRepairItem> {
  constructor(private apollo: Apollo) {
    super();
  }
  
  SearchTariffRepair(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<TariffRepairItem[]> {
    this.loadingSubject.next(true);
    if (!last)
      if (!first)
        first = 10;
    return this.apollo
      .query<any>({
        query: GET_TARIFF_REPAIR_QUERY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as TariffRepairItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const tariffRepairResult = result.tariffRepairResult || { nodes: [], totalCount: 0 };
          this.dataSubject.next(tariffRepairResult.nodes);
          this.pageInfo = tariffRepairResult.pageInfo;
          this.totalCount = tariffRepairResult.totalCount;
          return tariffRepairResult.nodes;
        })
      );
  }


  addNewTariffRepair(td: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_TARIFF_REPAIR,
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

    updateTariffRepair(td: any): Observable<any> {
      return this.apollo.mutate({
        mutation: UPDATE_TARIFF_REPAIR,
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
