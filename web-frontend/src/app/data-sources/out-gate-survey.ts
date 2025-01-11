import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { ApolloError } from '@apollo/client/core';
import { BaseDataSource } from './base-ds';
import { AnyObject } from 'chart.js/dist/types/basic';
import { InGateItem } from './in-gate';
import { TariffBufferItem } from './tariff-buffer';

export class OutGateSurveyGO {
  public guid?: string = '';
  public out_gate_guid?: string = '';
  public capacity?: number;
  public tare_weight?: number;
  public take_in_reference?: string;
  public last_test_cv?: string;
  public next_test_cv?: string;
  public test_dt?: number | Date;
  public test_class_cv?: string;
  public dom_dt?: number | Date;
  public inspection_dt?: number;
  public last_release_dt?: number;
  public manufacturer_cv?: string;
  public cladding_cv?: string;
  public max_weight_cv?: string;
  public height_cv?: string;
  public walkway_cv?: string;
  public tank_comp_guid?: string;
  public btm_dis_comp_cv?: string;
  public btm_dis_valve_cv?: string;
  public btm_dis_valve_spec_cv?: string;
  public btm_valve_brand_cv?: string;
  public top_dis_comp_cv?: string;
  public top_dis_valve_cv?: string;
  public top_dis_valve_spec_cv?: string;
  public top_valve_brand_cv?: string;
  public manlid_comp_cv?: string;
  public foot_valve_cv?: string;
  public thermometer?: number;
  public thermometer_cv?: string;
  public ladder?: boolean;
  public data_csc_transportplate?: boolean;
  public airline_valve_pcs?: number;
  public airline_valve_dim?: number;
  public airline_valve_cv?: string;
  public airline_valve_conn_cv?: string;
  public airline_valve_conn_spec_cv?: string;
  public manlid_cover_cv?: string;
  public manlid_cover_pcs?: number;
  public manlid_cover_pts?: number;
  public manlid_seal_cv?: string;
  public pv_type_cv?: string;
  public pv_type_pcs?: number;
  public pv_spec_cv?: string;
  public pv_spec_pcs?: number;
  public safety_handrail?: boolean;
  public buffer_plate?: number;
  public residue?: number;
  public dipstick?: boolean;
  public comments?: string;
  public top_coord?: string;
  public bottom_coord?: string;
  public front_coord?: string;
  public rear_coord?: string;
  public left_coord?: string;
  public right_coord?: string;
  public top_remarks?: string;
  public bottom_remarks?: string;
  public front_remarks?: string;
  public rear_remarks?: string;
  public left_remarks?: string;
  public right_remarks?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<OutGateSurveyGO> = {}) {
    this.guid = item?.guid ?? '';
    this.out_gate_guid = item?.out_gate_guid ?? '';
    this.capacity = item?.capacity;
    this.tare_weight = item?.tare_weight;
    this.take_in_reference = item?.take_in_reference;
    this.last_test_cv = item?.last_test_cv;
    this.next_test_cv = item?.next_test_cv;
    this.test_dt = item?.test_dt;
    this.test_class_cv = item?.test_class_cv;
    this.dom_dt = item?.dom_dt;
    this.inspection_dt = item?.inspection_dt;
    this.last_release_dt = item?.last_release_dt;
    this.manufacturer_cv = item?.manufacturer_cv;
    this.cladding_cv = item?.cladding_cv;
    this.max_weight_cv = item?.max_weight_cv;
    this.height_cv = item?.height_cv;
    this.walkway_cv = item?.walkway_cv;
    this.tank_comp_guid = item?.tank_comp_guid;
    this.btm_dis_comp_cv = item?.btm_dis_comp_cv;
    this.btm_dis_valve_cv = item?.btm_dis_valve_cv;
    this.btm_dis_valve_spec_cv = item?.btm_dis_valve_spec_cv;
    this.btm_valve_brand_cv = item?.btm_valve_brand_cv;
    this.top_dis_comp_cv = item?.top_dis_comp_cv;
    this.top_dis_valve_cv = item?.top_dis_valve_cv;
    this.top_dis_valve_spec_cv = item?.top_dis_valve_spec_cv;
    this.top_valve_brand_cv = item?.top_valve_brand_cv;
    this.manlid_comp_cv = item?.manlid_comp_cv;
    this.foot_valve_cv = item?.foot_valve_cv;
    this.thermometer = item?.thermometer;
    this.thermometer_cv = item?.thermometer_cv;
    this.ladder = item?.ladder;
    this.data_csc_transportplate = item?.data_csc_transportplate;
    this.airline_valve_pcs = item?.airline_valve_pcs;
    this.airline_valve_dim = item?.airline_valve_dim;
    this.airline_valve_cv = item?.airline_valve_cv;
    this.airline_valve_conn_cv = item?.airline_valve_conn_cv;
    this.airline_valve_conn_spec_cv = item?.airline_valve_conn_spec_cv;
    this.manlid_cover_cv = item?.manlid_cover_cv;
    this.manlid_cover_pcs = item?.manlid_cover_pcs;
    this.manlid_cover_pts = item?.manlid_cover_pts;
    this.manlid_seal_cv = item?.manlid_seal_cv;
    this.pv_type_cv = item?.pv_type_cv;
    this.pv_type_pcs = item?.pv_type_pcs;
    this.pv_spec_cv = item?.pv_spec_cv;
    this.pv_spec_pcs = item?.pv_spec_pcs;
    this.safety_handrail = item?.safety_handrail;
    this.buffer_plate = item?.buffer_plate;
    this.residue = item?.residue;
    this.dipstick = item?.dipstick;
    this.comments = item?.comments;
    this.top_coord = item?.top_coord;
    this.bottom_coord = item?.bottom_coord;
    this.front_coord = item?.front_coord;
    this.rear_coord = item?.rear_coord;
    this.left_coord = item?.left_coord;
    this.right_coord = item?.right_coord;
    this.top_remarks = item?.top_remarks;
    this.bottom_remarks = item?.bottom_remarks;
    this.front_remarks = item?.front_remarks;
    this.rear_remarks = item?.rear_remarks;
    this.left_remarks = item?.left_remarks;
    this.right_remarks = item?.right_remarks;
    this.create_dt = item?.create_dt;
    this.create_by = item?.create_by;
    this.update_dt = item?.update_dt;
    this.update_by = item?.update_by;
    this.delete_dt = item?.delete_dt;
  }
}

