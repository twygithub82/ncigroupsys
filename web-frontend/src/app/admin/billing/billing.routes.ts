import { Routes } from "@angular/router";

export const BILLING_ROUTE: Routes = [
  {
    path: "depot",
    loadChildren: () =>
      import("./depot-cost/depot.routes").then(m => m.DEPOT_ROUTES)
  },
  {
    path: "clean",
    loadChildren: () =>
      import("./cleaning/cleaning.routes").then(m => m.CLEANING_ROUTES)
  },
  {
    path: "repair",
    loadChildren: () =>
      import("./repair/repair-billing.routes").then(m => m.REPAIR_ROUTES)
  },
  {
    path: "invoices",
    loadChildren: () =>
      import("./invoice/invoices.routes").then(m => m.INVOICE_ROUTES)
  },
  {
    path: "pending",
    loadChildren: () =>
      import("./pending/pending.routes").then(m => m.PENDING_ROUTES)
  },
  {
    path: "residue",
    loadChildren: () =>
      import("./residue-disposal/residue-billing.routes").then(m => m.RESIDUE_ROUTES)
  },
  {
    path: "steam",
    loadChildren: () =>
      import("./steam/steam-billing.routes").then(m => m.STEAM_ROUTES)
  },
  {
    path: "billed-tank",
    loadChildren: () =>
      import("./billed-tank/billed-tank.routes").then(m => m.BILLED_TANK_ROUTES)
  }
];