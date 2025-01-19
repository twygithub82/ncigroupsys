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
import { JobOrderGO, JobOrderItem } from './job-order';
import { BillingItem } from './billing';

export class InGateCleaningGO {
  public action?: string = '';
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
  public remarks?: string;
  public sot_guid?: string;
  public status_cv?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  public customer_billing_guid?:string;
  public owner_billing_guid?:string;

  constructor(item: Partial<InGateCleaningGO> = {}) {
    this.action = item.action || '';
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
    this.na_dt = item.na_dt;
    this.remarks = item.remarks;
    this.sot_guid = item.sot_guid;
    this.status_cv = item.status_cv;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
    this.customer_billing_guid= item.customer_billing_guid;
    this.owner_billing_guid= item.owner_billing_guid;
  }
}

export class InGateCleaningItem extends InGateCleaningGO {
  public storing_order_tank?: StoringOrderTankItem;
  public customer_company?: CustomerCompanyItem;
  public job_order?: JobOrderItem;
  public customer_billing?:BillingItem;
  public owner_billing?:BillingItem;

  constructor(item: Partial<InGateCleaningItem> = {}) {
    super(item)
    this.storing_order_tank = item.storing_order_tank;
    this.customer_company = item.customer_company;
    this.job_order = item.job_order;
    this.customer_billing= item.customer_billing;
    this.owner_billing=item.owner_billing;
  }
}

export interface InGateCleaningResult {
  items: InGateCleaningItem[];
  totalCount: number;
}


// export class CleanJobOrderRequest {
//   public guid?: string;
//   public job_order?: JobOrderGO[];
//   public remarks?: string;
//   public sot_guid?: string;
//   constructor(item: Partial<CleanJobOrderRequest> = {}) {
   
//     this.guid = item.guid;
//     this.job_order = item.job_order;
//     this.remarks = item.remarks;
//     this.sot_guid = item.sot_guid;
//   }
// }

const SEARCH_CLEANING_BILLING_QUERY = gql`
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
        customer_company {
            code
            currency_guid
            def_tank_guid
            delete_dt
            effective_dt
            guid
            main_customer_guid
            name
            remarks
            type_cv
        }
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
        customer_billing_guid
        customer_billing
        {
          bill_to_guid
          delete_dt
          invoice_dt
          invoice_due
          invoice_no
          remarks
          status_cv
          currency{
            currency_code
            currency_name
            rate
            delete_dt
          }
          customer_company {
              code
              currency_guid
              def_tank_guid
              def_template_guid
              delete_dt
              effective_dt
              guid
              main_customer_guid
              name
              remarks
              type_cv
          }
        }
        owner_billing_guid
        owner_billing{
          bill_to_guid
          delete_dt
          invoice_dt
          invoice_due
          invoice_no
          remarks
          status_cv
          currency{
            currency_code
            currency_name
            rate
            delete_dt
          }
          customer_company {
              code
              currency_guid
              def_tank_guid
              def_template_guid
              delete_dt
              effective_dt
              guid
              main_customer_guid
              name
              remarks
              type_cv
          }
        }
        storing_order_tank {
          tank_no
          tank_status_cv
          customer_company {
              code
              currency_guid
              def_tank_guid
              def_template_guid
              delete_dt
              effective_dt
              guid
              main_customer_guid
              name
              remarks
              type_cv
              
          }
          tariff_cleaning {
            alias
            ban_type_cv
            in_gate_alert
            nature_cv
            cargo
            class_cv
            remarks
          }
          in_gate {
            eir_dt
            eir_no
            eir_status_cv
            delete_dt
            guid
          }
          out_gate{
            guid
            out_gate_survey{
              guid
              create_dt
              delete_dt
            }
          }
        }
      }
    }
  }
`;

