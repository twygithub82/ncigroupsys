import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { MainTransferComponent } from "./main-transfer.component";

export const TRANSFER_ROUTES: Routes = [
  {
     path: "",
     component: MainTransferComponent,
     canActivate: [AuthGuard],
     data: { expectedFunctions: ['REPORTS_LOCATION_TRANSFER_VIEW'] }
   },
];