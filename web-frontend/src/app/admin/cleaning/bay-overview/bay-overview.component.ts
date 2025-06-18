import { Direction } from '@angular/cdk/bidi';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem, addDefaultSelectOption } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { InGateCleaningDS, InGateCleaningItem } from 'app/data-sources/in-gate-cleaning';
import { ClnJobOrderRequest, JobOrderDS, JobOrderGO, JobOrderItem, UpdateJobOrderRequest } from 'app/data-sources/job-order';
import { RepairDS, RepairItem } from 'app/data-sources/repair';
import { StoringOrderDS } from 'app/data-sources/storing-order';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { TeamDS } from 'app/data-sources/teams';
import { TimeTableDS, TimeTableItem } from 'app/data-sources/time-table';
import { pageSizeInfo, Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from './dialogs/confirm-form-dialog/confirm-form-dialog.component';
import { TankInfoFormDialogComponent } from './dialogs/tank-form-dialog/tank-info-form-dialog.component';
@Component({
  selector: 'app-bay-overview',
  standalone: true,
  templateUrl: './bay-overview.component.html',
  styleUrl: './bay-overview.component.scss',
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
    MatButtonToggleModule,
    MatCardModule,
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class BayOverviewComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
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
    YET_COMPLETE: "COMMON-FORM.YET-COMPLETE",
    BAY_OVERVIEW: "COMMON-FORM.BAY-OVERVIEW",
    CLEANING_METHOD: "COMMON-FORM.CLEANING-PROCESS",
    ROLLBACK: 'COMMON-FORM.ROLLBACK',
    ROLLBACK_SUCCESS: 'COMMON-FORM.ROLLBACK-SUCCESS',
    OWNER: 'COMMON-FORM.OWNER',
    EIR_NO: 'COMMON-FORM.EIR-NO',
    EIR_DATE: 'COMMON-FORM.EIR-DATE',
    LAST_TEST: 'COMMON-FORM.LAST-TEST',
    NEXT_TEST: 'COMMON-FORM.NEXT-TEST',
    TANK_DETAILS: 'COMMON-FORM.TANK-DETAILS',
    ARE_SURE_ROLLBACK: 'COMMON-FORM.ARE-YOU-SURE-ROLLBACK',
    ARE_SURE_COMPLETE: 'COMMON-FORM.ARE-YOU-SURE-COMPLETE'
  }

  availableProcessStatus: string[] = [
    'APPROVED',
    'JOB_IN_PROGRESS',
    'COMPLETED',
    'ASSIGNED',
    'NO_ACTION',
    'CANCELED'
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
  clnDS: InGateCleaningDS;
  teamDS: TeamDS;

  teamList: any[] = [];
  repEstList: RepairItem[] = [];
  jobOrderList: JobOrderItem[] = [];
  soStatusCvList: CodeValuesItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  jobStatusCvList: CodeValuesItem[] = [];
  processStatusCvList: CodeValuesItem[] = [];

  customerCodeControl = new UntypedFormControl();
  customer_companyList?: CustomerCompanyItem[];

  pageIndexJobOrder = 0;
  pageSizeJobOrder = pageSizeInfo.defaultSize;
  lastSearchCriteriaJobOrder: any;
  lastOrderByJobOrder: any = { job_order_no: "DESC" };
  endCursorJobOrder: string | undefined = undefined;
  startCursorJobOrder: string | undefined = undefined;
  hasNextPageJobOrder = false;
  hasPreviousPageJobOrder = false;
  previous_endCursorJobOrder: string | undefined = undefined;

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
    this.customerCodeControl = new UntypedFormControl('', [Validators.required, AutocompleteSelectionValidator(this.customer_companyList)]);
    this.soDS = new StoringOrderDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.repairDS = new RepairDS(this.apollo);
    this.joDS = new JobOrderDS(this.apollo);
    this.ttDS = new TimeTableDS(this.apollo);
    this.clnDS = new InGateCleaningDS(this.apollo);
    this.teamDS = new TeamDS(this.apollo);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  @Output() refreshMainTab = new EventEmitter<void>();

  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.initializeValueChanges();
    this.QueryBays();
  }

  triggerRefresh() {
    this.refreshMainTab.emit();
  }

  initSearchForm() {
    this.filterJobOrderForm = this.fb.group({
      filterJobOrder: [''],
      jobStatusCv: [['PENDING', 'JOB_IN_PROGRESS']],
      customer: this.customerCodeControl,
      team_allocation: ['']
    });
  }

  public loadData() {
    this.onFilterJobOrder();

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

  onFilterJobOrder() {
    const where: any = {
      job_type_cv: { eq: "CLEANING" }
    };

    if (this.filterJobOrderForm!.get('filterJobOrder')?.value) {
      where.or = [
        { storing_order_tank: { tank_no: { contains: this.filterJobOrderForm!.get('filterJobOrder')?.value } } },
        { cleaning: { some: { job_no: { contains: this.filterJobOrderForm!.get('filterJobOrder')?.value } } } }
      ];
    }

    if (this.filterJobOrderForm!.get('jobStatusCv')?.value?.length) {
      where.status_cv = {
        in: this.filterJobOrderForm!.get('jobStatusCv')?.value
      };
    }

    // TODO:: Get login user team
    // if (false) {
    //   where.team_guid = { eq: "" }
    // }

    this.lastSearchCriteriaJobOrder = this.joDS.addDeleteDtCriteria(where);
    this.performSearchJobOrder(this.pageSizeJobOrder, this.pageIndexJobOrder, this.pageSizeJobOrder, undefined, undefined, undefined, () => { });
  }

  performSearchJobOrder(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, callback?: () => void) {
    this.subs.sink = this.joDS.searchStartedJobOrder(this.lastSearchCriteriaJobOrder, this.lastOrderByJobOrder, first, after, last, before)
      .subscribe(data => {
        this.jobOrderList = data;
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
      console.log(param)
      const firstValidRepairPart = jobOrderItem.cleaning?.find(
        (cleaning) => cleaning?.guid !== null
      );
      this.ttDS.startJobTimer(param, firstValidRepairPart?.guid!).subscribe(result => {
        if (result.data.startJobTimer > 0) {
          var item: InGateCleaningItem = new InGateCleaningItem(jobOrderItem.cleaning![0]!);
          this.UpdateCleaningStatusInProgress(item.guid!);
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
          if (result.data.stopJobTimer > 0) {
            this.completeJob(event, jobOrderItem);
          }

        });
      }
    }
  }

  displayDateTime(jobOrderItem: JobOrderItem): any {
    //var dtValue?:Date = Utility.convertDate(jobOrderItem.start_dt,false,true);
    //return new Date(Number(jobOrderItem.start_dt) * 1000).toLocaleString();


    const dt = new Date(Number(jobOrderItem.start_dt) * 1000);

    const formatted =
      //dt.getFullYear() + '-' +
      String(dt.getDate()).padStart(2, '0') + '-' +
      String(dt.getMonth() + 1).padStart(2, '0') + '-' +
      String(dt.getFullYear()) + ' ' +
      String(dt.getHours()).padStart(2, '0') + ':' +
      String(dt.getMinutes()).padStart(2, '0');

    return formatted;
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
      console.log(result)
      if (jobOrderItem?.cleaning?.length! > 0) {
        var item: InGateCleaningItem = new InGateCleaningItem(jobOrderItem.cleaning![0]!);
        this.UpdateCleaningStatusCompleted(item.guid!);
      }
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
        } else if (data?.onJobStartStop) {
          jobData = data.onJobStartStop;
          eventType = 'onJobStartStop';
        }

        if (jobData) {
          const foundJob = this.jobOrderList.filter(x => x.guid === jobData.job_order_guid);
          this.clearAllTeamButton();
          this.queryOccupiedTeam();
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

  UpdateCleaningStatusInProgress(clean_guid: string) {
    const where: any = {
      and: []
    };
    where.and.push({
      guid: { eq: clean_guid }
    });

    this.subs.sink = this.clnDS.search(where)
      .subscribe(data => {
        if (data.length > 0) {
          var cln = data[0];
          var rep: InGateCleaningItem = new InGateCleaningItem(cln);
          rep.action = 'IN_PROGRESS';
          delete rep.storing_order_tank;
          delete rep.job_order;
          delete rep.customer_company;
          this.clnDS.updateInGateCleaning(rep).subscribe(result => {
            console.log(result);
          });
        }
      });
  }

  UpdateCleaningStatusCompleted(clean_guid: string) {
    const where: any = {
      and: []
    };

    where.and.push({
      job_order: { status_cv: { eq: 'COMPLETED' } }
    });

    where.and.push({
      guid: { eq: clean_guid }
    });

    this.subs.sink = this.clnDS.search(where)
      .subscribe(data => {
        if (data.length > 0) {
          var cln = data[0];
          var rep: InGateCleaningItem = new InGateCleaningItem(cln);
          rep.action = 'COMPLETE';
          delete rep.storing_order_tank;
          delete rep.job_order;
          delete rep.customer_company;
          this.clnDS.updateInGateCleaning(rep).subscribe(result => {
            if (result.data.updateCleaning > 0) {
              this.clearTeamButton(clean_guid);
            }
          });
        }
      });
  }
  clearAllTeamButton() {
    this.teamList?.forEach(team => {
      if (team.jobOrderItem) {
        team.jobOrderItem = undefined;
        team.isSelected = false;
        team.isOccupied = false;
        team.isEditable = false;
        team.isViewOnly = false;
      }
    });
  }

  clearTeamButton(cleanGuid: string) {
    this.teamList?.forEach(team => {
      if (team.jobOrderItem) {
        if (team.jobOrderItem.cleaning![0]!.guid == cleanGuid) {
          team.jobOrderItem = undefined;
          team.isSelected = false;
          team.isOccupied = false;
          team.isEditable = false;
          team.isViewOnly = false;
        }
      }
    });
  }

  QueryBays() {
    this.teamDS.getTeamListByDepartment(["CLEANING"]).subscribe(data => {
      if (data?.length) {
        this.teamList = data.map((row, index) => ({
          ...row,
          index: index,
          isSelected: false,
          isOccupied: false,
          isEditable: false,
          isViewOnly: true
        }));
        this.sortBayList(this.teamList);
        this.subscribeTeamEvent();
        this.queryOccupiedTeam();
      }
    });
  }

  sortBayList(bayList: any[]) {
    bayList.sort((a: any, b: any) => {
      const numA = parseInt(a.description.replace(/[^\d]/g, ""), 10); // Remove all non-digit characters
      const numB = parseInt(b.description.replace(/[^\d]/g, ""), 10); // Remove all non-digit characters
      return numA - numB;
    });
  }

  subscribeTeamEvent() {
    this.teamList.forEach(t => {
      this.subscribeToJobOrderEvent(this.joDS.subscribeToJobOrderStarted.bind(this.joDS), t.guid!);
    })
  }

  queryOccupiedTeam() {
    const teamGuids = this.teamList?.map(team => team.guid);
    const where: any = {
      and: []
    };
    where.and.push({ team: { guid: { in: teamGuids } } });
    where.and.push({ job_type_cv: { in: ['CLEANING', 'RESIDUE'] } });
    where.and.push({ status_cv: { in: ['JOB_IN_PROGRESS', 'PENDING', 'ASSIGNED'] } });
    where.and.push({ delete_dt: { eq: null } });

    this.joDS?.searchStartedJobOrder(where).subscribe(data => {
      if (data?.length) {
        console.log(data)
        data.forEach(d => {
          this.teamList?.forEach(team => {
            if (team.guid === d.team?.guid && d.job_type_cv === 'CLEANING' && d.cleaning?.length || 0 > 0) {
              const foundIncomplete = d.storing_order_tank?.residue?.filter(x => ['PENDING', 'APPROVED', 'JOB_IN_PROGRESS', 'PARTIAL_ASSIGNED', 'ASSIGNED', ''].includes(x.status_cv || ''));
              team.jobOrderItem = d;
              team.isOccupied = true;
              team.isEditable = false;
              team.foundIncomplete = (foundIncomplete?.length || 0) > 0;
            }
          });
        });
      }
    });
  }

  toggleTeam(team: any) {
    let selected: boolean = !team.isSelected;
    if (team.isViewOnly) return;
    if (selected) {
      this.teamList!.forEach(team => team.isSelected = false);
      this.filterJobOrderForm?.patchValue({
        team_allocation: team
      });
    }
    else {
      this.filterJobOrderForm?.patchValue({
        team_allocation: ''
      });
    }
    team.isSelected = !team.isSelected;
  }

  rollBackCleaningJob(event: Event, team: any) {
    this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '30vw',
      //height: '250px',
      data: {
        action: "EDIT",
        item: team.jobOrderItem,
        langText: this.translatedLangText,
        confirmStatement: this.translatedLangText.ARE_SURE_ROLLBACK,
        index: -1

      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result.action === 'confirmed') {
        const clnJobOrder = new ClnJobOrderRequest({
          guid: team.jobOrderItem?.cleaning[0]?.guid,
          sot_guid: team.jobOrderItem?.sot_guid,
          job_order: [new JobOrderGO({ ...team.jobOrderItem, remarks: result.remarks })],
          sot_status: team.jobOrderItem.storing_order_tank?.tank_status_cv,
          remarks: result.remarks
        });

        console.log(clnJobOrder)
        this.joDS.rollbackJobInProgressCleaning(clnJobOrder).subscribe(result => {
          console.log(result)
          if ((result?.data?.rollbackJobInProgressCleaning ?? 0) > 0) {
            if (team.jobOrderItem) {
              team.jobOrderItem = undefined;
              team.isSelected = false;
              team.isOccupied = false;
              team.isEditable = false;
              team.isViewOnly = false;
            }
            this.triggerRefresh();
          }
        });
      }
    });
  }

  showTankInfo(event: Event, team: any) {
    this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(TankInfoFormDialogComponent, {
      width: '1000px',
      data: {
        selectedItem: team.jobOrderItem?.storing_order_tank!,
        action: 'new',
        translatedLangText: this.translatedLangText,
        dialogTitle: team.description,
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => { });
  }

  jobComplete(event: Event, team: any) {
    this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '30vw',
      data: {
        action: "EDIT",
        item: team.jobOrderItem,
        langText: this.translatedLangText,
        confirmStatement: this.translatedLangText.ARE_SURE_COMPLETE,
        index: -1
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action == "confirmed") {
        this.toggleJobState(event, true, team.jobOrderItem)
      }
    });
  }

  RefreshContent(): void {
    this.clearAllTeamButton();
    this.queryOccupiedTeam();
  }
}