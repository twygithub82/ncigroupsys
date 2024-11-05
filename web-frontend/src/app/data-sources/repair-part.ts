import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { BaseDataSource } from './base-ds';
import { StoringOrderTankItem } from './storing-order-tank';
import { SchedulingItem } from './scheduling';
import { TariffRepairItem } from './tariff-repair';
import { RepairItem } from './repair';
import { RPDamageRepairItem } from './rp-damage-repair';
import { JobOrderItem } from './job-order';

export class RepairPartGO {
  public guid?: string;
  public tariff_repair_guid?: string;
  public repair_guid?: string;
  public job_order_guid?: string;
  public description?: string;
  public location_cv?: string;
  public comment?: string;
  public remarks?: string;
  public quantity?: number;
  public hour?: number;
  public owner?: boolean;
  public material_cost?: number;
  public approve_qty?: number;
  public approve_hour?: number;
  public approve_cost?: number;
  public approve_part?: boolean;
  public complete_dt?: number;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<RepairPartGO> = {}) {
    this.guid = item.guid;
    this.tariff_repair_guid = item.tariff_repair_guid;
    this.repair_guid = item.repair_guid;
    this.job_order_guid = item.job_order_guid;
    this.description = item.description;
    this.location_cv = item.location_cv;
    this.comment = item.comment;
    this.remarks = item.remarks;
    this.quantity = item.quantity;
    this.hour = item.hour;
    this.owner = item.owner || false;
    this.material_cost = item.material_cost;
    this.approve_qty = item.approve_qty;
    this.approve_hour = item.approve_hour;
    this.approve_cost = item.approve_cost;
    this.approve_part = item.approve_part;
    this.complete_dt = item.complete_dt;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class RepairPartItem extends RepairPartGO {
  public tariff_repair?: TariffRepairItem;
  public repair?: RepairItem;
  public rp_damage_repair?: RPDamageRepairItem[];
  public job_order?: JobOrderItem;
  public action?: string
  constructor(item: Partial<RepairPartItem> = {}) {
    super(item)
    this.tariff_repair = item.tariff_repair;
    this.repair = item.repair;
    this.rp_damage_repair = item.rp_damage_repair;
    this.job_order = item.job_order;
    this.action = item.action;
  }
}

export const GET_SCHEDULING_SOT = gql`
  query QueryScheduling($where: scheduling_sotFilterInput, $order: [scheduling_sotSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: querySchedulingSOT(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
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
        guid
        scheduling_guid
        sot_guid
        status_cv
        update_by
        update_dt
        scheduling {
          book_type_cv
          create_by
          create_dt
          delete_dt
          guid
          reference
          scheduling_dt
          status_cv
          update_by
          update_dt
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
          in_gate {
            eir_no
            eir_dt
            yard_cv
          }
          tariff_cleaning {
            cargo
          }
          storing_order {
            customer_company {
              code
              name
            }
          }
        }
      }
    }
  }
`;

export class RepairPartDS extends BaseDataSource<RepairPartItem> {
  constructor(private apollo: Apollo) {
    super();
  }

  isApproved(rp: RepairPartItem) {
    return rp.approve_part;
  }

  is4X(rpDmgRepair: RPDamageRepairItem[] | undefined): boolean | undefined {
    return rpDmgRepair && rpDmgRepair.some((item: RPDamageRepairItem) => !item.delete_dt && item.code_type === 1 && item.code_cv?.toLowerCase() === '4x'.toLowerCase());
  }

  isCompleted(rp: RepairPartItem): boolean {
    return rp && rp.complete_dt !== null && rp.complete_dt !== undefined && rp.complete_dt > 0;
  }

  sortAndGroupByGroupName(repList: any[]): any[] {
    const groupedRepList: any[] = [];
    let currentGroup = '';

    const sortedList = repList.sort((a, b) => {
      if (a.tariff_repair!.sequence !== b.tariff_repair.sequence) {
        return a.tariff_repair.sequence - b.tariff_repair.sequence;
      }

      if (a.tariff_repair.subgroup_name_cv !== b.tariff_repair.subgroup_name_cv) {
        if (!a.tariff_repair.subgroup_name_cv) return 1;
        if (!b.tariff_repair.subgroup_name_cv) return -1;

        return a.tariff_repair.subgroup_name_cv.localeCompare(b.tariff_repair.subgroup_name_cv);
      }

      return a.create_dt! - b.create_dt!;
    });

    sortedList.forEach(item => {
      const groupName = item.tariff_repair.group_name_cv;

      const isGroupHeader = groupName !== currentGroup;

      if (isGroupHeader) {
        currentGroup = groupName;
      }

      groupedRepList.push({
        ...item,
        isGroupHeader: isGroupHeader,
        group_name_cv: item.tariff_repair.group_name_cv,
        subgroup_name_cv: item.tariff_repair.subgroup_name_cv,
      });
    });

    return groupedRepList;
  }
}
