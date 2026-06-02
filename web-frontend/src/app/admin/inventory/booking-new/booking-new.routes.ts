import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { BookingNewComponent } from "./booking-new.component";

export const BOOKING_ROUTES: Routes = [
  {
    path: "",
    component: BookingNewComponent,
    canActivate: [AuthGuard]
  }
];