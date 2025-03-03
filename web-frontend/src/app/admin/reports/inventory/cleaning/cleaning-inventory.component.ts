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
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { GuidSelectionModel } from '@shared/GuidSelectionModel';
import { Apollo } from 'apollo-angular';
import { BillingDS } from 'app/data-sources/billing';
import { CodeValuesDS, CodeValuesItem, addDefaultSelectOption } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { PackageLabourDS } from 'app/data-sources/package-labour';
import { report_inventory_cleaning_detail } from 'app/data-sources/reports';
import { SteamDS, SteamItem } from 'app/data-sources/steam';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { CleaningDetailInventoryPdfComponent } from 'app/document-template/pdf/inventory/cleaning-detail-pdf/cleaning-detail-pdf.component';
import { CustomerDetailPdfComponent } from 'app/document-template/pdf/tank-activity/customer-detail-pdf/customer-detail-pdf.component';
import { Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import {ReportDS,cleaning_report_summary_item} from 'app/data-sources/reports';
import {CustomerWiseInventorySummaryPdfComponent} from 'app/document-template/pdf/inventory/cleaning-summary/customer-wise/customer-wise-inventory-summary-pdf.component';
import {CargoUNWiseInventorySummaryPdfComponent} from 'app/document-template/pdf/inventory/cleaning-summary/cargo-un-wise/cargo-un-wise-inventory-summary-pdf.component';
@Component({
  selector: 'app-cleaning-inventory',
  standalone: true,
  templateUrl: './cleaning-inventory.component.html',
  styleUrl: './cleaning-inventory.component.scss',
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
export class CleaningInventoryComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
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

  availableReportTypes: string[] = [
    'CUSTOMER_WISE',
    'CARGO_WISE',
    'UN_WISE',
    'DETAIL',
  ]

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
    DETAIL_REPORT: 'COMMON-FORM.DETAIL-REPORT',
    ONE_CONDITION_NEEDED: 'COMMON-FORM.ONE-CONDITION-NEEDED',
    CLASS_NO:'COMMON-FORM.CARGO-CLASS',
    UN_NO:'COMMON-FORM.CARGO-UN-NO',
    REPORT_TYPE:'COMMON-FORM.REPORT-TYPE',
    START:"COMMON-FORM.START",
    END:"COMMON-FORM.END",
    IS_REQUIRED:'COMMON-FORM.IS-REQUIRED',
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
  repDS:ReportDS;
  //clnDS:InGateCleaningDS;
  stmDS: SteamDS;
  plDS: PackageLabourDS;
  billDS: BillingDS;

  distinctCustomerCodes: any;
  selectedEstimateItem?: SteamItem;
  selectedEstimateLabourCost?: number;
  stmEstList: SteamItem[] = [];
  sotList: StoringOrderTankItem[] = [];
  customer_companyList?: CustomerCompanyItem[];
  branch_companyList?: CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];
  purposeOptionCvList: CodeValuesItem[] = [];
  eirStatusCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  tankStatusCvListDisplay: CodeValuesItem[] = [];
  reportTypesCvList: CodeValuesItem[] = [];
  yardCvList: CodeValuesItem[] = [];
  classCvList: CodeValuesItem[] = [];


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
  cleaningSumList:cleaning_report_summary_item[]=[];

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
    this.repDS= new ReportDS(this.apollo);
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
      report_type: ['DETAIL'],
      clean_dt_start: [''],
      clean_dt_end: [''],
      tank_no: [''],
      class_no: [''],
      un_no: [''],
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
        this.subs.sink = this.ccDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
          this.customer_companyList = data
          this.updateValidators(this.customerCodeControl, this.customer_companyList);
          if (!this.customerCodeControl.invalid) {
            if (this.customerCodeControl.value?.guid) {
              let mainCustomerGuid = this.customerCodeControl.value.guid;
              this.ccDS.loadItems({ main_customer_guid: { eq: mainCustomerGuid } }).subscribe(data => {
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
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'eirStatusCv', codeValType: 'EIR_STATUS' },
      { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
      { alias: 'yardCv', codeValType: 'YARD' },
      { alias: 'reportTypesCv', codeValType: 'REPORT_TYPE' },
      { alias: 'classNoCv', codeValType: 'CLASS_NO' },
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      this.purposeOptionCvList = data;
    });
    this.cvDS.connectAlias('eirStatusCv').subscribe(data => {
      this.eirStatusCvList = addDefaultSelectOption(data, 'All');;
    });
    this.cvDS.connectAlias('tankStatusCv').subscribe(data => {
      this.tankStatusCvListDisplay = data;
      this.tankStatusCvList = addDefaultSelectOption(data, 'All');
    });
    this.cvDS.connectAlias('classNoCv').subscribe(data => {
     // this.classCvList = data;
    });
    this.cvDS.connectAlias('reportTypesCv').subscribe(data => {
      this.reportTypesCvList = data;
    });
    this.cvDS.getAllClassNo().subscribe(data=>{
      this.classCvList = data;
    });
    // this.search();
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

  search() {

    
    var cond_counter = 0;
    var report_type: string =this.searchForm!.get('report_type')?.value;
    const where: any = {};
    if(this.searchForm?.invalid)return;
    

    if(report_type=="DETAIL")
    {
    if (this.searchForm!.get('tank_no')?.value) {
      where.tank_no = { contains: this.searchForm!.get('tank_no')?.value };
      cond_counter++;
    }

    

    if (this.searchForm!.get('customer_code')?.value) {
      // if(!where.storing_order_tank) where.storing_order_tank={};
      where.storing_order = { customer_company: { code: { eq: this.searchForm!.get('customer_code')?.value.code } } };
      cond_counter++;
    }

    if (this.searchForm!.get('eir_no')?.value) {

      var cond: any = { eir_no: { contains: this.searchForm!.get('eir_no')?.value } };
      if (!where.in_gate) {
        where.in_gate = {};
        where.in_gate.some = {};
        where.in_gate.some.and = [];
      }

      if (!where.out_gate) {
        where.out_gate = {};
        where.out_gate.some = {};
        where.out_gate.some.and = [];
      }
      where.in_gate.some.and.push(cond);
      where.out_gate.some.and.push(cond);
      cond_counter++;
    }

    
    var date: string = ` - ${Utility.convertDateToStr(new Date())}`;
    if (this.searchForm!.get('clean_dt_start')?.value && this.searchForm!.get('clean_dt_end')?.value) {
      var start_dt = new Date(this.searchForm!.get('clean_dt_start')?.value);
      var end_dt = new Date(this.searchForm!.get('clean_dt_end')?.value);
      var cond: any ={ some: {  complete_dt: { gte: Utility.convertDate(start_dt), lte: Utility.convertDate(end_dt, true)  } } };
      date = `${Utility.convertDateToStr(start_dt)} - ${Utility.convertDateToStr(end_dt)}`;
      if (!where.cleaning) where.cleaning = {};
      where.cleaning = cond;
      cond_counter++;
      //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
    }


  

    if (this.searchForm!.get('last_cargo')?.value) {
      where.tariff_cleaning = { guid: { eq: this.searchForm!.get('last_cargo')?.value.guid } };
      cond_counter++;
    }

    if (this.searchForm!.get('un_no')?.value) {
      if(!where.tariff_cleaning) where.tariff_cleaning={};
      where.tariff_cleaning.un_no= {contains:this.searchForm!.get('un_no')?.value};
      //where.tariff_cleaning = { guid: { eq: this.searchForm!.get('last_cargo')?.value.guid } };
      cond_counter++;
    }

    if (this.searchForm!.get('class_no')?.value) {
      if(!where.tariff_cleaning) where.tariff_cleaning={};
      where.tariff_cleaning.class_cv= {in:this.searchForm!.get('class_no')?.value};
      //where.tariff_cleaning = { guid: { eq: this.searchForm!.get('last_cargo')?.value.guid } };
      cond_counter++;
    }

    this.noCond = (cond_counter === 0);
    if (this.noCond) return;
    this.lastSearchCriteria = this.sotDS.addDeleteDtCriteria(where);
    this.performSearchSOT(this.pageSize, this.pageIndex, this.pageSize, undefined, undefined, undefined, report_type,date);
  }
  else
  {
      this.lastSearchCriteria={};
      if (this.searchForm!.get('tank_no')?.value) {
        this.lastSearchCriteria.tank_no =  this.searchForm!.get('tank_no')?.value ;
        cond_counter++;
      }

      

      if (this.searchForm!.get('customer_code')?.value) {
        // if(!where.storing_order_tank) where.storing_order_tank={};
        this.lastSearchCriteria.customer_code =  this.searchForm!.get('customer_code')?.value.code ;
        cond_counter++;
      }

      if (this.searchForm!.get('eir_no')?.value) {
        this.lastSearchCriteria.eir_no = this.searchForm!.get('eir_no')?.value;
        cond_counter++;
      }

      var date: string = ` - ${Utility.convertDateToStr(new Date())}`;
      if (this.searchForm!.get('clean_dt_start')?.value && this.searchForm!.get('clean_dt_end')?.value) {
        var start_dt = new Date(this.searchForm!.get('clean_dt_start')?.value);
        var end_dt = new Date(this.searchForm!.get('clean_dt_end')?.value);
        this.lastSearchCriteria.start_date= Utility.convertDate(start_dt);
        this.lastSearchCriteria.end_date= Utility.convertDate(end_dt, true);
        date = `${Utility.convertDateToStr(start_dt)} - ${Utility.convertDateToStr(end_dt)}`;
        cond_counter++;
      }


    

      if (this.searchForm!.get('last_cargo')?.value) {
        this.lastSearchCriteria.last_cargo = this.searchForm!.get('last_cargo')?.value.cargo;
        cond_counter++;
      }

      if (this.searchForm!.get('un_no')?.value) {
        this.lastSearchCriteria.un_no = this.searchForm!.get('un_no')?.value.cargo;
        cond_counter++;
      }

      if (this.searchForm!.get('class_no')?.value) {
      
        this.lastSearchCriteria.class_no= this.searchForm!.get('class_no')?.value;
        //where.tariff_cleaning = { guid: { eq: this.searchForm!.get('last_cargo')?.value.guid } };
        cond_counter++;
      }

      this.noCond = (cond_counter === 0);
      this.lastSearchCriteria.report_type=this.GetReportType(report_type);
      this.performSearchCleaningInventorySummary(report_type,date);
  }

  }

  GetReportType(report_type:String):String
  {
    var retval:String ="customer";
    switch(report_type)
    {
      case "CUSTOMER_WISE":
         retval="customer";
        break;
      case "CARGO_WISE":
        retval="cargo";
        break;
      case "UN_WISE":
        retval="un";
        break;
    }

    return retval;
  }

  performSearchCleaningInventorySummary(report_type?: string,date?:string) {
    // this.selection.clear();
    this.subs.sink = this.repDS.searchCleaningInventorySummaryReport(this.lastSearchCriteria)
      .subscribe(data => {
        this.cleaningSumList = data;
        if(report_type=="CUSTOMER_WISE")
        {
        this.onExportCustomerWise(this.cleaningSumList,date!);
        }
        else
        {
          this.onExportCargoUNWise(this.cleaningSumList,date!,report_type!);
        }
        // this.endCursor = this.stmDS.pageInfo?.endCursor;
        // this.startCursor = this.stmDS.pageInfo?.startCursor;
        // this.hasNextPage = this.stmDS.pageInfo?.hasNextPage ?? false;
        // this.hasPreviousPage = this.stmDS.pageInfo?.hasPreviousPage ?? false;
        //this.ProcessReportCleaningInventory(this.searchForm!.get('report_type')?.value,date!)
        // report_type = this.cvDS.getCodeDescription(report_type, this.depotStatusCvList);
        // this.ProcessReportCustomerTankActivity(report_type!);
        // this.checkInvoicedAndGetTotalCost();
        //this.checkInvoiced();
        //this.distinctCustomerCodes= [... new Set(this.stmEstList.map(item=>item.customer_company?.code))];
      });

  }

  performSearchSOT(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, report_type?: string,date?:string) {
    // this.selection.clear();
    this.subs.sink = this.sotDS.searchStoringOrderTanksInventoryReport(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {
        this.sotList = data;
        this.endCursor = this.stmDS.pageInfo?.endCursor;
        this.startCursor = this.stmDS.pageInfo?.startCursor;
        this.hasNextPage = this.stmDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPage = this.stmDS.pageInfo?.hasPreviousPage ?? false;
        this.ProcessReportCleaningInventory(this.searchForm!.get('report_type')?.value,date!)
        // report_type = this.cvDS.getCodeDescription(report_type, this.depotStatusCvList);
        // this.ProcessReportCustomerTankActivity(report_type!);
        // this.checkInvoicedAndGetTotalCost();
        //this.checkInvoiced();
        //this.distinctCustomerCodes= [... new Set(this.stmEstList.map(item=>item.customer_company?.code))];
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
      report_type: 'DETAIL',
      clean_dt_start: '',
      clean_dt_end: '',
      tank_no: '',
      class_no: '',
      un_no: '',
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

 

  IsApproved(steam: SteamItem) {
    const validStatus = ['APPROVED', 'COMPLETED', 'QC_COMPLETED']
    return validStatus.includes(steam!.status_cv!);

  }

  

  checkInvoiced() {
    this.stmEstList = this.stmEstList?.map(stm => {

      return { ...stm, invoiced: (stm.customer_billing_guid ? true : false) };
    });
  }

  ProcessReportCleaningInventory(report_type:string,date:string){

    if(report_type=='DETAIL')
    {
      this.ProcessReportCleaningInventoryDetail(date);
    }
  }


  ProcessReportCleaningInventoryDetail(date:string) {
    if (this.sotList.length === 0) return;

    var report_inv_cln_dtl: report_inventory_cleaning_detail[] = [];

    this.sotList.map(s => {

      if (s) {
        var repCln: report_inventory_cleaning_detail = report_inv_cln_dtl.find(r => r.cargo === s.tariff_cleaning?.cargo) || new report_inventory_cleaning_detail();
        let newItm = false;
        if (!repCln.cargo) {
          repCln.cargo = s.tariff_cleaning?.cargo;
          newItm = true;
        }
       
        if (!repCln.storing_order_tank) repCln.storing_order_tank = [];
        repCln.storing_order_tank?.push(s);
        if (newItm) report_inv_cln_dtl.push(repCln);



      }
    });


    this.onExportDetail(report_inv_cln_dtl,date);


  }

  onExportDetail(repCln: report_inventory_cleaning_detail[],date:string) {
    //this.preventDefault(event);
    let cut_off_dt = new Date();


    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(CleaningDetailInventoryPdfComponent, {
      width: '90wv',
      maxWidth:'1000px',
      maxHeight: '80vh',
      data: {
        report_inventory: repCln,
        date: date
      },
      // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {

    });
  }

  onExportCargoUNWise(repCln: cleaning_report_summary_item[],date:string,report_type:string) {
    //this.preventDefault(event);
    let cut_off_dt = new Date();


    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(CargoUNWiseInventorySummaryPdfComponent, {
      width: '80vw',
      maxHeight: '80vh',
      data: {
        report_summary_cleaning_item: repCln,
        date: date,
        report_type:report_type
      },
      // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {

    });
  }

onExportCustomerWise(repCln: cleaning_report_summary_item[],date:string) {
    //this.preventDefault(event);
    let cut_off_dt = new Date();


    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(CustomerWiseInventorySummaryPdfComponent, {
      width: '80vw',
      maxHeight: '80vh',
      data: {
        report_summary_cleaning_item: repCln,
        date: date
      },
      // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {

    });
  }


}