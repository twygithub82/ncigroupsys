import { Routes } from "@angular/router";
import { SchedulingNewComponent } from "./scheduling-new.component";
import { AuthGuard } from "@core/guard/auth.guard";

export const SCHEDULING_ROUTES: Routes = [
  {
    path: "",
    component: SchedulingNewComponent,
    canActivate: [AuthGuard]
  }
];