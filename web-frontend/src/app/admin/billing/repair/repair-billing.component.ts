import { Direction } from '@angular/cdk/bidi';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { GuidSelectionModel } from '@shared/GuidSelectionModel';
import { PreviewRepairEstFormDialog } from '@shared/preview/preview_repair_estimate/preview-repair-estimate.component';
import { Apollo } from 'apollo-angular';
import { BillingDS, BillingEstimateRequest, BillingInputRequest, BillingItem } from 'app/data-sources/billing';
import { CodeValuesDS, CodeValuesItem, addDefaultSelectOption } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { PackageLabourDS, PackageLabourItem } from 'app/data-sources/package-labour';
import { RepairDS, RepairItem } from 'app/data-sources/repair';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { ComponentUtil } from 'app/utilities/component-util';
import { pageSizeInfo, Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { debounceTime, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'app-repair-billing',
  standalone: true,
  templateUrl: './repair-billing.component.html',
  styleUrl: './repair-billing.component.scss',
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
    MatSlideToggleModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class RepairBillingComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [

    'select',
    'customer',
    // 'customer_type',
    'estimate_no',
    'job_no',
    'net_cost',
    //'remarks',
    'invoice_no',
    'invoice_date',
    'status_cv',
    //'actions'
  ];

  availableProcessStatus: string[] = [
    'ASSIGNED',
    'PARTIAL_ASSIGNED',
    'APPROVED',
    'JOB_IN_PROGRESS',
    'COMPLETED',
    'QC_COMPLETED'
  ]

  pageTitle = 'MENUITEMS.BILLING.LIST.REPAIR-BILL'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.BILLING.TEXT', route: '/admin/billing/repair' }
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
    CLEAR: 'COMMON-FORM.CLEAR',
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
    SAVE: 'COMMON-FORM.SAVE',
    BILLING_BRANCH: 'COMMON-FORM.BILLING-BRANCH',
    CUTOFF_DATE: 'COMMON-FORM.CUTOFF-DATE',
    SAVE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    INVOICED: 'COMMON-FORM.INVOICED',
    CONFIRM_UPDATE_INVOICE: 'COMMON-FORM.CONFIRM-UPDATE-INVOICE',
    CONFIRM_INVALID_ESTIMATE: 'COMMON-FORM.CONFIRM-INVALID-ESTIMATE',
    COST: 'COMMON-FORM.COST',
    ESTIMATE_NO: 'COMMON-FORM.ESTIMATE-NO',
    ESTIMATE_STATUS: 'COMMON-FORM.ESTIMATE-STATUS',
    NET_COST: 'COMMON-FORM.NET-COST',
    REMARKS: 'COMMON-FORM.REMARKS',
    CUSTOMER_TYPE: 'COMMON-FORM.CUSTOMER-TYPE',
    LESSEE: 'COMMON-FORM.LESSEE',
    OWNER: 'COMMON-FORM.OWNER',
    CONFIRM_REMOVE_ESITMATE: 'COMMON-FORM.CONFIRM-REMOVE-ESITMATE',
    DELETE: 'COMMON-FORM.DELETE',
    REPAIR_TYPE: 'COMMON-FORM.REPAIR-TYPE',

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
  plDS: PackageLabourDS;

  //clnDS:InGateCleaningDS;
  repDS: RepairDS;
  billDS: BillingDS;
  processType: string = "REPAIR";
  billingParty: string = "CUSTOMER";

  distinctCustomerCodes: any;
  selectedEstimateItem?: RepairItem;
  packageLabourItem?: PackageLabourItem;
  sotRepList: StoringOrderTankItem[] = [];
  //sotList: StoringOrderTankItem[] = [];
  customer_companyList?: CustomerCompanyItem[];
  branch_companyList?: CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];
  purposeOptionCvList: CodeValuesItem[] = [];
  processStatusCvList: CodeValuesItem[] = [];
  eirStatusCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  tankStatusCvListDisplay: CodeValuesItem[] = [];
  yardCvList: CodeValuesItem[] = [];
  repairOptionCvList: CodeValuesItem[] = [];


  currentStartCursor: string | undefined = undefined;
  currentEndCursor: string | undefined = undefined;
  lastCursorDirection: string | undefined = undefined;
  maxManuDOMDt: Date = new Date();

  pageIndex = 0;
  pageSize = pageSizeInfo.defaultSize;
  lastSearchCriteria: any;
  lastOrderBy: any = { create_dt: "DESC" };
  endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;
  reSelection = new GuidSelectionModel<any>(true, []);
  //selection = new SelectionModel<InGateCleaningItem>(true, []);
  invoiceNoControl = new FormControl('', [Validators.required]);
  invoiceDateControl = new FormControl('', [Validators.required]);
  invoiceTotalCostControl = new FormControl('0.00');

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
    //this.clnDS= new InGateCleaningDS(this.apollo);
    this.repDS = new RepairDS(this.apollo);
    this.billDS = new BillingDS(this.apollo);
    this.plDS = new PackageLabourDS(this.apollo);
    this
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
      so_no: [''],
      customer_code: this.customerCodeControl,
      branch_code: this.branchCodeControl,
      last_cargo: this.lastCargoControl,
      eir_no: [''],
      ro_no: [''],
      eir_dt: [''],
      cutoff_dt: [''],
      release_dt: [''],
      inv_dt_start: [''],
      inv_dt_end: [''],
      eir_dt_start: [''],
      eir_dt_end: [''],
      tank_no: [''],
      inv_no: [''],
      job_no: [''],
      purpose: [''],
      tank_status_cv: [''],
      estimate_status_cv: [''],
      eir_status_cv: [''],
      yard_cv: [''],
      invoiced: ['']
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
      { alias: 'processStatusCv', codeValType: 'PROCESS_STATUS' },
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'eirStatusCv', codeValType: 'EIR_STATUS' },
      { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
      { alias: 'yardCv', codeValType: 'YARD' },
      { alias: 'repairOptionCv', codeValType: 'REPAIR_OPTION' },
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('processStatusCv').subscribe(data => {
      this.processStatusCvList = data;
    });
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
    this.cvDS.connectAlias('yardCv').subscribe(data => {
      this.yardCvList = addDefaultSelectOption(data, 'All');
    });
    this.cvDS.connectAlias('repairOptionCv').subscribe(data => {
      this.repairOptionCvList = addDefaultSelectOption(data, 'All');
    });
    this.search();
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

  resetPagination() {
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0; // Reset to the first page
      // this.paginator._changePageSize(this.paginator.pageSize); // Trigger a change event
    }
  }
  search() {
    const where: any = {};
    this.selectedEstimateItem = undefined;
    this.resetPagination();
    this.sotRepList = [];
    this.reSelection.clear();
    this.calculateTotalCost();

    where.repair = { some: { and: [] } };


    if (this.searchForm!.get('invoiced')?.value) {
      where.or = [{ repair: { some: { customer_billing_guid: { neq: null } } } }, { repair: { some: { owner_billing_guid: { neq: null } } } }];
    }

    if (this.searchForm!.get('inv_no')?.value) {
      where.repair.some.and.push({
        or: [
          { customer_billing: { invoice_no: { contains: this.searchForm!.get('inv_no')?.value } } },
          { owner_billing: { invoice_no: { contains: this.searchForm!.get('inv_no')?.value } } }
        ]
      });

      // where.customer_billing.invoice_no =  {contains: this.searchForm!.get('inv_no')?.value };
    }

    if (this.searchForm!.get('estimate_status_cv')?.value?.length) {
      where.repair.some.and.push({ status_cv: { in: this.searchForm!.get('estimate_status_cv')?.value } },
        { or: [{ delete_dt: { eq: null } }, { delete_dt: { eq: 0 } }] });
      // where.repair={some:{and:[ 
      //   {status_cv:{in:this.searchForm!.get('estimate_status_cv')?.value}},
      //   {or:[{delete_dt:{eq:null}},{delete_dt:{eq:0}}]}
      // ]}}; 
    }
    else {
      where.repair.some.and.push({ status_cv: { in: this.availableProcessStatus } }, { or: [{ delete_dt: { eq: null } }, { delete_dt: { eq: 0 } }] });
      // where.repair={some:{and:[ 
      //   //{status_cv:{in:['COMPLETED','APPROVED','ASSIGNED','PARTIAL_ASSIGNED','JOB_IN_PROGRESS','QC_COMPLETED']}},
      //   {status_cv:{in:this.availableProcessStatus}},
      //   {or:[{delete_dt:{eq:null}},{delete_dt:{eq:0}}]}
      // ]}}; 
    }
    // where.bill_to_guid={neq:null};
    if (this.searchForm!.get('tank_no')?.value) {
      const tankNo = this.searchForm!.get('tank_no')?.value;
      where.or = [
        { tank_no: { contains: Utility.formatContainerNumber(tankNo) } },
        { tank_no: { contains: Utility.formatTankNumberForSearch(tankNo) } }
      ];
    }

    if (this.searchForm!.get('customer_code')?.value) {

      where.storing_order = { customer_company: { code: { eq: this.searchForm!.get('customer_code')?.value.code } } };
      //where.customer_company={code:{eq: this.searchForm!.get('customer_code')?.value.code }}
    }

    if (this.searchForm!.get('branch_code')?.value) {
      //where.repair={some:{bill_to_guid:{eq:this.searchForm!.get('branch_code')?.value.guid}}};
      where.repair.some.and.push({ bill_to_guid: { eq: this.searchForm!.get('branch_code')?.value.guid } });
      //where.customer_company={code:{eq: this.searchForm!.get('branch_code')?.value.code }}
    }

    if (this.searchForm!.get('eir_dt')?.value) {
      //if(!where.storing_order_tank) where.storing_order_tank={};
      where.in_gate = {
        some: {
          and: [
            { eir_dt: { lte: Utility.convertDate(this.searchForm!.value['eir_dt'], true) } },
            { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }
          ]
        }
      };
    }
    if (this.searchForm!.get('eir_no')?.value) {
      // if(!where.storing_order_tank) where.storing_order_tank={};
      where.in_gate = { some: { eir_no: { contains: this.searchForm!.get('eir_no')?.value } } };
    }

    if (this.searchForm!.get('inv_dt_start')?.value && this.searchForm!.get('inv_dt_end')?.value) {


      where.repair.some.and.push({
        or: [
          { customer_billing: { invoice_dt: { gte: Utility.convertDate(this.searchForm!.value['inv_dt_start']), lte: Utility.convertDate(this.searchForm!.value['inv_dt_end'], true) } } },
          { owner_billing: { invoice_dt: { gte: Utility.convertDate(this.searchForm!.value['inv_dt_start']), lte: Utility.convertDate(this.searchForm!.value['inv_dt_end'], true) } } }
        ]
      });
      //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
    }

    if (this.searchForm!.get('cutoff_dt')?.value) {
      where.repair.some.and.push({ approve_dt: { lte: Utility.convertDate(this.searchForm!.value['cutoff_dt'], true) } });
      //if(!where.repair) where.repair={};
      //where.repair={some:{approve_dt:{lte: Utility.convertDate(this.searchForm!.value['cutoff_dt'],true) }}};
      //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
    }

    if (this.searchForm!.get('release_dt')?.value) {

      where.out_gate = {
        some: {
          out_gate_survey: {
            and: [{ create_dt: { lte: Utility.convertDate(this.searchForm!.value['release_dt'], true) } },
            { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }]
          }
        }
      };
      //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
    }

    if (this.searchForm!.get('last_cargo')?.value) {
      where.tariff_cleaning = { guid: { eq: this.searchForm!.get('last_cargo')?.value.guid } };
      //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
    }


    this.lastSearchCriteria = this.repDS.addDeleteDtCriteria(where);
    this.performSearch(this.pageSize, this.pageIndex, this.pageSize, undefined, undefined, undefined);
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string) {
    // this.selection.clear();
    this.subs.sink = this.sotDS.searchStoringOrderTanksRepairBiling(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {
        const allowedStatuses = (this.searchForm!.get('estimate_status_cv')?.value.length) ? this.searchForm!.get('estimate_status_cv')?.value :
          ['APPROVED', 'QC_COMPLETED', 'JOB_IN_PROGRESS', 'COMPLETED', 'ASSIGNED', 'PARTIAL_ASSIGNED'];
        this.sotRepList = data.map(d => {
          d.repair = d.repair?.filter(r => allowedStatuses.includes(r.status_cv!))
          if (this.searchForm!.get('invoiced')?.value) {
            d.repair = d.repair?.filter(d => d.customer_billing_guid !== null || d.owner_billing_guid !== null);
          }
          return d;
        });

        this.endCursor = this.sotDS.pageInfo?.endCursor;
        this.startCursor = this.sotDS.pageInfo?.startCursor;
        this.hasNextPage = this.sotDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPage = this.sotDS.pageInfo?.hasPreviousPage ?? false;

        this.currentEndCursor = after;
        this.currentStartCursor = before;
        // this.calculateResidueTotalCost();
        this.checkInvoicedAndTotalCost();
        this.distinctCustomerCodes = [... new Set(this.sotRepList.map(item => item.storing_order?.customer_company?.code))];
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
        this.lastCursorDirection = 'forward';
        first = pageSize;
        after = this.endCursor;
      } else if (pageIndex < this.pageIndex && this.hasPreviousPage) {
        // Navigate backward
        this.lastCursorDirection = 'backward';
        last = pageSize;
        before = this.startCursor;
      }
    }

    this.performSearch(pageSize, pageIndex, first, after, last, before);
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
    this.search();
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
      so_no: '',
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
      cutoff_dt: '',
      release_dt: '',
      inv_dt_start: '',
      inv_dt_end: '',
      inv_no: '',
      yard_cv: [''],
      invoiced: null
    });

    this.customerCodeControl.reset('');
    this.lastCargoControl.reset('');
  }

  unselectAllRepairs(row: StoringOrderTankItem): void {
    const rowRepairs = row.repair;

    // Add each repair item to the selection if it's not already selected
    rowRepairs?.forEach(repairItem => {
      if (this.reSelection.isSelected(repairItem)) {
        this.reSelection.toggle(repairItem);
      }
    });
    this.SelectFirstItem();
  }

  isSomeSelected(row: StoringOrderTankItem) {
    // this.calculateTotalCost();
    const rowRepairs = row.repair;
    const selectedItm = this.reSelection.selected;
    const someRepairsSelected = rowRepairs?.some(repairItem =>
      selectedItm.some(selectedItem => selectedItem.guid === repairItem.guid)
    );

    return someRepairsSelected;
  }

  GetStoringOrderTank(row: RepairItem): StoringOrderTankItem | undefined {
    // Iterate through sotRepList to find the matching repairItem
    for (const r of this.sotRepList) {
      const matchingRepairItem = r.repair?.find(repairItem =>
        repairItem.guid === row.guid // Assuming 'guid' is a unique identifier
      );

      // If a matching repairItem is found, return its storing_order_tank
      if (matchingRepairItem) {
        return r;
      }
    }

    // Return undefined if no matching repairItem is found
    return undefined;
  }

  isAllSelected(row: StoringOrderTankItem) {
    // this.calculateTotalCost();
    const rowRepairs = row.repair;
    const selectedItm = this.reSelection.selected;
    const allRepairsSelected = rowRepairs?.every(repairItem =>
      selectedItm.some(selectedItem => selectedItem.guid === repairItem.guid)
    );

    return allRepairsSelected;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(row: StoringOrderTankItem) {
    this.isAllSelected(row)
      ? this.unselectAllRepairs(row)
      : row.repair?.forEach((r) => {
        this.reSelection.select(r);
        this.SelectFirstItem();
      }
      );
    this.calculateTotalCost();
  }

  AllowToSave(): boolean {
    let retval: boolean = false;
    if (this.reSelection.selected.length > 0) {
      if (this.invoiceDateControl.valid && this.invoiceNoControl.valid) {
        return true;
      }
    }

    return retval;
  }

  save(event: Event) {
    event.stopPropagation();
    if (this.invoiceDateControl.invalid || this.invoiceNoControl.invalid) return;

    let invNo: string = `${this.invoiceNoControl.value}`;
    const where: any = {};
    where.invoice_no = { eq: invNo };
    this.billDS.searchRepairBilling(where).subscribe(b => {
      if (b.length) {
        if (b[0].bill_to_guid === this.selectedEstimateItem?.storing_order_tank?.storing_order?.customer_company?.guid) {
          this.ConfirmUpdateBilling(event, b[0]);
        }
        else {
          this.ConfirmInvalidEstimate(event);
        }
      }
      else {
        this.SaveNewBilling(event);
      }
    });




  }

  ConfirmInvalidEstimate(event: Event) {
    event.preventDefault(); // Prevents the form submission

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        headerText: this.translatedLangText.CONFIRM_INVALID_ESTIMATE,
        action: 'new',
      },
      direction: tempDirection
    });
    dialogRef.afterClosed();
  }
  ConfirmUpdateBilling(event: Event, billingItem: BillingItem) {
    event.preventDefault(); // Prevents the form submission

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        headerText: this.translatedLangText.CONFIRM_UPDATE_INVOICE,
        action: 'new',
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result.action === 'confirmed') {
        this.UpdateBilling(event, billingItem);
      }
    });
  }

  UpdateBilling(event: Event, billingItem: BillingItem) {
    let invoiceDate: Date = new Date(this.invoiceDateControl.value!);
    let invoiceDue: Date = new Date(invoiceDate);
    invoiceDue.setMonth(invoiceDate.getMonth() + 1);
    var updateBilling: BillingInputRequest = new BillingInputRequest();
    updateBilling.bill_to_guid = billingItem.bill_to_guid;
    updateBilling.guid = billingItem.guid;
    updateBilling.currency_guid = billingItem.currency_guid;
    updateBilling.invoice_dt = Number(Utility.convertDate(invoiceDate));
    updateBilling.invoice_due = Number(Utility.convertDate(invoiceDue));
    updateBilling.status_cv = billingItem.status_cv;
    updateBilling.invoice_no = `${this.invoiceNoControl.value}`;

    let billingEstimateRequests: any = billingItem.repair_customer?.map(cln => {
      var billingEstReq: BillingEstimateRequest = new BillingEstimateRequest();
      billingEstReq.action = "";
      billingEstReq.billing_party = this.billingParty;
      billingEstReq.process_guid = cln.guid;
      billingEstReq.process_type = this.processType;
      return billingEstReq;
      //return { ...cln, action:'' };
    });
    billingItem.repair_owner?.forEach(cln => {
      var billingEstReq: BillingEstimateRequest = new BillingEstimateRequest();
      billingEstReq.action = "";
      billingEstReq.billing_party = "OWNER";
      billingEstReq.process_guid = cln.guid;
      billingEstReq.process_type = this.processType;
      billingEstimateRequests.push(billingEstReq);
      //return { ...cln, action:'' };
    });
    const existingGuids = new Set(billingEstimateRequests.map((item: { process_guid: any; }) => item.process_guid));
    this.reSelection.selected.forEach(cln => {
      if (!existingGuids.has(cln.guid)) {
        var billingEstReq: BillingEstimateRequest = new BillingEstimateRequest();
        billingEstReq.action = "NEW";
        billingEstReq.billing_party = this.billingParty;
        billingEstReq.process_guid = cln.guid;
        billingEstReq.process_type = this.processType;
        billingEstimateRequests.push(billingEstReq);
      }
    })
    this.billDS._updateBilling(updateBilling, billingEstimateRequests).subscribe(result => {
      if (result.data.updateBilling) {
        this.handleSaveSuccess(result.data.updateBilling);
        this.onCancel(event);
        this.search();
      }
    })

  }

  SaveNewBilling(event: Event) {
    let invoiceDate: Date = new Date(this.invoiceDateControl.value!);
    let invoiceDue: Date = new Date(invoiceDate);
    invoiceDue.setMonth(invoiceDate.getMonth() + 1);
    var newBilling: BillingInputRequest = new BillingInputRequest();
    newBilling.bill_to_guid = this.selectedEstimateItem?.storing_order_tank?.storing_order?.customer_company?.guid;
    newBilling.currency_guid = this.selectedEstimateItem?.storing_order_tank?.storing_order?.customer_company?.currency_guid;
    newBilling.invoice_dt = Number(Utility.convertDate(this.invoiceDateControl.value));
    newBilling.invoice_no = `${this.invoiceNoControl.value}`;
    newBilling.invoice_due = Number(Utility.convertDate(invoiceDue));
    newBilling.status_cv = 'PENDING';
    var billingEstimateRequests: BillingEstimateRequest[] = [];
    this.reSelection.selected.map(c => {
      var billingEstReq: BillingEstimateRequest = new BillingEstimateRequest();

      billingEstReq.action = "NEW";
      billingEstReq.billing_party = c.type === 1 ? "CUSTOMER" : "OWNER"; //this.billingParty;
      billingEstReq.process_guid = c.guid.replace("_1", "");
      billingEstReq.process_type = this.processType;
      billingEstimateRequests.push(billingEstReq);
    });
    this.billDS.addBilling(newBilling, billingEstimateRequests).subscribe(result => {
      if (result.data.addBilling) {
        this.handleSaveSuccess(result.data.addBilling);
        this.onCancel(event);
        this.search();
      }
    })
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.langText.SAVE_SUCCESS;
      this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
        successMsg = res;
        ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
        //this.router.navigate(['/admin/master/estimate-template']);

        // Navigate to the route and pass the JSON object

      });
    }
  }


  onCancel(event: Event) {
    event.stopPropagation();
    this.invoiceNoControl.reset('');
    this.invoiceDateControl.reset('');
  }

  calculateTotalCost() {
    this.invoiceTotalCostControl.setValue('0.00');
    const totalCost = this.reSelection.selected.reduce((accumulator, s) => {
      // Add buffer_cost and cleaning_cost of the current item to the accumulator
      var itm: any = s;
      return accumulator + itm.total_cost;
      //return accumulator + (this.resDS.getApproveTotal(s.residue_part)?.total_mat_cost||0);
    }, 0); // Initialize accumulator to 0
    this.invoiceTotalCostControl.setValue(totalCost.toFixed(2));
  }

  toggleRow(row: RepairItem) {


    this.reSelection.toggle(row);
    this.SelectFirstItem();
    this.calculateTotalCost();
    const sot = this.GetStoringOrderTank(row);
    this.isAllSelected(sot!);
  }

  SelectFirstItem() {
    if (!this.reSelection.selected.length) {
      this.selectedEstimateItem = undefined;
    }
    else if (this.reSelection.selected.length === 1) {
      this.selectedEstimateItem = this.reSelection.selected[0];
    }
  }


  CheckBoxDisable(row: RepairItem) {
    if (this.selectedEstimateItem?.storing_order_tank?.storing_order?.customer_company) {
      if (row.storing_order_tank?.storing_order?.customer_company?.code != this.selectedEstimateItem.storing_order_tank?.storing_order?.customer_company?.code) {
        return true;
      }
    }
    return false;
  }

  MasterCheckBoxDisable(row: StoringOrderTankItem) {
    this.distinctCustomerCodes = [
      ...new Set(
        row.repair
          ?.map(item => item.storing_order_tank?.storing_order?.customer_company?.code)
          .filter(code => code !== undefined && code !== null) // Filter out undefined/null values
      ),
    ];

    // Check if the selected estimate item's customer code is in the distinct customer codes
    if (this.distinctCustomerCodes.length === 1) {
      if (!this.selectedEstimateItem?.storing_order_tank) return true;
      const selectedCustomerCode = this.selectedEstimateItem?.storing_order_tank?.storing_order?.customer_company?.code;
      return this.distinctCustomerCodes.includes(selectedCustomerCode);
    }


    return false;
  }

  checkInvoicedAndTotalCost() {
    this.sotRepList = this.sotRepList?.map(res => {
      return {
        ...res,
        repair: res.repair?.map(repairItem => ({
          ...repairItem,
          bill_to_guid: repairItem.storing_order_tank?.storing_order?.customer_company?.guid,
          invoiced: false,
          net_cost: 0, // Initialize total_cost to 0
          type: 1, // Add the type field with a value of 1
        })) || [], // Ensure repair is always an array
      };
    });

    // Process each item in sotRepList
    this.sotRepList?.forEach(res => {
      var r: any = res;

      // Filter repair items where owner_enable is true
      let repWithOwnerList = res.repair?.filter(r => r.owner_enable);
      if (repWithOwnerList && repWithOwnerList.length > 0) {
        // Map over the filtered list to update customer_company in storing_order
        let ownerList = repWithOwnerList.map(o => {
          const originalClone = JSON.parse(JSON.stringify(o));
          const newRepItem: any = new RepairItem(originalClone);
          newRepItem.type = 2;
          // Update the customer_company field
          if (newRepItem.storing_order_tank && newRepItem.storing_order_tank.storing_order) {
            newRepItem.guid = `${newRepItem.guid}_1`;
            newRepItem.bill_to_guid = newRepItem.storing_order_tank.customer_company.guid;
            newRepItem.owner_enable = false;
            newRepItem.storing_order_tank.storing_order.customer_company = newRepItem.storing_order_tank.customer_company;
          }
          return newRepItem; // Return the updated item
        });

        // Push ownerList items into res.repair
        ownerList.forEach(updatedItem => {
          res.repair?.push(updatedItem); // Add each updated item to res.repair

        });
        res.repair?.forEach(repItm => {
          this.calculateOwnerAndCustomerNetCost(repItm);
        });
      }
      else {
        res.repair?.forEach(r => {
          let repEst: any = r;
          let resultTotalCost = this.repDS.calculateCost(r, r.repair_part!, r.labour_cost);
          repEst.invoiced = (r.customer_billing_guid) ? true : false;
          repEst.net_cost = resultTotalCost.net_lessee_cost;
        });
      }
    });

    // Optional: Filter sotRepList for items with owner_enable (if needed)
    // let ownerEstList = this.sotRepList?.filter(res => res.owner_enable);
  }

  calculateOwnerAndCustomerNetCost(row: RepairItem) {
    let r: any = row;
    if (r.type == 1) {
      r.labour_cost
      let resultTotalCost = this.repDS.calculateCost(r, r.repair_part!, r.labour_cost);
      r.invoiced = (r.customer_billing_guid) ? true : false;
      r.net_cost = resultTotalCost.net_lessee_cost;
    }
    else {
      const where = {
        and: [
          { customer_company_guid: { eq: row.storing_order_tank?.customer_company?.guid } }
        ]
      }
      this.subs.sink = this.plDS.getCustomerPackageCost(where).subscribe(data => {
        let labour_cost: number = row.labour_cost!;
        if (data?.length > 0) {
          labour_cost = data[0].cost;
        }
        let resultTotalCost = this.repDS.calculateCost(r, r.repair_part!, labour_cost);
        const hasLesseeInvoice = Number(resultTotalCost.net_lessee_cost!) > 0 && r.customer_billing_guid !== null;
        const hasOwnerInvoice = Number(resultTotalCost.net_owner_cost!) > 0 && r.owner_billing_guid !== null;


        r.invoiced = (hasLesseeInvoice && hasOwnerInvoice);
        r.net_cost = resultTotalCost.net_owner_cost;
      });
    }

  }
  checkInvoiced() {
    this.sotRepList = this.sotRepList?.map(cln => {

      return { ...cln, invoiced: false };
    });
  }

  handleDelete(event: Event, row: RepairItem) {

    event.preventDefault(); // Prevents the form submission

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        headerText: this.translatedLangText.CONFIRM_REMOVE_ESITMATE,
        action: 'delete',
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result.action === 'confirmed') {
        this.RmoveEstimateFromInvoice(event, row.guid!);
      }
    });
  }

  RmoveEstimateFromInvoice(event: Event, processGuid: string) {
    var updateBilling: any = null;
    var billingEstReq: BillingEstimateRequest = new BillingEstimateRequest();
    billingEstReq.action = "CANCEL";
    billingEstReq.billing_party = this.billingParty;
    billingEstReq.process_guid = processGuid;
    billingEstReq.process_type = this.processType;
    let billingEstimateRequests: BillingEstimateRequest[] = [];
    billingEstimateRequests.push(billingEstReq);

    this.billDS._updateBilling(updateBilling, billingEstimateRequests).subscribe(result => {
      if (result.data.updateBilling) {
        this.handleSaveSuccess(result.data.updateBilling);
        this.onCancel(event);
        this.search();
      }
    })

  }



  getCustomerLabourPackage(customer_company_guid: string) {
    const where = {
      and: [
        { customer_company_guid: { eq: customer_company_guid } }
      ]
    }
    this.subs.sink = this.plDS.getCustomerPackageCost(where).subscribe(data => {
      if (data?.length > 0) {
        this.packageLabourItem = data[0];
      }
    });
  }

  filterDeleted(resultList: any[] | undefined): any {
    return (resultList || []).filter((row: any) => !row.delete_dt);
  }

  stopEventTrigger(event: Event) {
    this.preventDefault(event);
    this.stopPropagation(event);
  }

  stopPropagation(event: Event) {
    event.stopPropagation(); // Stops event propagation
  }

  preventDefault(event: Event) {
    event.preventDefault(); // Prevents the form submission
  }
  getProcessStatusDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.processStatusCvList);
  }
  DisplayCustomerType(row: RepairItem) {
    let r: any = row;
    if (r.type === 1) {
      return this.translatedLangText.LESSEE;
    }
    else {
      return this.translatedLangText.OWNER;
    }
  }

  delete(event: Event) {

    event.preventDefault(); // Prevents the form submission

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        headerText: this.translatedLangText.CONFIRM_REMOVE_ESITMATE,
        action: 'delete',
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result.action === 'confirmed') {
        const guids = this.reSelection.selected.map(item => item.guid).filter((guid): guid is string => guid !== undefined);
        this.RemoveEstimatesFromInvoice(event, guids!);
      }
    });
  }
  RemoveEstimatesFromInvoice(event: Event, processGuid: string[]) {
    var updateBilling: any = null;
    let billingEstimateRequests: BillingEstimateRequest[] = [];
    processGuid.forEach(g => {
      var billingEstReq: BillingEstimateRequest = new BillingEstimateRequest();
      billingEstReq.action = "CANCEL";
      billingEstReq.billing_party = this.billingParty;
      billingEstReq.process_guid = g;
      billingEstReq.process_type = this.processType;
      billingEstimateRequests.push(billingEstReq);
    });

    this.billDS._updateBilling(updateBilling, billingEstimateRequests).subscribe(result => {
      if (result.data.updateBilling) {
        this.handleSaveSuccess(result.data.updateBilling);
        this.onCancel(event);
        this.search();
      }
    })
  }

  getInvoiceNo(row: RepairItem): string {

    if (row.bill_to_guid == row.customer_billing?.bill_to_guid) {
      return row.customer_billing?.invoice_no!;
    }
    else if (row.bill_to_guid == row.owner_billing?.bill_to_guid) {
      return row.owner_billing?.invoice_no!;
    }
    return '-';

  }

  onToggleInvoiced(event: MatSlideToggleChange) {
    this.search();
  }

  getInvoiceDate(row: RepairItem): string | undefined {

    if (row.bill_to_guid == row.customer_billing?.bill_to_guid) {
      return this.displayDate(row.customer_billing?.invoice_dt!);
    }
    else if (row.bill_to_guid == row.owner_billing?.bill_to_guid) {
      return this.displayDate(row.owner_billing?.invoice_dt!);
    }
    return '-';
  }

  repairDialog(event: Event, repair: RepairItem) {
    this.preventDefault(event);
    // if (repair.status_cv === 'PENDING' || repair.status_cv === 'CANCELED') return;
    // this.router.navigate(['/admin/repair/estimate/edit', this.sot?.guid, repair.guid], {
    //   state: { from: this.router.url } // store current route
    // });

    // if (!this.modulePackageService.isGrowthPackage() && !this.modulePackageService.isCustomizedPackage()) return;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(PreviewRepairEstFormDialog, {
      // width: '794px',
      height: '90vh',
      // position: { top: '-9999px', left: '-9999px' },
      data: {
        repair_guid: repair?.guid,
      },
      // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    });
  }

  // showEstimateDetail(event: Event, row: RepairItem) {
  //   this.preventDefault(event);  // Prevents the form submission
  //   let tempDirection: Direction;
  //   if (localStorage.getItem('isRtl') === 'true') {
  //     tempDirection = 'rtl';
  //   } else {
  //     tempDirection = 'ltr';
  //   }
  //   //  const addSot = row ?? new RepairPartItem();
  //   // addSot.repair_guid = addSot.repair_guid;
  //   const dialogRef = this.dialog.open(RepairEstimatePreviewComponent, {
  //     width: '90vw',
  //     height: '90vh',
  //     data: {

  //       repair_guid: row.guid,
  //       sot_guid: row.sot_guid

  //     },
  //     direction: tempDirection
  //   });

  //   this.subs.sink = dialogRef.afterClosed().subscribe((result) => {

  //   });
  // }

  getRepairOptionDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.repairOptionCvList);
  }

  displayNumber(value: number) {
    return Utility.formatNumberDisplay(value);
  }

  getTotalCost(sotRow: StoringOrderTankItem) {
    var repairs: RepairItem[] = this.filterDeleted(sotRow.repair || []);
    const totalCost = repairs.reduce((accumulator, s) => {
      // Add buffer_cost and cleaning_cost of the current item to the accumulator
      var itm: any = s;
      return accumulator + itm.total_cost;
      //return accumulator + (this.resDS.getApproveTotal(s.residue_part)?.total_mat_cost||0);
    }, 0); // Initialize accumulator to 0
    return this.displayNumber(totalCost);
  }

}