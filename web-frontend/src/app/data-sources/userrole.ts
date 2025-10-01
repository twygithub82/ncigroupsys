import { Apollo } from 'apollo-angular';
import { BaseDataSource } from './base-ds';
import { RoleItem } from './role';
import { UserItem } from './user';

export class UserRoleGO {
  public id?: string;
  public Role?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<UserRoleGO> = {}) {
    this.id = item.id;
    this.Role = item.Role;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class UserRoleItem extends UserRoleGO {
  public user?: UserItem
  public role?: RoleItem

  constructor(item: Partial<UserRoleItem> = {}) {
    super(item)
    this.user = item.user || undefined;
    this.role = item.role || undefined;
  }
}

export class UserRoleLinkage {
   
   public role?: RoleItem;
   public guid?: string;
   public role_guid?:string;
   public user_guid?:string;
   public create_dt?: number;
   public create_by?: string;
   public update_dt?: number;
   public update_by?: string;
   public delete_dt?: number;

   constructor(item: Partial<UserRoleLinkage> = {}) {
   
    this.role = item.role;
    this.guid = item.guid;
    this.role_guid = item.role_guid;
    this.user_guid = item.user_guid;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }

}

export class RoleDS extends BaseDataSource<RoleItem> {
  constructor(private apollo: Apollo) {
    super();
  }
}
