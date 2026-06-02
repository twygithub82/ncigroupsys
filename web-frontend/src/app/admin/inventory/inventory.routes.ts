// inventory.routes.ts
import { Routes } from "@angular/router";

export const INVENTORY_ROUTE: Routes = [
  {
    path: "storing-order",
    loadChildren: () =>
      import("./storing-order/storing-order.routes")
        .then(m => m.STORING_ORDER_ROUTES)
  },
  {
    path: "in-gate-main",
    loadChildren: () =>
      import("./in-gate-main/in-gate-main.routes")
        .then(m => m.IN_GATE_MAIN_ROUTES)
  },
  {
    path: "tank-movement",
    loadChildren: () =>
      import("./tank-movement/tank-movement.routes")
        .then(m => m.TANK_MOVEMENT_ROUTES)
  },
  {
    path: "out-gate-main",
    loadChildren: () =>
      import("./out-gate-main/out-gate-main.routes")
        .then(m => m.OUT_GATE_MAIN_ROUTES)
  },
  {
    path: "booking",
    loadChildren: () =>
      import("./booking-new/booking-new.routes")
        .then(m => m.BOOKING_ROUTES)
  },
  {
    path: "scheduling",
    loadChildren: () =>
      import("./scheduling-new/scheduling-new.routes")
        .then(m => m.SCHEDULING_ROUTES)
  },
  {
    path: "release-order",
    loadChildren: () =>
      import("./release-order/release-order.routes")
        .then(m => m.RELEASE_ORDER_ROUTES)
  },
  {
    path: "transfer",
    loadChildren: () =>
      import("./transfer/transfer.routes")
        .then(m => m.TRANSFER_ROUTES)
  }
];