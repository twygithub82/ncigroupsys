import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { MainPackageSteamComponent } from "./main-package-steam.component";

export const PACKAGE_STEAM_ROUTES: Routes = [
  {
    path: "",
    component: MainPackageSteamComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'PACKAGE_STEAMING_VIEW',
        'PACKAGE_STEAMING_EDIT',
        'PACKAGE_STEAMING_DELETE',
        'PACKAGE_STEAMING_EXCLUSIVE_DELETE',
        'PACKAGE_STEAMING_EXCLUSIVE_VIEW',
        'PACKAGE_STEAMING_EXCLUSIVE_EDIT'
      ]
    }
  }
];