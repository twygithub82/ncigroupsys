import { Routes } from "@angular/router";

import { AuthGuard } from "@core/guard/auth.guard";


import { MainPerformanceComponent } from "./main-performance.component";

export const MAIN_PERFORMANCE_ROUTES: Routes = [
   {
           path: "",
           component: MainPerformanceComponent,
           canActivate: [AuthGuard],
           data: { expectedFunctions: ['ADMIN_REPORTS_SURVEYOR_VIEW', 'ADMIN_REPORTS_STEAM_VIEW', 'ADMIN_REPORTS_CLEANER_VIEW'] }
       },
];