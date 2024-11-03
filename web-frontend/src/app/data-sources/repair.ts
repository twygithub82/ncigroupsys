import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { BaseDataSource } from './base-ds';
import { StoringOrderTankItem } from './storing-order-tank';
import { SchedulingItem } from './scheduling';
import { TariffRepairItem } from './tariff-repair';
import { RepairPartItem } from './repair-part';
import { UserItem } from './user';

export class RepairGO {
  public guid?: string;
  public sot_guid?: string;
  public aspnetusers_guid?: string;
  public estimate_no?: string;
  public labour_cost_discount?: number;
  public material_cost_discount?: number;
  public labour_cost?: number;
  public total_cost?: number;
  public status_cv?: string;
  public remarks?: string;
  public owner_enable?: boolean;
  public bill_to_guid?: string;
  public job_no?: string;
  public total_hour?: number;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<RepairGO> = {}) {
    this.guid = item.guid;
    this.sot_guid = item.sot_guid;
    this.aspnetusers_guid = item.aspnetusers_guid;
    this.estimate_no = item.estimate_no;
    this.labour_cost_discount = item.labour_cost_discount || 0;
    this.material_cost_discount = item.material_cost_discount || 0;
    this.labour_cost = item.labour_cost || 0;
    this.total_cost = item.total_cost || 0;
    this.status_cv = item.status_cv;
    this.remarks = item.remarks;
    this.owner_enable = item.owner_enable || false;
    this.bill_to_guid = item.bill_to_guid;
    this.job_no = item.job_no;
    this.total_hour = item.total_hour || 0;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class RepairItem extends RepairGO {
  public repair_part?: RepairPartItem[];
  public storing_order_tank?: StoringOrderTankItem;
  public aspnetsuser?: UserItem;
  public actions?: string[]
  constructor(item: Partial<RepairItem> = {}) {
    super(item)
    this.repair_part = item.repair_part;
    this.storing_order_tank = item.storing_order_tank;
    this.aspnetsuser = item.aspnetsuser;
    this.actions = item.actions;
  }
}

export class RepairCostTableItem extends RepairGO {
  public total_owner_hour?: string;
  public total_owner_labour_cost?: string;
  public total_owner_mat_cost?: string;
  public total_owner_cost?: string;
  public discount_labour_owner_cost?: string;
  public discount_mat_owner_cost?: string;
  public net_owner_cost?: string;
  
  public total_lessee_hour?: string;
  public total_lessee_labour_cost?: string;
  public total_lessee_mat_cost?: string;
  public total_lessee_cost?: string;
  public discount_labour_lessee_cost?: string;
  public discount_mat_lessee_cost?: string;
  public net_lessee_cost?: string;

  public total_hour_table?: string;
  public total_labour_cost?: string;
  public total_mat_cost?: string;
  public total_cost_table?: string;
  public discount_labour_cost?: string;
  public discount_mat_cost?: string;
  public net_cost?: string;

  constructor(item: Partial<RepairCostTableItem> = {}) {
    super(item)
    this.total_owner_hour = item.total_owner_hour;
    this.total_owner_labour_cost = item.total_owner_labour_cost;
    this.total_owner_mat_cost = item.total_owner_mat_cost;
    this.total_owner_cost = item.total_owner_cost;
    this.discount_labour_owner_cost = item.discount_labour_owner_cost;
    this.discount_mat_owner_cost = item.discount_mat_owner_cost;
    this.net_owner_cost = item.net_owner_cost;

    this.total_lessee_hour = item.total_lessee_hour;
    this.total_lessee_labour_cost = item.total_lessee_labour_cost;
    this.total_lessee_mat_cost = item.total_lessee_mat_cost;
    this.total_lessee_cost = item.total_lessee_cost;
    this.discount_labour_lessee_cost = item.discount_labour_lessee_cost;
    this.discount_mat_lessee_cost = item.discount_mat_lessee_cost;
    this.net_lessee_cost = item.net_lessee_cost;

    this.total_hour_table = item.total_hour_table;
    this.total_labour_cost = item.total_labour_cost;
    this.total_mat_cost = item.total_mat_cost;
    this.total_cost_table = item.total_cost_table;
    this.discount_labour_cost = item.discount_labour_cost;
    this.discount_mat_cost = item.discount_mat_cost;
    this.net_cost = item.net_cost;
  }
}

export const GET_REPAIR = gql`
  query QueryRepair($where: repairFilterInput, $order: [repairSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryRepair(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      nodes {
        aspnetusers_guid
        create_by
        create_dt
        delete_dt
        estimate_no
        guid
        labour_cost
        labour_cost_discount
        material_cost_discount
        owner_enable
        remarks
        sot_guid
        status_cv
        total_cost
        update_by
        update_dt
        storing_order_tank {
          guid
          job_no
          tank_no
          storing_order {
            customer_company {
              code
              name
              guid
            }
          }
        }
        repair_part {
          approve_cost
          approve_hour
          approve_part
          approve_qty
          material_cost
          quantity
          hour
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

export const GET_REPAIR_BY_ID = gql`
  query QueryRepair($where: repairFilterInput, $customer_company_guid: String) {
    resultList: queryRepair(where: $where) {
      nodes {
        aspnetusers_guid
        create_by
        create_dt
        delete_dt
        estimate_no
        guid
        labour_cost
        labour_cost_discount
        material_cost_discount
        owner_enable
        remarks
        sot_guid
        status_cv
        total_cost
        update_by
        update_dt
        repair_part {
          action
          create_by
          create_dt
          delete_dt
          description
          guid
          hour
          location_cv
          comment
          material_cost
          owner
          quantity
          remarks
          repair_guid
          tariff_repair_guid
          update_by
          update_dt
          rp_damage_repair {
            action
            code_cv
            code_type
            create_by
            create_dt
            delete_dt
            guid
            rp_guid
            update_by
            update_dt
          }
          tariff_repair {
            alias
            create_by
            create_dt
            delete_dt
            dimension
            group_name_cv
            guid
            height_diameter
            height_diameter_unit_cv
            labour_hour
            length
            length_unit_cv
            material_cost
            part_name
            remarks
            subgroup_name_cv
            thickness
            thickness_unit_cv
            update_by
            update_dt
            width_diameter
            width_diameter_unit_cv
            package_repair(where: { customer_company_guid: { eq: $customer_company_guid } }) {
              material_cost
            }
          }
        }
        aspnetsuser {
          id
          userName
        }
        storing_order_tank {
          certificate_cv
          clean_status_cv
          create_by
          create_dt
          delete_dt
          estimate_cv
          etr_dt
          guid
          job_no
          owner_guid
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
          so_guid
          status_cv
          tank_no
          tank_status_cv
          update_by
          update_dt
          storing_order {
            customer_company {
              code
              name
              guid
            }
          }
          tariff_cleaning {
            alias
            cargo
            class_cv
            create_by
            create_dt
            delete_dt
            guid
            update_by
            update_dt
          }
          customer_company {
            code
            guid
            name
            delete_dt
          }
          in_gate {
            eir_no
            eir_dt
            delete_dt
            in_gate_survey {
              last_test_cv
              next_test_cv
              test_dt
              test_class_cv
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

export const GET_REPAIR_FOR_APPROVAL = gql`
  query QueryRepair($where: repairFilterInput) {
    resultList: queryRepair(where: $where) {
      nodes {
        aspnetusers_guid
        create_by
        create_dt
        delete_dt
        estimate_no
        guid
        labour_cost
        labour_cost_discount
        material_cost_discount
        owner_enable
        remarks
        sot_guid
        status_cv
        total_cost
        update_by
        update_dt
        bill_to_guid
        repair_part {
          action
          create_by
          create_dt
          delete_dt
          description
          guid
          hour
          location_cv
          comment
          material_cost
          owner
          quantity
          remarks
          repair_guid
          tariff_repair_guid
          update_by
          update_dt
          approve_cost
          approve_hour
          approve_part
          approve_qty
          complete_dt
          rp_damage_repair {
            action
            code_cv
            code_type
            create_by
            create_dt
            delete_dt
            guid
            rp_guid
            update_by
            update_dt
          }
          tariff_repair {
            alias
            create_by
            create_dt
            delete_dt
            dimension
            group_name_cv
            guid
            height_diameter
            height_diameter_unit_cv
            labour_hour
            length
            length_unit_cv
            material_cost
            part_name
            remarks
            subgroup_name_cv
            thickness
            thickness_unit_cv
            update_by
            update_dt
            width_diameter
            width_diameter_unit_cv
          }
        }
        aspnetsuser {
          id
          userName
        }
        storing_order_tank {
          certificate_cv
          clean_status_cv
          create_by
          create_dt
          delete_dt
          estimate_cv
          etr_dt
          guid
          job_no
          owner_guid
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
          so_guid
          status_cv
          tank_no
          tank_status_cv
          update_by
          update_dt
          storing_order {
            customer_company {
              code
              name
              guid
            }
          }
          tariff_cleaning {
            alias
            cargo
            class_cv
            create_by
            create_dt
            delete_dt
            guid
            update_by
            update_dt
          }
          customer_company {
            code
            guid
            name
            delete_dt
          }
          in_gate {
            eir_no
            eir_dt
            delete_dt
            in_gate_survey {
              last_test_cv
              next_test_cv
              test_dt
              test_class_cv
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

export const GET_REPAIR_FOR_JOB_ORDER = gql`
  query QueryRepair($where: repairFilterInput) {
    resultList: queryRepair(where: $where) {
      nodes {
        aspnetusers_guid
        create_by
        create_dt
        delete_dt
        estimate_no
        guid
        labour_cost
        labour_cost_discount
        material_cost_discount
        owner_enable
        remarks
        sot_guid
        status_cv
        total_cost
        update_by
        update_dt
        repair_part {
          action
          create_by
          create_dt
          delete_dt
          description
          guid
          hour
          location_cv
          comment
          material_cost
          owner
          quantity
          remarks
          repair_guid
          tariff_repair_guid
          update_by
          update_dt
          approve_cost
          approve_hour
          approve_part
          approve_qty
          complete_dt
          rp_damage_repair {
            action
            code_cv
            code_type
            create_by
            create_dt
            delete_dt
            guid
            rp_guid
            update_by
            update_dt
          }
          tariff_repair {
            alias
            create_by
            create_dt
            delete_dt
            dimension
            group_name_cv
            guid
            height_diameter
            height_diameter_unit_cv
            labour_hour
            length
            length_unit_cv
            material_cost
            part_name
            remarks
            subgroup_name_cv
            thickness
            thickness_unit_cv
            update_by
            update_dt
            width_diameter
            width_diameter_unit_cv
          }
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
        aspnetsuser {
          id
          userName
        }
        storing_order_tank {
          certificate_cv
          clean_status_cv
          create_by
          create_dt
          delete_dt
          estimate_cv
          etr_dt
          guid
          job_no
          owner_guid
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
          so_guid
          status_cv
          tank_no
          tank_status_cv
          update_by
          update_dt
          storing_order {
            customer_company {
              code
              name
              guid
            }
          }
          tariff_cleaning {
            alias
            cargo
            class_cv
            create_by
            create_dt
            delete_dt
            guid
            update_by
            update_dt
          }
          customer_company {
            code
            guid
            name
            delete_dt
          }
          in_gate {
            eir_no
            eir_dt
            delete_dt
            in_gate_survey {
              last_test_cv
              next_test_cv
              test_dt
              test_class_cv
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

export const ADD_REPAIR = gql`
  mutation AddRepair($repair: repairInput!, $customerCompany: customer_companyInput) {
    addRepair(repair: $repair, customerCompany: $customerCompany)
  }
`;

export const UPDATE_REPAIR = gql`
  mutation UpdateRepair($repair: repairInput!, $customerCompany: customer_companyInput) {
    updateRepair(repair: $repair, customerCompany: $customerCompany)
  }
`;

export const CANCEL_REPAIR = gql`
  mutation CancelRepair($repair: [repairInput!]!) {
    cancelRepair(repair: $repair)
  }
`

export const ROLLBACK_REPAIR = gql`
  mutation RollbackRepair($repair: [RepairRequestInput!]!) {
    rollbackRepair(repair: $repair)
  }
`

export const ROLLBACK_REPAIR_STATUS = gql`
  mutation RollbackRepairStatus($repair: RepairRequestInput!) {
    rollbackRepairStatus(repair: $repair)
  }
`

export const APPROVE_REPAIR = gql`
  mutation ApproveRepair($repair: repairInput!) {
    approveRepair(repair: $repair)
  }
`

export class RepairDS extends BaseDataSource<RepairItem> {
  constructor(private apollo: Apollo) {
    super();
  }
  searchRepair(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<RepairItem[]> {
    this.loadingSubject.next(true);
    
    return this.apollo
      .query<any>({
        query: GET_REPAIR,
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

  getRepairByID(id: string, customer_company_guid: string): Observable<RepairItem[]> {
    this.loadingSubject.next(true);
    const where: any = { guid: { eq: id } }
    return this.apollo
      .query<any>({
        query: GET_REPAIR_BY_ID,
        variables: { where, customer_company_guid },
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

  getRepairByIDForApproval(id: string): Observable<RepairItem[]> {
    this.loadingSubject.next(true);
    const where: any = { guid: { eq: id } }
    return this.apollo
      .query<any>({
        query: GET_REPAIR_FOR_APPROVAL,
        variables: { where },
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

  getRepairByIDForJobOrder(id: string): Observable<RepairItem[]> {
    this.loadingSubject.next(true);
    const where: any = { guid: { eq: id }, status_cv: { eq: "APPROVED" } }
    return this.apollo
      .query<any>({
        query: GET_REPAIR_FOR_JOB_ORDER,
        variables: { where },
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

  addRepair(repair: any, customerCompany: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_REPAIR,
      variables: {
        repair,
        customerCompany
      }
    });
  }

  updateRepair(repair: any, customerCompany: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_REPAIR,
      variables: {
        repair,
        customerCompany
      }
    });
  }

  cancelRepair(repair: any): Observable<any> {
    return this.apollo.mutate({
      mutation: CANCEL_REPAIR,
      variables: {
        repair
      }
    });
  }

  rollbackRepair(repair: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ROLLBACK_REPAIR,
      variables: {
        repair
      }
    });
  }

  rollbackRepairStatus(repair: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ROLLBACK_REPAIR_STATUS,
      variables: {
        repair
      }
    });
  }

  approveRepair(repair: any): Observable<any> {
    return this.apollo.mutate({
      mutation: APPROVE_REPAIR,
      variables: {
        repair
      }
    });
  }

  canAmend(re: RepairItem | undefined): boolean {
    return !re?.status_cv || re?.status_cv === 'PENDING';
  }

  canApprove(re: RepairItem | undefined): boolean {
    return re?.status_cv === 'PENDING';
  }

  canCancel(re: RepairItem | undefined): boolean {
    return re?.status_cv === 'PENDING';
  }

  canRollback(re: RepairItem | undefined): boolean {
    return re?.status_cv === 'PENDING';
  }

  canRollbackStatus(re: RepairItem | undefined): boolean {
    return re?.status_cv === 'CANCELED' || re?.status_cv === 'APPROVED';
  }

  canAssign(re: RepairItem | undefined): boolean {
    return re?.status_cv === 'APPROVED';
  }

  canCopy(re: RepairItem): boolean {
    return true;
  }

  getTotal(repairPartList: any[] | undefined): any {
    const totalSums = repairPartList?.filter(data => !data.delete_dt && (data.approve_part ?? true))?.reduce((totals: any, owner) => {
      return {
        hour: (totals.hour ?? 0) + (owner.approve_hour ?? owner.hour ?? 0),
        total_mat_cost: totals.total_mat_cost + (((owner.approve_qty ?? owner.quantity ?? 0) * (owner.approve_cost ?? owner.material_cost ?? 0)))
      };
    }, { hour: 0, total_mat_cost: 0 }) || 0;
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

  calculateCost(repair: RepairItem, repList: RepairPartItem[], packageLabourCost?: number) {
    const costResult = new RepairCostTableItem();
    const ownerList = repList.filter(item => item.owner && !item.delete_dt && (item.approve_part ?? true));
    const lesseeList = repList.filter(item => !item.owner && !item.delete_dt && (item.approve_part ?? true));
    const labourDiscount = repair.labour_cost_discount;
    const matDiscount = repair.material_cost_discount;

    let total_hour = 0;
    let total_labour_cost = 0;
    let total_mat_cost = 0;
    let total_cost = 0;
    let discount_labour_cost = 0;
    let discount_mat_cost = 0;
    let net_cost = 0;

    const totalOwner = this.getTotal(ownerList);
    const total_owner_hour = totalOwner.hour;
    const total_owner_labour_cost = this.getTotalLabourCost(total_owner_hour, repair.labour_cost ?? packageLabourCost);
    const total_owner_mat_cost = totalOwner.total_mat_cost;
    const total_owner_cost = this.getTotalCost(total_owner_labour_cost, total_owner_mat_cost);
    const discount_labour_owner_cost = this.getDiscountCost(labourDiscount, total_owner_labour_cost);
    const discount_mat_owner_cost = this.getDiscountCost(matDiscount, total_owner_mat_cost);
    const net_owner_cost = this.getNetCost(total_owner_cost, discount_labour_owner_cost, discount_mat_owner_cost);

    costResult.total_owner_cost = total_owner_hour.toFixed(2);
    costResult.total_owner_labour_cost = total_owner_labour_cost.toFixed(2);
    costResult.total_owner_mat_cost = total_owner_mat_cost.toFixed(2);
    costResult.total_owner_cost = total_owner_cost.toFixed(2);
    costResult.discount_labour_owner_cost = discount_labour_owner_cost.toFixed(2);
    costResult.discount_mat_owner_cost = discount_mat_owner_cost.toFixed(2);
    costResult.net_owner_cost = net_owner_cost.toFixed(2);

    total_hour += total_owner_hour;
    total_labour_cost += total_owner_labour_cost;
    total_mat_cost += total_owner_mat_cost;
    total_cost += total_owner_cost;
    discount_labour_cost += discount_labour_owner_cost;
    discount_mat_cost += discount_mat_owner_cost;
    net_cost += net_owner_cost;

    const totalLessee = this.getTotal(lesseeList);
    const total_lessee_hour = totalLessee.hour;
    const total_lessee_labour_cost = this.getTotalLabourCost(total_lessee_hour, repair.labour_cost ?? packageLabourCost);
    const total_lessee_mat_cost = totalLessee.total_mat_cost;
    const total_lessee_cost = this.getTotalCost(total_lessee_labour_cost, total_lessee_mat_cost);
    const discount_labour_lessee_cost = this.getDiscountCost(labourDiscount, total_lessee_labour_cost);
    const discount_mat_lessee_cost = this.getDiscountCost(matDiscount, total_lessee_mat_cost);
    const net_lessee_cost = this.getNetCost(total_lessee_cost, discount_labour_lessee_cost, discount_mat_lessee_cost);

    costResult.total_lessee_hour = total_lessee_hour.toFixed(2);
    costResult.total_lessee_labour_cost = total_lessee_labour_cost.toFixed(2);
    costResult.total_lessee_mat_cost = total_lessee_mat_cost.toFixed(2);
    costResult.total_lessee_cost = total_lessee_cost.toFixed(2);
    costResult.discount_labour_lessee_cost = discount_labour_lessee_cost.toFixed(2);
    costResult.discount_mat_lessee_cost = discount_mat_lessee_cost.toFixed(2);
    costResult.net_lessee_cost = net_lessee_cost.toFixed(2);

    total_hour += total_lessee_hour;
    total_labour_cost += total_lessee_labour_cost;
    total_mat_cost += total_lessee_mat_cost;
    total_cost += total_lessee_cost;
    discount_labour_cost += discount_labour_lessee_cost;
    discount_mat_cost += discount_mat_lessee_cost;
    net_cost += net_lessee_cost;

    costResult.total_hour_table = total_hour.toFixed(2);
    costResult.total_labour_cost = total_labour_cost.toFixed(2);
    costResult.total_mat_cost = total_mat_cost.toFixed(2);
    costResult.total_cost_table = total_cost.toFixed(2);
    costResult.discount_labour_cost = discount_labour_cost.toFixed(2);
    costResult.discount_mat_cost = discount_mat_cost.toFixed(2);
    costResult.net_cost = net_cost.toFixed(2);

    return costResult;
  }
}
