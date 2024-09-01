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
import { TariffResidueItem } from './tariff-residue';
import { CustomerCompanyItem } from './customer-company';
export class PackageResidueGO {
  public guid?: string;
  
  public description?: string;
  public customer_company_guid?:string;
  public tariff_residue_guid?:string;
  public cost?: number;
  public remarks?:string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;
  
  constructor(item: Partial<PackageResidueGO> = {}) {
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



export class PackageResidueItem extends PackageResidueGO {
  public tariff_residue?: TariffResidueItem;
  public customer_company?:CustomerCompanyItem;

  constructor(item: Partial<PackageResidueItem> = {}) {
    super(item);
    this.tariff_residue = item.tariff_residue;
    this.customer_company=item.customer_company;
  }
}

export interface PackageResidueResult {
  items: PackageResidueItem[];
  totalCount: number;
}


export const GET_PACKAGE_RESIDUE_QUERY = gql`
  query queryTariffResidue($where: package_residueFilterInput, $order:[package_residueSortInput!], $first: Int, $after: String, $last: Int, $before: String ) {
    packageResidueResult : queryPackageResidue(where: $where, order:$order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
      cost
      create_by
      create_dt
      customer_company_guid
      delete_dt
      guid
      remarks
      tariff_residue_guid
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


export const UPDATE_PACKAGE_RESIDUE = gql`
  mutation updatePackageResidue($pr: package_residueInput!) {
    updatePackageResidue(updatePackageResidue: $pr)
  }
`;

export const UPDATE_PACKAGE_RESIDUES = gql`
  mutation updatePackageResidues($guids: [String!]!,$cost:Float!,$remarks:String!) {
    updatePackageResidues(updatePackageResidue_guids: $guids,cost:$cost,remarks:$remarks)
  }
`;


export class PackageResidueDS extends BaseDataSource<PackageResidueItem> {
  constructor(private apollo: Apollo) {
    super();
  }
  
  SearchPackageResidue(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<PackageResidueItem[]> {
    this.loadingSubject.next(true);
    if (!last)
      if (!first)
        first = 10;
    return this.apollo
      .query<any>({
        query: GET_PACKAGE_RESIDUE_QUERY,
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
          const packResidueResult = result.packageResidueResult || { nodes: [], totalCount: 0 };
          this.dataSubject.next(packResidueResult.nodes);
          this.pageInfo = packResidueResult.pageInfo;
          this.totalCount = packResidueResult.totalCount;
          return packResidueResult.nodes;
        })
      );
  }


    updatePackageResidue(pr: any): Observable<any> {
      return this.apollo.mutate({
        mutation: UPDATE_PACKAGE_RESIDUE,
        variables: {
          pr
        }
      }).pipe(
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of(0); // Return an empty array on error
        }),
      );
    }

    updatePackageResidues(guids: String[],cost:number,remarks:String): Observable<any> {
      return this.apollo.mutate({
        mutation: UPDATE_PACKAGE_RESIDUES,
        variables: {
          guids,
          cost,
          remarks
        }
      }).pipe(
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of(0); // Return an empty array on error
        }),
      );
    }
}
