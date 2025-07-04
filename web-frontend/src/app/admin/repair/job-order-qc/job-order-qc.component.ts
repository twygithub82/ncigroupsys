import { Direction } from '@angular/cdk/bidi';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
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
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { JobOrderDS, JobOrderItem } from 'app/data-sources/job-order';
import { RepairDS, RepairItem } from 'app/data-sources/repair';
import { StoringOrderDS } from 'app/data-sources/storing-order';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { TimeTableDS } from 'app/data-sources/time-table';
import { SearchStateService } from 'app/services/search-criteria.service';
import { pageSizeInfo, Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { debounceTime, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'app-job-order-qc',
  standalone: true,
  templateUrl: './job-order-qc.component.html',
  styleUrl: './job-order-qc.component.scss',
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
    MatCardModule,
    MatTabsModule,
    MatButtonToggleModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class JobOrderQCComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumnsJobOrder = [
    'tank_no',
    'customer',
    'estimate_no',
    'complete_dt',
    'repair_type',
    'status_cv'
  ];

  translatedLangText: any = {};
  langText = {
    STATUS: 'COMMON-FORM.STATUS',
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
    LAST_CARGO: 'COMMON-FORM.LAST-CARGO',
    TANK_NO: 'COMMON-FORM.TANK-NO',
    JOB_NO: 'COMMON-FORM.JOB-NO',
    PURPOSE: 'COMMON-FORM.PURPOSE',
    NO_RESULT: 'COMMON-FORM.NO-RESULT',
    ARE_YOU_SURE_CANCEL: 'COMMON-FORM.ARE-YOU-SURE-CANCEL',
    CANCEL: 'COMMON-FORM.CANCEL',
    CLOSE: 'COMMON-FORM.CLOSE',
    TO_BE_CANCELED: 'COMMON-FORM.TO-BE-CANCELED',
    CANCELED_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    EXPORT: 'COMMON-FORM.EXPORT',
    REMARKS: 'COMMON-FORM.REMARKS',
    SO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    INVALID_SELECTION: 'COMMON-FORM.INVALID-SELECTION',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    ESTIMATE_DATE: 'COMMON-FORM.ESTIMATE-DATE',
    APPROVAL_DATE: 'COMMON-FORM.APPROVAL-DATE',
    ESTIMATE_STATUS: 'COMMON-FORM.ESTIMATE-STATUS',
    CURRENT_STATUS: 'COMMON-FORM.CURRENT-STATUS',
    ESTIMATE_NO: 'COMMON-FORM.ESTIMATE-NO',
    CONFIRM_CLEAR_ALL: 'COMMON-FORM.CONFIRM-CLEAR-ALL',
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    CHANGE_REQUEST: 'COMMON-FORM.CHANGE-REQUEST',
    JOB_ORDER_NO: 'COMMON-FORM.JOB-ORDER-NO',
    ALLOCATE_DATE: 'COMMON-FORM.ALLOCATE-DATE',
    APPROVE_DATE: 'COMMON-FORM.APPROVE-DATE',
    QC_DATE: 'COMMON-FORM.QC-DATE',
    REPAIR_TYPE: 'COMMON-FORM.REPAIR-TYPE',
    EIR_NO: 'COMMON-FORM.EIR-NO',
    EIR_DATE: 'COMMON-FORM.EIR-DATE',
    COMPLETE_DATE: 'COMMON-FORM.COMPLETE-DATE',
    SEARCH: 'COMMON-FORM.SEARCH',
  }

  filterJobOrderForm?: UntypedFormGroup;

  cvDS: CodeValuesDS;
  soDS: StoringOrderDS;
  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  repairDS: RepairDS;
  joDS: JobOrderDS;
  ttDS: TimeTableDS;

  sotList: StoringOrderTankItem[] = [];
  repEstList: RepairItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  repairOptionCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  jobStatusCvList: CodeValuesItem[] = [];
  processStatusCvList: CodeValuesItem[] = [];

  customerCodeControl = new UntypedFormControl();
  customer_companyList?: CustomerCompanyItem[];

  pageStateType = 'RepairQC'
  pageIndexJobOrder = 0;
  pageSizeJobOrder = pageSizeInfo.defaultSize;
  lastSearchCriteriaJobOrder: any;
  lastOrderByJobOrder: any = { create_dt: "DESC" };
  endCursorJobOrder: string | undefined = undefined;
  startCursorJobOrder: string | undefined = undefined;
  hasNextPageJobOrder = false;
  hasPreviousPageJobOrder = false;

  currentStartCursor: string | undefined = undefined;
  currentEndCursor: string | undefined = undefined;
  lastCursorDirection: string | undefined = undefined;

  availableProcessStatus: string[] = [
    'COMPLETED',
    'QC_COMPLETED',
  ]

  constructor(
    private route: ActivatedRoute,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private searchStateService: SearchStateService,
    private translate: TranslateService
  ) {
    super();
    this.translateLangText();
    this.initSearchForm();
    this.customerCodeControl = new UntypedFormControl('', [AutocompleteSelectionValidator(this.customer_companyList)]);
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
    this.searchStateService.clearOtherPagesKeys([this.pageStateType, 'RepairJobAllocation', 'RepairTask']);
    this.loadData();
  }

  initSearchForm() {
    this.filterJobOrderForm = this.fb.group({
      filterRepair: [''],
      jobStatusCv: [['COMPLETED']],
      customer: this.customerCodeControl,
      complete_dt_start: [''],
      complete_dt_end: [''],
      repairOptionCv: '',
      
    });
  }

  public loadData() {
    const queries = [
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'repairOptionCv', codeValType: 'REPAIR_OPTION' },
      { alias: 'jobStatusCv', codeValType: 'JOB_STATUS' },
      { alias: 'processStatusCv', codeValType: 'PROCESS_STATUS' }
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      this.purposeOptionCvList = data;
    });
    this.cvDS.connectAlias('repairOptionCv').subscribe(data => {
      this.repairOptionCvList = data;
    });
    this.cvDS.connectAlias('jobStatusCv').subscribe(data => {
      this.jobStatusCvList = data;
    });
    this.cvDS.connectAlias('processStatusCv').subscribe(data => {
      this.processStatusCvList = data;
    });

    // var actionId = this.route.snapshot.paramMap.get('id');
    // if (!actionId) {
    //   this.onFilter();
    // }
    // else if (actionId === 'pending') {

    //   const where: any = {
    //     and: [
    //       { storing_order_tank: { purpose_repair_cv: { in: ["OFFHIRE", "REPAIR"] } } },
    //       { storing_order_tank: { tank_status_cv: { eq: "REPAIR" } } },
    //       { status_cv: { in: ["COMPLETED"] } }
    //     ]
    //   };
    //   this.lastSearchCriteriaJobOrder = where;
    //   this.performSearch(this.pageSizeJobOrder, this.pageIndexJobOrder, this.pageSizeJobOrder, undefined, undefined, undefined, () => { });
    // }

    const savedCriteria = this.searchStateService.getCriteria(this.pageStateType);
    const savedPagination = this.searchStateService.getPagination(this.pageStateType);

    if (savedCriteria) {
      this.filterJobOrderForm?.patchValue(savedCriteria);
      this.constructSearchCriteria();
    }

    if (savedPagination) {
      this.pageIndexJobOrder = savedPagination.pageIndex;
      this.pageSizeJobOrder = savedPagination.pageSize;

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
      this.onFilter();
    }
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

  constructSearchCriteria() {
    const where: any = {};


    if (this.filterJobOrderForm!.get('filterRepair')?.value) {
      const tankNo = this.filterJobOrderForm!.get('filterRepair')?.value;
      where.or = [
        {
          storing_order_tank: {
            or: [
              { tank_no: { contains: Utility.formatContainerNumber(tankNo) } },
              { tank_no: { contains: Utility.formatTankNumberForSearch(tankNo) } }
            ]
          }
        },
        { repair_part: { some: { repair: { estimate_no: { contains: this.filterJobOrderForm!.get('filterRepair')?.value } } } } }
      ];
    }

    if (this.customerCodeControl?.value) {
      const customer = this.customerCodeControl?.value;
      where.or = [
        { storing_order_tank: { storing_order: { customer_company_guid: { contains: customer.guid } } } }
      ];
    }

    if (this.filterJobOrderForm!.get('jobStatusCv')?.value?.length) {
      where.status_cv = {
        in: this.filterJobOrderForm!.get('jobStatusCv')?.value
      };
    }

    if (this.filterJobOrderForm!.get('repairOptionCv')?.value?.length) {
      const filterPurpose = this.filterJobOrderForm!.get('repairOptionCv')?.value
      where.storing_order_tank = where.storing_order_tank || {};
      where.storing_order_tank.purpose_repair_cv = { in: filterPurpose };
    }

    if (this.filterJobOrderForm!.get('complete_dt_start')?.value || this.filterJobOrderForm!.get('complete_dt_end')?.value) {
      const estDtStart = this.filterJobOrderForm?.get('complete_dt_start')?.value;
      const estDtEnd = this.filterJobOrderForm?.get('complete_dt_end')?.value;
      const today = new Date();

      // Check if `est_dt_start` is before today and `est_dt_end` is empty
      if (estDtStart && new Date(estDtStart) < today && !estDtEnd) {
        where.complete_dt = {
          gte: Utility.convertDate(estDtStart),
          lte: Utility.convertDate(today), // Set end date to today
        };
      } else if (estDtStart || estDtEnd) {
        // Handle general case where either or both dates are provided
        where.complete_dt = {
          gte: Utility.convertDate(estDtStart || today),
          lte: Utility.convertDate(estDtEnd || today),
        };
      }
      // where.complete_dt = { gte: Utility.convertDate(this.filterJobOrderForm!.get('complete_dt_start')?.value), lte: Utility.convertDate(this.filterJobOrderForm!.get('complete_dt_end')?.value, true) };
    }

    // TODO:: Get login user team
    // if (false) {
    //   where.team_guid = { eq: "" }
    // }

    this.lastSearchCriteriaJobOrder = this.joDS.addDeleteDtCriteria(where);
  }

  onFilter() {
    this.constructSearchCriteria();
    this.performSearch(this.pageSizeJobOrder, this.pageIndexJobOrder, this.pageSizeJobOrder, undefined, undefined, undefined, () => { });
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, callback?: () => void) {
    this.searchStateService.setCriteria(this.pageStateType, this.filterJobOrderForm?.value);
    this.searchStateService.setPagination(this.pageStateType, {
      pageSize,
      pageIndex,
      first,
      after,
      last,
      before
    });
    this.subs.sink = this.repairDS.getRepairForQC(this.lastSearchCriteriaJobOrder, this.lastOrderByJobOrder, first, after, last, before)
      .subscribe(data => {
        this.repEstList = data;
        // this.jobOrderList.forEach(jo => {
        //   this.subscribeToJobOrderEvent(this.joDS.subscribeToJobOrderStarted.bind(this.joDS), jo.guid!);
        //   this.subscribeToJobOrderEvent(this.joDS.subscribeToJobOrderStopped.bind(this.joDS), jo.guid!);
        // })

        this.endCursorJobOrder = this.repairDS.pageInfo?.endCursor;
        this.startCursorJobOrder = this.repairDS.pageInfo?.startCursor;
        this.hasNextPageJobOrder = this.repairDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPageJobOrder = this.repairDS.pageInfo?.hasPreviousPage ?? false;

        this.currentEndCursor = after;
        this.currentStartCursor = before;
      });

    this.pageSizeJobOrder = pageSize;
    this.pageIndexJobOrder = pageIndex;
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
    this.onFilter();
  }

  resetForm() {
    this.filterJobOrderForm?.patchValue({
      filterJobOrder: '',
      jobStatusCv: ['COMPLETED'],
      filterRepair: '',
      repairOptionCv: [],
      complete_dt_start: '',
      complete_dt_end: ''
    });
    this.customerCodeControl.reset();
  }

  onPageEvent(event: PageEvent) {
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
        this.lastCursorDirection = 'forward';
        first = pageSize;
        after = this.endCursorJobOrder;
      } else if (pageIndex < this.pageIndexJobOrder && this.hasPreviousPageJobOrder) {
        // Navigate backward
        this.lastCursorDirection = 'backward';
        last = pageSize;
        before = this.startCursorJobOrder;
      }
    }

    this.performSearch(pageSize, pageIndex, first, after, last, before, () => { });
  }

  triggerCurrentSearch() {
    let first: number | undefined = undefined;
    let after: string | undefined = undefined;
    let last: number | undefined = undefined;
    let before: string | undefined = undefined;

    if (this.pageSizeJobOrder === 0) {
      first = this.pageSizeJobOrder;
    } else if (this.lastCursorDirection === 'forward') {
      first = this.pageSizeJobOrder;
      after = this.currentEndCursor;
    } else if (this.lastCursorDirection === 'backward') {
      last = this.pageSizeJobOrder;
      before = this.currentStartCursor;
    }

    // Perform the search
    this.performSearch(
      this.pageSizeJobOrder,
      this.pageIndexJobOrder,
      first,
      after,
      last,
      before,
      () => { }
    );
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} - ${cc.name}` : '';
  }

  initializeValueChanges() {
    this.customerCodeControl!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (typeof value === 'string') {
          searchCriteria = value;
        } else {
          searchCriteria = value?.code || '';
        }
        this.subs.sink = this.ccDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
          this.customer_companyList = data
          this.updateValidators(this.customer_companyList);
        });
      })
    ).subscribe();
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  getRepairOptionStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.repairOptionCvList);
  }

  getJobStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.jobStatusCvList);
  }

  getProcessStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.processStatusCvList);
  }

  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
  }

  displayDate(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input);
  }

  filterDeleted(resultList: any[] | undefined): any {
    return (resultList || []).filter((row: any) => !row.delete_dt);
  }

  canStartJob(jobOrderItem: JobOrderItem | undefined) {
    return this.joDS.canStartJob(jobOrderItem)
  }

  canCompleteJob(jobOrderItem: JobOrderItem | undefined): boolean {
    return this.joDS.canCompleteJob(jobOrderItem);
  }

  isSelectedJobStatus(value: string): boolean {
    return this.filterJobOrderForm?.get('jobStatusCv')?.value.includes(value);
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

  updateValidators(validOptions: any[]) {
    this.customerCodeControl.setValidators([
      AutocompleteSelectionValidator(validOptions)
    ]);
  }

  onTabFocused() {
    this.resetForm();
    this.onFilter();
  }

  // private subscribeToJobOrderEvent(
  //   subscribeFn: (guid: string) => Observable<any>,
  //   job_order_guid: string
  // ) {
  //   const subscription = subscribeFn(job_order_guid).subscribe({
  //     next: (response) => {
  //       console.log('Received data:', response);
  //       const data = response.data

  //       let jobData: any;
  //       let eventType: any;

  //       if (data?.onJobStopped) {
  //         jobData = data.onJobStopped;
  //         eventType = 'jobStopped';
  //       } else if (data?.onJobStarted) {
  //         jobData = data.onJobStarted;
  //         eventType = 'jobStarted';
  //       }

  //       if (jobData) {
  //         const foundJob = this.jobOrderList.filter(x => x.guid === jobData.job_order_guid);
  //         if (foundJob?.length) {
  //           foundJob[0].status_cv = jobData.job_status;
  //           foundJob[0].start_dt = foundJob[0].start_dt ?? jobData.start_time;
  //           foundJob[0].time_table ??= [];

  //           if (eventType === 'jobStarted') {
  //             const foundTimeTable = foundJob[0].time_table?.filter(x => x.guid === jobData.time_table_guid);
  //             if (foundTimeTable?.length) {
  //               foundTimeTable[0].start_time = jobData.start_time
  //             } else {
  //               foundJob[0].time_table?.push(new TimeTableItem({ guid: jobData.time_table_guid, start_time: jobData.start_time, stop_time: jobData.stop_time, job_order_guid: jobData.job_order_guid }))
  //             }
  //           } else if (eventType === 'jobStopped') {
  //             foundJob[0].time_table = foundJob[0].time_table?.filter(x => x.guid !== jobData.time_table_guid);
  //           }
  //           console.log(`Updated JobOrder ${eventType} :`, foundJob[0]);
  //         }
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error:', error);
  //     },
  //     complete: () => {
  //       console.log('Subscription completed');
  //     }
  //   });

  //   this.jobOrderSubscriptions.push(subscription);
  // }
}