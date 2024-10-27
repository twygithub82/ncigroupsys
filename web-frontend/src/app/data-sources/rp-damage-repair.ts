import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { BaseDataSource } from './base-ds';
import { SchedulingItem } from './scheduling';
import { RepairPartItem } from './repair-part';

export class RPDamageRepairGO {
  public guid?: string;
  public rep_guid?: string;
  public code_cv?: string;
  public code_type?: number;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<RPDamageRepairGO> = {}) {
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

export class RPDamageRepairItem extends RPDamageRepairGO {
  public repair_part?: RepairPartItem;
  public action?: string
  constructor(item: Partial<RPDamageRepairItem> = {}) {
    super(item)
    this.repair_part = item.repair_part;
    this.action = item.action;
  }
}

export const GET_SCHEDULING_SOT = gql`
  query QueryScheduling($where: scheduling_sotFilterInput, $order: [scheduling_sotSortInput!], $first: Int, $after: String, $last: Int, $before: String) {
    resultList: querySchedulingSOT(where: $where, order: $order, first: $first, after: $after, last: $last, before: $before) {
      totalCount
    }
  }
`;

export class RPDamageRepairDS extends BaseDataSource<RPDamageRepairItem> {
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

  createREPDamage(guid: string | undefined, rep_guid: string | undefined, code_val: string): RPDamageRepairItem {
    return new RPDamageRepairItem({guid: guid, rep_guid: rep_guid, code_cv: code_val, code_type: 0, action: 'new'})
  }

  createREPRepair(guid: string | undefined, rep_guid: string | undefined, code_val: string): RPDamageRepairItem {
    return new RPDamageRepairItem({guid: guid, rep_guid: rep_guid, code_cv: code_val, code_type: 1, action: 'new'})
  }
}
