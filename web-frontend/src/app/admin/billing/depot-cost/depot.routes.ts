import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { MainDepotComponent } from "./main-depot.component";

export const DEPOT_ROUTES: Routes = [
  {
    path: "",
    component: MainDepotComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'BILLING_IN_GATE_OUT_GATE_DELETE',
        'BILLING_IN_GATE_OUT_GATE_EDIT',
        'BILLING_IN_GATE_OUT_GATE_VIEW',
        'BILLING_LOLO_VIEW',
        'BILLING_LOLO_EDIT',
        'BILLING_LOLO_DELETE',
        'BILLING_PRE_INSPECTION_VIEW',
        'BILLING_PRE_INSPECTION_EDIT',
        'BILLING_PRE_INSPECTION_DELETE',
        'BILLING_STORAGE_VIEW',
        'BILLING_STORAGE_EDIT',
        'BILLING_STORAGE_DELETE'
      ]
    }
  }
];