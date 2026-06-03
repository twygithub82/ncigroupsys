import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { PackageRepairComponent } from "./package-repair.component";

export const PACKAGE_REPAIR_ROUTES: Routes = [
  {
    path: "",
    component: PackageRepairComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'PACKAGE_REPAIR_EDIT',
        'PACKAGE_REPAIR_DELETE',
        'PACKAGE_REPAIR_VIEW',
        'PACKAGE_REPAIR_COST',
        'PACKAGE_REPAIR_HOUR',
        'PACKAGE_REPAIR_REMARKS',
        'PACKAGE_REPAIR_COST_PERCENTAGE',
        'PACKAGE_REPAIR_HOUR_PERCENTAGE'
      ]
    }
  }
];