import { Route } from "@angular/router";
import { Page404Component } from "../authentication/page404/page404.component";
import { Dashboard1Component } from "./dashboard1/dashboard1.component";

export const DASHBOARD_ROUTE: Route[] = [
  {
    path: "",
    component: Dashboard1Component,
  },
  {
    path: "component-not-found",
    component: Page404Component,
  }
];

