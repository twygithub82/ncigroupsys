import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";

import { ResidueDisposalEstimateApprovalClientComponent } from "./client-approval.component";
import { ResidueDisposalEstimateApprovalClientNewComponent } from "../client-approval-new/client-approval-new.component";

export const CLIENT_APPROVAL_ROUTES: Routes = [
  {
    path: "",
    component: ResidueDisposalEstimateApprovalClientComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'RESIDUE_DISPOSAL_ESTIMATE_APPROVAL_CLIENT'
      ]
    }
  },
  {
    path: "new/:id",
    component: ResidueDisposalEstimateApprovalClientNewComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'RESIDUE_DISPOSAL_ESTIMATE_APPROVAL_CLIENT'
      ]
    }
  }
];