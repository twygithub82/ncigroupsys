import { Routes } from "@angular/router";
import { TransferComponent } from "./transfer.component";
import { TransferDetailsComponent } from "../transfer-details/transfer-details.component";
import { AuthGuard } from "@core/guard/auth.guard";

export const TRANSFER_ROUTES: Routes = [
  {
    path: "",
    component: TransferComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "details/:id",
    component: TransferDetailsComponent,
    canActivate: [AuthGuard]
  }
];