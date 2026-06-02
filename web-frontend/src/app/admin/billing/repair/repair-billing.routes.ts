import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { RepairBillingComponent } from "./repair-billing.component";

export const REPAIR_ROUTES: Routes = [
  {
    path: "",
    component: RepairBillingComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'BILLING_REPAIR_EDIT',
        'BILLING_REPAIR_VIEW',
        'BILLING_REPAIR_DELETE'
      ]
    }
  }
];