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
import { Observable, fromEvent } from 'rxjs';
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

@Component({
  selector: 'app-storing-order',
  standalone: true,
  templateUrl: './storing-order.component.html',
  styleUrl: './storing-order.component.scss',
  imports: [
    BreadcrumbComponent,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatCheckboxModule,
    FeatherIconsComponent,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatPaginatorModule,
    DatePipe,
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
  ]
})
export class StoringOrderComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'select',
    'so_no',
    'customer_code',
    'no_of_tanks',
    'status',
    'waiting_status',
    'accept_status',
    'cancel_status',
    'actions'
  ];

  pageTitle = 'MENUITEMS.INVENTORY.LIST.STORING-ORDER'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT'
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
    CONFIRM: 'COMMON-FORM.CONFIRM'
  }

  searchForm?: UntypedFormGroup;

  cvDS: CodeValuesDS;
  soDS: StoringOrderDS;
  ccDS: CustomerCompanyDS;
  tcDS: TariffCleaningDS;

  soList: StoringOrderItem[] = [];
  soSelection = new SelectionModel<StoringOrderItem>(true, []);
  selectedItemsPerPage: { [key: number]: Set<string> } = {};
  soStatusCvList: CodeValuesItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];

  customerCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  customer_companyList?: CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];

  pageIndex = 0;
  pageSize = 10;
  lastSearchCriteria: any;
  lastOrderBy: any = { so_no: "DESC" };
  endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;

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
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);
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
    this.searchForm = this.fb.group({
      so_no: [''],
      customer_code: this.customerCodeControl,
      last_cargo: this.lastCargoControl,
      so_status: [''],
      tank_no: [''],
      job_no: [''],
      purpose: [''],
      eta_dt_start: [''],
      eta_dt_end: [''],
    });
  }

  cancelItem(row: StoringOrderItem) {
    // this.id = row.id;
    this.cancelSelectedRows([row])
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set();
    const numSelected = selectedItems.size;
    const numRows = this.soList.length;
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
    this.soList.forEach(row => {
      this.soSelection.deselect(row);
      selectedItems.delete(row.guid!);
    });
    this.selectedItemsPerPage[this.pageIndex] = selectedItems;
  }

  /** Select all items on the current page */
  selectAllOnPage() {
    const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set();
    this.soList.forEach(row => {
      this.soSelection.select(row);
      selectedItems.add(row.guid!);
    });
    this.selectedItemsPerPage[this.pageIndex] = selectedItems;
  }

  /** Handle row selection */
  toggleRow(row: StoringOrderItem) {
    this.soSelection.toggle(row);
    const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set();
    if (this.soSelection.isSelected(row)) {
      selectedItems.add(row.guid!);
    } else {
      selectedItems.delete(row.guid!);
    }
    this.selectedItemsPerPage[this.pageIndex] = selectedItems;
  }

  /** Update selection for the current page */
  updatePageSelection() {
    this.soSelection.clear();
    const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set();
    this.soList.forEach(row => {
      if (selectedItems.has(row.guid!)) {
        this.soSelection.select(row);
      }
    });
  }

  canCancelSelectedRows(): boolean {
    return !this.soSelection.hasValue() || !this.soSelection.selected.every((item) => {
      const index: number = this.soList.findIndex((d) => d === item);
      return this.soDS.canCancel(this.soList[index]);
    });
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
    this.lastSearchCriteria = this.soDS.addDeleteDtCriteria({});
    this.subs.sink = this.soDS.searchStoringOrder(this.lastSearchCriteria, this.lastOrderBy).subscribe(data => {
      if (this.soDS.totalCount > 0) {
        this.soList = data;
        this.endCursor = this.soDS.pageInfo?.endCursor;
        this.startCursor = this.soDS.pageInfo?.startCursor;
        this.hasNextPage = this.soDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPage = this.soDS.pageInfo?.hasPreviousPage ?? false;
      }
    });

    const queries = [
      { alias: 'soStatusCv', codeValType: 'SO_STATUS' },
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' }
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('soStatusCv').subscribe(data => {
      this.soStatusCvList = data;
      this.soStatusCvList = addDefaultSelectOption(this.soStatusCvList, 'All');
    });
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      this.purposeOptionCvList = data;
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

  search() {
    const where: any = {};

    if (this.searchForm!.value['so_no']) {
      where.so_no = { contains: this.searchForm!.value['so_no'] };
    }

    if (this.searchForm!.value['so_status']) {
      where.status_cv = { contains: this.searchForm!.value['so_status'] };
    }

    if (this.searchForm!.value['tank_no'] || this.searchForm!.value['job_no'] || (this.searchForm!.value['eta_dt_start'] && this.searchForm!.value['eta_dt_end'])) {
      const sotSome: any = {};

      if (this.searchForm!.value['last_cargo']) {
        where.last_cargo = { contains: this.searchForm!.value['last_cargo'].code };
      }

      if (this.searchForm!.value['tank_no']) {
        sotSome.tank_no = { contains: this.searchForm!.value['tank_no'] };
      }

      if (this.searchForm!.value['job_no']) {
        sotSome.job_no = { contains: this.searchForm!.value['job_no'] };
      }

      if (this.searchForm!.value['eta_dt_start'] && this.searchForm!.value['eta_dt_end']) {
        sotSome.eta_dt = { gte: Utility.convertDate(this.searchForm!.value['eta_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eta_dt_end']) };
      }
      where.storing_order_tank = { some: sotSome };
    }

    if (this.searchForm!.value['customer_code']) {
      where.customer_company = { code: { contains: this.searchForm!.value['customer_code'].code } };
    }

    this.lastSearchCriteria = this.soDS.addDeleteDtCriteria(where);
    // TODO :: search criteria
    this.subs.sink = this.soDS.searchStoringOrder(this.lastSearchCriteria, this.lastOrderBy).subscribe(data => {
      this.soList = data;
      this.endCursor = this.soDS.pageInfo?.endCursor;
      this.startCursor = this.soDS.pageInfo?.startCursor;
      this.hasNextPage = this.soDS.pageInfo?.hasNextPage ?? false;
      this.hasPreviousPage = this.soDS.pageInfo?.hasPreviousPage ?? false;
    });
  }

  onPageEvent(event: PageEvent) {
    const { pageIndex, pageSize } = event;
    let first = pageSize;
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
        first = pageSize;
        after = this.endCursor;
      } else if (pageIndex < this.pageIndex && this.hasPreviousPage) {
        // Navigate backward
        last = pageSize;
        before = this.startCursor;
      }
    }

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    this.soDS.searchStoringOrder(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before).subscribe(data => {
      this.soList = data;
      this.endCursor = this.soDS.pageInfo?.endCursor;
      this.startCursor = this.soDS.pageInfo?.startCursor;
      this.hasNextPage = this.soDS.pageInfo?.hasNextPage ?? false;
      this.hasPreviousPage = this.soDS.pageInfo?.hasPreviousPage ?? false;
    });
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

  initializeFilterCustomerCompany() {
    this.searchForm!.get('customer_code')!.valueChanges.pipe(
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

    this.searchForm!.get('last_cargo')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (typeof value === 'string') {
          searchCriteria = value;
        } else {
          searchCriteria = value.cargo;
        }
        this.tcDS.loadItems({ cargo: { contains: searchCriteria } }, { cargo: 'ASC' }).subscribe(data => {
          this.last_cargoList = data
          this.updateValidators(this.last_cargoList);
        });
      })
    ).subscribe();
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
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

  getSoStatusDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.soStatusCvList);
  }
}