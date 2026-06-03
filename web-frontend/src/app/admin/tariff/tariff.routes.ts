import { Routes } from "@angular/router";

export const TARIFF_ROUTE: Routes = [
  {
    path: "tariff-cleaning",
    loadChildren: () =>
      import("./tariff-cleaning/tariff-cleaning.routes").then(
        m => m.TARIFF_CLEANING_ROUTES
      )
  },
  {
    path: "tariff-depot",
    loadChildren: () =>
      import("./tariff-depot/tariff-depot.routes").then(
        m => m.TARIFF_DEPOT_ROUTES
      )
  },
  {
    path: "tariff-repair",
    loadChildren: () =>
      import("./tariff-repair/tariff-repair.routes").then(
        m => m.TARIFF_REPAIR_ROUTES
      )
  },
  {
    path: "tariff-steam",
    loadChildren: () =>
      import("./tariff-steam/tariff-steam.routes").then(
        m => m.TARIFF_STEAM_ROUTES
      )
  }
];