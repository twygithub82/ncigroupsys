import { ApolloError } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { BaseDataSource } from './base-ds';
import { OutGateSurveyItem } from './out-gate-survey';
import { StoringOrderTankGO, StoringOrderTankItem } from './storing-order-tank';

export class OutGate {
  public guid?: string = '';
  public driver_name?: string;
  public eir_dt?: number;
  public eir_no?: string;
  public eir_status_cv?: string;
  public so_tank_guid?: string;
  public vehicle_no?: string;
  public yard_cv?: string;
  public remarks?: string;
  public haulier?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<OutGate> = {}) {
    this.guid = item?.guid || '';
    this.driver_name = item?.driver_name;
    this.eir_dt = item?.eir_dt;
    this.eir_no = item?.eir_no;
    this.eir_status_cv = item?.eir_status_cv;
    this.so_tank_guid = item?.so_tank_guid;
    this.vehicle_no = item?.vehicle_no;
    this.yard_cv = item?.yard_cv;
    this.remarks = item?.remarks;
    this.haulier = item?.haulier;
    this.create_dt = item?.create_dt;
    this.create_by = item?.create_by;
    this.update_dt = item?.update_dt;
    this.update_by = item?.update_by;
    this.delete_dt = item?.delete_dt;
  }
}

export class OutGateGO extends OutGate {
  public tank?: StoringOrderTankGO;
  public out_gate_survey?: OutGateSurveyItem;

  constructor(item: Partial<OutGateGO> = {}) {
    super(item);
    this.tank = item?.tank;
    this.out_gate_survey = item?.out_gate_survey;
  }
}

export class OutGateItem extends OutGateGO {
  public override tank?: StoringOrderTankItem;

  constructor(item: Partial<OutGateItem> = {}) {
    super(item);
    this.tank = item.tank;
  }
}

export interface OutGateResult {
  items: OutGateItem[];
  totalCount: number;
}

export const SEARCH_OUT_GATE_FOR_SURVEY_QUERY = gql`
  query queryOutGates($where: out_gateFilterInput, $order: [out_gateSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
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
        remarks
        so_tank_guid
        update_by
        update_dt
        yard_cv
        vehicle_no
        out_gate_survey {
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
          release_order_sot(where: { status_cv: { eq: "ACCEPTED" } }) {
            guid
          }
        }
      }
    }
  }
`;

export const GET_OUT_GATE_BY_ID = gql`
  query queryOutGates($where: out_gateFilterInput, $roSotGuid: String) {
    resultList: queryOutGates(where: $where) {
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
        remarks
        so_tank_guid
        update_by
        update_dt
        yard_cv
        vehicle_no
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
          release_order_sot(where: { guid: { eq: $roSotGuid }, status_cv: { eq: "ACCEPTED" } }) {
            create_by
            create_dt
            delete_dt
            guid
            remarks
            ro_guid
            sot_guid
            status_cv
            update_by
            update_dt
            release_order {
              create_by
              create_dt
              customer_company_guid
              delete_dt
              guid
              haulier
              release_dt
              remarks
              ro_generated
              ro_no
              ro_notes
              status_cv
              update_by
              update_dt
              customer_company {
                address_line1
                address_line2
                agreement_due_dt
                city
                code
                country
                create_by
                create_dt
                currency_guid
                def_tank_guid
                def_template_guid
                delete_dt
                effective_dt
                email
                guid
                main_customer_guid
                name
                phone
                postal
                remarks
                type_cv
                update_by
                update_dt
                website
              }
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
            last_eir_no
            last_notify_dt
            last_release_dt
            last_test_cv
            manufacturer_cv
            max_weight_cv
            next_test_cv
            owner_guid
            previous_owner_guid
            previous_tank_no
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
        out_gate_survey {
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
          out_gate_guid
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

export const GET_OUT_GATE_BY_ID_FOR_MOVEMENT = gql`
  query queryOutGates($where: out_gateFilterInput) {
    resultList: queryOutGates(where: $where) {
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
        remarks
        so_tank_guid
        update_by
        update_dt
        yard_cv
        vehicle_no
      }
    }
  }
