import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";

import { JobOrderSteamComponent } from "./job-order.component";
import { JobOrderAllocationSteamComponent } from "../job-order-allocation/job-order-allocation.component";
import { SteamJobOrderTaskDetailsComponent } from "../job-order-task-details/job-order-task-details.component";
import { SteamJobOrderTaskMonitorComponent } from "../job-order-monitor/job-order-task-monitor.component";

export const JOB_ORDER_ROUTES: Routes = [
  {
    path: "",
    component: JobOrderSteamComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        "STEAMING_BAY_OVERVIEW_DELETE",
        "STEAMING_BAY_OVERVIEW_EDIT",
        "STEAMING_BAY_OVERVIEW_VIEW",
        "STEAMING_JOB_ALLOCATION_DELETE",
        "STEAMING_JOB_ALLOCATION_EDIT",
        "STEAMING_JOB_ALLOCATION_VIEW",
        "STEAMING_JOBS_VIEW",
        "STEAMING_JOBS_EDIT",
        "STEAMING_JOBS_DELETE"
      ]
    }
  },
  {
    path: "allocation/:id",
    component: JobOrderAllocationSteamComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        "STEAMING_JOB_ALLOCATION_DELETE",
        "STEAMING_JOB_ALLOCATION_EDIT",
        "STEAMING_JOB_ALLOCATION_VIEW"
      ]
    }
  },
  {
    path: "task/:id/:steam_id",
    component: SteamJobOrderTaskDetailsComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        "STEAMING_JOBS_VIEW",
        "STEAMING_JOBS_EDIT",
        "STEAMING_JOBS_DELETE"
      ]
    }
  },
  {
    path: "monitor/:id/:steam_id",
    component: SteamJobOrderTaskMonitorComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        "STEAMING_BAY_OVERVIEW_DELETE",
        "STEAMING_BAY_OVERVIEW_EDIT",
        "STEAMING_BAY_OVERVIEW_VIEW"
      ]
    }
  }
];