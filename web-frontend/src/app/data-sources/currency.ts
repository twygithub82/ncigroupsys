import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { BaseDataSource } from './base-ds';

export class CurrencyItem {
  public guid?: string;
  public currency_code?:string;
  public currency_name?:string;
  public rate?:number;
  public sequence?:number;
  public is_active?: boolean;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<CurrencyItem> = {}) {
    this.guid = item.guid;
    this.currency_code = item.currency_code;
    this.currency_name=item.currency_name;
    this.is_active=item.is_active;
    this.rate=item.rate;
    this.sequence=item.sequence;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}



const GET_CURRENCY= gql`
  query queryCurrency($where: currencyFilterInput, $order: [currencySortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryCurrency(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      totalCount
      nodes {
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
        customer_company {
          guid
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export const ADD_CURRENCY = gql`
   mutation AddCurrency($currencies: [currencyInput!]!) {
    addCurrency(currencies: $currencies)
  }
`;

export const UPDATE_CURRENCY = gql`
  mutation UpdateCurrency($editCurrency: currencyInput!) {
    updateCurrency(editCurrency: $editCurrency)
  }
`;

export const DELETE_CURRENCY = gql`
  mutation DeleteCurrency($deleteCurrency: currencyInput!) {
    deleteCurrency(deleteCurrency: $deleteCurrency)
  }
`;
export class CurrencyDS extends BaseDataSource<CurrencyItem> {
  constructor(private apollo: Apollo) {
    super();
  }
  search(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<CurrencyItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_CURRENCY,
        variables: { where, order, first, after, last, before },
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

   addCurrency(currencies: any): Observable<any> {
      this.actionLoadingSubject.next(true);
      return this.apollo.mutate({
        mutation: ADD_CURRENCY,
        variables: {
          currencies
        }
      }).pipe(
        finalize(() => {
          this.actionLoadingSubject.next(false);
        })
      );
    }
  
    updateCurrency(editCurrency: any): Observable<any> {
      this.actionLoadingSubject.next(true);
      return this.apollo.mutate({
        mutation: UPDATE_CURRENCY,
        variables: {
          editCurrency
        }
      }).pipe(
        finalize(() => {
          this.actionLoadingSubject.next(false);
        })
      );
    }


    deleteCurrency(deleteCurrency: any): Observable<any> {
      this.actionLoadingSubject.next(true);
      return this.apollo.mutate({
        mutation: DELETE_CURRENCY,
        variables: {
          deleteCurrency
        }
      }).pipe(
        finalize(() => {
          this.actionLoadingSubject.next(false);
        })
      );
    }
}
