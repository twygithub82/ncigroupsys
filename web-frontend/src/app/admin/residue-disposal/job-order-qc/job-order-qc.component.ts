import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RepairPartItem } from 'app/data-sources/repair-part';
import { ResidueDS, ResidueItem } from 'app/data-sources/residue';

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
  ]
})
export class JobOrderQCComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumnsJobOrder = [
    'tank_no',
    'customer',
    'estimate_no',
    // 'estimate_dt',
    // 'approve_dt',
    'qc_dt',
    //'residue_type',
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
    APPROVE_DATE: 'COMMON-FORM.APPROVE-DATE',
    QC_DATE: 'COMMON-FORM.QC-DATE',
    RESIDUE_TYPE: 'COMMON-FORM.RESIDUE-TYPE'
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
  residueDS:ResidueDS;

  availableProcessStatus: string[] = [
     'APPROVED',
     'JOB_IN_PROGRESS',
     'QC_COMPLETED',
     'COMPLETED',
     'ASSIGNED',
     'PARTIAL_ASSIGNED',
   ]

   
  deList:ResidueItem[]=[];
  repEstList: RepairItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  repairOptionCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  jobStatusCvList: CodeValuesItem[] = [];
  processStatusCvList: CodeValuesItem[] = [];

  customerCodeControl = new UntypedFormControl();
  customer_companyList?: CustomerCompanyItem[];

  pageIndexJobOrder = 0;
  pageSizeJobOrder = 100;
  lastSearchCriteriaJobOrder: any;
  lastOrderByJobOrder: any = { create_dt: "DESC" };
  endCursorJobOrder: string | undefined = undefined;
  startCursorJobOrder: string | undefined = undefined;
  hasNextPageJobOrder = false;
  hasPreviousPageJobOrder = false;

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
    this.residueDS= new ResidueDS(this.apollo);
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

  initSearchForm() {
    this.filterJobOrderForm = this.fb.group({
      filterResidue: [''],
      jobStatusCv: [['PENDING', 'JOB_IN_PROGRESS']],
      status_cv: [['COMPLETED', 'JOB_IN_PROGRESS']],
      customer: [''],
    });
  }

  public loadData() {
    this.onResidueFilter();

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
      this.repairOptionCvList = addDefaultSelectOption(data, "No Repair");
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

  onResidueFilter(){
    const where: any = {
     // status_cv: { in: ["JOB_IN_PROGRESS", "CANCELED", "AV","COMPLETED"] },
      residue_part: {
        all: {
          delete_dt: { eq: null },
          or: [
            { approve_part: { eq: false } },
            {
              approve_part: { eq: true },
              job_order: { status_cv: { in: ["COMPLETED", "CANCELED"] } }
            },
            {
              approve_part: { eq: null },
              job_order: { status_cv: { in: ["COMPLETED", "CANCELED"] } }
            }
          ]
        }
      }
    };
    
    // where.and.push({
    //   residue_part:{some:{job_order: { status_cv: {eq:'COMPLETED' }}}}
    // });

    // or: [
    //   { storing_order_tank: { tank_no: { contains: "" } } },
    //   { estimate_no: { contains: "" } }
    // ]
    if (this.filterJobOrderForm!.get('filterResidue')?.value) {
      where.and.push({
        storing_order_tank: { tank_no: { contains: this.filterJobOrderForm!.get('filterResidue')?.value } }
      });
    }

    if (this.filterJobOrderForm!.get('customer')?.value) {
      where.and = where.and || []; // Initialize if not already present
      where.and.push({
        customer_company: { code: { eq: (this.filterJobOrderForm!.get('customer')?.value).code } }
      });
    }

    if (this.filterJobOrderForm?.get('status_cv')?.value) {
      where.and = where.and || []; // Initialize if not already present
      where.and.push({
        status_cv: { in: this.filterJobOrderForm?.get('status_cv')?.value }
      });
    }

    this.lastSearchCriteriaJobOrder = this.residueDS.addDeleteDtCriteria(where);
    this.performSearchResidue(this.pageSizeJobOrder, this.pageIndexJobOrder, this.pageSizeJobOrder, undefined, undefined, undefined, () => { });
  }

  performSearchResidue(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, callback?: () => void) {
    this.subs.sink = this.residueDS.search(this.lastSearchCriteriaJobOrder, this.lastOrderByJobOrder, first, after, last, before)
      .subscribe(data => {
        this.deList = data;
        // this.jobOrderList.forEach(jo => {
        //   this.subscribeToJobOrderEvent(this.joDS.subscribeToJobOrderStarted.bind(this.joDS), jo.guid!);
        //   this.subscribeToJobOrderEvent(this.joDS.subscribeToJobOrderStopped.bind(this.joDS), jo.guid!);
        // })
      });

    this.pageSizeJobOrder = pageSize;
    this.pageIndexJobOrder = pageIndex;
  }

  onFilter() {
    const where: any = {
      status_cv: { in: ["JOB_IN_PROGRESS", "QC_COMPLETED", "AV","COMPLETED"] },
      repair_part: {
        all: {
          delete_dt: { eq: null },
          or: [
            { approve_part: { eq: false } },
            {
              approve_part: { eq: true },
              job_order: { status_cv: { in: ["COMPLETED", "CANCELED"] } }
            }
          ]
        }
      }
    };

    if (this.filterJobOrderForm!.get('filterResidue')?.value) {
      where.or = [
        { storing_order_tank: { tank_no: { contains: this.filterJobOrderForm!.get('filterResidue')?.value } } },
        { repair_part: { some: { repair: { estimate_no: { contains: this.filterJobOrderForm!.get('filterResidue')?.value } } } } }
      ];
    }

    // if (this.filterJobOrderForm!.get('jobStatusCv')?.value?.length) {
    //   where.status_cv = {
    //     in: this.filterJobOrderForm!.get('jobStatusCv')?.value
    //   };
    // }

    // TODO:: Get login user team
    // if (false) {
    //   where.team_guid = { eq: "" }
    // }

    this.lastSearchCriteriaJobOrder = this.joDS.addDeleteDtCriteria(where);
    this.performSearch(this.pageSizeJobOrder, this.pageIndexJobOrder, this.pageSizeJobOrder, undefined, undefined, undefined, () => { });
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, callback?: () => void) {
    this.subs.sink = this.repairDS.getRepairForQC(this.lastSearchCriteriaJobOrder, this.lastOrderByJobOrder, first, after, last, before)
      .subscribe(data => {
        this.repEstList = data;
        // this.jobOrderList.forEach(jo => {
        //   this.subscribeToJobOrderEvent(this.joDS.subscribeToJobOrderStarted.bind(this.joDS), jo.guid!);
        //   this.subscribeToJobOrderEvent(this.joDS.subscribeToJobOrderStopped.bind(this.joDS), jo.guid!);
        // })
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

    this.performSearch(pageSize, pageIndex, first, after, last, before, () => { });
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

    // this.filterJobOrderForm?.get('jobStatusCv')?.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(300),
    //   tap(value => {
    //     this.onFilter();
    //   })
    // ).subscribe();
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
}