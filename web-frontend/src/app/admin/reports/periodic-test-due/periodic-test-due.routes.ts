import { Routes } from "@angular/router";
import { MainPeriodicTestDueComponent } from "./main-periodic-test-due.component";
import { AuthGuard } from "@core/guard/auth.guard";

export const PERIODIC_TEST_DUE_ROUTES: Routes = [
  {
     path: "",
     component: MainPeriodicTestDueComponent,
     canActivate: [AuthGuard],
     data: { expectedFunctions: ['REPORTS_PERIODIC_TEST_DUE_VIEW'] }
   }
];