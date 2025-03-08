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
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { PackageLabourDS } from 'app/data-sources/package-labour';
import { report_customer_tank_activity } from 'app/data-sources/reports';
import { SteamDS, SteamItem } from 'app/data-sources/steam';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { YardSummaryPdfComponent } from 'app/document-template/pdf/tank-activity/yard/summary-pdf/yard-summary-pdf.component';
import { Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import {PendingEstimateReportPdfComponent} from 'app/document-template/pdf/pending-estimate-report-pdf/pending-estimate-report-pdf.component'
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';

@Component({
  selector: 'app-estimate-pending',
  standalone: true,
  templateUrl: './estimate-pending.component.html',
  styleUrl: './estimate-pending.component.scss',
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
    PreventNonNumericDirective
  ]
})
export class EstimatePendingComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
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
    DETAIL_REPORT: 'COMMON-FORM.DETAIL-REPORT',
    ONE_CONDITION_NEEDED: 'COMMON-FORM.ONE-CONDITION-NEEDED',
    REPAIR_TYPE:'COMMON-FORM.REPAIR-TYPE',
    OUTSTANDING_DAYS:'COMMON-FORM.OUTSTANDING-DAYS',
    MAX_DAYS:'COMMON-FORM.MAX-DAYS',
    MIN_DAYS:'COMMON-FORM.MIN-DAYS',
    WARNING_OUTSTANDING_DAYS:'COMMON-FORM.WARNING-OUTSTANDING-DAYS'
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
  repairTypeCvList: CodeValuesItem[] = [];

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
    this.searchForm = this.fb.group(
      {
        customer_code: this.customerCodeControl,
        eir_no: [''],
        tank_no: [''],
        eir_dt_start: [''],
        eir_dt_end: [''],
        cln_dt_start: [''],
        cln_dt_end: [''],
        rep_type: [''],
        min_days: [''],
        max_days: ['']
      },
      { validators: this.minMaxDaysValidator } // Apply custom validator at form level
    );
  }

   // Custom validator to check if min <= max
   minMaxDaysValidator(form:UntypedFormGroup) {
    
      const minControl = form.get('min_days');
      const maxControl = form.get('max_days');

      const min = minControl?.value;
      const max = maxControl?.value;

      if (min !== null && max !== null && min !== '' && max !== '' && min > max) {
        minControl?.setErrors({ invalidRange: true });
        maxControl?.setErrors({ invalidRange: true });
        return { invalidRange: true }; // Form-level error
      } else {
        minControl?.setErrors(null);
        maxControl?.setErrors(null);
        return null; // No error
      }
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
      // { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      // { alias: 'eirStatusCv', codeValType: 'EIR_STATUS' },
      // { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
      { alias: 'repairTypeCv', codeValType: 'REPAIR_OPTION' },
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('repairTypeCv').subscribe(data => {
      this.repairTypeCvList = data;
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

    var cond_counter = 0;
    let queryType = 1;
    const where: any = {};
    this.selectedEstimateItem = undefined;
    this.selectedEstimateLabourCost = 0;
    this.stmEstList = [];
    this.selection.clear();

    //var invType: string = this.repairTypeCvList.find(i => i.code_val == (this.searchForm!.get('rep_type')?.value))?.description || '';

   
    if (this.searchForm!.get('tank_no')?.value) {
      where.tank_no = { contains: this.searchForm!.get('tank_no')?.value };
      cond_counter++;
    }

    if (this.searchForm!.get('customer_code')?.value) {
      // if(!where.storing_order_tank) where.storing_order_tank={};
      where.storing_order = { customer_company: { code: { eq: this.searchForm!.get('customer_code')?.value.code } } };
      cond_counter++;
    }

    
    if( (this.searchForm!.get('min_days')?.value) && (this.searchForm!.get('max_days')?.value)) {
      if(!where.repair)where.repair={};

      const today = new Date(); // Today's date
      const minDate = new Date(today);
      const maxDate = new Date(today);

      // Calculate min and max dates based on min_days and max_days
      minDate.setDate(today.getDate() - this.searchForm!.get('min_days')?.value);
      maxDate.setDate(today.getDate() - this.searchForm!.get('max_days')?.value);

      // Convert dates to epoch timestamps (in seconds)
      const maxEpoch = Math.floor(maxDate.getTime() / 1000); // Convert to seconds
      const minEpoch = Math.floor(minDate.getTime() / 1000); // Convert to seconds
       where.repair={some:{allocate_dt:{
        lte: minEpoch, // Greater than or equal to minEpoch
        gte: maxEpoch, // Less than or equal to maxEpoch

       }}}
       cond_counter++;
    }
    else if (this.searchForm!.get('min_days')?.value)
    {
      if(!where.repair)where.repair={};
      const today = new Date(); // Today's date
      const minDate = new Date(today);

      // Calculate min and max dates based on min_days and max_days
      minDate.setDate(today.getDate() - this.searchForm!.get('min_days')?.value);
      const minEpoch = Math.floor(minDate.getTime() / 1000); // Convert to seconds
      where.repair={some:{allocate_dt:{
        gte: minEpoch, // Greater than or equal to minEpoch
       }}}
       cond_counter++;

    }
    else if(this.searchForm!.get('max_days')?.value)
    {
      if(!where.repair)where.repair={};
      const today = new Date(); // Today's date
      const maxDate = new Date(today);

      // Calculate min and max dates based on min_days and max_days
      maxDate.setDate(today.getDate() - this.searchForm!.get('max_days')?.value);
      const maxEpoch = Math.floor(maxDate.getTime() / 1000); // Convert to seconds
      where.repair={some:{allocate_dt:{
        lte: maxEpoch, // Less than or equal to maxEpoch
       }}}
       cond_counter++;
    }

    if (this.searchForm!.get('eir_no')?.value) {

      var cond: any = { some: { eir_no: { contains: this.searchForm!.get('eir_no')?.value } } };

     
        where.in_gate = cond;
     
      cond_counter++;
    }

    //var date: string = ` - ${Utility.convertDateToStr(new Date())}`;
    if (this.searchForm!.get('eir_dt_start')?.value && this.searchForm!.get('eir_dt_end')?.value) {
      var start_dt=new Date(this.searchForm!.value['eir_dt_start']);
      var end_dt=new Date(this.searchForm!.value['eir_dt_start']);
      var cond: any = { some: { eir_dt: { gte: Utility.convertDate(start_dt), lte: Utility.convertDate(end_dt, true) } } };
    //  date = `${Utility.convertDateToStr(new Date(this.searchForm!.get('eir_dt_start')?.value))} - ${Utility.convertDateToStr(new Date(this.searchForm!.get('eir_dt_end')?.value))}`;
      
        where.in_gate = {};
        where.in_gate = cond;
      
      cond_counter++;
      
    }

    if (this.searchForm!.get('cln_dt_start')?.value && this.searchForm!.get('cln_dt_end')?.value) {
      var start_dt=new Date(this.searchForm!.value['cln_dt_start']);
      var end_dt=new Date(this.searchForm!.value['cln_dt_end']);
      var cond: any = { some: { complete_dt: { gte: Utility.convertDate(start_dt), lte: Utility.convertDate(end_dt, true) } } };
    //  date = `${Utility.convertDateToStr(new Date(this.searchForm!.get('eir_dt_start')?.value))} - ${Utility.convertDateToStr(new Date(this.searchForm!.get('eir_dt_end')?.value))}`;
      
        where.cleaning = {};
        where.cleaning = cond;
      
      cond_counter++;
      
    }

    if (this.searchForm!.get('rep_type')?.value) {
     
        
        where.purpose_repair_cv ={in:this.searchForm!.get('rep_type')?.value};
      
      cond_counter++;
      
    }


    // if (this.searchForm!.get('last_cargo')?.value) {
    //   where.tariff_cleaning = { guid: { eq: this.searchForm!.get('last_cargo')?.value.guid } };
    //   cond_counter++
    // }
    this.noCond = (cond_counter === 0);
    if (this.noCond) return;

    this.lastSearchCriteria = this.stmDS.addDeleteDtCriteria(where);
    this.performSearch(this.pageSize, this.pageIndex, this.pageSize, undefined, undefined, undefined, report_type, queryType);
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, report_type?: number, queryType?: number) {

    // if(queryType==1)
    // {
    this.subs.sink = this.sotDS.searchStoringOrderTanksRepairOutstandingReport(this.lastSearchCriteria)
      .subscribe(data => {
        this.sotList = data;
        this.endCursor = this.stmDS.pageInfo?.endCursor;
        this.startCursor = this.stmDS.pageInfo?.startCursor;
        this.hasNextPage = this.stmDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPage = this.stmDS.pageInfo?.hasPreviousPage ?? false;
        this.onExportDetail(this.sotList);
        //this.ProcessReportCustomerTankActivity(invType!, date!, report_type!, queryType!);
        //this.checkInvoicedAndGetTotalCost();
        //this.checkInvoiced();
        //this.distinctCustomerCodes= [... new Set(this.sotList.map(item=>item.storing_order?.customer_company?.code))];
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
      eir_dt_start: '',
      eir_dt_end: '',
      cln_dt_start: '',
      cln_dt_end: '',
      rep_type: '',
      min_days:'',
      max_day:''
    });
    this.customerCodeControl.reset('');
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



  

  onExportDetail(sot: StoringOrderTankItem[]) {
    //this.preventDefault(event);
    let cut_off_dt = new Date();

    if(sot?.length<=0) return;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(PendingEstimateReportPdfComponent, {
      width: '85vw',
      maxWidth:'1000px',
      maxHeight: '80vh',
      data: {
        sot: sot
      },
      // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {

    });
  }

  onExportSummary(repCustomerTankActivity: report_customer_tank_activity[], invType: string, date: string, queryType: number) {
    //this.preventDefault(event);
    let cut_off_dt = new Date();


    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(YardSummaryPdfComponent, {
      width: '850px',
      // height: '80vh',
      data: {
        report_customer_tank_activity: repCustomerTankActivity,
        type: invType,
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