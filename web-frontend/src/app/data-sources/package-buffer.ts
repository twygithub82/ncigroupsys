import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client/core';
import { CleaningCategoryItem } from './cleaning-category';
import { CleaningMethodItem } from './cleaning-method';
import { TankItem } from './tank';
import { CLEANING_CATEGORY_FRAGMENT, CLEANING_METHOD_FRAGMENT } from './fragments';
import { PageInfo } from '@core/models/pageInfo';
import { BaseDataSource } from './base-ds';
import { CustomerCompanyItem } from './customer-company';
import { TariffBufferItem } from './tariff-buffer';
export class PackageBufferItem {
  public guid?: string;
  
  
  public cost?: number;
  public remarks?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;
  public customer_company_guid?:string;
  public customer_company?:CustomerCompanyItem
  public tariff_buffer_guid?:string;
  public tariff_buffer?:TariffBufferItem;

  constructor(item: Partial<PackageBufferItem> = {}) {
    this.guid = item.guid;
    if (!this.guid) this.guid = '';
    this.customer_company_guid = item.customer_company_guid;
    this.customer_company=item.customer_company;
    this.tariff_buffer_guid=item.tariff_buffer_guid;
    this.tariff_buffer=item.tariff_buffer;
    this.cost = item.cost;
    this.remarks=item.remarks;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
   // Object.assign(this, { guid: '', ...item });
  }
}

export interface PackageBufferResult {
  items: PackageBufferItem[];
  totalCount: number;
}



export const GET_PACKAGE_BUFFER_QUERY = gql`
  query queryPackageBuffer($where: package_bufferFilterInput, $order:[package_bufferSortInput!], $first: Int, $after: String, $last: Int, $before: String ) {
    packageBufferResult : queryPackageBuffer(where: $where, order:$order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
     cost
      create_by
      create_dt
      customer_company_guid
      delete_dt
      guid
      remarks
      tariff_buffer_guid
      update_by
      update_dt
      customer_company {
        alias
        city
        code
        country
        create_by
        create_dt
        delete_dt
        description
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
      }
      tariff_buffer {
        buffer_type
        cost
        create_by
        create_dt
        delete_dt
        guid
        remarks
        update_by
        update_dt
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



export const UPDATE_PACKAGE_BUFFERS = gql`
   mutation updatePackageBuffers($guids: [String!]!,$cost:Float!,$remarks:String!) {
    updatePackageBuffers(updatePackageBuffer_guids: $guids,cost:$cost,remarks:$remarks)
  }
`;


export const UPDATE_PACKAGE_BUFFER = gql`
  mutation updatePackageBuffer($pb: package_bufferInput!) {
    updatePackageBuffer(updatePackageBuffer: $pb)
  }
`;


export class PackageBufferDS extends BaseDataSource<PackageBufferItem> {
  constructor(private apollo: Apollo) {
    super();
  }
  
  SearchPackageBuffer(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<PackageBufferItem[]> {
    this.loadingSubject.next(true);
    if (!last)
      if (!first)
        first = 10;
    return this.apollo
      .query<any>({
        query: GET_PACKAGE_BUFFER_QUERY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as TariffBufferItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const packBufferResult = result.packageBufferResult || { nodes: [], totalCount: 0 };
          this.dataSubject.next(packBufferResult.nodes);
          this.pageInfo = packBufferResult.pageInfo;
          this.totalCount = packBufferResult.totalCount;
          return packBufferResult.nodes;
        })
      );
  }

  updatePackageBuffers(guids: any,cost:any,remarks:any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_PACKAGE_BUFFERS,
      variables: {
        guids,
        cost,
        remarks
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }

  

    updatePackageBuffer(pb: any): Observable<any> {
      return this.apollo.mutate({
        mutation: UPDATE_PACKAGE_BUFFER,
        variables: {
          pb
        }
      }).pipe(
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of(0); // Return an empty array on error
        }),
      );
    }
}
