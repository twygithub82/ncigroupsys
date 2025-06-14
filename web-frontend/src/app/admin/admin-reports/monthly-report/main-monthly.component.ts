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
import { ModulePackageService } from 'app/services/module-package.service';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { CleanMonthlyAdminReportComponent } from './clean-monthly/clean-monthly.component';
import { CustomerMonthlyAdminReportComponent } from './customer-monthly/customer-monthly.component';
import { RepairMonthlyAdminReportComponent } from './repair-monthly/repair-monthly.component';
import { ResidueMonthlyAdminReportComponent } from './residue-monthly/residue-monthly.component';
import { SteamMonthlyAdminReportComponent } from './steam-monthly/steam-monthly.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';

@Component({
  selector: 'app-main-monthly',
  standalone: true,
  templateUrl: './main-monthly.component.html',
  styleUrl: './main-monthly.component.scss',
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
    SteamMonthlyAdminReportComponent,
    ResidueMonthlyAdminReportComponent,
    RepairMonthlyAdminReportComponent,
    CleanMonthlyAdminReportComponent,
    CustomerMonthlyAdminReportComponent
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class MainMonthlyComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
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

  pageTitle = 'MENUITEMS.ADMIN-REPORTS.LIST.MONTHLY-REPORTS'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.ADMIN-REPORTS.TEXT', route: '/admin/admin-reports/main-monthly' }
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
    CLEANING: "COMMON-FORM.CLEANING",
    CLEANING_BILLING: "MENUITEMS.BILLING.LIST.CLEANING-BILL",
    STEAM_REPORT: 'MENUITEMS.TARIFF.LIST.TARIFF-STEAM',
    RESIDUE_REPORT: 'MENUITEMS.TARIFF.LIST.TARIFF-RESIDUE',
    REPAIR_REPORT: 'MENUITEMS.TARIFF.LIST.TARIFF-REPAIR',
    CLEAN_REPORT: 'MENUITEMS.TARIFF.LIST.TARIFF-CLEANING',
    CUSTOMER_REPORT: 'COMMON-FORM.CUSTOMER'
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
    private translate: TranslateService,
    public modulePackageService: ModulePackageService

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
    // this.filterCleanForm!.get('customer')!.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(300),
    //   tap(value => {
    //     var searchCriteria = '';
    //     if (typeof value === 'string') {
    //       searchCriteria = value;
    //     } else {
    //       searchCriteria = value.code;
    //     }
    //     this.subs.sink = this.ccDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
    //       this.customer_companyList = data
    //     });
    //   })
    // ).subscribe();


    // this.filterCleanForm!.get('cleanMethod')!.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(300),
    //   tap(value => {
    //     var searchCriteria = '';
    //     if (typeof value === 'string') {
    //       searchCriteria = value;
    //     } else {
    //       searchCriteria = value.description;
    //     }
    //     this.subs.sink = this.cmDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { description: { contains: searchCriteria } }] }, { name: 'ASC' }).subscribe(data => {
    //       this.cleanMethodList = data;
    //       this.sortList(this.cleanMethodList);
    //     });
    //   })
    // ).subscribe();
  }



  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  // getTankStatusDescription(codeValType: string | undefined): string | undefined {
  //   return this.cvDS.getCodeDescription(codeValType, this.tankStatusCvList);
  // }

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
    // let tempDirection: Direction;
    // if (localStorage.getItem('isRtl') === 'true') {
    //   tempDirection = 'rtl';
    // } else {
    //   tempDirection = 'ltr';
    // }

    // if(row.status_cv==='QC_COMPLETED') action='view';
    // var rows :InGateCleaningItem[] =[] ;
    // rows.push(row);


    // const dialogRef = this.dialog.open(FormDialogComponent,{

    //   width: '1000px',
    //   data: {
    //     action: action,
    //     langText: this.langText,
    //     selectedItems:rows
    //   },
    //   position: {
    //     top: '50px'  // Adjust this value to move the dialog down from the top of the screen
    //   }

    // });

    // this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    //      if (result) {
    //       if(result>0)
    //         {

    //           this.onPageEventClean({pageIndex:this.pageIndexClean,pageSize:this.pageSizeClean,length:this.pageSizeClean});
    //         }
    //   }
    //   });

  }

  toggleJobState(event: Event, isStarted: boolean | undefined, jobOrderItem: JobOrderItem) {
    //  this.stopPropagation(event);  // Prevents the form submission
    //  if (!isStarted) {
    //    const param = [new TimeTableItem({ job_order_guid: jobOrderItem?.guid, job_order: new JobOrderGO({ ...jobOrderItem }) })];
    //    console.log(param)
    //    const firstValidRepairPart = jobOrderItem.cleaning?.find(
    //      (cleaning) => cleaning?.guid !== null
    //    );
    //    this.ttDS.startJobTimer(param, firstValidRepairPart?.guid!).subscribe(result => {
    //      if (result.data.startJobTimer > 0) {
    //        var item: InGateCleaningItem = new InGateCleaningItem(jobOrderItem.cleaning![0]!);
    //        this.UpdateCleaningStatusInProgress(item.guid!);
    //      }
    //    });
    //  } else {
    //    const found = jobOrderItem?.time_table?.filter(x => x?.start_time && !x?.stop_time);
    //    if (found?.length) {
    //      const newParam = new TimeTableItem(found[0]);
    //      newParam.stop_time = Utility.convertDate(new Date()) as number;
    //      newParam.job_order = new JobOrderGO({ ...jobOrderItem });
    //      const param = [newParam];
    //      console.log(param)
    //      this.ttDS.stopJobTimer(param).subscribe(result => {
    //       if(result.data.stopJobTimer)
    //       {
    //         this.completeJob( jobOrderItem) 
    //       }

    //      });
    //    }
    //  }
  }

  completeJob(jobOrderItem: JobOrderItem) {

    //  const newParam = new UpdateJobOrderRequest({
    //    guid: jobOrderItem?.guid,
    //    remarks: jobOrderItem?.remarks,
    //    start_dt: jobOrderItem?.start_dt,
    //    complete_dt: jobOrderItem?.complete_dt ?? Utility.convertDate(new Date()) as number
    //  });
    //  const param = [newParam];
    //  console.log(param)
    //  this.joDS.completeJobOrder(param).subscribe(result => {
    //    console.log(result)
    //    if (result?.data?.completeJobOrder! > 0) {
    //      var item: InGateCleaningItem = new InGateCleaningItem(jobOrderItem.cleaning![0]!);
    //      this.UpdateCleaningStatusCompleted(item.guid!);
    //    }
    //  });
  }

  UpdateCleaningStatusInProgress(clean_guid: string) {


    // const where: any = {
    //   and: []
    // };


    // where.and.push({
    //   guid: { eq: clean_guid }
    // });


    // this.subs.sink = this.cleanDS.search(where)
    //   .subscribe(data => {
    //     if (data.length > 0) {
    //       var cln = data[0];
    //       var rep: InGateCleaningItem = new InGateCleaningItem(cln);
    //       rep.action = 'IN_PROGRESS';
    //       delete rep.storing_order_tank;
    //       delete rep.job_order;
    //       delete rep.customer_company;
    //       this.cleanDS.updateInGateCleaning(rep).subscribe(result => {

    //         console.log(result);

    //       });
    //       //  this.clnDS.
    //     }
    //   });
  }

  UpdateCleaningStatusCompleted(clean_guid: string) {


    // const where: any = {
    //   and: []
    // };

    // where.and.push({
    //   job_order: { status_cv: { eq: 'COMPLETED' } }
    // });

    // where.and.push({
    //   guid: { eq: clean_guid }
    // });


    // this.subs.sink = this.cleanDS.search(where)
    //   .subscribe(data => {
    //     if (data.length > 0) {
    //       var cln = data[0];
    //       var rep: InGateCleaningItem = new InGateCleaningItem(cln);
    //       rep.action = 'COMPLETE';
    //       delete rep.storing_order_tank;
    //       delete rep.job_order;
    //       delete rep.customer_company;
    //       this.cleanDS.updateInGateCleaning(rep).subscribe(result => {
    //         console.log(result); 
    //         if(result.data.updateCleaning>0)
    //         {
    //            this.onFilterCleaning();
    //         }


    //       });
    //       //  this.clnDS.
    //     }
    //   });
  }

  // isStarted(jobOrderItem: JobOrderItem | undefined) {
  //   return jobOrderItem?.time_table?.some(x => x?.start_time && !x?.stop_time);
  // }

  isStarted(cleanItem: InGateCleaningItem | undefined) {

    if (cleanItem?.job_order) {
      let jobOrderItem = cleanItem?.job_order;
      return jobOrderItem?.time_table?.some(x => x?.start_time && !x?.stop_time);
    }
    return false;


  }

  canStartJob(cleanItem: InGateCleaningItem | undefined) {
    // if(cleanItem?.job_order)
    // {
    //   return this.joDS.canStartJob(cleanItem?.job_order);
    // }
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

  tabConfig = [
    {
      label: this.translatedLangText.CLEAN_REPORT,
      component: 'app-clean-monthly',
      modulePackage: ['starter', 'growth', 'customized']
    },
    {
      label: this.translatedLangText.REPAIR_REPORT,
      component: 'app-repair-monthly',
      modulePackage: ['starter', 'growth', 'customized']
    },
    {
      label: this.translatedLangText.STEAM_REPORT,
      component: 'app-steam-monthly',
      modulePackage: ['growth', 'customized']
    },
    {
      label: this.translatedLangText.RESIDUE_REPORT,
      component: 'app-residue-monthly',
      modulePackage: ['growth', 'customized']
    },
    {
      label: this.translatedLangText.CUSTOMER_REPORT,
      component: 'app-customer-monthly',
      modulePackage: ['starter', 'growth', 'customized']
    }
  ];

  get allowedTabs() {
    return this.tabConfig.filter(tab =>
      tab.modulePackage.includes(this.modulePackageService.getModulePackage())
    );
  }



  @ViewChild('steamAdminReport') steamAdminReport!: SteamMonthlyAdminReportComponent;
  @ViewChild('residueAdminReport') residueAdminReport!: ResidueMonthlyAdminReportComponent;
  @ViewChild('repairAdminReport') repairAdminReport!: RepairMonthlyAdminReportComponent;
  @ViewChild('customerAdminReport') customerAdminReport!: CustomerMonthlyAdminReportComponent;
  @ViewChild('cleanAdminReport') cleanAdminReport!: CleanMonthlyAdminReportComponent;

  onTabSelected(event: MatTabChangeEvent): void {
    console.log(`Selected Index: ${event.index}, Tab Label: ${event.tab.textLabel}`);
    switch (event.index) {
      case 0:
        this.steamAdminReport?.onTabFocused(); break;
      case 1:
        this.residueAdminReport?.onTabFocused(); break;
      case 2:
        this.repairAdminReport?.onTabFocused(); break;
      case 3:
        this.cleanAdminReport?.onTabFocused(); break;
      case 4:
        this.customerAdminReport?.onTabFocused(); break;

    }
  }
}