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

export class OutGateGO {
  public guid?: string = '';
  public driver_name?: string;
  public eir_dt?: number;
  public eir_no?: string;
  public eir_status_cv?: string;
  public so_tank_guid?: string;
  public vehicle_no?: string;
  public remarks?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<OutGateGO> = {}) {
    this.guid = item.guid || '';
    this.driver_name = item.driver_name;
    this.eir_dt = item.eir_dt;
    this.eir_no = item.eir_no;
    this.eir_status_cv = item.eir_status_cv;
    this.so_tank_guid = item.so_tank_guid;
    this.vehicle_no = item.vehicle_no;
    this.remarks = item.remarks;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class OutGateItem extends OutGateGO {
  public tank?: StoringOrderTankItem;

  constructor(item: Partial<OutGateItem> = {}) {
    super(item);
    this.tank = item.tank;
  }
}

export interface OutGateResult {
  items: OutGateItem[];
  totalCount: number;
}

export const SEARCH_IN_GATE_FOR_SURVEY_QUERY = gql`
  query queryOutGateForSurvey($where: out_gateFilterInput, $order: [out_gateSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryOutGates(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
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
        in_gate_survey {
          guid
        }
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
          preinspect_job_no
          liftoff_job_no
          lifton_job_no
          takein_job_no
          release_job_no
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
      }
    }
  }
`;

export const ADD_OUT_GATE = gql`
  mutation AddOutGate($outGate: out_gateInput!, $releaseOrder: release_orderInput!) {
    addOutGate(outGate: $outGate, releaseOrder: $releaseOrder) {
      affected
      guid
    }
  }
`;

export const UPDATE_OUT_GATE = gql`
  mutation UpdateOutGate($outGate: out_gateInput!, $releaseOrder: release_orderInput!) {
    updateOutGate(outGate: $outGate, releaseOrder: $releaseOrder)
  }
`;

export class OutGateDS extends BaseDataSource<OutGateItem> {
  constructor(private apollo: Apollo) {
    super();
  }

  searchOutGateForSurvey(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<OutGateItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: SEARCH_IN_GATE_FOR_SURVEY_QUERY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as OutGateItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const retResult = result.outGates || { nodes: [], totalCount: 0 };
          this.dataSubject.next(retResult.nodes);
          this.totalCount = retResult.totalCount;
          this.pageInfo = retResult.pageInfo;
          return retResult.nodes;
        })
      );
  }

  addOutGate(outGate: any, releaseOrder: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_OUT_GATE,
      variables: {
        outGate,
        releaseOrder
      }
    });
  }

  updateOutGate(outGate: any, releaseOrder: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_OUT_GATE,
      variables: {
        outGate,
        releaseOrder
      }
    });
  }

  // getOutGateCountForYetToSurvey(): Observable<number> {
  //   this.loadingSubject.next(true);
  //   let where: any = { eir_status_cv: { eq: 'YET_TO_SURVEY' } }
  //   return this.apollo
  //     .query<any>({
  //       query: GET_IN_GATE_YET_TO_SURVEY_COUNT,
  //       variables: { where },
  //       fetchPolicy: 'no-cache' // Ensure fresh data
  //     })
  //     .pipe(
  //       map((result) => result.data),
  //       catchError((error: ApolloError) => {
  //         console.error('GraphQL Error:', error);
  //         return of(0); // Return an empty array on error
  //       }),
  //       finalize(() => this.loadingSubject.next(false)),
  //       map((result) => {
  //         const retResult = result.inGates || { nodes: [], totalCount: 0 };

  //         return retResult.totalCount;
  //       })
  //     );
  // }

  getOutGateItem(out_gates: OutGateItem[] | undefined): OutGateItem | undefined {
    return out_gates?.find(og => og.eir_status_cv !== 'CANCELED' && !(og.delete_dt));
  }
}


