// out-gate-main.routes.ts
import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { OutGateMainComponent } from "./out-gate-main.component";
import { OutGateDetailsComponent } from "../out-gate-details/out-gate-details.component";
import { OutGateSurveyFormComponent } from "../out-gate-survey-form/out-gate-survey-form.component";

export const OUT_GATE_MAIN_ROUTES: Routes = [
  {
    path: "",
    component: OutGateMainComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "details/:id",
    component: OutGateDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "survey-form/:id/:roSotId",
    component: OutGateSurveyFormComponent,
    canActivate: [AuthGuard]
  }
];