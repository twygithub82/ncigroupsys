import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { MainCleaningComponent } from "./main-clean.component";

export const CLEANING_ROUTES: Routes = [
  {
    path: "",
    component: MainCleaningComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'BILLING_CLEANING_BILL_DELETE',
        'BILLING_CLEANING_BILL_EDIT',
        'BILLING_CLEANING_BILL_VIEW',
        'BILLING_RESIDUE_DISPOSAL_BILL_DELETE',
        'BILLING_RESIDUE_DISPOSAL_BILL_VIEW',
        'BILLING_RESIDUE_DISPOSAL_BILL_EDIT',
        'BILLING_STEAM_BILL_VIEW',
        'BILLING_STEAM_BILL_EDIT',
        'BILLING_STEAM_BILL_DELETE'
      ]
    }
  }
];