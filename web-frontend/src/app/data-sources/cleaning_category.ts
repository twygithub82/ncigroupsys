import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client/core';
import {CLEANING_CATEGORY_FRAGMENT} from './fragments';


export const GET_CLEANING_CATEGORY_QUERY = gql`
  query{ queryCleaningCategory{
    nodes {
       cost
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


export class CleaningCategoryDS extends DataSource<CleaningCategoryItem> {
    private itemsSubjects = new BehaviorSubject<CleaningCategoryItem[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    public totalCount = 0;
    constructor(private apollo: Apollo) {
        super();
    }

    

    loadItems(where?: any, order?: any): Observable<CleaningCategoryItem[]> {
        this.loadingSubject.next(true);
        return this.apollo
            .query<any>({
                query: GET_CLEANING_CATEGORY_QUERY,
                variables: { where, order }
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

    connect(): Observable<CleaningCategoryItem[]> {
        return this.itemsSubjects.asObservable();
    }

    disconnect(): void {
        this.itemsSubjects.complete();
        this.loadingSubject.complete();
    }
}