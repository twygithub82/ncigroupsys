import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { MainManagementYearlyComponent } from "./main-management-yearly.component";

export const YEARLY_ROUTES: Routes = [
  {
    path: "",
    component: MainManagementYearlyComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'MANAGEMENT_INVENTORY_REPORT_VIEW',
        'MANAGEMENT_REVENUE_REPORT_VIEW'
      ]
    }
  }
];