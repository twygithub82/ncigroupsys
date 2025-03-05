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
import { daily_inventory_summary, report_customer_inventory, report_inventory_yard, ReportDS } from 'app/data-sources/reports';
import { SteamDS, SteamItem } from 'app/data-sources/steam';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { DailyDetailInventoryPdfComponent } from 'app/document-template/pdf/inventory/daily-detail-pdf/daily-detail-pdf.component';
import { DailyOverviewSummaryPdfComponent } from 'app/document-template/pdf/inventory/daily-overview-summary-pdf/daily-overview-summary-pdf.component';

import { DailyDetailSummaryPdfComponent } from 'app/document-template/pdf/inventory/daily-details-summary-pdf/daily-summary-pdf.component';
import { Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { debounceTime, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'app-daily-inventory',
  standalone: true,
  templateUrl: './daily-inventory.component.html',
  styleUrl: './daily-inventory.component.scss',
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
export class DailyInventoryReportComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
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
    LOCATION:'COMMON-FORM.LOCATION'

    
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

  stmDS: SteamDS;
  plDS: PackageLabourDS;
  billDS: BillingDS;
  reportDS:ReportDS;

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
    this.initInvoiceForm();
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);
    this.stmDS = new SteamDS(this.apollo);
    this.plDS = new PackageLabourDS(this.apollo);
    this.billDS = new BillingDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.reportDS=new ReportDS(this.apollo);
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

  initInvoiceForm() {
    this.invForm = this.fb.group({
      inv_no: [''],
      inv_dt: ['']
    })
  }
  initSearchForm() {

    this.searchForm = this.fb.group({
      customer_code: this.customerCodeControl,
      last_cargo: this.lastCargoControl,
      eir_no: [''],
      tank_no: [''],
      inv_dt_start: [''],
      inv_dt_end: [''],
      inv_dt:[''],
      inv_type: ['MASTER_IN']

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
          if (!this.customerCodeControl.invalid) {
            if (this.customerCodeControl.value?.guid) {
              let mainCustomerGuid = this.customerCodeControl.value.guid;
              this.ccDS.search({ main_customer_guid: { eq: mainCustomerGuid } }).subscribe(data => {
                this.branch_companyList = data;
                this.updateValidators(this.branchCodeControl, this.branch_companyList);
              });
            }
          }
        });
      })
    ).subscribe();

    this.searchForm!.get('last_cargo')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (typeof value === 'string') {
          searchCriteria = value;
        } else {
          searchCriteria = value.cargo;
        }
        this.tcDS.loadItems({ cargo: { contains: searchCriteria } }, { cargo: 'ASC' }).subscribe(data => {
          this.last_cargoList = data
          this.updateValidators(this.lastCargoControl, this.last_cargoList);

        });
      })
    ).subscribe();
  }

  public loadData() {
    const queries = [
      // { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      // { alias: 'eirStatusCv', codeValType: 'EIR_STATUS' },
      // { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
      { alias: 'inventoryTypeCv', codeValType: 'INVENTORY_TYPE' },
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('inventoryTypeCv').subscribe(data => {
      this.inventoryTypeCvList = addDefaultSelectOption(data, 'All');;
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

    var cond_counter = 0;
    let queryType = 1;
    const where: any = {};
    this.selectedEstimateItem = undefined;
    this.selectedEstimateLabourCost = 0;
    this.stmEstList = [];
    this.selection.clear();

    var invType: string = this.inventoryTypeCvList.find(i => i.code_val == (this.searchForm!.get('inv_type')?.value))?.description || '';
    var tnxType:string="Master In";
    
    if(this.searchForm!.get('inv_type')?.value=='')
    {
      queryType=3;
      tnxType="All";
    }
    else if (this.searchForm!.get('inv_type')?.value=='MASTER_OUT')
    {
      queryType=2;
      tnxType="Master Out";
    }

    if ([3].includes(report_type)) 
    {
      if (this.searchForm!.get('customer_code')?.value) {
        // if(!where.storing_order_tank) where.storing_order_tank={};
        where.storing_order = { customer_company: { code: { eq: this.searchForm!.get('customer_code')?.value.code } } };
        cond_counter++;
      }

      var date: string = `${Utility.convertDateToStr(new Date())}`;
    // if (this.searchForm!.get('inv_dt_start')?.value && this.searchForm!.get('inv_dt_end')?.value) {
      if (this.searchForm!.get('inv_dt')?.value) {
        // date = `${Utility.convertDateToStr(new Date(this.searchForm!.get('inv_dt_start')?.value))} - ${Utility.convertDateToStr(new Date(this.searchForm!.get('inv_dt_end')?.value))}`;
        // var start_dt:any=Utility.convertDate(this.searchForm!.value['inv_dt_start'])||Utility.convertDate(new Date());
        // var end_dt:any=Utility.convertDate(this.searchForm!.value['inv_dt_end'], true)||Utility.convertDate(new Date(),true);

        date = `${Utility.convertDateToStr(new Date(this.searchForm!.get('inv_dt')?.value))}`;
        var startdt=new Date( this.searchForm!.value['inv_dt']);
      var enddt=new Date( this.searchForm!.value['inv_dt']);
        var start_dt:any=Utility.convertDate(startdt)||Utility.convertDate(new Date());
        var end_dt:any=Utility.convertDate(enddt, true)||Utility.convertDate(new Date(),true);
        var cond: any = { some: { eir_dt: { gte:start_dt, lte: end_dt } } };
        
        if (queryType == 1 || queryType==3) {
          if(!where.or)where.or=[];
          //where.in_gate = {};
          where.or.push({and:[{in_gate:cond},{in_gate:{any:true}}]}); //in Gate
        }
        
        if(queryType==2 || queryType==3){
          if(!where.or)where.or=[];
          //where.in_gate = {};
          where.or.push({and:[{out_gate:cond},{out_gate:{any:true}}]}); //out Gate
        
        }
      // if(!where.or)where.or=[];
      // where.or.push({and:[{create_dt:{lte:end_dt}},{or:[{in_gate:{some:{eir_dt:{gte:end_dt}}}},{in_gate:{any:false}}]}]}); //pending
      //where.or.push({and:[{create_dt:{lte:end_dt}}]}); //pending and opening balance
      //where.or.push({and:[{in_gate:{some:{eir_dt:{lte:end_dt}}}},{or:[{out_gate:{some:{eir_dt:{lte:end_dt}}}},{out_gate:{any:false}}]}]}); //In Yard


        cond_counter++;
        //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
      }

      // if (this.searchForm!.get('last_cargo')?.value) {
      //   where.tariff_cleaning = { guid: { eq: this.searchForm!.get('last_cargo')?.value.guid } };
      //   cond_counter++
      // }
      this.noCond = (cond_counter === 0);
      if (this.noCond) return;

      this.lastSearchCriteria = this.stmDS.addDeleteDtCriteria(where);
      this.performSearch(this.pageSize, this.pageIndex, this.pageSize, undefined, undefined, undefined, report_type, queryType, invType, date,tnxType);
    }
    else
    {
      this.performSearchSummaryDetail(queryType,invType,report_type);

    }
  }


  performSearchSummaryDetail(queryType?: number, invType?: string,report_type?:number,tnxType?:string)
  {

    var cond_counter = 0;
    var date: string = `${Utility.convertDateToStr(new Date())}`;
    var dailyInvReq:any={};
    dailyInvReq.inventory_type='in';
    if(queryType==2)
    {
      dailyInvReq.inventory_type='out';
    }
    else if(queryType==3)
    {
      dailyInvReq.inventory_type='all';
    }
    if (this.searchForm!.get('customer_code')?.value) {
      // if(!where.storing_order_tank) where.storing_order_tank={};
      dailyInvReq.customer_code = this.searchForm!.get('customer_code')?.value.code ;
      cond_counter++;
    }

    if (this.searchForm!.get('inv_dt')?.value) {
      // date = `${Utility.convertDateToStr(new Date(this.searchForm!.get('inv_dt_start')?.value))} - ${Utility.convertDateToStr(new Date(this.searchForm!.get('inv_dt_end')?.value))}`;
      // var start_dt:any=Utility.convertDate(this.searchForm!.value['inv_dt_start'])||Utility.convertDate(new Date());
      // var end_dt:any=Utility.convertDate(this.searchForm!.value['inv_dt_end'], true)||Utility.convertDate(new Date(),true);

      date = `${Utility.convertDateToStr(new Date(this.searchForm!.get('inv_dt')?.value))}`;
      var startdt=new Date( this.searchForm!.value['inv_dt']);
    var enddt=new Date( this.searchForm!.value['inv_dt']);
      dailyInvReq.start_date=Utility.convertDate(startdt)||Utility.convertDate(new Date());
      dailyInvReq.end_date=Utility.convertDate(enddt, true)||Utility.convertDate(new Date(),true);
      cond_counter++;
    }

    this.noCond = (cond_counter === 0);
    if (this.noCond) return;
    this.subs.sink = this.reportDS.searchDailyInventorySummaryReport(dailyInvReq)
    .subscribe(data => {
      if(data.length>0)
      {
        this.dailySumList = data;
        if(report_type==1)
        {
        this.onExportChart_r1(this.dailySumList, invType!, date!, queryType!);
        }
        else
        {
           this.onExportSummary(this.dailySumList, invType!, date!, queryType!,tnxType!);
        }
      }
   });

  }
  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, report_type?: number, queryType?: number, invType?: string, date?: string,tnxType?:string) {

    // if(queryType==1)
    // {
    this.subs.sink = this.sotDS.searchStoringOrderTanksInventoryReport(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {
        this.sotList = data;
        this.endCursor = this.stmDS.pageInfo?.endCursor;
        this.startCursor = this.stmDS.pageInfo?.startCursor;
        this.hasNextPage = this.stmDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPage = this.stmDS.pageInfo?.hasPreviousPage ?? false;
        this.ProcessReportCustomerInventory(invType!, date!, report_type!, queryType!,tnxType!);
     });
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
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

    this.performSearch(pageSize, pageIndex, first, after, last, before);
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
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
    this.searchForm?.patchValue({
      eir_no: '',
      tank_no: '',
      eir_dt:'',
      eir_dt_start: '',
      eir_dt_end: '',
      inv_type: ['MASTER_IN']
    });
    this.customerCodeControl.reset('');
    this.lastCargoControl.reset('');
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

  ProcessReportCustomerInventory(invType: string, date: string, report_type: number, queryType: number,tnxType:string) {
    if (this.sotList.length === 0) return;

    var report_customer_tank_inventory: report_customer_inventory[] = [];
    var report_yard_inventory:report_inventory_yard[]=[];

    var startdt=new Date( this.searchForm!.value['inv_dt']);
    var enddt=new Date( this.searchForm!.value['inv_dt']);
     var start_dt:any=Utility.convertDate(startdt)||Utility.convertDate(new Date());
    var end_dt:any=Utility.convertDate(enddt, true)||Utility.convertDate(new Date(),true);
    var openBal:number =0;
    this.sotList.map(s => {

      if (s) {
        s.repair=s.repair?.filter(r=>!["NO_ACTION","CANCEL"].includes(r.status_cv!));
        var repCust: report_customer_inventory = report_customer_tank_inventory.find(r => r.code === s.storing_order?.customer_company?.code) || new report_customer_inventory();
       
        //var repYard: report_inventory_yard= report_yard_inventory.find(y=>y.code===s.storing_order?.)
        let newCust = false;
        if (!repCust.code) {
          repCust.code = s.storing_order?.customer_company?.code;
          repCust.customer = s.storing_order?.customer_company?.name;
          newCust = true;
        }
        if(s.in_gate?.[0]?.eir_dt!>=start_dt && s.in_gate?.[0]?.eir_dt!<=end_dt)// in gate
        {
          repCust.tank_no_in_gate!+=1;
          repCust.tank_no_total!+=1;
        }
      
        if(s.out_gate?.[0]?.eir_dt!>=start_dt && s.out_gate?.[0]?.eir_dt!<=end_dt) // out gate
          {
            repCust.tank_no_out_gate!+=1;
            repCust.tank_no_total!+=1;
            if(!repCust.released_storing_order_tank)repCust.released_storing_order_tank=[];
            repCust.released_storing_order_tank?.push(s);
          }
        
        if(s.in_gate?.[0]?.eir_dt!>=start_dt && (s.out_gate?.length==0||s.out_gate?.[0]?.eir_dt!>end_dt)) //in yard
        {
          repCust.tank_no_in_yard!+=1;
         // repCust.tank_no_total!+=1;
          if(!repCust.in_yard_storing_order_tank)repCust.in_yard_storing_order_tank=[];
          repCust.in_yard_storing_order_tank?.push(s);
        }

        if( s.create_dt!<start_dt && (s.in_gate?.length==0||s.in_gate?.[0]?.eir_dt!>end_dt)) //pending
        {
          repCust.tank_no_pending!+=1;
         // repCust.tank_no_total!+=1;
        }


        if(s.create_dt!<start_dt && s.in_gate?.[0]?.eir_dt!<start_dt && (s.out_gate?.length==0 || s.out_gate?.[0]?.eir_dt!>end_dt)) //opening balance
        {
          openBal++;

        }

        if(s.release_order_sot?.[0]?.release_order?.release_dt!>=start_dt &&
          s.release_order_sot?.[0]?.release_order?.release_dt!<=end_dt) //with RO
          {
            repCust.tank_no_ro!+=1;
            //repCust.tank_no_total!+=1;
          }

        // repCust.number_tank ??= 0;
        // repCust.number_tank += 1;
        // if (!repCust.storing_order_tank) repCust.storing_order_tank = [];
       //  repCust.storing_order_tank?.push(s);
         if (newCust) report_customer_tank_inventory.push(repCust);



      }
    });
    report_customer_tank_inventory =report_customer_tank_inventory.filter(r=>r.tank_no_total!>0);

    if(report_customer_tank_inventory.length>0)
    {
      if (report_type == 1) {
        this.onExportChart(report_customer_tank_inventory, invType, date, queryType);
      }
      else if (report_type == 2) {
        this.onExportSummary(report_customer_tank_inventory, invType, date, queryType,tnxType);
      }
      else if (report_type ==3) {
        this.onExportDetail(report_customer_tank_inventory, invType, date, queryType,tnxType);
      }
   }
   else
   {
    this.sotList=[];
   }


  }

  onExportDetail(repCustomerInv: report_customer_inventory[], invType: string, date: string, queryType: number,tnxType:string) {
    //this.preventDefault(event);
    let cut_off_dt = new Date();


    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(DailyDetailInventoryPdfComponent, {
      width: '150vw',
      maxHeight: '90vh',
      data: {
        report_inventory: repCustomerInv,
        date: date,
        queryType: queryType,
        tnxType:tnxType
      },
      // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {

    });
  }

  onExportSummary(repDailyDetailSummary: daily_inventory_summary[], invType: string, date: string, queryType: number,tnxType:string) {
    //this.preventDefault(event);
    let cut_off_dt = new Date();


    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(DailyDetailSummaryPdfComponent, {
      width: '70vw',
      maxHeight: '80vh',
      data: {
        report_daily_inventory_summary: repDailyDetailSummary,
        type: invType,
        date: date,
        queryType: queryType,
        tnxType:tnxType
      },
      // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {

    });
  }

  onExportChart_r1(repDailInventory: daily_inventory_summary[], invType: string, date: string, queryType: number)
  {
     //this.preventDefault(event);
     let cut_off_dt = new Date();


     let tempDirection: Direction;
     if (localStorage.getItem('isRtl') === 'true') {
       tempDirection = 'rtl';
     } else {
       tempDirection = 'ltr';
     }
 
     const dialogRef = this.dialog.open(DailyOverviewSummaryPdfComponent, {
       width: '85vw',
       maxHeight: '80vh',
       data: {
        report_inventory: repDailInventory,
         date: date,
         queryType: queryType

       },
       // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
       direction: tempDirection
     });
     this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
 
     });
  }

  onExportChart(repCustomerInventory: report_customer_inventory[], invType: string, date: string, queryType: number)
  {
     //this.preventDefault(event);
     let cut_off_dt = new Date();


     let tempDirection: Direction;
     if (localStorage.getItem('isRtl') === 'true') {
       tempDirection = 'rtl';
     } else {
       tempDirection = 'ltr';
     }
 
     const dialogRef = this.dialog.open(DailyOverviewSummaryPdfComponent, {
       width: '85vw',
       maxHeight: '80vh',
       data: {
        report_inventory: repCustomerInventory,
         date: date,
         queryType: queryType

       },
       // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
       direction: tempDirection
     });
     this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
 
     });
  }



}