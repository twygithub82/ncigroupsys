import { Routes } from "@angular/router";
import { SurveyOthersDetailsComponent } from "./others-details/survey-others-details.component";
import { SurveyOthersComponent } from "./others/survey-others.component";
import { SurveyPeriodicTestDetailsComponent } from "./periodic-test-details/survey-periodic-test-details.component";
import { SurveyPeriodicTestComponent } from "./periodic-test/survey-periodic-test.component";

export const SURVEY_ROUTE: Routes = [
  {
    path: "others",
    component: SurveyOthersComponent,
  },
  {
    path: "others/details/:id",
    component: SurveyOthersDetailsComponent,
  },
  {
    path: "periodic-test",
    component: SurveyPeriodicTestComponent,
  },
  {
    path: "periodic-test/details/:id",
    component: SurveyPeriodicTestDetailsComponent,
  },
];