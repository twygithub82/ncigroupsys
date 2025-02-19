import { Routes } from "@angular/router";
import { CleaningApprovalComponent } from "./cleaning-approval/approval.component";
import { JobOrderCleaningComponent } from "./job-order/job-order.component";

export const CLEANING_ROUTE: Routes = [
  {
    path: "approval",
    component: CleaningApprovalComponent,
  },
  {
    path: "job-order",
    component: JobOrderCleaningComponent,
  }
];