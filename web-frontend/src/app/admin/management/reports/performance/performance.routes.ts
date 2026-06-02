import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { MainManagementPerformanceComponent } from "./main-management-performance.component";

export const PERFORMANCE_ROUTES: Routes = [
  {
    path: "",
    component: MainManagementPerformanceComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'MANAGEMENT_MAN_HOUR_VIEW'
      ]
    }
  }
];