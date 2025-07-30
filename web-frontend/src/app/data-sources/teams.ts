import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client/core';
import { BaseDataSource } from './base-ds';
import { CurrencyItem } from './currency';
import { ContactPersonItem } from './contact-person';

export class TeamGO {
  public guid?: string;
  public description?: string;
  public department_cv?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<TeamGO> = {}) {
    this.guid = item.guid;
    this.description = item.description;
    this.department_cv = item.department_cv;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class TeamItem extends TeamGO {
  constructor(item: Partial<TeamItem> = {}) {
    super(item);
  }
}

export class TeamItemWithCount{
  public team?:TeamItem;
  public assign_count?:number;

   constructor(item: Partial<TeamItemWithCount> = {}) {
    this.team =item.team;
    this.assign_count=item.assign_count;
  }
}

export interface TeamResult {
  items: TeamItem[];
  totalCount: number;
}

export const GET_TEAM_QUERY = gql`
  query queryTeams($where: teamFilterInput, $order: [teamSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryTeams(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        create_by
        create_dt
        delete_dt
        department_cv
        description
        guid
        update_by
        update_dt
      }
    }
  }
`;

export const GET_TEAM_BY_DEPARTMENT_QUERY = gql`
  query queryTeams($where: teamFilterInput, $order: [teamSortInput!],$first:Int) {
    resultList: queryTeams(where: $where, order: $order,first:$first) {
      nodes {
        create_by
        create_dt
        delete_dt
        department_cv
        description
        guid
        update_by
        update_dt
      }
    }
  }
`;

export const GET_TEAM_QUERY_WITH_COUNT = gql`
  query queryTeamsWithCount($where: TeamResultFilterInput, $order: [TeamResultSortInput!],$first:Int) {
    resultList: queryTeamsWithCount(where: $where, order: $order,first:$first) {
      nodes {
        assign_count
        team {
          action
          create_by
          create_dt
          delete_dt
          department_cv
          description
          guid
          update_by
          update_dt
        }
       
      }
    }
  }
`;
export const ADD_TEAM = gql`

mutation addTeam($teamsRequest:[teamInput!]!) {
  addTeam(teamsRequest: $teamsRequest)
}
`;

export const UPDATE_TEAM = gql`

mutation updateTeam($teamRequest:[teamInput!]!) {
  updateTeam(teamRequest: $teamRequest)
}
`;

export const DELETE_TEAM = gql`

mutation deleteTeam($teamsGuid:[String!]!) {
  deleteTeam(teamsGuid: $teamsGuid)
}
`;


export class TeamDS extends BaseDataSource<TeamItem> {
  constructor(private apollo: Apollo) {
    super();
  }
  loadItems(where?: any, order?: any, first?: any, after?: any, last?: any, before?: any): Observable<TeamItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_TEAM_QUERY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as TeamItem[]); // Return an empty array on error
        }),
        finalize(() =>
          this.loadingSubject.next(false)
        ),
        map((result) => {
          const resultList = result.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList.nodes);
          this.totalCount = resultList.totalCount;
          this.pageInfo = resultList.pageInfo;
          return resultList.nodes;
        })
      );
  }

  getTeamListByDepartment(department_cv?: string[]): Observable<TeamItem[]> {
    this.loadingSubject.next(true);
    const where = {
      department_cv: { in: department_cv }
    }
    const order = { description: "ASC" }
    const first = 100;
    return this.apollo
      .query<any>({
        query: GET_TEAM_BY_DEPARTMENT_QUERY,
        variables: { where, order, first },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as TeamItem[]); // Return an empty array on error
        }),
        finalize(() =>
          this.loadingSubject.next(false)
        ),
        map((result) => {
          const resultList = result.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList.nodes);
          this.totalCount = resultList.totalCount;
          this.pageInfo = resultList.pageInfo;
          return resultList.nodes;
        })
      );
  }


  loadItemsWithAssigedCount(where?: any, order?: any, first?: any, after?: any, last?: any, before?: any): Observable<TeamItemWithCount[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_TEAM_QUERY_WITH_COUNT,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as TeamItemWithCount[]); // Return an empty array on error
        }),
        finalize(() =>
          this.loadingSubject.next(false)
        ),
        map((result) => {
          const resultList = result.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList.nodes);
          this.totalCount = resultList.totalCount;
          this.pageInfo = resultList.pageInfo;
          return resultList.nodes;
        })
      );
  }

  addTeam(teamsRequest: any): Observable<any> {
      return this.apollo.mutate({
        mutation: ADD_TEAM,
        variables: {
          teamsRequest
        }
      }).pipe(
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of(0); // Return an empty array on error
        }),
      );
    }

    updateTeam(teamRequest: any): Observable<any> {
      return this.apollo.mutate({
        mutation: UPDATE_TEAM,
        variables: {
          teamRequest
        }
      }).pipe(
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of(0); // Return an empty array on error
        }),
      );
    }


     deleteTeam(teamsGuid: any): Observable<any> {
      return this.apollo.mutate({
        mutation: DELETE_TEAM,
        variables: {
          teamsGuid
        }
      }).pipe(
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of(0); // Return an empty array on error
        }),
      );
    }

  
}
