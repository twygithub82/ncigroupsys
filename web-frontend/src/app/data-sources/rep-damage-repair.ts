import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StoringOrderItem } from './storing-order';
import { TARIFF_CLEANING_FRAGMENT, TariffCleaningItem } from './tariff-cleaning';
import { BaseDataSource } from './base-ds';
import { InGateItem } from './in-gate';
import { StoringOrderTankItem } from './storing-order-tank';
import { ReleaseOrderItem } from './release-order';
import { SchedulingItem } from './scheduling';
import { TariffRepairItem } from './tariff-repair';
import { RepairEstPartItem } from './repair-est-part';

export class REPDamageRepairGO {
  public guid?: string;
  public rep_guid?: string;
  public code_cv?: string;
  public code_type?: number;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<REPDamageRepairGO> = {}) {
    this.guid = item.guid;
    this.rep_guid = item.rep_guid;
    this.code_cv = item.code_cv;
    this.code_type = item.code_type;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class REPDamageRepairItem extends REPDamageRepairGO {
  public repair_est_part?: RepairEstPartItem;
  public actions?: string[]
  constructor(item: Partial<REPDamageRepairItem> = {}) {
    super(item)
    this.repair_est_part = item.repair_est_part;
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

export class REPDamageRepairDS extends BaseDataSource<REPDamageRepairItem> {
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

  createREPDamage(guid: string | undefined, rep_guid: string | undefined, code_val: string): REPDamageRepairItem {
    return new REPDamageRepairItem({guid: guid, rep_guid: rep_guid, code_cv: code_val, code_type: 0})
  }

  createREPRepair(guid: string | undefined, rep_guid: string | undefined, code_val: string): REPDamageRepairItem {
    return new REPDamageRepairItem({guid: guid, rep_guid: rep_guid, code_cv: code_val, code_type: 1})
  }
}
