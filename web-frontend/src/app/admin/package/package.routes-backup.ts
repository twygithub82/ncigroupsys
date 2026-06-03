import { Routes } from "@angular/router";
import { MainPackageCleaningComponent } from "./package-cleaning/main-package-clean.component";
import { MainPackageDepotComponent } from "./package-depot/main-package-depot.component";
import { PackageRepairComponent } from "./package-repair/package-repair.component";
import { MainPackageSteamComponent } from "./package-steam/main-package-steam.component";
import { AuthGuard } from "@core/guard/auth.guard";

export const PACKAGE_ROUTE: Routes = [
  {
    path: "package-cleaning",
    component: MainPackageCleaningComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['PACKAGE_BUFFER_CLEANING_VIEW', 'PACKAGE_BUFFER_CLEANING_EDIT', 'PACKAGE_BUFFER_CLEANING_DELETE', 'PACKAGE_CLEANING_DELETE', 'PACKAGE_CLEANING_VIEW', 'PACKAGE_CLEANING_EDIT', 'PACKAGE_RESIDUE_DISPOSAL_DELETE', 'PACKAGE_RESIDUE_DISPOSAL_EDIT', 'PACKAGE_RESIDUE_DISPOSAL_VIEW'] }
  },
  {
    path: "package-depot",
    component: MainPackageDepotComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['PACKAGE_DEPOT_COST_VIEW', 'PACKAGE_DEPOT_COST_EDIT', 'PACKAGE_DEPOT_COST_DELETE', 'PACKAGE_LABOUR_COST_VIEW', 'PACKAGE_LABOUR_COST_EDIT', 'PACKAGE_LABOUR_COST_DELETE'] }
  },
  // {
  //   path: "package-labour",
  //   component: PackageLabourComponent,
  // },
  // {
  //   path: "package-residue",
  //   component: PackageResidueComponent,
  // },
  {
    path: "package-repair",
    component: PackageRepairComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['PACKAGE_REPAIR_EDIT', 'PACKAGE_REPAIR_DELETE', 'PACKAGE_REPAIR_VIEW', 'PACKAGE_REPAIR_COST', 'PACKAGE_REPAIR_HOUR', 'PACKAGE_REPAIR_REMARKS', 'PACKAGE_REPAIR_COST_PERCENTAGE', 'PACKAGE_REPAIR_HOUR_PERCENTAGE'] }
  },
  {
    path: "package-steam",
    component: MainPackageSteamComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['PACKAGE_STEAMING_VIEW', 'PACKAGE_STEAMING_EDIT', 'PACKAGE_STEAMING_DELETE', 'PACKAGE_STEAMING_EXCLUSIVE_DELETE', 'PACKAGE_STEAMING_EXCLUSIVE_VIEW', 'PACKAGE_STEAMING_EXCLUSIVE_EDIT'] }
  },
  // {
  //   path: "exclusive-steam",
  //   component: ExclusiveSteamComponent,
  // },
  // {
  //   path: "package-buffer",
  //   component: PackageBufferComponent,
  // },
];