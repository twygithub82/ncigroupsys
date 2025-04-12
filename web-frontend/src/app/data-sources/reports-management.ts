import { ApolloError } from '@apollo/client/errors';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { BaseDataSource } from './base-ds';

export class resultPerMonth{
  
  count?:number;
  month?:string;
  cost?:number;

  
  constructor(item: Partial<resultPerMonth> = {}) {
    this.count=item.count;
    this.month=item.month;
    this.cost=item.cost;
    } 
}

export class yearlySales{
  average_cost?:number;
  average_count?:number;
  total_cost?:number;
  total_count?:number;
  result_per_month?:resultPerMonth[];
   
  constructor(item: Partial<yearlySales> = {}) {
    this.average_cost=item.average_cost;
    this.average_count=item.average_count;
    this.total_cost=item.total_cost;
    this.total_count=item.total_count;
    this.result_per_month=item.result_per_month;
    } 
}

export class ManagementReportYearlyRevenueItem{
  lolo_yearly_revenue?:yearlySales;
  cleaning_yearly_revenue?:yearlySales;
  gate_yearly_revenue?:yearlySales;
  preinspection_yearly_revenue?:yearlySales;
  repair_yearly_revenue?:yearlySales;
  residue_yearly_revenue?:yearlySales;
  steam_yearly_revenue?:yearlySales;
  storage_yearly_revenue?:yearlySales;
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
  constructor(item: Partial<ManagementReportYearlyInventory> = {}) {
    this.cleaning_yearly_inventory=item.cleaning_yearly_inventory;
    this.depot_yearly_inventory=item.depot_yearly_inventory;
    this.gate_in_inventory=item.gate_in_inventory;
    this.gate_out_inventory=item.gate_out_inventory;
    this.repair_yearly_inventory=item.repair_yearly_inventory;
    this.steaming_yearly_inventory=item.steaming_yearly_inventory;
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
  gate_in_out_inventory?:GateIOInventoryItem;
  
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
  constructor(item: Partial<MonthlyProcessData> = {}) {
    this.key=item.key;
    this.cleaning=item.cleaning;
    this.depot=item.depot;
    this.gateIn=item.gateIn;
    this.gateOut=item.gateOut;
    this.repair=item.repair;
    this.steaming=item.steaming;
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
}


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


export const GET_MANAGEMENT_REPORT_YEARLY_REVENUE_REPORT = gql`
  query queryYearlyRevenue($yearlyRevenueRequest: YearlyRevenueRequestInput!) {
    resultList: queryYearlyRevenue(yearlyRevenueRequest: $yearlyRevenueRequest) {
        lolo_yearly_revenue {
          average_cost
          average_count
          total_cost
          total_count
        }
        cleaning_yearly_revenue {
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
        gate_yearly_revenue {
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
        preinspection_yearly_revenue {
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
        repair_yearly_revenue {
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
        residue_yearly_revenue {
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
        steam_yearly_revenue {
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
        storage_yearly_revenue {
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

  
  searchManagementReportRenvenueYearlyReport(yearlyRevenueRequest:any): Observable<ManagementReportYearlyRevenueItem> {
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

}


