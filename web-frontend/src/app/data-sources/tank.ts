import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { BaseDataSource } from './base-ds';

export class TankItem {
  public guid?: string;
  public tariff_depot_guid?: string;
  public unit_type?: string;
  public description?: string;
  public preinspect?: boolean;
  public lift_on?: boolean;
  public lift_off?: boolean;
  public gate_in?: boolean;
  public gate_out?: boolean;
  public iso_format?: boolean;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<TankItem> = {}) {
    this.guid = item.guid;
    this.tariff_depot_guid = item.tariff_depot_guid;
    this.unit_type = item.unit_type;
    this.description = item.description || '';
    this.preinspect = item.preinspect;
    this.lift_on = item.lift_on;
    this.lift_off = item.lift_off;
    this.gate_in = item.gate_in;
    this.gate_out = item.gate_out;
    this.iso_format = item.iso_format;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export interface TankResult {
  items: TankItem[];
  totalCount: number;
}

export const GET_TANK_Where = gql`
  query queryTank($where: tankFilterInput, $order:[tankSortInput!]) {
    queryTank(where: $where, order:$order) {
      guid
      unit_type
      tariff_depot_guid
      description
      preinspect
      lift_on
      lift_off
      gate_in
      gate_out
      iso_format
    }
  }
`;

export const GET_TANK = gql`
  query queryTank {
    queryTank {
      guid
      unit_type
      description
      preinspect
      lift_on
      lift_off
      gate_in
      gate_out
      iso_format
    }
  }
`;

export class TankDS extends BaseDataSource<TankItem> {
  constructor(private apollo: Apollo) {
    super();
  }

  loadItems(): Observable<TankItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_TANK,
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const tankList = result.queryTank || { nodes: [], totalCount: 0 };
          this.dataSubject.next(tankList);
          this.totalCount = tankList.length;
          return tankList;
        })
      );
  }

  search(where?: any, order?: any): Observable<TankItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_TANK_Where,
        variables: { where, order },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const tankList = result.queryTank || { nodes: [], totalCount: 0 };
          this.dataSubject.next(tankList);
          this.totalCount = tankList.length;
          return tankList;
        })
      );
  }
}
