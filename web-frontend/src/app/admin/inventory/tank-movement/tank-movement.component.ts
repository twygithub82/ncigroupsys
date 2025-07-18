import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
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
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem, addDefaultSelectOption } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { SearchStateService } from 'app/services/search-criteria.service';
import { pageSizeInfo, Utility,maxLengthDisplaySingleSelectedItem } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ModulePackageService } from 'app/services/module-package.service';

@Component({
  selector: 'app-tank-movement',
  standalone: true,
  templateUrl: './tank-movement.component.html',
  styleUrl: './tank-movement.component.scss',
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
    MatChipsModule,
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class TankMovementComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'tank_no',
    'customer',
    'eir_no',
    'eir_dt',
    'last_cargo',
    'purpose',
    'tank_status_cv'
  ];

  pageTitle = 'MENUITEMS.INVENTORY.LIST.TANK-MOVEMENT'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.INVENTORY.TEXT', route: '/admin/inventory/tank-movement' }
  ]

  separatorKeysCodes: number[] = [ENTER, COMMA];
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
    CANCELED_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    SEARCH: 'COMMON-FORM.SEARCH',
    EIR_NO: 'COMMON-FORM.EIR-NO',
    EIR_DATE: 'COMMON-FORM.EIR-DATE',
    CONFIRM_RESET: 'COMMON-FORM.CONFIRM-RESET',
    CONFIRM_CLEAR_ALL: 'COMMON-FORM.CONFIRM-CLEAR-ALL',
    EIR_STATUS: 'COMMON-FORM.EIR-STATUS',
    TANK_STATUS: 'COMMON-FORM.TANK-STATUS',
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    YARD: 'COMMON-FORM.YARD',
    CUSTOMERS_SELECTED: 'COMMON-FORM.SELECTED',
    CARGO_SELECTED: 'COMMON-FORM.SELECTED',
  }

  availableProcessStatus: string[] = [
    'CLEANING',
    'STEAM',
    'REPAIR',
    'RESIDUE',
    'STORAGE',
    'RELEASED'
  ]

  searchForm?: UntypedFormGroup;
  customerCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();

  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  cvDS: CodeValuesDS;
  tcDS: TariffCleaningDS;

  sotList: StoringOrderTankItem[] = [];
  customer_companyList?: CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];
  purposeOptionCvList: CodeValuesItem[] = [];
  eirStatusCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  tankStatusCvListDisplay: CodeValuesItem[] = [];
  yardCvList: CodeValuesItem[] = [];

  pageStateType = 'TankMovement'
  pageIndex = 0;
  pageSize = pageSizeInfo.defaultSize;
  lastSearchCriteria: any;
  lastOrderBy: any = { create_dt: "DESC" };
  endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;
  previous_endCursor: string | undefined = undefined;

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
    this.translateLangText();
    this.initSearchForm();
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.initializeValueChanges();
    this.searchStateService.clearOtherPages(this.pageStateType);
    // this.lastCargoControl = new UntypedFormControl('', [Validators.required, AutocompleteSelectionValidator(this.last_cargoList)]);
    this.loadData();
  }

 

  initSearchForm() {
    this.searchForm = this.fb.group({
      so_no: [''],
      customer_code: this.customerCodeControl,
      last_cargo: this.lastCargoControl,
      eir_no: [''],
      eir_dt_start: [''],
      eir_dt_end: [''],
      tank_no: [''],
      job_no: [''],
      purpose: [''],
      tank_status_cv: [''],
      eir_status_cv: [''],
      yard_cv: ['']
    });
  }

  initializeValueChanges() {
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
          this.updateValidators(this.customerCodeControl, this.customer_companyList);
        });
      })
    ).subscribe();

    this.searchForm!.get('last_cargo')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (value && typeof value === 'object') {
          searchCriteria = value.cargo;
        } else {
          searchCriteria = value || '';
        }
        this.tcDS.loadItems({ cargo: { contains: searchCriteria } }, { cargo: 'ASC' }).subscribe(data => {
          this.last_cargoList = data
          this.updateValidators(this.lastCargoControl, this.last_cargoList);
        });
      })
    ).subscribe();
  }

  public loadData() {
    const queries = [
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'eirStatusCv', codeValType: 'EIR_STATUS' },
      { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
      { alias: 'yardCv', codeValType: 'YARD' },
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      this.purposeOptionCvList = data;
    });
    this.cvDS.connectAlias('eirStatusCv').subscribe(data => {
      this.eirStatusCvList = addDefaultSelectOption(data, 'All');;
    });
    this.cvDS.connectAlias('tankStatusCv').subscribe(data => {
      this.tankStatusCvListDisplay = data;
      this.tankStatusCvList = addDefaultSelectOption(data, 'All');
    });
    this.cvDS.connectAlias('yardCv').subscribe(data => {
      this.yardCvList = addDefaultSelectOption(data, 'All');
    });

    
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
      status_cv: { in: ['WAITING', 'ACCEPTED'] },
      in_gate: {
        some: {
          delete_dt: { eq: null },
          eir_status_cv: { in: ["PUBLISHED"] }
        }
      }
    };
    
    if (this.searchForm!.get('tank_no')?.value) {
      const tankNo = this.searchForm!.get('tank_no')?.value;
      where.or = [
        { tank_no: { contains: Utility.formatContainerNumber(tankNo) } },
        { tank_no: { contains: Utility.formatTankNumberForSearch(tankNo) } }
      ];
    }

    if (this.selectedCargoes.length > 0) {
      var cond = this.selectedCargoes.map((item) => {
        return item.guid;
      });
      where.last_cargo_guid = { in: cond };
    }

    if (this.selectedNames.length > 0) {
      var cond = this.selectedNames.map((item) => {
        return item.guid;
      });
      const soSearch: any = {};
      if (cond.length > 0) {
        soSearch.customer_company = { guid: { in: cond } };
        where.storing_order = soSearch;
      }
    }

    // if (this.searchForm!.get('last_cargo')?.value) {
    //   where.last_cargo_guid = { contains: this.searchForm!.get('last_cargo')?.value?.guid };
    // }

    if (this.searchForm!.get('tank_status_cv')?.value) {
      where.tank_status_cv = { contains: this.searchForm!.get('tank_status_cv')?.value };
    }
    else {
      where.tank_status_cv = { ncontains: 'RELEASED' };
    }

    if (this.searchForm!.get('purpose')?.value) {
      const purposes = this.searchForm!.get('purpose')?.value;
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

    // if (this.searchForm!.get('customer_code')?.value) {
    //   const soSearch: any = {};
    //   if (this.searchForm!.get('customer_code')?.value) {
    //     soSearch.customer_company = { guid: { contains: this.searchForm!.get('customer_code')?.value.guid } };
    //   }
    //   where.storing_order = soSearch;
    // }

    if (this.searchForm!.get('eir_no')?.value || this.searchForm!.get('eir_dt_start')?.value || this.searchForm!.get('eir_dt_end')?.value || this.searchForm!.get('yard_cv')?.value) {
      const igSearch: any = {};
      if (this.searchForm!.get('eir_no')?.value) {
        igSearch.eir_no = { contains: this.searchForm!.get('eir_no')?.value };
      }

      // if (this.searchForm!.get('eir_status_cv')?.value) {
      //   igSearch.eir_status_cv = { contains: this.searchForm!.get('eir_status_cv')?.value };
      // }

      if (this.searchForm!.get('eir_dt_start')?.value && this.searchForm!.get('eir_dt_end')?.value) {
        igSearch.eir_dt = { gte: Utility.convertDate(this.searchForm!.get('eir_dt_start')?.value), lte: Utility.convertDate(this.searchForm!.get('eir_dt_end')?.value) };
      }

      if (this.searchForm!.get('yard_cv')?.value) {
        igSearch.yard_cv = { contains: this.searchForm!.get('yard_cv')?.value };
      }
      where.in_gate = { some: igSearch };
    }

    // if (this.searchForm!.get('tank_no')?.value || this.searchForm!.get('tank_status_cv')?.value || this.searchForm!.get('so_no')?.value || this.searchForm!.get('customer_code')?.value || this.searchForm!.get('purpose')?.value) {
    //   const sotSearch: any = {};

    //   if (this.searchForm!.get('tank_no')?.value) {
    //     sotSearch.tank_no = { contains: this.searchForm!.get('tank_no')?.value };
    //   }

    //   if (this.searchForm!.get('tank_status_cv')?.value) {
    //     sotSearch.tank_status_cv = { contains: this.searchForm!.get('tank_status_cv')?.value };
    //   }

    //   if (this.searchForm!.get('purpose')?.value) {
    //     const purposes = this.searchForm!.get('purpose')?.value;
    //     if (purposes.includes('STORAGE')) {
    //       sotSearch.purpose_storage = { eq: true }
    //     }
    //     if (purposes.includes('CLEANING')) {
    //       sotSearch.purpose_cleaning = { eq: true }
    //     }
    //     if (purposes.includes('STEAM')) {
    //       sotSearch.purpose_steam = { eq: true }
    //     }

    //     const repairPurposes = [];
    //     if (purposes.includes('REPAIR')) {
    //       repairPurposes.push('REPAIR');
    //     }
    //     if (purposes.includes('OFFHIRE')) {
    //       repairPurposes.push('OFFHIRE');
    //     }
    //     if (repairPurposes.length > 0) {
    //       sotSearch.purpose_repair_cv = { in: repairPurposes };
    //     }
    //   }

    //   if (this.searchForm!.get('so_no')?.value || this.searchForm!.get('customer_code')?.value) {
    //     const soSearch: any = {};

    //     if (this.searchForm!.get('so_no')?.value) {
    //       soSearch.so_no = { contains: this.searchForm!.get('so_no')?.value };
    //     }

    //     if (this.searchForm!.get('customer_code')?.value) {
    //       soSearch.customer_company = { code: { contains: this.searchForm!.value['customer_code'].code } };
    //     }
    //     sotSearch.storing_order = soSearch;
    //   }
    //   where.tank = sotSearch;
    // }

    this.lastSearchCriteria = this.sotDS.addDeleteDtCriteria(where);
  }

  search() {
    this.constructSearchCriteria();
    this.performSearch(this.pageSize, 0, this.pageSize, undefined, undefined, undefined);
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string) {
    this.searchStateService.setCriteria(this.pageStateType, this.searchForm?.value);
    this.searchStateService.setPagination(this.pageStateType, {
      pageSize,
      pageIndex,
      first,
      after,
      last,
      before
    });
    this.subs.sink = this.sotDS.searchStoringOrderTankForMovement(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {
        this.sotList = data;
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
      } else if (pageIndex == this.pageIndex) {
        first = pageSize;
        after = this.previous_endCursor;
      }
    }

    this.performSearch(pageSize, pageIndex, first, after, last, before);
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} - ${cc.name}` : '';
  }

  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
  }

  displayTankPurpose(sot: StoringOrderTankItem) {
    return this.sotDS.displayTankPurpose(sot, this.getPurposeOptionDescription.bind(this));
  }

  getPurposeOptionDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.purposeOptionCvList);
  }

  getTankStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.tankStatusCvListDisplay);
  }

  getMaxDate() {
    return new Date();
  }

  displayDate(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input);
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  updateValidators(untypedFormControl: UntypedFormControl, validOptions: any[]) {
    untypedFormControl.setValidators([
      AutocompleteSelectionValidator(validOptions)
    ]);
  }

  resetDialog(event: Event) {
    event.preventDefault(); // Prevents the form submission
    this.resetForm();
    this.search();
  }

  resetForm() {
    this.searchForm?.patchValue({
      so_no: '',
      eir_no: '',
      eir_dt_start: '',
      eir_dt_end: '',
      tank_no: '',
      job_no: '',
      purpose: '',
      tank_status_cv: '',
      eir_status_cv: '',
      last_cargo: ''
    });
    this.customerCodeControl.reset('');
  }

  @ViewChild('nameInput', { static: true })
  nameInput?: ElementRef<HTMLInputElement>;
  selectedNames: any[] = [];
  name_itemSelected(row: any): boolean {
    var itm = this.selectedNames;
    var retval: boolean = false;
    const index = itm.findIndex(c => c.guid === row.guid);
    retval = (index >= 0);
    return retval;
  }

  name_getSelectedDisplay(): string {
    var itm = this.selectedNames;
    var retval: string = "";
    if (itm?.length > 1) {
      retval = `${itm.length} ${this.translatedLangText.CUSTOMERS_SELECTED}`;
    }
    else if (itm?.length == 1) {
       const maxLength = maxLengthDisplaySingleSelectedItem;
            const value=`${this.ccDS.displayCodeDashName(itm[0])}`;
            retval = `${value.length > maxLength 
              ? value.slice(0, maxLength) + '...' 
              : value}`;
    }
    return retval;
  }

  name_removeAllSelected(): void {
    this.selectedNames = [];
    this.AutoSearch();
  }

  name_selected(event: MatAutocompleteSelectedEvent): void {
    var itm = this.selectedNames;
    var cnt = this.customerCodeControl;
    var elmInput = this.nameInput;
    const val = event.option.value;
    const index = itm.findIndex(c => c.guid === val?.guid);
    if (!(index >= 0)) {
      itm.push(val);
    }
    else {
      itm.splice(index, 1);
    }

    if (elmInput) {
      elmInput.nativeElement.value = '';
      cnt?.setValue('');
    }

    this.AutoSearch();
  }

  name_onCheckboxClicked(row: any) {
    const fakeEvent = { option: { value: row } } as MatAutocompleteSelectedEvent;
    this.name_selected(fakeEvent);

  }

  name_add(event: MatChipInputEvent): void {
    var cnt = this.customerCodeControl;
    const input = event.input;
    const value = event.value;
    // Add our fruit
    if ((value || '').trim()) {
      //this.fruits.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
    cnt?.setValue(null);
  }

  @ViewChild('cargoInput', { static: true })
  cargoInput?: ElementRef<HTMLInputElement>;
  selectedCargoes: any[] = [];
  cargo_itemSelected(row: any): boolean {
    var itm = this.selectedCargoes;
    var retval: boolean = false;
    const index = itm.findIndex(c => c.guid === row.guid);
    retval = (index >= 0);
    return retval;
  }

  cargo_getSelectedDisplay(): string {
    var itm = this.selectedCargoes;
    var retval: string = "";
    if (itm?.length > 1) {
      retval = `${itm.length} ${this.translatedLangText.CARGO_SELECTED}`;
    }
    else if (itm?.length == 1) {
     // retval = `${itm[0].cargo}`
        const buffer =10;
        const maxLength = (maxLengthDisplaySingleSelectedItem-buffer);
            const value=`${itm[0].cargo}`;
            retval = `${value.length > maxLength 
              ? value.slice(0, maxLength) + '...' 
              : value}`;
    }
    return retval;
  }

  cargo_removeAllSelected(): void {
    this.selectedCargoes = [];
    this.AutoSearch();
  }

  cargo_selected(event: MatAutocompleteSelectedEvent): void {
    var itm = this.selectedCargoes;
    var cnt = this.lastCargoControl;
    var elmInput = this.cargoInput;
    const val = event.option.value;
    const index = itm.findIndex(c => c.guid === val.guid);
    if (!(index >= 0)) {
      itm.push(val);
      // this.search();
    }
    else {
      itm.splice(index, 1);
      // this.search();
    }

    if (elmInput) {

      elmInput.nativeElement.value = '';
      cnt?.setValue('');

    }

    this.AutoSearch();
  }

  cargo_onCheckboxClicked(row: any) {
    const fakeEvent = { option: { value: row } } as MatAutocompleteSelectedEvent;
    this.cargo_selected(fakeEvent);
  }

  cargo_add(event: MatChipInputEvent): void {
    var cnt = this.lastCargoControl;
    const input = event.input;
    const value = event.value;
    // Add our fruit
    if ((value || '').trim()) {
      //this.fruits.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
    cnt?.setValue(null);
  }

  AutoSearch(){
    if(Utility.IsAllowAutoSearch()){
      this.search();
    }
  }
}