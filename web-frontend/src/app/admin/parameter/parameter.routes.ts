import { Routes } from "@angular/router";

export const PARAMETER_ROUTE: Routes = [
  {
    path: "cleaning-category",
    loadChildren: () =>
      import("./cleaning-category/cleaning-category.routes").then(
        m => m.CLEANING_CATEGORY_ROUTES
      )
  },
  {
    path: "cleaning-methods",
    loadChildren: () =>
      import("./cleaning-methods/cleaning-methods.routes").then(
        m => m.CLEANING_METHODS_ROUTES
      )
  },
  {
    path: "cleaning-formulas",
    loadChildren: () =>
      import("./cleaning-formula/cleaning-formulas.routes").then(
        m => m.CLEANING_FORMULAS_ROUTES
      )
  }
];