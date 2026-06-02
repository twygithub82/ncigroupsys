import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";

import { JobOrderComponent } from "./job-order.component";
import { JobOrderAllocationComponent } from "../job-order-allocation/job-order-allocation.component";
import { JobOrderTaskDetailsComponent } from "../job-order-task-details/job-order-task-details.component";
import { RepairQCViewComponent } from "../estimate-qc/estimate-qc.component";
export const JOB_ORDER_ROUTES: Routes = [
  {
    path: "",
    component: JobOrderComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ":id",
    component: JobOrderComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "allocation/:id",
    component: JobOrderAllocationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "task/:id/:repair_id",
    component: JobOrderTaskDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "qc/view/:id",
    component: RepairQCViewComponent,
    canActivate: [AuthGuard]
  }
];