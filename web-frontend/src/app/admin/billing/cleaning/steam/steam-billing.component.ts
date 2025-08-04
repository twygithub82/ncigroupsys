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
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { GuidSelectionModel } from '@shared/GuidSelectionModel';
import { Apollo } from 'apollo-angular';
import { BillingDS, BillingEstimateRequest, BillingInputRequest, BillingItem } from 'app/data-sources/billing';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { InGateCleaningItem } from 'app/data-sources/in-gate-cleaning';
import { PackageLabourDS } from 'app/data-sources/package-labour';
import { SteamDS, SteamItem } from 'app/data-sources/steam';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { BusinessLogicUtil, invoice_type_mapping } from 'app/utilities/businesslogic-util';
import { ComponentUtil } from 'app/utilities/component-util';
import { pageSizeInfo, TANK_STATUS_IN_YARD, TANK_STATUS_POST_IN_YARD, Utility, BILLING_TANK_STATUS, BILLING_TANK_STATUS_IN_YARD } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { debounceTime, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'app-steam-billing',
  standalone: true,
  templateUrl: './steam-billing.component.html',
  styleUrl: './steam-billing.component.scss',
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
    MatCardModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class SteamBillingComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'select',
    'tank_no',
    'customer',
    'eir_no',
    'eir_dt',
    'last_cargo',
    //'purpose',
    'cost',
    'invoice_no',
    'invoice_date',
    'tank_status_cv'
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
    SAVE: 'COMMON-FORM.SAVE',
    CLEAR: 'COMMON-FORM.CLEAR',
    BILLING_BRANCH: 'COMMON-FORM.BILLING-BRANCH',
    CUTOFF_DATE: 'COMMON-FORM.CUTOFF-DATE',
    SAVE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    INVOICED: 'COMMON-FORM.INVOICED',
    CONFIRM_UPDATE_INVOICE: 'COMMON-FORM.CONFIRM-UPDATE-INVOICE',
    CONFIRM_INVALID_ESTIMATE: 'COMMON-FORM.CONFIRM-INVALID-ESTIMATE',
    COST: 'COMMON-FORM.COST',
    CONFIRM_REMOVE_ESITMATE: 'COMMON-FORM.CONFIRM-REMOVE-ESITMATE',
    DELETE: 'COMMON-FORM.DELETE'
  }

  invForm?: UntypedFormGroup;
  searchForm?: UntypedFormGroup;
  customerCodeControl = new UntypedFormControl();
  branchCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  maxManuDOMDt: Date = new Date();


  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  cvDS: CodeValuesDS;
  tcDS: TariffCleaningDS;
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
  yardCvList: CodeValuesItem[] = [];
  depotCvList: CodeValuesItem[] = [];

  processType: string = "STEAMING";
  billingParty: string = "CUSTOMER";

  pageIndex = 0;
  pageSize = pageSizeInfo.defaultSize;
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
      eir_status_cv: [''],
      yard_cv: [''],
      invoiced: [''],
      depot_status_cv: ['']
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
      this.tankStatusCvList = addDefaultSelectOption(data, 'All');
    });
    this.cvDS.connectAlias('yardCv').subscribe(data => {
      this.yardCvList = addDefaultSelectOption(data, 'All');
    });
    this.cvDS.connectAlias('depotCv').subscribe(data => {
      this.depotCvList = addDefaultSelectOption(data, 'All');
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

  search() {
    const where: any = {};
    this.selectedEstimateItem = undefined;
    this.selectedEstimateLabourCost = 0;
    this.stmEstList = [];
    this.selection.clear();
    this.calculateTotalCost();

    //where.status_cv = { in: ['QC_COMPLETED', 'COMPLETED', 'APPROVED', 'JOB_IN_PROGRESS', 'ASSIGNED', 'PARTIAL_ASSIGNED'] };

   //For Steaming Temp
   // where.status_cv = { in: ['COMPLETED'] }; 

    where.or= [
      {  and: [
          { create_by: { neq: "system" } },
          { status_cv: { in: ['QC_COMPLETED', 'COMPLETED', 'APPROVED', 'JOB_IN_PROGRESS', 'ASSIGNED', 'PARTIAL_ASSIGNED']  }}
        ]
      },
      { and: [
          { create_by: { eq: "system" } },
          { status_cv: {in: ['QC_COMPLETED', 'COMPLETED'] }}
        ]
      }
    ];

    where.bill_to_guid = { neq: null };


    if (!where.storing_order_tank) where.storing_order_tank = {};
         where.storing_order_tank.tank_status_cv={ in: BILLING_TANK_STATUS};


    if (this.searchForm?.get('depot_status_cv')?.value != "") {
      if (!where.storing_order_tank) where.storing_order_tank = {};
      if (!where.storing_order_tank.tank_status_cv) where.storing_order_tank.tank_status_cv = {};
      var cond: any = { in: TANK_STATUS_POST_IN_YARD };
      if (this.searchForm!.get('depot_status_cv')?.value != "RELEASED") {
        cond = { in: BILLING_TANK_STATUS_IN_YARD };
      }

      where.storing_order_tank.tank_status_cv = cond;
    }

    if (this.searchForm!.get('tank_no')?.value) {
      const tankNo = this.searchForm!.get('tank_no')?.value;
      if (!where.storing_order_tank) where.storing_order_tank = {};
      // if (!where.storing_order_tank.tank_no) where.storing_order_tank.tank_no = {};
      // where.storing_order_tank.tank_no = { contains: this.searchForm!.get('tank_no')?.value };
      where.storing_order_tank.or = [
        { tank_no: { contains: Utility.formatContainerNumber(tankNo) } },
        { tank_no: { contains: Utility.formatTankNumberForSearch(tankNo) } }
      ];
    }

    if (this.searchForm!.get('inv_no')?.value) {
      if (!where.customer_billing) where.customer_billing = {};
      // if(!where.storing_order_tank.tank_no) where.storing_order_tank.tank_no={};

      where.customer_billing.invoice_no = { contains: this.searchForm!.get('inv_no')?.value };
    }


    if (this.searchForm!.get('customer_code')?.value) {
      if (!where.storing_order_tank) where.storing_order_tank = {};
      if (!where.storing_order_tank.storing_order) where.storing_order_tank.storing_order = {};
      where.storing_order_tank.storing_order = { customer_company: { code: { eq: this.searchForm!.get('customer_code')?.value.code } } };
      // where.customer_company={code:{eq: this.searchForm!.get('customer_code')?.value.code }}
    }

    if (this.searchForm!.get('invoiced')?.value) {
      where.customer_billing_guid = { neq: null };
    }

    if (this.searchForm!.get('branch_code')?.value) {
      where.customer_company = { code: { eq: this.searchForm!.get('branch_code')?.value.code } }
    }


    if (this.searchForm!.get('eir_dt')?.value) {
      if (!where.storing_order_tank) where.storing_order_tank = {};
      if (!where.storing_order_tank.or) where.storing_order_tank.or = [];
      where.storing_order_tank.or.push({
        in_gate: {
          some: {
            and: [
              { eir_dt: { lte: Utility.convertDate(this.searchForm!.value['eir_dt'], true) } },
              { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }
            ]
          }
        }
      });
      where.storing_order_tank.or.push({
        out_gate: {
          some: {
            and: [
              { eir_dt: { lte: Utility.convertDate(this.searchForm!.value['eir_dt'], true) } },
              { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }
            ]
          }
        }
      });
    }

    if (this.searchForm!.get('eir_no')?.value) {
      if (!where.storing_order_tank) where.storing_order_tank = {};
      if (!where.storing_order_tank.or) where.storing_order_tank.or = [];
      where.storing_order_tank.or.push({ in_gate: { some: { eir_no: { contains: this.searchForm!.get('eir_no')?.value } } } });
      where.storing_order_tank.or.push({ out_gate: { some: { eir_no: { contains: this.searchForm!.get('eir_no')?.value } } } });
      //where.storing_order_tank.in_gate = { some:{eir_no:{contains: this.searchForm!.get('eir_no')?.value }}};

    }

    if (this.searchForm!.get('inv_dt_start')?.value && this.searchForm!.get('inv_dt_end')?.value) {
      if (!where.customer_billing) where.customer_billing = {};
      where.customer_billing.invoice_dt = { gte: Utility.convertDate(this.searchForm!.value['inv_dt_start']), lte: Utility.convertDate(this.searchForm!.value['inv_dt_end'], true) };
      //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
    }

    if (this.searchForm!.get('cutoff_dt')?.value) {

      where.approve_dt = { lte: Utility.convertDate(this.searchForm!.value['cutoff_dt'], true) };
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


    this.lastSearchCriteria = this.stmDS.addDeleteDtCriteria(where);
    this.performSearch(this.pageSize, this.pageIndex, this.pageSize, undefined, undefined, undefined);
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string) {
    // this.selection.clear();
    this.subs.sink = this.stmDS.searchWithBilling(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {
        this.stmEstList = data;
        this.endCursor = this.stmDS.pageInfo?.endCursor;
        this.startCursor = this.stmDS.pageInfo?.startCursor;
        this.hasNextPage = this.stmDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPage = this.stmDS.pageInfo?.hasPreviousPage ?? false;

        this.checkInvoicedAndGetTotalCost();
        //this.checkInvoiced();
        this.distinctCustomerCodes = [... new Set(this.stmEstList.map(item => item.customer_company?.code))];
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
      depot_status_cv: ''
    });

    this.branchCodeControl.reset('');
    this.customerCodeControl.reset('');
    this.lastCargoControl.reset('');
  }

  isAllSelected() {
    // this.calculateTotalCost();
    const numSelected = this.selection.selected.length;
    const numRows = this.stmEstList.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.stmEstList.forEach((row) =>
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
    this.billDS.searchSteamingBilling(where).subscribe(b => {
      if (b.length) {
        if (b[0].bill_to_guid === this.selectedEstimateItem?.customer_company?.guid) {
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
        headerText: this.translatedLangText.CONFIRM_REMOVE_ESITMATE,
        action: 'delete',
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result.action === 'confirmed') {
        const guids = this.selection.selected.map(item => item.guid).filter((guid): guid is string => guid !== undefined);
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

    let billingEstimateRequests: any = billingItem.steaming?.map(cln => {
      var billingEstReq: BillingEstimateRequest = new BillingEstimateRequest();
      billingEstReq.action = "";
      billingEstReq.billing_party = this.billingParty;
      billingEstReq.process_guid = cln.guid;
      billingEstReq.process_type = this.processType;
      return billingEstReq;
      //return { ...cln, action:'' };
    });
    const existingGuids = new Set(billingEstimateRequests.map((item: { process_guid: any; }) => item.process_guid));
    this.selection.selected.forEach(cln => {
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
    newBilling.bill_to_guid = this.selectedEstimateItem?.customer_company?.guid;
    newBilling.currency_guid = this.selectedEstimateItem?.customer_company?.currency_guid;
    newBilling.invoice_dt = Number(Utility.convertDate(invoiceDate));
    newBilling.invoice_due = Number(Utility.convertDate(invoiceDue));
    newBilling.invoice_no = `${this.invoiceNoControl.value}`;
    newBilling.invoice_type = invoice_type_mapping.STEAMING;
    newBilling.status_cv = 'PENDING';
    var billingEstimateRequests: BillingEstimateRequest[] = [];
    this.selection.selected.map(c => {
      var billingEstReq: BillingEstimateRequest = new BillingEstimateRequest();

      billingEstReq.action = "NEW";
      billingEstReq.billing_party = this.billingParty;
      billingEstReq.process_guid = c.guid;
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
    const totalCost = this.selection.selected.reduce((accumulator, s) => {
      // Add buffer_cost and cleaning_cost of the current item to the accumulator
      //var cost:number = this.selectedEstimateLabourCost||0;
      var itm: any = s;
      var isSteamingEst = this.isSteamingEstimate(s);
      var totalCost = 0;
      totalCost = itm.total_cost || 0;
      // if(isSteamingEst){
      //   totalCost = (itm.total_hour||1)*(itm.rate||0);
      // }
      // else
      // {
      //    totalCost = ((itm.total_hour||1)*(itm.rate||0))+(itm.total_cost||0);
      // }
      return accumulator + totalCost;
      //return accumulator+ Number(stmItm.net_cost||0);
    }, 0); // Initialize accumulator to 0
    this.invoiceTotalCostControl.setValue(Utility.formatNumberDisplay(totalCost));
  }
  toggleRow(row: SteamItem) {

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
      if (this.selectedEstimateItem?.bill_to_guid) {
        this.getCustomerLabourPackage(this.selectedEstimateItem?.bill_to_guid!);

      }
    }
  }
  CheckBoxDisable(row: InGateCleaningItem) {
    if (this.selectedEstimateItem?.customer_company) {
      if (row.customer_company?.code != this.selectedEstimateItem.customer_company?.code) {
        return true;
      }
    }
    return false;
  }

  MasterCheckBoxDisable() {
    if (this.distinctCustomerCodes?.length) {
      return this.distinctCustomerCodes.length > 1;
    }

    return false;
  }


  getTotalCost(row: any) {

    const customer_company_guid = row.storing_order_tank?.storing_order?.customer_company?.guid;
    const where = {
      and: [
        { customer_company_guid: { eq: customer_company_guid } }
      ]
    };
    this.plDS.getCustomerPackageCost(where).subscribe(data => {
      if (data.length > 0) {
        var cost: number = data[0].cost;
        var isAutoApproveSteaming = BusinessLogicUtil.isAutoApproveSteaming(row);
        if (isAutoApproveSteaming) {
          row.total_cost = (row.rate || 0);
          if (!row.flat_rate) {
            row.total_cost *= row.total_hour;
          }
        }
        else {
          row.total_cost = (this.stmDS.getApprovalTotalWithLabourCost(row?.steaming_part, cost).total_mat_cost || 0);
        }
        //this.calculateTotalCost();
      }
    });

  }

  getCustomerLabourPackage(custGuid: string) {

    const customer_company_guid = custGuid;
    const where = {
      and: [
        { customer_company_guid: { eq: customer_company_guid } }
      ]
    };
    this.plDS.getCustomerPackageCost(where).subscribe(data => {
      if (data.length > 0) {
        this.selectedEstimateLabourCost = data[0].cost;
        // this.stmEstList = this.stmEstList?.map(stm => {
        //       var stm_part=[...stm.steaming_part!];
        //       stm.steaming_part=stm_part?.filter(data => !data.delete_dt);
        //       return { ...stm, net_cost: this.calculateNetCostWithLabourCost(stm,cost) };
        // });
        this.calculateTotalCost();
      }
    });

  }

  calculateNetCostWithLabourCost(steam: SteamItem, LabourCost: number): number {

    const total = this.IsApproved(steam) ? this.stmDS.getApprovalTotalWithLabourCost(steam?.steaming_part, LabourCost) : this.stmDS.getTotalWithLabourCost(steam?.steaming_part, LabourCost)
    return total.total_mat_cost;

  }

  IsApproved(steam: SteamItem) {
    const validStatus = ['APPROVED', 'COMPLETED', 'QC_COMPLETED']
    return validStatus.includes(steam!.status_cv!);

  }

  checkInvoicedAndGetTotalCost() {
    this.stmEstList = this.stmEstList?.map(stm => {
      return { ...stm, invoiced: (stm.customer_billing_guid ? true : false), total_cost: 0 };
    });
    this.stmEstList?.forEach(stm => {
      this.getTotalCost(stm);
    });
  }

  checkInvoiced() {
    this.stmEstList = this.stmEstList?.map(stm => {

      return { ...stm, invoiced: (stm.customer_billing_guid ? true : false) };
    });
  }

  handleDelete(event: Event, row: SteamItem) {

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

  onTabFocused() {
    this.resetForm();
    this.search();
  }

  isSteamingEstimate(steam: SteamItem | undefined) {
    var retval
    retval = (steam?.steaming_part?.[0]?.tariff_steaming_guid === null && steam?.steaming_part?.[0]?.steaming_exclusive_guid === null);
    return retval;
  }

  CalculateCost(itm: SteamItem): number {
    var cost: number = 0;
    var isEst = this.isSteamingEstimate(itm);
    if (isEst) {
      cost = (itm.total_hour || 1) * (itm.rate || 0);
    }
    else {
      cost = ((itm.total_hour || 1) * (itm.rate || 0)) + (itm.total_cost || 0);
    }

    return cost;
  }

  parse2Decimal(input: number | string | undefined) {
    return Utility.formatNumberDisplay(input);
  }

  onToggleInvoiced(event: MatSlideToggleChange) {
    this.search();
  }
}