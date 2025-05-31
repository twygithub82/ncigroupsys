import { Routes } from "@angular/router";
import { BilledTankComponent } from "./billed-tank/billed-tank.component";
import { MainCleaningComponent } from "./cleaning/main-clean.component";
import { LOLOBillingComponent } from "./depot-cost/lolo/lolo-billing.component";
import { MainDepotComponent } from "./depot-cost/main-depot.component";
import { PreinspectionBillingComponent } from "./depot-cost/pre-inspection/preinspection-billing.component";
import { StorageBillingComponent } from "./depot-cost/storage/storage-billing.component";
import { MainInvoiceComponent } from "./invoice/main-invoice.component";
import { MainPendingComponent } from "./pending/main-pending.component";
import { RepairBillingComponent } from "./repair/repair-billing.component";
import { ResidueBillingComponent } from "./residue-disposal/residue-billing.component";
import { SteamBillingComponent } from "./steam/steam-billing.component";
import { AuthGuard } from "@core/guard/auth.guard";

export const BILLING_ROUTE: Routes = [
  {
    path: "depot",
    component: MainDepotComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['BILLING_IN_GATE_OUT_GATE_DELETE', 'BILLING_IN_GATE_OUT_GATE_EDIT', 'BILLING_IN_GATE_OUT_GATE_VIEW', 'BILLING_LOLO_VIEW', 'BILLING_LOLO_EDIT', 'BILLING_LOLO_DELETE', 'BILLING_PRE_INSPECTION_VIEW', 'BILLING_PRE_INSPECTION_EDIT', 'BILLING_PRE_INSPECTION_DELETE', 'BILLING_STORAGE_VIEW', 'BILLING_STORAGE_EDIT', 'BILLING_STORAGE_DELETE'] }
  },
  {
    path: "clean",
    component: MainCleaningComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['BILLING_CLEANING_BILL_DELETE','BILLING_CLEANING_BILL_EDIT','BILLING_CLEANING_BILL_VIEW', 'BILLING_RESIDUE_DISPOSAL_BILL_DELETE', 'BILLING_RESIDUE_DISPOSAL_BILL_VIEW', 'BILLING_RESIDUE_DISPOSAL_BILL_EDIT', 'BILLING_STEAM_BILL_VIEW', 'BILLING_STEAM_BILL_EDIT', 'BILLING_STEAM_BILL_DELETE'] }
  },
  {
    path: "repair",
    component: RepairBillingComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['BILLING_REPAIR_EDIT', 'BILLING_REPAIR_VIEW', 'BILLING_REPAIR_DELETE'] }
  },
  {
    path: "invoices",
    component: MainInvoiceComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['BILLING_INVOICE_SUMMARY_EDIT', 'BILLING_INVOICE_SUMMARY_VIEW', 'BILLING_INVOICE_SUMMARY_DELETE'] }
  },
  // below not using
  {
    path: "residue",
    component: ResidueBillingComponent,
  },
  {
    path: "steam",
    component: SteamBillingComponent,
  },
  {
    path: "pending",
    component: MainPendingComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['BILLING_PENDING_INVOICES_VIEW'] }
  },
  {
    path: "billed-tank",
    component: BilledTankComponent,
  },
];