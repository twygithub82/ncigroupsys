import { Routes } from "@angular/router";
import { BillingBranchNewComponent } from "./billing-branch-new/billing-branch-new.component";
import { CustomerNewComponent } from "./customer-new/customer-new.component";
import { MainCustomerComponent } from "./customer/main-customer.component";
import { EstimateTemplateNewComponent } from "./estimate-template-new/estimate-template-new.component";
import { EstimateTemplateComponent } from "./estimate-template/estimate-template.component";
import { UnitTypeComponent } from "./tank/unit-type.component";

export const MASTER_ROUTE: Routes = [
  {
    path: "estimate-template",
    component: EstimateTemplateComponent,
  },
  {
    path: "estimate-template/new/:id",
    component: EstimateTemplateNewComponent,
  },
  {
    path: "customer",
    component: MainCustomerComponent,
  },
  {
    path: "customer/new/:id",
    component: CustomerNewComponent,
  },
  {
    path: "customer/billing-branch/new",
    component: BillingBranchNewComponent,
  },
  {
    path: "customer/billing-branch/new/:id",
    component: BillingBranchNewComponent,
  },
  // {
  //   path: "unit-type",
  //   component: UnitTypeComponent,
  // },
];