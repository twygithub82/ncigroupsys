import { Routes } from "@angular/router";
import { CleaningApprovalComponent } from "./cleaning-approval/approval.component";
import { CleaningJobOrderTaskDetailsComponent } from "./job-order-task-details/job-order-task-details.component";
import { JobOrderCleaningComponent } from "./job-order/job-order.component";

export const CLEANING_ROUTE: Routes = [
  {
    path: "approval",
    component: CleaningApprovalComponent,
  },
  {
    path: "job-order",
    component: JobOrderCleaningComponent,
  },
  {
    path: "job-order/task/:id/:clean_id",
    component: CleaningJobOrderTaskDetailsComponent,
  },
];