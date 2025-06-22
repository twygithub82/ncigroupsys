import { Routes } from "@angular/router";
import { SteamApprovalViewComponent } from "./approval-view/approval-view.component";
import { SteamApprovalComponent } from "./approval/approval.component";
import { SteamEstimateApprovalNewComponent } from "./estimate-approval-new/estimate-approval-new.component";
import { SteamEstimateApprovalComponent } from "./estimate-approval/estimate-approval.component";
import { SteamEstimateNewComponent } from "./estimate-new/estimate-new.component";
import { SteamEstimateComponent } from "./estimate/estimate.component";
import { JobOrderAllocationSteamComponent } from "./job-order-allocation/job-order-allocation.component";
import { SteamJobOrderTaskMonitorComponent } from "./job-order-monitor/job-order-task-monitor.component";
import { SteamJobOrderTaskDetailsComponent } from "./job-order-task-details/job-order-task-details.component";
import { JobOrderSteamComponent } from "./job-order/job-order.component";
import { AuthGuard } from "@core/guard/auth.guard";

export const STEAM_ROUTE: Routes = [
  {
    path: "estimate-approval",
    component: SteamEstimateApprovalComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['STEAMING_ESTIMATE_APPROVAL_ADD', 'STEAMING_ESTIMATE_APPROVAL_DELETE', 'STEAMING_ESTIMATE_APPROVAL_EDIT', 'STEAMING_ESTIMATE_APPROVAL_VIEW'] }
  },
   {
    path: "estimate-approval/:id",
    component: SteamEstimateApprovalComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['STEAMING_ESTIMATE_APPROVAL_ADD', 'STEAMING_ESTIMATE_APPROVAL_DELETE', 'STEAMING_ESTIMATE_APPROVAL_EDIT', 'STEAMING_ESTIMATE_APPROVAL_VIEW'] }
  },
  {
    path: "estimate-approval/new/:id",
    component: SteamEstimateApprovalNewComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['STEAMING_ESTIMATE_APPROVAL_ADD', 'STEAMING_ESTIMATE_APPROVAL_DELETE', 'STEAMING_ESTIMATE_APPROVAL_EDIT', 'STEAMING_ESTIMATE_APPROVAL_VIEW'] }
  },
  {
    path: "job-order",
    component: JobOrderSteamComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['STEAMING_BAY_OVERVIEW_DELETE', 'STEAMING_BAY_OVERVIEW_EDIT', 'STEAMING_BAY_OVERVIEW_VIEW', 'STEAMING_JOB_ALLOCATION_DELETE', 'STEAMING_JOB_ALLOCATION_EDIT', 'STEAMING_JOB_ALLOCATION_VIEW', 'STEAMING_JOBS_VIEW', 'STEAMING_JOBS_EDIT', 'STEAMING_JOBS_DELETE'] }
  },
  {
    path: "job-order/allocation/:id",
    component: JobOrderAllocationSteamComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['STEAMING_JOB_ALLOCATION_DELETE', 'STEAMING_JOB_ALLOCATION_EDIT', 'STEAMING_JOB_ALLOCATION_VIEW'] }
  },
  {
    path: "job-order/task/:id/:steam_id",
    component: SteamJobOrderTaskDetailsComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['STEAMING_JOBS_VIEW', 'STEAMING_JOBS_EDIT', 'STEAMING_JOBS_DELETE'] }
  },
  {
    path: "job-order/monitor/:id/:steam_id",
    component: SteamJobOrderTaskMonitorComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['STEAMING_BAY_OVERVIEW_DELETE', 'STEAMING_BAY_OVERVIEW_EDIT', 'STEAMING_BAY_OVERVIEW_VIEW'] }
  },
  // below is not using anymore
  {
    path: "approval",
    component: SteamApprovalComponent,
  },
  {
    path: "estimate",
    component: SteamEstimateComponent,
  },
  {
    path: "estimate/new/:id",
    component: SteamEstimateNewComponent,
  },
  {
    path: "approval/view/:id",
    component: SteamApprovalViewComponent,
  },
  {
    path: "job-order/:idx",
    component: JobOrderSteamComponent,
  },
];