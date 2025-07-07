import { Routes } from "@angular/router";


import { UserNewComponent } from "./user-new/user-new.component";
import { UserComponent } from "./user/user.component";
import { AuthGuard } from "@core/guard/auth.guard";
import { RoleNewComponent } from "./role-new/role-new.component";
import { RoleComponent } from "./role/role.component";
import { TeamNewComponent } from "./team-new/team-new.component";
import { TeamComponent } from "./team/team.component";

export const USER_MANAGEMENT_ROUTE: Routes = [
  {
    path: "user",
    component: UserComponent,
  },
  // {
  //   path: "user/new/:id",
  //   component: UserNewComponent,
  // },
  {
    path: "role",
    component: RoleComponent,
  },
  // {
  //   path: "role/new/:id",
  //   component: RoleNewComponent
  // },
   {
    path: "team",
    component: TeamComponent,
  },
  // {
  //   path: "team/new/:id",
  //   component: TeamNewComponent
  // }
 
];