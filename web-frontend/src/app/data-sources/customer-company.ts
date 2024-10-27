import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client/core';
import { BaseDataSource } from './base-ds';
import { CurrencyItem } from './currency';
import { ContactPersonItem } from './contact-person';

export class CustomerCompanyGO {
    public guid?: string;
    public name?: string;
    public code?: string;
    public tariff_depot_guid?: string;
    public address_line1?: string;
    public address_line2?: string;
    public city?: string;
    public country?: string;
    public postal?: string;
    public phone?: string;
    public email?: string;
    public website?: string;
    public effective_dt?: number;
    public agreement_due_dt?: number;
    public def_template_guid?: string;
    public def_tank_guid?: string;
    public type_cv?: string;
    public remarks?: string;
    public currency_guid?:string;
    public main_customer_guid?: string;
    
    public create_dt?: number;
    public create_by?: string;
    public update_dt?: number;
    public update_by?: string;
    public delete_dt?: number;

    constructor(item: Partial<CustomerCompanyGO> = {}) {
        this.guid = item.guid;
        this.name = item.name;
        this.code = item.code;
        this.tariff_depot_guid = item.tariff_depot_guid;
        this.address_line1 = item.address_line1;
        this.address_line2 = item.address_line2;
        this.city = item.city;
        this.country = item.country;
        this.postal = item.postal;
        this.phone = item.phone;
        this.email = item.email;
        this.website = item.website;
        this.effective_dt = item.effective_dt;
        this.agreement_due_dt = item.agreement_due_dt;
        this.def_template_guid = item.def_template_guid;
        this.def_tank_guid = item.def_tank_guid;
        this.type_cv = item.type_cv;
        this.remarks = item.remarks;
        this.currency_guid=item.currency_guid;
        this.main_customer_guid = item.main_customer_guid;
        //this.billing_branch = item.billing_branch;
        this.create_dt = item.create_dt;
        this.create_by = item.create_by;
        this.update_dt = item.update_dt;
        this.update_by = item.update_by;
        this.delete_dt = item.delete_dt;
    }
}

export class CustomerCompanyItem extends CustomerCompanyGO {
    public currency?: CurrencyItem;
    public cc_contact_person?:ContactPersonItem[]=[];

    constructor(item: Partial<CustomerCompanyItem> = {}) {
        super(item);
        this.currency = item.currency;
        this.cc_contact_person=item.cc_contact_person;
    }
}

export interface CustomerCompanyResult {
    items: CustomerCompanyItem[];
    totalCount: number;
}

export const UPDATE_CUSTOMER_COMPANY = gql`
    mutation updateCustomerCompany($customer: CustomerRequestInput!,$contactPersons:[customer_company_contact_personInput],$billingBranches:[BillingBranchRequestInput]) {
    updateCustomerCompany(customer: $customer,contactPersons:$contactPersons,billingBranches:$billingBranches)
  }
`

export const ADD_CUSTOMER_COMPANY = gql`
    mutation addCustomerCompany($customer: CustomerRequestInput!,$contactPersons:[customer_company_contact_personInput],$billingBranches:[BillingBranchRequestInput]) {
    addCustomerCompany(customer: $customer,contactPersons:$contactPersons,billingBranches:$billingBranches)
  }
`

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
        city
        code
        country
        create_by
        create_dt
        delete_dt
        effective_dt
        def_tank_guid
        email
        guid
        name
        phone
        postal
        type_cv
        update_by
        update_dt
        website
        main_customer_guid
        remarks
         cc_contact_person {
          create_by
          create_dt
          customer_guid
          delete_dt
          department
          did
          email
          email_alert
          guid
          job_title
          name
          phone
          title_cv
          update_by
          update_dt
        }
        currency_guid
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

export const GET_COMPANY_AND_BRANCH = gql`
  query queryCustomerCompany($where: customer_companyFilterInput, $order: [customer_companySortInput!]) {
    resultList: queryCustomerCompany(where: $where, order: $order) {
      nodes {
        guid
        code
        name
        type_cv
      }
    }
  }
`

export class CustomerCompanyDS extends BaseDataSource<CustomerCompanyItem> {
    constructor(private apollo: Apollo) {
        super();
    }
    loadItems(where?: any, order?: any, first?: any, after?: any, last?: any, before?: any): Observable<CustomerCompanyItem[]> {
        this.loadingSubject.next(true);
        return this.apollo
            .watchQuery<any>({
                query: SEARCH_COMPANY_QUERY,
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

    getCustomerAndBranch(guid: string) {
        this.loadingSubject.next(true);
        const where = {
            or: [
                { guid: { eq: guid } },
                { main_customer_guid: { eq: guid } }
            ]
        }
        const order = {

        }
        return this.apollo
            .query<any>({
                query: GET_COMPANY_AND_BRANCH,
                variables: { where, order },
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
                    const list = result.resultList || { nodes: [], totalCount: 0 };
                    this.dataSubject.next(list.nodes);
                    this.pageInfo = list.pageInfo;
                    this.totalCount = list.totalCount;
                    return list.nodes;
                })
            );
    }

    displayName(cc?: CustomerCompanyItem): string {
        return cc?.code ? (cc?.name?`${cc.code} (${cc.name})`:`${cc.code}`) : '';
    }

    AddCustomerCompany(customer:any,contactPersons:any,billingBranches:any):Observable<any>
    {
        return this.apollo.mutate({
            mutation: ADD_CUSTOMER_COMPANY,
            variables: {
              customer,
              contactPersons,
              billingBranches
            }
          }).pipe(
            catchError((error: ApolloError) => {
              console.error('GraphQL Error:', error);
              return of(0); // Return an empty array on error
            }),
          );

    }

    UpdateCustomerCompany(customer:any,contactPersons:any,billingBranches:any):Observable<any>
    {
        return this.apollo.mutate({
            mutation: UPDATE_CUSTOMER_COMPANY,
            variables: {
              customer,
              contactPersons,
              billingBranches
            }
          }).pipe(
            catchError((error: ApolloError) => {
              console.error('GraphQL Error:', error);
              return of(0); // Return an empty array on error
            }),
          );

    }
}
