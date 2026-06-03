import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";

import { CleaningApprovalComponent } from "./approval.component";

export const CLEANING_APPROVAL_ROUTES: Routes = [
  {
    path: "",
    component: CleaningApprovalComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        "CLEANING_APPROVAL_EDIT",
        "CLEANING_APPROVAL_DELETE",
        "CLEANING_APPROVAL_VIEW"
      ]
    }
  }
];