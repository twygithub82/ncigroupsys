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
import { StoringOrderDS, StoringOrderItem } from 'app/data-sources/storing-order';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem, addDefaultSelectOption } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from '@angular/material/divider';
import { ComponentUtil } from 'app/utilities/component-util';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { MatCardModule } from '@angular/material/card';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { BookingItem } from 'app/data-sources/booking';
import { SchedulingDS, SchedulingItem } from 'app/data-sources/scheduling';
import { InGateDS } from 'app/data-sources/in-gate';

@Component({
  selector: 'app-scheduling-new',
  standalone: true,
  templateUrl: './scheduling-new.component.html',
  styleUrl: './scheduling-new.component.scss',
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
    MatCardModule,
  ]
})
export class SchedulingNewComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'select',
    'tank_no',
    'customer_code',
    'eir_no',
    'eir_dt',
    'capacity',
    'tare_weight',
    'tank_status',
    'yard',
    'actions',
  ];

  pageTitle = 'MENUITEMS.INVENTORY.LIST.SCHEDULING-NEW'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT'
  ]

  translatedLangText: any = {};
  langText = {
    NEW: 'COMMON-FORM.NEW',
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
    SEARCH: "COMMON-FORM.SEARCH",
    EIR_NO: "COMMON-FORM.EIR-NO",
    EIR_DATE: "COMMON-FORM.EIR-DATE",
    BOOKING_DATE: "COMMON-FORM.BOOKING-DATE",
    YARD: "COMMON-FORM.YARD",
    BOOKING_REFERENCE: "COMMON-FORM.BOOKING-REFERENCE",
    REFERENCE: "COMMON-FORM.REFERENCE",
    SURVEYOR: "COMMON-FORM.SURVEYOR",
    BOOKING_TYPE: "COMMON-FORM.BOOKING-TYPE",
    CURRENT_STATUS: "COMMON-FORM.CURRENT-STATUS",
    CAPACITY: "COMMON-FORM.CAPACITY",
    TARE_WEIGHT: "COMMON-FORM.TARE-WEIGHT",
    ADD_NEW_BOOKING: "COMMON-FORM.ADD-NEW-BOOKING",
    BOOKINGS: "COMMON-FORM.BOOKINGS",
    SCHEDULINGS: "COMMON-FORM.SCHEDULINGS",
    SELECT_ALL: "COMMON-FORM.SELECT-ALL",
    ACTION_DATE: "COMMON-FORM.ACTION-DATE",
    BOOKING_DETAILS: "COMMON-FORM.BOOKING-DETAILS",
    SAVE_AND_SUBMIT: "COMMON-FORM.SAVE-AND-SUBMIT",
    SO_REQUIRED: "COMMON-FORM.IS-REQUIRED",
    SAVE_SUCCESS: 'COMMON-FORM.SAVE-SUCCESS',
    CLEAN_DATE: 'COMMON-FORM.CLEAN-DATE',
    REPAIR_COMPLETION_DATE: 'COMMON-FORM.REPAIR-COMPLETION-DATE',
    SCHEDULING_DETAILS: 'COMMON-FORM.SCHEDULING-DETAILS',
    RELEASE_DATE: 'COMMON-FORM.RELEASE-DATE',
    RO_NOTES: 'COMMON-FORM.RO-NOTES',
    HAULIER: 'COMMON-FORM.HAULIER',
    BOOKED: 'COMMON-FORM.BOOKED',
    SCHEDULED: 'COMMON-FORM.SCHEDULED',
    SCHEDULING_DATE: 'COMMON-FORM.SCHEDULING-DATE'
  }

  customerCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  searchForm?: UntypedFormGroup;
  searchField: string = "";

  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  cvDS: CodeValuesDS;
  tcDS: TariffCleaningDS;
  schedulingDS: SchedulingDS;
  igDS: InGateDS;

  sotList: StoringOrderTankItem[] = [];
  sotSelection = new SelectionModel<StoringOrderTankItem>(true, []);
  selectedItemsPerPage: { [key: number]: Set<string> } = {};
  customer_companyList?: CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];
  yardCvList: CodeValuesItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  bookingTypeCvList: CodeValuesItem[] = [];
  bookingTypeCvListNewBooking: CodeValuesItem[] = [];
  bookingStatusCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];

  selectedCompany?: string = "";

  lastSearchCriteria: any;
  lastOrderBy: any = { storing_order: { so_no: 'DESC' } };
  pageIndex = 0;
  pageSize = 10;
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
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);
    this.schedulingDS = new SchedulingDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.initSearchForm();
    this.initializeValueChanges();
    this.loadData();
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      tank_no: [''],
      customer_code: this.customerCodeControl,
      last_cargo: this.lastCargoControl,
      clean_dt_start: [''],
      clean_dt_end: [''],
      capacity: [''],
      book_type_cv: [''],
      eir_no: [''],
      job_no: [''],
      eir_dt_start: [''],
      eir_dt_end: [''],
      repair_dt_start: [''],
      repair_dt_end: [''],
      tare_weight: [''],
      tank_status_cv: [''],
      yard_cv: ['']
    });
  }

  refresh() {
    this.loadData();
  }

  public loadData() {
    const queries = [
      { alias: 'yardCv', codeValType: 'YARD' },
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'bookingTypeCv', codeValType: 'BOOKING_TYPE' },
      { alias: 'bookingStatusCv', codeValType: 'BOOKING_STATUS' },
      { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' }
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('yardCv').subscribe(data => {
      this.yardCvList = addDefaultSelectOption(data, 'All');
    });
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      this.purposeOptionCvList = data;
    });
    this.cvDS.connectAlias('bookingTypeCv').subscribe(data => {
      this.bookingTypeCvListNewBooking = data;
      this.bookingTypeCvList = addDefaultSelectOption(data, 'All');
    });
    this.cvDS.connectAlias('bookingStatusCv').subscribe(data => {
      this.bookingStatusCvList = addDefaultSelectOption(data, 'All');
    });
    this.cvDS.connectAlias('tankStatusCv').subscribe(data => {
      this.tankStatusCvList = addDefaultSelectOption(data, 'All');
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  // isAllSelected() {
  //   const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set();
  //   const numSelected = selectedItems.size;
  //   const numRows = this.sotList.length;
  //   return numSelected === numRows;
  // }

  isAllSelected() {
    const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set<string>();
    const selectableRows = this.sotList.filter(row => !this.checkDisable(row));
    const numSelected = selectedItems.size;
    const numRows = selectableRows.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {
  //   if (this.isAllSelected()) {
  //     this.clearPageSelection();
  //   } else {
  //     this.selectAllOnPage();
  //   }
  // }

  masterToggle() {
    const selectableRows = this.sotList.filter(row => !this.checkDisable(row));

    if (this.isAllSelected()) {
      this.clearPageSelection();
    } else {
      if (selectableRows.length > 0) {
        // Set selectedCompany based on the first selectable row
        this.selectedCompany = selectableRows[0].storing_order?.customer_company_guid;
        this.selectAllOnPage(selectableRows);
      }
    }
  }

  /** Clear selection on the current page */
  // clearPageSelection() {
  //   const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set();
  //   this.sotList.forEach(row => {
  //     this.sotSelection.deselect(row);
  //     selectedItems.delete(row.guid!);
  //   });
  //   this.selectedItemsPerPage[this.pageIndex] = selectedItems;
  // }

  clearPageSelection() {
    const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set<string>();

    this.sotList.forEach(row => {
      this.sotSelection.deselect(row);
      selectedItems.delete(row.guid!);
    });

    // If the current page is cleared, also clear the selectedCompany
    if (selectedItems.size === 0) {
      this.selectedCompany = undefined;
    }

    this.selectedItemsPerPage[this.pageIndex] = selectedItems;
  }

  /** Select all items on the current page */
  // selectAllOnPage() {
  //   const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set();
  //   this.sotList.forEach(row => {
  //     this.sotSelection.select(row);
  //     selectedItems.add(row.guid!);
  //   });
  //   this.selectedItemsPerPage[this.pageIndex] = selectedItems;
  // }

  selectAllOnPage(selectableRows: StoringOrderTankItem[]) {
    const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set<string>();

    selectableRows.forEach(row => {
      // Only select rows that match the selectedCompany
      if (this.selectedCompany === row.storing_order?.customer_company_guid) {
        this.sotSelection.select(row);
        selectedItems.add(row.guid!);
      }
    });

    this.selectedItemsPerPage[this.pageIndex] = selectedItems;
  }

  /** Handle row selection */
  // toggleRow(row: StoringOrderTankItem) {
  //   this.sotSelection.toggle(row);
  //   const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set();
  //   if (this.sotSelection.isSelected(row)) {
  //     this.selectedCompany = row.storing_order?.customer_company_guid;
  //     selectedItems.add(row.guid!);
  //   } else {
  //     selectedItems.delete(row.guid!);
  //   }
  //   this.selectedItemsPerPage[this.pageIndex] = selectedItems;
  // }

  toggleRow(row: StoringOrderTankItem) {
    const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set<string>();

    // Check if the row is already selected
    if (this.sotSelection.isSelected(row)) {
      // Deselect the row
      this.sotSelection.deselect(row);
      selectedItems.delete(row.guid!);

      // If the deselected row was the last selected row, clear the selectedCompany
      if (selectedItems.size === 0) {
        this.selectedCompany = undefined;
      }
    } else {
      // If the row is not selected, check if it should be selected based on the company
      if (!this.selectedCompany || this.selectedCompany === row.storing_order?.customer_company_guid) {
        this.sotSelection.select(row);
        this.selectedCompany = row.storing_order?.customer_company_guid;
        selectedItems.add(row.guid!);
      }
    }

    this.selectedItemsPerPage[this.pageIndex] = selectedItems;
  }

  checkDisable(row: StoringOrderTankItem): boolean {
    // Disable if a company is selected and the row's company does not match the selectedCompany
    return !!this.selectedCompany && this.selectedCompany !== row.storing_order?.customer_company_guid;
  }

  /** Update selection for the current page */
  updatePageSelection() {
    this.sotSelection.clear();
    const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set<string>();
    this.sotList.forEach(row => {
      if (selectedItems.has(row.guid!)) {
        this.sotSelection.select(row);
      }
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
    const where: any = {
      and: [
        { status_cv: { eq: "ACCEPTED" } },
        { tank_status_cv: { neq: "RO_GENERATED" } },
        { in_gate: { some: { delete_dt: { eq: null } } } }
      ]
    };

    if (this.searchForm!.value['tank_no'] || this.searchForm!.value['last_cargo'] || this.searchForm!.value['customer_code']) {
      if (this.searchForm!.value['tank_no']) {
        where.tank_no = { contains: this.searchForm!.value['tank_no'] };
      }
      if (this.searchForm!.value['last_cargo']) {
        where.last_cargo_guid = { contains: this.searchForm!.value['last_cargo'].guid };
      }

      if (this.searchForm!.value['customer_code']) {
        const soSearch: any = {};
        soSearch.customer_company_guid = { contains: this.searchForm!.value['customer_code'].guid };
        where.storing_order = soSearch;
      }
    }

    this.lastSearchCriteria = this.sotDS.addDeleteDtCriteria(where);
    this.performSearch(this.pageSize, this.pageIndex, this.pageSize, undefined, undefined, undefined, () => {
      this.updatePageSelection();
    });
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, callback?: () => void) {
    this.sotDS.searchStoringOrderTanksForBooking(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {
        this.sotList = data;
        this.endCursor = this.sotDS.pageInfo?.endCursor;
        this.startCursor = this.sotDS.pageInfo?.startCursor;
        this.hasNextPage = this.sotDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPage = this.sotDS.pageInfo?.hasPreviousPage ?? false;

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
        first = pageSize;
        after = this.endCursor;
      } else if (pageIndex < this.pageIndex && this.hasPreviousPage) {
        // Navigate backward
        last = pageSize;
        before = this.startCursor;
      }
    }

    this.performSearch(pageSize, pageIndex, first, after, last, before, () => {
      this.updatePageSelection();
    });
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
  }

  initializeValueChanges() {
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
          this.updateValidators(this.customerCodeControl, this.customer_companyList);
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
          this.updateValidators(this.lastCargoControl, this.last_cargoList);
        });
      })
    ).subscribe();
  }

  addSchedulingDetails(event: Event) {
    this.preventDefault(event);  // Prevents the form submission
    const selectedItems = this.sotSelection.selected;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        item: selectedItems,
        action: 'new',
        translatedLangText: this.translatedLangText,
        populateData: {
          bookingTypeCvList: this.bookingTypeCvListNewBooking
        }
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result && result.savedSuccess) {
        ComponentUtil.showNotification('snackbar-success', this.translatedLangText.SAVE_SUCCESS, 'top', 'center', this.snackBar);
        this.performSearch(this.pageSize, 0, this.pageSize);
      }
    });
  }

  checkSchedulings(): boolean {
    if (!this.sotSelection.hasValue()) return true;

    return this.sotSelection.selected.some(selection =>
      selection.scheduling_sot?.some(schedulingItem => schedulingItem.status_cv !== 'CANCELED')
    );
  }

  checkScheduling(schedulings: SchedulingItem[] | undefined): boolean {
    if (!schedulings || !schedulings.length) return false;
    if (schedulings.some(schedule => schedule.status_cv === "NEW"))
      return true;
    return false;
  }

  checkBooking(bookings: BookingItem[] | undefined): boolean {

    if (!bookings || !bookings.length) return false;
    if (bookings.some(booking => booking.status_cv === "NEW"))
      return true;
    return false;
  }

  stopEventTrigger(event: Event) {
    this.preventDefault(event);
    this.stopPropagation(event);
  }

  preventDefault(event: Event) {
    event.preventDefault(); // Prevents the form submission
  }

  stopPropagation(event: Event) {
    event.stopPropagation(); // Stops event propagation
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
  }

  updateValidators(untypedFormControl: UntypedFormControl, validOptions: any[]) {
    untypedFormControl.setValidators([
      Validators.required,
      AutocompleteSelectionValidator(validOptions)
    ]);
  }

  displayDate(input: number | null | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input as number);
  }

  getTankStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.tankStatusCvList);
  }

  getYardDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.yardCvList);
  }

  getBookTypeDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.bookingTypeCvList);
  }
}