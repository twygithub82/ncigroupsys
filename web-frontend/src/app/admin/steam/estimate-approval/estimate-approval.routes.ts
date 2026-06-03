import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";

import { SteamEstimateApprovalComponent } from "./estimate-approval.component";
import { SteamEstimateApprovalNewComponent } from "../estimate-approval-new/estimate-approval-new.component";

export const ESTIMATE_APPROVAL_ROUTES: Routes = [
  {
    path: "",
    component: SteamEstimateApprovalComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        "STEAMING_ESTIMATE_APPROVAL_ADD",
        "STEAMING_ESTIMATE_APPROVAL_DELETE",
        "STEAMING_ESTIMATE_APPROVAL_EDIT",
        "STEAMING_ESTIMATE_APPROVAL_VIEW"
      ]
    }
  },
  {
    path: "new/:id",
    component: SteamEstimateApprovalNewComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        "STEAMING_ESTIMATE_APPROVAL_ADD",
        "STEAMING_ESTIMATE_APPROVAL_DELETE",
        "STEAMING_ESTIMATE_APPROVAL_EDIT",
        "STEAMING_ESTIMATE_APPROVAL_VIEW"
      ]
    }
  }
];