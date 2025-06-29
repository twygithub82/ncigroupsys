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
import { RouterLink } from '@angular/router';
import { SingletonNotificationService } from '@core/service/singletonNotification.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem, addDefaultSelectOption } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { JobOrderDS, JobOrderGO, JobOrderItem, UpdateJobOrderRequest } from 'app/data-sources/job-order';
import { RepairDS, RepairItem, RepairStatusRequest } from 'app/data-sources/repair';
import { StoringOrderDS } from 'app/data-sources/storing-order';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { TeamDS, TeamItem } from 'app/data-sources/teams';
import { TimeTableDS, TimeTableItem } from 'app/data-sources/time-table';
import { ModulePackageService } from 'app/services/module-package.service';
import { SearchStateService } from 'app/services/search-criteria.service';
import { ComponentUtil } from 'app/utilities/component-util';
import { pageSizeInfo, Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { EMPTY, Observable, of, Subscription } from 'rxjs';
import { debounceTime, startWith, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-job-order-task',
  standalone: true,
  templateUrl: './job-order-task.component.html',
  styleUrl: './job-order-task.component.scss',
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
export class JobOrderTaskComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumnsJobOrder = [
    'tank_no',
    'customer',
    'estimate_no',
    'allocate_dt',
    'status_cv',
    'team',
    'actions'
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
    TEAM: 'COMMON-FORM.TEAM',
    SEARCH: 'COMMON-FORM.SEARCH',
    STARTED: "COMMON-FORM.STARTED",
    NOT_STARTED: "COMMON-FORM.NOT-STARTED",
    TO_COMPLETE: "COMMON-FORM.TO-COMPLETE",
    SAVE_SUCCESS: "COMMON-FORM.ACTION-SUCCESS",
  }

  availableJobStatus: string[] = [
    'PENDING',
    'JOB_IN_PROGRESS',
  ]

  filterJobOrderForm?: UntypedFormGroup;

  cvDS: CodeValuesDS;
  soDS: StoringOrderDS;
  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  repairDS: RepairDS;
  joDS: JobOrderDS;
  ttDS: TimeTableDS;
  teamDS: TeamDS;

  repEstList: RepairItem[] = [];
  jobOrderList: JobOrderItem[] = [];
  soStatusCvList: CodeValuesItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  jobStatusCvList: CodeValuesItem[] = [];
  processStatusCvList: CodeValuesItem[] = [];

  customerCodeControl = new UntypedFormControl();
  customer_companyList?: CustomerCompanyItem[];

  private joSubscriptions = new Map<string, Subscription>();

  pageStateType = 'RepairTask'
  pageIndexJobOrder = 0;
  pageSizeJobOrder = pageSizeInfo.defaultSize;
  lastSearchCriteriaJobOrder: any;
  lastOrderByJobOrder: any = { create_dt: "DESC" };
  endCursorJobOrder: string | undefined = undefined;
  startCursorJobOrder: string | undefined = undefined;
  hasNextPageJobOrder = false;
  hasPreviousPageJobOrder = false;
  orderType = "DESC";

  currentStartCursor: string | undefined = undefined;
  currentEndCursor: string | undefined = undefined;
  lastCursorDirection: string | undefined = undefined;

  teamList: TeamItem[] = [];

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    public modulePackageService: ModulePackageService,
    private searchStateService: SearchStateService,
    private notificationService: SingletonNotificationService
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
    this.teamDS = new TeamDS(this.apollo);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.initializeValueChanges();
    this.searchStateService.clearOtherPagesKeys([this.pageStateType, 'RepairJobAllocation', 'RepairQC']);
    this.loadData();
  }

  override ngOnDestroy(): void {
    // Unsubscribe all job order subscriptions
    this.joSubscriptions.forEach(sub => sub.unsubscribe());
    this.joSubscriptions.clear();

    // Unsubscribe other component-level subscriptions (if using SubSink or similar)
    this.subs.unsubscribe();
  }

  initSearchForm() {
    this.filterJobOrderForm = this.fb.group({
      filterJobOrder: [''],
      jobStatusCv: [''],
      customer: this.customerCodeControl,
      allocate_dt_start: [''],
      allocate_dt_end: [''],
      teamList: ['']
    });
  }

  public loadData() {
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

    if (this.modulePackageService.isGrowthPackage() || this.modulePackageService.isCustomizedPackage()) {
      this.teamDS.getTeamListByDepartment(['REPAIR']).subscribe(data => {
        this.teamList = data
      });

      this.displayedColumnsJobOrder = [
        'tank_no',
        'customer',
        'estimate_no',
        'allocate_dt',
        'status_cv',
        'team',
        'actions'
      ];
    }
    if (this.modulePackageService.isStarterPackage()) {

      this.displayedColumnsJobOrder = [
        'tank_no',
        'customer',
        'estimate_no',
        'allocate_dt',
        'status_cv',
        'actions'
      ];
    }

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
    const where: any = {
      job_type_cv: { eq: "REPAIR" }
    };

    if (this.filterJobOrderForm!.get('filterJobOrder')?.value) {
      const tankNo = this.filterJobOrderForm!.get('filterJobOrder')?.value;
      where.or = [
        {
          storing_order_tank: {
            or: [
              { tank_no: { contains: Utility.formatContainerNumber(tankNo) } },
              { tank_no: { contains: Utility.formatTankNumberForSearch(tankNo) } }
            ]
          }
        },
        { repair_part: { some: { repair: { estimate_no: { contains: tankNo } } } } }
        //{ estimate_no: { contains: tankNo } }
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
    } else {
      where.status_cv = {
        in: this.availableJobStatus
      };
    }

    if (this.filterJobOrderForm!.get('allocate_dt_start')?.value || this.filterJobOrderForm!.get('allocate_dt_end')?.value) {
      const estDtStart = this.filterJobOrderForm?.get('allocate_dt_start')?.value;
      const estDtEnd = this.filterJobOrderForm?.get('allocate_dt_end')?.value;
      const today = new Date();

      // Check if `est_dt_start` is before today and `est_dt_end` is empty
      if (estDtStart && new Date(estDtStart) < today && !estDtEnd) {
        where.create_dt = {
          gte: Utility.convertDate(estDtStart),
          lte: Utility.convertDate(today), // Set end date to today
        };
      } else if (estDtStart || estDtEnd) {
        // Handle general case where either or both dates are provided
        where.create_dt = {
          gte: Utility.convertDate(estDtStart || today),
          lte: Utility.convertDate(estDtEnd || today),
        };
      }
      // where.create_dt = { gte: Utility.convertDate(this.filterJobOrderForm!.get('allocate_dt_start')?.value), lte: Utility.convertDate(this.filterJobOrderForm!.get('allocate_dt_end')?.value, true) };
    }

    // TODO:: Get login user team
    if (this.filterJobOrderForm!.get('teamList')?.value?.length) {
      const team_guidList = this.filterJobOrderForm!.get('teamList')?.value?.map((x: any) => x.guid) ?? []
      where.team_guid = { in: team_guidList }
    } else {
      // where.team_guid = { nin: [null, ''] }
    }

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
    this.subs.sink = this.joDS.searchJobOrderForRepair(this.lastSearchCriteriaJobOrder, this.lastOrderByJobOrder, first, after, last, before)
      .subscribe(data => {
        const newGuids = new Set<string>();
        this.jobOrderList = data;
        this.jobOrderList.forEach(jo => {
          const guid = jo.guid!;
          newGuids.add(guid);

          if (this.joSubscriptions.has(guid)) {
            // Already subscribed — skip to avoid duplication
            return;
          }

          const sub = this.notificationService.subscribe(guid, (msg) => {
            this.processJobStatusChange(msg);
          });

          this.joSubscriptions.set(guid, sub);
        });

        // Unsubscribe and remove old subscriptions no longer needed
        Array.from(this.joSubscriptions.keys()).forEach(guid => {
          if (!newGuids.has(guid)) {
            this.joSubscriptions.get(guid)!.unsubscribe();
            this.joSubscriptions.delete(guid);
          }
        });

        this.endCursorJobOrder = this.joDS.pageInfo?.endCursor;
        this.startCursorJobOrder = this.joDS.pageInfo?.startCursor;
        this.hasNextPageJobOrder = this.joDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPageJobOrder = this.joDS.pageInfo?.hasPreviousPage ?? false;

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
      jobStatusCv: '',
      allocate_dt_start: '',
      allocate_dt_end: '',
      teamList: ''
    });
    this.customerCodeControl.reset();
  }

  onPageEventJobOrder(event: PageEvent) {
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

  toggleSortJobOrder(column: string) {
    this.orderType = this.orderType === 'DESC' ? 'ASC' : 'DESC';
    if (column === 'allocate_dt') {
      this.lastOrderByJobOrder = {
        create_dt: this.orderType
      }
    } else {
      this.lastOrderByJobOrder = {
        create_dt: this.orderType
      }
    }
    this.triggerCurrentSearch();
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

    // this.filterJobOrderForm?.get('jobStatusCv')?.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(300),
    //   tap(value => {
    //     this.onFilterJobOrder();
    //   })
    // ).subscribe();
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
    return this.isAllowEdit() && this.joDS.canStartJob(jobOrderItem)
  }

  canCompleteJob(jobOrderItem: JobOrderItem | undefined): boolean {
    return this.isAllowEdit() && this.joDS.canCompleteJob(jobOrderItem);
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

  toggleJobState(event: Event, isStarted: boolean | undefined, jobOrderItem: JobOrderItem) {
    this.stopPropagation(event);  // Prevents the form submission
    if (!isStarted) {
      const param = [new TimeTableItem({ job_order_guid: jobOrderItem?.guid, job_order: new JobOrderGO({ ...jobOrderItem }) })];
      const firstValidRepairPart = jobOrderItem.repair_part?.find(
        (repairPart) => repairPart.repair?.guid !== null
      );
      console.log(`startJobTimer: ${JSON.stringify(param)}, ${firstValidRepairPart?.repair?.guid!}`)
      this.ttDS.startJobTimer(param, firstValidRepairPart?.guid!).subscribe(result => {
        console.log(result)
        if ((result?.data?.startJobTimer ?? 0) > 0) {
          const firstJobPart = jobOrderItem.repair_part?.[0];
          if (firstJobPart?.repair?.status_cv === 'ASSIGNED') {
            const repairStatusReq: RepairStatusRequest = new RepairStatusRequest({
              guid: firstJobPart!.repair.guid,
              sot_guid: jobOrderItem.storing_order_tank?.guid,
              action: "IN_PROGRESS"
            });
            console.log(repairStatusReq);
            this.repairDS.updateRepairStatus(repairStatusReq).subscribe(result => {
              console.log(result);
            });
          }
        }
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

  // completeJob(event: Event, jobOrderItem: JobOrderItem) {
  //   this.preventDefault(event);  // Prevents the form submission
  //   const newParam = new UpdateJobOrderRequest({
  //     guid: jobOrderItem?.guid,
  //     remarks: jobOrderItem?.remarks,
  //     start_dt: jobOrderItem?.start_dt,
  //     complete_dt: jobOrderItem?.complete_dt ?? Utility.convertDate(new Date()) as number
  //   });
  //   const param = [newParam];
  //   console.log(param)
  //   this.joDS.completeJobOrder(param).subscribe(result => {
  //     console.log(result)
  //     if ((result?.data?.completeJobOrder ?? 0) > 0) {
  //       const firstJobPart = jobOrderItem.repair_part?.[0];
  //       // if (firstJobPart?.repair?.status_cv === 'JOB_IN_PROGRESS') {
  //       //   const repairStatusReq: RepairStatusRequest = new RepairStatusRequest({
  //       //     guid: firstJobPart!.repair.guid,
  //       //     sot_guid: jobOrderItem.storing_order_tank?.guid,
  //       //     action: "COMPLETE"
  //       //   });
  //       //   console.log(repairStatusReq);
  //       //   this.repairDS.updateRepairStatus(repairStatusReq).subscribe(result => {
  //       //     console.log(result);
  //       //   });
  //       // }
  //       if (firstJobPart?.repair?.status_cv === 'ASSIGNED' || firstJobPart?.repair?.status_cv === 'JOB_IN_PROGRESS' || firstJobPart?.repair?.status_cv === 'COMPLETED') {
  //         const repairStatusReq: RepairStatusRequest = new RepairStatusRequest({
  //           guid: firstJobPart!.repair?.guid,
  //           sot_guid: jobOrderItem.storing_order_tank?.guid,
  //           action: "COMPLETE"
  //         });
  //         console.log(repairStatusReq);
  //         this.repairDS.updateRepairStatus(repairStatusReq).subscribe(result => {
  //           console.log(result);
  //         });
  //       }
  //     }
  //   });
  //   this.performSearch(this.pageSizeJobOrder, this.pageIndexJobOrder, this.pageSizeJobOrder, undefined, undefined, undefined, () => { });
  // }

  completeJob(event: Event, jobOrderItem: JobOrderItem): void {
    this.preventDefault(event);

    const stopJob$ = this.isStarted(jobOrderItem)
      ? (() => {
        const found = jobOrderItem?.time_table?.find(x => x?.start_time && !x?.stop_time);
        if (!found) return of(null); // Nothing to stop
        const stopJobParam = [new TimeTableItem({
          ...found,
          stop_time: Utility.convertDate(new Date()) as number,
          job_order: new JobOrderGO({ ...jobOrderItem })
        })];
        return this.ttDS.stopJobTimer(stopJobParam);
      })()
      : of(null);

    stopJob$.pipe(
      switchMap(() => {
        const completeJobParam = [new UpdateJobOrderRequest({
          guid: jobOrderItem?.guid,
          remarks: jobOrderItem?.remarks,
          start_dt: jobOrderItem?.start_dt,
          complete_dt: jobOrderItem?.complete_dt ?? Utility.convertDate(new Date()) as number
        })];
        return this.joDS.completeJobOrder(completeJobParam);
      }),
      switchMap(result => {
        if ((result?.data?.completeJobOrder ?? 0) > 0) {
          const firstJobPart = jobOrderItem?.repair_part?.[0];
          const repairStatusReq = new RepairStatusRequest({
            guid: firstJobPart?.repair?.guid,
            sot_guid: jobOrderItem?.storing_order_tank?.guid,
            action: "COMPLETE"
          });
          return this.repairDS.updateRepairStatus(repairStatusReq);
        }
        return EMPTY;
      })
    ).subscribe(res => {
      if ((res?.data?.updateRepairStatus ?? 0) > 0) {
        this.handleSaveSuccess(res.data.updateRepairStatus);
      }
    });
  }

  processJobStatusChange(response: any) {
    // console.log('Received data:', response);
    const event_name = response.event_name;
    const data = response.payload

    if (data) {
      const foundJob = this.jobOrderList.filter(x => x.guid === data.job_order_guid);
      if (foundJob?.length) {
        foundJob[0].status_cv = data.job_status;
        foundJob[0].start_dt = foundJob[0].start_dt ?? data.start_time;
        foundJob[0].time_table ??= [];

        if (event_name === 'onJobStarted') {
          const foundTimeTable = foundJob[0].time_table?.filter(x => x.guid === data.time_table_guid);
          if (foundTimeTable?.length) {
            foundTimeTable[0].start_time = data.start_time
          } else {
            foundJob[0].time_table?.push(new TimeTableItem({ guid: data.time_table_guid, start_time: data.start_time, stop_time: data.stop_time, job_order_guid: data.job_order_guid }))
          }
        } else if (event_name === 'onJobStopped') {
          foundJob[0].time_table = foundJob[0].time_table?.filter(x => x.guid !== data.time_table_guid);
        }
        console.log(`Updated JobOrder ${event_name} :`, foundJob[0]);
      }
    }
  }

  updateValidators(validOptions: any[]) {
    this.customerCodeControl.setValidators([
      AutocompleteSelectionValidator(validOptions)
    ]);
  }

  getMaxDate() {
    return new Date();
  }

  onTabFocused() {
    this.resetForm();
    this.onFilter();
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.SAVE_SUCCESS;
      ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
    }
  }

  isAllowEdit() {
    return this.modulePackageService.hasFunctions(['REPAIR_JOBS_EDIT']);
  }
}