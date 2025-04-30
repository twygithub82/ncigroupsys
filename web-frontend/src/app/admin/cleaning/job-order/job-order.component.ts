import { Direction } from '@angular/cdk/bidi';
import { CommonModule, NgClass } from '@angular/common';
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
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
import { CodeValuesDS, CodeValuesItem, addDefaultSelectOption } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { StoringOrderDS, StoringOrderGO, StoringOrderItem } from 'app/data-sources/storing-order';
import { Utility } from 'app/utilities/utility';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { CancelFormDialogComponent } from './dialogs/cancel-form-dialog/cancel-form-dialog.component';
//import { CancelFormDialogComponent } from './dialogs/cancel-form-dialog1/form-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { CleaningMethodDS, CleaningMethodItem } from 'app/data-sources/cleaning-method';
import { InGateDS } from 'app/data-sources/in-gate';
import { InGateCleaningDS, InGateCleaningItem } from 'app/data-sources/in-gate-cleaning';
import { JobOrderDS, JobOrderGO, JobOrderItem, UpdateJobOrderRequest } from 'app/data-sources/job-order';
import { RepairItem } from 'app/data-sources/repair';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { TimeTableDS, TimeTableItem } from 'app/data-sources/time-table';
import { ComponentUtil } from 'app/utilities/component-util';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { BayOverviewComponent } from "../bay-overview/bay-overview.component";
import { FormDialogComponent } from './form-dialog/form-dialog.component';

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
    BayOverviewComponent
  ]
})
export class JobOrderCleaningComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @ViewChild(BayOverviewComponent) bayOverviewComponent!: BayOverviewComponent;
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

  pageTitle = 'MENUITEMS.REPAIR.LIST.JOB-ORDER'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.CLEANING.TEXT', route: '/admin/cleaning/job-order' }
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
    JOB_ORDER_NO: 'COMMON-FORM.JOB-ORDER-NO',
    PROCESS: "COMMON-FORM.PROCESS",
    QC: 'COMMON-FORM.QC',
    BAY_OVERVIEW: "COMMON-FORM.BAY-OVERVIEW",
    SEARCH: 'COMMON-FORM.SEARCH',
  }

  filterCleanForm?: UntypedFormGroup;
  filterJobOrderForm?: UntypedFormGroup;

  cvDS: CodeValuesDS;
  soDS: StoringOrderDS;
  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  tcDS: TariffCleaningDS;
  igDS: InGateDS;
  cleanDS: InGateCleaningDS;
  joDS: JobOrderDS;
  ttDS: TimeTableDS;
  cmDS: CleaningMethodDS;

  availableProcessStatus: string[] = [
    'APPROVED',
    'JOB_IN_PROGRESS',
    //'ASSIGNED',
    //'NO_ACTION',
    //'CANCELED'
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
    this.initSearchForm();
    this.lastCargoControl = new UntypedFormControl('', [Validators.required, AutocompleteSelectionValidator(this.last_cargoList)]);
    this.soDS = new StoringOrderDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.cleanDS = new InGateCleaningDS(this.apollo);
    this.ttDS = new TimeTableDS(this.apollo);
    this.joDS = new JobOrderDS(this.apollo);
    this.cmDS = new CleaningMethodDS(this.apollo);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.initializeFilterCustomerCompany();
    this.loadData();
  }

  refresh() {
    this.refreshTable();
  }

  initSearchForm() {
    this.filterCleanForm = this.fb.group({
      filterClean: [''],
      cleanMethod: [''],
      status_cv: [''],
      customer: [''],
      eir_dt_start: [''],
      eir_dt_end: [''],
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
    this.onFilterCleaning();
    //  this.onFilterJobOrder();

    const queries = [
      { alias: 'processStatusCv', codeValType: 'PROCESS_STATUS' },
      { alias: 'soStatusCv', codeValType: 'SO_STATUS' },
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' }
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

  onFilterCleaning() {
    const where: any = {
      and: [
        {
          storing_order_tank: {
            tank_status_cv: { in: ["CLEANING"] },
            purpose_cleaning: { eq: true }
          }
        }
      ]
    };

    if (this.filterCleanForm!.get('cleanMethod')?.value) {
      where.and.push({
        storing_order_tank: { tariff_cleaning: { cleaning_method: { name: { eq: (this.filterCleanForm!.get('cleanMethod')?.value).name } } } }
      });
    }

    if (this.filterCleanForm!.get('filterClean')?.value) {
      const tankNo = this.filterCleanForm!.get('filterClean')?.value;
      where.and.push({
        storing_order_tank: {
          or: [
            { tank_no: { contains: Utility.formatContainerNumber(tankNo) } },
            { tank_no: { contains: Utility.formatTankNumberForSearch(tankNo) } }
          ]
        }
      });
    }

    if (this.filterCleanForm!.get('customer')?.value) {
      where.and.push({
        customer_company: { code: { eq: (this.filterCleanForm!.get('customer')?.value).code } }
      });
    }

    if (this.filterCleanForm?.get('status_cv')?.value.length > 0) {
      where.and.push({
        status_cv: { in: this.filterCleanForm!.get('status_cv')?.value }
      });
    } else {
      where.and.push({
        status_cv: { in: this.availableProcessStatus }
      });
    }

    if (this.filterCleanForm?.get('eir_dt_start')?.value || this.filterCleanForm?.get('eir_dt_end')?.value) {
      const igSearch: any = {}
      igSearch.eir_dt = { gte: Utility.convertDate(this.filterCleanForm!.value['eir_dt_start']), lte: Utility.convertDate(this.filterCleanForm!.value['eir_dt_end']) };
      where.and.push({
        storing_order_tank: { in_gate: { some: igSearch } }
      });
    }

    this.lastSearchCriteriaClean = this.cleanDS.addDeleteDtCriteria(where);
    this.performSearchClean(this.pageSizeClean, this.pageIndexClean, this.pageSizeClean, undefined, undefined, undefined, () => { });
  }

  onFilterJobOrder() {
    const where: any = {
      job_type_cv: { eq: "REPAIR" }
    };

    // if (this.filterJobOrderForm!.get('filterJobOrder')?.value) {
    //   where.so_no = { contains: this.filterRepairForm!.get('filterJobOrder')?.value };
    // }

    // TODO:: Get login user team
    // if (false) {
    //   where.team_guid = { eq: "" }
    // }

    this.lastSearchCriteriaJobOrder = this.joDS.addDeleteDtCriteria(where);
    this.performSearchJobOrder(this.pageSizeJobOrder, this.pageIndexJobOrder, this.pageSizeJobOrder, undefined, undefined, undefined, () => { });
  }

  performSearchClean(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, callback?: () => void) {
    this.subs.sink = this.cleanDS.search(this.lastSearchCriteriaClean, this.lastOrderByClean, first, after, last, before)
      .subscribe(data => {
        this.clnEstList = data;
        console.log(data)
        this.endCursorClean = this.cleanDS.pageInfo?.endCursor;
        this.startCursorClean = this.cleanDS.pageInfo?.startCursor;
        this.hasNextPageClean = this.cleanDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPageClean = this.cleanDS.pageInfo?.hasPreviousPage ?? false;
        this.pageIndexClean = pageIndex;
        this.paginator.pageIndex = this.pageIndexClean;
        if (!this.hasPreviousPageClean)
          this.previous_endCursorClean = undefined;
      });

    this.pageSizeClean = pageSize;
    this.pageIndexClean = pageIndex;
  }

  performSearchJobOrder(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, callback?: () => void) {
    this.subs.sink = this.joDS.searchJobOrder(this.lastSearchCriteriaJobOrder, this.lastOrderByJobOrder, first, after, last, before)
      .subscribe(data => {
        this.jobOrderList = data;
        this.endCursorJobOrder = this.joDS.pageInfo?.endCursor;
        this.startCursorJobOrder = this.joDS.pageInfo?.startCursor;
        this.hasNextPageJobOrder = this.joDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPageJobOrder = this.joDS.pageInfo?.hasPreviousPage ?? false;
        this.pageIndexJobOrder = pageIndex;
        this.paginator.pageIndex = this.pageIndexJobOrder;
        if (!this.hasPreviousPageJobOrder)
          this.previous_endCursorJobOrder = undefined;
      });

    this.pageSizeJobOrder = pageSize;
    this.pageIndexJobOrder = pageIndex;
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
      if (pageIndex > this.pageIndexClean) {
        // Navigate forward
        first = pageSize;
        after = this.endCursorClean;
      } else if (pageIndex < this.pageIndexClean && this.hasPreviousPageClean) {
        // Navigate backward
        last = pageSize;
        before = this.startCursorClean;
      } else if (pageIndex == this.pageIndexClean) {
        first = pageSize;
        after = this.previous_endCursorClean;
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
      if (pageIndex > this.pageIndexJobOrder) {
        // Navigate forward
        first = pageSize;
        after = this.endCursorJobOrder;
      } else if (pageIndex < this.pageIndexJobOrder && this.hasPreviousPageJobOrder) {
        // Navigate backward
        last = pageSize;
        before = this.startCursorJobOrder;
      } else if (pageIndex == this.pageIndexJobOrder) {
        first = pageSize;
        after = this.previous_endCursorJobOrder;
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

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
  }

  displayCleanMethodFn(cm: CleaningMethodItem): string {
    return cm ? `${cm.description} ` : '';
  }
  initializeFilterCustomerCompany() {
    this.filterCleanForm!.get('customer')!.valueChanges.pipe(
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

    this.filterCleanForm!.get('cleanMethod')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (typeof value === 'string') {
          searchCriteria = value;
        } else {
          searchCriteria = value.description;
        }
        this.subs.sink = this.cmDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { description: { contains: searchCriteria } }] }, { name: 'ASC' }, 100).subscribe(data => {
          this.cleanMethodList = data;
          this.sortList(this.cleanMethodList);
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
    this.resetForm();
    this.onFilterCleaning();
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
    this.filterCleanForm?.patchValue({
      filterRepair: '',
      cleanMethod: '',
      status_cv: '',
      customer: '',
      filterClean: '',
      eir_dt_start: '',
      eir_dt_end: ''
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
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    if (row.status_cv === 'QC_COMPLETED') action = 'view';
    var rows: InGateCleaningItem[] = [];
    rows.push(row);

    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '1000px',
      data: {
        action: action,
        langText: this.langText,
        selectedItems: rows
      },
      position: {
        top: '50px'  // Adjust this value to move the dialog down from the top of the screen
      }
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result > 0) {
          this.onPageEventClean({ pageIndex: this.pageIndexClean, pageSize: this.pageSizeClean, length: this.pageSizeClean });
        }
      }
    });
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
          if (result.data.stopJobTimer) {
            this.completeJob(jobOrderItem)
          }
        });
      }
    }
  }

  completeJob(jobOrderItem: JobOrderItem) {

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
      if (result?.data?.completeJobOrder! > 0) {
        var item: InGateCleaningItem = new InGateCleaningItem(jobOrderItem.cleaning![0]!);
        this.UpdateCleaningStatusCompleted(item.guid!);
      }
    });
  }

  UpdateCleaningStatusInProgress(clean_guid: string) {


    const where: any = {
      and: []
    };


    where.and.push({
      guid: { eq: clean_guid }
    });


    this.subs.sink = this.cleanDS.search(where)
      .subscribe(data => {
        if (data.length > 0) {
          var cln = data[0];
          var rep: InGateCleaningItem = new InGateCleaningItem(cln);
          rep.action = 'IN_PROGRESS';
          delete rep.storing_order_tank;
          delete rep.job_order;
          delete rep.customer_company;
          this.cleanDS.updateInGateCleaning(rep).subscribe(result => {

            console.log(result);

          });
          //  this.clnDS.
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

    this.subs.sink = this.cleanDS.search(where)
      .subscribe(data => {
        if (data.length > 0) {
          var cln = data[0];
          var rep: InGateCleaningItem = new InGateCleaningItem(cln);
          rep.action = 'COMPLETE';
          delete rep.storing_order_tank;
          delete rep.job_order;
          delete rep.customer_company;
          this.cleanDS.updateInGateCleaning(rep).subscribe(result => {
            console.log(result);
            if (result.data.updateCleaning > 0) {
              this.onFilterCleaning();
            }
          });
        }
      });
  }

  isStarted(cleanItem: InGateCleaningItem | undefined) {

    if (cleanItem?.job_order) {
      let jobOrderItem = cleanItem?.job_order;
      return jobOrderItem?.time_table?.some(x => x?.start_time && !x?.stop_time);
    }
    return false;


  }

  canStartJob(cleanItem: InGateCleaningItem | undefined) {
    if (cleanItem?.job_order) {
      return this.joDS.canStartJob(cleanItem?.job_order);
    }
    return false;

  }

  canCompleteJob(jobOrderItem: JobOrderItem | undefined, isStarted: boolean | undefined): boolean {
    return this.joDS.canCompleteJob(jobOrderItem) && !isStarted;
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

  onTabSelected(event: MatTabChangeEvent): void {
    console.log(`Selected Index: ${event.index}, Tab Label: ${event.tab.textLabel}`);
    if (event.index === 1) {
      this.bayOverviewComponent.RefreshContent();
    }
  }

  anyResidueIncomplete(row: InGateCleaningItem) {
    const foundIncomplete = row.storing_order_tank?.residue?.filter(x => ['PENDING', 'APPROVED', 'JOB_IN_PROGRESS', 'PARTIAL_ASSIGNED', 'ASSIGNED', ''].includes(x.status_cv || ''));
    return (foundIncomplete?.length || 0) > 0;
  }
}