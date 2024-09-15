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
import { CustomerCompanyItem } from './customer-company';
import { TariffDepotItem } from './tariff-depot';

export class PackageDepotGO {
  public guid?: string;
  public profile_name?: string;
  public description?: string;
  public preinspection_cost?: number;
  public remarks?: string;
  public storage_cal_cv?:string;
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
 

  constructor(item: Partial<PackageDepotGO> = {}) {
    this.guid = item.guid;
    if (!this.guid) this.guid = '';
    this.profile_name = item.profile_name;
    this.description = item.description;
    this.preinspection_cost = item.preinspection_cost;
    this.lolo_cost = item.lolo_cost;
    this.storage_cost = item.storage_cost;
    this.free_storage = item.free_storage;
    this.remarks=item.remarks;
    this.storage_cal_cv=item.storage_cal_cv;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
    this.gate_in_cost=item.gate_in_cost;
    this.gate_out_cost=item.gate_out_cost;
   
  }
}

export class PackageDepotItem extends PackageDepotGO {
  public tariff_depot?: TariffDepotItem;
  public customer_company?:CustomerCompanyItem;
  constructor(item: Partial<PackageDepotItem> = {}) {
    super(item);
    this.tariff_depot = item.tariff_depot;
    this.customer_company=item.customer_company;
  }
}

export interface TariffDepotResult {
  items: TariffDepotItem[];
  totalCount: number;
}







export const GET_PACKAGE_DEPOT_QUERY = gql`
  query queryPackageDepot($where: package_depotFilterInput, $order:[package_depotSortInput!], $first: Int, $after: String, $last: Int, $before: String ) {
    packageDepotResult : queryPackageDepot(where: $where, order:$order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
      create_by
      create_dt
      customer_company_guid
      delete_dt
      free_storage
      guid
      lolo_cost
      preinspection_cost
      gate_in_cost
      gate_out_cost
      remarks
      storage_cal_cv
      storage_cost
      tariff_depot_guid
      update_by
      update_dt
      customer_company {
        alias
        city
        code
        country
        create_by
        create_dt
        delete_dt
        description
        effective_dt
        email
        fax
        guid
        name
        phone
        postal
        type_cv
        update_by
        update_dt
        website
      }
      tariff_depot {
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


export const UPDATE_PACKAGE_DEPOT = gql`
  mutation updatePackageDepot($pd: package_depotInput!) {
    updatePackageDepot(updatePackageDepot: $pd)
  }
`;

export const UPDATE_PACKAGE_DEPOTS = gql`
  mutation updatePackageDepots($guids: [String!]!,$free_storage:Int!,$lolo_cost:Float!,
  $preinspection_cost:Float!,$storage_cost:Float!,$gate_in_cost:Float!,$gate_out_cost:Float!,$remarks:String!,$storage_cal_cv:String!) {
    updatePackageDepots(updatePackageDepot_guids: $guids,free_storage:$free_storage,
    lolo_cost:$lolo_cost,preinspection_cost:$preinspection_cost,storage_cost:$storage_cost,gate_in_cost:$gate_in_cost,
    gate_out_cost:$gate_out_cost,remarks:$remarks,storage_cal_cv:$storage_cal_cv)
  }
`;

// export const UPDATE_TARIFF_CLEANING = gql`
//   mutation updateTariffClean($tc: tariff_cleaningInput!) {
//     updateTariffClean(updateTariffClean: $tc)
//   }
// `;


export class PackageDepotDS extends BaseDataSource<PackageDepotItem> {
  constructor(private apollo: Apollo) {
    super();
  }
  
  SearchPackageDepot(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<PackageDepotItem[]> {
    this.loadingSubject.next(true);
    if (!last)
      if (!first)
        first = 10;
    return this.apollo
      .query<any>({
        query: GET_PACKAGE_DEPOT_QUERY,
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
          const packageDepotResult = result.packageDepotResult || { nodes: [], totalCount: 0 };
          this.dataSubject.next(packageDepotResult.nodes);
          this.pageInfo = packageDepotResult.pageInfo;
          this.totalCount = packageDepotResult.totalCount;
          return packageDepotResult.nodes;
        })
      );
  }



  updatePackageDepot(pd: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_PACKAGE_DEPOT,
      variables: {
        pd
      }
    });
  }

  updatePackageDepots(guids: any,free_storage:any,lolo_cost:any,preinspection_cost:any,
    storage_cost:any,gate_in_cost:any, gate_out_cost:any, remarks:any,storage_cal_cv:any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_PACKAGE_DEPOTS,
      variables: {
        guids,
        free_storage,
        lolo_cost,
        preinspection_cost,
        storage_cost,
        gate_in_cost,
        gate_out_cost,
        remarks,
        storage_cal_cv
      }
    });
  }


}
