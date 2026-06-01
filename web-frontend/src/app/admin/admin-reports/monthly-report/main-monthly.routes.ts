import { Routes } from "@angular/router";

import { AuthGuard } from "@core/guard/auth.guard";

import { MainMonthlyComponent } from "./main-monthly.component";

export const MAIN_MONTHLY_ROUTES: Routes = [
    {
          path: "",
          component: MainMonthlyComponent,
          canActivate: [AuthGuard],
          data: { expectedFunctions: ['ADMIN_REPORTS_CUSTOMER_REPORT_VIEW', 'ADMIN_REPORTS_CLEANING_REPORT_VIEW', 'ADMIN_REPORTS_REPAIR_REPORT_VIEW', 'ADMIN_REPORTS_RESIDUE_DISPOSAL_REPORT_VIEW', 'ADMIN_REPORTS_STEAM_REPORT_VIEW'] }
      },
];