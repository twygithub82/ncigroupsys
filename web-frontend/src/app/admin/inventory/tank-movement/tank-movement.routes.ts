// tank-movement.routes.ts
import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { TankMovementComponent } from "./tank-movement.component";
import { TankMovementDetailsComponent } from "../tank-movement-details/tank-movement-details.component";

export const TANK_MOVEMENT_ROUTES: Routes = [
  {
    path: "",
    component: TankMovementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "details/:id",
    component: TankMovementDetailsComponent,
    canActivate: [AuthGuard]
  }
];