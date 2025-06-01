import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
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
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { CleaningCategoryDS, CleaningCategoryItem } from 'app/data-sources/cleaning-category';
import { CleaningMethodDS, CleaningMethodItem } from 'app/data-sources/cleaning-method';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { ModulePackageService } from 'app/services/module-package.service';
import { SearchStateService } from 'app/services/search-criteria.service';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { firstValueFrom } from 'rxjs';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-tariff-cleaning',
  standalone: true,
  templateUrl: './tariff-cleaning.component.html',
  styleUrl: './tariff-cleaning.component.scss',
  imports: [
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
    MatChipsModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})

export class TariffCleaningComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'cargo',
    'desc',
    'class',
    'un_no',
    'method',
    'flash_point',
    'category',
    'ban_type',
    'actions'
  ];

  translatedLangText: any = {};
  langText = {
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
    ADD: 'COMMON-FORM.ADD',
    NEW: 'COMMON-FORM.NEW',
    REFRESH: 'COMMON-FORM.REFRESH',
    EXPORT: 'COMMON-FORM.EXPORT',
    REMARKS: 'COMMON-FORM.REMARKS',
    SO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    NAME: 'COMMON-FORM.NAME',
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    CARGO_CLASS: 'COMMON-FORM.CARGO-CLASS',
    CARGO_UN_NO: 'COMMON-FORM.CARGO-UN-NO',
    CARGO_METHOD: 'COMMON-FORM.CARGO-METHOD',
    CARGO_CATEGORY: 'COMMON-FORM.CARGO-CATEGORY',
    CARGO_FLASH_POINT: 'COMMON-FORM.CARGO-FLASH-POINT',
    CARGO_COST: 'COMMON-FORM.CARGO-COST',
    CARGO_HAZARD_LEVEL: 'COMMON-FORM.CARGO-HAZARD-LEVEL',
    CARGO_BAN_TYPE: 'COMMON-FORM.CARGO-BAN-TYPE',
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    TARIFF_CARGO_ASSIGNED: 'COMMON-FORM.TARIFF-CARGO-ASSIGNED',
    ARE_U_SURE_DELETE: 'COMMON-FORM.ARE-YOU-SURE-DELETE',
    SAVE_SUCCESS: 'COMMON-FORM.SAVE-SUCCESS',
    DELETE: 'COMMON-FORM.DELETE',
    SEARCH: "COMMON-FORM.SEARCH",
    CARGO_SELECTED: 'COMMON-FORM.CARGO-SELECTED',
  }

  @ViewChild('custInput', { static: true })
  custInput?: ElementRef<HTMLInputElement>;

  separatorKeysCodes: number[] = [ENTER, COMMA];

  searchForm?: UntypedFormGroup;

  cvDS: CodeValuesDS;
  ccDS: CustomerCompanyDS;
  tcDS: TariffCleaningDS;
  cCategoryDS: CleaningCategoryDS;
  cMethodDS: CleaningMethodDS;
  sotDS: StoringOrderTankDS;

  soList: StoringOrderItem[] = [];
  soSelection = new SelectionModel<StoringOrderItem>(true, []);
  soStatusCvList: CodeValuesItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  customer_companyList?: CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];

  cCategoryList: CleaningCategoryItem[] = [];
  cMethodList: CleaningMethodItem[] = [];
  tcList: TariffCleaningItem[] = [];
  classNoCvList: CodeValuesItem[] = [];
  banTypeCvList: CodeValuesItem[] = [];
  hazardLevelCvList: CodeValuesItem[] = [];

  lastCargoControl = new UntypedFormControl();
  categoryControl = new UntypedFormControl();
  banTypeControl = new UntypedFormControl();
  hazardLevelControl = new UntypedFormControl();

  pageStateType = 'TariffCleaning'
  pageIndex = 0;
  pageSize = 10;
  lastSearchCriteria: any;
  lastOrderBy: any = { tariff_cleaning: { cargo: "DESC" } };
  endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;
  previous_endCursor: string | undefined = undefined;

  selectedCargo: any[] = [];


  constructor(
    private router: Router,
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
    this.translateLangText();
    this.initSearchForm();
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);
    this.cCategoryDS = new CleaningCategoryDS(this.apollo);
    this.cMethodDS = new CleaningMethodDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.searchStateService.clearOtherPages(this.pageStateType);
    this.loadData();
    this.initializeValueChanges();
  }
  refresh() {
    this.loadData();
    this.initSearchForm();
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      last_cargo: this.lastCargoControl,
      cargo_name: [''],
      class_no: [''],
      method: [''],
      category: this.categoryControl,
      hazard_level: this.hazardLevelControl,
      ban_type: [''],
      flash_point: [''],
      un_no: [''],
    });
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    // const numSelected = this.soSelection.selected.length;
    // const numRows = this.soDS.totalCount;
    // return numSelected === numRows;
    return false;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.soSelection.clear()
      : this.soList.forEach((row) =>
        this.soSelection.select(row)
      );
  }
  canCancelSelectedRows(): boolean {
    return !this.soSelection.hasValue() || !this.soSelection.selected.every((item) => {
      const index: number = this.soList.findIndex((d) => d === item);
      //return this.soDS.canCancel(this.soList[index]);
      return false;
    });
  }

  public loadData() {
    this.cCategoryDS.loadItems({ name: { neq: null } }, { sequence: 'ASC' }).subscribe(data => {
      if (this.cCategoryDS.totalCount > 0) {
        this.cCategoryList = data;
      }
    });

    this.cMethodDS.loadItems({ name: { neq: null } }, { sequence: 'ASC' }).subscribe(data => {
      if (this.cMethodDS.totalCount > 0) {
        this.cMethodList = data;
      }
    });

    const queries = [
      { alias: 'ctHazardLevelCv', codeValType: 'HAZARD_LEVEL' },
      { alias: 'classNoCv', codeValType: 'CLASS_NO' },
      { alias: 'banTypeCv', codeValType: 'BAN_TYPE' }
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('ctHazardLevelCv').subscribe(data => {
      this.hazardLevelCvList = data;
      // this.hazardLevelCvList = addDefaultSelectOption(this.soStatusCvList, 'All');
    });
    this.cvDS.connectAlias('classNoCv').subscribe(data => {
      this.classNoCvList = data;
    });
    this.cvDS.connectAlias('banTypeCv').subscribe(data => {
      this.banTypeCvList = addDefaultSelectOption(data, 'All');
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
    console.log(this.searchStateService.getPagination(this.pageStateType))
    this.subs.sink = this.tcDS.SearchTariffCleaningWithCount(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {
        this.tcList = data;
        this.endCursor = this.tcDS.pageInfo?.endCursor;
        this.startCursor = this.tcDS.pageInfo?.startCursor;
        this.hasNextPage = this.tcDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPage = this.tcDS.pageInfo?.hasPreviousPage ?? false;
      });

    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
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

  // sortByDescription<T extends { description?: string }>(list: T[]): T[] {
  //   return [...list].sort((a, b) => (a.description || '').localeCompare(b.description || ''));
  // }

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

  onPageEvent(event: PageEvent) {
    const { pageIndex, pageSize, previousPageIndex } = event;
    let first: number | undefined = undefined;
    let after: string | undefined = undefined;
    let last: number | undefined = undefined;
    let before: string | undefined = undefined;
    let order: any | undefined = undefined;
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
      else if (pageIndex == this.pageIndex) {
        first = pageSize;
        after = this.previous_endCursor;
      }
    }

    this.performSearch(pageSize, pageIndex, first, after, last, before);
  }

  constructSearchCriteria() {
    var where: any = {};
    const tariff_cleaning: any = {}

    if(this.selectedCargo.length > 0) {
       tariff_cleaning.guid = { in: this.selectedCargo.map(c => c.guid) };
    }
    // if (this.lastCargoControl?.value?.guid) {
    //   tariff_cleaning.guid = { contains: this.lastCargoControl?.value?.guid };
    // } else if (this.lastCargoControl?.value) {
    //   if (typeof this.lastCargoControl?.value === 'string') {
    //     tariff_cleaning.cargo = { contains: this.lastCargoControl?.value };
    //   }
    // }

    if (this.searchForm!.get('class_no')?.value) {
      const classNo: CodeValuesItem = this.searchForm!.get('class_no')?.value;
      tariff_cleaning.class_cv = { contains: classNo.code_val };
    }

    if (this.searchForm!.value['hazard_level']) {
      const hazardLevel: CodeValuesItem = this.searchForm!.value['hazard_level'];
      tariff_cleaning.hazard_level = { contains: hazardLevel.code_val };
    }

    if (this.searchForm!.value['ban_type']) {
      const banType: CodeValuesItem = this.searchForm!.value['ban_type'];
      //tariff_cleaning.ban_type = { contains: 'Half_Ban' };
      tariff_cleaning.ban_type_cv = { contains: banType };
    }

    if (this.searchForm!.value['method']) {
      const cMethod: CleaningMethodItem = this.searchForm!.value['method'];
      tariff_cleaning.cleaning_method_guid = { contains: cMethod.guid };
    }

    if (this.searchForm!.value['category']) {
      const cCat: CleaningCategoryItem = this.searchForm!.value['category'];
      tariff_cleaning.cleaning_category_guid = { contains: cCat.guid };
    }

    if (this.searchForm!.value['flash_point']) {
      const flashPoint: number = Number(this.searchForm!.value['flash_point']);
      tariff_cleaning.flash_point = { eq: flashPoint };
    }

    if (this.searchForm!.value['un_no']) {
      tariff_cleaning.un_no = { contains: this.searchForm!.value['un_no'] };
    }

    // // TODO :: search criteria
    // this.subs.sink = this.tcDS.SearchTariffCleaning(where).subscribe(data => {
    //   this.tcList = data;
    // });
    const isEmpty = Object.keys(tariff_cleaning).length === 0;
    if (!isEmpty) {
      where.tariff_cleaning = tariff_cleaning;
    }

    this.lastSearchCriteria = this.appendDeleteDt(where);
  }

  search() {
    this.constructSearchCriteria();
    this.performSearch(this.pageSize, 0, this.pageSize, undefined, undefined, undefined);
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
    //return this.ccDS.displayName(cc);
  }

  displayCategoryFn(cCat: CleaningCategoryItem): string {
    return cCat && cCat.name ? `${cCat.name}` : '';
    //return this.ccDS.displayName(cc);
  }

  displayMethodFn(cMethod: CleaningMethodItem): string {
    return cMethod && cMethod.name ? `${cMethod.name}` : '';
    //return this.ccDS.displayName(cc);
  }

  displayCodeValueFn(cValue: CodeValuesItem): string {
    //return cValue && cValue.code_val ? `${cValue.code_val}` : '';
    return cValue && cValue.description ? `${cValue.description}` : '';
  }

  getbanTypeDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.banTypeCvList);
  }

  initializeValueChanges() {
    this.lastCargoControl!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (value && typeof value === 'object') {
          searchCriteria = value.cargo;
        } else {
          searchCriteria = value || '';
        }
        this.searchCargoList(searchCriteria);
        // this.tcDS.loadItems({ cargo: { contains: searchCriteria } }, { cargo: 'ASC' }).subscribe(data => {
        //   this.last_cargoList = data
        // });
      })
    ).subscribe();
  }

  searchCargoList(searchCriteria: string) {
    searchCriteria = searchCriteria || '';
    this.subs.sink = this.tcDS.loadItems({ and: [{ cargo: { contains: searchCriteria } }, { delete_dt: { eq: null } }] }, { cargo: 'ASC' }).subscribe(data => {
      if (this.custInput?.nativeElement.value === searchCriteria) {
        this.last_cargoList = data;
      }
    });
  }

  searchCustomerCompanyList(searchCriteria: string) {
    searchCriteria = searchCriteria || '';
    this.subs.sink = this.ccDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
      if (this.custInput?.nativeElement.value === searchCriteria) {
        this.customer_companyList = data;
      }
    });
  }



  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
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

    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   data: {
    //     headerText: this.translatedLangText.CONFIRM_RESET,
    //     action: 'new',
    //   },
    //   direction: tempDirection
    // });

    // this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    //   if (result.action === 'confirmed') {
    //     this.resetForm();
    //   }
    // });
  }

  resetForm() {
    this.searchForm?.patchValue({
      class_no: '',
      method: '',
      category: '',
      hazard_level: '',
      //ban_type: '',
      un_no: '',
    });
    this.lastCargoControl.reset();
    this.categoryControl.reset();
    this.hazardLevelControl.reset();
    this.banTypeControl.reset('');
    this.selectedCargo = [];
  }

  editCall(row: TariffCleaningItem) {
    // Navigate to the route and pass the JSON object
    this.router.navigate(['/admin/tariff/tariff-cleaning/edit/' + row.guid], {
      state: {
        id: row.guid,
        type: 'tariff-cleaning',
        selectedRow: row,
        pagination: {
          where: this.lastSearchCriteria,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          hasPreviousPage: this.hasPreviousPage,
          startCursor: this.startCursor,
          endCursor: this.endCursor,
          previous_endCursor: this.previous_endCursor,

          showResult: this.tcDS.totalCount > 0

        }
      }
    });
  }

  addCallSelection(event: Event) {
    event.stopPropagation(); // Stop the click event from propagating
    // Navigate to the route and pass the JSON object
    this.router.navigate(['/admin/tariff/tariff-cleaning/new/ '], {
      state: {
        id: '',
        type: 'tariff-cleaning',
        pagination: {
          where: this.lastSearchCriteria,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          hasPreviousPage: this.hasPreviousPage,
          startCursor: this.startCursor,
          endCursor: this.endCursor,
          previous_endCursor: this.previous_endCursor,

          showResult: this.tcDS.totalCount > 0

        }
      }
    });
  }

  cancelItem(row: TariffCleaningItem) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      //width: '15vw',
      data: {
        headerText: this.translatedLangText.ARE_U_SURE_DELETE,
        act: "warn"
      },
      direction: tempDirection
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.action == "confirmed") {
        this.deleteTariffCleaningAndPackageCleaning(row.guid!);
      }
    });
  }

  deleteTariffCleaningAndPackageCleaning(tariffCleaningGuid: string) {

    this.tcDS.deleteTariffCleaning([tariffCleaningGuid]).subscribe(d => {
      let count = d.data.deleteTariffClean;
      if (count > 0) {
        this.handleSaveSuccess(count);
      }
    });
  }

  onNumericOnly(event: Event, controlName: string): void {
    Utility.onNumericOnly(event, this.searchForm!?.get(controlName)!);
  }



  async TariffCleaningAssigned(tariffCleaningGuid: string): Promise<boolean> {
    let retval: boolean = false;
    var where: any = {};

    where = {
      and: [{ tariff_cleaning: { guid: { eq: tariffCleaningGuid } } },
      { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }]
    };

    try {
      // Use firstValueFrom to convert Observable to Promise
      const result = await firstValueFrom(this.sotDS.searchStoringOrderTanks(where, {}, 1));
      retval = (result.length > 0)
    } catch (error) {
      console.error("Error fetching tariff cleaning guid:", error);
    }

    return retval;
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.langText.SAVE_SUCCESS;
      this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
        successMsg = res;
        ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
        this.search();
      });
    }
  }

  appendDeleteDt(criteria: any) {
    if (criteria.and) {
      criteria.and.append(
        {
          tariff_cleaning: {
            delete_dt: { eq: null }
          }
        }
      )
    } else {
      criteria.and = [
        {
          tariff_cleaning: {
            delete_dt: { eq: null }
          }
        }
      ]
    }
    return criteria;
  }

  onTabFocused() {
    this.resetForm();
    this.search();
  }


  itemSelected(row: any): boolean {
    var retval: boolean = false;
    const index = this.selectedCargo.findIndex(c => c.guid === row.guid);
    retval = (index >= 0);
    return retval;
  }




  getSelectedCargoDisplay(): string {
    var retval: string = "";
    if (this.selectedCargo?.length > 1) {
      retval = `${this.selectedCargo.length} ${this.translatedLangText.CARGO_SELECTED}`;
    }
    else if (this.selectedCargo?.length == 1) {
      retval = `${this.selectedCargo[0].cargo}`
    }
    return retval;
  }



  removeAllSelectedCargo(): void {
    this.selectedCargo = [];
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const cargo = event.option.value;
    const index = this.selectedCargo.findIndex(c => c.guid === cargo.guid);
    if (!(index >= 0)) {
      this.selectedCargo.push(cargo);
      // this.search();
    }
    else {
      this.selectedCargo.splice(index, 1);
      // this.search();
    }

    if (this.custInput) {

      this.custInput.nativeElement.value = '';
      this.searchForm?.get('cargo_name')?.setValue('');
      this.searchCargoList('');
    }
    // this.updateFormControl();
    //this.customerCodeControl.setValue(null);
    //this.pcForm?.patchValue({ customer_code: null });
  }

  onCheckboxClicked(row: any) {
    const fakeEvent = { option: { value: row } } as MatAutocompleteSelectedEvent;
    this.selected(fakeEvent);

  }

  add(event: MatChipInputEvent): void {
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
    this.searchForm?.get('cargo_name')?.setValue(null);
  }
  // onCheckboxProfileClicked(row: any) {
  //   const fakeEvent = { option: { value: row } } as MatAutocompleteSelectedEvent;
  //   this.selectedProfile(fakeEvent);

  // }



}
