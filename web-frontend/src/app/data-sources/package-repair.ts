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
import { lab } from 'd3';
import { CustomerCompanyItem } from './customer-company';
import { TariffRepairItem } from './tariff-repair';
export class PackageRepairGO {
  public guid?: string;
  public customer_company_guid?:string;
  public tariff_repair_guid?:string;
  public labour_hour?:number;
  public material_cost?: number;
  public remarks?:string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;
  
  constructor(item: Partial<PackageRepairGO> = {}) {
    this.guid = item.guid;
    if (!this.guid) this.guid = '';
    this.customer_company_guid = item.customer_company_guid;
    this.tariff_repair_guid=item.tariff_repair_guid;
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

export class PackageRepairItem extends PackageRepairGO {
  public tariff_repair?: TariffRepairItem;
  public customer_company?:CustomerCompanyItem;

  constructor(item: Partial<PackageRepairItem> = {}) {
    super(item);
    this.tariff_repair = item.tariff_repair;
    this.customer_company=item.customer_company;
  }
}
export interface TariffRepairResult {
  items: PackageRepairItem[];
  totalCount: number;
}



export const GET_PACKAGE_REPAIR_QUERY = gql`
  query queryParkageRepair($where: package_repairFilterInput, $order:[package_repairSortInput!], $first: Int, $after: String, $last: Int, $before: String ) {
    packageRepairResult : queryPackageRepair(where: $where, order:$order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
      create_by
      create_dt
      customer_company_guid
      delete_dt
      guid
      labour_hour
      material_cost
      remarks
      tariff_repair_guid
      update_by
      update_dt
        customer_company {
          address_line1
          address_line2
          agreement_due_dt
          alias
          city
          code
          country
          create_by
          create_dt
          currency_cv
          delete_dt
          description
          effective_dt
          email
          fax
          guid
          name
          phone
          postal
          tariff_depot_guid
          type_cv
          update_by
          update_dt
          website
        }
        tariff_repair {
          alias
          create_by
          create_dt
          delete_dt
          dimension
          group_name_cv
          guid
          height_diameter
          height_diameter_unit_cv
          labour_hour
          length
          length_unit_cv
          material_cost
          part_name
          remarks
          subgroup_name_cv
          thickness
          thickness_unit_cv
          update_by
          update_dt
          width_diameter
          width_diameter_unit_cv
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

export const UPDATE_PACKAGE_REPAIRS = gql`
  mutation updatePackageRepairs($updatePackageRepair_guids: [String!]!,$material_cost:Float!,$labour_hour:Float!,$remarks:String!) {
    updatePackageRepairs(updatePackageRepair_guids: $updatePackageRepair_guids,material_cost:$material_cost,labour_hour:$labour_hour,remarks:$remarks)
  }
`;

export const UPDATE_PACKAGE_REPAIR = gql`
  mutation updatePackageRepair($td: package_repairInput!) {
    updatePackageRepair(updatePackageRepair: $td)
  }
`;



export const UPDATE_PACKAGE_REPAIRS_MATERIAL_COST = gql`
  mutation updatePackageRepair_MaterialCost($group_name_cv:String,$subgroup_name_cv:String,
    $part_name:String,$customer_company_guids: [String!],$material_cost_percentage:Float!) {
    updatePackageRepair_MaterialCost(group_name_cv:$group_name_cv,subgroup_name_cv:$subgroup_name_cv,
    part_name:$part_name,customer_company_guids:$customer_company_guids,material_cost_percentage:$material_cost_percentage)
  }
`;




export class PackageRepairDS extends BaseDataSource<PackageRepairItem> {
  constructor(private apollo: Apollo) {
    super();
  }
  
  SearchPackageRepair(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<PackageRepairItem[]> {
    this.loadingSubject.next(true);
    if (!last)
      if (!first)
        first = 10;
    return this.apollo
      .query<any>({
        query: GET_PACKAGE_REPAIR_QUERY,
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
          const packRepairResult = result.packageRepairResult || { nodes: [], totalCount: 0 };
          this.dataSubject.next(packRepairResult.nodes);
          this.pageInfo = packRepairResult.pageInfo;
          this.totalCount = packRepairResult.totalCount;
          return packRepairResult.nodes;
        })
      );
  }


  

    updatePackageRepair(td: any): Observable<any> {
      return this.apollo.mutate({
        mutation: UPDATE_PACKAGE_REPAIR,
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

    updatePackageRepairs(updatePackageRepair_guids: any,material_cost:any,labour_hour:any,
      remarks:any): Observable<any> {
      return this.apollo.mutate({
        mutation: UPDATE_PACKAGE_REPAIRS,
        variables: {
          updatePackageRepair_guids,
          material_cost,
          labour_hour,
          remarks
        }
      }).pipe(
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of(0); // Return an empty array on error
        }),
      );
    }

    updatePackageRepairs_MaterialCost(group_name_cv:any,subgroup_name_cv:any,part_name:any,
      customer_company_guids:any,material_cost_percentage:any): Observable<any> {
      return this.apollo.mutate({
        mutation: UPDATE_PACKAGE_REPAIRS_MATERIAL_COST,
        variables: {
          group_name_cv,
          subgroup_name_cv,
          part_name,
          customer_company_guids,
          material_cost_percentage
        }
      }).pipe(
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of(0); // Return an empty array on error
        }),
      );
    }

    
}
