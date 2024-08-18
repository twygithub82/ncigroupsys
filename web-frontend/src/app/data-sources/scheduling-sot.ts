import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StoringOrderItem } from './storing-order';
import { TARIFF_CLEANING_FRAGMENT, TariffCleaningItem } from './tariff-cleaning';
import { BaseDataSource } from './base-ds';
import { InGateItem } from './in-gate';
import { StoringOrderTankItem } from './storing-order-tank';
import { ReleaseOrderItem } from './release-order';
import { SchedulingItem } from './scheduling';

export class SchedulingSotGO {
  public guid?: string;
  public sot_guid?: string;
  public scheduling_guid?: string;
  public status_cv?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<SchedulingSotGO> = {}) {
    this.guid = item.guid;
    this.sot_guid = item.sot_guid;
    this.scheduling_guid = item.scheduling_guid;
    this.status_cv = item.status_cv;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class SchedulingSotItem extends SchedulingSotGO {
  public scheduling?: SchedulingItem;
  public storing_order_tank?: StoringOrderTankItem;
  constructor(item: Partial<SchedulingSotItem> = {}) {
    super(item)
    this.scheduling = item.scheduling;
    this.storing_order_tank = item.storing_order_tank;
  }
}

export class SchedulingSotUpdateItem extends SchedulingSotItem {
  public action?: string

  constructor(item: Partial<SchedulingSotUpdateItem> = {}) {
    super(item)
    this.action = item.action || undefined;
  }
}

export class SchedulingSotDS extends BaseDataSource<SchedulingSotItem> {
  constructor(private apollo: Apollo) {
    super();
  }
}
