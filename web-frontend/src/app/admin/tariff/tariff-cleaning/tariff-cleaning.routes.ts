import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";

import { MainTariffCleaningComponent } from "./main-tariff-clean.component";
import { TariffCleaningNewComponent } from "../tariff-cleaning-new/tariff-cleaning-new.component";

export const TARIFF_CLEANING_ROUTES: Routes = [
  {
    path: "",
    component: MainTariffCleaningComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'TARIFF_BUFFER_CLEANING_EDIT',
        'TARIFF_BUFFER_CLEANING_DELETE',
        'TARIFF_BUFFER_CLEANING_ADD',
        'TARIFF_BUFFER_CLEANING_VIEW',
        'TARIFF_CLEANING_VIEW',
        'TARIFF_CLEANING_ADD',
        'TARIFF_CLEANING_DELETE',
        'TARIFF_CLEANING_EDIT',
        'TARIFF_RESIDUE_DISPOSAL_DELETE',
        'TARIFF_RESIDUE_DISPOSAL_VIEW',
        'TARIFF_RESIDUE_DISPOSAL_EDIT',
        'TARIFF_RESIDUE_DISPOSAL_ADD'
      ]
    }
  },
  {
    path: "new",
    component: TariffCleaningNewComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'TARIFF_CLEANING_VIEW',
        'TARIFF_CLEANING_ADD',
        'TARIFF_CLEANING_DELETE',
        'TARIFF_CLEANING_EDIT'
      ]
    }
  },
  {
    path: "edit/:id",
    component: TariffCleaningNewComponent,
    canActivate: [AuthGuard],
    data: {
      expectedFunctions: [
        'TARIFF_CLEANING_VIEW',
        'TARIFF_CLEANING_ADD',
        'TARIFF_CLEANING_DELETE',
        'TARIFF_CLEANING_EDIT'
      ]
    }
  }
];