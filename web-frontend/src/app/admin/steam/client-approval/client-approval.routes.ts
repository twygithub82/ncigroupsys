import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";

import { SteamEstimateApprovalClientComponent } from "./client-approval.component";
import { SteamEstimateApprovalClientNewComponent } from "../client-approval-new/client-approval-new.component";

export const CLIENT_APPROVAL_ROUTES: Routes = [
  {
    path: "",
    component: SteamEstimateApprovalClientComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: ["STEAMING_ESTIMATE_APPROVAL_CLIENT"]
    }
  },
  {
    path: "new/:id",
    component: SteamEstimateApprovalClientNewComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: ["STEAMING_ESTIMATE_APPROVAL_CLIENT"]
    }
  }
];