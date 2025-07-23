import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { InGateComponent } from "./in-gate/in-gate.component";
import { InGateDetailsComponent } from "./in-gate-details/in-gate-details.component";
import { OutGateComponent } from "./out-gate/out-gate.component";
import { OutGateDetailsComponent } from "./out-gate-details/out-gate-details.component";

export const KIOSK_ROUTE: Routes = [
  {
    path: "in-gate",
    component: InGateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "in-gate-details/:id",
    component: InGateDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "out-gate",
    component: OutGateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "out-gate-details/:id",
    component: OutGateDetailsComponent,
    canActivate: [AuthGuard],
  },
];