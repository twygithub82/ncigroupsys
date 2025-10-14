import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { BaseDataSource } from './base-ds';
import { BillingItem } from './billing';
import { CustomerCompanyItem } from './customer-company';
import { JobOrderItem } from './job-order';
import { SteamPartItem } from './steam-part';
import { StoringOrderTankItem } from './storing-order-tank';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';

export class SteamGO {
  public estimate_no?: string;
  public estimate_by?: string;
  public estimate_dt?: number;
  public allocate_by?: string;
  public allocate_dt?: number;
  public approve_by?: string;
  public approve_dt?: number;

  public bill_to_guid?: string;
  public complete_by?: string;
  public complete_dt?: number;
  public guid?: string;
  public job_no?: string;
  public remarks?: string;
  public sot_guid?: string;
  public status_cv?: string;

  public begin_by?: string;
  public begin_dt?: number;

  public na_dt?: number;

  public total_cost?: number;
  public total_hour?: number;

  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  public est_cost?: number;
  public est_hour?: number;

  public rate?: number;
  public flat_rate?: boolean;

  public total_material_cost?: number;
  public total_labour_cost?: number;
  public overwrite_remarks?: string;

  // public aspnetusers_guid?: string;
  // public estimate_no?: string;
  // public labour_cost_discount?: number;
  // public material_cost_discount?: number;
  // public labour_cost?: number;
  // public total_cost?: number;
  // public owner_enable?: boolean;
  // public total_hour?: number;
  public customer_billing_guid?: string;
  public owner_billing_guid?: string;

  constructor(item: Partial<SteamGO> = {}) {
    this.guid = item.guid;
    this.estimate_no = item.estimate_no;
    this.sot_guid = item.sot_guid;
    this.allocate_by = item.allocate_by;
    this.allocate_dt = item.allocate_dt;
    this.approve_by = item.approve_by;
    this.approve_dt = item.approve_dt;
    this.complete_by = item.complete_by;
    this.complete_dt = item.complete_dt;
    this.status_cv = item.status_cv;
    this.remarks = item.remarks;
    this.begin_by = item.begin_by;
    this.begin_dt = item.begin_dt;
    this.na_dt = item.na_dt;
    this.est_cost = item.est_cost;
    this.est_hour = item.est_hour;
    this.flat_rate = item.flat_rate;
    this.rate = item.rate;
    this.total_cost = item.total_cost;
    this.total_hour = item.total_hour;
    this.total_material_cost = item.total_material_cost;
    this.total_labour_cost = item.total_labour_cost;
    this.overwrite_remarks = item.overwrite_remarks;
    this.bill_to_guid = item.bill_to_guid;
    this.job_no = item.job_no;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}


export class SteamItem extends SteamGO {
  public steaming_part?: SteamPartItem[];
  public storing_order_tank?: StoringOrderTankItem;
  public customer_company?: CustomerCompanyItem;
  public customer_billing?: BillingItem;
  public owner_billing?: BillingItem;

  //public aspnetsuser?: UserItem;
  public actions?: string[]
  constructor(item: Partial<SteamItem> = {}) {
    super(item)
    this.steaming_part = item.steaming_part;
    this.storing_order_tank = item.storing_order_tank;
    this.customer_company = item.customer_company;
    this.customer_billing = item.customer_billing;
    this.owner_billing = item.owner_billing;
    // this.aspnetsuser = item.aspnetsuser;
    this.actions = item.actions;
  }
}

export class SteamTemp {
  public guid?: string;
  public bottom_temp?: number;
  public top_temp?: number;
  public meter_temp?: number;
  public job_order_guid?: string;
  public remarks?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;
  public report_dt?: number;

  public job_order?: JobOrderItem;

  constructor(item: Partial<SteamTemp> = {}) {

    this.report_dt = item.report_dt;
    this.guid = item.guid;
    this.bottom_temp = item.bottom_temp;
    this.top_temp = item.top_temp;
    this.meter_temp = item.meter_temp;
    this.job_order_guid = item.job_order_guid;
    this.remarks = item.remarks;
    this.job_order = item.job_order;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}
export class SteamPartRequest {
  public approve_part?: boolean;
  public guid?: string;
  constructor(item: Partial<SteamPartRequest> = {}) {

    this.guid = item.guid;
    this.approve_part = item.approve_part;

  }
}

export class SteamStatusRequest {
  public guid?: string;
  public action?: string;
  public remarks?: string;
  public sot_guid?: string;
  public steamingPartRequests?: SteamPartRequest[];
  //public aspnetsuser?: UserItem;

