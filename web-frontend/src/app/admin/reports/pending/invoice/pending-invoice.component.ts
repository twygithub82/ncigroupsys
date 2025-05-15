import { Direction } from '@angular/cdk/bidi';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
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
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { BillingSOTItem, report_billing_customer, report_billing_item } from 'app/data-sources/billing';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { InGateCleaningItem } from 'app/data-sources/in-gate-cleaning';
import { PackageDepotDS, PackageDepotItem } from 'app/data-sources/package-depot';
import { PackageLabourDS, PackageLabourItem } from 'app/data-sources/package-labour';
import { RepairDS, RepairItem } from 'app/data-sources/repair';
import { ResidueItem } from 'app/data-sources/residue';
import { SteamDS, SteamItem } from 'app/data-sources/steam';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { PendingInvoiceCostDetailPdfComponent } from 'app/document-template/pdf/pending-invoice-cost-detail-pdf/pending-invoice-cost-detail.component';
import { PendingSummaryPdfComponent } from 'app/document-template/pdf/pending-summary-pdf/pending-summary-pdf.component';
import { Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { reportPreviewWindowDimension } from 'environments/environment';
import { firstValueFrom } from 'rxjs';
import { debounceTime, startWith, tap } from 'rxjs/operators';


@Component({
  selector: 'app-pending-invoice',
  standalone: true,
  templateUrl: './pending-invoice.component.html',
  styleUrl: './pending-invoice.component.scss',
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
    RouterLink,
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
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class PendingInvoiceComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'tank_no',
    'customer',
    'eir_no',
    'eir_dt',
    'last_cargo',
    'purpose',
    'tank_status_cv'
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
    CUTOFF_DATE: 'COMMON-FORM.CUTOFF-DATE',
    PENDING_INVOICE_DETAIL: 'COMMON-FORM.PENDING-INVOICE-DETAIL',
    PENDING_INVOICE_SUMMARY: 'COMMON-FORM.PENDING-INVOICE-SUMMARY'
  }

  searchForm?: UntypedFormGroup;
  customerCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();

  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  cvDS: CodeValuesDS;
  tcDS: TariffCleaningDS;
  pdDS: PackageDepotDS;
  repDS: RepairDS;
  plDS: PackageLabourDS;
  stmDS: SteamDS;

  sotList: StoringOrderTankItem[] = [];
  customer_companyList?: CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];
  purposeOptionCvList: CodeValuesItem[] = [];
  eirStatusCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  tankStatusCvListDisplay: CodeValuesItem[] = [];
  yardCvList: CodeValuesItem[] = [];

  distinctCustomerGuids: any;
  allCustLabourCosts: PackageLabourItem[] = []

  pageIndex = 0;
  pageSize = 100;
  lastSearchCriteria: any;
  lastOrderBy: any = { create_dt: "DESC" };
  endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;
  isGeneratingReport = false;

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
    this.pdDS = new PackageDepotDS(this.apollo);
    this.repDS = new RepairDS(this.apollo);
    this.plDS = new PackageLabourDS(this.apollo);
    this.stmDS = new SteamDS(this.apollo);

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
      // so_no: [''],
      customer_code: this.customerCodeControl,
      cutoff_dt: [''],
      // last_cargo: this.lastCargoControl,
      // eir_no: [''],
      // ro_no: [''],
      // eir_dt:[''],
      // release_dt:[''],
      // inv_dt_start: [''],
      // inv_dt_end: [''],
      // eir_dt_start: [''],
      // eir_dt_end: [''],
      // tank_no: [''],
      // inv_no:[''],
      // job_no: [''],
      // purpose: [''],
      // tank_status_cv: [''],
      // eir_status_cv: [''],
      // yard_cv: ['']
    });
  }

  initializeValueChanges() {
    this.searchForm!.get('customer_code')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (typeof value === 'string') {
          searchCriteria = value;
        } else {
          searchCriteria = value.code;
        }
        this.subs.sink = this.ccDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
          this.customer_companyList = data
          this.updateValidators(this.customerCodeControl, this.customer_companyList);
        });
      })
    ).subscribe();

    // this.searchForm!.get('last_cargo')!.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(300),
    //   tap(value => {
    //     var searchCriteria = '';
    //     if (typeof value === 'string') {
    //       searchCriteria = value;
    //     } else {
    //       searchCriteria = value.cargo;
    //     }
    //     this.tcDS.loadItems({ cargo: { contains: searchCriteria } }, { cargo: 'ASC' }).subscribe(data => {
    //       this.last_cargoList = data
    //       this.updateValidators(this.lastCargoControl, this.last_cargoList);
    //     });
    //   })
    // ).subscribe();
  }

  public loadData() {
    // const queries = [
    //   { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
    //   { alias: 'eirStatusCv', codeValType: 'EIR_STATUS' },
    //   { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
    //   { alias: 'yardCv', codeValType: 'YARD' },
    // ];
    // this.cvDS.getCodeValuesByType(queries);
    // this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
    //   this.purposeOptionCvList = data;
    // });
    // this.cvDS.connectAlias('eirStatusCv').subscribe(data => {
    //   this.eirStatusCvList = addDefaultSelectOption(data, 'All');;
    // });
    // this.cvDS.connectAlias('tankStatusCv').subscribe(data => {
    //   this.tankStatusCvListDisplay = data;
    //   this.tankStatusCvList = addDefaultSelectOption(data, 'All');
    // });
    // this.cvDS.connectAlias('yardCv').subscribe(data => {
    //   this.yardCvList = addDefaultSelectOption(data, 'All');
    // });
    //this.search();
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

  search(reportType: number) {
    this.isGeneratingReport = true;
    const where: any = {};

    where.and = [];

    const itm: any = { or: [] };
    itm.or.push({ and: [{ cleaning: { any: true } }, { cleaning: { some: { customer_billing_guid: { eq: null } } } }] });
    itm.or.push({ and: [{ repair: { any: true } }, { repair: { some: { or: [{ customer_billing_guid: { eq: null } }, { and: [{ owner_billing_guid: { eq: null } }, { owner_enable: { eq: true } }] }] } } }] });
    itm.or.push({ and: [{ residue: { any: true } }, { residue: { some: { customer_billing_guid: { eq: null } } } }] });
    itm.or.push({ and: [{ steaming: { any: true } }, { steaming: { some: { customer_billing_guid: { eq: null } } } }] });
    itm.or.push({
      and: [{ billing_sot: { any: true } }, {
        or: [{ billing_sot: { some: { gateio_billing_guid: { eq: null } } } },
        { billing_sot: { some: { and: [{ preinsp_billing_guid: { eq: null } }, { preinspection: { eq: true } }] } } },
        { billing_sot: { some: { and: [{ lolo_billing_guid: { eq: null } }, { or: [{ lift_on: { eq: true } }, { lift_off: { eq: true } }] }] } } },
        { billing_sot: { some: { storage_billing_guid: { eq: null } } } }
        ]
      }]
    });
    // where.and.push(itm);

    if (this.searchForm!.get('cutoff_dt')?.value) {
      const approveSearch: any = {};
      approveSearch.and = [];
      approveSearch.and.push({ approve_dt: { lte: Utility.convertDate(this.searchForm!.value['cutoff_dt'], true) } });
      approveSearch.and.push({ approve_dt: { gt: 1600000000 } });
      //approveSearch.approve_dt={lte: Utility.convertDate(this.searchForm!.value['cutoff_dt'],true) };
      const itm: any = { or: [] };
      itm.or.push({ cleaning: { some: approveSearch } });
      itm.or.push({ repair: { some: approveSearch } });
      itm.or.push({ residue: { some: approveSearch } });
      itm.or.push({ steaming: { some: approveSearch } });
      where.and.push(itm);
      //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
    }

    if (this.searchForm!.get('customer_code')?.value) {
      const soSearch: any = {};
      if (this.searchForm!.get('customer_code')?.value) {
        soSearch.customer_company = { guid: { eq: this.searchForm!.get('customer_code')?.value.guid } };
      }
      where.storing_order = soSearch;
    }

    this.lastSearchCriteria = this.sotDS.addDeleteDtCriteria(where);
    this.performSearch(this.pageSize, this.pageIndex, this.pageSize, undefined, undefined, undefined, reportType);
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, reportType: number = 1) {
    this.subs.sink = this.sotDS.searchStoringOrderTanksEstimateDetails(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {

        this.sotList = data;
        this.endCursor = this.sotDS.pageInfo?.endCursor;
        this.startCursor = this.sotDS.pageInfo?.startCursor;
        this.hasNextPage = this.sotDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPage = this.sotDS.pageInfo?.hasPreviousPage ?? false;
        this.removeNotApproveEstimates();
        this.distinctCustomerGuids = [... new Set(this.sotList.map(item => item.storing_order?.customer_company?.guid))];
        this.export_report(reportType);
      });

    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
  }

  removeNotApproveEstimates() {
    this.sotList = this.sotList.map(sot => {

      sot.cleaning = sot.cleaning?.filter(c => c.approve_dt != null);
      sot.residue = sot.residue?.filter(c => c.approve_dt != null);
      sot.repair = sot.repair?.filter(c => c.approve_dt != null);
      sot.steaming = sot.steaming?.filter(c => c.approve_dt != null);
      const billingSot = sot.billing_sot;
      if (billingSot &&
        ((billingSot.gin_billing_guid == null) || (billingSot.gout_billing_guid == null)) ||
        ((billingSot?.lon_billing_guid !== null && billingSot?.lift_on) || (billingSot?.loff_billing_guid == null && billingSot?.lift_off)) ||
        (billingSot?.preinsp_billing_guid == null && billingSot?.preinspection) ||
        (billingSot?.storage_billing_guid == null)) {
        sot.billing_sot = billingSot;
      } else {
        sot.billing_sot = undefined; // If conditions are not met, set it to null
      }
      return sot;
    }).filter(sot => sot.cleaning?.length || sot.residue?.length || sot.repair?.length || sot.steaming?.length || sot.billing_sot);;
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
      cutoff_dt: ''
    });
    this.customerCodeControl.reset('');
  }

  createNewReportBillingItem(sot: StoringOrderTankItem): report_billing_item {
    var rep_bill_item: report_billing_item = new report_billing_item();
    rep_bill_item = new report_billing_item();
    rep_bill_item.sot_guid = sot?.guid;
    if (sot?.tank_no) { rep_bill_item.tank_no = sot?.tank_no; }
    if (sot?.job_no) { rep_bill_item.job_no = sot?.job_no; }
    if (sot?.tariff_cleaning?.cargo) rep_bill_item.last_cargo = sot?.tariff_cleaning?.cargo;

    var in_gates = sot?.in_gate?.filter(v => v.delete_dt === null || v.delete_dt === 0);
    var out_gates = sot?.out_gate?.filter(v => v.delete_dt === null || v.delete_dt === 0);
    if (in_gates?.length) {
      rep_bill_item.in_date = Utility.convertEpochToDateStr(in_gates?.[0]?.eir_dt);
      rep_bill_item.eir_no = in_gates?.[0]?.eir_no;
    }
    if (out_gates?.length) {
      rep_bill_item.out_date = Utility.convertEpochToDateStr(out_gates?.[0]?.eir_dt);
      rep_bill_item.eir_no = out_gates?.[0]?.eir_no;
    }

    return rep_bill_item;
  }

  calculateCleaningCost(sot: StoringOrderTankItem, rep_bill_items: report_billing_item[])//(items:InGateCleaningItem[],rep_bill_items:report_billing_item[])
  {

    var items: InGateCleaningItem[] = sot.cleaning?.filter(c => c.customer_billing_guid == null) || [];

    if (items.length > 0) {
      var itms = items.filter(v => v.delete_dt === null || v.delete_dt === 0);
      if (itms.length > 0) {

        itms.forEach(c => {
          c.storing_order_tank = sot;
          let newItem = false;
          let rep_bill_item = rep_bill_items.find(item => item.sot_guid === c.storing_order_tank?.guid);

          if (!rep_bill_item) {
            newItem = true;
            rep_bill_item = this.createNewReportBillingItem(sot);
            //rep_bill_item.sot_guid=c.storing_order_tank?.guid;
          }
          // if(c.storing_order_tank?.tank_no){ rep_bill_item.tank_no= c.storing_order_tank?.tank_no;}
          // if(c.storing_order_tank?.job_no){ rep_bill_item.job_no=c.storing_order_tank?.job_no;}
          // if(c.storing_order_tank?.tariff_cleaning?.cargo) rep_bill_item.last_cargo=c.storing_order_tank?.tariff_cleaning?.cargo;
          if (c.status_cv != 'NO_ACTION') {

            rep_bill_item.clean_est_no += 1;
            rep_bill_item.clean_cost = Number(Number(rep_bill_item?.clean_cost || 0) + (c.cleaning_cost || 0) + (c.buffer_cost || 0)).toFixed(2);
            if (newItem) rep_bill_items.push(rep_bill_item);
          }

        });
      }
    }


  }


  calculateGateInOutCost(sot: StoringOrderTankItem, rep_bill_items: report_billing_item[])//(items:BillingSOTItem[],rep_bill_items:report_billing_item[])
  {

    const item: BillingSOTItem = sot.billing_sot!;

    if (item && (item.delete_dt === null || item.delete_dt === 0) && (item.gout_billing_guid == null && item.gin_billing_guid == null)) {
      item.storing_order_tank = sot;

      let newItem = false;

      // Find the corresponding report billing item by sot_guid
      let rep_bill_item = rep_bill_items.find(i => i.sot_guid === item.storing_order_tank?.guid);

      if (!rep_bill_item) {
        newItem = true;
        rep_bill_item = this.createNewReportBillingItem(sot);
      }

      // Calculate gate I/O cost and update rep_bill_item
      const gateIOCost = (item.gate_in ? (item.gate_in_cost || 0) : 0) + (item.gate_out ? (item.gate_out_cost || 0) : 0);

      if (gateIOCost > 0) {
        rep_bill_item.gateio_est_no += 1; // Increment gate I/O estimation number
      }

      rep_bill_item.gateio_cost = Number(Number(rep_bill_item.gateio_cost || 0) + gateIOCost).toFixed(2);

      // Push the new item if it was not found previously
      if (newItem) {
        rep_bill_items.push(rep_bill_item);
      }
    }

    // var items:BillingSOTItem[]=sot.billing_sot!;
    //   if(items.length>0)
    //   {
    //     var itms = items.filter(v=>v.delete_dt===null||v.delete_dt===0);
    //     if(itms.length>0)
    //     { 
    //       itms.forEach(c=>{
    //         c.storing_order_tank=sot;
    //          let newItem=false;
    //         let rep_bill_item= rep_bill_items.find(item=>item.sot_guid===c.storing_order_tank?.guid);
    //         if(!rep_bill_item)
    //         {
    //           newItem=true;
    //           rep_bill_item= this.createNewReportBillingItem(sot);
    //         }
    //         if(((c.gate_in_cost||0)+(c.gate_out_cost||0))>0)rep_bill_item.gateio_est_no +=1;
    //         rep_bill_item.gateio_cost = Number(Number( rep_bill_item?.gateio_cost||0)+ (c.gate_in_cost||0)+(c.gate_out_cost||0)).toFixed(2);
    //         if(newItem)rep_bill_items.push(rep_bill_item);

    //       });
    //     }
    //   }


  }

  calculateLOLOCost(sot: StoringOrderTankItem, rep_bill_items: report_billing_item[])//(items:BillingSOTItem[],rep_bill_items:report_billing_item[])
  {

    const item = sot.billing_sot; // Single object instead of an array

    if (item && (item.delete_dt === null || item.delete_dt === 0) && (item.lon_billing_guid == null && item.loff_billing_guid == null)) {
      item.storing_order_tank = sot;

      let newItem = false;
      let rep_bill_item = rep_bill_items.find(i => i.sot_guid === item.storing_order_tank?.guid);

      if (!rep_bill_item) {
        newItem = true;
        rep_bill_item = this.createNewReportBillingItem(sot);
      }

      const loloCost = (item.lift_off ? item.lift_off_cost! : 0) + (item.lift_on ? item.lift_on_cost! : 0);

      if (loloCost > 0) {
        rep_bill_item.lolo_est_no += 1;
      }

      rep_bill_item.lolo_cost = Number((Number(rep_bill_item?.lolo_cost || 0) + loloCost)).toFixed(2);

      if (newItem) {
        rep_bill_items.push(rep_bill_item);
      }
    }


  }

  calculatePreInspectionCost(sot: StoringOrderTankItem, rep_bill_items: report_billing_item[])//(items:BillingSOTItem[],rep_bill_items:report_billing_item[])
  {

    const item = sot.billing_sot; // Single object instead of an array

    if (item && (item.delete_dt === null || item.delete_dt === 0) && item.preinsp_billing_guid == null) {
      item.storing_order_tank = sot;

      let newItem = false;
      let rep_bill_item = rep_bill_items.find(i => i.sot_guid === item.storing_order_tank?.guid);

      if (!rep_bill_item) {
        newItem = true;
        rep_bill_item = this.createNewReportBillingItem(sot);
      }

      const preinsCost = item.preinspection ? item.preinspection_cost! : 0;

      if (preinsCost > 0) {
        rep_bill_item.preins_est_no += 1;
      }

      rep_bill_item.preins_cost = Number((Number(rep_bill_item?.preins_cost || 0) + preinsCost)).toFixed(2);

      if (newItem) {
        rep_bill_items.push(rep_bill_item);
      }
    }

  }

  calculateStorageCost(sot: StoringOrderTankItem, rep_bill_items: report_billing_item[]) {
    const item = sot.billing_sot; // Single object instead of an array

    if (item && (item.delete_dt === null || item.delete_dt === 0) && item.storage_billing_guid == null) {
      item.storing_order_tank = sot;

      let newItem = false;
      let rep_bill_item = rep_bill_items.find(i => i.sot_guid === item.storing_order_tank?.guid);

      if (!rep_bill_item) {
        newItem = true;
        rep_bill_item = this.createNewReportBillingItem(sot);
      }

      let packDepotItm: PackageDepotItem = new PackageDepotItem();
      packDepotItm.storage_cal_cv = item.storage_cal_cv;

      let daysDifference: number = Number(this.pdDS.getStorageDays(item.storing_order_tank!, packDepotItm));
      rep_bill_item.days = String(daysDifference);

      if ((item.storage_cost || 0) * daysDifference > 0) {
        rep_bill_item.storage_est_no += 1;
      }

      rep_bill_item.storage_cost = Number((item.storage_cost || 0) * daysDifference).toFixed(2);

      if (newItem) {
        rep_bill_items.push(rep_bill_item);
      }
    }


  }

  calculateRepairCost(sot: StoringOrderTankItem, rep_bill_items: report_billing_item[], CustomerType: number = 0)//(items:RepairItem[],rep_bill_items:report_billing_item[],CustomerType:number=0)
  {

    var items: RepairItem[] = sot.repair?.filter(r => r.customer_billing_guid == null) || [];
    if (CustomerType == 1) {
      items = sot.repair?.filter(r => r.owner_billing_guid == null) || [];
    }
    if (items.length > 0) {
      var itms = items.filter(v => v.delete_dt === null || v.delete_dt === 0);
      if (itms.length > 0) {
        itms.forEach(c => {
          c.storing_order_tank = sot;
          let newItem = false;
          let rep_bill_item = rep_bill_items.find(item => item.sot_guid === c.storing_order_tank?.guid);
          if (!rep_bill_item) {
            newItem = true;
            rep_bill_item = this.createNewReportBillingItem(sot);
            //rep_bill_item= new report_billing_item();
            //rep_bill_item.sot_guid=c.storing_order_tank?.guid;
          }
          // if(c.storing_order_tank?.tank_no){ rep_bill_item.tank_no= c.storing_order_tank?.tank_no;}
          // if(c.storing_order_tank?.job_no){ rep_bill_item.job_no=c.storing_order_tank?.job_no;}
          // if(c.storing_order_tank?.tariff_cleaning?.cargo) rep_bill_item.last_cargo=c.storing_order_tank?.tariff_cleaning?.cargo;
          if (c.status_cv != 'NO_ACTION') {

            const totalCost = this.repDS.calculateCost(c, c.repair_part!, c.labour_cost);
            rep_bill_item.repair_cost = Number(Number(rep_bill_item?.repair_cost || 0) + (CustomerType == 0 ? Number(totalCost.total_lessee_mat_cost || 0) : Number(totalCost.total_owner_cost || 0))).toFixed(2);
            var currentEstNo: number = rep_bill_item.repair_est_no;
            if ((CustomerType == 0 && Number(totalCost.total_lessee_mat_cost || 0) > 0) ||
              (CustomerType == 1 && Number(totalCost.total_owner_cost || 0) > 0)) {
              rep_bill_item.repair_est_no += 1;
            }

            if (newItem && (rep_bill_item.repair_est_no > currentEstNo)) rep_bill_items.push(rep_bill_item);
          }

        });
      }
    }

  }


  calculateResidueCost(sot: StoringOrderTankItem, rep_bill_items: report_billing_item[])//(items:ResidueItem[],rep_bill_items:report_billing_item[])
  {

    var items: ResidueItem[] = sot.residue?.filter(r => r.customer_billing_guid == null) || [];
    if (items.length > 0) {
      var itms = items.filter(v => v.delete_dt === null || v.delete_dt === 0);
      if (itms.length > 0) {
        itms.forEach(c => {
          c.storing_order_tank = sot;
          let newItem = false;
          let rep_bill_item = rep_bill_items.find(item => item.sot_guid === c.storing_order_tank?.guid);
          if (!rep_bill_item) {
            newItem = true;
            rep_bill_item = this.createNewReportBillingItem(sot);
          }

          // if(c.storing_order_tank?.tank_no){ rep_bill_item.tank_no= c.storing_order_tank?.tank_no;}
          // if(c.storing_order_tank?.job_no){ rep_bill_item.job_no=c.storing_order_tank?.job_no;}
          // if(c.storing_order_tank?.tariff_cleaning?.cargo) rep_bill_item.last_cargo=c.storing_order_tank?.tariff_cleaning?.cargo;
          if (c.status_cv != 'NO_ACTION') {
            let total = 0;
            c.residue_part?.forEach(p => {

              if (rep_bill_item) {
                total += ((p.approve_part ?? true) ? ((p.approve_cost || 0) * (p.approve_qty || 0)) : 0);
                rep_bill_item.residue_cost = Number(Number(rep_bill_item?.residue_cost || 0) + ((p.approve_part ?? true) ? ((p.approve_cost || 0) * (p.approve_qty || 0)) : 0)).toFixed(2);
              }

            });
            if (total > 0) rep_bill_item.residue_est_no += 1;
            if (newItem) rep_bill_items.push(rep_bill_item);
          }

        });
      }
    }

  }

  calculateSteamingCost(sot: StoringOrderTankItem, rep_bill_items: report_billing_item[])//(items:SteamItem[],rep_bill_items:report_billing_item[])
  {

    var items: SteamItem[] = sot.steaming?.filter(s => s.customer_billing_guid == null) || [];
    if (items.length > 0) {
      var itms = items.filter(v => v.delete_dt === null || v.delete_dt === 0);
      if (itms.length > 0) {
        itms.forEach((c) => {
          c.storing_order_tank = sot;
          let newItem = false;
          let rep_bill_item = rep_bill_items.find(item => item.sot_guid === c.storing_order_tank?.guid);
          if (!rep_bill_item) {
            newItem = true;
            rep_bill_item = this.createNewReportBillingItem(sot);
            // rep_bill_item= new report_billing_item();
            // rep_bill_item.sot_guid=c.storing_order_tank?.guid;
          }

          // if(c.storing_order_tank?.tank_no){ rep_bill_item.tank_no= c.storing_order_tank?.tank_no;}
          // if(c.storing_order_tank?.job_no){ rep_bill_item.job_no=c.storing_order_tank?.job_no;}
          // if(c.storing_order_tank?.tariff_cleaning?.cargo) rep_bill_item.last_cargo=c.storing_order_tank?.tariff_cleaning?.cargo;
          if (c.status_cv != 'NO_ACTION') {
            let total = 0;
            let cost = this.retrieveLabourCost(c.storing_order_tank?.storing_order?.customer_company?.guid!);
            total = (this.stmDS.getApprovalTotalWithLabourCost(c?.steaming_part, cost).total_mat_cost || 0);

            rep_bill_item.steam_cost = Number(Number(rep_bill_item.steam_cost || 0) + total).toFixed(2);

            if (total > 0) rep_bill_item.steam_est_no += 1;
            if (newItem) rep_bill_items.push(rep_bill_item);
          }

        });
      }
    }

  }

  retrieveLabourCost(ccGuid: string): number {
    var cost: number = 0;

    if (this.allCustLabourCosts.length > 0) {
      var selCC: PackageLabourItem = this.allCustLabourCosts.find(c => c.customer_company_guid === ccGuid) || new PackageLabourItem();
      cost = selCC.cost || 0;
    }
    return cost;
  }
  async getAllClientLabourCost(): Promise<void> {

    const where: any = { or: [] };
    this.distinctCustomerGuids.forEach((d: string) => {
      where.or.push({ customer_company_guid: { eq: d } });
    });
    try {
      this.allCustLabourCosts = await firstValueFrom(this.plDS.getCustomerPackageCost(where));


    } catch (error) {
      console.error("Error fetching customer package cost:", error);
    }
  }




  async getSteamPartsTotalCost(row: any): Promise<void> {
    const customer_company_guid = row.storing_order_tank?.storing_order?.customer_company?.guid;
    const where = {
      and: [{ customer_company_guid: { eq: customer_company_guid } }]
    };

    try {
      let data = await firstValueFrom(this.plDS.getCustomerPackageCost(where));

      if (data.length > 0) {
        const cost: number = data[0].cost;
        row.total_cost = (this.stmDS.getApprovalTotalWithLabourCost(row?.steaming_part, cost).total_mat_cost || 0);
        // this.calculateTotalCost();
      }
    } catch (error) {
      console.error("Error fetching customer package cost:", error);
    }
  }


  calculateBillingSOT(sot: StoringOrderTankItem, rep_bill_items: report_billing_item[])//(items:BillingSOTItem[],rep_bill_items:report_billing_item[])
  {
    const item = sot.billing_sot!;
    // if(items.length>0)
    {
      //    var itms = items.filter(v=>v.delete_dt===null||v.delete_dt===0);
      //  itms = itms.map(i => ({ ...i, storing_order_tank: sot }));
      // if(itms.length>0)
      {
        this.calculateStorageCost(sot, rep_bill_items);
        this.calculatePreInspectionCost(sot, rep_bill_items);
        this.calculateLOLOCost(sot, rep_bill_items);
        this.calculateGateInOutCost(sot, rep_bill_items);
        //sot.billing_sot = itms.filter(i=>i.storage_billing_guid==null);
        // if(sot.billing_sot .length) this.calculateStorageCost(sot,rep_bill_items);
        // sot.billing_sot = itms.filter(i=>i.preinsp_billing_guid==null);
        // if(sot.billing_sot .length) this.calculatePreInspectionCost(sot,rep_bill_items);
        // sot.billing_sot = itms.filter(i=>i.lolo_billing_guid==null);
        // if(sot.billing_sot .length) this.calculateLOLOCost(sot,rep_bill_items);
        // sot.billing_sot = itms.filter(i=>i.gateio_billing_guid==null);
        // if(sot.billing_sot .length) this.calculateGateInOutCost(sot,rep_bill_items);
      }
    }
  }

  export_report(reportType: number) {
    if (!this.sotList.length) {
      this.isGeneratingReport = false;
      return;
    }

    this.getAllClientLabourCost().then(() => {
      var repCustomers: report_billing_customer[] = []
      // var rpItems:report_billing_item[]=[];

      this.sotList.forEach((b) => {
        var repCusts = repCustomers.filter(c => c.guid === b.storing_order?.customer_company?.guid);
        var repCust: report_billing_customer = new report_billing_customer();
        var newCust: boolean = true;
        if (repCusts.length > 0) {
          repCust = repCusts[0];
          newCust = false;
        }

        else {
          repCust.guid = b.storing_order?.customer_company?.guid;
          repCust.items = [];
        }
        repCust.customer = this.ccDS.displayName(b.storing_order?.customer_company);
        //  if (this.searchForm!.get('inv_dt_start')?.value && this.searchForm!.get('inv_dt_end')?.value) {
        //     repCust.invoice_period=`${Utility.convertDateToStr(new Date(this.searchForm!.value['inv_dt_start']))} - ${Utility.convertDateToStr(new Date(this.searchForm!.value['inv_dt_end']))}`;
        //  }
        this.createReportBillingItem_R1(b, repCust);
        //const rpBillingItm = await this.createReportBillingItem_R1(b, repCust);
        //repCust.items = rpBillingItm;

        if (newCust) repCustomers.push(repCust);

        this.checkRepairBillingForTankOwner(b, repCustomers);

      });
      repCustomers.map(c => {

        c.items?.map(i => {
          var total: number = 0;
          total = Number(i.clean_cost || 0) + Number(i.gateio_cost || 0) + Number(i.lolo_cost || 0) + Number(i.preins_cost || 0)
            + Number(i.storage_cost || 0) + Number(i.repair_cost || 0) + Number(i.residue_cost || 0) + Number(i.steam_cost || 0)
            ;
          i.total = total.toFixed(2);

        });

      });

      if (this.searchForm!.get('customer_code')?.value) {
        repCustomers = repCustomers.filter(c => c.guid === this.searchForm!.get('customer_code')?.value.guid);
      }

      if (reportType === 1) {
        this.onExportSummary(repCustomers);
      }
      else if (reportType == 2) {
        this.onExportDetail_Cost(repCustomers);

      }
    });


  }

  checkRepairBillingForTankOwner(sot: StoringOrderTankItem, repCustomers: report_billing_customer[]) {
    if (sot.repair?.length === 0) return;

    let rep = sot.repair?.map(r => {
      let repParts = r.repair_part?.filter(f => (f.approve_part ?? true) && f.owner);

      return repParts?.length! > 0 ? repParts : null;
    }).filter(p => p != null);
    if (rep?.length === 0) return;

    var repCusts = repCustomers.filter(c => c.guid === sot.customer_company?.guid);
    var repCust: report_billing_customer = new report_billing_customer();
    var newCust: boolean = true;
    if (repCusts.length > 0) {
      repCust = repCusts[0];
      newCust = false;
    }
    else {
      repCust.guid = sot.customer_company?.guid;
      repCust.items = [];
      repCust.customer = this.ccDS.displayName(sot.customer_company);
    }
    this.calculateRepairCost(sot, repCust.items!, 1);
    if (newCust && repCust.items?.length) repCustomers.push(repCust);

  }

  createReportBillingItem_R1(b: StoringOrderTankItem, rbCust: report_billing_customer) {
    var repBillItems: report_billing_item[] = rbCust.items || [];
    //var repBillingItm:report_billing_item= new report_billing_item();

    // if(b.cleaning?.length!>0) this.calculateCleaningCost(b.cleaning!,repBillItems);
    //if(b.repair?.length!>0) this.calculateRepairCost(b.repair!,repBillItems);
    // if(b.residue?.length!>0) this.calculateResidueCost(b.residue!,repBillItems);
    // if(b.steaming?.length!>0) this.calculateSteamingCost(b.steaming!,repBillItems);
    //if(b.billing_sot?.length!>0) this.calculateBillingSOT(b.billing_sot!,repBillItems);
    if (b.cleaning?.length! > 0) this.calculateCleaningCost(b, repBillItems);
    if (b.repair?.length! > 0) this.calculateRepairCost(b, repBillItems);
    if (b.residue?.length! > 0) this.calculateResidueCost(b, repBillItems);
    if (b.steaming?.length! > 0) this.calculateSteamingCost(b, repBillItems);
    if (b.billing_sot != null) this.calculateBillingSOT(b, repBillItems);
    rbCust.items = repBillItems || [];
    //return repBillItems;

  }
  async createReportBillingItem(b: StoringOrderTankItem, rbItm: report_billing_item[]): Promise<report_billing_item[]> {
    var repBillItems: report_billing_item[] = rbItm;
    //var repBillingItm:report_billing_item= new report_billing_item();

    // if(b.cleaning?.length!>0) this.calculateCleaningCost(b.cleaning!,repBillItems);
    //if(b.repair?.length!>0) this.calculateRepairCost(b.repair!,repBillItems);
    // if(b.residue?.length!>0) this.calculateResidueCost(b.residue!,repBillItems);
    // if(b.steaming?.length!>0) this.calculateSteamingCost(b.steaming!,repBillItems);
    //if(b.billing_sot?.length!>0) this.calculateBillingSOT(b.billing_sot!,repBillItems);
    if (b.cleaning?.length! > 0) this.calculateCleaningCost(b, repBillItems);
    if (b.repair?.length! > 0) this.calculateRepairCost(b, repBillItems);
    if (b.residue?.length! > 0) this.calculateResidueCost(b, repBillItems);
    if (b.steaming?.length! > 0) await this.calculateSteamingCost(b, repBillItems);
    if (b.billing_sot != null) this.calculateBillingSOT(b, repBillItems);

    return repBillItems;

  }

  onExportDetail_Cost(repCustomers: report_billing_customer[]) {
    //this.preventDefault(event);
    let cut_off_dt = new Date();

    if (this.searchForm!.get('cutoff_dt')?.value) {
      cut_off_dt = this.searchForm!.get('cutoff_dt')?.value;
    }
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(PendingInvoiceCostDetailPdfComponent, {
      width: reportPreviewWindowDimension.landscape_width_rate,
      maxWidth: reportPreviewWindowDimension.landscape_maxWidth,
      maxHeight: reportPreviewWindowDimension.report_maxHeight,
      data: {
        billing_customers: repCustomers,
        cut_off_dt: Utility.convertDateToStr(new Date(cut_off_dt))
      },
      // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      this.isGeneratingReport = false;
    });
  }


  onExportSummary(repCustomers: report_billing_customer[]) {
    //this.preventDefault(event);
    let cut_off_dt = new Date();

    if (this.searchForm!.get('cutoff_dt')?.value) {
      cut_off_dt = this.searchForm!.get('cutoff_dt')?.value;
    }
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(PendingSummaryPdfComponent, {
      width: reportPreviewWindowDimension.portrait_width_rate,
      maxWidth: reportPreviewWindowDimension.portrait_maxWidth,
      maxHeight: reportPreviewWindowDimension.report_maxHeight,
      data: {
        billing_customers: repCustomers,
        cut_off_dt: Utility.convertDateToStr(new Date(cut_off_dt))
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

}