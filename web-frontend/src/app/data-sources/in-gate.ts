import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client/core';
import { BaseDataSource } from './base-ds';
import { StoringOrderTankGO, StoringOrderTankItem } from './storing-order-tank';
import { AnyObject } from 'chart.js/dist/types/basic';

export class InGateGO {
  public guid?: string = '';
  public driver_name?: string;
  public eir_dt?: number;
  public eir_no?: string;
  public lolo_cv?: string;
  public preinspection_cv?: string;
  public so_tank_guid?: string;
  public vehicle_no?: string;
  public yard_cv?: string;
  public remarks?: string;
  public tank?: StoringOrderTankGO;
  public haulier?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<InGateGO> = {}) {
    this.guid = item.guid || '';
    this.driver_name = item.driver_name;
    this.eir_dt = item.eir_dt;
    this.eir_no = item.eir_no;
    this.lolo_cv = item.lolo_cv;
    this.preinspection_cv = item.preinspection_cv;
    this.so_tank_guid = item.so_tank_guid;
    this.vehicle_no = item.vehicle_no;
    this.yard_cv = item.yard_cv;
    this.remarks = item.remarks;
    this.tank = item.tank;
    this.haulier = item.haulier;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class InGateItem extends InGateGO {
  public override tank?: StoringOrderTankItem;
  // public cleaning_method?: CleaningMethodItem;

  constructor(item: Partial<InGateItem> = {}) {
    super(item);
    this.tank = item.tank;
  }
}

export interface InGateResult {
  items: InGateItem[];
  totalCount: number;
}



export const GET_IN_GATE_YET_TO_SURVEY_COUNT = gql`
 query queryInGateCount($where: InGateWithTankFilterInput) {
    inGates: queryInGates(where: $where) {
      totalCount
  }
}
`;

export const IN_GATE_FRAGMENT = gql`
  fragment InGateWithTankInputFields on InGateWithTankInput {
    create_by
    create_dt
    delete_dt
    driver_name
    eir_dt
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

export const SEARCH_IN_GATE_FOR_SURVEY_QUERY = gql`
  query queryInGateForSurvey($where: InGateWithTankFilterInput, $order: [InGateWithTankSortInput!]) {
    inGates: queryInGates(where: $where, order: $order) {
      totalCount
      nodes {
        create_by
        create_dt
        delete_dt
        driver_name
        eir_dt
        eir_no
        guid
        haulier
        lolo_cv
        preinspection_cv
        remarks
        so_tank_guid
        update_by
        update_dt
        vehicle_no
        yard_cv
        tank {
          certificate_cv
          clean_status_cv
          create_by
          create_dt
          delete_dt
          estimate_cv
          eta_dt
          etr_dt
          guid
          job_no
          last_cargo_guid
          purpose_cleaning
          purpose_repair_cv
          purpose_steam
          purpose_storage
          remarks
          required_temp
          so_guid
          status_cv
          tank_no
          tank_status_cv
          unit_type_guid
          update_by
          update_dt
          tariff_cleaning {
            cargo
            guid
          }
          storing_order {
            customer_company {
              code
              name
              guid
            }
          }
        }
        eir_status_cv
      }
    }
  }
`;

export const GET_IN_GATE_BY_ID = gql`
  query getInGateByID($where: InGateWithTankFilterInput) {
    inGates: queryInGates(where: $where) {
      nodes {
        create_by
        create_dt
        delete_dt
        driver_name
        eir_dt
        eir_no
        eir_status_cv
        guid
        haulier
        lolo_cv
        preinspection_cv
        remarks
        so_tank_guid
        update_by
        update_dt
        vehicle_no
        yard_cv
        tank {
          certificate_cv
          clean_status_cv
          create_by
          create_dt
          delete_dt
          estimate_cv
          eta_dt
          etr_dt
          guid
          job_no
          last_cargo_guid
          purpose_cleaning
          purpose_repair_cv
          purpose_steam
          purpose_storage
          remarks
          required_temp
          so_guid
          status_cv
          tank_no
          tank_status_cv
          unit_type_guid
          update_by
          update_dt
          tariff_cleaning {
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
            msds_guid
            nature_cv
            open_on_gate_cv
            remarks
            un_no
            update_by
            update_dt
          }
          storing_order {
            so_no
            haulier
            customer_company {
              name
              guid
              code
            }
          }
        }
      }
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
        query: SEARCH_IN_GATE_FOR_SURVEY_QUERY,
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
          const retResult = result.inGates || { nodes: [], totalCount: 0 };
          this.dataSubject.next(retResult.nodes);
          this.totalCount = retResult.totalCount;
          return retResult.nodes;
        })
      );
  }

  getInGateByID(id: string): Observable<InGateItem[]> {
    this.loadingSubject.next(true);
    let where: any = { guid: { eq: id } }
    return this.apollo
      .query<any>({
        query: GET_IN_GATE_BY_ID,
        variables: { where }
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as InGateItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const retResult = result.inGates || { nodes: [], totalCount: 0 };
          this.dataSubject.next(retResult.nodes);
          this.totalCount = retResult.totalCount;
          return retResult.nodes;
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

  getInGateCountForYetToSurvey(): Observable<number> {
    this.loadingSubject.next(true);
    let where: any = { eir_status_cv: { eq: 'YET_TO_SURVEY' } }
    return this.apollo
      .query<any>({
        query: GET_IN_GATE_YET_TO_SURVEY_COUNT,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of(0); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const retResult = result.inGates || { nodes: [], totalCount: 0 };
        
          return retResult.totalCount;
        })
      );
  }
}


