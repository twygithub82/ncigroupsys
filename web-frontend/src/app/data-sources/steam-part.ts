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
import { TariffSteamingItem } from './tariff-steam';

export class SteamPartGO {
  
  public guid?: string;
  public steam_guid?:string;
  public tariff_steaming_guid?:string;
  public job_order_guid?:string;
  public description?: string;
  public quantity?: number;
  public labour?:number;
  public cost?:number;

  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;
  public complete_dt?:number;


  public approve_qty?: number;
  public approve_labour?:number;
  public approve_cost?: number;
  public approve_part?: boolean;

  public action?:string;
  
  
  
 
  //public residue_guid?: string;
  
  //public team_guid?:string;
  


  constructor(item: Partial<SteamPartGO> = {}) {
    this.guid = item.guid?item.guid:'';
    
    this.steam_guid = item.steam_guid;
    this.tariff_steaming_guid = item.tariff_steaming_guid;
    this.job_order_guid = item.job_order_guid;
    this.description = item.description;
    this.quantity = Number(item.quantity);
    this.labour = Number(item.labour);
    this.cost = Number(item.cost);
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
    this.complete_dt = item.complete_dt;
    this.approve_qty = item.approve_qty;
    this.approve_labour = item.approve_labour;
    this.approve_cost = item.approve_cost;
    this.approve_part = item.approve_part;
    this.action = item.action;
  }
}

export class SteamPartItem extends SteamPartGO {
  public tariff_steaming?: TariffSteamingItem;
  public job_order?: JobOrderItem;
  
  constructor(item: Partial<SteamPartItem> = {}) {
    super(item)
    this.tariff_steaming = item.tariff_steaming;
    this.job_order=item.job_order;
    
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

export class ResiduePartDS extends BaseDataSource<SteamPartItem> {
  

  constructor(private apollo: Apollo) {
    super();
  }

  isApprove(rep: SteamPartItem) {
    return rep.approve_part;
  }

  // is4X(repDmgRepair: REPDamageRepairItem[] | undefined): boolean | undefined {
  //   return repDmgRepair && !repDmgRepair.some((item: REPDamageRepairItem) => !item.delete_dt && item.code_type === 1 && item.code_cv?.toLowerCase() === '4x'.toLowerCase());
  // }
}
