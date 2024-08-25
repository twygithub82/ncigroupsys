import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client/core';
import { BaseDataSource } from './base-ds';
import { CleaningCategoryItem } from 'app/data-sources/cleaning-category'
import { CustomerCompanyItem } from 'app/data-sources/customer-company'
import { TariffLabourItem } from './tariff-labour';

export class PackageLabourGO {
  public guid?: string;
  public customer_company_guid?: string;
  public tariff_labour_guid?: string;
  public initial_cost?: number;
  public adjusted_cost?: number;
  public remarks?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<PackageLabourGO> = {}) {
    this.guid = item.guid;
    this.customer_company_guid = item.customer_company_guid;
    this.tariff_labour_guid = item.tariff_labour_guid;
    this.initial_cost = item.initial_cost;
    this.adjusted_cost = item.adjusted_cost;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class PackageLabourItem extends PackageLabourGO {
  public tariff_labour?: TariffLabourItem
  public customer_company?: CustomerCompanyItem
  constructor(item: Partial<PackageLabourItem> = {}) {
    super(item);
    this.tariff_labour = item.tariff_labour;
    this.customer_company = item.customer_company;
  }
}

export interface PackageLabourResult {
  items: PackageLabourItem[];
  totalCount: number;
}

export const UPDATE_PACKAGE_CLEANINGS = gql`
  mutation updatePackageCleans($guids: [String!]!,$remarks:String!,$adjusted_price:Float!) {
    updatePackageCleans(updatePackageClean_guids: $guids,remarks:$remarks,adjusted_price:$adjusted_price)
  }
`;
export const GET_COMPANY_CATEGORY_QUERY = gql`
  query  queryPackageLabour($where: package_labourFilterInput, $order: [package_labourSortInput!], $first: Int, $after: String, $last: Int, $before: String ) {
    companycategoryList:  queryPackageLabour(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
       totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      nodes {
        cost
        create_by
        create_dt
        customer_company_guid
        delete_dt
        guid
        remarks
        tariff_labour_guid
        update_by
        update_dt
        tariff_labour {
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
      }
    totalCount
    }
  }
`;

export class CustomerCompanyCleaningCategoryDS extends BaseDataSource<CustomerCompanyCleaningCategoryItem> {
  constructor(private apollo: Apollo) {
    super();
  }
  search(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<CustomerCompanyCleaningCategoryItem[]> {
    this.loadingSubject.next(true);
    if (!last)
      if (!first)
        first = 10;
    return this.apollo
      .query<any>({
        query: GET_COMPANY_CATEGORY_QUERY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as CustomerCompanyCleaningCategoryItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const list = result.companycategoryList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(list.nodes);
          this.pageInfo = list.pageInfo;
          this.totalCount = list.totalCount;
          return list.nodes;
        })
      );
  }

  updatePackageCleanings(guids: string[], remarks: string, adjusted_price: number): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_PACKAGE_CLEANINGS,
      variables: {
        guids,
        remarks,
        adjusted_price
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }

}
