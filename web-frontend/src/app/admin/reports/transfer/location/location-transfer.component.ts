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
import { BillingDS, BillingEstimateRequest } from 'app/data-sources/billing';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { PackageLabourDS } from 'app/data-sources/package-labour';
import { report_customer_tank_activity, report_status, report_status_yard } from 'app/data-sources/reports';
import { SteamDS, SteamItem } from 'app/data-sources/steam';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { LocationStatusSummaryPdfComponent } from 'app/document-template/pdf/status/location-pdf/location-status-summary-pdf.component';
import { YardSummaryPdfComponent } from 'app/document-template/pdf/tank-activity/yard/summary-pdf/yard-summary-pdf.component';
import { TransferLocationPdfComponent } from 'app/document-template/pdf/transfer-location-pdf/transfer-location-pdf.component';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { reportPreviewWindowDimension } from 'environments/environment';
import { debounceTime, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'app-location-transfer-report',
  standalone: true,
  templateUrl: './location-transfer.component.html',
  styleUrl: './location-transfer.component.scss',
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
  ]
})
export class LocationTransferReportComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
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
    DATE: 'COMMON-FORM.DATE',
    INVENTORY_TYPE: 'COMMON-FORM.INVENTORY-TYPE',
    SUMMARY_REPORT: 'COMMON-FORM.SUMMARY-REPORT',
    YARD_STATUS: 'COMMON-FORM.YARD-STATUS',
    YARD: 'COMMON-FORM.YARD',
    ONE_CONDITION_NEEDED: 'COMMON-FORM.ONE-CONDITION-NEEDED',
    TRANSFER_DATE: 'COMMON-FORM.TRANSFER-DATE'
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
  last_cargoList?: TariffCleaningItem[];
  purposeOptionCvList: CodeValuesItem[] = [];
  eirStatusCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  tankStatusCvListDisplay: CodeValuesItem[] = [];
  inventoryTypeCvList: CodeValuesItem[] = [];
  yardCvList: CodeValuesItem[] = [];

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
      eir_dt_start: [''],
      eir_dt_end: [''],
      inv_type: ['MASTER_IN'],
      yard: [''],
      purpose: [''],
      trf_dt_start: [''],
      trf_dt_end: ['']

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
          //     this.ccDS.loadItems({ main_customer_guid: { eq: mainCustomerGuid } }).subscribe(data => {
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
    const queries = [
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
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
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      this.purposeOptionCvList = addDefaultSelectOption(data, 'All');
    });
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

    var cond_counter = 0;
    let queryType = 1;
    const where: any = {};

    if(this.searchForm?.invalid) return;
    // where.tank_status_cv = { neq: "RELEASED" };
    // if (this.searchForm?.get('customer_code')?.value) {
    //   // if(!where.storing_order_tank) where.storing_order_tank={};
    //   where.customer_company = { code: { eq: this.searchForm?.get('customer_code')?.value.code } };
    //   cond_counter++;
    // }

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

      var cond: any = { yard_cv: { in: yards } };
      if (!where.in_gate) {
        where.in_gate = {};
        where.in_gate.some = {};
        where.in_gate.some.and = [];
      }
      where.in_gate.some.and.push(cond);
      cond_counter++;
    }


    if (this.searchForm?.get('tank_no')?.value) {
      // if(!where.storing_order_tank) where.storing_order_tank={};
      where.tank_no = { eq: this.searchForm?.get('tank_no')?.value.code };
      cond_counter++;
    }

    var date: string = ''
    if (this.searchForm?.get('trf_dt_start')?.value && this.searchForm?.get('trf_dt_end')?.value) {
      var start_dt = new Date(this.searchForm!.value['trf_dt_start']);
      var end_dt = new Date(this.searchForm!.value['trf_dt_end']);
      var cond: any = {
        some: {
          or: [
            { transfer_in_dt: { gte: Utility.convertDate(start_dt), lte: Utility.convertDate(end_dt, true) } },
            { transfer_out_dt: { gte: Utility.convertDate(start_dt), lte: Utility.convertDate(end_dt, true) } }
          ]
        }
      };
      date = `${Utility.convertDateToStr(new Date(this.searchForm!.get('trf_dt_start')?.value))} - ${Utility.convertDateToStr(new Date(this.searchForm!.get('trf_dt_end')?.value))}`;

      where.transfer = {};
      where.transfer = cond;
      cond_counter++;
    }

    this.noCond = (cond_counter === 0);
    if (this.noCond) return;
    this.lastSearchCriteria = this.stmDS.addDeleteDtCriteria(where);
    this.performSearch(date);


  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
  }
  performSearch(date: string) {
    this.subs.sink = this.sotDS.searchStoringOrderTanksYardTransferReport(this.lastSearchCriteria)
      .subscribe(data => {
        this.sotList = data;
        this.endCursor = this.stmDS.pageInfo?.endCursor;
        this.startCursor = this.stmDS.pageInfo?.startCursor;
        this.hasNextPage = this.stmDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPage = this.stmDS.pageInfo?.hasPreviousPage ?? false;
        this.ProcessReportTransferYard(date);
      });

  }

  onPageEvent(event: PageEvent) {

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
      eir_dt_start: '',
      eir_dt_end: '',
      inv_type: ['MASTER_IN'],
      yard: '',
      purpose: '',
      trf_dt_start: '',
      trf_dt_end: ''
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




  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.langText.SAVE_SUCCESS;
      this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
        successMsg = res;
        ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
        //this.router.navigate(['/admin/master/estimate-template']);

        // Navigate to the route and pass the JSON object

      });
    }
  }


  ProcessReportTransferYard(date: string) {
    if (this.sotList.length === 0) return;

    var report_customer_tank_acts: report_customer_tank_activity[] = [];

    this.sotList.map(s => {

      if (s) {
        var repCust: report_customer_tank_activity = report_customer_tank_acts.find(r => r.code === s.storing_order?.customer_company?.code) || new report_customer_tank_activity();
        let newCust = false;
        if (!repCust.code) {
          repCust.code = s.storing_order?.customer_company?.code;
          repCust.customer = s.storing_order?.customer_company?.name;
          newCust = true;
        }
        repCust.number_tank ??= 0;
        repCust.number_tank += 1;
        if (!repCust.storing_order_tank) repCust.storing_order_tank = [];
        repCust.storing_order_tank?.push(s);
        if (newCust) report_customer_tank_acts.push(repCust);



      }
    });


    this.onExportDetail(report_customer_tank_acts, date);


  }

  onExportDetail(repStatus: report_customer_tank_activity[], date: string) {
    //this.preventDefault(event);
    let cut_off_dt = new Date();


    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(TransferLocationPdfComponent, {
      width: reportPreviewWindowDimension.portrait_width_rate,
      maxWidth: reportPreviewWindowDimension.portrait_maxWidth,
      maxHeight: reportPreviewWindowDimension.report_maxHeight,
      data: {
        report_transfer_location: repStatus,
        date: date
      },
      // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {

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

    });
  }



}