import { Direction } from '@angular/cdk/bidi';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
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
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { GuidSelectionModel } from '@shared/GuidSelectionModel';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { DailyQCDetail, ReportDS, SurveyorPerformanceSummary } from 'app/data-sources/reports';
import { SteamItem } from 'app/data-sources/steam';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { TeamDS, TeamItem } from 'app/data-sources/teams';
import { UserDS } from 'app/data-sources/user';
import { SurveyorDetailPerformancePdfComponent } from 'app/document-template/pdf/admin-reports/performance/surveyor/detail/surveyor-detail-pdf.component';
import { SurveyorPerformanceSummaryPdfComponent } from 'app/document-template/pdf/admin-reports/performance/surveyor/summary/surveyor-summary-pdf.component';
import { Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { reportPreviewWindowDimension } from 'environments/environment';
import { debounceTime, startWith, tap } from 'rxjs/operators';
@Component({
  selector: 'app-surveyor-performance-report',
  standalone: true,
  templateUrl: './surveyor-performance-report.component.html',
  styleUrl: './surveyor-performance-report.component.scss',
  imports: [
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
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
    MatSlideToggleModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class SurveyorPerformanceReportComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'select',
    'tank_no',
    'customer',
    'eir_no',
    'eir_dt',
    'last_cargo',
    'purpose',
    'tank_status_cv',
    'cost',
    'invoice_no',
    // 'invoiced',
    // 'action'
  ];

  translatedLangText: any = {};
  langText = {
    STATUS: 'COMMON-FORM.STATUS',
    SO_NO: 'COMMON-FORM.SO-NO',
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
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
    CANCELED_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    SEARCH: 'COMMON-FORM.SEARCH',
    EIR_NO: 'COMMON-FORM.EIR-NO',
    EIR_DATE: 'COMMON-FORM.EIR-DATE',
    CONFIRM_RESET: 'COMMON-FORM.CONFIRM-RESET',
    CONFIRM_CLEAR_ALL: 'COMMON-FORM.CONFIRM-CLEAR-ALL',
    EIR_STATUS: 'COMMON-FORM.EIR-STATUS',
    TANK_STATUS: 'COMMON-FORM.TANK-STATUS',
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    RO_NO: 'COMMON-FORM.RO-NO',
    RELEASE_DATE: 'COMMON-FORM.RELEASE-DATE',
    INVOICE_DATE: 'COMMON-FORM.INVOICE-DATE',
    INVOICE_NO: 'COMMON-FORM.INVOICE-NO',
    SO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    INVOICE_DETAILS: 'COMMON-FORM.INVOICE-DETAILS',
    TOTAL_COST: 'COMMON-FORM.TOTAL-COST',
    SAVE_AND_SUBMIT: 'COMMON-FORM.SAVE-AND-SUBMIT',
    BILLING_BRANCH: 'COMMON-FORM.BILLING-BRANCH',
    CUTOFF_DATE: 'COMMON-FORM.CUTOFF-DATE',
    SAVE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    INVOICED: 'COMMON-FORM.INVOICED',
    CONFIRM_UPDATE_INVOICE: 'COMMON-FORM.CONFIRM-UPDATE-INVOICE',
    CONFIRM_INVALID_ESTIMATE: 'COMMON-FORM.CONFIRM-INVALID-ESTIMATE',
    COST: 'COMMON-FORM.COST',
    CONFIRM_REMOVE_ESITMATE: 'COMMON-FORM.CONFIRM-REMOVE-ESITMATE',
    DELETE: 'COMMON-FORM.DELETE',
    AV_DATE: 'COMMON-FORM.AV-DATE',
    CLEAN_DATE: 'COMMON-FORM.CLEAN-DATE',
    CAPACITY: 'COMMON-FORM.CAPACITY',
    REPAIR_COMPLETED_DATE: 'COMMON-FORM.REPAIR-COMPLETED-DATE',
    TARE_WEIGHT: 'COMMON-FORM.TARE-WEIGHT',
    CURRENT_STATUS: 'COMMON-FORM.CURRENT-STATUS',
    DATE: 'COMMON-FORM.DATE',
    INVENTORY_TYPE: 'COMMON-FORM.INVENTORY-TYPE',
    SUMMARY_REPORT: 'COMMON-FORM.SUMMARY-REPORT',
    DETAIL_REPORT: 'COMMON-FORM.DETAIL-REPORT',
    ONE_CONDITION_NEEDED: 'COMMON-FORM.ONE-CONDITION-NEEDED',
    REPAIR_TYPE: 'COMMON-FORM.REPAIR-TYPE',
    OUTSTANDING_DAYS: 'COMMON-FORM.OUTSTANDING-DAYS',
    MAX_DAYS: 'COMMON-FORM.MAX-DAYS',
    MIN_DAYS: 'COMMON-FORM.MIN-DAYS',
    WARNING_OUTSTANDING_DAYS: 'COMMON-FORM.WARNING-OUTSTANDING-DAYS',
    TEAM: 'COMMON-FORM.TEAM',
    ALLOCATION_DATE: "COMMON-FORM.ALLOCATION-DATE",
    APPROVED_DATE: "COMMON-FORM.APPROVED-DATE",
    ESTIMATE_DATE: "COMMON-FORM.ESTIMATE-DATE",
    QC_DATE: "COMMON-FORM.QC-DATE",
    REVENUE: 'COMMON-FORM.REVENUE',
    APPROVAL: 'COMMON-FORM.APPROVAL',
    QC_DETAIL: 'COMMON-FORM.QC-DETAIL',
    GENERATE_REPORT: 'COMMON-FORM.GENERATE-REPORT',
    MONTH_START: 'COMMON-FORM.MONTH-START',
    MONTH_END: 'COMMON-FORM.MONTH-END',
    YEAR: 'COMMON-FORM.YEAR',
    SURVEYOR_NAME: "COMMON-FORM.SURVEYOR-NAME",
    ESTIMATE_STATUS: "COMMON-FORM.ESTIMATE-STATUS",
    MONTH_TOTAL: "COMMON-FORM.MONTH-TOTAL"
  }

  invForm?: UntypedFormGroup;
  searchFormSummary?: UntypedFormGroup;
  searchFormDetail?: UntypedFormGroup;
  customerCodeControlDetail = new UntypedFormControl();
  customerCodeControlSummary = new UntypedFormControl();
  branchCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();


  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  cvDS: CodeValuesDS;
  userDS: UserDS;
  teamDS: TeamDS;
  reportDS: ReportDS;

  distinctCustomerCodes: any;
  selectedEstimateItem?: SteamItem;
  selectedEstimateLabourCost?: number;
  repairTeamList: TeamItem[] = [];
  stmEstList: SteamItem[] = [];
  sotList: StoringOrderTankItem[] = [];
  customer_companyList_detail?: CustomerCompanyItem[];
  customer_companyList_summary?: CustomerCompanyItem[];
  surveyorList?: string[];
  branch_companyList?: CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];
  purposeOptionCvList: CodeValuesItem[] = [];
  eirStatusCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  tankStatusCvListDisplay: CodeValuesItem[] = [];
  repairTypeCvList: CodeValuesItem[] = [];
  estStatusCvList: CodeValuesItem[] = [];
  processStatusCvList: CodeValuesItem[] = [];

  processType: string = "STEAMING";
  billingParty: string = "CUSTOMER";

  pageIndex = 0;
  pageSize = 100;
  lastSearchCriteria: any;
  lastOrderBy: any = { create_dt: "DESC" };
  endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;
  selection = new GuidSelectionModel<SteamItem>(true, []);
  //selection = new SelectionModel<InGateCleaningItem>(true, []);
  invoiceNoControl = new FormControl('', [Validators.required]);
  invoiceDateControl = new FormControl('', [Validators.required]);
  invoiceTotalCostControl = new FormControl('0.00');
  noCond: boolean = false;
  isGeneratingReport = false;
  repData: any[] = [];
  monthList: string[] = [];
  yearList: string[] = [];
  today :Date =new Date();
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService
  ) {
    super();
    this.translateLangText();
    this.initSearchFormSummary();
    this.initSearchFormDetail();
    this.initInvoiceForm();
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.teamDS = new TeamDS(this.apollo);
    this.reportDS = new ReportDS(this.apollo);
    this.userDS = new UserDS(this.apollo);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;

  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.initializeValueChanges();
    // this.lastCargoControl = new UntypedFormControl('', [Validators.required, AutocompleteSelectionValidator(this.last_cargoList)]);
    this.loadData();

    // var autoSearch:boolean=true;
    // if(autoSearch) this.search_detail();
  }

  initInvoiceForm() {
    this.invForm = this.fb.group({
      inv_no: [''],
      inv_dt: ['']
    })
  }


  initSearchFormDetail() {
    this.searchFormDetail = this.fb.group(
      {
        tank_no: [''],
        eir_no: [''],
        customer_code: this.customerCodeControlDetail,
        repair_type: [''],
        surveyor: [''],
        est_dt_start: [''],
        est_dt_end: [''],
        est_status: [''],
      },
    );
  }

  initSearchFormSummary() {
    var thisYear = new Date().getFullYear();
    var thisMonth = new Date().toLocaleString("en-US", { month: "long" });
    this.searchFormSummary = this.fb.group(
      {
        customer_code: this.customerCodeControlSummary,
        repair_type: [''],
        surveyor: [''],
        month_start: [`${thisMonth}`],
        month_end: [`${thisMonth}`],
        year: [`${thisYear}`]
      },
    );
  }

  // Custom validator to check if min <= max
  minMaxDaysValidator(form: UntypedFormGroup) {

    const minControl = form.get('min_days');
    const maxControl = form.get('max_days');

    const min = minControl?.value;
    const max = maxControl?.value;

    if (min !== null && max !== null && min !== '' && max !== '' && min > max) {
      minControl?.setErrors({ invalidRange: true });
      maxControl?.setErrors({ invalidRange: true });
      return { invalidRange: true }; // Form-level error
    } else {
      minControl?.setErrors(null);
      maxControl?.setErrors(null);
      return null; // No error
    }
  }

  initializeValueChanges() {
    this.searchFormSummary!.get('surveyor')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (typeof value === 'string') {
          searchCriteria = value;
        }

        this.subs.sink = this.userDS.searchUser({ and: [{ userName: { contains: searchCriteria } }, { aspnetuserroles: { some: { aspnetroles: { Role: { eq: 'Surveyor' } } } } }] },
          { userName: 'ASC' }).subscribe(data => {
            this.surveyorList = data
              .map(u => u.userName)
              .filter((name): name is string => name !== undefined);

          });
      })
    ).subscribe();

    this.searchFormSummary!.get('customer_code')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        this.branch_companyList = [];
        this.branchCodeControl.reset('');
        if (typeof value === 'string') {
          searchCriteria = value;
        } else {
          searchCriteria = value.code;
        }
        this.subs.sink = this.ccDS.search({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
          this.customer_companyList_summary = data
          this.updateValidators(this.customerCodeControlSummary, this.customer_companyList_summary);

        });
      })
    ).subscribe();


    this.searchFormDetail!.get('surveyor')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (typeof value === 'string') {
          searchCriteria = value;
        }

        this.subs.sink = this.userDS.searchUser({ and: [{ userName: { contains: searchCriteria } }, { aspnetuserroles: { some: { aspnetroles: { Role: { eq: 'Surveyor' } } } } }] },
          { userName: 'ASC' }).subscribe(data => {
            this.surveyorList = data
              .map(u => u.userName)
              .filter((name): name is string => name !== undefined);

          });
      })
    ).subscribe();

    this.searchFormDetail!.get('customer_code')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        this.branch_companyList = [];
        this.branchCodeControl.reset('');
        if (typeof value === 'string') {
          searchCriteria = value;
        } else {
          searchCriteria = value.code;
        }
        this.subs.sink = this.ccDS.search({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
          this.customer_companyList_detail = data
          this.updateValidators(this.customerCodeControlDetail, this.customer_companyList_detail);
        });
      })
    ).subscribe();


  }


  public loadData() {
    var thisYear = new Date().getFullYear();
    var startYear = thisYear - 5;
    for (var i = startYear; i <= thisYear; i++) {
      this.yearList.push(i.toString());
    }
    this.monthList = Array.from({ length: 12 }, (_, i) =>
      new Date(2000, i, 1).toLocaleString("en-US", { month: "long" })
    );

    const queries = [
      // { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      // { alias: 'eirStatusCv', codeValType: 'EIR_STATUS' },
      // { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
      { alias: 'processStatusCv', codeValType: 'PROCESS_STATUS' },
      { alias: 'repairTypeCv', codeValType: 'REPAIR_OPTION' },
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('repairTypeCv').subscribe(data => {
      this.repairTypeCvList = data;
    });
    this.cvDS.connectAlias('processStatusCv').subscribe(data => {
      this.processStatusCvList = data;
    });

    const where: any = {
      and: [
        {
          department_cv: { eq: 'REPAIR' }
        },
        {
          or: [
            { delete_dt: { eq: null } },
            { delete_dt: { eq: 0 } }
          ]
        }
      ]
    };

    this.teamDS.loadItems(where, { description: "ASC" }, 100).subscribe(data => {
      this.repairTeamList = data;
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


  search_summary() {
    this.searchSummary();
  }

  search_detail() {
    // var repType:number = Number(this.searchForm?.get("report_type")?.value);
    this.searchDetail();
  }

  searchSummary() {

    var cond_counter = 1;
    let queryType = 1;
    const where: any = {};
    this.selectedEstimateItem = undefined;
    this.selectedEstimateLabourCost = 0;
    this.stmEstList = [];
    this.selection.clear();
    var date: string = '';
    var team: string = '';
    this.repData = [];

    //var invType: string = this.repairTypeCvList.find(i => i.code_val == (this.searchForm!.get('rep_type')?.value))?.description || '';

    // where.repair={some:{status_cv :{in:["JOB_IN_PROGRESS","ASSIGNED"]}},any:true};
    // if (this.searchForm!.get('tank_no')?.value) {
    //   where.tank_no = { contains: this.searchForm!.get('tank_no')?.value };
    //   cond_counter++;
    // }
    var searchFrm = this.searchFormSummary;
    if (searchFrm?.invalid) {
      if (!(searchFrm!.get('month_start')?.value)) {
        const requiredControl = searchFrm!.get('month_start');
        if (requiredControl) {
          requiredControl.setErrors({ required: true });
          requiredControl.markAsTouched();
        }
      }

      if (!(searchFrm!.get('month_end')?.value)) {
        const requiredControl = searchFrm!.get('month_end');
        if (requiredControl) {
          requiredControl.setErrors({ required: true });
          requiredControl.markAsTouched();
        }

      }

      if (!(searchFrm!.get('year')?.value)) {
        const requiredControl = searchFrm!.get('year');
        if (requiredControl) {
          requiredControl.setErrors({ required: true });
          requiredControl.markAsTouched();
        }

      }
    }

    this.isGeneratingReport = true;


    if (searchFrm!.get('customer_code')?.value) {
      // if(!where.storing_order_tank) where.storing_order_tank={};
      where.customer_code = `${searchFrm!.get('customer_code')?.value.code}`;
      cond_counter++;
    }

    if (searchFrm?.get('month_start')?.value) {
      var month = searchFrm?.get('month_start')?.value;

      const monthIndex = this.monthList.findIndex(m => month === m);
      where.start_month = (monthIndex + 1);
    }

    if (searchFrm?.get('month_end')?.value) {
      var month = searchFrm?.get('month_end')?.value;
      const monthIndex = this.monthList.findIndex(m => month === m);
      where.end_month = (monthIndex + 1);
    }


    if ((searchFrm!.get('surveyor')?.value)) {
      where.surveyor_name = `${searchFrm!.get('surveyor')?.value}`;
      cond_counter++;
    }

    if (searchFrm!.get('repair_type')?.value) {
      const repTypes = searchFrm!.get('repair_type')?.value;
      if (Array.isArray(repTypes)) {
        const repairTypes: string[] = repTypes.map(t => t.code_val);
        where.repair_type = repairTypes;
      }
    }
    if (searchFrm!.get('year')?.value) {
      where.year = Number(`${searchFrm!.get('year')?.value}`);
    }
    date = `${searchFrm?.get('month_start')?.value} - ${searchFrm?.get('month_end')?.value} ${searchFrm?.get('year')?.value}`;

    this.noCond = (cond_counter === 0);
    if (this.noCond) {
      this.isGeneratingReport = false;
      return;
    }

    this.lastSearchCriteria = where;

    this.performSearchSurveyorPerformanceSummary(this.pageSize, this.pageIndex, this.pageSize, undefined, undefined, undefined, queryType, date, team);
  }

  searchDetail() {

    var cond_counter = 1;
    let queryType = 1;
    const where: any = {};
    this.selectedEstimateItem = undefined;
    this.selectedEstimateLabourCost = 0;
    this.stmEstList = [];
    this.selection.clear();
    var date: string = '';
    var team: string = '';
    this.repData = [];

    //var invType: string = this.repairTypeCvList.find(i => i.code_val == (this.searchForm!.get('rep_type')?.value))?.description || '';

    // where.repair={some:{status_cv :{in:["JOB_IN_PROGRESS","ASSIGNED"]}},any:true};
    // if (this.searchForm!.get('tank_no')?.value) {
    //   where.tank_no = { contains: this.searchForm!.get('tank_no')?.value };
    //   cond_counter++;
    // }
    var searchFrm = this.searchFormDetail;
    if (searchFrm?.invalid) {
      if (!(searchFrm!.get('est_dt_start')?.value) || !(searchFrm!.get('est_dt_end')?.value)) {
        const requiredControl = searchFrm!.get('est_dt_start');
        if (requiredControl) {
          requiredControl.setErrors({ required: true });
          requiredControl.markAsTouched();
        }
      }
      return;
    }

    this.isGeneratingReport = true;
    if (searchFrm!.get('tank_no')?.value) {
      // if(!where.storing_order_tank) where.storing_order_tank={};
      where.tank_no = `${searchFrm!.get('tank_no')?.value}`;
      cond_counter++;
    }

    if (searchFrm!.get('customer_code')?.value) {
      // if(!where.storing_order_tank) where.storing_order_tank={};
      where.customer_code = `${searchFrm!.get('customer_code')?.value.code}`;
      cond_counter++;
    }

    if (searchFrm!.get('eir_no')?.value) {
      // if(!where.storing_order_tank) where.storing_order_tank={};
      where.eir_no = `${searchFrm!.get('eir_no')?.value}`;
      cond_counter++;
    }

    if ((searchFrm!.get('est_dt_start')?.value) && (searchFrm!.get('est_dt_end')?.value)) {
      var start_dt = new Date(searchFrm!.value['est_dt_start']);
      var end_dt = new Date(searchFrm!.value['est_dt_end']);
      where.start_date = Utility.convertDate(start_dt);
      where.end_date = Utility.convertDate(end_dt, true);
      date = `${Utility.convertDateToStr(start_dt)} - ${Utility.convertDateToStr(end_dt)}`
      cond_counter++;
    }
    if ((searchFrm!.get('surveyor')?.value)) {
      where.surveyor_name = `${searchFrm!.get('surveyor')?.value}`;
      cond_counter++;
    }

    if (searchFrm!.get('repair_type')?.value) {
      const repTypes = searchFrm!.get('repair_type')?.value;
      if (Array.isArray(repTypes)) {
        const repairTypes: string[] = repTypes.map(t => t.code_val);
        where.repair_type = repairTypes;
      }
    }

    if (searchFrm!.get('est_status')?.value) {
      const estStatus = searchFrm!.get('est_status')?.value;
      if (Array.isArray(estStatus)) {
        const EstStatus: string[] = estStatus.map(t => t.code_val);
        where.estimate_status = EstStatus;
      }
    }

    this.noCond = (cond_counter === 0);
    if (this.noCond) {
      this.isGeneratingReport = false;
      return;
    }

    this.lastSearchCriteria = where;
    this.performSearchSurveyorPerformanceDetail(this.pageSize, this.pageIndex, this.pageSize, undefined, undefined, undefined, queryType, date, team);
  }

  performSearchSurveyorPerformanceSummary(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number,
    before?: string, queryType?: number, date?: string, team?: string) {

    // if(queryType==1)
    // {
    this.subs.sink = this.reportDS.searchAdminReportSurveyorPerformanceSummary(this.lastSearchCriteria)
      .subscribe(data => {
        if (data) {
          this.repData = [data];
          this.onExportSurveyorPerformanceSummaryReport(this.repData, date!, team!);
        }
        else {
          this.isGeneratingReport = false
        }

      });


  }

  performSearchSurveyorPerformanceDetail(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number,
    before?: string, queryType?: number, date?: string, team?: string) {

    // if(queryType==1)
    // {
    this.subs.sink = this.reportDS.searchAdminReportSurveyorPerformanceDetail(this.lastSearchCriteria)
      .subscribe(data => {
        if (data.length > 0) {
          this.repData = data;
          this.onExportSurveyorPerformanceDetialReport(this.repData, date!, team!);
        }
        else {
          this.isGeneratingReport = false
        }

      });


  }


  onPageEvent(event: PageEvent) {
    const { pageIndex, pageSize } = event;
    let first: number | undefined = undefined;
    let after: string | undefined = undefined;
    let last: number | undefined = undefined;
    let before: string | undefined = undefined;

    // Check if the page size has changed
    if (this.pageSize !== pageSize) {
      // Reset pagination if page size has changed
      this.pageIndex = 0;
      first = pageSize;
      after = undefined;
      last = undefined;
      before = undefined;
    } else {
      if (pageIndex > this.pageIndex && this.hasNextPage) {
        // Navigate forward
        first = pageSize;
        after = this.endCursor;
      } else if (pageIndex < this.pageIndex && this.hasPreviousPage) {
        // Navigate backward
        last = pageSize;
        before = this.startCursor;
      }
    }

    // this.performSearch(pageSize, pageIndex, first, after, last, before);
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} - ${cc.name}` : '';
  }

  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
  }

  displayReleaseDate(sot: StoringOrderTankItem) {
    let retval: string = "-";
    if (sot.out_gate?.length) {
      if (sot.out_gate[0]?.out_gate_survey) {
        const date = new Date(sot.out_gate[0]?.out_gate_survey?.create_dt! * 1000);

        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();

        // Replace the '/' with '-' to get the required format


        return `${day}/${month}/${year}`;
      }

    }
    return retval;
  }

  displayTankPurpose(sot: StoringOrderTankItem) {
    return this.sotDS.displayTankPurpose(sot, this.getPurposeOptionDescription.bind(this));
  }

  getPurposeOptionDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.purposeOptionCvList);
  }

  getTankStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.tankStatusCvListDisplay);
  }

  displayDate(input: number | undefined): string | undefined {
    if (input === null) return "-";
    return Utility.convertEpochToDateStr(input);
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  updateValidators(untypedFormControl: UntypedFormControl, validOptions: any[]) {
    untypedFormControl.setValidators([
      AutocompleteSelectionValidator(validOptions)
    ]);
  }

  resetDialog(event: Event, report_type: number) {
    event.preventDefault(); // Prevents the form submission

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    if (report_type === 1) {
      this.resetFormSummary();
    }
    else {
      this.resetFormDetail();
    }
  }


  resetFormSummary() {
    var thisYear = new Date().getFullYear().toString();
    var thisMonth = new Date().toLocaleString("en-US", { month: "long" });
    this.searchFormSummary?.patchValue({
      repair_type: '',
      month_start: thisMonth,
      month_end: thisMonth,
      surveyor: '',
      year: thisYear,
    });
    this.customerCodeControlSummary.reset('');
    this.noCond = false;
  }

  resetFormDetail() {
    var thisYear = new Date().getFullYear().toString();
    var thisMonth = new Date().toLocaleString("en-US", { month: "long" });
    this.searchFormDetail?.patchValue({
      repair_type: '',
      tank_no: '',
      eir_no: '',
      est_dt_start: '',
      est_dt_end: '',
      surveyor: '',
      year: thisYear,
      est_status: ''
    });
    this.customerCodeControlDetail.reset('');
    this.noCond = false;
  }


  AllowToSave(): boolean {
    let retval: boolean = false;
    if (this.selection.selected.length > 0) {
      if (this.invoiceDateControl.valid && this.invoiceNoControl.valid) {
        return true;
      }
    }

    return retval;
  }


  onExportSurveyorPerformanceSummaryReport(repData: SurveyorPerformanceSummary[], date: string, team: string) {
    //this.preventDefault(event);
    let cut_off_dt = new Date();

    if (repData?.length <= 0) {
      this.isGeneratingReport = false;
      return;

    }
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(SurveyorPerformanceSummaryPdfComponent, {
      width: reportPreviewWindowDimension.landscape_width_rate,
      maxWidth: reportPreviewWindowDimension.landscape_maxWidth,
      maxHeight: reportPreviewWindowDimension.report_maxHeight,
      data: {
        repData: repData,
        date: date,
        team: team

      },
      // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      this.isGeneratingReport = false;
    });
  }

  onExportSurveyorPerformanceDetialReport(repData: DailyQCDetail[], date: string, team: string) {
    //this.preventDefault(event);
    let cut_off_dt = new Date();

    if (repData?.length <= 0) {
      this.isGeneratingReport = false;
      return;

    }
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(SurveyorDetailPerformancePdfComponent, {
      width: reportPreviewWindowDimension.landscape_width_rate,
      maxWidth: reportPreviewWindowDimension.landscape_maxWidth,
      maxHeight: reportPreviewWindowDimension.report_maxHeight,
      data: {
        repData: repData,
        date: date,
        team: team

      },
      // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      this.isGeneratingReport = false;
    });
  }

  isDateRequired(date_type: string): boolean {
    var retval: boolean = true;
    // var repType:number = Number(this.searchForm?.get("report_type")?.value);
    // if(date_type=="APPROVED")
    // {
    //   return [2].includes(repType);
    // }
    // else if(date_type=="QC")
    // {

    //   return [1,3].includes(repType);
    // }

    return retval;

  }

  onReportTypeChange(event: Event) {
    // var startDateControl = this.searchForm?.get('qc_dt')!;
    //startDateControl?.markAsUntouched();
    // startDateControl.setErrors(null);
    // if(this.isDateRequired('QC'))
    //   {
    //   startDateControl.setValidators([Validators.required]); // Reapply required validator
    //   startDateControl.updateValueAndValidity(); // Refresh validation state
    //   }
    //startDateControl = this.searchForm?.get('app_dt')!;
    //startDateControl?.markAsUntouched();
    // startDateControl.setErrors(null);
    // if(this.isDateRequired('APPROVED'))
    // {
    //   startDateControl.setValidators([Validators.required]); // Reapply required validator
    //   startDateControl.updateValueAndValidity(); // Refresh validation state
    // }
  }

  AllowToSearch(): boolean {
    var bAllow: boolean = true;


    if (this.searchFormSummary?.get('month_start')?.value) {
      var month_start = this.searchFormSummary?.get('month_start')?.value;
      const monthStartIndex = this.monthList.findIndex(m => month_start === m);
      month_start = (monthStartIndex + 1);

      if (this.searchFormSummary?.get('month_end')?.value) {

        var month_end = this.searchFormSummary?.get('month_end')?.value;
        const monthEndIndex = this.monthList.findIndex(m => month_end === m);
        month_end = (monthEndIndex + 1);

        if (this.searchFormSummary?.get('year')?.value) {
          var year = Number(this.searchFormSummary?.get('year')?.value);
          bAllow = !Utility.isSelectedDateGreaterThanToday(month_start, year);
          if (bAllow) {
            bAllow = !Utility.isSelectedDateGreaterThanToday(month_end, year);
            if (bAllow) {
              bAllow = month_start <= month_end;
            }
          }
        }
      }
    }

    return bAllow;

  }
  onTabFocused() {
    this.resetFormSummary();
    this.resetFormDetail();
  }

}