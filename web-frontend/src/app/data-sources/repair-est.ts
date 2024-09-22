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
  public aspnetuser?: UserItem;
  public actions?: string[]
  constructor(item: Partial<RepairEstItem> = {}) {
    super(item)
    this.repair_est_part = item.repair_est_part;
    this.storing_order_tank = item.storing_order_tank;
    this.aspnetuser = item.aspnetuser;
    this.actions = item.actions;
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

export const ADD_REPAIR_EST = gql`
  mutation AddRepairEstimate($repairEstimate: repair_estInput!) {
    addRepairEstimate(repairEstimate: $repairEstimate)
  }
`;

export class RepairEstDS extends BaseDataSource<RepairEstItem> {
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

  addRepairEstimate(repairEstimate: any): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_REPAIR_EST,
      variables: {
        repairEstimate
      }
    });
  }

  canAdd(re: RepairEstItem): boolean {
    return true;
  }
}
