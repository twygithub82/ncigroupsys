import { Routes } from "@angular/router";

export const STEAM_ROUTE: Routes = [
  {
    path: "estimate-approval",
    loadChildren: () =>
      import("./estimate-approval/estimate-approval.routes").then(
        m => m.ESTIMATE_APPROVAL_ROUTES
      )
  },
  {
    path: "client-approval",
    loadChildren: () =>
      import("./client-approval/client-approval.routes").then(
        m => m.CLIENT_APPROVAL_ROUTES
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