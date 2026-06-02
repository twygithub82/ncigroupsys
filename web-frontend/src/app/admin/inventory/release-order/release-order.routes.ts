import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { ReleaseOrderComponent } from "./release-order.component";

export const RELEASE_ORDER_ROUTES: Routes = [
  {
      path: "",
      component: ReleaseOrderComponent,
      canActivate: [AuthGuard],
      data: { expectedFunctions: ['INVENTORY_RELEASE_ORDER_VIEW'] }
    },
];