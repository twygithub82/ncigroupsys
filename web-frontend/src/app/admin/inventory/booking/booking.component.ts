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
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { BookingDS, BookingItem } from 'app/data-sources/booking';
import { InGateDS } from 'app/data-sources/in-gate';

@Component({
  selector: 'app-booking',
  standalone: true,
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
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
export class BookingComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'tank_no',
    'customer',
    'eir_no',
    'eir_dt',
    'last_cargo',
    'purpose',
    'tank_status_cv',
    'yard_cv',
  ];

  pageTitle = 'MENUITEMS.INVENTORY.LIST.BOOKING'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT'
  ]

  translatedLangText: any = {};
  langText = {
    STATUS: 'COMMON-FORM.STATUS',
    SO_NO: 'COMMON-FORM.SO-NO',
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
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
    SURVEYOR: "COMMON-FORM.SURVEYOR",
    BOOKING_TYPE: "COMMON-FORM.BOOKING-TYPE",
    CURRENT_STATUS: "COMMON-FORM.CURRENT-STATUS"
  }

  customerCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  searchForm?: UntypedFormGroup;

  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  cvDS: CodeValuesDS;
  tcDS: TariffCleaningDS;
  bkDS: BookingDS;
  igDS: InGateDS;

  sotList: StoringOrderTankItem[] = [];
  bookingList: BookingItem[] = [];
  customer_companyList?: CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];
  yardCvList: CodeValuesItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  bookingTypeCvList: CodeValuesItem[] = [];
  bookingStatusCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];

  pageIndex = 0;
  pageSize = 10;
  lastSearchCriteria: any;
  lastOrderBy: any = { storing_order_tank: { storing_order: { so_no: "DESC" } } };
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
    this.bkDS = new BookingDS(this.apollo);
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
      eir_dt_start: [''],
      eir_dt_end: [''],
      booking_dt_start: [''],
      booking_dt_end: [''],
      yard_cv: [''],
      eir_no: [''],
      reference: [''],
      purpose: [''],
      surveyor_cv: [''],
      booking_type_cv: [''],
      booking_status_cv: [''],
      //eta_dt: [''],
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
      this.bookingTypeCvList = addDefaultSelectOption(data, 'All');
    });
    this.cvDS.connectAlias('bookingStatusCv').subscribe(data => {
      this.bookingStatusCvList = addDefaultSelectOption(data, 'All');
    });
    this.cvDS.connectAlias('tankStatusCv').subscribe(data => {
      this.tankStatusCvList = addDefaultSelectOption(data, 'All');
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
    const where: any = {
    };

    if (this.searchForm!.value['reference']) {
      where.reference = { contains: this.searchForm!.value['reference'] };
    }

    if (this.searchForm!.value['tank_no'] || this.searchForm!.value['last_cargo'] || this.searchForm!.value['customer_code'] ||
      this.searchForm!.value['eir_no'] || this.searchForm!.value['eir_dt_start'] || this.searchForm!.value['eir_dt_end']
    ) {
      // SOT
      const sotSearch: any = {};
      if (this.searchForm!.value['tank_no']) {
        sotSearch.tank_no = { contains: this.searchForm!.value['tank_no'] };
      }
      if (this.searchForm!.value['last_cargo']) {
        sotSearch.last_cargo_guid = { contains: this.searchForm!.value['last_cargo'].guid };
      }

      if (this.searchForm!.value['customer_code']) {
        const soSearch: any = {};
        soSearch.customer_company_guid = { contains: this.searchForm!.value['customer_code'].guid };
        sotSearch.storing_order = soSearch;
      }

      // in_gate
      if (this.searchForm!.value['eir_no'] || this.searchForm!.value['eir_dt_start'] || this.searchForm!.value['eir_dt_end']) {
        const igSearch: any = { some: {} }
        if (this.searchForm!.value['eir_no']) {
          igSearch.some.eir_no = { contains: this.searchForm!.value['eir_no'] }
        }
        if (this.searchForm!.value['eir_dt_start'] || this.searchForm!.value['eir_dt_end']) {
          igSearch.some.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
        }
      }

      where.storing_order_tank = sotSearch;
    }

    if (this.searchForm!.value['booking_type_cv']) {
      where.book_type_cv = { contains: this.searchForm!.value['booking_type_cv'] };
    }

    // if (this.searchForm!.value['eir_status']) {
    //   //where.eir_status_cv = { contains: this.searchForm!.value['eir_status'] };
    // }

    // if (this.searchForm!.value['eir_dt']) {
    //   where.eir_dt = { contains: this.searchForm!.value['eir_status'] };
    // }

    // if (this.searchForm!.value['tank_no'] || this.searchForm!.value['job_no']) {
    //   const sotSearch: any = {};

    //   // if (this.searchForm!.value['last_cargo']) {
    //   //   where.customer_company = { code: { contains: this.searchForm!.value['customer_code'].code } };
    //   // }

    //   if (this.searchForm!.value['tank_no']) {
    //     sotSearch.tank_no = { contains: this.searchForm!.value['tank_no'] };
    //   }

    //   if (this.searchForm!.value['job_no']) {
    //     sotSearch.job_no = { contains: this.searchForm!.value['job_no'] };
    //   }

    //   // if (this.searchForm!.value['customer_code']) {
    //   //   where.customer_company = { code: { contains: this.searchForm!.value['customer_code'].code } };
    //   // }
    //   where.tank = sotSearch;
    // }
    this.lastSearchCriteria = this.bkDS.addDeleteDtCriteria(where);
    this.performSearch(this.pageSize, this.pageIndex, this.pageSize);
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string) {
    this.bkDS.searchBooking(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {
        this.bookingList = data;
        console.log(this.bookingList);
        this.endCursor = this.sotDS.pageInfo?.endCursor;
        this.startCursor = this.sotDS.pageInfo?.startCursor;
        this.hasNextPage = this.sotDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPage = this.sotDS.pageInfo?.hasPreviousPage ?? false;
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
    this.performSearch(pageSize, pageIndex, first, after, last, before);
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

  updateValidators(untypedFormControl: UntypedFormControl, validOptions: any[]) {
    untypedFormControl.setValidators([
      Validators.required,
      AutocompleteSelectionValidator(validOptions)
    ]);
  }

  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
  }

  displayDate(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input);
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

  getTankStatusDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.tankStatusCvList);
  }

  getYardDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.yardCvList);
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }
}