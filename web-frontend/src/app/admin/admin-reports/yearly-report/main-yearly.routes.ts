import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { MainYearlyComponent } from "./main-yearly.component";

export const MAIN_YEARLY_ROUTES: Routes = [
   {
         path: "",
         component: MainYearlyComponent,
         canActivate: [AuthGuard],
         data: { expectedFunctions: ['ADMIN_REPORTS_CLEANING_REPORT_VIEW', 'ADMIN_REPORTS_REPAIR_REPORT_VIEW', 'ADMIN_REPORTS_RESIDUE_DISPOSAL_REPORT_VIEW', 'ADMIN_REPORTS_STEAM_REPORT_VIEW'] }
     },
];