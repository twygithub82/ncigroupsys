import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { BookingNewComponent } from "./booking-new/booking-new.component";
import { InGateDetailsComponent } from "./in-gate-details/in-gate-details.component";
import { InGateMainComponent } from "./in-gate-main/in-gate-main.component";
import { InGateSurveyFormComponent } from "./in-gate-survey-form/in-gate-survey-form.component";
import { OutGateDetailsComponent } from "./out-gate-details/out-gate-details.component";
import { OutGateMainComponent } from "./out-gate-main/out-gate-main.component";
import { OutGateSurveyFormComponent } from "./out-gate-survey-form/out-gate-survey-form.component";
import { OutGateSurveyComponent } from "./out-gate-survey/out-gate-survey.component";
import { ReleaseOrderDetailsComponent } from "./release-order-details/release-order-details.component";
import { ReleaseOrderComponent } from "./release-order/release-order.component";
import { SchedulingNewComponent } from "./scheduling-new/scheduling-new.component";
import { StoringOrderNewComponent } from "./storing-order-new/storing-order-new.component";
import { StoringOrderComponent } from "./storing-order/storing-order.component";
import { TankMovementDetailsComponent } from "./tank-movement-details/tank-movement-details.component";
import { TankMovementComponent } from "./tank-movement/tank-movement.component";
import { TransferDetailsComponent } from "./transfer-details/transfer-details.component";
import { TransferComponent } from "./transfer/transfer.component";

export const INVENTORY_ROUTE: Routes = [
  {
    path: "storing-order",
    component: StoringOrderComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: ['Admin'] }
  },
  {
    path: "storing-order/new",
    component: StoringOrderNewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "storing-order/edit/:id",
    component: StoringOrderNewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "in-gate-main",
    component: InGateMainComponent,
  },
  // {
  //   path: "in-gate",
  //   component: InGateComponent,
  // },
  {
    path: "in-gate-main/details/:id",
    component: InGateDetailsComponent,
  },
  // {
  //   path: "in-gate-survey",
  //   component: InGateSurveyComponent,
  // },
  {
    path: "in-gate-main/survey-form/:id",
    component: InGateSurveyFormComponent,
  },
  {
    path: "tank-movement",
    component: TankMovementComponent,
  },
  {
    path: "tank-movement/details/:id",
    component: TankMovementDetailsComponent,
  },
  {
    path: "out-gate-main",
    component: OutGateMainComponent,
  },
  // {
  //   path: "out-gate",
  //   component: OutGateComponent,
  // },
  {
    path: "out-gate-main/details/:id",
    component: OutGateDetailsComponent,
  },
  // {
  //   path: "out-gate-survey",
  //   component: OutGateSurveyComponent,
  // },
  {
    path: "out-gate-main/survey-form/:id/:roSotId",
    component: OutGateSurveyFormComponent,
  },
  {
    path: "booking",
    component: BookingNewComponent,
  },
  {
    path: "scheduling",
    component: SchedulingNewComponent,
  },
  {
    path: "release-order",
    component: ReleaseOrderComponent,
  },
  {
    path: "release-order/new",
    component: ReleaseOrderDetailsComponent,
  },
  {
    path: "release-order/edit/:id",
    component: ReleaseOrderDetailsComponent,
  },
  {
    path: "transfer",
    component: TransferComponent,
  },
  {
    path: "transfer/details/:id",
    component: TransferDetailsComponent,
  },
];