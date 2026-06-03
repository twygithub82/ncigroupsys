import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";

import { CleaningCategoryComponent } from "./cleaning-category.component";

export const CLEANING_CATEGORY_ROUTES: Routes = [
  {
    path: "",
    component: CleaningCategoryComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        "CLEANING_MANAGEMENT_CLEANING_CATEGORY_VIEW",
        "CLEANING_MANAGEMENT_CLEANING_CATEGORY_EDIT",
        "CLEANING_MANAGEMENT_CLEANING_CATEGORY_DELETE",
        "CLEANING_MANAGEMENT_CLEANING_CATEGORY_ADD"
      ]
    }
  }
];