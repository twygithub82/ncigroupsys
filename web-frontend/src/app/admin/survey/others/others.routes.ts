import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { SurveyOthersComponent } from "./survey-others.component";
import { SurveyOthersDetailsComponent } from "../others-details/survey-others-details.component";

export const OTHERS_ROUTES: Routes = [
  {
    path: "",
    component: SurveyOthersComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'SURVEY_OTHERS_SURVEY_EDIT',
        'SURVEY_OTHERS_SURVEY_DELETE',
        'SURVEY_OTHERS_SURVEY_VIEW'
      ]
    }
  },
  {
    path: "details/:id",
    component: SurveyOthersDetailsComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'SURVEY_OTHERS_SURVEY_EDIT',
        'SURVEY_OTHERS_SURVEY_DELETE',
        'SURVEY_OTHERS_SURVEY_VIEW'
      ]
    }
  }
];