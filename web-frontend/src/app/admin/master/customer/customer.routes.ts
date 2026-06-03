import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";

import { MainCustomerComponent } from "./main-customer.component";
import { CustomerNewComponent } from "../customer-new/customer-new.component";
import { BillingBranchNewComponent } from "../billing-branch-new/billing-branch-new.component";

export const CUSTOMER_ROUTES: Routes = [
  {
    path: "",
    component: MainCustomerComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        "MASTER_BILLING_BRANCH_ADD",
        "MASTER_BILLING_BRANCH_DELETE",
        "MASTER_BILLING_BRANCH_EDIT",
        "MASTER_BILLING_BRANCH_VIEW",
        "MASTER_CUSTOMER_ADD",
        "MASTER_CUSTOMER_DELETE",
        "MASTER_CUSTOMER_EDIT",
        "MASTER_CUSTOMER_VIEW"
      ]
    }
  },
  {
    path: "new/:id",
    component: CustomerNewComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        "MASTER_CUSTOMER_ADD",
        "MASTER_CUSTOMER_DELETE",
        "MASTER_CUSTOMER_EDIT",
        "MASTER_CUSTOMER_VIEW"
      ]
    }
  },
  {
    path: "billing-branch/new",
    component: BillingBranchNewComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        "MASTER_BILLING_BRANCH_ADD",
        "MASTER_BILLING_BRANCH_DELETE",
        "MASTER_BILLING_BRANCH_EDIT",
        "MASTER_BILLING_BRANCH_VIEW"
      ]
    }
  },
  {
    path: "billing-branch/new/:id",
    component: BillingBranchNewComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        "MASTER_BILLING_BRANCH_ADD",
        "MASTER_BILLING_BRANCH_DELETE",
        "MASTER_BILLING_BRANCH_EDIT",
        "MASTER_BILLING_BRANCH_VIEW"
      ]
    }
  }
];