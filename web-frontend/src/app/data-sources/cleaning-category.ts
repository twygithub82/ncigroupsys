import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client/core';
import {CLEANING_CATEGORY_FRAGMENT} from './fragments';
import { BaseDataSource } from './base-ds';


export const ADD_CLEANING_CATEGORY = gql`
  mutation addCleaningCategory($cc: cleaning_categoryInput!) {
    addCleaningCategory(newCleanCategory: $cc)
  }
  `;


  export const UPDATE_CLEANING_CATEGORY = gql`
   mutation updateCleaningCategory($cc: cleaning_categoryInput!) {
    updateCleaningCategory(updateCleanCategory: $cc)
  }
  `;


export const SEARCH_CLEANING_CATEGORY_QUERY= gql`
 query queryCleaningCategory($where: cleaning_categoryFilterInput , $order:[cleaning_categorySortInput!], $first: Int, $after: String, $last: Int, $before: String){
      queryCleaningCategory(where: $where , order: $order, first: $first, after: $after, last: $last, before: $before){
    nodes {
       cost
        create_by
        create_dt
        delete_dt
        description
        sequence
        guid
        name
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


export const GET_CLEANING_CATEGORY_QUERY = gql`
  query queryCleaningCategory($where: cleaning_categoryFilterInput , $order:[cleaning_categorySortInput!]){
      queryCleaningCategory(where: $where , order: $order){
    nodes {
       cost
        create_by
        create_dt
        delete_dt
        description
        sequence
        guid
        name
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
export class CleaningCategoryItem {
    public guid?: string;
    public name?: string;
    public description?: string;
    public cost?: number;
    public sequence?: number;
    public create_dt?: number;
    public create_by?: string;
    public update_dt?: number;
    public update_by?: string;
    public delete_dt?: number;

    constructor(item: Partial<CleaningCategoryItem> = {}) {
        this.guid = item.guid;
        this.name = item.name;
        this.description = item.description;
        this.cost = item.cost;
        this.sequence = item.sequence;
        this.create_dt = item.create_dt;
        this.create_by = item.create_by;
        this.update_dt = item.update_dt;
        this.update_by = item.update_by;
        this.delete_dt = item.delete_dt;
    }

    
}


export class CleaningCategoryDS extends BaseDataSource<CleaningCategoryItem> {
    private itemsSubjects = new BehaviorSubject<CleaningCategoryItem[]>([]);
  //  private loadingSubject = new BehaviorSubject<boolean>(false);
  //  public loading$ = this.loadingSubject.asObservable();
    public totalCount = 0;
    constructor(private apollo: Apollo) {
        super();
    }

    

    search(where?: any, order?: any,first?: number, after?: string, last?: number, before?: string): Observable<CleaningCategoryItem[]> {
        this.loadingSubject.next(true);
        if(!last) 
            if(!first)
                first=10;
        return this.apollo
            .query<any>({
                query: SEARCH_CLEANING_CATEGORY_QUERY,
                variables: { where, order,first,after,last,before },
                fetchPolicy: 'no-cache' // Ensure fresh data
            })
            .pipe(
                map((result) => result.data),
                catchError((error: ApolloError) => {
                    console.error('GraphQL Error:', error);
                    return of([] as CleaningCategoryItem[]); // Return an empty array on error
                }),
                finalize(() => this.loadingSubject.next(false)),
                map((result) => {
                    const rst = result.queryCleaningCategory || { nodes: [], totalCount: 0 };
                    this.itemsSubjects.next(rst.nodes);
                    this.totalCount = rst.totalCount;
                    return rst.nodes;
                })
            );
    }

    loadItems(where?: any, order?: any): Observable<CleaningCategoryItem[]> {
        this.loadingSubject.next(true);
        return this.apollo
            .query<any>({
                query: GET_CLEANING_CATEGORY_QUERY,
                variables: { where, order },
                fetchPolicy: 'no-cache' // Ensure fresh data
            })
            .pipe(
                map((result) => result.data),
                catchError((error: ApolloError) => {
                    console.error('GraphQL Error:', error);
                    return of([] as CleaningCategoryItem[]); // Return an empty array on error
                }),
                finalize(() => this.loadingSubject.next(false)),
                map((result) => {
                    const rst = result.queryCleaningCategory || { nodes: [], totalCount: 0 };
                    this.itemsSubjects.next(rst.nodes);
                    this.pageInfo = rst.pageInfo;
                    this.totalCount = rst.totalCount;
                    return rst.nodes;
                })
            );
    }

    addCleaningCategory(cc: any): Observable<any> {
        return this.apollo.mutate({
          mutation: ADD_CLEANING_CATEGORY,
          variables: {
            cc
          }
        });
      }

    updateCleaningCategory(cc: any): Observable<any> {
        return this.apollo.mutate({
          mutation: UPDATE_CLEANING_CATEGORY,
          variables: {
            cc
          }
        }).pipe(
          catchError((error: ApolloError) => {
            console.error('GraphQL Error:', error);
            return of(0); // Return an empty array on error
          }),
        );
      }
    }

    // connect(): Observable<CleaningCategoryItem[]> {
    //     return this.itemsSubjects.asObservable();
    // }

    // disconnect(): void {
    //     this.itemsSubjects.complete();
    //     this.loadingSubject.complete();
    // }
//}