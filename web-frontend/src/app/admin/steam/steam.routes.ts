import { Routes } from "@angular/router";
import { SteamApprovalViewComponent } from "./approval-view/approval-view.component";
import { SteamApprovalComponent } from "./approval/approval.component";
import { SteamEstimateApprovalNewComponent } from "./estimate-approval-new/estimate-approval-new.component";
import { SteamEstimateApprovalComponent } from "./estimate-approval/estimate-approval.component";
import { SteamEstimateNewComponent } from "./estimate-new/estimate-new.component";
import { SteamQCViewComponent } from "./estimate-qc/estimate-qc.component";
import { SteamEstimateComponent } from "./estimate/estimate.component";
import { JobOrderAllocationSteamComponent } from "./job-order-allocation/job-order-allocation.component";
import { SteamJobOrderTaskMonitorComponent } from "./job-order-monitor/job-order-task-monitor.component";
import { SteamJobOrderTaskDetailsComponent } from "./job-order-task-details/job-order-task-details.component";
import { JobOrderSteamComponent } from "./job-order/job-order.component";

export const STEAM_ROUTE: Routes = [
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
    path: "estimate-approval",
    component: SteamEstimateApprovalComponent,
  },
  {
    path: "estimate-approval/new/:id",
    component: SteamEstimateApprovalNewComponent,
  },
  {
    path: "job-order",
    component: JobOrderSteamComponent,
  },
  {
    path: "job-order/:idx",
    component: JobOrderSteamComponent,
  },
  {
    path: "job-order/allocation/:id",
    component: JobOrderAllocationSteamComponent,
  },
  {
    path: "job-order/task/:id/:steam_id",
    component: SteamJobOrderTaskDetailsComponent,
  },
  {
    path: "job-order/monitor/:id/:steam_id",
    component: SteamJobOrderTaskMonitorComponent,
  },
  {
    path: "qc/view/:id",
    component: SteamQCViewComponent,
  },
];