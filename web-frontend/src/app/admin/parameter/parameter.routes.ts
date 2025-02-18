import { Routes } from "@angular/router";
import { CleaningCategoryComponent } from "./cleaning-category/cleaning-category.component";
import { CleaningMethodsComponent } from "./cleaning-methods/cleaning-methods.component";

export const PARAMETER_ROUTE: Routes = [
  {
    path: "cleaning-category",
    component: CleaningCategoryComponent,
  },
  {
    path: "cleaning-methods",
    component: CleaningMethodsComponent,
  },
];