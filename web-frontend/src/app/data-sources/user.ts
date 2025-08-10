import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { BaseDataSource } from './base-ds';
import { StoringOrderTankItem } from './storing-order-tank';
import { UserRoleItem, UserRoleLinkage } from './userrole';
import { TeamUserLinkage } from './teams';


export class UserGO {
  public id?: string;
  public userName?: string;
  public phoneNumber?: string;
  public email?: string;
  public corporateID?:number;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<UserGO> = {}) {
    this.id = item.id;
    this.userName = item.userName;
    this.phoneNumber = item.phoneNumber;
    this.email = item.email;
    this.corporateID=item.corporateID;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class UserItem extends UserGO {
  public userrole?: UserRoleItem[]
  public aspnetuserroles?: AspnetUserRolesItem;
  constructor(item: Partial<UserItem> = {}) {
    super(item)
    this.userrole = item.userrole || undefined;
    this.aspnetuserroles=item.aspnetuserroles || undefined;
  }
}

export class UserItemWithDetails extends UserItem {
  public team_user?: TeamUserLinkage[];
  public user_role?: UserRoleLinkage[];
  constructor(item: Partial<UserItemWithDetails> = {}) {
    super(item)
    this.team_user=item.team_user || undefined;
    this.user_role=item.user_role || undefined;
  }
}
export class AspnetUserRolesItem {
  public role?: AspRolesItem;
  constructor(item: Partial<AspnetUserRolesItem> = {}) {
    this.role = item.role||undefined;
  }
}

export class AspRolesItem{
  public role: string;
  constructor(item: Partial<AspRolesItem> = {}) {
    this.role = item.role || '';
  }
}
const GET_USERS = gql`
  query queryUsers($where: aspnetusersFilterInput, $order: [aspnetusersSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryUsers(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      totalCount
      nodes {
        id
        userName
        email
        user_role {
          create_by
          create_dt
          delete_dt
          guid
          role_guid
          update_by
          update_dt
          user_guid
          role {
            code
            position
          }
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

const GET_USERS_TEAMS_ROLES = gql`
  query queryUsers($where: aspnetusersFilterInput, $order: [aspnetusersSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryUsers(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      totalCount
      nodes {
        corporateID
        email
        id
        phoneNumber
        userName
        team_user {
          create_by
          create_dt
          delete_dt
          guid
          team_guid
          update_by
          update_dt
          userId
        }
        user_role {
          create_by
          create_dt
          delete_dt
          guid
          role_guid
          update_by
          update_dt
          user_guid
          role {
            code
            create_by
            create_dt
            delete_dt
            department
            description
            guid
            position
            update_by
            update_dt
            role_functions {
              create_by
              create_dt
              delete_dt
              functions_guid
              guid
              role_guid
              update_by
              update_dt
              functions {
                code
                guid
              }
            }
          }
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


const UPDATE_USER = gql`
  query queryUsers($where: aspnetusersFilterInput, $order: [aspnetusersSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryUsers(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      totalCount
      nodes {
        id
        userName
        email
        aspnetuserroles {
          aspnetroles {
            Role
          }
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



export class UserDS extends BaseDataSource<UserItem> {
  constructor(private apollo: Apollo) {
    super();
  }
  searchUser(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<UserItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_USERS,
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

  searchUserWithDetails(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<UserItemWithDetails[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_USERS_TEAMS_ROLES,
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
}
