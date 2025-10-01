import { ApolloError } from '@apollo/client/errors';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { BaseDataSource } from './base-ds';
import { GroupedByDate, MonthlyProcessDataRevenue } from './reports-management';
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
  customer_guid?:string;
  number_tank?:number=0;
  in_yard_storing_order_tank?:StoringOrderTankItem[];
  released_storing_order_tank?:StoringOrderTankItem[];
  storing_order_tank?:StoringOrderTankItem[];

  constructor(item: Partial<report_customer_tank_activity> = {}) {
    this.guid = item.guid;
    if (!this.guid) this.guid = '';
    
    this.customer=item.customer;
    this.customer_guid=item.customer_guid;
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
  // customer_guid?:string;
  periodic_test_due?:periodic_test_due_item[];

  constructor(item: Partial<report_periodic_test_due_group_customer> = {}) {
    this.customer_code=item.customer_code;
    this.customer_name=item.customer_name;
    // this.customer_guid=item.customer_guid;
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
  preinspection_monthly_sales?:MonthlySales;
  repair_monthly_sales?:MonthlySales;
  residue_monthly_sales?:MonthlySales;
  steaming_monthly_sales?:MonthlySales;
  storage_monthly_sales?:MonthlySales;
  gate_monthly_sales?:MonthlySales;
  constructor(item: Partial<AdminReportMonthlySalesReport> = {}) {
    this.customer=item.customer;
    this.cleaning_monthly_sales=item.cleaning_monthly_sales;
    this.lolo_monthly_sales=item.lolo_monthly_sales;
    this.preinspection_monthly_sales=item.preinspection_monthly_sales;
    this.repair_monthly_sales=item.repair_monthly_sales;
    this.residue_monthly_sales=item.residue_monthly_sales;
    this.steaming_monthly_sales=item.steaming_monthly_sales;
    this.storage_monthly_sales=item.storage_monthly_sales;
    this.gate_monthly_sales=item.gate_monthly_sales;
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
  storage_yearly_sales?:YearlySales;
  gate_yearly_sales?:YearlySales;
  constructor(item: Partial<AdminReportYearlySalesReport> = {}) {
    this.customer=item.customer;
    this.cleaning_yearly_sales=item.cleaning_yearly_sales;
    this.lolo_yearly_sales=item.lolo_yearly_sales;
    this.preinspection_yearly_sales=item.preinspection_yearly_sales;
    this.repair_yearly_sales=item.repair_yearly_sales;
    this.residue_yearly_sales=item.residue_yearly_sales;
    this.steaming_yearly_sales=item.steaming_yearly_sales;
    this.gate_yearly_sales=item.gate_yearly_sales;
    this.storage_yearly_sales=item.storage_yearly_sales;
    } 


}


export class DailyTeamApproval{
  code?:string;
  estimate_no?:string;
  repair_cost?:number;
  repair_type?:string;
  tank_no?:string;
  status?:string
  
  constructor(item: Partial<DailyTeamApproval> = {}) {
    this.code=item.code;
    this.estimate_no=item.estimate_no;
    this.status=item.status;
    this.repair_cost=item.repair_cost;
    this.repair_type=item.repair_type;
    this.tank_no=item.tank_no;
    } 

}

export class DailyTeamRevenue extends DailyTeamApproval{
  
  eir_no?:string;
  estimate_date?:number;
  qc_by?:string;
  
  constructor(item: Partial<DailyTeamRevenue> = {}) {
    super(item);
    
    this.eir_no=item.eir_no;
    this.estimate_date=item.estimate_date;
    this.qc_by=item.qc_by;
    } 

}

export class DailyQCDetail extends DailyTeamRevenue{
      appv_hour?:number;
      appv_material_cost?:number;
      
  
  constructor(item: Partial<DailyQCDetail> = {}) {
    super(item);
    this.appv_hour=item.appv_hour;
    this.appv_material_cost=item.appv_material_cost;
    } 

}


export class TempItem {
  begin_temp?:number;
  close_temp?:number;
  constructor(item: Partial<TempItem> = {}) {
    this.begin_temp=item.begin_temp;
    this.begin_temp=item.begin_temp;
    } 
}

export class SteamPerformance
{
  bay?:string;
  complete_dt?:number;
  cost?:number;
  customer_code?:string;
  duration?:number;
  eir_dt?:number;
  eir_no?:string;
  last_cargo?:string;
  require_temp?:number;
  tank_no?:string;
  bottom?:TempItem; 
  themometer?:TempItem;
  top?:TempItem;
  constructor(item: Partial<SteamPerformance> = {}) {
    this.bay=item.bay;
    this.complete_dt=item.complete_dt;
    this.cost=item.cost;
    this.customer_code=item.customer_code;
    this.duration=item.duration;
    this.eir_dt=item.eir_dt;
    this.eir_no=item.eir_no;
    this.last_cargo=item.last_cargo;
    this.require_temp=item.require_temp;
    this.tank_no=item.tank_no;
    this.bottom=item.bottom; 
    this.themometer=item.themometer;
    this.top=item.top;
    } 

}

export class SurveyorEstimate
{
    appv_cost?:number;
    average?:number;
    diff_cost?:number;
    est_cost?:number;
    est_count?:number;
    rejected?:number;
    surveyor_name?:string;
    constructor(item: Partial<SurveyorEstimate> = {}) {

      this.appv_cost=item.appv_cost;
      this.average=item.average;
      this.diff_cost=item.diff_cost;
      this.est_cost=item.est_cost;
      this.est_count=item.est_count;
      this.rejected=item.rejected;
      this.surveyor_name=item.surveyor_name;
    }
}

export class MonthlySummary{
      month?:string;
      monthly_total_appv_cost?:number;
      monthly_total_average?:number;
      monthly_total_diff_cost?:number;
      monthly_total_est_cost?:number;
      monthly_total_est_count?:number;
      monthly_total_rejected?:number;
      surveyorList?:SurveyorEstimate[];
      constructor(item: Partial<MonthlySummary> = {}) {

        this.month=item.month;
        this.monthly_total_appv_cost=item.monthly_total_appv_cost;
        this.monthly_total_average=item.monthly_total_average;
        this.monthly_total_diff_cost=item.monthly_total_diff_cost;
        this.monthly_total_est_cost=item.monthly_total_est_cost;
        this.monthly_total_est_count=item.monthly_total_est_count;
        this.monthly_total_rejected=item.monthly_total_rejected;
        this.surveyorList=item.surveyorList;
      }
}

export class SurveyorPerformanceSummary{
  grand_total_appv_cost?:number;
  grand_total_average?:number;
  grand_total_diff_cost?:number;
  grand_total_est_cost?:number;
  grand_total_est_count?:number;
  grand_total_rejected?:number;
  monthly_summary?:MonthlySummary[];
  constructor(item: Partial<SurveyorPerformanceSummary> = {}) {
    this.grand_total_appv_cost=item.grand_total_appv_cost;
    this.grand_total_average=item.grand_total_average;
    this.grand_total_diff_cost=item.grand_total_diff_cost;
    this.grand_total_est_cost=item.grand_total_est_cost;
    this.grand_total_est_count=item.grand_total_est_count;
    this.grand_total_rejected=item.grand_total_rejected;
    this.monthly_summary=item.monthly_summary;
  }

}

export class SurveyorDetail
{
  appv_cost?:number;
  appv_date?:number;
  eir_date?:number;
  eir_no?:string;
  est_cost?:number;
  est_date?:number;
  est_no?:string;
  est_status?:string;
  est_type?:string;
  tank_no?:string;

  constructor(item: Partial<SurveyorDetail> = {}) {
    this.appv_cost=item.appv_cost;
    this.appv_date=item.appv_date;
    this.eir_date=item.eir_date;
    this.eir_no=item.eir_no;
    this.est_cost=item.est_cost;
    this.est_date=item.est_date;
    this.est_no=item.est_no;
    this.est_status=item.est_status;
    this.est_type=item.est_type;
    this.tank_no=item.tank_no;
    } 
  }

  export class SurveyorPerformanceDetail
  {
     surveyor?:string;
     surveyor_details?:SurveyorDetail[];
     total_appv_cost?:number;
     total_est_cost?:number;

     constructor(item: Partial<SurveyorPerformanceDetail> = {}) {

      this.surveyor=item.surveyor;
      this.surveyor_details=item.surveyor_details;
      this.total_appv_cost=item.total_appv_cost;
      this.total_est_cost=item.total_est_cost;
     }
  }

 

export interface CleanerSummary {
  cleaner_name: string;
  total_cost: number;
  jobs: CleanerPerformance[]; // optional if you want details
    //  constructor(item: Partial<CleanerSummary> = {}) {

    //   this.cleaner_name=item.cleaner_name;
    //   this.total_cost=item.total_cost;
    //   this.jobs=item.jobs;
      
    //  }

}

  export class CleanerPerformance{
    bay?:string;
    cleaner_name?:string;
    complete_dt?:number;
    cost?:number;
    customer_code?:string;
    eir_dt?:number;
    eir_no?:string;
    last_cargo?:string;
    method?:string;
    tank_no?:string;
    duration?:number;
    constructor(item: Partial<CleanerPerformance> = {}) {

      this.bay=item.bay;
      this.cleaner_name=item.cleaner_name;
      this.complete_dt=item.complete_dt;
      this.cost=item.cost;
      this.customer_code=item.customer_code;
      this.eir_dt=item.eir_dt;
      this.eir_no=item.eir_no;
      this.last_cargo=item.last_cargo;
      this.method=item.method;
      this.tank_no=item.tank_no;
      this.duration=item.duration;
    }
  }

  export class SteamPerformanceChart{
     name?:string
     count?:number
     value?:number

     constructor(item: Partial<SteamPerformanceChart> = {}) {
      this.name=item.name;
      this.count=item.count;
      this.value=item.value;
    }
  }

  export class ZeroApprovalCostItem{
    approve_dt?:number;
    complete_dt?:number;
    customer_code?:string;
    customer_name?:string;
    eir_dt?:number;
    eir_no?:string;
    est_cost?:number;
    estimate_no?:string;
    tank_no?:string;

    constructor(item: Partial<ZeroApprovalCostItem> = {}) {
     this.approve_dt=item.approve_dt;
     this.complete_dt=item.complete_dt;
     this.customer_code=item.customer_code;
     this.customer_name=item.customer_name;
     this.eir_dt=item.eir_dt;
     this.eir_no=item.eir_no;
     this.est_cost=item.est_cost;
     this.estimate_no=item.estimate_no;
     this.tank_no=item.tank_no;
   }

    // Static grouping method
    static groupByCustomer(items: ZeroApprovalCostItem[]): Record<string, ZeroApprovalCostItem[]> {
      return items.reduce((acc, item) => {
          const key = item.customer_code || item.customer_name || 'unknown';
          (acc[key] = acc[key] || []).push(item);
          return acc;
      }, {} as Record<string, ZeroApprovalCostItem[]>);
  }
 }

 export class CustomerMonthlySales{
  total_clean_cost?:number;
  total_clean_count?:number;
  total_in_service_cost?:number;
  total_in_service_count?:number;
  total_offhire_cost?:number;
  total_offhire_count?:number;
  total_residue_cost?:number;
  total_residue_count?:number;
  total_steam_cost?:number;
  total_steam_count?:number;
  total_tank_in?:number;
  customer_sales?:CustomerSales[]; 
  constructor(item: Partial<CustomerMonthlySales> = {}) {

    this.total_clean_cost=this.total_clean_cost;
    this.total_clean_count=this.total_clean_cost;
    this.total_in_service_cost=this.total_in_service_cost;
    this.total_in_service_count=this.total_in_service_count;
    this.total_offhire_cost=this.total_offhire_cost;
    this.total_offhire_count=this.total_offhire_count;
    this.total_residue_cost=this.total_residue_cost;
    this.total_residue_count=this.total_residue_count;
    this.total_steam_cost=this.total_steam_cost;
    this.total_steam_count=this.total_steam_count;
    this.total_tank_in=this.total_tank_in;
    this.customer_sales=this.customer_sales;
  }
 }

 export class CustomerSales{
  clean_cost?:number;
  clean_count?:number;
  code?:string;
  in_service_cost?:number;
  in_service_count?:number;
  name?:string;
  offhire_cost?:number;
  offhire_count?:number;
  residue_cost?:number;
  residue_count?:number;
  steam_cost?:number;
  steam_count?:number;
  tank_in_count?:number;
  constructor(item: Partial<CustomerSales> = {}) {
    this.clean_cost=this.clean_cost;
    this.clean_count=this.clean_count;
    this.code=this.code;
    this.in_service_cost=this.in_service_cost;
    this.in_service_count=this.in_service_count;
    this.name=this.name;
    this.offhire_cost=this.offhire_cost
    this.offhire_count=this.offhire_count;
    this.residue_cost=this.residue_cost
    this.residue_count=this.residue_count
    this.steam_cost=this.steam_cost
    this.steam_count=this.steam_count
    this.tank_in_count=this.tank_in_count;
  }

 }

 export class InventoryPerMonth{
  percentage?:number;
  count?:number;
  key?:string;
  name?:string;

  
  constructor(item: Partial<InventoryPerMonth> = {}) {
    this.percentage=item.percentage;
    this.count=item.count;
    this.key=item.key;
    this.name=item.name;
    
    } 

}

 export class InventoryYearly{
  average_count?:number;
  total_count?:number;
  inventory_per_month?:InventoryPerMonth[];

constructor(item: Partial<InventoryYearly> = {}) {
  this.average_count=item.average_count;
  this.total_count=item.total_count;
  this.inventory_per_month=item.inventory_per_month;
  } 
}

 export class ManagementReportYearlyInventory
 {
  cleaning_yearly_inventory?:InventoryYearly;
  depot_yearly_inventory?:InventoryYearly;
  gate_in_inventory?:InventoryYearly;
  gate_out_inventory?:InventoryYearly;
  repair_yearly_inventory?:InventoryYearly;
  steaming_yearly_inventory?:InventoryYearly;
  residue_yearly_inventory?:InventoryYearly;
  constructor(item: Partial<ManagementReportYearlyInventory> = {}) {
    this.cleaning_yearly_inventory=item.cleaning_yearly_inventory;
    this.depot_yearly_inventory=item.depot_yearly_inventory;
    this.gate_in_inventory=item.gate_in_inventory;
    this.gate_out_inventory=item.gate_out_inventory;
    this.repair_yearly_inventory=item.repair_yearly_inventory;
    this.steaming_yearly_inventory=item.steaming_yearly_inventory;
    this.residue_yearly_inventory=item.steaming_yearly_inventory;
    } 
 }

 export class MonthlyReportItem{
    approved_cost?:number;
    completed_cost?:number;
    date?:number;
    day?:number;
    constructor(item: Partial<MonthlyReportItem> = {}) {
      this.approved_cost=item.approved_cost;
      this.completed_cost=item.completed_cost;
      this.date=item.date;
      this.day=item.day;
      } 
 }

 export class RepairMonthlyReportItem{
  approved_hour?:number;
  completed_hour?:number;
  date?:number;
  day?:number;
  constructor(item: Partial<RepairMonthlyReportItem> = {}) {
    this.approved_hour=item.approved_hour;
    this.completed_hour=item.completed_hour;
    this.date=item.date;
    this.day=item.day;
    } 
}


 export class GateIOMonthlyReportItem{
  gate_in_cost?:number;
  gate_out_cost?:number;
  date?:number;
  day?:number;
  constructor(item: Partial<GateIOMonthlyReportItem> = {}) {
    this.gate_in_cost=item.gate_in_cost;
    this.gate_out_cost=item.gate_out_cost;
    this.date=item.date;
    this.day=item.day;
    } 
}



export class LOLOMonthlyReportItem{
  lift_off_cost?:number;
  lift_on_cost?:number;
  date?:number;
  day?:number;
  constructor(item: Partial<LOLOMonthlyReportItem> = {}) {
    this.lift_off_cost=item.lift_off_cost;
    this.lift_on_cost=item.lift_on_cost;
    this.date=item.date;
    this.day=item.day;
    } 
}
export class GateIOInventoryItem{
  gate_inventory?:GateIOMonthlyReportItem;
  lolo_inventory?:LOLOMonthlyReportItem;
  constructor(item: Partial<GateIOInventoryItem> = {}) {
    this.gate_inventory=item.gate_inventory;
    this.lolo_inventory=item.lolo_inventory;
    
    } 
}

export class ManagementReportMonthlyInventory{
  cleaning_inventory?:MonthlyReportItem[];
  repair_inventory?:RepairMonthlyReportItem[];
  steaming_inventory?:MonthlyReportItem[];
  gate_in_out_inventory?:GateIOInventoryItem[];
  
  constructor(item: Partial<ManagementReportMonthlyInventory> = {}) {
    this.cleaning_inventory=item.cleaning_inventory;
    this.repair_inventory=item.repair_inventory;
    this.steaming_inventory=item.steaming_inventory;
    this.gate_in_out_inventory=item.gate_in_out_inventory;
    } 
}


// First, define a proper interface for the monthly data
export class MonthlyProcessData {
  key?: string;
  cleaning?: { count?: number; percentage?: number,key?:string,name?:string };
  depot?: { count?: number; percentage?: number,key?:string,name?:string };
  gateIn?: { count?: number; percentage?: number,key?:string,name?:string };
  gateOut?: { count?: number; percentage?: number,key?:string,name?:string };
  repair?: { count?: number; percentage?: number,key?:string,name?:string };
  steaming?: { count?: number; percentage?: number,key?:string,name?:string };
  residue?: { count?: number; percentage?: number,key?:string,name?:string };
  constructor(item: Partial<MonthlyProcessData> = {}) {
    this.key=item.key;
    this.cleaning=item.cleaning;
    this.depot=item.depot;
    this.gateIn=item.gateIn;
    this.gateOut=item.gateOut;
    this.repair=item.repair;
    this.steaming=item.steaming;
    this.residue=item.residue;
    } 
}

export class InventoryAnalyzer {
 static getMonthIndex(monthName: string): number {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months.indexOf(monthName);
  }

  static groupByMonthAndFindExtremes_Sales(data: AdminReportYearlySalesReport) {
    // Initialize a map to group by month with proper typing
    const monthlyData: Record<string, MonthlyProcessDataRevenue> = {};

    // Process each inventory type
    const processData = [
      { name: 'cleaning', data: data.cleaning_yearly_sales?.result_per_month },
       { name: 'in_out', data: data.gate_yearly_sales?.result_per_month },
      // { name: 'depot', data: data.?.result_per_month },
      { name: 'lolo', data: data.lolo_yearly_sales?.result_per_month },
      { name: 'preinspection', data: data.preinspection_yearly_sales?.result_per_month },
      { name: 'repair', data: data.repair_yearly_sales?.result_per_month },
      { name: 'steaming', data: data.steaming_yearly_sales?.result_per_month },
       { name: 'residue', data: data.residue_yearly_sales?.result_per_month },
    ];

    // Populate monthlyData with type-safe assignments
    processData.forEach(process => {
    
        process.data?.forEach(monthData => {
          if (!monthData.month) return;
          
          if (!monthlyData[monthData.month]) {
            monthlyData[monthData.month] = { key: monthData.month };
          }
          
          // Use count if available, otherwise percentage
          const value = monthData.count ?? monthData.cost;
          
          // Type-safe assignment using a type assertion
          const monthlyEntry = monthlyData[monthData.month];
          switch (process.name) {
            case 'cleaning':
              monthlyEntry.cleaning= {
                count: monthData.count,
                cost: monthData.cost,
                //percentage: monthData.cost,
                key:monthData.month,
                name:monthData.month
              };
              break;
            case 'preinspection':
              monthlyEntry.preinspection= {
                count: monthData.count,
                cost: monthData.cost,
                //percentage: monthData.cost,
                key:monthData.month,
                name:monthData.month
              };
              break;
            case 'in_out':
              monthlyEntry.in_out= {
                count: monthData.count,
               cost: monthData.cost,
                key:monthData.month,
                name:monthData.month
              };
              break;
            case "lolo":
               monthlyEntry.lolo = {
                 count: monthData.count,
                cost: monthData.cost,
                //percentage: monthData.cost,
                key:monthData.month,
                name:monthData.month
              };
              break;
            // case 'gateIn':
            //   monthlyEntry.gateIn = {
            //     count: monthData.count,
            //     percentage: monthData.percentage,
            //     key:monthData.key,
            //     name:monthData.name
            //   };
            //   break;
            // case 'gateOut':
            //   monthlyEntry.gateOut = {
            //     count: monthData.count,
            //     percentage: monthData.percentage,
            //     key:monthData.key,
            //     name:monthData.name
            //   };
            //   break;
            case 'repair':
              monthlyEntry.repair = {
                count: monthData.count,
                cost: monthData.cost,
                //percentage: monthData.cost,
                key:monthData.month,
                name:monthData.month
              };
              break;
            case 'steaming':
              monthlyEntry.steaming = {
                count: monthData.count,
                cost: monthData.cost,
                //percentage: monthData.cost,
                key:monthData.month,
                name:monthData.month
              };
              break;
            case 'residue':
              monthlyEntry.residue = {
                count: monthData.count,
                cost: monthData.cost,
                //percentage: monthData.cost,
                key:monthData.month,
                name:monthData.month
              };
              break;
          }
        });
    });

    // Rest of your code remains the same...
    // Convert to array and sort by month if needed
    const monthlyArray = Object.values(monthlyData).sort((a, b) => {
      const monthIndexA = this.getMonthIndex(a.key!);
      const monthIndexB = this.getMonthIndex(b.key!);
      return monthIndexA - monthIndexB;
    });

    // Find highest and lowest for each process
    const processExtremes: Record<string, {
      highest: { key: string; value: number | undefined };
      lowest: { key: string; value: number | undefined };
    }> = {};

    processData.forEach(process => {
      const processName = process.name;
      const values = monthlyArray
        .map(item => {
          let process:any = item[processName as keyof MonthlyProcessDataRevenue];
          return{
            key: item.key!,
            value: process?.count,
            percentage: process?.percentage,
            name: process?.name
          }
          // key: item.key!,
          // value: item[processName as keyof MonthlyProcessData]? //as number | undefined
        })
        .filter(item => item.value !== undefined && item.value > 0);

      // const values = monthlyArray
      // .map(item => ({
      //   key: item.key,
      //   value: item[processName as keyof MonthlyProcessData] as number | undefined
      // }))
      // .filter(item => item.value !== undefined && (item.value as number) > 0)as { month: string; value: number }[];

      if (values.length > 0) {
        const sorted = [...values].sort((a, b) => a.value! - b.value!);
        
        processExtremes[processName] = {
          highest: sorted[sorted.length - 1],
          lowest: sorted[0] // This will now be the smallest value > 0
        };
      } else {
        // Handle case where no values > 0 exist
        processExtremes[processName] = {
          highest: { key: '', value: undefined },
          lowest: { key: '', value: undefined }
        };
      }
    });

    return {
      monthlyData: monthlyArray,
      processExtremes
    };
  }

  static groupByMonthAndFindExtremes(data: ManagementReportYearlyInventory) {
    // Initialize a map to group by month with proper typing
    const monthlyData: Record<string, MonthlyProcessData> = {};

    // Process each inventory type
    const processData = [
      { name: 'cleaning', data: data.cleaning_yearly_inventory?.inventory_per_month },
      { name: 'depot', data: data.depot_yearly_inventory?.inventory_per_month },
      { name: 'gateIn', data: data.gate_in_inventory?.inventory_per_month },
      { name: 'gateOut', data: data.gate_out_inventory?.inventory_per_month },
      { name: 'repair', data: data.repair_yearly_inventory?.inventory_per_month },
      { name: 'steaming', data: data.steaming_yearly_inventory?.inventory_per_month },
       { name: 'residue', data: data.residue_yearly_inventory?.inventory_per_month },
    ];

    // Populate monthlyData with type-safe assignments
    processData.forEach(process => {
    
        process.data?.forEach(monthData => {
          if (!monthData.key) return;
          
          if (!monthlyData[monthData.key]) {
            monthlyData[monthData.key] = { key: monthData.key };
          }
          
          // Use count if available, otherwise percentage
          const value = monthData.count ?? monthData.percentage;
          
          // Type-safe assignment using a type assertion
          const monthlyEntry = monthlyData[monthData.key];
          switch (process.name) {
            case 'cleaning':
              monthlyEntry.cleaning= {
                count: monthData.count,
                percentage: monthData.percentage,
                key:monthData.key,
                name:monthData.name
              };
              break;
            case 'depot':
              monthlyEntry.depot= {
                count: monthData.count,
                percentage: monthData.percentage,
                key:monthData.key,
                name:monthData.name
              };
              break;
            case 'gateIn':
              monthlyEntry.gateIn = {
                count: monthData.count,
                percentage: monthData.percentage,
                key:monthData.key,
                name:monthData.name
              };
              break;
            case 'gateOut':
              monthlyEntry.gateOut = {
                count: monthData.count,
                percentage: monthData.percentage,
                key:monthData.key,
                name:monthData.name
              };
              break;
            case 'repair':
              monthlyEntry.repair = {
                count: monthData.count,
                percentage: monthData.percentage,
                key:monthData.key,
                name:monthData.name
              };
              break;
            case 'steaming':
              monthlyEntry.steaming = {
                count: monthData.count,
                percentage: monthData.percentage,
                key:monthData.key,
                name:monthData.name
              };
              break;
            case 'residue':
              monthlyEntry.residue = {
                count: monthData.count,
                percentage: monthData.percentage,
                key:monthData.key,
                name:monthData.name
              };
              break;
          }
        });
    });

    // Rest of your code remains the same...
    // Convert to array and sort by month if needed
    const monthlyArray = Object.values(monthlyData).sort((a, b) => {
      const monthIndexA = this.getMonthIndex(a.key!);
      const monthIndexB = this.getMonthIndex(b.key!);
      return monthIndexA - monthIndexB;
    });

    // Find highest and lowest for each process
    const processExtremes: Record<string, {
      highest: { key: string; value: number | undefined };
      lowest: { key: string; value: number | undefined };
    }> = {};

    processData.forEach(process => {
      const processName = process.name;
      const values = monthlyArray
        .map(item => {
          let process:any = item[processName as keyof MonthlyProcessData];
          return{
            key: item.key!,
            value: process?.count,
            percentage: process?.percentage,
            name: process?.name
          }
          // key: item.key!,
          // value: item[processName as keyof MonthlyProcessData]? //as number | undefined
        })
        .filter(item => item.value !== undefined && item.value > 0);

      // const values = monthlyArray
      // .map(item => ({
      //   key: item.key,
      //   value: item[processName as keyof MonthlyProcessData] as number | undefined
      // }))
      // .filter(item => item.value !== undefined && (item.value as number) > 0)as { month: string; value: number }[];

      if (values.length > 0) {
        const sorted = [...values].sort((a, b) => a.value! - b.value!);
        
        processExtremes[processName] = {
          highest: sorted[sorted.length - 1],
          lowest: sorted[0] // This will now be the smallest value > 0
        };
      } else {
        // Handle case where no values > 0 exist
        processExtremes[processName] = {
          highest: { key: '', value: undefined },
          lowest: { key: '', value: undefined }
        };
      }
    });

    return {
      monthlyData: monthlyArray,
      processExtremes
    };
  }


  static groupSalesMonthlyByDate(data: AdminReportMonthlySalesReport): GroupedByDate {
      const grouped: GroupedByDate = {};
    
      // Group cleaning inventory
      data.cleaning_monthly_sales?.result_per_day?.forEach(item => {
        if (!grouped[item.date!]) {
          grouped[item.date!] = { day: item.day! };
        }
  
        grouped[item.date!].cleaning = item;
      });
    
      data.gate_monthly_sales?.result_per_day?.forEach(item => {
        if (item.date && item.day) {
          if (!grouped[item.date]) {
            grouped[item.date] = {
              day: item.day,
            };
          }
          grouped[item.date].gate = item;
        }
      });
    
      data.preinspection_monthly_sales?.result_per_day?.forEach(item => {
        if (item.date && item.day) {
          if (!grouped[item.date]) {
            grouped[item.date] = {
              day: item.day,
            };
          }
          grouped[item.date].preinspection = item;
        }
      });
  
      data.residue_monthly_sales?.result_per_day?.forEach(item => {
        if (item.date && item.day) {
          if (!grouped[item.date]) {
            grouped[item.date] = {
              day: item.day,
            };
          }
          grouped[item.date].residue = item;
        }
      });
  
      data.lolo_monthly_sales?.result_per_day?.forEach(item => {
        if (item.date && item.day) {
          if (!grouped[item.date]) {
            grouped[item.date] = {
              day: item.day,
            };
          }
          grouped[item.date].lolo = item;
        }
      });
  
      // data.storage_monthly_revenue?.result_per_day?.forEach(item => {
      //   if (item.date && item.day) {
      //     if (!grouped[item.date]) {
      //       grouped[item.date] = {
      //         day: item.day,
      //       };
      //     }
      //     grouped[item.date].storage = item;
      //   }
      // });
    
    
      // Group repair inventory
      data.repair_monthly_sales?.result_per_day?.forEach(item => {
        if (!grouped[item.date!]) {
          grouped[item.date!] = { day: item.day! };
        }
        grouped[item.date!].repair = item;
      });
    
      // Group steaming inventory
      data.steaming_monthly_sales?.result_per_day?.forEach(item => {
        if (!grouped[item.date!]) {
          grouped[item.date!] = { day: item.day! };
        }
        grouped[item.date!].steaming = item;
      });
    
      return grouped;
    }

  static convertToCleanerSummary(data: CleanerPerformance[]): CleanerSummary[] {
      const grouped: { [key: string]: CleanerSummary } = {};

      data.forEach(item => {
        const cleaner = item.cleaner_name;
        const cost = item.cost ?? 0; // default to 0 if undefined

        if (!cleaner) return; // skip items without cleaner name

        if (!grouped[cleaner]) {
          grouped[cleaner] = {
            cleaner_name: cleaner,
            total_cost: 0,
            jobs: []
          };
        }

        grouped[cleaner]!.total_cost += cost;
        grouped[cleaner]!.jobs.push(item);
      });

      return Object.values(grouped);
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
  query queryDailyTankSurveySummary($dailyTankSurveyRequest: DailyTankSurveyRequestInput!, $order: [DailyTankSurveySummarySortInput!], $first:Int) {
    resultList: queryDailyTankSurveySummary(dailyTankSurveyRequest: $dailyTankSurveyRequest, order:$order, first:$first) {
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
    storage_yearly_sales {
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
    gate_yearly_sales {
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
    gate_monthly_sales {
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
    storage_monthly_sales {
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

export const GET_ADMIN_REPORT_DAILY_TEAM_REVENUE_REPORT = gql`
  query queryDailyTeamRevenue($dailyTeamRevenueRequest: DailyTeamRevenuRequestInput!,$first:Int) {
    resultList: queryDailyTeamRevenue(dailyTeamRevenueRequest: $dailyTeamRevenueRequest,first:$first) {
      nodes {
        code
        eir_no
        estimate_date
        estimate_no
        qc_by
        repair_cost
        repair_type
        tank_no
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
`

export const GET_ADMIN_REPORT_DAILY_TEAM_APPROVAL_REPORT = gql`
  query queryDailyTeamApproval($dailyTeamApprovalRequest: DailyTeamApprovalRequestInput!,$first:Int) {
    resultList: queryDailyTeamApproval(dailyTeamApprovalRequest: $dailyTeamApprovalRequest,first:$first) {
      nodes {
        code
        estimate_no
        repair_cost
        repair_type
        status
        tank_no
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
`

export const GET_ADMIN_REPORT_DAILY_QC_DETAIL_REPORT = gql`
  query queryDailyQCDetail($dailyQCDetailRequest: DailyQCDetailRequestInput!,$first:Int) {
    resultList: queryDailyQCDetail(dailyQCDetailRequest: $dailyQCDetailRequest,first:$first) {
      nodes {
        appv_hour
        appv_material_cost
        code
        estimate_date
        estimate_no
        qc_by
        repair_cost
        repair_type
        tank_no
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
`
export const GET_ADMIN_REPORT_SURVEYOR_PERFORMANCE_DETAIL_REPORT = gql`
  query querySurveyorPerformanceDetail($surveyorPerfDetailRequest: SurveyorPerformanceDetailRequestInput!,$first:Int) {
    resultList: querySurveyorPerformanceDetail(surveyorPerfDetailRequest: $surveyorPerfDetailRequest,first:$first) {
      nodes {
        surveyor
        total_appv_cost
        total_est_cost
        surveyor_details {
            appv_cost
            appv_date
            eir_date
            eir_no
            est_cost
            est_date
            est_no
            est_status
            est_type
            tank_no
          }
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
`
export const GET_ADMIN_REPORT_SURVEYOR_PERFORMANCE_SUMMARY_REPORT = gql`
  query querySurveyorPerformanceSummary($surveyorPerfSummaryRequest: SurveyorPerformanceSummaryRequestInput!) {
     querySurveyorPerformanceSummary(surveyorPerfSummaryRequest: $surveyorPerfSummaryRequest) {
      grand_total_appv_cost
      grand_total_average
      grand_total_diff_cost
      grand_total_est_cost
      grand_total_est_count
      grand_total_rejected
      monthly_summary {
        month
        monthly_total_appv_cost
        monthly_total_average
        monthly_total_diff_cost
        monthly_total_est_cost
        monthly_total_est_count
        monthly_total_rejected
        surveyorList {
          appv_cost
          average
          diff_cost
          est_cost
          est_count
          rejected
          surveyor_name
        }
      }
    }
  }
`

export const GET_ADMIN_REPORT_CLEANER_PERFORMANCE_REPORT = gql`
  query queryCleanerPerformance($cleanerPerformanceRequest: CleanerPerformanceRequestInput!,$first:Int) {
    resultList: queryCleanerPerformance(cleanerPerformanceRequest: $cleanerPerformanceRequest,first:$first) {
      nodes {
        bay
        cleaner_name
        complete_dt
        cost
        customer_code
        duration
        eir_dt
        eir_no
        last_cargo
        method
        tank_no
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
`

export const GET_ADMIN_REPORT_STEAM_PERFORMANCE_REPORT = gql`
  query querySteamPerformance($steamPerformanceRequest: SteamPerformanceRequestInput!,$first:Int) {
    resultList: querySteamPerformance(steamPerformanceRequest: $steamPerformanceRequest,first:$first) {
      nodes {
        bay
        complete_dt
        cost
        customer_code
        duration
        eir_dt
        eir_no
        last_cargo
        require_temp
        tank_no
        bottom {
          begin_temp
          close_temp
        }
        themometer {
          begin_temp
          close_temp
        }
        top {
          begin_temp
          close_temp
        }
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
`

export const GET_ADMIN_REPORT_ZERO_APPROVAL_COST_REPORT = gql`
  query queryZeroApprovalCost($zeroApprovalRequest: ZeroApprovalRequestInput!,$first:Int) {
    resultList: queryZeroApprovalCost(zeroApprovalRequest: $zeroApprovalRequest,first:$first) {
      nodes {
        approve_dt
        complete_dt
        customer_code
        customer_name
        eir_dt
        eir_no
        est_cost
        estimate_no
        tank_no
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
`

export const GET_ADMIN_REPORT_CUSTOMER_MONTHLY_SALES_REPORT = gql`
  query queryCustomerMonthlySalesReport($customerMonthlySalesRequest: CustomerMonthlySalesRequestInput!) {
    resultList: queryCustomerMonthlySalesReport(customerMonthlySalesRequest: $customerMonthlySalesRequest) {
        total_clean_cost
        total_clean_count
        total_in_service_cost
        total_in_service_count
        total_offhire_cost
        total_offhire_count
        total_residue_cost
        total_residue_count
        total_steam_cost
        total_steam_count
        total_tank_in
        customer_sales {
          clean_cost
          clean_count
          code
          in_service_cost
          in_service_count
          name
          offhire_cost
          offhire_count
          residue_cost
          residue_count
          steam_cost
          steam_count
          tank_in_count
        }
    }
  }
`

export const GET_MANAGEMENT_REPORT_MONTHLY_INVENTORY_REPORT = gql`
  query queryMonthlyInventory($monthlyInventoryRequest: MonthlyInventoryRequestInput!) {
    resultList: queryMonthlyInventory(monthlyInventoryRequest: $monthlyInventoryRequest) {
      cleaning_inventory {
        approved_cost
        completed_cost
        date
        day
      }
      gate_in_out_inventory {
        gate_inventory {
          date
          day
          gate_in_cost
          gate_out_cost
        }
        lolo_inventory {
          date
          day
          lift_off_cost
          lift_on_cost
        }
      }
      repair_inventory {
        approved_hour
        completed_hour
        date
        day
      }
      steaming_inventory {
        approved_cost
        completed_cost
        date
        day
      }
    }
  }
`

export const GET_MANAGEMENT_REPORT_YEARLY_INVENTORY_REPORT = gql`
  query queryYearlyInventory($yearlyInventoryRequest: YearlyInventoryRequestInput!) {
    resultList: queryYearlyInventory(yearlyInventoryRequest: $yearlyInventoryRequest) {
        cleaning_yearly_inventory {
        average_count
        total_count
        inventory_per_month {
          count
          key
          name
          percentage
        }
      }
      depot_yearly_inventory {
        average_count
        total_count
        inventory_per_month {
          count
          key
          name
          percentage
        }
      }
      gate_in_inventory {
        average_count
        total_count
        inventory_per_month {
          count
          key
          name
          percentage
        }
      }
      gate_out_inventory {
        average_count
        total_count
        inventory_per_month {
          count
          key
          name
          percentage
        }
      }
      repair_yearly_inventory {
        average_count
        total_count
        inventory_per_month {
          count
          key
          name
          percentage
        }
      }
      steaming_yearly_inventory {
        average_count
        total_count
        inventory_per_month {
          count
          key
          name
          percentage
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

  searchTankSurveySummaryReport(dailyTankSurveyRequest:any , order?: any): Observable<tank_survey_summary[]> {
    this.loadingSubject.next(true);
    var first=this.first;
    return this.apollo
      .query<any>({
        query: GET_TANK_SURVEY_SUMMARY,
        variables: { dailyTankSurveyRequest, first, order },
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

  searchAdminReportMonthlySales(monthlySalesRequest:any): Observable<AdminReportMonthlySalesReport> {
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

  searchAdminReportDailyTeamApproval(dailyTeamApprovalRequest:any): Observable<DailyTeamApproval[]> {
    this.loadingSubject.next(true);
    var first=this.first;
    return this.apollo
      .query<any>({
        query: GET_ADMIN_REPORT_DAILY_TEAM_APPROVAL_REPORT,
        variables: { dailyTeamApprovalRequest,first },
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


  searchAdminReportDailyTeamRevenue(dailyTeamRevenueRequest:any): Observable<DailyTeamRevenue[]> {
    this.loadingSubject.next(true);
    var first=this.first;
    return this.apollo
      .query<any>({
        query: GET_ADMIN_REPORT_DAILY_TEAM_REVENUE_REPORT,
        variables: { dailyTeamRevenueRequest,first },
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

  searchAdminReportDailyQCDetail(dailyQCDetailRequest:any): Observable<DailyQCDetail[]> {
    this.loadingSubject.next(true);
    var first=this.first;
    return this.apollo
      .query<any>({
        query: GET_ADMIN_REPORT_DAILY_QC_DETAIL_REPORT,
        variables: { dailyQCDetailRequest,first },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as DailyQCDetail[]); // Return an empty array on error
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

  searchAdminReportSteamPerformance(steamPerformanceRequest:any): Observable<SteamPerformance[]> {
    this.loadingSubject.next(true);
    var first=this.first;
    return this.apollo
      .query<any>({
        query: GET_ADMIN_REPORT_STEAM_PERFORMANCE_REPORT,
        variables: { steamPerformanceRequest,first },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as SteamPerformance[]); // Return an empty array on error
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

  searchAdminReportSurveyorPerformanceDetail(surveyorPerfDetailRequest:any): Observable<SurveyorPerformanceDetail[]> {
    this.loadingSubject.next(true);
    var first=this.first;
    return this.apollo
      .query<any>({
        query: GET_ADMIN_REPORT_SURVEYOR_PERFORMANCE_DETAIL_REPORT,
        variables: { surveyorPerfDetailRequest,first },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as SurveyorPerformanceDetail[]); // Return an empty array on error
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

  searchAdminReportSurveyorPerformanceSummary(surveyorPerfSummaryRequest:any): Observable<SurveyorPerformanceSummary> {
    this.loadingSubject.next(true);
    var first=this.first;
    return this.apollo
      .query<any>({
        query: GET_ADMIN_REPORT_SURVEYOR_PERFORMANCE_SUMMARY_REPORT,
        variables: { surveyorPerfSummaryRequest },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as SurveyorPerformanceDetail[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const resultList = result ;
          this.dataSubject.next(resultList);
          // this.totalCount = resultList.totalCount;
          // this.pageInfo = resultList.pageInfo;
          return resultList.querySurveyorPerformanceSummary;
        })
      );
  }

  searchAdminReportCleanerPerformance(cleanerPerformanceRequest:any): Observable<CleanerPerformance[]> {
    this.loadingSubject.next(true);
    var first=this.first;
    return this.apollo
      .query<any>({
        query: GET_ADMIN_REPORT_CLEANER_PERFORMANCE_REPORT,
        variables: { cleanerPerformanceRequest,first },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as CleanerPerformance[]); // Return an empty array on error
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

  searchAdminReportZeroApprovalCostReport(zeroApprovalRequest:any): Observable<CleanerPerformance[]> {
    this.loadingSubject.next(true);
    var first=this.first;
    return this.apollo
      .query<any>({
        query: GET_ADMIN_REPORT_ZERO_APPROVAL_COST_REPORT,
        variables: { zeroApprovalRequest,first },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as CleanerPerformance[]); // Return an empty array on error
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

  
  searchAdminReportCustomerMonthlySalesReport(customerMonthlySalesRequest:any): Observable<CustomerMonthlySales> {
    this.loadingSubject.next(true);
    var first=this.first;
    return this.apollo
      .query<any>({
        query: GET_ADMIN_REPORT_CUSTOMER_MONTHLY_SALES_REPORT,
        variables: { customerMonthlySalesRequest },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as CleanerPerformance[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const resultList = result.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList);
          return resultList;
        })
      );
  }

  searchManagementReportInventoryYearlyReport(yearlyInventoryRequest:any): Observable<ManagementReportYearlyInventory> {
    this.loadingSubject.next(true);
    var first=this.first;
    return this.apollo
      .query<any>({
        query: GET_MANAGEMENT_REPORT_YEARLY_INVENTORY_REPORT,
        variables: { yearlyInventoryRequest },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as CleanerPerformance[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const resultList = result.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList);
          return resultList;
        })
      );
  }

  searchManagementReportInventoryMonthlyReport(monthlyInventoryRequest:any): Observable<ManagementReportMonthlyInventory> {
    this.loadingSubject.next(true);
    var first=this.first;
    return this.apollo
      .query<any>({
        query: GET_MANAGEMENT_REPORT_MONTHLY_INVENTORY_REPORT,
        variables: { monthlyInventoryRequest },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as CleanerPerformance[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const resultList = result.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList);
          return resultList;
        })
      );
  }

}


