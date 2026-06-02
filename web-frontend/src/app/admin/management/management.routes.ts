import { Routes } from "@angular/router";

export const MANAGEMENT_ROUTE: Routes = [
  {
    path: "reports",
    loadChildren: () =>
      import("./reports/reports.routes")
        .then(m => m.MANAGEMENT_REPORTS_ROUTES)
  }
];