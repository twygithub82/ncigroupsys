import { Direction } from '@angular/cdk/bidi';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
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
import { BillingDS, BillingEstimateRequest, BillingItem, BillingSOTItem, report_billing_customer, report_billing_item } from 'app/data-sources/billing';
import { CodeValuesDS, CodeValuesItem, addDefaultSelectOption } from 'app/data-sources/code-values';
import { CurrencyDS, CurrencyItem } from 'app/data-sources/currency';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { InGateCleaningItem } from 'app/data-sources/in-gate-cleaning';
import { PackageDepotDS, PackageDepotItem } from 'app/data-sources/package-depot';
import { RepairDS, RepairItem } from 'app/data-sources/repair';
import { ResidueItem } from 'app/data-sources/residue';
import { SteamItem } from 'app/data-sources/steam';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { CustomerInvoicesPdfComponent } from 'app/document-template/pdf/customer-invoices-pdf/customer-invoices-pdf.component';
import { ComponentUtil } from 'app/utilities/component-util';
import { pageSizeInfo, Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { UpdateInvoicesDialogComponent } from '../form-dialog/update-invoices.component';

@Component({
  selector: 'app-invoices',
  standalone: true,
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss',
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
    MatCardModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class InvoicesComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'select',
    'invoice_dt',
    'invoice_no',
    'customer',
    'currency',
    // 'last_cargo',
    // 'purpose',
    // 'tank_status_cv'
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
    CURRENCY: 'COMMON-FORM.CURRENCY',
    INVOICE_TYPE: 'COMMON-FORM.INVOICE-TYPE',
    BILLING_BRANCH: 'COMMON-FORM.BILLING-BRANCH',
    SAVE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    CONFIRM_REMOVE_INVOICES: 'COMMON-FORM.CONFIRM-REMOVE-INVOICES',
    BILLING_CURRENCY: 'COMMON-FORM.BILLING-CURRENCY',
    IS_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    EDIT: 'COMMON-FORM.EDIT',
    DELETE: 'COMMON-FORM.DELETE',
    EXPORT: 'COMMON-FORM.EXPORT',
    MULTIPLE: 'COMMON-FORM.MULTIPLE'
  }

  distinctCustomerCodes: any;
  selectedEstimateItem?: any;
  searchForm?: UntypedFormGroup;
  customerCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  branchCodeControl = new UntypedFormControl();

  billDS: BillingDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  cvDS: CodeValuesDS;
  tcDS: TariffCleaningDS;
  curDS: CurrencyDS;
  pdDS: PackageDepotDS;
  repDS: RepairDS;

  selection = new GuidSelectionModel<any>(true, []);
  currencyList: CurrencyItem[] = [];
  billList: any[] = [];
  // reportBillList:any[]=[];
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


  pageIndex = 0;
  pageSize = pageSizeInfo.defaultSize;
  lastSearchCriteria: any;
  lastOrderBy: any = { invoice_dt: "DESC" };
  endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;

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
    this.billDS = new BillingDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);
    this.curDS = new CurrencyDS(this.apollo);
    this.pdDS = new PackageDepotDS(this.apollo);
    this.repDS = new RepairDS(this.apollo);
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
    this.searchForm = this.fb.group({
      so_no: [''],
      customer_code: this.customerCodeControl,
      branch_code: this.branchCodeControl,
      last_cargo: this.lastCargoControl,
      eir_no: [''],
      ro_no: [''],
      eir_dt: [''],
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
      invoice_no: [''],
      depot_status_cv: [''],
      currency: [''],
      invoice_type_cv: ['']
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
      { alias: 'invoiceTypeCv', codeValType: 'INVOICE_TYPE' }
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
    this.cvDS.connectAlias('invoiceTypeCv').subscribe(data => {
      this.invoiceTypeCvList = addDefaultSelectOption(data, 'All');
    });
    this.curDS.search({}, { sequence: 'ASC' }, 100).subscribe(data => {
      this.currencyList = data;
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
    const where: any = {};
    this.selectedEstimateItem = undefined;

    if (this.searchForm?.invalid) return;
    // this.calculateTotalCost();

    //where.status_cv={in:['COMPLETED','APPROVED']};
    where.and = [];

    const itm: any = { or: [] };
    itm.or.push({ cleaning: { any: true } });
    itm.or.push({ repair_customer: { any: true } });
    itm.or.push({ repair_owner: { any: true } });
    itm.or.push({ residue: { any: true } });
    itm.or.push({ steaming: { any: true } });
    itm.or.push({ gin_billing_sot: { any: true } });
    itm.or.push({ gout_billing_sot: { any: true } });
    itm.or.push({ lon_billing_sot: { any: true } });
    itm.or.push({ loff_billing_sot: { any: true } });
    itm.or.push({ preinsp_billing_sot: { any: true } });
    itm.or.push({ storage_billing_sot: { any: true } });
    where.and.push(itm);


    where.guid = { neq: null };
    if (this.searchForm!.get('tank_no')?.value) {
      const itm: any = { or: [] };

      itm.or.push({ cleaning: { some: { storing_order_tank: { tank_no: { contains: this.searchForm!.get('tank_no')?.value } } } } });
      itm.or.push({ repair_customer: { some: { storing_order_tank: { tank_no: { contains: this.searchForm!.get('tank_no')?.value } } } } });
      itm.or.push({ repair_owner: { some: { storing_order_tank: { tank_no: { contains: this.searchForm!.get('tank_no')?.value } } } } });
      itm.or.push({ residue: { some: { storing_order_tank: { tank_no: { contains: this.searchForm!.get('tank_no')?.value } } } } });
      itm.or.push({ steaming: { some: { storing_order_tank: { tank_no: { contains: this.searchForm!.get('tank_no')?.value } } } } });
      itm.or.push({ gin_billing_sot: { some: { storing_order_tank: { tank_no: { contains: this.searchForm!.get('tank_no')?.value } } } } });
      itm.or.push({ gout_billing_sot: { some: { storing_order_tank: { tank_no: { contains: this.searchForm!.get('tank_no')?.value } } } } });
      itm.or.push({ lon_billing_sot: { some: { storing_order_tank: { tank_no: { contains: this.searchForm!.get('tank_no')?.value } } } } });
      itm.or.push({ loff_billing_sot: { some: { storing_order_tank: { tank_no: { contains: this.searchForm!.get('tank_no')?.value } } } } });
      itm.or.push({ preinsp_billing_sot: { some: { storing_order_tank: { tank_no: { contains: this.searchForm!.get('tank_no')?.value } } } } });
      itm.or.push({ storage_billing_sot: { some: { storing_order_tank: { tank_no: { contains: this.searchForm!.get('tank_no')?.value } } } } });
      where.and.push(itm);
      // where.storing_order_tank = { tank_no: {contains: this.searchForm!.get('tank_no')?.value }};
    }

    if (this.searchForm!.get('depot_status_cv')?.value) {
      // if(!where.storing_order_tank) where.storing_order_tank={};

      var cond: any = { tank_status_cv: { eq: "RELEASED" } };
      if (this.searchForm!.get('depot_status_cv')?.value != "RELEASED") {
        cond = { tank_status_cv: { neq: "RELEASED" } };
      }
      const itm: any = { or: [] };

      itm.or.push({ cleaning: { some: { storing_order_tank: cond } } });
      itm.or.push({ repair_customer: { some: { storing_order_tank: cond } } });
      itm.or.push({ repair_owner: { some: { storing_order_tank: cond } } });
      itm.or.push({ residue: { some: { storing_order_tank: cond } } });
      itm.or.push({ steaming: { some: { storing_order_tank: cond } } });
      itm.or.push({ gin_billing_sot: { some: { storing_order_tank: cond } } });
      itm.or.push({ gout_billing_sot: { some: { storing_order_tank: cond } } });
      itm.or.push({ lon_billing_sot: { some: { storing_order_tank: cond } } });
      itm.or.push({ loff_billing_sot: { some: { storing_order_tank: cond } } });
      itm.or.push({ preinsp_billing_sot: { some: { storing_order_tank: cond } } });
      itm.or.push({ storage_billing_sot: { some: { storing_order_tank: cond } } });
      where.and.push(itm);
    }

    if (this.searchForm!.get('invoice_no')?.value) {
      where.invoice_no = { contains: this.searchForm!.get('invoice_no')?.value };
    }

    if (this.searchForm!.get('customer_code')?.value) {
      // if(!where.storing_order) where.storing_order={};
      const itm: any = { or: [] };

      itm.or.push({ cleaning: { some: { storing_order_tank: { storing_order: { customer_company_guid: { eq: this.searchForm!.get('customer_code')?.value.guid } } } } } });
      itm.or.push({ repair_customer: { some: { storing_order_tank: { storing_order: { customer_company_guid: { eq: this.searchForm!.get('customer_code')?.value.guid } } } } } });
      itm.or.push({ repair_owner: { some: { storing_order_tank: { storing_order: { customer_company_guid: { eq: this.searchForm!.get('customer_code')?.value.guid } } } } } });
      itm.or.push({ residue: { some: { storing_order_tank: { storing_order: { customer_company_guid: { eq: this.searchForm!.get('customer_code')?.value.guid } } } } } });
      itm.or.push({ steaming: { some: { storing_order_tank: { storing_order: { customer_company_guid: { eq: this.searchForm!.get('customer_code')?.value.guid } } } } } });
      itm.or.push({ gin_billing_sot: { some: { storing_order_tank: { storing_order: { customer_company_guid: { eq: this.searchForm!.get('customer_code')?.value.guid } } } } } });
      itm.or.push({ gout_billing_sot: { some: { storing_order_tank: { storing_order: { customer_company_guid: { eq: this.searchForm!.get('customer_code')?.value.guid } } } } } });
      itm.or.push({ lon_billing_sot: { some: { storing_order_tank: { storing_order: { customer_company_guid: { eq: this.searchForm!.get('customer_code')?.value.guid } } } } } });
      itm.or.push({ loff_billing_sot: { some: { storing_order_tank: { storing_order: { customer_company_guid: { eq: this.searchForm!.get('customer_code')?.value.guid } } } } } });
      itm.or.push({ preinsp_billing_sot: { some: { storing_order_tank: { storing_order: { customer_company_guid: { eq: this.searchForm!.get('customer_code')?.value.guid } } } } } });
      itm.or.push({ storage_billing_sot: { some: { storing_order_tank: { storing_order: { customer_company_guid: { eq: this.searchForm!.get('customer_code')?.value.guid } } } } } });
      where.and.push(itm);
    }

    if (this.searchForm!.get('currency')?.value) {
      where.currency_guid = { eq: this.searchForm!.get('currency')?.value.guid };
    }

    if (this.searchForm!.get('branch_code')?.value) {

      const itm: any = { or: [] };

      itm.or.push({ cleaning: { some: { bill_to_guid: { eq: this.searchForm!.get('branch_code')?.value.guid } } } });
      itm.or.push({ repair_customer: { some: { bill_to_guid: { eq: this.searchForm!.get('branch_code')?.value.guid } } } });
      itm.or.push({ repair_owner: { some: { bill_to_guid: { eq: this.searchForm!.get('branch_code')?.value.guid } } } });
      itm.or.push({ residue: { some: { bill_to_guid: { eq: this.searchForm!.get('branch_code')?.value.guid } } } });
      itm.or.push({ steaming: { some: { sbill_to_guid: { eq: this.searchForm!.get('branch_code')?.value.guid } } } });
      itm.or.push({ gin_billing_sot: { some: { bill_to_guid: { eq: this.searchForm!.get('branch_code')?.value.guid } } } });
      itm.or.push({ gout_billing_sot: { some: { bill_to_guid: { eq: this.searchForm!.get('branch_code')?.value.guid } } } });
      itm.or.push({ lon_billing_sot: { some: { bill_to_guid: { eq: this.searchForm!.get('branch_code')?.value.guid } } } });
      itm.or.push({ loff_billing_sot: { some: { bill_to_guid: { eq: this.searchForm!.get('branch_code')?.value.guid } } } });
      itm.or.push({ preinsp_billing_sot: { some: { bill_to_guid: { eq: this.searchForm!.get('branch_code')?.value.guid } } } });
      itm.or.push({ storage_billing_sot: { some: { bill_to_guid: { eq: this.searchForm!.get('branch_code')?.value.guid } } } });
      where.and.push(itm);
    }

    if (this.searchForm!.get('eir_dt')?.value) {
      //  if(!where.storing_order_tank) where.storing_order_tank={};
      //  where.storing_order_tank.in_gate = { some:{and:[{eir_dt:{lte: Utility.convertDate(this.searchForm!.value['eir_dt'],true) }},
      //      {or:[{delete_dt:{eq:0}},{delete_dt:{eq:null}}]}]}};

      const itm: any = { or: [] };

      itm.or.push({
        cleaning: {
          some: {
            storing_order_tank: {
              in_gate: {
                some: {
                  and: [{ eir_dt: { lte: Utility.convertDate(this.searchForm!.value['eir_dt'], true) } },
                  { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }]
                }
              }
            }
          }
        }
      });
      itm.or.push({
        repair_customer: {
          some: {
            storing_order_tank: {
              in_gate: {
                some: {
                  and: [{ eir_dt: { lte: Utility.convertDate(this.searchForm!.value['eir_dt'], true) } },
                  { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }]
                }
              }
            }
          }
        }
      });
      itm.or.push({
        repair_owner: {
          some: {
            storing_order_tank: {
              in_gate: {
                some: {
                  and: [{ eir_dt: { lte: Utility.convertDate(this.searchForm!.value['eir_dt'], true) } },
                  { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }]
                }
              }
            }
          }
        }
      });
      itm.or.push({
        residue: {
          some: {
            storing_order_tank: {
              in_gate: {
                some: {
                  and: [{ eir_dt: { lte: Utility.convertDate(this.searchForm!.value['eir_dt'], true) } },
                  { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }]
                }
              }
            }
          }
        }
      });
      itm.or.push({
        steaming: {
          some: {
            storing_order_tank: {
              in_gate: {
                some: {
                  and: [{ eir_dt: { lte: Utility.convertDate(this.searchForm!.value['eir_dt'], true) } },
                  { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }]
                }
              }
            }
          }
        }
      });
      itm.or.push({
        gin_billing_sot: {
          some: {
            storing_order_tank: {
              in_gate: {
                some: {
                  and: [{ eir_dt: { lte: Utility.convertDate(this.searchForm!.value['eir_dt'], true) } },
                  { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }]
                }
              }
            }
          }
        }
      });
      itm.or.push({
        gout_billing_sot: {
          some: {
            storing_order_tank: {
              in_gate: {
                some: {
                  and: [{ eir_dt: { lte: Utility.convertDate(this.searchForm!.value['eir_dt'], true) } },
                  { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }]
                }
              }
            }
          }
        }
      });
      itm.or.push({
        lon_billing_sot: {
          some: {
            storing_order_tank: {
              in_gate: {
                some: {
                  and: [{ eir_dt: { lte: Utility.convertDate(this.searchForm!.value['eir_dt'], true) } },
                  { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }]
                }
              }
            }
          }
        }
      });
      itm.or.push({
        loff_billing_sot: {
          some: {
            storing_order_tank: {
              in_gate: {
                some: {
                  and: [{ eir_dt: { lte: Utility.convertDate(this.searchForm!.value['eir_dt'], true) } },
                  { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }]
                }
              }
            }
          }
        }
      });
      itm.or.push({
        preinsp_billing_sot: {
          some: {
            storing_order_tank: {
              in_gate: {
                some: {
                  and: [{ eir_dt: { lte: Utility.convertDate(this.searchForm!.value['eir_dt'], true) } },
                  { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }]
                }
              }
            }
          }
        }
      });
      itm.or.push({
        storage_billing_sot: {
          some: {
            storing_order_tank: {
              in_gate: {
                some: {
                  and: [{ eir_dt: { lte: Utility.convertDate(this.searchForm!.value['eir_dt'], true) } },
                  { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }]
                }
              }
            }
          }
        }
      });

      where.and.push(itm);
    }
    if (this.searchForm!.get('eir_no')?.value) {
      //  if(!where.storing_order_tank) where.storing_order_tank={};
      //  where.storing_order_tank.in_gate = { some:{eir_no:{contains: this.searchForm!.get('eir_no')?.value }}};

      const itm: any = { or: [] };

      itm.or.push({ cleaning: { some: { storing_order_tank: { in_gate: { some: { eir_no: { contains: this.searchForm!.get('eir_no')?.value } } } } } } });
      itm.or.push({ repair_customer: { some: { storing_order_tank: { in_gate: { some: { eir_no: { contains: this.searchForm!.get('eir_no')?.value } } } } } } });
      itm.or.push({ repair_owner: { some: { storing_order_tank: { in_gate: { some: { eir_no: { contains: this.searchForm!.get('eir_no')?.value } } } } } } });
      itm.or.push({ residue: { some: { storing_order_tank: { in_gate: { some: { eir_no: { contains: this.searchForm!.get('eir_no')?.value } } } } } } });
      itm.or.push({ steaming: { some: { storing_order_tank: { in_gate: { some: { eir_no: { contains: this.searchForm!.get('eir_no')?.value } } } } } } });
      itm.or.push({ gin_billing_sot: { some: { storing_order_tank: { in_gate: { some: { eir_no: { contains: this.searchForm!.get('eir_no')?.value } } } } } } });
      itm.or.push({ gout_billing_sot: { some: { storing_order_tank: { in_gate: { some: { eir_no: { contains: this.searchForm!.get('eir_no')?.value } } } } } } });
      itm.or.push({ lon_billing_sot: { some: { storing_order_tank: { in_gate: { some: { eir_no: { contains: this.searchForm!.get('eir_no')?.value } } } } } } });
      itm.or.push({ loff_billing_sot: { some: { storing_order_tank: { in_gate: { some: { eir_no: { contains: this.searchForm!.get('eir_no')?.value } } } } } } });
      itm.or.push({ preinsp_billing_sot: { some: { storing_order_tank: { in_gate: { some: { eir_no: { contains: this.searchForm!.get('eir_no')?.value } } } } } } });
      itm.or.push({ storage_billing_sot: { some: { storing_order_tank: { in_gate: { some: { eir_no: { contains: this.searchForm!.get('eir_no')?.value } } } } } } });

      where.and.push(itm);
    }

    if (this.searchForm!.get('inv_dt_start')?.value && this.searchForm!.get('inv_dt_end')?.value) {
      //if(!where.gateio_billing) where.gateio_billing={};
      where.invoice_dt = { gte: Utility.convertDate(this.searchForm!.value['inv_dt_start']), lte: Utility.convertDate(this.searchForm!.value['inv_dt_end'], true) };
      //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
    }

    //  if (this.searchForm!.get('cutoff_dt')?.value) {

    //    where.create_dt={lte: Utility.convertDate(this.searchForm!.value['cutoff_dt'],true) };
    //    //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
    //  }

    if (this.searchForm!.get('release_dt')?.value) {
      //  if(!where.storing_order_tank) where.storing_order_tank={};
      //  where.storing_order_tank.out_gate={some:{out_gate_survey:{and:[{create_dt:{lte:Utility.convertDate(this.searchForm!.value['release_dt'],true)}},
      //  {or:[{delete_dt:{eq:0}},{delete_dt:{eq:null}}]}]}}};
      //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };

      const itm: any = { or: [] };

      itm.or.push({
        cleaning: {
          some: {
            storing_order_tank: {
              out_gate: {
                some: {
                  out_gate_survey: {
                    and: [{ create_dt: { lte: Utility.convertDate(this.searchForm!.value['release_dt'], true) } },
                    { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }]
                  }
                }
              }
            }
          }
        }
      });
      itm.or.push({
        repair_customer: {
          some: {
            storing_order_tank: {
              out_gate: {
                some: {
                  out_gate_survey: {
                    and: [{ create_dt: { lte: Utility.convertDate(this.searchForm!.value['release_dt'], true) } },
                    { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }]
                  }
                }
              }
            }
          }
        }
      });
      itm.or.push({
        repair_owner: {
          some: {
            storing_order_tank: {
              out_gate: {
                some: {
                  out_gate_survey: {
                    and: [{ create_dt: { lte: Utility.convertDate(this.searchForm!.value['release_dt'], true) } },
                    { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }]
                  }
                }
              }
            }
          }
        }
      });
      itm.or.push({
        residue: {
          some: {
            storing_order_tank: {
              out_gate: {
                some: {
                  out_gate_survey: {
                    and: [{ create_dt: { lte: Utility.convertDate(this.searchForm!.value['release_dt'], true) } },
                    { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }]
                  }
                }
              }
            }
          }
        }
      });
      itm.or.push({
        steaming: {
          some: {
            storing_order_tank: {
              out_gate: {
                some: {
                  out_gate_survey: {
                    and: [{ create_dt: { lte: Utility.convertDate(this.searchForm!.value['release_dt'], true) } },
                    { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }]
                  }
                }
              }
            }
          }
        }
      });
      itm.or.push({
        gin_billing_sot: {
          some: {
            storing_order_tank: {
              out_gate: {
                some: {
                  out_gate_survey: {
                    and: [{ create_dt: { lte: Utility.convertDate(this.searchForm!.value['release_dt'], true) } },
                    { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }]
                  }
                }
              }
            }
          }
        }
      });
      itm.or.push({
        gout_billing_sot: {
          some: {
            storing_order_tank: {
              out_gate: {
                some: {
                  out_gate_survey: {
                    and: [{ create_dt: { lte: Utility.convertDate(this.searchForm!.value['release_dt'], true) } },
                    { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }]
                  }
                }
              }
            }
          }
        }
      });
      itm.or.push({
        lon_billing_sot: {
          some: {
            storing_order_tank: {
              out_gate: {
                some: {
                  out_gate_survey: {
                    and: [{ create_dt: { lte: Utility.convertDate(this.searchForm!.value['release_dt'], true) } },
                    { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }]
                  }
                }
              }
            }
          }
        }
      });
      itm.or.push({
        loff_billing_sot: {
          some: {
            storing_order_tank: {
              out_gate: {
                some: {
                  out_gate_survey: {
                    and: [{ create_dt: { lte: Utility.convertDate(this.searchForm!.value['release_dt'], true) } },
                    { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }]
                  }
                }
              }
            }
          }
        }
      });
      itm.or.push({
        preinsp_billing_sot: {
          some: {
            storing_order_tank: {
              out_gate: {
                some: {
                  out_gate_survey: {
                    and: [{ create_dt: { lte: Utility.convertDate(this.searchForm!.value['release_dt'], true) } },
                    { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }]
                  }
                }
              }
            }
          }
        }
      });
      itm.or.push({
        storage_billing_sot: {
          some: {
            storing_order_tank: {
              out_gate: {
                some: {
                  out_gate_survey: {
                    and: [{ create_dt: { lte: Utility.convertDate(this.searchForm!.value['release_dt'], true) } },
                    { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }]
                  }
                }
              }
            }
          }
        }
      });

      where.and.push(itm);
    }

    if (this.searchForm!.get('last_cargo')?.value) {
      // if(!where.storing_order_tank) where.storing_order_tank={};

      //where.storing_order_tank.tariff_cleaning={guid:{eq:this.searchForm!.get('last_cargo')?.value.guid} };
      //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };

      const itm: any = { or: [] };

      itm.or.push({ cleaning: { some: { storing_order_tank: { tariff_cleaning: { guid: { eq: this.searchForm!.get('last_cargo')?.value.guid } } } } } });
      itm.or.push({ repair_customer: { some: { storing_order_tank: { tariff_cleaning: { guid: { eq: this.searchForm!.get('last_cargo')?.value.guid } } } } } });
      itm.or.push({ repair_owner: { some: { storing_order_tank: { tariff_cleaning: { guid: { eq: this.searchForm!.get('last_cargo')?.value.guid } } } } } });
      itm.or.push({ residue: { some: { storing_order_tank: { tariff_cleaning: { guid: { eq: this.searchForm!.get('last_cargo')?.value.guid } } } } } });
      itm.or.push({ steaming: { some: { storing_order_tank: { tariff_cleaning: { guid: { eq: this.searchForm!.get('last_cargo')?.value.guid } } } } } });
      itm.or.push({ gin_billing_sot: { some: { storing_order_tank: { tariff_cleaning: { guid: { eq: this.searchForm!.get('last_cargo')?.value.guid } } } } } });
      itm.or.push({ gout_billing_sot: { some: { storing_order_tank: { tariff_cleaning: { guid: { eq: this.searchForm!.get('last_cargo')?.value.guid } } } } } });
      itm.or.push({ lon_billing_sot: { some: { storing_order_tank: { tariff_cleaning: { guid: { eq: this.searchForm!.get('last_cargo')?.value.guid } } } } } });
      itm.or.push({ loff_billing_sot: { some: { storing_order_tank: { tariff_cleaning: { guid: { eq: this.searchForm!.get('last_cargo')?.value.guid } } } } } });
      itm.or.push({ preinsp_billing_sot: { some: { storing_order_tank: { tariff_cleaning: { guid: { eq: this.searchForm!.get('last_cargo')?.value.guid } } } } } });
      itm.or.push({ storage_billing_sot: { some: { storing_order_tank: { tariff_cleaning: { guid: { eq: this.searchForm!.get('last_cargo')?.value.guid } } } } } });

      where.and.push(itm);
    }


    this.lastSearchCriteria = this.billDS.addDeleteDtCriteria(where);
    this.performSearch(this.pageSize, this.pageIndex, this.pageSize, undefined, undefined, undefined);
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string) {
    this.billList = [];
    this.selection.clear();
    this.subs.sink = this.billDS.searchBillingWithBillingSOT(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {

        this.billList = data;
        // if(searchType==2)
        // {
        //   this.export_report();
        // }
        this.endCursor = this.billDS.pageInfo?.endCursor;
        this.startCursor = this.billDS.pageInfo?.startCursor;
        this.hasNextPage = this.billDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPage = this.billDS.pageInfo?.hasPreviousPage ?? false;
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

  getTankStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.tankStatusCvListDisplay);
  }

  displayDate(input: number | undefined): string | undefined {
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
      inv_dt_start: '',
      inv_dt_end: '',
      tank_no: '',
      job_no: '',
      purpose: '',
      tank_status_cv: '',
      eir_status_cv: '',
      depot_status_cv: '',
      currency: '',
      invoice_type_cv: ''
    });
    this.customerCodeControl.reset('');
    this.branchCodeControl.reset('');
  }

  filterDeleted(resultList: any[] | undefined): any {
    return (resultList || []).filter((row: any) => !row.delete_dt);
  }

  isAllSelected() {
    // this.calculateTotalCost();
    const numSelected = this.selection.selected.length;
    const numRows = this.billList.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.billList.forEach((row) =>
        this.selection.select(row)
      );
    //this.calculateTotalCost();
  }

  toggleRow(row: BillingItem) {

    this.selection.toggle(row);
    this.SelectFirstItem();
    // this.calculateTotalCost();
  }

  SelectFirstItem() {
    if (!this.selection.selected.length) {
      this.selectedEstimateItem = undefined;
    }
    else if (this.selection.selected.length === 1) {
      this.selectedEstimateItem = this.selection.selected[0];
    }
  }
  CheckBoxDisable(row: BillingItem) {
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

  isItemSelected(row: BillingItem) {
    return this.selection.selected.some(s => s.guid === row.guid);
  }

  handleDelete(event: Event) {
    event.preventDefault(); // Prevents the form submission
    if (this.selection.selected.length === 0) return;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        headerText: this.translatedLangText.CONFIRM_REMOVE_INVOICES,
        action: 'delete',
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result.action === 'confirmed') {
        this.DeleteSelectedInvoices();
      }
    });
  }


  InvoiceUpdate(row?: BillingItem) {
    let billItems: BillingItem[] = [];
    if (row) {
      // If 'row' is defined, assign its contents to 'billItems'
      billItems = [row];
    } else {
      // If 'row' is not defined, assign the selected items to 'billItems'
      billItems = this.selection.selected;
    }
    this.updateInvoices(billItems);
  }

  updateInvoices(billItems: BillingItem[]) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    if (billItems.length === 0) return;
    const dialogRef = this.dialog.open(UpdateInvoicesDialogComponent, {
      width: '700px',
      height: '650px',
      data: {
        action: 'update',
        langText: this.langText,
        selectedItems: billItems
      },
      position: {
        top: '50px'  // Adjust this value to move the dialog down from the top of the screen
      }

    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result > 0) {
        //if(result.selectedValue>0)
        // {
        this.handleSaveSuccess(result);
        this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
        //}
      }
    });

  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.SAVE_SUCCESS;
      this.translate.get(this.translatedLangText.SAVE_SUCCESS).subscribe((res: string) => {
        successMsg = res;
        ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)

      });
    }
  }

  DeleteSelectedInvoices() {
    var estimateItems: BillingEstimateRequest[] = []
    this.selection.selected.forEach(i => {

      if (i.cleaning.length) {
        var est = this.GetEstimateItem(i.cleaning, "CUSTOMER", "CLEANING");
        estimateItems = [...estimateItems, ...est];
      }
      if (i.gin_billing_sot.length) {
        var est = this.GetEstimateItem(i.gin_billing_sot, "CUSTOMER", "GATE");
        estimateItems = [...estimateItems, ...est];
      }
      if (i.gout_billing_sot.length) {
        var est = this.GetEstimateItem(i.gout_billing_sot, "CUSTOMER", "GATE");
        estimateItems = [...estimateItems, ...est];
      }
      if (i.lon_billing_sot.length) {
        var est = this.GetEstimateItem(i.lon_billing_sot, "CUSTOMER", "LOLO");
        estimateItems = [...estimateItems, ...est];
      }
      if (i.loff_billing_sot.length) {
        var est = this.GetEstimateItem(i.loff_billing_sot, "CUSTOMER", "LOLO");
        estimateItems = [...estimateItems, ...est];
      }
      if (i.repair_customer.length) {
        var est = this.GetEstimateItem(i.repair_customer, "CUSTOMER", "REPAIR");
        estimateItems = [...estimateItems, ...est];
      }
      if (i.repair_owner.length) {
        var est = this.GetEstimateItem(i.repair_owner, "OWNER", "REPAIR");
        estimateItems = [...estimateItems, ...est];
      }
      if (i.storage_billing_sot.length) {
        var est = this.GetEstimateItem(i.storage_billing_sot, "CUSTOMER", "STORAGE");
        estimateItems = [...estimateItems, ...est];
      }
      if (i.residue.length) {
        var est = this.GetEstimateItem(i.residue, "CUSTOMER", "RESIDUE");
        estimateItems = [...estimateItems, ...est];
      }
      if (i.steaming.length) {
        var est = this.GetEstimateItem(i.steaming, "CUSTOMER", "STEAMING");
        estimateItems = [...estimateItems, ...est];
      }
    });

    if (estimateItems.length) {
      this.RemoveEstimateFromInvoice(estimateItems);
    }
  }

  RemoveEstimateFromInvoice(billingEstimateRequests: BillingEstimateRequest[]) {
    var updateBilling: any = null;
    // var billingEstReq:BillingEstimateRequest= new BillingEstimateRequest();
    // billingEstReq.action="CANCEL";
    // billingEstReq.billing_party=this.billingParty;
    // billingEstReq.process_guid=processGuid;
    // billingEstReq.process_type=this.processType;
    // let billingEstimateRequests:BillingEstimateRequest[]=[];
    // billingEstimateRequests.push(billingEstReq);

    this.billDS._updateBilling(updateBilling, billingEstimateRequests).subscribe(result => {
      if (result.data.updateBilling) {
        this.handleSaveSuccess(result.data.updateBilling);
        this.search();
      }
    })

  }

  GetEstimateItem(estimates: any[], billingParty: string, processType: string): any {
    var retval: any = [];
    estimates.forEach(e => {

      var updateBilling: any = null;
      var billingEstReq: BillingEstimateRequest = new BillingEstimateRequest();
      billingEstReq.action = "CANCEL";
      billingEstReq.billing_party = billingParty;
      billingEstReq.process_guid = e.guid;
      billingEstReq.process_type = processType;

      retval.push(billingEstReq);
    });

    return retval

  }




  export_report() {

    // if (!this.billList.length) this.search();

    if (!this.billList.length) return;

    var repCustomers: report_billing_customer[] = []
    // var rpItems:report_billing_item[]=[];

    this.billList.forEach(b => {
      var repCusts = repCustomers.filter(c => c.guid === b.bill_to_guid);
      var repCust: report_billing_customer = new report_billing_customer();
      var newCust: boolean = true;
      if (repCusts.length > 0) {
        repCust = repCusts[0];
        newCust = false;
      }
      else {
        repCust.guid = b.customer_company?.guid;
        repCust.items = [];
      }
      repCust.customer = this.ccDS.displayName(b.customer_company);
      if (this.searchForm!.get('inv_dt_start')?.value && this.searchForm!.get('inv_dt_end')?.value) {
        repCust.invoice_period = `${Utility.convertDateToStr(new Date(this.searchForm!.value['inv_dt_start']))} - ${Utility.convertDateToStr(new Date(this.searchForm!.value['inv_dt_end']))}`;
      }
      let rpBillingItm = this.createReportBillingItem(b, repCust.items!);
      repCust.items = rpBillingItm;

      if (newCust) repCustomers.push(repCust);

    });
    repCustomers.map(c => {

      c.items?.map(i => {
        var total: number = 0;
        total = Number(i.clean_cost || 0) + Number(i.gateio_cost || 0) + Number(i.lolo_cost || 0) + Number(i.preins_cost || 0)
          + Number(i.storage_cost || 0) + Number(i.repair_cost || 0) + Number(i.residue_cost || 0) + Number(i.steam_cost || 0);
        i.total = total.toFixed(2);

      });

    });
    this.onExport(repCustomers);

  }

  createReportBillingItem(b: BillingItem, rbItm: report_billing_item[]): report_billing_item[] {
    var repBillItems: report_billing_item[] = rbItm;
    var repBillingItm: report_billing_item = new report_billing_item();

    var sot_guids: string[] = [];
    if (b.cleaning?.length! > 0) this.calculateCleaningCost(b.cleaning!, repBillItems);
    if (b.gin_billing_sot?.length! > 0) this.calculateGateInOutCost(b.gin_billing_sot!, repBillItems);
    if (b.gout_billing_sot?.length! > 0) this.calculateGateInOutCost(b.gout_billing_sot!, repBillItems);
    if (b.lon_billing_sot?.length! > 0) this.calculateLOLOCost(b.lon_billing_sot!, repBillItems);
    if (b.loff_billing_sot?.length! > 0) this.calculateLOLOCost(b.loff_billing_sot!, repBillItems);
    if (b.preinsp_billing_sot?.length! > 0) this.calculatePreInspectionCost(b.preinsp_billing_sot!, repBillItems);
    if (b.repair_customer?.length! > 0) this.calculateRepairCost(b.repair_customer!, repBillItems);
    if (b.repair_owner?.length! > 0) this.calculateRepairCost(b.repair_owner!, repBillItems, 1);
    if (b.residue?.length! > 0) this.calculateResidueCost(b.residue!, repBillItems);
    if (b.storage_billing_sot?.length! > 0) this.calculateStorageCost(b.storage_billing_sot!, repBillItems);
    if (b.steaming?.length! > 0) this.calculateSteamingCost(b.steaming!, repBillItems);


    // repBillingItm.job_no = b.
    //repBillingItm.clean_cost =this.calculateCleaningCost(b.cleaning!);

    return repBillItems;

  }

  distinctSOT(estimate: any[], sot_guids: string[]): string[] {
    //var sGuids:string[]=sot_guids;

    var distinctSotGuids = [... new Set(estimate.map(item => item.storing_order_tank?.guid))];
    const sGuids = [...new Set([...sot_guids, ...distinctSotGuids])];

    return sGuids;

  }
  calculateCleaningCost(items: InGateCleaningItem[], rep_bill_items: report_billing_item[]) {
    var retval: string = "";

    if (items.length > 0) {
      var itms = items.filter(v => v.delete_dt === null || v.delete_dt === 0);
      if (itms.length > 0) {

        itms.forEach(c => {
          let newItem = false;
          let rep_bill_item = rep_bill_items.find(item => item.sot_guid === c.storing_order_tank?.guid);

          if (!rep_bill_item) {
            newItem = true;
            rep_bill_item = new report_billing_item();
            rep_bill_item.sot_guid = c.storing_order_tank?.guid;
          }
          var in_gates = c.storing_order_tank?.in_gate?.filter(v => v.delete_dt === null || v.delete_dt === 0);
          if (in_gates?.length) {
            rep_bill_item.in_date = Utility.convertEpochToDateStr(in_gates?.[0]?.eir_dt);
            rep_bill_item.eir_no = in_gates?.[0]?.eir_no;
          }
          if (c.storing_order_tank?.tank_no) { rep_bill_item.tank_no = c.storing_order_tank?.tank_no; }
          if (c.storing_order_tank?.job_no) { rep_bill_item.job_no = c.storing_order_tank?.job_no; }
          if (c.storing_order_tank?.tariff_cleaning?.cargo) rep_bill_item.last_cargo = c.storing_order_tank?.tariff_cleaning?.cargo;
          rep_bill_item.clean_est_no += 1;
          rep_bill_item.clean_cost = Number(Number(rep_bill_item?.clean_cost || 0) + (c.cleaning_cost || 0) + (c.buffer_cost || 0)).toFixed(2);
          if (newItem) rep_bill_items.push(rep_bill_item);

        });
      }
    }
    return retval;

  }

  calculateGateInOutCost(items: BillingSOTItem[], rep_bill_items: report_billing_item[]) {
    var retval: string = "";

    if (items.length > 0) {
      var itms = items.filter(v => v.delete_dt === null || v.delete_dt === 0);
      if (itms.length > 0) {
        itms.forEach(c => {
          let newItem = false;
          let rep_bill_item = rep_bill_items.find(item => item.sot_guid === c.storing_order_tank?.guid);
          if (!rep_bill_item) {
            newItem = true;
            rep_bill_item = new report_billing_item();
            rep_bill_item.sot_guid = c.storing_order_tank?.guid;
          }
          var in_gates = c.storing_order_tank?.in_gate?.filter(v => v.delete_dt === null || v.delete_dt === 0);
          if (in_gates?.length) {
            rep_bill_item.in_date = Utility.convertEpochToDateStr(in_gates?.[0]?.eir_dt);
            rep_bill_item.eir_no = in_gates?.[0]?.eir_no;
          }
          if (c.storing_order_tank?.tank_no) { rep_bill_item.tank_no = c.storing_order_tank?.tank_no; }
          if (c.storing_order_tank?.job_no) { rep_bill_item.job_no = c.storing_order_tank?.job_no; }
          if (c.storing_order_tank?.tariff_cleaning?.cargo) rep_bill_item.last_cargo = c.storing_order_tank?.tariff_cleaning?.cargo;
          rep_bill_item.gateio_est_no += 1;
          rep_bill_item.gateio_cost = Number(Number(rep_bill_item?.gateio_cost || 0) + (c.gate_in_cost || 0) + (c.gate_out_cost || 0)).toFixed(2);
          if (newItem) rep_bill_items.push(rep_bill_item);

        });
      }
    }
    return retval;

  }

  calculateLOLOCost(items: BillingSOTItem[], rep_bill_items: report_billing_item[]) {
    var retval: string = "";

    if (items.length > 0) {
      var itms = items.filter(v => v.delete_dt === null || v.delete_dt === 0);
      if (itms.length > 0) {
        itms.forEach(c => {
          let newItem = false;
          let rep_bill_item = rep_bill_items.find(item => item.sot_guid === c.storing_order_tank?.guid);
          if (!rep_bill_item) {
            newItem = true;
            rep_bill_item = new report_billing_item();
            rep_bill_item.sot_guid = c.storing_order_tank?.guid;
          }
          var in_gates = c.storing_order_tank?.in_gate?.filter(v => v.delete_dt === null || v.delete_dt === 0);
          if (in_gates?.length) {
            rep_bill_item.in_date = Utility.convertEpochToDateStr(in_gates?.[0]?.eir_dt);
            rep_bill_item.eir_no = in_gates?.[0]?.eir_no;
          }

          if (c.storing_order_tank?.tank_no) { rep_bill_item.tank_no = c.storing_order_tank?.tank_no; }
          if (c.storing_order_tank?.job_no) { rep_bill_item.job_no = c.storing_order_tank?.job_no; }
          if (c.storing_order_tank?.tariff_cleaning?.cargo) rep_bill_item.last_cargo = c.storing_order_tank?.tariff_cleaning?.cargo;
          rep_bill_item.lolo_est_no += 1;
          rep_bill_item.lolo_cost = Number(Number(rep_bill_item?.lolo_cost || 0) + (c.lift_off ? c.lift_off_cost! : 0) + (c.lift_on ? c.lift_on_cost! : 0)).toFixed(2);
          if (newItem) rep_bill_items.push(rep_bill_item);

        });
      }
    }
    return retval;

  }

  calculatePreInspectionCost(items: BillingSOTItem[], rep_bill_items: report_billing_item[]) {
    var retval: string = "";

    if (items.length > 0) {
      var itms = items.filter(v => v.delete_dt === null || v.delete_dt === 0);
      if (itms.length > 0) {
        itms.forEach(c => {
          let newItem = false;
          let rep_bill_item = rep_bill_items.find(item => item.sot_guid === c.storing_order_tank?.guid);
          if (!rep_bill_item) {
            newItem = true;
            rep_bill_item = new report_billing_item();
            rep_bill_item.sot_guid = c.storing_order_tank?.guid;
          }
          if (c.storing_order_tank?.tank_no) { rep_bill_item.tank_no = c.storing_order_tank?.tank_no; }
          if (c.storing_order_tank?.job_no) { rep_bill_item.job_no = c.storing_order_tank?.job_no; }
          if (c.storing_order_tank?.tariff_cleaning?.cargo) rep_bill_item.last_cargo = c.storing_order_tank?.tariff_cleaning?.cargo;

          var in_gates = c.storing_order_tank?.in_gate?.filter(v => v.delete_dt === null || v.delete_dt === 0);
          if (in_gates?.length) {
            rep_bill_item.in_date = Utility.convertEpochToDateStr(in_gates?.[0]?.eir_dt);
            rep_bill_item.eir_no = in_gates?.[0]?.eir_no;
          }
          rep_bill_item.preins_est_no += 1;
          rep_bill_item.preins_cost = Number(Number(rep_bill_item?.preins_cost || 0) + (c.preinspection ? c.preinspection_cost! : 0)).toFixed(2);
          if (newItem) rep_bill_items.push(rep_bill_item);

        });
      }
    }
    return retval;
  }

  calculateStorageCost(items: BillingSOTItem[], rep_bill_items: report_billing_item[]) {
    var retval: string = "";

    if (items.length > 0) {
      var itms = items.filter(v => v.delete_dt === null || v.delete_dt === 0);
      if (itms.length > 0) {
        itms.forEach(c => {



          let newItem = false;
          let rep_bill_item = rep_bill_items.find(item => item.sot_guid === c.storing_order_tank?.guid);
          if (!rep_bill_item) {
            newItem = true;
            rep_bill_item = new report_billing_item();
            rep_bill_item.sot_guid = c.storing_order_tank?.guid;
          }

          if (c.storing_order_tank?.tank_no) { rep_bill_item.tank_no = c.storing_order_tank?.tank_no; }
          if (c.storing_order_tank?.job_no) { rep_bill_item.job_no = c.storing_order_tank?.job_no; }
          if (c.storing_order_tank?.tariff_cleaning?.cargo) rep_bill_item.last_cargo = c.storing_order_tank?.tariff_cleaning?.cargo;

          let packDepotItm: PackageDepotItem = new PackageDepotItem();
          packDepotItm.storage_cal_cv = c.storage_cal_cv;

          let daysDifference: number = Number(this.pdDS.getStorageDays(c.storing_order_tank!, packDepotItm));



          // var out_gates = c.storing_order_tank?.out_gate?.filter(v => v.delete_dt === null || v.delete_dt === 0);
          rep_bill_item.days = String(daysDifference);
          rep_bill_item.storage_est_no += 1;
          rep_bill_item.storage_cost = Number((c.storage_cost || 0) * daysDifference).toFixed(2);

          var in_gates = c.storing_order_tank?.in_gate?.filter(v => v.delete_dt === null || v.delete_dt === 0);
          if (in_gates?.length) {
            rep_bill_item.in_date = Utility.convertEpochToDateStr(in_gates?.[0]?.eir_dt);
            rep_bill_item.eir_no = in_gates?.[0]?.eir_no;
          }
          // if (out_gates?.length) {
          //   rep_bill_item.out_date = Utility.convertEpochToDateStr(out_gates?.[0]?.eir_dt);
          //   rep_bill_item.eir_no = out_gates?.[0]?.eir_no;
          // }
          if (newItem) rep_bill_items.push(rep_bill_item);

        });
      }
    }
    return retval;
  }

  calculateRepairCost(items: RepairItem[], rep_bill_items: report_billing_item[], CustomerType: number = 0) {
    var retval: string = "";

    if (items.length > 0) {
      var itms = items.filter(v => v.delete_dt === null || v.delete_dt === 0);
      if (itms.length > 0) {
        itms.forEach(c => {
          let newItem = false;
          let rep_bill_item = rep_bill_items.find(item => item.sot_guid === c.storing_order_tank?.guid);
          if (!rep_bill_item) {
            newItem = true;
            rep_bill_item = new report_billing_item();
            rep_bill_item.sot_guid = c.storing_order_tank?.guid;
          }
          var in_gates = c.storing_order_tank?.in_gate?.filter(v => v.delete_dt === null || v.delete_dt === 0);
          if (in_gates?.length) {
            rep_bill_item.in_date = Utility.convertEpochToDateStr(in_gates?.[0]?.eir_dt);
            rep_bill_item.eir_no = in_gates?.[0]?.eir_no;
          }
          if (c.storing_order_tank?.tank_no) { rep_bill_item.tank_no = c.storing_order_tank?.tank_no; }
          if (c.storing_order_tank?.job_no) { rep_bill_item.job_no = c.storing_order_tank?.job_no; }
          if (c.storing_order_tank?.tariff_cleaning?.cargo) rep_bill_item.last_cargo = c.storing_order_tank?.tariff_cleaning?.cargo;
          rep_bill_item.repair_est_no += 1;
          const totalCost = this.repDS.calculateCost(c, c.repair_part!, c.labour_cost);
          rep_bill_item.repair_cost = Number(Number(rep_bill_item?.repair_cost || 0) + (CustomerType == 0 ? Number(totalCost.net_lessee_cost || 0) : Number(totalCost.net_owner_cost || 0))).toFixed(2);
          if (newItem) rep_bill_items.push(rep_bill_item);

        });
      }
    }
    return retval;
  }


  calculateResidueCost(items: ResidueItem[], rep_bill_items: report_billing_item[]) {
    var retval: string = "";

    if (items.length > 0) {
      var itms = items.filter(v => v.delete_dt === null || v.delete_dt === 0);
      if (itms.length > 0) {
        itms.forEach(c => {
          let newItem = false;
          let rep_bill_item = rep_bill_items.find(item => item.sot_guid === c.storing_order_tank?.guid);
          if (!rep_bill_item) {
            newItem = true;
            rep_bill_item = new report_billing_item();
            rep_bill_item.sot_guid = c.storing_order_tank?.guid;
          }

          var in_gates = c.storing_order_tank?.in_gate?.filter(v => v.delete_dt === null || v.delete_dt === 0);
          if (in_gates?.length) {
            rep_bill_item.in_date = Utility.convertEpochToDateStr(in_gates?.[0]?.eir_dt);
            rep_bill_item.eir_no = in_gates?.[0]?.eir_no;
          }
          if (c.storing_order_tank?.tank_no) { rep_bill_item.tank_no = c.storing_order_tank?.tank_no; }
          if (c.storing_order_tank?.job_no) { rep_bill_item.job_no = c.storing_order_tank?.job_no; }
          if (c.storing_order_tank?.tariff_cleaning?.cargo) rep_bill_item.last_cargo = c.storing_order_tank?.tariff_cleaning?.cargo;
          c.residue_part?.forEach(p => {
            if (rep_bill_item) rep_bill_item.residue_cost = Number(Number(rep_bill_item?.residue_cost || 0) + ((p.approve_part ?? true) ? ((p.approve_cost || 0) * (p.approve_qty || 0)) : 0)).toFixed(2);

          });
          rep_bill_item.residue_est_no += 1;
          if (newItem) rep_bill_items.push(rep_bill_item);

        });
      }
    }
    return retval;
  }

  calculateSteamingCost(items: SteamItem[], rep_bill_items: report_billing_item[]) {
    var retval: string = "";

    if (items.length > 0) {
      var itms = items.filter(v => v.delete_dt === null || v.delete_dt === 0);
      if (itms.length > 0) {
        itms.forEach(c => {
          let newItem = false;
          let rep_bill_item = rep_bill_items.find(item => item.sot_guid === c.storing_order_tank?.guid);
          if (!rep_bill_item) {
            newItem = true;
            rep_bill_item = new report_billing_item();
            rep_bill_item.sot_guid = c.storing_order_tank?.guid;
          }

          var in_gates = c.storing_order_tank?.in_gate?.filter(v => v.delete_dt === null || v.delete_dt === 0);
          if (in_gates?.length) {
            rep_bill_item.in_date = Utility.convertEpochToDateStr(in_gates?.[0]?.eir_dt);
            rep_bill_item.eir_no = in_gates?.[0]?.eir_no;
          }
          if (c.storing_order_tank?.tank_no) { rep_bill_item.tank_no = c.storing_order_tank?.tank_no; }
          if (c.storing_order_tank?.job_no) { rep_bill_item.job_no = c.storing_order_tank?.job_no; }
          if (c.storing_order_tank?.tariff_cleaning?.cargo) rep_bill_item.last_cargo = c.storing_order_tank?.tariff_cleaning?.cargo;
          c.steaming_part?.forEach(p => {
            if (rep_bill_item) rep_bill_item.steam_cost = Number(Number(rep_bill_item?.steam_cost || 0) + ((p.approve_part ?? true) ? ((p.approve_cost || 0) * (p.approve_qty || 0)) : 0)).toFixed(2);

          });
          rep_bill_item.steam_est_no += 1;
          if (newItem) rep_bill_items.push(rep_bill_item);

        });
      }
    }
    return retval;
  }

  preventDefault(event: Event) {
    event.preventDefault();
  }
  onExport(repCustomers: report_billing_customer[]) {
    //this.preventDefault(event);
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(CustomerInvoicesPdfComponent, {
      width: '85wv',
      height: '80vh',
      data: {
        billing_customers: repCustomers
      },
      // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {

    });
  }
}