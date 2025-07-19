import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { BaseDataSource } from './base-ds';
import { StoringOrderTankItem } from './storing-order-tank';
import { UserRoleItem } from './userrole';

export class RoleGO {
  public id?: string;
  public Role?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<RoleGO> = {}) {
    this.id = item.id;
    this.Role = item.Role;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class RoleItem extends RoleGO {
  public userrole?: UserRoleItem[]
  public code?: string
  public department?: string
  public description?:string
  public position?:string

  constructor(item: Partial<RoleItem> = {}) {
    super(item)
    this.userrole = item.userrole || undefined;
    this.code = item.code || undefined;
    this.department = item.department || undefined;
    this.description = item.description || undefined;
    this.position = item.position || undefined;
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

const GET_ROLES= gql`
 query queryRoles($where: roleFilterInput, $order: [roleSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
 resultList:  queryRoles (where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
    totalCount
    nodes {
      action
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
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
}
`

export class RoleDS extends BaseDataSource<RoleItem> {
  constructor(private apollo: Apollo) {
    super();
  }
  searchUser(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<RoleItem[]> {
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

  searchRoles(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<RoleItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_ROLES,
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
