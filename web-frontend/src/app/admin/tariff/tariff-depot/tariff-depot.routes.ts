import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";

import { MainTariffDepotComponent } from "./main-tariff-depot.component";

export const TARIFF_DEPOT_ROUTES: Routes = [
  {
    path: "",
    component: MainTariffDepotComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'TARIFF_DEPOT_COST_ADD',
        'TARIFF_DEPOT_COST_EDIT',
        'TARIFF_DEPOT_COST_VIEW',
        'TARIFF_DEPOT_COST_DELETE',
        'TARIFF_LABOUR_COST_VIEW',
        'TARIFF_LABOUR_COST_EDIT',
        'TARIFF_LABOUR_COST_DELETE',
        'TARIFF_LABOUR_COST_ADD'
      ]
    }
  }
];