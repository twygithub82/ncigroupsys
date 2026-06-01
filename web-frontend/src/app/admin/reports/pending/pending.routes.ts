import { Routes } from "@angular/router";
import { MainPendingComponent } from "./main-pending.component";
import { AuthGuard } from "@core/guard/auth.guard";

export const PENDING_ROUTES: Routes = [
 {
    path: "",
    component: MainPendingComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['REPORTS_PENDING_ESTIMATE_VIEW'] }
  },
];