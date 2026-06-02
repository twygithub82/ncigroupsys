import { Routes } from "@angular/router";
export const MANAGEMENT_REPORTS_ROUTES: Routes = [
  {
    path: "yearly",
    loadChildren: () =>
      import("./yearly/yearly.routes")
        .then(m => m.YEARLY_ROUTES)
  },
  {
    path: "monthly",
    loadChildren: () =>
      import("./monthly/monthly.routes")
        .then(m => m.MONTHLY_ROUTES)
  },
  {
    path: "performance",
    loadChildren: () =>
      import("./performance/performance.routes")
        .then(m => m.PERFORMANCE_ROUTES)
  },
  {
    path: "order-track",
    loadChildren: () =>
      import("./order_track/order-track.routes")
        .then(m => m.ORDER_TRACK_ROUTES)
  }
];