import { Routes } from "@angular/router";
import { MainStatusComponent } from "./main-status.component";
import { AuthGuard } from "@core/guard/auth.guard";

export const STATUS_ROUTES: Routes = [
 {
    path: "",
    component: MainStatusComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['REPORTS_LOCATION_STATUS_VIEW', 'REPORTS_YARD_STATUS_VIEW'] }
  },
];