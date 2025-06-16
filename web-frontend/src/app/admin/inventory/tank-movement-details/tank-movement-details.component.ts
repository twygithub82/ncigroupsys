import { Direction } from '@angular/cdk/bidi';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatStepperModule, StepperOrientation } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { FileManagerService } from '@core/service/filemanager.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { PreviewImageDialogComponent } from '@shared/components/preview-image-dialog/preview-image-dialog.component';
import { PreviewRepairEstFormDialog } from '@shared/preview/preview_repair_estimate/preview-repair-estimate.component';
import { Apollo } from 'apollo-angular';
import { BillingDS, BillingSOTGo } from 'app/data-sources/billing';
import { BookingDS, BookingItem } from 'app/data-sources/booking';
import { CodeValuesDS, CodeValuesItem, addDefaultSelectOption } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS, InGateItem } from 'app/data-sources/in-gate';
import { InGateCleaningDS, InGateCleaningGO, InGateCleaningItem } from 'app/data-sources/in-gate-cleaning';
import { InGateSurveyDS, InGateSurveyGO, InGateSurveyItem } from 'app/data-sources/in-gate-survey';
import { JobOrderDS, JobOrderGO, RepJobOrderRequest } from 'app/data-sources/job-order';
import { OutGateDS, OutGateItem } from 'app/data-sources/out-gate';
import { OutGateSurveyDS, OutGateSurveyItem } from 'app/data-sources/out-gate-survey';
import { PackageBufferDS, PackageBufferItem } from 'app/data-sources/package-buffer';
import { PackageDepotDS, PackageDepotItem } from 'app/data-sources/package-depot';
import { PackageLabourDS, PackageLabourItem } from 'app/data-sources/package-labour';
import { RepairDS, RepairItem } from 'app/data-sources/repair';
import { RepairPartDS, RepairPartItem } from 'app/data-sources/repair-part';
import { ResidueDS, ResidueItem } from 'app/data-sources/residue';
import { ResidueEstPartGO } from 'app/data-sources/residue-part';
import { RPDamageRepairItem } from 'app/data-sources/rp-damage-repair';
import { SchedulingDS, SchedulingItem } from 'app/data-sources/scheduling';
import { SteamDS, SteamItem } from 'app/data-sources/steam';
import { SteamPartGO } from 'app/data-sources/steam-part';
import { StoringOrderGO, StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTank, StoringOrderTankDS, StoringOrderTankGO, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { SurveyDetailDS, SurveyDetailItem } from 'app/data-sources/survey-detail';
import { TankDS, TankItem } from 'app/data-sources/tank';
import { TankInfoDS, TankInfoItem } from 'app/data-sources/tank-info';
import { TariffCleaningDS, TariffCleaningGO } from 'app/data-sources/tariff-cleaning';
import { TariffDepotDS, TariffDepotItem } from 'app/data-sources/tariff-depot';
import { TransferDS, TransferItem } from 'app/data-sources/transfer';
import { EirFormComponent } from 'app/document-template/pdf/eir-form/eir-form.component';
import { RepairEstimatePdfComponent } from 'app/document-template/pdf/repair-estimate-pdf/repair-estimate-pdf.component';
import { SteamHeatingPdfComponent } from 'app/document-template/pdf/steam-heating-pdf/steam-heating-pdf.component';
import { ModulePackageService } from 'app/services/module-package.service';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddPurposeFormDialogComponent } from './add-purpose-form-dialog/add-purpose-form-dialog.component';
import { ConfirmationRemarksFormDialogComponent } from './confirmation-remarks-form-dialog/confirmation-remarks-form-dialog.component';
import { EditGateDetailsFormDialogComponent } from './edit-gate-details-form-dialog/edit-gate-details-form-dialog.component';
import { EditSotDetailsFormDialogComponent } from './edit-sot-details-form-dialog/edit-sot-details-form-dialog.component';
import { EditSotSummaryFormDialogComponent } from './edit-sot-summary-form-dialog/edit-sot-summary-form-dialog.component';
import { OverwriteCleaningApprovalFormDialogComponent } from './overwrite-clean-appr-form-dialog/overwrite-clean-appr-form-dialog.component';
import { OverwriteCleanStatusFormDialogComponent } from './overwrite-clean-status-form-dialog/overwrite-clean-status-form-dialog.component';
import { OverwriteDepotCostFormDialogComponent } from './overwrite-depot-cost-form-dialog/overwrite-depot-cost-form-dialog.component';
import { OverwriteJobNoFormDialogComponent } from './overwrite-job-no-form-dialog/overwrite-job-no-form-dialog.component';
import { OverwriteLastCargoFormDialogComponent } from './overwrite-last-cargo-form-dialog/overwrite-last-cargo-form-dialog.component';
import { OverwriteRepairApprovalFormDialogComponent } from './overwrite-repair-appr-form-dialog/overwrite-repair-appr-form-dialog.component';
import { OverwriteResidueApprovalFormDialogComponent } from './overwrite-residue-appr-form-dialog/overwrite-residue-appr-form-dialog.component';
import { OverwriteSteamingApprovalFormDialogComponent } from './overwrite-steam-appr-form-dialog/overwrite-steam-appr-form-dialog.component';
import { OverwriteStorageFormDialogComponent } from './overwrite-storage-purpose-form-dialog/overwrite-storage-purpose-form-dialog.component';
import { RenumberTankFormDialogComponent } from './renumber-tank-form-dialog/renumber-tank-form-dialog.component';
import { ReownerTankFormDialogComponent } from './reowner-tank-form-dialog/reowner-tank-form-dialog.component';
import { SteamTempFormDialogComponent } from './steam-temp-form-dialog/steam-temp-form-dialog.component';
import { TankNoteFormDialogComponent } from './tank-note-form-dialog/tank-note-form-dialog.component';

