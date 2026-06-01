import { Routes } from "@angular/router";
import { MainTankActivityComponent } from "./tank-activity/main-tank-activity.component";
import { MainStatusComponent } from "./status/main-status.component";
import { MainInventoryComponent } from "./inventory/main-inventory.component";
import { MainPendingComponent } from "./pending/main-pending.component";
import { MainTransferComponent } from "./transfer/main-transfer.component";
import { MainTankSurveyComponent } from "./tank-survey/main-tank-survey.component";
import { MainPeriodicTestDueComponent } from "./periodic-test-due/main-periodic-test-due.component";
import { AuthGuard } from "@core/guard/auth.guard";

export const REPORTS_ROUTE: Routes = [
  {
    path: 'tank-activity',
  loadChildren: () =>
    import('./tank-activity/tank-activity.routes')
      .then(m => m.TANK_ACTIVITY_ROUTES)
  },
  {
    path: "status",
  loadChildren: () =>
    import('./status/status.routes')
      .then(m => m.STATUS_ROUTES)
  },
   {
    path: "pending",
  loadChildren: () =>
    import('./pending/pending.routes')
      .then(m => m.PENDING_ROUTES)
  },
   {
    path: "transfer",
  loadChildren: () =>
    import('./transfer/transfer.routes')
      .then(m => m.TRANSFER_ROUTES)
  },
  {
    path: 'tank-survey',
  loadChildren: () =>
    import('./tank-survey/tank-survey.routes')
      .then(m => m.TANK_SURVEY_ROUTES)
  },
  {
    path: "periodic-test-due",
  loadChildren: () =>
    import('./periodic-test-due/periodic-test-due.routes')
      .then(m => m.PERIODIC_TEST_DUE_ROUTES)
  },
  // {
  //   path: "tank-activity",
  //   component: MainTankActivityComponent,
  //   canActivate: [AuthGuard],
  //   data: { expectedFunctions: ['REPORTS_CUSTOMER_REPORT_VIEW', 'REPORTS_YARD_REPORT_VIEW', 'REPORTS_DAILY_INVENTORY_VIEW', 'REPORTS_CLEANING_INVENTORY_VIEW'] }
  // },
  // {
  //   path: "status",
  //   component: MainStatusComponent,
  //   canActivate: [AuthGuard],
  //   data: { expectedFunctions: ['REPORTS_LOCATION_STATUS_VIEW', 'REPORTS_YARD_STATUS_VIEW'] }
  // },
  // {
  //   path: "inventory",
  //   component: MainInventoryComponent,
  // },
  // {
  //   path: "pending",
  //   component: MainPendingComponent,
  //   canActivate: [AuthGuard],
  //   data: { expectedFunctions: ['REPORTS_PENDING_ESTIMATE_VIEW'] }
  // },
  // {
  //   path: "transfer",
  //   component: MainTransferComponent,
  //   canActivate: [AuthGuard],
  //   data: { expectedFunctions: ['REPORTS_LOCATION_TRANSFER_VIEW'] }
  // },
  
  // {
  //   path: "tank-survey",
  //   component: MainTankSurveyComponent,
  //   canActivate: [AuthGuard],
  //   data: { expectedFunctions: ['REPORTS_TANK_SURVEY_VIEW'] }
  // },
  // {
  //   path: "periodic-test-due",
  //   component: MainPeriodicTestDueComponent,
  //   canActivate: [AuthGuard],
  //   data: { expectedFunctions: ['REPORTS_PERIODIC_TEST_DUE_VIEW'] }
  // }
];