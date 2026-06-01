import { Routes } from "@angular/router";
import { MainTankActivityComponent } from "./main-tank-activity.component";
import { AuthGuard } from "@core/guard/auth.guard";

export const TANK_ACTIVITY_ROUTES: Routes = [
  {
    path: '',
    component: MainTankActivityComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'REPORTS_CUSTOMER_REPORT_VIEW',
        'REPORTS_YARD_REPORT_VIEW',
        'REPORTS_DAILY_INVENTORY_VIEW',
        'REPORTS_CLEANING_INVENTORY_VIEW'
      ]
    }
  }
];