import { Routes } from "@angular/router";
import { MainMonthlyComponent } from "./monthly-report/main-monthly.component";
import { MainYearlyComponent } from "./yearly-report/main-yearly.component";
import { MainSalesReportComponent } from "./sales-report/main-sales-report.component";
import { MainDailyTeamComponent } from "./daily-team/main-daily-team.component";
import { MainPerformanceComponent } from "./performance-report/main-performance.component";
import { MainZeroApprovalCostComponent } from "./zero-approval-cost/main-zero-approval-cost.component";
import { AuthGuard } from "@core/guard/auth.guard";

export const ADMIN_REPORTS_ROUTE: Routes = [
    {
        path: "main-monthly",
        component: MainMonthlyComponent,
        canActivate: [AuthGuard],
        data: { expectedFunctions: ['ADMIN_REPORTS_CUSTOMER_REPORT_VIEW', 'ADMIN_REPORTS_CLEANING_REPORT_VIEW', 'ADMIN_REPORTS_REPAIR_REPORT_VIEW', 'ADMIN_REPORTS_RESIDUE_DISPOSAL_REPORT_VIEW', 'ADMIN_REPORTS_STEAM_REPORT_VIEW'] }
    },
    {
        path: "main-yearly",
        component: MainYearlyComponent,
        canActivate: [AuthGuard],
        data: { expectedFunctions: ['ADMIN_REPORTS_CLEANING_REPORT_VIEW', 'ADMIN_REPORTS_REPAIR_REPORT_VIEW', 'ADMIN_REPORTS_RESIDUE_DISPOSAL_REPORT_VIEW', 'ADMIN_REPORTS_STEAM_REPORT_VIEW'] }
    },
    {
        path: "main-sales-report",
        component: MainSalesReportComponent,
        canActivate: [AuthGuard],
        data: { expectedFunctions: ['ADMIN_REPORTS_YEARLY_SALES_REPORT_VIEW', 'ADMIN_REPORTS_MONTHLY_SALES_REPORT_VIEW'] }
    },
    {
        path: "main-daily-team-report",
        component: MainDailyTeamComponent,
        canActivate: [AuthGuard],
        data: { expectedFunctions: ['ADMIN_REPORTS_DAILY_TEAM_REPORTS_VIEW'] }
    },
    {
        path: "main-performance-report",
        component: MainPerformanceComponent,
        canActivate: [AuthGuard],
        data: { expectedFunctions: ['ADMIN_REPORTS_SURVEYOR_VIEW', 'ADMIN_REPORTS_STEAM_VIEW', 'ADMIN_REPORTS_CLEANER_VIEW'] }
    },
    {
        path: "main-zero-approval-cost-report",
        component: MainZeroApprovalCostComponent,
        canActivate: [AuthGuard],
        data: { expectedFunctions: ['ADMIN_REPORTS_ZERO_APPROVAL_COST_REPORT_VIEW'] }
    }
];