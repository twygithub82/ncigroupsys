import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { SurveyPeriodicTestComponent } from "./survey-periodic-test.component";
import { SurveyPeriodicTestDetailsComponent } from "../periodic-test-details/survey-periodic-test-details.component";

export const PERIODIC_TEST_ROUTES: Routes = [
  {
    path: "",
    component: SurveyPeriodicTestComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'SURVEY_PERIODIC_TEST_SURVEY_VIEW',
        'SURVEY_PERIODIC_TEST_SURVEY_EDIT',
        'SURVEY_PERIODIC_TEST_SURVEY_DELETE'
      ]
    }
  },
  {
    path: ":id",
    component: SurveyPeriodicTestComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'SURVEY_PERIODIC_TEST_SURVEY_VIEW',
        'SURVEY_PERIODIC_TEST_SURVEY_EDIT',
        'SURVEY_PERIODIC_TEST_SURVEY_DELETE'
      ]
    }
  },
  {
    path: "details/:id",
    component: SurveyPeriodicTestDetailsComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'SURVEY_PERIODIC_TEST_SURVEY_VIEW',
        'SURVEY_PERIODIC_TEST_SURVEY_EDIT',
        'SURVEY_PERIODIC_TEST_SURVEY_DELETE'
      ]
    }
  }
];