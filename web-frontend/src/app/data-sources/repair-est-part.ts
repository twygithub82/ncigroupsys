import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { BaseDataSource } from './base-ds';
import { StoringOrderTankItem } from './storing-order-tank';
import { SchedulingItem } from './scheduling';
import { TariffRepairItem } from './tariff-repair';
import { RepairEstItem } from './repair-est';
import { REPDamageRepairItem } from './rep-damage-repair';

export class RepairEstPartGO {
  public guid?: string;
  public tariff_repair_guid?: string;
  public repair_est_guid?: string;
  public description?: string;
  public location_cv?: string;
  public remarks?: string;
  public quantity?: number;
  public hour?: number;
  public material_cost?: number;
  public owner?: boolean;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<RepairEstPartGO> = {}) {
    this.guid = item.guid;
    this.tariff_repair_guid = item.tariff_repair_guid;
    this.repair_est_guid = item.repair_est_guid;
    this.description = item.description;
    this.location_cv = item.location_cv;
    this.remarks = item.remarks;
    this.quantity = item.quantity;
    this.hour = item.hour;
    this.material_cost = item.material_cost;
    this.owner = item.owner || false;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class RepairEstPartItem extends RepairEstPartGO {
  public tariff_repair?: TariffRepairItem;
  public repair_est?: RepairEstItem;
  public rep_damage_repair?: REPDamageRepairItem[];
  public action?: string
  constructor(item: Partial<RepairEstPartItem> = {}) {
    super(item)
    this.tariff_repair = item.tariff_repair;
    this.repair_est = item.repair_est;
    this.rep_damage_repair = item.rep_damage_repair;
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

export class RepairEstPartDS extends BaseDataSource<RepairEstPartItem> {
  constructor(private apollo: Apollo) {
    super();
  }
  searchSchedulingSot(where: any, order?: any, first?: number, after?: string, last?: number, before?: string): Observable<SchedulingItem[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_SCHEDULING_SOT,
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
}
