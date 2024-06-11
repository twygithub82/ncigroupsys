import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CleaningStepsComponent } from './cleaning-steps/cleaning-steps.component';
import { CleaningProceduresComponent } from './cleaning-procedures/cleaning-procedures.component';
import { CleaningProceduresNewComponent } from './cleaning-procedures-new/cleaning-procedures-new.component';
import { StoringOrderComponent } from './storing-order/storing-order.component';

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
  }
];

// @NgModule({
//   imports: [RouterModule.forChild(ADMIN_ROUTE)],
//   exports: [RouterModule]
// })
// export class AdminRoutingModule { }
