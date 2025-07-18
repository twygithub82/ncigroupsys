import { Direction } from '@angular/cdk/bidi';
import { CommonModule } from '@angular/common';
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
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { GuidSelectionModel } from '@shared/GuidSelectionModel';
import { Apollo } from 'apollo-angular';
import { BillingDS, BillingEstimateRequest } from 'app/data-sources/billing';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { PackageLabourDS } from 'app/data-sources/package-labour';
import { report_status, report_status_yard } from 'app/data-sources/reports';
import { SteamDS, SteamItem } from 'app/data-sources/steam';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { LocationStatusSummaryPdfComponent } from 'app/document-template/pdf/status/location-pdf/location-status-summary-pdf.component';
import { YardSummaryPdfComponent } from 'app/document-template/pdf/tank-activity/yard/summary-pdf/yard-summary-pdf.component';
import { ComponentUtil } from 'app/utilities/component-util';
import { TANK_STATUS_IN_YARD, Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { reportPreviewWindowDimension } from 'environments/environment';
import { debounceTime, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'app-location-status-report',
  standalone: true,
  templateUrl: './location-status.component.html',
  styleUrl: './location-status.component.scss',
  imports: [
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
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
export class LocationStatusReportComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
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
    DATE: 'COMMON-FORM.DATE',
    INVENTORY_TYPE: 'COMMON-FORM.INVENTORY-TYPE',
    SUMMARY_REPORT: 'COMMON-FORM.SUMMARY-REPORT',
    YARD_STATUS: 'COMMON-FORM.YARD-STATUS',
    YARD: 'COMMON-FORM.YARD',
    ONE_CONDITION_NEEDED: 'COMMON-FORM.ONE-CONDITION-NEEDED',
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

  distinctCustomerCodes: any;
  selectedEstimateItem?: SteamItem;
  selectedEstimateLabourCost?: number;
  stmEstList: SteamItem[] = [];
  sotList: StoringOrderTankItem[] = [];
  customer_companyList?: CustomerCompanyItem[];
  branch_companyList?: CustomerCompanyItem[];
  purposeOptionCvList: CodeValuesItem[] = [];
  eirStatusCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  tankStatusCvListDisplay: CodeValuesItem[] = [];
  inventoryTypeCvList: CodeValuesItem[] = [];
  yardCvList: CodeValuesItem[] = [];

  processType: string = "STEAMING";
  billingParty: string = "CUSTOMER";

  pageIndex = 0;
  pageSize = 10000;
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
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.initializeValueChanges();
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
      eir_no: [''],
      tank_no: [''],
      eir_dt_start: [''],
      eir_dt_end: [''],
      inv_type: ['MASTER_IN'],
      yard: ['']

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
  }

  public loadData() {
    const queries = [
      // { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      // { alias: 'eirStatusCv', codeValType: 'EIR_STATUS' },
      // { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
      { alias: 'inventoryTypeCv', codeValType: 'INVENTORY_TYPE' },
      { alias: 'yardCv', codeValType: 'YARD' },
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('yardCv').subscribe(data => {
      this.yardCvList = data || [];
    });
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

  search_summary() {
    this.search(1);
  }

  search_detail() {
    this.search(2);
  }

  search(report_type: number) {
    this.isGeneratingReport = true;
    var cond_counter = 0;
    let queryType = 1;
    const where: any = {};

    where.tank_status_cv = { in: TANK_STATUS_IN_YARD }; //{ neq: "RELEASED" };

    if (this.searchForm?.get('customer_code')?.value) {
      var cond: any = { customer_company_guid: { eq: this.searchForm!.get('customer_code')?.value?.guid } };

      where.storing_order = cond;
      cond_counter++;
    }


    if (this.searchForm?.get('eir_no')?.value) {
      var cond: any = { eir_no: { contains: this.searchForm!.get('eir_no')?.value } };
      if (!where.in_gate) {
        where.in_gate = {};
        where.in_gate.some = {};
        where.in_gate.some.and = [];
      }
      where.in_gate.some.and.push(cond);
      cond_counter++;
    }

    if (this.searchForm?.get('yard')?.value) {
      var yards: string[] = this.searchForm!.get('yard')?.value?.map((y: any) => y.code_val) || [];
      where.tank_info = {
        and: [
          { yard_cv: { in: yards } }
        ]
      }
      cond_counter++;
    }

    if (this.searchForm?.get('tank_no')?.value) {
      where.tank_no = { eq: this.searchForm?.get('tank_no')?.value };
      cond_counter++;
    }

    this.noCond = (cond_counter === 0);
    if (this.noCond) {
      this.isGeneratingReport = false;
      return;
    }
    this.lastSearchCriteria = this.stmDS.addDeleteDtCriteria(where);
    this.performSearch(this.pageSize, this.pageIndex, this.pageSize, undefined, undefined, undefined, report_type);
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, report_type?: number) {
    this.subs.sink = this.sotDS.searchStoringOrderTanksLocationStatusSummary(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {
        this.sotList = data;
        this.endCursor = this.stmDS.pageInfo?.endCursor;
        this.startCursor = this.stmDS.pageInfo?.startCursor;
        this.hasNextPage = this.stmDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPage = this.stmDS.pageInfo?.hasPreviousPage ?? false;
        this.ProcessReportStatus(report_type!);
        //this.checkInvoicedAndGetTotalCost();
        //this.checkInvoiced();
        //this.distinctCustomerCodes= [... new Set(this.sotList.map(item=>item.storing_order?.customer_company?.code))];
      });
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

  displayYard(codeValType: CodeValuesItem | undefined): string {
    return this.cvDS.getCodeDescription(codeValType?.code_val, this.yardCvList)!;
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
  }

  resetForm() {
    this.searchForm?.patchValue({
      eir_no: '',
      tank_no: '',
      eir_dt_start: '',
      eir_dt_end: '',
      inv_type: ['MASTER_IN'],
      yard: ''
    });
    this.customerCodeControl.reset('');
    this.lastCargoControl.reset('');
  }

  isAllSelected() {
    // this.calculateTotalCost();
    const numSelected = this.selection.selected.length;
    const numRows = this.stmEstList.length;
    return numSelected === numRows;
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
        //this.calculateTotalCost();
      }
    });
  }

  ProcessReportStatus(report_type: number) {
    if (this.sotList.length === 0) {
      this.isGeneratingReport = false;
      return;
    }

    var repStatus: report_status[] = [];

    this.sotList.map(s => {
      if (s) {
        var yard_cv = s.tank_info?.yard_cv || s.in_gate?.[0]?.yard_cv || undefined;
        if (!yard_cv) return;
        var repCust: report_status = repStatus.find(r => r.code === s.storing_order?.customer_company?.code) || new report_status();
        let newCust = false;
        if (!repCust.code) {
          repCust.code = s.storing_order?.customer_company?.code;
          repCust.customer = s.storing_order?.customer_company?.name;
          repCust.yards = [];
          newCust = true;
        }
        repCust.number_tank ??= 0;
        repCust.number_tank += 1;
        var yard: report_status_yard = repCust.yards?.find(y => y.code === yard_cv) || new report_status_yard();
        let newYard = false;
        if (!yard.code) {
          yard.code = yard_cv;
          yard.storing_order_tank = [];
          newYard = true;
        }
        switch (s.tank_status_cv) {
          case "STEAM":
            yard.noTank_steam! += 1;
            break;
          case "OFFHIRE":
          case "REPAIR":
            yard.noTank_repair! += 1;
            break;
          case "CLEANING":
            yard.noTank_clean! += 1;
            break;
          case "STORAGE":
            yard.noTank_storage! += 1;
            break;
          case "IN_SURVEY":
            yard.noTank_in_survey! += 1;
            break;
        }
        yard.storing_order_tank?.push(s);
        if (newYard) repCust.yards?.push(yard);
        if (newCust) repStatus.push(repCust);
      }
    });

    if (this.searchForm?.get('customer_code')?.value) {
      repStatus = repStatus.filter(s => s.code == this.searchForm?.get('customer_code')?.value.code);
    }
    if (report_type == 1) {
      this.onExportSummary(repStatus);
    }
    else {
      this.onExportDetail(repStatus);
    }
  }

  onExportDetail(repStatus: report_status[]) {
    //this.preventDefault(event);
    let cut_off_dt = new Date();
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(YardSummaryPdfComponent, {
      width: reportPreviewWindowDimension.portrait_width_rate,
      maxWidth: reportPreviewWindowDimension.portrait_maxWidth,
      maxHeight: reportPreviewWindowDimension.report_maxHeight,
      data: {
        report_customer_tank_activity: repStatus,
      },
      // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      this.isGeneratingReport = false;
    });
  }

  onExportSummary(repStatus: report_status[]) {
    //this.preventDefault(event);
    let cut_off_dt = new Date();

    var yardsCv: CodeValuesItem[] = (this.searchForm?.get('yard')?.value || this.yardCvList);

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(LocationStatusSummaryPdfComponent, {
      width: reportPreviewWindowDimension.portrait_width_rate,
      maxWidth: reportPreviewWindowDimension.portrait_maxWidth,
      maxHeight: reportPreviewWindowDimension.report_maxHeight,
      data: {
        report_summary_status: repStatus,
        yards: yardsCv
      },
      // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      this.isGeneratingReport = false;
    });
  }
}