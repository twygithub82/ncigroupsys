import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { MainPackageCleaningComponent } from "./main-package-clean.component";

export const PACKAGE_CLEANING_ROUTES: Routes = [
  {
    path: "",
    component: MainPackageCleaningComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'PACKAGE_BUFFER_CLEANING_VIEW',
        'PACKAGE_BUFFER_CLEANING_EDIT',
        'PACKAGE_BUFFER_CLEANING_DELETE',
        'PACKAGE_CLEANING_DELETE',
        'PACKAGE_CLEANING_VIEW',
        'PACKAGE_CLEANING_EDIT',
        'PACKAGE_RESIDUE_DISPOSAL_DELETE',
        'PACKAGE_RESIDUE_DISPOSAL_EDIT',
        'PACKAGE_RESIDUE_DISPOSAL_VIEW'
      ]
    }
  }
];