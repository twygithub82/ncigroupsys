import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { NgClass, DatePipe, formatDate, CommonModule } from '@angular/common';
import { NgScrollbar } from 'ngx-scrollbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { UnsubscribeOnDestroyAdapter, TableElement, TableExportUtil } from '@shared';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { map, filter, tap, catchError, finalize, switchMap, debounceTime, startWith } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { Utility } from 'app/utilities/utility';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoringOrderDS, StoringOrderGO, StoringOrderItem } from 'app/data-sources/storing-order';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem, addDefaultSelectOption } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from '@angular/material/divider';
import { CancelFormDialogComponent } from './dialogs/cancel-form-dialog/form-dialog.component';
import { ComponentUtil } from 'app/utilities/component-util';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { InGateDS } from 'app/data-sources/in-gate';
import { MatCardModule } from '@angular/material/card';
import { RepairDS, RepairItem } from 'app/data-sources/repair';
import { MatTabsModule } from '@angular/material/tabs';
import { JobOrderDS, JobOrderGO, JobOrderItem } from 'app/data-sources/job-order';
import { TimeTableDS, TimeTableItem } from 'app/data-sources/time-table';
import { JobOrderQCComponent } from "../../repair/job-order-qc/job-order-qc.component";
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { JobOrderTaskComponent } from "../../repair/job-order-task/job-order-task.component";

