import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { BaseDataSource } from './base-ds';
import { StoringOrderTankItem } from './storing-order-tank';
import { SchedulingItem } from './scheduling';
import { TariffRepairItem } from './tariff-repair';
import { UserItem } from './user';
import { CustomerCompanyItem } from './customer-company';
import { ResiduePartItem } from './residue-part';
import { SteamPartItem } from './steam-part';
import { JobOrderItem } from './job-order';

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

  public invoice_by?: string;
  public invoice_dt?: number;

  public total_cost?: number;

  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  // public aspnetusers_guid?: string;
  // public estimate_no?: string;
  // public labour_cost_discount?: number;
  // public material_cost_discount?: number;
  // public labour_cost?: number;
  // public total_cost?: number;
  // public owner_enable?: boolean;
  // public total_hour?: number;

  constructor(item: Partial<SteamGO> = {}) {
    this.guid = item.guid;
    this.estimate_no = item.estimate_no;
    this.sot_guid = item.sot_guid;
    this.allocate_by = item.allocate_by;
    this.allocate_dt = item.allocate_dt;
    this.approve_by = item.approve_by;
    this.approve_dt = item.approve_dt || 0;
    this.complete_by = item.complete_by;
    this.complete_dt = item.complete_dt || 0;
    this.status_cv = item.status_cv;
    this.remarks = item.remarks;
    this.begin_by = item.begin_by;
    this.begin_dt = item.begin_dt;
    this.na_dt = item.na_dt;
    this.total_cost = item.total_cost;
    this.invoice_by = item.invoice_by;
    this.invoice_dt = item.invoice_dt;
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

  //public aspnetsuser?: UserItem;
  public actions?: string[]
  constructor(item: Partial<SteamItem> = {}) {
    super(item)
    this.steaming_part = item.steaming_part;
    this.storing_order_tank = item.storing_order_tank;
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
        guid
        invoice_by
        invoice_dt
        job_no
        na_dt
        remarks
        sot_guid
        status_cv
        total_cost
        update_by
        update_dt
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
            steaming_temp {
              meter_temp
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
  query querySteamingTemp($where: steaming_tempFilterInput ,$order: [steaming_tempSortInput!]) {
    resultList: querySteamingTemp(where: $where,order:$order) {
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

export class SteamDS extends BaseDataSource<SteamItem> {
  constructor(private apollo: Apollo) {
    super();
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


  canAmend(re: SteamItem): boolean {
    if (!re) return true;
    const validStatus = ['PENDING']
    return validStatus.includes(re?.status_cv!);
  }

  canMonitorTemp(re: SteamItem): boolean {
    if (!re) return true;
    const validStatus = ['ASSIGNED']
    return validStatus.includes(re?.status_cv!);
  }

  canSave(re: SteamItem): boolean {
    const validStatus = ['PENDING', 'APPROVED', 'ASSIGNED', 'PARTIAL_ASSIGNED']
    return validStatus.includes(re?.status_cv!);
  }

  canApprove(re: SteamItem): boolean {
    const validStatus = ['PENDING', 'APPROVED', 'ASSIGNED', 'PARTIAL_ASSIGNED']
    return validStatus.includes(re?.status_cv!);
  }

  canQCComplete(re: SteamItem | undefined): boolean {
    return (re?.status_cv === 'COMPLETED');
  }

  canCancel(re: SteamItem): boolean {
    return re?.status_cv === 'PENDING';
  }

  canRollbackEstimate(re: SteamItem): boolean {
    const validStatus = ['PENDING', 'CANCELED', 'NO_ACTION']
    return validStatus.includes(re?.status_cv!);
  }
  canRollback(re: SteamItem): boolean {
    const validStatus = ['PENDING', 'APPROVED', 'CANCELED', 'NO_ACTION']
    return validStatus.includes(re?.status_cv!);
  }

  canCopy(re: SteamItem): boolean {
    return true;
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

    const earliestApproveDt = steam.reduce((earliest, item) => {
      if (item.approve_dt !== null && item.approve_dt !== undefined) {
        return earliest === undefined || item.approve_dt < earliest ? item.approve_dt : earliest;
      }
      return earliest;
    }, undefined as number | undefined);

    return earliestApproveDt;
  }

  getSteamCompleteDate(steam: SteamItem[] | undefined) {
    if (!steam || steam.length === 0) {
      return undefined;
    }

    const allCompleteDatesValid = steam.every(item => item.complete_dt !== null && item.complete_dt !== undefined);
    if (!allCompleteDatesValid) {
      return undefined;
    }

    const earliestApproveDt = steam.reduce((latest, item) => {
      if (item.complete_dt !== null && item.complete_dt !== undefined) {
        return latest === undefined || item.complete_dt > latest ? item.complete_dt : latest;
      }
      return latest;
    }, undefined as number | undefined);

    return earliestApproveDt;
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
}
