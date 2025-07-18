import { ApolloError } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { BaseDataSource } from './base-ds';
import { InGateSurveyItem } from './in-gate-survey';
import { StoringOrderTankGO, StoringOrderTankItem } from './storing-order-tank';

export class InGate {
  public guid?: string = '';
  public driver_name?: string;
  public eir_dt?: number;
  public eir_no?: string;
  public eir_status_cv?: string;
  public lolo_cv?: string;
  public preinspection_cv?: string;
  public so_tank_guid?: string;
  public vehicle_no?: string;
  public yard_cv?: string;
  public remarks?: string;
  public haulier?: string;
  public publish_dt?: number;
  public publish_by?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<InGate> = {}) {
    this.guid = item?.guid || '';
    this.driver_name = item?.driver_name;
    this.eir_dt = item?.eir_dt;
    this.eir_no = item?.eir_no;
    this.eir_status_cv = item?.eir_status_cv;
    this.lolo_cv = item?.lolo_cv;
    this.preinspection_cv = item?.preinspection_cv;
    this.so_tank_guid = item?.so_tank_guid;
    this.vehicle_no = item?.vehicle_no;
    this.yard_cv = item?.yard_cv;
    this.remarks = item?.remarks;
    this.haulier = item?.haulier;
    this.publish_dt = item?.publish_dt;
    this.publish_by = item?.publish_by;
    this.create_dt = item?.create_dt;
    this.create_by = item?.create_by;
    this.update_dt = item?.update_dt;
    this.update_by = item?.update_by;
    this.delete_dt = item?.delete_dt;
  }
}

export class InGateGO extends InGate {
  public tank?: StoringOrderTankGO;
  public in_gate_survey?: InGateSurveyItem;

  constructor(item: Partial<InGateGO> = {}) {
    super(item)
    this.tank = item?.tank;
    this.in_gate_survey = item?.in_gate_survey ? new InGateSurveyItem(item?.in_gate_survey) : undefined;
  }
}

export class InGateItem extends InGateGO {
  public override tank?: StoringOrderTankItem;

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
 query queryInGateCount($where: in_gateFilterInput) {
    inGates: queryInGatesCount(where: $where) {
      nodes{
      guid
      delete_dt
      }
      totalCount
  }
}
`;



export const SEARCH_IN_GATE_FOR_SURVEY_QUERY = gql`
  query queryInGateForSurvey($where: in_gateFilterInput, $order: [in_gateSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    inGates: queryInGates(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
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
      totalCount
    }
  }
`;

export const GET_IN_GATE_BY_ID = gql`
  query getInGateByID($where: in_gateFilterInput) {
    inGates: queryInGates(where: $where) {
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
          last_cargo_guid
          last_test_guid
          liftoff_job_no
          lifton_job_no
          owner_guid
          preinspect_job_no
          purpose_cleaning
          purpose_repair_cv
          purpose_steam
          purpose_storage
          release_job_no
          remarks
          required_temp
          so_guid
          status_cv
          tank_no
          tank_status_cv
          unit_type_guid
          update_by
          update_dt
          last_release_dt
          customer_company {
            code
            guid
            name
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
          storing_order {
            so_no
            haulier
            customer_company {
              code
              name
              guid
            }
          }
          tank_info {
            capacity
            cladding_cv
            create_by
            create_dt
            delete_dt
            dom_dt
            guid
            height_cv
            last_notify_dt
            last_release_dt
            last_test_cv
            manufacturer_cv
            max_weight_cv
            next_test_cv
            owner_guid
            tank_comp_guid
            tank_no
            tare_weight
            test_class_cv
            test_dt
            unit_type_guid
            update_by
            update_dt
            walkway_cv
            yard_cv
          }
        }
        in_gate_survey {
          airline_valve_conn_cv
          airline_valve_conn_spec_cv
          airline_valve_cv
          airline_valve_dim
          airline_valve_pcs
          btm_dis_comp_cv
          btm_dis_valve_cv
          btm_dis_valve_spec_cv
          btm_valve_brand_cv
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
          last_test_cv
          manlid_comp_cv
          manlid_cover_cv
          manlid_cover_pcs
          manlid_cover_pts
          manlid_seal_cv
          manufacturer_cv
          max_weight_cv
          next_test_cv
          pv_spec_cv
          pv_spec_pcs
          pv_type_cv
          pv_type_pcs
          residue
          safety_handrail
          take_in_reference
          tank_comp_guid
          tare_weight
          test_class_cv
          test_dt
          thermometer
          thermometer_cv
          top_dis_comp_cv
          top_dis_valve_cv
          top_dis_valve_spec_cv
          top_valve_brand_cv
          update_by
          update_dt
          walkway_cv
          top_coord
          bottom_coord
          front_coord
          rear_coord
          left_coord
          right_coord
          top_remarks
          bottom_remarks
          front_remarks
          rear_remarks
          left_remarks
          right_remarks
          airline_valve_conn_oth
          airline_valve_conn_spec_oth
          airline_valve_oth
          btm_dis_valve_oth
          btm_dis_valve_spec_oth
          foot_valve_oth
          manlid_cover_oth
          top_dis_valve_oth
          top_dis_valve_spec_oth
        }
      }
    }
  }
`;

export const GET_IN_GATE_BY_ID_FOR_MOVEMENT = gql`
  query getInGateByID($where: in_gateFilterInput) {
    resultList: queryInGates(where: $where) {
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
      }
    }
  }
