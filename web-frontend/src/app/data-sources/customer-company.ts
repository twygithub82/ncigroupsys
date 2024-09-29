import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client/core';
import { BaseDataSource } from './base-ds';
import { CurrencyItem } from './currency';

export class CustomerCompanyGO {
    public guid?: string;
    public name?: string;
    public code?: string;
    public description?: string;
    public alias?: string;
    public tariff_depot_guid?: string;
    public address_line1?: string;
    public address_line2?: string;
    public city?: string;
    public country?: string;
    public postal?: string;
    public phone?: string;
    public fax?: string;
    public email?: string;
    public website?: string;
    public effective_dt?: number;
    public agreement_due_dt?: number;
   
    public create_dt?: number;
    public create_by?: string;
    public update_dt?: number;
    public update_by?: string;
    public delete_dt?: number;

    constructor(item: Partial<CustomerCompanyGO> = {}) {
        this.guid = item.guid;
        this.name = item.name;
        this.code = item.code;
        this.description = item.description;
        this.alias = item.alias;
        this.tariff_depot_guid = item.tariff_depot_guid;
        this.address_line1 = item.address_line1;
        this.address_line2 = item.address_line2;
        this.city = item.city;
        this.country = item.country;
        this.postal = item.postal;
        this.phone = item.phone;
        this.fax = item.fax;
        this.email = item.email;
        this.website = item.website;
        this.effective_dt = item.effective_dt;
        this.agreement_due_dt = item.agreement_due_dt;
       
        this.create_dt = item.create_dt;
        this.create_by = item.create_by;
        this.update_dt = item.update_dt;
        this.update_by = item.update_by;
        this.delete_dt = item.delete_dt;
    }
}

export class CustomerCompanyItem extends CustomerCompanyGO {
    public currency?:CurrencyItem;
    constructor(item: Partial<CustomerCompanyItem> = {}) {
        super(item);
        this.currency = item.currency;
    }
}

export interface CustomerCompanyResult {
    items: CustomerCompanyItem[];
    totalCount: number;
}

export const GET_COMPANY_QUERY = gql`
  query queryCustomerCompany($where: customer_companyFilterInput, $order: [customer_companySortInput!],$first: Int) {
    companyList: queryCustomerCompany(where: $where, order: $order,first: $first) {
      nodes {
        code
        name
        guid
      }
    }
  }
`;

export const SEARCH_COMPANY_QUERY = gql`
  query queryCustomerCompany($where: customer_companyFilterInput, $order: [customer_companySortInput!],$first: Int, $after: String, $last: Int, $before: String ) {
    companyList: queryCustomerCompany(where: $where, order: $order,first: $first, after: $after, last: $last, before: $before) {
      nodes {
        address_line1
        address_line2
        agreement_due_dt
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
        currency {
            create_by
            create_dt
            currency_code
            currency_name
            delete_dt
            guid
            is_active
            rate
            sequence
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

export class CustomerCompanyDS extends BaseDataSource<CustomerCompanyItem> {
    constructor(private apollo: Apollo) {
        super();
    }
    loadItems(where?: any, order?: any, first?: any, after?: any, last?: any, before?: any): Observable<CustomerCompanyItem[]> {
        this.loadingSubject.next(true);
        return this.apollo
            .watchQuery<any>({
                query: GET_COMPANY_QUERY,
                variables: { where, order, first, after, last, before },
                fetchPolicy: 'no-cache' // Ensure fresh data
            })
            .valueChanges
            .pipe(
                map((result) => result.data),
                catchError((error: ApolloError) => {
                    console.error('GraphQL Error:', error);
                    return of([] as CustomerCompanyItem[]); // Return an empty array on error
                }),
                finalize(() =>
                    this.loadingSubject.next(false)
                ),
                map((result) => {
                    const list = result.companyList || { nodes: [], totalCount: 0 };
                    this.dataSubject.next(list.nodes);

                    this.totalCount = list.totalCount;
                    return list.nodes;
                })
            );
    }

    getOwnerList(owner_guid?: string): Observable<CustomerCompanyItem[]> {
        this.loadingSubject.next(true);
        const where = {
            guid: { eq: owner_guid },
            type_cv: { in: ["OWNER", "LEESSEE"] }
        }
        const order = {

        }
        return this.apollo
            .watchQuery<any>({
                query: GET_COMPANY_QUERY,
                variables: { where, order },
                fetchPolicy: 'no-cache' // Ensure fresh data
            })
            .valueChanges
            .pipe(
                map((result) => result.data),
                catchError((error: ApolloError) => {
                    console.error('GraphQL Error:', error);
                    return of([] as CustomerCompanyItem[]); // Return an empty array on error
                }),
                finalize(() =>
                    this.loadingSubject.next(false)
                ),
                map((result) => {
                    const list = result.companyList || { nodes: [], totalCount: 0 };
                    this.dataSubject.next(list.nodes);

                    this.totalCount = list.totalCount;
                    return list.nodes;
                })
            );
    }

    search(where?: any, order?: any, first?: any, after?: any, last?: any, before?: any): Observable<CustomerCompanyItem[]> {
        this.loadingSubject.next(true);
        if (!last)
            if (!first)
                first = 10;
        return this.apollo
            .query<any>({
                query: SEARCH_COMPANY_QUERY,
                variables: { where, order, first, after, last, before },
                fetchPolicy: 'no-cache' // Ensure fresh data
            })
            .pipe(
                map((result) => result.data),
                catchError((error: ApolloError) => {
                    console.error('GraphQL Error:', error);
                    return of([] as CustomerCompanyItem[]); // Return an empty array on error
                }),
                finalize(() =>
                    this.loadingSubject.next(false)
                ),
                map((result) => {
                    const list = result.companyList || { nodes: [], totalCount: 0 };
                    this.dataSubject.next(list.nodes);
                    this.pageInfo = list.pageInfo;
                    this.totalCount = list.totalCount;
                    return list.nodes;
                })
            );
    }

    displayName(cc?: CustomerCompanyItem): string {
        return cc?.code ? `${cc.code} (${cc.name})` : '';
    }
}