@Component({
  selector: 'app-job-order',
  standalone: true,
  templateUrl: './job-order.component.html',
  styleUrl: './job-order.component.scss',
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
    MatCardModule,
    MatTabsModule,
    JobOrderQCComponent,
    MatBadgeModule,
    MatButtonToggleModule,
    JobOrderTaskComponent
  ]
})
export class JobOrderComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  displayedColumnsRepair = [
    'tank_no',
    'customer',
    'estimate_no',
    'allocate_dt',
    'status_cv'
  ];

  pageTitle = 'MENUITEMS.REPAIR.LIST.JOB-ORDER'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT'
  ]

  translatedLangText: any = {};
  langText = {
    STATUS: 'COMMON-FORM.STATUS',
    SO_NO: 'COMMON-FORM.SO-NO',
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
    EIR_DATE: 'COMMON-FORM.EIR-DATE',
    EIR_NO: 'COMMON-FORM.EIR-NO',
    PART_NAME: 'COMMON-FORM.PART-NAME',
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
    ADD: 'COMMON-FORM.ADD',
    REFRESH: 'COMMON-FORM.REFRESH',
    EXPORT: 'COMMON-FORM.EXPORT',
    REMARKS: 'COMMON-FORM.REMARKS',
    SO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    INVALID_SELECTION: 'COMMON-FORM.INVALID-SELECTION',
    ACCEPTED: 'COMMON-FORM.ACCEPTED',
    WAITING: 'COMMON-FORM.WAITING',
    CANCELED: 'COMMON-FORM.CANCELED',
    TANKS: 'COMMON-FORM.TANKS',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    BILL_COMPLETED: 'COMMON-FORM.BILL-COMPLETED',
    REPAIR_JOB_NO: 'COMMON-FORM.REPAIR-JOB-NO',
    REPAIR_TYPE: 'COMMON-FORM.REPAIR-TYPE',
    ESTIMATE_DATE: 'COMMON-FORM.ESTIMATE-DATE',
    APPROVAL_DATE: 'COMMON-FORM.APPROVAL-DATE',
    ESTIMATE_STATUS: 'COMMON-FORM.ESTIMATE-STATUS',
    CURRENT_STATUS: 'COMMON-FORM.CURRENT-STATUS',
    ESTIMATE_NO: 'COMMON-FORM.ESTIMATE-NO',
    NET_COST: 'COMMON-FORM.NET-COST',
    CONFIRM_CLEAR_ALL: 'COMMON-FORM.CONFIRM-CLEAR-ALL',
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    AMEND: 'COMMON-FORM.AMEND',
    CHANGE_REQUEST: 'COMMON-FORM.CHANGE-REQUEST',
    REPAIR_EST_TAB_TITLE: 'COMMON-FORM.JOB-ALLOCATION',
    JOB_ORDER_TAB_TITLE: 'COMMON-FORM.JOBS',
    QC: 'COMMON-FORM.QC',
    JOB_ORDER_NO: 'COMMON-FORM.JOB-ORDER-NO',
    ALLOCATE_DATE: 'COMMON-FORM.ALLOCATE-DATE'
  }

  filterRepairForm?: UntypedFormGroup;

  cvDS: CodeValuesDS;
  soDS: StoringOrderDS;
  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  repairDS: RepairDS;
  joDS: JobOrderDS;
  ttDS: TimeTableDS;

  repEstList: RepairItem[] = [];
  jobOrderList: JobOrderItem[] = [];
  soStatusCvList: CodeValuesItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  jobStatusCvList: CodeValuesItem[] = [];
  processStatusCvList: CodeValuesItem[] = [];

  availableProcessStatus: string[] = [
    'APPROVED',
    'JOB_IN_PROGRESS',
    'COMPLETED'
  ]

  customerCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  customer_companyList?: CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];

  pageIndexRepair = 0;
  pageSizeRepair = 10;
  lastSearchCriteriaRepair: any;
  lastOrderByRepair: any = { estimate_no: "DESC" };
  endCursorRepair: string | undefined = undefined;
  startCursorRepair: string | undefined = undefined;
  hasNextPageRepair = false;
  hasPreviousPageRepair = false;

  jobOrderStartedCount = 0;
  private jobOrderSubscriptions: Subscription[] = [];

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
    this.lastCargoControl = new UntypedFormControl('', [Validators.required, AutocompleteSelectionValidator(this.last_cargoList)]);
    this.soDS = new StoringOrderDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.repairDS = new RepairDS(this.apollo);
    this.joDS = new JobOrderDS(this.apollo);
    this.ttDS = new TimeTableDS(this.apollo);
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

  override ngOnDestroy() {
    this.jobOrderSubscriptions.forEach((sub) => sub.unsubscribe());
  }

  refresh() {
    this.refreshTable();
  }

  initSearchForm() {
    this.filterRepairForm = this.fb.group({
      filterRepair: [''],
      status_cv: [['APPROVED']],
      customer: this.customerCodeControl,
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
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(CancelFormDialogComponent, {
      data: {
        item: [...row],
        langText: this.langText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const so = result.item.map((item: StoringOrderItem) => new StoringOrderGO(item));
        this.soDS.cancelStoringOrder(so).subscribe(result => {
          if ((result?.data?.cancelStoringOrder ?? 0) > 0) {
            let successMsg = this.langText.CANCELED_SUCCESS;
            this.translate.get(this.langText.CANCELED_SUCCESS).subscribe((res: string) => {
              successMsg = res;
              ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
              this.refreshTable();
            });
          }
        });
      }
    });
  }

  public loadData() {
    this.onFilterRepair();

    const queries = [
      { alias: 'soStatusCv', codeValType: 'SO_STATUS' },
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
      { alias: 'jobStatusCv', codeValType: 'JOB_STATUS' },
      { alias: 'processStatusCv', codeValType: 'PROCESS_STATUS' }
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('soStatusCv').subscribe(data => {
      this.soStatusCvList = addDefaultSelectOption(data, 'All');
    });
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      this.purposeOptionCvList = data;
    });
    this.cvDS.connectAlias('tankStatusCv').subscribe(data => {
      this.tankStatusCvList = data;
    });
    this.cvDS.connectAlias('jobStatusCv').subscribe(data => {
      this.jobStatusCvList = data;
    });
    this.cvDS.connectAlias('processStatusCv').subscribe(data => {
      this.processStatusCvList = data;
    });
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

  onFilterRepair() {
    const where: any = {
    };

    if (this.filterRepairForm!.get('filterRepair')?.value) {
      where.or = [
        { storing_order_tank: { tank_no: { contains: this.filterRepairForm!.get('filterRepair')?.value } } },
        { estimate_no: { contains: this.filterRepairForm!.get('filterRepair')?.value } }
      ];
    }

    if (this.filterRepairForm!.get('status_cv')?.value) {
      where.status_cv = { in: this.filterRepairForm!.get('status_cv')?.value };
    }

    this.lastSearchCriteriaRepair = this.repairDS.addDeleteDtCriteria(where);
    this.performSearchRepair(this.pageSizeRepair, this.pageIndexRepair, this.pageSizeRepair, undefined, undefined, undefined, () => { });
  }

  performSearchRepair(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, callback?: () => void) {
    this.subs.sink = this.repairDS.searchRepair(this.lastSearchCriteriaRepair, this.lastOrderByRepair, first, after, last, before)
      .subscribe(data => {
        this.repEstList = data.map(re => {
          return { ...re, net_cost: this.calculateNetCost(re) }
        });
        this.endCursorRepair = this.repairDS.pageInfo?.endCursor;
        this.startCursorRepair = this.repairDS.pageInfo?.startCursor;
        this.hasNextPageRepair = this.repairDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPageRepair = this.repairDS.pageInfo?.hasPreviousPage ?? false;
      });

    this.pageSizeRepair = pageSize;
    this.pageIndexRepair = pageIndex;
  }

  onPageEventRepair(event: PageEvent) {
    const { pageIndex, pageSize } = event;
    let first: number | undefined = undefined;
    let after: string | undefined = undefined;
    let last: number | undefined = undefined;
    let before: string | undefined = undefined;

    // Check if the page size has changed
    if (this.pageSizeRepair !== pageSize) {
      // Reset pagination if page size has changed
      this.pageIndexRepair = 0;
      first = pageSize;
      after = undefined;
      last = undefined;
      before = undefined;
    } else {
      if (pageIndex > this.pageIndexRepair && this.hasNextPageRepair) {
        // Navigate forward
        first = pageSize;
        after = this.endCursorRepair;
      } else if (pageIndex < this.pageIndexRepair && this.hasPreviousPageRepair) {
        // Navigate backward
        last = pageSize;
        before = this.startCursorRepair;
      }
    }

    this.performSearchRepair(pageSize, pageIndex, first, after, last, before, () => { });
  }

  private subscribeToJobOrderEvent(
    subscribeFn: (guid: string) => Observable<any>,
    job_order_guid: string
  ) {
    const subscription = subscribeFn(job_order_guid).subscribe({
      next: (response) => {
        console.log('Received data:', response);
        const data = response.data

        let jobData: any;
        let eventType: any;

        if (data?.onJobStopped) {
          jobData = data.onJobStopped;
          eventType = 'jobStopped';
        } else if (data?.onJobStarted) {
          jobData = data.onJobStarted;
          eventType = 'jobStarted';
        }

        if (jobData) {
          const foundJob = this.jobOrderList.filter(x => x.guid === jobData.job_order_guid);
          if (foundJob?.length) {
            foundJob[0].status_cv = jobData.job_status;
            foundJob[0].start_dt = foundJob[0].start_dt ?? jobData.start_time;
            foundJob[0].time_table ??= [];

            if (eventType === 'jobStarted') {
              const foundTimeTable = foundJob[0].time_table?.filter(x => x.guid === jobData.time_table_guid);
              if (foundTimeTable?.length) {
                foundTimeTable[0].start_time = jobData.start_time
              } else {
                foundJob[0].time_table?.push(new TimeTableItem({ guid: jobData.time_table_guid, start_time: jobData.start_time, stop_time: jobData.stop_time, job_order_guid: jobData.job_order_guid }))
              }
            } else if (eventType === 'jobStopped') {
              foundJob[0].time_table = foundJob[0].time_table?.filter(x => x.guid !== jobData.time_table_guid);
            }
            console.log(`Updated JobOrder ${eventType} :`, foundJob[0]);
          }
        }
      },
      error: (error) => {
        console.error('Error:', error);
      },
      complete: () => {
        console.log('Subscription completed');
      }
    });

    this.jobOrderSubscriptions.push(subscription);
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
  }

  initializeValueChanges() {
    this.filterRepairForm!.get('customer')!.valueChanges.pipe(
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
        });
      })
    ).subscribe();
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  getTankStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.tankStatusCvList);
  }

  getJobStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.jobStatusCvList);
  }

  getProcessStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.processStatusCvList);
  }

  calculateNetCost(repair: RepairItem): any {
    const total = this.repairDS.getTotal(repair?.repair_part)
    const labourDiscount = repair.labour_cost_discount;
    const matDiscount = repair.material_cost_discount;

    const total_hour = total.hour;
    const total_labour_cost = this.repairDS.getTotalLabourCost(total_hour, repair?.labour_cost);
    const total_mat_cost = total.total_mat_cost;
    const total_cost = repair?.total_cost;
    const discount_labour_cost = this.repairDS.getDiscountCost(labourDiscount, total_labour_cost);
    const discount_mat_cost = this.repairDS.getDiscountCost(matDiscount, total_mat_cost);
    const net_cost = this.repairDS.getNetCost(total_cost, discount_labour_cost, discount_mat_cost);
    return net_cost.toFixed(2);
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
    this.filterRepairForm?.patchValue({
      filterRepair: '',
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

  isStarted(jobOrderItem: JobOrderItem | undefined) {
    return jobOrderItem?.time_table?.some(x => x?.start_time && !x?.stop_time);
  }

  canStartJob(jobOrderItem: JobOrderItem | undefined) {
    return this.joDS.canStartJob(jobOrderItem)
  }

  toggleJobState(event: Event, isStarted: boolean | undefined, jobOrderItem: JobOrderItem) {
    this.stopPropagation(event);  // Prevents the form submission
    if (!isStarted) {
      const param = [new TimeTableItem({ job_order_guid: jobOrderItem?.guid, job_order: new JobOrderGO({ ...jobOrderItem }) })];
      console.log(param)
      this.ttDS.startJobTimer(param).subscribe(result => {
        console.log(result)
      });
    } else {
      const found = jobOrderItem?.time_table?.filter(x => x?.start_time && !x?.stop_time);
      if (found?.length) {
        const newParam = new TimeTableItem(found[0]);
        newParam.stop_time = Utility.convertDate(new Date()) as number;
        newParam.job_order = new JobOrderGO({ ...jobOrderItem });
        const param = [newParam];
        console.log(param)
        this.ttDS.stopJobTimer(param).subscribe(result => {
          console.log(result)
        });
      }
    }
  }

  onCountChange(count: number) {
    this.jobOrderStartedCount = count;
  }
}