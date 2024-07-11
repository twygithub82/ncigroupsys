import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client/core';
import { BaseDataSource } from './base-ds';
import { StoringOrderTankGO } from './storing-order-tank';

export class InGateGO {
  public guid?: string = '';
  public driver_name?: string;
  public eir_date?: string;
  public eir_no?: string;
  public lolo_cv?: string;
  public preinspection_cv?: string;
  public so_tank_guid?: string;
  public vehicle_no?: string;
  public yard_cv?: string;
  public remarks?: string;
  public tank?: StoringOrderTankGO;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<InGateGO> = {}) {
    this.guid = item.guid || '';
    this.driver_name = item.driver_name;
    this.eir_date = item.eir_date;
    this.eir_no = item.eir_no;
    this.lolo_cv = item.lolo_cv;
    this.preinspection_cv = item.preinspection_cv;
    this.so_tank_guid = item.so_tank_guid;
    this.vehicle_no = item.vehicle_no;
    this.yard_cv = item.yard_cv;
    this.remarks = item.remarks;
    this.tank = item.tank;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class InGateItem extends InGateGO {
  // public cleaning_category?: CleaningCategoryItem;
  // public cleaning_method?: CleaningMethodItem;

  // constructor(item: Partial<InGateItem> = {}) {
  //   super(item);
  //   this.cleaning_category = item.cleaning_category;
  //   this.cleaning_method = item.cleaning_method;
  // }
}

export interface InGateResult {
  items: InGateItem[];
  totalCount: number;
}

export const IN_GATE_FRAGMENT = gql`
  fragment InGateWithTankInputFields on InGateWithTankInput {
    create_by
    create_dt
    delete_dt
    driver_name
    eir_date
    eir_doc
    eir_no
    guid
    haulier
    lolo_cv
    preinspection_cv
    so_tank_guid
    remarks
    update_by
    update_dt
    vehicle_no
    yard_cv
  }
`;

export const GET_TARIFF_CLEANING_QUERY = gql`
  query queryTariffCleaning($where: tariff_cleaningFilterInput) {
    lastCargo: queryTariffCleaning(where: $where) {
      nodes {
        alias
        ban_type_cv
        cargo
        class_cv
        cleaning_category_guid
        cleaning_method_guid
        create_by
        create_dt
        delete_dt
        depot_note
        description
        flash_point
        guid
        hazard_level_cv
        in_gate_alert
        nature_cv
        open_on_gate_cv
        remarks
        un_no
        update_by
        update_dt
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

export const ADD_IN_GATE = gql`
  mutation AddInGate($inGate: InGateWithTankInput!) {
    addInGate(inGate: $inGate)
  }
`;

export class InGateDS extends BaseDataSource<InGateItem> {
  public totalCount = 0;
  constructor(private apollo: Apollo) {
    super();
  }

  loadItems(where?: any, order?: any): Observable<InGateItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: GET_TARIFF_CLEANING_QUERY,
        variables: { where, order }
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as InGateItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const lastCargo = result.lastCargo || { nodes: [], totalCount: 0 };
          this.dataSubject.next(lastCargo.nodes);
          this.totalCount = lastCargo.totalCount;
          return lastCargo.nodes;
        })
      );
  }

  addInGate(inGate: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_IN_GATE,
      variables: {
        inGate
      }
    });
  }
}
