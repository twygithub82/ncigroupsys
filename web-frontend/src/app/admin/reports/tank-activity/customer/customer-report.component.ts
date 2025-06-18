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
import { BillingDS } from 'app/data-sources/billing';
import { CodeValuesDS, CodeValuesItem, addDefaultSelectOption } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { PackageLabourDS } from 'app/data-sources/package-labour';
import { report_customer_tank_activity,daily_inventory_summary,report_customer_inventory,report_inventory_yard,ReportDS } from 'app/data-sources/reports';
import { SteamDS, SteamItem } from 'app/data-sources/steam';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { CustomerDetailPdfComponent } from 'app/document-template/pdf/tank-activity/customer-detail-pdf/customer-detail-pdf.component';
import { TANK_STATUS_IN_YARD, TANK_STATUS_POST_IN_YARD, Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { reportPreviewWindowDimension } from 'environments/environment';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import {DailyDetailSummaryPdfComponent} from 'app/document-template/pdf/inventory/daily-details-summary-pdf/daily-summary-pdf.component';
import { ModulePackageService } from 'app/services/module-package.service';
@Component({
  selector: 'app-customer-report',
  standalone: true,
  templateUrl: './customer-report.component.html',
  styleUrl: './customer-report.component.scss',
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
export class TankActivitiyCustomerReportComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
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
    DETAIL_REPORT: 'COMMON-FORM.DETAIL-REPORT',
    ADD_ATLEAST_ONE: 'COMMON-FORM.ADD-ATLEAST-ONE',
    YARD_STATUS: 'COMMON-FORM.YARD-STATUS',
    DAILY_INVENTORY_SUMMARY:'COMMON-FORM.DAILY-INVENTORY-SUMMARY',
    INVENTORY_DATE:'COMMON-FORM.INVENTORY-DATE'
  }

  availableProcessStatus: string[] =
    [
      '',
      'CLEANING',
      'STEAM',
      'RESIDUE',
      'REPAIR',
      'STORAGE'
    ]

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
  reportDS: ReportDS;
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
  depotStatusCvList: CodeValuesItem[] = [];
  yardCvList: CodeValuesItem[] = [];


  processType: string = "STEAMING";
  billingParty: string = "CUSTOMER";

  pageIndex = 0;
  pageSize = 1000;
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
    this.initInvoiceForm();
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);
    this.stmDS = new SteamDS(this.apollo);
    this.plDS = new PackageLabourDS(this.apollo);
    this.billDS = new BillingDS(this.apollo);
    this.reportDS=new ReportDS(this.apollo);
    if(modulePackageService.isStarterPackage())
    {
      this.availableProcessStatus=  this.availableProcessStatus.filter(c=>c != "RESIDUE" && c != "STEAMING");
    }
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
      capacity: [''],
      customer_code: this.customerCodeControl,
      branch_code: this.branchCodeControl,
      last_cargo: this.lastCargoControl,
      eir_no: [''],
      ro_no: [''],
      eir_dt: [''],
      eir_dt_start: [''],
      eir_dt_end: [''],
      av_dt: [''],
      av_dt_start: [''],
      av_dt_end: [''],
      repair_cmp_dt: [''],
      release_dt_start: [''],
      release_dt_end: [''],
      clean_dt: [''],
      clean_dt_start: [''],
      clean_dt_end: [''],
      tank_no: [''],
      inv_no: [''],
      job_no: [''],
      purpose: [''],
      tank_status_cv: [''],
      eir_status_cv: [''],
      yard_cv: [''],
      tare_weight: [''],
      depot_status_cv: [''],
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
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'eirStatusCv', codeValType: 'EIR_STATUS' },
      { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
      { alias: 'yardCv', codeValType: 'YARD' },
      { alias: 'depotCv', codeValType: 'DEPOT_STATUS' },
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
       var filterList = data.filter(x => this.availableProcessStatus.includes(x.code_val!));
      filterList.sort((a, b) => {
        return this.availableProcessStatus.indexOf(a.code_val!) - this.availableProcessStatus.indexOf(b.code_val!);
      });
      this.tankStatusCvList = addDefaultSelectOption(filterList, 'All');
    });
    this.cvDS.connectAlias('yardCv').subscribe(data => {
      this.yardCvList = addDefaultSelectOption(data, 'All');
    });
    this.cvDS.connectAlias('depotCv').subscribe(data => {
      this.depotStatusCvList = addDefaultSelectOption(data, 'All');
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

  search(repType :number) {
    this.isGeneratingReport = true;
    var cond_counter = 0;
    var report_type: string = "ALL";
    const where: any = {};
    this.selectedEstimateItem = undefined;
    this.selectedEstimateLabourCost = 0;
    this.stmEstList = [];
    this.selection.clear();
    this.customerCodeControl.setErrors({'required': false});
    this.customerCodeControl.markAsUntouched();
    // var invType:string = this.inventoryTypeCvList.find(i=>i.code_val==(this.searchForm!.get('inv_type')?.value))?.description||'';

    // if(this.searchForm!.get('inv_type')?.value=="MASTER_OUT")
    // {
    //    queryType=2;
    // }

    //where.tank_status_cv = this.availableProcessStatus.filter(s=>s!='');
    if (this.searchForm!.get('tank_status_cv')?.value) {
      where.tank_status_cv = { contains: this.searchForm!.get('tank_status_cv')?.value };
      cond_counter++;
    }

    if (this.searchForm!.get('tank_no')?.value) {
      where.tank_no = { contains: this.searchForm!.get('tank_no')?.value };
      cond_counter++;
    }

    if (this.searchForm!.get('depot_status_cv')?.value) {
      // if(!where.storing_order_tank) where.storing_order_tank={};
      report_type = "RELEASED";
      var cond: any = { in: TANK_STATUS_POST_IN_YARD };
      if (this.searchForm!.get('depot_status_cv')?.value != "RELEASED") {
        cond = { in: TANK_STATUS_IN_YARD }; //{ neq: "RELEASED" };
        report_type = "IN_YARD";
      }
      if (where.tank_status_cv) where.tank_status_cv = {};
      where.tank_status_cv = cond;
      cond_counter++;
    }


    var customerNm: string = '';
    if (this.searchForm!.get('customer_code')?.value) {
      // if(!where.storing_order_tank) where.storing_order_tank={};
      var cust = this.searchForm!.get('customer_code')?.value;
      where.storing_order = { customer_company: { code: { eq: cust.code } } };
      cond_counter++;

      customerNm = cust?.name;
    }

    if (this.searchForm!.get('eir_no')?.value) {

      var cond: any = { eir_no: { contains: this.searchForm!.get('eir_no')?.value } };
      if (!where.in_gate) {
        where.in_gate = {};
        where.in_gate.some = {};
        where.in_gate.some.and = [];
      }

      // if (!where.out_gate) {
      //   where.out_gate = {};
      //   where.out_gate.some = {};
      //   //where.out_gate.some.or = [];
      // }
      where.in_gate.some.and.push(cond);
      //where.out_gate.some=cond;
      cond_counter++;
    }

    if (this.searchForm!.get('tare_weight')?.value) {

      var cond: any = { eq: Number(this.searchForm!.value['tare_weight']) };
      if (!where.tank_info) where.tank_info = {};
      if (!where.tank_info.tare_weight) where.tank_info.tare_weight = {};
      where.tank_info.tare_weight = cond;
      cond_counter++;
    }

    if (this.searchForm!.get('capacity')?.value) {

      var cond: any = { eq: Number(this.searchForm!.value['capacity']) };
      if (!where.tank_info) where.tank_info = {};
      if (!where.tank_info.capacity) where.tank_info.capacity = {};
      where.tank_info.capacity = cond;
      cond_counter++;
    }

    if (this.searchForm!.get('av_dt_start')?.value && this.searchForm!.get('av_dt_end')?.value) {

      var startdt = new Date(this.searchForm!.value['av_dt_start']);
      var enddt = new Date(this.searchForm!.value['av_dt_end']);
      var start_dt: any = Utility.convertDate(startdt) || Utility.convertDate(new Date());
      var end_dt: any = Utility.convertDate(enddt, true) || Utility.convertDate(new Date(), true);
      //var cond: any = { eir_dt:  { gte:start_dt, lte: end_dt } } ;
      // var cond: any = { some: { complete_dt: { gte: start_dt, lte: end_dt } } };  
      var cond: any = { complete_dt: { gte: start_dt, lte: end_dt } };
      if (!where.repair) where.repair = {};
      where.repair = { some: cond };
      cond_counter++;
    }


    var date: string = ` - ${Utility.convertDateToStr(new Date())}`;
    if (this.searchForm!.get('release_dt_start')?.value && this.searchForm!.get('release_dt_end')?.value) {

      var startdt = new Date(this.searchForm!.value['release_dt_start']);
      var enddt = new Date(this.searchForm!.value['release_dt_end']);
      var start_dt: any = Utility.convertDate(startdt) || Utility.convertDate(new Date());
      var end_dt: any = Utility.convertDate(enddt, true) || Utility.convertDate(new Date(), true);
      var cond: any = { some: { release_order: { gte: start_dt, lte: end_dt } } };
      // var cond: any = { some: { release_order: { release_dt: { gte: Utility.convertDate(this.searchForm!.value['release_dt_start']), lte: Utility.convertDate(this.searchForm!.value['release_dt_end'], true) } } } };
      date = `${Utility.convertDateToStr(new Date(this.searchForm!.get('release_dt_start')?.value))} - ${Utility.convertDateToStr(new Date(this.searchForm!.get('release_dt_end')?.value))}`;
      if (!where.release_order_sot) where.release_order_sot = {};
      where.release_order_sot = cond;
      cond_counter++;
      //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
    }


    if (this.searchForm!.get('clean_dt_start')?.value && this.searchForm!.get('clean_dt_end')?.value) {

      var startdt = new Date(this.searchForm!.value['clean_dt_start']);
      var enddt = new Date(this.searchForm!.value['clean_dt_end']);
      var start_dt: any = Utility.convertDate(startdt) || Utility.convertDate(new Date());
      var end_dt: any = Utility.convertDate(enddt, true) || Utility.convertDate(new Date(), true);
      //var cond: any = { eir_dt:  { gte:start_dt, lte: end_dt } } ;
      var cond: any = { some: { complete_dt: { gte: start_dt, lte: end_dt } } };
      //var cond: any = { some: { complete_dt: { gte: Utility.convertDate(this.searchForm!.value['clean_dt_start']), lte: Utility.convertDate(this.searchForm!.value['clean_dt_end'], true) } } };
      if (!where.cleaning) where.cleaning = {};
      where.cleaning = cond;
      cond_counter++;
      //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
    }

    // if (this.searchForm!.get('eir_dt')?.value) {
    if (this.searchForm!.get('eir_dt_start')?.value && this.searchForm!.get('eir_dt_end')?.value) {
      if (!where.in_gate) {
        where.in_gate = {};
        where.in_gate.some = {};
        where.in_gate.some.and = [];
      }

      // if (!where.out_gate) {
      //   where.out_gate = {};
      //   where.out_gate.some = {};
      //   where.out_gate.some.and = [];
      // }
      var startdt = new Date(this.searchForm!.value['eir_dt_start']);
      var enddt = new Date(this.searchForm!.value['eir_dt_end']);
      var start_dt: any = Utility.convertDate(startdt) || Utility.convertDate(new Date());
      var end_dt: any = Utility.convertDate(enddt, true) || Utility.convertDate(new Date(), true);
      var cond: any = { eir_dt: { gte: start_dt, lte: end_dt } };
      //var cond :any ={eir_dt:{eq: Utility.convertDate(this.searchForm!.value['eir_dt'])}};
      // var cond: any = { eir_dt: { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end'], true) } };

      where.in_gate.some.and.push(cond);
      // where.out_gate.some.and.push(cond);
      cond_counter++;

      //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
    }

    if (this.searchForm!.get('last_cargo')?.value) {
      where.tariff_cleaning = { guid: { eq: this.searchForm!.get('last_cargo')?.value.guid } };
      cond_counter++;
    }

    this.noCond = (cond_counter === 0);
    if (this.noCond) {
      this.isGeneratingReport = false;
      return;
    }
    this.lastSearchCriteria = this.sotDS.addDeleteDtCriteria(where);
    if(repType===1)
    {
      if(!this.customerCodeControl.value)
      {
        this.isGeneratingReport = false;
        this.customerCodeControl.setErrors({'required': true});
        this.customerCodeControl.markAsTouched(); // <-- Add this line
        return;
      }
    this.performSearch(this.pageSize, this.pageIndex, this.pageSize, undefined, undefined, undefined, report_type, customerNm);
    }
    else
    {
       var tnxType: string = "All";
       var queryType:number =3;
       var invType:string='All';
       var rep_type:number=2;
      this.performSearchSummaryDetail(queryType, invType, rep_type);
    }

  }

   performSearchInventory(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, report_type?: number, queryType?: number, invType?: string, date?: string, tnxType?: string) {

    // if(queryType==1)
    // {
    this.subs.sink = this.sotDS.searchStoringOrderTanksInventoryReport(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {
        this.sotList = data;
        this.endCursor = this.stmDS.pageInfo?.endCursor;
        this.startCursor = this.stmDS.pageInfo?.startCursor;
        this.hasNextPage = this.stmDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPage = this.stmDS.pageInfo?.hasPreviousPage ?? false;
        this.ProcessReportCustomerInventory(invType!, date!, report_type!, queryType!, tnxType!);
      });
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, report_type?: string, customerNm?: string) {
    // this.selection.clear();
    var filterSpecificTankStatus = true;
    this.subs.sink = this.sotDS.searchStoringOrderTanksActivityReport(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {

        this.sotList = data;

        if (filterSpecificTankStatus && this.sotList.length > 0) {
          var availStatus = this.availableProcessStatus.filter(s => s != "");
          this.sotList = this.sotList.filter(sot => availStatus.includes(sot.tank_status_cv!));
        }
        this.endCursor = this.stmDS.pageInfo?.endCursor;
        this.startCursor = this.stmDS.pageInfo?.startCursor;
        this.hasNextPage = this.stmDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPage = this.stmDS.pageInfo?.hasPreviousPage ?? false;
        report_type = this.cvDS.getCodeDescription(report_type, this.depotStatusCvList);
        this.ProcessReportCustomerTankActivity(report_type!, customerNm!);
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

  resetDialog(event: Event) {
    event.preventDefault(); // Prevents the form submission

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    this.resetForm();
    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   data: {
    //     headerText: this.translatedLangText.CONFIRM_CLEAR_ALL,
    //     action: 'new',
    //   },
    //   direction: tempDirection
    // });
    // this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    //   if (result.action === 'confirmed') {
    //     this.resetForm();
    //   }
    // });
  }

  resetForm() {
    this.searchForm?.patchValue({
      capacity: '',
      eir_no: '',
      eir_dt_start: '',
      eir_dt_end: '',
      tank_no: '',
      job_no: '',
      purpose: '',
      tank_status_cv: '',
      eir_status_cv: '',
      ro_no: '',
      eir_dt: '',
      av_dt_start: '',
      av_dt: '',
      av_dt_end: '',
      clean_dt: '',
      clean_dt_start: '',
      clean_dt_end: '',
      repair_cmp_dt: '',
      release_dt_start: '',
      release_dt_end: '',
      inv_no: '',
      tare_weight: '',
      invoiced: null,
      depot_status_cv: '',
    });

    this.branchCodeControl.reset('');
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



  ProcessReportCustomerTankActivity(report_type: string, customerNm: string) {
    if (this.sotList.length === 0) {
      this.isGeneratingReport = false;
      return;
    }

    var report_customer_tank_acts: report_customer_tank_activity[] = [];

    this.sotList.map(s => {

      if (s) {
        s.repair = s.repair?.filter(r => !["NO_ACTION", "CANCEL"].includes(r.status_cv!));
        var repCust: report_customer_tank_activity = report_customer_tank_acts.find(r => r.code === s.storing_order?.customer_company?.code) || new report_customer_tank_activity();
        let newCust = false;
        if (!repCust.code) {
          repCust.code = s.storing_order?.customer_company?.code;
          repCust.customer = s.storing_order?.customer_company?.name;
          newCust = true;
        }
        repCust.number_tank ??= 0;
        repCust.number_tank += 1;
        if (!repCust.in_yard_storing_order_tank) repCust.in_yard_storing_order_tank = [];
        if (!repCust.released_storing_order_tank) repCust.released_storing_order_tank = [];
        if (!repCust.storing_order_tank) repCust.storing_order_tank = [];

        if (TANK_STATUS_IN_YARD.includes(s.tank_status_cv!)) {
          repCust.in_yard_storing_order_tank?.push(s);

        }
        else if (TANK_STATUS_POST_IN_YARD.includes(s.tank_status_cv!)) {
          repCust.released_storing_order_tank?.push(s);
        }
        // if(s.tank_status_cv=="RELEASED")
        // {repCust.released_storing_order_tank?.push(s);}
        // else
        // {repCust.in_yard_storing_order_tank?.push(s);}
        repCust.storing_order_tank?.push(s);
        if (newCust) report_customer_tank_acts.push(repCust);



      }
    });


    this.onExportDetail(report_customer_tank_acts, report_type, customerNm);


  }

  onExportDetail(repCustomerTankActivity: report_customer_tank_activity[], report_type: string, customerNm: string) {
    //this.preventDefault(event);
    let cut_off_dt = new Date();


    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(CustomerDetailPdfComponent, {
      width: reportPreviewWindowDimension.landscape_width_rate,
      maxWidth: reportPreviewWindowDimension.landscape_maxWidth,
      maxHeight: reportPreviewWindowDimension.report_maxHeight,
      data: {
        report_customer_tank_activity: repCustomerTankActivity,
        type: report_type,
        customerName: customerNm
      },
      // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      this.isGeneratingReport = false;
    });
  }

  onTabFocused() {
    this.resetForm();
  }

  getMaxDate(){
    return new Date();
  }

   ProcessReportCustomerInventory(invType: string, date: string, report_type: number, queryType: number, tnxType: string) {
      if (this.sotList.length === 0) {
        this.isGeneratingReport = false;
        return;
      }
  
      var report_customer_tank_inventory: report_customer_inventory[] = [];
      var report_yard_inventory: report_inventory_yard[] = [];
  
      var startdt = new Date(this.searchForm!.value['inv_dt']);
      var enddt = new Date(this.searchForm!.value['inv_dt']);
      if (!this.searchForm!.value['inv_dt']) {
        startdt = new Date(2020, 1, 1, 0, 0, 0);
        enddt = new Date();
      }
      var start_dt: any = Utility.convertDate(startdt) || Utility.convertDate(new Date(2000, 1, 1, 0, 0, 0, 0));
      var end_dt: any = Utility.convertDate(enddt, true) || Utility.convertDate(new Date(), true);
      var openBal: number = 0;
      this.sotList.map(s => {
  
        if (s) {
          s.repair = s.repair?.filter(r => !["NO_ACTION", "CANCEL"].includes(r.status_cv!));
          var repCust: report_customer_inventory = report_customer_tank_inventory.find(r => r.code === s.storing_order?.customer_company?.code) || new report_customer_inventory();
  
          //var repYard: report_inventory_yard= report_yard_inventory.find(y=>y.code===s.storing_order?.)
          let newCust = false;
          if (!repCust.code) {
            repCust.code = s.storing_order?.customer_company?.code;
            repCust.customer = s.storing_order?.customer_company?.name;
            newCust = true;
          }
          if (["Master In", "All"].includes(tnxType)) {
            if (s.in_gate?.[0]?.eir_dt! >= start_dt && s.in_gate?.[0]?.eir_dt! <= end_dt)// in gate
            {
              repCust.tank_no_in_gate! += 1;
              repCust.tank_no_total! += 1;
              if (!repCust.in_gate_storing_order_tank) repCust.in_gate_storing_order_tank = [];
              repCust.in_gate_storing_order_tank?.push(s);
            }
          }
  
          if (["Master Out", "All"].includes(tnxType)) {
            if (s.out_gate?.[0]?.eir_dt! >= start_dt && s.out_gate?.[0]?.eir_dt! <= end_dt) // out gate
            {
              repCust.tank_no_out_gate! += 1;
              repCust.tank_no_total! += 1;
              if (!repCust.released_storing_order_tank) repCust.released_storing_order_tank = [];
              repCust.released_storing_order_tank?.push(s);
            }
          }
  
          if (["Master In", "All"].includes(tnxType)) {
            if (s.in_gate?.[0]?.eir_dt! >= start_dt && (s.out_gate?.length == 0 || s.out_gate?.[0]?.eir_dt! > end_dt)) //in yard
            {
              repCust.tank_no_in_yard! += 1;
              // repCust.tank_no_total!+=1;
              if (!repCust.in_yard_storing_order_tank) repCust.in_yard_storing_order_tank = [];
              repCust.in_yard_storing_order_tank?.push(s);
            }
          }
  
          if (s.create_dt! < start_dt && (s.in_gate?.length == 0 || s.in_gate?.[0]?.eir_dt! > end_dt)) //pending
          {
            repCust.tank_no_pending! += 1;
            // repCust.tank_no_total!+=1;
          }
  
  
          if (s.create_dt! < start_dt && s.in_gate?.[0]?.eir_dt! < start_dt && (s.out_gate?.length == 0 || s.out_gate?.[0]?.eir_dt! > end_dt)) //opening balance
          {
            openBal++;
  
          }
  
          if (s.release_order_sot?.[0]?.release_order?.release_dt! >= start_dt &&
            s.release_order_sot?.[0]?.release_order?.release_dt! <= end_dt) //with RO
          {
            repCust.tank_no_ro! += 1;
            //repCust.tank_no_total!+=1;
          }
  
          // repCust.number_tank ??= 0;
          // repCust.number_tank += 1;
          // if (!repCust.storing_order_tank) repCust.storing_order_tank = [];
          //  repCust.storing_order_tank?.push(s);
          if (newCust) report_customer_tank_inventory.push(repCust);
  
  
  
        }
      });
      report_customer_tank_inventory = report_customer_tank_inventory.filter(r => r.tank_no_total! > 0);
  
      if (report_customer_tank_inventory.length > 0) {
        // if (report_type == 1) {
        //   this.onExportChart(report_customer_tank_inventory, invType, date, queryType);
        // }
        // else if (report_type == 2) {
          this.onExportSummary(report_customer_tank_inventory, invType, date, queryType, tnxType);
        // }
        // else if (report_type == 3) {
        //   this.onExportDetail(report_customer_tank_inventory, invType, date, queryType, tnxType);
        // }
      }
      else {
        this.sotList = [];
        this.isGeneratingReport = false;
      }
  
  
    }

    onExportSummary(repDailyDetailSummary: daily_inventory_summary[], invType: string, date: string, queryType: number, tnxType: string) {
        //this.preventDefault(event);
        let cut_off_dt = new Date();
    
    
        let tempDirection: Direction;
        if (localStorage.getItem('isRtl') === 'true') {
          tempDirection = 'rtl';
        } else {
          tempDirection = 'ltr';
        }
    
        const dialogRef = this.dialog.open(DailyDetailSummaryPdfComponent, {
          width: reportPreviewWindowDimension.portrait_width_rate,
          maxWidth: reportPreviewWindowDimension.portrait_maxWidth,
          maxHeight: reportPreviewWindowDimension.report_maxHeight,
          data: {
            report_daily_inventory_summary: repDailyDetailSummary,
            type: invType,
            date: date,
            queryType: queryType,
            tnxType: tnxType
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

     performSearchSummaryDetail(queryType?: number, invType?: string, report_type?: number, tnxType?: string) {

    var cond_counter = 0;
    var date: string = `${Utility.convertDateToStr(new Date())}`;
    var dailyInvReq: any = {};
    dailyInvReq.inventory_type = 'in';
    if (queryType == 2) {
      dailyInvReq.inventory_type = 'out';
    }
    else if (queryType == 3) {
      dailyInvReq.inventory_type = 'all';
    }
    if (this.searchForm!.get('customer_code')?.value) {
      // if(!where.storing_order_tank) where.storing_order_tank={};
      dailyInvReq.customer_code = this.searchForm!.get('customer_code')?.value.code;
      cond_counter++;
    }

    if (this.searchForm!.get('eir_dt_start')?.value && this.searchForm!.get('eir_dt_end')?.value) {
      // date = `${Utility.convertDateToStr(new Date(this.searchForm!.get('inv_dt_start')?.value))} - ${Utility.convertDateToStr(new Date(this.searchForm!.get('inv_dt_end')?.value))}`;
      // var start_dt:any=Utility.convertDate(this.searchForm!.value['inv_dt_start'])||Utility.convertDate(new Date());
      // var end_dt:any=Utility.convertDate(this.searchForm!.value['inv_dt_end'], true)||Utility.convertDate(new Date(),true);

       var startdt = new Date(this.searchForm!.value['eir_dt_start']);
      var enddt = new Date(this.searchForm!.value['eir_dt_end']);
      date=`${Utility.convertDateToStr(startdt)} - ${Utility.convertDateToStr(enddt)}`
      var start_dt: any = Utility.convertDate(startdt) || Utility.convertDate(new Date());
      var end_dt: any = Utility.convertDate(enddt, true) || Utility.convertDate(new Date(), true);

      // date = `${Utility.convertDateToStr(new Date(this.searchForm!.get('inv_dt')?.value))}`;
      // var startdt = new Date(this.searchForm!.value['inv_dt']);
      // var enddt = new Date(this.searchForm!.value['inv_dt']);
      dailyInvReq.start_date = Utility.convertDate(startdt) || Utility.convertDate(new Date());
      dailyInvReq.end_date = Utility.convertDate(enddt, true) || Utility.convertDate(new Date(), true);
      cond_counter++;
    }
    else {
      var startdt = new Date(2024, 8, 1, 0, 0, 0, 0);
      var enddt = new Date();
      date=`${Utility.convertDateToStr(startdt)} - ${Utility.convertDateToStr(enddt)}`
      dailyInvReq.start_date = Utility.convertDate(startdt) || Utility.convertDate(new Date());
      dailyInvReq.end_date = Utility.convertDate(enddt, true) || Utility.convertDate(new Date(), true);
      // cond_counter++;
    }

    this.noCond = (cond_counter === 0);
    if (this.noCond) {
      this.isGeneratingReport = false;
      return;
    }
    this.subs.sink = this.reportDS.searchDailyInventorySummaryReport(dailyInvReq)
      .subscribe(data => {
        if (data.length > 0) {
          var dailySumList = data;
        
            this.onExportSummary(dailySumList, invType!, date!, queryType!, tnxType!);
          
        }
        else {
          this.isGeneratingReport = false;
        }
      });

  }
  
}