import { Direction } from '@angular/cdk/bidi';
import { BreakpointObserver } from '@angular/cdk/layout';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { FileManagerService } from '@core/service/filemanager.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { PreviewImageDialogComponent } from '@shared/components/preview-image-dialog/preview-image-dialog.component';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem, addDefaultSelectOption } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { OutGate, OutGateDS, OutGateGO, OutGateItem } from 'app/data-sources/out-gate';
import { OutGateSurveyDS, OutGateSurveyGO } from 'app/data-sources/out-gate-survey';
import { PackageBufferDS, PackageBufferItem } from 'app/data-sources/package-buffer';
import { ReleaseOrderGO } from 'app/data-sources/release-order';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTank, StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TankDS, TankItem } from 'app/data-sources/tank';
import { TankInfoDS, TankInfoItem } from 'app/data-sources/tank-info';
import { ExclusiveToggleDirective } from 'app/directive/exclusive-toggle.directive';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Observable, Subject, merge } from 'rxjs';
import { debounceTime, map, startWith, takeUntil, tap } from 'rxjs/operators';
import { EmptyFormConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { FormDialogComponent } from './form-dialog/form-dialog.component';

@Component({
  selector: 'app-out-gate-survey-form',
  standalone: true,
  templateUrl: './out-gate-survey-form.component.html',
  styleUrl: './out-gate-survey-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    PreventNonNumericDirective,
    MatButtonToggleModule,
    ExclusiveToggleDirective
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ]
})
export class OutGateSurveyFormComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  tabIndex = 'out-gate-survey';
  pageTitle = 'MENUITEMS.INVENTORY.LIST.OUT-GATE-SURVEY-FORM'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.INVENTORY.TEXT', route: '/admin/inventory/out-gate-main', queryParams: { tabIndex: this.tabIndex } },
    { text: 'MENUITEMS.INVENTORY.LIST.OUT-GATE-SURVEY', route: '/admin/inventory/out-gate-main', queryParams: { tabIndex: this.tabIndex } }
  ]

  translatedLangText: any = {};
  langText = {
    SURVEY_FORM: 'COMMON-FORM.SURVEY-FORM',
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
    OUT_GATE_DETAILS: "COMMON-FORM.OUT-GATE-DETAILS",
    OUT_GATE_REMARKS: "COMMON-FORM.OUT-GATE-REMARKS",
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
    DATA_SCS: 'COMMON-FORM.DATA-SCS',
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
    PHOTOS: 'COMMON-FORM.PHOTOS',
    PUBLISH: 'COMMON-FORM.PUBLISH',
    MANUFACTURER: 'COMMON-FORM.MANUFACTURER',
    DOM: 'COMMON-FORM.DOM',
    OTHERS: 'COMMON-FORM.OTHERS',
    EMPTY_FORM: 'COMMON-FORM.EMPTY-FORM',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    COMPARTMENT_TYPE_BTM_EMPTY: 'COMMON-FORM.COMPARTMENT-TYPE-BTM-EMPTY',
    COMPARTMENT_TYPE_TOP_EMPTY: 'COMMON-FORM.COMPARTMENT-TYPE-TOP-EMPTY',
    COMPARTMENT_TYPE_MANLID_EMPTY: 'COMMON-FORM.COMPARTMENT-TYPE-MANLID-EMPTY',
    ARE_YOU_SURE_TO_SUBMIT: 'COMMON-FORM.ARE-YOU-SURE-TO-SUBMIT',
  }
  private destroy$ = new Subject<void>();

  out_gate_guid: string | null | undefined;
  ro_sot_guid: string | null | undefined;
  out_gate: OutGateItem | null | undefined;
  tank_info: TankInfoItem | null | undefined;

  surveyForm?: UntypedFormGroup;

  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  cvDS: CodeValuesDS;
  tDS: TankDS;
  pbDS: PackageBufferDS;
  ogDS: OutGateDS;
  ogsDS: OutGateSurveyDS;
  tiDS: TankInfoDS;

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
  tankStatusCvList: CodeValuesItem[] = [];
  packageBufferList?: PackageBufferItem[];

  unit_typeList: TankItem[] = []

  dateOfInspection: Date = new Date();
  startDateTest: Date = new Date();
  maxManuDOMDt: Date = new Date();
  defaultImg: string = '/assets/images/no_image.svg';

  last_test_desc?: string = "";
  next_test_desc?: string = "";

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
  isFileActionLoading$: Observable<boolean> = this.fileManagerService.actionLoading$;

  stepperOrientation: Observable<StepperOrientation>;
  compTypeStepperOrientation: Observable<StepperOrientation>;

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
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.tDS = new TankDS(this.apollo);
    this.pbDS = new PackageBufferDS(this.apollo);
    this.ogDS = new OutGateDS(this.apollo);
    this.ogsDS = new OutGateSurveyDS(this.apollo);
    this.tiDS = new TankInfoDS(this.apollo);

    const breakpointObserver = inject(BreakpointObserver);
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 1025px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    this.compTypeStepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
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
      tank_details: this.fb.group({
        unit_type_guid: [''],
        owner: this.ownerControl,
        owner_guid: [''],
        manufacturer_cv: [''],
        dom_dt: [''],
        cladding_cv: [''],
        capacity: [''],
        tare_weight: [''],
        max_weight_cv: [''],
        height_cv: [''],
        walkway_cv: [''],
        tank_comp_guid: [''],
        comments: [''],
      }),
      periodic_test: this.fb.group({
        last_test_cv: [''],
        next_test_cv: [''],
        test_class_cv: [''],
        test_dt: [''],
      }),
      out_gate_details: this.fb.group({
        vehicle_no: [''],
        driver_name: [''],
        haulier: [''],
        in_gate_remarks: [''],
      }),
      frame_type: this.fb.group({
        leftRemarks: [''],
        rearRemarks: [''],
        rightRemarks: [''],
        topRemarks: [''],
        frontRemarks: [''],
        bottomRemarks: [''],
        leftImage: this.createImageForm('LEFT_SIDE', '', undefined),
        rearImage: this.createImageForm('REAR_SIDE', '', undefined),
        rightImage: this.createImageForm('RIGHT_SIDE', '', undefined),
        topImage: this.createImageForm('TOP_SIDE', '', undefined),
        frontImage: this.createImageForm('FRONT_SIDE', '', undefined),
        bottomImage: this.createImageForm('BOTTOM_SIDE', '', undefined),
        dmgImages: this.fb.array([]),
      }),
      // photos: this.fb.group({
      //   leftImage: this.createImageForm('LEFT_SIDE', '', undefined),
      //   rearImage: this.createImageForm('REAR_SIDE', '', undefined),
      //   rightImage: this.createImageForm('RIGHT_SIDE', '', undefined),
      //   topImage: this.createImageForm('TOP_SIDE', '', undefined),
      //   frontImage: this.createImageForm('FRONT_SIDE', '', undefined),
      //   bottomImage: this.createImageForm('BOTTOM_SIDE', '', undefined),
      //   dmgImages: this.fb.array([]),
      // }),
      compartment_type: this.fb.group({
        bottomFormGroup: this.fb.group({
          btm_dis_comp_cv: [''],
          btm_dis_valve_cv: [''],
          btm_dis_valve_oth: [''],
          btm_dis_valve_spec_cv: [''],
          btm_dis_valve_spec_oth: [''],
          foot_valve_cv: [''],
          foot_valve_oth: [''],
          btm_valve_brand_cv: [''],
          thermometer: [''],
          thermometer_cv: [''],
          ladder: [''],
          data_csc_transportplate: [''],
        }),
        topFormGroup: this.fb.group({
          top_dis_comp_cv: [''],
          top_dis_valve_cv: [''],
          top_dis_valve_oth: [''],
          top_dis_valve_spec_cv: [''],
          top_dis_valve_spec_oth: [''],
          top_valve_brand_cv: [''],
          airline_valve_cv: [''],
          airline_valve_oth: [''],
          airline_valve_pcs: [''],
          airline_valve_dim: [''],
          airline_valve_conn_cv: [''],
          airline_valve_conn_oth: [''],
          airline_valve_conn_spec_cv: [''],
          airline_valve_conn_spec_oth: [''],
        }),
        manlidFormGroup: this.fb.group({
          manlid_comp_cv: [''],
          manlid_cover_cv: [''],
          manlid_cover_oth: [''],
          manlid_cover_pcs: [''],
          manlid_cover_pts: [''],
          manlid_seal_cv: [''],
          pv_type_cv: [''],
          pv_type_pcs: [''],
          pv_spec_cv: [''],
          pv_spec_pcs: [''],
          safety_handrail: [''],
          buffer_plate: [''],
          residue: [''],
          dipstick: [''],
        })
      }),
    });

    this.initValueChanges();
  }

  initValueChanges() {
    // Subscribe to the value changes of the relevant controls
    this.surveyForm!.get('periodic_test.last_test_cv')?.valueChanges.subscribe(() => {
      this.onTestValuesChanged();
    });

    this.surveyForm!.get('periodic_test.test_dt')?.valueChanges.subscribe(() => {
      this.onTestValuesChanged();
    });

    this.surveyForm!.get('periodic_test.test_class_cv')?.valueChanges.subscribe(() => {
      this.onTestValuesChanged();
    });

    this.surveyForm!.get('tank_details.owner')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (typeof value === 'string') {
          searchCriteria = value;
        } else {
          searchCriteria = value?.code || '';
          this.surveyForm!.get('tank_details.owner_guid')!.setValue(value?.guid);
        }
        this.subs.sink = this.ccDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }], type_cv: { in: ["OWNER", "LESSEE"] } }, { code: 'ASC' }).subscribe(data => {
          this.ownerList = data;
        });
      })
    ).subscribe();

    this.initBtmDisValveValueChange();
    this.initBtmFootValveValueChange();
    this.initBtmThermoValueChange();
    this.initTopDisValveValueChange();
    this.initTopAirlineValveValueChange();
    this.initTopAirlineValveConnValueChange();
    this.initManlidCoverValueChange();
    this.initManlidPVValueChange();
  }

  displayOthers(formControlValue: any) {
    return BusinessLogicUtil.isOthers(formControlValue);
  }

  dmgImages(): UntypedFormArray {
    return this.surveyForm?.get('frame_type.dmgImages') as UntypedFormArray;
  }

  createImageForm(side: string, preview: string | ArrayBuffer, file: File | undefined): UntypedFormGroup {
    return this.fb.group({
      file: [file],
      preview: [preview],
      side: [side],
    })
  }

  patchImageForm(imgForm: any, side: string, preview: string | ArrayBuffer, file: File | undefined): UntypedFormGroup {
    return imgForm.patchValue({
      file: file,
      preview: preview,
      side: side,
    })
  }

  patchOrCreateImageForm(side: string, imgList: any[], formControl: any): UntypedFormGroup {
    return imgList?.length
      ? this.patchImageForm(formControl, side, imgList[0].url, undefined)
      : this.createImageForm(side, '', undefined);
  }

  onTestValuesChanged(): void {
    this.last_test_desc = this.getLastTest();
    this.next_test_desc = this.getNextTest();
  }

  getCompartmentTypeFormGroup(): UntypedFormGroup {
    return this.surveyForm!.get('compartment_type') as UntypedFormGroup;
  }

  getBottomFormGroup(): UntypedFormGroup {
    return this.surveyForm!.get('compartment_type.bottomFormGroup') as UntypedFormGroup;
  }

  getTopFormGroup(): UntypedFormGroup {
    return this.surveyForm!.get('compartment_type.topFormGroup') as UntypedFormGroup;
  }

  getManlidFormGroup(): UntypedFormGroup {
    return this.surveyForm!.get('compartment_type.manlidFormGroup') as UntypedFormGroup;
  }

  getTankDetailsFormGroup(): UntypedFormGroup {
    return this.surveyForm!.get('tank_details') as UntypedFormGroup;
  }

  getOutGateDetailsFormGroup(): UntypedFormGroup {
    return this.surveyForm!.get('out_gate_details') as UntypedFormGroup;
  }

  getPeriodicTestFormGroup(): UntypedFormGroup {
    return this.surveyForm!.get('periodic_test') as UntypedFormGroup;
  }

  // getPhotosFormGroup(): UntypedFormGroup {
  //   return this.surveyForm!.get('photos') as UntypedFormGroup;
  // }

  getFrameTypeFormGroup(): UntypedFormGroup {
    return this.surveyForm!.get('frame_type') as UntypedFormGroup;
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
      { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      this.purposeOptionCvList = data;
      this.detectChanges();
    });
    this.cvDS.connectAlias('cleanStatusCv').subscribe(data => {
      this.cleanStatusCvList = addDefaultSelectOption(data, "Unknown");
      this.detectChanges();
    });
    this.cvDS.connectAlias('testTypeCv').subscribe(data => {
      this.testTypeCvList = addDefaultSelectOption(data, "--Select--");
      if (data.length) {
        this.last_test_desc = this.getLastTest();
        this.next_test_desc = this.getNextTest();
        this.detectChanges();
      }
    });
    this.cvDS.connectAlias('testClassCv').subscribe(data => {
      this.testClassCvList = addDefaultSelectOption(data, "--Select--");
      if (data.length) {
        this.last_test_desc = this.getLastTest();
        this.next_test_desc = this.getNextTest();
        this.detectChanges();
      }
    });
    this.cvDS.connectAlias('manufacturerCv').subscribe(data => {
      this.manufacturerCvList = addDefaultSelectOption(data, "--Select--");
      this.detectChanges();
    });
    this.cvDS.connectAlias('claddingCv').subscribe(data => {
      this.claddingCvList = addDefaultSelectOption(data, "--Select--");
      this.detectChanges();
    });
    this.cvDS.connectAlias('maxGrossWeightCv').subscribe(data => {
      this.maxGrossWeightCvList = addDefaultSelectOption(data, "--Select--");
      this.detectChanges();
    });
    this.cvDS.connectAlias('tankHeightCv').subscribe(data => {
      this.tankHeightCvList = addDefaultSelectOption(data, "--Select--");
      this.detectChanges();
    });
    this.cvDS.connectAlias('walkwayCv').subscribe(data => {
      this.walkwayCvList = addDefaultSelectOption(data, "--Select--");
      this.detectChanges();
    });
    this.cvDS.connectAlias('airlineCv').subscribe(data => {
      this.airlineCvList = data || [];
      this.detectChanges();
    });
    this.cvDS.connectAlias('airlineConnCv').subscribe(data => {
      this.airlineConnCvList = data || [];
      this.detectChanges();
    });
    this.cvDS.connectAlias('disCompCv').subscribe(data => {
      this.disCompCvList = data;
      this.detectChanges();
    });
    this.cvDS.connectAlias('disValveCv').subscribe(data => {
      this.disValveCvList = data;
      this.detectChanges();
    });
    this.cvDS.connectAlias('disValveSpecCv').subscribe(data => {
      this.disValveSpecCvList = data;
      this.detectChanges();
    });
    this.cvDS.connectAlias('disTypeCv').subscribe(data => {
      this.disTypeCvList = data || [];
      this.detectChanges();
    });
    this.cvDS.connectAlias('footValveCv').subscribe(data => {
      this.footValveCvList = data;
      this.detectChanges();
    });
    this.cvDS.connectAlias('manlidCoverCv').subscribe(data => {
      this.manlidCoverCvList = data || [];
      this.detectChanges();
    });
    this.cvDS.connectAlias('manlidSealCv').subscribe(data => {
      this.manlidSealCvList = data || [];
      this.detectChanges();
    });
    this.cvDS.connectAlias('pvSpecCv').subscribe(data => {
      this.pvSpecCvList = data || [];
      this.detectChanges();
    });
    this.cvDS.connectAlias('pvTypeCv').subscribe(data => {
      this.pvTypeCvList = data || [];
      this.detectChanges();
    });
    this.cvDS.connectAlias('thermometerCv').subscribe(data => {
      this.thermometerCvList = data;
      this.detectChanges();
    });
    this.cvDS.connectAlias('valveBrandCv').subscribe(data => {
      this.valveBrandCvList = data;
      this.detectChanges();
    });
    this.cvDS.connectAlias('tankSideCv').subscribe(data => {
      this.tankSideCvList = data;
      this.detectChanges();
    });
    this.cvDS.connectAlias('tankStatusCv').subscribe(data => {
      this.tankStatusCvList = data;
      this.detectChanges();
    });
    this.subs.sink = this.tDS.loadItems().subscribe(data => {
      this.unit_typeList = data
      this.detectChanges();
    });

    this.out_gate_guid = this.route.snapshot.paramMap.get('id');
    this.ro_sot_guid = this.route.snapshot.paramMap.get('roSotId');
    if (this.out_gate_guid) {
      // EDIT
      this.subs.sink = this.ogDS.getOutGateByID(this.out_gate_guid, this.ro_sot_guid!).subscribe(data => {
        if (data?.length > 0) {
          this.out_gate = data[0];
          console.log('out_gate:', this.out_gate);
          this.tiDS.getTankInfoForOutGateSurvey(this.out_gate?.tank?.tank_no!).subscribe(data => {
            if (data?.length > 0) {
              this.tank_info = data[0];
              this.populateOutGateForm(this.out_gate!, this.tank_info);
              if (this.out_gate!.out_gate_survey?.guid) {
                this.fileManagerService.getFileUrlByGroupGuid([this.out_gate!.out_gate_survey?.guid]).subscribe({
                  next: (response) => {
                    console.log('Files retrieved successfully:', response);
                    this.populateImages(response)
                  },
                  error: (error) => {
                    console.error('Error retrieving files:', error);
                  },
                  complete: () => {
                    console.log('File retrieval process completed.');
                  }
                });
              }
            }
          });

          this.getCustomerBufferPackage(this.out_gate.tank?.storing_order?.customer_company?.guid);
        }
      });
    }
  }

  initBtmDisValveValueChange() {
    const bottomForm = this.getBottomFormGroup();
    const btmDisValveCvCtrl = bottomForm.get('btm_dis_valve_cv');
    const btmDisValveSpecCvCtrl = bottomForm.get('btm_dis_valve_spec_cv');
    const btmDisValveOthCtrl = bottomForm.get('btm_dis_valve_oth');
    const btmDisValveSpecOthCtrl = bottomForm.get('btm_dis_valve_spec_oth');
    if (!btmDisValveCvCtrl || !btmDisValveSpecCvCtrl || !btmDisValveOthCtrl || !btmDisValveSpecOthCtrl) return;

    merge(
      this.surveyForm!.get('compartment_type.bottomFormGroup.btm_dis_valve_cv')!.valueChanges.pipe(startWith(btmDisValveCvCtrl.value)),
      this.surveyForm!.get('compartment_type.bottomFormGroup.btm_dis_valve_spec_cv')!.valueChanges.pipe(startWith(btmDisValveSpecCvCtrl.value))
    )
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        tap(() => {
          const valveValue = btmDisValveCvCtrl.value;
          const specValue = btmDisValveSpecCvCtrl.value;

          if (this.displayOthers(valveValue)) {
            btmDisValveOthCtrl.setValidators([Validators.required]);
          } else {
            btmDisValveOthCtrl.clearValidators();
          }

          if (this.displayOthers(specValue)) {
            btmDisValveSpecOthCtrl.setValidators([Validators.required]);
          } else {
            btmDisValveSpecOthCtrl.clearValidators();
          }

          if (valveValue?.length || specValue?.length) {
            btmDisValveCvCtrl.setValidators([Validators.required]);
            btmDisValveSpecCvCtrl.setValidators([Validators.required]);
          } else {
            btmDisValveCvCtrl.clearValidators();
            btmDisValveSpecCvCtrl.clearValidators();
          }

          setTimeout(() => {
            btmDisValveCvCtrl.updateValueAndValidity({ emitEvent: false });
            btmDisValveSpecCvCtrl.updateValueAndValidity({ emitEvent: false });
            btmDisValveOthCtrl.updateValueAndValidity({ emitEvent: false });
            btmDisValveSpecOthCtrl.updateValueAndValidity({ emitEvent: false });
            this.detectChanges();
          });
        })
      )
      .subscribe();
  }

  initBtmFootValveValueChange() {
    const bottomForm = this.getBottomFormGroup();
    const btmFootValveCvCtrl = bottomForm.get('foot_valve_cv');
    const btmFootValveOthCtrl = bottomForm.get('foot_valve_oth');
    if (!btmFootValveCvCtrl || !btmFootValveOthCtrl) return;

    merge(
      this.surveyForm!.get('compartment_type.bottomFormGroup.foot_valve_cv')!.valueChanges.pipe(startWith(btmFootValveCvCtrl.value))
    )
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        tap(() => {
          const valveValue = btmFootValveCvCtrl.value;

          if (this.displayOthers(valveValue)) {
            btmFootValveOthCtrl?.setValidators([Validators.required]);
          } else {
            btmFootValveOthCtrl?.clearValidators();
          }

          setTimeout(() => {
            btmFootValveCvCtrl.updateValueAndValidity({ emitEvent: false });
            btmFootValveOthCtrl.updateValueAndValidity({ emitEvent: false });
            this.detectChanges();
          });
        })
      )
      .subscribe();
  }

  initBtmThermoValueChange() {
    const bottomForm = this.getBottomFormGroup();
    const btmThermoCtrl = bottomForm.get('thermometer');
    const btmThermoSpecCvCtrl = bottomForm.get('thermometer_cv');
    if (!btmThermoCtrl || !btmThermoSpecCvCtrl) return;

    merge(
      // this.surveyForm!.get('compartment_type.bottomFormGroup.thermometer')!.valueChanges.pipe(startWith(btmThermoCtrl.value)),
      this.surveyForm!.get('compartment_type.bottomFormGroup.thermometer_cv')!.valueChanges.pipe(startWith(btmThermoSpecCvCtrl.value))
    )
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        tap(() => {
          // const valveValue = btmThermoCtrl.value;
          const specValue = btmThermoSpecCvCtrl.value;

          if (specValue?.length) {
            btmThermoCtrl.setValidators([Validators.required]);
            btmThermoSpecCvCtrl.setValidators([Validators.required]);
          } else {
            btmThermoCtrl.clearValidators();
            btmThermoSpecCvCtrl.clearValidators();
          }

          setTimeout(() => {
            btmThermoCtrl.updateValueAndValidity({ emitEvent: false });
            btmThermoSpecCvCtrl.updateValueAndValidity({ emitEvent: false });
            this.detectChanges();
          });
        })
      )
      .subscribe();
  }

  initTopDisValveValueChange() {
    const topForm = this.getTopFormGroup();
    const topDisValveCvCtrl = topForm.get('top_dis_valve_cv');
    const topDisValveSpecCvCtrl = topForm.get('top_dis_valve_spec_cv');
    const topDisValveOthCtrl = topForm.get('top_dis_valve_oth');
    const topDisValveSpecOthCtrl = topForm.get('top_dis_valve_spec_oth');
    if (!topDisValveCvCtrl || !topDisValveSpecCvCtrl || !topDisValveOthCtrl || !topDisValveSpecOthCtrl) return;

    merge(
      this.surveyForm!.get('compartment_type.topFormGroup.top_dis_valve_cv')!.valueChanges.pipe(startWith(topDisValveCvCtrl.value)),
      this.surveyForm!.get('compartment_type.topFormGroup.top_dis_valve_spec_cv')!.valueChanges.pipe(startWith(topDisValveSpecCvCtrl.value))
    )
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        tap(() => {
          const valveValue = topDisValveCvCtrl.value;
          const specValue = topDisValveSpecCvCtrl.value;

          if (this.displayOthers(valveValue)) {
            topDisValveOthCtrl.setValidators([Validators.required]);
          } else {
            topDisValveOthCtrl.clearValidators();
          }

          if (this.displayOthers(specValue)) {
            topDisValveSpecOthCtrl.setValidators([Validators.required]);
          } else {
            topDisValveSpecOthCtrl.clearValidators();
          }

          if (valveValue?.length || specValue?.length) {
            topDisValveCvCtrl.setValidators([Validators.required]);
            topDisValveSpecCvCtrl.setValidators([Validators.required]);
          } else {
            topDisValveCvCtrl.clearValidators();
            topDisValveSpecCvCtrl.clearValidators();
          }

          setTimeout(() => {
            topDisValveCvCtrl.updateValueAndValidity({ emitEvent: false });
            topDisValveSpecCvCtrl.updateValueAndValidity({ emitEvent: false });
            topDisValveOthCtrl.updateValueAndValidity({ emitEvent: false });
            topDisValveSpecOthCtrl.updateValueAndValidity({ emitEvent: false });
            this.detectChanges();
          });
        })
      )
      .subscribe();
  }

  initTopAirlineValveValueChange() {
    const topForm = this.getTopFormGroup();
    const topAirlineValveCvCtrl = topForm.get('airline_valve_cv');
    const topAirlineValveOthCtrl = topForm.get('airline_valve_oth');
    const topAirlineValvePcsCtrl = topForm.get('airline_valve_pcs');
    const topAirlineValveDimCtrl = topForm.get('airline_valve_dim');
    if (!topAirlineValveCvCtrl || !topAirlineValveOthCtrl || !topAirlineValvePcsCtrl || !topAirlineValveDimCtrl) return;

    merge(
      this.surveyForm!.get('compartment_type.topFormGroup.airline_valve_cv')!.valueChanges.pipe(startWith(topAirlineValveCvCtrl.value)),
      this.surveyForm!.get('compartment_type.topFormGroup.airline_valve_pcs')!.valueChanges.pipe(startWith(topAirlineValvePcsCtrl.value)),
      this.surveyForm!.get('compartment_type.topFormGroup.airline_valve_dim')!.valueChanges.pipe(startWith(topAirlineValveDimCtrl.value))
    )
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        tap(() => {
          const valveValue = topAirlineValveCvCtrl.value;
          const pcsValue = topAirlineValvePcsCtrl.value;
          const dimValue = topAirlineValveDimCtrl.value;

          if (this.displayOthers(valveValue)) {
            topAirlineValveOthCtrl.setValidators([Validators.required]);
          } else {
            topAirlineValveOthCtrl.clearValidators();
          }

          if (valveValue?.length || pcsValue || dimValue) {
            topAirlineValveCvCtrl.setValidators([Validators.required]);
            topAirlineValvePcsCtrl.setValidators([Validators.required]);
            topAirlineValveDimCtrl.setValidators([Validators.required]);
          } else {
            topAirlineValveCvCtrl.clearValidators();
            topAirlineValvePcsCtrl.clearValidators();
            topAirlineValveDimCtrl.clearValidators();
          }

          setTimeout(() => {
            topAirlineValveCvCtrl.updateValueAndValidity({ emitEvent: false });
            topAirlineValveOthCtrl.updateValueAndValidity({ emitEvent: false });
            topAirlineValvePcsCtrl.updateValueAndValidity({ emitEvent: false });
            topAirlineValveDimCtrl.updateValueAndValidity({ emitEvent: false });
            this.detectChanges();
          });
        })
      )
      .subscribe();
  }

  initTopAirlineValveConnValueChange() {
    const topForm = this.getTopFormGroup();
    const topAirlineValveConnCvCtrl = topForm.get('airline_valve_conn_cv');
    const topAirlineValveConnSpecCvCtrl = topForm.get('airline_valve_conn_spec_cv');
    const topAirlineValveConnOthCtrl = topForm.get('airline_valve_conn_oth');
    const topAirlineValveConnSpecOthCtrl = topForm.get('airline_valve_conn_spec_oth');
    if (!topAirlineValveConnCvCtrl || !topAirlineValveConnSpecCvCtrl || !topAirlineValveConnOthCtrl || !topAirlineValveConnSpecOthCtrl) return;

    merge(
      this.surveyForm!.get('compartment_type.topFormGroup.airline_valve_conn_cv')!.valueChanges.pipe(startWith(topAirlineValveConnCvCtrl.value)),
      this.surveyForm!.get('compartment_type.topFormGroup.airline_valve_conn_spec_cv')!.valueChanges.pipe(startWith(topAirlineValveConnSpecCvCtrl.value))
    )
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        tap(() => {
          const valveValue = topAirlineValveConnCvCtrl.value;
          const specValue = topAirlineValveConnSpecCvCtrl.value;

          if (this.displayOthers(valveValue)) {
            topAirlineValveConnOthCtrl.setValidators([Validators.required]);
          } else {
            topAirlineValveConnOthCtrl.clearValidators();
          }

          if (this.displayOthers(specValue)) {
            topAirlineValveConnSpecOthCtrl.setValidators([Validators.required]);
          } else {
            topAirlineValveConnSpecOthCtrl.clearValidators();
          }

          if (valveValue?.length || specValue?.length) {
            topAirlineValveConnCvCtrl.setValidators([Validators.required]);
            topAirlineValveConnSpecCvCtrl.setValidators([Validators.required]);
          } else {
            topAirlineValveConnCvCtrl.clearValidators();
            topAirlineValveConnSpecCvCtrl.clearValidators();
          }

          setTimeout(() => {
            topAirlineValveConnCvCtrl.updateValueAndValidity({ emitEvent: false });
            topAirlineValveConnSpecCvCtrl.updateValueAndValidity({ emitEvent: false });
            topAirlineValveConnOthCtrl.updateValueAndValidity({ emitEvent: false });
            topAirlineValveConnSpecOthCtrl.updateValueAndValidity({ emitEvent: false });
            this.detectChanges();
          });
        })
      )
      .subscribe();
  }

  initManlidCoverValueChange() {
    const manlidForm = this.getManlidFormGroup();
    const manlidCoverCvCtrl = manlidForm.get('manlid_cover_cv');
    const manlidCoverOthCtrl = manlidForm.get('manlid_cover_oth');
    const manlidCoverPcsCtrl = manlidForm.get('manlid_cover_pcs');
    const manlidCoverPtsCtrl = manlidForm.get('manlid_cover_pts');
    if (!manlidCoverCvCtrl || !manlidCoverPcsCtrl || !manlidCoverPtsCtrl || !manlidCoverOthCtrl) return;

    merge(
      this.surveyForm!.get('compartment_type.manlidFormGroup.manlid_cover_cv')!.valueChanges.pipe(startWith(manlidCoverCvCtrl.value)),
      this.surveyForm!.get('compartment_type.manlidFormGroup.manlid_cover_pcs')!.valueChanges.pipe(startWith(manlidCoverPcsCtrl.value)),
      this.surveyForm!.get('compartment_type.manlidFormGroup.manlid_cover_pts')!.valueChanges.pipe(startWith(manlidCoverPtsCtrl.value))
    )
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        tap(() => {
          const valveValue = manlidCoverCvCtrl.value;
          const pcsValue = manlidCoverPcsCtrl.value;
          const dimValue = manlidCoverPtsCtrl.value;

          if (this.displayOthers(valveValue)) {
            manlidCoverOthCtrl.setValidators([Validators.required]);
          } else {
            manlidCoverOthCtrl.clearValidators();
          }

          if (valveValue?.length || pcsValue || dimValue) {
            manlidCoverCvCtrl.setValidators([Validators.required]);
            manlidCoverPcsCtrl.setValidators([Validators.required]);
            manlidCoverPtsCtrl.setValidators([Validators.required]);
          } else {
            manlidCoverCvCtrl.clearValidators();
            manlidCoverPcsCtrl.clearValidators();
            manlidCoverPtsCtrl.clearValidators();
          }

          setTimeout(() => {
            manlidCoverCvCtrl.updateValueAndValidity({ emitEvent: false });
            manlidCoverOthCtrl.updateValueAndValidity({ emitEvent: false });
            manlidCoverPcsCtrl.updateValueAndValidity({ emitEvent: false });
            manlidCoverPtsCtrl.updateValueAndValidity({ emitEvent: false });
            this.detectChanges();
          });
        })
      )
      .subscribe();
  }

  initManlidPVValueChange() {
    const manlidForm = this.getManlidFormGroup();
    const pvTypeCvCtrl = manlidForm.get('pv_type_cv');
    const pvTypePcsCtrl = manlidForm.get('pv_type_pcs');
    const pvSpecCvCtrl = manlidForm.get('pv_spec_cv');
    const pvSpecPcsCtrl = manlidForm.get('pv_spec_pcs');
    if (!pvTypeCvCtrl || !pvTypePcsCtrl || !pvSpecCvCtrl || !pvSpecPcsCtrl) return;

    merge(
      this.surveyForm!.get('compartment_type.manlidFormGroup.pv_type_cv')!.valueChanges.pipe(startWith(pvTypeCvCtrl.value)),
      this.surveyForm!.get('compartment_type.manlidFormGroup.pv_type_pcs')!.valueChanges.pipe(startWith(pvTypePcsCtrl.value)),
      this.surveyForm!.get('compartment_type.manlidFormGroup.pv_spec_cv')!.valueChanges.pipe(startWith(pvSpecCvCtrl.value)),
      this.surveyForm!.get('compartment_type.manlidFormGroup.pv_spec_pcs')!.valueChanges.pipe(startWith(pvSpecPcsCtrl.value))
    )
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        tap(() => {
          const pvTypeValue = pvTypeCvCtrl.value;
          const pvTypePcsValue = pvTypePcsCtrl.value;
          const pvSpecValue = pvSpecCvCtrl.value;
          const pvSpecPcsValue = pvSpecPcsCtrl.value;

          if (pvTypeValue?.length || pvTypePcsValue || pvSpecValue?.length || pvSpecPcsValue) {
            pvTypeCvCtrl.setValidators([Validators.required]);
            pvTypePcsCtrl.setValidators([Validators.required]);
            pvSpecCvCtrl.setValidators([Validators.required]);
            pvSpecPcsCtrl.setValidators([Validators.required]);
          } else {
            pvTypeCvCtrl.clearValidators();
            pvTypePcsCtrl.clearValidators();
            pvSpecCvCtrl.clearValidators();
            pvSpecPcsCtrl.clearValidators();
          }

          setTimeout(() => {
            pvTypeCvCtrl.updateValueAndValidity({ emitEvent: false });
            pvTypePcsCtrl.updateValueAndValidity({ emitEvent: false });
            pvSpecCvCtrl.updateValueAndValidity({ emitEvent: false });
            pvSpecPcsCtrl.updateValueAndValidity({ emitEvent: false });
            this.detectChanges();
          });
        })
      )
      .subscribe();
  }

  getCustomerBufferPackage(customer_company_guid: string | undefined) {
    if (!customer_company_guid) return;
    const where = {
      and: [
        { customer_company_guid: { eq: customer_company_guid } }
      ]
    }
    this.subs.sink = this.pbDS.getCustomerPackageCost(where).subscribe(data => {
      if (data?.length > 0) {
        this.packageBufferList = data;
      }
    });
  }

  populateOutGateForm(og: OutGateItem, tankInfo: TankInfoItem): void {
    this.surveyForm?.patchValue({
      tank_details: {
        unit_type_guid: og.tank?.unit_type_guid || tankInfo.unit_type_guid,
        owner: og.tank?.customer_company || tankInfo.customer_company,
        owner_guid: og.tank?.owner_guid || tankInfo.owner_guid,
        manufacturer_cv: og.out_gate_survey?.manufacturer_cv || tankInfo.manufacturer_cv,
        dom_dt: Utility.convertDate(og.out_gate_survey?.dom_dt || tankInfo.dom_dt),
        cladding_cv: og.out_gate_survey?.cladding_cv || tankInfo.cladding_cv,
        capacity: og.out_gate_survey?.capacity || tankInfo.capacity,
        tare_weight: og.out_gate_survey?.tare_weight || tankInfo.tare_weight,
        max_weight_cv: og.out_gate_survey?.max_weight_cv || tankInfo.max_weight_cv,
        height_cv: og.out_gate_survey?.height_cv || tankInfo.height_cv,
        walkway_cv: og.out_gate_survey?.walkway_cv || tankInfo.walkway_cv,
        tank_comp_guid: og.out_gate_survey?.tank_comp_guid || tankInfo.tank_comp_guid,
        comments: og.out_gate_survey?.comments,
      },
      periodic_test: {
        last_test_cv: og.out_gate_survey?.last_test_cv || tankInfo.last_test_cv,
        next_test_cv: og.out_gate_survey?.next_test_cv || tankInfo.next_test_cv,
        test_class_cv: og.out_gate_survey?.test_class_cv || tankInfo.test_class_cv,
        test_dt: Utility.convertDate(og.out_gate_survey?.test_dt || tankInfo.test_dt),
      },
      out_gate_details: {
        vehicle_no: og.vehicle_no,
        driver_name: og.driver_name,
        haulier: og?.tank?.release_order_sot?.[0].release_order?.haulier,
        in_gate_remarks: og.remarks,
      },
      frame_type: {
        leftRemarks: og.out_gate_survey?.left_remarks,
        rearRemarks: og.out_gate_survey?.rear_remarks,
        rightRemarks: og.out_gate_survey?.right_remarks,
        topRemarks: og.out_gate_survey?.top_remarks,
        frontRemarks: og.out_gate_survey?.front_remarks,
        bottomRemarks: og.out_gate_survey?.bottom_remarks,
      },
      compartment_type: {
        bottomFormGroup: {
          btm_dis_comp_cv: this.patchStringToArrayValue(og.out_gate_survey?.btm_dis_comp_cv),
          btm_dis_valve_cv: this.patchStringToArrayValue(og.out_gate_survey?.btm_dis_valve_cv),
          btm_dis_valve_oth: og.out_gate_survey?.btm_dis_valve_oth,
          btm_dis_valve_spec_cv: this.patchStringToArrayValue(og.out_gate_survey?.btm_dis_valve_spec_cv),
          btm_dis_valve_spec_oth: og.out_gate_survey?.btm_dis_valve_spec_oth,
          foot_valve_cv: this.patchStringToArrayValue(og.out_gate_survey?.foot_valve_cv),
          foot_valve_oth: og.out_gate_survey?.foot_valve_oth,
          btm_valve_brand_cv: og.out_gate_survey?.btm_valve_brand_cv,
          thermometer: og.out_gate_survey?.thermometer,
          thermometer_cv: this.patchStringToArrayValue(og.out_gate_survey?.thermometer_cv),
          ladder: og.out_gate_survey?.ladder,
          data_csc_transportplate: og.out_gate_survey?.data_csc_transportplate
        },
        topFormGroup: {
          top_dis_comp_cv: this.patchStringToArrayValue(og.out_gate_survey?.top_dis_comp_cv),
          top_dis_valve_cv: this.patchStringToArrayValue(og.out_gate_survey?.top_dis_valve_cv),
          top_dis_valve_oth: og.out_gate_survey?.top_dis_valve_oth,
          top_dis_valve_spec_cv: this.patchStringToArrayValue(og.out_gate_survey?.top_dis_valve_spec_cv),
          top_dis_valve_spec_oth: og.out_gate_survey?.top_dis_valve_spec_oth,
          top_valve_brand_cv: og.out_gate_survey?.top_valve_brand_cv,
          airline_valve_cv: this.patchStringToArrayValue(og.out_gate_survey?.airline_valve_cv),
          airline_valve_oth: og.out_gate_survey?.airline_valve_oth,
          airline_valve_pcs: og.out_gate_survey?.airline_valve_pcs,
          airline_valve_dim: og.out_gate_survey?.airline_valve_dim,
          airline_valve_conn_cv: this.patchStringToArrayValue(og.out_gate_survey?.airline_valve_conn_cv),
          airline_valve_conn_oth: og.out_gate_survey?.airline_valve_conn_oth,
          airline_valve_conn_spec_cv: this.patchStringToArrayValue(og.out_gate_survey?.airline_valve_conn_spec_cv),
          airline_valve_conn_spec_oth: og.out_gate_survey?.airline_valve_conn_spec_oth,
        },
        manlidFormGroup: {
          manlid_comp_cv: this.patchStringToArrayValue(og.out_gate_survey?.manlid_comp_cv),
          manlid_cover_cv: this.patchStringToArrayValue(og.out_gate_survey?.manlid_cover_cv),
          manlid_cover_oth: og.out_gate_survey?.manlid_cover_oth,
          manlid_cover_pcs: og.out_gate_survey?.manlid_cover_pcs,
          manlid_cover_pts: og.out_gate_survey?.manlid_cover_pts,
          manlid_seal_cv: this.patchStringToArrayValue(og.out_gate_survey?.manlid_seal_cv),
          pv_type_cv: this.patchStringToArrayValue(og.out_gate_survey?.pv_type_cv),
          pv_type_pcs: og.out_gate_survey?.pv_type_pcs,
          pv_spec_cv: this.patchStringToArrayValue(og.out_gate_survey?.pv_spec_cv),
          pv_spec_pcs: og.out_gate_survey?.pv_spec_pcs,
          safety_handrail: og.out_gate_survey?.safety_handrail,
          buffer_plate: og.out_gate_survey?.buffer_plate,
          residue: og.out_gate_survey?.residue,
          dipstick: og.out_gate_survey?.dipstick,
        }
      },
    });
    this.highlightedCellsLeft = this.populateHighlightedCells(this.highlightedCellsLeft, JSON.parse(og.out_gate_survey?.left_coord || '[]'));
    this.highlightedCellsRear = this.populateHighlightedCells(this.highlightedCellsRear, JSON.parse(og.out_gate_survey?.rear_coord || '[]'));
    this.highlightedCellsRight = this.populateHighlightedCells(this.highlightedCellsRight, JSON.parse(og.out_gate_survey?.right_coord || '[]'));
    this.populateTopSideCells(JSON.parse(og.out_gate_survey?.top_coord || '{}'));
    this.highlightedCellsFront = this.populateHighlightedCells(this.highlightedCellsFront, JSON.parse(og.out_gate_survey?.front_coord || '[]'));
    this.highlightedCellsBottom = this.populateHighlightedCells(this.highlightedCellsBottom, JSON.parse(og.out_gate_survey?.bottom_coord || '[]'));
    this.detectChanges();
  }

  getImages() {
    const images: any[] = [];
    images.push(this.surveyForm?.get('frame_type.leftImage')?.get('preview')?.value);
    images.push(this.surveyForm?.get('frame_type.rearImage')?.get('preview')?.value);
    images.push(this.surveyForm?.get('frame_type.rightImage')?.get('preview')?.value);
    images.push(this.surveyForm?.get('frame_type.topImage')?.get('preview')?.value);
    images.push(this.surveyForm?.get('frame_type.frontImage')?.get('preview')?.value);
    images.push(this.surveyForm?.get('frame_type.bottomImage')?.get('preview')?.value);

    this.dmgImages().controls.forEach(x => {
      images.push(x?.get('preview')?.value)
    })

    return images;
  }

  populateHighlightedCells(toUpdateCells: boolean[], coordinates: { x: number; y: number }[]): boolean[] {
    if (!Array.isArray(coordinates)) {
      return [];
    }
    toUpdateCells = Array(this.rowSize * this.colSize).fill(false);

    coordinates.forEach(coord => {
      const index = coord.y * this.colSize + coord.x;
      toUpdateCells[index] = true;
    });
    return toUpdateCells;
  }

  populateHighlightedCellsWithoutReset(toUpdateCells: boolean[], coordinates: { x: number; y: number }[]): boolean[] {
    if (!Array.isArray(coordinates)) {
      return [];
    }
    coordinates.forEach(coord => {
      const index = coord.y * this.colSize + coord.x;
      toUpdateCells[index] = true;
    });
    return toUpdateCells;
  }

  populateTopSideCells(topCoord: any) {
    const dmg = topCoord.dmg
    const walkwayTop = topCoord.walkwayTop
    const walkwayMiddle = topCoord.walkwayMiddle
    const walkwayBottom = topCoord.walkwayBottom

    this.highlightedCellsTop = this.populateHighlightedCells(this.highlightedCellsTop, dmg);

    this.highlightedCellsWalkwayTop = this.populateHighlightedCellsWithoutReset(this.highlightedCellsWalkwayTop, walkwayTop);
    this.highlightedCellsWalkwayMiddle = this.populateHighlightedCellsWithoutReset(this.highlightedCellsWalkwayMiddle, walkwayMiddle);
    this.highlightedCellsWalkwayBottom = this.populateHighlightedCellsWithoutReset(this.highlightedCellsWalkwayBottom, walkwayBottom);
  }

  populateImages(files: any[]) {
    const dmgImg = files.filter(file => file.description.includes("DMG"));
    const leftImg = files.filter(file => file.description === 'LEFT_SIDE');
    const rearImg = files.filter(file => file.description === 'REAR_SIDE');
    const rightImg = files.filter(file => file.description === 'RIGHT_SIDE');
    const topImg = files.filter(file => file.description === 'TOP_SIDE');
    const frontImg = files.filter(file => file.description === 'FRONT_SIDE');
    const bottomImg = files.filter(file => file.description === 'BOTTOM_SIDE');
    dmgImg.forEach(dmgFile => {
      this.dmgImages().push(this.createImageForm(dmgFile.description.replace('_DMG', ''), dmgFile.url, undefined));
    });
    this.surveyForm!.patchValue({
      leftImage: this.patchOrCreateImageForm('LEFT_SIDE', leftImg, this.surveyForm?.get('frame_type.leftImage')),
      rearImage: this.patchOrCreateImageForm('REAR_SIDE', rearImg, this.surveyForm?.get('frame_type.rearImage')),
      rightImage: this.patchOrCreateImageForm('RIGHT_SIDE', rightImg, this.surveyForm?.get('frame_type.rightImage')),
      topImage: this.patchOrCreateImageForm('TOP_SIDE', topImg, this.surveyForm?.get('frame_type.topImage')),
      frontImage: this.patchOrCreateImageForm('FRONT_SIDE', frontImg, this.surveyForm?.get('frame_type.frontImage')),
      bottomImage: this.patchOrCreateImageForm('BOTTOM_SIDE', bottomImg, this.surveyForm?.get('frame_type.bottomImage'))
    });
    this.detectChanges();
  }

  // export table data in excel file
  exportExcel() {
    // key name with space add in brackets
    // const exportData: Partial<TableElement>[] =
    //   this.dataSource.filteredData.map((x) => ({
    //     'First Name': x.fName,
    //     'Last Name': x.lName,
    //     Email: x.email,
    //     Gender: x.gender,
    //     'Birth Date': formatDate(new Date(x.bDate), 'yyyy-MM-dd', 'en') || '',
    //     Mobile: x.mobile,
    //     Address: x.address,
    //     Country: x.country,
    //   }));

    // TableExportUtil.exportToExcel(exportData, 'excel');
  }

  compartmentTypeFormCheck(): any[] {
    const compartmentTypeFormChecks = [];

    const bottomFormGroup = this.getBottomFormGroup();
    if (!(bottomFormGroup.get('btm_dis_comp_cv')?.value?.length || bottomFormGroup.get('btm_dis_valve_cv')?.value?.length
      || bottomFormGroup.get('btm_dis_valve_spec_cv')?.value?.length || bottomFormGroup.get('foot_valve_cv')?.value?.length
      || bottomFormGroup.get('btm_valve_brand_cv')?.value || bottomFormGroup.get('thermometer')?.value
      || bottomFormGroup.get('thermometer_cv')?.value?.length || bottomFormGroup.get('ladder')?.value
      || bottomFormGroup.get('data_csc_transportplate')?.value)) {
      compartmentTypeFormChecks.push(this.translatedLangText.COMPARTMENT_TYPE_BTM_EMPTY);
    }

    const topFormGroup = this.getTopFormGroup();
    if (!(topFormGroup.get('top_dis_comp_cv')?.value?.length || topFormGroup.get('top_dis_valve_cv')?.value?.length
      || topFormGroup.get('top_dis_valve_spec_cv')?.value?.length || topFormGroup.get('top_valve_brand_cv')?.value
      || topFormGroup.get('airline_valve_cv')?.value?.length || topFormGroup.get('airline_valve_pcs')?.value
      || topFormGroup.get('airline_valve_dim')?.value || topFormGroup.get('airline_valve_conn_cv')?.value?.length
      || topFormGroup.get('airline_valve_conn_spec_cv')?.value?.length)) {
      compartmentTypeFormChecks.push(this.translatedLangText.COMPARTMENT_TYPE_TOP_EMPTY);
    }

    const manlidFormGroup = this.getManlidFormGroup();
    if (!(manlidFormGroup.get('manlid_comp_cv')?.value?.length || manlidFormGroup.get('manlid_cover_cv')?.value?.length
      || manlidFormGroup.get('manlid_cover_pcs')?.value || manlidFormGroup.get('manlid_cover_pts')?.value
      || manlidFormGroup.get('manlid_seal_cv')?.value?.length || manlidFormGroup.get('pv_type_cv')?.value?.length
      || manlidFormGroup.get('pv_type_pcs')?.value || manlidFormGroup.get('pv_spec_cv')?.value?.length
      || manlidFormGroup.get('pv_spec_pcs')?.value || manlidFormGroup.get('safety_handrail')?.value
      || manlidFormGroup.get('buffer_plate')?.value || manlidFormGroup.get('residue')?.value
      || manlidFormGroup.get('dipstick')?.value)) {
      compartmentTypeFormChecks.push(this.translatedLangText.COMPARTMENT_TYPE_MANLID_EMPTY);
    }

    return compartmentTypeFormChecks;
  }

  onSubmitCheck(event: Event) {
    this.preventDefault(event);  // Prevents the form submission
    const compartmentTypeFormChecks = this.compartmentTypeFormCheck();

    if (compartmentTypeFormChecks.length) {
      let tempDirection: Direction;
      if (localStorage.getItem('isRtl') === 'true') {
        tempDirection = 'rtl';
      } else {
        tempDirection = 'ltr';
      }
      const dialogRef = this.dialog.open(EmptyFormConfirmationDialogComponent, {
        width: '500px',
        data: {
          action: 'edit',
          translatedLangText: this.translatedLangText,
          confirmForm: compartmentTypeFormChecks
        },
        direction: tempDirection
      });
      this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
        if (result?.confirmed) {
          this.onFormSubmit();
        }
      });
    } else {
      this.onFormSubmit();
    }
  }

  onFormSubmit() {
    if (this.surveyForm?.valid) {
      let sot: StoringOrderTank = new StoringOrderTank(this.out_gate?.tank);
      sot.unit_type_guid = this.surveyForm.get('tank_details.unit_type_guid')?.value;
      sot.owner_guid = this.surveyForm.get('tank_details.owner_guid')?.value;

      let og: any = new OutGateGO(this.out_gate!);
      og.out_gate_survey = undefined;
      og.vehicle_no = this.surveyForm.get('out_gate_details.vehicle_no')?.value?.toUpperCase();
      og.driver_name = this.surveyForm.get('out_gate_details.driver_name')?.value?.toUpperCase();
      og.haulier = this.surveyForm.get('out_gate_details.haulier')?.value?.toUpperCase();
      og.remarks = this.surveyForm.get('out_gate_details.in_gate_remarks')?.value;
      og.tank = sot;
      og.release_order = new ReleaseOrderGO(this.out_gate?.tank?.release_order_sot?.[0]?.release_order);
      og.out_gate_survey = undefined;
      og.in_gate_survey = undefined;

      const periodicTestFormGroup = this.getBottomFormGroup();
      let ogs: OutGateSurveyGO = new OutGateSurveyGO(this.out_gate?.out_gate_survey);
      ogs.guid = this.out_gate?.out_gate_survey?.guid;
      ogs.out_gate_guid = this.out_gate?.out_gate_survey?.out_gate_guid || this.out_gate?.guid;
      ogs.last_test_cv = this.surveyForm.get('periodic_test.last_test_cv')?.value;
      ogs.next_test_cv = this.surveyForm.get('periodic_test.next_test_cv')?.value;
      ogs.test_dt = Utility.convertDate(this.surveyForm.get('periodic_test.test_dt')?.value);
      ogs.test_class_cv = this.surveyForm.get('periodic_test.test_class_cv')?.value;
      ogs.manufacturer_cv = this.surveyForm.get('tank_details.manufacturer_cv')?.value;
      ogs.dom_dt = Utility.convertDate(this.surveyForm.get('tank_details.dom_dt')?.value);
      ogs.cladding_cv = this.surveyForm.get('tank_details.cladding_cv')?.value;
      ogs.capacity = this.surveyForm.get('tank_details.capacity')?.value;
      ogs.tare_weight = this.surveyForm.get('tank_details.tare_weight')?.value;
      ogs.max_weight_cv = this.surveyForm.get('tank_details.max_weight_cv')?.value;
      ogs.height_cv = this.surveyForm.get('tank_details.height_cv')?.value;
      ogs.walkway_cv = this.surveyForm.get('tank_details.walkway_cv')?.value;
      ogs.tank_comp_guid = this.surveyForm.get('tank_details.tank_comp_guid')?.value;
      ogs.comments = this.surveyForm.get('tank_details.comments')?.value;

      const bottomFormGroup = this.getBottomFormGroup();
      ogs.btm_dis_comp_cv = bottomFormGroup.get('btm_dis_comp_cv')?.value?.[0];
      ogs.btm_dis_valve_cv = bottomFormGroup.get('btm_dis_valve_cv')?.value?.[0];
      ogs.btm_dis_valve_oth = bottomFormGroup.get('btm_dis_valve_oth')?.value;
      ogs.btm_dis_valve_spec_cv = bottomFormGroup.get('btm_dis_valve_spec_cv')?.value?.[0];
      ogs.btm_dis_valve_spec_oth = bottomFormGroup.get('btm_dis_valve_spec_oth')?.value;
      ogs.foot_valve_cv = bottomFormGroup.get('foot_valve_cv')?.value?.[0];
      ogs.foot_valve_oth = bottomFormGroup.get('foot_valve_oth')?.value;
      // ogs.btm_valve_brand_cv = bottomFormGroup.get('btm_valve_brand_cv')?.value?.[0];
      ogs.thermometer = bottomFormGroup.get('thermometer')?.value;
      ogs.thermometer_cv = bottomFormGroup.get('thermometer_cv')?.value?.[0];
      ogs.ladder = bottomFormGroup.get('ladder')?.value;
      ogs.data_csc_transportplate = bottomFormGroup.get('data_csc_transportplate')?.value;

      const topFormGroup = this.getTopFormGroup();
      ogs.top_dis_comp_cv = topFormGroup.get('top_dis_comp_cv')?.value?.[0];
      ogs.top_dis_valve_cv = topFormGroup.get('top_dis_valve_cv')?.value?.[0];
      ogs.top_dis_valve_oth = topFormGroup.get('top_dis_valve_oth')?.value;
      ogs.top_dis_valve_spec_cv = topFormGroup.get('top_dis_valve_spec_cv')?.value?.[0];
      ogs.top_dis_valve_spec_oth = topFormGroup.get('top_dis_valve_spec_oth')?.value;
      // ogs.top_valve_brand_cv = topFormGroup.get('top_valve_brand_cv')?.value;
      ogs.airline_valve_cv = topFormGroup.get('airline_valve_cv')?.value?.[0];
      ogs.airline_valve_oth = topFormGroup.get('airline_valve_oth')?.value;
      ogs.airline_valve_pcs = topFormGroup.get('airline_valve_pcs')?.value;
      ogs.airline_valve_dim = topFormGroup.get('airline_valve_dim')?.value;
      ogs.airline_valve_conn_cv = topFormGroup.get('airline_valve_conn_cv')?.value?.[0];
      ogs.airline_valve_conn_oth = topFormGroup.get('airline_valve_conn_oth')?.value;
      ogs.airline_valve_conn_spec_cv = topFormGroup.get('airline_valve_conn_spec_cv')?.value?.[0];
      ogs.airline_valve_conn_spec_oth = topFormGroup.get('airline_valve_conn_spec_oth')?.value;

      const manlidFormGroup = this.getManlidFormGroup();
      ogs.manlid_comp_cv = manlidFormGroup.get('manlid_comp_cv')?.value?.[0];
      ogs.manlid_cover_cv = manlidFormGroup.get('manlid_cover_cv')?.value?.[0];
      ogs.manlid_cover_oth = manlidFormGroup.get('manlid_cover_oth')?.value;
      ogs.manlid_cover_pcs = manlidFormGroup.get('manlid_cover_pcs')?.value;
      ogs.manlid_cover_pts = manlidFormGroup.get('manlid_cover_pts')?.value;
      ogs.manlid_seal_cv = manlidFormGroup.get('manlid_seal_cv')?.value?.[0];
      ogs.pv_type_cv = manlidFormGroup.get('pv_type_cv')?.value?.[0];
      ogs.pv_type_pcs = manlidFormGroup.get('pv_type_pcs')?.value;
      ogs.pv_spec_cv = manlidFormGroup.get('pv_spec_cv')?.value?.[0];
      ogs.pv_spec_pcs = manlidFormGroup.get('pv_spec_pcs')?.value;
      ogs.safety_handrail = manlidFormGroup.get('safety_handrail')?.value;
      ogs.buffer_plate = manlidFormGroup.get('buffer_plate')?.value;
      ogs.residue = manlidFormGroup.get('residue')?.value;
      ogs.dipstick = manlidFormGroup.get('dipstick')?.value;

      ogs.left_coord = JSON.stringify(this.getHighlightedCoordinates(this.highlightedCellsLeft));
      ogs.rear_coord = JSON.stringify(this.getHighlightedCoordinates(this.highlightedCellsRear));
      ogs.right_coord = JSON.stringify(this.getHighlightedCoordinates(this.highlightedCellsRight));
      ogs.top_coord = JSON.stringify(this.getTopCoordinates());
      ogs.front_coord = JSON.stringify(this.getHighlightedCoordinates(this.highlightedCellsFront));
      ogs.bottom_coord = JSON.stringify(this.getHighlightedCoordinates(this.highlightedCellsBottom));
      ogs.left_remarks = this.surveyForm.get('frame_type.leftRemarks')?.value;
      ogs.rear_remarks = this.surveyForm.get('frame_type.rearRemarks')?.value;
      ogs.right_remarks = this.surveyForm.get('frame_type.rightRemarks')?.value
      ogs.top_remarks = this.surveyForm.get('frame_type.topRemarks')?.value;
      ogs.front_remarks = this.surveyForm.get('frame_type.frontRemarks')?.value;
      ogs.bottom_remarks = this.surveyForm.get('frame_type.bottomRemarks')?.value;
      console.log('ogs Value', ogs);
      console.log('og Value', og);
      if (ogs.guid) {
        this.ogsDS.updateOutGateSurvey(ogs, og).subscribe(result => {
          console.log(result)
          if (result?.data?.updateOutGateSurvey) {
            this.uploadImages(ogs.guid!);
          }
        });
      } else {
        this.ogsDS.addOutGateSurvey(ogs, og).subscribe(result => {
          console.log(result)
          const record = result.data.record
          if (record?.affected) {
            this.uploadImages(record.guid[0]);
          }
        });
      }
    } else {
      console.log('Invalid soForm', this.surveyForm?.value);
      this.markFormGroupTouched(this.surveyForm);
    }
  }

  onPublishCheck(event: Event) {
    this.preventDefault(event);  // Prevents the form submission
    if (this.surveyForm?.valid && this.getTopFormGroup()?.valid && this.getBottomFormGroup()?.valid && this.getManlidFormGroup()?.valid) {
      const compartmentTypeFormChecks = this.compartmentTypeFormCheck();
      let tempDirection: Direction;
      if (localStorage.getItem('isRtl') === 'true') {
        tempDirection = 'rtl';
      } else {
        tempDirection = 'ltr';
      }
      const dialogRef = this.dialog.open(EmptyFormConfirmationDialogComponent, {
        width: '500px',
        data: {
          action: 'publish',
          translatedLangText: this.translatedLangText,
          confirmForm: compartmentTypeFormChecks
        },
        direction: tempDirection
      });
      this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
        if (result?.confirmed) {
          this.onPublish();
        }
      });
    } else {
      console.log('Invalid soForm', this.surveyForm?.value);
      this.markFormGroupTouched(this.surveyForm);
    }
  }

  onPublish() {
    if (this.out_gate) {
      const outGateRequest: any = new OutGate(this.out_gate);
      outGateRequest.tank = new StoringOrderTank(this.out_gate?.tank)
      outGateRequest.out_gate_survey = new OutGateSurveyGO(this.out_gate?.out_gate_survey)
      console.log('publishOutGateSurvey: ', outGateRequest)
      this.ogDS.publishOutGateSurvey(outGateRequest).subscribe(result => {
        console.log(result)
        this.handleSaveSuccess(result.data?.publishOutGateSurvey)
        this.router.navigate(['/admin/inventory/out-gate-main'], { queryParams: { tabIndex: this.tabIndex } });
      });
    }
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

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  displayDateTime(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateTimeStr(input);
  }

  displayDate(input: Date): string {
    return Utility.convertDateToStr(input);
  }

  startDrawing(highlightedCells: boolean[], event: MouseEvent | TouchEvent): void {
    this.isDrawing = true;
    event.preventDefault(); // Prevent default dragging behavior
    const target = this.getEventTarget(event) as HTMLElement;
    const dataIndex = target?.getAttribute('data-index');
    if (dataIndex !== null) {
      const cellIndex = +dataIndex;
      this.toggleState = !highlightedCells[cellIndex]; // Set initial toggle state based on cell's current state
      this.highlightCell(highlightedCells, event);
    }
  }

  startDrawingWalkway(highlightedCells: boolean[], damageCells: boolean[], event: MouseEvent | TouchEvent): void {
    this.isDrawing = true;
    event.preventDefault(); // Prevent default dragging behavior
    const target = this.getEventTarget(event) as HTMLElement;
    const dataIndex = target?.getAttribute('data-index');
    if (dataIndex !== null) {
      const cellIndex = +dataIndex;
      this.toggleState = !highlightedCells[cellIndex]; // Set initial toggle state based on cell's current state
      this.highlightCellWalkway(highlightedCells, damageCells, event);
    }
  }

  draw(highlightedCells: boolean[], event: MouseEvent | TouchEvent): void {
    if (this.isDrawing) {
      this.highlightCell(highlightedCells, event);
    }
  }

  drawWalkway(highlightedCells: boolean[], damageCells: boolean[], event: MouseEvent | TouchEvent): void {
    if (this.isDrawing) {
      this.highlightCellWalkway(highlightedCells, damageCells, event);
    }
  }

  stopDrawing(): void {
    this.isDrawing = false;
  }

  highlightCell(highlightedCells: boolean[], event: MouseEvent | TouchEvent): void {
    const target = this.getEventTarget(event) as HTMLElement;
    const dataIndex = target?.getAttribute('data-index');
    if (dataIndex !== null) {
      const cellIndex = +dataIndex;
      highlightedCells[cellIndex] = this.toggleState;
    }
  }

  highlightCellWalkway(highlightedCells: boolean[], damageCells: boolean[], event: MouseEvent | TouchEvent): void {
    const target = this.getEventTarget(event) as HTMLElement;
    const dataIndex = target?.getAttribute('data-index');
    if (dataIndex !== null) {
      const cellIndex = +dataIndex;
      highlightedCells[cellIndex] = this.toggleState;

      // Apply damage overlay if checkbox is selected
      if (this.isMarkDmg && this.toggleState) {
        damageCells[cellIndex] = true;
      } else {
        damageCells[cellIndex] = false;
      }
    }
  }

  resetHighlightedCells(highlightedCells: boolean[]): void {
    highlightedCells.fill(false);
  }

  resetTopHighlightedCells(): void {
    this.resetHighlightedCells(this.highlightedCellsTop);
    this.resetHighlightedCells(this.highlightedCellsWalkwayTop);
    this.resetHighlightedCells(this.highlightedCellsWalkwayMiddle);
    this.resetHighlightedCells(this.highlightedCellsWalkwayBottom);
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

  isDisabledRect(index: number): boolean {
    return index === 20 || index === 36 || index === 172 || index === 188;
  }

  isDisabledSquare(index: number): boolean {
    return index === 12 || index === 13 || index === 19 || index === 20 || index === 23 || index === 31 || index === 89 || index === 97 || index === 100 || index === 101 || index === 107 || index === 108;
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
          this.detectChanges();
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
          this.dmgImages().push(this.createImageForm('', preview, file));
          this.detectChanges();
        };
        reader.readAsDataURL(file);
      });
    }
    input.value = '';
  }

  editRemarks(event: Event, remarksTitle: string, remarksValue: any) {
    this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        remarksTitle: remarksTitle,
        previousRemarks: remarksValue.value,
        action: 'edit',
        translatedLangText: this.translatedLangText,
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        remarksValue.setValue(result.remarks);
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
          this.detectChanges();
          this.handleDeleteSuccess(1);
        } else if (Utility.isUrl(url)) {
          this.fileManagerService.deleteFile([url]).subscribe({
            next: (response) => {
              console.log('Files delete successfully:', response);
              imgForm.patchValue({
                preview: ''
              });
              this.detectChanges();
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

  deleteDialogDmgImg(imgForm: any, index: number, event: Event) {
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
          this.dmgImages().removeAt(index);
          this.detectChanges();
          this.handleDeleteSuccess(1);
        } else if (Utility.isUrl(url)) {
          this.fileManagerService.deleteFile([url]).subscribe({
            next: (response) => {
              console.log('Files delete successfully:', response);
              this.dmgImages().removeAt(index);
              this.detectChanges();
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

  previewImageDialog(previewImage: any, event: Event, isDmg: any = false) {
    event.preventDefault(); // Prevents the form submission

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const headerText = this.getTankSideDescription(previewImage.get('side')?.value);
    const dialogRef = this.dialog.open(PreviewImageDialogComponent, {
      data: {
        headerText: isDmg ? `${this.translatedLangText.DAMAGE_PHOTOS} - ${headerText}` : `${this.translatedLangText.TANK_PHOTOS} - ${headerText}`,
        previewImage: previewImage.get('preview')?.value,
      },
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
        previewImages: this.getImages(),
        focusIndex: index
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    });
  }

  resetDialog(highlightedCells: boolean[], event: Event, isTop: boolean = false) {
    event.preventDefault(); // Prevents the form submission

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        headerText: this.translatedLangText.CONFIRM_RESET,
        action: 'new',
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result.action === 'confirmed') {
        if (isTop) {
          this.resetTopHighlightedCells()
        } else {
          this.resetHighlightedCells(highlightedCells);
        }
        this.detectChanges();
      }
    });
  }

  uploadImages(guid: string) {
    const leftImg = this.surveyForm?.get('frame_type.leftImage')?.value;
    const rearImg = this.surveyForm?.get('frame_type.rearImage')?.value;
    const rightImg = this.surveyForm?.get('frame_type.rightImage')?.value;
    const topImg = this.surveyForm?.get('frame_type.topImage')?.value;
    const frontImg = this.surveyForm?.get('frame_type.frontImage')?.value;
    const bottomImg = this.surveyForm?.get('frame_type.bottomImage')?.value;

    const additionalImages = [leftImg, rearImg, rightImg, topImg, frontImg, bottomImg].filter(image => image.file);

    const additionalMetadata = additionalImages.map(image => {
      return {
        file: image.file, // The actual file object
        metadata: {
          TableName: 'in_gate_survey',
          FileType: 'img',
          GroupGuid: guid,
          Description: image.side // Use the side as description
        }
      };
    });

    const dmgImages = this.dmgImages().controls
      .filter(preview => preview.get('file')?.value)
      .map(preview => {
        const file = preview.get('file')?.value;
        return {
          file: file, // The actual file object
          metadata: {
            TableName: 'in_gate_survey',
            FileType: 'img',
            GroupGuid: guid,
            Description: 'DMG' // Use the file name or custom description
          }
        };
      });
    const allImages = dmgImages.concat(additionalMetadata);
    // Call the FileManagerService to upload files
    if (allImages.length) {
      this.fileManagerService.uploadFiles(allImages).subscribe({
        next: (response) => {
          console.log('Files uploaded successfully:', response);
          this.handleSaveSuccess(response?.affected);
        },
        error: (error) => {
          console.error('Error uploading files:', error);
          this.handleSaveError();
        },
        complete: () => {
          console.log('Upload process completed.');
          this.router.navigate(['/admin/inventory/out-gate-main'], { queryParams: { tabIndex: this.tabIndex } });
        }
      });
    } else {
      this.handleSaveSuccess(1);
      this.router.navigate(['/admin/inventory/out-gate-main'], { queryParams: { tabIndex: this.tabIndex } });
    }
  }

  canPublish() {
    return this.out_gate?.out_gate_survey?.guid;
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.surveyForm!.get('periodic_test.test_dt')!.value ? moment(this.surveyForm!.get('periodic_test.test_dt')!.value) : moment();
    ctrlValue.year(normalizedYear.year()).date(1);
    this.surveyForm!.get('periodic_test.test_dt')!.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: any) {
    const ctrlValue = this.surveyForm!.get('periodic_test.test_dt')!.value ? moment(this.surveyForm!.get('periodic_test.test_dt')!.value) : moment();
    ctrlValue.month(normalizedMonth.month()).year(normalizedMonth.year()).date(1);
    this.surveyForm!.get('periodic_test.test_dt')!.setValue(ctrlValue);
    this.getNextTest();
    datepicker.close();
  }

  selectMarkDmg() {
    this.isMarkDmg = !this.isMarkDmg;
  }

  getLastTest(): string | undefined {
    if ((this.surveyForm!.get('periodic_test.last_test_cv')!.value) &&
      (this.surveyForm!.get('periodic_test.test_class_cv')!.value) &&
      (this.surveyForm!.get('periodic_test.test_dt')!.value)) {
      const test_type = this.surveyForm!.get('periodic_test.last_test_cv')!.value;
      const test_class = this.surveyForm!.get('periodic_test.test_class_cv')!.value;
      const testDt = Utility.convertDate(this.surveyForm!.get('periodic_test.test_dt')!.value) as number;
      return this.getTestTypeDescription(test_type) + " - " + Utility.convertEpochToDateStr(testDt, 'MM/YYYY') + " - " + this.getTestClassDescription(test_class);
    }
    return "";
  }

  getNextTest(): string | undefined {
    if ((this.surveyForm!.get('periodic_test.last_test_cv')!.value || this.out_gate?.out_gate_survey?.last_test_cv) &&
      (this.surveyForm!.get('periodic_test.test_dt')!.value || this.out_gate?.out_gate_survey?.test_dt)) {
      const test_type = this.surveyForm!.get('periodic_test.last_test_cv')!.value || this.out_gate?.out_gate_survey?.last_test_cv;
      const match = test_type.match(/^[0-9]*\.?[0-9]+/);
      // const yearCount = parseFloat(match[0]);
      const yearCount = 2.5;
      const testDt = Utility.convertDate(this.surveyForm!.get('periodic_test.test_dt')!.value) as number || this.out_gate?.out_gate_survey?.test_dt as number;
      const resultDt = Utility.addYearsToEpoch(testDt, yearCount);
      const mappedVal = BusinessLogicUtil.getTestTypeMapping(test_type);
      this.surveyForm!.get('periodic_test.next_test_cv')!.setValue(mappedVal);
      return this.getTestTypeDescription(mappedVal) + " - " + Utility.convertEpochToDateStr(resultDt, 'MM/YYYY');
    }
    return "";
  }

  getTestTypeDescription(codeVal: string): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.testTypeCvList);
  }

  getTestClassDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.testClassCvList);
  }

  getTankSideDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.tankSideCvList);
  }

  getTankStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.tankStatusCvList);
  }

  preventDefault(event: Event) {
    event.preventDefault(); // Prevents the form submission
  }

  detectChanges() {
    this.cdr.markForCheck(); // Trigger change detection manually
  }

  onAlphaOnly(event: Event): void {
    Utility.onAlphaOnly(event, this.surveyForm?.get("foot_valve_oth")! ||
      this.surveyForm?.get("btm_dis_valve_oth")! ||
      this.surveyForm?.get("btm_dis_valve_spec_oth") ||
      this.surveyForm?.get("top_dis_valve_oth") ||
      this.surveyForm?.get("top_dis_valve_spec_oth") ||
      this.surveyForm?.get("airline_valve_oth") ||
      this.surveyForm?.get("airline_valve_conn_oth") ||
      this.surveyForm?.get("airline_valve_conn_spec_oth") ||
      this.surveyForm?.get("manlid_cover_oth") ||
      this.surveyForm?.get("airline_valve_conn_oth") ||
      this.surveyForm?.get("airline_valve_conn_oth"));
  }

  patchStringToArrayValue(arrayVal: string | undefined) {
    return Utility.patchStringToArrayValue(arrayVal)
  }
}