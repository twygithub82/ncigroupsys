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
import { InGateItem } from './in-gate';
import { TariffBufferItem } from './tariff-buffer';

export class InGateSurveyGO {
  public guid?: string = '';
  public in_gate_guid?: string = '';
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

  constructor(item: Partial<InGateSurveyGO> = {}) {
    this.guid = item?.guid ?? '';
    this.in_gate_guid = item?.in_gate_guid ?? '';
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

export class InGateSurveyItem extends InGateSurveyGO {
  public in_gate?: InGateItem;
  public tariff_buffer?: TariffBufferItem;

  constructor(item: Partial<InGateSurveyItem> = {}) {
    super(item);
    this.in_gate = item?.in_gate;
    this.tariff_buffer = item?.tariff_buffer;
  }
}

export interface InGateResult {
  items: InGateSurveyItem[];
  totalCount: number;
}



export const GET_IN_GATE_YET_TO_SURVEY_COUNT = gql`
 query queryInGateCount($where: ig_gateFilterInput) {
    inGates: queryInGates(where: $where) {
      totalCount
  }
}
`;

export const SEARCH_IN_GATE_FOR_SURVEY_QUERY = gql`
  query queryInGateForSurvey($where: ig_gateFilterInput, $order: [ig_gateSortInput!]) {
    inGates: queryInGates(where: $where, order: $order) {
      totalCount
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

export const QUERY_IN_GATE_SURVEY_BY_ID = gql`
  query queryInGateSurveyByID($where: in_gate_surveyFilterInput){
    inGatesSurvey: queryInGateSurvey(where: $where) {
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
        in_gate_guid
        inspection_dt
        ladder
        last_release_dt
        last_test_cv
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
        in_gate {
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
            storing_order {
              haulier
              so_no
              customer_company {
                code
                name
              }
            }
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
          }
        }
      }
    }
  }
`

export const QUERY_IN_GATE_SURVEY_BY_ID_FOR_MOVEMENT = gql`
  query queryInGateSurveyByID($where: in_gate_surveyFilterInput){
    inGatesSurvey: queryInGateSurvey(where: $where) {
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
        in_gate_guid
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
        in_gate {
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
        }
        tariff_buffer {
          guid
          buffer_type
        }
      }
    }
  }
`

export const ADD_IN_GATE_SURVEY = gql`
  mutation AddInGateSurvey($inGateSurvey: InGateSurveyRequestInput!, $inGate: in_gateInput!) {
    record: addInGateSurvey(inGateSurveyRequest: $inGateSurvey, inGateRequest: $inGate) {
      affected
      guid
    }
  }
`;

export const UPDATE_IN_GATE_SURVEY = gql`
  mutation UpdateInGateSurvey($inGateSurvey: InGateSurveyRequestInput!, $inGate: in_gateInput!) {
    updateInGateSurvey(inGateSurveyRequest: $inGateSurvey, inGateRequest: $inGate)
  }
`;

export class InGateSurveyDS extends BaseDataSource<InGateSurveyItem> {
  constructor(private apollo: Apollo) {
    super();
  }

  loadItems(where?: any, order?: any): Observable<InGateSurveyItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: SEARCH_IN_GATE_FOR_SURVEY_QUERY,
        variables: { where, order },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as InGateSurveyItem[]); // Return an empty array on error
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

  getInGateSurveyByID(id: string): Observable<InGateSurveyItem[]> {
    this.loadingSubject.next(true);
    let where: any = { in_gate: { guid: { eq: id } } }
    return this.apollo
      .query<any>({
        query: QUERY_IN_GATE_SURVEY_BY_ID,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as InGateSurveyItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const retResult = result.inGatesSurvey || { nodes: [], totalCount: 0 };
          this.dataSubject.next(retResult.nodes);
          this.totalCount = retResult.totalCount;
          return retResult.nodes;
        })
      );
  }

  getInGateSurveyByIDForMovement(sot_guid: string): Observable<InGateSurveyItem[]> {
    this.loadingSubject.next(true);
    let where: any = { in_gate: { so_tank_guid: { eq: sot_guid }, delete_dt: { eq: null } } }
    return this.apollo
      .query<any>({
        query: QUERY_IN_GATE_SURVEY_BY_ID_FOR_MOVEMENT,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as InGateSurveyItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const retResult = result.inGatesSurvey || { nodes: [], totalCount: 0 };
          this.dataSubject.next(retResult.nodes);
          this.totalCount = retResult.totalCount;
          return retResult.nodes;
        })
      );
  }

  addInGateSurvey(inGateSurvey: any, inGate: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: ADD_IN_GATE_SURVEY,
      variables: {
        inGateSurvey,
        inGate
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  updateInGateSurvey(inGateSurvey: any, inGate: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: UPDATE_IN_GATE_SURVEY,
      variables: {
        inGateSurvey,
        inGate
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }
}


