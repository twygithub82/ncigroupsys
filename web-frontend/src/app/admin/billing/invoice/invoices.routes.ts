import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { MainInvoiceComponent } from "./main-invoice.component";

export const INVOICE_ROUTES: Routes = [
  {
    path: "",
    component: MainInvoiceComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'BILLING_INVOICE_SUMMARY_EDIT',
        'BILLING_INVOICE_SUMMARY_VIEW',
        'BILLING_INVOICE_SUMMARY_DELETE'
      ]
    }
  }
];