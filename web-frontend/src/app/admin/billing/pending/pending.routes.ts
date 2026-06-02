import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { MainPendingComponent } from "./main-pending.component";

export const PENDING_ROUTES: Routes = [
  {
    path: "",
    component: MainPendingComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'BILLING_PENDING_INVOICES_VIEW'
      ]
    }
  }
];