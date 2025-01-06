import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { BaseDataSource } from './base-ds';
import { testTypeMapping } from 'environments/environment.development';
import { CustomerCompanyItem } from './customer-company';
import { TankItem } from './tank';
import { TariffBufferItem } from './tariff-buffer';

export class TankInfoGO {
  public guid?: string;
  public capacity?: number;
  public cladding_cv?: string;
  public dom_dt?: number;
  public height_cv?: string;
  public last_test_cv?: string;
  public manufacturer_cv?: string;
  public max_weight_cv?: string;
  public next_test_cv?: string;
  public owner_guid?: string;
  public tank_comp_guid?: string;
  public tank_no?: string;
  public tare_weight?: number;
  public test_class_cv?: string;
  public test_dt?: number;
  public unit_type_guid?: string;
  public walkway_cv?: string;
  public yard_cv?: string;
  public last_notify_dt?: number;
  public create_dt?: number;
  public create_by?: string;
  public update_dt?: number;
  public update_by?: string;
  public delete_dt?: number;

  constructor(item: Partial<TankInfoGO> = {}) {
    this.guid = item.guid;
    this.capacity = item.capacity;
    this.cladding_cv = item.cladding_cv;
    this.dom_dt = item.dom_dt;
    this.height_cv = item.height_cv;
    this.last_test_cv = item.last_test_cv;
    this.manufacturer_cv = item.manufacturer_cv;
    this.max_weight_cv = item.max_weight_cv;
    this.next_test_cv = item.next_test_cv;
    this.owner_guid = item.owner_guid;
    this.tank_comp_guid = item.tank_comp_guid;
    this.tank_no = item.tank_no;
    this.tare_weight = item.tare_weight;
    this.test_class_cv = item.test_class_cv;
    this.test_dt = item.test_dt;
    this.unit_type_guid = item.unit_type_guid;
    this.walkway_cv = item.walkway_cv;
    this.yard_cv = item.yard_cv;
    this.last_notify_dt = item.last_notify_dt;
    this.create_dt = item.create_dt;
    this.create_by = item.create_by;
    this.update_dt = item.update_dt;
    this.update_by = item.update_by;
    this.delete_dt = item.delete_dt;
  }
}

export class TankInfoItem extends TankInfoGO {
  public customer_company?: CustomerCompanyItem; // owner
  public tank?: TankItem; // unit type
  public tariff_buffer?: TariffBufferItem;

  constructor(item: Partial<TankInfoItem> = {}) {
    super(item);
    this.customer_company = item.customer_company;
    this.tank = item.tank;
    this.tariff_buffer = item.tariff_buffer;
  }
}

export interface TankResult {
  items: TankInfoItem[];
  totalCount: number;
}

export const GET_TANK_INFO_FOR_MOVEMENT = gql`
  query queryTankInfo($where: tank_infoFilterInput) {
    resultList: queryTankInfo(where: $where) {
      nodes {
        capacity
        cladding_cv
        create_by
        create_dt
        delete_dt
        dom_dt
        guid
        height_cv
        last_notify_dt
        last_test_cv
        manufacturer_cv
        max_weight_cv
        next_test_cv
        owner_guid
        tank_comp_guid
        tank_no
        tare_weight
        test_class_cv
        test_dt
        unit_type_guid
        update_by
        update_dt
        walkway_cv
        yard_cv
      }
    }
  }
`;

export const GET_TANK_INFO_FOR_LAST_TEST = gql`
  query queryTankInfo($where: tank_infoFilterInput) {
    resultList: queryTankInfo(where: $where) {
      nodes {
        capacity
        cladding_cv
        create_by
        create_dt
        delete_dt
        dom_dt
        guid
        height_cv
        last_notify_dt
        last_test_cv
        manufacturer_cv
        max_weight_cv
        next_test_cv
        owner_guid
        tank_comp_guid
        tank_no
        tare_weight
        test_class_cv
        test_dt
        unit_type_guid
        update_by
        update_dt
        walkway_cv
        yard_cv
      }
    }
  }
`;

export const GET_TANK_INFO_FOR_OUT_GATE_SURVEY = gql`
  query queryTankInfo($where: tank_infoFilterInput) {
    resultList: queryTankInfo(where: $where) {
      nodes {
        capacity
        cladding_cv
        create_by
        create_dt
        delete_dt
        dom_dt
        guid
        height_cv
        last_notify_dt
        last_test_cv
        manufacturer_cv
        max_weight_cv
        next_test_cv
        owner_guid
        tank_comp_guid
        tank_no
        tare_weight
        test_class_cv
        test_dt
        unit_type_guid
        update_by
        update_dt
        walkway_cv
        yard_cv
      }
    }
  }
`;

export class TankInfoDS extends BaseDataSource<TankInfoItem> {
  constructor(private apollo: Apollo) {
    super();
  }

  getTankInfoForMovement(tank_no: string): Observable<TankInfoItem[]> {
    this.loadingSubject.next(true);
    const where = {
      tank_no: { eq: tank_no },
    }
    return this.apollo
      .query<any>({
        query: GET_TANK_INFO_FOR_MOVEMENT,
        variables: { where },
        fetchPolicy: 'no-cache', // Ensure fresh data
      })
      .pipe(
        map((result) => {
          const resultList = result.data?.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList.nodes);
          this.totalCount = resultList.totalCount;
          this.pageInfo = resultList.pageInfo;
          return resultList.nodes;
        }),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  getTankInfoForLastTest(tank_no: string): Observable<TankInfoItem[]> {
    this.loadingSubject.next(true);
    const where = {
      tank_no: { eq: tank_no },
    }
    return this.apollo
      .query<any>({
        query: GET_TANK_INFO_FOR_LAST_TEST,
        variables: { where },
        fetchPolicy: 'no-cache', // Ensure fresh data
      })
      .pipe(
        map((result) => {
          const resultList = result.data?.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList.nodes);
          this.totalCount = resultList.totalCount;
          this.pageInfo = resultList.pageInfo;
          return resultList.nodes;
        }),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  getTankInfoForOutGateSurvey(tank_no: string): Observable<TankInfoItem[]> {
    this.loadingSubject.next(true);
    const where = {
      tank_no: { eq: tank_no },
    }
    return this.apollo
      .query<any>({
        query: GET_TANK_INFO_FOR_OUT_GATE_SURVEY,
        variables: { where },
        fetchPolicy: 'no-cache', // Ensure fresh data
      })
      .pipe(
        map((result) => {
          const resultList = result.data?.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList.nodes);
          this.totalCount = resultList.totalCount;
          this.pageInfo = resultList.pageInfo;
          return resultList.nodes;
        }),
        catchError(() => of({ items: [], totalCount: 0 })),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  getNextTestCv(last_test_cv: string): string | undefined {
      if (!last_test_cv) return "";
      const test_type = last_test_cv;
      const mappedVal = testTypeMapping[test_type!];
      return mappedVal;
    }
}
