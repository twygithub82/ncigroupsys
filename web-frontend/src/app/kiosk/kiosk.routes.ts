import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { InGateComponent } from "./in-gate/in-gate.component";
import { InGateDetailsComponent } from "./in-gate-details/in-gate-details.component";

export const KIOSK_ROUTE: Routes = [
  {
    path: '',
    redirectTo: 'in-gate',
    pathMatch: 'full'
  },
  {
    path: "in-gate",
    component: InGateComponent,
    canActivate: [],
  },
  {
    path: "in-gate-details/:id",
    component: InGateDetailsComponent,
    canActivate: [],
  },
];