`;

export const ADD_IN_GATE = gql`
  mutation AddInGate($inGate: in_gateInput!) {
    addInGate(inGate: $inGate)
  }
`;

export const UPDATE_IN_GATE = gql`
  mutation UpdateInGate($inGate: in_gateInput!) {
    updateInGate(inGate: $inGate)
  }
`;

export const PUBLISH_IN_GATE_SURVEY = gql`
  mutation publishIngateSurvey($inGateRequest: in_gateInput!) {
    publishIngateSurvey(inGateRequest: $inGateRequest) {
      affected
      guid
      residue_guid
    }
  }
`;

export const UPDATE_GATE_DETAILS = gql`
  mutation updateGateDetails($gateDetailRequest: GateDetailRequestInput!) {
    updateGateDetails(gateDetailRequest: $gateDetailRequest)
  }
`;

export class InGateDS extends BaseDataSource<InGateItem> {
  constructor(private apollo: Apollo) {
    super();
  }

  searchInGateForSurvey(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<InGateItem[]> {
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
          return of([] as InGateItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const retResult = result.inGates || { nodes: [], totalCount: 0 };
          this.dataSubject.next(retResult.nodes);
          this.totalCount = retResult.totalCount;
          this.pageInfo = retResult.pageInfo;
          return retResult.nodes;
        })
      );
  }

  getInGateByID(id: string): Observable<InGateItem[]> {
    this.loadingSubject.next(true);
    let where = this.addDeleteDtCriteria({ guid: { eq: id } });
    return this.apollo
      .query<any>({
        query: GET_IN_GATE_BY_ID,
        variables: { where },
        fetchPolicy: 'no-cache' // Disable caching for this query
      })
      .pipe(
        // Handle the response and errors
        map((result) => {
          const data = result.data;
          if (!data) {
            throw new Error('No data returned from query');
          }
  
          // Extract the nodes and totalCount
          const retResult = data.inGates || { nodes: [], totalCount: 0 };
  
          // Update internal state
          this.dataSubject.next(retResult.nodes);
          this.totalCount = retResult.totalCount;
  
          // Return the nodes
          return retResult.nodes;
        }),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as InGateItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  getInGateByIDForMovement(sot_guid: string): Observable<InGateItem[]> {
    this.loadingSubject.next(true);
    let where: any = { so_tank_guid: { eq: sot_guid }, delete_dt: { eq: null } }
    return this.apollo
      .query<any>({
        query: GET_IN_GATE_BY_ID_FOR_MOVEMENT,
        variables: { where },
        fetchPolicy: 'no-cache' // Disable caching for this query
      })
      .pipe(
        // Handle the response and errors
        map((result) => {
          const retResult = result?.data.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(retResult.nodes);
          this.totalCount = retResult.totalCount;
          return retResult.nodes;
        }),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as InGateItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false))
      );
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

 getInGateCountForYetToPublish(): Observable<number> {
    this.loadingSubject.next(true);
    let where: any = { eir_status_cv: { eq: 'PENDING' } }
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

  addInGate(inGate: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: ADD_IN_GATE,
      variables: {
        inGate
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  updateInGate(inGate: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: UPDATE_IN_GATE,
      variables: {
        inGate
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  publishInGateSurvey(inGateRequest: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: PUBLISH_IN_GATE_SURVEY,
      variables: {
        inGateRequest
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  updateGateDetails(gateDetailRequest: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: UPDATE_GATE_DETAILS,
      variables: {
        gateDetailRequest
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  getInGateItem(in_gates: InGateItem[] | undefined): InGateItem | undefined {
    return in_gates?.find(ig => ig.delete_dt === null);
  }
}


