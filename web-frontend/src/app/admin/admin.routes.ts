import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoringOrderComponent } from './inventory/storing-order/storing-order.component';
import { StoringOrderNewComponent } from './inventory/storing-order-new/storing-order-new.component';
import { InGateComponent } from './inventory/in-gate/in-gate.component';
import { InGateDetailsComponent } from './inventory/in-gate-details/in-gate-details.component';
import { CleaningCategoryComponent } from './parameter/cleaning-category/cleaning-category.component';
import { CleaningMethodsComponent } from './parameter/cleaning-methods/cleaning-methods.component';
import { TariffCleaningComponent } from "./tariff/tariff-cleaning/tariff-cleaning.component";
import { TariffLabourComponent } from "./tariff/tariff-labour/tariff-labour.component";
import { TariffDepotComponent } from "./tariff/tariff-depot/tariff-depot.component";
import { TariffBufferComponent } from "./tariff/tariff-buffer/tariff-buffer.component";
import { TariffRepairComponent } from "./tariff/tariff-repair/tariff-repair.component";
import { TariffResidueComponent } from './tariff/tariff-residue/tariff-residue.component';
import { TariffCleaningNewComponent } from './tariff/tariff-cleaning-new/tariff-cleaning-new.component';
import { InGateSurveyComponent } from './inventory/in-gate-survey/in-gate-survey.component';
import { InGateSurveyFormComponent } from './inventory/in-gate-survey-form/in-gate-survey-form.component';
import { BookingComponent } from './inventory/booking/booking.component';
import {PackageCleaningComponent} from "./package/package-cleaning/package-cleaning.component"
import { PackageDepotComponent } from './package/package-depot/package-depot.component';
import { BookingNewComponent } from './inventory/booking-new/booking-new.component';
import { SchedulingNewComponent } from './inventory/scheduling-new/scheduling-new.component';
import { ReleaseOrderComponent } from './inventory/release-order/release-order.component';
import { ReleaseOrderDetailsComponent } from './inventory/release-order-details/release-order-details.component';
import { SchedulingComponent } from './inventory/scheduling/scheduling.component';
import { OutGateComponent } from './inventory/out-gate/out-gate.component';
import { OutGateDetailsComponent } from './inventory/out-gate-details/out-gate-details.component';
import { PackageLabourComponent } from './package/package-labour/package-labour.component';
export const ADMIN_ROUTE: Routes = [
  {
    path: "parameter/cleaning-category",
    component: CleaningCategoryComponent,
  },
  {
    path: "parameter/cleaning-methods",
    component: CleaningMethodsComponent,
  },
  {
    path: "inventory/storing-order",
    component: StoringOrderComponent,
  },
  {
    path: "inventory/storing-order/new",
    component: StoringOrderNewComponent,
  },
  {
    path: "inventory/storing-order/edit/:id",
    component: StoringOrderNewComponent,
  },
  {
    path: "inventory/in-gate",
    component: InGateComponent,
  },
  {
    path: "inventory/in-gate/details/:id",
    component: InGateDetailsComponent,
  },
  {
    path: "inventory/in-gate-survey",
    component: InGateSurveyComponent,
  },
  {
    path: "inventory/in-gate-survey/survey-form/:id",
    component: InGateSurveyFormComponent,
  },
  {
    path: "inventory/out-gate",
    component: OutGateComponent,
  },
  {
    path: "inventory/out-gate/details/:id",
    component: OutGateDetailsComponent,
  },
  // {
  //   path: "inventory/booking",
  //   component: BookingComponent,
  // },
  {
    path: "inventory/booking",
    component: BookingNewComponent,
  },
  // {
  //   path: "inventory/booking-new",
  //   component: BookingNewComponent,
  // },
  // {
  //   path: "inventory/scheduling",
  //   component: SchedulingComponent,
  // },
  {
    path: "inventory/scheduling",
    component: SchedulingNewComponent,
  },
  // {
  //   path: "inventory/scheduling-new",
  //   component: SchedulingNewComponent,
  // },
  {
    path: "inventory/release-order",
    component: ReleaseOrderComponent,
  },
  {
    path: "inventory/release-order/new",
    component: ReleaseOrderDetailsComponent,
  },
  {
    path: "inventory/release-order/edit/:id",
    component: ReleaseOrderDetailsComponent,
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
    path: "tariff/tariff-cleaning/new",
    component: TariffCleaningNewComponent,
  },
  {
    path: "tariff/tariff-cleaning/edit/:id",
    component: TariffCleaningNewComponent,
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
    path: "tariff/tariff-residue",
    component: TariffResidueComponent,
  },
  {
    path: "tariff/tariff-buffer",
    component: TariffBufferComponent,
  },
  {
    path: "package/package-cleaning",
    component: PackageCleaningComponent,
  },
  {
    path: "package/package-depot",
    component: PackageDepotComponent,
  },
  {
    path: "package/package-labour",
    component: PackageLabourComponent,
  }
];

// @NgModule({
//   imports: [RouterModule.forChild(ADMIN_ROUTE)],
//   exports: [RouterModule]
// })
// export class AdminRoutingModule { }
