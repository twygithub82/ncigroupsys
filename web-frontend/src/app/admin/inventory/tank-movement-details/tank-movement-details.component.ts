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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
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
import { Apollo } from 'apollo-angular';
import { BookingDS, BookingItem } from 'app/data-sources/booking';
import { CodeValuesDS, CodeValuesItem, addDefaultSelectOption } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS, InGateItem } from 'app/data-sources/in-gate';
import { InGateCleaningDS, InGateCleaningItem } from 'app/data-sources/in-gate-cleaning';
import { InGateSurveyDS, InGateSurveyItem } from 'app/data-sources/in-gate-survey';
import { JobOrderDS } from 'app/data-sources/job-order';
import { OutGateDS, OutGateItem } from 'app/data-sources/out-gate';
import { OutGateSurveyDS, OutGateSurveyItem } from 'app/data-sources/out-gate-survey';
import { PackageBufferDS } from 'app/data-sources/package-buffer';
import { PackageDepotDS, PackageDepotItem } from 'app/data-sources/package-depot';
import { RepairDS, RepairItem } from 'app/data-sources/repair';
import { ResidueDS, ResidueItem } from 'app/data-sources/residue';
import { SchedulingDS, SchedulingItem } from 'app/data-sources/scheduling';
import { SteamDS, SteamItem } from 'app/data-sources/steam';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS, StoringOrderTankGO, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { SurveyDetailDS, SurveyDetailItem } from 'app/data-sources/survey-detail';
import { TankDS, TankItem } from 'app/data-sources/tank';
import { TankInfoDS, TankInfoItem } from 'app/data-sources/tank-info';
import { TransferDS, TransferItem } from 'app/data-sources/transfer';
import { RepairEstimatePdfComponent } from 'app/document-template/pdf/repair-estimate-pdf/repair-estimate-pdf.component';
import { SteamHeatingPdfComponent } from 'app/document-template/pdf/steam-heating-pdf/steam-heating-pdf.component';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddPurposeFormDialogComponent } from './add-purpose-form-dialog/add-purpose-form-dialog.component';
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
    MatPaginatorModule,
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
    // 'actions',
    'degree_celsius',
    'estimate_date',
    'approve_dt',
    'begin_dt',
    'complete_dt',
    'status_cv',
    'bill'
  ];

  displayedColumnsResidue = [
    'estimate_no',
    'estimate_date',
    'approve_dt',
    'allocation_dt',
    'qc_dt',
    'status_cv'
  ];

  displayedColumnsRepair = [
    'estimate_no',
    'estimate_date',
    'approve_dt',
    'allocation_dt',
    'qc_dt',
    'status_cv'
  ];

  displayedColumnsBooking = [
    'book_type_cv',
    'booking_dt',
    'reference',
    'surveyor',
    'status_cv',
  ];

  displayedColumnsScheduling = [
    'book_type_cv',
    'scheduling_dt',
    'reference',
    'status_cv',
  ];

  displayedColumnsSurveyDetail = [
    'surveyor',
    'survey_dt',
    'status_cv',
    'remarks',
    'update_by',
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

  pageTitle = 'MENUITEMS.INVENTORY.LIST.TANK-MOVEMENT-DETAILS'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.HOME.TEXT', route: '/' },
    { text: 'MENUITEMS.INVENTORY.LIST.TANK-MOVEMENT', route: '/admin/inventory/tank-movement' }
  ]

  translatedLangText: any = {};
  langText = {
    DETAILS: 'COMMON-FORM.DETAILS',
    STATUS: 'COMMON-FORM.STATUS',
    SO_NO: 'COMMON-FORM.SO-NO',
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
    EIR_DATE_TIME: "COMMON-FORM.EIR-DATE-TIME",
    SURVEY_INFO: "COMMON-FORM.SURVEY-INFO",
    DATE_OF_INSPECTION: "COMMON-FORM.DATE-OF-INSPECTION",
    PERIODIC_TEST: "COMMON-FORM.PERIODIC-TEST",
    LAST_TEST: "COMMON-FORM.LAST-TEST",
    NEXT_TEST: "COMMON-FORM.NEXT-TEST",
    TEST_TYPE: "COMMON-FORM.TEST-TYPE",
    DATE: "COMMON-FORM.DATE",
    CLASS: "COMMON-FORM.CLASS",
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
    SAVE_AND_SUBMIT: 'COMMON-FORM.SAVE-AND-SUBMIT',
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
    SPECIAL_NOTES: 'COMMON-FORM.SPECIAL-NOTES',
    RELEASE_NOTES: 'COMMON-FORM.RELEASE-NOTES',
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
    PROCEDURE_NAME: 'COMMON-FORM.PROCEDURE-NAME',
    PROCESSING_DAYS: 'COMMON-FORM.PROCESSING-DAYS',
    BILL: 'COMMON-FORM.BILL',
    CLEANING_BEGIN_DATE: 'COMMON-FORM.CLEANING-BEGIN-DATE',
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
    BOOKING_DETAILS: 'COMMON-FORM.BOOKING-DETAILS',
    BOOKING: 'COMMON-FORM.BOOKING',
    BOOKING_TYPE: 'COMMON-FORM.BOOKING-TYPE',
    BOOKING_DATE: 'COMMON-FORM.BOOKING-DATE',
    REFERENCE: 'COMMON-FORM.REFERENCE',
    SURVEYOR: 'COMMON-FORM.SURVEYOR',
    SCHEDULING: 'COMMON-FORM.SCHEDULING',
    SCHEDULING_DATE: 'COMMON-FORM.SCHEDULING-DATE',
    SURVEY_DETAILS: 'COMMON-FORM.SURVEY-DETAILS',
    UPDATE_TANK_NOTE: 'COMMON-FORM.UPDATE-TANK-NOTE',
    TRANSFER_DETAILS: 'COMMON-FORM.TRANSFER-DETAILS',
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
  bkDS: BookingDS;
  schedulingDS: SchedulingDS;
  surveyDS: SurveyDetailDS;
  tiDS: TankInfoDS;
  transferDS: TransferDS;

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

  storageCalCvList: CodeValuesItem[] = [];
  processStatusCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  bookingStatusCvList: CodeValuesItem[] = [];
  bookingTypeCvList: CodeValuesItem[] = [];
  repairOptionCvList: CodeValuesItem[] = [];
  yardCvList: CodeValuesItem[] = [];

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

  section = "tank_details";

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
    private fileManagerService: FileManagerService
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
    this.bkDS = new BookingDS(this.apollo);
    this.schedulingDS = new SchedulingDS(this.apollo);
    this.surveyDS = new SurveyDetailDS(this.apollo);
    this.tiDS = new TankInfoDS(this.apollo);
    this.transferDS = new TransferDS(this.apollo);

    const breakpointObserver = inject(BreakpointObserver);
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'vertical' : 'vertical')));
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
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      this.purposeOptionCvList = data;
    });
    this.cvDS.connectAlias('cleanStatusCv').subscribe(data => {
      this.cleanStatusCvList = addDefaultSelectOption(data, "Unknown");
    });
    this.cvDS.connectAlias('testTypeCv').subscribe(data => {
      this.testTypeCvList = addDefaultSelectOption(data, "--Select--");
      this.last_test_desc = this.getLastTest();
      this.next_test_desc = this.getNextTest();
    });
    this.cvDS.connectAlias('testClassCv').subscribe(data => {
      this.testClassCvList = addDefaultSelectOption(data, "--Select--");
      this.last_test_desc = this.getLastTest();
    });
    this.cvDS.connectAlias('manufacturerCv').subscribe(data => {
      this.manufacturerCvList = addDefaultSelectOption(data, "--Select--");
    });
    this.cvDS.connectAlias('claddingCv').subscribe(data => {
      this.claddingCvList = addDefaultSelectOption(data, "--Select--");
    });
    this.cvDS.connectAlias('maxGrossWeightCv').subscribe(data => {
      this.maxGrossWeightCvList = addDefaultSelectOption(data, "--Select--");
    });
    this.cvDS.connectAlias('tankHeightCv').subscribe(data => {
      this.tankHeightCvList = addDefaultSelectOption(data, "--Select--");
    });
    this.cvDS.connectAlias('walkwayCv').subscribe(data => {
      this.walkwayCvList = addDefaultSelectOption(data, "--Select--");
    });
    this.cvDS.connectAlias('airlineCv').subscribe(data => {
      this.airlineCvList = addDefaultSelectOption(data, "--Select--");
    });
    this.cvDS.connectAlias('airlineConnCv').subscribe(data => {
      this.airlineConnCvList = addDefaultSelectOption(data, "--Select--");
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
      this.disTypeCvList = addDefaultSelectOption(data, "--Select--");
    });
    this.cvDS.connectAlias('footValveCv').subscribe(data => {
      this.footValveCvList = data;
    });
    this.cvDS.connectAlias('manlidCoverCv').subscribe(data => {
      this.manlidCoverCvList = addDefaultSelectOption(data, "--Select--");
    });
    this.cvDS.connectAlias('manlidSealCv').subscribe(data => {
      this.manlidSealCvList = addDefaultSelectOption(data, "--Select--");
    });
    this.cvDS.connectAlias('pvSpecCv').subscribe(data => {
      this.pvSpecCvList = addDefaultSelectOption(data, "--Select--");
    });
    this.cvDS.connectAlias('pvTypeCv').subscribe(data => {
      this.pvTypeCvList = addDefaultSelectOption(data, "--Select--");
    });
    this.cvDS.connectAlias('thermometerCv').subscribe(data => {
      this.thermometerCvList = addDefaultSelectOption(data, "--Select--");
    });
    this.cvDS.connectAlias('tankCompTypeCv').subscribe(data => {
      this.tankCompTypeCvList = addDefaultSelectOption(data, "--Select--");
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

    this.sot_guid = this.route.snapshot.paramMap.get('id');
    if (this.sot_guid) {
      // EDIT
      this.subs.sink = this.sotDS.getStoringOrderTankForMovementByID(this.sot_guid).subscribe(data => {
        if (data.length > 0) {
          console.log(`sot: `, data)
          this.sot = data[0];
          

          this.subscribeToPurposeChangeEvent(this.sotDS.subscribeToSotPurposeChange.bind(this.sotDS), this.sot_guid!);
          this.pdDS.getCustomerPackage(this.sot?.storing_order?.customer_company?.guid!, this.sot?.tank?.tariff_depot_guid!).subscribe(data => {
            console.log(`packageDepot: `, data)
            this.pdItem = data[0];
          });
          this.tiDS.getTankInfoForMovement(this.sot?.tank_no!).subscribe(data => {
            console.log(`tankInfo: `, data)
            this.tiItem = data[0];
            this.last_test_desc = this.getLastTest();
            this.next_test_desc = this.getNextTest();
          });
          // if (this.sot?.in_gate?.length) {
          //   this.getCustomerBufferPackage(this.sot?.storing_order?.customer_company?.guid!, this.sot?.in_gate?.[0]?.in_gate_survey?.tank_comp_guid);
          // }
        }
      });
      this.subs.sink = this.igsDS.getInGateSurveyByIDForMovement(this.sot_guid).subscribe(data => {
        if (data.length > 0) {
          console.log(`igs: `, data)
          this.igs = data[0];
        }
      });
      this.subs.sink = this.igDS.getInGateByIDForMovement(this.sot_guid).subscribe(data => {
        if (data.length > 0) {
          console.log(`ig: `, data)
          this.ig = data[0];
        }
      });
      this.subs.sink = this.ogsDS.getOutGateSurveyByIDForMovement(this.sot_guid).subscribe(data => {
        if (data.length > 0) {
          console.log(`ogs: `, data)
          this.ogs = data[0];
        }
      });
      this.subs.sink = this.ogDS.getOutGateByIDForMovement(this.sot_guid).subscribe(data => {
        if (data.length > 0) {
          console.log(`og: `, data)
          this.og = data[0];
        }
      });
      this.subs.sink = this.steamDS.getSteamForMovement(this.sot_guid).subscribe(data => {
        if (data.length > 0) {
          console.log(`steam: `, data)
          this.steamItem = data;
        }
      });
      this.subs.sink = this.residueDS.getResidueForMovement(this.sot_guid).subscribe(data => {
        if (data.length > 0) {
          console.log(`residue: `, data)
          this.residueItem = data;
        }
      });
      this.subs.sink = this.cleaningDS.getCleaningForMovement(this.sot_guid).subscribe(data => {
        if (data.length > 0) {
          console.log(`cleaning: `, data)
          this.cleaningItem = data;
        }
      });
      this.subs.sink = this.repairDS.getRepairForMovement(this.sot_guid).subscribe(data => {
        if (data.length > 0) {
          console.log(`repair: `, data);
          this.repairItem = data;
          this.displayColumnChanged();
        }
      });
      this.subs.sink = this.bkDS.getBookingForMovement(this.sot_guid).subscribe(data => {
        if (data.length > 0) {
          console.log(`booking: `, data);
          this.bookingList = data;
        }
      });
      this.subs.sink = this.schedulingDS.getSchedulingForMovement(this.sot_guid).subscribe(data => {
        if (data.length > 0) {
          console.log(`scheduling: `, data);
          this.schedulingList = data;
        }
      });
      this.subs.sink = this.surveyDS.searchSurveyDetailForMovement(this.sot_guid).subscribe(data => {
        if (data.length > 0) {
          console.log(`survey: `, data);
          this.surveyList = data;
        }
      });
      this.subs.sink = this.transferDS.getTransferBySotIDForMovement(this.sot_guid).subscribe(data => {
        if (data.length > 0) {
          console.log(`transfer: `, data);
          this.transferList = data;
        }
      });
    }
  }

  getCustomerBufferPackage(customer_company_guid: string | undefined, tank_comp_guid: string | undefined) {
    if (!customer_company_guid) return;
    const where = {
      and: [
        { customer_company_guid: { eq: customer_company_guid } },
        { tariff_buffer_guid: { eq: tank_comp_guid } }
      ]
    }
    this.subs.sink = this.pbDS.getCustomerPackageCost(where).subscribe(data => {
      if (data?.length > 0) {
        console.log(data)
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
      ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
    }
  }

  handleSaveError() {
    let successMsg = this.translatedLangText.SAVE_ERROR;
    ComponentUtil.showNotification('snackbar-error', successMsg, 'top', 'center', this.snackBar);
  }

  handleDeleteSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.DELETE_SUCCESS;
      ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
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

  getYardDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.yardCvList);
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  displayDateTime(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateTimeStr(input);
  }

  displayDate(input: any): string | undefined {
    return Utility.convertEpochToDateStr(input);
  }

  parse2Decimal(figure: number | string) {
    if (typeof (figure) === 'string') {
      return parseFloat(figure).toFixed(2);
    } else if (typeof (figure) === 'number') {
      return figure.toFixed(2);
    }
    return "";
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

  updatePurposeDialog(event: Event, type: string, action: string) {
    this.preventDefault(event);
    // TODO :: Add purpose logic
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(AddPurposeFormDialogComponent, {
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
        repair_guid: repair?.guid,
        customer_company_guid: this.sot?.storing_order?.customer_company_guid,
        estimate_no: repair?.estimate_no,
        repairEstimatePdf: undefined,
        retrieveFile: true
      },
      // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    });
  }

  steamHeatingLogDialog(event: Event, steam: SteamItem) {
    this.preventDefault(event);
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
    const yearCount = parseFloat(match?.[0] ?? "0");
    const resultDt = Utility.addYearsToEpoch(igs?.test_dt as number, yearCount) as number;
    const output = this.getTestTypeDescription(igs?.next_test_cv) + " - " + Utility.convertEpochToDateStr(resultDt, 'MM/YYYY');
    return output;
  }

  getNextTestTI(): string | undefined {
    if (!this.testTypeCvList?.length || !this.tiItem) return "";

    if (!this.tiItem?.test_dt || !this.tiItem?.last_test_cv) return "-";
    const test_type = this.tiItem?.last_test_cv;
    const match = test_type?.match(/^[0-9]*\.?[0-9]+/);
    const yearCount = parseFloat(match?.[0] ?? "0");
    const resultDt = Utility.addYearsToEpoch(this.tiItem?.test_dt as number, yearCount) as number;
    const output = this.getTestTypeDescription(this.tiItem?.next_test_cv) + " - " + Utility.convertEpochToDateStr(resultDt, 'MM/YYYY');
    return output;
  }

  getCheckDigit(tank_no: string): boolean {
    return Utility.verifyFormattedIsoContainerCheckDigit(tank_no);
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

    return max;
  }

  displayColumnChanged() {
    if (true) {
      this.displayedColumnsRepair = [
        'estimate_no',
        'estimate_date',
        'approve_dt',
        'allocation_dt',
        'qc_dt',
        'status_cv'
      ];
    } else {
      this.displayedColumnsRepair = [
        'tank_no',
        'customer',
        'estimate_no',
        'status_cv'
      ];
    }
  }

  preventDefault(event: Event) {
    event.preventDefault(); // Prevents the form submission
  }

  setSection(section: string) {
    this.section = section;
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
          return value === '';
        }
      }
    }

    // If all other purposes are invalid or absent
    return true;
  }

  canRemovePurpose(purpose: string) {
    if (this.sot) {
      if (purpose === 'steaming') {
        return !this.steamItem.some(item => !this.allowRemovePurposeStatuses.includes(item.status_cv || ''));
      } else if (purpose === 'cleaning') {
        return !this.cleaningItem?.some(item => !this.allowRemovePurposeStatuses.includes(item.status_cv || '')) && !this.residueItem?.some(item => !this.allowRemovePurposeStatuses.includes(item.status_cv || ''));
      } else if (purpose === 'repair') {
        return !this.repairItem.length || !this.repairItem.some(item => !this.allowRemovePurposeStatuses.includes(item.status_cv || ''));
      }
    }
    return true;
  }

  canAddPurpose(purpose: string) {
    if (this.sot) {
      if (this.allowAddPurposeTankStatuses.includes(this.sot.tank_status_cv || '')) {
        if (purpose === 'steaming') {
          return this.isNoPurpose(this.sot, 'steaming') && this.isNoPurpose(this.sot, 'cleaning') && this.isNoPurpose(this.sot, 'repair');
        } else if (purpose === 'cleaning') {
          return this.isNoPurpose(this.sot, 'cleaning') && this.isNoPurpose(this.sot, 'steaming');
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
}