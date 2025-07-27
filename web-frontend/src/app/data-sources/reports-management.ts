import { ApolloError } from '@apollo/client/errors';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { BaseDataSource } from './base-ds';



export class yearlySales{
  average_cost?:number;
  average_count?:number;
  total_cost?:number;
  total_count?:number;
  result_per_month?:InventoryPerMonth[];
   
  constructor(item: Partial<yearlySales> = {}) {
    this.average_cost=item.average_cost;
    this.average_count=item.average_count;
    this.total_cost=item.total_cost;
    this.total_count=item.total_count;
    this.result_per_month=item.result_per_month;
    } 
}

export class yearlyRevenue{
  average_cost?:number;
  average_count?:number;
  total_cost?:number;
  total_count?:number;
  revenue_per_month?:RevenuePerMonth[];
   
  constructor(item: Partial<yearlyRevenue> = {}) {
    this.average_cost=item.average_cost;
    this.average_count=item.average_count;
    this.total_cost=item.total_cost;
    this.total_count=item.total_count;
    this.revenue_per_month=item.revenue_per_month;
    } 
}

export class ManagementReportYearlyRevenueItem{
  lolo_yearly_revenue?:yearlyRevenue;
  cleaning_yearly_revenue?:yearlyRevenue;
  gate_yearly_revenue?:yearlyRevenue;
  preinspection_yearly_revenue?:yearlyRevenue;
  repair_yearly_revenue?:yearlyRevenue;
  residue_yearly_revenue?:yearlyRevenue;
  steam_yearly_revenue?:yearlyRevenue;
  storage_yearly_revenue?:yearlyRevenue;
  constructor(item: Partial<ManagementReportYearlyRevenueItem> = {}) {
      this.lolo_yearly_revenue=item.lolo_yearly_revenue;
      this.cleaning_yearly_revenue=item.cleaning_yearly_revenue;
      this.gate_yearly_revenue=item.gate_yearly_revenue;
      this.preinspection_yearly_revenue=item.preinspection_yearly_revenue;
      this.repair_yearly_revenue=item.repair_yearly_revenue;
      this.residue_yearly_revenue=item.residue_yearly_revenue;
      this.steam_yearly_revenue=item.steam_yearly_revenue;
      this.storage_yearly_revenue=item.storage_yearly_revenue;
    } 
}

export class RevenuePerMonth{
  cost?:number;
  count?:number;
  key?:string;
  name?:string;

  
  constructor(item: Partial<RevenuePerMonth> = {}) {
    this.cost=item.cost;
    this.count=item.count;
    this.key=item.key;
    this.name=item.name;
    
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
    this.residue_yearly_inventory=item.residue_yearly_inventory;
    } 
 }

 export class MonthlyReportItem{
    approved_count?:number;
    completed_count?:number;
    date?:string;
    day?:string;
    constructor(item: Partial<MonthlyReportItem> = {}) {
      this.approved_count=item.approved_count;
      this.completed_count=item.completed_count;
      this.date=item.date;
      this.day=item.day;
      } 
 }

 export class RepairMonthlyReportItem{
  approved_hour?:number;
  completed_hour?:number;
  date?:string;
  day?:string;
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
  date?:string;
  day?:string;
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
  date?:string;
  day?:string;
  constructor(item: Partial<LOLOMonthlyReportItem> = {}) {
    this.lift_off_cost=item.lift_off_cost;
    this.lift_on_cost=item.lift_on_cost;
    this.date=item.date;
    this.day=item.day;
    } 
}

export class GateIOInventoryItem{
  gate_inventory?:GateIOMonthlyReportItem[];
  lolo_inventory?:LOLOMonthlyReportItem[];
  constructor(item: Partial<GateIOInventoryItem> = {}) {
    this.gate_inventory=item.gate_inventory;
    this.lolo_inventory=item.lolo_inventory;
    
    } 
}

export class ManagementReportMonthlyInventory{
  cleaning_inventory?:MonthlyReportItem[];
  repair_inventory?:RepairMonthlyReportItem[];
  steaming_inventory?:MonthlyReportItem[];
  residue_inventory?:MonthlyReportItem[];
  gate_in_out_inventory?:GateIOInventoryItem;
  
