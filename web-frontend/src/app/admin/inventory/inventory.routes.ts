import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guard/auth.guard";
import { BookingNewComponent } from "./booking-new/booking-new.component";
import { InGateDetailsComponent } from "./in-gate-details/in-gate-details.component";
import { InGateMainComponent } from "./in-gate-main/in-gate-main.component";
import { InGateSurveyFormComponent } from "./in-gate-survey-form/in-gate-survey-form.component";
import { OutGateDetailsComponent } from "./out-gate-details/out-gate-details.component";
import { OutGateMainComponent } from "./out-gate-main/out-gate-main.component";
import { OutGateSurveyFormComponent } from "./out-gate-survey-form/out-gate-survey-form.component";
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
    data: { expectedFunctions: ['INVENTORY_STORING_ORDER_VIEW', 'INVENTORY_STORING_ORDER_EDIT', 'INVENTORY_STORING_ORDER_DELETE', 'INVENTORY_STORING_ORDER_ADD'] }
  },
  {
    path: "storing-order/new",
    component: StoringOrderNewComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['INVENTORY_STORING_ORDER_VIEW', 'INVENTORY_STORING_ORDER_EDIT', 'INVENTORY_STORING_ORDER_DELETE', 'INVENTORY_STORING_ORDER_ADD'] }
  },
  {
    path: "storing-order/edit/:id",
    component: StoringOrderNewComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['INVENTORY_STORING_ORDER_VIEW', 'INVENTORY_STORING_ORDER_EDIT', 'INVENTORY_STORING_ORDER_DELETE'] }
  },
  {
    path: "in-gate-main",
    component: InGateMainComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['INVENTORY_IN_GATE_VIEW', 'INVENTORY_IN_GATE_EDIT', 'INVENTORY_IN_GATE_DELETE', 'INVENTORY_IN_GATE_SURVEY_VIEW', 'INVENTORY_IN_GATE_SURVEY_EDIT', 'INVENTORY_IN_GATE_SURVEY_DELETE', 'INVENTORY_IN_GATE_SURVEY_PUBLISH'] }
  },
   {
    path: "in-gate-main/:id",
    component: InGateMainComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['INVENTORY_IN_GATE_VIEW', 'INVENTORY_IN_GATE_EDIT', 'INVENTORY_IN_GATE_DELETE', 'INVENTORY_IN_GATE_SURVEY_VIEW', 'INVENTORY_IN_GATE_SURVEY_EDIT', 'INVENTORY_IN_GATE_SURVEY_DELETE', 'INVENTORY_IN_GATE_SURVEY_PUBLISH'] }
  },
  // {
  //   path: "in-gate",
  //   component: InGateComponent,
  // },
  {
    path: "in-gate-main/details/:id",
    component: InGateDetailsComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['INVENTORY_IN_GATE_VIEW', 'INVENTORY_IN_GATE_EDIT', 'INVENTORY_IN_GATE_DELETE'] }
  },
  // {
  //   path: "in-gate-survey",
  //   component: InGateSurveyComponent,
  // },
  {
    path: "in-gate-main/survey-form/:id",
    component: InGateSurveyFormComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['INVENTORY_IN_GATE_SURVEY_VIEW', 'INVENTORY_IN_GATE_SURVEY_EDIT', 'INVENTORY_IN_GATE_SURVEY_DELETE', 'INVENTORY_IN_GATE_SURVEY_PUBLISH'] }
  },
  {
    path: "tank-movement",
    component: TankMovementComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['INVENTORY_TANK_MOVEMENT_VIEW', 'INVENTORY_TANK_MOVEMENT_EDIT', 'INVENTORY_TANK_MOVEMENT_TANK_NO', 'INVENTORY_TANK_MOVEMENT_CUSTOMER', 'INVENTORY_TANK_MOVEMENT_LAST_CARGO', 'INVENTORY_TANK_MOVEMENT_OWNER', 'INVENTORY_TANK_MOVEMENT_CLEAN_STATUS', 'INVENTORY_TANK_MOVEMENT_EIR_DATE', 'INVENTORY_TANK_MOVEMENT_LAST_TEST', 'INVENTORY_TANK_MOVEMENT_YARD', 'INVENTORY_TANK_MOVEMENT_UNIT_TYPE', 'INVENTORY_TANK_MOVEMENT_CLADDING', 'INVENTORY_TANK_MOVEMENT_TARE_WEIGHT', 'INVENTORY_TANK_MOVEMENT_DISCHARGE_TYPE', 'INVENTORY_TANK_MOVEMENT_NOTES', 'INVENTORY_TANK_MOVEMENT_RELEASE_NOTES', 'INVENTORY_TANK_MOVEMENT_MANUFACTURER', 'INVENTORY_TANK_MOVEMENT_CAPACITY', 'INVENTORY_TANK_MOVEMENT_GROSS_WEIGHT', 'INVENTORY_TANK_MOVEMENT_COMPARTMENT_TYPE', 'INVENTORY_TANK_MOVEMENT_WALKWAY', 'INVENTORY_TANK_MOVEMENT_GATE_OVERWRITE', 'INVENTORY_TANK_MOVEMENT_STORAGE_OVERWRITE', 'INVENTORY_TANK_MOVEMENT_STEAM_ADD', 'INVENTORY_TANK_MOVEMENT_STEAM_REMOVE', 'INVENTORY_TANK_MOVEMENT_STEAM_REINSTATE', 'INVENTORY_TANK_MOVEMENT_STEAM_OVERWRITE', 'INVENTORY_TANK_MOVEMENT_RESIDUE_ADD', 'INVENTORY_TANK_MOVEMENT_RESIDUE_REMOVE', 'INVENTORY_TANK_MOVEMENT_RESIDUE_REINSTATE', 'INVENTORY_TANK_MOVEMENT_RESIDUE_OVERWRITE', 'INVENTORY_TANK_MOVEMENT_CLEANING_ADD', 'INVENTORY_TANK_MOVEMENT_CLEANING_REMOVE', 'INVENTORY_TANK_MOVEMENT_CLEANING_REINSTATE', 'INVENTORY_TANK_MOVEMENT_CLEANING_OVERWRITE', 'INVENTORY_TANK_MOVEMENT_REPAIR_ADD', 'INVENTORY_TANK_MOVEMENT_REPAIR_REMOVE', 'INVENTORY_TANK_MOVEMENT_REPAIR_REINSTATE', 'INVENTORY_TANK_MOVEMENT_REPAIR_OVERWRITE', 'INVENTORY_TANK_MOVEMENT_DEPOT_JOB_OVERWRITE', 'INVENTORY_TANK_MOVEMENT_DEPOT_COST_OVERWRITE', 'INVENTORY_TANK_MOVEMENT_BOOKING', 'INVENTORY_TANK_MOVEMENT_SCHEDULING', 'INVENTORY_TANK_MOVEMENT_SURVEY', 'INVENTORY_TANK_MOVEMENT_TRANSFER'] }
  },
  {
    path: "tank-movement/details/:id",
    component: TankMovementDetailsComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['INVENTORY_TANK_MOVEMENT_VIEW', 'INVENTORY_TANK_MOVEMENT_EDIT', 'INVENTORY_TANK_MOVEMENT_TANK_NO', 'INVENTORY_TANK_MOVEMENT_CUSTOMER', 'INVENTORY_TANK_MOVEMENT_LAST_CARGO', 'INVENTORY_TANK_MOVEMENT_OWNER', 'INVENTORY_TANK_MOVEMENT_CLEAN_STATUS', 'INVENTORY_TANK_MOVEMENT_EIR_DATE', 'INVENTORY_TANK_MOVEMENT_LAST_TEST', 'INVENTORY_TANK_MOVEMENT_YARD', 'INVENTORY_TANK_MOVEMENT_UNIT_TYPE', 'INVENTORY_TANK_MOVEMENT_CLADDING', 'INVENTORY_TANK_MOVEMENT_TARE_WEIGHT', 'INVENTORY_TANK_MOVEMENT_DISCHARGE_TYPE', 'INVENTORY_TANK_MOVEMENT_NOTES', 'INVENTORY_TANK_MOVEMENT_RELEASE_NOTES', 'INVENTORY_TANK_MOVEMENT_MANUFACTURER', 'INVENTORY_TANK_MOVEMENT_CAPACITY', 'INVENTORY_TANK_MOVEMENT_GROSS_WEIGHT', 'INVENTORY_TANK_MOVEMENT_COMPARTMENT_TYPE', 'INVENTORY_TANK_MOVEMENT_WALKWAY', 'INVENTORY_TANK_MOVEMENT_GATE_OVERWRITE', 'INVENTORY_TANK_MOVEMENT_STORAGE_OVERWRITE', 'INVENTORY_TANK_MOVEMENT_STEAM_ADD', 'INVENTORY_TANK_MOVEMENT_STEAM_REMOVE', 'INVENTORY_TANK_MOVEMENT_STEAM_REINSTATE', 'INVENTORY_TANK_MOVEMENT_STEAM_OVERWRITE', 'INVENTORY_TANK_MOVEMENT_RESIDUE_ADD', 'INVENTORY_TANK_MOVEMENT_RESIDUE_REMOVE', 'INVENTORY_TANK_MOVEMENT_RESIDUE_REINSTATE', 'INVENTORY_TANK_MOVEMENT_RESIDUE_OVERWRITE', 'INVENTORY_TANK_MOVEMENT_CLEANING_ADD', 'INVENTORY_TANK_MOVEMENT_CLEANING_REMOVE', 'INVENTORY_TANK_MOVEMENT_CLEANING_REINSTATE', 'INVENTORY_TANK_MOVEMENT_CLEANING_OVERWRITE', 'INVENTORY_TANK_MOVEMENT_REPAIR_ADD', 'INVENTORY_TANK_MOVEMENT_REPAIR_REMOVE', 'INVENTORY_TANK_MOVEMENT_REPAIR_REINSTATE', 'INVENTORY_TANK_MOVEMENT_REPAIR_OVERWRITE', 'INVENTORY_TANK_MOVEMENT_DEPOT_JOB_OVERWRITE', 'INVENTORY_TANK_MOVEMENT_DEPOT_COST_OVERWRITE', 'INVENTORY_TANK_MOVEMENT_BOOKING', 'INVENTORY_TANK_MOVEMENT_SCHEDULING', 'INVENTORY_TANK_MOVEMENT_SURVEY', 'INVENTORY_TANK_MOVEMENT_TRANSFER'] }
  },
  {
    path: "out-gate-main",
    component: OutGateMainComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['INVENTORY_OUT_GATE_VIEW', 'INVENTORY_OUT_GATE_EDIT', 'INVENTORY_OUT_GATE_DELETE', 'INVENTORY_OUT_GATE_SURVEY_VIEW', 'INVENTORY_OUT_GATE_SURVEY_EDIT', 'INVENTORY_OUT_GATE_SURVEY_DELETE', 'INVENTORY_OUT_GATE_SURVEY_PUBLISH'] }
  },
  // {
  //   path: "out-gate",
  //   component: OutGateComponent,
  // },
  {
    path: "out-gate-main/details/:id",
    component: OutGateDetailsComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['INVENTORY_OUT_GATE_VIEW', 'INVENTORY_OUT_GATE_EDIT', 'INVENTORY_OUT_GATE_DELETE'] }
  },
  // {
  //   path: "out-gate-survey",
  //   component: OutGateSurveyComponent,
  // },
  {
    path: "out-gate-main/survey-form/:id/:roSotId",
    component: OutGateSurveyFormComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['INVENTORY_OUT_GATE_SURVEY_VIEW', 'INVENTORY_OUT_GATE_SURVEY_EDIT', 'INVENTORY_OUT_GATE_SURVEY_DELETE', 'INVENTORY_OUT_GATE_SURVEY_PUBLISH'] }
  },
  {
    path: "booking",
    component: BookingNewComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['INVENTORY_BOOKING_VIEW', 'INVENTORY_BOOKING_EDIT', 'INVENTORY_BOOKING_DELETE', 'INVENTORY_BOOKING_ADD'] }
  },
  {
    path: "scheduling",
    component: SchedulingNewComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['INVENTORY_SCHEDULING_VIEW', 'INVENTORY_SCHEDULING_EDIT', 'INVENTORY_SCHEDULING_DELETE', 'INVENTORY_SCHEDULING_ADD'] }
  },
  {
    path: "release-order",
    component: ReleaseOrderComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['INVENTORY_RELEASE_ORDER_VIEW'] }
  },
  {
    path: "release-order/new",
    component: ReleaseOrderDetailsComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['INVENTORY_RELEASE_ORDER_VIEW', 'INVENTORY_RELEASE_ORDER_EDIT', 'INVENTORY_RELEASE_ORDER_DELETE', 'INVENTORY_RELEASE_ORDER_ADD'] }
  },
  {
    path: "release-order/edit/:id",
    component: ReleaseOrderDetailsComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['INVENTORY_RELEASE_ORDER_VIEW', 'INVENTORY_RELEASE_ORDER_EDIT', 'INVENTORY_RELEASE_ORDER_DELETE'] }
  },
  {
    path: "transfer",
    component: TransferComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['INVENTORY_TRANSFER_VIEW'] }
  },
  {
    path: "transfer/details/:id",
    component: TransferDetailsComponent,
    canActivate: [AuthGuard],
    data: { expectedFunctions: ['INVENTORY_TRANSFER_VIEW', 'INVENTORY_TRANSFER_EDIT', 'INVENTORY_TRANSFER_DELETE', 'INVENTORY_TRANSFER_ADD'] }
  },
];