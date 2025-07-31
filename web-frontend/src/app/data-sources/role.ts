import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { BaseDataSource } from './base-ds';
import { StoringOrderTankItem } from './storing-order-tank';
import { UserRoleItem } from './userrole';

export class RoleGO {
  public guid?: string;
  public id?: string;
  public Role?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<RoleGO> = {}) {
    this.guid=item.guid;
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
  public role_functions?: Role_Functions[];

  constructor(item: Partial<RoleItem> = {}) {
    super(item)
    this.userrole = item.userrole || undefined;
    this.code = item.code || undefined;
    this.department = item.department || undefined;
    this.description = item.description || undefined;
    this.position = item.position || undefined;
    this.role_functions = item.role_functions || undefined;
  }
}

export class Role_Functions {
  public guid?: string;
  public role_guid?: string;
  public functions_guid?: string;
  public functions?:Functions;

  constructor(item: Partial<Role_Functions> = {}) {
    this.guid = item.guid;
    this.role_guid = item.role_guid || undefined;
    this.functions_guid = item.functions_guid || undefined;
  }
}

export class Functions{
  public guid?: string;
  public code?: string;
  public module?: string;
  public opt?:string;
  public submodule?:string;

  constructor(item: Partial<Functions> = {}) {
    this.guid = item.guid;
    this.code = item.code || undefined;
    this.module = item.module || undefined;
    this.opt = item.opt || undefined;
    this.submodule = item.submodule || undefined; 
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
// const GET_ROLES_WITH_FUNCTIONS= gql`
//  query queryRoles($where: roleFilterInput, $order: [roleSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
//  resultList:  queryRoles (where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
//     totalCount
//     nodes {
//      role_functions {
//         create_by
//         create_dt
//         delete_dt
//         functions_guid
//         guid
//         role_guid
//         update_by
//         update_dt
//         functions {
//           code
//           create_by
//           create_dt
//           delete_dt
//           guid
//           module
          
//           submodule
//           update_by
//           update_dt
//         }
//       }
//       code
//       create_by
//       create_dt
//       delete_dt
//       department
//       description
//       guid
//       position
//       update_by
//       update_dt
//     }
//     pageInfo {
//       endCursor
//       hasNextPage
//       hasPreviousPage
//       startCursor
//     }
//   }
// }
// `

const GET_FUNCTIONS= gql`
 query queryFunctions($where: functionsFilterInput, $order: [functionsSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
 resultList:  queryFunctions (where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
    totalCount
    nodes {
      code
      create_by
      create_dt
      delete_dt
      guid
      module
      submodule
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

const GET_ROLES_WITH_FUNCTIONS= gql`
 query queryRoles($where: roleFilterInput, $order: [roleSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
 resultList:  queryRoles (where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
    totalCount
    nodes {
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
          create_by
          create_dt
          delete_dt
          guid
          module
          
          submodule
          update_by
          update_dt
        }
      }
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

const UPDATE_ROLES= gql`
 mutation UpdateRole($rolesRequest:[roleInput!]!) {
   updateRole (rolesRequest: $rolesRequest) 
  
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

  searchFunctions(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<Functions[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_FUNCTIONS,
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


   searchRolesWithFunctions(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<RoleItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_ROLES_WITH_FUNCTIONS,
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

   updateRole(rolesRequest: any): Observable<any> {
      return this.apollo.mutate({
        mutation: UPDATE_ROLES,
        variables: {
          rolesRequest
        }
      });
    }
}
