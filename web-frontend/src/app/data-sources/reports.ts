import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, merge, of } from 'rxjs';
import { catchError,finalize,  map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { BaseDataSource } from './base-ds';
import { ApolloError } from '@apollo/client/errors';
import { StoringOrderTankItem } from "./storing-order-tank";

export class report_customer_inventory{
  guid?:string;
  code?:string;
  customer?:string;
  tank_no_in_gate?:number=0;
  tank_no_out_gate?:number=0;
  tank_no_in_yard?:number=0;
  tank_no_pending?:number=0;
  tank_no_ro?:number=0;
  tank_no_total?:number=0;
  in_yard_storing_order_tank?:StoringOrderTankItem[];
  released_storing_order_tank?:StoringOrderTankItem[];

  constructor(item: Partial<report_customer_inventory> = {}) {
    this.guid = item.guid;
    if (!this.guid) this.guid = '';
    
    this.customer=item.customer;
    this.code=item.code;
    this.tank_no_in_gate=Number(item.tank_no_in_gate||0);
    this.tank_no_out_gate=Number(item.tank_no_out_gate||0);
    this.tank_no_in_yard=Number(item.tank_no_in_yard||0);
    this.tank_no_pending=Number(item.tank_no_pending||0);
    this.tank_no_ro=Number(item.tank_no_ro||0);
    this.tank_no_total=Number(item.tank_no_total||0);
    this.in_yard_storing_order_tank=item.in_yard_storing_order_tank;
    this.released_storing_order_tank=item.released_storing_order_tank;
  }
}

export class report_customer_tank_activity{
  guid?:string;
  code?:string;
  customer?:string;
  number_tank?:number=0;
  storing_order_tank?:StoringOrderTankItem[];

  constructor(item: Partial<report_customer_tank_activity> = {}) {
    this.guid = item.guid;
    if (!this.guid) this.guid = '';
    
    this.customer=item.customer;
    this.code=item.code;
    this.number_tank=item.number_tank;
    this.storing_order_tank=item.storing_order_tank;
  }
}

export class report_status{
  guid?:string;
  code?:string;
  customer?:string;
  number_tank?:number=0;
  yards?:report_status_yard[];
  constructor(item: Partial<report_status> = {}) {
    this.guid = item.guid;
    if (!this.guid) this.guid = '';
    
    this.customer=item.customer;
    this.code=item.code;
    this.number_tank=item.number_tank;
    this.yards=item.yards;
  }
}

export class report_inventory_yard{
  code?:string;
  open_balance?:number=0;
  close_balance?:number=0;
  in_gate?:number=0;
  out_gate?:number=0;
  transfer_in?:number=0;
  transfer_out?:number=0;

  constructor(item: Partial<report_inventory_yard> = {}) {
    this.code = item.code;
    if (!this.code) this.code = '';
    this.code =item.code;
    this.open_balance=Number(item.open_balance||0);
    this.close_balance=Number(item.close_balance||0);
    this.in_gate=Number(item.in_gate||0);
    this.out_gate=Number(item.out_gate||0);
    this.transfer_in=Number(item.transfer_in||0);
    this.transfer_out=Number(item.transfer_out||0);
  }
}
export class report_status_yard{
    code?:string;
    noTank_repair?:number=0;
    noTank_clean?:number=0;
    noTank_storage?:number=0;
    noTank_steam?:number=0;
    noTank_in_survey?:number=0;
    storing_order_tank?:StoringOrderTankItem[];

    constructor(item: Partial<report_status_yard> = {}) {
      this.code = item.code;
      if (!this.code) this.code = '';
      
      this.noTank_repair=Number(item.noTank_repair||0);
      this.noTank_clean=Number(item.noTank_clean||0);
      this.noTank_storage=Number(item.noTank_storage||0);
      this.noTank_steam=Number(item.noTank_steam||0);
      this.storing_order_tank=item.storing_order_tank;
      this.noTank_in_survey=Number(item.noTank_in_survey||0);
    }


}

export class report_inventory_cleaning_detail{
  cargo?:string;
  storing_order_tank?:StoringOrderTankItem[];

  constructor(item: Partial<report_inventory_cleaning_detail> = {}) {
    this.cargo = item.cargo;
    this.storing_order_tank=item.storing_order_tank;
    
  }

}

export class cleaning_report_summary_item {
  public code?: string;
  public count?: number;
  public name?: string;

  constructor(item: Partial<cleaning_report_summary_item> = {}) {

    this.code=item.code;
    this.count=item.count;
    this.name=item.name;
  }
}


export class openingBalance{
  count?:number;
  yard?:String;
  constructor(item: Partial<openingBalance> = {}) {
    this.count = item.count;
    this.yard=item.yard;
  }
}

export class daily_inventory_summary{
  code?:String;
  in_gate_count?:number;
  name?:String;
  out_gate_count?:number;
  opening_balance?:openingBalance[]=[];

  constructor(item: Partial<daily_inventory_summary> = {}) {
    this.code = item.code;
    this.in_gate_count=item.in_gate_count;
    this.out_gate_count=item.out_gate_count;
    this.name=item.name;
    this.opening_balance=item.opening_balance;
  }
}

export const GET_CLEANING_INVENTORY_REPORT = gql`
  query queryCleaningInventorySummary($cleaningInventoryRequest: CleaningInventoryRequestInput!) {
    resultList: queryCleaningInventorySummary(cleaningInventoryRequest: $cleaningInventoryRequest) {
      nodes {
        code
        count
        name
      }
    }
  }
`

export const GET_DAILY_INVENTORY_SUMMARY = gql`
  query queryDailyInventorySummary($dailyInventoryRequest: DailyInventoryRequestInput!) {
    resultList: queryDailyInventorySummary(dailyInventoryRequest: $dailyInventoryRequest) {
      code
      name
      out_gate_count
      in_gate_count
      opening_balance {
        count
        yard
      }
    }
  }
`


export class ReportDS extends BaseDataSource<any> {
  constructor(private apollo: Apollo) {
    super();
  }

  searchDailyInventorySummaryReport(dailyInventoryRequest:any): Observable<daily_inventory_summary[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_DAILY_INVENTORY_SUMMARY,
        variables: { dailyInventoryRequest },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as cleaning_report_summary_item[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const resultList = result.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList);
          this.totalCount = resultList.totalCount;
          this.pageInfo = resultList.pageInfo;
          return resultList;
        })
      );
  }

 searchCleaningInventorySummaryReport(cleaningInventoryRequest:any): Observable<cleaning_report_summary_item[]> {
    this.loadingSubject.next(true);

    return this.apollo
      .query<any>({
        query: GET_CLEANING_INVENTORY_REPORT,
        variables: { cleaningInventoryRequest },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as cleaning_report_summary_item[]); // Return an empty array on error
        }),
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


