import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client/core';
import { BaseDataSource } from './base-ds';
import { CurrencyItem } from './currency';
import { CustomerCompanyItem } from './customer-company';

export class ContactPersonItem {
    public guid?: string;
    public customer_guid?:string;
    public customer_company?:CustomerCompanyItem;
    public name?: string;
    public title_cv?: string;
    public job_title?: string;
    public email?: string;
    public department?: string;
    public did?: string;
    public phone?:string;
    public email_alert?: number;
    public create_dt?: number;
    public create_by?: string;
    public update_dt?: number;
    public update_by?: string;
    public delete_dt?: number;

    constructor(item: Partial<ContactPersonItem> = {}) {
        this.guid = item.guid;
        this.name = item.name;
        this.customer_guid=item.customer_guid;
        this.customer_company=item.customer_company;
    
        this.title_cv = item.title_cv;
        this.job_title = item.job_title;
        this.email = item.email;
        this.department = item.department;
        this.did = item.did;
        this.phone=item.phone;
        this.email_alert = item.email_alert;
        this.email = item.email;
        
        this.create_dt = item.create_dt;
        this.create_by = item.create_by;
        this.update_dt = item.update_dt;
        this.update_by = item.update_by;
        this.delete_dt = item.delete_dt;
    }
}
export class ContactPersonItemAction extends ContactPersonItem {
    public action?: string;
   

    constructor(item: Partial<any> = {}) {
        super(item);
        this.action=item['action'];
    }
}


export const GET_CONTACT_PERSON = gql`
  query queryCustomerCompany($where: customer_company_contact_personFilterInput, $order: [customer_company_contact_personSortInput!],$first: Int) {
    contactPersonList: queryContactPerson(where: $where, order: $order,first: $first) {
      nodes {
           create_by
      create_dt
      customer_guid
      delete_dt
      department
      department_id
      email
      email_alert
      guid
      job_title
      name
      phone
      title_cv
      update_by
      update_dt
      customer_company {
        address_line1
        address_line2
        agreement_due_dt
        city
        code
        country
        create_by
        create_dt
        currency_guid
        def_template_guid
        delete_dt
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



export class CustomerCompanyContactPersonDS extends BaseDataSource<ContactPersonItem> {
    constructor(private apollo: Apollo) {
        super();
    }
    loadItems(where?: any, order?: any, first?: any, after?: any, last?: any, before?: any): Observable<ContactPersonItem[]> {
        this.loadingSubject.next(true);
        return this.apollo
            .query<any>({
                query: GET_CONTACT_PERSON,
                variables: { where, order, first, after, last, before },
                fetchPolicy: 'no-cache' // Ensure fresh data
            })
            .pipe(
                map((result) => result.data),
                catchError((error: ApolloError) => {
                    console.error('GraphQL Error:', error);
                    return of([] as ContactPersonItem[]); // Return an empty array on error
                }),
                finalize(() =>
                    this.loadingSubject.next(false)
                ),
                map((result) => {
                    const list = result.contactPersonList || { nodes: [], totalCount: 0 };
                    this.dataSubject.next(list.nodes);

                    this.totalCount = list.totalCount;
                    return list.nodes;
                })
            );
    }

  

    search(where?: any, order?: any, first?: any, after?: any, last?: any, before?: any): Observable<ContactPersonItem[]> {
        this.loadingSubject.next(true);
        if (!last)
            if (!first)
                first = 10;
        return this.apollo
            .query<any>({
                query: GET_CONTACT_PERSON,
                variables: { where, order, first, after, last, before },
                fetchPolicy: 'no-cache' // Ensure fresh data
            })
            .pipe(
                map((result) => result.data),
                catchError((error: ApolloError) => {
                    console.error('GraphQL Error:', error);
                    return of([] as ContactPersonItem[]); // Return an empty array on error
                }),
                finalize(() =>
                    this.loadingSubject.next(false)
                ),
                map((result) => {
                    const list = result.contactPersonList || { nodes: [], totalCount: 0 };
                    this.dataSubject.next(list.nodes);
                    this.pageInfo = list.pageInfo;
                    this.totalCount = list.totalCount;
                    return list.nodes;
                })
            );
    }

   
}
