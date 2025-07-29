import { Direction } from '@angular/cdk/bidi';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardContent, MatCardModule } from '@angular/material/card';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { GuidSelectionModel } from '@shared/GuidSelectionModel';
import { Apollo } from 'apollo-angular';
import { BillingDS, BillingEstimateRequest, BillingInputRequest, BillingItem, BillingSOTItem } from 'app/data-sources/billing';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { OutGateDS } from 'app/data-sources/out-gate';
import { ResidueDS, ResidueItem } from 'app/data-sources/residue';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { SearchStateService } from 'app/services/search-criteria.service';
import { ComponentUtil } from 'app/utilities/component-util';
import { pageSizeInfo, TANK_STATUS_IN_YARD, TANK_STATUS_POST_IN_YARD, Utility, BILLING_TANK_STATUS, BILLING_TANK_STATUS_IN_YARD } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { FormDialogComponent } from "./form-dialog/form-dialog.component";

@Component({
  selector: 'app-gate-billing',
  standalone: true,
  templateUrl: './gate-billing.component.html',
  styleUrl: './gate-billing.component.scss',
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
    MatSlideToggleModule,
    MatCardContent,
    MatCardModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class GateBillingComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'select',
    'tank_no',
    'customer',
    'eir_no',
    'eir_dt',
    'cost',
    'invoice_no',
    'invoice_date',
    // 'bill_type',
    'tank_status_cv',

    //  'invoiced',
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
    CONFIRM_DELETE: 'COMMON-FORM.CONFIRM-DELETE',
    DELETE: 'COMMON-FORM.DELETE',
    GATE_IN: 'COMMON-FORM.GATE-IN',
    GATE_OUT: 'COMMON-FORM.GATE-OUT',
    INVOICE_TYPE: 'COMMON-FORM.INVOICE-TYPE',
    CLEAR: 'COMMON-FORM.CLEAR',
    SAVE: 'COMMON-FORM.SAVE',
    BILLING: 'COMMON-FORM.BILLING',
  }

  invForm?: UntypedFormGroup;
  searchForm?: UntypedFormGroup;
  customerCodeControl = new UntypedFormControl();
  branchCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();

  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  ogDS: OutGateDS;
  cvDS: CodeValuesDS;
  tcDS: TariffCleaningDS;
  //clnDS:InGateCleaningDS;
  resDS: ResidueDS;
  billDS: BillingDS;
  processType: string = "GATE_IN";
  billingParty: string = "CUSTOMER";
  maxManuDOMDt: Date = new Date();

  distinctCustomerCodes: any;
  selectedEstimateItem?: BillingSOTItem;
  billSotList: any[] = [];
  sotList: StoringOrderTankItem[] = [];
  customer_companyList?: CustomerCompanyItem[];
  branch_companyList?: CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];
  purposeOptionCvList: CodeValuesItem[] = [];
  eirStatusCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  tankStatusCvListDisplay: CodeValuesItem[] = [];
  yardCvList: CodeValuesItem[] = [];
  depotCvList: CodeValuesItem[] = [];
  invoiceTypeCvList: CodeValuesItem[] = [];

  pageStateType = 'BillingGate'
  pageIndex = 0;
  pageSize = pageSizeInfo.defaultSize;
  lastSearchCriteria: any;
  lastOrderBy: any = { create_dt: "DESC" };
  endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;
  selection = new GuidSelectionModel<any>(true, []);
  //selection = new SelectionModel<InGateCleaningItem>(true, []);
  invoiceNoControl = new FormControl('', [Validators.required]);
  invoiceDateControl = new FormControl('', [Validators.required]);
  invoiceTotalCostControl = new FormControl('0.00');
  invoiceTypeControl = new FormControl(this.processType);

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private searchStateService: SearchStateService
  ) {
    super();
    this.translateLangText();
    this.initSearchForm();
    this.initInvoiceForm();
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.ogDS = new OutGateDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);
    //this.clnDS= new InGateCleaningDS(this.apollo);
    this.resDS = new ResidueDS(this.apollo);
    this.billDS = new BillingDS(this.apollo);
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
    this.searchStateService.clearOtherPages(this.pageStateType);
    this.loadData();
  }

  initInvoiceForm() {
    this.invForm = this.fb.group({
      inv_no: [''],
      inv_dt: [''],
      invoice_type: this.invoiceTypeControl
    })
    const today = new Date().toISOString().substring(0, 10);
    this.invoiceDateControl.setValue(today);
    this.invoiceTypeControl.setValue(this.processType);
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
      eir_status_cv: [''],
      yard_cv: [''],
      invoiced: [''],
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
      // { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      // { alias: 'eirStatusCv', codeValType: 'EIR_STATUS' },
      { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
      { alias: 'depotCv', codeValType: 'DEPOT_STATUS' },
      { alias: 'invoiceTypeCv', codeValType: 'INVOICE_TYPE' },
    ];
    this.cvDS.getCodeValuesByType(queries);

    this.cvDS.connectAlias('invoiceTypeCv').subscribe(data => {
      this.invoiceTypeCvList = data;
    });
    this.cvDS.connectAlias('tankStatusCv').subscribe(data => {
      this.tankStatusCvList = data;
    });
    this.cvDS.connectAlias('depotCv').subscribe(data => {
      this.depotCvList = addDefaultSelectOption(data, 'All');
    });

    const savedCriteria = this.searchStateService.getCriteria(this.pageStateType);
    const savedPagination = this.searchStateService.getPagination(this.pageStateType);

    if (savedCriteria) {
      this.searchForm?.patchValue(savedCriteria);
      this.constructSearchCriteria();
    }

    if (savedPagination) {
      this.pageIndex = savedPagination.pageIndex;
      this.pageSize = savedPagination.pageSize;

      this.performSearch(
        savedPagination.pageSize,
        savedPagination.pageIndex,
        savedPagination.first,
        savedPagination.after,
        savedPagination.last,
        savedPagination.before
      );
    }

    if (!savedCriteria && !savedPagination) {
      this.search();
    }
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

  constructSearchCriteria() {
    const where: any = {};
    this.selectedEstimateItem = undefined;
    this.billSotList = [];
    this.selection.clear();
    this.calculateTotalCost();

    where.and = [];
    where.and.push({ or: [{ gate_in: { eq: true } }, { gate_out: { eq: true } }] });
    // where.or=[{gate_in:{eq:true}},{gate_out:{eq:true}}];
    //where.status_cv={in:['COMPLETED','APPROVED']};
    where.guid = { neq: null };
    if (this.searchForm!.get('tank_no')?.value) {
      if (!where.storing_order_tank) where.storing_order_tank = {};
      if (!where.storing_order_tank.tank_no) where.storing_order_tank.tank_no = {};
      where.storing_order_tank.tank_no = { contains: this.searchForm!.get('tank_no')?.value };
    }

    where.storing_order_tank = {};
    where.storing_order_tank.tank_status_cv = { in: BILLING_TANK_STATUS };
    if (this.searchForm!.get('depot_status_cv')?.value) {
      if (!where.storing_order_tank) where.storing_order_tank = {};
      if (!where.storing_order_tank.tank_status_cv) where.storing_order_tank.tank_status_cv = {};
      var cond: any = { in: TANK_STATUS_POST_IN_YARD };
      if (this.searchForm!.get('depot_status_cv')?.value != "RELEASED") {
        cond = { in: BILLING_TANK_STATUS_IN_YARD };
      }


      where.storing_order_tank.tank_status_cv = cond;
    }

    if (this.searchForm!.get('invoiced')?.value) {
      where.or = [{ gin_billing_guid: { neq: null } }, { gout_billing_guid: { neq: null } }];
    }

    if (this.searchForm!.get('customer_code')?.value) {
      if (!where.storing_order_tank) where.storing_order_tank = {};
      if (!where.storing_order_tank.storing_order) where.storing_order_tank.storing_order = {};
      where.storing_order_tank.storing_order = { customer_company: { code: { eq: this.searchForm!.get('customer_code')?.value.code } } };
      //where.customer_company={code:{eq: this.searchForm!.get('customer_code')?.value.code }}
    }

    if (this.searchForm!.get('branch_code')?.value) {
      where.storing_order_tank = { storing_order: { customer_company: { main_customer_guid: { eq: this.searchForm!.get('customer_code')?.value.guid } } } };
      where.storing_order_tank = { storing_order: { customer_company: { code: { eq: this.searchForm!.get('branch_code')?.value.code } } } };
      //where.customer_company={code:{eq: this.searchForm!.get('branch_code')?.value.code }}
    }

    if (this.searchForm!.get('eir_dt')?.value) {
      if (!where.storing_order_tank) where.storing_order_tank = {};
      where.storing_order_tank.in_gate = {
        some: {
          and: [
            { eir_dt: { lte: Utility.convertDate(this.searchForm!.value['eir_dt'], true) } },
            { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }
          ]
        }
      };
    }
    if (this.searchForm!.get('eir_no')?.value) {
      if (!where.storing_order_tank) where.storing_order_tank = {};
      where.storing_order_tank.in_gate = { some: { eir_no: { contains: this.searchForm!.get('eir_no')?.value } } };
    }

    if (this.searchForm!.get('inv_dt_start')?.value && this.searchForm!.get('inv_dt_end')?.value) {
      if (!where.and) where.and = [];
      var orCond = [];
      orCond.push({ gin_billing: { invoice_dt: { gte: Utility.convertDate(this.searchForm!.value['inv_dt_start']), lte: Utility.convertDate(this.searchForm!.value['inv_dt_end']) } } });
      orCond.push({ gout_billing: { invoice_dt: { gte: Utility.convertDate(this.searchForm!.value['inv_dt_start']), lte: Utility.convertDate(this.searchForm!.value['inv_dt_end']) } } });
      where.and.push({ or: orCond });
      //where.gateio_billing.invoice_dt = { gte: Utility.convertDate(this.searchForm!.value['inv_dt_start']), lte: Utility.convertDate(this.searchForm!.value['inv_dt_end'], true) };
      //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
    }

    if (this.searchForm!.get('cutoff_dt')?.value) {

      where.create_dt = { lte: Utility.convertDate(this.searchForm!.value['cutoff_dt'], true) };
      //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
    }

    if (this.searchForm!.get('release_dt')?.value) {
      if (!where.storing_order_tank) where.storing_order_tank = {};
      where.storing_order_tank.out_gate = {
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
      if (!where.storing_order_tank) where.storing_order_tank = {};

      where.storing_order_tank.tariff_cleaning = { guid: { eq: this.searchForm!.get('last_cargo')?.value.guid } };
      //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
    }

    if (this.searchForm!.get('inv_no')?.value) {
      if (!where.and) where.and = [];
      var orCond = [];
      orCond.push({ gin_billing: { invoice_no: { contains: this.searchForm!.get('inv_no')?.value } } });
      orCond.push({ gout_billing: { invoice_no: { contains: this.searchForm!.get('inv_no')?.value } } });
      where.and.push({ or: orCond });
      //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
    }

    this.lastSearchCriteria = this.billDS.addDeleteDtCriteria(where);
  }

  search() {
    this.constructSearchCriteria();
    this.performSearch(this.pageSize, 0, this.pageSize, undefined, undefined, undefined);
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string) {
    this.searchStateService.setCriteria(this.pageStateType, this.searchForm?.value);
    this.searchStateService.setPagination(this.pageStateType, {
      pageSize,
      pageIndex,
      first,
      after,
      last,
      before
    });
    this.subs.sink = this.billDS.searchBillingSOT(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {
        this.billSotList = data;//this.transformBillSotList(data);
        this.endCursor = this.billDS.pageInfo?.endCursor;
        this.startCursor = this.billDS.pageInfo?.startCursor;
        this.hasNextPage = this.billDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPage = this.billDS.pageInfo?.hasPreviousPage ?? false;
        // this.calculateResidueTotalCost();
        this.checkInvoicedAndTotalCost();
        this.distinctCustomerCodes = [... new Set(this.billSotList.map(item => item.storing_order_tank?.storing_order?.customer_company?.code))];
      });

    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
    this.paginator.pageIndex = pageIndex;
  }

  onPageEvent(event: PageEvent) {
    const { pageIndex, pageSize } = event;
    let first: number | undefined = undefined;
    let after: string | undefined = undefined;
    let last: number | undefined = undefined;
    let before: string | undefined = undefined;

    //const pgSize=pageSize/2;
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
    return this.cvDS.getCodeDescription(codeValType, this.tankStatusCvList);
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
      invoiced: null,
      depot_status_cv: '',
      invoice_type: 'GATE_IN'
    });

    this.invoiceTypeControl.setValue('GATE_IN');
    this.customerCodeControl.reset('');
    this.lastCargoControl.reset('');
  }

  isAllSelected() {
    // this.calculateTotalCost();
    const numSelected = this.selection.selected.length;
    const numRows = this.billSotList.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.billSotList.forEach((row) =>
        this.selection.select(row)
      );
    this.calculateTotalCost();
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

  save(event: Event) {
    event.stopPropagation();
    if (this.invoiceDateControl.invalid || this.invoiceNoControl.invalid) return;

    let invNo: string = `${this.invoiceNoControl.value}`;
    const where: any = {};
    where.invoice_no = { eq: invNo };
    this.billDS.searchResidueBilling(where).subscribe(b => {
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
        headerText: this.translatedLangText.CONFIRM_DELETE,
        action: 'delete',
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result.action === 'confirmed') {
        // const guids = this.selection.selected.map(item => item.guid).filter((guid): guid is string => guid !== undefined);
        //this.RemoveEstimatesFromInvoice(event, guids!);
        this.RemoveSelectedEstimatesFromInvoice(event);
      }
    });
  }


  RemoveSelectedEstimatesFromInvoice(event: Event) {
    var updateBilling: any = null;
    let billingEstimateRequests: BillingEstimateRequest[] = [];
    this.selection.selected.forEach(g => {
      var billingEstReq: BillingEstimateRequest = new BillingEstimateRequest();
      billingEstReq.action = "CANCEL";
      billingEstReq.billing_party = this.billingParty;
      billingEstReq.process_guid = g.guid.replace('-1', '').replace('-2', '');
      billingEstReq.process_type = `${this.invoiceTypeControl.value}`;
      billingEstimateRequests.push(billingEstReq);
    })
    // processGuid.forEach(g => {
    //   var billingEstReq: BillingEstimateRequest = new BillingEstimateRequest();
    //   billingEstReq.action = "CANCEL";
    //   billingEstReq.billing_party = this.billingParty;
    //   billingEstReq.process_guid = g;
    //   billingEstReq.process_type = billType;
    //   billingEstimateRequests.push(billingEstReq);
    // });

    this.billDS._updateBilling(updateBilling, billingEstimateRequests).subscribe(result => {
      if (result.data.updateBilling) {
        this.handleSaveSuccess(result.data.updateBilling);
        this.onCancel(event);
        this.search();
      }
    })

  }


  RemoveEstimatesFromInvoice(event: Event, processGuid: string[], billType: string) {
    var updateBilling: any = null;
    let billingEstimateRequests: BillingEstimateRequest[] = [];
    processGuid.forEach(g => {
      var billingEstReq: BillingEstimateRequest = new BillingEstimateRequest();
      billingEstReq.action = "CANCEL";
      billingEstReq.billing_party = this.billingParty;
      billingEstReq.process_guid = g;
      billingEstReq.process_type = billType;
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
        action: 'confirm_only',
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
    if (this.processType === "GATE_IN")
      updateBilling.invoice_type = "Gate In";
    else
      updateBilling.invoice_type = "Gate Out";

    let billingEstimateRequests_GateIn: any = billingItem.gin_billing_sot?.map(cln => {
      var billingEstReq: BillingEstimateRequest = new BillingEstimateRequest();
      billingEstReq.action = "";
      billingEstReq.billing_party = this.billingParty;
      billingEstReq.process_guid = cln.guid!.replace('-1', '').replace('-2', '');
      billingEstReq.process_type = 'GATE_IN';
      return billingEstReq;
      //return { ...cln, action:'' };
    });
    let billingEstimateRequests_GateOut: any = billingItem.gout_billing_sot?.map(cln => {
      var billingEstReq: BillingEstimateRequest = new BillingEstimateRequest();
      billingEstReq.action = "";
      billingEstReq.billing_party = this.billingParty;
      billingEstReq.process_guid = cln.guid!.replace('-1', '').replace('-2', '');
      billingEstReq.process_type = 'GATE_OUT';
      return billingEstReq;
      //return { ...cln, action:'' };
    });
    const billingEstimateRequests = (billingEstimateRequests_GateIn || []).concat(
      billingEstimateRequests_GateOut || []
    );

    const existingGuids = new Set(billingEstimateRequests.map((item: { guid: any; }) => item.guid));

    this.selection.selected.forEach(cln => {
      if (!existingGuids.has(cln.guid)) {
        var billingEstReq: BillingEstimateRequest = new BillingEstimateRequest();
        billingEstReq.action = "NEW";
        billingEstReq.billing_party = this.billingParty;
        billingEstReq.process_guid = cln.guid.replace('-1', '').replace('-2', '');
        billingEstReq.process_type = `${this.invoiceTypeControl.value}`;
        billingEstimateRequests.push(billingEstReq);
      }
    })
    this.billDS._updateBilling(updateBilling, billingEstimateRequests).subscribe(result => {
      if (result.data.updateBilling) {
        this.handleSaveSuccess(result.data.updateBilling);
        this.onCancel(event);
        this.pageIndex = 0;
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
    newBilling.invoice_dt = Number(Utility.convertDate(invoiceDate));
    newBilling.invoice_due = Number(Utility.convertDate(invoiceDue));
    newBilling.invoice_no = `${this.invoiceNoControl.value}`;
    if (this.processType === "GATE_IN")
      newBilling.invoice_type = "Gate In";
    else
      newBilling.invoice_type = "Gate Out";
    newBilling.status_cv = 'PENDING';
    var billingEstimateRequests: BillingEstimateRequest[] = [];
    this.selection.selected.map(c => {
      var billingEstReq: BillingEstimateRequest = new BillingEstimateRequest();

      billingEstReq.action = "NEW";
      billingEstReq.billing_party = this.billingParty;
      billingEstReq.process_guid = c.guid.replace('-1', '').replace('-2', '');
      billingEstReq.process_type = `${this.invoiceTypeControl.value}`;
      billingEstimateRequests.push(billingEstReq);
    });
    this.billDS.addBilling(newBilling, billingEstimateRequests).subscribe(result => {
      if (result.data.addBilling) {
        this.handleSaveSuccess(result.data.addBilling);
        this.onCancel(event);
        this.pageIndex = 0;
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
    this.processType = "GATE_IN";
    this.invoiceNoControl.reset('');
    const today = new Date().toISOString().substring(0, 10);
    this.invoiceDateControl.setValue(today);
    this.invoiceTypeControl.setValue(this.processType);
    this.pageIndex = 0;

  }

  calculateTotalCost() {
    var invalidItm: any[] = [];
    this.invoiceTotalCostControl.setValue('0.00');
    const totalCost = this.selection.selected.reduce((accumulator, s) => {
      // Add buffer_cost and cleaning_cost of the current item to the accumulator
      var itm: any = s;
      var cost: number = s.gate_in_cost;

      if (this.processType === "GATE_OUT") {

        cost = s.gate_out_cost;

      }



      return accumulator + cost;
      // if (this.processType === "GATE_IN") {
      //   if (s.gin_billing) {
      //     invalidItm.push(s);
      //     return accumulator;
      //   }
      //   return accumulator + s.gate_in_cost;
      // }
      // else {
      //   if (s.gout_billing) {
      //     invalidItm.push(s);
      //     return accumulator;
      //   }
      //   return accumulator + s.gate_out_cost;
      // }
      // return accumulator + itm.total_cost;
      //return accumulator + (this.resDS.getApproveTotal(s.residue_part)?.total_mat_cost||0);
    }, 0); // Initialize accumulator to 0
    this.invoiceTotalCostControl.setValue(totalCost.toFixed(2));
    // if (invalidItm.length > 0) {
    //   setTimeout(() => {
    //     invalidItm.forEach(item => {
    //       this.selection.toggle(item);
    //     });
    //     this.SelectFirstItem();
    //   });
    // }
  }

  toggleRow(row: ResidueItem) {

    this.selection.toggle(row);
    this.SelectFirstItem();
    this.calculateTotalCost();
  }

  SelectFirstItem() {
    if (!this.selection.selected.length) {
      this.selectedEstimateItem = undefined;
    }
    else if (this.selection.selected.length === 1) {
      this.selectedEstimateItem = this.selection.selected[0];
    }
  }
  CheckBoxDisable(row: BillingSOTItem) {
    if (this.selectedEstimateItem?.storing_order_tank?.storing_order?.customer_company) {
      if (row.storing_order_tank?.storing_order?.customer_company?.code != this.selectedEstimateItem.storing_order_tank?.storing_order?.customer_company?.code) {
        return true;
      }

      // const normalizedRowGuid = row.guid?.replace('-1', '').replace('-2', '');

      // for (const item of this.selection.selected) {
      //     const normalizedItemGuid = item.guid?.replace('-1', '').replace('-2', '');

      //     if (normalizedItemGuid === normalizedRowGuid) {
      //         if (item.billing_type !== (row as any).billing_type) {
      //             return true;
      //         }
      //     }
      // }

    }
    // else {
    //   if (this.processType === "GATE_IN") {
    //     return (row.gin_billing);
    //   }
    //   else {
    //     return (row.gout_billing);
    //   }
    // }

    return false;
  }

  MasterCheckBoxDisable() {
    if (this.distinctCustomerCodes?.length) {
      return this.distinctCustomerCodes.length > 1;
    }
    else {

    }

    return false;
  }

  checkInvoicedAndTotalCost() {
    this.billSotList = this.billSotList?.map(res => {


      return { ...res, invoiced: ((res.gin_billing_guid || res.gout_billing_guid) ? true : false), total_cost: (res.gate_in ? (res.gate_in_cost || 0) : 0) + (res.gate_out ? (res.gate_out_cost || 0) : 0) };
      //return { ...res, invoiced: (res.gateio_billing_guid ? true : false), total_cost: (res.gate_in_cost || 0) + (res.gate_out_cost || 0) };
    });
  }

  //  checkInvoiced()
  // {
  //   this.billSotList = this.billSotList?.map(cln => {

  //             return { ...cln, invoiced: (cln.customer_billing_guid?true:false) };
  //       });
  // }

  handleDelete(event: Event, row: ResidueItem) {

    event.preventDefault(); // Prevents the form submission

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        headerText: this.translatedLangText.CONFIRM_DELETE,
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

  IsApproved(residue: ResidueItem) {
    const validStatus = ['APPROVED', 'COMPLETED', 'QC_COMPLETED']
    return validStatus.includes(residue!.status_cv!);

  }

  transformBillSotList(originalList: BillingSOTItem[]): any[] {
    var transformedList: any[] = [];

    originalList.forEach(item => {



      var billing_type: string = '';
      var invoice_no: string = '';
      var invoice_date: Number = 0;
      //if (item.gin_billing)
      if (item.gate_in) {
        transformedList.push({
          ...item,
          guid: `${item.guid}-1`,
          billing_type: "GATE_IN",
          invoice_no: item.gin_billing?.invoice_no || '',
          invoice_dt: item.gin_billing?.invoice_dt || 0,
          gate_cost: (item.gin_billing) ? this.displayNumber(item.gate_in_cost!) : '-'
        });
      }

      //if (item.gout_billing) 
      if (item.gate_out) {
        transformedList.push({
          ...item,
          guid: `${item.guid}-2`,
          billing_type: "GATE_OUT",
          invoice_no: item.gout_billing?.invoice_no || '',
          invoice_dt: item.gout_billing?.invoice_dt || 0,
          gate_cost: (item.gout_billing) ? this.displayNumber(item.gate_out_cost!) : '-'
        });
      }

      // transformedList.push({
      //   ...item,
      //   billing_type: billing_type,
      //   invoice_no: invoice_no,
      //   invoice_date: invoice_date
      // });

    });

    return transformedList;
  }

  //DisplayEirNo(billing_type: string, row: any) 
  DisplayEirNo(row: any) {
    //if (row.billing_type == "GATE_IN") {
    return this.igDS.getInGateItem(row.storing_order_tank?.in_gate)?.eir_no
    // }
    // else {
    //   return this.ogDS.getOutGateItem(row.storing_order_tank?.out_gate)?.eir_no
    // }
  }

  //DisplayEirDate(billing_type: string, row: any) 
  DisplayEirDate(row: any) {
    //if (row.billing_type == "GATE_IN") {
    return this.displayDate(this.igDS.getInGateItem(row.storing_order_tank?.in_gate)?.eir_dt);
    // }
    // else {
    //   return this.ogDS.getOutGateItem(row.storing_order_tank?.out_gate)?.eir_dt
    // }
  }

  //DisplayInvoiceNo(billing_type: string, row: any) 
  DisplayInvoiceNo(row: any) {
    if (row.billing_type == "GATE_IN") {
      if (row.gin_billing) {
        return (row.gin_billing?.invoice_no || '-');
      }
      else { return '-'; }
    }
    else {
      if (row.gout_billing) {
        return (row.gout_billing?.invoice_no || '-');
      }
      else { return '-'; }
    }
  }
  //DisplayInvoiceDate(billing_type: string, row: any) 
  DisplayInvoiceDate(row: any) {
    //return '-';
    return this.displayDate(row.invoice_dt);
    // if (billing_type == "GATE_IN") {
    //   if (row.gin_billing) {
    //     return this.displayDate(row.gin_billing?.invoice_dt);
    //   }
    //   else { return '-'; }
    // }
    // else {
    //   if (row.gout_billing) {
    //     return this.displayDate(row.gout_billing?.invoice_dt);
    //   }
    //   else { return '-'; }
    // }
  }
  // DisplayCost(billing_type: string, row: any) 
  DisplayCost(row: any) {
    return this.displayNumber(row.gate_in_cost + row.gate_out_cost);
    // if (row.billing_type == "GATE_IN") {
    //   if (row.gin_billing) {
    //     return this.displayNumber(row.gate_in_cost);
    //   }
    //   else { return '-'; }
    // }
    // else {
    //   if (row.gout_billing) {
    //     return this.displayNumber(row.gate_out_cost);
    //   }
    //   else { return '-'; }
    // }
  }

  displayNumber(value: number) {
    return Utility.formatNumberDisplay(value);
  }

  onToggleInvoiced(event: MatSlideToggleChange) {
    // if (event.checked) {
    //   const currentDateTime = new Date();
    //   console.log('Toggle is ON. Current date/time:', currentDateTime);

    //   // Call your function to use the date/time
    //   //this.handleInvoicedToggle(currentDateTime);
    // }
    this.search();
  }

  delete_invoice(event: Event, row: any, billType: string) {

    event.preventDefault(); // Prevents the form submission

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        headerText: this.translatedLangText.CONFIRM_DELETE,
        action: 'delete',
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result.action === 'confirmed') {
        const guids: string[] = [row.guid!];
        const proGuids: string[] = [row.guid!];
        this.RemoveEstimatesFromInvoice(event, proGuids, billType);
      }
    });
  }

  ConvertEpochToDate(dt: number) {
    return Utility.convertEpochToDateStr(dt);
  }

  DisplayBillingType(billing_type: string) {
    return this.cvDS.getCodeDescription(billing_type, this.invoiceTypeCvList);
  }

  onInvoiceTypeChange(event: Event) {
    this.processType = `${this.invoiceTypeControl.value}`;
    this.calculateTotalCost();
  }



  isGateInInvoice(row: any): boolean {

    var bretval: boolean = false;
    bretval = row.gin_billing === null ? false : true;
    return bretval;
  }


  isGateOutInvoice(row: any): boolean {

    var bretval: boolean = false;
    bretval = row.gout_billing === null ? false : true;

    return bretval;
  }

  onTabFocused() {
    this.resetForm();
    this.search();
  }

  viewCall(row: BillingSOTItem) {
    // this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }


    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '65vw',
      maxWidth: '800px',
      //height: '80vh',
      data: {
        action: 'view',
        langText: this.langText,
        selectedItem: row
      },
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      // if (result > 0) {
      //   this.handleSaveSuccess(result);
      //   // if (this.packRepairItems.length > 1)
      //   //   this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
      // }
    });
  }

  GetTotalCostTypeLabel() {
    var retval = `${this.translatedLangText.TOTAL_COST}`;
    if (this.processType === "GATE_OUT") {

      retval = `${this.translatedLangText.TOTAL_COST}`;
    }
    return retval;
  }
}