import { ApolloError } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { BaseDataSource } from './base-ds';
import { PackageSteamingItem } from './package-steam';
import { SteamPartItem } from './steam-part';
import { TariffCleaningItem } from './tariff-cleaning';
export class ExclusiveSteamingGo {
  public guid?: string;
  public tariff_cleaning_guid?: string;
  public temp_max?: number;
  public temp_min?: number;
  public cost?: number;
  public remarks?: string;
  public labour?: number;

  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<ExclusiveSteamingGo> = {}) {
    this.guid = item.guid;
    if (!this.guid) this.guid = '';

    this.labour = item.labour;
    this.temp_max = item.temp_max;
    this.temp_min = item.temp_min;
    this.tariff_cleaning_guid = item.tariff_cleaning_guid;

    this.cost = item.cost;
    this.remarks = item.remarks;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class ExclusiveSteamingItem extends ExclusiveSteamingGo {
  public package_steaming?: PackageSteamingItem;
  public steaming_part?: SteamPartItem[];
  public tariff_cleaning?: TariffCleaningItem;
  constructor(item: Partial<ExclusiveSteamingItem> = {}) {
    super(item);
    this.package_steaming = item.package_steaming;
    this.steaming_part = item.steaming_part;
    this.tariff_cleaning = item.tariff_cleaning;
  }
}

export interface PackageSteamResult {
  items: PackageSteamingItem[];
  totalCount: number;
}

export const GET_EXCLUSIVE_STEAM_QUERY = gql`
  query querySteamingExclusive($where: steaming_exclusiveFilterInput, $order:[steaming_exclusiveSortInput!], $first: Int, $after: String, $last: Int, $before: String ) {
    packageSteamExclusiveResult : querySteamingExclusive(where: $where, order:$order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
      create_by
      create_dt
      delete_dt
      guid
      labour
      remarks
      tariff_cleaning_guid
       tariff_cleaning {
          guid
          cargo
          class_cv
          cleaning_category_guid
          cleaning_method_guid
          description
      }
      temp_max
      temp_min
      update_by
      update_dt
      package_steaming{
        cost
        create_by
        create_dt
        customer_company_guid
        delete_dt
        guid
        labour
        remarks
        steaming_exclusive_guid
        tariff_steaming_guid
        update_by
        update_dt
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



export const ADD_EXCLUSIVE_STEAMINGS = gql`
  mutation addSteamingExclusive($newSteamingExclusive: [steaming_exclusiveInput!]!) {
    addSteamingExclusive(newSteamingExclusive: $newSteamingExclusive)
  }
`;

export const ADD_EXCLUSIVE_STEAMING = gql`
  mutation addSteamingExclusive($newSteamingExclusive: steaming_exclusiveInput!) {
    addSteamingExclusive(newSteamingExclusive: $newSteamingExclusive)
  }
`;

export const UPDATE_EXCLUSIVE_STEAMING = gql`
  mutation updateSteamingExclusive($updateSteamingExclusive: steaming_exclusiveInput!) {
    updateSteamingExclusive(updateSteamingExclusive: $updateSteamingExclusive)
  }
`;

export const DELETE_EXCLUSIVE_STEAMING = gql`
  mutation deleteSteamingExclusive($deleteSteamExclusive_guids: [String!]!) {
    deleteSteamingExclusive(deleteSteamExclusive_guids: $deleteSteamExclusive_guids)
  }
`;


export class PackageSteamingExclusiveDS extends BaseDataSource<PackageSteamingItem> {
  constructor(private apollo: Apollo) {
    super();
  }

  SearchExclusiveSteam(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<ExclusiveSteamingItem[]> {
    this.loadingSubject.next(true);
    if (!last)
      if (!first)
        first = 10;
    return this.apollo
      .query<any>({
        query: GET_EXCLUSIVE_STEAM_QUERY,
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
          const packageSteamExclusiveResult = result.packageSteamExclusiveResult || { nodes: [], totalCount: 0 };
          this.dataSubject.next(packageSteamExclusiveResult.nodes);
          this.pageInfo = packageSteamExclusiveResult.pageInfo;
          this.totalCount = packageSteamExclusiveResult.totalCount;
          return packageSteamExclusiveResult.nodes;
        })
      );
  }

  AddExclusiveSteams(newSteamingExclusive: any[]): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_EXCLUSIVE_STEAMINGS,
      variables: {
        newSteamingExclusive
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }

  // AddExclusiveSteam(newSteamingExclusive: any): Observable<any> {
  //   return this.apollo.mutate({
  //     mutation: ADD_EXCLUSIVE_STEAMING,
  //     variables: {
  //       newSteamingExclusive
  //     }
  //   }).pipe(
  //     catchError((error: ApolloError) => {
  //       console.error('GraphQL Error:', error);
  //       return of(0); // Return an empty array on error
  //     }),
  //   );
  // }

  updateExclusiveSteam(updateSteamingExclusive: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_EXCLUSIVE_STEAMING,
      variables: {
        updateSteamingExclusive
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }

  deleteExclusiveSteam(deleteSteamExclusive_guids: String[]): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_EXCLUSIVE_STEAMING,
      variables: {
        deleteSteamExclusive_guids
      }
    }).pipe(
      catchError((error: ApolloError) => {
        console.error('GraphQL Error:', error);
        return of(0); // Return an empty array on error
      }),
    );
  }
}
