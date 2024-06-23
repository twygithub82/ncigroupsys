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
    public create_dt?: number;
    public create_by?: string;
    public update_dt?: number;
    public update_by?: string;
    public delete_dt?: number;

    constructor(item: Partial<CustomerCompanyItem> = {}) {
        this.guid = item.guid;
        this.name = item.name;
        this.code = item.code;
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
  query getCompany($customerCompany: CusComTypeInput!, $where: customer_companyFilterInput) {
    company(customerCompany: $customerCompany, where: $where) {
      nodes {
        code
        name
        guid
      }
    }
  }
`;

export class CustomerCompanyDS extends DataSource<CustomerCompanyItem> {
    private itemsSubject = new BehaviorSubject<CustomerCompanyItem[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    public totalCount = 0;
    public totalCounts = new Map<string, number>();
    constructor(private apollo: Apollo) {
        super();
    }
    loadItems(customerCompany: any, where: any) {
        this.loadingSubject.next(true);

        this.apollo
            .watchQuery<any>({
                query: GET_COMPANY_QUERY,
                variables: { customerCompany, where }
            })
            .valueChanges
            .pipe(
                map((result) => result.data),
                catchError((error: ApolloError) => {
                    console.error('GraphQL Error:', error);
                    return of([]); // Return an empty array on error
                }),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(result => {
                console.log(result)
                // aliases.forEach(alias => {
                //     // this.itemsSubject = [];
                //     // this.totalCounts.set(alias, result[alias].length);
                // });
            });
    }

    connect(): Observable<CustomerCompanyItem[]> {
        return this.itemsSubject.asObservable();
    }

    disconnect(): void {
        // this.itemsSubjects.forEach(subject => subject.complete());
        this.itemsSubject.complete();
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
