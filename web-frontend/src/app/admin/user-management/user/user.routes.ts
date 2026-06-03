import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";

import { UserComponent } from "./user.component";

export const USER_ROUTES: Routes = [
  {
    path: "",
    component: UserComponent
  }
];