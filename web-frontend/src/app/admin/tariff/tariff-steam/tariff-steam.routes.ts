import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";

import { TariffSteamComponent } from "./tariff-steam.component";

export const TARIFF_STEAM_ROUTES: Routes = [
  {
    path: "",
    component: TariffSteamComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'TARIFF_STEAMING_VIEW',
        'TARIFF_STEAMING_EDIT',
        'TARIFF_STEAMING_DELETE',
        'TARIFF_STEAMING_ADD'
      ]
    }
  }
];