  constructor(item: Partial<ManagementReportMonthlyInventory> = {}) {
    this.cleaning_inventory=item.cleaning_inventory;
    this.repair_inventory=item.repair_inventory;
    this.steaming_inventory=item.steaming_inventory;
    this.gate_in_out_inventory=item.gate_in_out_inventory;
    } 
}



export class MonthlyProcessDataRevenue {
  key?: string;
  cleaning?: { count?: number; cost?: number,key?:string,name?:string };
  repair?: { count?: number; cost?: number,key?:string,name?:string };
  steaming?: { count?: number; cost?: number,key?:string,name?:string };
  in_out?: { count?: number; cost?: number,key?:string,name?:string };
  preinspection?: { count?: number; cost?: number,key?:string,name?:string };
  lolo?: { count?: number; cost?: number,key?:string,name?:string };
  storage?: { count?: number; cost?: number,key?:string,name?:string };
  residue?: { count?: number; cost?: number,key?:string,name?:string };

  constructor(item: Partial<MonthlyProcessDataRevenue> = {}) {
    this.key=item.key;
    this.cleaning=item.cleaning;
    this.residue=item.residue;
    this.repair=item.repair;
    this.steaming=item.steaming;
    this.in_out=item.in_out;
    this.lolo=item.lolo;
    this.preinspection=item.preinspection;
    this.storage=item.storage;
    } 
}

export class InventoryPerDay{
  cost?:number;
  count?:number;
  date?:string;
  day?:string;

  
  constructor(item: Partial<InventoryPerDay> = {}) {
    this.cost=item.cost;
    this.count=item.count;
    this.date=item.date;
    this.day=item.day;
    
    } 
}

export class MonthlySales{
  average_cost?:number;
  average_count?:number;
  total_cost?:number;
  total_count?:number;
  result_per_day?:InventoryPerDay[];
   
  constructor(item: Partial<MonthlySales> = {}) {
    this.average_cost=item.average_cost;
    this.average_count=item.average_count;
    this.total_cost=item.total_cost;
    this.total_count=item.total_count;
    this.result_per_day=item.result_per_day;
    } 
}

export class ManagementReportMonthlyRevenueItem{
  lolo_monthly_revenue?:MonthlySales;
  cleaning_monthly_revenue?:MonthlySales;
  gate_monthly_revenue?:MonthlySales;
  preinspection_monthly_revenue?:MonthlySales;
  repair_monthly_revenue?:MonthlySales;
  residue_monthly_revenue?:MonthlySales;
  steam_monthly_revenue?:MonthlySales;
  storage_monthly_revenue?:MonthlySales;
  constructor(item: Partial<ManagementReportMonthlyRevenueItem> = {}) {
      this.lolo_monthly_revenue=item.lolo_monthly_revenue;
      this.cleaning_monthly_revenue=item.cleaning_monthly_revenue;
      this.gate_monthly_revenue=item.gate_monthly_revenue;
      this.preinspection_monthly_revenue=item.preinspection_monthly_revenue;
      this.repair_monthly_revenue=item.repair_monthly_revenue;
      this.residue_monthly_revenue=item.residue_monthly_revenue;
      this.steam_monthly_revenue=item.steam_monthly_revenue;
      this.storage_monthly_revenue=item.storage_monthly_revenue;
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
  // gate?: { count?: number; percentage?: number,key?:string,name?:string };
  // preinspection?: { count?: number; percentage?: number,key?:string,name?:string };
  // lolo?: { count?: number; percentage?: number,key?:string,name?:string };
  // storage?: { count?: number; percentage?: number,key?:string,name?:string };
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
    // this.gate=item.gate;
    // this.lolo=item.lolo;
    // this.preinspection=item.preinspection;
    // this.storage=item.storage;
    // this.residue=item.residue;
    } 
}

