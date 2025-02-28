import { Routes } from "@angular/router";
import { MainTankActivityComponent } from "./tank-activity/main-tank-activity.component";
import { MainStatusComponent } from "./status/main-status.component";
import { MainInventoryComponent } from "./inventory/main-inventory.component";
import { MainPendingComponent } from "./pending/main-pending.component";
import {MainTransferComponent} from "./transfer/main-transfer.component";
import { MainTankSurveyComponent } from "./tank-survey/main-tank-survey.component";
import { MainPeriodicTestDueComponent } from "./periodic-test-due/main-periodic-test-due.component";


export const REPORTS_ROUTE: Routes = [{
    path: "tank-activity",
    component: MainTankActivityComponent,
  },
  {
    path: "status",
    component: MainStatusComponent,
  },
  {
    path: "inventory",
    component: MainInventoryComponent,
  },
  {
    path: "pending",
    component: MainPendingComponent,
  },
  {
    path:"transfer",
    component:MainTransferComponent,
  },
  {
    path:"tank-survey",
    component:MainTankSurveyComponent,
  },
  {
    path:"periodic-test-due",
    component:MainPeriodicTestDueComponent,
  }
 
 
];