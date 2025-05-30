import { Route } from "@angular/router";
import { SigninComponent } from "./signin/signin.component";
import { SigninStaffComponent } from "./signin/signin-staff.component";
import { SignupComponent } from "./signup/signup.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { LockedComponent } from "./locked/locked.component";
import { Page404Component } from "./page404/page404.component";
import { Page500Component } from "./page500/page500.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
export const AUTH_ROUTE: Route[] = [
  {
    path: "",
    redirectTo: "signin-staff",
    pathMatch: "full",
  },
  // {
  //   path: "signin",
  //   component: SigninComponent,
  // },
  {
    path: "signin-staff",
    component: SigninStaffComponent,
  },
  {
    path: "signup",
    component: SignupComponent,
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
  },
  {
    path: "reset-password",
    component: ResetPasswordComponent,
  },
  {
    path: "locked",
    component: LockedComponent,
  },
  {
    path: "page404",
    component: Page404Component,
  },
  {
    path: "page500",
    component: Page500Component,
  },
];