@Component({
  selector: 'app-tank-movement-details',
  standalone: true,
  templateUrl: './tank-movement-details.component.html',
  styleUrl: './tank-movement-details.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BreadcrumbComponent,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatCheckboxModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    TranslateModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatCardModule,
    MatStepperModule,
    MatRadioModule,
    MatTabsModule,
  ]
})
export class TankMovementDetailsComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumnsSteaming = [
    'estimate_no',
    'degree_celsius',
    'estimate_date',
    'approve_dt',
    'begin_dt',
    'complete_dt',
    'status_cv',
    'bill',
    'actions'
  ];

  displayedColumnsResidue = [
    'estimate_no',
    'estimate_date',
    'approve_dt',
    'allocation_dt',
    'qc_dt',
    'status_cv',
    'actions'
  ];

  displayedColumnsRepair = [
    'estimate_no',
    'estimate_date',
    'approve_dt',
    'allocation_dt',
    'qc_dt',
    'status_cv',
    'actions',
  ];

  displayedColumnsBooking = [
    'book_type_cv',
    'booking_dt',
    'reference',
    'status_cv',
    'surveyor',
  ];

  displayedColumnsScheduling = [
    'book_type_cv',
    'scheduling_dt',
    'reference',
    'status_cv',
  ];

  displayedColumnsSurveyDetail = [
    'survey_type',
    'survey_dt',
    'surveyor',
    'remarks',
    'status_cv',
  ];

  displayedColumnsTransfer = [
    'transfer_out_dt',
    'transfer_in_dt',
    'days',
    'location_from_cv',
    'location_to_cv',
    'update_by',
    'update_dt'
  ];

  displayedColumnsDepotCostDetails = [
    "description",
    "job_no",
    "invoice",
    "cost"
  ]

  pageTitle = 'MENUITEMS.INVENTORY.LIST.TANK-MOVEMENT-DETAILS'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.INVENTORY.TEXT', route: '/admin/inventory/tank-movement' },
    { text: 'MENUITEMS.INVENTORY.LIST.TANK-MOVEMENT', route: '/admin/inventory/tank-movement' }
  ]

  translatedLangText: any = {};
  langText = {
    DETAILS: 'COMMON-FORM.DETAILS',
    STATUS: 'COMMON-FORM.STATUS',
    SO_NO: 'COMMON-FORM.SO-NO',
    RO_NO: 'COMMON-FORM.RO-NO',
    SO_RO: 'COMMON-FORM.SO/RO-NO',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    CUSTOMER_NAME: 'COMMON-FORM.CUSTOMER-NAME',
    SO_DATE: 'COMMON-FORM.SO-DATE',
    NO_OF_TANKS: 'COMMON-FORM.NO-OF-TANKS',
    LAST_CARGO: 'COMMON-FORM.LAST-CARGO',
    TANK_NO: 'COMMON-FORM.TANK-NO',
    JOB_NO: 'COMMON-FORM.JOB-NO',
    PURPOSE: 'COMMON-FORM.PURPOSE',
    ETA_DATE: 'COMMON-FORM.ETA-DATE',
    NO_RESULT: 'COMMON-FORM.NO-RESULT',
    ARE_YOU_SURE_CANCEL: 'COMMON-FORM.ARE-YOU-SURE-CANCEL',
    CANCEL: 'COMMON-FORM.CANCEL',
    UPDATE: 'COMMON-FORM.UPDATE',
    CLOSE: 'COMMON-FORM.CLOSE',
    TO_BE_CANCELED: 'COMMON-FORM.TO-BE-CANCELED',
    CANCELED_SUCCESS: 'COMMON-FORM.CANCELED-SUCCESS',
    SEARCH: "COMMON-FORM.SEARCH",
    EIR_NO: "COMMON-FORM.EIR-NO",
    EIR_DATE: "COMMON-FORM.EIR-DATE",
    ORDER_DETAILS: "COMMON-FORM.ORDER-DETAILS",
    CUSTOMER: "COMMON-FORM.CUSTOMER",
    OWNER: "COMMON-FORM.OWNER",
    CLEAN_STATUS: "COMMON-FORM.CLEAN-STATUS",
    CURRENT_STATUS: "COMMON-FORM.CURRENT-STATUS",
    GATE_IN_DATE: "COMMON-FORM.GATE-IN-DATE",
    EIR_DATE_TIME: "COMMON-FORM.EIR-DATE-TIME",
    SURVEY_INFO: "COMMON-FORM.SURVEY-INFO",
    DATE_OF_INSPECTION: "COMMON-FORM.DATE-OF-INSPECTION",
    PERIODIC_TEST: "COMMON-FORM.PERIODIC-TEST",
    LAST_TEST: "COMMON-FORM.LAST-TEST",
    NEXT_TEST: "COMMON-FORM.NEXT-TEST",
    TEST_TYPE: "COMMON-FORM.TEST-TYPE",
    DATE: "COMMON-FORM.DATE",
    CLASS: "COMMON-FORM.CLASS",
    GATE_IN: "COMMON-FORM.GATE-IN",
    GATE_OUT: "COMMON-FORM.GATE-OUT",
    IN_GATE_DETAILS: "COMMON-FORM.IN-GATE-DETAILS",
    IN_GATE_REMARKS: "COMMON-FORM.IN-GATE-REMARKS",
    HAULIER: 'COMMON-FORM.HAULIER',
    VEHICLE_NO: 'COMMON-FORM.VEHICLE-NO',
    DRIVER_NAME: 'COMMON-FORM.DRIVER-NAME',
    LAST_UPDATE_BY: 'COMMON-FORM.LAST-UPDATE-BY',
    LAST_UPDATE_ON: 'COMMON-FORM.LAST-UPDATE-ON',
    TANK_DETAILS: 'COMMON-FORM.TANK-DETAILS',
    UNIT_TYPE: 'COMMON-FORM.UNIT-TYPE',
    MANUFACTURER_DOM: 'COMMON-FORM.MANUFACTURER-AND-DOM',
    CLADDING: 'COMMON-FORM.CLADDING',
    CAPACITY: 'COMMON-FORM.CAPACITY',
    TARE_WEIGHT: 'COMMON-FORM.TARE-WEIGHT',
    MAX_GROSS_WEIGHT: 'COMMON-FORM.MAX-GROSS-WEIGHT',
    TANK_HEIGHT: 'COMMON-FORM.TANK-HEIGHT',
    WALKWAY: 'COMMON-FORM.WALKWAY',
    BOTTOM_DISCHARGE_TYPE: 'COMMON-FORM.BOTTOM-DISCHARGE-TYPE',
    COMPARTMENT_TYPE: 'COMMON-FORM.COMPARTMENT-TYPE',
    BACK: 'COMMON-FORM.BACK',
    SAVE: 'COMMON-FORM.SAVE',
    BOTTOM_DIS_COMP: 'COMMON-FORM.BOTTOM-DIS-COMP',
    FOOT_VALVE: 'COMMON-FORM.FOOT-VALVE',
    BOTTOM_DIS_VALVE: 'COMMON-FORM.BOTTOM-DIS-VALVE',
    THERMOMETER: 'COMMON-FORM.THERMOMETER',
    LADDER: 'COMMON-FORM.LADDER',
    DATA_SCS_TRANSPORT_PLATE: 'COMMON-FORM.DATA-SCS-TRANSPORT-PLATE',
    TOP_DIS_COMP: 'COMMON-FORM.TOP-DIS-COMP',
    TOP_DIS_VALVE: 'COMMON-FORM.TOP-DIS-VALVE',
    AIRLINE_VALVE: 'COMMON-FORM.AIRLINE-VALVE',
    AIRLINE_VALVE_CONNECTIONS: 'COMMON-FORM.AIRLINE-VALVE-CONNECTIONS',
    MANLID_COMPARTMENT: 'COMMON-FORM.MANLID-COMPARTMENT',
    MANLID_COVER: 'COMMON-FORM.MANLID-COVER',
    MANLID_SEAL: 'COMMON-FORM.MANLID-SEAL',
    PV: 'COMMON-FORM.PV',
    SAFETY_HANDRAIL: 'COMMON-FORM.SAFETY-HANDRAIL',
    BUFFER_PLATE: 'COMMON-FORM.BUFFER-PLATE',
    RESIDUE: 'COMMON-FORM.RESIDUE',
    DIPSTICK: 'COMMON-FORM.DIPSTICK',
    SPECIFICATION: 'COMMON-FORM.SPECIFICATION',
    DIAMITER: 'COMMON-FORM.DIAMITER',
    PIECES: 'COMMON-FORM.PIECES',
    VOLUME: 'COMMON-FORM.VOLUME',
    OTHER_COMMENTS: 'COMMON-FORM.OTHER-COMMENTS',
    BRAND: 'COMMON-FORM.BRAND',
    BOTTOM: 'COMMON-FORM.BOTTOM',
    TOP: 'COMMON-FORM.TOP',
    MANLID: 'COMMON-FORM.MANLID',
    FRAME_TYPE: 'COMMON-FORM.FRAME-TYPE',
    LEFT_SIDE: 'COMMON-FORM.LEFT-SIDE',
    REAR_SIDE: 'COMMON-FORM.REAR-SIDE',
    RIGHT_SIDE: 'COMMON-FORM.RIGHT-SIDE',
    TOP_SIDE: 'COMMON-FORM.TOP-SIDE',
    FRONT_SIDE: 'COMMON-FORM.FRONT-SIDE',
    BOTTOM_SIDE: 'COMMON-FORM.BOTTOM-SIDE',
    TANK_PHOTOS: 'COMMON-FORM.TANK-PHOTOS',
    SO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    SAVE_SUCCESS: 'COMMON-FORM.SAVE-SUCCESS',
    MARK_DAMAGE: 'COMMON-FORM.MARK-DAMAGE',
    FILL_IN_REMARKS: 'COMMON-FORM.FILL-IN-REMARKS',
    LEFT_REMARKS: 'COMMON-FORM.LEFT-REMARKS',
    REAR_REMARKS: 'COMMON-FORM.REAR-REMARKS',
    RIGHT_REMARKS: 'COMMON-FORM.RIGHT-REMARKS',
    TOP_REMARKS: 'COMMON-FORM.TOP-REMARKS',
    FRONT_REMARKS: 'COMMON-FORM.FRONT-REMARKS',
    BOTTOM_REMARKS: 'COMMON-FORM.BOTTOM-REMARKS',
    SIDES: 'COMMON-FORM.SIDES',
    SAVE_ERROR: 'COMMON-FORM.SAVE-ERROR',
    DAMAGE_PHOTOS: 'COMMON-FORM.DAMAGE-PHOTOS',
    PREVIEW: 'COMMON-FORM.PREVIEW',
    DELETE: 'COMMON-FORM.DELETE',
    CONFIRM_DELETE: 'COMMON-FORM.CONFIRM-DELETE',
    DELETE_SUCCESS: 'COMMON-FORM.DELETE-SUCCESS',
    PREVIEW_PHOTOS: 'COMMON-FORM.PREVIEW-PHOTOS',
    TANK_SUMMARY_DETAILS: 'COMMON-FORM.TANK-SUMMARY-DETAILS',
    BOTTOM_DIS_TYPE: 'COMMON-FORM.BOTTOM-DIS-TYPE',
    CHECK_DIGIT: 'COMMON-FORM.CHECK-DIGIT',
    NOTES: 'COMMON-FORM.NOTES',
    RELEASE_NOTES: 'COMMON-FORM.RELEASE-NOTES',
    RELEASE_DATE: 'COMMON-FORM.RELEASE-DATE',
    GATE_DETAILS: 'COMMON-FORM.GATE-DETAILS',
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    ORDER_NO: 'COMMON-FORM.ORDER-NO',
    ORDER_DATE: 'COMMON-FORM.ORDER-DATE',
    REMARKS: 'COMMON-FORM.REMARKS',
    UPDATE_DATE: 'COMMON-FORM.UPDATE-DATE',
    TRANSACTION_DATE: 'COMMON-FORM.TRANSACTION-DATE',
    IN_GATE: 'COMMON-FORM.IN-GATE',
    OUT_GATE: 'COMMON-FORM.OUT-GATE',
    STORAGE: 'COMMON-FORM.STORAGE',
    STEAM: 'COMMON-FORM.STEAM',
    CLEANING: 'COMMON-FORM.CLEANING',
    REPAIR: 'COMMON-FORM.REPAIR',
    STORAGE_BEGIN_DATE: 'COMMON-FORM.STORAGE-BEGIN-DATE',
    STORAGE_DAYS: 'COMMON-FORM.STORAGE-DAYS',
    AVAILABLE_DATE: 'COMMON-FORM.AVAILABLE-DATE',
    ETR_DATE: 'COMMON-FORM.ETR-DATE',
    STORAGE_CLOSE_DATE: 'COMMON-FORM.STORAGE-CLOSE-DATE',
    FREE_STORAGE_DAYS: 'COMMON-FORM.FREE-STORAGE-DAYS',
    STORAGE_CALCULATE_BY: 'COMMON-FORM.STORAGE-CALCULATE-BY',
    QUOTATION_DATE: 'COMMON-FORM.QUOTATION-DATE',
    CLEAN_DATE: 'COMMON-FORM.CLEAN-DATE',
    JOB_STATUS: 'COMMON-FORM.JOB-STATUS',
    APPROVED_DATE: 'COMMON-FORM.APPROVED-DATE',
    PROCESS: 'COMMON-FORM.PROCESS',
    PROCESSING_DAYS: 'COMMON-FORM.PROCESSING-DAYS',
    BILL: 'COMMON-FORM.BILL',
    COMPLETED_DATE: 'COMMON-FORM.COMPLETED-DATE',
    DURATION_DAY_HR_MIN: 'COMMON-FORM.DURATION-DAY-HR-MIN',
    CLEANING_BAY: 'COMMON-FORM.CLEANING-BAY',
    DEPOT_REFERENCE: 'COMMON-FORM.DEPOT-REFERENCE',
    RESIDUE_QUANTITY: 'COMMON-FORM.RESIDUE-QUANTITY',
    CUSTOMER_REFERENCE: 'COMMON-FORM.CUSTOMER-REFERENCE',
    ADD_CLEANING_PURPOSE: 'COMMON-FORM.ADD-CLEANING-PURPOSE',
    NO_CLEANING_PURPOSE: 'COMMON-FORM.NO-CLEANING-PURPOSE',
    REMOVE_CLEANING_PURPOSE: 'COMMON-FORM.REMOVE-CLEANING-PURPOSE',
    NO_RESIDUE: 'COMMON-FORM.NO-RESIDUE',
    ADD_STEAM_PURPOSE: 'COMMON-FORM.ADD-STEAM-PURPOSE',
    NO_STEAM_PURPOSE: 'COMMON-FORM.NO-STEAM-PURPOSE',
    REMOVE_STEAM_PURPOSE: 'COMMON-FORM.REMOVE-STEAM-PURPOSE',
    ADD_STORAGE_PURPOSE: 'COMMON-FORM.ADD-STORAGE-PURPOSE',
    NO_STORAGE_PURPOSE: 'COMMON-FORM.NO-STORAGE-PURPOSE',
    REMOVE_STORAGE_PURPOSE: 'COMMON-FORM.REMOVE-STORAGE-PURPOSE',
    ADD_REPAIR_PURPOSE: 'COMMON-FORM.ADD-REPAIR-PURPOSE',
    NO_REPAIR_PURPOSE: 'COMMON-FORM.NO-REPAIR-PURPOSE',
    REMOVE_REPAIR_PURPOSE: 'COMMON-FORM.REMOVE-REPAIR-PURPOSE',
    REPAIR_BEGIN_DATE: 'COMMON-FORM.REPAIR-BEGIN-DATE',
    REPAIR_COMPLETED_DATE: 'COMMON-FORM.REPAIR-COMPLETED-DATE',
    REPAIR_TYPE: 'COMMON-FORM.REPAIR-TYPE',
    ESTIMATE_NO: 'COMMON-FORM.ESTIMATE-NO',
    ESTIMATE_DATE: 'COMMON-FORM.ESTIMATE-DATE',
    APPROVED_NO_ACTION: 'COMMON-FORM.APPROVED-NO-ACTION',
    ALLOCATION_DATE: 'COMMON-FORM.ALLOCATION-DATE',
    QC_DATE: 'COMMON-FORM.QC-DATE',
    DEPOT_COST_DETAILS: 'COMMON-FORM.DEPOT-COST-DETAILS',
    NO_DOT: 'COMMON-FORM.NO-DOT',
    INVOICE: 'COMMON-FORM.INVOICE',
    COST: 'COMMON-FORM.COST',
    PRE_INSPECTION: 'COMMON-FORM.PRE-INSPECTION',
    LIFT_OFF: 'COMMON-FORM.LIFT-OFF',
    LIFT_ON: 'COMMON-FORM.LIFT-ON',
    TAKE_IN_REFERENCE: 'COMMON-FORM.TAKE-IN-REFERENCE',
    RELEASE_REFERENCE: 'COMMON-FORM.RELEASE-REFERENCE',
    STORAGE_BILLING_DETAILS: 'COMMON-FORM.STORAGE-BILLING-DETAILS',
    BILLING_PROFILE: 'COMMON-FORM.BILLING-PROFILE',
    STORAGE_BILLED_UNTIL: 'COMMON-FORM.STORAGE-BILLED-UNTIL',
    BILLED_UNTIL: 'COMMON-FORM.BILLED-UNTIL',
    BOOKING_DETAILS: 'COMMON-FORM.BOOKING-DETAILS',
    BOOKING: 'COMMON-FORM.BOOKING',
    BOOKING_TYPE: 'COMMON-FORM.BOOKING-TYPE',
    BOOKING_DATE: 'COMMON-FORM.BOOKING-DATE',
    REFERENCE: 'COMMON-FORM.REFERENCE',
    SURVEYOR: 'COMMON-FORM.SURVEYOR',
    SCHEDULING: 'COMMON-FORM.SCHEDULING',
    SCHEDULING_DATE: 'COMMON-FORM.SCHEDULING-DATE',
    SURVEY_DETAILS: 'COMMON-FORM.SURVEY-DETAILS',
    EXTERNAL_SURVEY_DETAILS: 'COMMON-FORM.EXTERNAL-SURVEY-DETAILS',
    TANK_NOTES: 'COMMON-FORM.TANK-NOTES',
    TRANSFER_DETAILS: 'COMMON-FORM.TRANSFER-DETAILS',
    RELOCATION_DETAILS: 'COMMON-FORM.RELOCATION-DETAILS',
    RESIDUE_COMPLETE_DATE: 'COMMON-FORM.RESIDUE-COMPLETE-DATE',
    RESIDUE_BEGIN_DATE: 'COMMON-FORM.RESIDUE-BEGIN-DATE',
    ADD: 'COMMON-FORM.ADD',
    REMOVE: 'COMMON-FORM.REMOVE',
    STEAM_BEGIN_DATE: 'COMMON-FORM.STEAM-BEGIN-DATE',
    STEAM_COMPLETE_DATE: 'COMMON-FORM.STEAM-COMPLETE-DATE',
    DEGREE_CELSIUS_SYMBOL: 'COMMON-FORM.DEGREE-CELSIUS-SYMBOL',
    BEGIN_DATE: 'COMMON-FORM.BEGIN-DATE',
    COMPLETE_DATE: 'COMMON-FORM.COMPLETE-DATE',
    SURVEY_DATE: 'COMMON-FORM.SURVEY-DATE',
    UPDATE_BY: 'COMMON-FORM.UPDATE-BY',
    REQUIRED_TEMP: 'COMMON-FORM.REQUIRED-TEMP',
    FLASH_POINT: 'COMMON-FORM.FLASH-POINT',
    EXCEEDED: 'COMMON-FORM.EXCEEDED',
    STEAM_MONITOR: 'COMMON-FORM.STEAM-MONITOR',
    TIME: 'COMMON-FORM.TIME',
    TRANSFER_SINCE: 'COMMON-FORM.TRANSFER-SINCE',
    TRANSFER_UNTIL: 'COMMON-FORM.TRANSFER-UNTIL',
    DAYS: 'COMMON-FORM.DAYS',
    TO_YARD: 'COMMON-FORM.TO-YARD',
    FROM_YARD: 'COMMON-FORM.FROM-YARD',
    FROM: 'COMMON-FORM.FROM',
    TO: 'COMMON-FORM.TO',
    YARD: 'COMMON-FORM.YARD',
    OVERWRITE_JOB_NO: 'COMMON-FORM.OVERWRITE-JOB-NO',
    OVERWRITE_DEPOT_COST: 'COMMON-FORM.OVERWRITE-DEPOT-COST',
    OVERWRITE_LAST_CARGO: 'COMMON-FORM.OVERWRITE-LAST-CARGO',
    OVERWRITE_CONDITION: 'COMMON-FORM.OVERWRITE-CONDITION',
    PROFILE_NAME: 'COMMON-FORM.PROFILE-NAME',
    PRE_INSPECTION_COST: 'COMMON-FORM.PRE-INSPECTION-COST',
    LIFT_OFF_COST: 'COMMON-FORM.LIFT-OFF-COST',
    LIFT_ON_COST: 'COMMON-FORM.LIFT-ON-COST',
    GATE_IN_COST: 'COMMON-FORM.GATE-IN-COST',
    GATE_OUT_COST: 'COMMON-FORM.GATE-OUT-COST',
    STORAGE_COST: 'COMMON-FORM.STORAGE-COST',
    OVERWRITE_APPROVAL: 'COMMON-FORM.OVERWRITE-APPROVAL',
    CARGO_NAME: 'COMMON-FORM.CARGO-NAME',
    APPROVED_COST: 'COMMON-FORM.APPROVED-COST',
    APPROVED_BUFFER_CLEANING_COST: 'COMMON-FORM.APPROVED-BUFFER-CLEANING-COST',
    LAST_CARGO_CLEANING_QUOTATION: 'COMMON-FORM.LAST-CARGO-CLEANING-QUOTATION',
    DEPOT_ESTIMATE: 'COMMON-FORM.DEPOT-ESTIMATE',
    CUSTOMER_APPROVAL: 'COMMON-FORM.CUSTOMER-APPROVAL',
    TOTAL_COST: 'COMMON-FORM.TOTAL-COST',
    UPDATED_ON: 'COMMON-FORM.UPDATED-ON',
    UPDATED_BY: 'COMMON-FORM.UPDATED-BY',
    APPROVAL: 'COMMON-FORM.APPROVAL',
    JOB_ALLOCATION: 'COMMON-FORM.JOB-ALLOCATION',
    JOB_COMPLETION: 'COMMON-FORM.JOB-COMPLETION',
    BILLING_DETAILS: 'COMMON-FORM.BILLING-DETAILS',
    ARE_YOU_SURE_ROLLBACK: 'COMMON-FORM.ARE-YOU-SURE-ROLLBACK',
    ROLLBACK: 'COMMON-FORM.ROLLBACK',
    REINSTATE: 'COMMON-FORM.REINSTATE',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    OVERWRITE_QC: 'COMMON-FORM.OVERWRITE-QC',
    ROLLBACK_SUCCESS: 'COMMON-FORM.ROLLBACK-SUCCESS',
    SURVEY_TYPE: 'COMMON-FORM.SURVEY-TYPE',
    APPLY_ALL: 'COMMON-FORM.APPLY-ALL',
    DURATION: 'COMMON-FORM.DURATION',
    KG: 'COMMON-FORM.KG',
    LITERS: 'COMMON-FORM.LITERS',
    EXPAND_ALL: 'COMMON-FORM.EXPAND-ALL',
    COLLAPSE_ALL: 'COMMON-FORM.COLLAPSE-ALL',
    QTY: 'COMMON-FORM.QTY',
    HOUR: 'COMMON-FORM.HOUR',
    UNIT_PRICE: 'COMMON-FORM.UNIT-PRICE',
    LABOUR: 'COMMON-FORM.LABOUR',
    TOTAL: 'COMMON-FORM.TOTAL',
    BILLING_TO: 'COMMON-FORM.BILLING-TO',
    BILLING_BRANCH: 'COMMON-FORM.BILING-BRANCH',
    OVERWRITE_DATA: 'COMMON-FORM.OVERWRITE-DATA',
    PRICE: 'COMMON-FORM.PRICE',
    MATERIAL: 'COMMON-FORM.MATERIAL$',
    MATERIAL_COST: 'COMMON-FORM.MATERIAL-COST',
    LABOUR_DISCOUNT: 'COMMON-FORM.LABOUR-DISCOUNT',
    MATERIAL_DISCOUNT: 'COMMON-FORM.MATERIAL-DISCOUNT',
    RATE: 'COMMON-FORM.RATE',
    NET_COST: 'COMMON-FORM.NET-COST',
    LESSEE: 'COMMON-FORM.LESSEE',
    PERCENTAGE_SYMBOL: 'COMMON-FORM.PERCENTAGE-SYMBOL',
    TEST_DATE: 'COMMON-FORM.TEST-DATE',
    OVERWRITE: 'COMMON-FORM.OVERWRITE',
    CLASS_BODIES: 'COMMON-FORM.CLASS-BODIES',
    MANUFACTURER: 'COMMON-FORM.MANUFACTURER',
    DOM: 'COMMON-FORM.DOM',
    RENUMBER: 'COMMON-FORM.RENUMBER',
    DAMAGE: 'COMMON-FORM.DAMAGE',
    SUBGROUP: 'COMMON-FORM.SUBGROUP',
    INVALID: 'COMMON-FORM.INVALID',
    EXISTED: 'COMMON-FORM.EXISTED',
    REOWNERSHIP: 'COMMON-FORM.REOWNERSHIP'
  }

  sot_guid: string | null | undefined;
  sot?: StoringOrderTankItem;
  igs?: InGateSurveyItem;
  ig?: InGateItem;
  og?: OutGateItem;
  ogs?: OutGateSurveyItem;
  pdItem?: PackageDepotItem;
  tiItem?: TankInfoItem;
  cleaningItem?: InGateCleaningItem[] = [];
  steamItem: SteamItem[] = [];
  residueItem: ResidueItem[] = [];
  repairItem: RepairItem[] = [];
  bookingList: BookingItem[] = [];
  schedulingList: SchedulingItem[] = [];
  surveyList: SurveyDetailItem[] = [];
  transferList: TransferItem[] = [];
  latestSurveyDetailItem: SurveyDetailItem[] = [];
  unit_typeList: TankItem[] = []
  allowAddPurposeTankStatuses: string[] = [
    'SO_GENERATED',
    'IN_GATE',
    'IN_SURVEY',
    'STEAM',
    'RESIDUE',
    'CLEANING',
    'REPAIR',
    'STORAGE',
    'RO_GENERATED'
  ];
  allowRemovePurposeStatuses: string[] = ['PENDING', 'CANCELED', 'APPROVED', 'NO_ACTION'];

  surveyForm?: UntypedFormGroup;

  sotDS: StoringOrderTankDS;
  sotStorageDS: StoringOrderTankDS;
  sotSteamingDS: StoringOrderTankDS;
  sotCleaningDS: StoringOrderTankDS;
  sotRepairDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  ogDS: OutGateDS;
  igsDS: InGateSurveyDS;
  ogsDS: OutGateSurveyDS;
  cvDS: CodeValuesDS;
  tDS: TankDS;
  pbDS: PackageBufferDS;
  pdDS: PackageDepotDS;
  steamDS: SteamDS;
  residueDS: ResidueDS;
  cleaningDS: InGateCleaningDS;
  joDS: JobOrderDS;
  repairDS: RepairDS;
  repairPartDS: RepairPartDS;
  bkDS: BookingDS;
  schedulingDS: SchedulingDS;
  surveyDS: SurveyDetailDS;
  tiDS: TankInfoDS;
  transferDS: TransferDS;
  tcDS: TariffCleaningDS;
  tdDS: TariffDepotDS;
  billDS: BillingDS;
  plDS: PackageLabourDS;

  customerCodeControl = new UntypedFormControl();
  ownerControl = new UntypedFormControl();
  ownerList?: CustomerCompanyItem[];
  purposeOptionCvList: CodeValuesItem[] = [];
  cleanStatusCvList: CodeValuesItem[] = [];
  testTypeCvList: CodeValuesItem[] = [];
  testClassCvList: CodeValuesItem[] = [];
  manufacturerCvList: CodeValuesItem[] = [];
  claddingCvList: CodeValuesItem[] = [];
  maxGrossWeightCvList: CodeValuesItem[] = [];
  tankHeightCvList: CodeValuesItem[] = [];
  walkwayCvList: CodeValuesItem[] = [];
  airlineCvList: CodeValuesItem[] = [];
  airlineConnCvList: CodeValuesItem[] = [];
  disCompCvList: CodeValuesItem[] = [];
  disValveCvList: CodeValuesItem[] = [];
  disValveSpecCvList: CodeValuesItem[] = [];
  disTypeCvList: CodeValuesItem[] = [];
  footValveCvList: CodeValuesItem[] = [];
  manlidCoverCvList: CodeValuesItem[] = [];
  manlidSealCvList: CodeValuesItem[] = [];
  pvSpecCvList: CodeValuesItem[] = [];
  pvTypeCvList: CodeValuesItem[] = [];
  thermometerCvList: CodeValuesItem[] = [];
  tankCompTypeCvList: CodeValuesItem[] = [];
  valveBrandCvList: CodeValuesItem[] = [];
  tankSideCvList: CodeValuesItem[] = [];
  surveyTypeCvList: CodeValuesItem[] = [];
  unitTypeCvList: CodeValuesItem[] = []
  groupNameCvList: CodeValuesItem[] = []
  subgroupNameCvList: CodeValuesItem[] = []
  damageCodeCvList: CodeValuesItem[] = []
  repairCodeCvList: CodeValuesItem[] = []

  storageCalCvList: CodeValuesItem[] = [];
  processStatusCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  bookingStatusCvList: CodeValuesItem[] = [];
  bookingTypeCvList: CodeValuesItem[] = [];
  repairOptionCvList: CodeValuesItem[] = [];
  yardCvList: CodeValuesItem[] = [];
  yesnoCvList: CodeValuesItem[] = [];

  tariffDepotList: TariffDepotItem[] = [];
  packageBufferList?: PackageBufferItem[];
  packageLabourItem?: PackageLabourItem;
  sotDepotCostDetails: any = []
  billingBranchList: CustomerCompanyItem[] = [];

  last_test_desc?: string = "";
  next_test_desc?: string = "";

  private sotPurposeChangeSubscriptions: Subscription[] = [];

  dateOfInspection: Date = new Date();
  startDateTest: Date = new Date();
  maxManuDOMDt: Date = new Date();
  defaultImg: string = '/assets/images/no_image.svg';

  // Stepper
  isLinear = false;

  rowSize = 11;
  colSize = 19;
  rowSizeSquare = 11;
  colSizeSquare = 11;
  cells: number[] = [];
  cellsSquare: number[] = [];

  // Walkway
  // outerRowSize = 10;
  // outerColSize = 19;
  innerColSize = 4;
  innerMiddleColSize = 12;
  cellsOuterTopBottom: number[] = [];
  cellsOuterLeftRight: number[] = [];
  cellsInnerTopBottom: number[] = [];
  cellsInnerMiddle: number[] = [];
  highlightedCellsWalkwayTop: boolean[] = [];
  highlightedCellsWalkwayMiddle: boolean[] = [];
  highlightedCellsWalkwayBottom: boolean[] = [];

  highlightedCellsLeft: boolean[] = [];
  highlightedCellsRear: boolean[] = [];
  highlightedCellsRight: boolean[] = [];
  highlightedCellsTop: boolean[] = [];
  highlightedCellsFront: boolean[] = [];
  highlightedCellsBottom: boolean[] = [];
  isDrawing = false;
  isMarkDmg = false;
  toggleState = true; // State to track whether to highlight or unhighlight
  currentImageIndex: number | null = null;
  isImageLoading$: Observable<boolean> = this.fileManagerService.loading$;

  accordionSections = {
    tank_details: "tank_details",
    gate_details: "gate_details",
    purpose_details: "purpose_details",
    depot_cost_details: "depot_cost_details",
    booking_details: "booking_details",
    survey_details: "survey_details",
    transfer_details: "transfer_details"
  }
  section = [this.accordionSections.tank_details];
  referenceFullSections: any = []

  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });
  stepperOrientation: Observable<StepperOrientation>;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private fileManagerService: FileManagerService,
    public modulePackageService: ModulePackageService
  ) {
    super();
    this.translateLangText();
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.sotStorageDS = new StoringOrderTankDS(this.apollo);
    this.sotSteamingDS = new StoringOrderTankDS(this.apollo);
    this.sotCleaningDS = new StoringOrderTankDS(this.apollo);
    this.sotRepairDS = new StoringOrderTankDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.ogDS = new OutGateDS(this.apollo);
    this.igsDS = new InGateSurveyDS(this.apollo);
    this.ogsDS = new OutGateSurveyDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.tDS = new TankDS(this.apollo);
    this.pbDS = new PackageBufferDS(this.apollo);
    this.pdDS = new PackageDepotDS(this.apollo);
    this.steamDS = new SteamDS(this.apollo);
    this.residueDS = new ResidueDS(this.apollo);
    this.cleaningDS = new InGateCleaningDS(this.apollo);
    this.joDS = new JobOrderDS(this.apollo);
    this.repairDS = new RepairDS(this.apollo);
    this.repairPartDS = new RepairPartDS(this.apollo);
    this.bkDS = new BookingDS(this.apollo);
    this.schedulingDS = new SchedulingDS(this.apollo);
    this.surveyDS = new SurveyDetailDS(this.apollo);
    this.tiDS = new TankInfoDS(this.apollo);
    this.transferDS = new TransferDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);
    this.tdDS = new TariffDepotDS(this.apollo);
    this.billDS = new BillingDS(this.apollo);
    this.plDS = new PackageLabourDS(this.apollo);

    const breakpointObserver = inject(BreakpointObserver);
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'vertical' : 'vertical')));
    this.referenceFullSections = Object.values(this.accordionSections);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.isImageLoading$ = this.fileManagerService.loading$;
    this.cells = Array(this.rowSize * this.colSize).fill(0);
    this.cellsSquare = Array(this.rowSizeSquare * this.colSizeSquare).fill(0);

    this.cellsInnerTopBottom = Array(this.innerColSize).fill(0);
    this.cellsInnerMiddle = Array(this.innerMiddleColSize).fill(0);
    this.initForm();
    this.loadData();
  }

  initForm() {
    this.surveyForm = this.fb.group({
    });

    this.initValueChanges();
  }

  initValueChanges() {
  }

  public loadData() {
    const queries = [
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'cleanStatusCv', codeValType: 'CLEAN_STATUS' },
      { alias: 'testTypeCv', codeValType: 'TEST_TYPE' },
      { alias: 'testClassCv', codeValType: 'TEST_CLASS' },
      { alias: 'manufacturerCv', codeValType: 'MANUFACTURER' },
      { alias: 'claddingCv', codeValType: 'CLADDING' },
      { alias: 'maxGrossWeightCv', codeValType: 'MAX_WEIGHT' },
      { alias: 'tankHeightCv', codeValType: 'TANK_HEIGHT' },
      { alias: 'walkwayCv', codeValType: 'WALKWAY' },
      { alias: 'airlineCv', codeValType: 'AIRLINE_VALVE' },
      { alias: 'airlineConnCv', codeValType: 'AIRLINE_VALVE_CONN' },
      { alias: 'disCompCv', codeValType: 'DIS_COMP' },
      { alias: 'disValveCv', codeValType: 'DIS_VALVE' },
      { alias: 'disValveSpecCv', codeValType: 'DIS_VALVE_SPEC' },
      { alias: 'disTypeCv', codeValType: 'DISCHARGE_TYPE' },
      { alias: 'footValveCv', codeValType: 'FOOT_VALVE' },
      { alias: 'manlidCoverCv', codeValType: 'MANLID_COVER' },
      { alias: 'manlidSealCv', codeValType: 'MANLID_SEAL' },
      { alias: 'pvSpecCv', codeValType: 'PV_SPEC' },
      { alias: 'pvTypeCv', codeValType: 'PV_TYPE' },
      { alias: 'thermometerCv', codeValType: 'THERMOMETER' },
      { alias: 'valveBrandCv', codeValType: 'VALVE_BRAND' },
      { alias: 'tankSideCv', codeValType: 'TANK_SIDE' },
      { alias: 'storageCalCv', codeValType: 'STORAGE_CAL' },
      { alias: 'processStatusCv', codeValType: 'PROCESS_STATUS' },
      { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
      { alias: 'bookingStatusCv', codeValType: 'BOOKING_STATUS' },
      { alias: 'bookingTypeCv', codeValType: 'BOOKING_TYPE' },
      { alias: 'repairOptionCv', codeValType: 'REPAIR_OPTION' },
      { alias: 'yardCv', codeValType: 'YARD' },
      { alias: 'yesnoCv', codeValType: 'YES_NO' },
      { alias: 'surveyTypeCv', codeValType: 'SURVEY_TYPE' },
      { alias: 'unitTypeCv', codeValType: 'UNIT_TYPE' },
      { alias: 'damageCodeCv', codeValType: 'DAMAGE_CODE' },
      { alias: 'repairCodeCv', codeValType: 'REPAIR_CODE' },
      { alias: 'groupNameCv', codeValType: 'GROUP_NAME' },
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      this.purposeOptionCvList = data;
    });
    this.cvDS.connectAlias('cleanStatusCv').subscribe(data => {
      this.cleanStatusCvList = addDefaultSelectOption(data, "Unknown");
    });
    this.cvDS.connectAlias('testTypeCv').subscribe(data => {
      this.testTypeCvList = data;
      this.last_test_desc = this.getLastTest();
      this.next_test_desc = this.getNextTest();
    });
    this.cvDS.connectAlias('testClassCv').subscribe(data => {
      this.testClassCvList = data;
      this.last_test_desc = this.getLastTest();
    });
    this.cvDS.connectAlias('manufacturerCv').subscribe(data => {
      this.manufacturerCvList = data;
    });
    this.cvDS.connectAlias('claddingCv').subscribe(data => {
      this.claddingCvList = data;
    });
    this.cvDS.connectAlias('maxGrossWeightCv').subscribe(data => {
      this.maxGrossWeightCvList = data;
    });
    this.cvDS.connectAlias('tankHeightCv').subscribe(data => {
      this.tankHeightCvList = data;
    });
    this.cvDS.connectAlias('walkwayCv').subscribe(data => {
      this.walkwayCvList = data;
    });
    this.cvDS.connectAlias('airlineCv').subscribe(data => {
      this.airlineCvList = data;
    });
    this.cvDS.connectAlias('airlineConnCv').subscribe(data => {
      this.airlineConnCvList = data;
    });
    this.cvDS.connectAlias('disCompCv').subscribe(data => {
      this.disCompCvList = data;
    });
    this.cvDS.connectAlias('disValveCv').subscribe(data => {
      this.disValveCvList = data;
    });
    this.cvDS.connectAlias('disValveSpecCv').subscribe(data => {
      this.disValveSpecCvList = data;
    });
    this.cvDS.connectAlias('disTypeCv').subscribe(data => {
      this.disTypeCvList = data;
    });
    this.cvDS.connectAlias('footValveCv').subscribe(data => {
      this.footValveCvList = data;
    });
    this.cvDS.connectAlias('manlidCoverCv').subscribe(data => {
      this.manlidCoverCvList = data;
    });
    this.cvDS.connectAlias('manlidSealCv').subscribe(data => {
      this.manlidSealCvList = data;
    });
    this.cvDS.connectAlias('pvSpecCv').subscribe(data => {
      this.pvSpecCvList = data;
    });
    this.cvDS.connectAlias('pvTypeCv').subscribe(data => {
      this.pvTypeCvList = data;
    });
    this.cvDS.connectAlias('thermometerCv').subscribe(data => {
      this.thermometerCvList = data;
    });
    this.cvDS.connectAlias('tankCompTypeCv').subscribe(data => {
      this.tankCompTypeCvList = data;
    });
    this.cvDS.connectAlias('valveBrandCv').subscribe(data => {
      this.valveBrandCvList = data;
    });
    this.cvDS.connectAlias('tankSideCv').subscribe(data => {
      this.tankSideCvList = data;
    });
    this.cvDS.connectAlias('storageCalCv').subscribe(data => {
      this.storageCalCvList = data;
    });
    this.cvDS.connectAlias('processStatusCv').subscribe(data => {
      this.processStatusCvList = data;
    });
    this.cvDS.connectAlias('tankStatusCv').subscribe(data => {
      this.tankStatusCvList = data;
    });
    this.cvDS.connectAlias('bookingStatusCv').subscribe(data => {
      this.bookingStatusCvList = data;
    });
    this.cvDS.connectAlias('bookingTypeCv').subscribe(data => {
      this.bookingTypeCvList = data;
    });
    this.cvDS.connectAlias('repairOptionCv').subscribe(data => {
      this.repairOptionCvList = data;
    });
    this.cvDS.connectAlias('yardCv').subscribe(data => {
      this.yardCvList = data;
    });
    this.cvDS.connectAlias('yesnoCv').subscribe(data => {
      this.yesnoCvList = data;
    });
    this.cvDS.connectAlias('surveyTypeCv').subscribe(data => {
      this.surveyTypeCvList = data;
    });
    this.cvDS.connectAlias('unitTypeCv').subscribe(data => {
      this.unitTypeCvList = data;
    });
    this.cvDS.connectAlias('damageCodeCv').subscribe(data => {
      this.damageCodeCvList = data;
    });
    this.cvDS.connectAlias('repairCodeCv').subscribe(data => {
      this.repairCodeCvList = data;
    });

    this.subs.sink = this.tDS.search({ tariff_depot_guid: { neq: null } }, null, 100).subscribe(data => {
      this.unit_typeList = data
    });

    this.cvDS.connectAlias('groupNameCv').subscribe(data => {
      this.groupNameCvList = data;
      const subqueries: any[] = [];
      data.map(d => {
        if (d.child_code) {
          let q = { alias: d.child_code, codeValType: d.child_code };
          const hasMatch = subqueries.some(subquery => subquery.codeValType === d.child_code);
          if (!hasMatch) {
            subqueries.push(q);
          }
        }
      });
      if (subqueries.length > 0) {
        this.cvDS?.getCodeValuesByType(subqueries);
        subqueries.map(s => {
          this.cvDS?.connectAlias(s.alias).subscribe(data => {
            this.subgroupNameCvList.push(...data);
          });
        });
      }
    });

    this.sot_guid = this.route.snapshot.paramMap.get('id');
    if (this.sot_guid) {
      // EDIT
      this.loadFullPage();
    }
  }

  getCustomerBufferPackage(customer_company_guid: string | undefined, tank_comp_guid: string | undefined) {
    if (!customer_company_guid) return;
    const where = {
      and: [
        { customer_company_guid: { eq: customer_company_guid } },
        // { tariff_buffer_guid: { eq: tank_comp_guid } }
      ]
    }
    this.subs.sink = this.pbDS.getCustomerPackageCost(where).subscribe(data => {
      if (data?.length > 0) {
        console.log(`getCustomerPackageCost: `, data)
        this.packageBufferList = data;
      }
    });
  }

  getCustomerLabourPackage(customer_company_guid: string) {
    const where = {
      and: [
        { customer_company_guid: { eq: customer_company_guid } }
      ]
    }
    this.subs.sink = this.plDS.getCustomerPackageCost(where).subscribe(data => {
      if (data?.length > 0) {
        this.packageLabourItem = data[0];
      }
    });
  }

  // export table data in excel file
  exportExcel() {
  }

  onFormSubmit() {
  }

  markFormGroupTouched(formGroup: UntypedFormGroup | undefined): void {
    if (formGroup) {
      Object.keys(formGroup.controls).forEach((key) => {
        const control = formGroup.get(key);
        if (control instanceof UntypedFormGroup) {
          this.markFormGroupTouched(control);
        } else {
          control!.markAsTouched();
        }
      });
    }
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.SAVE_SUCCESS;
      ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
    }
  }

  handleRollbackSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.ROLLBACK_SUCCESS;
      ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
    }
  }

  handleSaveError() {
    let successMsg = this.translatedLangText.SAVE_ERROR;
    ComponentUtil.showNotification('snackbar-error', successMsg, 'top', 'center', this.snackBar);
  }

  handleDeleteSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.DELETE_SUCCESS;
      ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
    }
  }

  // context menu
  onContextMenu(event: MouseEvent, item: StoringOrderItem) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    if (this.contextMenu !== undefined && this.contextMenu.menu !== null) {
      this.contextMenu.menuData = { item: item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
  }

  displayTankPurpose(sot: StoringOrderTankItem) {
    return this.sotDS.displayTankPurpose(sot, this.getPurposeOptionDescription.bind(this));
  }

  getPurposeOptionDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.purposeOptionCvList);
  }

  getCleanStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.cleanStatusCvList);
  }

  getSurveyTypeDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.surveyTypeCvList);
  }

  getMaxGrossWeightDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.maxGrossWeightCvList);
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  displayDateTime(input: number | undefined): string | undefined {
    var dateTime = Utility.convertEpochToDateTimeStr(input);
    if (dateTime && dateTime !== '-') {
      const parts = dateTime.split(' ');
      if (parts.length >= 2) {
        dateTime = `${parts[0]} - ${parts[1]}`;
      }
    }
    return dateTime;
  }

  displayDate(input: any): string | undefined {
    return Utility.convertEpochToDateStr(input);
  }

  convertDisplayDate(input: number | Date | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input as number);
  }

  getNatureInGateAlert() {
    return `${this.sot?.tariff_cleaning?.nature_cv} - ${this.sot?.tariff_cleaning?.in_gate_alert}`;
  }

  getBackgroundColorFromNature() {
    return Utility.getBackgroundColorFromNature(this.sot?.tariff_cleaning?.nature_cv?.toUpperCase());
  }

  getEventTarget(event: MouseEvent | TouchEvent): EventTarget | null {
    if (event instanceof MouseEvent) {
      return event.target;
    } else if (event instanceof TouchEvent) {
      return document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
    }
    return null;
  }

  isDisabled(index: number): boolean {
    return index === 4 || index === 5 || index === 9 || index === 10;
  }

  getHighlightedCoordinates(highlightedCells: boolean[]): { x: number, y: number }[] {
    const coordinates: any[] = [];
    for (let i = 0; i < highlightedCells.length; i++) {
      if (highlightedCells[i]) {
        const x = i % this.colSize;
        const y = Math.floor(i / this.colSize);
        coordinates.push({ x, y });
      }
    }
    return coordinates;
  }

  getTopCoordinates(): { x: number, y: number }[] {
    const dmg = this.getHighlightedCoordinates(this.highlightedCellsTop);
    const walkwayTop = this.getHighlightedCoordinates(this.highlightedCellsWalkwayTop);
    const walkwayMiddle = this.getHighlightedCoordinates(this.highlightedCellsWalkwayMiddle);
    const walkwayBottom = this.getHighlightedCoordinates(this.highlightedCellsWalkwayBottom);
    const result: any = {
      dmg,
      walkwayTop,
      walkwayMiddle,
      walkwayBottom,
    }
    return result;
  }

  onFileSelectedTankSide(event: Event, tankSideForm: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          const preview = reader.result as string | ArrayBuffer;
          tankSideForm.get('file')?.setValue(file);
          tankSideForm.get('preview')?.setValue(preview);
          // this.markForCheck();
        };
        reader.readAsDataURL(file);
      });
    }
    input.value = '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          const preview = reader.result as string | ArrayBuffer;
          // this.markForCheck();
        };
        reader.readAsDataURL(file);
      });
    }
    input.value = '';
  }

  parse2Decimal(input: number | string | undefined) {
    return Utility.formatNumberDisplay(input);
  }

  updatePurposeDialog(event: Event, type: string, action: string) {
    this.preventDefault(event);

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(AddPurposeFormDialogComponent, {
      disableClose: true,
      width: '600px',
      data: {
        type: type,
        action: action,
        sot: this.sot,
        populateData: {
          repairOptionCvList: this.repairOptionCvList,
        },
        translatedLangText: this.translatedLangText,
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result && this.sot) {
        this.sot.purpose_repair_cv = result.purpose_repair_cv;
        const tankPurposeRequest = {
          guid: this.sot?.guid,
          job_no: result.job_no,
          in_gate_dt: this.ig?.create_dt,
          tank_comp_guid: this.igs?.tank_comp_guid,
          purpose_changes: [
            {
              type: type.toUpperCase(),
              action: action.toUpperCase()
            }
          ],
          storing_order_tank: {
            guid: this.sot?.guid,
            purpose_repair_cv: type === "repair" ? result.purpose_repair_cv : this.sot?.purpose_repair_cv,
            cleaning_remarks: type === "cleaning" ? result.remarks : this.sot?.cleaning_remarks,
            repair_remarks: type === "repair" ? result.remarks : this.sot?.repair_remarks,
            steaming_remarks: type === "steaming" ? result.remarks : this.sot?.steaming_remarks,
            storage_remarks: type === "storage" ? result.remarks : this.sot?.storage_remarks,
            tank_status_cv: this.sot?.tank_status_cv,
            last_cargo_guid: this.sot?.last_cargo_guid,
            required_temp: result.required_temp,
            unit_type_guid: this.sot?.unit_type_guid,
            storing_order: {
              customer_company_guid: this.sot?.storing_order?.customer_company_guid
            },
            tariff_cleaning: {
              guid: this.sot?.tariff_cleaning?.guid,
              cleaning_category_guid: this.sot?.tariff_cleaning?.cleaning_category_guid
            }
          }
        }
        console.log(tankPurposeRequest)
        this.sotDS.updateTankPurpose(tankPurposeRequest).subscribe(result => {
          console.log(result)
          this.handleSaveSuccess(result?.data?.updateTankPurpose);
          if (this.sot_guid) {
            this.loadDataHandling_sot(this.sot_guid);
            if (type == 'steaming') {
              this.loadDataHandling_steam(this.sot_guid);
            } else if (type == 'cleaning') {
              this.loadDataHandling_residue(this.sot_guid);
              this.loadDataHandling_cleaning(this.sot_guid);
            } else if (type == 'repair') {
              this.loadDataHandling_repair(this.sot_guid);
            }
          }
        });
      }
    });
  }

  steamTempDialog(event: Event, steam: SteamItem) {
    this.preventDefault(event);
    if (steam?.create_by !== "system") { return; } // only auto approved have steam temperature

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(SteamTempFormDialogComponent, {
      disableClose: true,
      width: '1000px',
      data: {
        steamItem: steam,
        translatedLangText: this.translatedLangText,
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    });
  }

  repairDialog(event: Event, repair: RepairItem) {
    this.preventDefault(event);
    // if (repair.status_cv === 'PENDING' || repair.status_cv === 'CANCELED') return;
    // this.router.navigate(['/admin/repair/estimate/edit', this.sot?.guid, repair.guid], {
    //   state: { from: this.router.url } // store current route
    // });

    // if (!this.modulePackageService.isGrowthPackage() && !this.modulePackageService.isCustomizedPackage()) return;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(PreviewRepairEstFormDialog, {
      // width: '794px',
      height: '90vh',
      // position: { top: '-9999px', left: '-9999px' },
      data: {
        repair_guid: repair?.guid,
      },
      // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    });
  }

  steamHeatingLogDialog(event: Event, steam: SteamItem) {
    this.preventDefault(event);
    return;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(SteamHeatingPdfComponent, {
      width: '794px',
      height: '80vh',
      data: {
        steam_guid: steam?.guid,
        customer_company_guid: this.sot?.storing_order?.customer_company_guid,
        estimate_no: steam?.estimate_no,
        repairEstimatePdf: undefined,
        retrieveFile: true
      },
      // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    });
  }

  editTankNotes(event: Event) {
    this.preventDefault(event);
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(TankNoteFormDialogComponent, {
      disableClose: true,
      width: '600px',
      data: {
        tankNote: this.sot?.tank_note,
        releaseNote: this.sot?.release_note,
        action: 'edit',
        translatedLangText: this.translatedLangText,
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result && this.sot) {
        this.sot.tank_note = result.tank_note;
        this.sot.release_note = result.release_note;
        const updateSotReq = new StoringOrderTankGO({
          guid: this.sot.guid,
          tank_note: this.sot.tank_note,
          release_note: this.sot.release_note,
        });
        console.log(updateSotReq);
        this.sotDS.updateStoringOrderTank(updateSotReq).subscribe(result => {
          console.log(result)
          this.handleSaveSuccess(result?.data?.updateStoringOrderTank);
        });
      }
    });
  }

  deleteDialog(imgForm: any, event: Event) {
    event.preventDefault(); // Prevents the form submission

    const url = imgForm.get('preview')?.value;

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        headerText: this.translatedLangText.CONFIRM_DELETE,
        action: 'new',
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result.action === 'confirmed') {
        if (Utility.isBase64Url(url)) {
          imgForm.patchValue({
            preview: ''
          });
          // this.markForCheck();
          this.handleDeleteSuccess(1);
        } else if (Utility.isUrl(url)) {
          this.fileManagerService.deleteFile([url]).subscribe({
            next: (response) => {
              console.log('Files delete successfully:', response);
              imgForm.patchValue({
                preview: ''
              });
              // this.markForCheck();
              this.handleDeleteSuccess(response);
            },
            error: (error) => {
              console.error('Error delete files:', error);
              this.handleSaveError();
            },
            complete: () => {
              console.log('Delete process completed.');
            }
          });
        } else {
          console.log('Unknown format');
        }
      }
    });
  }

  overwriteJobNoDialog(event: Event) {
    this.preventDefault(event);

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(OverwriteJobNoFormDialogComponent, {
      disableClose: true,
      width: '600px',
      data: {
        sot: this.sot,
        translatedLangText: this.translatedLangText,
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result && this.sot) {
        const newSot = new StoringOrderTank(this.sot);
        newSot.preinspect_job_no = result.preinspect_job_no;
        newSot.liftoff_job_no = result.liftoff_job_no;
        newSot.lifton_job_no = result.lifton_job_no;
        newSot.job_no = result.job_no;
        newSot.release_job_no = result.release_job_no;
        newSot.job_no_remarks = result.job_no_remarks;

        // Update current sot for display purpose
        this.sot.preinspect_job_no = result.preinspect_job_no;
        this.sot.liftoff_job_no = result.liftoff_job_no;
        this.sot.lifton_job_no = result.lifton_job_no;
        this.sot.job_no = result.job_no;
        this.sot.release_job_no = result.release_job_no;
        this.sot.job_no_remarks = result.job_no_remarks;

        console.log(newSot)
        this.sotDS.updateJobNo(newSot).subscribe(result => {
          console.log(result)
          this.handleSaveSuccess(result?.data?.updateJobNo);
        });
      }
    });
  }

  overwriteDepotCostDialog(event: Event) {
    this.preventDefault(event);

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(OverwriteDepotCostFormDialogComponent, {
      disableClose: true,
      width: '600px',
      data: {
        billingSot: this.sot?.billing_sot,
        translatedLangText: this.translatedLangText,
        tariffDepotList: this.tariffDepotList,
        populateData: {
          storageCalCvList: this.storageCalCvList,
          yesnoCvList: this.yesnoCvList,
        }
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result && this.sot && this.sot.billing_sot) {
        const newSot = new BillingSOTGo(this.sot?.billing_sot);
        newSot.tariff_depot_guid = result.tariff_depot_guid;
        newSot.preinspection = result.preinspection;
        newSot.preinspection_cost = result.preinspection_cost;
        newSot.lift_on = result.lift_on;
        newSot.lift_on_cost = result.lift_on_cost;
        newSot.lift_off = result.lift_off;
        newSot.lift_off_cost = result.lift_off_cost;
        newSot.gate_in = result.gate_in;
        newSot.gate_in_cost = result.gate_in_cost;
        newSot.gate_out = result.gate_out;
        newSot.gate_out_cost = result.gate_out_cost;
        newSot.storage_cal_cv = result.storage_cal_cv;
        newSot.storage_cost = result.storage_cost;
        newSot.free_storage = result.free_storage;
        newSot.depot_cost_remarks = result.depot_cost_remarks;

        if (this.sot && this.sot.billing_sot) {
          // Update current sot for display purpose
          this.sot.billing_sot.tariff_depot_guid = result.tariff_depot_guid;
          this.sot.billing_sot.preinspection = result.preinspection;
          this.sot.billing_sot.preinspection_cost = result.preinspection_cost;
          this.sot.billing_sot.lift_on = result.lift_on;
          this.sot.billing_sot.lift_on_cost = result.lift_on_cost;
          this.sot.billing_sot.lift_off = result.lift_off;
          this.sot.billing_sot.lift_off_cost = result.lift_off_cost;
          this.sot.billing_sot.gate_in = result.gate_in;
          this.sot.billing_sot.gate_in_cost = result.gate_in_cost;
          this.sot.billing_sot.gate_out = result.gate_out;
          this.sot.billing_sot.gate_out_cost = result.gate_out_cost;
          this.sot.billing_sot.storage_cal_cv = result.storage_cal_cv;
          this.sot.billing_sot.storage_cost = result.storage_cost;
          this.sot.billing_sot.free_storage = result.free_storage;
          this.sot.billing_sot.depot_cost_remarks = result.depot_cost_remarks;
          this.loadSotDepotCost();
        }

        console.log(newSot)
        this.billDS.updateBillingSot(newSot).subscribe(result => {
          console.log(result)
          this.handleSaveSuccess(result?.data?.updateBillingSOT);
        });
      }
    });
  }

  renumberTankDialog(event: Event) {
    this.preventDefault(event);
    const action = 'renumber';
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(RenumberTankFormDialogComponent, {
      disableClose: true,
      width: '500px',
      data: {
        action: action,
        sot: this.sot,
        translatedLangText: this.translatedLangText,
        transferList: this.transferList,
        sotDS: this.sotDS
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result && this.sot && this.tiItem) {
        console.log(result)
        const newSot = {
          guid: this.sot?.guid,
          tank_no: result.tank_no,
        };

        const newTi = {
          guid: this.tiItem?.guid,
          tank_no: this.sot.tank_no,
        }

        const updateTankInfo = {
          action: action,
          sot: newSot,
          tankInfo: newTi
        };
        this.sotDS.updateSotTankInfo(updateTankInfo).subscribe(result => {
          console.log(result)
          this.handleSaveSuccess(result?.data?.updateTankInfo);
          this.loadFullPage();
        });
      }
    });
  }

  reownerTankDialog(event: Event) {
    this.preventDefault(event);
    const action = 'reownership';
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ReownerTankFormDialogComponent, {
      disableClose: true,
      width: '500px',
      data: {
        action: action,
        sot: this.sot,
        translatedLangText: this.translatedLangText,
        transferList: this.transferList,
        sotDS: this.sotDS,
        ccDS: this.ccDS
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result && this.sot && this.tiItem) {
        const newSot = {
          guid: this.sot?.guid,
          owner_guid: result.owner_guid,
        };

        const newTi = {
          guid: this.tiItem?.guid,
          tank_no: this.sot.tank_no,
        }

        const updateTankInfo = {
          action: action,
          sot: newSot,
          tankInfo: newTi
        };
        console.log(updateTankInfo)
        this.sotDS.updateSotTankInfo(updateTankInfo).subscribe(result => {
          console.log(result)
          this.handleSaveSuccess(result?.data?.updateTankInfo);
          this.loadFullPage();
        });
      }
    });
  }

  changeCustomerTankDialog(event: Event) {
    this.preventDefault(event);
    const action = 'recustomer';
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ReownerTankFormDialogComponent, {
      disableClose: true,
      width: '500px',
      data: {
        action: action,
        sot: this.sot,
        translatedLangText: this.translatedLangText,
        transferList: this.transferList,
        sotDS: this.sotDS,
        ccDS: this.ccDS
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result && this.sot && this.tiItem) {
        const newSot: any = {
          guid: this.sot.guid,
          action: action
        };
        const newSo: any = {
          guid: this.sot?.storing_order?.guid,
          customer_company_guid: result.owner_guid
        };
        console.log('changeCustomerTankDialog(updateStoringOrderTank): ', newSot);
        console.log('changeCustomerTankDialog(updateStoringOrderTank): ', newSo);
        this.sotDS.updateStoringOrderTank(newSot, newSo, this.igs?.tank_comp_guid).subscribe(result => {
          console.log(result)
          this.handleSaveSuccess(result?.data?.updateStoringOrderTank);
        });
      }
    });
  }

  overwriteTankSummaryDialog(event: Event) {
    this.preventDefault(event);

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(EditSotSummaryFormDialogComponent, {
      disableClose: true,
      width: '50vw',
      data: {
        sot: this.sot,
        ig: this.ig,
        igs: this.igs,
        ti: this.tiItem,
        latestSurveyDetailItem: this.latestSurveyDetailItem,
        translatedLangText: this.translatedLangText,
        transferList: this.transferList,
        ccDS: this.ccDS,
        populateData: {
          yardCvList: this.yardCvList,
          testTypeCvList: this.testTypeCvList,
          testClassCvList: this.testClassCvList,
        }
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result && this.sot) {
        console.log(result)
        let newIg: any = undefined;
        let newIgs: any = undefined;
        let newTi: any = undefined;

        if (result.yard_cv) {
          newIg = {
            guid: this.ig?.guid,
            yard_cv: result.yard_cv,
          };
        }

        if (result.last_test_cv || result.next_test_cv || result.test_class_cv || result.test_dt) {
          newIgs = {
            guid: this.igs?.guid,
            last_test_cv: result.last_test_cv,
            next_test_cv: result.next_test_cv,
            test_class_cv: result.test_class_cv,
            test_dt: result.test_dt
          };
        }

        if (result.ti_yard_cv || result.ti_last_test_cv || result.ti_test_dt || result.ti_next_test_cv || result.ti_test_class_cv) {
          newTi = {
            guid: this.tiItem?.guid,
            tank_no: result?.tank_no,
            yard_cv: result.ti_yard_cv,
            last_test_cv: result.ti_last_test_cv,
            test_dt: result.ti_test_dt,
            next_test_cv: result.ti_next_test_cv,
            test_class_cv: result.ti_test_class_cv,
          };
        }

        const tankSummaryRequest = {
          ...(newIg && { ingate: newIg }),
          ...(newIgs && { ingateSurvey: newIgs }),
          so: undefined,
          sot: undefined,
          ...(newTi && { tankInfo: newTi })
        };
        this.sotDS.updateTankSummaryDetails(tankSummaryRequest).subscribe(result => {
          console.log(result)
          this.handleSaveSuccess(result?.data?.updateTankSummaryDetails);
          this.loadDataHandling_sot(this.sot_guid!);
          this.loadDataHandling_igs(this.sot_guid!);
          this.loadDataHandling_ig(this.sot_guid!);
        });
      }
    });
  }

  overwriteTankDetailsDialog(event: Event) {
    this.preventDefault(event);

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(EditSotDetailsFormDialogComponent, {
      disableClose: true,
      width: '50vw',
      data: {
        sot: this.sot,
        ig: this.ig,
        igs: this.igs,
        ti: this.tiItem,
        latestSurveyDetailItem: this.latestSurveyDetailItem,
        translatedLangText: this.translatedLangText,
        transferList: this.transferList,
        ccDS: this.ccDS,
        populateData: {
          claddingCvList: this.claddingCvList,
          testTypeCvList: this.testTypeCvList,
          testClassCvList: this.testClassCvList,
          disCompCvList: this.disCompCvList,
          manufacturerCvList: this.manufacturerCvList,
          maxGrossWeightCvList: this.maxGrossWeightCvList,
          walkwayCvList: this.walkwayCvList,
          unit_typeList: this.unit_typeList
        }
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result && this.sot) {
        console.log(result)
        const newSot = {
          guid: this.sot?.guid,
          unit_type_guid: result?.unit_type_guid
        }
        const newIgs = {
          guid: this.igs?.guid,
          cladding_cv: result?.cladding_cv,
          tare_weight: result?.tare_weight,
          btm_dis_comp_cv: result?.btm_dis_comp_cv,
          manufacturer_cv: result?.manufacturer_cv,
          dom_dt: result?.dom_dt,
          capacity: result?.capacity,
          max_weight_cv: result?.max_weight_cv,
          walkway_cv: result?.walkway_cv
        }
        const tankDetailRequest = {
          cleaning: undefined,
          ingateSurvey: newIgs,
          so: undefined,
          sot: newSot,
          steaming: undefined
        }
        console.log(`updateTankDetails: `, tankDetailRequest)
        this.sotDS.updateTankDetails(tankDetailRequest).subscribe(result => {
          console.log(result)
          this.handleSaveSuccess(result?.data?.updateTankDetails);
          this.loadDataHandling_sot(this.sot_guid!);
          this.loadDataHandling_igs(this.sot_guid!);
        });
      }
    });
  }

  overwriteGateDetailsDialog(event: Event, gateItem: any, action: string) {
    this.preventDefault(event);

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(EditGateDetailsFormDialogComponent, {
      disableClose: true,
      width: '50vw',
      data: {
        sot: this.sot,
        gateItem: gateItem,
        action: action,
        translatedLangText: this.translatedLangText,
        transferList: this.transferList,
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result && this.sot) {
        console.log(result)
        const newGate = {
          gateInfo: {
            guid: gateItem?.guid,
            remarks: result?.remarks,
            vehicle_no: result?.vehicle_no,
            driver_name: result?.driver_name
          },
          orderInfo: {
            guid: this.sot?.storing_order?.guid,
            haulier: result?.haulier
          },
          sot: {
            guid: this.sot?.guid,
            ...(action === 'in' && { job_no: result?.job_no }),
            ...(action === 'out' && { release_job_no: result?.job_no })
          }
        };
        const gateDetailRequest = {
          ...(action === 'in' && { inGateDetail: newGate }),
          ...(action === 'out' && { outGateDetail: newGate })
        };
        this.igDS.updateGateDetails(gateDetailRequest).subscribe(result => {
          console.log(result)
          this.handleSaveSuccess(result?.data?.updateGateDetails);
          this.loadDataHandling_sot(this.sot_guid!);
          this.loadDataHandling_ig(this.sot_guid!);
          this.loadDataHandling_og(this.sot_guid!);
        });
      }
    });
  }

  overwritePurposeStorageDialog(event: Event) {
    this.preventDefault(event);

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(OverwriteStorageFormDialogComponent, {
      disableClose: true,
      width: '50vw',
      data: {
        sot: this.sot,
        translatedLangText: this.translatedLangText,
        transferList: this.transferList,
        populateDate: {
          storageCalCvList: this.storageCalCvList
        }
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result && this.sot) {
        console.log(result)
        // const newGate = {
        //   gateInfo: {
        //     guid: gateItem?.guid,
        //     remarks: result?.remarks,
        //     vehicle_no: result?.vehicle_no,
        //     driver_name: result?.driver_name
        //   },
        //   orderInfo: {
        //     guid: this.sot?.storing_order?.guid,
        //     haulier: result?.haulier
        //   },
        //   sot: {
        //     guid: this.sot?.guid,
        //     ...(action === 'in' && { job_no: result?.job_no }),
        //     ...(action === 'out' && { release_job_no: result?.job_no })
        //   }
        // };
        // const gateDetailRequest = {
        //   ...(action === 'in' && { inGateDetail: newGate }),
        //   ...(action === 'out' && { outGateDetail: newGate })
        // };
        // this.igDS.updateGateDetails(gateDetailRequest).subscribe(result => {
        //   console.log(result)
        //   this.handleSaveSuccess(result?.data?.updateGateDetails);
        //   this.loadDataHandling_sot(this.sot_guid!);
        //   this.loadDataHandling_ig(this.sot_guid!);
        //   this.loadDataHandling_og(this.sot_guid!);
        // });
      }
    });
  }

  overwriteLastCargoDialog(event: Event) {
    this.preventDefault(event);

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(OverwriteLastCargoFormDialogComponent, {
      disableClose: true,
      width: '600px',
      data: {
        sot: this.sot,
        cleaning: this.cleaningItem,
        tcDS: this.tcDS,
        translatedLangText: this.translatedLangText,
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result && this.sot) {
        const newSot = {
          guid: this.sot.guid,
          tariff_cleaning: new TariffCleaningGO(result.last_cargo),
          last_cargo_guid: result.last_cargo_guid,
          last_cargo_remarks: result.last_cargo_remarks,
          cleaning: result.cleaning.map((item: any) => new InGateCleaningGO(item)),
          storing_order: new StoringOrderGO(this.sot.storing_order),
        }

        // Update current sot for display purpose
        this.sot.last_cargo_guid = result.last_cargo_guid;
        this.sot.last_cargo_remarks = result.last_cargo_remarks;
        this.sot.tariff_cleaning = result.last_cargo;

        console.log(newSot)
        this.sotDS.updateLastCargo(newSot).subscribe(result => {
          console.log(result)
          this.handleSaveSuccess(result?.data?.updateLastCargo);
        });
      }
    });
  }

  overwriteCleanStatusDialog(event: Event) {
    this.preventDefault(event);

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(OverwriteCleanStatusFormDialogComponent, {
      disableClose: true,
      width: '600px',
      data: {
        sot: this.sot,
        populateData: {
          cleanStatusCvList: this.cleanStatusCvList,
        },
        translatedLangText: this.translatedLangText,
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result && this.sot) {
        const newSot = {
          guid: this.sot.guid,
          clean_status_cv: result.clean_status_cv,
          clean_status_remarks: result.clean_status_remarks
        }

        // Update current sot for display purpose
        this.sot.clean_status_cv = result.clean_status_cv;
        this.sot.clean_status_remarks = result.clean_status_remarks;

        console.log(newSot)
        this.sotDS.updateCleanStatus(newSot).subscribe(result => {
          console.log(result)
          this.handleSaveSuccess(result?.data?.updateCleanStatus);
        });
      }
    });
  }

  overwriteCleaningApprovalDialog(event: Event) {
    this.preventDefault(event);

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(OverwriteCleaningApprovalFormDialogComponent, {
      disableClose: true,
      width: '80vw',
      height: '90vh',
      data: {
        sot: this.sot,
        cleaning: this.cleaningItem,
        ig: this.ig,
        igs: this.igs,
        tcDS: this.tcDS,
        ccDS: this.ccDS,
        translatedLangText: this.translatedLangText,
        populateData: {
          packageBufferList: this.packageBufferList,
          processStatusCvList: this.processStatusCvList
        }
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result && this.sot) {
        console.log(result)
        const newSot = new InGateCleaningGO(result.cleaning);
        newSot.approve_dt = result.approve_dt;
        newSot.cleaning_cost = result.cleaning_cost;
        newSot.buffer_cost = result.buffer_cost;
        newSot.overwrite_remarks = result.overwrite_remarks;
        newSot.action = "OVERWRITE";

        // Update current sot for display purpose
        const newIgs = new InGateSurveyGO(result.igs);
        newIgs.tank_comp_guid = result.tank_comp_guid;

        console.log(newSot)
        console.log(newIgs)
        this.cleaningDS.updateInGateCleaning(newSot, newIgs).subscribe(result => {
          console.log(result)
          if (this.sot_guid) {
            this.loadDataHandling_cleaning(this.sot_guid)
            this.handleSaveSuccess(result?.data?.updateCleaning);
          }
        });
      }
    });
  }

  overwriteSteamingApprovalDialog(event: Event, row: SteamItem) {
    this.preventDefault(event);

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(OverwriteSteamingApprovalFormDialogComponent, {
      disableClose: true,
      width: '80vw',
      height: '90vh',
      data: {
        sot: this.sot,
        steamItem: row,
        ig: this.ig,
        igs: this.igs,
        tcDS: this.tcDS,
        ccDS: this.ccDS,
        packageLabourItem: this.packageLabourItem,
        translatedLangText: this.translatedLangText,
        populateData: {
          packageBufferList: this.packageBufferList,
          processStatusCvList: this.processStatusCvList,
          billingBranchList: this.billingBranchList,
          last_test_desc: this.last_test_desc,
          next_test_desc: this.next_test_desc,
          sot_purpose: this.displayTankPurpose(this.sot!)
        }
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result && this.sot) {
        console.log(result)
        const newSteam: any = new SteamItem(row);
        newSteam.job_no = result.job_no;
        newSteam.bill_to_guid = result.billing_to;
        newSteam.overwrite_remarks = result.overwrite_remarks;
        newSteam.total_cost = result.total_cost;
        newSteam.steaming_part = result.steaming_part?.map((x: any) => {
          const obj = new SteamPartGO({ ...x });
          obj['action'] = 'overwrite';
          return obj;
        }) ?? [];
        newSteam.action = "overwrite";

        console.log(newSteam)
        this.steamDS.updateSteam(newSteam).subscribe(result => {
          console.log(result)
          if (this.sot_guid) {
            this.loadDataHandling_steam(this.sot_guid)
            this.handleSaveSuccess(result?.data?.updateSteaming);
          }
        });
      }
    });
  }

  overwriteResidueApprovalDialog(event: Event, row: ResidueItem) {
    this.preventDefault(event);

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(OverwriteResidueApprovalFormDialogComponent, {
      disableClose: true,
      width: '80vw',
      height: '90vh',
      data: {
        sot: this.sot,
        residueItem: row,
        ig: this.ig,
        igs: this.igs,
        tcDS: this.tcDS,
        ccDS: this.ccDS,
        cvDS: this.cvDS,
        packageLabourItem: this.packageLabourItem,
        translatedLangText: this.translatedLangText,
        populateData: {
          packageBufferList: this.packageBufferList,
          billingBranchList: this.billingBranchList,
          unitTypeCvList: this.unitTypeCvList,
          last_test_desc: this.last_test_desc,
          next_test_desc: this.next_test_desc,
          sot_purpose: this.displayTankPurpose(this.sot!)
        }
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result && this.sot) {
        console.log(result)
        const newResidue: any = new ResidueItem(row);
        newResidue.job_no = result.job_no;
        newResidue.bill_to_guid = result.billing_to;
        newResidue.overwrite_remarks = result.overwrite_remarks;
        newResidue.total_cost = result.total_cost;
        newResidue.residue_part = result.residue_part?.map((x: any) => {
          const obj = new ResidueEstPartGO({ ...x });
          obj['action'] = 'overwrite';
          return obj;
        }) ?? [];
        newResidue.action = "overwrite";

        console.log(newResidue)
        this.residueDS.updateResidue(newResidue).subscribe(result => {
          console.log(result)
          if (this.sot_guid) {
            this.loadDataHandling_residue(this.sot_guid)
            this.handleSaveSuccess(result?.data?.updateResidue);
          }
        });
      }
    });
  }

  overwriteRepairApprovalDialog(event: Event, row: RepairItem) {
    this.preventDefault(event);

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(OverwriteRepairApprovalFormDialogComponent, {
      disableClose: true,
      width: '80vw',
      height: '90vh',
      data: {
        sot: this.sot,
        repairItem: row,
        ig: this.ig,
        igs: this.igs,
        sotDS: this.sotDS,
        tcDS: this.tcDS,
        ccDS: this.ccDS,
        cvDS: this.cvDS,
        repairDS: this.repairDS,
        repairPartDS: this.repairPartDS,
        packageLabourItem: this.packageLabourItem,
        translatedLangText: this.translatedLangText,
        populateData: {
          packageBufferList: this.packageBufferList,
          billingBranchList: this.billingBranchList,
          groupNameCvList: this.groupNameCvList,
          subgroupNameCvList: this.subgroupNameCvList,
          damageCodeCvList: this.damageCodeCvList,
          repairCodeCvList: this.repairCodeCvList,
          unitTypeCvList: this.unitTypeCvList,
          last_test_desc: this.last_test_desc,
          next_test_desc: this.next_test_desc,
          sot_purpose: this.displayTankPurpose(this.sot!)
        }
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result && this.sot) {
        console.log(result)
        const newRepair: any = new RepairItem(row);
        newRepair.bill_to_guid = result.billing_to;
        newRepair.job_no = result.job_no;
        newRepair.owner_enable = result.owner_enable;
        newRepair.labour_cost_discount = result.labour_cost_discount;
        newRepair.material_cost_discount = result.material_cost_discount;
        newRepair.total_cost = result.total_cost;
        newRepair.total_hour = result.total_hour;
        newRepair.total_labour_cost = result.total_labour_cost;
        newRepair.total_material_cost = result.total_material_cost;
        newRepair.overwrite_remarks = result.overwrite_remarks;
        newRepair.repair_part = result.repair_part?.map((x: any) => {
          const { tariff_repair, ...cleaned } = x;
          const rp_damage_repairInput = cleaned.rp_damage_repair?.map((rpdr: any) => {
            const { ...cleanedRpdr } = rpdr;
            return new RPDamageRepairItem(cleanedRpdr);
          });
          const obj = new RepairPartItem(cleaned);
          obj.rp_damage_repair = rp_damage_repairInput;
          obj.action = 'overwrite';
          delete obj.job_order;
          return obj;
        }) ?? [];
        newRepair.action = "overwrite";

        delete newRepair.aspnetsuser;
        delete newRepair.storing_order_tank;

        console.log(newRepair)
        this.repairDS.updateRepair(newRepair, undefined).subscribe(result => {
          console.log(result)
          if (this.sot_guid) {
            this.loadDataHandling_repair(this.sot_guid)
            this.handleSaveSuccess(result?.data?.updateRepair);
          }
        });
      }
    });
  }

  onExport(event: Event, selectedItem: RepairItem) {
    this.preventDefault(event);
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(RepairEstimatePdfComponent, {
      width: '794px',
      height: '80vh',
      data: {
        type: this.sot?.purpose_repair_cv,
        repair_guid: selectedItem?.guid,
        customer_company_guid: this.sot?.storing_order?.customer_company_guid,
        estimate_no: selectedItem?.estimate_no,
        repairEstimatePdf: undefined,
        retrieveFile: true
      },
      // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    });
  }

  previewImagesDialog(event: Event, index: number) {
    event.preventDefault(); // Prevents the form submission

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const headerText = this.translatedLangText.PREVIEW_PHOTOS;
    const dialogRef = this.dialog.open(PreviewImageDialogComponent, {
      data: {
        headerText: headerText,
        previewImages: "",//this.getImages(),
        focusIndex: index
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    });
  }

  uploadImages(guid: string) {
    // const leftImg = this.surveyForm?.get('leftImage')?.value;
    // const rearImg = this.surveyForm?.get('rearImage')?.value;
    // const rightImg = this.surveyForm?.get('rightImage')?.value;
    // const topImg = this.surveyForm?.get('topImage')?.value;
    // const frontImg = this.surveyForm?.get('frontImage')?.value;
    // const bottomImg = this.surveyForm?.get('bottomImage')?.value;

    // const additionalImages = [leftImg, rearImg, rightImg, topImg, frontImg, bottomImg].filter(image => image.file);

    // const additionalMetadata = additionalImages.map(image => {
    //   return {
    //     file: image.file, // The actual file object
    //     metadata: {
    //       TableName: 'in_gate_survey',
    //       FileType: 'img',
    //       GroupGuid: guid,
    //       Description: image.side // Use the side as description
    //     }
    //   };
    // });

    // const dmgImages = this.dmgImages().controls
    //   .filter(preview => preview.get('file')?.value)
    //   .map(preview => {
    //     const file = preview.get('file')?.value;
    //     return {
    //       file: file, // The actual file object
    //       metadata: {
    //         TableName: 'in_gate_survey',
    //         FileType: 'img',
    //         GroupGuid: guid,
    //         Description: 'DMG' // Use the file name or custom description
    //       }
    //     };
    //   });
    // const allImages = dmgImages.concat(additionalMetadata);
    // // Call the FileManagerService to upload files
    // if (allImages.length) {
    //   this.fileManagerService.uploadFiles(allImages).subscribe({
    //     next: (response) => {
    //       console.log('Files uploaded successfully:', response);
    //       this.handleSaveSuccess(response?.affected);
    //     },
    //     error: (error) => {
    //       console.error('Error uploading files:', error);
    //       this.handleSaveError();
    //     },
    //     complete: () => {
    //       console.log('Upload process completed.');
    //       this.router.navigate(['/admin/inventory/in-gate-survey']);
    //     }
    //   });
    // } else {
    //   this.handleSaveSuccess(1);
    //   this.router.navigate(['/admin/inventory/in-gate-survey']);
    // }
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.surveyForm!.get('test_dt')!.value ? moment(this.surveyForm!.get('test_dt')!.value) : moment();
    ctrlValue.year(normalizedYear.year()).date(1);
    this.surveyForm!.get('test_dt')!.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: any) {
    const ctrlValue = this.surveyForm!.get('test_dt')!.value ? moment(this.surveyForm!.get('test_dt')!.value) : moment();
    ctrlValue.month(normalizedMonth.month()).year(normalizedMonth.year()).date(1);
    this.surveyForm!.get('test_dt')!.setValue(ctrlValue);
    this.getNextTest();
    datepicker.close();
  }

  selectMarkDmg() {
    this.isMarkDmg = !this.isMarkDmg;
  }

  getLastTest(): string | undefined {
    return this.getLastTestTI() || this.getLastTestIGS();
  }

  getNextTest(): string | undefined {
    return this.getNextTestTI() || this.getNextTestIGS();
  }

  getLastTestIGS(): string | undefined {
    if (!this.testTypeCvList?.length || !this.testClassCvList?.length || !this.igs) return "";

    const igs = this.igs
    if (igs && igs.last_test_cv && igs.test_class_cv && igs.test_dt) {
      const test_type = igs.last_test_cv;
      const test_class = igs.test_class_cv;
      return this.getTestTypeDescription(test_type) + " - " + Utility.convertEpochToDateStr(igs.test_dt as number, 'MM/YYYY') + " - " + test_class;
    }
    return "";
  }

  getLastTestTI(): string | undefined {
    if (!this.testTypeCvList?.length || !this.testClassCvList?.length || !this.tiItem) return "";

    if (this.tiItem.last_test_cv && this.tiItem.test_class_cv && this.tiItem.test_dt) {
      const test_type = this.tiItem.last_test_cv;
      const test_class = this.tiItem.test_class_cv;
      return this.getTestTypeDescription(test_type) + " - " + Utility.convertEpochToDateStr(this.tiItem.test_dt as number, 'MM/YYYY') + " - " + test_class;
    }
    return "";
  }

  getNextTestIGS(): string | undefined {
    if (!this.testTypeCvList?.length || !this.igs) return "";

    const igs = this.igs
    if (!igs?.test_dt || !igs?.last_test_cv) return "-";
    const test_type = igs?.last_test_cv;
    const match = test_type?.match(/^[0-9]*\.?[0-9]+/);
    const yearCount = BusinessLogicUtil.getNextTestYear(test_type);
    const resultDt = Utility.addYearsToEpoch(igs?.test_dt as number, yearCount) as number;
    const output = this.getTestTypeDescription(igs?.next_test_cv) + " - " + Utility.convertEpochToDateStr(resultDt, 'MM/YYYY');
    return output;
  }

  getNextTestTI(): string | undefined {
    if (!this.testTypeCvList?.length || !this.tiItem) return "";

    if (!this.tiItem?.test_dt || !this.tiItem?.last_test_cv) return "-";
    const test_type = this.tiItem?.last_test_cv;
    const match = test_type?.match(/^[0-9]*\.?[0-9]+/);
    const yearCount = BusinessLogicUtil.getNextTestYear(test_type);
    const resultDt = Utility.addYearsToEpoch(this.tiItem?.test_dt as number, yearCount) as number;
    const output = this.getTestTypeDescription(this.tiItem?.next_test_cv) + " - " + Utility.convertEpochToDateStr(resultDt, 'MM/YYYY');
    return output;
  }

  getTestTypeDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.testTypeCvList);
  }

  getTestClassDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.testClassCvList);
  }

  getTankSideDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.tankSideCvList);
  }

  getStorageCalDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.storageCalCvList);
  }

  getProcessStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.processStatusCvList);
  }

  getTankStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.tankStatusCvList);
  }

  getYardDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.yardCvList);
  }

  getWalkwayDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.walkwayCvList);
  }

  getBookingStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.bookingStatusCvList);
  }

  getBookingTypeDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.bookingTypeCvList);
  }

  getCladdingDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.claddingCvList);
  }

  getDisCompDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.disCompCvList);
  }

  getAvailableDate(sot: StoringOrderTankItem) {
    const maxCompleteDt: number[] | undefined = sot.repair
      ?.map(item => item.complete_dt)
      .filter((dt): dt is number => dt !== undefined && dt !== null);

    const max = maxCompleteDt && maxCompleteDt.length > 0
      ? Math.max(...maxCompleteDt)
      : undefined;

    return this.displayDate(max);
  }

  displayColumnChanged() {
    if (true) {
      this.displayedColumnsRepair = [
        'estimate_no',
        'estimate_date',
        'approve_dt',
        'allocation_dt',
        'qc_dt',
        'status_cv',
        'actions'
      ];
    } else {
      this.displayedColumnsRepair = [
        'tank_no',
        'customer',
        'estimate_no',
        'status_cv',
        'actions'
      ];
    }
  }

  verifySection(expectedSection: string) {
    return this.section.includes(expectedSection);
  }

  setSection(section: string) {
    const index = this.section.indexOf(section);
    if (index > -1) {
      this.section.splice(index, 1);
    } else {
      this.section.push(section);
    }
    console.log(this.section)
  }

  expandAll(event: MouseEvent, currentSection: string): void {
    event.stopPropagation();

    if (!this.isAllExpand()) {
      const allSections = Object.values(this.accordionSections);
      allSections.forEach(x => {
        if (!this.verifySection(x)) {
          this.section.push(x);
        }
      })
    } else {
      this.section = [];
    }
  }

  isAllExpand() {
    return this.section.length === this.referenceFullSections.length
  }

  private subscribeToPurposeChangeEvent(
    subscribeFn: (guid: string) => Observable<any>,
    sot_guid: string
  ) {
    const subscription = subscribeFn(sot_guid).subscribe({
      next: (response) => {
        console.log('Received data:', response);
        const data = response.data
        if (this.sot && this.sot_guid) {
          this.sot.tank_status_cv = data?.onPurposeChanged?.tank_status;
          const purpose: any = data?.onPurposeChanged?.purpose;

          if (purpose === 'STEAMING') {
            // this.sot.purpose_steam = true;
            // this.subs.sink = this.steamDS.getSteamForMovement(this.sot_guid).subscribe(data => {
            //   if (this.steamDS.totalCount > 0) {
            //     console.log(`steam: `, data)
            //     this.steamItem = data;
            //   }
            // });
            this.subs.sink = this.sotRepairDS.getStoringOrderTankForMovementSteaming(this.sot_guid).subscribe(data => {
              if (data.length > 0 && this.sot) {
                console.log(`sot steam: `, data);
                this.sot.purpose_steam = data[0].purpose_steam;
                this.steamItem = data[0].steaming || [];
              }
            });
          } else if (purpose === 'CLEANING') {
            // this.sot.purpose_cleaning = true;
            // this.subs.sink = this.residueDS.getResidueForMovement(this.sot_guid).subscribe(data => {
            //   if (this.residueDS.totalCount > 0) {
            //     console.log(`residue: `, data)
            //     this.residueItem = data;
            //   }
            // });
            // this.subs.sink = this.cleaningDS.getCleaningForMovement(this.sot_guid).subscribe(data => {
            //   if (this.cleaningDS.totalCount > 0) {
            //     console.log(`cleaning: `, data)
            //     this.cleaningItem = data;
            //   }
            // });
            this.subs.sink = this.sotRepairDS.getStoringOrderTankForMovementCleaning(this.sot_guid).subscribe(data => {
              if (data.length > 0 && this.sot) {
                console.log(`sot cleaning: `, data);
                this.sot.purpose_cleaning = data[0].purpose_cleaning;
                this.residueItem = data[0].residue || [];
                this.cleaningItem = data[0].cleaning || [];
              }
            });
          } else if (purpose === 'REPAIR') {
            // this.sot.purpose_repair_cv = purpose;
            // this.subs.sink = this.repairDS.getRepairForMovement(this.sot_guid).subscribe(data => {
            //   if (this.repairDS.totalCount > 0) {
            //     console.log(`repair: `, data);
            //     this.repairItem = data;
            //     this.displayColumnChanged();
            //   }
            // });
            this.subs.sink = this.sotRepairDS.getStoringOrderTankForMovementRepair(this.sot_guid).subscribe(data => {
              if (data.length > 0 && this.sot) {
                console.log(`sot repair: `, data);
                this.sot.purpose_repair_cv = data[0].purpose_repair_cv;
                this.repairItem = data[0].repair || [];
              }
            });
          } else if (purpose === 'STORAGE') {
            this.subs.sink = this.sotRepairDS.getStoringOrderTankForMovementStorage(this.sot_guid).subscribe(data => {
              if (data.length > 0 && this.sot) {
                console.log(`sot storage: `, data);
                this.sot.purpose_storage = data[0].purpose_storage;
              }
            });
          }
        }
      },
      error: (error) => {
        console.error('Error:', error);
      },
      complete: () => {
        console.log('Subscription completed');
      }
    });

    this.sotPurposeChangeSubscriptions.push(subscription);
  }

  isNoPurpose(sot: StoringOrderTankItem, selectedPurpose: string): boolean {
    const purposes = {
      storage: sot.purpose_storage,
      cleaning: sot.purpose_cleaning,
      steaming: sot.purpose_steam,
      repair: sot.purpose_repair_cv
    };

    // Filter out the selected purpose and check the others
    for (const [key, value] of Object.entries(purposes)) {
      if (key === selectedPurpose) {
        if (selectedPurpose !== 'repair') {
          return !value;
        } else {
          return value === '' || value === undefined || value === null;
        }
      }
    }

    // If all other purposes are invalid or absent
    return true;
  }

  canRemovePurpose(purpose: string) {
    if (this.sot) {
      if (this.allowAddPurposeTankStatuses.includes(this.sot.tank_status_cv || '')) {
        if (purpose === 'steaming') {
          return !this.steamItem.some(item => !this.allowRemovePurposeStatuses.includes(item.status_cv || ''));
        } else if (purpose === 'cleaning') {
          return !this.cleaningItem?.some(item => !this.allowRemovePurposeStatuses.includes(item.status_cv || '')) && !this.residueItem?.some(item => !this.allowRemovePurposeStatuses.includes(item.status_cv || ''));
        } else if (purpose === 'repair') {
          return !this.repairItem.length || !this.repairItem.some(item => !this.allowRemovePurposeStatuses.includes(item.status_cv || ''));
        }
      }
      return false;
    }
    return true;
  }

  canAddPurpose(purpose: string) {
    if (this.sot) {
      if (this.allowAddPurposeTankStatuses.includes(this.sot.tank_status_cv || '')) {
        if (purpose === 'steaming') {
          return this.isNoPurpose(this.sot, 'steaming') && this.isNoPurpose(this.sot, 'cleaning') && this.isNoPurpose(this.sot, 'repair');
        } else if (purpose === 'cleaning') {
          return this.isNoPurpose(this.sot, 'cleaning') && this.isNoPurpose(this.sot, 'steaming') && !this.anyActiveRepair(true);
        } else if (purpose === 'repair') {
          return this.isNoPurpose(this.sot, 'repair') && this.isNoPurpose(this.sot, 'steaming');
        } else if (purpose === 'storage') {
          return this.isNoPurpose(this.sot, 'storage');
        }
      }
      return false;
    }
    return false;
  }

  canOverwriteJobNo() {
    return true;
  }

  canOverwriteDepotCost() {
    return true;
  }

  canOverwriteTankDetail() {

  }

  allowPerformAction() {
    if (this.modulePackageService.isCustomizedPackage() || this.modulePackageService.isGrowthPackage())
      return true;
    else
      return false;
  }

  tabConfig = [
    {
      label: this.translatedLangText.BOOKING,
      component: 'booking',
      modulePackage: ['growth', 'customized']
    },
    {
      label: this.translatedLangText.SCHEDULING,
      component: 'scheduling',
      modulePackage: ['starter', 'growth', 'customized']
    }
  ];

  get allowedTabs() {
    return this.tabConfig.filter(tab =>
      tab.modulePackage.includes(this.modulePackageService.getModulePackage())
    );
  }

  canRenumberTank() {
    // check is the eir_no same as the tank_info.last_eir_no. only when its same can do renumber
    return this.ig?.eir_no === this.tiItem?.last_eir_no
  }

  canReownership() {
    // check is the eir_no same as the tank_info.last_eir_no. only when its same can do reownership
    return this.ig?.eir_no === this.tiItem?.last_eir_no;
  }

  canChangeCustomer() {
    return false;
    // check whether any billing done
    const billing_sot = this.sot?.billing_sot;
    if (billing_sot?.lon_billing_guid || billing_sot?.loff_billing_guid || billing_sot?.preinsp_billing_guid || billing_sot?.gin_billing_guid || billing_sot?.gout_billing_guid) {
      return false;
    }

    const steamList = this.steamItem?.filter(x => {
      !!x.customer_billing_guid || !!x.owner_billing_guid
    }) ?? [];

    const repairList = this.repairItem?.filter(x => {
      !!x.customer_billing_guid || !!x.owner_billing_guid
    }) ?? [];

    const cleanList = this.cleaningItem?.filter(x => {
      !!x.customer_billing_guid || !!x.owner_billing_guid
    }) ?? [];

    const residueList = this.residueItem.filter(x => {
      !!x.customer_billing_guid || !!x.owner_billing_guid
    }) ?? [];

    if (steamList.length || repairList.length || cleanList.length || residueList.length) {
      return false
    }

    return true;
  }

  canOverwriteTankSummaryDetails() {
    // if (this.sot?.status_cv) {
    //   if (!this.cleaningItem?.[0]?.customer_billing_guid) {
    //     return true;
    //   }
    // }
    return true;
  }

  canOverwriteTankDetails() {
    // if (this.sot?.status_cv) {
    //   if (!this.cleaningItem?.[0]?.customer_billing_guid) {
    //     return true;
    //   }
    // }
    return true;
  }

  canOverwriteInGateDetails() {
    return !!this.ig?.guid;
  }

  canOverwriteOutGateDetails() {
    return !!this.og?.guid;
  }

  canOverwriteStoragePurpose() {
    // return !!this.sot?.billing_sot?.guid;
    return true;
  }

  canOverwriteLastCargo() {
    if (this.sot?.purpose_cleaning) {
      if (!this.cleaningItem?.[0]?.customer_billing_guid) {
        return true;
      }
    }

    if (this.sot?.purpose_steam) {
      const found = this.steamItem?.some(item => item.create_by === 'system' && item.status_cv === 'COMPLETED');
      if (!found) {
        return true;
      }
    }
    return false;
  }

  canOverwriteCleanStatus() {
    return true;
  }

  canRemoveCleanPurpose() {
    return !this.isNoPurpose(this.sot!, 'cleaning') && this.canRemovePurpose('cleaning');
  }

  canRemoveRepairPurpose() {
    return !this.isNoPurpose(this.sot!, 'repair') && this.canRemovePurpose('repair');
  }

  canOverwriteSteamingApproval(row: SteamItem) {
    return false;
    const allowOverwriteStatus = ['APPROVED', 'JOB_IN_PROGRESS', 'COMPLETED'];
    return allowOverwriteStatus.includes(row.status_cv || '') && !row?.customer_billing_guid;
  }

  canRollbackSteamingCompleted(row: SteamItem) {
    return (this.sot?.tank_status_cv === 'STEAMING' || this.sot?.tank_status_cv === 'STORAGE') && row.status_cv === 'COMPLETED';
  }

  canOverwriteCleaningApproval() {
    const allowOverwriteStatus = ['APPROVED', 'JOB_IN_PROGRESS', 'COMPLETED'];
    return allowOverwriteStatus.includes(this.cleaningItem?.[0]?.status_cv || '') && !this.cleaningItem?.[0]?.customer_billing_guid;
  }

  canOverwriteResidueApproval(row: SteamItem) {
    const allowOverwriteStatus = ['APPROVED', 'ASSIGNED', 'JOB_IN_PROGRESS', 'COMPLETED'];
    return allowOverwriteStatus.includes(row.status_cv || '') && !row?.customer_billing_guid;
  }

  canOverwriteRepairApproval(row: SteamItem) {
    const allowOverwriteStatus = ['APPROVED', 'ASSIGNED', 'PARTIAL_ASSIGNED', 'JOB_IN_PROGRESS', 'COMPLETED', 'QC_COMPLETED'];
    return allowOverwriteStatus.includes(row.status_cv || '') && !row?.customer_billing_guid;
  }

  onRollbackSteamingJobs(event: Event, row: SteamItem) {
    this.preventDefault(event);

    const distinctJobOrders = row.steaming_part?.filter((item, index, self) =>
      index === self.findIndex(t => t.job_order?.guid === item.job_order?.guid &&
        (t.job_order?.team?.guid === item?.job_order?.team_guid ||
          t.job_order?.team?.description === item?.job_order?.team?.description))
    )
      .filter(item => item.job_order !== null && item.job_order !== undefined)
      .map(item => new JobOrderGO(item.job_order!));

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationRemarksFormDialogComponent, {
      disableClose: true,
      width: '500px',
      data: {
        action: 'rollback',
        dialogTitle: this.translatedLangText.ARE_YOU_SURE_ROLLBACK,
        messageText: "",//`${this.translatedLangText.ESTIMATE_NO}: ${row.estimate_no}`,
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const steamingJobOrder = {
          guid: row?.guid,
          remarks: result.remarks,
          sot_guid: row.sot_guid,
          sot_status: this.sot?.tank_status_cv,
          job_order: distinctJobOrders
        }
        console.log(steamingJobOrder);
        this.steamDS.rollbackCompletedSteaming([steamingJobOrder]).subscribe(result => {
          this.handleRollbackSuccess(result?.data?.rollbackCompletedResidue);
          this.loadDataHandling_sot(this.sot_guid!);
          this.loadDataHandling_steam(this.sot_guid!);
        });
      }
    });
  }

  canRollbackResidueCompleted(row: ResidueItem) {
    return this.sot?.tank_status_cv === "CLEANING" && row.status_cv === 'COMPLETED' && (this.cleaningItem?.[0]?.status_cv === 'APPROVED' || this.cleaningItem?.[0]?.status_cv === 'JOB_IN_PROGRESS');
  }

  onRollbackResidueJobs(event: Event, row: ResidueItem) {
    this.preventDefault(event);

    const distinctJobOrders = row.residue_part?.filter((item, index, self) =>
      index === self.findIndex(t => t.job_order?.guid === item.job_order?.guid &&
        (t.job_order?.team?.guid === item?.job_order?.team_guid ||
          t.job_order?.team?.description === item?.job_order?.team?.description))
    )
      .filter(item => item.job_order !== null && item.job_order !== undefined)
      .map(item => new JobOrderGO(item.job_order!));

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationRemarksFormDialogComponent, {
      disableClose: true,
      width: '500px',
      data: {
        action: 'rollback',
        dialogTitle: this.translatedLangText.ARE_YOU_SURE_ROLLBACK,
        messageText: "",//`${this.translatedLangText.ESTIMATE_NO}: ${row.estimate_no}`,
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const residueJobOrder = {
          estimate_no: row?.estimate_no,
          guid: row?.guid,
          remarks: result.remarks,
          sot_guid: row.sot_guid,
          sot_status: this.sot?.tank_status_cv,
          job_order: distinctJobOrders
        }
        console.log(residueJobOrder);
        this.residueDS.rollbackCompletedResidue([residueJobOrder]).subscribe(result => {
          this.handleRollbackSuccess(result?.data?.rollbackCompletedResidue);
          this.loadDataHandling_sot(this.sot_guid!);
          this.loadDataHandling_residue(this.sot_guid!);
        });
      }
    });
  }

  canRollbackCleaningCompleted(row?: InGateCleaningItem) {
    return (this.sot?.tank_status_cv === "CLEANING" || this.sot?.tank_status_cv === "STORAGE" || (this.sot?.tank_status_cv === "REPAIR" && !this.repairItem?.length)) && row?.status_cv === 'COMPLETED';
  }

  onRollbackCleaningJobs(event: Event, row?: InGateCleaningItem) {
    this.preventDefault(event);

    const distinctJobOrders = new JobOrderGO(row?.job_order);

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationRemarksFormDialogComponent, {
      disableClose: true,
      width: '500px',
      data: {
        action: 'rollback',
        dialogTitle: this.translatedLangText.ARE_YOU_SURE_ROLLBACK,
        messageText: "",//this.translatedLangText.CLEANING,
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const jobOrder = {
          guid: row?.guid,
          remarks: result.remarks,
          sot_guid: row?.sot_guid,
          sot_status: this.sot?.tank_status_cv,
          job_order: distinctJobOrders
        }
        console.log(jobOrder);
        this.cleaningDS.rollbackCompletedCleaning(jobOrder).subscribe(result => {
          this.handleRollbackSuccess(result?.data?.rollbackCompletedResidue);
          this.loadDataHandling_sot(this.sot_guid!);
          this.loadDataHandling_cleaning(this.sot_guid!);
        });
      }
    });
  }

  canRollbackCleaning(row?: InGateCleaningItem) {
    return (this.sot?.tank_status_cv === "CLEANING" || this.sot?.tank_status_cv === "STORAGE" || (this.sot?.tank_status_cv === "REPAIR" && !this.anyActiveRepair())) && row?.status_cv === 'NO_ACTION';
  }

  onRollbackCleaning(event: Event, row?: InGateCleaningItem) {
    this.preventDefault(event);

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationRemarksFormDialogComponent, {
      disableClose: true,
      width: '500px',
      data: {
        action: 'rollback',
        dialogTitle: this.translatedLangText.ARE_YOU_SURE_ROLLBACK,
        messageText: "",//this.translatedLangText.CLEANING,
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const distinctJobOrders = row?.job_order ? [new JobOrderGO(row?.job_order)] : null;
        if (distinctJobOrders && distinctJobOrders?.[0]?.status_cv === 'JOB_IN_PROGRESS') {
          const jobOrder = {
            guid: row?.guid,
            remarks: result.remarks,
            sot_guid: row?.sot_guid,
            sot_status: this.sot?.tank_status_cv,
            job_order: distinctJobOrders
          }
          console.log(jobOrder);
          this.joDS?.rollbackJobInProgressCleaning(jobOrder).subscribe(result => {
            this.handleSaveSuccess(result?.data?.rollbackJobInProgressCleaning);
            this.loadDataHandling_sot(this.sot_guid!);
            this.loadDataHandling_cleaning(this.sot_guid!);
          });
        } else {
          var rep: InGateCleaningItem = new InGateCleaningItem(row);
          rep.action = "APPROVE";
          rep.approve_dt = row?.approve_dt;
          rep.job_no = row?.job_no;
          delete rep.job_order;
          this.cleaningDS.updateInGateCleaning(rep).subscribe(result => {
            if (result.data.updateCleaning > 0) {
              console.log('valid');
              this.handleSaveSuccess(result.data.updateCleaning);
              this.loadDataHandling_sot(this.sot_guid!);
              this.loadDataHandling_cleaning(this.sot_guid!);
            }
          });
        }
      }
    });
  }

  canRollbackRepairQC(row: RepairItem) {
    return (this.sot?.tank_status_cv === "REPAIR" || this.sot?.tank_status_cv === "STORAGE") && this.repairDS.canRollbackQC(row);
  }

  onRollbackRepairQC(event: Event, row: RepairItem) {
    this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(ConfirmationRemarksFormDialogComponent, {
      disableClose: true,
      width: '500px',
      data: {
        action: 'rollback',
        dialogTitle: this.translatedLangText.ARE_YOU_SURE_ROLLBACK,
        messageText: "", //`${this.translatedLangText.ESTIMATE_NO}: ${row.estimate_no}`,
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const distinctJobOrders = row?.repair_part?.filter((item, index, self) =>
          index === self.findIndex(t => t.job_order?.guid === item.job_order?.guid &&
            (t.job_order?.team?.guid === item?.job_order?.team_guid ||
              t.job_order?.team?.description === item?.job_order?.team?.description))
        )
          .filter(item => item.job_order !== null && item.job_order !== undefined)
          .map(item => new JobOrderGO(item.job_order!));

        const repJobOrder = new RepJobOrderRequest({
          guid: row?.guid,
          sot_guid: row?.sot_guid,
          estimate_no: row?.estimate_no,
          remarks: result.remarks,
          job_order: distinctJobOrders,
          sot_status: this.sot?.tank_status_cv
        });

        console.log(repJobOrder)
        this.repairDS.rollbackQCRepair([repJobOrder]).subscribe(result => {
          console.log(result)
          if ((result?.data?.rollbackQCRepair ?? 0) > 0) {
            this.handleRollbackSuccess(result?.data?.rollbackQCRepair);
            this.loadDataHandling_sot(this.sot_guid!);
            this.loadDataHandling_repair(this.sot_guid!);
          }
        });
      }
    });
  }

  onOverwriteQC(event: Event, row: RepairItem) {
    this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(ConfirmationRemarksFormDialogComponent, {
      disableClose: true,
      width: '500px',
      data: {
        action: 'overwrite',
        messageText: row.estimate_no,
        translatedLangText: this.translatedLangText,
        last_qc_dt: row.repair_part?.filter(x => x.approve_part)?.[0]?.job_order?.qc_dt,
        last_remarks: row?.remarks,
        complete_dt: row?.complete_dt,
      },
      direction: tempDirection
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const outputQcDt = Utility.convertDate(result.qc_dt) as number;
        const outputDate = result.qc_dt;
        const estDate = Utility.convertDateMoment(row!.complete_dt!) as moment.Moment;

        const isSameDate = outputDate.isSame(estDate, 'day');

        const distinctJobOrders = row.repair_part?.filter((item, index, self) =>
          index === self.findIndex(t => t.job_order?.guid === item.job_order?.guid &&
            (t.job_order?.team?.guid === item?.job_order?.team_guid ||
              t.job_order?.team?.description === item?.job_order?.team?.description))
        )
          .filter(item => item.job_order !== null && item.job_order !== undefined)
          .map(item => new JobOrderGO({ ...item.job_order!, qc_dt: isSameDate ? row!.complete_dt : outputQcDt }));

        const repJobOrder = new RepJobOrderRequest({
          guid: row?.guid,
          sot_guid: row?.sot_guid,
          estimate_no: row?.estimate_no,
          remarks: result.remarks,
          job_order: distinctJobOrders,
          sot_status: this.sot?.tank_status_cv
        });

        console.log(repJobOrder)
        this.repairDS.overwriteQCRepair([repJobOrder]).subscribe(result => {
          console.log(result)
          if ((result?.data?.overwriteQCRepair ?? 0) > 0) {
            this.handleSaveSuccess(result?.data?.overwriteQCRepair);
            this.loadDataHandling_repair(this.sot_guid!);
          }
        });
      }
    });
  }

  isAutoApproveSteaming(row: any) {
    return BusinessLogicUtil.isAutoApproveSteaming(row);
  }

  stopEventTrigger(event: Event) {
    this.preventDefault(event);
    this.stopPropagation(event);
  }

  stopPropagation(event: Event) {
    event.stopPropagation(); // Stops event propagation
  }

  preventDefault(event: Event) {
    event.preventDefault(); // Prevents the form submission
  }

  loadDataHandling_sot(sot_guid: string) {
    this.subs.sink = this.sotDS.getStoringOrderTankForMovementByID(sot_guid).subscribe(data => {
      if (data.length > 0) {
        console.log(`sot: `, data)
        this.sot = data[0];
        this.loadSotDepotCost();
        this.getCustomerBufferPackage(this.sot?.storing_order?.customer_company?.guid!, this.sot?.in_gate?.[0]?.in_gate_survey?.tank_comp_guid);
        this.getCustomerLabourPackage(this.sot?.storing_order?.customer_company?.guid!);
        this.pdDS.getCustomerPackage(this.sot?.storing_order?.customer_company?.guid!, this.sot?.tank?.tariff_depot_guid!).subscribe(data => {
          console.log(`packageDepot: `, data)
          this.pdItem = data[0];
        });
        // this.subscribeToPurposeChangeEvent(this.sotDS.subscribeToSotPurposeChange.bind(this.sotDS), this.sot_guid!);
        this.loadDataHandling_ti(this.sot?.tank_no!);
        this.loadDataHandling_LastPeriodicTestDetail(this.sot?.tank_no!);
        this.loadDataHandling_branch();
        // if (this.sot?.in_gate?.length) {
        //   this.getCustomerBufferPackage(this.sot?.storing_order?.customer_company?.guid!, this.sot?.in_gate?.[0]?.in_gate_survey?.tank_comp_guid);
        // }
      }
    });
  }

  loadDataHandling_ti(tank_no: string) {
    this.tiDS.getTankInfoForMovement(tank_no).subscribe(data => {
      console.log(`tankInfo: `, data)
      this.tiItem = data[0];
      this.last_test_desc = this.getLastTest();
      this.next_test_desc = this.getNextTest();
    });
  }

  loadDataHandling_igs(sot_guid: string) {
    this.subs.sink = this.igsDS.getInGateSurveyByIDForMovement(sot_guid).subscribe(data => {
      if (data.length > 0) {
        console.log(`igs: `, data)
        this.igs = data[0];
      }
    });
  }

  loadDataHandling_ig(sot_guid: string) {
    this.subs.sink = this.igDS.getInGateByIDForMovement(sot_guid).subscribe(data => {
      if (data.length > 0) {
        console.log(`ig: `, data)
        this.ig = data[0];
      }
    });
  }

  loadDataHandling_ogs(sot_guid: string) {
    this.subs.sink = this.ogsDS.getOutGateSurveyByIDForMovement(sot_guid).subscribe(data => {
      if (data.length > 0) {
        console.log(`ogs: `, data)
        this.ogs = data[0];
      }
    });
  }

  loadDataHandling_og(sot_guid: string) {
    this.subs.sink = this.ogDS.getOutGateByIDForMovement(sot_guid).subscribe(data => {
      if (data.length > 0) {
        console.log(`og: `, data)
        this.og = data[0];
      }
    });
  }

  loadDataHandling_steam(sot_guid: string) {
    this.subs.sink = this.steamDS.getSteamForMovement(sot_guid).subscribe(data => {
      if (data.length > 0) {
        console.log(`steam: `, data)
        this.steamItem = data;
      }
    });
  }

  loadDataHandling_residue(sot_guid: string) {
    this.subs.sink = this.residueDS.getResidueForMovement(sot_guid).subscribe(data => {
      if (data.length > 0) {
        console.log(`residue: `, data)
        this.residueItem = data;
      }
    });
  }

  loadDataHandling_cleaning(sot_guid: string) {
    this.subs.sink = this.cleaningDS.getCleaningForMovement(sot_guid).subscribe(data => {
      if (data.length > 0) {
        console.log(`cleaning: `, data)
        this.cleaningItem = data;
      }
    });
  }

  loadDataHandling_repair(sot_guid: string) {
    this.subs.sink = this.repairDS.getRepairForMovement(sot_guid).subscribe(data => {
      if (data.length > 0) {
        console.log(`repair: `, data);
        this.repairItem = data;
        this.displayColumnChanged();
      }
    });
  }

  loadDataHandling_booking(sot_guid: string) {
    this.subs.sink = this.bkDS.getBookingForMovement(sot_guid).subscribe(data => {
      if (data.length > 0) {
        console.log(`booking: `, data);
        this.bookingList = data;
      }
    });
  }

  loadDataHandling_scheduling(sot_guid: string) {
    this.subs.sink = this.schedulingDS.getSchedulingForMovement(sot_guid).subscribe(data => {
      if (data.length > 0) {
        console.log(`scheduling: `, data);
        this.schedulingList = data;
      }
    });
  }

  loadDataHandling_surveyDetail(sot_guid: string) {
    this.subs.sink = this.surveyDS.searchSurveyDetailForMovement(sot_guid).subscribe(data => {
      if (data.length > 0) {
        console.log(`survey: `, data);
        this.surveyList = data;
      }
    });
  }

  loadDataHandling_LastPeriodicTestDetail(tank_no: string) {
    this.surveyDS.getSurveyDetailByTankNo(tank_no).subscribe(data => {
      if (data.length > 0) {
        console.log(`last survey: `, data)
        this.latestSurveyDetailItem = data;
      }
    });
  }

  loadDataHandling_transfer(sot_guid: string) {
    this.subs.sink = this.transferDS.getTransferBySotIDForMovement(sot_guid).subscribe(data => {
      if (data.length > 0) {
        console.log(`transfer: `, data);
        this.transferList = data;
      }
    });
  }

  loadDataHandling_tariffDepot() {
    this.subs.sink = this.tdDS.SearchTariffDepot({}, null, 100).subscribe(data => {
      if (data.length > 0) {
        console.log(`tariffDepot: `, data)
        this.tariffDepotList = data;
      }
    });
  }

  loadDataHandling_branch() {
    this.ccDS.getCustomerAndBranch(this.sot?.storing_order?.customer_company?.guid!).subscribe(cc => {
      this.billingBranchList = cc;
    });
  }

  loadSotDepotCost() {
    if (this.sot) {
      this.sotDepotCostDetails = [
        {
          "description": this.translatedLangText.PRE_INSPECTION,
          "job_no": this.sot?.preinspect_job_no,
          "billing_guid": this.sot?.billing_sot?.preinsp_billing_guid,
          "invoice_no": this.sot?.billing_sot?.preinsp_billing?.invoice_no,
          "cost": this.sot?.billing_sot?.preinspection_cost
        },
        {
          "description": this.translatedLangText.LIFT_OFF,
          "job_no": this.sot?.liftoff_job_no,
          "billing_guid": this.sot?.billing_sot?.loff_billing_guid,
          "invoice_no": this.sot?.billing_sot?.loff_billing?.invoice_no,
          "cost": this.sot?.billing_sot?.lift_off_cost
        },
        {
          "description": this.translatedLangText.LIFT_ON,
          "job_no": this.sot?.lifton_job_no,
          "billing_guid": this.sot?.billing_sot?.lon_billing_guid,
          "invoice_no": this.sot?.billing_sot?.lon_billing?.invoice_no,
          "cost": this.sot?.billing_sot?.lift_on_cost
        },
        {
          "description": this.translatedLangText.GATE_IN,
          "job_no": this.sot?.job_no,
          "billing_guid": this.sot?.billing_sot?.gin_billing_guid,
          "invoice_no": this.sot?.billing_sot?.gin_billing?.invoice_no,
          "cost": this.sot?.billing_sot?.gate_in_cost
        },
        {
          "description": this.translatedLangText.GATE_OUT,
          "job_no": this.sot?.release_job_no,
          "billing_guid": this.sot?.billing_sot?.gout_billing_guid,
          "invoice_no": this.sot?.billing_sot?.gout_billing?.invoice_no,
          "cost": this.sot?.billing_sot?.gate_out_cost
        },
      ]
    }
  }

  onDownloadEir(isInGate: boolean = true) {
    let tempDirection: Direction;

    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(EirFormComponent, {
      position: { top: '-9999px', left: '-9999px' },
      width: '794px',
      height: '80vh',
      data: {
        type: isInGate ? "in" : "out",
        gate_survey_guid: isInGate ? this.igs?.guid : this.ogs?.guid,
        eir_no: this.ig?.eir_no,
        igsDS: this.igsDS,
        cvDS: this.cvDS
      },
      direction: tempDirection
    });
    this.fileManagerService.actionLoadingSubject.next(true);
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      this.fileManagerService.actionLoadingSubject.next(false);
    });
  }

  anyActiveRepair(includePending: boolean = false): boolean {
    if (this.repairItem?.length) {
      const found = this.repairItem?.filter(x => x.status_cv !== 'CANCELED' && x.status_cv !== 'NO_ACTION' && (!includePending || x.status_cv !== 'PENDING'));
      // Check if any repair item has a status that is not 'CANCELED', 'NO_ACTION', or 'PENDING' (if includePending is true)
      if (found.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  loadFullPage() {
    if (this.sot_guid) {
      // EDIT
      this.loadDataHandling_sot(this.sot_guid);
      this.loadDataHandling_igs(this.sot_guid);
      this.loadDataHandling_ig(this.sot_guid);
      this.loadDataHandling_ogs(this.sot_guid);
      this.loadDataHandling_og(this.sot_guid);
      this.loadDataHandling_steam(this.sot_guid);
      this.loadDataHandling_residue(this.sot_guid);
      this.loadDataHandling_cleaning(this.sot_guid);
      this.loadDataHandling_repair(this.sot_guid);
      this.loadDataHandling_booking(this.sot_guid);
      this.loadDataHandling_scheduling(this.sot_guid);
      this.loadDataHandling_surveyDetail(this.sot_guid);
      this.loadDataHandling_transfer(this.sot_guid);
      this.loadDataHandling_tariffDepot();
    }
  }

  getLastLocation() {
    return BusinessLogicUtil.getLastLocation(this.sot, this.ig, this?.tiItem, this.transferList)
  }

  isAllowTankMovementView() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_VIEW']);
  }

  isAllowTankMovementEdit() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_EDIT']);
  }

  isAllowTankNo() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_TANK_NO']);
  }

  isAllowTankMovementCustomer() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_CUSTOMER']);
  }

  isAllowLastCargo() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_LAST_CARGO']);
  }

  isAllowTankOwner() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_OWNER']);
  }

  isAllowCleanStatus() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_CLEAN_STATUS']);
  }

  isAllowEirDate() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_EIR_DATE']);
  }

  isAllowLastTest() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_LAST_TEST']);
  }

  isAllowYard() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_YARD']);
  }

  isAllowUnitType() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_UNIT_TYPE']);
  }

  isAllowCladding() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_CLADDING']);
  }

  isAllowTareWeight() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_TARE_WEIGHT']);
  }

  isAllowDischargeType() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_DISCHARGE_TYPE']);
  }

  isAllowNotes() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_NOTES']);
  }

  isAllowReleaseNotes() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_RELEASE_NOTES']);
  }

  isAllowManufacturer() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_MANUFACTURER']);
  }

  isAllowCapacity() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_CAPACITY']);
  }

  isAllowGrossWeight() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_GROSS_WEIGHT']);
  }

  isAllowCompartmentType() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_COMPARTMENT_TYPE']);
  }

  isAllowWalkway() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_WALKWAY']);
  }

  isAllowGateOverwrite() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_GATE_OVERWRITE']);
  }

  isAllowStorageOverwrite() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_STORAGE_OVERWRITE']);
  }

  isAllowSteamAdd() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_STEAM_ADD']);
  }

  isAllowSteamRemove() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_STEAM_REMOVE']);
  }

  isAllowSteamReinstate() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_STEAM_REINSTATE']);
  }

  isAllowSteamOverwrite() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_STEAM_OVERWRITE']);
  }

  isAllowResidueAdd() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_RESIDUE_ADD']);
  }

  isAllowResidueRemove() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_RESIDUE_REMOVE']);
  }

  isAllowResidueReinstate() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_RESIDUE_REINSTATE']);
  }

  isAllowResidueOverwrite() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_RESIDUE_OVERWRITE']);
  }

  isAllowCleaningAdd() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_CLEANING_ADD']);
  }

  isAllowCleaningRemove() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_CLEANING_REMOVE']);
  }

  isAllowCleaningReinstate() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_CLEANING_REINSTATE']);
  }

  isAllowCleaningOverwrite() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_CLEANING_OVERWRITE']);
  }

  isAllowRepairAdd() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_REPAIR_ADD']);
  }

  isAllowRepairRemove() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_REPAIR_REMOVE']);
  }

  isAllowRepairReinstate() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_REPAIR_REINSTATE']);
  }

  isAllowRepairOverwrite() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_REPAIR_OVERWRITE']);
  }

  isAllowDepotJobOverwrite() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_DEPOT_JOB_OVERWRITE']);
  }

  isAllowDepotCostOverwrite() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_DEPOT_COST_OVERWRITE']);
  }

  isAllowBooking() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_BOOKING']);
  }

  isAllowScheduling() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_SCHEDULING']);
  }

  isAllowSurvey() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_SURVEY']);
  }

  isAllowTransfer() {
    return this.modulePackageService.hasFunctions(['INVENTORY_TANK_MOVEMENT_TRANSFER']);
  }
}