import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";

import { EstimateTemplateComponent } from "./estimate-template.component";
import { EstimateTemplateNewComponent } from "../estimate-template-new/estimate-template-new.component";

export const ESTIMATE_TEMPLATE_ROUTES: Routes = [
  {
    path: "",
    component: EstimateTemplateComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        "MASTER_ESTIMATE_TEMPLATE_VIEW",
        "MASTER_ESTIMATE_TEMPLATE_ADD",
        "MASTER_ESTIMATE_TEMPLATE_DELETE",
        "MASTER_ESTIMATE_TEMPLATE_EDIT"
      ]
    }
  },
  {
    path: "new/:id",
    component: EstimateTemplateNewComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        "MASTER_ESTIMATE_TEMPLATE_VIEW",
        "MASTER_ESTIMATE_TEMPLATE_ADD",
        "MASTER_ESTIMATE_TEMPLATE_DELETE",
        "MASTER_ESTIMATE_TEMPLATE_EDIT"
      ]
    }
  }
];