import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";

import { RepairApprovalComponent } from "./approval.component";
import { RepairApprovalViewComponent } from "../approval-view/approval-view.component";

export const APPROVAL_ROUTES: Routes = [
  {
    path: "",
    component: RepairApprovalComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        "REPAIR_ESTIMATE_APPROVAL_VIEW",
        "REPAIR_ESTIMATE_APPROVAL_EDIT",
        "REPAIR_ESTIMATE_APPROVAL_DELETE",
        "REPAIR_ESTIMATE_APPROVAL_CLIENT"
      ]
    }
  },
  {
    path: ":id",
    component: RepairApprovalComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "view/:id",
    component: RepairApprovalViewComponent,
    canActivate: [AuthGuard]
  }
];