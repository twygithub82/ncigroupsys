import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, expand, finalize, last, map, switchMap, takeWhile, tap } from 'rxjs/operators';
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client/core';
import { CLEANING_METHOD_FRAGMENT } from './fragments';
import { BaseDataSource } from './base-ds';
import { CleaningFormulaItem } from './cleaning-formulas';
import { CleaningStepItem } from './cleaning-steps';
import { CleaningCategoryItem } from './cleaning-category';
import { TariffCleaningItem } from './tariff-cleaning';


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

export const DELETE_CLEANING_METHOD = gql`
  mutation deleteCleaningMethod($deleteCleanMethod_guids: [String!]!) {
   deleteCleaningMethod(deleteCleanMethod_guids: $deleteCleanMethod_guids)
 }
 `;

export const GET_CLEANING_METHOD_QUERY = gql`
  query queryCleaningMethod($where:cleaning_methodFilterInput , $order:[cleaning_methodSortInput!],$first:Int,$after: String){ 
    queryCleaningMethod(where: $where , order: $order,first:$first,after: $after){ 
      nodes {
        category_guid
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
        cleaning_category {
          cost
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
        cleaning_method_formula (where: { or:[{delete_dt: { eq: null }},{delete_dt: { eq: 0 }}]})
        {
          delete_dt
          formula_guid
          guid
          method_guid
          sequence
          update_dt
          create_dt
          cleaning_formula 
          {
            create_by
            create_dt
            delete_dt
            description
            duration
            guid
            update_by
            update_dt
          }
        }
        tariff_cleanings{
          guid
          description
          
        }
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

// export class CleaningMethodFormulaItem {
//   public guid?: string;
//   public sequence?: number;
//   public method_guid?:string;
//   public formula_guid?:string;
//   public create_dt?: number;
//   public create_by?: string;
//   public update_dt?: number;
//   public update_by?: string;
//   public delete_dt?: number;
//   public cleaning_formula?:CleaningFormulaItem;

//   constructor(item: Partial<CleaningMethodFormulaItem> = {}) {
//       this.guid = item.guid;
//       this.sequence = item.sequence;
//       this.formula_guid = item.formula_guid;
//       this.method_guid = item.method_guid;
//       this.create_dt = item.create_dt;
//       this.create_by = item.create_by;
//       this.update_dt = item.update_dt;
//       this.update_by = item.update_by;
//       this.delete_dt = item.delete_dt;
//       this.cleaning_formula=item.cleaning_formula;
//   }
// }

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
  public cleaning_method_formula?: CleaningStepItem[];
  public category_guid?: string;
  public cleaning_category?: CleaningCategoryItem;
  public tariff_cleanings?: TariffCleaningItem[];

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
    this.cleaning_method_formula = item.cleaning_method_formula;
    this.category_guid = item.category_guid;
    this.cleaning_category = item.cleaning_category;
    this.tariff_cleanings = item.tariff_cleanings;
  }
}

export class CleaningMethodDS extends BaseDataSource<CleaningMethodItem> {
  private itemsSubjects = new BehaviorSubject<CleaningMethodItem[]>([]);
  constructor(private apollo: Apollo) {
    super();
  }

 loadAllItems(
  where?: any, 
  order?: any, 
  batchSize: number = 100
): Observable<CleaningMethodItem[]> {
  let allItems: CleaningMethodItem[] = [];
  let after: string | undefined;
  let totalCount: number = 0;
    
  const loadNextBatch = (): Observable<CleaningMethodItem[]> => {
    return this.apollo.query<any>({
      query: GET_CLEANING_METHOD_QUERY,
      variables: { where, order, first: batchSize, after },
      fetchPolicy: 'no-cache'
    }).pipe(
      map(result => result.data?.queryCleaningMethod || { nodes: [], pageInfo: { hasNextPage: false } }),
      switchMap(result => {
        const batchItems = result.nodes || [];
        allItems = [...allItems, ...batchItems];
        
        if (totalCount === 0 && result.totalCount != null) {
          totalCount = result.totalCount;
        }

        if (result.pageInfo?.hasNextPage) {
          after = result.pageInfo.endCursor;
          return loadNextBatch();
        }
       this.totalCount = allItems.length;
        return of(allItems);
      }),
      catchError(error => {
        console.error('Error loading batch:', error);
        // Return what we've loaded so far
        return of(allItems);
      })
    );
  };

  this.loadingSubject.next(true);
  return loadNextBatch().pipe(
     finalize(() => {
      this.loadingSubject.next(false);
      
    })
  );
}

  loadItems(where?: any, order?: any, first?: any,after?:any): Observable<CleaningMethodItem[]> {
    if(!first)first=100;
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_CLEANING_METHOD_QUERY,
        variables: { where, order, first,after },
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
          this.pageInfo = rst.pageInfo;
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
          this.pageInfo = rst.pageInfo;
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

  deleteCleaningMethod(deleteCleanMethod_guids: any): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_CLEANING_METHOD,
      variables: {
        deleteCleanMethod_guids
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }

}