import { Routes } from "@angular/router";
import { MainTankActivityComponent } from "./main-tank-activity.component";
import { MainStatusComponent } from "./status/main-status.component";

export const REPORTS_ROUTE: Routes = [{
    path: "tank-activity",
    component: MainTankActivityComponent,
  },
  {
    path: "status",
    component: MainStatusComponent,
  },
];