  constructor(item: Partial<SteamStatusRequest> = {}) {

    this.guid = item.guid;
    this.sot_guid = item.sot_guid;
    this.steamingPartRequests = item.steamingPartRequests;
    // this.aspnetsuser = item.aspnetsuser;
    this.action = item.action;
    this.remarks = item.remarks;
  }
}

export const GET_STEAM_BILLING_EST = gql`
  query querySteaming($where: steamingFilterInput, $order: [steamingSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: querySteaming(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        na_dt
        allocate_by
        allocate_dt
        approve_by
        approve_dt
        bill_to_guid
        customer_company {
          code
          currency_guid
          def_template_guid
          delete_dt
          effective_dt
          guid
          main_customer_guid
          name
          remarks
          type_cv
        }
        est_cost
        total_cost
        total_hour
        rate
        flat_rate
        total_material_cost
        total_labour_cost
        complete_by
        complete_dt
        create_by
        create_dt
        delete_dt
        estimate_no
        guid
        job_no
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
          tariff_cleaning {
            guid
            open_on_gate_cv
            cargo
          }
          storing_order {
            customer_company {
              guid
              code
              name
            }
          }
          in_gate {
            eir_no
            eir_dt
            delete_dt
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
        steaming_part {
            approve_cost
            approve_labour
            approve_part
            approve_qty
            complete_dt
            cost
            delete_dt
            description
            guid
            job_order_guid
            labour
            quantity
            steaming_guid
            tariff_steaming_guid
            steaming_exclusive_guid
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
              remarks
              sot_guid
              start_dt
              status_cv
              team_guid
              total_hour
              update_by
              update_dt
              working_hour
              storing_order_tank  {
                guid
                tank_no
              }
            }
          }
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

export const GET_STEAM_EST = gql`
  query querySteaming($where: steamingFilterInput, $order: [steamingSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: querySteaming(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        na_dt
        allocate_by
        allocate_dt
        approve_by
        approve_dt
        bill_to_guid
        complete_by
        complete_dt
        create_by
        create_dt
        delete_dt
        estimate_no
        guid
        job_no
        remarks
        sot_guid
        status_cv
        est_cost
        total_cost
        total_material_cost
        total_labour_cost
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
          tank_no
          tank_status_cv
          unit_type_guid
          update_by
          update_dt
          tariff_cleaning {
            guid
            open_on_gate_cv
            cargo
            remarks
          }
          storing_order {
            customer_company {
              guid
              code
              name
            }
          }
          in_gate {
            eir_no
            eir_dt
            delete_dt
            in_gate_survey {
              next_test_cv
              last_test_cv
              test_class_cv
              test_dt
              update_by
              update_dt
              delete_dt
            }
          }
        }
        steaming_part {
            approve_cost
            approve_labour
            approve_part
            approve_qty
            complete_dt
            cost
            delete_dt
            description
            guid
            job_order_guid
            labour
            quantity
            steaming_guid
            tariff_steaming_guid
            steaming_exclusive_guid
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
              remarks
              sot_guid
              start_dt
              status_cv
              team_guid
              total_hour
              update_by
              update_dt
              working_hour
              storing_order_tank  {
                guid
                tank_no
              }
            }
          }
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

export const GET_STEAM_EST_JOB_ORDER = gql`
  query querySteaming($where: steamingFilterInput,$steam_part_where:steaming_partFilterInput) {
    resultList: querySteaming(where: $where) {
      nodes {
        allocate_by
        allocate_dt
        approve_by
        approve_dt
        bill_to_guid
        complete_by
        complete_dt
        create_by
        create_dt
        delete_dt
        estimate_no
        na_dt
        guid
        job_no
        remarks
        sot_guid
        status_cv
        est_cost
        total_cost
        update_by
        update_dt
        storing_order_tank {
          customer_company {
            code
            name
            currency {
              currency_code
            }
          }
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
          tariff_cleaning {
            guid
            open_on_gate_cv
            cargo
            flash_point
          }
          storing_order {
            customer_company {
              guid
              code
              name
            }
          }
          in_gate {
            eir_no
            eir_dt
            delete_dt
            in_gate_survey {
              next_test_cv
              last_test_cv
              test_class_cv
              test_dt
              update_by
              update_dt
              delete_dt
            }
          }
        }
        steaming_part(where:$steam_part_where) {
          approve_part
          cost
          labour
          create_by
          create_dt
          delete_dt
          description
          guid
          job_order_guid
          approve_qty
          approve_cost
          quantity
          steaming_guid
          tariff_steaming_guid
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
            qc_dt
            qc_by
            guid
            job_order_no
            job_type_cv
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

export const GET_STEAM_FOR_MOVEMENT = gql`
  query querySteaming($where: steamingFilterInput) {
    resultList: querySteaming(where: $where) {
      nodes {
        allocate_by
        allocate_dt
        approve_by
        approve_dt
        begin_by
        begin_dt
        bill_to_guid
        complete_by
        complete_dt
        create_by
        create_dt
        delete_dt
        estimate_by
        estimate_dt
        estimate_no
        est_cost
        est_hour
        flat_rate
        total_cost
        total_material_cost
        total_labour_cost
        total_hour
        guid
        job_no
        na_dt
        rate
        remarks
        sot_guid
        status_cv
        total_cost
        update_by
        update_dt
        customer_billing_guid
        owner_billing_guid
        steaming_part {
          approve_cost
          approve_labour
          approve_part
          approve_qty
          complete_dt
          cost
          create_by
          create_dt
          delete_dt
          description
          guid
          job_order_guid
          labour
          quantity
          steaming_exclusive_guid
          steaming_guid
          tariff_steaming_guid
          update_by
          update_dt
          tariff_steaming {
            cost
            create_by
            create_dt
            delete_dt
            guid
            labour
            remarks
            temp_max
            temp_min
            update_by
            update_dt
          }
          job_order {
            guid
            status_cv
            steaming_temp(where: { delete_dt: { eq: null } }, order: { report_dt: ASC }) {
              report_dt
              top_temp
              bottom_temp
              meter_temp
              remarks
              delete_dt
            }
            time_table(where: { delete_dt: { eq: null } }) {
              start_time
              stop_time
            }
          }
        }
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

export const GET_STEAM_BY_ID_FOR_STEAM_HEATING_LOG = gql`
  query querySteaming($where: steamingFilterInput) {
    resultList: querySteaming(where: $where) {
      nodes {
        allocate_by
        allocate_dt
        approve_by
        approve_dt
        begin_by
        begin_dt
        bill_to_guid
        flat_rate
        complete_by
        complete_dt
        create_by
        create_dt
        delete_dt
        estimate_by
        estimate_dt
        estimate_no
        guid
        job_no
        na_dt
        remarks
        sot_guid
        status_cv
        est_hour
        total_hour
        rate
        est_cost
        total_cost
        update_by
        update_dt
        storing_order_tank {
          tank_no
          etr_dt
          required_temp
          tariff_cleaning {
            cargo
            flash_point
          }
          storing_order {
            customer_company_guid
            customer_company {
              code
              name
              address_line1
              address_line2
              currency {
                currency_name
                currency_code
                rate
              }
            }
          }
          in_gate(where: { delete_dt: { eq: null } }) {
            eir_no
            eir_dt
            in_gate_survey {
              create_dt
              create_by
            }
          }
          tariff_cleaning {
            cargo
            flash_point
          }
        }
        steaming_part {
          approve_cost
          approve_labour
          approve_part
          approve_qty
          complete_dt
          cost
          create_by
          create_dt
          delete_dt
          description
          guid
          job_order_guid
          labour
          quantity
          steaming_guid
          tariff_steaming_guid
          update_by
          update_dt
          tariff_steaming {
            cost
            create_by
            create_dt
            delete_dt
            guid
            labour
            remarks
            temp_max
            temp_min
            update_by
            update_dt
          }
          job_order {
            guid
            status_cv
            steaming_temp(where: { delete_dt: { eq: null } }, order: { report_dt: ASC }) {
              report_dt
              top_temp
              bottom_temp
              meter_temp
              remarks
              delete_dt
            }
          }
        }
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

export const RECORD_STEAM_TEMP = gql`
 mutation recordSteamingTemp($steamingTemp: steaming_tempInput!,$action:String!,$requiredTemp:Float!) {
    recordSteamingTemp(steamingTemp: $steamingTemp,action:$action,requiredTemp:$requiredTemp)
  }
`;

export const GET_STEAM_TEMP = gql`
  query querySteamingTemp($where: steaming_tempFilterInput , $order: [steaming_tempSortInput!]) {
    resultList: querySteamingTemp(where: $where, order: $order, first: 100) {
     nodes {
      report_dt
      bottom_temp
      create_by
      create_dt
      delete_dt
      guid
      job_order_guid
      meter_temp
      remarks
      top_temp
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

export const ADD_STEAM_EST = gql`
  mutation AddSteaming($steam: steamingInput!) {
    addSteaming(steaming: $steam)
  }
`;

export const UPDATE_STEAM_EST = gql`
  mutation UpdateSteaming($steam: steamingInput!) {
    updateSteaming(steaming: $steam)
  }
`;

export const UPDATE_STEAM_STATUS = gql`
  mutation UpdateSteamingStatus($steam: SteamingStatusRequestInput!) {
    updateSteamingStatus(steaming: $steam)
  }
`;

// export const CANCEL_STEAM_EST = gql`
//   mutation CancelSteaming($steam: [SteamingInput!]!) {
//     cancelSteaming(steaming: $steam)
//   }
// `

export const ROLLBACK_STEAM_EST = gql`
  mutation RollbackSteaming($steam: [SteamingRequestInput!]!) {
    rollbackSteaming(steaming: $steam)
  }
`
export const ROLLBACK_ASSIGNED_STEAM = gql`
  mutation rollbackAssignedSteaming($steamingGuid: [String!], $remark: String) {
    rollbackAssignedSteaming(steamingGuid: $steamingGuid, remark: $remark)
  }
`

export const APPROVE_STEAM_EST = gql`
  mutation ApproveSteaming($steam: steamingInput!) {
    approveSteaming(steaming: $steam)
  }
`


const ABORT_STEAM = gql`
  mutation abortSteaming($steamingJobOrder: SteamJobOrderRequestInput!) {
    abortSteaming(steamingJobOrder: $steamingJobOrder)
  }
`

export const ROLLBACK_COMPLETED_STEAMING = gql`
  mutation rollbackCompletedSteaming($steamingJobOrder: [SteamJobOrderRequestInput!]!) {
    rollbackCompletedSteaming(steamingJobOrder: $steamingJobOrder)
  }
`

export class SteamDS extends BaseDataSource<SteamItem> {
  constructor(private apollo: Apollo) {
    super();
  }

  searchWithBilling(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<SteamItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_STEAM_BILLING_EST,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const resultList = result.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList.nodes);
          this.totalCount = resultList.totalCount;
          this.pageInfo = resultList.pageInfo;
          resultList.nodes = resultList.nodes.map((item: SteamItem) => ({
            ...item,
            customer_billing:
              item.customer_billing?.delete_dt != null && item.customer_billing.delete_dt !== 0
                ? null
                : item.customer_billing
          }));

          return resultList.nodes;
        })
      );
  }

  search(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<SteamItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_STEAM_EST,
        variables: { where, order, first, after, last, before },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const resultList = result.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList.nodes);
          this.totalCount = resultList.totalCount;
          this.pageInfo = resultList.pageInfo;
          return resultList.nodes;
        })
      );
  }

