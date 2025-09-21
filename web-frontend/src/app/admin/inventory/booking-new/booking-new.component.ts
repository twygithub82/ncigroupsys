import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { BookingDS, BookingGO, BookingItem } from 'app/data-sources/booking';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { SchedulingSotDS, SchedulingSotItem } from 'app/data-sources/scheduling-sot';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { GlobalMaxCharDirective } from 'app/directive/global-max-char.directive';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { ModulePackageService } from 'app/services/module-package.service';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';
import { ComponentUtil } from 'app/utilities/component-util';
import { pageSizeInfo, Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { CancelFormDialogComponent } from './dialogs/cancel-form-dialog/cancel-form-dialog.component';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { SearchStateService } from 'app/services/search-criteria.service';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-booking-new',
  standalone: true,
  templateUrl: './booking-new.component.html',
  styleUrl: './booking-new.component.scss',
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
    PreventNonNumericDirective,
    GlobalMaxCharDirective
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class BookingNewComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'booking_dt',
    'book_type_cv',
    'reference',
    'surveyor',
    //'status_cv',
    'actions',
  ];

  pageTitle = 'MENUITEMS.INVENTORY.LIST.BOOKING'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.INVENTORY.TEXT', route: '/admin/inventory/booking' }
  ]

  translatedLangText: any = {};
  langText = {
    NEW: 'COMMON-FORM.NEW',
    STATUS: 'COMMON-FORM.STATUS',
    SO_NO: 'COMMON-FORM.SO-NO',
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
    CANCELED_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
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
    CUSTOMER: "COMMON-FORM.CUSTOMER",
    CAPACITY: "COMMON-FORM.CAPACITY",
    TARE_WEIGHT: "COMMON-FORM.TARE-WEIGHT",
    ADD_NEW_BOOKING: "COMMON-FORM.ADD-NEW-BOOKING",
    BOOKINGS: "COMMON-FORM.BOOKINGS",
    SELECT_ALL: "COMMON-FORM.SELECT-ALL",
    ACTION_DATE: "COMMON-FORM.ACTION-DATE",
    BOOKING_DETAILS: "COMMON-FORM.BOOKING-DETAILS",
    SAVE_AND_SUBMIT: "COMMON-FORM.SAVE",
    SO_REQUIRED: "COMMON-FORM.IS-REQUIRED",
    SAVE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    CLEAN_DATE: 'COMMON-FORM.CLEAN-DATE',
    REPAIR_COMPLETION_DATE: 'COMMON-FORM.REPAIR-COMPLETION-DATE',
    BOOKED: 'COMMON-FORM.BOOKED',
    SCHEDULED: 'COMMON-FORM.SCHEDULED',
    REMARKS: 'COMMON-FORM.REMARKS',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    EXISTED: 'COMMON-FORM.EXISTED',
    CONFIRM_RESET: 'COMMON-FORM.CONFIRM-RESET',
    CONFIRM_CLEAR_ALL: 'COMMON-FORM.CONFIRM-CLEAR-ALL',
    DELETE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    SAVE: 'COMMON-FORM.SAVE',
    UPDATE: 'COMMON-FORM.UPDATE',
    DATE: 'COMMON-FORM.DATE'
  }

  availableTankStatus: string[] = [
    '',
    'CLEANING',
    'STEAM',
    'RESIDUE',
    'REPAIR',
    'STORAGE'
  ]

  customerCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  searchForm?: UntypedFormGroup;
  searchField: string = "";

  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  cvDS: CodeValuesDS;
  tcDS: TariffCleaningDS;
  igDS: InGateDS;
  bookingDS: BookingDS;
  schedulingSotDS: SchedulingSotDS;

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
  testClassCvList: CodeValuesItem[] = [];
  testClassCvListNewBooking: CodeValuesItem[] = [];

  selectedCompany?: string = "";

  lastSearchCriteria: any;
  lastOrderBy: any = { storing_order: { so_no: 'DESC' } };
  pageIndex = 0;
  pageSize = pageSizeInfo.defaultSize;
  endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;

  todayDt: Date = new Date();
  pageStateType="Booking";

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private searchStateService: SearchStateService,
    private modulePackageService: ModulePackageService
  ) {
    super();
    searchStateService.clearOtherPages(this.pageStateType);
    this.translateLangText();
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.bookingDS = new BookingDS(this.apollo);
    this.schedulingSotDS = new SchedulingSotDS(this.apollo);
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
    // this.generatePdf(this.apiUrl).subscribe({
    //   next: (response) => {
    //     const blob = new Blob([response], { type: 'application/pdf' });
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = 'wikipedia.pdf';
    //     document.body.appendChild(a);
    //     a.click();
    //     document.body.removeChild(a);
    //     window.URL.revokeObjectURL(url);
    //   },
    //   error: (error) => {
    //     console.error('PDF generation failed', error);
    //   }
    // });
  }
  // private apiUrl = 'https://api.pdfshift.io/v3/convert/pdf';
  // private apiKey = 'sk_29cb1891b48874ee0e4225d7058b93297af8f6da';

  // generatePdf(url: string): Observable<Blob> {
  //   const headers = new HttpHeaders({
  //     Authorization: 'Basic ' + btoa(`api:${this.apiKey}`),
  //     'Content-Type': 'application/json',
  //   });

  //   const body = {
  //     source: url,
  //     landscape: false,
  //     use_print: false
  //   };

  //   return this.http.post(this.apiUrl, body, { headers, responseType: 'blob' });
  // }

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
      eir_dt_start: [''],
      eir_dt_end: [''],
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
      { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
      { alias: 'testClassCv', codeValType: 'TEST_CLASS' }
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('yardCv').subscribe(data => {
      this.yardCvList = addDefaultSelectOption(data, 'All');
    });
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      this.purposeOptionCvList = data;
    });
    this.cvDS.connectAlias('bookingTypeCv').subscribe(data => {
      var sortedData = this.sortByDescription(data);
      this.bookingTypeCvListNewBooking = sortedData;
      this.bookingTypeCvList = addDefaultSelectOption(sortedData, 'All');
    });
    this.cvDS.connectAlias('bookingStatusCv').subscribe(data => {
      this.bookingStatusCvList = addDefaultSelectOption(data, 'All');
    });
    this.cvDS.connectAlias('tankStatusCv').subscribe(data => {
      this.tankStatusCvList = addDefaultSelectOption(data, 'All');
    });
    this.cvDS.connectAlias('testClassCv').subscribe(data => {
      this.testClassCvList = addDefaultSelectOption(data, 'All');
      this.testClassCvListNewBooking = addDefaultSelectOption(data);
    });
    this.search();
  }

  sortByDescription<T extends { description?: string }>(list: T[]): T[] {
    return [...list].sort((a, b) => (a.description || '').localeCompare(b.description || ''));
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set<string>();
    const selectableRows = this.sotList.filter(row => !this.checkDisable(row));
    const numSelected = selectedItems.size;
    const numRows = selectableRows.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
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
    const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set();
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
      ]
    };

    if (this.searchForm!.get('tank_no')?.value) {
      const tankNo = this.searchForm!.get('tank_no')?.value;
      where.or = [
        { tank_no: { contains: Utility.formatContainerNumber(tankNo) } },
        { tank_no: { contains: Utility.formatTankNumberForSearch(tankNo) } }
      ]
    }

    if (this.searchForm!.get('tank_status_cv')?.value) {
      where.tank_status_cv = { contains: this.searchForm!.get('tank_status_cv')?.value };
    } else {
      where.tank_status_cv = { in: this.availableTankStatus };
    }

    if (this.searchForm!.get('last_cargo')?.value) {
      where.last_cargo_guid = { contains: this.searchForm!.get('last_cargo')?.value.guid };
    }

    if (this.searchForm!.get('job_no')?.value) {
      where.job_no = { contains: this.searchForm!.get('job_no')?.value };
    }

    if (this.searchForm!.get('book_type_cv')?.value) {
      const booking: any = {};
      booking.book_type_cv = { contains: this.searchForm!.get('book_type_cv')?.value };
      where.booking = { some: booking };
    }

    if (this.searchForm!.get('customer_code')?.value) {
      const soSearch: any = {};
      soSearch.customer_company_guid = { contains: this.searchForm!.get('customer_code')?.value.guid };
      where.storing_order = soSearch;
    }

    if (this.searchForm!.get('clean_dt_start')?.value || this.searchForm!.get('clean_dt_end')?.value) {
      const cleaningSearch: any = {};
      cleaningSearch.complete_dt = {
        gte: Utility.convertDate(this.searchForm!.get('clean_dt_start')?.value),
        lte: Utility.convertDate(this.searchForm!.get('clean_dt_end')?.value)
      };
      where.cleaning = { some: cleaningSearch };
    }

    if (this.searchForm!.get('repair_dt_start')?.value || this.searchForm!.get('repair_dt_end')?.value) {
      const repairSearch: any = {};
      repairSearch.complete_dt = {
        gte: Utility.convertDate(this.searchForm!.get('repair_dt_start')?.value),
        lte: Utility.convertDate(this.searchForm!.get('repair_dt_end')?.value)
      };
      where.repair = { some: repairSearch };
    }

    if (this.searchForm!.get('capacity')?.value ||
      this.searchForm!.get('eir_no')?.value ||
      this.searchForm!.get('eir_dt_start')?.value ||
      this.searchForm!.get('eir_dt_end')?.value ||
      this.searchForm!.get('tare_weight')?.value) {
      // In Gate
      const igSearch: any = {};
      if (this.searchForm!.get('eir_no')?.value) {
        igSearch.eir_no = { contains: this.searchForm!.get('eir_no')?.value }
      }

      if (this.searchForm!.get('eir_dt_start')?.value || this.searchForm!.get('eir_dt_end')?.value) {
        const eirDtStart = this.searchForm?.get('eir_dt_start')?.value;
        const eirDtEnd = this.searchForm?.get('eir_dt_end')?.value;
        const today = new Date();

        // Check if `est_dt_start` is before today and `est_dt_end` is empty
        if (eirDtStart && new Date(eirDtStart) < today && !eirDtEnd) {
          igSearch.eir_dt = {
            gte: Utility.convertDate(eirDtStart),
            lte: Utility.convertDate(today), // Set end date to today
          };
        } else if (eirDtStart || eirDtEnd) {
          // Handle general case where either or both dates are provided
          igSearch.eir_dt = {
            gte: Utility.convertDate(eirDtStart || today),
            lte: Utility.convertDate(eirDtEnd || today),
          };
        }
      }

      if (this.searchForm!.get('capacity')?.value || this.searchForm!.get('tare_weight')?.value) {
        // In Gate Survey
        const igsSearch: any = {};
        if (this.searchForm!.get('capacity')?.value) {
          igsSearch.capacity = { eq: this.searchForm!.get('capacity')?.value };
        }
        if (this.searchForm!.get('tare_weight')?.value) {
          igsSearch.tare_weight = { eq: this.searchForm!.get('tare_weight')?.value };
        }
        igSearch.in_gate_survey = igsSearch;
      }
      where.in_gate = { some: igSearch };
    }

    if (this.searchForm!.get('yard_cv')?.value) {
      const tiSearch: any = {};
      tiSearch.yard_cv = { contains: this.searchForm!.get('yard_cv')?.value }
      where.tank_info = tiSearch;
    }

    this.lastSearchCriteria = this.sotDS.addDeleteDtCriteria(where);
    this.performSearch(this.pageSize, this.pageIndex, this.pageSize, undefined, undefined, undefined, () => {
      this.updatePageSelection();
    });
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, callback?: () => void) {
    this.sotDS.searchStoringOrderTanksForBooking(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {
        this.sotSelection.clear();
        this.selectedCompany = "";
        this.selectedItemsPerPage = {};

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
    return cc && cc.code ? `${cc.code} - ${cc.name}` : '';
  }

  initializeValueChanges() {
    this.searchForm!.get('customer_code')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (typeof value === 'object') {
          searchCriteria = value.code;
          this.search();
        } else {
          searchCriteria = value || '';
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
        if (typeof value === 'object') {
          searchCriteria = value.cargo;
          this.search();
        } else {
          searchCriteria = value || '';
        }
        this.tcDS.loadItems({ cargo: { contains: searchCriteria } }, { cargo: 'ASC' }).subscribe(data => {
          this.last_cargoList = data
          this.updateValidators(this.lastCargoControl, this.last_cargoList);
        });
      })
    ).subscribe();

    this.searchForm!.get('book_type_cv')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
          this.search();
      })
    ).subscribe();

    this.searchForm!.get('tank_status_cv')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
          this.search();
      })
    ).subscribe();

    this.searchForm!.get('yard_cv')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
          this.search();
      })
    ).subscribe();
  }

  addBookingDetails(event: Event) {
    this.preventDefault(event);  // Prevents the form submission
    const selectedItems = this.sotSelection.selected;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      disableClose: true,
      width: '90vw',
      data: {
        item: selectedItems,
        action: 'new',
        translatedLangText: this.translatedLangText,
        populateData: {
          bookingTypeCvList: this.bookingTypeCvListNewBooking,
          yardCvList: this.yardCvList,
          tankStatusCvList: this.tankStatusCvList,
          testClassCvList: this.testClassCvListNewBooking
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

  editBookingDetails(sot: StoringOrderTankItem, booking: BookingItem, event: Event) {
    this.preventDefault(event);  // Prevents the form submission
    if (this.checkDisable(sot)) {
      return;
    }
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      disableClose: true,
      width: '90vw',
      data: {
        item: [sot],
        action: 'edit',
        booking: booking,
        translatedLangText: this.translatedLangText,
        populateData: {
          bookingTypeCvList: this.bookingTypeCvListNewBooking,
          yardCvList: this.yardCvList,
          tankStatusCvList: this.tankStatusCvList,
          testClassCvList: this.testClassCvListNewBooking
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

  // cancelItem(sot: StoringOrderTankItem, booking: BookingItem, event: Event) {
  //   this.stopPropagation(event);
  //   let tempDirection: Direction;
  //   if (localStorage.getItem('isRtl') === 'true') {
  //     tempDirection = 'rtl';
  //   } else {
  //     tempDirection = 'ltr';
  //   }
  //   const dialogRef = this.dialog.open(CancelFormDialogComponent, {
  //     disableClose: true,
  //     width: '380px',
  //     data: {
  //       action: "cancel",
  //       sot: sot,
  //       booking: booking,
  //       translatedLangText: this.translatedLangText,
  //       populateData: {
  //         bookingTypeCvList: this.bookingTypeCvListNewBooking,
  //         yardCvList: this.yardCvList,
  //         tankStatusCvList: this.tankStatusCvList
  //       }
  //     },
  //     direction: tempDirection
  //   });
  //   this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
  //     if (result?.action === 'confirmed') {
  //       const cancelBookingReq = new BookingGO(result.booking);
  //       this.bookingDS.deleteBooking([cancelBookingReq.guid]).subscribe(cancelResult => {
  //         this.handleDeleteSuccess(cancelResult?.data?.deleteBooking);
  //         this.performSearch(this.pageSize, 0, this.pageSize);
  //       });
  //     }
  //   });
  // }

  cancelItem(sot: StoringOrderTankItem, booking: BookingItem, event: Event) {
    this.stopPropagation(event);
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
      data: {
        allowRemarksWithRequired: true,
        translatedLangText: this.translatedLangText,
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const cancelBookingReq = new BookingGO(booking);
        cancelBookingReq.remarks = result.remarks;
        this.bookingDS.deleteBooking([cancelBookingReq.guid]).subscribe(cancelResult => {
          this.handleDeleteSuccess(cancelResult?.data?.deleteBooking);
          this.performSearch(this.pageSize, 0, this.pageSize);
        });
      }
    });
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.SAVE_SUCCESS;
      ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
    }
  }

  handleDeleteSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.DELETE_SUCCESS;
      ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
    }
  }

  stopPropagation(event: Event) {
    event.stopPropagation(); // Stops event propagation
  }

  preventDefault(event: Event) {
    event.preventDefault(); // Prevents the form submission
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
      AutocompleteSelectionValidator(validOptions)
    ]);
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

  getBookingStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.bookingStatusCvList);
  }

  displayDate(input: number | null | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input as number);
  }

  checkScheduling(schedulingSot: SchedulingSotItem[] | undefined): boolean {
    return this.schedulingSotDS.checkScheduling(schedulingSot);
  }

  checkBooking(bookings: BookingItem[] | undefined): boolean {
    return this.bookingDS.checkBooking(bookings);
  }

  checkMatch(schedulings: SchedulingSotItem[] | undefined, bookings: BookingItem[] | undefined): boolean {
    if (!schedulings?.length || !bookings?.length) {
      return false;
    }

    const isMatch = (item1: SchedulingSotItem, item2: BookingItem) => {
      return item1.scheduling?.book_type_cv === item2.book_type_cv && item1.scheduling_dt === item2.booking_dt;
    };

    const allSchedulingsMatch = schedulings.every(schedulingItem =>
      bookings.some(bookingItem => isMatch(schedulingItem, bookingItem))
    );

    const allBookingsMatch = bookings.every(bookingItem =>
      schedulings.some(schedulingItem => isMatch(schedulingItem, bookingItem))
    );
    return allSchedulingsMatch && allBookingsMatch;
  }

  filterDeleted(resultList: any[] | undefined): any {
    return (resultList || []).filter((row: any) => !row.delete_dt);
  }

  resetDialog(event: Event) {
    event.preventDefault(); // Prevents the form submission
    this.resetForm();
    this.search();
  }

  resetForm() {
    this.searchForm?.patchValue({
      tank_no: '',
      clean_dt_start: '',
      clean_dt_end: '',
      capacity: '',
      book_type_cv: '',
      eir_no: '',
      job_no: '',
      eir_dt_start: '',
      eir_dt_end: '',
      repair_dt_start: '',
      repair_dt_end: '',
      tare_weight: '',
      tank_status_cv: '',
      yard_cv: ''
    });
    this.customerCodeControl.reset('');
    this.lastCargoControl.reset('');
  }

  getLastLocation(row: any) {
    return BusinessLogicUtil.getLastLocation(row, this.igDS.getInGateItem(row.in_gate), row.tank_info, row.transfer)
  }

  isAllowEdit() {
    return this.modulePackageService.hasFunctions(['INVENTORY_BOOKING_EDIT']);
  }

  isAllowAdd() {
    return this.modulePackageService.hasFunctions(['INVENTORY_BOOKING_ADD']);
  }

  isAllowDelete() {
    return this.modulePackageService.hasFunctions(['INVENTORY_BOOKING_DELETE']);
  }

  AutoSearch(){
    if (Utility.IsAllowAutoSearch())
      this.search();
  }
}