`;

export const ADD_OUT_GATE = gql`
  mutation AddOutGate($outGate: out_gateInput!, $releaseOrder: release_orderInput!, $hasOutSurvey: Boolean!) {
    addOutGate(outGate: $outGate, releaseOrder: $releaseOrder, hasOutSurvey: $hasOutSurvey) {
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

export const PUBLISH_OUT_GATE = gql`
  mutation publishOutgateSurvey($outGateRequest: OutGateRequestInput!) {
    publishOutgateSurvey(outGateRequest: $outGateRequest)
  }
`;


export const GET_OUT_GATE_YET_TO_SURVEY_COUNT = gql`
 query queryOutGateCount($where: out_gateFilterInput) {
    outGates: queryOutGates(where: $where) {
      totalCount
  }
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
        query: SEARCH_OUT_GATE_FOR_SURVEY_QUERY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => {
          const retResult = result.data.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(retResult.nodes);
          this.totalCount = retResult.totalCount;
          this.pageInfo = retResult.pageInfo;
          return retResult.nodes;
        }),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as OutGateItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  getOutGateByID(id: string, roSotGuid: string): Observable<OutGateItem[]> {
    this.loadingSubject.next(true);
    let where = this.addDeleteDtCriteria({ guid: { eq: id } });
    return this.apollo
      .query<any>({
        query: GET_OUT_GATE_BY_ID,
        variables: { where, roSotGuid },
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
          const retResult = data.resultList || { nodes: [], totalCount: 0 };

          // Update internal state
          this.dataSubject.next(retResult.nodes);
          this.totalCount = retResult.totalCount;

          // Return the nodes
          return retResult.nodes;
        }),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as OutGateItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  getOutGateByIDForMovement(sot_guid: string): Observable<OutGateItem[]> {
    this.loadingSubject.next(true);
    let where: any = { so_tank_guid: { eq: sot_guid }, delete_dt: { eq: null } }
    return this.apollo
      .query<any>({
        query: GET_OUT_GATE_BY_ID_FOR_MOVEMENT,
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
          return of([] as OutGateItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  addOutGate(outGate: any, releaseOrder: any, hasOutSurvey: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: ADD_OUT_GATE,
      variables: {
        outGate,
        releaseOrder,
        hasOutSurvey
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  updateOutGate(outGate: any, releaseOrder: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: UPDATE_OUT_GATE,
      variables: {
        outGate,
        releaseOrder
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
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

  publishOutGateSurvey(outGateRequest: any): Observable<any> {
    this.actionLoadingSubject.next(true);
    return this.apollo.mutate({
      mutation: PUBLISH_OUT_GATE,
      variables: {
        outGateRequest
      }
    }).pipe(
      finalize(() => {
        this.actionLoadingSubject.next(false);
      })
    );
  }

  getOutGateItem(out_gates: OutGateItem[] | undefined): OutGateItem | undefined {
    return out_gates?.find(og => og.eir_status_cv !== 'CANCELED' && !(og.delete_dt));
  }

   getOutGateCountForYetToSurvey(): Observable<number> {
      this.loadingSubject.next(true);
      let where: any = { eir_status_cv: { eq: 'YET_TO_SURVEY' } }
      return this.apollo
        .query<any>({
          query: GET_OUT_GATE_YET_TO_SURVEY_COUNT,
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
            const retResult = result.outGates || { nodes: [], totalCount: 0 };
  
            return retResult.totalCount;
          })
        );
    }

    getOutGateCountForYetToPublish(): Observable<number> {
        this.loadingSubject.next(true);
        let where: any = { eir_status_cv: { eq: 'PENDING' } }
        return this.apollo
          .query<any>({
            query: GET_OUT_GATE_YET_TO_SURVEY_COUNT,
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
              const retResult = result.outGates || { nodes: [], totalCount: 0 };
    
              return retResult.totalCount;
            })
          );
      }  
}


