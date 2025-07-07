import { Routes } from "@angular/router";
import { MainManagementYearlyComponent } from "./reports/yearly/main-management-yearly.component";
import { MainManagementMonthlyComponent } from "./reports/monthly/main-management-monthly.component";
import { MainManagementPerformanceComponent } from "./reports/performance/main-management-performance.component";
import { MainManagementReportOrderTrackComponent } from "./reports/order_track/main-order-track.component";
import { AuthGuard } from "@core/guard/auth.guard";

export const MANAGEMENT_ROUTE: Routes = [
  {
    path: "reports/yearly",
    component: MainManagementYearlyComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['MANAGEMENT_INVENTORY_REPORT_VIEW', 'MANAGEMENT_REVENUE_REPORT_VIEW'] }
  },
  {
    path: "reports/monthly",
    component: MainManagementMonthlyComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['MANAGEMENT_INVENTORY_REPORT_VIEW', 'MANAGEMENT_REVENUE_REPORT_VIEW'] }
  },
  {
    path: "reports/performance",
    component: MainManagementPerformanceComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['MANAGEMENT_MAN_HOUR_VIEW'] }
  },
  {
    path: "reports/order-track",
    component: MainManagementReportOrderTrackComponent,
    // canActivate: [AuthGuard],
    // data: { expectedFunctions: ['MANAGEMENT_INVENTORY_REPORT_VIEW', 'MANAGEMENT_REVENUE_REPORT_VIEW', 'MANAGEMENT_MAN_HOUR_VIEW'] }
  },
];