import { Routes } from "@angular/router";
import { MainTankActivityComponent } from "./tank-activity/main-tank-activity.component";
import { MainStatusComponent } from "./status/main-status.component";
import { MainInventoryComponent } from "./inventory/main-inventory.component";
import { MainPendingComponent } from "./pending/main-pending.component";

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
  }
];