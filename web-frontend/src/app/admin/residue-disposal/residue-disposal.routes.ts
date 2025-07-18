import { Routes } from "@angular/router";
import { ResidueDisposalApprovalViewComponent } from "./approval-view/approval-view.component";
import { ResidueDisposalApprovalComponent } from "./approval/approval.component";
import { ResidueDisposalEstimateApprovalNewComponent } from "./estimate-approval-new/estimate-approval-new.component";
import { ResidueDisposalEstimateApprovalComponent } from "./estimate-approval/estimate-approval.component";
import { ResidueDisposalEstimateNewComponent } from "./estimate-new/estimate-new.component";
import { ResidueDisposalEstimateComponent } from "./estimate/estimate.component";
import { JobOrderAllocationResidueDisposalComponent } from "./job-order-allocation/job-order-allocation.component";
import { ResidueJobOrderTaskDetailsComponent } from "./job-order-task-details/job-order-task-details.component";
import { JobOrderResidueDisposalComponent } from "./job-order/job-order.component";
import { AuthGuard } from "@core/guard/auth.guard";

export const RESIDUE_DISPOSAL_ROUTE: Routes = [
  {
    path: "estimate-approval",
    component: ResidueDisposalEstimateApprovalComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['RESIDUE_DISPOSAL_ESTIMATE_APPROVAL_VIEW', 'RESIDUE_DISPOSAL_ESTIMATE_APPROVAL_EDIT', 'RESIDUE_DISPOSAL_ESTIMATE_APPROVAL_DELETE', 'RESIDUE_DISPOSAL_ESTIMATE_APPROVAL_ADD'] }
  },
  //  {
  //   path: "estimate-approval/:id",
  //   component: ResidueDisposalEstimateApprovalComponent,
  //   canActivate: [AuthGuard],
  //   data: { expectedFunctions: ['RESIDUE_DISPOSAL_ESTIMATE_APPROVAL_VIEW', 'RESIDUE_DISPOSAL_ESTIMATE_APPROVAL_EDIT', 'RESIDUE_DISPOSAL_ESTIMATE_APPROVAL_DELETE', 'RESIDUE_DISPOSAL_ESTIMATE_APPROVAL_ADD'] }
  // },
  {
    path: "estimate-approval/new/:id",
    component: ResidueDisposalEstimateApprovalNewComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['RESIDUE_DISPOSAL_ESTIMATE_APPROVAL_VIEW', 'RESIDUE_DISPOSAL_ESTIMATE_APPROVAL_EDIT', 'RESIDUE_DISPOSAL_ESTIMATE_APPROVAL_DELETE', 'RESIDUE_DISPOSAL_ESTIMATE_APPROVAL_ADD'] }
  },
  {
    path: "job-order",
    component: JobOrderResidueDisposalComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['RESIDUE_DISPOSAL_JOB_ALLOCATION_EDIT', 'RESIDUE_DISPOSAL_JOB_ALLOCATION_DELETE', 'RESIDUE_DISPOSAL_JOB_ALLOCATION_VIEW', 'RESIDUE_DISPOSAL_JOBS_VIEW', 'RESIDUE_DISPOSAL_JOBS_DELETE', 'RESIDUE_DISPOSAL_JOBS_EDIT'] }
  },
  {
    path: "job-order/allocation/:id",
    component: JobOrderAllocationResidueDisposalComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['RESIDUE_DISPOSAL_JOB_ALLOCATION_EDIT', 'RESIDUE_DISPOSAL_JOB_ALLOCATION_DELETE', 'RESIDUE_DISPOSAL_JOB_ALLOCATION_VIEW'] }
  },
  {
    path: "job-order/task/:id/:residue_id",
    component: ResidueJobOrderTaskDetailsComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['RESIDUE_DISPOSAL_JOBS_VIEW', 'RESIDUE_DISPOSAL_JOBS_DELETE', 'RESIDUE_DISPOSAL_JOBS_EDIT'] }
  },

  // below not using anymore
  {
    path: "approval",
    component: ResidueDisposalApprovalComponent,
  },
  {
    path: "estimate",
    component: ResidueDisposalEstimateComponent,
  },
  {
    path: "estimate/new/:id",
    component: ResidueDisposalEstimateNewComponent,
  },
  {
    path: "approval/view/:id",
    component: ResidueDisposalApprovalViewComponent,
  },
];