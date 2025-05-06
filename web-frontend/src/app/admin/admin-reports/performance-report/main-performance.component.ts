import { Direction } from '@angular/cdk/bidi';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { Apollo } from 'apollo-angular';
import { CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyItem } from 'app/data-sources/customer-company';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { Utility } from 'app/utilities/utility';
//import { CancelFormDialogComponent } from './dialogs/cancel-form-dialog1/form-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { CleaningMethodItem } from 'app/data-sources/cleaning-method';
import { InGateCleaningItem } from 'app/data-sources/in-gate-cleaning';
import { JobOrderItem } from 'app/data-sources/job-order';
import { RepairItem } from 'app/data-sources/repair';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { CleaningPerformanceReportComponent } from './cleaning/cleaning-performance-report.component';
import { SteamPerformanceReportComponent } from './steam/steam-performance-report.component';
import { SurveyorPerformanceReportComponent } from './surveyor/surveyor-performance-report.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';

@Component({
  selector: 'app-performance-team',
  standalone: true,
  templateUrl: './main-performance.component.html',
  styleUrl: './main-performance.component.scss',
  imports: [
    BreadcrumbComponent,
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
    MatCardModule,
    MatTabsModule,
    SteamPerformanceReportComponent,
    SurveyorPerformanceReportComponent,
    CleaningPerformanceReportComponent
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class MainPerformanceComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  // @ViewChild(BayOverviewComponent) bayOverviewComponent!: BayOverviewComponent;
  // displayedColumns = [
  //   'tank_no',
  //   'customer',
  //   'eir_no',
  //   'eir_dt',
  //   'last_cargo',
  //   'tank_status_cv'
  // ];

  displayedColumnsRepair = [
    'tank_no',
    'customer',
    'eir_no',
    'eir_dt',
    'last_cargo',
    'method',
    'status_cv',
    'actions'
  ];

  displayedColumnsJobOrder = [
    'tank_no',
    'job_order_no',
    'customer',
    'estimate_no',
    'status_cv'
  ];

  pageTitle = 'MENUITEMS.ADMIN-REPORTS.LIST.PERFORMANCE-REPORTS'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.ADMIN-REPORTS.TEXT', route: '/admin/admin-reports/main-performance-report' }
  ]

  translatedLangText: any = {};
  langText = {

    CONFIRM_CLEAR_ALL: 'COMMON-FORM.CONFIRM-CLEAR-ALL',
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    AMEND: 'COMMON-FORM.AMEND',
    CHANGE_REQUEST: 'COMMON-FORM.CHANGE-REQUEST',
    REPAIR_EST_TAB_TITLE: 'COMMON-FORM.JOB-ALLOCATION',
    JOB_ORDER_TAB_TITLE: 'COMMON-FORM.JOBS',
    JOB_ORDER_NO: 'COMMON-FORM.JOB-ORDER-NO',
    METHOD: "COMMON-FORM.METHOD",
    QC: 'COMMON-FORM.QC',
    BAY_OVERVIEW: "COMMON-FORM.BAY-OVERVIEW",
    CLEANER: "COMMON-FORM.CLEANER",
    STEAM: "COMMON-FORM.STEAM",
    SURVEYOR: "COMMON-FORM.SURVEYOR",
    CLEANING_BILLING: "MENUITEMS.BILLING.LIST.CLEANING-BILL",
    SURVEYOR_PERFORMANCE_REPORT: "COMMON-FORM.SURVEYOR-PERFORMANCE-REPORT",
    CLEANING_PERFORMANCE_REPORT: "COMMON-FORM.CLEANING-PERFORMANCE-REPORT",
    STEAMING_PERFORMANCE_REPORT: "COMMON-FORM.STEAMING-PERFORMANCE-REPORT",

  }

  filterCleanForm?: UntypedFormGroup;
  filterJobOrderForm?: UntypedFormGroup;



  availableProcessStatus: string[] = [
    'APPROVED',
    'JOB_IN_PROGRESS',
    'COMPLETED',
    'ASSIGNED',
    'NO_ACTION',
    'CANCELED'
  ]

  cleanMethodList: CleaningMethodItem[] = [];
  clnEstList: InGateCleaningItem[] = [];
  jobOrderList: JobOrderItem[] = [];
  soStatusCvList: CodeValuesItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  processStatusCvList: CodeValuesItem[] = [];

  customerCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  customer_companyList?: CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];

  pageIndexClean = 0;
  pageSizeClean = 10;
  lastSearchCriteriaClean: any;
  lastOrderByClean: any = { create_dt: "ASC" };
  endCursorClean: string | undefined = undefined;
  startCursorClean: string | undefined = undefined;
  hasNextPageClean = false;
  hasPreviousPageClean = false;
  previous_endCursorClean: string | undefined = undefined;

  pageIndexJobOrder = 0;
  pageSizeJobOrder = 10;
  lastSearchCriteriaJobOrder: any;
  lastOrderByJobOrder: any = { job_order_no: "DESC" };
  endCursorJobOrder: string | undefined = undefined;
  startCursorJobOrder: string | undefined = undefined;
  hasNextPageJobOrder = false;
  hasPreviousPageJobOrder = false;
  previous_endCursorJobOrder: string | undefined = undefined;
  showBayOverview = true;
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
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    // this.initializeFilterCustomerCompany();
    // this.loadData();
  }

  refresh() {
    this.refreshTable();
  }

  initSearchForm() {
    this.filterCleanForm = this.fb.group({
      filterClean: [''],
      cleanMethod: [''],
      status_cv: [['APPROVED', 'ASSIGNED']],
      customer: [''],
    });
    this.filterJobOrderForm = this.fb.group({
      filterJobOrder: [''],
    });
  }

  cancelItem(row: StoringOrderItem) {
    // this.id = row.id;
    this.cancelSelectedRows([row])
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  cancelSelectedRows(row: StoringOrderItem[]) {

  }

  public loadData() {

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

  onFilterCleaning() {


  }

  onFilterJobOrder() {
    const where: any = {
      job_type_cv: { eq: "REPAIR" }
    };


  }

  performSearchClean(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, callback?: () => void) {

  }

  performSearchJobOrder(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, callback?: () => void) {

  }


  onPageEventClean(event: PageEvent) {
    const { pageIndex, pageSize, previousPageIndex } = event;
    let first: number | undefined = undefined;
    let after: string | undefined = undefined;
    let last: number | undefined = undefined;
    let before: string | undefined = undefined;
    // let order:any|undefined=this.lastOrderBy;
    // Check if the page size has changed
    if (this.pageSizeClean !== pageSize) {
      // Reset pagination if page size has changed
      this.pageIndexClean = 0;
      this.pageSizeClean = pageSize;
      first = pageSize;
      after = undefined;
      last = undefined;
      before = undefined;
    } else {
      //if (pageIndex > this.pageIndex && this.hasNextPage) {
      if (pageIndex > this.pageIndexClean) {
        // Navigate forward
        first = pageSize;
        after = this.endCursorClean;
      } else if (pageIndex < this.pageIndexClean && this.hasPreviousPageClean) {
        // Navigate backward
        last = pageSize;
        before = this.startCursorClean;
      }
      else if (pageIndex == this.pageIndexClean) {

        first = pageSize;
        after = this.previous_endCursorClean;


        //this.paginator.pageIndex=this.pageIndex;

      }
    }

    this.performSearchClean(pageSize, pageIndex, first, after, last, before, () => { });
  }

  onPageEventClean1(event: PageEvent) {
    const { pageIndex, pageSize } = event;
    let first: number | undefined = undefined;
    let after: string | undefined = undefined;
    let last: number | undefined = undefined;
    let before: string | undefined = undefined;

    // Check if the page size has changed
    if (this.pageSizeClean !== pageSize) {
      // Reset pagination if page size has changed
      this.pageIndexClean = 0;
      first = pageSize;
      after = undefined;
      last = undefined;
      before = undefined;
    } else {
      if (pageIndex > this.pageIndexClean && this.hasNextPageClean) {
        // Navigate forward
        first = pageSize;
        after = this.endCursorClean;
      } else if (pageIndex < this.pageIndexClean && this.hasPreviousPageClean) {
        // Navigate backward
        last = pageSize;
        before = this.startCursorClean;
      }
    }

    this.performSearchClean(pageSize, pageIndex, first, after, last, before, () => { });
  }

  onPageEventJobOrder(event: PageEvent) {
    const { pageIndex, pageSize, previousPageIndex } = event;
    let first: number | undefined = undefined;
    let after: string | undefined = undefined;
    let last: number | undefined = undefined;
    let before: string | undefined = undefined;
    // let order:any|undefined=this.lastOrderBy;
    // Check if the page size has changed
    if (this.pageSizeClean !== pageSize) {
      // Reset pagination if page size has changed
      this.pageIndexClean = 0;
      this.pageSizeClean = pageSize;
      first = pageSize;
      after = undefined;
      last = undefined;
      before = undefined;
    } else {
      //if (pageIndex > this.pageIndex && this.hasNextPage) {
      if (pageIndex > this.pageIndexJobOrder) {
        // Navigate forward
        first = pageSize;
        after = this.endCursorJobOrder;
      } else if (pageIndex < this.pageIndexJobOrder && this.hasPreviousPageJobOrder) {
        // Navigate backward
        last = pageSize;
        before = this.startCursorJobOrder;
      }
      else if (pageIndex == this.pageIndexJobOrder) {

        first = pageSize;
        after = this.previous_endCursorJobOrder;


        //this.paginator.pageIndex=this.pageIndex;

      }
    }

    this.performSearchJobOrder(pageSize, pageIndex, first, after, last, before, () => { });
  }

  onPageEventJobOrder1(event: PageEvent) {
    const { pageIndex, pageSize } = event;
    let first: number | undefined = undefined;
    let after: string | undefined = undefined;
    let last: number | undefined = undefined;
    let before: string | undefined = undefined;

    // Check if the page size has changed
    if (this.pageSizeJobOrder !== pageSize) {
      // Reset pagination if page size has changed
      this.pageIndexJobOrder = 0;
      first = pageSize;
      after = undefined;
      last = undefined;
      before = undefined;
    } else {
      if (pageIndex > this.pageIndexJobOrder && this.hasNextPageJobOrder) {
        // Navigate forward
        first = pageSize;
        after = this.endCursorJobOrder;
      } else if (pageIndex < this.pageIndexJobOrder && this.hasPreviousPageJobOrder) {
        // Navigate backward
        last = pageSize;
        before = this.startCursorJobOrder;
      }
    }

    this.performSearchJobOrder(pageSize, pageIndex, first, after, last, before, () => { });
  }

  // mergeCriteria(criteria: any) {
  //   return {
  //     and: [
  //       { delete_dt: { eq: null } },
  //       criteria
  //     ]
  //   };
  // }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
  }

  displayCleanMethodFn(cm: CleaningMethodItem): string {
    return cm ? `${cm.description} ` : '';
  }
  initializeFilterCustomerCompany() {

  }



  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }



  calculateNetCost(repair: RepairItem): any {

    return undefined;
  }

  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
  }

  updateValidators(validOptions: any[]) {
    this.lastCargoControl.setValidators([
      Validators.required,
      AutocompleteSelectionValidator(validOptions)
    ]);
  }

  displayDate(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input);
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
        headerText: this.translatedLangText.CONFIRM_RESET,
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
    this.filterCleanForm?.patchValue({
      filterRepair: '',
      cleanMethod: ''
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

  displayTankStatus(status: string): string {
    var retval: string = "-";

    retval = this.processStatusCvList!
      .filter(item => item.code_val === status)
      .map(item => item.description)[0]!; // Returns the description of the first match

    if (retval === "") retval = "-"
    return retval;
  }

  popupDialogForm(row: InGateCleaningItem, action: string) {


  }

  toggleJobState(event: Event, isStarted: boolean | undefined, jobOrderItem: JobOrderItem) {

  }

  completeJob(jobOrderItem: JobOrderItem) {


  }

  UpdateCleaningStatusInProgress(clean_guid: string) {


  }

  UpdateCleaningStatusCompleted(clean_guid: string) {



  }



  isStarted(cleanItem: InGateCleaningItem | undefined) {

    if (cleanItem?.job_order) {
      let jobOrderItem = cleanItem?.job_order;
      return jobOrderItem?.time_table?.some(x => x?.start_time && !x?.stop_time);
    }
    return false;


  }

  canStartJob(cleanItem: InGateCleaningItem | undefined) {
    return false;

  }

  canCompleteJob(jobOrderItem: JobOrderItem | undefined, isStarted: boolean | undefined): boolean {
    return false; //this.joDS.canCompleteJob(jobOrderItem) && !isStarted;
  }

  canShowAction(cleanItem: InGateCleaningItem) {
    return cleanItem.status_cv == 'JOB_IN_PROGRESS';


  }

  sortList(itemList: any[]) {
    itemList.sort((a: any, b: any) => {
      const numA = parseInt(a.description.replace(/[^\d]/g, ""), 10); // Remove all non-digit characters
      const numB = parseInt(b.description.replace(/[^\d]/g, ""), 10); // Remove all non-digit characters
      return numA - numB;
    });
  }

  refreshBayOverview(): void {
    this.showBayOverview = false;
    setTimeout(() => {
      this.showBayOverview = true;
    }, 0);
  }

  onRefreshMainTab() {
    // Logic to refresh the content of the main tab
    console.log('Refreshing main tab content...');
    this.onPageEventClean({ pageIndex: this.pageIndexClean, pageSize: this.pageSizeClean, length: this.pageSizeClean });
  }

  @ViewChild('cleanPerformRep') cleanPerformRep!: CleaningPerformanceReportComponent;
  @ViewChild('steamPerformRep') steamPerformRep!: SteamPerformanceReportComponent;
  @ViewChild('surveyorPerformRep') surveyorPerformRep!: SurveyorPerformanceReportComponent;

  onTabSelected(event: MatTabChangeEvent): void {
    console.log(`Selected Index: ${event.index}, Tab Label: ${event.tab.textLabel}`);
    switch (event.index) {
      case 0:
        this.cleanPerformRep?.onTabFocused(); break;
      case 1:
        this.steamPerformRep?.onTabFocused(); break;
      case 2:
        this.surveyorPerformRep?.onTabFocused(); break;
    }
  }
}