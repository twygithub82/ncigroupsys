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
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem, addDefaultSelectOption } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { JobOrderDS, JobOrderGO, JobOrderItem, UpdateJobOrderRequest } from 'app/data-sources/job-order';
import { RepairDS, RepairItem } from 'app/data-sources/repair';
import { StoringOrderDS } from 'app/data-sources/storing-order';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { TimeTableDS, TimeTableItem } from 'app/data-sources/time-table';
import { Utility } from 'app/utilities/utility';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, startWith, tap } from 'rxjs/operators';
//import { ResidueDS, ResidueItem, ResidueStatusRequest } from 'app/data-sources/residue';
//import { ResiduePartItem } from 'app/data-sources/residue-part';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { SteamDS, SteamItem, SteamStatusRequest } from 'app/data-sources/steam';
import { SteamPartItem } from 'app/data-sources/steam-part';
import { SearchStateService } from 'app/services/search-criteria.service';

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
    CANCELED_SUCCESS: 'COMMON-FORM.CANCELED-SUCCESS',
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
    YET_START: "COMMON-FORM.YET-START",
    STARTED: "COMMON-FORM.STARTED",
    NOT_STARTED: "COMMON-FORM.NOT-STARTED",
    TO_COMPLETE: "COMMON-FORM.TO-COMPLETE",
    STEAM_HEAT_TYPE: "COMMON-FORM.STEAM-HEAT-TYPE",
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
  steamDs: SteamDS;

  repEstList: RepairItem[] = [];
  jobOrderList: JobOrderItem[] = [];
  soStatusCvList: CodeValuesItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  jobStatusCvList: CodeValuesItem[] = [];
  processStatusCvList: CodeValuesItem[] = [];

  customerCodeControl = new UntypedFormControl();
  customer_companyList?: CustomerCompanyItem[];

  pageStateType = 'SteamJobOrder'
  pageIndexJobOrder = 0;
  pageSizeJobOrder = 10;
  lastSearchCriteriaJobOrder: any;
  lastOrderByJobOrder: any = { create_dt: "DESC" };
  endCursorJobOrder: string | undefined = undefined;
  startCursorJobOrder: string | undefined = undefined;
  hasNextPageJobOrder = false;
  hasPreviousPageJobOrder = false;

  availableJobStatus: string[] = [
    'PENDING',
    'JOB_IN_PROGRESS',
  ]

  private jobOrderSubscriptions: Subscription[] = [];

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private router: Router,
    private searchStateService: SearchStateService
  ) {
    super();
    this.translateLangText();
    this.initSearchForm();
    //this.customerCodeControl = new UntypedFormControl('', [Validators.required, AutocompleteSelectionValidator(this.customer_companyList)]);
    this.soDS = new StoringOrderDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.repairDS = new RepairDS(this.apollo);
    this.joDS = new JobOrderDS(this.apollo);
    this.ttDS = new TimeTableDS(this.apollo);
    this.steamDs = new SteamDS(this.apollo);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.initializeValueChanges();
    this.searchStateService.clearOtherPages(this.pageStateType);
    this.loadData();
  }

  initSearchForm() {
    this.filterJobOrderForm = this.fb.group({
      filterJobOrder: [''],
      jobStatusCv: [''],
      customer: this.customerCodeControl,
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

    const savedCriteria = this.searchStateService.getCriteria(this.pageStateType);
    const savedPagination = this.searchStateService.getPagination(this.pageStateType);

    if (savedCriteria) {
      this.filterJobOrderForm?.patchValue(savedCriteria);
      this.constructSearchCriteria();
    }

    if (savedPagination) {
      this.pageIndexJobOrder = savedPagination.pageIndex;
      this.pageSizeJobOrder = savedPagination.pageSize;

      this.performSearchJobOrder(
        savedPagination.pageSize,
        savedPagination.pageIndex,
        savedPagination.first,
        savedPagination.after,
        savedPagination.last,
        savedPagination.before
      );
    }

    if (!savedCriteria && !savedPagination) {
      this.onFilterJobOrder();
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
      job_type_cv: { eq: "STEAM" }
    };

    where.steaming_part = {
      all: { tariff_steaming_guid: { eq: null } },
      some: { guid: { neq: null } }
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
        { steaming_part: { some: { steaming: { estimate_no: { contains: this.filterJobOrderForm!.get('filterJobOrder')?.value } } } } }
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

    if (this.filterJobOrderForm!.get('customer')?.value) {
      if (!where.and) where.and = [];
      where.and.push({
        storing_order_tank: { storing_order: { customer_company: { code: { eq: (this.filterJobOrderForm!.get('customer')?.value).code } } } }
      });
    }

    // if (this.filterJobOrderForm!.get('customer')?.value) {
    //   where.status_cv = {
    //     in: this.filterJobOrderForm!.get('customer')?.value
    //   };
    // }
    // TODO:: Get login user team
    // if (false) {
    //   where.team_guid = { eq: "" }
    // }

    this.lastSearchCriteriaJobOrder = this.joDS.addDeleteDtCriteria(where);
  }

  onFilterJobOrder() {
    this.constructSearchCriteria();
    this.performSearchJobOrder(this.pageSizeJobOrder, 0, this.pageSizeJobOrder, undefined, undefined, undefined, () => { });
  }

  performSearchJobOrder(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, callback?: () => void) {
    this.searchStateService.setCriteria(this.pageStateType, this.filterJobOrderForm?.value);
    this.searchStateService.setPagination(this.pageStateType, {
      pageSize,
      pageIndex,
      first,
      after,
      last,
      before
    });
    console.log(this.searchStateService.getPagination(this.pageStateType))
    this.subs.sink = this.joDS.searchStartedJobOrder(this.lastSearchCriteriaJobOrder, this.lastOrderByJobOrder, first, after, last, before)
      .subscribe(data => {
        data = data.filter(data => data.steaming_part?.length);
        console.log(data)
        this.jobOrderList = data.filter(data => data.delete_dt === null || data.delete_dt === 0);
        this.jobOrderList.forEach(jo => {
          jo.time_table = jo.time_table?.filter(data => data.delete_dt === null || data.delete_dt === 0);
          this.subscribeToJobOrderEvent(this.joDS.subscribeToJobOrderStarted.bind(this.joDS), jo.guid!);
          this.subscribeToJobOrderEvent(this.joDS.subscribeToJobOrderStopped.bind(this.joDS), jo.guid!);
          this.subscribeToJobOrderEvent(this.joDS.subscribeToJobOrderCompleted.bind(this.joDS), jo.guid!);
        })
        this.endCursorJobOrder = this.joDS.pageInfo?.endCursor;
        this.startCursorJobOrder = this.joDS.pageInfo?.startCursor;
        this.hasNextPageJobOrder = this.joDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPageJobOrder = this.joDS.pageInfo?.hasPreviousPage ?? false;
      });

    this.pageSizeJobOrder = pageSize;
    this.pageIndexJobOrder = pageIndex;
  }

  onPageEventJobOrder(event: PageEvent) {
    const { pageIndex, pageSize } = event;
    let first: number | undefined = undefined;
    let after: string | undefined = undefined;
    let last: number | undefined = undefined;
    let before: string | undefined = undefined;

    if (this.pageSizeJobOrder !== pageSize) {
      this.pageIndexJobOrder = 0;
      first = pageSize;
      after = undefined;
      last = undefined;
      before = undefined;
    } else {
      if (pageIndex > this.pageIndexJobOrder && this.hasNextPageJobOrder) {
        first = pageSize;
        after = this.endCursorJobOrder;
      } else if (pageIndex < this.pageIndexJobOrder && this.hasPreviousPageJobOrder) {
        last = pageSize;
        before = this.startCursorJobOrder;
      }
    }

    this.performSearchJobOrder(pageSize, pageIndex, first, after, last, before, () => { });
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
  }

  initializeValueChanges() {
    this.filterJobOrderForm!.get('customer')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (value && typeof value === 'object') {
          searchCriteria = value.code;
        } else {
          searchCriteria = value || '';
        }
        this.subs.sink = this.ccDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
          this.customer_companyList = data
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

  canToggleJob(jobOrderItem: JobOrderItem | undefined) {
    var retval
    retval = (jobOrderItem?.steaming_part?.[0]?.tariff_steaming_guid === null);
    return retval;
  }
  canStartJob(jobOrderItem: JobOrderItem | undefined) {
    return this.joDS.canStartJob(jobOrderItem)
  }

  canCompleteJob(jobOrderItem: JobOrderItem | undefined, isStarted: boolean | undefined): boolean {
    return this.joDS.canCompleteJob(jobOrderItem) && !isStarted;
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
      const firstValidRepairPart = jobOrderItem.steaming_part?.find(
        (steamPart) => steamPart.steaming_guid !== null
      );
      this.ttDS.startJobTimer(param, firstValidRepairPart?.steaming_guid!).subscribe(result => {
        console.log(result)
        if ((result?.data?.startJobTimer ?? 0) > 0) {
          const firstJobPart = jobOrderItem?.steaming_part?.[0];
          if (firstJobPart?.steaming?.status_cv === 'ASSIGNED') {
            const steamStatusReq: SteamStatusRequest = new SteamStatusRequest({
              guid: firstJobPart!.steaming.guid,
              sot_guid: jobOrderItem?.sot_guid,
              action: "IN_PROGRESS",

            });
            console.log(steamStatusReq);
            this.steamDs.updateSteamStatus(steamStatusReq).subscribe(result => {
              console.log(result);
            });
          }
        }
      });
    } else {
      const found = jobOrderItem?.time_table?.filter(x => x?.start_time && !x?.stop_time && !x?.delete_dt);
      if (found?.length) {
        const newParam = new TimeTableItem(found[0]);
        newParam.stop_time = Utility.convertDate(new Date()) as number;
        newParam.job_order = new JobOrderGO({ ...jobOrderItem });
        const param = [newParam];
        console.log(param)
        this.ttDS.stopJobTimer(param).subscribe(result => {
          console.log(result);
          this.completeJob(event, jobOrderItem);
        });
      }
    }
  }

  completeJob(event: Event, jobOrderItem: JobOrderItem) {
    this.preventDefault(event);  // Prevents the form submission
    const newParam = new UpdateJobOrderRequest({
      guid: jobOrderItem?.guid,
      remarks: jobOrderItem?.remarks,
      start_dt: jobOrderItem?.start_dt,
      complete_dt: jobOrderItem?.complete_dt ?? Utility.convertDate(new Date()) as number
    });
    const param = [newParam];
    console.log(param)
    this.joDS.completeJobOrder(param).subscribe(result => {
      if (result.data.completeJobOrder > 0) {
        var item: SteamPartItem = new SteamPartItem(jobOrderItem.steaming_part![0]!);
        this.UpdateSteamStatusCompleted(item.steaming_guid!);
      }
      //console.log(result)
    });
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
        } else if (data?.onJobCompleted) {
          jobData = data.onJobCompleted;
          eventType = 'onJobCompleted';
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

  UpdateSteamStatusCompleted(steam_guid: string) {
    const where: any = {
      and: []
    };

    where.and.push({
      steaming_part: {
        all: {
          or: [
            {
              job_order: {
                status_cv: { eq: 'COMPLETED' }
              }
            },
            {
              approve_part: { eq: false }
            },
            { delete_dt: { neq: 0 } },
            { delete_dt: { neq: null } },
          ]
        }
      }
    });

    where.and.push({
      guid: { eq: steam_guid }
    })

    this.steamDs.search(where).subscribe(result => {

      if (result.length > 0) {
        var stmItem: SteamItem = result[0];
        let steamStatus: SteamStatusRequest = new SteamStatusRequest();
        steamStatus.action = "COMPLETE";
        steamStatus.guid = stmItem?.guid;
        steamStatus.sot_guid = stmItem?.sot_guid;
        this.steamDs.updateSteamStatus(steamStatus).subscribe(result => {

          console.log(result);
        });


      }
      //this.handleSaveSuccess(1);

    });

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
    this.onFilterJobOrder();
    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   data: {
    //     headerText: this.translatedLangText.CONFIRM_RESET,
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
    this.filterJobOrderForm?.patchValue({
      filterJobOrder: '',
      jobStatusCv: '',
      customer: ''
    });
  }

  startJobTask(event: Event, jobOrderItem: JobOrderItem) {
    this.preventDefault(event);  // Prevents the form submission
    if (this.canToggleJob(jobOrderItem)) {
      this.router.navigate(['/admin/steam/job-order/task', jobOrderItem.guid, jobOrderItem.steaming_part?.[0]?.steaming_guid]);
    }
    else {

      this.router.navigate(['/admin/steam/job-order/monitor', jobOrderItem.guid, jobOrderItem.steaming_part?.[0]?.steaming_guid]);
    }

  }

  onTabFocused() {
    this.resetForm();
    this.onFilterJobOrder();
  }


}