import { Routes } from "@angular/router";
import { CleaningApprovalComponent } from "./cleaning-approval/approval.component";
import { JobOrderCleaningComponent } from "./job-order/job-order.component";
import { AuthGuard } from "@core/guard/auth.guard";

export const CLEANING_ROUTE: Routes = [
  {
    path: "approval",
    component: CleaningApprovalComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['CLEANING_APPROVAL_EDIT', 'CLEANING_APPROVAL_DELETE', 'CLEANING_APPROVAL_VIEW'] }
  },
  {
    path: "job-order",
    component: JobOrderCleaningComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['CLEANING_BAY_OVERVIEW_DELETE', 'CLEANING_BAY_OVERVIEW_VIEW', 'CLEANING_BAY_OVERVIEW_EDIT', 'CLEANING_JOB_ALLOCATION_VIEW', 'CLEANING_JOB_ALLOCATION_EDIT', 'CLEANING_JOB_ALLOCATION_DELETE'] }
  }
];