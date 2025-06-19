import { Routes } from "@angular/router";
import { RepairApprovalViewComponent } from "./approval-view/approval-view.component";
import { RepairApprovalComponent } from "./approval/approval.component";
import { RepairEstimateNewComponent } from "./estimate-new/estimate-new.component";
import { RepairQCViewComponent } from "./estimate-qc/estimate-qc.component";
import { RepairEstimateComponent } from "./estimate/estimate.component";
import { JobOrderAllocationComponent } from "./job-order-allocation/job-order-allocation.component";
import { JobOrderTaskDetailsComponent } from "./job-order-task-details/job-order-task-details.component";
import { JobOrderComponent } from "./job-order/job-order.component";
import { AuthGuard } from "@core/guard/auth.guard";

export const REPAIR_ROUTE: Routes = [
  {
    path: "estimate",
    component: RepairEstimateComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['REPAIR_REPAIR_ESTIMATE_ADD', 'REPAIR_REPAIR_ESTIMATE_DELETE', 'REPAIR_REPAIR_ESTIMATE_EDIT', 'REPAIR_REPAIR_ESTIMATE_VIEW'] }
  },
   {
    path: "estimate/:id",
    component: RepairEstimateComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['REPAIR_REPAIR_ESTIMATE_ADD', 'REPAIR_REPAIR_ESTIMATE_DELETE', 'REPAIR_REPAIR_ESTIMATE_EDIT', 'REPAIR_REPAIR_ESTIMATE_VIEW'] }
  },
  {
    path: "estimate/new/:id",
    component: RepairEstimateNewComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['REPAIR_REPAIR_ESTIMATE_ADD', 'REPAIR_REPAIR_ESTIMATE_DELETE', 'REPAIR_REPAIR_ESTIMATE_EDIT', 'REPAIR_REPAIR_ESTIMATE_VIEW'] }
  },
  {
    path: "estimate/edit/:id/:repair_id",
    component: RepairEstimateNewComponent,
    canActivate: [AuthGuard],
    data: { action: 'edit', expectedFunctions: ['REPAIR_REPAIR_ESTIMATE_ADD', 'REPAIR_REPAIR_ESTIMATE_DELETE', 'REPAIR_REPAIR_ESTIMATE_EDIT', 'REPAIR_REPAIR_ESTIMATE_VIEW'] }
  },
  {
    path: "estimate/duplicate/:id/:repair_id",
    component: RepairEstimateNewComponent,
    canActivate: [AuthGuard],
    data: { action: 'duplicate', expectedFunctions: ['REPAIR_REPAIR_ESTIMATE_ADD', 'REPAIR_REPAIR_ESTIMATE_DELETE', 'REPAIR_REPAIR_ESTIMATE_EDIT', 'REPAIR_REPAIR_ESTIMATE_VIEW'] }
  },
  {
    path: "approval",
    component: RepairApprovalComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['REPAIR_ESTIMATE_APPROVAL_DELETE', 'REPAIR_ESTIMATE_APPROVAL_EDIT', 'REPAIR_ESTIMATE_APPROVAL_VIEW'] }
  },
    {
    path: "approval/:id",
    component: RepairApprovalComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['REPAIR_ESTIMATE_APPROVAL_DELETE', 'REPAIR_ESTIMATE_APPROVAL_EDIT', 'REPAIR_ESTIMATE_APPROVAL_VIEW'] }
  },
  {
    path: "approval/view/:id",
    component: RepairApprovalViewComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['REPAIR_ESTIMATE_APPROVAL_DELETE', 'REPAIR_ESTIMATE_APPROVAL_EDIT', 'REPAIR_ESTIMATE_APPROVAL_VIEW'] }
  },
  {
    path: "job-order",
    component: JobOrderComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['REPAIR_JOB_ALLOCATION_DELETE', 'REPAIR_JOB_ALLOCATION_EDIT', 'REPAIR_JOB_ALLOCATION_VIEW', 'REPAIR_JOBS_DELETE', 'REPAIR_JOBS_EDIT', 'REPAIR_JOBS_VIEW', 'REPAIR_QC_DELETE', 'REPAIR_QC_EDIT', 'REPAIR_QC_VIEW'] }
  },
   {
    path: "job-order/:id",
    component: JobOrderComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['REPAIR_JOB_ALLOCATION_DELETE', 'REPAIR_JOB_ALLOCATION_EDIT', 'REPAIR_JOB_ALLOCATION_VIEW', 'REPAIR_JOBS_DELETE', 'REPAIR_JOBS_EDIT', 'REPAIR_JOBS_VIEW', 'REPAIR_QC_DELETE', 'REPAIR_QC_EDIT', 'REPAIR_QC_VIEW'] }
  },
  {
    path: "job-order/allocation/:id",
    component: JobOrderAllocationComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['REPAIR_JOB_ALLOCATION_DELETE', 'REPAIR_JOB_ALLOCATION_EDIT', 'REPAIR_JOB_ALLOCATION_VIEW'] }
  },
  {
    path: "job-order/task/:id/:repair_id",
    component: JobOrderTaskDetailsComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['REPAIR_JOBS_DELETE', 'REPAIR_JOBS_EDIT', 'REPAIR_JOBS_VIEW'] }
  },
  {
    path: "job-order/qc/view/:id",
    component: RepairQCViewComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['REPAIR_QC_DELETE', 'REPAIR_QC_EDIT', 'REPAIR_QC_VIEW'] }
  },
];