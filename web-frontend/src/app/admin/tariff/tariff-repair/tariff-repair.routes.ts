import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";

import { TariffRepairComponent } from "./tariff-repair.component";

export const TARIFF_REPAIR_ROUTES: Routes = [
  {
    path: "",
    component: TariffRepairComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'TARIFF_REPAIR_VIEW',
        'TARIFF_REPAIR_ADD',
        'TARIFF_REPAIR_DELETE',
        'TARIFF_REPAIR_EDIT'
      ]
    }
  }
];