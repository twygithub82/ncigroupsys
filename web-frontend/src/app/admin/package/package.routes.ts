import { Routes } from "@angular/router";

export const PACKAGE_ROUTE: Routes = [
  {
    path: "package-cleaning",
    loadChildren: () =>
      import("./package-cleaning/package-cleaning.routes").then(
        m => m.PACKAGE_CLEANING_ROUTES
      )
  },
  {
    path: "package-depot",
    loadChildren: () =>
      import("./package-depot/package-depot.routes").then(
        m => m.PACKAGE_DEPOT_ROUTES
      )
  },
  {
    path: "package-repair",
    loadChildren: () =>
      import("./package-repair/package-repair.routes").then(
        m => m.PACKAGE_REPAIR_ROUTES
      )
  },
  {
    path: "package-steam",
    loadChildren: () =>
      import("./package-steam/package-steam.routes").then(
        m => m.PACKAGE_STEAM_ROUTES
      )
  }
];