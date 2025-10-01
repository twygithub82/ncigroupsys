import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { BaseDataSource } from './base-ds';
import { ReleaseOrderItem } from './release-order';
import { StoringOrderTankItem } from './storing-order-tank';

export class ReleaseOrderSotGO {
  public guid?: string;
  public ro_guid?: string;
  public sot_guid?: string;
  public status_cv?: string;
  public remarks?: string;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<ReleaseOrderSotGO> = {}) {
    this.guid = item.guid;
    this.ro_guid = item.ro_guid;
    this.sot_guid = item.sot_guid || '';
    this.status_cv = item.status_cv || '';
    this.remarks = item.remarks || '';
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class ReleaseOrderSotItem extends ReleaseOrderSotGO {
  public release_order?: ReleaseOrderItem;
  public storing_order_tank?: StoringOrderTankItem;

  constructor(item: Partial<ReleaseOrderSotItem> = {}) {
    super(item);
    this.release_order = item.release_order;
    this.storing_order_tank = item.storing_order_tank;
  }
}

export class ReleaseOrderSotUpdateRO extends ReleaseOrderSotItem {
  public action?: string;

  constructor(item: Partial<ReleaseOrderSotUpdateRO> = {}) {
    super(item);
    this.action = item.action;
  }
}

export class ReleaseOrderSotUpdateItem extends ReleaseOrderSotUpdateRO {
  public actions?: string[] = [];

  constructor(item: Partial<ReleaseOrderSotUpdateItem> = {}) {
    super(item);
    this.actions = item.actions || [];
  }
}

export const CHECK_ANY_ACTIVE_RELEASE_ORDER_SOT = gql`
  query QueryReleaseOrderSOT($where: release_order_sotFilterInput){
    resultList: queryReleaseOrderSOT(where: $where) {
      nodes {
        status_cv
        sot_guid
        guid
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

export const GET_RELEASE_ORDER_SOT_FOR_OUT_GATE = gql`
  query queryReleaseOrderSOT($where: release_order_sotFilterInput){
    resultList: queryReleaseOrderSOT(where: $where) {
      nodes {
        create_by
        create_dt
        delete_dt
        guid
        remarks
        ro_guid
        sot_guid
        status_cv
        update_by
        update_dt
        release_order {
          create_by
          create_dt
          customer_company_guid
          delete_dt
          guid
          haulier
          release_dt
          remarks
          ro_generated
          ro_no
          ro_notes
          status_cv
          update_by
          update_dt
          customer_company {
            address_line1
            address_line2
            agreement_due_dt
            city
            code
            country
            create_by
            create_dt
            currency_guid
            def_template_guid
            delete_dt
            effective_dt
            email
            guid
            main_customer_guid
            name
            phone
            postal
            remarks
            type_cv
            update_by
            update_dt
            website
          }
        }
        storing_order_tank {
          certificate_cv
          clean_status_cv
          cleaning_remarks
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
          release_note
          remarks
          repair_remarks
          required_temp
          so_guid
          status_cv
          steaming_remarks
          storage_remarks
          tank_no
          tank_note
          tank_status_cv
          unit_type_guid
          update_by
          update_dt
          in_gate {
            eir_no
            eir_dt
            delete_dt
          }
          out_gate {
            create_by
            create_dt
            delete_dt
            driver_name
            eir_dt
            eir_no
            eir_status_cv
            guid
            haulier
            remarks
            so_tank_guid
            update_by
            update_dt
            yard_cv
            vehicle_no
          }
          tank_info {
            yard_cv
          }
        }
      }
    }
  }
`;

export class ReleaseOrderSotDS extends BaseDataSource<ReleaseOrderSotUpdateItem> {
  constructor(private apollo: Apollo) {
    super();
  }

  getReleaseOrderSotForOutGate(sot_guid: string): Observable<ReleaseOrderSotItem[]> {
    this.loadingSubject.next(true);
    let where: any = {
      and: [
        { sot_guid: { in: sot_guid } },
        // { status_cv: { in: ["WAITING"] } },
      ]
    }
    return this.apollo
      .query<any>({
        query: GET_RELEASE_ORDER_SOT_FOR_OUT_GATE,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ soList: [] })),
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

  ValidateSotInReleaseOrder(guid: string, sot_guid: string[]): Observable<ReleaseOrderSotItem[]> {
    this.loadingSubject.next(true);
    let where: any = {
      and: [
        { guid: { neq: guid } },
        { sot_guid: { in: sot_guid } },
        { status_cv: { nin: ["CANCELED"] } },
        { delete_dt: { eq: null } }
      ]
    }
    return this.apollo
      .query<any>({
        query: CHECK_ANY_ACTIVE_RELEASE_ORDER_SOT,
        variables: { where },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError(() => of({ soList: [] })),
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

  canCancel(roSot: any): boolean {
    return roSot && this.canCancelStatus(roSot.status_cv);
  }

  canCancelStatus(status_cv: any): boolean {
    return status_cv === 'WAITING';
  }

  canRollback(roSot: any): boolean {
    return roSot && this.canRollbackStatus(roSot.status_cv);
  }

  canRollbackStatus(status_cv: any): boolean {
    return status_cv === 'CANCELED';
  }

  canEdit(status_cv: any): boolean {
    return status_cv === undefined || status_cv === null || status_cv === '' || status_cv === 'WAITING';
  }

  getReleaseOrderSotItem(roSot: ReleaseOrderSotItem[] | undefined): ReleaseOrderSotItem | undefined {
    return roSot?.find(ros => ros.status_cv !== 'CANCELED' && !(ros.delete_dt));
  }
}
