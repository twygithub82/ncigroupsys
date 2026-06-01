import { Routes } from "@angular/router";

import { AuthGuard } from "@core/guard/auth.guard";
import { MainDailyTeamComponent } from "./main-daily-team.component";

export const MAIN_DAILY_TEAM_ROUTES: Routes = [
   {
        path: "",
        component: MainDailyTeamComponent,
        canActivate: [AuthGuard],
        data: { expectedFunctions: ['ADMIN_REPORTS_DAILY_TEAM_REPORTS_VIEW'] }
    },
];