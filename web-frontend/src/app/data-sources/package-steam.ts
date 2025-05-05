import { ApolloError } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { BaseDataSource } from './base-ds';
import { CustomerCompanyItem } from './customer-company';
import { TariffSteamingItem } from './tariff-steam';
export class PackageSteamingGo {
  public guid?: string;
  public tariff_steaming_guid?: string;
  public customer_company_guid?: string;

  //public description?: string;
  public cost?: number;
  public remarks?: string;
  public labour?: number;

  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<PackageSteamingGo> = {}) {
    this.guid = item.guid;
    if (!this.guid) this.guid = '';
    //this.description = item.description;
    this.tariff_steaming_guid = item.tariff_steaming_guid;
    this.labour = item.labour;

    this.cost = item.cost;
    this.remarks = item.remarks;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class PackageSteamingItem extends PackageSteamingGo {
  public customer_company?: CustomerCompanyItem;
  public tariff_steaming?: TariffSteamingItem;



  constructor(item: Partial<PackageSteamingItem> = {}) {

    super(item);
    this.customer_company = item.customer_company;
    this.tariff_steaming = item.tariff_steaming;
  }
}

export interface PackageSteamResult {
  items: PackageSteamingItem[];
  totalCount: number;
}




export const GET_PACKAGE_STEAM_QUERY = gql`
  query queryPackageSteaming($where: package_steamingFilterInput, $order:[package_steamingSortInput!], $first: Int, $after: String, $last: Int, $before: String ) {
    packageSteamResult : queryPackageSteaming(where: $where, order:$order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
      cost
      create_by
      create_dt
      delete_dt
      guid
      labour
      remarks
      update_by
      update_dt
      customer_company_guid
      tariff_steaming_guid
      customer_company {
        code
        guid
        name
        delete_dt
       }
      tariff_steaming {
        cost
        create_by
        create_dt
        delete_dt
        guid
        labour
        remarks
        temp_max
        temp_min
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



export const UPDATE_PACKAGE_STEAMING = gql`
  mutation updatePackageSteaming($ps: package_steamingInput!) {
    updatePackageSteaming(updatePackageSteaming: $ps)
  }
`;

export const UPDATE_PACKAGE_STEAMINGS = gql`
  mutation updatePackageSteamings($guids: [String!]!,$cost:Float!,$labour:Float!,$remarks:String!) {
    updatePackageSteamings(updatePackageSteaming_guids: $guids,cost:$cost,labour:$labour,remarks:$remarks)
  }
`;


export class PackageSteamingDS extends BaseDataSource<PackageSteamingItem> {
  constructor(private apollo: Apollo) {
    super();
  }

  SearchPackageSteam(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<PackageSteamingItem[]> {
    this.loadingSubject.next(true);
    if (!last)
      if (!first)
        first = 10;
    return this.apollo
      .query<any>({
        query: GET_PACKAGE_STEAM_QUERY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as PackageSteamingItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const packageSteamResult = result.packageSteamResult || { nodes: [], totalCount: 0 };
          this.dataSubject.next(packageSteamResult.nodes);
          this.pageInfo = packageSteamResult.pageInfo;
          this.totalCount = packageSteamResult.totalCount;
          return packageSteamResult.nodes;
        })
      );
  }




  updatePackageSteam(ps: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_PACKAGE_STEAMING,
      variables: {
        ps
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }

  updatePackageSteams(guids: string[], cost: number, labour: number, remarks: string): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_PACKAGE_STEAMINGS,
      variables: {
        guids,
        cost,
        labour,
        remarks
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }
}
