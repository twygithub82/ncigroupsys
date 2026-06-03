import { Routes } from "@angular/router";

export const CLEANING_ROUTE: Routes = [
  {
    path: "approval",
    loadChildren: () =>
      import("./cleaning-approval/cleaning-approval.routes").then(
        m => m.CLEANING_APPROVAL_ROUTES
      )
  },
  {
    path: "job-order",
    loadChildren: () =>
      import("./job-order/job-order.routes").then(
        m => m.JOB_ORDER_ROUTES
      )
  }
];