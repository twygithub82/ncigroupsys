import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { BaseDataSource } from './base-ds';
import { StoringOrderTankItem } from './storing-order-tank';
import { SchedulingItem } from './scheduling';
import { TariffRepairItem } from './tariff-repair';
import { RepairItem } from './repair';
//import { REPDamageRepairItem } from './rep-damage-repair';
import { TariffResidueItem } from './tariff-residue';
import { JobOrderItem } from './job-order';
import { ResidueItem } from './residue';

export class ResidueEstPartGO {





  // public location_cv?: string;
  // public comment?: string;
  // public remarks?: string;

  // public hour?: number;
  // public owner?: boolean;
  // public material_cost?: number;
  // public approve_qty?: number;
  // public approve_hour?: number;
  // public approve_cost?: number;

  //public complete_dt?: number;

  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  public approve_qty?: number;

  public approve_cost?: number;
  public guid?: string;
  public action?: string;
  public approve_part?: boolean;
  public cost?: number;
  public job_order_guid?: string;
  public quantity?: number;
  public residue_guid?: string;
  public tariff_residue_guid?: string;
  public team_guid?: string;
  public description?: string;
  public qty_unit_type_cv?: string;


  constructor(item: Partial<ResidueEstPartGO> = {}) {
    this.action = item.action;
    this.guid = item.guid ? item.guid : '';
    this.job_order_guid = item.job_order_guid;
    this.residue_guid = item.residue_guid;
    this.description = item.description;
    this.tariff_residue_guid = item.tariff_residue_guid;
    // this.comment = item.comment;
    // this.remarks = item.remarks;
    this.quantity = item.quantity;
    // this.hour = item.hour;
    // this.owner = item.owner || false;
    this.cost = item.cost;
    this.approve_qty = item.approve_qty;
    this.qty_unit_type_cv=item.qty_unit_type_cv;

    this.approve_cost = item.approve_cost;
    this.approve_part = item.approve_part;
    // this.complete_dt = item.complete_dt;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class ResiduePartItem extends ResidueEstPartGO {
  public tariff_residue?: TariffResidueItem;
  public job_order?: JobOrderItem;
  public residue?: ResidueItem

  constructor(item: Partial<ResiduePartItem> = {}) {
    super(item)
    this.tariff_residue = item.tariff_residue;
    this.job_order = item.job_order;
    this.residue = item.residue;
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

export class ResiduePartDS extends BaseDataSource<ResiduePartItem> {


  constructor(private apollo: Apollo) {
    super();
  }

  isApprove(rep: ResiduePartItem) {
    return rep.approve_part;
  }

  // is4X(repDmgRepair: REPDamageRepairItem[] | undefined): boolean | undefined {
  //   return repDmgRepair && !repDmgRepair.some((item: REPDamageRepairItem) => !item.delete_dt && item.code_type === 1 && item.code_cv?.toLowerCase() === '4x'.toLowerCase());
  // }
}
