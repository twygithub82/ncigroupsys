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

export const BILLING_ROUTE: Routes = [
    {
      path: "depot",
      component: MainDepotComponent,
    },
    {
      path: "depot/lolo",
      component: LOLOBillingComponent,
    },
    {
      path: "depot/preinspection",
      component: PreinspectionBillingComponent,
    },
    {
      path: "depot/storage",
      component: StorageBillingComponent,
    },
    {
      path: "clean",
      component: MainCleaningComponent,
    },
    {
      path: "repair",
      component: RepairBillingComponent,
    },
    {
      path: "residue",
      component: ResidueBillingComponent,
    },
    {
      path: "steam",
      component: SteamBillingComponent,
    },
    {
      path: "invoices",
      component: MainInvoiceComponent,
    },
    {
      path: "pending",
      component: MainPendingComponent,
    },
    {
      path: "billed-tank",
      component: BilledTankComponent,
    },
];