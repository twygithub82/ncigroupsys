import { Routes } from "@angular/router";
import { CleaningCategoryComponent } from "./cleaning-category/cleaning-category.component";
import { CleaningMethodsComponent } from "./cleaning-methods/cleaning-methods.component";
import { CleaningFormulasComponent } from "./cleaning-formula/cleaning-formulas.component";
import { AuthGuard } from "@core/guard/auth.guard";

export const PARAMETER_ROUTE: Routes = [
  {
    path: "cleaning-category",
    component: CleaningCategoryComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['CLEANING_MANAGEMENT_CLEANING_CATEGORY_VIEW', 'CLEANING_MANAGEMENT_CLEANING_CATEGORY_EDIT', 'CLEANING_MANAGEMENT_CLEANING_CATEGORY_DELETE', 'CLEANING_MANAGEMENT_CLEANING_CATEGORY_ADD'] }
  },
  {
    path: "cleaning-methods",
    component: CleaningMethodsComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['CLEANING_MANAGEMENT_CLEANING_PROCESS_VIEW', 'CLEANING_MANAGEMENT_CLEANING_PROCESS_EDIT', 'CLEANING_MANAGEMENT_CLEANING_PROCESS_DELETE', 'CLEANING_MANAGEMENT_CLEANING_PROCESS_ADD'] }
  },
  {
    path: "cleaning-formulas",
    component: CleaningFormulasComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['CLEANING_MANAGEMENT_CLEANING_FORMULA_VIEW', 'CLEANING_MANAGEMENT_CLEANING_FORMULA_EDIT', 'CLEANING_MANAGEMENT_CLEANING_FORMULA_DELETE', 'CLEANING_MANAGEMENT_CLEANING_FORMULA_ADD'] }
  },
];