import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, FormsModule, ReactiveFormsModule, Validators, UntypedFormArray, FormBuilder } from '@angular/forms';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { NgClass, DatePipe, formatDate, CommonModule } from '@angular/common';
import { NgScrollbar } from 'ngx-scrollbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { UnsubscribeOnDestroyAdapter, TableElement, TableExportUtil } from '@shared';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { Observable, fromEvent } from 'rxjs';
import { map, filter, tap, catchError, finalize, switchMap, debounceTime, startWith } from 'rxjs/operators';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { Utility } from 'app/utilities/utility';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoringOrderDS, StoringOrderItem } from 'app/data-sources/storing-order';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem, addDefaultSelectOption } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from '@angular/material/divider';
import { ComponentUtil } from 'app/utilities/component-util';
import { StoringOrderTank, StoringOrderTankDS, StoringOrderTankGO, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { InGateDS, InGateGO, InGateItem } from 'app/data-sources/in-gate';
import { MatCardModule } from '@angular/material/card';
import { TankDS, TankItem } from 'app/data-sources/tank';
import { MatStepperModule, StepperOrientation } from '@angular/material/stepper';
import { InGateSurveyDS, InGateSurveyGO } from 'app/data-sources/in-gate-survey';
import { MatRadioModule } from '@angular/material/radio';
import { Moment } from 'moment';
import * as moment from 'moment';
import { testTypeMapping } from 'environments/environment.development';
import { FormDialogComponent } from './form-dialog/form-dialog.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { FileManagerService } from '@core/service/filemanager.service';
import { PreviewImageDialogComponent } from '@shared/components/preview-image-dialog/preview-image-dialog.component';
import { PackageBufferDS, PackageBufferItem } from 'app/data-sources/package-buffer';
import { MatTabsModule } from '@angular/material/tabs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { EirFormComponent } from 'app/document-template/pdf/eir-form/eir-form.component';
import { PreviewPdfDialogComponent } from 'app/document-template/pdf/preview-pdf/preview-pdf-dialog.component';
import { TankInfoDS } from 'app/data-sources/tank-info';

@Component({
  selector: 'app-in-gate',
  standalone: true,
  templateUrl: './in-gate-survey-form.component.html',
  styleUrl: './in-gate-survey-form.component.scss',
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
  ]
})
export class InGateSurveyFormComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  pageTitle = 'MENUITEMS.INVENTORY.LIST.IN-GATE-SURVEY-FORM'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT',
    'MENUITEMS.INVENTORY.LIST.IN-GATE-SURVEY'
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
    PHOTOS: 'COMMON-FORM.PHOTOS',
    PUBLISH: 'COMMON-FORM.PUBLISH'
  }

  in_gate_guid: string | null | undefined;
  in_gate: InGateItem | null | undefined;

  surveyForm?: UntypedFormGroup;

  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  igsDS: InGateSurveyDS;
  cvDS: CodeValuesDS;
  tDS: TankDS;
  tiDS: TankInfoDS;
  pbDS: PackageBufferDS;

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
  eirPdf: any;

  stepperOrientation: Observable<StepperOrientation>;
  compTypeStepperOrientation: Observable<StepperOrientation>;

  @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

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
  ) {
    super();
    this.translateLangText();
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.igsDS = new InGateSurveyDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.tDS = new TankDS(this.apollo);
    this.tiDS = new TankInfoDS(this.apollo);
    this.pbDS = new PackageBufferDS(this.apollo);

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

    // this.stepper.selectedIndex = this.calculateInitialStepIndex();
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
        last_release_dt: ['']
      }),
      periodic_test: this.fb.group({
        last_test_cv: [''],
        next_test_cv: [''],
        test_class_cv: [''],
        test_dt: [''],
      }),
      in_gate_details: this.fb.group({
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
          btm_dis_valve_spec_cv: [''],
          foot_valve_cv: [''],
          btm_valve_brand_cv: [''],
          thermometer: [''],
          thermometer_cv: [''],
          ladder: [''],
          data_csc_transportplate: [''],
        }),
        topFormGroup: this.fb.group({
          top_dis_comp_cv: [''],
          top_dis_valve_cv: [''],
          top_dis_valve_spec_cv: [''],
          top_valve_brand_cv: [''],
          airline_valve_cv: [''],
          airline_valve_pcs: [''],
          airline_valve_dim: [''],
          airline_valve_conn_cv: [''],
          airline_valve_conn_spec_cv: [''],
        }),
        manlidFormGroup: this.fb.group({
          manlid_comp_cv: [''],
          manlid_cover_cv: [''],
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
      // last_test_cv: [''], // periodic_test
      // next_test_cv: [''], // periodic_test
      // test_class_cv: [''], // periodic_test
      // test_dt: [''], // periodic_test
      // unit_type_guid: [''], // tank_details
      // owner: this.ownerControl, // tank_details
      // owner_guid: [''], // tank_details
      // manufacturer_cv: [''], // tank_details
      // dom_dt: [''], // tank_details
      // cladding_cv: [''], // tank_details
      // capacity: [''], // tank_details
      // tare_weight: [''], // tank_details
      // max_weight_cv: [''], // tank_details
      // height_cv: [''], // tank_details
      // walkway_cv: [''], // tank_details
      // tank_comp_guid: [''], // tank_details
      // comments: [''], // tank_details
      // vehicle_no: [''], // in_gate_details
      // driver_name: [''], // in_gate_details
      // haulier: [''], // in_gate_details
      // in_gate_remarks: [''], // in_gate_details
      // leftRemarks: [''], // frame_type
      // rearRemarks: [''], // frame_type
      // rightRemarks: [''], // frame_type
      // topRemarks: [''], // frame_type
      // frontRemarks: [''], // frame_type
      // bottomRemarks: [''], // frame_type
      // leftImage: this.createImageForm('LEFT_SIDE', '', undefined), // photos
      // rearImage: this.createImageForm('REAR_SIDE', '', undefined), // photos
      // rightImage: this.createImageForm('RIGHT_SIDE', '', undefined), // photos
      // topImage: this.createImageForm('TOP_SIDE', '', undefined), // photos
      // frontImage: this.createImageForm('FRONT_SIDE', '', undefined), // photos
      // bottomImage: this.createImageForm('BOTTOM_SIDE', '', undefined), // photos
      // dmgImages: this.fb.array([]), // photos
      // bottomFormGroup: this.fb.group({ // compartment_type
      //   btm_dis_comp_cv: [''],
      //   btm_dis_valve_cv: [''],
      //   btm_dis_valve_spec_cv: [''],
      //   foot_valve_cv: [''],
      //   btm_valve_brand_cv: [''],
      //   thermometer: [''],
      //   thermometer_cv: [''],
      //   ladder: [''],
      //   data_csc_transportplate: [''],
      // }),
      // topFormGroup: this.fb.group({ // compartment_type
      //   top_dis_comp_cv: [''],
      //   top_dis_valve_cv: [''],
      //   top_dis_valve_spec_cv: [''],
      //   top_valve_brand_cv: [''],
      //   airline_valve_cv: [''],
      //   airline_valve_pcs: [''],
      //   airline_valve_dim: [''],
      //   airline_valve_conn_cv: [''],
      //   airline_valve_conn_spec_cv: [''],
      // }),
      // manlidFormGroup: this.fb.group({ // compartment_type
      //   manlid_comp_cv: [''],
      //   manlid_cover_cv: [''],
      //   manlid_cover_pcs: [''],
      //   manlid_cover_pts: [''],
      //   manlid_seal_cv: [''],
      //   pv_type_cv: [''],
      //   pv_type_pcs: [''],
      //   pv_spec_cv: [''],
      //   pv_spec_pcs: [''],
      //   safety_handrail: [''],
      //   buffer_plate: [''],
      //   residue: [''],
      //   dipstick: [''],
      // })
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

  getTankDetailsFormGroup(): UntypedFormGroup {
    return this.surveyForm!.get('tank_details') as UntypedFormGroup;
  }

  getInGateDetailsFormGroup(): UntypedFormGroup {
    return this.surveyForm!.get('in_gate_details') as UntypedFormGroup;
  }

  getPeriodicTestFormGroup(): UntypedFormGroup {
    return this.surveyForm!.get('periodic_test') as UntypedFormGroup;
  }

  getFrameTypeFormGroup(): UntypedFormGroup {
    return this.surveyForm!.get('frame_type') as UntypedFormGroup;
  }

  // getPhotosFormGroup(): UntypedFormGroup {
  //   return this.surveyForm!.get('photos') as UntypedFormGroup;
  // }

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

  isStepInErrorState(index: number): boolean {
    // Logic to determine if the step is in error
    if (index === 0) {
      return this.getTankDetailsFormGroup().invalid;
    } else if (index === 1) {
      return this.getInGateDetailsFormGroup().invalid;
    }
    return false;
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
      this.purposeOptionCvList = data || [];
    });
    this.cvDS.connectAlias('cleanStatusCv').subscribe(data => {
      this.cleanStatusCvList = addDefaultSelectOption(data, "Unknown");
    });
    this.cvDS.connectAlias('testTypeCv').subscribe(data => {
      this.testTypeCvList = addDefaultSelectOption(data, "--Select--");
      if (data.length) {
        this.last_test_desc = this.getLastTest();
        this.next_test_desc = this.getNextTest();
      }
    });
    this.cvDS.connectAlias('testClassCv').subscribe(data => {
      this.testClassCvList = addDefaultSelectOption(data, "--Select--");
      if (data.length) {
        this.last_test_desc = this.getLastTest();
        this.next_test_desc = this.getNextTest();
      }
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
      this.disCompCvList = data || [];
    });
    this.cvDS.connectAlias('disValveCv').subscribe(data => {
      this.disValveCvList = data || [];
    });
    this.cvDS.connectAlias('disValveSpecCv').subscribe(data => {
      this.disValveSpecCvList = data || [];
    });
    this.cvDS.connectAlias('disTypeCv').subscribe(data => {
      this.disTypeCvList = addDefaultSelectOption(data, "--Select--");
    });
    this.cvDS.connectAlias('footValveCv').subscribe(data => {
      this.footValveCvList = data || [];
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
    this.cvDS.connectAlias('valveBrandCv').subscribe(data => {
      this.valveBrandCvList = data || [];
    });
    this.cvDS.connectAlias('tankSideCv').subscribe(data => {
      this.tankSideCvList = data || [];
    });
    this.cvDS.connectAlias('tankStatusCv').subscribe(data => {
      this.tankStatusCvList = data || [];
    });
    this.subs.sink = this.tDS.loadItems().subscribe(data => {
      this.unit_typeList = data || [];
    });

    this.in_gate_guid = this.route.snapshot.paramMap.get('id');
    if (this.in_gate_guid) {
      // EDIT
      this.subs.sink = this.igDS.getInGateByID(this.in_gate_guid).subscribe(data => {
        if (this.igDS.totalCount > 0) {
          this.in_gate = data[0];
          this.dateOfInspection = Utility.convertDate(this.in_gate?.in_gate_survey?.create_dt) as Date;
          this.populateInGateForm(this.in_gate);
          if (!this.in_gate?.tank?.last_release_dt) {
            this.tiDS.getTankInfoForLastTest(this.in_gate!.tank!.tank_no!).subscribe(data => {
              if (data.length > 0) {
                this.surveyForm?.patchValue({
                  tank_details: {
                    last_release_dt: data[0]?.last_release_dt,
                  },
                })
              }
            });
          }
          // this.ccDS.getOwnerList().subscribe(data => {
          //   this.ownerList = data;
          // });
          this.getCustomerBufferPackage(this.in_gate.tank?.storing_order?.customer_company?.guid);

          if (this.in_gate!.in_gate_survey?.guid) {
            this.fileManagerService.getFileUrlByGroupGuid([this.in_gate!.in_gate_survey?.guid]).subscribe({
              next: (response) => {
                console.log('Files retrieved successfully:', response);
                if (response?.length) {
                  this.eirPdf = response.filter((f: any) => f.description === 'IN_GATE_EIR');
                  this.populateImages(response)
                }
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
    }
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

  populateInGateForm(ig: InGateItem): void {
    this.surveyForm?.patchValue({
      tank_details: {
        unit_type_guid: ig.tank?.unit_type_guid,
        owner: ig.tank?.customer_company,
        owner_guid: ig.tank?.owner_guid,
        manufacturer_cv: ig.in_gate_survey?.manufacturer_cv,
        dom_dt: Utility.convertDate(ig.in_gate_survey?.dom_dt),
        cladding_cv: ig.in_gate_survey?.cladding_cv,
        capacity: ig.in_gate_survey?.capacity,
        tare_weight: ig.in_gate_survey?.tare_weight,
        max_weight_cv: ig.in_gate_survey?.max_weight_cv,
        height_cv: ig.in_gate_survey?.height_cv,
        walkway_cv: ig.in_gate_survey?.walkway_cv,
        tank_comp_guid: ig.in_gate_survey?.tank_comp_guid,
        comments: ig.in_gate_survey?.comments,
        last_release_dt: ig.tank?.last_release_dt,
      },
      periodic_test: {
        last_test_cv: ig.in_gate_survey?.last_test_cv,
        next_test_cv: ig.in_gate_survey?.next_test_cv,
        test_class_cv: ig.in_gate_survey?.test_class_cv,
        test_dt: Utility.convertDate(ig.in_gate_survey?.test_dt),
      },
      in_gate_details: {
        vehicle_no: ig.vehicle_no,
        driver_name: ig.driver_name,
        haulier: ig.haulier,
        in_gate_remarks: ig.remarks,
      },
      frame_type: {
        leftRemarks: ig.in_gate_survey?.left_remarks,
        rearRemarks: ig.in_gate_survey?.rear_remarks,
        rightRemarks: ig.in_gate_survey?.right_remarks,
        topRemarks: ig.in_gate_survey?.top_remarks,
        frontRemarks: ig.in_gate_survey?.front_remarks,
        bottomRemarks: ig.in_gate_survey?.bottom_remarks,
      },
      compartment_type: {
        bottomFormGroup: {
          btm_dis_comp_cv: ig.in_gate_survey?.btm_dis_comp_cv,
          btm_dis_valve_cv: ig.in_gate_survey?.btm_dis_valve_cv,
          btm_dis_valve_spec_cv: ig.in_gate_survey?.btm_dis_valve_spec_cv,
          foot_valve_cv: ig.in_gate_survey?.foot_valve_cv,
          btm_valve_brand_cv: ig.in_gate_survey?.btm_valve_brand_cv,
          thermometer: ig.in_gate_survey?.thermometer,
          thermometer_cv: ig.in_gate_survey?.thermometer_cv,
          ladder: ig.in_gate_survey?.ladder,
          data_csc_transportplate: ig.in_gate_survey?.data_csc_transportplate
        },
        topFormGroup: {
          top_dis_comp_cv: ig.in_gate_survey?.top_dis_comp_cv,
          top_dis_valve_cv: ig.in_gate_survey?.top_dis_valve_cv,
          top_dis_valve_spec_cv: ig.in_gate_survey?.top_dis_valve_spec_cv,
          top_valve_brand_cv: ig.in_gate_survey?.top_valve_brand_cv,
          airline_valve_cv: ig.in_gate_survey?.airline_valve_cv,
          airline_valve_pcs: ig.in_gate_survey?.airline_valve_pcs,
          airline_valve_dim: ig.in_gate_survey?.airline_valve_dim,
          airline_valve_conn_cv: ig.in_gate_survey?.airline_valve_conn_cv,
          airline_valve_conn_spec_cv: ig.in_gate_survey?.airline_valve_conn_spec_cv,
        },
        manlidFormGroup: {
          manlid_comp_cv: ig.in_gate_survey?.manlid_comp_cv,
          manlid_cover_cv: ig.in_gate_survey?.manlid_cover_cv,
          manlid_cover_pcs: ig.in_gate_survey?.manlid_cover_pcs,
          manlid_cover_pts: ig.in_gate_survey?.manlid_cover_pts,
          manlid_seal_cv: ig.in_gate_survey?.manlid_seal_cv,
          pv_type_cv: ig.in_gate_survey?.pv_type_cv,
          pv_type_pcs: ig.in_gate_survey?.pv_type_pcs,
          pv_spec_cv: ig.in_gate_survey?.pv_spec_cv,
          pv_spec_pcs: ig.in_gate_survey?.pv_spec_pcs,
          safety_handrail: ig.in_gate_survey?.safety_handrail,
          buffer_plate: ig.in_gate_survey?.buffer_plate,
          residue: ig.in_gate_survey?.residue,
          dipstick: ig.in_gate_survey?.dipstick,
        }
      },
      // owner: ig.tank?.customer_company,
      // owner_guid: ig.tank?.owner_guid,
      // unit_type_guid: ig?.tank?.unit_type_guid,
      // vehicle_no: ig.vehicle_no,
      // driver_name: ig.driver_name,
      // haulier: ig.haulier,
      // in_gate_remarks: ig.remarks,
      // last_test_cv: ig.in_gate_survey?.last_test_cv,
      // next_test_cv: ig.in_gate_survey?.next_test_cv,
      // test_class_cv: ig.in_gate_survey?.test_class_cv,
      // test_dt: Utility.convertDate(ig.in_gate_survey?.test_dt),
      // manufacturer_cv: ig.in_gate_survey?.manufacturer_cv,
      // dom_dt: Utility.convertDate(ig.in_gate_survey?.dom_dt),
      // cladding_cv: ig.in_gate_survey?.cladding_cv,
      // capacity: ig.in_gate_survey?.capacity,
      // tare_weight: ig.in_gate_survey?.tare_weight,
      // max_weight_cv: ig.in_gate_survey?.max_weight_cv,
      // height_cv: ig.in_gate_survey?.height_cv,
      // walkway_cv: ig.in_gate_survey?.walkway_cv,
      // tank_comp_guid: ig.in_gate_survey?.tank_comp_guid,
      // comments: ig.in_gate_survey?.comments,
      // leftRemarks: ig.in_gate_survey?.left_remarks,
      // rearRemarks: ig.in_gate_survey?.rear_remarks,
      // rightRemarks: ig.in_gate_survey?.right_remarks,
      // topRemarks: ig.in_gate_survey?.top_remarks,
      // frontRemarks: ig.in_gate_survey?.front_remarks,
      // bottomRemarks: ig.in_gate_survey?.bottom_remarks,
      // bottomFormGroup: {
      //   btm_dis_comp_cv: ig.in_gate_survey?.btm_dis_comp_cv,
      //   btm_dis_valve_cv: ig.in_gate_survey?.btm_dis_valve_cv,
      //   btm_dis_valve_spec_cv: ig.in_gate_survey?.btm_dis_valve_spec_cv,
      //   foot_valve_cv: ig.in_gate_survey?.foot_valve_cv,
      //   btm_valve_brand_cv: ig.in_gate_survey?.btm_valve_brand_cv,
      //   thermometer: ig.in_gate_survey?.thermometer,
      //   thermometer_cv: ig.in_gate_survey?.thermometer_cv,
      //   ladder: ig.in_gate_survey?.ladder,
      //   data_csc_transportplate: ig.in_gate_survey?.data_csc_transportplate
      // },
      // topFormGroup: {
      //   top_dis_comp_cv: ig.in_gate_survey?.top_dis_comp_cv,
      //   top_dis_valve_cv: ig.in_gate_survey?.top_dis_valve_cv,
      //   top_dis_valve_spec_cv: ig.in_gate_survey?.top_dis_valve_spec_cv,
      //   top_valve_brand_cv: ig.in_gate_survey?.top_valve_brand_cv,
      //   airline_valve_cv: ig.in_gate_survey?.airline_valve_cv,
      //   airline_valve_pcs: ig.in_gate_survey?.airline_valve_pcs,
      //   airline_valve_dim: ig.in_gate_survey?.airline_valve_dim,
      //   airline_valve_conn_cv: ig.in_gate_survey?.airline_valve_conn_cv,
      //   airline_valve_conn_spec_cv: ig.in_gate_survey?.airline_valve_conn_spec_cv,
      // },
      // manlidFormGroup: {
      //   manlid_comp_cv: ig.in_gate_survey?.manlid_comp_cv,
      //   manlid_cover_cv: ig.in_gate_survey?.manlid_cover_cv,
      //   manlid_cover_pcs: ig.in_gate_survey?.manlid_cover_pcs,
      //   manlid_cover_pts: ig.in_gate_survey?.manlid_cover_pts,
      //   pv_type_cv: ig.in_gate_survey?.pv_type_cv,
      //   pv_type_pcs: ig.in_gate_survey?.pv_type_pcs,
      //   pv_spec_cv: ig.in_gate_survey?.pv_spec_cv,
      //   pv_spec_pcs: ig.in_gate_survey?.pv_spec_pcs,
      //   safety_handrail: ig.in_gate_survey?.safety_handrail,
      //   buffer_plate: ig.in_gate_survey?.buffer_plate,
      //   residue: ig.in_gate_survey?.residue,
      //   dipstick: ig.in_gate_survey?.dipstick,
      // }
    });
    this.highlightedCellsLeft = this.populateHighlightedCells(this.highlightedCellsLeft, JSON.parse(ig.in_gate_survey?.left_coord || '[]'));
    this.highlightedCellsRear = this.populateHighlightedCells(this.highlightedCellsRear, JSON.parse(ig.in_gate_survey?.rear_coord || '[]'));
    this.highlightedCellsRight = this.populateHighlightedCells(this.highlightedCellsRight, JSON.parse(ig.in_gate_survey?.right_coord || '[]'));
    this.populateTopSideCells(JSON.parse(ig.in_gate_survey?.top_coord || '{}'));
    this.highlightedCellsFront = this.populateHighlightedCells(this.highlightedCellsFront, JSON.parse(ig.in_gate_survey?.front_coord || '[]'));
    this.highlightedCellsBottom = this.populateHighlightedCells(this.highlightedCellsBottom, JSON.parse(ig.in_gate_survey?.bottom_coord || '[]'));
    // this.markForCheck();
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
    // this.markForCheck();
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

  onPublish() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    // this.container.clear();

    // const componentRef = this.container.createComponent(EirFormComponent);

    // const instance = componentRef.instance;
    // instance.type = "in";
    // instance.in_gate_survey_guid = this.in_gate?.in_gate_survey?.guid;
    // instance.igsDS = this.igsDS;
    // instance.cvDS = this.cvDS;

    // instance.populateCodeValues = {
    //   purposeOptionCvList: this.purposeOptionCvList,
    //   cleanStatusCvList: this.cleanStatusCvList,
    //   testTypeCvList: this.testTypeCvList,
    //   testClassCvList: this.testClassCvList,
    //   manufacturerCvList: this.manufacturerCvList,
    //   claddingCvList: this.claddingCvList,
    //   maxGrossWeightCvList: this.maxGrossWeightCvList,
    //   tankHeightCvList: this.tankHeightCvList,
    //   walkwayCvList: this.walkwayCvList,
    //   airlineCvList: this.airlineCvList,
    //   airlineConnCvList: this.airlineConnCvList,
    //   disCompCvList: this.disCompCvList,
    //   disValveCvList: this.disValveCvList,
    //   disValveSpecCvList: this.disValveSpecCvList,
    //   disTypeCvList: this.disTypeCvList,
    //   footValveCvList: this.footValveCvList,
    //   manlidCoverCvList: this.manlidCoverCvList,
    //   manlidSealCvList: this.manlidSealCvList,
    //   pvSpecCvList: this.pvSpecCvList,
    //   pvTypeCvList: this.pvTypeCvList,
    //   thermometerCvList: this.thermometerCvList,
    //   tankCompTypeCvList: this.tankCompTypeCvList,
    //   valveBrandCvList: this.valveBrandCvList,
    //   tankSideCvList: this.tankSideCvList,
    //   tankStatusCvList: this.tankStatusCvList,
    //   packageBufferList: this.packageBufferList,
    // }

    // instance.generatePDF().then((data) => {
    //   console.log(data)
    //   componentRef.destroy();

    // });
    const dialogRef = this.dialog.open(EirFormComponent, {
      width: '794px',
      height: '80vh',
      data: {
        type: "in",
        in_gate_survey_guid: this.in_gate?.in_gate_survey?.guid,
        eir_no: this.in_gate?.eir_no,
        igsDS: this.igsDS,
        cvDS: this.cvDS,
        eirPdf: this.eirPdf
      },
      panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    });

    // this.container.clear();

    // const componentRef = this.container.createComponent(EirFormComponent);

    // const instance = componentRef.instance;
    // instance.type = "in";
    // instance.in_gate_survey_guid = this.in_gate?.in_gate_survey?.guid;
    // instance.igsDS = this.igsDS;
    // instance.cvDS = this.cvDS;

    // instance.populateCodeValues = {
    //   purposeOptionCvList: this.purposeOptionCvList,
    //   cleanStatusCvList: this.cleanStatusCvList,
    //   testTypeCvList: this.testTypeCvList,
    //   testClassCvList: this.testClassCvList,
    //   manufacturerCvList: this.manufacturerCvList,
    //   claddingCvList: this.claddingCvList,
    //   maxGrossWeightCvList: this.maxGrossWeightCvList,
    //   tankHeightCvList: this.tankHeightCvList,
    //   walkwayCvList: this.walkwayCvList,
    //   airlineCvList: this.airlineCvList,
    //   airlineConnCvList: this.airlineConnCvList,
    //   disCompCvList: this.disCompCvList,
    //   disValveCvList: this.disValveCvList,
    //   disValveSpecCvList: this.disValveSpecCvList,
    //   disTypeCvList: this.disTypeCvList,
    //   footValveCvList: this.footValveCvList,
    //   manlidCoverCvList: this.manlidCoverCvList,
    //   manlidSealCvList: this.manlidSealCvList,
    //   pvSpecCvList: this.pvSpecCvList,
    //   pvTypeCvList: this.pvTypeCvList,
    //   thermometerCvList: this.thermometerCvList,
    //   tankCompTypeCvList: this.tankCompTypeCvList,
    //   valveBrandCvList: this.valveBrandCvList,
    //   tankSideCvList: this.tankSideCvList,
    //   tankStatusCvList: this.tankStatusCvList,
    //   packageBufferList: this.packageBufferList,
    // }

    // instance.generatePDF().then((data) => {
    //   console.log(data)
    //   componentRef.destroy();

    //   const dialogRef = this.dialog.open(PreviewPdfDialogComponent, {
    //     width: '80vw',
    //     height: '80vh',
    //     data: {
    //       pdfBlob: data,
    //     },
    //     direction: tempDirection
    //   });
    //   this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    //   });
    // });
  }

  onFormSubmit() {
    if (this.surveyForm?.valid) {
      let sot: StoringOrderTank = new StoringOrderTank(this.in_gate?.tank);
      sot.unit_type_guid = this.surveyForm.get('tank_details.unit_type_guid')?.value;
      sot.owner_guid = this.surveyForm.get('tank_details.owner_guid')?.value;
      sot.last_release_dt = this.surveyForm.get('tank_details.last_release_dt')?.value;

      let ig: InGateGO = new InGateGO(this.in_gate!);
      ig.vehicle_no = this.surveyForm.get('in_gate_details.vehicle_no')?.value?.toUpperCase();
      ig.driver_name = this.surveyForm.get('in_gate_details.driver_name')?.value;
      ig.haulier = this.surveyForm.get('in_gate_details.haulier')?.value;
      ig.remarks = this.surveyForm.get('in_gate_details.in_gate_remarks')?.value;
      ig.tank = sot;

      const periodicTestFormGroup = this.getBottomFormGroup();
      let igs: InGateSurveyGO = new InGateSurveyGO(this.in_gate?.in_gate_survey);
      igs.guid = this.in_gate?.in_gate_survey?.guid;
      igs.in_gate_guid = this.in_gate?.in_gate_survey?.in_gate_guid || this.in_gate?.guid;
      igs.last_test_cv = this.surveyForm.get('periodic_test.last_test_cv')?.value;
      igs.next_test_cv = this.surveyForm.get('periodic_test.next_test_cv')?.value;
      igs.test_dt = Utility.convertDate(this.surveyForm.get('periodic_test.test_dt')?.value);
      igs.test_class_cv = this.surveyForm.get('periodic_test.test_class_cv')?.value;
      igs.manufacturer_cv = this.surveyForm.get('tank_details.manufacturer_cv')?.value;
      igs.dom_dt = Utility.convertDate(this.surveyForm.get('tank_details.dom_dt')?.value);
      igs.cladding_cv = this.surveyForm.get('tank_details.cladding_cv')?.value;
      igs.capacity = this.surveyForm.get('tank_details.capacity')?.value;
      igs.tare_weight = this.surveyForm.get('tank_details.tare_weight')?.value;
      igs.max_weight_cv = this.surveyForm.get('tank_details.max_weight_cv')?.value;
      igs.height_cv = this.surveyForm.get('tank_details.height_cv')?.value;
      igs.walkway_cv = this.surveyForm.get('tank_details.walkway_cv')?.value;
      igs.tank_comp_guid = this.surveyForm.get('tank_details.tank_comp_guid')?.value;
      igs.comments = this.surveyForm.get('tank_details.comments')?.value;

      const bottomFormGroup = this.getBottomFormGroup();
      igs.btm_dis_comp_cv = bottomFormGroup.get('btm_dis_comp_cv')?.value;
      igs.btm_dis_valve_cv = bottomFormGroup.get('btm_dis_valve_cv')?.value;
      igs.btm_dis_valve_spec_cv = bottomFormGroup.get('btm_dis_valve_spec_cv')?.value;
      igs.foot_valve_cv = bottomFormGroup.get('foot_valve_cv')?.value;
      igs.btm_valve_brand_cv = bottomFormGroup.get('btm_valve_brand_cv')?.value;
      igs.thermometer = bottomFormGroup.get('thermometer')?.value;
      igs.thermometer_cv = bottomFormGroup.get('thermometer_cv')?.value;
      igs.ladder = bottomFormGroup.get('ladder')?.value;
      igs.data_csc_transportplate = bottomFormGroup.get('data_csc_transportplate')?.value;

      const topFormGroup = this.getTopFormGroup();
      igs.top_dis_comp_cv = topFormGroup.get('top_dis_comp_cv')?.value;
      igs.top_dis_valve_cv = topFormGroup.get('top_dis_valve_cv')?.value;
      igs.top_dis_valve_spec_cv = topFormGroup.get('top_dis_valve_spec_cv')?.value;
      igs.top_valve_brand_cv = topFormGroup.get('top_valve_brand_cv')?.value;
      igs.airline_valve_cv = topFormGroup.get('airline_valve_cv')?.value;
      igs.airline_valve_pcs = topFormGroup.get('airline_valve_pcs')?.value;
      igs.airline_valve_dim = topFormGroup.get('airline_valve_dim')?.value;
      igs.airline_valve_conn_cv = topFormGroup.get('airline_valve_conn_cv')?.value;
      igs.airline_valve_conn_spec_cv = topFormGroup.get('airline_valve_conn_spec_cv')?.value;

      const manlidFormGroup = this.getManlidFormGroup();
      igs.manlid_comp_cv = manlidFormGroup.get('manlid_comp_cv')?.value;
      igs.manlid_cover_cv = manlidFormGroup.get('manlid_cover_cv')?.value;
      igs.manlid_cover_pcs = manlidFormGroup.get('manlid_cover_pcs')?.value;
      igs.manlid_cover_pts = manlidFormGroup.get('manlid_cover_pts')?.value;
      igs.manlid_seal_cv = manlidFormGroup.get('manlid_seal_cv')?.value;
      igs.pv_type_cv = manlidFormGroup.get('pv_type_cv')?.value;
      igs.pv_type_pcs = manlidFormGroup.get('pv_type_pcs')?.value;
      igs.pv_spec_cv = manlidFormGroup.get('pv_spec_cv')?.value;
      igs.pv_spec_pcs = manlidFormGroup.get('pv_spec_pcs')?.value;
      igs.safety_handrail = manlidFormGroup.get('safety_handrail')?.value;
      igs.buffer_plate = manlidFormGroup.get('buffer_plate')?.value;
      igs.residue = manlidFormGroup.get('residue')?.value;
      igs.dipstick = manlidFormGroup.get('dipstick')?.value;

      igs.left_coord = JSON.stringify(this.getHighlightedCoordinates(this.highlightedCellsLeft));
      igs.rear_coord = JSON.stringify(this.getHighlightedCoordinates(this.highlightedCellsRear));
      igs.right_coord = JSON.stringify(this.getHighlightedCoordinates(this.highlightedCellsRight));
      igs.top_coord = JSON.stringify(this.getTopCoordinates());
      igs.front_coord = JSON.stringify(this.getHighlightedCoordinates(this.highlightedCellsFront));
      igs.bottom_coord = JSON.stringify(this.getHighlightedCoordinates(this.highlightedCellsBottom));
      igs.left_remarks = this.surveyForm.get('frame_type.leftRemarks')?.value;
      igs.rear_remarks = this.surveyForm.get('frame_type.rearRemarks')?.value;
      igs.right_remarks = this.surveyForm.get('frame_type.rightRemarks')?.value
      igs.top_remarks = this.surveyForm.get('frame_type.topRemarks')?.value;
      igs.front_remarks = this.surveyForm.get('frame_type.frontRemarks')?.value;
      igs.bottom_remarks = this.surveyForm.get('frame_type.bottomRemarks')?.value;
      console.log('igs Value', igs);
      console.log('ig Value', ig);
      if (igs.guid) {
        this.igsDS.updateInGateSurvey(igs, ig).subscribe(result => {
          console.log(result)
          if (result?.data?.updateInGateSurvey) {
            this.uploadImages(igs.guid!);
          }
        });
      } else {
        this.igsDS.addInGateSurvey(igs, ig).subscribe(result => {
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
    let purposes: any[] = [];
    if (sot?.purpose_storage) {
      purposes.push(this.getPurposeOptionDescription('STORAGE'));
    }
    if (sot?.purpose_cleaning) {
      purposes.push(this.getPurposeOptionDescription('CLEANING'));
    }
    if (sot?.purpose_steam) {
      purposes.push(this.getPurposeOptionDescription('STEAM'));
    }
    if (sot?.purpose_repair_cv) {
      purposes.push(this.getPurposeOptionDescription(sot?.purpose_repair_cv));
    }
    return purposes.join('; ');
  }

  getPurposeOptionDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.purposeOptionCvList);
  }

  getCleanStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.cleanStatusCvList);
  }

  getTankStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.tankStatusCvList);
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
          this.dmgImages().push(this.createImageForm('', preview, file));
          // this.markForCheck();
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
          // this.markForCheck();
          this.handleDeleteSuccess(1);
        } else if (Utility.isUrl(url)) {
          this.fileManagerService.deleteFile([url]).subscribe({
            next: (response) => {
              console.log('Files delete successfully:', response);
              this.dmgImages().removeAt(index);
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
        // this.markForCheck();
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
          this.router.navigate(['/admin/inventory/in-gate-survey']);
        }
      });
    } else {
      this.handleSaveSuccess(1);
      this.router.navigate(['/admin/inventory/in-gate-survey']);
    }
  }

  canPublish() {
    return this.in_gate?.in_gate_survey?.guid;
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
    if ((this.surveyForm!.get('periodic_test.last_test_cv')!.value || this.in_gate?.in_gate_survey?.last_test_cv) &&
      (this.surveyForm!.get('periodic_test.test_dt')!.value || this.in_gate?.in_gate_survey?.test_dt)) {
      const test_type = this.surveyForm!.get('periodic_test.last_test_cv')!.value || this.in_gate?.in_gate_survey?.last_test_cv;
      const match = test_type.match(/^[0-9]*\.?[0-9]+/);
      const yearCount = parseFloat(match[0]);
      const testDt = Utility.convertDate(this.surveyForm!.get('periodic_test.test_dt')!.value) as number || this.in_gate?.in_gate_survey?.test_dt as number;
      const resultDt = Utility.addYearsToEpoch(testDt, yearCount);
      const mappedVal = testTypeMapping[test_type];
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

  preventDefault(event: Event) {
    event.preventDefault(); // Prevents the form submission
  }

  // markForCheck() {
  //   this.cdr.markForCheck(); // Trigger change detection manually
  // }
}