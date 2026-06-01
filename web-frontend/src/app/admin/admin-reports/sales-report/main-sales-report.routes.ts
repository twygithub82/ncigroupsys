import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { MainSalesReportComponent } from "./main-sales-report.component";

export const MAIN_SALES_REPORT_ROUTES: Routes = [
  {
          path: "",
          component: MainSalesReportComponent,
          canActivate: [AuthGuard],
          data: { expectedFunctions: ['ADMIN_REPORTS_YEARLY_SALES_REPORT_VIEW', 'ADMIN_REPORTS_MONTHLY_SALES_REPORT_VIEW'] }
      },
];