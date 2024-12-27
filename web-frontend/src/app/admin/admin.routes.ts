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
import { PackageCleaningComponent } from "./package/package-cleaning/package-cleaning.component"
import { PackageDepotComponent } from './package/package-depot/package-depot.component';
import { BookingNewComponent } from './inventory/booking-new/booking-new.component';
import { SchedulingNewComponent } from './inventory/scheduling-new/scheduling-new.component';
import { ReleaseOrderComponent } from './inventory/release-order/release-order.component';
import { ReleaseOrderDetailsComponent } from './inventory/release-order-details/release-order-details.component';
import { SchedulingComponent } from './inventory/scheduling/scheduling.component';
import { OutGateComponent } from './inventory/out-gate/out-gate.component';
import { OutGateDetailsComponent } from './inventory/out-gate-details/out-gate-details.component';
import { PackageLabourComponent } from './package/package-labour/package-labour.component';
import { AuthGuard } from '@core/guard/auth.guard';
import { PackageResidueComponent } from './package/package-residue/package-residue.component';
import { PackageRepairComponent } from './package/package-repair/package-repair.component';
import { PackageBufferComponent } from './package/package-buffer/package-buffer.component';
import { RepairEstimateComponent } from './repair/estimate/estimate.component';
import { RepairEstimateNewComponent } from './repair/estimate-new/estimate-new.component';
import { EstimateTemplateComponent } from './master/estimate-template/estimate-template.component';
import { EstimateTemplateNewComponent } from './master/estimate-template-new/estimate-template-new.component';
import { CustomerComponent } from './master/customer/customer.component';
import { CustomerNewComponent } from './master/customer-new/customer-new.component';
import { RepairApprovalComponent } from './repair/approval/approval.component';
import { RepairApprovalViewComponent } from './repair/approval-view/approval-view.component';
import { BillingBranchComponent } from './master/billing-branch/billing-branch.component';
import { BillingBranchNewComponent } from './master/billing-branch-new/billing-branch-new.component';
import { CleaningApprovalComponent } from './cleaning/cleaning-approval/approval.component';
import { ResidueDisposalApprovalComponent } from './residue-disposal/approval/approval.component';
import { JobOrderComponent } from './repair/job-order/job-order.component';
import { JobOrderAllocationComponent } from './repair/job-order-allocation/job-order-allocation.component';
import { ResidueDisposalEstimateComponent } from './residue-disposal/estimate/estimate.component';
import { ResidueDisposalEstimateNewComponent } from './residue-disposal/estimate-new/estimate-new.component';
import { ResidueDisposalApprovalViewComponent } from './residue-disposal/approval-view/approval-view.component';
import { JobOrderCleaningComponent } from './cleaning/job-order/job-order.component';
import { JobOrderResidueDisposalComponent } from './residue-disposal/job-order/job-order.component';
import { JobOrderAllocationResidueDisposalComponent } from './residue-disposal/job-order-allocation/job-order-allocation.component';
import { JobOrderTaskDetailsComponent } from './repair/job-order-task-details/job-order-task-details.component';
import { CleaningJobOrderTaskDetailsComponent } from './cleaning/job-order-task-details/job-order-task-details.component';
import { RepairQCViewComponent } from './repair/estimate-qc/estimate-qc.component';
import { TankMovementComponent } from './inventory/tank-movement/tank-movement.component';
import { TankMovementDetailsComponent } from './inventory/tank-movement-details/tank-movement-details.component';
import { ResidueJobOrderTaskDetailsComponent } from './residue-disposal/job-order-task-details/job-order-task-details.component';
import { ResidueQCViewComponent } from './residue-disposal/estimate-qc/estimate-qc.component';
import { TariffSteamComponent } from './tariff/tariff-steam/tariff-steam.component';
import { PackageSteamComponent } from './package/package-steam/package-steam.component';
import { SteamQCViewComponent } from './steam/estimate-qc/estimate-qc.component';
import { SteamJobOrderTaskDetailsComponent } from './steam/job-order-task-details/job-order-task-details.component';
import { JobOrderAllocationSteamComponent } from './steam/job-order-allocation/job-order-allocation.component';
import { JobOrderSteamComponent } from './steam/job-order/job-order.component';
import { SteamApprovalViewComponent } from './steam/approval-view/approval-view.component';
import { SteamEstimateNewComponent } from './steam/estimate-new/estimate-new.component';
import { SteamEstimateComponent } from './steam/estimate/estimate.component';
import { SteamApprovalComponent } from './steam/approval/approval.component';
import { SteamJobOrderTaskMonitorComponent } from './steam/job-order-monitor/job-order-task-monitor.component';
import { SurveyOthersComponent } from './survey/others/survey-others.component';
import { SurveyOthersDetailsComponent } from './survey/others-details/survey-others-details.component';
import { UserNewComponent } from './management/user-new/user-new.component';
import { UserComponent } from './management/user/user.component';
import { GroupComponent } from './management/group/group.component';
import {GroupNewComponent} from './management/group-new/group-new.component'
import { SurveyPeriodicTestComponent } from './survey/periodic-test/survey-periodic-test.component';
import { SurveyPeriodicTestDetailsComponent } from './survey/periodic-test-details/survey-periodic-test-details.component';
import { ResidueDisposalEstimateApprovalComponent } from './residue-disposal/estimate-approval/estimate-approval.component';
import {ResidueDisposalEstimateApprovalNewComponent} from './residue-disposal/estimate-approval-new/estimate-approval-new.component';
export const ADMIN_ROUTE: Routes = [
  {
    path: "parameter/cleaning-category",
    component: CleaningCategoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "parameter/cleaning-methods",
    component: CleaningMethodsComponent,
  },
  {
    path: "inventory/storing-order",
    component: StoringOrderComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: ['Admin'] }
  },
  {
    path: "inventory/storing-order/new",
    component: StoringOrderNewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "inventory/storing-order/edit/:id",
    component: StoringOrderNewComponent,
    canActivate: [AuthGuard],
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
    path: "inventory/tank-movement",
    component: TankMovementComponent,
  },
  {
    path: "inventory/tank-movement/details/:id",
    component: TankMovementDetailsComponent,
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
    path: "tariff/tariff-steam",
    component: TariffSteamComponent,
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
  },
  {
    path: "package/package-residue",
    component: PackageResidueComponent,
  },
  {
    path: "package/package-repair",
    component: PackageRepairComponent,
  },
  {
    path: "package/package-steam",
    component: PackageSteamComponent,
  },
  {
    path: "package/package-buffer",
    component: PackageBufferComponent,
  },
  {
    path: "repair/estimate",
    component: RepairEstimateComponent,
  },
  {
    path: "repair/estimate/new/:id",
    component: RepairEstimateNewComponent,
  },
  {
    path: "repair/estimate/edit/:id/:repair_id",
    component: RepairEstimateNewComponent,
    data: { action: 'edit' }
  },
  {
    path: "repair/estimate/duplicate/:id/:repair_id",
    component: RepairEstimateNewComponent,
    data: { action: 'duplicate' }
  },
  {
    path: "repair/approval",
    component: RepairApprovalComponent,
  },
  {
    path: "repair/approval/view/:id",
    component: RepairApprovalViewComponent,
  },
  {
    path: "repair/job-order",
    component: JobOrderComponent,
  },
  {
    path: "repair/job-order/allocation/:id",
    component: JobOrderAllocationComponent,
  },
  {
    path: "repair/job-order/task/:id/:repair_id",
    component: JobOrderTaskDetailsComponent,
  },
  {
    path: "repair/job-order/qc/view/:id",
    component: RepairQCViewComponent,
  },
  {
    path: "master/estimate-template",
    component: EstimateTemplateComponent,
  },
  {
    path: "master/estimate-template/new/:id",
    component: EstimateTemplateNewComponent,
  },
  {
    path: "master/customer",
    component: CustomerComponent,
  },
  {
    path: "master/customer/new/:id",
    component: CustomerNewComponent,
  },
  {
    path: "management/user",
    component: UserComponent,
  },
  {
    path: "management/user/new/:id",
    component: UserNewComponent,
  },
  {
    path: "management/group",
    component: GroupComponent,
  },
  {
    path: "management/group/new/:id",
    component: GroupNewComponent,
  },
  {
    path: "master/billing-branch",
    component: BillingBranchComponent,
  },
  {
    path: "master/billing-branch/new/:id",
    component: BillingBranchNewComponent,
  },
  {
    path: "cleaning/approval",
    component: CleaningApprovalComponent,
  },
  {
    path: "residue-disposal/estimate-approval",
    component: ResidueDisposalEstimateApprovalComponent,
  },
  {
    path: "residue-disposal/approval",
    component: ResidueDisposalApprovalComponent,
  },
  {
    path: "residue-disposal/estimate",
    component: ResidueDisposalEstimateComponent,
  },
  {
    path: "residue-disposal/estimate/new/:id",
    component: ResidueDisposalEstimateNewComponent,
  },
  {
    path: "residue-disposal/estimate-approval/new/:id",
    component: ResidueDisposalEstimateApprovalNewComponent,
  },
  {
    path: "residue-disposal/approval/view/:id",
    component: ResidueDisposalApprovalViewComponent,
  },
  {
    path: "cleaning/job-order",
    component: JobOrderCleaningComponent,
  },
  {
    path: "cleaning/job-order/task/:id/:clean_id",
    component: CleaningJobOrderTaskDetailsComponent,
  },
  {
    path: "residue-disposal/job-order",
    component: JobOrderResidueDisposalComponent,
  },
  {
    path: "residue-disposal/job-order/allocation/:id",
    component: JobOrderAllocationResidueDisposalComponent,
  },
  {
    path: "residue-disposal/job-order/task/:id/:residue_id",
    component: ResidueJobOrderTaskDetailsComponent,
  },
  {
    path: "residue-disposal/qc/view/:id",
    component: ResidueQCViewComponent,
  },
  {
    path: "steam/approval",
    component: SteamApprovalComponent,
  },
  {
    path: "steam/estimate",
    component: SteamEstimateComponent,
  },
  {
    path: "steam/estimate/new/:id",
    component: SteamEstimateNewComponent,
  },
  {
    path: "steam/approval/view/:id",
    component: SteamApprovalViewComponent,
  },
  {
    path: "steam/job-order",
    component: JobOrderSteamComponent,
  },
  {
    path: "steam/job-order/allocation/:id",
    component: JobOrderAllocationSteamComponent,
  },
  {
    path: "steam/job-order/task/:id/:steam_id",
    component: SteamJobOrderTaskDetailsComponent,
  },
  {
    path: "steam/job-order/monitor/:id/:steam_id",
    component: SteamJobOrderTaskMonitorComponent,
  },
  {
    path: "steam/qc/view/:id",
    component: SteamQCViewComponent,
  },
  {
    path: "survey/others",
    component: SurveyOthersComponent,
  },
  {
    path: "survey/others/details/:id",
    component: SurveyOthersDetailsComponent,
  },
  {
    path: "survey/periodic-test",
    component: SurveyPeriodicTestComponent,
  },
  {
    path: "survey/periodic-test/details/:id",
    component: SurveyPeriodicTestDetailsComponent,
  },
];

// @NgModule({
//   imports: [RouterModule.forChild(ADMIN_ROUTE)],
//   exports: [RouterModule]
// })
// export class AdminRoutingModule { }
