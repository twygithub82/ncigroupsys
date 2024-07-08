import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CleaningStepsComponent } from './cleaning-steps/cleaning-steps.component';
import { CleaningProceduresComponent } from './cleaning-procedures/cleaning-procedures.component';
import { CleaningProceduresNewComponent } from './cleaning-procedures-new/cleaning-procedures-new.component';
import { StoringOrderComponent } from './inventory/storing-order/storing-order.component';
import { StoringOrderNewComponent } from './inventory/storing-order-new/storing-order-new.component';
import { InGateComponent } from './inventory/in-gate/in-gate.component';
import { InGateDetailsComponent } from './inventory/in-gate-details/in-gate-details.component';
import {CleaningCategoryComponent} from './parameter/cleaning-category/cleaning-category.component';
import { CleaningMethodsComponent } from './parameter/cleaning-methods/cleaning-methods.component';
import {TariffCleaningComponent} from "./tariff/tariff-cleaning/tariff-cleaning.component";
import {TariffLabourComponent} from "./tariff/tariff-labour/tariff-labour.component";
import {TariffDepotComponent} from "./tariff/tariff-depot/tariff-depot.component";
import {TariffBufferComponent} from "./tariff/tariff-buffer/tariff-buffer.component";
import {TariffRepairComponent} from "./tariff/tariff-repair/tariff-repair.component";

export const ADMIN_ROUTE: Routes = [
  {
    path: "cleaning-steps",
    component: CleaningStepsComponent,
  },
  {
    path: "cleaning-procedures",
    component: CleaningProceduresComponent,
  },
  {
    path: "cleaning-procedures/cleaning-procedures-new",
    component: CleaningProceduresNewComponent,
  },
  {
    path: "storing-order",
    component: StoringOrderComponent,
  },
  {
    path: "storing-order/new",
    component: StoringOrderNewComponent,
  },
  {
    path: "storing-order/edit/:id",
    component: StoringOrderNewComponent,
  },
  {
    path: "in-gate",
    component: InGateComponent,
  },
  {
    path: "in-gate/details/:id",
    component: InGateDetailsComponent,
  },
  {
    path: "parameter/cleaning-category",
    component: CleaningCategoryComponent,
  },
  {
    path: "parameter/cleaning-methods",
    component: CleaningMethodsComponent,
  },
  {
    path: "tariff/tariff-cleaning",
    component: TariffCleaningComponent,
  },
  {
    path: "tariff/tariff-labour",
    component: TariffLabourComponent,
  },

  {
    path: "tariff/tariff-depot",
    component: TariffDepotComponent,
  },
  {
    path: "tariff/tariff-repair",
    component: TariffRepairComponent,
  },
  {
    path: "tariff/tariff-buffer",
    component: TariffBufferComponent,
  }
];

// @NgModule({
//   imports: [RouterModule.forChild(ADMIN_ROUTE)],
//   exports: [RouterModule]
// })
// export class AdminRoutingModule { }
