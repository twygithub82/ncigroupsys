import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { MainManagementMonthlyComponent } from "./main-management-monthly.component";

export const MONTHLY_ROUTES: Routes = [
  {
    path: "",
    component: MainManagementMonthlyComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'MANAGEMENT_INVENTORY_REPORT_VIEW',
        'MANAGEMENT_REVENUE_REPORT_VIEW'
      ]
    }
  }
];