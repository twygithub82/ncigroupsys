import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { BaseDataSource } from './base-ds';
import { StoringOrderTankItem } from './storing-order-tank';
import { SchedulingItem } from './scheduling';
import { TariffRepairItem } from './tariff-repair';
import { RepairEstPartItem } from './repair-est-part';
import { UserItem } from './user';

export class RepairEstGO {
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
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<RepairEstGO> = {}) {
    this.guid = item.guid;
    this.sot_guid = item.sot_guid;
    this.aspnetusers_guid = item.aspnetusers_guid;
    this.estimate_no = item.estimate_no;
    this.labour_cost_discount = item.labour_cost_discount;
    this.material_cost_discount = item.material_cost_discount;
    this.labour_cost = item.labour_cost;
    this.total_cost = item.total_cost;
    this.status_cv = item.status_cv;
    this.remarks = item.remarks;
    this.owner_enable = item.owner_enable;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class RepairEstItem extends RepairEstGO {
  public repair_est_part?: RepairEstPartItem[];
  public storing_order_tank?: StoringOrderTankItem;
  public aspnetsuser?: UserItem;
  public actions?: string[]
  constructor(item: Partial<RepairEstItem> = {}) {
    super(item)
    this.repair_est_part = item.repair_est_part;
    this.storing_order_tank = item.storing_order_tank;
    this.aspnetsuser = item.aspnetsuser;
    this.actions = item.actions;
  }
}

export const GET_REPAIR_EST = gql`
  query QueryRepairEstimate($where: repair_estFilterInput, $order: [repair_estSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryRepairEstimate(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
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

export const GET_REPAIR_EST_FOR_APPROVAL = gql`
  query QueryRepairEstimate($where: repair_estFilterInput, $order: [repair_estSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: queryRepairEstimate(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
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
        repair_est_part {
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
          repair_est_guid
          tariff_repair_guid
          update_by
          update_dt
          rep_damage_repair {
            action
            code_cv
            code_type
            create_by
            create_dt
            delete_dt
            guid
            rep_guid
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

export const ADD_REPAIR_EST = gql`
  mutation AddRepairEstimate($repairEstimate: repair_estInput!, $customerCompany: customer_companyInput) {
    addRepairEstimate(repairEstimate: $repairEstimate, customerCompany: $customerCompany)
  }
`;

export const UPDATE_REPAIR_EST = gql`
  mutation UpdateRepairEstimate($repairEstimate: repair_estInput!, $customerCompany: customer_companyInput) {
    updateRepairEstimate(repairEstimate: $repairEstimate, customerCompany: $customerCompany)
  }
`;

export class RepairEstDS extends BaseDataSource<RepairEstItem> {
  constructor(private apollo: Apollo) {
    super();
  }
  searchRepairEst(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<RepairEstItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_REPAIR_EST,
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

  getRepairEstByIDForApproval(id: string): Observable<RepairEstItem[]> {
    this.loadingSubject.next(true);
    const where: any = { guid: { eq: id } }
    return this.apollo
      .query<any>({
        query: GET_REPAIR_EST_FOR_APPROVAL,
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

  addRepairEstimate(repairEstimate: any, customerCompany: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_REPAIR_EST,
      variables: {
        repairEstimate,
        customerCompany
      }
    });
  }

  updateRepairEstimate(repairEstimate: any, customerCompany: any): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_REPAIR_EST,
      variables: {
        repairEstimate,
        customerCompany
      }
    });
  }

  canAmend(re: RepairEstItem): boolean {
    return re.status_cv === 'PENDING';
  }

  getTotal(repairEstPartList: any[] | undefined): any {
    const totalSums = repairEstPartList?.reduce((totals: any, owner) => {
      return {
        hour: (totals.hour ?? 0) + (owner.hour ?? 0),
        total_mat_cost: totals.total_mat_cost + (((owner.quantity ?? 0) * (owner.material_cost ?? 0)))
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
}
