import { Routes } from "@angular/router";
import { BillingBranchNewComponent } from "./billing-branch-new/billing-branch-new.component";
import { CustomerNewComponent } from "./customer-new/customer-new.component";
import { MainCustomerComponent } from "./customer/main-customer.component";
import { EstimateTemplateNewComponent } from "./estimate-template-new/estimate-template-new.component";
import { EstimateTemplateComponent } from "./estimate-template/estimate-template.component";
import { UnitTypeComponent } from "./tank/unit-type.component";
import { AuthGuard } from "@core/guard/auth.guard";

export const MASTER_ROUTE: Routes = [
  {
    path: "estimate-template",
    component: EstimateTemplateComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['MASTER_ESTIMATE_TEMPLATE_VIEW', 'MASTER_ESTIMATE_TEMPLATE_ADD', 'MASTER_ESTIMATE_TEMPLATE_DELETE', 'MASTER_ESTIMATE_TEMPLATE_EDIT'] }
  },
  {
    path: "estimate-template/new/:id",
    component: EstimateTemplateNewComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['MASTER_ESTIMATE_TEMPLATE_VIEW', 'MASTER_ESTIMATE_TEMPLATE_ADD', 'MASTER_ESTIMATE_TEMPLATE_DELETE', 'MASTER_ESTIMATE_TEMPLATE_EDIT'] }
  },
  {
    path: "customer",
    component: MainCustomerComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['MASTER_BILLING_BRANCH_ADD', 'MASTER_BILLING_BRANCH_DELETE', 'MASTER_BILLING_BRANCH_EDIT', 'MASTER_BILLING_BRANCH_VIEW', 'MASTER_CUSTOMER_ADD', 'MASTER_CUSTOMER_DELETE', 'MASTER_CUSTOMER_EDIT', 'MASTER_CUSTOMER_VIEW'] }
  },
  {
    path: "customer/new/:id",
    component: CustomerNewComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['MASTER_CUSTOMER_ADD', 'MASTER_CUSTOMER_DELETE', 'MASTER_CUSTOMER_EDIT', 'MASTER_CUSTOMER_VIEW'] }
  },
  {
    path: "customer/billing-branch/new",
    component: BillingBranchNewComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['MASTER_BILLING_BRANCH_ADD', 'MASTER_BILLING_BRANCH_DELETE', 'MASTER_BILLING_BRANCH_EDIT', 'MASTER_BILLING_BRANCH_VIEW'] }
  },
  {
    path: "customer/billing-branch/new/:id",
    component: BillingBranchNewComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['MASTER_BILLING_BRANCH_ADD', 'MASTER_BILLING_BRANCH_DELETE', 'MASTER_BILLING_BRANCH_EDIT', 'MASTER_BILLING_BRANCH_VIEW'] }
  },
  {
    path: "unit-type",
    component: UnitTypeComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['MASTER_UNIT_TYPE_EDIT', 'MASTER_UNIT_TYPE_ADD', 'MASTER_UNIT_TYPE_DELETE', 'MASTER_UNIT_TYPE_VIEW'] }
  },
];