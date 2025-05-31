import { Routes } from "@angular/router";
import { SurveyOthersDetailsComponent } from "./others-details/survey-others-details.component";
import { SurveyOthersComponent } from "./others/survey-others.component";
import { SurveyPeriodicTestDetailsComponent } from "./periodic-test-details/survey-periodic-test-details.component";
import { SurveyPeriodicTestComponent } from "./periodic-test/survey-periodic-test.component";
import { AuthGuard } from "@core/guard/auth.guard";

export const SURVEY_ROUTE: Routes = [
  {
    path: "others",
    component: SurveyOthersComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['SURVEY_OTHERS_SURVEY_EDIT', 'SURVEY_OTHERS_SURVEY_DELETE', 'SURVEY_OTHERS_SURVEY_VIEW'] }
  },
  {
    path: "others/details/:id",
    component: SurveyOthersDetailsComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['SURVEY_OTHERS_SURVEY_EDIT', 'SURVEY_OTHERS_SURVEY_DELETE', 'SURVEY_OTHERS_SURVEY_VIEW'] }
  },
  {
    path: "periodic-test",
    component: SurveyPeriodicTestComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['SURVEY_PERIODIC_TEST_SURVEY_VIEW', 'SURVEY_PERIODIC_TEST_SURVEY_EDIT', 'SURVEY_PERIODIC_TEST_SURVEY_DELETE'] }
  },
  {
    path: "periodic-test/details/:id",
    component: SurveyPeriodicTestDetailsComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['SURVEY_PERIODIC_TEST_SURVEY_VIEW', 'SURVEY_PERIODIC_TEST_SURVEY_EDIT', 'SURVEY_PERIODIC_TEST_SURVEY_DELETE'] }
  },
];