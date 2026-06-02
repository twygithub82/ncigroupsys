import { Routes } from "@angular/router";

export const REPAIR_ROUTE: Routes = [
  {
    path: "estimate",
    loadChildren: () =>
      import("./estimate/estimate.routes").then(m => m.ESTIMATE_ROUTES)
  },
  {
    path: "approval",
    loadChildren: () =>
      import("./approval/approval.routes").then(m => m.APPROVAL_ROUTES)
  },
  {
    path: "client-approval",
    loadChildren: () =>
      import("./client-approval/client-approval.routes").then(m => m.CLIENT_APPROVAL_ROUTES)
  },
  {
    path: "job-order",
    loadChildren: () =>
      import("./job-order/job-order.routes").then(m => m.JOB_ORDER_ROUTES)
  }
];