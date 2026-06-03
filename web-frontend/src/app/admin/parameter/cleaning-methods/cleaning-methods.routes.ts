import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";

import { CleaningMethodsComponent } from "./cleaning-methods.component";

export const CLEANING_METHODS_ROUTES: Routes = [
  {
    path: "",
    component: CleaningMethodsComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        "CLEANING_MANAGEMENT_CLEANING_PROCESS_VIEW",
        "CLEANING_MANAGEMENT_CLEANING_PROCESS_EDIT",
        "CLEANING_MANAGEMENT_CLEANING_PROCESS_DELETE",
        "CLEANING_MANAGEMENT_CLEANING_PROCESS_ADD"
      ]
    }
  }
];