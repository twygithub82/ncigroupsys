import { Routes } from "@angular/router";
import { MainTankSurveyComponent } from "./main-tank-survey.component";
import { AuthGuard } from "@core/guard/auth.guard";

export const TANK_SURVEY_ROUTES: Routes = [
  {
    path: '',
    component: MainTankSurveyComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['REPORTS_TANK_SURVEY_VIEW'] }
  },
];