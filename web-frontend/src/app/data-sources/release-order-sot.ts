import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, delay, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { CustomerCompanyItem } from './customer-company';
import { StoringOrderTankItem } from './storing-order-tank';
import { PageInfo } from '@core/models/pageInfo';
import { BaseDataSource } from './base-ds';
import { SchedulingItem, SchedulingUpdateItem } from './scheduling';
import { ReleaseOrderItem } from './release-order';

export class ReleaseOrderSotGO {
  public guid?: string;
  public ro_guid?: string;
  public sot_guid?: string;
  public status_cv?: string;
  public remarks?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<ReleaseOrderSotGO> = {}) {
    this.guid = item.guid;
    this.ro_guid = item.ro_guid;
    this.sot_guid = item.sot_guid || '';
    this.status_cv = item.status_cv || '';
    this.remarks = item.remarks || '';
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class ReleaseOrderSotItem extends ReleaseOrderSotGO {
  public release_order?: ReleaseOrderItem;
  public storing_order_tank?: StoringOrderTankItem;

  constructor(item: Partial<ReleaseOrderSotItem> = {}) {
    super(item);
    this.release_order = item.release_order;
    this.storing_order_tank = item.storing_order_tank;
  }
}

export class ReleaseOrderSotUpdateRO extends ReleaseOrderSotItem {
  public action?: string;

  constructor(item: Partial<ReleaseOrderSotUpdateRO> = {}) {
    super(item);
    this.action = item.action;
  }
}

export class ReleaseOrderSotUpdateItem extends ReleaseOrderSotUpdateRO {
  public actions?: string[] = [];

  constructor(item: Partial<ReleaseOrderSotUpdateItem> = {}) {
    super(item);
    this.actions = item.actions || [];
  }
}

export class ReleaseOrderSotDS extends BaseDataSource<ReleaseOrderSotUpdateItem> {
  constructor(private apollo: Apollo) {
    super();
  }

  canCancel(roSot: any): boolean {
    return roSot && this.canCancelStatus(roSot.status_cv);
  }

  canCancelStatus(status_cv: any): boolean {
    return status_cv === 'PENDING';
  }

  canRollback(roSot: any): boolean {
    return roSot && this.canRollbackStatus(roSot.status_cv);
  }

  canRollbackStatus(status_cv: any): boolean {
    return status_cv === 'CANCELED';
  }

  canEdit(status_cv: any): boolean {
    return status_cv === '' || status_cv === 'PENDING';
  }

  getReleaseOrderSotItem(roSot: ReleaseOrderSotItem[] | undefined): ReleaseOrderSotItem | undefined {
    return roSot?.find(ros => ros.status_cv !== 'CANCELED' && !(ros.delete_dt));
  }
}
