import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";

import { CleaningFormulasComponent } from "./cleaning-formulas.component";

export const CLEANING_FORMULAS_ROUTES: Routes = [
  {
    path: "",
    component: CleaningFormulasComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        "CLEANING_MANAGEMENT_CLEANING_FORMULA_VIEW",
        "CLEANING_MANAGEMENT_CLEANING_FORMULA_EDIT",
        "CLEANING_MANAGEMENT_CLEANING_FORMULA_DELETE",
        "CLEANING_MANAGEMENT_CLEANING_FORMULA_ADD"
      ]
    }
  }
];