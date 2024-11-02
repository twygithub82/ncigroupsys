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
import { InGateSurveyItem } from './in-gate-survey';
import { CustomerCompanyItem } from './customer-company';

export class InGateCleaningGO {
  public action?:string='';
  public guid?: string = '';
  public job_no?: string;
  public allocate_by?: string;
  public allocate_dt?: number;
  public approve_by?: string;
  public approve_dt?: number;
  public bill_to_guid?: string;
  public buffer_cost?: number;
  public cleaning_cost?: number;
  public complete_by?: string;
  public complete_dt?: number;
  public na_dt?: number;
  public remarks?:string;
  public sot_guid?:string;
  public status_cv?:string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<InGateCleaningGO> = {}) {
    this.action=item.action||'';
    this.guid = item.guid || '';
    this.job_no = item.job_no;
    this.allocate_by = item.allocate_by;
    this.allocate_dt = item.allocate_dt;
    this.approve_by = item.approve_by;
    this.approve_dt = item.approve_dt;
    this.bill_to_guid = item.bill_to_guid;
    this.buffer_cost = item.buffer_cost;
    this.cleaning_cost = item.cleaning_cost;
    this.complete_by = item.complete_by;
    this.complete_dt = item.complete_dt;
    this.na_dt=item.na_dt;
    this.remarks = item.remarks;
    this.sot_guid=item.sot_guid;
    this.status_cv=item.status_cv;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class InGateCleaningItem extends InGateCleaningGO {
  public storing_order_tank?: StoringOrderTankGO;
  public customer_company?: CustomerCompanyItem;

  constructor(item: Partial<InGateCleaningItem> = {}) {
    super(item)
    this.storing_order_tank = item.storing_order_tank;
    this.customer_company = item.customer_company ;
  }
}



export interface InGateCleaningResult {
  items: InGateCleaningItem[];
  totalCount: number;
}



// export const GET_IN_GATE_YET_TO_SURVEY_COUNT = gql`
//  query queryInGateCount($where: in_gateFilterInput) {
//     inGates: queryInGates(where: $where) {
//       totalCount
//   }
// }
// `;

export const SEARCH_IN_GATE_CLEANING_QUERY = gql`
  query queryInGateCleaning($where: cleaningFilterInput, $order: [cleaningSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    inGates: queryCleaning(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
       nodes {
        allocate_by
        allocate_dt
        approve_by
        approve_dt
        bill_to_guid
        buffer_cost
        cleaning_cost
        complete_by
        complete_dt
        create_by
        create_dt
        delete_dt
        guid
        job_no
        na_dt
        remarks
        sot_guid
        status_cv
        update_by
        update_dt
        storing_order_tank {
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
          takein_job_no
          tank_no
          tank_status_cv
          unit_type_guid
          update_by
          update_dt
          storing_order {
            customer_company_guid
            guid
            haulier
            remarks
            so_no
            so_notes
            status_cv
            update_by
            update_dt
            customer_company {
              code
              currency_guid
              def_tank_guid
              def_template_guid
              delete_dt
              effective_dt
              email
              guid
              main_customer_guid
              name
              remarks
              type_cv
              update_by
              update_dt
              }
            }
          in_gate {
            eir_dt
            eir_no
            eir_status_cv
            guid
          }
          customer_company {
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
            
          }
          tariff_cleaning {
            alias
            ban_type_cv
            cargo
            class_cv
            cleaning_category_guid
            cleaning_method_guid
            cleaning_method {
              description
              guid
              name
            }
            cleaning_category {
            cost
            description
            guid
            name
            } 
          }
        }
      }
      
    }
  }
`;

// export const GET_IN_GATE_BY_ID = gql`
//   query getInGateByID($where: in_gateFilterInput) {
//     inGates: queryInGates(where: $where) {
//       totalCount
//       nodes {
//         create_by
//         create_dt
//         delete_dt
//         driver_name
//         eir_dt
//         eir_no
//         eir_status_cv
//         guid
//         haulier
//         lolo_cv
//         preinspection_cv
//         remarks
//         so_tank_guid
//         update_by
//         update_dt
//         vehicle_no
//         yard_cv
//         tank {
//           certificate_cv
//           clean_status_cv
//           create_by
//           create_dt
//           delete_dt
//           estimate_cv
//           eta_dt
//           etr_dt
//           guid
//           job_no
//           last_cargo_guid
//           last_test_guid
//           liftoff_job_no
//           lifton_job_no
//           owner_guid
//           preinspect_job_no
//           purpose_cleaning
//           purpose_repair_cv
//           purpose_steam
//           purpose_storage
//           release_job_no
//           remarks
//           required_temp
//           so_guid
//           status_cv
//           takein_job_no
//           tank_no
//           tank_status_cv
//           unit_type_guid
//           update_by
//           update_dt
//           customer_company {
//             code
//             guid
//             name
//           }
//           tariff_cleaning {
//             alias
//             ban_type_cv
//             cargo
//             class_cv
//             cleaning_category_guid
//             cleaning_method_guid
//             create_by
//             create_dt
//             delete_dt
//             depot_note
//             description
//             flash_point
//             guid
//             hazard_level_cv
//             in_gate_alert
//             msds_guid
//             nature_cv
//             open_on_gate_cv
//             remarks
//             un_no
//             update_by
//             update_dt
//           }
//           storing_order {
//             so_no
//             haulier
//             customer_company {
//               code
//               name
//               guid
//             }
//           }
//         }
//         in_gate_survey {
//           airline_valve_conn_cv
//           airline_valve_conn_spec_cv
//           airline_valve_cv
//           airline_valve_dim
//           airline_valve_pcs
//           btm_dis_comp_cv
//           btm_dis_valve_cv
//           btm_dis_valve_spec_cv
//           btm_valve_brand_cv
//           buffer_plate
//           capacity
//           cladding_cv
//           comments
//           create_by
//           create_dt
//           data_csc_transportplate
//           delete_dt
//           dipstick
//           dom_dt
//           foot_valve_cv
//           guid
//           height_cv
//           in_gate_guid
//           inspection_dt
//           ladder
//           last_release_dt
//           last_test_cv
//           manlid_comp_cv
//           manlid_cover_cv
//           manlid_cover_pcs
//           manlid_cover_pts
//           manlid_seal_cv
//           manufacturer_cv
//           max_weight_cv
//           next_test_cv
//           pv_spec_cv
//           pv_spec_pcs
//           pv_type_cv
//           pv_type_pcs
//           residue
//           safety_handrail
//           take_in_reference
//           tank_comp_cv
//           tare_weight
//           test_class_cv
//           test_dt
//           thermometer
//           thermometer_cv
//           top_dis_comp_cv
//           top_dis_valve_cv
//           top_dis_valve_spec_cv
//           top_valve_brand_cv
//           update_by
//           update_dt
//           walkway_cv
//           top_coord
//           bottom_coord
//           front_coord
//           rear_coord
//           left_coord
//           right_coord
//           top_remarks
//           bottom_remarks
//           front_remarks
//           rear_remarks
//           left_remarks
//           right_remarks
//         }
//       }
//     }
//   }
// `;

// export const ADD_IN_GATE = gql`
//   mutation AddInGate($inGate: in_gateInput!) {
//     addInGate(inGate: $inGate)
//   }
// `;

export const UPDATE_IN_GATE_CLEANING = gql`
  mutation updateCleaning($clean: cleaningInput!) {
    updateCleaning(cleaning: $clean)
  }
`;

export class InGateCleaningDS extends BaseDataSource<InGateCleaningItem> {
  constructor(private apollo: Apollo) {
    super();
  }

  search(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<InGateCleaningItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: SEARCH_IN_GATE_CLEANING_QUERY,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as InGateCleaningItem[]); // Return an empty array on error
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

 

  updateInGateCleaning(clean: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_IN_GATE_CLEANING,
      variables: {
        clean
      }
    });
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

  // getInGateItem(in_gates: InGateItem[] | undefined): InGateItem | undefined {
  //   return in_gates?.find(ig => ig.delete_dt === null);
  // }
  // getInGateByID(id: string): Observable<InGateItem[]> {
  //   this.loadingSubject.next(true);
  //   let where = this.addDeleteDtCriteria({ guid: { eq: id } });
  //   return this.apollo
  //     .query<any>({
  //       query: GET_IN_GATE_BY_ID,
  //       variables: { where },
  //       fetchPolicy: 'no-cache' // Disable caching for this query
  //     })
  //     .pipe(
  //       // Handle the response and errors
  //       map((result) => {
  //         const data = result.data;
  //         if (!data) {
  //           throw new Error('No data returned from query');
  //         }
  
  //         // Extract the nodes and totalCount
  //         const retResult = data.inGates || { nodes: [], totalCount: 0 };
  
  //         // Update internal state
  //         this.dataSubject.next(retResult.nodes);
  //         this.totalCount = retResult.totalCount;
  
  //         // Return the nodes
  //         return retResult.nodes;
  //       }),
  //       catchError((error: ApolloError) => {
  //         console.error('GraphQL Error:', error);
  //         return of([] as InGateItem[]); // Return an empty array on error
  //       }),
  //       finalize(() => this.loadingSubject.next(false))
  //     );
  // }

  // addInGate(inGate: any): Observable<any> {
  //   return this.apollo.mutate({
  //     mutation: ADD_IN_GATE,
  //     variables: {
  //       inGate
  //     }
  //   });
  // }
}