const SEARCH_IN_GATE_CLEANING_QUERY = gql`
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
        job_order {
          team {
            create_by
            create_dt
            delete_dt
            department_cv
            description
            guid
            update_by
            update_dt
          }
          cleaning{
            guid
          }
          time_table(
          where: { start_time: { neq: null }, stop_time: { eq: null } }
          ) {
            create_by
            create_dt
            delete_dt
            guid
            job_order_guid
            start_time
            stop_time
            update_by
            update_dt
          }
          complete_dt
          create_by
          create_dt
          delete_dt
          guid
          job_order_no
          job_type_cv
          qc_dt
          qc_by
          remarks
          sot_guid
          start_dt
          status_cv
          team_guid
          total_hour
          update_by
          update_dt
          working_hour
        }
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
          repair{
            guid
            status_cv
          }
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
            delete_dt
            guid
            in_gate_survey {
              last_test_cv
              test_class_cv
              test_dt
              next_test_cv
            }
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
            in_gate_alert
            nature_cv
            cargo
            class_cv
            remarks
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

const GET_IN_GATE_CLEANING_BY_SOT = gql`
  query queryInGateCleaning($where: cleaningFilterInput) {
    resultList: queryCleaning(where: $where) {
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
        job_order {
          team {
            create_by
            create_dt
            delete_dt
            department_cv
            description
            guid
            update_by
            update_dt
          }
          complete_dt
          create_by
          create_dt
          delete_dt
          guid
          job_order_no
          job_type_cv
          qc_dt
          qc_by
          remarks
          sot_guid
          start_dt
          status_cv
          team_guid
          total_hour
          update_by
          update_dt
          working_hour
        }
      }
    }
  }
`;

export const UPDATE_IN_GATE_CLEANING = gql`
  mutation updateCleaning($clean: cleaningInput!) {
    updateCleaning(cleaning: $clean)
  }
`;

const ABORT_IN_GATE_CLEANING = gql`
  mutation abortCleaning($clnJobOrder: CleaningJobOrderInput!) {
    abortCleaning(cleaningJobOrder: $clnJobOrder)
  }
`

const ROLLBACK_COMPLETED_CLEANING = gql`
  mutation rollbackCompletedCleaning($clnJobOrder: CleaningJobOrderInput!) {
    rollbackCompletedCleaning(cleaningJobOrder: $clnJobOrder)
  }
`

export class InGateCleaningDS extends BaseDataSource<InGateCleaningItem> {
  constructor(private apollo: Apollo) {
    super();
  }


  searchWithBilling(where?: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<InGateCleaningItem[]> {
    this.loadingSubject.next(true);
    return this.apollo
      .query<any>({
        query: SEARCH_CLEANING_BILLING_QUERY,
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

  getCleaningForMovement(sot_guid?: any): Observable<InGateCleaningItem[]> {
    this.loadingSubject.next(true);
    const where = this.addDeleteDtCriteria({ sot_guid: { eq: sot_guid } })
    return this.apollo
      .query<any>({
        query: GET_IN_GATE_CLEANING_BY_SOT,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => {
          const retResult = result?.data?.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(retResult.nodes);
          this.totalCount = retResult.totalCount;
          this.pageInfo = retResult.pageInfo;
          return retResult.nodes;
        }),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as InGateCleaningItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false))
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

  abortInGateCleaning(clnJobOrder: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ABORT_IN_GATE_CLEANING,
      variables: {
        clnJobOrder
      }
    });
  }

  rollbackCompletedCleaning(clnJobOrder: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ROLLBACK_COMPLETED_CLEANING,
      variables: {
        clnJobOrder
      }
    });
  }

  getProcessingDate(cleaning: InGateCleaningItem | undefined): string | undefined {
    if (cleaning?.approve_dt && cleaning?.complete_dt) {
      const timeTakenMs = cleaning?.complete_dt - cleaning?.approve_dt;

      if (timeTakenMs === undefined || timeTakenMs < 0) {
        return "Invalid time data";
      }

      const days = Math.floor(timeTakenMs / (3600 * 24));

      return `${days}`;
    } else {
      return undefined;
    }
  }
}


