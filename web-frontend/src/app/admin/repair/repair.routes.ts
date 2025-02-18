import { Routes } from "@angular/router";
import { RepairApprovalViewComponent } from "./approval-view/approval-view.component";
import { RepairApprovalComponent } from "./approval/approval.component";
import { RepairEstimateNewComponent } from "./estimate-new/estimate-new.component";
import { RepairQCViewComponent } from "./estimate-qc/estimate-qc.component";
import { RepairEstimateComponent } from "./estimate/estimate.component";
import { JobOrderAllocationComponent } from "./job-order-allocation/job-order-allocation.component";
import { JobOrderTaskDetailsComponent } from "./job-order-task-details/job-order-task-details.component";
import { JobOrderComponent } from "./job-order/job-order.component";

export const REPAIR_ROUTE: Routes = [
  {
    path: "estimate",
    component: RepairEstimateComponent,
  },
  {
    path: "estimate/new/:id",
    component: RepairEstimateNewComponent,
  },
  {
    path: "estimate/edit/:id/:repair_id",
    component: RepairEstimateNewComponent,
    data: { action: 'edit' }
  },
  {
    path: "estimate/duplicate/:id/:repair_id",
    component: RepairEstimateNewComponent,
    data: { action: 'duplicate' }
  },
  {
    path: "approval",
    component: RepairApprovalComponent,
  },
  {
    path: "approval/view/:id",
    component: RepairApprovalViewComponent,
  },
  {
    path: "job-order",
    component: JobOrderComponent,
  },
  {
    path: "job-order/allocation/:id",
    component: JobOrderAllocationComponent,
  },
  {
    path: "job-order/task/:id/:repair_id",
    component: JobOrderTaskDetailsComponent,
  },
  {
    path: "job-order/qc/view/:id",
    component: RepairQCViewComponent,
  },
];