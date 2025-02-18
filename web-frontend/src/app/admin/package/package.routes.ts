import { Routes } from "@angular/router";
import { MainPackageCleaningComponent } from "./package-cleaning/main-package-clean.component";
import { MainPackageDepotComponent } from "./package-depot/main-package-depot.component";
import { PackageRepairComponent } from "./package-repair/package-repair.component";
import { MainPackageSteamComponent } from "./package-steam/main-package-steam.component";

export const PACKAGE_ROUTE: Routes = [
  {
    path: "package-cleaning",
    component: MainPackageCleaningComponent,
  },
  {
    path: "package-depot",
    component: MainPackageDepotComponent,
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
  },
  {
    path: "package-steam",
    component: MainPackageSteamComponent,
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