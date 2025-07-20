import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
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
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem, addDefaultSelectOption } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { ReleaseOrderDS, ReleaseOrderGO, ReleaseOrderItem } from 'app/data-sources/release-order';
import { StoringOrderDS, StoringOrderItem } from 'app/data-sources/storing-order';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { ModulePackageService } from 'app/services/module-package.service';
import { SearchStateService } from 'app/services/search-criteria.service';
import { ComponentUtil } from 'app/utilities/component-util';
import { pageSizeInfo, Utility } from 'app/utilities/utility';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { CancelFormDialogComponent } from './dialogs/cancel-form-dialog/form-dialog.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { GlobalMaxCharDirective } from 'app/directive/global-max-char.directive';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-release-order',
  standalone: true,
  templateUrl: './release-order.component.html',
  styleUrl: './release-order.component.scss',
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
    GlobalMaxCharDirective
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class ReleaseOrderComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    // 'select',
    // 'ro_no',
    // 'customer_code',
    // 'ro_dt',
    // 'status',
    // 'no_of_tanks',
    // // 'waiting_status',
    // // 'accept_status',
    // // 'cancel_status',
    // 'actions'
    ''
  ];

  pageTitle = 'MENUITEMS.INVENTORY.LIST.RELEASE-ORDER'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.INVENTORY.TEXT', route: '/admin/inventory/release-order' }
  ]

  translatedLangText: any = {};
  langText = {
    STATUS: 'COMMON-FORM.STATUS',
    SO_NO: 'COMMON-FORM.SO-NO',
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    CUSTOMER_NAME: 'COMMON-FORM.CUSTOMER-NAME',
    SO_DATE: 'COMMON-FORM.SO-DATE',
    NO_OF_TANKS: 'COMMON-FORM.NO-OF-TANKS',
    LAST_CARGO: 'COMMON-FORM.LAST-CARGO',
    TANK_NO: 'COMMON-FORM.TANK-NO',
    JOB_NO: 'COMMON-FORM.JOB-NO',
    PURPOSE: 'COMMON-FORM.PURPOSE',
    ETA_DATE: 'COMMON-FORM.ETA-DATE',
    NO_RESULT: 'COMMON-FORM.NO-RESULT',
    CONFIRM_CANCEL: 'COMMON-FORM.CONFIRM-CANCEL',
    CONFIRM_DELTE: 'COMMON-FORM.CONFIRM-DELETE',
    CANCEL: 'COMMON-FORM.CANCEL',
    CLOSE: 'COMMON-FORM.CLOSE',
    TO_BE_CANCELED: 'COMMON-FORM.TO-BE-CANCELED',
    CANCELED_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    ADD: 'COMMON-FORM.ADD',
    NEW: 'COMMON-FORM.NEW',
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
    RO_NO: 'COMMON-FORM.RO-NO',
    RO_DATE: 'COMMON-FORM.RO-DATE',
    EIR_DATE: 'COMMON-FORM.EIR-DATE',
    EIR_NO: 'COMMON-FORM.EIR-NO',
    CONFIRM_CLEAR_ALL: 'COMMON-FORM.CONFIRM-CLEAR-ALL',
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    RELEASE_DATE: 'COMMON-FORM.RELEASE-DATE',
    SEARCH: 'COMMON-FORM.SEARCH',
    DELETE: 'COMMON-FORM.DELETE',
  }

  searchForm?: UntypedFormGroup;

  cvDS: CodeValuesDS;
  soDS: StoringOrderDS;
  ccDS: CustomerCompanyDS;
  tcDS: TariffCleaningDS;
  roDS: ReleaseOrderDS;

  roList: ReleaseOrderItem[] = [];
  roSelection = new SelectionModel<ReleaseOrderItem>(true, []);
  selectedItemsPerPage: { [key: number]: Set<string> } = {};
  soStatusCvList: CodeValuesItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  roStatusCvList: CodeValuesItem[] = [];
  schedulingStatusCvList: CodeValuesItem[] = [];

  customerCodeControl = new UntypedFormControl();
  customer_companyList?: CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];

  pageStateType = 'ReleaseOrder'
  pageIndex = 0;
  pageSize = pageSizeInfo.defaultSize;
  lastSearchCriteria: any;
  lastOrderBy: any = { ro_no: "DESC" };
  endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;

  currentStartCursor: string | undefined = undefined;
  currentEndCursor: string | undefined = undefined;
  lastCursorDirection: string | undefined = undefined;

  todayDt = new Date();

  constructor(
    private route: ActivatedRoute,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private searchStateService: SearchStateService,
    public modulePackageService: ModulePackageService
  ) {
    super();
    searchStateService.clearOtherPages(this.pageStateType);
    this.translateLangText();
    this.initSearchForm();
    this.soDS = new StoringOrderDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);
    this.roDS = new ReleaseOrderDS(this.apollo);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.initializeFilterCustomerCompany();
    this.searchStateService.clearOtherPages(this.pageStateType);
    this.loadData();
    this.displayColumnChanged();
  }

  refresh() {
    this.refreshTable();
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      ro_no: [''],
      customer_code: this.customerCodeControl,
      ro_status: [''],
      tank_no: [''],
      job_no: [''],
      eir_no: [''],
      etr_dt_start: [''],
      etr_dt_end: [''],
      purpose: [''],
      release_dt: [''],
      due_dt: ['']
    });
  }

  cancelItem(row: StoringOrderItem) {
    // this.id = row.id;
    this.cancelSelectedRows([row])
  }

  displayColumnChanged() {
    if (this.getPackages()) {
      this.displayedColumns = [
        'select',
        'ro_no',
        'customer_code',
        'no_of_tanks',
        'status',
        'ro_dt',
        'actions'
      ];
    } else {
      this.displayedColumns = [
        'ro_no',
        'customer_code',
        'no_of_tanks',
        'status',
        'ro_dt',
        'actions'
      ];
    }
  };

  getPackages(): boolean {
    if (this.modulePackageService.isGrowthPackage() || this.modulePackageService.isCustomizedPackage())
      return true;
    else
      return false;
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set();
    const numSelected = selectedItems.size;
    const numRows = this.roList.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.clearPageSelection();
    } else {
      this.selectAllOnPage();
    }
  }

  /** Clear selection on the current page */
  clearPageSelection() {
    const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set();
    this.roList.forEach(row => {
      this.roSelection.deselect(row);
      selectedItems.delete(row.guid!);
    });
    this.selectedItemsPerPage[this.pageIndex] = selectedItems;
  }

  /** Select all items on the current page */
  selectAllOnPage() {
    const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set();
    this.roList.forEach(row => {
      this.roSelection.select(row);
      selectedItems.add(row.guid!);
    });
    this.selectedItemsPerPage[this.pageIndex] = selectedItems;
  }

  /** Handle row selection */
  toggleRow(row: StoringOrderItem) {
    this.roSelection.toggle(row);
    const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set();
    if (this.roSelection.isSelected(row)) {
      selectedItems.add(row.guid!);
    } else {
      selectedItems.delete(row.guid!);
    }
    this.selectedItemsPerPage[this.pageIndex] = selectedItems;
  }

  /** Update selection for the current page */
  updatePageSelection() {
    this.roSelection.clear();
    const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set();
    this.roList.forEach(row => {
      if (selectedItems.has(row.guid!)) {
        this.roSelection.select(row);
      }
    });
  }

  onPageEvent(event: PageEvent) {
    const { pageIndex, pageSize } = event;
    let first: number | undefined = undefined;
    let after: string | undefined = undefined;
    let last: number | undefined = undefined;
    let before: string | undefined = undefined;

    // Check if the page size has changed
    if (this.pageSize !== pageSize) {
      // Reset pagination if page size has changed
      this.pageIndex = 0;
      first = pageSize;
      after = undefined;
      last = undefined;
      before = undefined;
    } else {
      if (pageIndex > this.pageIndex && this.hasNextPage) {
        // Navigate forward
        this.lastCursorDirection = 'forward';
        first = pageSize;
        after = this.endCursor;
      } else if (pageIndex < this.pageIndex && this.hasPreviousPage) {
        // Navigate backward
        this.lastCursorDirection = 'backward';
        last = pageSize;
        before = this.startCursor;
      }
    }

    this.performSearch(pageSize, pageIndex, first, after, last, before, () => {
      this.updatePageSelection();
    });
  }

  triggerCurrentSearch() {
    let first: number | undefined = undefined;
    let after: string | undefined = undefined;
    let last: number | undefined = undefined;
    let before: string | undefined = undefined;

    if (this.pageIndex === 0) {
      first = this.pageSize;
    } else if (this.lastCursorDirection === 'forward') {
      first = this.pageSize;
      after = this.currentEndCursor;
    } else if (this.lastCursorDirection === 'backward') {
      last = this.pageSize;
      before = this.currentStartCursor;
    }

    // Perform the search
    this.performSearch(
      this.pageSize,
      this.pageIndex,
      first,
      after,
      last,
      before,
      () => {
        this.updatePageSelection(); // Callback for UI updates
      }
    );
  }

  canCancelSelectedRows(): boolean {
    return !this.roSelection.hasValue() || !this.roSelection.selected.every((item) => {
      const index: number = this.roList.findIndex((d) => d === item);
      return this.roDS.canCancel(this.roList[index]);
    });
  }

  cancelSelectedRows(row: ReleaseOrderItem[]) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(CancelFormDialogComponent, {
      disableClose: true,
      width: "380px",
      data: {
        item: [...row],
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const ro = result.item.map((item: ReleaseOrderItem) => new ReleaseOrderGO(item));
        console.log(ro);
        this.roDS.cancelReleaseOrder(ro).subscribe(result => {
          if ((result?.data?.cancelReleaseOrder ?? 0) > 0) {
            let successMsg = this.langText.CANCELED_SUCCESS;
            this.translate.get(this.langText.CANCELED_SUCCESS).subscribe((res: string) => {
              successMsg = res;
              ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
              this.refreshTable();
            });
          }
        });
      }
    });
  }

  public loadData() {
    const queries = [
      { alias: 'soStatusCv', codeValType: 'SO_STATUS' },
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'roStatusCv', codeValType: 'RO_STATUS' }
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('soStatusCv').subscribe(data => {
      this.soStatusCvList = data;
      this.soStatusCvList = addDefaultSelectOption(this.soStatusCvList, 'All');
    });
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      this.purposeOptionCvList = data;
    });
    this.cvDS.connectAlias('roStatusCv').subscribe(data => {
      this.roStatusCvList = data;
    });

    var actionId = this.route.snapshot.paramMap.get('id');
    if (["pending", "publish"].includes(actionId!)) {
      this.loadData_dashboard_query();
    } else {
      const savedCriteria = this.searchStateService.getCriteria(this.pageStateType);
      const savedPagination = this.searchStateService.getPagination(this.pageStateType);

      if (savedCriteria) {
        this.searchForm?.patchValue(savedCriteria);
        this.constructSearchCriteria();
      }

      if (savedPagination) {
        this.pageIndex = savedPagination.pageIndex;
        this.pageSize = savedPagination.pageSize;

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
        this.search();
      }
    }
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, callback?: () => void) {
    this.searchStateService.setCriteria(this.pageStateType, this.searchForm?.value);
    this.searchStateService.setPagination(this.pageStateType, {
      pageSize,
      pageIndex,
      first,
      after,
      last,
      before
    });
    console.log(this.searchStateService.getPagination(this.pageStateType))
    this.roDS.searchReleaseOrder(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {
        this.roList = data;
        this.endCursor = this.roDS.pageInfo?.endCursor;
        this.startCursor = this.roDS.pageInfo?.startCursor;
        this.hasNextPage = this.roDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPage = this.roDS.pageInfo?.hasPreviousPage ?? false;

        this.currentEndCursor = after;
        this.currentStartCursor = before;

        // Execute the callback if provided
        if (callback) {
          callback();
        } else {
          this.updatePageSelection();
        }
      });

    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
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
    const where: any = {};

    if (this.searchForm!.get('due_dt')?.value) {
      var dueDt = this.searchForm!.get('due_dt')?.value;
      where.and = [
        // { or:[{ delete_dt:{eq: null}},{ delete_dt:{eq:0}}]},
        { release_dt: { lte: dueDt } },
        { status_cv: { in: ['PENDING'] } }]

    }

    if (this.searchForm!.get('ro_no')?.value) {
      where.ro_no = { contains: this.searchForm!.get('ro_no')?.value?.trim() };
    }

    if (this.searchForm!.get('ro_status')?.value) {
      where.status_cv = { contains: this.searchForm!.get('ro_status')?.value?.trim() };
    }

    if (this.searchForm!.get('release_dt')?.value) {
      const releaseDt = this.searchForm!.get('release_dt')?.value?.clone()
      where.release_dt = {
        gte: Utility.convertDate(releaseDt),
        lte: Utility.convertDate(releaseDt, true),
      };
    } else {
      // const releaseDt = this.todayDt
      // where.release_dt = {
      //   gte: Utility.convertDate(releaseDt),
      // };
    }

    if (this.searchForm!.get('tank_no')?.value || this.searchForm!.get('job_no')?.value) {
      const sotSome: any = {};

      if (this.searchForm!.get('tank_no')?.value) {
        const tankNo = this.searchForm!.get('tank_no')?.value
        sotSome.or = [
          { tank_no: { contains: Utility.formatContainerNumber(tankNo) } },
          { tank_no: { contains: Utility.formatTankNumberForSearch(tankNo) } }
        ];
      }

      if (this.searchForm!.get('job_no')?.value) {
        sotSome.release_job_no = { contains: this.searchForm!.get('job_no')?.value?.trim() };
      }
      where.release_order_sot = { some: { storing_order_tank: sotSome } };
    }

    if (this.searchForm!.get('customer_code')?.value) {
      where.customer_company = { code: { contains: this.searchForm!.get('customer_code')?.value.code } };
    }

    this.lastSearchCriteria = this.soDS.addDeleteDtCriteria(where);
  }

  search() {
    this.constructSearchCriteria();
    this.performSearch(this.pageSize, 0, this.pageSize, undefined, undefined, undefined, () => {
      this.updatePageSelection();
    });
  }

  initializeFilterCustomerCompany() {
    this.searchForm!.get('customer_code')!.valueChanges.pipe(
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

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} - ${cc.name}` : '';
    //return this.ccDS.displayName(cc);
  }

  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
  }

  displayDate(input: number | null | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input as number);
  }

  getReleaseOrderStatusDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.roStatusCvList);
  }

  getSchedulingStatusDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.roStatusCvList);
  }

  resetDialog(event: Event) {
    event.preventDefault(); // Prevents the form submission
    this.resetForm();
    this.search();
  }

  resetForm() {
    this.searchForm?.patchValue({
      ro_no: '',
      ro_status: '',
      tank_no: '',
      job_no: '',
      eir_no: '',
      etr_dt_start: '',
      etr_dt_end: '',
      purpose: '',
      release_dt: '',
    });
    this.customerCodeControl.reset('');
  }

  public loadData_dashboard_query() {
    const today = new Date();
    const pastLimit = new Date(today);

    pastLimit.setDate(pastLimit.getDate() + 3); // 0.5 year = 6 months
    var dueDt = Utility.convertDate(pastLimit, true, true);

    const where: any = {
      and: [
        { or: [{ delete_dt: { eq: null } }, { delete_dt: { eq: 0 } }] },
        { release_dt: { lte: dueDt } },
        { status_cv: { in: ['PENDING', 'PROCESSING'] } }
      ]
    };


    this.lastSearchCriteria = where;
    this.performSearch(this.pageSize, 0, this.pageSize, undefined, undefined, undefined);
    console.log("search pending records");
  }
}