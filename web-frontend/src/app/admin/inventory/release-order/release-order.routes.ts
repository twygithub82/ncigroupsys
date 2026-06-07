import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { ReleaseOrderComponent } from "./release-order.component";
import { ReleaseOrderDetailsComponent } from "../release-order-details/release-order-details.component";

export const RELEASE_ORDER_ROUTES: Routes = [
  {
    path: "",
    component: ReleaseOrderComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['INVENTORY_RELEASE_ORDER_VIEW', 'INVENTORY_RELEASE_ORDER_EDIT', 'INVENTORY_RELEASE_ORDER_DELETE'] }
  },
  {
    path: "new",
    component: ReleaseOrderDetailsComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['INVENTORY_RELEASE_ORDER_VIEW', 'INVENTORY_RELEASE_ORDER_EDIT', 'INVENTORY_RELEASE_ORDER_DELETE', 'INVENTORY_RELEASE_ORDER_ADD'] }
  },
  {
    path: "edit/:id",
    component: ReleaseOrderDetailsComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['INVENTORY_RELEASE_ORDER_VIEW', 'INVENTORY_RELEASE_ORDER_EDIT', 'INVENTORY_RELEASE_ORDER_DELETE'] }
  },
];