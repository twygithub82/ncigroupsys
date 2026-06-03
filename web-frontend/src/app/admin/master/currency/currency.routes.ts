import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";

import { MainCurrencyComponent } from "./main-currency.component";

export const CURRENCY_ROUTES: Routes = [
  {
    path: "",
    component: MainCurrencyComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        "MASTER_CURRENCY_EDIT",
        "MASTER_CURRENCY_ADD",
        "MASTER_CURRENCY_DELETE",
        "MASTER_CURRENCY_VIEW"
      ]
    }
  }
];