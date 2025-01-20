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
import { Router, RouterLink } from '@angular/router';
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
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { SchedulingItem } from 'app/data-sources/scheduling';
import { BookingDS, BookingGO, BookingItem } from 'app/data-sources/booking';
import { InGateDS } from 'app/data-sources/in-gate';
import { SchedulingSotDS, SchedulingSotItem } from 'app/data-sources/scheduling-sot';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-survey-periodic-test',
  standalone: true,
  templateUrl: './survey-periodic-test.component.html',
  styleUrl: './survey-periodic-test.component.scss',
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
    RouterLink
  ]
})
export class SurveyPeriodicTestComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'tank_no',
    'customer',
    // 'eir_no',
    'eir_dt',
    'last_cargo',
    'purpose',
    'status_cv',
    // 'accept_status',
  ];

  pageTitle = 'MENUITEMS.SURVEY.LIST.PERIODIC-TEST-SURVEY'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT',
    'MENUITEMS.SURVEY.TEXT'
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
    CANCELED_SUCCESS: 'COMMON-FORM.CANCELED-SUCCESS',
    SEARCH: "COMMON-FORM.SEARCH",
    EIR_NO: "COMMON-FORM.EIR-NO",
    EIR_DATE: "COMMON-FORM.EIR-DATE",
    BOOKING_DATE: "COMMON-FORM.BOOKING-DATE",
    CLEAN_CERTIFICATE: "COMMON-FORM.CLEAN-CERTIFICATE",
    BOOKING_REFERENCE: "COMMON-FORM.BOOKING-REFERENCE",
    REFERENCE: "COMMON-FORM.REFERENCE",
    SURVEYOR: "COMMON-FORM.SURVEYOR",
    BOOKING_TYPE: "COMMON-FORM.BOOKING-TYPE",
    CURRENT_STATUS: "COMMON-FORM.CURRENT-STATUS",
    CUSTOMER: "COMMON-FORM.CUSTOMER",
    TANK_STATUS: "COMMON-FORM.TANK-STATUS",
    TARE_WEIGHT: "COMMON-FORM.TARE-WEIGHT",
    ADD_NEW_BOOKING: "COMMON-FORM.ADD-NEW-BOOKING",
    BOOKINGS: "COMMON-FORM.BOOKINGS",
    SELECT_ALL: "COMMON-FORM.SELECT-ALL",
    ACTION_DATE: "COMMON-FORM.ACTION-DATE",
    BOOKING_DETAILS: "COMMON-FORM.BOOKING-DETAILS",
    SAVE_AND_SUBMIT: "COMMON-FORM.SAVE-AND-SUBMIT",
    SO_REQUIRED: "COMMON-FORM.IS-REQUIRED",
    SAVE_SUCCESS: 'COMMON-FORM.SAVE-SUCCESS',
    CLEAN_DATE: 'COMMON-FORM.CLEAN-DATE',
    SURVEY_DATE: 'COMMON-FORM.SURVEY-DATE',
    BOOKED: 'COMMON-FORM.BOOKED',
    SCHEDULED: 'COMMON-FORM.SCHEDULED',
    REMARKS: 'COMMON-FORM.REMARKS',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    EXISTED: 'COMMON-FORM.EXISTED',
    CONFIRM_RESET: 'COMMON-FORM.CONFIRM-RESET',
    CONFIRM_CLEAR_ALL: 'COMMON-FORM.CONFIRM-CLEAR-ALL',
    DELETE_SUCCESS: 'COMMON-FORM.DELETE-SUCCESS',
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL'
  }

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
  yesnoCvList: CodeValuesItem[] = [];

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
    private router: Router,
    private translate: TranslateService
  ) {
    super();
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
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      tank_no: [''],
      customer_code: this.customerCodeControl,
      last_cargo: this.lastCargoControl,
      eir_dt_start: [''],
      eir_dt_end: [''],
      tank_status_cv: [''],
      eir_no: [''],
      reference: [''],
      purpose: [''],
      survey_dt_start: [''],
      survey_dt_end: [''],
      certificate_cv: ['']
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
      { alias: 'yesnoCv', codeValType: 'YES_NO' }
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
    this.cvDS.connectAlias('yesnoCv').subscribe(data => {
      this.yesnoCvList = addDefaultSelectOption(data, 'All');
    });

    this.search();
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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set();
    const numSelected = selectedItems.size;
    const numRows = this.sotList.length;
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
    this.sotList.forEach(row => {
      this.sotSelection.deselect(row);
      selectedItems.delete(row.guid!);
    });
    this.selectedItemsPerPage[this.pageIndex] = selectedItems;
  }

  /** Select all items on the current page */
  selectAllOnPage() {
    const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set();
    this.sotList.forEach(row => {
      this.sotSelection.select(row);
      selectedItems.add(row.guid!);
    });
    this.selectedItemsPerPage[this.pageIndex] = selectedItems;
  }

  /** Handle row selection */

  toggleRow(row: StoringOrderTankItem) {
    this.sotSelection.toggle(row);
    const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set();
    if (this.sotSelection.isSelected(row)) {
      selectedItems.add(row.guid!);
    } else {
      selectedItems.delete(row.guid!);
    }
    this.selectedItemsPerPage[this.pageIndex] = selectedItems;
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
        { tank_status_cv: { in: ["CLEANING", "REPAIR", "STEAM", "STORAGE", "RO_GENERATED", "RESIDUE"] } },
        { in_gate: { some: { delete_dt: { eq: null } } } },
        {
          repair: {
            some: {
              repair_part: {
                some: {
                  tariff_repair: {
                    group_name_cv: {
                      eq: "PERIODIC_TEST"
                    }
                  }
                }
              }
            }
          }
        }
      ]
    };

    if (this.searchForm!.get('tank_no')?.value) {
      where.tank_no = { contains: this.searchForm!.get('tank_no')?.value };
    }

    if (this.searchForm!.get('last_cargo')?.value) {
      where.last_cargo_guid = { contains: this.searchForm!.get('last_cargo')?.value.guid };
    }

    if (this.searchForm!.get('job_no')?.value) {
      where.job_no = { contains: this.searchForm!.get('job_no')?.value };
    }

    if (this.searchForm!.get('tank_status_cv')?.value) {
      where.tank_status_cv = { in: [this.searchForm!.get('tank_status_cv')?.value] };
    }

    if (this.searchForm!.get('certificate_cv')?.value) {
      where.certificate_cv = { contains: this.searchForm!.get('certificate_cv')?.value };
    }

    if (this.searchForm!.value['purpose']) {
      const purposes = this.searchForm!.value['purpose'];
      if (purposes.includes('STORAGE')) {
        where.purpose_storage = { eq: true }
      }
      if (purposes.includes('CLEANING')) {
        where.purpose_cleaning = { eq: true }
      }
      if (purposes.includes('STEAM')) {
        where.purpose_steam = { eq: true }
      }

      const repairPurposes = [];
      if (purposes.includes('REPAIR')) {
        repairPurposes.push('REPAIR');
      }
      if (purposes.includes('OFFHIRE')) {
        repairPurposes.push('OFFHIRE');
      }
      if (repairPurposes.length > 0) {
        where.purpose_repair_cv = { in: repairPurposes };
      }
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
      where.cleaningSearch = { some: cleaningSearch };
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
        igSearch.eir_dt = {
          gte: Utility.convertDate(this.searchForm!.get('eir_dt_start')?.value),
          lte: Utility.convertDate(this.searchForm!.get('eir_dt_end')?.value)
        };
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

    this.lastSearchCriteria = this.sotDS.addDeleteDtCriteria(where);
    this.performSearch(this.pageSize, this.pageIndex, this.pageSize, undefined, undefined, undefined, () => {
      this.updatePageSelection();
    });
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, callback?: () => void) {
    this.sotDS.searchStoringOrderTanksForSurvey(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
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

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.SAVE_SUCCESS;
      ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
    }
  }

  handleDeleteSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.DELETE_SUCCESS;
      ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
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

  displayTankPurpose(sot: StoringOrderTankItem) {
    let purposes: any[] = [];
    if (sot?.purpose_storage) {
      purposes.push(this.getPurposeOptionDescription('STORAGE'));
    }
    if (sot?.purpose_cleaning) {
      purposes.push(this.getPurposeOptionDescription('CLEANING'));
    }
    if (sot?.purpose_steam) {
      purposes.push(this.getPurposeOptionDescription('STEAM'));
    }
    if (sot?.purpose_repair_cv) {
      purposes.push(this.getPurposeOptionDescription(sot?.purpose_repair_cv));
    }
    return purposes.join('; ');
  }

  getPurposeOptionDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.purposeOptionCvList);
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

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        headerText: this.translatedLangText.CONFIRM_CLEAR_ALL,
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
    this.searchForm?.patchValue({
      tank_no: '',
      eir_dt_start: '',
      eir_dt_end: '',
      tank_status_cv: '',
      eir_no: '',
      reference: '',
      purpose: '',
      survey_dt_start: '',
      survey_dt_end: '',
      certificate_cv: '',
    });
    this.customerCodeControl.reset('');
    this.lastCargoControl.reset('');
  }
}