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
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { GuidSelectionModel } from '@shared/GuidSelectionModel';
import { Apollo } from 'apollo-angular';
import { BillingDS } from 'app/data-sources/billing';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { PackageLabourDS } from 'app/data-sources/package-labour';
import { AdminReportMonthlyReport, daily_inventory_summary, report_customer_inventory, report_inventory_yard, ReportDS } from 'app/data-sources/reports';
import { SteamDS, SteamItem } from 'app/data-sources/steam';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { DailyDetailInventoryPdfComponent } from 'app/document-template/pdf/inventory/daily-detail-pdf/daily-detail-pdf.component';
import { DailyOverviewSummaryPdfComponent } from 'app/document-template/pdf/inventory/daily-overview-summary-pdf/daily-overview-summary-pdf.component';

import { MonthlyReportDetailsPdfComponent } from 'app/document-template/pdf/admin-reports/monthly/details/monthly-details-pdf.component';
import { Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { reportPreviewWindowDimension } from 'environments/environment';
import { MonthlyChartPdfComponent } from 'app/document-template/pdf/admin-reports/monthly/overview/monthly-chart-pdf.component';
import { YearlyChartPdfComponent } from 'app/document-template/pdf/admin-reports/yearly/overview/yearly-chart-pdf.component';
import { YearlyReportDetailsPdfComponent } from 'app/document-template/pdf/admin-reports/yearly/details/yearly-details-pdf.component';
import { ManagementReportDS } from 'app/data-sources/reports-management';

@Component({
  selector: 'app-revenue-monthly',
  standalone: true,
  templateUrl: './revenue-monthly.component.html',
  styleUrl: './revenue-monthly.component.scss',
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
  ]
})
export class RevenueMonthlyAdminReportComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
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
    CANCELED_SUCCESS: 'COMMON-FORM.CANCELED-SUCCESS',
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
    SAVE_SUCCESS: 'COMMON-FORM.SAVE-SUCCESS',
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
    OVERVIEW_SUMMARY:'COMMON-FORM.OVERVIEW-SUMMARY',
    DETAIL_SUMMARY:'COMMON-FORM.DETAIL-SUMMARY',
    LOCATION:'COMMON-FORM.LOCATION',
    YEAR:'COMMON-FORM.YEAR',
    MONTH:'COMMON-FORM.MONTH',
    MONTH_START:'COMMON-FORM.MONTH-START',
    MONTH_END:'COMMON-FORM.MONTH-END',


    
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

 
  reportDS:ManagementReportDS;

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
  inventoryTypeCvList: CodeValuesItem[] = [];

  processType: string = "REPAIR";
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
  isGeneratingReport =false;
  yearList:string[]=[];
  monthList:string[]=[];
  repData:any;
  invTypes:string[]=["ALL","STEAMING","CLEANING","IN_OUT","REPAIR"];
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
    this.initSearchForm();
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);
    
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.reportDS=new ManagementReportDS(this.apollo);
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
    var thisYear = new Date().getFullYear();
    var thisMonth= new Date().toLocaleString("en-US",{month:"long"});
    this.searchForm = this.fb.group({
      customer_code: this.customerCodeControl,
      year: [`${thisYear}`],
      month_start: [`${thisMonth}`],
      month_end: [`${thisMonth}`],
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
          // if (!this.customerCodeControl.invalid) {
          //   if (this.customerCodeControl.value?.guid) {
          //     let mainCustomerGuid = this.customerCodeControl.value.guid;
          //     this.ccDS.search({ main_customer_guid: { eq: mainCustomerGuid } }).subscribe(data => {
          //       this.branch_companyList = data;
          //       this.updateValidators(this.branchCodeControl, this.branch_companyList);
          //     });
          //   }
          // }
        });
      })
    ).subscribe();

  }

  public loadData() {
    // const queries = [
    //   // { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
    //   // { alias: 'eirStatusCv', codeValType: 'EIR_STATUS' },
    //   // { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
    //   { alias: 'inventoryTypeCv', codeValType: 'INVENTORY_TYPE' },
    // ];
    // this.cvDS.getCodeValuesByType(queries);
    // this.cvDS.connectAlias('inventoryTypeCv').subscribe(data => {
    //   this.inventoryTypeCvList = addDefaultSelectOption(data, 'All');;
    // });
    var thisYear = new Date().getFullYear();
    var startYear = thisYear-5;
    for(var i=startYear ; i<=thisYear;i++)
    {
      this.yearList.push(i.toString());
    }
    this.monthList=Array.from({ length: 12 }, (_, i) =>
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
    if(this.searchForm?.invalid) return;
    this.isGeneratingReport=true;
    var cond_counter = 0;
    let queryType = 1;
    const where: any = {};
    //let processType=this.processType;

   

      var customerName:string="";
      where.revenue_type =this.invTypes.filter(v => v !== "ALL");
      if(this.searchForm?.get('report_type')?.value!="ALL")
      {
        where.revenue_type =this.searchForm?.get('report_type')?.value;
      }
      
      if (this.searchForm?.get('customer_code')?.value) {
        // if(!where.storing_order_tank) where.storing_order_tank={};
        where.customer_code = `${this.searchForm!.get('customer_code')?.value.code}`;
        customerName= `${this.searchForm!.get('customer_code')?.value.name}`;
        cond_counter++;
      }
      
      var date: string = `${this.searchForm?.get('month')?.value} ${this.searchForm?.get('year')?.value}`;
    // if (this.searchForm!.get('inv_dt_start')?.value && this.searchForm!.get('inv_dt_end')?.value) {
      if (this.searchForm?.get('month')?.value) {
        var month=this.searchForm?.get('month')?.value;
        const monthIndex = this.monthList.findIndex(m => month === m);
        where.month = (monthIndex+1);
      }

      if (this.searchForm?.get('inventory_type')?.value) {
        where.inventory_type = this.searchForm?.get('inventory_type')?.value;
      }

      if (this.searchForm?.get('year')?.value) {
        where.year = Number(this.searchForm?.get('year')?.value); 
      }
     
        cond_counter++;
        //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
    
         //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
     
 
       this.lastSearchCriteria = where;
       this.performSearch(report_type,date,customerName);
     }
    
    
   
 
     performSearch(reportType?: number,date?:string,customerName?:string) {
 
     // if(queryType==1)
     // {
     this.subs.sink = this.reportDS.searchManagementReportRenvenueMonthlyReport(this.lastSearchCriteria)
       .subscribe(data => {
         this.repData = data;
         this.ProcessReport(this.repData,date!,reportType!,customerName!);
      });
     
   }
 
   onPageEvent(event: PageEvent) {
    
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
 
   resetDialog(event: Event) {
     event.preventDefault(); // Prevents the form submission
 
     let tempDirection: Direction;
     if (localStorage.getItem('isRtl') === 'true') {
       tempDirection = 'rtl';
     } else {
       tempDirection = 'ltr';
     }
     const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
       data: {
         headerText: this.translatedLangText.CONFIRM_CLEAR_ALL,
         action: 'new',
       },
       direction: tempDirection
     });
     this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
       if (result.action === 'confirmed') {
         this.resetForm();
       }
     });
   }
 
   resetForm() {
     var thisYear = new Date().getFullYear().toString();
     var thisMonth= new Date().toLocaleString("en-US",{month:"long"});
     this.searchForm?.patchValue({
       year: thisYear,
       month_start: thisMonth,
       month_end: thisMonth,
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
 
   ProcessReportDailySummaryDetail(invType: string, date: string, report_type: number, queryType: number)
   { if (this.dailySumList.length === 0) return;
 
   }
 
   ProcessReport(repData: AdminReportMonthlyReport, date: string,report_type:number,customerName:string) {
     if(repData)
     {
       if (report_type == 1) {
         this.onExportChart_r1(repData, date,customerName);
       }
       
    }
    else
    {
     this.sotList=[];
     this.isGeneratingReport=false;
    }
 
 
   }
 
   
 
   onExportSummary(repData: AdminReportMonthlyReport, date: string,customerName:string) {
     //this.preventDefault(event);
     let cut_off_dt = new Date();
 
 
     let tempDirection: Direction;
     if (localStorage.getItem('isRtl') === 'true') {
       tempDirection = 'rtl';
     } else {
       tempDirection = 'ltr';
     }
 
     const dialogRef = this.dialog.open(YearlyReportDetailsPdfComponent, {
       width: reportPreviewWindowDimension.portrait_width_rate,
       maxWidth:reportPreviewWindowDimension.portrait_maxWidth,
      maxHeight: reportPreviewWindowDimension.report_maxHeight,
       data: {
         repData: repData,
         date: date,
         repType:this.processType,
         customer:customerName
       
       },
 
       // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
       direction: tempDirection
     });
 
     dialogRef.updatePosition({
       top: '-9999px',  // Move far above the screen
       left: '-9999px'  // Move far to the left of the screen
     });
 
     this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
       this.isGeneratingReport=false;
     });
   }
 
   onExportChart_r1(repData: AdminReportMonthlyReport, date: string,customerName:string)
   {
      //this.preventDefault(event);
      let cut_off_dt = new Date();
 
 
      let tempDirection: Direction;
      if (localStorage.getItem('isRtl') === 'true') {
        tempDirection = 'rtl';
      } else {
        tempDirection = 'ltr';
      }
  
      const dialogRef = this.dialog.open(YearlyChartPdfComponent, {
       width: reportPreviewWindowDimension.portrait_width_rate,
       maxWidth:reportPreviewWindowDimension.portrait_maxWidth,
      maxHeight: reportPreviewWindowDimension.report_maxHeight,
       data: {
         repData: repData,
         date: date,
         repType:this.processType,
         customer:customerName
       
       },
 
       // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
       direction: tempDirection
     });
 
     dialogRef.updatePosition({
       top: '-9999px',  // Move far above the screen
       left: '-9999px'  // Move far to the left of the screen
     });
 
     this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
       this.isGeneratingReport=false;
     });
   }
 
   AllowToSearch():boolean
   {
      var bAllow:boolean =true;
 
      
      if (this.searchForm?.get('month_start')?.value) {
       var month_start=this.searchForm?.get('month_start')?.value;
       const monthStartIndex = this.monthList.findIndex(m => month_start === m);
       month_start = (monthStartIndex+1);
     
       if (this.searchForm?.get('month_end')?.value) {
 
             var month_end=this.searchForm?.get('month_end')?.value;
             const monthEndIndex = this.monthList.findIndex(m => month_end === m);
             month_end = (monthEndIndex+1);
 
           if (this.searchForm?.get('year')?.value) {
           var year = Number(this.searchForm?.get('year')?.value); 
           bAllow=!Utility.isSelectedDateGreaterThanToday(month_start,year);
            if(bAllow)
            {
             bAllow=!Utility.isSelectedDateGreaterThanToday(month_end,year);
              if(bAllow)
              {
                bAllow = month_start<=month_end;
              }
            }
           }
       }
     }
    
      return bAllow;
 
   }

}