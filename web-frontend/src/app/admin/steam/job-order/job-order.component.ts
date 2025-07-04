import { Direction } from '@angular/cdk/bidi';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
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
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { Apollo } from 'apollo-angular';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { JobOrderDS, JobOrderItem } from 'app/data-sources/job-order';
import { ResidueItem } from 'app/data-sources/residue';
import { SteamDS, SteamItem } from "app/data-sources/steam";
import { StoringOrderDS, StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { ModulePackageService } from 'app/services/module-package.service';
import { SearchStateService } from 'app/services/search-criteria.service';
import { ComponentUtil } from 'app/utilities/component-util';
import { pageSizeInfo, Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { debounceTime, startWith, tap } from 'rxjs';
import { BayOverviewComponent } from "../bay-overview/bay-overview.component";
import { JobOrderTaskComponent } from "../job-order-task/job-order-task.component";
import { FormDialogComponent } from './form-dialog/form-dialog.component';
import { ConfirmDialogService } from 'app/services/confirmation-dialog.service';

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
    JobOrderTaskComponent,
    BayOverviewComponent
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntl }
  ]
})
export class JobOrderSteamComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumnsResidue = [
    'tank_no',
    'customer',
    'estimate_no',
    'approved_dt',
    'status_cv',
    'actions',
    'unassign'
  ];

  displayedColumnsJobOrder = [
    'tank_no',
    'job_order_no',
    'customer',
    'estimate_no',
    'status_cv'
  ];

  pageTitle = 'MENUITEMS.STEAM.LIST.JOB-ORDER'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.STEAM.TEXT', route: '/admin/steam/job-order' },
  ]

  selectedTabIndex = 0;

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
    CANCELED_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
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
    METHOD: "COMMON-FORM.METHOD",
    RESIDUE_DISPOSAL: 'COMMON-FORM.RESIDUE-DISPOSAL',
    APPROVE_DATE: 'COMMON-FORM.APPROVE-DATE',
    BAY_OVERVIEW: "COMMON-FORM.BAY-OVERVIEW",
    STEAM_HEAT_TYPE: "COMMON-FORM.STEAM-HEAT-TYPE",
    REPAIR: 'COMMON-FORM.REPAIR',
    SEARCH: 'COMMON-FORM.SEARCH',
    UNASSIGNED: 'COMMON-FORM.UNASSIGN',
    CONFIRM_TEAM_UNASSIGN: "COMMON-FORM.CONFIRM-TEAM-UNASSIGN",
    ROLLBACK_SUCCESS: "COMMON-FORM.ROLLBACK-SUCCESS"
  }

  filterSteamForm?: UntypedFormGroup;
  filterJobOrderForm?: UntypedFormGroup;

  cvDS: CodeValuesDS;
  soDS: StoringOrderDS;
  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  tcDS: TariffCleaningDS;
  igDS: InGateDS;
  steamDs: SteamDS;
  joDS: JobOrderDS;

  availableProcessStatus: string[] = [
    'APPROVED',
    'JOB_IN_PROGRESS',
    //'COMPLETED',
    'ASSIGNED',
    'PARTIAL_ASSIGNED'
  ]

  rsdEstList: ResidueItem[] = [];
  jobOrderList: JobOrderItem[] = [];
  soStatusCvList: CodeValuesItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  processStatusCvList: CodeValuesItem[] = [];

  customerCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  customer_companyList?: CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];

  pageStateType = 'SteamJobAllocation'
  previous_endCursorSteam: string | undefined = undefined;
  pageIndexSteam = 0;
  pageSizeSteam = pageSizeInfo.defaultSize;
  lastSearchCriteriaSteam: any;
  lastOrderBySteam: any = { storing_order_tank: { tank_no: "DESC" } };
  endCursorSteam: string | undefined = undefined;
  startCursorSteam: string | undefined = undefined;
  hasNextPageSteam = false;
  hasPreviousPageSteam = false;

  isActiveTab = 0;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public confirmDialog: ConfirmDialogService,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private searchStateService: SearchStateService,
    private modulePackageService: ModulePackageService
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

    this.joDS = new JobOrderDS(this.apollo);
    this.steamDs = new SteamDS(this.apollo);

    var tabIdx = this.route.snapshot.paramMap.get('idx');
    if (tabIdx) this.isActiveTab = Number(tabIdx);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tabIndex = params['tabIndex'];
      if (tabIndex) {
        this.selectedTabIndex = tabIndex
      }
    });
    this.initializeFilterCustomerCompany();
    this.searchStateService.clearOtherPages(this.pageStateType);
    this.loadData();
  }

  refresh() {
    this.refreshTable();
  }

  initSearchForm() {
    this.filterSteamForm = this.fb.group({
      filterSteam: [''],
      status_cv: [''],
      customer: ['']
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
    const savedCriteria = this.searchStateService.getCriteria(this.pageStateType);
    const savedPagination = this.searchStateService.getPagination(this.pageStateType);

    if (savedCriteria) {
      this.filterSteamForm?.patchValue(savedCriteria);
      this.constructSearchCriteria();
    }

    if (savedPagination) {
      this.pageIndexSteam = savedPagination.pageIndex;
      this.pageSizeSteam = savedPagination.pageSize;

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
      this.onFilterSteam();
    }
  }

  cancelSelectedRows(row: StoringOrderItem[]) {
  }

  public loadData() {
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

    const savedCriteria = this.searchStateService.getCriteria(this.pageStateType);
    const savedPagination = this.searchStateService.getPagination(this.pageStateType);

    if (savedCriteria) {
      this.filterSteamForm?.patchValue(savedCriteria);
      this.constructSearchCriteria();
    }

    if (savedPagination) {
      this.pageIndexSteam = savedPagination.pageIndex;
      this.pageSizeSteam = savedPagination.pageSize;

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
      this.onFilterSteam();
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

  constructSearchCriteria() {
    const where: any = {
      and: [
        { storing_order_tank: { tank_status_cv: { in: ["STEAM"] } } }
      ]
    };

    where.and.push({
      status_cv: {
        neq: 'PENDING'
      }
    });

    if (this.filterSteamForm!.get('status_cv')?.value?.length) {
      where.and.push({
        status_cv: {
          in: this.filterSteamForm!.get('status_cv')?.value
        }
      });
    } else {
      where.and.push({
        status_cv: {
          in: this.availableProcessStatus
        }
      });
    }

    if (this.filterSteamForm!.get('filterSteam')?.value) {
      const tankNo = this.filterSteamForm!.get('filterSteam')?.value;
      where.and.push({
        storing_order_tank: {
          or: [
            { tank_no: { contains: Utility.formatContainerNumber(tankNo) } },
            { tank_no: { contains: Utility.formatTankNumberForSearch(tankNo) } }
          ]
        }
      });
    }

    if (this.filterSteamForm!.get('customer')?.value) {
      where.and.push({
        storing_order_tank: { storing_order: { customer_company: { code: { eq: (this.filterSteamForm!.get('customer')?.value).code } } } }
      });
    }

    this.lastSearchCriteriaSteam = this.steamDs.addDeleteDtCriteria(where);
  }

  onFilterSteam() {
    this.constructSearchCriteria();
    this.performSearch(this.pageSizeSteam, 0, this.pageSizeSteam, undefined, undefined, undefined, () => { });
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, callback?: () => void) {
    this.searchStateService.setCriteria(this.pageStateType, this.filterSteamForm?.value);
    this.searchStateService.setPagination(this.pageStateType, {
      pageSize,
      pageIndex,
      first,
      after,
      last,
      before
    });
    console.log(this.searchStateService.getPagination(this.pageStateType))
    this.subs.sink = this.steamDs.search(this.lastSearchCriteriaSteam, this.lastOrderBySteam, first, after, last, before)
      .subscribe(data => {
        this.rsdEstList = data.map(re => {
          return { ...re, net_cost: this.calculateNetCost(re) }
        });
        this.endCursorSteam = this.steamDs.pageInfo?.endCursor;
        this.startCursorSteam = this.steamDs.pageInfo?.startCursor;
        this.hasNextPageSteam = this.steamDs.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPageSteam = this.steamDs.pageInfo?.hasPreviousPage ?? false;
      });

    this.pageSizeSteam = pageSize;
    this.pageIndexSteam = pageIndex;
  }

  onPageEventSteam(event: PageEvent) {
    const { pageIndex, pageSize } = event;
    let first: number | undefined = undefined;
    let after: string | undefined = undefined;
    let last: number | undefined = undefined;
    let before: string | undefined = undefined;

    // Check if the page size has changed
    if (this.pageSizeSteam !== pageSize) {
      // Reset pagination if page size has changed
      this.pageIndexSteam = 0;
      first = pageSize;
      after = undefined;
      last = undefined;
      before = undefined;
    } else {
      if (pageIndex > this.pageIndexSteam && this.hasNextPageSteam) {
        // Navigate forward
        first = pageSize;
        after = this.endCursorSteam;
      } else if (pageIndex < this.pageIndexSteam && this.hasPreviousPageSteam) {
        // Navigate backward
        last = pageSize;
        before = this.startCursorSteam;
      }
    }

    this.performSearch(pageSize, pageIndex, first, after, last, before, () => { });
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} - ${cc.name}` : '';
  }

  initializeFilterCustomerCompany() {
    this.filterSteamForm!.get('customer')!.valueChanges.pipe(
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
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  getTankStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.tankStatusCvList);
  }

  calculateNetCost(steam: SteamItem): any {


    const total = this.steamDs.getTotal(steam?.steaming_part)

    return total.total_mat_cost?.toFixed(2);
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
    this.onFilterSteam();

  }

  resetForm() {
    this.filterSteamForm?.patchValue({
      filterSteam: '',
      status_cv: '',
      customer: ''
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

  AllocationSteamEstimate(event: Event, row: SteamItem) {
    event.stopPropagation(); // Stop the click event from propagating
    // Navigate to the route and pass the JSON object
    // if(row.approve_by?.toUpperCase()!=="SYSTEM")
    if (this.canToggleJob(row)) {
      this.router.navigate(['/admin/steam/job-order/allocation/', row.guid], {
        state: {
          id: '',
          action: "UPDATE",
          selectedRow: row,
          type: 'steam',
          pagination: {
            where: this.lastSearchCriteriaSteam,
            pageSize: this.pageSizeSteam,
            pageIndex: this.pageIndexSteam,
            hasPreviousPage: this.hasPreviousPageSteam,
            startCursor: this.startCursorSteam,
            endCursor: this.endCursorSteam,
            previous_endCursor: this.previous_endCursorSteam,

            showResult: this.steamDs.totalCount > 0
          }
        }
      });
    }
    else {
      this.popupDialogForm(row, "allocation");
    }
  }

  getStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.processStatusCvList);
  }

  popupDialogForm(row: SteamItem, action: string) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    if (row.status_cv === 'QC_COMPLETED') action = 'view';
    var rows: SteamItem[] = [];
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
          var where: any = {
            guid: { eq: row.guid }
          };

          this.steamDs.search(where).subscribe(data => {
            if (data.length > 0) {
              if (row.status_cv === 'APPROVED') {
                var steamParts: any = data[0].steaming_part;
                var joborder_guid: string = steamParts[0].job_order_guid;
                this.router.navigate(['/admin/steam/job-order/monitor', joborder_guid, row.guid]);
              }
              else {
                this.onFilterSteam();
              }
            }
          }
          );

          // this.router.navigate(['/admin/steam/job-order/allocation/',row.guid], {
          //   state: { id: '' ,
          //     action:"UPDATE",
          //     selectedRow:row,
          //     type:'steam',
          //     pagination:{
          //       where :this.lastSearchCriteriaSteam,
          //       pageSize:this.pageSizeSteam,
          //       pageIndex:this.pageIndexSteam,
          //       hasPreviousPage:this.hasPreviousPageSteam,
          //       startCursor:this.startCursorSteam,
          //       endCursor:this.endCursorSteam,
          //       previous_endCursor:this.previous_endCursorSteam,

          //       showResult: this.steamDs.totalCount>0

          //     }
          //   }
          // });
          //this.onPageEventSteam({pageIndex:this.pageIndexSteam,pageSize:this.pageSizeSteam,length:this.pageSizeSteam});
        }
      }
    });
  }

  canToggleJob(steam: SteamItem | undefined) {
    return this.steamDs.IsSteamRepair(steam);
    // var retval
    // retval = (steam?.steaming_part?.[0]?.tariff_steaming_guid === null && steam?.steaming_part?.[0]?.steaming_exclusive_guid === null);
    // return retval;
  }

  onTabChange(index: number) {
    this.router.navigate([], { queryParams: { tabIndex: index }, queryParamsHandling: 'merge' });
  }

  ConfirmUnassignTeam(event: Event, row: SteamItem) {
    this.stopEventTrigger(event);
    this.ConfirmUnassignDialog(event, row);
  }

  ConfirmUnassignDialog(event: Event, row: SteamItem) {
    event.preventDefault(); // Prevents the form submission

    const data: any = {
      headerText: this.translatedLangText.CONFIRM_TEAM_UNASSIGN,
      action: 'new',
      allowRemarks: true,
    }
    const dialogRef = this.confirmDialog.open(data);
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result.action === 'confirmed') {
        const remarks = result.remarks || '';
        this.UnassignEstimate(row, remarks);
      }
    });
  }

  UnassignEstimate(row: SteamItem, remarks: string) {
    this.subs.sink = this.steamDs.rollbackAssignedSteam([row.guid!], remarks)
      .subscribe((result: any) => {
        if (result.data.rollbackAssignedSteaming) {
          this.handleRollbackSuccess(result.data.rollbackAssignedSteaming);
        }
      });

  }

  handleRollbackSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.ROLLBACK_SUCCESS;
      ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
      this.refreshTable();
    }
  }

  onTabFocused() {
    this.resetForm();
    this.onFilterSteam();
  }



  @ViewChild('steamJobOrderTask') steamJobOrderTask!: JobOrderTaskComponent;
  @ViewChild('steamBayOverview') steamBayOverview!: BayOverviewComponent;

  onTabSelected(event: MatTabChangeEvent): void {
    console.log(`Selected Index: ${event.index}, Tab Label: ${event.tab.textLabel}`);
    switch (event.index) {

      case 0:
        this.onTabFocused(); break;
      case 1:
        this.steamJobOrderTask?.onTabFocused(); break;
      case 2:
        this.steamBayOverview?.onTabFocused(); break;
    }
  }

  canUnassignTeam(row: SteamItem | undefined) {
    return this.isAllowDelete() && (row?.status_cv === 'ASSIGNED' || row?.status_cv === 'PARTIAL_ASSIGNED') && !row.complete_dt;
  }

  isAllowDelete() {
    return this.modulePackageService.hasFunctions(['STEAMING_JOB_ALLOCATION_DELETE']);
  }
}