export class OrderTrackingItem
{
  cancel_date?:number;
  cancel_remarks?:string;
  customer_code?:string;
  customer_name?:string;
  eir_date?:number;
  eir_no?:string;
  last_cargo?:string;
  order_date?:number;
  order_no?:string;
  purpose?:string;
  release_date?:number;
  status?:string;
  tank_no?:string;
  constructor(item: Partial<OrderTrackingItem> = {}) {
      this.cancel_date=item.cancel_date;
      this.cancel_remarks=item.cancel_remarks;
      this.customer_code=item.customer_code;
      this.customer_name=item.customer_name;
      this.eir_date=item.eir_date;
      this.eir_no=item.eir_no;
      this.last_cargo=item.last_cargo;
      this.order_date=item.order_date;
      this.order_no=item.order_no;
      this.purpose=item.purpose;
      this.release_date=item.release_date;
      this.status=item.status;
      this.tank_no=item.tank_no;
  }
}

export class WeeklyPerformmanceItem
{
      average_gate_count?:number;
      cleaning_count?:number;
      depot_count?:number;
      gate_in_count?:number;
      gate_out_count?:number;
      repair_count?:number;
      total_gate_count?:number;
      week_of_year?:number;

      constructor(item: Partial<WeeklyPerformmanceItem> = {}) {
        this.average_gate_count=item.average_gate_count;
        this.cleaning_count=item.cleaning_count;
        this.depot_count=item.depot_count;
        
        this.gate_in_count=item.gate_in_count;
        this.gate_out_count=item.gate_out_count;
        this.repair_count=item.repair_count;
        this.total_gate_count=item.total_gate_count;
        this.week_of_year=item.week_of_year;

        } 
     }

export class GroupedInventoryMonthly {
  [date: string]: {
    day: string;
    cleaning?: any;
    residue?:any;
    gateInOut?: {
      gate?: any;
      lolo?: any;
    };
    repair?: any;
    steaming?: any;
  };
}

export class GroupedByDate {
  [date: string]: {
    day: string;
    residue?:any;
    lolo?:any;
    preinspection?:any;
    storage?:any;
    cleaning?: any;
    gate?: any;
    repair?: any;
    steaming?: any;
  };
}

