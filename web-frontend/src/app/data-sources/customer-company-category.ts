import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client/core';
import { BaseDataSource } from './base-ds';
import {CleaningCategoryItem } from 'app/data-sources/cleaning-category'
import {CustomerCompanyItem} from 'app/data-sources/customer-company'
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
    public cleaning_category? : CleaningCategoryItem
    public customer_company? :CustomerCompanyItem
    constructor(item: Partial<CustomerCompanyCleaningCategoryItem> = {}) {
        super(item);
        this.cleaning_category= item.cleaning_category;
        this.customer_company=item.customer_company;
    }
}

export interface CustomerCompanyCleaningCategoryResult {
    items: CustomerCompanyCleaningCategoryItem[];
    totalCount: number;
}

export const GET_COMPANY_CATEGORY_QUERY = gql`
  query  queryPackageCleaning($where: customer_company_cleaning_category_with_customer_companyFilterInput, $order: [customer_company_cleaning_category_with_customer_companySortInput!], $first: Int, $after: String, $last: Int, $before: String ) {
    companycategoryList:  queryPackageCleaning(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        guid
        customer_company_guid
        cleaning_category_guid
        initial_price
        adjusted_price
        remarks
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
    public totalCount = 0;
    constructor(private apollo: Apollo) {
        super();
    }
    search(where?: any, order?: any, first: number = 10, after?: string, last?: number, before?: string): Observable<CustomerCompanyCleaningCategoryItem[]> {
        this.loadingSubject.next(true);
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
                    this.totalCount = list.totalCount;
                    return list.nodes;
                })
            );
    }

}
