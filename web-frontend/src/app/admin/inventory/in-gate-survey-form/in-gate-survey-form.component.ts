import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { InGateDS, InGateItem } from 'app/data-sources/in-gate';
import { MatCardModule } from '@angular/material/card';
import { TankDS, TankItem } from 'app/data-sources/tank';
import { MatStepperModule } from '@angular/material/stepper';
import { InGateSurveyDS, InGateSurveyGO } from 'app/data-sources/in-gate-survey';

@Component({
  selector: 'app-in-gate',
  standalone: true,
  templateUrl: './in-gate-survey-form.component.html',
  styleUrl: './in-gate-survey-form.component.scss',
  imports: [
    BreadcrumbComponent,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatCheckboxModule,
    FeatherIconsComponent,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatPaginatorModule,
    DatePipe,
    RouterLink,
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
  ]
})
export class InGateSurveyFormComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'tank_no',
    'customer_code',
    'eir_no',
    'eir_dt',
    'last_cargo',
    'purpose',
    'tank_status_cv',
  ];

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
    OTHER_COMMENTS: 'COMMON-FORM.OTHER-COMMENTS'
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

  inGateList: InGateItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  cleanStatusCvList: CodeValuesItem[] = [];
  testTypeCvList: CodeValuesItem[] = [];
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

  unit_typeList: TankItem[] = []

  dateOfInspection: Date = new Date();
  startDateTest: Date = new Date();
  maxManuDOMDt: Date = new Date();

  // Stepper
  isLinear = false;
  // bottomFormGroup?: UntypedFormGroup;
  // topFormGroup?: UntypedFormGroup;
  // manlidFormGroup?: UntypedFormGroup;
  // commentFormGroup?: UntypedFormGroup;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) {
    super();
    this.translateLangText();
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.igsDS = new InGateSurveyDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.tDS = new TankDS(this.apollo);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.initSearchForm();
    this.loadData();
  }

  initSearchForm() {
    this.surveyForm = this.fb.group({
      test_type_cv: [''],
      test_class_cv: [''],
      test_dt: [''],
      unit_type_guid: [''],
      manufacturer_cv: [''],
      dom_dt: [''],
      cladding_cv: [''],
      capacity: [''],
      tare_weight: [''],
      max_weight_cv: [''],
      height_cv: [''],
      walkway_cv: [''],
      // bottom_discharge_type_cv: [''],
      // compartment_type_cv: [''],
      vehicle_no: [''],
      driver_name: [''],
      haulier: [''],
      in_gate_remarks: [''],
      comments: [''],
      bottomFormGroup: this.fb.group({
        btm_dis_comp_cv: [''],
        btm_dis_valve_cv: [''],
        btm_dis_valve_spec_cv: [''],
        foot_valve_cv: [''],
        thermometer: [''],
        thermometer_cv: [''],
        ladder: [''],
        data_csc_transportplate: [''],
      }),
      topFormGroup: this.fb.group({
        top_dis_comp_cv: [''],
        top_dis_valve_cv: [''],
        top_dis_valve_spec_cv: [''],
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
      }),
      commentFormGroup: this.fb.group({
        comments: [''],
      })
    });

    // this.bottomFormGroup = this.fb.group({
    //   btm_dis_comp_cv: [''],
    //   btm_dis_valve_cv: [''],
    //   btm_dis_valve_spec_cv: [''],
    //   foot_valve_cv: [''],
    //   thermometer: [''],
    //   thermometer_cv: [''],
    //   ladder: [''],
    //   data_csc_transportplate: [''],
    // });

    // this.topFormGroup = this.fb.group({
    //   top_dis_comp_cv: [''],
    //   top_dis_valve_cv: [''],
    //   top_dis_valve_spec_cv: [''],
    //   airline_valve_cv: [''],
    //   airline_valve_pcs: [''],
    //   airline_valve_dim: [''],
    //   airline_valve_conn_cv: [''],
    //   airline_valve_conn_spec_cv: [''],
    // });

    // this.manlidFormGroup = this.fb.group({
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
    // });

    // this.commentFormGroup = this.fb.group({
    //   comments: [''],
    // });

    this.in_gate_guid = this.route.snapshot.paramMap.get('id');
    if (this.in_gate_guid) {
      // EDIT
      this.subs.sink = this.igDS.getInGateByID(this.in_gate_guid).subscribe(data => {
        if (this.igDS.totalCount > 0) {
          this.in_gate = data[0];
          this.populateInGateForm(this.in_gate);
        }
      });
    } else {
    }
  }

  getBottomFormGroup(): UntypedFormGroup {
    return this.surveyForm!.get('bottomFormGroup') as UntypedFormGroup;
  }

  getTopFormGroup(): UntypedFormGroup {
    return this.surveyForm!.get('topFormGroup') as UntypedFormGroup;
  }

  getManlidFormGroup(): UntypedFormGroup {
    return this.surveyForm!.get('manlidFormGroup') as UntypedFormGroup;
  }

  getCommentFormGroup(): UntypedFormGroup {
    return this.surveyForm!.get('commentFormGroup') as UntypedFormGroup;
  }

  public loadData() {
    const queries = [
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'cleanStatusCv', codeValType: 'CLEAN_STATUS' },
      //{ alias: 'testTypeCv', codeValType: 'TEST_TYPE' },
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
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      this.purposeOptionCvList = data;
    });
    this.cvDS.connectAlias('cleanStatusCv').subscribe(data => {
      this.cleanStatusCvList = addDefaultSelectOption(data, "Unknown");;
    });
    // this.cvDS.connectAlias('testTypeCv').subscribe(data => {
    //   this.testTypeCvList = addDefaultSelectOption(data, "--Select--");;
    // });
    this.cvDS.connectAlias('manufacturerCv').subscribe(data => {
      this.manufacturerCvList = addDefaultSelectOption(data, "--Select--");;
    });
    this.cvDS.connectAlias('claddingCv').subscribe(data => {
      this.claddingCvList = addDefaultSelectOption(data, "--Select--");;
    });
    this.cvDS.connectAlias('maxGrossWeightCv').subscribe(data => {
      this.maxGrossWeightCvList = addDefaultSelectOption(data, "--Select--");;
    });
    this.cvDS.connectAlias('tankHeightCv').subscribe(data => {
      this.tankHeightCvList = addDefaultSelectOption(data, "--Select--");;
    });
    this.cvDS.connectAlias('walkwayCv').subscribe(data => {
      this.walkwayCvList = addDefaultSelectOption(data, "--Select--");;
    });
    this.cvDS.connectAlias('airlineCv').subscribe(data => {
      this.airlineCvList = addDefaultSelectOption(data, "--Select--");;
    });
    this.cvDS.connectAlias('airlineConnCv').subscribe(data => {
      this.airlineConnCvList = addDefaultSelectOption(data, "--Select--");;
    });
    this.cvDS.connectAlias('disCompCv').subscribe(data => {
      this.disCompCvList = addDefaultSelectOption(data, "--Select--");;
    });
    this.cvDS.connectAlias('disValveCv').subscribe(data => {
      this.disValveCvList = addDefaultSelectOption(data, "--Select--");;
    });
    this.cvDS.connectAlias('disValveSpecCv').subscribe(data => {
      this.disValveSpecCvList = addDefaultSelectOption(data, "--Select--");;
    });
    this.cvDS.connectAlias('disTypeCv').subscribe(data => {
      this.disTypeCvList = addDefaultSelectOption(data, "--Select--");;
    });
    this.cvDS.connectAlias('footValveCv').subscribe(data => {
      this.footValveCvList = addDefaultSelectOption(data, "--Select--");;
    });
    this.cvDS.connectAlias('manlidCoverCv').subscribe(data => {
      this.manlidCoverCvList = addDefaultSelectOption(data, "--Select--");;
    });
    this.cvDS.connectAlias('manlidSealCv').subscribe(data => {
      this.manlidSealCvList = addDefaultSelectOption(data, "--Select--");;
    });
    this.cvDS.connectAlias('pvSpecCv').subscribe(data => {
      this.pvSpecCvList = addDefaultSelectOption(data, "--Select--");;
    });
    this.cvDS.connectAlias('pvTypeCv').subscribe(data => {
      this.pvTypeCvList = addDefaultSelectOption(data, "--Select--");;
    });
    this.cvDS.connectAlias('thermometerCv').subscribe(data => {
      this.thermometerCvList = addDefaultSelectOption(data, "--Select--");;
    });
    this.subs.sink = this.tDS.loadItems().subscribe(data => {
      this.unit_typeList = data
    });
  }

  populateInGateForm(ig: InGateItem): void {
    this.surveyForm!.patchValue({
      guid: ig.guid,
      unit_type_guid: ig?.tank?.unit_type_guid,
      vehicle_no: ig.vehicle_no,
      driver_name: ig.driver_name,
      haulier: ig.haulier,
      in_gate_remarks: ig.remarks,
    });
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
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

  onFormSubmit() {
    if (this.surveyForm?.valid) {
      let sot: StoringOrderTank = new StoringOrderTank(this.in_gate?.tank);
      sot.unit_type_guid = this.surveyForm.value['unit_type_guid'];

      let ig: InGateItem = new InGateItem(this.in_gate!);
      ig.vehicle_no = this.surveyForm.value['vehicle_no'];
      ig.driver_name = this.surveyForm.value['driver_name'];
      ig.haulier = this.surveyForm.value['haulier'];
      ig.remarks = this.surveyForm.value['in_gate_remarks'];
      ig.tank = sot;

      let igs: InGateSurveyGO = new InGateSurveyGO();
      igs.in_gate_guid = this.in_gate?.guid;
      igs.periodic_test_guid = this.surveyForm.value['periodic_test_guid'] || '';
      //igs.test_type_cv = this.surveyForm.value['test_type_cv'];
      //igs.test_class_cv = this.surveyForm.value['test_class_cv'];
      //igs.test_dt = this.surveyForm.value['test_dt'];
      igs.manufacturer_cv = this.surveyForm.value['manufacturer_cv'];
      igs.dom_dt = Utility.convertDate(this.surveyForm.value['dom_dt']);
      igs.cladding_cv = this.surveyForm.value['cladding_cv'];
      igs.capacity = this.surveyForm.value['capacity'];
      igs.tare_weight = this.surveyForm.value['tare_weight'];
      igs.max_weight_cv = this.surveyForm.value['max_weight_cv'];
      igs.height_cv = this.surveyForm.value['height_cv'];
      igs.walkway_cv = this.surveyForm.value['walkway_cv'];
      igs.comments = this.surveyForm.value['comments'];

      const bottomFormGroup = this.surveyForm.get('bottomFormGroup') as UntypedFormGroup;
      igs.btm_dis_comp_cv = bottomFormGroup.value['btm_dis_comp_cv'];
      igs.btm_dis_valve_cv = bottomFormGroup.value['btm_dis_valve_cv'];
      igs.btm_dis_valve_spec_cv = bottomFormGroup.value['btm_dis_valve_spec_cv'];
      igs.foot_valve_cv = bottomFormGroup.value['foot_valve_cv'];
      igs.thermometer = bottomFormGroup.value['thermometer'];
      igs.thermometer_cv = bottomFormGroup.value['thermometer_cv'];
      igs.ladder = bottomFormGroup.value['ladder'];
      igs.data_csc_transportplate = bottomFormGroup.value['data_csc_transportplate'];

      const topFormGroup = this.surveyForm.get('topFormGroup') as UntypedFormGroup;
      igs.top_dis_comp_cv = topFormGroup.value['top_dis_comp_cv'];
      igs.top_dis_valve_cv = topFormGroup.value['top_dis_valve_cv'];
      igs.top_dis_valve_spec_cv = topFormGroup.value['top_dis_valve_spec_cv'];
      igs.airline_valve_cv = topFormGroup.value['airline_valve_cv'];
      igs.airline_valve_pcs = topFormGroup.value['airline_valve_pcs'];
      igs.airline_valve_dim = topFormGroup.value['airline_valve_dim'];
      igs.airline_valve_conn_cv = topFormGroup.value['airline_valve_conn_cv'];
      igs.airline_valve_conn_spec_cv = topFormGroup.value['airline_valve_conn_spec_cv'];

      const manlidFormGroup = this.surveyForm.get('manlidFormGroup') as UntypedFormGroup;
      igs.manlid_comp_cv = manlidFormGroup.value['manlid_comp_cv'];
      igs.manlid_cover_cv = manlidFormGroup.value['manlid_cover_cv'];
      igs.manlid_cover_pcs = manlidFormGroup.value['manlid_cover_pcs'];
      igs.manlid_cover_pts = manlidFormGroup.value['manlid_cover_pts'];
      igs.manlid_seal_cv = manlidFormGroup.value['manlid_seal_cv'];
      igs.pv_type_cv = manlidFormGroup.value['pv_type_cv'];
      igs.pv_type_pcs = manlidFormGroup.value['pv_type_pcs'];
      igs.pv_spec_cv = manlidFormGroup.value['pv_spec_cv'];
      igs.pv_spec_pcs = manlidFormGroup.value['pv_spec_pcs'];
      igs.safety_handrail = manlidFormGroup.value['safety_handrail'];
      igs.buffer_plate = this.surveyForm.value['buffer_plate'];
      igs.residue = this.surveyForm.value['residue'];
      igs.dipstick = this.surveyForm.value['dipstick'];
      // let so: StoringOrderGO = new StoringOrderGO(this.storingOrderItem);
      // so.customer_company_guid = this.soForm.value['customer_company_guid'];
      // so.haulier = this.soForm.value['haulier'];
      // so.so_notes = this.soForm.value['so_notes'];

      // const sot: StoringOrderTankGO[] = this.sotList.data.map((item: Partial<StoringOrderTankItem>) => {
      //   // Ensure action is an array and take the last action only
      //   const actions = Array.isArray(item!.actions) ? item!.actions : [];
      //   const latestAction = actions.length > 0 ? actions[actions.length - 1] : '';

      //   return new StoringOrderTankUpdateSO({
      //     ...item,
      //     action: latestAction // Set the latest action as the single action
      //   });
      // });
      console.log('igs Value', igs);
      console.log('ig Value', ig);
      if (igs.guid) {
        // this.igsDS.addInGateSurvey(igs).subscribe(result => {
        //   console.log(result)
        //   this.handleSaveSuccess(result?.data?.updateStoringOrder);
        // });
      } else {
        this.igsDS.addInGateSurvey(igs, ig).subscribe(result => {
          console.log(result)
          this.handleSaveSuccess(result?.data?.addStoringOrder);
        });
      }
    } else {
      console.log('Invalid soForm', this.surveyForm?.value);
    }
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.SAVE_SUCCESS;
      ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
      this.router.navigate(['/admin/inventory/ig-gate-survey']);
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
    let cv = this.purposeOptionCvList.filter(cv => cv.code_val === codeValType);
    if (cv.length) {
      return cv[0].description;
    }
    return '';
  }

  getCleanStatusDescription(codeValType: string | undefined): string | undefined {
    let cv = this.cleanStatusCvList.filter(cv => cv.code_val === codeValType);
    if (cv.length) {
      return cv[0].description;
    }
    return '';
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
}