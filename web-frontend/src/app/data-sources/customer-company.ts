import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client/core';

export class CustomerCompanyItem {
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
    public currency_cv?: string;
    public create_dt?: number;
    public create_by?: string;
    public update_dt?: number;
    public update_by?: string;
    public delete_dt?: number;

    constructor(item: Partial<CustomerCompanyItem> = {}) {
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
        this.currency_cv = item.currency_cv;
        this.create_dt = item.create_dt;
        this.create_by = item.create_by;
        this.update_dt = item.update_dt;
        this.update_by = item.update_by;
        this.delete_dt = item.delete_dt;
    }
}

export interface CustomerCompanyResult {
    items: CustomerCompanyItem[];
    totalCount: number;
}

export const GET_COMPANY_QUERY = gql`
  query getCompany($where: customer_companyFilterInput, $order: [customer_companySortInput!]) {
    companyList: company(where: $where, order: $order) {
      nodes {
        code
        name
        guid
      }
    }
  }
`;

export const GET_COMPANY_BY_ID = gql`
  query getCompanyById($id: ID!) {
    company(id: $id) {
      code
      name
      guid
    }
  }
`;

export class CustomerCompanyDS extends DataSource<CustomerCompanyItem> {
    private itemsSubjects = new BehaviorSubject<CustomerCompanyItem[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    public totalCount = 0;
    constructor(private apollo: Apollo) {
        super();
    }
    loadItems(where?: any, order?: any) {
        this.loadingSubject.next(true);
        this.apollo.watchQuery<any>({
            query: GET_COMPANY_QUERY,
            variables: { where, order }
        })
        .valueChanges
        .pipe(
            map((result) => result.data),
            catchError((error: ApolloError) => {
                console.error('GraphQL Error:', error);
                return of([] as CustomerCompanyItem[]); // Return an empty array on error
            }),
            finalize(() => this.loadingSubject.next(false)),
        )
        .subscribe(result => {
            this.itemsSubjects.next(result.companyList.nodes);
            this.totalCount = result.totalCount;
        });
    }

    getCompanyById(id: string): Observable<any> {
        return this.apollo.watchQuery<any>({
            query: GET_COMPANY_BY_ID,
            variables: { id }
        }).valueChanges.pipe(
            map(result => result.data.company)
        );
    }

    connect(): Observable<CustomerCompanyItem[]> {
        return this.itemsSubjects.asObservable();
    }

    disconnect(): void {
        // this.itemsSubjects.forEach(subject => subject.complete());
        this.itemsSubjects.complete();
        this.loadingSubject.complete();
    }

    // connectAlias(alias: string): Observable<CustomerCompanyItem[]> {
    //     let subject = this.itemsSubjects.get(alias);
    //     if (!subject) {
    //         subject = new BehaviorSubject<CustomerCompanyItem[]>([]);
    //         this.itemsSubjects.set(alias, subject);
    //     }
    //     return subject.asObservable();
    // }
}
