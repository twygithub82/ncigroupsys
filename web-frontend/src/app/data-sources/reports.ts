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
  in_gate_storing_order_tank?:StoringOrderTankItem[];
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
    this.in_gate_storing_order_tank=item.in_gate_storing_order_tank;
    this.in_yard_storing_order_tank=item.in_yard_storing_order_tank;
    this.released_storing_order_tank=item.released_storing_order_tank;
  }
}

export class report_customer_tank_activity{
  guid?:string;
  code?:string;
  customer?:string;
  number_tank?:number=0;
  in_yard_storing_order_tank?:StoringOrderTankItem[];
  released_storing_order_tank?:StoringOrderTankItem[];
  storing_order_tank?:StoringOrderTankItem[];

  constructor(item: Partial<report_customer_tank_activity> = {}) {
    this.guid = item.guid;
    if (!this.guid) this.guid = '';
    
    this.customer=item.customer;
    this.code=item.code;
    this.number_tank=item.number_tank;
    this.in_yard_storing_order_tank=item.in_yard_storing_order_tank;
    this.released_storing_order_tank=item.released_storing_order_tank;
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
    noTank_pending?:number=0;
    noTank_withRO?:number=0;
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
      this.noTank_pending=Number(item.noTank_pending||0);
      this.noTank_withRO=Number(item.noTank_withRO||0);
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
  in_count?:number;
  out_count?:number;
  open_balance?:number;
  yard?:String;
  constructor(item: Partial<openingBalance> = {}) {
    this.in_count = item.in_count;
    this.out_count = item.out_count;
    this.open_balance = item.open_balance;
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

export class report_periodic_test_due_group_customer{
  customer_code?:string;
  customer_name?:string;
  periodic_test_due?:periodic_test_due_item[];

  constructor(item: Partial<report_periodic_test_due_group_customer> = {}) {
    this.customer_code=item.customer_code;
    this.customer_name=item.customer_name;
    this.periodic_test_due=item.periodic_test_due;
  }
}

export class periodic_test_due_item{
        class_cv?:string;
        customer_code?:string;
        customer_name?:string;
        due_days?:string;
        due_type?:string;
        eir_dt?:number;
        eir_no?:string;
        last_test_type?:string;
        next_test_dt?:number;
        next_test_type?:string;
        owner_code?:string;
        tank_no?:string;
        test_dt?:number;

  constructor(item: Partial<periodic_test_due_item> = {}) {
    this.class_cv=item.class_cv;
    this.customer_code=item.customer_code;
    this.customer_name=item.customer_name;
    this.due_days=item.due_days;
    this.due_type=item.due_type;
    this.eir_dt=item.eir_dt;
    this.eir_no=item.eir_no;
    this.last_test_type=item.last_test_type;
    this.next_test_dt=item.next_test_dt;
    this.next_test_type=item.next_test_type;
    this.owner_code=item.owner_code;
    this.tank_no=item.tank_no;
    this.test_dt=item.test_dt;
  }
}


export class tank_survey_summary_group_by_survey_dt{
  survey_dt?:string;
  tank_survey_summaries?:tank_survey_summary[];

  constructor(item: Partial<tank_survey_summary_group_by_survey_dt> = {}) {
    this.survey_dt=item.survey_dt
    this.tank_survey_summaries=item.tank_survey_summaries
  }

}

export class tank_survey_summary{
  clean_dt?:number;
  customer_code?:string;
  eir_no?:string;
  status?:string;
  surveryor?:string;
  survey_type?:string;
  survey_dt?:number;
  tank_no?:string;
 // reference?:string;
  visit?:string;

constructor(item: Partial<tank_survey_summary> = {}) {
  this.clean_dt=item.clean_dt
  this.customer_code=item.customer_code
  this.eir_no=item.eir_no
  this.status=item.status
  this.surveryor=item.surveryor
 // this.reference=item.reference
  this.survey_type=item.survey_type
  this.tank_no=item.tank_no
  this.visit=item.visit
  this.survey_dt=item.survey_dt
  } 
}

export class ResultPerDay{
  cost?:number;
  count?:number;
  date?:string;
  day?:string;
  constructor(item: Partial<ResultPerDay> = {}) {
    this.cost=item.cost;
    this.count=item.count;
    this.date=item.date;
    this.day=item.day;
    
    } 

}
export class AdminReportMonthlyReport{
  average?:number;
  total?:number;
  result_per_day?:ResultPerDay[];

constructor(item: Partial<AdminReportMonthlyReport> = {}) {
  this.average=item.average;
  this.total=item.total;
  this.result_per_day=item.result_per_day;
  } 
}

export class ResultPerMonth{
  cost?:number;
  count?:number;
  month?:string;
  
  constructor(item: Partial<ResultPerMonth> = {}) {
    this.cost=item.cost;
    this.count=item.count;
    this.month=item.month;
    
    } 

}

export class AdminReportYearlyReport{
  average?:number;
  total?:number;
  result_per_month?:ResultPerMonth[];

constructor(item: Partial<AdminReportYearlyReport> = {}) {
  this.average=item.average;
  this.total=item.total;
  this.result_per_month=item.result_per_month;
  } 
}


export class MonthlySales
{
  average_cost?:number;
  average_count?:number;
  result_per_day?:ResultPerDay[];
  total_cost?:number;
  total_count?:number;
  constructor(item: Partial<MonthlySales> = {}) {
    this.average_count=item.average_count;
    this.average_cost=item.average_cost;
    this.total_cost=item.total_cost;
    this.total_count=item.total_count;
    this.result_per_day=item.result_per_day;
    } 

}

export class AdminReportMonthlySalesReport{
  customer?:string;
  cleaning_monthly_sales?:MonthlySales;
  lolo_monthly_sales?:MonthlySales;
  preinspaction_monthly_sales?:MonthlySales;
  repair_monthly_sales?:MonthlySales;
  residue_monthly_sales?:MonthlySales;
  steaming_monthly_sales?:MonthlySales;
  constructor(item: Partial<AdminReportMonthlySalesReport> = {}) {
    this.customer=item.customer;
    this.cleaning_monthly_sales=item.cleaning_monthly_sales;
    this.lolo_monthly_sales=item.lolo_monthly_sales;
    this.preinspaction_monthly_sales=item.preinspaction_monthly_sales;
    this.repair_monthly_sales=item.repair_monthly_sales;
    this.residue_monthly_sales=item.residue_monthly_sales;
    this.steaming_monthly_sales=item.steaming_monthly_sales;
    } 


}

export class YearlySales
{
  average_cost?:number;
  average_count?:number;
  result_per_month?:ResultPerMonth[];
  total_cost?:number;
  total_count?:number;
  constructor(item: Partial<YearlySales> = {}) {
    this.average_count=item.average_count;
    this.average_cost=item.average_cost;
    this.total_cost=item.total_cost;
    this.total_count=item.total_count;
    this.result_per_month=item.result_per_month;
    } 

}

export class AdminReportYearlySalesReport{
  customer?:string;
  cleaning_yearly_sales?:YearlySales;
  lolo_yearly_sales?:YearlySales;
  preinspection_yearly_sales?:YearlySales;
  repair_yearly_sales?:YearlySales;
  residue_yearly_sales?:YearlySales;
  steaming_yearly_sales?:YearlySales;
  constructor(item: Partial<AdminReportYearlySalesReport> = {}) {
    this.customer=item.customer;
    this.cleaning_yearly_sales=item.cleaning_yearly_sales;
    this.lolo_yearly_sales=item.lolo_yearly_sales;
    this.preinspection_yearly_sales=item.preinspection_yearly_sales;
    this.repair_yearly_sales=item.repair_yearly_sales;
    this.residue_yearly_sales=item.residue_yearly_sales;
    this.steaming_yearly_sales=item.steaming_yearly_sales;
    } 


}

export const GET_CLEANING_INVENTORY_REPORT = gql`
  query queryCleaningInventorySummary($cleaningInventoryRequest: CleaningInventoryRequestInput!,$first:Int) {
    resultList: queryCleaningInventorySummary(cleaningInventoryRequest: $cleaningInventoryRequest,first:$first) {
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
        open_balance
        in_count
        out_count
        yard
      }
    }
  }
`

export const GET_PERIODIC_TEST_DUE_SUMMARY = gql`
  query queryPeriodicTestDueSummary($periodicTestDueRequest: PeriodicTestDueRequestInput!,$first:Int) {
    resultList: queryPeriodicTestDueSummary(periodicTestDueRequest: $periodicTestDueRequest,first:$first) {
       nodes {
        class_cv
        customer_code
        customer_name
        due_days
        due_type
        eir_dt
        eir_no
        last_test_type
        next_test_dt
        next_test_type
        owner_code
        tank_no
        test_dt
      }
    }
  }
`

export const GET_TANK_SURVEY_SUMMARY = gql`
  query queryDailyTankSurveySummary($dailyTankSurveyRequest: DailyTankSurveyRequestInput!,$first:Int) {
    resultList: queryDailyTankSurveySummary(dailyTankSurveyRequest: $dailyTankSurveyRequest,first:$first) {
      nodes {
        clean_dt
        customer_code
        eir_no
        status
        surveryor
        survey_dt
        survey_type
        tank_no
        visit
      }
    }
  }
`

export const GET_ADMIN_REPORT_MONTHLY_PROCESS = gql`
  query queryMonthlyProcessReport($monthlyProcessRequest: MonthlyProcessRequestInput!) {
    resultList: queryMonthlyProcessReport(monthlyProcessRequest: $monthlyProcessRequest) {
      average
      total
      result_per_day {
        cost
        count
        date
        day
      }
    }
  }
`

export const GET_ADMIN_REPORT_YEARLY_PROCESS = gql`
  query queryYearlyProcessReport($yearlyProcessRequest: YearlyProcessRequestInput!) {
    resultList: queryYearlyProcessReport(yearlyProcessRequest: $yearlyProcessRequest) {
      average
      total
      result_per_month {
        cost
        count
        month
      }
    }
  }
`

export const GET_ADMIN_REPORT_YEARLY_SALES_REPORT = gql`
  query queryYearlySalesReport($yearlySalesRequest: YearlySalesRequestInput!) {
    resultList: queryYearlySalesReport(yearlySalesRequest: $yearlySalesRequest) {
    cleaning_yearly_sales {
        average_cost
        average_count
        total_cost
        total_count
        result_per_month {
          cost
          count
          month
        }
      }
    lolo_yearly_sales {
        average_cost
        average_count
        total_cost
        total_count
        result_per_month {
          cost
          count
          month
        }
      }
    preinspection_yearly_sales {
        average_cost
        average_count
        total_cost
        total_count
        result_per_month {
          cost
          count
          month
        }
      }
    repair_yearly_sales {
        average_cost
        average_count
        total_cost
        total_count
        result_per_month {
          cost
          count
          month
        }
      }
    residue_yearly_sales {
        average_cost
        average_count
        total_cost
        total_count
        result_per_month {
          cost
          count
          month
        }
      }
    steaming_yearly_sales {
        average_cost
        average_count
        total_cost
        total_count
        result_per_month {
          cost
          count
          month
        }
      }
    }
  }
`

export const GET_ADMIN_REPORT_MONTHLY_SALES_REPORT = gql`
  query queryMonthlySalesReport($monthlySalesRequest: MonthlySalesRequestInput!) {
    resultList: queryMonthlySalesReport(monthlySalesRequest: $monthlySalesRequest) {
    cleaning_monthly_sales {
        average_cost
        average_count
        total_cost
        total_count
        result_per_day {
          cost
          count
          date
          day
        }
      }
    lolo_monthly_sales {
        average_cost
        average_count
        total_cost
        total_count
        result_per_day {
          cost
          count
          date
          day
        }
      }
    preinspection_monthly_sales {
        average_cost
        average_count
        total_cost
        total_count
        result_per_day {
          cost
          count
          date
          day
        }
      }
    repair_monthly_sales {
        average_cost
        average_count
        total_cost
        total_count
        result_per_day {
          cost
          count
          date
          day
        }
      }
    residue_monthly_sales {
        average_cost
        average_count
        total_cost
        total_count
        result_per_day {
          cost
          count
          date
          day
        }
      }
    steaming_monthly_sales {
        average_cost
        average_count
        total_cost
        total_count
        result_per_day {
          cost
          count
          date
          day
        }
      }
    }
  }
`

export class ReportDS extends BaseDataSource<any> {

  private first: number=20000;
  constructor(private apollo: Apollo) {
    super();
  }

  searchDailyInventorySummaryReport(dailyInventoryRequest:any): Observable<daily_inventory_summary[]> {
    this.loadingSubject.next(true);
    var first=this.first;
    return this.apollo
      .query<any>({
        query: GET_DAILY_INVENTORY_SUMMARY,
        variables: { dailyInventoryRequest,first },
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

 searchPeriodicTestDueSummaryReport(periodicTestDueRequest:any): Observable<periodic_test_due_item[]> {
    this.loadingSubject.next(true);
    var first=this.first;
    return this.apollo
      .query<any>({
        query: GET_PERIODIC_TEST_DUE_SUMMARY,
        variables: { periodicTestDueRequest,first },
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


  searchCleaningInventorySummaryReport(cleaningInventoryRequest:any): Observable<cleaning_report_summary_item[]> {
    this.loadingSubject.next(true);
    var first=this.first;
    return this.apollo
      .query<any>({
        query: GET_CLEANING_INVENTORY_REPORT,
        variables: { cleaningInventoryRequest,first },
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

  searchTankSurveySummaryReport(dailyTankSurveyRequest:any): Observable<tank_survey_summary[]> {
    this.loadingSubject.next(true);
    var first=this.first;
    return this.apollo
      .query<any>({
        query: GET_TANK_SURVEY_SUMMARY,
        variables: { dailyTankSurveyRequest,first },
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


  searchAdminReportMonthlyProcess(monthlyProcessRequest:any): Observable<AdminReportMonthlyReport> {
    this.loadingSubject.next(true);
    var first=this.first;
    return this.apollo
      .query<any>({
        query: GET_ADMIN_REPORT_MONTHLY_PROCESS,
        variables: { monthlyProcessRequest },
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
          return resultList;
        })
      );
  }

  searchAdminReportYearlyProcess(yearlyProcessRequest:any): Observable<AdminReportYearlyReport> {
    this.loadingSubject.next(true);
    var first=this.first;
    return this.apollo
      .query<any>({
        query: GET_ADMIN_REPORT_YEARLY_PROCESS,
        variables: { yearlyProcessRequest },
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
          return resultList;
        })
      );
  }

  searchAdminReportMonthlySales(monthlySalesRequest:any): Observable<AdminReportYearlyReport> {
    this.loadingSubject.next(true);
    var first=this.first;
    return this.apollo
      .query<any>({
        query: GET_ADMIN_REPORT_MONTHLY_SALES_REPORT,
        variables: { monthlySalesRequest },
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
          return resultList;
        })
      );
  }

  searchAdminReportYearlySales(yearlySalesRequest:any): Observable<AdminReportYearlyReport> {
    this.loadingSubject.next(true);
    var first=this.first;
    return this.apollo
      .query<any>({
        query: GET_ADMIN_REPORT_YEARLY_SALES_REPORT,
        variables: { yearlySalesRequest },
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
          return resultList;
        })
      );
  }
}