  getSteamTemp(job_order_guid: string): Observable<SteamTemp[]> {
    this.loadingSubject.next(true);
    const where: any = { job_order_guid: { eq: job_order_guid } }
    const order: any = { create_dt: "ASC" }
    return this.apollo
      .query<any>({
        query: GET_STEAM_TEMP,
        variables: { where, order },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const resultList = result.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList.nodes);
          this.totalCount = resultList.totalCount;
          this.pageInfo = resultList.pageInfo;
          return resultList.nodes;
        })
      );

  }

  getSteamIDForJobOrder(id: string, job_order_guid: string | undefined): Observable<SteamItem[]> {
    this.loadingSubject.next(true);
    const where: any = { guid: { eq: id } }
    const steam_part_where: any = {}
    if (job_order_guid) {
      steam_part_where.job_order_guid = { eq: job_order_guid };
      //steam_part_where.some={job_order_guid:{eq:job_order_guid}};
    }
    return this.apollo
      .query<any>({
        query: GET_STEAM_EST_JOB_ORDER,
        variables: { where, steam_part_where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const resultList = result.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList.nodes);
          this.totalCount = resultList.totalCount;
          this.pageInfo = resultList.pageInfo;
          return resultList.nodes;
        })
      );
  }

  getSteamForMovement(sot_guid: string | undefined): Observable<SteamItem[]> {
    this.loadingSubject.next(true);
    const where: any = { sot_guid: { eq: sot_guid } }
    return this.apollo
      .query<any>({
        query: GET_STEAM_FOR_MOVEMENT,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => {
          const resultList = result.data?.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList.nodes);
          this.totalCount = resultList.totalCount;
          this.pageInfo = resultList.pageInfo;
          return resultList.nodes;
        }),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  getSteamByIDForPdf(guid: string | undefined): Observable<SteamItem[]> {
    this.loadingSubject.next(true);
    const where: any = { guid: { eq: guid } }
    return this.apollo
      .query<any>({
        query: GET_STEAM_BY_ID_FOR_STEAM_HEATING_LOG,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => {
          const resultList = result.data?.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList.nodes);
          this.totalCount = resultList.totalCount;
          this.pageInfo = resultList.pageInfo;
          return resultList.nodes;
        }),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  addSteam(steam: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_STEAM_EST,
      variables: {
        steam
      }
    });
  }

  updateSteam(steam: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_STEAM_EST,
      variables: {
        steam
      }
    });
  }

  updateSteamStatus(steam: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_STEAM_STATUS,
      variables: {
        steam
      }
    });
  }

  // cancelSteam(steaming: any): Observable<any> {
  //   return this.apollo.mutate({
  //     mutation: CANCEL_STEAM_EST,
  //     variables: {
  //       steaming
  //     }
  //   });
  // }

  rollbackSteam(steam: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ROLLBACK_STEAM_EST,
      variables: {
        steam
      }
    });
  }

  rollbackAssignedSteam(steamingGuid: any, remark: string): Observable<any> {
    return this.apollo.mutate({
      mutation: ROLLBACK_ASSIGNED_STEAM,
      variables: {
        steamingGuid,
        remark
      }
    });
  }


  recordSteamingTemp(steamingTemp: any, action: string, requiredTemp: number): Observable<any> {
    return this.apollo.mutate({
      mutation: RECORD_STEAM_TEMP,
      variables: {
        steamingTemp,
        action,
        requiredTemp
      }
    });
  }

  approveSteaming(steam: any): Observable<any> {
    return this.apollo.mutate({
      mutation: APPROVE_STEAM_EST,
      variables: {
        steam
      }
    });
  }

  canAbort(re: SteamItem | undefined, rp: SteamPartItem[]): boolean {
    const validStatus = ['PENDING', 'APPROVED', 'JOB_IN_PROGRESS', 'PARTIAL_ASSIGNED', 'ASSIGNED']
    const status: string = String(re?.status_cv);
    return (validStatus.includes(status) && rp?.some(part => part.job_order?.status_cv && (part.job_order?.status_cv == 'PENDING')));
  }

  canAmendAutoApprovedSteam(steam: SteamItem): boolean {
    if (!steam) return true;
    const validStatus = ['APPROVED']

    return validStatus.includes(steam?.status_cv!) && BusinessLogicUtil.isAutoApproveSteaming(steam);
  }

  canAmend(re: SteamItem): boolean {
    if (!re) return true;
    const validStatus = ['PENDING']
    return validStatus.includes(re?.status_cv!);
  }

  canMonitorTemp(re: SteamItem): boolean {
    if (!re) return true;
    const validStatus = ['ASSIGNED', 'JOB_IN_PROGRESS']
    return validStatus.includes(re?.status_cv!);
  }

  canSave(re: SteamItem): boolean {
    const validStatus = ['PENDING', 'APPROVED', 'ASSIGNED', 'PARTIAL_ASSIGNED']
    var allowSave: boolean = validStatus.includes(re?.status_cv!);
    return allowSave;
  }

  canApprove(re: SteamItem): boolean {
    const validStatus = ['PENDING', 'APPROVED', 'ASSIGNED', 'PARTIAL_ASSIGNED']
    return validStatus.includes(re?.status_cv!);
  }

  canAssign(re: SteamItem | undefined): boolean {
    return re?.status_cv === 'APPROVED' || re?.status_cv === 'PARTIAL_ASSIGNED' || re?.status_cv === 'ASSIGNED'; // || re?.status_cv === 'JOB_IN_PROGRESS'
  }

  canQCComplete(re: SteamItem | undefined): boolean {
    return (re?.status_cv === 'COMPLETED');
  }

  canCancel(re: SteamItem): boolean {
    return re?.status_cv === 'PENDING';
  }

  canNoAction(re: SteamItem): boolean {
    return re?.status_cv === 'APPROVED';
  }

  canRollbackEstimate(re: SteamItem): boolean {
    const validStatus = ['NO_ACTION']
    // NOTE:: note sure why previously added this to not allow auto steaming to reinstate from steaming estimate approval. Now commented it
    // if (BusinessLogicUtil.isAutoApproveSteaming(re)) return false;
    return validStatus.includes(re?.status_cv!);
  }

  canRollback(re: SteamItem): boolean {
    const validStatus = ['PENDING', 'APPROVED', 'CANCELED', 'NO_ACTION']
    return validStatus.includes(re?.status_cv!);
  }

  canCopy(re: SteamItem): boolean {
    return true;
  }

  canRollbackJobInProgress(re: SteamItem | undefined): boolean {
    return re?.status_cv === 'ASSIGNED' || re?.status_cv === 'PARTIAL_ASSIGNED' || re?.status_cv === 'JOB_IN_PROGRESS';
  }

  getApprovalTotalWithLabourCost(steamPartList: any[] | undefined, LabourCost: number): any {
    const totalSums = steamPartList?.filter(data => !data.delete_dt && (data.approve_part == 1 || data.approve_part || data.approve_part == null))?.reduce((totals: any, owner) => {
      return {
        //hour: (totals.hour ?? 0) + (owner.hour ?? 0),

        total_mat_cost: totals.total_mat_cost + (((owner.approve_qty ?? 0) * (owner.approve_cost ?? 0))) + (((owner.approve_labour ?? 0) * (LabourCost ?? 0)))
      };
    }, { total_mat_cost: 0 }) || 0;
    return totalSums;
  }


  getApprovalTotal(steamPartList: any[] | undefined): any {
    const totalSums = steamPartList?.filter(data => !data.delete_dt && (data.approve_part == 1 || data.approve_part || data.approve_part == null))?.reduce((totals: any, owner) => {
      return {
        //hour: (totals.hour ?? 0) + (owner.hour ?? 0),

        total_mat_cost: totals.total_mat_cost + (((owner.approve_qty ?? 0) * (owner.approve_cost ?? 0)))
      };
    }, { total_mat_cost: 0 }) || 0;
    return totalSums;
  }

  getTotalWithLabourCost(steamPartList: any[] | undefined, LabourCost: number): any {
    const totalSums = steamPartList?.filter(data => !data.delete_dt && (data.approve_part == 1 || data.approve_part == null))?.reduce((totals: any, owner) => {
      return {
        //hour: (totals.hour ?? 0) + (owner.hour ?? 0),

        total_mat_cost: totals.total_mat_cost + (((owner.quantity ?? 0) * (owner.cost ?? 0))) + (((owner.labour ?? 0) * (LabourCost ?? 0)))
      };
    }, { total_mat_cost: 0 }) || 0;
    return totalSums;
  }

  getTotal(steamPartList: any[] | undefined): any {
    const totalSums = steamPartList?.filter(data => !data.delete_dt && (data.approve_part == 1 || data.approve_part == null))?.reduce((totals: any, owner) => {
      return {
        //hour: (totals.hour ?? 0) + (owner.hour ?? 0),

        total_mat_cost: totals.total_mat_cost + (((owner.quantity ?? 0) * (owner.cost ?? 0)))
      };
    }, { total_mat_cost: 0 }) || 0;
    return totalSums;
  }

  getApprovedTotal(steamPartList: any[] | undefined): any {
    const totalSums = steamPartList?.filter(data => !data.delete_dt && (data.approve_part == 1 || data.approve_part == null))?.reduce((totals: any, owner) => {
      return {
        //hour: (totals.hour ?? 0) + (owner.hour ?? 0),

        total_mat_cost: totals.total_mat_cost + (((owner.approve_cost ?? owner.cost ?? 0) * (owner.approve_qty ?? owner.quantity ?? 0)))
      };
    }, { total_mat_cost: 0 }) || 0;
    return totalSums;
  }

  getTotalLabourCost(total_hour: number | undefined, labour_cost: number | undefined): any {
    return ((total_hour ?? 0) * (labour_cost ?? 0));
  }

  getTotalCost(total_labour_cost: number | undefined, total_material_cost: number | undefined): any {
    return ((total_labour_cost ?? 0) + (total_material_cost ?? 0));
  }

  getDiscountCost(discount: number | undefined, total_cost: number | undefined): any {
    return ((discount ?? 0) * (total_cost ?? 0)) / 100;
  }

  getNetCost(total_cost: number | undefined, discount_labour_cost: number | undefined, discount_mat_cost: number | undefined): any {
    return (total_cost ?? 0) - (discount_labour_cost ?? 0) - (discount_mat_cost ?? 0);
  }

  abortSteaming(steamingJobOrder: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ABORT_STEAM,
      variables: {
        steamingJobOrder
      }
    });
  }

  getSteamBeginDate(steam: SteamItem[] | undefined) {
    if (!steam || steam.length === 0) {
      return undefined;
    }

    // const earliestApproveDt = steam.reduce((earliest, item) => {
    //   if (item.approve_dt !== null && item.approve_dt !== undefined) {
    //     return earliest === undefined || item.approve_dt < earliest ? item.approve_dt : earliest;
    //   }
    //   return earliest;
    // }, undefined as number | undefined);

    // return earliestApproveDt;
    const autoSteaming = steam.find(x => BusinessLogicUtil.isAutoApproveSteaming(x));
    if (autoSteaming) {
      const found = autoSteaming.steaming_part?.find(x => x.job_order?.steaming_temp?.length)
      if (found) {
        const earliestReportDt = found?.job_order?.steaming_temp?.reduce((earliest, item) => {
          if (!!item?.report_dt) {
            return earliest === undefined || item.report_dt < earliest ? item.report_dt : earliest;
          }
          return earliest;
        }, undefined as number | undefined);
        return earliestReportDt;
      }
    }
    return undefined;
  }

  getBeginDate(steam: SteamItem | undefined) {
    if (!steam) {
      return undefined;
    }

    if (BusinessLogicUtil.isAutoApproveSteaming(steam)) {
      const found = steam.steaming_part?.find(x => x.job_order?.steaming_temp?.length)
      if (found) {
        const earliestReportDt = found?.job_order?.steaming_temp?.reduce((earliest, item) => {
          if (!!item?.report_dt) {
            return earliest === undefined || item.report_dt < earliest ? item.report_dt : earliest;
          }
          return earliest;
        }, undefined as number | undefined);
        return earliestReportDt;
      }
    } else {
      const found = steam.steaming_part?.find(x => x.job_order?.time_table?.length)
      if (found) {
        const earliestReportDt = found?.job_order?.time_table?.reduce((earliest, item) => {
          if (!!item?.start_time) {
            return earliest === undefined || item.start_time < earliest ? item.start_time : earliest;
          }
          return earliest;
        }, undefined as number | undefined);
        return earliestReportDt;
      }
    }
    return undefined;
  }

  getSteamCompleteDate(steam: SteamItem[] | undefined) {
    if (!steam || steam.length === 0) {
      return undefined;
    }

    // const allCompleteDatesValid = steam.every(item => item.complete_dt !== null && item.complete_dt !== undefined);
    // if (!allCompleteDatesValid) {
    //   return undefined;
    // }

    // const earliestApproveDt = steam.reduce((latest, item) => {
    //   if (item.complete_dt !== null && item.complete_dt !== undefined) {
    //     return latest === undefined || item.complete_dt > latest ? item.complete_dt : latest;
    //   }
    //   return latest;
    // }, undefined as number | undefined);

    // return earliestApproveDt;
    const autoSteaming = steam.find(x => BusinessLogicUtil.isAutoApproveSteaming(x));
    if (autoSteaming && autoSteaming.complete_dt) {
      const found = autoSteaming.steaming_part?.find(x => x.job_order?.steaming_temp?.length)
      if (found) {
        const latestReportDt = found?.job_order?.steaming_temp?.reduce((latest, item) => {
          if (!!item?.report_dt) {
            return latest === undefined || item.report_dt > latest ? item.report_dt : latest;
          }
          return latest;
        }, undefined as number | undefined);
        return latestReportDt;
      }
    }
    return undefined;
  }

  getSteamProcessingDays(steam: SteamItem[] | undefined) {
    if (!steam || steam.length === 0) {
      return undefined;
    }

    const beginDate = this.getSteamBeginDate(steam);
    const completeDate = this.getSteamCompleteDate(steam);

    if (!beginDate || !completeDate) {
      return undefined;
    }

    const timeTakenMs = completeDate - beginDate;

    if (timeTakenMs === undefined || timeTakenMs < 0) {
      return "Invalid time data";
    }

    const days = Math.floor(timeTakenMs / (3600 * 24));

    return `${days}`;
  }

  getSteamHighestTemp(steam: SteamItem | undefined) {
    if (!steam) return undefined;

    const highestMeterTemp = steam.steaming_part?.flatMap((part) => part.job_order?.steaming_temp || [])
      .map((temp) => temp.meter_temp!) // Extract meter_temp values
      .reduce((max, temp) => (temp > max ? temp : max), Number.NEGATIVE_INFINITY);
    const result = highestMeterTemp === Number.NEGATIVE_INFINITY ? undefined : highestMeterTemp;
    return result;
  }

  rollbackCompletedSteaming(steamingJobOrder: any[]): Observable<any> {
    return this.apollo.mutate({
      mutation: ROLLBACK_COMPLETED_STEAMING,
      variables: {
        steamingJobOrder
      }
    });
  }

  getTotalSteamDuration(steamTempList: SteamTemp[] | undefined): string {
    if (!steamTempList || steamTempList.length === 0 || steamTempList.length === 1) {
      return "00:00";
    }

    let earliestReportDt = steamTempList.reduce((earliest, item) => {
      if (item.report_dt !== null && item.report_dt !== undefined) {
        return earliest === undefined || item.report_dt < earliest ? item.report_dt : earliest;
      }
      return earliest;
    }, undefined as number | undefined);

    let latestReportDt = steamTempList.reduce((latest, item) => {
      if (item.report_dt !== null && item.report_dt !== undefined) {
        return latest === undefined || item.report_dt > latest ? item.report_dt : latest;
      }
      return latest;
    }, undefined as number | undefined);

    if (earliestReportDt === undefined || latestReportDt === undefined) {
      return "00:00";
    }

    // Convert timestamps to milliseconds if they are in seconds
    if (earliestReportDt < 1e10) earliestReportDt *= 1000;
    if (latestReportDt < 1e10) latestReportDt *= 1000;

    const timeTakenMs = latestReportDt - earliestReportDt;

    if (timeTakenMs <= 0) {
      return "00:00";
    }

    // Convert milliseconds to hours and minutes
    const totalMinutes = Math.floor(timeTakenMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // Ensure two-digit formatting
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
  }

  IsSteamRepair(steam: SteamItem | undefined) {
    var retval = true;
    if (steam) {
      retval = !BusinessLogicUtil.isAutoApproveSteaming(steam);
    }
    // retval = (steam?.steaming_part?.[0]?.tariff_steaming_guid === null && steam?.steaming_part?.[0]?.steaming_exclusive_guid === null);
    return retval;
  }
}
