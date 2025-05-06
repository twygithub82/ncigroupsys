import { ApolloError } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { BaseDataSource } from './base-ds';
import { CleaningMethodItem } from './cleaning-method';

export const ADD_CLEANING_FORMULA = gql`
  mutation addCleaningFormula($cf: cleaning_formulaInput!) {
    addCleaningFormula(newCleanFormula: $cf)
  }
  `;

export const UPDATE_CLEANING_FORMULA = gql`
   mutation updateCleaningFormula($cf: cleaning_formulaInput!) {
    updateCleaningFormula(updateCleanFormula: $cf)
  }
  `;

export const DELETE_CLEANING_FORMULA = gql`
   mutation deleteCleaningFormula($guids: [String!]!) {
    deleteCleaningFormula(deleteCleanFormula_guids: $guids)
  }
`;

export const SEARCH_CLEANING_FORMULA_QUERY = gql`
  query queryCleaningFormula($where: cleaning_formulaFilterInput , $order:[cleaning_formulaSortInput!], $first: Int, $after: String, $last: Int, $before: String){
    queryCleaningFormula(where: $where , order: $order, first: $first, after: $after, last: $last, before: $before){
      nodes {
          cleaning_method_formula (where:{delete_dt:{eq:null}}) {
            formula_guid
            guid
            method_guid
            cleaning_method {
              category_guid
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
          }
          create_by
          create_dt
          delete_dt
          description
          duration
          guid
          update_by
          update_dt
      }
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export const SEARCH_CLEANING_FORMULA_COUNT = gql`
  query queryCleaningFormula($where: cleaning_formulaFilterInput){
    queryCleaningFormula(where: $where){
      totalCount
    }
  }
`;

export class CleaningMethodFormulaItem{
  public guid?: string;
  public formula_guid?: string;
  public method_guid?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;
  public sequence?: number;
  public cleaning_method?:CleaningMethodItem;
  
  constructor(item: Partial<CleaningMethodFormulaItem> = {}) {
    this.guid = item.guid;
    this.formula_guid = item.formula_guid;
    this.method_guid = item.method_guid;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
    this.sequence=item.sequence;
    this.cleaning_method=item.cleaning_method;
  }
}

export class CleaningFormulaItem {
  public guid?: string;
  public description?: string;
  public duration?: number;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;
  public cleaning_method_formula?:CleaningMethodFormulaItem[];

  constructor(item: Partial<CleaningFormulaItem> = {}) {
    this.guid = item.guid;
    this.description = item.description;
    this.duration = item.duration;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
    this.cleaning_method_formula=item.cleaning_method_formula;
  }
}

export class CleaningFormulaDS extends BaseDataSource<CleaningFormulaItem> {
  private itemsSubjects = new BehaviorSubject<CleaningFormulaItem[]>([]);
  constructor(private apollo: Apollo) {
    super();
  }

  search(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<CleaningFormulaItem[]> {
    this.loadingSubject.next(true);
    if (!last)
      if (!first)
        first = 10;
    return this.apollo
      .query<any>({
        query: SEARCH_CLEANING_FORMULA_QUERY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as CleaningFormulaItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const rst = result.queryCleaningFormula || { nodes: [], totalCount: 0 };
          this.itemsSubjects.next(rst.nodes);
          this.pageInfo = rst.pageInfo;
          this.totalCount = rst.totalCount;
          return rst.nodes;
        })
      );
  }

  getCheckExist(where?: any): Observable<number> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: SEARCH_CLEANING_FORMULA_COUNT,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of(0); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const rst = result.queryCleaningFormula || { nodes: [], totalCount: 0 };
          this.totalCount = rst.totalCount;
          return rst.totalCount;
        })
      );
  }

  addCleaningFormula(cf: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_CLEANING_FORMULA,
      variables: {
        cf
      }
    });
  }

  updateCleaningFormula(cf: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_CLEANING_FORMULA,
      variables: {
        cf
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }

  deleteCleaningFormula(guids: any): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_CLEANING_FORMULA,
      variables: {
        guids
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }

}