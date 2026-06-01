import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { MainZeroApprovalCostComponent } from "./main-zero-approval-cost.component";

export const MAIN_ZERO_APPROVAL_ROUTES: Routes = [
   {
         path: "",
         component: MainZeroApprovalCostComponent,
         canActivate: [AuthGuard],
         data: { expectedFunctions: ['ADMIN_REPORTS_ZERO_APPROVAL_COST_REPORT_VIEW'] }
     }
];