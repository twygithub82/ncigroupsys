import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";

import { UnitTypeComponent } from "./unit-type.component";

export const UNIT_TYPE_ROUTES: Routes = [
  {
    path: "",
    component: UnitTypeComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        "MASTER_UNIT_TYPE_EDIT",
        "MASTER_UNIT_TYPE_ADD",
        "MASTER_UNIT_TYPE_DELETE",
        "MASTER_UNIT_TYPE_VIEW"
      ]
    }
  }
];