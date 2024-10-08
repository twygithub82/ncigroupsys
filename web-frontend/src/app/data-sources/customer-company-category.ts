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
export class CustomerCompanyCleaningCategoryGO {
  public guid?: string;
  public customer_company_guid?: string;
  public cleaning_category_guid?: string;
  public initial_price?: number;
  public adjusted_price?: number;
  public remarks?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<CustomerCompanyCleaningCategoryGO> = {}) {
    this.guid = item.guid;
    this.customer_company_guid = item.customer_company_guid;
    this.cleaning_category_guid = item.cleaning_category_guid;
    this.initial_price = item.initial_price;
    this.adjusted_price = item.adjusted_price;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class CustomerCompanyCleaningCategoryItem extends CustomerCompanyCleaningCategoryGO {
  public cleaning_category?: CleaningCategoryItem
  public customer_company?: CustomerCompanyItem
  constructor(item: Partial<CustomerCompanyCleaningCategoryItem> = {}) {
    super(item);
    this.cleaning_category = item.cleaning_category;
    this.customer_company = item.customer_company;
  }
}

export interface CustomerCompanyCleaningCategoryResult {
  items: CustomerCompanyCleaningCategoryItem[];
  totalCount: number;
}

export const UPDATE_PACKAGE_CLEANINGS = gql`
  mutation updatePackageCleans($guids: [String!]!,$remarks:String!,$adjusted_price:Float!) {
    updatePackageCleans(updatePackageClean_guids: $guids,remarks:$remarks,adjusted_price:$adjusted_price)
  }
`;

export const GET_DISTINCT_CLASS_NO =gql`
query {
  queryDistinctClassNo
}`;

export const GET_COMPANY_CATEGORY_QUERY = gql`
  query  queryPackageCleaning($where: customer_company_cleaning_category_with_customer_companyFilterInput, $order: [customer_company_cleaning_category_with_customer_companySortInput!], $first: Int, $after: String, $last: Int, $before: String ) {
    companycategoryList:  queryPackageCleaning(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
       totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      nodes {
        adjusted_price
      cleaning_category_guid
      create_by
      create_dt
      customer_company_guid
      delete_dt
      guid
      initial_price
      remarks
      update_by
      update_dt
        cleaning_category {
        cost
        create_by
        create_dt
        delete_dt
        description
        guid
        name
        sequence
        update_by
        update_dt
        tariff_cleanings {
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
          msds_guid
          nature_cv
          open_on_gate_cv
          remarks
          un_no
          update_by
          update_dt
        }
      }
        customer_company {
            address_line1
            address_line2
            agreement_due_dt
            city
            code
            country
            create_by
            create_dt
            delete_dt
            effective_dt
            email
            guid
            name
            phone
            postal
            type_cv
            update_by
            update_dt
            website
            remarks
            main_customer_guid
            billing_branch
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

  queryDistinctClassNo():Observable<string[]>{
    this.loadingSubject.next(true);
    
    return this.apollo
      .query<any>({
        query: GET_DISTINCT_CLASS_NO,
        variables: {},
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
          const list = result.queryDistinctClassNo || { nodes: [], totalCount: 0 };
          this.dataSubject.next(list);
          this.pageInfo = list.pageInfo;
          this.totalCount = list.totalCount;
          return list;
        })
      );
  }

}