export class InventoryAnalyzer {
 static getMonthIndex(monthName: string): number {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months.indexOf(monthName);
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


  static groupByMonthAndFindExtremesRevenue(data: ManagementReportYearlyRevenueItem) {
    // Initialize a map to group by month with proper typing
    const monthlyData: Record<string, MonthlyProcessDataRevenue> = {};

    // Process each inventory type
    const processData = [
      { name: 'cleaning', data: data.cleaning_yearly_revenue?.revenue_per_month },
      { name: 'residue', data: data.residue_yearly_revenue?.revenue_per_month },
      { name: 'in_out', data: data.gate_yearly_revenue?.revenue_per_month },
      { name: 'steaming', data: data.steam_yearly_revenue?.revenue_per_month },
      { name: 'repair', data: data.repair_yearly_revenue?.revenue_per_month },
      { name: 'storage', data: data.storage_yearly_revenue?.revenue_per_month },
      { name: 'lolo', data: data.lolo_yearly_revenue?.revenue_per_month },
      { name: 'preinspection', data: data.preinspection_yearly_revenue?.revenue_per_month },
    ];

    // Populate monthlyData with type-safe assignments
    processData.forEach(process => {
    
        process.data?.forEach(monthData => {
          if (!monthData.key) return;
          
          if (!monthlyData[monthData.key]) {
            monthlyData[monthData.key] = { key: monthData.key };
          }
          
          // Use count if available, otherwise percentage
          const value = monthData.count ?? monthData.cost;
          
          // Type-safe assignment using a type assertion
          const monthlyEntry = monthlyData[monthData.key];
          switch (process.name) {
            case 'lolo':
              monthlyEntry.lolo= {
                count: monthData.count,
                cost: monthData.cost,
                key:monthData.key,
                name:monthData.name
              };
              break;
            case 'preinspection':
              monthlyEntry.preinspection= {
                count: monthData.count,
                cost: monthData.cost,
                key:monthData.key,
                name:monthData.name
              };
              break;
            case 'cleaning':
              monthlyEntry.cleaning= {
                count: monthData.count,
                cost: monthData.cost,
                key:monthData.key,
                name:monthData.name
              };
              break;
            case 'residue':
              monthlyEntry.residue= {
                count: monthData.count,
                cost: monthData.cost,
                key:monthData.key,
                name:monthData.name
              };
              break;
            case 'in_out':
              monthlyEntry.in_out = {
                count: monthData.count,
                cost: monthData.cost,
                key:monthData.key,
                name:monthData.name
              };
              break;
            case 'storage':
              monthlyEntry.storage = {
                count: monthData.count,
                cost: monthData.cost,
                key:monthData.key,
                name:monthData.name
              };
              break;
            case 'repair':
              monthlyEntry.repair = {
                count: monthData.count,
                cost: monthData.cost,
                key:monthData.key,
                name:monthData.name
              };
              break;
            case 'steaming':
              monthlyEntry.steaming = {
                count: monthData.count,
                cost: monthData.cost,
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
          let process:any = item[processName as keyof MonthlyProcessDataRevenue];
          return{
            key: item.key!,
            value: process?.count,
            cost: process?.cost,
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

  static groupInventoryMonthlyByDate(data: ManagementReportMonthlyInventory): GroupedInventoryMonthly {
    const grouped: GroupedInventoryMonthly = {};
  
    // Group cleaning inventory
    data.cleaning_inventory?.forEach(item => {
      if (!grouped[item.date!]) {
        grouped[item.date!] = { day: item.day! };
      }

      grouped[item.date!].cleaning = item;
    });
  
    data.gate_in_out_inventory?.gate_inventory?.forEach(item => {
      if (item.date && item.day) {
        if (!grouped[item.date]) {
          grouped[item.date] = {
            day: item.day,
            gateInOut: {}
          };
        }
        if(!grouped[item.date].gateInOut)grouped[item.date].gateInOut={};
        grouped[item.date].gateInOut!.gate = item;
      }
    });
  
   // Group lolo_inventory
  data.gate_in_out_inventory?.lolo_inventory?.forEach(item => {
    if (item.date && item.day) {
      if (!grouped[item.date]) {
        grouped[item.date] = {
          day: item.day,
          gateInOut: {}
        };
      }

      // Ensure gateInOut object exists
      if (!grouped[item.date].gateInOut) grouped[item.date].gateInOut = {};
      

      grouped[item.date].gateInOut!.lolo = item;
    }
  });
  
    // Group repair inventory
    data.repair_inventory?.forEach(item => {
      if (!grouped[item.date!]) {
        grouped[item.date!] = { day: item.day! };
      }
      grouped[item.date!].repair = item;
    });
  
    // Group steaming inventory
    data.steaming_inventory?.forEach(item => {
      if (!grouped[item.date!]) {
        grouped[item.date!] = { day: item.day! };
      }
      grouped[item.date!].steaming = item;
    });

     // Group steaming inventory
    data.residue_inventory?.forEach(item => {
      if (!grouped[item.date!]) {
        grouped[item.date!] = { day: item.day! };
      }
      grouped[item.date!].residue = item;
    });
  
    return grouped;
  }

  static groupRevenueMonthlyByDate(data: ManagementReportMonthlyRevenueItem): GroupedByDate {
    const grouped: GroupedByDate = {};
  
    // Group cleaning inventory
    data.cleaning_monthly_revenue?.result_per_day?.forEach(item => {
      if (!grouped[item.date!]) {
        grouped[item.date!] = { day: item.day! };
      }

      grouped[item.date!].cleaning = item;
    });
  
    data.gate_monthly_revenue?.result_per_day?.forEach(item => {
      if (item.date && item.day) {
        if (!grouped[item.date]) {
          grouped[item.date] = {
            day: item.day,
          };
        }
        grouped[item.date].gate = item;
      }
    });
  
    data.preinspection_monthly_revenue?.result_per_day?.forEach(item => {
      if (item.date && item.day) {
        if (!grouped[item.date]) {
          grouped[item.date] = {
            day: item.day,
          };
        }
        grouped[item.date].preinspection = item;
      }
    });

    data.residue_monthly_revenue?.result_per_day?.forEach(item => {
      if (item.date && item.day) {
        if (!grouped[item.date]) {
          grouped[item.date] = {
            day: item.day,
          };
        }
        grouped[item.date].residue = item;
      }
    });

    data.lolo_monthly_revenue?.result_per_day?.forEach(item => {
      if (item.date && item.day) {
        if (!grouped[item.date]) {
          grouped[item.date] = {
            day: item.day,
          };
        }
        grouped[item.date].lolo = item;
      }
    });

    data.storage_monthly_revenue?.result_per_day?.forEach(item => {
      if (item.date && item.day) {
        if (!grouped[item.date]) {
          grouped[item.date] = {
            day: item.day,
          };
        }
        grouped[item.date].storage = item;
      }
    });
  
  
    // Group repair inventory
    data.repair_monthly_revenue?.result_per_day?.forEach(item => {
      if (!grouped[item.date!]) {
        grouped[item.date!] = { day: item.day! };
      }
      grouped[item.date!].repair = item;
    });
  
    // Group steaming inventory
    data.steam_monthly_revenue?.result_per_day?.forEach(item => {
      if (!grouped[item.date!]) {
        grouped[item.date!] = { day: item.day! };
      }
      grouped[item.date!].steaming = item;
    });
  
    return grouped;
  }


  
}


export const GET_MANAGEMENT_REPORT_MONTHLY_REVENUE_REPORT = gql`
  query queryMonthlyRevenue($monthlyRevenueRequest: MonthlyRevenueRequestInput!) {
    resultList: queryMonthlyRevenue(monthlyRevenueRequest: $monthlyRevenueRequest) {
        cleaning_monthly_revenue {
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
      gate_monthly_revenue {
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
      lolo_monthly_revenue {
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
      preinspection_monthly_revenue {
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
      repair_monthly_revenue {
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
      residue_monthly_revenue {
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
      steam_monthly_revenue {
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
      storage_monthly_revenue {
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


export const GET_MANAGEMENT_REPORT_MONTHLY_INVENTORY_REPORT = gql`
  query queryMonthlyInventory($monthlyInventoryRequest: MonthlyInventoryRequestInput!) {
    resultList: queryMonthlyInventory(monthlyInventoryRequest: $monthlyInventoryRequest) {
      cleaning_inventory {
        approved_count
        completed_count
        date
        day
      }
      gate_in_out_inventory {
        gate_inventory {
          date
          day
          gate_in_count
          gate_out_count
        }
        lolo_inventory {
          date
          day
          lift_off_count
          lift_on_count
        }
      }
      repair_inventory {
        approved_hour
        completed_hour
        date
        day
      }
      steaming_inventory {
        approved_count
        completed_count
        date
        day
      }
      residue_inventory {
        approved_count
        completed_count
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
      residue_yearly_inventory {
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


export const GET_MANAGEMENT_REPORT_YEARLY_REVENUE_REPORT = gql`
  query queryYearlyRevenue($yearlyRevenueRequest: YearlyRevenueRequestInput!) {
    resultList: queryYearlyRevenue(yearlyRevenueRequest: $yearlyRevenueRequest) {
        lolo_yearly_revenue {
          average_cost
          average_count
          total_cost
          total_count
          revenue_per_month {
            cost
            count
            key
            name
          }
        }
        cleaning_yearly_revenue {
          average_cost
          average_count
          total_cost
          total_count
          revenue_per_month {
            cost
            count
            key
            name
          }
        }
        gate_yearly_revenue {
          average_cost
          average_count
          total_cost
          total_count
          revenue_per_month {
            cost
            count
            key
            name
          }
        }
        preinspection_yearly_revenue {
          average_cost
          average_count
          total_cost
          total_count
          revenue_per_month {
            cost
            count
            key
            name
          }
        }
        repair_yearly_revenue {
          average_cost
          average_count
          total_cost
          total_count
          revenue_per_month {
            cost
            count
            key
            name
          }
        }
        residue_yearly_revenue {
          average_cost
          average_count
          total_cost
          total_count
          revenue_per_month {
            cost
            count
            key
            name
          }
        }
        steam_yearly_revenue {
          average_cost
          average_count
          total_cost
          total_count
          revenue_per_month {
            cost
            count
            key
            name
          }
        }
        storage_yearly_revenue {
          average_cost
          average_count
          total_cost
          total_count
          revenue_per_month {
            cost
            count
            key
            name
          }
        }
    }
  }
`

export const GET_MANAGEMENT_REPORT_WEEKLY_PERFORMANCE_REPORT = gql`
  query queryDepotPerformance($depotPerformanceRequest: DepotPerformanceRequestInput!) {
    resultList:  queryDepotPerformance(depotPerformanceRequest:$depotPerformanceRequest) {
    totalCount
    nodes {
      average_gate_count
      cleaning_count
      depot_count
      gate_in_count
      gate_out_count
      repair_count
      total_gate_count
      week_of_year
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
    
  }
`
export const GET_MANAGEMENT_REPORT_ORDER_TRACKING_REPORT = gql`
  query queryOrderTracking($orderTrackingRequest:OrderTrackingRequestInput!,$order:[OrderTrackingResultSortInput!],$first:Int,$after:String,$last:Int,$before:String) {
    resultList:  queryOrderTracking(orderTrackingRequest:$orderTrackingRequest,first:$first,after:$after,last:$last,before:$before,order:$order) {
    totalCount
    nodes {
      cancel_date
      cancel_remarks
      customer_code
      customer_name
      eir_date
      eir_no
      last_cargo
      order_date
      order_no
      purpose
      release_date
      status
      tank_no
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
    
  }
`

export class ManagementReportDS extends BaseDataSource<any> {

  private first: number=20000;
  constructor(private apollo: Apollo) {
    super();
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
          return of([] as ManagementReportYearlyInventory[]); // Return an empty array on error
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
          return of([] as ManagementReportYearlyInventory[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const resultList = result.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList);
          return resultList;
        })
      );
  }

  
  searchManagementReportRevenueYearlyReport(yearlyRevenueRequest:any): Observable<ManagementReportYearlyRevenueItem> {
    this.loadingSubject.next(true);
    var first=this.first;
    return this.apollo
      .query<any>({
        query: GET_MANAGEMENT_REPORT_YEARLY_REVENUE_REPORT,
        variables: { yearlyRevenueRequest },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as ManagementReportYearlyRevenueItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const resultList = result.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList);
          return resultList;
        })
      );
  }

  searchManagementReportRevenueMonthlyReport(monthlyRevenueRequest:any): Observable<ManagementReportMonthlyRevenueItem> {
    this.loadingSubject.next(true);
    var first=this.first;
    return this.apollo
      .query<any>({
        query: GET_MANAGEMENT_REPORT_MONTHLY_REVENUE_REPORT,
        variables: { monthlyRevenueRequest },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as ManagementReportYearlyRevenueItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const resultList = result.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList);
          return resultList;
        })
      );
  }
  
  searchManagementReportPerformanceWeeklyReport(depotPerformanceRequest:any): Observable<WeeklyPerformmanceItem[]> {
    this.loadingSubject.next(true);
    var first=this.first;
    return this.apollo
      .query<any>({
        query: GET_MANAGEMENT_REPORT_WEEKLY_PERFORMANCE_REPORT,
        variables: { depotPerformanceRequest },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as ManagementReportYearlyRevenueItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const resultList = result.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList);
          return resultList.nodes;
        })
      );
  }
  
  searchManagementReportOrderTrackingReport(orderTrackingRequest:any,order?:any,first?:any,after?:any,last?:any,before?:any): Observable<OrderTrackingItem[]> {
    this.loadingSubject.next(true);
   // var first=this.first;
    return this.apollo
      .query<any>({
        query: GET_MANAGEMENT_REPORT_ORDER_TRACKING_REPORT,
        variables: { orderTrackingRequest,first,after,last,before,order },
        fetchPolicy: 'no-cache' // Ensure fresh data
      })
      .pipe(
        map((result) => result.data),
        catchError((error: ApolloError) => {
          console.error('GraphQL Error:', error);
          return of([] as OrderTrackingItem[]); // Return an empty array on error
        }),
        finalize(() => this.loadingSubject.next(false)),
        map((result) => {
          const resultList = result.resultList || { nodes: [], totalCount: 0 };
          this.dataSubject.next(resultList);
          return resultList.nodes;
        })
      );
  }

}


