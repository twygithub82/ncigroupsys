import { Routes } from "@angular/router";
import { TariffCleaningNewComponent } from "./tariff-cleaning-new/tariff-cleaning-new.component";
import { MainTariffCleaningComponent } from "./tariff-cleaning/main-tariff-clean.component";
import { MainTariffDepotComponent } from "./tariff-depot/main-tariff-depot.component";
import { TariffRepairComponent } from "./tariff-repair/tariff-repair.component";
import { TariffSteamComponent } from "./tariff-steam/tariff-steam.component";
import { AuthGuard } from "@core/guard/auth.guard";

export const TARIFF_ROUTE: Routes = [
  {
    path: "tariff-cleaning",
    component: MainTariffCleaningComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['TARIFF_BUFFER_CLEANING_EDIT', 'TARIFF_BUFFER_CLEANING_DELETE', 'TARIFF_BUFFER_CLEANING_ADD', 'TARIFF_BUFFER_CLEANING_VIEW', 'TARIFF_CLEANING_VIEW', 'TARIFF_CLEANING_ADD', 'TARIFF_CLEANING_DELETE', 'TARIFF_CLEANING_EDIT', 'TARIFF_RESIDUE_DISPOSAL_DELETE', 'TARIFF_RESIDUE_DISPOSAL_VIEW', 'TARIFF_RESIDUE_DISPOSAL_EDIT', 'TARIFF_RESIDUE_DISPOSAL_ADD'] }
  },
  {
    path: "tariff-cleaning/new",
    component: TariffCleaningNewComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['TARIFF_CLEANING_VIEW', 'TARIFF_CLEANING_ADD', 'TARIFF_CLEANING_DELETE', 'TARIFF_CLEANING_EDIT'] }
  },
  {
    path: "tariff-cleaning/edit/:id",
    component: TariffCleaningNewComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['TARIFF_CLEANING_VIEW', 'TARIFF_CLEANING_ADD', 'TARIFF_CLEANING_DELETE', 'TARIFF_CLEANING_EDIT'] }
  },
  // {
  //   path: "tariff-labour",
  //   component: TariffLabourComponent,
  // },
  {
    path: "tariff-depot",
    component: MainTariffDepotComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['TARIFF_DEPOT_COST_ADD', 'TARIFF_DEPOT_COST_EDIT', 'TARIFF_DEPOT_COST_VIEW', 'TARIFF_DEPOT_COST_DELETE', 'TARIFF_LABOUR_COST_VIEW', 'TARIFF_LABOUR_COST_EDIT', 'TARIFF_LABOUR_COST_DELETE', 'TARIFF_LABOUR_COST_ADD'] }
  },
  {
    path: "tariff-repair",
    component: TariffRepairComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['TARIFF_REPAIR_VIEW', 'TARIFF_REPAIR_ADD', 'TARIFF_REPAIR_DELETE', 'TARIFF_REPAIR_EDIT'] }
  },
  // {
  //   path: "tariff-residue",
  //   component: TariffResidueComponent,
  // },
  // {
  //   path: "tariff-buffer",
  //   component: TariffBufferComponent,
  // },
  {
    path: "tariff-steam",
    component: TariffSteamComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['TARIFF_STEAMING_VIEW', 'TARIFF_STEAMING_EDIT', 'TARIFF_STEAMING_DELETE', 'TARIFF_STEAMING_ADD'] }
  },
];