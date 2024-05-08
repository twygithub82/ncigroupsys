import { Route } from "@angular/router";
import { Page404Component } from "../authentication/page404/page404.component";
import { Dashboard1Component } from "./dashboard1/dashboard1.component";
import { Dashboard2Component } from "./dashboard2/dashboard2.component";

export const DASHBOARD_ROUTE: Route[] = [
  {
    path: "",
    component: Dashboard1Component,
  }
];

