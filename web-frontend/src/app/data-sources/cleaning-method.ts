import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client/core';
import { CLEANING_METHOD_FRAGMENT } from './fragments';
import { BaseDataSource } from './base-ds';


export const ADD_CLEANING_METHOD = gql`
  mutation addCleaningMethod($cc: cleaning_methodInput!) {
    addCleaningMethod(newCleanMethod: $cc)
  }
  `;

export const UPDATE_CLEANING_METHOD = gql`
   mutation updateCleaningMethod($cc: cleaning_methodInput!) {
    updateCleaningMethod(updateCleanMethod: $cc)
  }
  `;

export const GET_CLEANING_METHOD_QUERY = gql`
  query queryCleaningMethod($where:cleaning_methodFilterInput , $order:[cleaning_methodSortInput!]) 
  {queryCleaningMethod(where: $where , order: $order) {
    nodes {
       create_by
        create_dt
        delete_dt
        description
        guid
        name
        update_by
        update_dt
     }
      totalCount
  }
}
  `;

  export const SEARCH_CLEANING_METHOD_QUERY = gql`
  query queryCleaningMethod($where: cleaning_methodFilterInput , $order:[cleaning_methodSortInput!], $first: Int, $after: String, $last: Int, $before: String){
    queryCleaningMethod(where: $where , order: $order, first: $first, after: $after, last: $last, before: $before){
      nodes {
        create_by
        create_dt
        delete_dt
        description
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


export class CleaningMethodItem {
    public guid?: string;
    public name?: string;
    public description?: string;
    public sequence?: number;
    public create_dt?: number;
    public create_by?: string;
    public update_dt?: number;
    public update_by?: string;
    public delete_dt?: number;

    constructor(item: Partial<CleaningMethodItem> = {}) {
        this.guid = item.guid;
        this.name = item.name;
        this.description = item.description;
        this.sequence = item.sequence;
        this.create_dt = item.create_dt;
        this.create_by = item.create_by;
        this.update_dt = item.update_dt;
        this.update_by = item.update_by;
        this.delete_dt = item.delete_dt;
    }
}

export class CleaningMethodDS extends BaseDataSource<CleaningMethodItem> {
    private itemsSubjects = new BehaviorSubject<CleaningMethodItem[]>([]);
    constructor(private apollo: Apollo) {
        super();
    }

    loadItems(where?: any, order?: any): Observable<CleaningMethodItem[]> {
        this.loadingSubject.next(true);
        return this.apollo
            .query<any>({
                query: GET_CLEANING_METHOD_QUERY,
                variables: { where, order },
                fetchPolicy: 'no-cache' // Ensure fresh data
            })
            .pipe(
                map((result) => result.data),
                catchError((error: ApolloError) => {
                    console.error('GraphQL Error:', error);
                    return of([] as CleaningMethodItem[]); // Return an empty array on error
                }),
                finalize(() => this.loadingSubject.next(false)),
                map((result) => {
                    const rst = result.queryCleaningMethod || { nodes: [], totalCount: 0 };
                    this.itemsSubjects.next(rst.nodes);
                    this.totalCount = rst.totalCount;
                    return rst.nodes;
                })
            );
    }

    search(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<CleaningMethodItem[]> {
        this.loadingSubject.next(true);
        if (!last)
          if (!first)
            first = 10;
        return this.apollo
          .query<any>({
            query: SEARCH_CLEANING_METHOD_QUERY,
            variables: { where, order, first, after, last, before },
            fetchPolicy: 'no-cache' // Ensure fresh data
          })
          .pipe(
            map((result) => result.data),
            catchError((error: ApolloError) => {
              console.error('GraphQL Error:', error);
              return of([] as CleaningMethodItem[]); // Return an empty array on error
            }),
            finalize(() => this.loadingSubject.next(false)),
            map((result) => {
              const rst = result.queryCleaningMethod || { nodes: [], totalCount: 0 };
              this.itemsSubjects.next(rst.nodes);
              this.totalCount = rst.totalCount;
              return rst.nodes;
            })
          );
      }

      addCleaningMethod(cc: any): Observable<any> {
        return this.apollo.mutate({
          mutation: ADD_CLEANING_METHOD,
          variables: {
            cc
          }
        });
      }
    
      updateCleaningMethod(cc: any): Observable<any> {
        return this.apollo.mutate({
          mutation: UPDATE_CLEANING_METHOD,
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