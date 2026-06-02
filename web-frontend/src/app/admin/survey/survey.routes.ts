import { Routes } from "@angular/router";

export const SURVEY_ROUTE: Routes = [
  {
    path: "others",
    loadChildren: () =>
      import("./others/others.routes")
        .then(m => m.OTHERS_ROUTES)
  },
  {
    path: "periodic-test",
    loadChildren: () =>
      import("./periodic-test/periodic-test.routes")
        .then(m => m.PERIODIC_TEST_ROUTES)
  }
];