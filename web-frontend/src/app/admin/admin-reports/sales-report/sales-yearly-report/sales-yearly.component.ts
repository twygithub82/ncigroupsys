import { Direction } from '@angular/cdk/bidi';
import { CommonModule, NgClass } from '@angular/common';
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
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { AdminReportMonthlyReport, AdminReportYearlyReport, AdminReportYearlySalesReport, daily_inventory_summary, ReportDS } from 'app/data-sources/reports';
import { SteamItem } from 'app/data-sources/steam';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';

import { MonthlyReportDetailsPdfComponent } from 'app/document-template/pdf/admin-reports/monthly/details/monthly-details-pdf.component';
import { MonthlyChartPdfComponent } from 'app/document-template/pdf/admin-reports/monthly/overview/monthly-chart-pdf.component';
import { YearlySalesReportDetailsPdfComponent } from 'app/document-template/pdf/admin-reports/sales/yearly/yearly-details-pdf.component';
import { ModulePackageService } from 'app/services/module-package.service';
import { Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { reportPreviewWindowDimension } from 'environments/environment';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { ManagementReportDS, ManagementReportYearlyRevenueItem } from 'app/data-sources/reports-management';
@Component({
  selector: 'app-sales-yearly',
  standalone: true,
  templateUrl: './sales-yearly.component.html',
  styleUrl: './sales-yearly.component.scss',
  imports: [
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
    MatSlideToggleModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class SalesYearlyAdminReportComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
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
    INVENTORY_DATE: 'COMMON-FORM.INVENTORY-DATE',
    INVENTORY_TYPE: 'COMMON-FORM.INVENTORY-TYPE',
    SUMMARY_REPORT: 'COMMON-FORM.SUMMARY-REPORT',
    DETAIL_REPORT: 'COMMON-FORM.DETAIL-REPORT',
    ONE_CONDITION_NEEDED: 'COMMON-FORM.ONE-CONDITION-NEEDED',
    OVERVIEW_SUMMARY: 'COMMON-FORM.OVERVIEW-SUMMARY',
    DETAIL_SUMMARY: 'COMMON-FORM.DETAIL-SUMMARY',
    LOCATION: 'COMMON-FORM.LOCATION',
    YEAR: 'COMMON-FORM.YEAR',
    MONTH: 'COMMON-FORM.MONTH',
    TYPE: 'COMMON-FORM.TYPE',
    MONTH_START: 'COMMON-FORM.MONTH-START',
    MONTH_END: 'COMMON-FORM.MONTH-END',
  }

  invForm?: UntypedFormGroup;
  searchForm?: UntypedFormGroup;
  customerCodeControl = new UntypedFormControl();
  branchCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();


  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  cvDS: CodeValuesDS;
  tcDS: TariffCleaningDS;


  // reportDS: ManagementReportDS;
 reportDS: ReportDS;
  distinctCustomerCodes: any;
  selectedEstimateItem?: SteamItem;
  selectedEstimateLabourCost?: number;
  stmEstList: SteamItem[] = [];
  sotList: StoringOrderTankItem[] = [];
  dailySumList: daily_inventory_summary[] = [];
  customer_companyList?: CustomerCompanyItem[];
  branch_companyList?: CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];
  purposeOptionCvList: CodeValuesItem[] = [];
  eirStatusCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  tankStatusCvListDisplay: CodeValuesItem[] = [];
  costTypeCvList: CodeValuesItem[] = [];

  processType: string = "";
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
  yearList: string[] = [];
  monthList: string[] = [];
  repData: any;
//  invTypes: string[] =  ["ALL", "IN_OUT", "PREINSPECTION","LOLO", "STORAGE","STEAMING",  "RESIDUE", "CLEANING", "REPAIR"]
  invTypes: string[] =  ["ALL", "IN_OUT", "PREINSPECTION","LOLO", "STEAMING",  "RESIDUE", "CLEANING", "REPAIR"]

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private modulePackageService: ModulePackageService
  ) {
    super();
    this.translateLangText();
    this.initSearchForm();
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);

    this.sotDS = new StoringOrderTankDS(this.apollo);
    //this.reportDS = new ManagementReportDS(this.apollo);
    this.reportDS = new ReportDS(this.apollo);
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

  }


  initSearchForm() {
    var date = new Date();
    var thisYear = date.getFullYear().toString();
    var thisMonth = date.toLocaleString("en-US", { month: "long" });
    date.setMonth(date.getMonth() - 1);
    var LastMonth = date.toLocaleString("en-US", { month: "long" });
    this.searchForm = this.fb.group({
      customer_code: this.customerCodeControl,
      year: [`${thisYear}`],
      month_start: [`${thisMonth}`],
      month_end: [`${thisMonth}`],
      cost_type: ['']
    });
  }

  initializeValueChanges() {
    this.searchForm!.get('customer_code')!.valueChanges.pipe(
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
          this.customer_companyList = data
          this.updateValidators(this.customerCodeControl, this.customer_companyList);

        });
      })
    ).subscribe();

  }

  public loadData() {
    const queries = [
      // { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      // { alias: 'eirStatusCv', codeValType: 'EIR_STATUS' },
      // { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
      { alias: 'salesCostTypeCv', codeValType: 'SALES_COST_TYPE' },
      { alias: 'inventoryTypeCv', codeValType: 'INVENTORY_TYPE' },
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('inventoryTypeCv').subscribe(data => {
      if(this.modulePackageService.isStarterPackage())
      {
        data = data.filter(c=>c.code_val != "RESIDUE" && c.code_val != "STEAMING");
        this.invTypes =this.invTypes.filter(c=>c != "RESIDUE" && c != "STEAMING");
      }
      this.costTypeCvList = addDefaultSelectOption(data, 'All', "ALL");
       this.costTypeCvList.sort((a, b) => {
        const indexA = this.invTypes.indexOf(a.code_val!);
        const indexB = this.invTypes.indexOf(b.code_val!);

        // Put missing values at the end
        return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
      });
      var allType = this.costTypeCvList.find(c => c.code_val == 'ALL');
      this.searchForm?.patchValue({
        cost_type: allType
      });
      //this.costTypeCvList = addDefaultSelectOption(data, 'All');
    });
    var thisYear = new Date().getFullYear();
    var startYear = thisYear - 5;
    for (var i = startYear; i <= thisYear; i++) {
      this.yearList.push(i.toString());
    }
    this.monthList = Array.from({ length: 12 }, (_, i) =>
      new Date(2000, i, 1).toLocaleString("en-US", { month: "long" })
    );

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


  search_overview_summary() {
    this.search(1);
  }

  search_detail_summary() {
    this.search(2);
  }
  search_detail() {
    this.search(3);
  }

  search(report_type: number) {
     if (this.searchForm?.invalid) return;
    this.isGeneratingReport = true;
    var cond_counter = 0;
    let queryType = 1;
    const where: any = {};
    let reportType = "";
    let repName="";
    //let processType=this.processType;



    var customerName: string = "";
    var invTypes = this.invTypes.filter(v => v !== "ALL");
    //where.revenue_type = invTypes;
    where.report_type=invTypes;
    if (this.searchForm?.get('cost_type')?.value.code_val != "ALL") {
      where.report_type = [this.searchForm?.get('cost_type')?.value.code_val];
      invTypes = [this.searchForm?.get('cost_type')?.value.code_val];
       repName=this.searchForm?.get('cost_type')?.value.description;
    }

    // if(invTypes.includes("IN_OUT"))
    //   {
    //     where.inventory_type= invTypes;
    //     where.inventory_type.push("DEPOT");
    //   }

    // where.report_format_type="MONTH_WISE";
    // if (this.searchForm?.get('report_type')?.value) {
    //   // if(!where.storing_order_tank) where.storing_order_tank={};
    //   where.report_format_type = `${this.searchForm!.get('report_type')?.value.code_val}`;
    //   reportType = `${this.searchForm!.get('report_type')?.value.description}`;
    //   cond_counter++;
    // }



    if (this.searchForm?.get('customer_code')?.value) {
      // if(!where.storing_order_tank) where.storing_order_tank={};
      where.customer_code = `${this.searchForm!.get('customer_code')?.value.code}`;
      customerName = `${this.searchForm!.get('customer_code')?.value.name}`;
      cond_counter++;
    }

    var date: string = `${this.searchForm?.get('month_start')?.value} - ${this.searchForm?.get('month_end')?.value} ${this.searchForm?.get('year')?.value}`;
    // if (this.searchForm!.get('inv_dt_start')?.value && this.searchForm!.get('inv_dt_end')?.value) {
    if (this.searchForm?.get('month_start')?.value) {
      var month = this.searchForm?.get('month_start')?.value;
      const monthIndex = this.monthList.findIndex(m => month === m);
      where.start_month = (monthIndex + 1);
    }

    if (this.searchForm?.get('month_end')?.value) {
      var month = this.searchForm?.get('month_end')?.value;
      const monthIndex = this.monthList.findIndex(m => month === m);
      where.end_month = (monthIndex + 1);
    }

    if (this.searchForm?.get('year')?.value) {
      where.year = Number(this.searchForm?.get('year')?.value);
    }

    cond_counter++;
    //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };


    this.lastSearchCriteria = where;
    this.performSearch(report_type, date, customerName, reportType, invTypes,repName);
    // if (this.searchForm?.invalid) return;
    // this.isGeneratingReport = true;
    // var cond_counter = 0;
    // let queryType = 1;
    // const where: any = {};
    // //let processType=this.processType;

    // where.report_type = ["LOLO", "PREINSPECTION", "CLEANING", "STEAMING", "REPAIR", "RESIDUE", "GATE"];
    // if (this.searchForm?.get('cost_type')?.value.code_val !== 'ALL') {
    //   this.processType = this.searchForm?.get('cost_type')?.value.code_val;
    //   where.report_type = [this.searchForm?.get('cost_type')?.value.code_val];
    // }

    // var customerName = "";

    // if (this.searchForm?.get('customer_code')?.value) {
    //   // if(!where.storing_order_tank) where.storing_order_tank={};
    //   where.customer_code = `${this.searchForm!.get('customer_code')?.value.code}`;
    //   customerName = `${this.searchForm!.get('customer_code')?.value.name}`;
    //   cond_counter++;
    // }

    // var date: string = `${this.searchForm?.get('month_start')?.value} - ${this.searchForm?.get('month_end')?.value}  ${this.searchForm?.get('year')?.value}`;
    // if (this.searchForm?.get('month_start')?.value === this.searchForm?.get('month_end')?.value){
    //   date = `${this.searchForm?.get('month_end')?.value}  ${this.searchForm?.get('year')?.value}`;
    // }
    
    // // if (this.searchForm!.get('inv_dt_start')?.value && this.searchForm!.get('inv_dt_end')?.value) {
    // if (this.searchForm?.get('month_start')?.value) {
    //   var month = this.searchForm?.get('month_start')?.value;
    //   const monthIndex = this.monthList.findIndex(m => month === m);
    //   where.start_month = (monthIndex + 1);
    // }

    // if (this.searchForm?.get('month_end')?.value) {
    //   var month = this.searchForm?.get('month_end')?.value;
    //   const monthIndex = this.monthList.findIndex(m => month === m);
    //   where.end_month = (monthIndex + 1);
    // }

    // if (this.searchForm?.get('year')?.value) {
    //   where.year = Number(this.searchForm?.get('year')?.value);
    // }


    // cond_counter++;
    // //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };


    // this.lastSearchCriteria = where;
    // this.performSearch(report_type, date, customerName);
  }

  performSearch(reportType?: number, date?: string, customerName?: string, report_type?: string, invTypes?: string[],reportName?:string) {
    var reportDS:any = this.reportDS;
    // if(queryType==1)
    // {
   // this.subs.sink = this.reportDS.searchManagementReportRevenueYearlyReport(this.lastSearchCriteria)
    this.subs.sink = reportDS.searchAdminReportYearlySales(this.lastSearchCriteria)
      .subscribe((data :any) => {
        this.repData = data;
        this.ProcessYearlySalesReport(this.repData, date!, customerName!, report_type!, invTypes!,reportName);
      });


  }


  performSearch1(reportType?: number, date?: string, customerName?: string) {
    var reportDS:any = this.reportDS;
    // if(queryType==1)
    // {
    this.subs.sink = reportDS.searchAdminReportYearlySales(this.lastSearchCriteria)
      .subscribe((data :any) => {
        this.repData = data;
      //  this.ProcessYearlySalesReport(this.repData, date!, reportType!, customerName!);
        // this.endCursor = this.stmDS.pageInfo?.endCursor;
        // this.startCursor = this.stmDS.pageInfo?.startCursor;
        // this.hasNextPage = this.stmDS.pageInfo?.hasNextPage ?? false;
        // this.hasPreviousPage = this.stmDS.pageInfo?.hasPreviousPage ?? false;
        // this.ProcessReportCustomerInventory(invType!, date!, report_type!, queryType!,tnxType!);
      });
    // this.pageSize = pageSize;
    // this.pageIndex = pageIndex;
  }

  displayCostTypeFn(cs: CodeValuesItem): string {
    return cs.description || '';
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} - ${cc.name}` : '';
  }

  getTankStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.tankStatusCvListDisplay);
  }

  displayDate(input: number | undefined): string | undefined {
    if (input === null) return "-";
    return Utility.convertEpochToDateStr(input);
  }

  onPageEvent(event: PageEvent) {

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

  resetDialog(event: Event) {
    event.preventDefault(); // Prevents the form submission

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    this.resetForm();
  }

  resetForm() {

    var date = new Date();

    var thisYear = date.getFullYear().toString();
    var thisMonth = date.toLocaleString("en-US", { month: "long" });
    date.setMonth(date.getMonth() - 1);
    var LastMonth = date.toLocaleString("en-US", { month: "long" });
    this.searchForm?.patchValue({
      year: thisYear,
      month_start: thisMonth,
      month_end: thisMonth,
      cost_type: this.costTypeCvList.find(c => c.code_val == 'ALL')
    });
    this.customerCodeControl.reset('');

    this.noCond = false;
  }

  isAllSelected() {
    // this.calculateTotalCost();
    const numSelected = this.selection.selected.length;
    const numRows = this.stmEstList.length;
    return numSelected === numRows;
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

  ProcessReportDailySummaryDetail(invType: string, date: string, report_type: number, queryType: number) {
    if (this.dailySumList.length === 0) return;

  }

  ProcessYearlySalesReport1(repData: AdminReportMonthlyReport, date: string, report_type: number, customerName: string) {



    // if (repData) {
    //   if (report_type == 1) {
    //     this.onExportChart_r1(repData, date, customerName);
    //   }
    //   else if (report_type == 2) {
    //     this.onExportSummary(repData, date, customerName);
    //   }
    //   else if (report_type == 3) {
    //     this.onExportDetail(repData, date, customerName);
    //   }

    // }
    // else {
    //   this.sotList = [];
    //   this.isGeneratingReport = false;
    // }


  }

  onExportDetail(repData: AdminReportYearlySalesReport, date: string, customerName: string,report_type: string, invTypes: string[],reportName?:string) {
    //this.preventDefault(event);
    let cut_off_dt = new Date();


    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(YearlySalesReportDetailsPdfComponent, {
      width: reportPreviewWindowDimension.portrait_width_rate,
      maxWidth: reportPreviewWindowDimension.portrait_maxWidth,
      maxHeight: reportPreviewWindowDimension.report_maxHeight,
      data: {
        repData: repData,
        date: date,
        repType: this.processType,
        customer: customerName,
        inventory_type: invTypes,
        report_name:reportName

      },

      // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });

    dialogRef.updatePosition({
      top: '-9999px',  // Move far above the screen
      left: '-9999px'  // Move far to the left of the screen
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      this.isGeneratingReport = false;
    });
  }


  onExportSummary(repData: AdminReportMonthlyReport, date: string, customerName: string) {
    //this.preventDefault(event);
    let cut_off_dt = new Date();


    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(MonthlyReportDetailsPdfComponent, {
      width: reportPreviewWindowDimension.portrait_width_rate,
      maxWidth: reportPreviewWindowDimension.portrait_maxWidth,
      maxHeight: reportPreviewWindowDimension.report_maxHeight,
      data: {
        repData: repData,
        date: date,
        repType: this.processType,
        customer: customerName,

      },

      // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });

    dialogRef.updatePosition({
      top: '-9999px',  // Move far above the screen
      left: '-9999px'  // Move far to the left of the screen
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      this.isGeneratingReport = false;
    });
  }

  onExportChart_r1(repData: AdminReportMonthlyReport, date: string, customerName: string) {
    //this.preventDefault(event);
    let cut_off_dt = new Date();


    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(YearlySalesReportDetailsPdfComponent, {
      width: reportPreviewWindowDimension.portrait_width_rate,
      maxWidth: reportPreviewWindowDimension.portrait_maxWidth,
      maxHeight: reportPreviewWindowDimension.report_maxHeight,
      data: {
        repData: repData,
        date: date,
        repType: this.processType,
        customer: customerName,

      },

      // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });

    dialogRef.updatePosition({
      top: '-9999px',  // Move far above the screen
      left: '-9999px'  // Move far to the left of the screen
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      this.isGeneratingReport = false;
    });
  }

  AllowToSearch(): boolean {
    var bAllow: boolean = true;


    if (this.searchForm?.get('month_start')?.value) {
      var month_start = this.searchForm?.get('month_start')?.value;
      const monthStartIndex = this.monthList.findIndex(m => month_start === m);
      month_start = (monthStartIndex + 1);

      if (this.searchForm?.get('month_end')?.value) {

        var month_end = this.searchForm?.get('month_end')?.value;
        const monthEndIndex = this.monthList.findIndex(m => month_end === m);
        month_end = (monthEndIndex + 1);

        if (this.searchForm?.get('year')?.value) {
          var year = Number(this.searchForm?.get('year')?.value);
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
    this.resetForm();
  }


   ZeroTransaction(data: AdminReportYearlySalesReport): boolean {
      var retval: boolean = true;
      // if (data) {
      //   retval = ((data.cleaning_yearly_revenue?.average_cost||0) == 0) &&
      //     ((data.gate_yearly_revenue?.average_cost||0) == 0) &&
      //     ((data.lolo_yearly_revenue?.average_cost||0) == 0) &&
      //     ((data.preinspection_yearly_revenue?.average_cost||0) == 0) &&
      //     ((data.repair_yearly_revenue?.average_cost||0) == 0) &&
      //     ((data.residue_yearly_revenue?.average_cost||0) == 0) &&
      //     ((data.steam_yearly_revenue?.average_cost||0) == 0) &&
      //     ((data.storage_yearly_revenue?.average_cost||0) == 0)
      // }
         if (data) {
        retval = ((data.cleaning_yearly_sales?.average_cost||0) == 0) &&
          // ((data.g?.average_cost||0) == 0) &&
          ((data.lolo_yearly_sales?.average_cost||0) == 0) &&
          ((data.preinspection_yearly_sales?.average_cost||0) == 0) &&
          ((data.repair_yearly_sales?.average_cost||0) == 0) &&
          ((data.residue_yearly_sales?.average_cost||0) == 0) &&
          ((data.steaming_yearly_sales?.average_cost||0) == 0) 
          // &&  ((data.storage_yearly_revenue?.average_cost||0) == 0)
      }
      return retval;
    }

  ProcessYearlySalesReport(repData: AdminReportYearlySalesReport, date: string, customerName: string,
     report_type: string, invTypes: string[],reportName?:string) {



    if (!this.ZeroTransaction(repData)) {

      this.onExportDetail(repData, date, customerName, report_type, invTypes, reportName);


    }
    else {
      this.repData = [];
      this.isGeneratingReport = false;
    }


  }

   onExportChart_r2(repData: ManagementReportYearlyRevenueItem, date: string, customerName: string, report_type: string, invTypes: string[]) {
      //this.preventDefault(event);
      let cut_off_dt = new Date();
  
  
      let tempDirection: Direction;
      if (localStorage.getItem('isRtl') === 'true') {
        tempDirection = 'rtl';
      } else {
        tempDirection = 'ltr';
      }
  
      const dialogRef = this.dialog.open(YearlySalesReportDetailsPdfComponent, {
        width: reportPreviewWindowDimension.portrait_width_rate,
        maxWidth: reportPreviewWindowDimension.portrait_maxWidth,
        maxHeight: reportPreviewWindowDimension.report_maxHeight,
        data: {
          repData: repData,
          date: date,
          repType: report_type,
          customer: customerName,
          inventory_type: invTypes
  
  
        },
  
        // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
        direction: tempDirection
      });
  
      dialogRef.updatePosition({
        top: '-9999px',  // Move far above the screen
        left: '-9999px'  // Move far to the left of the screen
      });
  
      this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
        this.isGeneratingReport = false;
      });
    }
    
}