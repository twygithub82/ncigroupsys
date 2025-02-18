import { Routes } from "@angular/router";
import { TariffCleaningNewComponent } from "./tariff-cleaning-new/tariff-cleaning-new.component";
import { MainTariffCleaningComponent } from "./tariff-cleaning/main-tariff-clean.component";
import { MainTariffDepotComponent } from "./tariff-depot/main-tariff-depot.component";
import { TariffRepairComponent } from "./tariff-repair/tariff-repair.component";
import { TariffSteamComponent } from "./tariff-steam/tariff-steam.component";

export const TARIFF_ROUTE: Routes = [
  {
    path: "tariff-cleaning",
    component: MainTariffCleaningComponent,
  },
  {
    path: "tariff-cleaning/new",
    component: TariffCleaningNewComponent,
  },
  {
    path: "tariff-cleaning/edit/:id",
    component: TariffCleaningNewComponent,
  },
  // {
  //   path: "tariff-labour",
  //   component: TariffLabourComponent,
  // },
  {
    path: "tariff-depot",
    component: MainTariffDepotComponent,
  },
  {
    path: "tariff-repair",
    component: TariffRepairComponent,
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
  },
];