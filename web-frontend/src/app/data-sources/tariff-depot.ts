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
  public gate_in_cost?:number;
  public gate_out_cost?:number;

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
    this.gate_in_cost=item.gate_in_cost;
    this.gate_out_cost=item.gate_out_cost;
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

const QUERY_TARIFF_CLEAN_UN_NO = gql`
  query queryTariffCleaning($where: tariff_cleaningFilterInput) {
    lastCargo: queryTariffCleaning(where: $where) {
    nodes {
        alias
        ban_type_cv
        cargo
        class_cv
        cleaning_category_guid
        cleaning_method_guid
        create_by
        create_dt
        delete_dt
        depot_note
        description
        flash_point
        guid
        hazard_level_cv
        in_gate_alert
        nature_cv
        open_on_gate_cv
        remarks
        un_no
        update_by
        update_dt
      
        }
      totalCount
    }
  }
`;

export const TARIFF_CLEANING_FRAGMENT = gql`
  fragment TariffCleaningFields on tariff_cleaning {
    alias
    ban_type_cv
    cargo
    class_cv
    cleaning_category_guid
    cleaning_method_guid
    create_by
    create_dt
    delete_dt
    depot_note
    description
    flash_point
    guid
    hazard_level_cv
    in_gate_alert
    nature_cv
    open_on_gate_cv
    remarks
    un_no
    update_by
    update_dt
  }
`;



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
}
