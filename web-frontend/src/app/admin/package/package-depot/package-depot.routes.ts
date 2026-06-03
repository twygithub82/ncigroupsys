import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { MainPackageDepotComponent } from "./main-package-depot.component";

export const PACKAGE_DEPOT_ROUTES: Routes = [
  {
    path: "",
    component: MainPackageDepotComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'PACKAGE_DEPOT_COST_VIEW',
        'PACKAGE_DEPOT_COST_EDIT',
        'PACKAGE_DEPOT_COST_DELETE',
        'PACKAGE_LABOUR_COST_VIEW',
        'PACKAGE_LABOUR_COST_EDIT',
        'PACKAGE_LABOUR_COST_DELETE'
      ]
    }
  }
];