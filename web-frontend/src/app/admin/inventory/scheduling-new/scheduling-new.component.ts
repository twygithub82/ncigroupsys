import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { BookingDS, BookingItem } from 'app/data-sources/booking';
import { CodeValuesDS, CodeValuesItem, addDefaultSelectOption } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { SchedulingDS } from 'app/data-sources/scheduling';
import { SchedulingSotDS, SchedulingSotGO, SchedulingSotItem } from 'app/data-sources/scheduling-sot';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { ModulePackageService } from 'app/services/module-package.service';
import { ComponentUtil } from 'app/utilities/component-util';
import { pageSizeInfo, TANK_STATUS_IN_YARD, Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { CancelFormDialogComponent } from './dialogs/cancel-form-dialog/cancel-form-dialog.component';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { GlobalMaxCharDirective } from 'app/directive/global-max-char.directive';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';
import { SearchStateService } from 'app/services/search-criteria.service';

@Component({
  selector: 'app-scheduling-new',
  standalone: true,
  templateUrl: './scheduling-new.component.html',
  styleUrl: './scheduling-new.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    GlobalMaxCharDirective
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class SchedulingNewComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'scheduling_dt',
    'book_type_cv',
    'reference',
    'status_cv',
    'actions',
  ];

  pageTitle = 'MENUITEMS.INVENTORY.LIST.SCHEDULING'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.INVENTORY.TEXT', route: '/admin/inventory/scheduling' }
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
    CAPACITY: "COMMON-FORM.CAPACITY",
    TARE_WEIGHT: "COMMON-FORM.TARE-WEIGHT",
    ADD_NEW_BOOKING: "COMMON-FORM.ADD-NEW-BOOKING",
    BOOKINGS: "COMMON-FORM.BOOKINGS",
    SCHEDULINGS: "COMMON-FORM.SCHEDULINGS",
    SELECT_ALL: "COMMON-FORM.SELECT-ALL",
    ACTION_DATE: "COMMON-FORM.ACTION-DATE",
    BOOKING_DETAILS: "COMMON-FORM.BOOKING-DETAILS",
    SAVE_AND_SUBMIT: "COMMON-FORM.SAVE",
    SO_REQUIRED: "COMMON-FORM.IS-REQUIRED",
    SAVE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    CLEAN_DATE: 'COMMON-FORM.CLEAN-DATE',
    SCHEDULING_DETAILS: 'COMMON-FORM.SCHEDULING-DETAILS',
    RELEASE_DATE: 'COMMON-FORM.RELEASE-DATE',
    RO_NOTES: 'COMMON-FORM.RO-NOTES',
    HAULIER: 'COMMON-FORM.HAULIER',
    BOOKED: 'COMMON-FORM.BOOKED',
    SCHEDULED: 'COMMON-FORM.SCHEDULED',
    SCHEDULING_DATE: 'COMMON-FORM.SCHEDULING-DATE',
    DATE: 'COMMON-FORM.DATE',
    EXISTED: 'COMMON-FORM.EXISTED',
    REMARKS: 'COMMON-FORM.REMARKS',
    DELETE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    SAVE: 'COMMON-FORM.SAVE',
    UPDATE: 'COMMON-FORM.UPDATE'
  }

  availableProcessStatus: string[] = [
    'CLEANING',
    'REPAIR',
    'STEAM',
    'RESIDUE',
    'STORAGE',
    'RELEASED'
  ]

  customerCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  searchForm?: UntypedFormGroup;
  searchField: string = "";

  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  cvDS: CodeValuesDS;
  tcDS: TariffCleaningDS;
  schedulingDS: SchedulingDS;
  schedulingSotDS: SchedulingSotDS;
  bookingDS: BookingDS;
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
  tankStatusInYard = TANK_STATUS_IN_YARD;

  selectedCompany?: string = "";

  lastSearchCriteria: any;
  lastOrderBy: any = { storing_order: { so_no: 'DESC' } };
  pageIndex = 0;
  pageSize = pageSizeInfo.defaultSize;
  endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;
  pageStateType="Scheduling";

  availableStatuses: string[] = ["CLEANING", "STEAM", "RESIDUE", "REPAIR", "STORAGE"];

  todayDt: Date = new Date();

  constructor(
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
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);
    this.schedulingDS = new SchedulingDS(this.apollo);
    this.schedulingSotDS = new SchedulingSotDS(this.apollo);
    this.bookingDS = new BookingDS(this.apollo);
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
    this.search();
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
        { in_gate: { some: { delete_dt: { eq: null } } } }
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
      where.tank_status_cv = { in: this.availableProcessStatus };
    }

    if (this.searchForm!.get('last_cargo')?.value) {
      where.last_cargo_guid = { contains: this.searchForm!.get('last_cargo')?.value.guid };
    }

    if (this.searchForm!.get('job_no')?.value) {
      where.job_no = { contains: this.searchForm!.get('job_no')?.value };
    }

    if (this.searchForm!.get('book_type_cv')?.value) {
      const scheduling_sot: any = {};

      if (this.searchForm!.get('book_type_cv')?.value) {
        const scheduling: any = {};
        scheduling.book_type_cv = { contains: this.searchForm!.get('book_type_cv')?.value };
        scheduling_sot.scheduling = scheduling;
      }
      where.scheduling_sot = { some: scheduling_sot };
    }

    if (this.searchForm!.get('customer_code')?.value) {
      const soSearch: any = {};
      if (this.searchForm!.get('customer_code')?.value) {
        soSearch.customer_company_guid = { contains: this.searchForm!.get('customer_code')?.value.guid };
      }
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
        const eirDtStart = this.searchForm?.get('eir_dt_start')?.value?.clone();
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
      this.sotSelection.clear();
      this.selectedCompany = "";
      this.selectedItemsPerPage = {};
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
    return cc && cc.code ? `${cc.code} - ${cc.name}` : '';
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
      disableClose: true,
      width: '90vw',
      data: {
        item: selectedItems,
        action: 'new',
        translatedLangText: this.translatedLangText,
        populateData: {
          bookingTypeCvList: this.bookingTypeCvListNewBooking,
          tankStatusCvList: this.tankStatusCvList,
          yardCvList: this.yardCvList
        }
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result && result.savedSuccess) {
        this.handleSaveSuccess(result.savedSuccess)
        this.performSearch(this.pageSize, 0, this.pageSize);
      }
    });
  }

  editSchedulingDetails(row: StoringOrderTankItem, scheduling_guid: string | undefined, event: Event) {
    this.preventDefault(event);
    if (this.checkDisable(row)) return;

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
        item: [row],
        scheduling_guid: scheduling_guid,
        action: 'edit',
        translatedLangText: this.translatedLangText,
        populateData: {
          bookingTypeCvList: this.bookingTypeCvListNewBooking,
          tankStatusCvList: this.tankStatusCvList,
          yardCvList: this.yardCvList
        }
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result && result.savedSuccess) {
        this.handleSaveSuccess(result.savedSuccess)
        this.performSearch(this.pageSize, 0, this.pageSize);
      }
    });
  }

  cancelItem(sot: StoringOrderTankItem, schedulingSot: SchedulingSotItem, event: Event) {
    this.stopPropagation(event);
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    console.log(schedulingSot);
    const dialogRef = this.dialog.open(CancelFormDialogComponent, {
      disableClose: true,
      width: '35vw',
      data: {
        action: "cancel",
        sot: sot,
        schedulingSot: schedulingSot,
        translatedLangText: this.translatedLangText,
        populateData: {
          bookingTypeCvList: this.bookingTypeCvListNewBooking,
          yardCvList: this.yardCvList,
          tankStatusCvList: this.tankStatusCvList
        }
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const cancelSchedulingSotReq = new SchedulingSotGO(result.schedulingSot);
        this.schedulingSotDS.deleteScheduleSOT([cancelSchedulingSotReq.guid!]).subscribe(cancelResult => {
          console.log(cancelResult)
          this.handleDeleteSuccess(cancelResult?.data?.deleteSchedulingSOT);
          this.performSearch(this.pageSize, 0, this.pageSize);
        });
      }
    });
  }

  checkSchedulings(): boolean {
    if (!this.sotSelection.hasValue()) return true;

    return this.sotSelection.selected.some(selection =>
      selection.scheduling_sot?.some(schedulingItem => schedulingItem.status_cv !== 'CANCELED')
    );
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
      return item1.scheduling?.book_type_cv === item2.book_type_cv && item1?.scheduling_dt === item2.booking_dt;
    };

    const allSchedulingsMatch = schedulings.every(schedulingItem =>
      bookings.some(bookingItem => isMatch(schedulingItem, bookingItem))
    );

    const allBookingsMatch = bookings.every(bookingItem =>
      schedulings.some(schedulingItem => isMatch(schedulingItem, bookingItem))
    );
    return allSchedulingsMatch && allBookingsMatch;
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

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.SAVE_SUCCESS;
      ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar);
    }
  }

  handleDeleteSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.DELETE_SUCCESS;
      ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
    }
  }

  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
  }

  updateValidators(untypedFormControl: UntypedFormControl, validOptions: any[]) {
    untypedFormControl.setValidators([
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

  getBookingStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.bookingStatusCvList);
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

  AutoSearch() {
    if (Utility.IsAllowAutoSearch())
      this.search();
  }

  getLastLocation(row: any) {
    return BusinessLogicUtil.getLastLocation(row, this.igDS.getInGateItem(row.in_gate), row.tank_info, row.transfer)
  }
}