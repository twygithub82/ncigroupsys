import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";

import { RepairApprovalClientComponent } from "./client-approval.component";
import { RepairApprovalClientViewComponent } from "../client-approval-view/client-approval-view.component";

export const CLIENT_APPROVAL_ROUTES: Routes = [
  {
    path: "",
    component: RepairApprovalClientComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: ["REPAIR_ESTIMATE_APPROVAL_CLIENT"]
    }
  },
  {
    path: "view/:id",
    component: RepairApprovalClientViewComponent,
    canActivate: [AuthGuard]
  }
];