export class OutGateSurveyItem extends OutGateSurveyGO {
  public in_gate?: InGateItem;
  public tariff_buffer?: TariffBufferItem;

  constructor(item: Partial<OutGateSurveyItem> = {}) {
    super(item);
    this.in_gate = item?.in_gate;
    this.tariff_buffer = item?.tariff_buffer;
  }
}

export interface OutGateResult {
  items: OutGateSurveyItem[];
  totalCount: number;
}

export const QUERY_OUT_GATE_SURVEY_BY_ID_FOR_MOVEMENT = gql`
  query queryOutGateSurveyByID($where: out_gate_surveyFilterInput){
    resultList: queryOutGateSurvey(where: $where) {
      totalCount
      nodes {
        airline_valve_conn_cv
        airline_valve_conn_spec_cv
        airline_valve_cv
        airline_valve_dim
        airline_valve_pcs
        btm_dis_comp_cv
        btm_dis_valve_cv
        btm_dis_valve_spec_cv
        buffer_plate
        capacity
        cladding_cv
        comments
        create_by
        create_dt
        data_csc_transportplate
        delete_dt
        dipstick
        dom_dt
        foot_valve_cv
        guid
        height_cv
        out_gate_guid
        inspection_dt
        ladder
        last_release_dt
        last_test_cv
        test_class_cv
        test_dt
        manlid_comp_cv
        manlid_cover_cv
        manlid_cover_pcs
        manlid_cover_pts
        manlid_seal_cv
        manufacturer_cv
        max_weight_cv
        pv_spec_cv
        pv_spec_pcs
        pv_type_cv
        pv_type_pcs
        residue
        safety_handrail
        take_in_reference
        tank_comp_guid
        tare_weight
        thermometer
        thermometer_cv
        top_dis_comp_cv
        top_dis_valve_cv
        top_dis_valve_spec_cv
        update_by
        update_dt
        walkway_cv
        top_coord
        bottom_coord
        front_coord
        rear_coord
        left_coord
        right_coord
        out_gate {
          create_by
          create_dt
          delete_dt
          driver_name
          eir_dt
          eir_no
          eir_status_cv
          guid
          haulier
          remarks
          so_tank_guid
          update_by
          update_dt
          vehicle_no
        }
      }
    }
  }
`

export const ADD_OUT_GATE_SURVEY = gql`
  mutation addOutGateSurvey($outGateSurvey: OutGateSurveyRequestInput!, $outGate: OutGateRequestInput!) {
    record: addOutGateSurvey(outGateSurveyRequest: $outGateSurvey, outGateRequest: $outGate) {
      affected
      guid
    }
  }
`;

export const UPDATE_OUT_GATE_SURVEY = gql`
  mutation updateOutGateSurvey($outGateSurvey: OutGateSurveyRequestInput!, $outGate: OutGateRequestInput!) {
    updateOutGateSurvey(outGateSurveyRequest: $outGateSurvey, outGateRequest: $outGate)
  }
`;

export class OutGateSurveyDS extends BaseDataSource<OutGateSurveyItem> {
  constructor(private apollo: Apollo) {
    super();
  }  

  getOutGateSurveyByIDForMovement(sot_guid: string): Observable<OutGateSurveyItem[]> {
    this.loadingSubject.next(true);
    let where: any = { out_gate: { so_tank_guid: { eq: sot_guid }, delete_dt: { eq: null } } }
    return this.apollo
      .query<any>({
        query: QUERY_OUT_GATE_SURVEY_BY_ID_FOR_MOVEMENT,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as OutGateSurveyItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const retResult = result.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(retResult.nodes);
          this.totalCount = retResult.totalCount;
          return retResult.nodes;
        })
      );
  }

  addOutGateSurvey(outGateSurvey: any, outGate: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: ADD_OUT_GATE_SURVEY,
      variables: {
        outGateSurvey,
        outGate
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  updateOutGateSurvey(outGateSurvey: any, outGate: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: UPDATE_OUT_GATE_SURVEY,
      variables: {
        outGateSurvey,
        outGate
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  // getInGateCountForYetToSurvey(): Observable<number> {
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
}