import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";

import { JobOrderCleaningComponent } from "./job-order.component";

export const JOB_ORDER_ROUTES: Routes = [
  {
    path: "",
    component: JobOrderCleaningComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        "CLEANING_BAY_OVERVIEW_DELETE",
        "CLEANING_BAY_OVERVIEW_VIEW",
        "CLEANING_BAY_OVERVIEW_EDIT",
        "CLEANING_JOB_ALLOCATION_VIEW",
        "CLEANING_JOB_ALLOCATION_EDIT",
        "CLEANING_JOB_ALLOCATION_DELETE"
      ]
    }
  }
];