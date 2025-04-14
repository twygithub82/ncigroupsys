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

export const RESIDUE_DISPOSAL_ROUTE: Routes = [
  {
    path: "estimate-approval",
    component: ResidueDisposalEstimateApprovalComponent,
  },
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
    path: "estimate-approval/new/:id",
    component: ResidueDisposalEstimateApprovalNewComponent,
  },
  {
    path: "approval/view/:id",
    component: ResidueDisposalApprovalViewComponent,
  },
  {
    path: "job-order",
    component: JobOrderResidueDisposalComponent,
  },
  {
    path: "job-order/allocation/:id",
    component: JobOrderAllocationResidueDisposalComponent,
  },
  {
    path: "job-order/task/:id/:residue_id",
    component: ResidueJobOrderTaskDetailsComponent,
  },
];