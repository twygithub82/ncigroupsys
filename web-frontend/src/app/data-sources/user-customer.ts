import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { BaseDataSource } from './base-ds';
import { CustomerCompanyItem } from './customer-company';
import { UserItem } from './user';
import { Injectable } from '@angular/core';

export class UserCustomerGO {
  public guid?: string;
  public user_id?: string;
  public customer_company_guid?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<UserCustomerGO> = {}) {
    this.guid = item.guid;
    this.user_id = item.user_id;
    this.customer_company_guid = item.customer_company_guid;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class UserCustomerItem extends UserCustomerGO {
  public user?: UserItem
  public customer_company?: CustomerCompanyItem
  constructor(item: Partial<UserCustomerItem> = {}) {
    super(item)
    this.user = item.user || undefined;
    this.customer_company = item.customer_company || undefined;
  }
}

const GET_USER_CUSTOMER = gql`
  query queryUserCustomer($where: user_customerFilterInput) {
    resultList: queryUserCustomer(where: $where) {
      nodes {
        customer_company_guid
        delete_dt
      }
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class UserCustomerDS extends BaseDataSource<UserCustomerItem> {
  constructor(private apollo: Apollo) {
    super();
  }
  getUserCustomerByUserId(userId: any): Observable<UserCustomerItem[]> {
    this.loadingSubject.next(true);
    const where = {
      user_id: { eq: userId },
    }

    return this.apollo
      .query<any>({
        query: GET_USER_CUSTOMER,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const resultList = result.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList.nodes);
          this.totalCount = resultList.totalCount;
          this.pageInfo = resultList.pageInfo;
          return resultList.nodes;
        })
      );
  }
}