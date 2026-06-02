// storing-order.routes.ts
import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { StoringOrderComponent } from "./storing-order.component";
import { StoringOrderNewComponent } from "../storing-order-new/storing-order-new.component";


export const STORING_ORDER_ROUTES: Routes = [
  {
    path: "",
    component: StoringOrderComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        "INVENTORY_STORING_ORDER_VIEW",
        "INVENTORY_STORING_ORDER_EDIT",
        "INVENTORY_STORING_ORDER_DELETE",
        "INVENTORY_STORING_ORDER_ADD"
      ]
    }
  },
  {
    path: "new",
    component: StoringOrderNewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "edit/:id",
    component: StoringOrderNewComponent,
    canActivate: [AuthGuard]
  }
];