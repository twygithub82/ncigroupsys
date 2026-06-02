// in-gate-main.routes.ts
import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { InGateMainComponent } from "./in-gate-main.component";
import { InGateDetailsComponent } from "../in-gate-details/in-gate-details.component";
import { InGateSurveyFormComponent } from "../in-gate-survey-form/in-gate-survey-form.component";

export const IN_GATE_MAIN_ROUTES: Routes = [
  {
    path: "",
    component: InGateMainComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        "INVENTORY_IN_GATE_VIEW",
        "INVENTORY_IN_GATE_EDIT",
        "INVENTORY_IN_GATE_DELETE",
        "INVENTORY_IN_GATE_SURVEY_VIEW",
        "INVENTORY_IN_GATE_SURVEY_EDIT",
        "INVENTORY_IN_GATE_SURVEY_DELETE",
        "INVENTORY_IN_GATE_SURVEY_PUBLISH"
      ]
    }
  },
  {
    path: "details/:id",
    component: InGateDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "survey-form/:id",
    component: InGateSurveyFormComponent,
    canActivate: [AuthGuard]
  }
];