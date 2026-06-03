import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";

import { ResidueDisposalEstimateApprovalComponent } from "./estimate-approval.component";
import { ResidueDisposalEstimateApprovalNewComponent } from "../estimate-approval-new/estimate-approval-new.component";

export const ESTIMATE_APPROVAL_ROUTES: Routes = [
  {
    path: "",
    component: ResidueDisposalEstimateApprovalComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'RESIDUE_DISPOSAL_ESTIMATE_APPROVAL_VIEW',
        'RESIDUE_DISPOSAL_ESTIMATE_APPROVAL_EDIT',
        'RESIDUE_DISPOSAL_ESTIMATE_APPROVAL_DELETE',
        'RESIDUE_DISPOSAL_ESTIMATE_APPROVAL_ADD'
      ]
    }
  },
  {
    path: "new/:id",
    component: ResidueDisposalEstimateApprovalNewComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'RESIDUE_DISPOSAL_ESTIMATE_APPROVAL_VIEW',
        'RESIDUE_DISPOSAL_ESTIMATE_APPROVAL_EDIT',
        'RESIDUE_DISPOSAL_ESTIMATE_APPROVAL_DELETE',
        'RESIDUE_DISPOSAL_ESTIMATE_APPROVAL_ADD'
      ]
    }
  }
];