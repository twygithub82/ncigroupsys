import { Routes } from "@angular/router";

export const USER_MANAGEMENT_ROUTE: Routes = [
  {
    path: "user",
    loadChildren: () =>
      import("./user/user.routes").then(m => m.USER_ROUTES)
  },
  {
    path: "role",
    loadChildren: () =>
      import("./role/role.routes").then(m => m.ROLE_ROUTES)
  },
  {
    path: "team",
    loadChildren: () =>
      import("./team/team.routes").then(m => m.TEAM_ROUTES)
  }
];