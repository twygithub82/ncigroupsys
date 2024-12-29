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

export class ResidueGO {
  public estimate_no?: string;
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



  constructor(item: Partial<ResidueGO> = {}) {
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
    this.bill_to_guid = item.bill_to_guid;
    this.job_no = item.job_no;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class ResidueItem extends ResidueGO {
  public residue_part?: ResiduePartItem[];
  public storing_order_tank?: StoringOrderTankItem;
  public customer_company?: CustomerCompanyItem;
  //public aspnetsuser?: UserItem;
  public actions?: string[]
  constructor(item: Partial<ResidueItem> = {}) {
    super(item)
    this.residue_part = item.residue_part;
    this.storing_order_tank = item.storing_order_tank;
    // this.aspnetsuser = item.aspnetsuser;
    this.actions = item.actions;
  }
}

export class ResiduePartRequest{
  public approve_part?:boolean;
  public guid?: string;
  constructor(item: Partial<ResiduePartRequest> = {}) {

    this.guid = item.guid;
    this.approve_part = item.approve_part;
    
  }
}

export class ResidueStatusRequest {
  public guid?: string;
  public action?: string;
  public remarks?:string;
  public sot_guid?: string;
  public residuePartRequests?: ResiduePartRequest[];
  //public aspnetsuser?: UserItem;

  constructor(item: Partial<ResidueStatusRequest> = {}) {

    this.guid = item.guid;
    this.sot_guid = item.sot_guid;
    this.residuePartRequests= item.residuePartRequests;
    // this.aspnetsuser = item.aspnetsuser;
    this.action = item.action;
  }
}

export const GET_RESIDUE_EST = gql`
  query QueryResidue($where: residueFilterInput, $order: [residueSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryResidue(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
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
        residue_part {
            action
            approve_part
            cost
            create_by
            create_dt
            delete_dt
            description
            guid
            job_order_guid
            approve_qty
            approve_cost
            quantity
            residue_guid
            tariff_residue_guid
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

export const GET_RESIDUE_EST_JOB_ORDER = gql`
  query queryResidue($where: residueFilterInput,$residue_part_where:residue_partFilterInput) {
    resultList: queryResidue(where: $where) {
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
      residue_part(where:$residue_part_where) {
          action
          approve_part
          cost
          create_by
          create_dt
          delete_dt
          description
          guid
          job_order_guid
          approve_qty
          approve_cost
          quantity
          residue_guid
          tariff_residue_guid
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

export const GET_RESIDUE_FOR_MOVEMENT = gql`
  query queryResidue($where: residueFilterInput) {
    resultList: queryResidue(where: $where) {
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
        guid
        job_no
        remarks
        sot_guid
        status_cv
        update_by
        update_dt
        residue_part {
          action
          approve_part
          cost
          create_by
          create_dt
          delete_dt
          description
          guid
          job_order_guid
          approve_qty
          approve_cost
          quantity
          residue_guid
          tariff_residue_guid
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

export const ADD_RESIDUE_EST = gql`
  mutation AddResidue($residue: residueInput!) {
    addResidue(residue: $residue)
  }
`;

export const UPDATE_RESIDUE_EST = gql`
  mutation UpdateResidue($residue: residueInput!) {
    updateResidue(residue: $residue)
  }
`;

export const UPDATE_RESIDUE_STATUS = gql`
  mutation UpdateResidueStatus($residue: ResidueStatusRequestInput!) {
    updateResidueStatus(residue: $residue)
  }
`;

export const CANCEL_RESIDUE_EST = gql`
  mutation CancelResidue($residue: [residueInput!]!) {
    cancelResidue(residue: $residue)
  }
`

export const ROLLBACK_RESIDUE_EST = gql`
  mutation RollbackResidue($residue: [ResidueRequestInput!]!) {
    rollbackResidue(residue: $residue)
  }
`

export const ROLLBACK_RESIDUE_STATUS_EST = gql`
  mutation RollbackResidueStatus($residue: ResidueRequestInput!) {
    rollbackResidueStatus(residue: $residue)
  }
`
export const ROLLBACK_RESIDUE_APPROVAL_EST = gql`
  mutation RollbackResidueApproval($residue: [ResidueRequestInput!]!) {
    rollbackResidueApproval(residue: $residue)
  }
`

export const ROLLBACK_COMPLETED_RESIDUE = gql`
  mutation rollbackCompletedResidue($residueJobOrder: [ResJobOrderRequestInput!]!) {
    rollbackCompletedResidue(residueJobOrder: $residueJobOrder)
  }
`

export const APPROVE_RESIDUE_EST = gql`
  mutation ApproveResidue($residue: residueInput!) {
    approveResidue(residue: $residue)
  }
`


const ABORT_RESIDUE = gql`
  mutation abortResidue($residueJobOrder: ResJobOrderRequestInput!) {
    abortResidue(residueJobOrder: $residueJobOrder)
  }
`

export class ResidueDS extends BaseDataSource<ResidueItem> {
  constructor(private apollo: Apollo) {
    super();
  }
  search(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<ResidueItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_RESIDUE_EST,
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

  getResidueIDForJobOrder(id: string, job_order_guid: string | undefined): Observable<ResidueItem[]> {
    this.loadingSubject.next(true);
    const where: any = { guid: { eq: id } }
    const residue_part_where: any = {}
    if (job_order_guid) {
      residue_part_where.job_order_guid = { eq: job_order_guid };
    }
    return this.apollo
      .query<any>({
        query: GET_RESIDUE_EST_JOB_ORDER,
        variables: { where, residue_part_where },
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

  getResidueForMovement(sot_guid: string | undefined): Observable<ResidueItem[]> {
    this.loadingSubject.next(true);
    const where: any = { sot_guid: { eq: sot_guid } }
    return this.apollo
      .query<any>({
        query: GET_RESIDUE_FOR_MOVEMENT,
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

  addResidue(residue: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_RESIDUE_EST,
      variables: {
        residue
      }
    });
  }

  updateResidue(residue: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_RESIDUE_EST,
      variables: {
        residue
      }
    });
  }

  updateResidueStatus(residue: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_RESIDUE_STATUS,
      variables: {
        residue
      }
    });
  }

  cancelResidue(residue: any): Observable<any> {
    return this.apollo.mutate({
      mutation: CANCEL_RESIDUE_EST,
      variables: {
        residue
      }
    });
  }

  rollbackResidue(residue: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ROLLBACK_RESIDUE_EST,
      variables: {
        residue
      }
    });
  }

  rollbackResidueApproval(residue: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ROLLBACK_RESIDUE_APPROVAL_EST,
      variables: {
        residue
      }
    });
  }

  rollbackResidueStatus(residue: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ROLLBACK_RESIDUE_STATUS_EST,
      variables: {
        residue
      }
    });
  }

  
  rollbackCompletedResidue(residueJobOrder: any[]): Observable<any> {
    return this.apollo.mutate({
      mutation: ROLLBACK_COMPLETED_RESIDUE,
      variables: {
        residueJobOrder
      }
    });
  }

  approveResidue(residue: any): Observable<any> {
    return this.apollo.mutate({
      mutation: APPROVE_RESIDUE_EST,
      variables: {
        residue
      }
    });
  }

  canAbort(re: ResidueItem | undefined, rp: ResiduePartItem[]): boolean {
    const validStatus = ['PENDING', 'APPROVED', 'JOB_IN_PROGRESS','PARTIAL_ASSIGNED','ASSIGNED']
    const status:string = String(re?.status_cv);
    return (validStatus.includes(status) && rp?.some(part => part.job_order?.status_cv && (part.job_order?.status_cv == 'PENDING')));
   // return (re?.status_cv === 'APPROVED' || re?.status_cv === 'JOB_IN_PROGRESS') && rp?.some(part => !part.job_order?.status_cv && part.job_order?.status_cv !== 'PENDING' && part.job_order?.status_cv !== 'CANCELED');
  }


  canAmend(re: ResidueItem): boolean {
    if (!re) return true;
    const validStatus = ['PENDING']
    return validStatus.includes(re?.status_cv!);
  }

  canSave(re: ResidueItem): boolean {
    const validStatus = ['APPROVED', 'JOB_IN_PROGRESS','PARTIAL_ASSIGNED']
    return false;
  }

  canApprove(re: ResidueItem): boolean {
    //const validStatus = ['PENDING', 'APPROVED', 'JOB_IN_PROGRESS']
    const validStatus = ['PENDING', 'APPROVED']
    return validStatus.includes(re?.status_cv!);
  }

  canNoAction(re: ResidueItem): boolean {
    //const validStatus = ['PENDING', 'APPROVED', 'JOB_IN_PROGRESS']
    const validStatus = ['APPROVED']
    return validStatus.includes(re?.status_cv!);
  }

  canQCComplete(re: ResidueItem | undefined): boolean {
    return (re?.status_cv === 'COMPLETED');
  }

  canCancel(re: ResidueItem): boolean {
    return re?.status_cv === 'PENDING';
  }

  canRollback(re: ResidueItem): boolean {
    const validStatus = ['PENDING', 'APPROVED', 'CANCELED', 'NO_ACTION','COMPLETED','QC_COMPLETED']
    return validStatus.includes(re?.status_cv!);
  }

  canRollbackJobInProgress(re: ResidueItem | undefined): boolean {
    return re?.status_cv === 'ASSIGNED' || re?.status_cv === 'PARTIAL_ASSIGNED' || re?.status_cv === 'JOB_IN_PROGRESS';
  }

  canCopy(re: ResidueItem): boolean {
    return false;
  }

  getApproveTotal(residuePartList: any[] | undefined): any {
    const totalSums = residuePartList?.filter(data => !data.delete_dt && (data.approve_part == 1 || data.approve_part == null))?.reduce((totals: any, owner) => {
      return {
        //hour: (totals.hour ?? 0) + (owner.hour ?? 0),

        total_mat_cost: totals.total_mat_cost + (((owner.approve_qty ?? 0) * (owner.approve_cost ?? 0)))
      };
    }, { total_mat_cost: 0 }) || 0;
    return totalSums;
  }

  getTotal(residuePartList: any[] | undefined): any {
    const totalSums = residuePartList?.filter(data => !data.delete_dt && (data.approve_part == 1 || data.approve_part == null))?.reduce((totals: any, owner) => {
      return {
        //hour: (totals.hour ?? 0) + (owner.hour ?? 0),

        total_mat_cost: totals.total_mat_cost + (((owner.quantity ?? 0) * (owner.cost ?? 0)))
      };
    }, { total_mat_cost: 0 }) || 0;
    return totalSums;
  }

  getApprovedTotal(residuePartList: any[] | undefined): any {
    const totalSums = residuePartList?.filter(data => !data.delete_dt && (data.approve_part == 1 || data.approve_part == null))?.reduce((totals: any, owner) => {
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

  getResidueBeginDate(residue: ResidueItem[] | undefined) {
    if (!residue || residue.length === 0) {
      return undefined;
    }

    const earliestApproveDt = residue.reduce((earliest, item) => {
      if (item.approve_dt !== null && item.approve_dt !== undefined) {
        return earliest === undefined || item.approve_dt < earliest ? item.approve_dt : earliest;
      }
      return earliest;
    }, undefined as number | undefined);

    return earliestApproveDt;
  }

  getResidueCompleteDate(residue: ResidueItem[] | undefined) {
    if (!residue || residue.length === 0) {
      return undefined;
    }

    const allCompleteDatesValid = residue.every(item => item.complete_dt !== null && item.complete_dt !== undefined);
    if (!allCompleteDatesValid) {
      return undefined;
    }

    const earliestApproveDt = residue.reduce((latest, item) => {
      if (item.complete_dt !== null && item.complete_dt !== undefined) {
        return latest === undefined || item.complete_dt > latest ? item.complete_dt : latest;
      }
      return latest;
    }, undefined as number | undefined);

    return earliestApproveDt;
  }

  getResidueProcessingDays(residue: ResidueItem[] | undefined) {
    if (!residue || residue.length === 0) {
      return undefined;
    }

    const beginDate = this.getResidueBeginDate(residue);
    const completeDate = this.getResidueCompleteDate(residue);

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

  abortResidue(residueJobOrder: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ABORT_RESIDUE,
      variables: {
        residueJobOrder
      }
    });
  }

}
