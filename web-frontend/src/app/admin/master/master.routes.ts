import { Routes } from "@angular/router";

export const MASTER_ROUTE: Routes = [
  {
    path: "estimate-template",
    loadChildren: () =>
      import("./estimate-template/estimate-template.routes").then(
        m => m.ESTIMATE_TEMPLATE_ROUTES
      )
  },
  {
    path: "customer",
    loadChildren: () =>
      import("./customer/customer.routes").then(
        m => m.CUSTOMER_ROUTES
      )
  },
  {
    path: "unit-type",
    loadChildren: () =>
      import("./tank/unit-type.routes").then(
        m => m.UNIT_TYPE_ROUTES
      )
  },
  {
    path: "currency",
    loadChildren: () =>
      import("./currency/currency.routes").then(
        m => m.CURRENCY_ROUTES
      )
  }
];