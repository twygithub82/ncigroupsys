import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";

import { RepairEstimateComponent } from "./estimate.component";
import { RepairEstimateNewComponent } from "../estimate-new/estimate-new.component";

export const ESTIMATE_ROUTES: Routes = [
  {
    path: "",
    component: RepairEstimateComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        "REPAIR_REPAIR_ESTIMATE_ADD",
        "REPAIR_REPAIR_ESTIMATE_EDIT",
        "REPAIR_REPAIR_ESTIMATE_DELETE",
        "REPAIR_REPAIR_ESTIMATE_VIEW"
      ]
    }
  },
  {
    path: "new/:id",
    component: RepairEstimateNewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "edit/:id/:repair_id",
    component: RepairEstimateNewComponent,
    canActivate: [AuthGuard],
    data: { action: "edit" }
  },
  {
    path: "duplicate/:id/:repair_id",
    component: RepairEstimateNewComponent,
    canActivate: [AuthGuard],
    data: { action: "duplicate" }
  }
];