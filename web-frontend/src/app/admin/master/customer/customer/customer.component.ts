import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { CleaningCategoryItem } from 'app/data-sources/cleaning-category';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { CustomerCompanyCleaningCategoryItem } from 'app/data-sources/customer-company-category';
import { PackageResidueItem } from 'app/data-sources/package-residue';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { TankDS, TankItem } from 'app/data-sources/tank';
import { ModulePackageService } from 'app/services/module-package.service';
import { SearchStateService } from 'app/services/search-criteria.service';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';
import { ComponentUtil } from 'app/utilities/component-util';
import { pageSizeInfo, Utility } from 'app/utilities/utility';
import { firstValueFrom } from 'rxjs';
import { debounceTime, startWith, tap } from 'rxjs/operators';
@Component({
  selector: 'app-customer',
  standalone: true,
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss',
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
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})

export class CustomerComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'customer_code',
    'customer_name',
    'category',
    'last_update_dt',
    'actions'
  ];
  translatedLangText: any = {}
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.CARGO-DETAILS',
    HEADER_OTHER: 'COMMON-FORM.CARGO-OTHER-DETAILS',
    CUSTOMER: "COMMON-FORM.CUSTOMER",
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    CUSTOMER_COMPANY_NAME: 'COMMON-FORM.COMPANY-NAME',
    SO_NO: 'COMMON-FORM.SO-NO',
    SO_NOTES: 'COMMON-FORM.SO-NOTES',
    HAULIER: 'COMMON-FORM.HAULIER',
    ORDER_DETAILS: 'COMMON-FORM.ORDER-DETAILS',
    UNIT_TYPE: 'COMMON-FORM.UNIT-TYPE',
    TANK_NO: 'COMMON-FORM.TANK-NO',
    PURPOSE: 'COMMON-FORM.PURPOSE',
    STORAGE: 'COMMON-FORM.STORAGE',
    STEAM: 'COMMON-FORM.STEAM',
    CLEANING: 'COMMON-FORM.CLEANING',
    REPAIR: 'COMMON-FORM.REPAIR',
    LAST_CARGO: 'COMMON-FORM.LAST-CARGO',
    CLEAN_STATUS: 'COMMON-FORM.CLEAN-STATUS',
    CERTIFICATE: 'COMMON-FORM.CERTIFICATE',
    REQUIRED_TEMP: 'COMMON-FORM.REQUIRED-TEMP',
    FLASH_POINT: 'COMMON-FORM.FLASH-POINT',
    JOB_NO: 'COMMON-FORM.JOB-NO',
    ETA_DATE: 'COMMON-FORM.ETA-DATE',
    REMARKS: 'COMMON-FORM.REMARKS',
    ETR_DATE: 'COMMON-FORM.ETR-DATE',
    ST: 'COMMON-FORM.ST',
    O2_LEVEL: 'COMMON-FORM.O2-LEVEL',
    OPEN_ON_GATE: 'COMMON-FORM.OPEN-ON-GATE',
    SO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    STATUS: 'COMMON-FORM.STATUS',
    UPDATE: 'COMMON-FORM.UPDATE',
    CANCEL: 'COMMON-FORM.CANCEL',
    STORING_ORDER: 'MENUITEMS.INVENTORY.LIST.STORING-ORDER',
    NO_RESULT: 'COMMON-FORM.NO-RESULT',
    SAVE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    BACK: 'COMMON-FORM.BACK',
    SAVE_AND_SUBMIT: 'COMMON-FORM.SAVE-AND-SUBMIT',
    ARE_YOU_SURE_DELETE: 'COMMON-FORM.ARE-YOU-SURE-DELETE',
    CONFIRM_DELETE: 'COMMON-FORM.CONFIRM-DELETE',
    DELETE: 'COMMON-FORM.DELETE',
    CLOSE: 'COMMON-FORM.CLOSE',
    INVALID: 'COMMON-FORM.INVALID',
    EXISTED: 'COMMON-FORM.EXISTED',
    DUPLICATE: 'COMMON-FORM.DUPLICATE',
    SELECT_ATLEAST_ONE: 'COMMON-FORM.SELECT-ATLEAST-ONE',
    ADD_ATLEAST_ONE: 'COMMON-FORM.ADD-ATLEAST-ONE',
    ROLLBACK_STATUS: 'COMMON-FORM.ROLLBACK-STATUS',
    CANCELED_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    ARE_YOU_SURE_CANCEL: 'COMMON-FORM.ARE-YOU-SURE-CANCEL',
    ARE_YOU_SURE_ROLLBACK: 'COMMON-FORM.ARE-YOU-SURE-ROLLBACK',
    BULK: 'COMMON-FORM.BULK',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    UNDO: 'COMMON-FORM.UNDO',
    CARGO_NAME: 'COMMON-FORM.CARGO-NAME',
    CARGO_ALIAS: 'COMMON-FORM.CARGO-ALIAS',
    CARGO_DESCRIPTION: 'COMMON-FORM.CARGO-DESCRIPTION',
    CARGO_CLASS: 'COMMON-FORM.CARGO-CLASS',
    CARGO_CLASS_SELECT: 'COMMON-FORM.CARGO-CLASS-SELECT',
    CARGO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    PACKAGE_MIN_COST: 'COMMON-FORM.PACKAGE-MIN-COST',
    PACKAGE_MAX_COST: 'COMMON-FORM.PACKAGE-MAX-COST',
    PACKAGE_DETAIL: 'COMMON-FORM.PACKAGE-DETAIL',
    PACKAGE_CLEANING_ADJUSTED_COST: "COMMON-FORM.PACKAGE-CLEANING-ADJUST-COST",
    EMAIL: 'COMMON-FORM.EMAIL',
    CONTACT_NO: 'COMMON-FORM.CONTACT-NO',
    PROFILE_NAME: 'COMMON-FORM.PROFILE-NAME',
    VIEW: 'COMMON-FORM.VIEW',
    DEPOT_PROFILE: 'COMMON-FORM.DEPOT-PROFILE',
    PREINSPECTION_COST: "COMMON-FORM.PREINSPECTION-COST",
    LOLO_COST: "COMMON-FORM.LOLO-COST",
    STORAGE_COST: "COMMON-FORM.STORAGE-COST",
    FREE_STORAGE: "COMMON-FORM.FREE-STORAGE",
    LAST_UPDATED_DT: 'COMMON-FORM.LAST-UPDATED',
    STANDARD_COST: "COMMON-FORM.STANDARD-COST",
    CUSTOMER_COST: "COMMON-FORM.CUSTOMER-COST",
    STORAGE_CALCULATE_BY: "COMMON-FORM.STORAGE-CALCULATE-BY",
    HANDLED_ITEM: "COMMON-FORM.HANDLED-ITEM",
    COST: "COMMON-FORM.COST",
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    ALIAS_NAME: 'COMMON-FORM.ALIAS-NAME',
    CONTACT_PERSON: "COMMON-FORM.CONTACT-PERSON",
    MOBILE_NO: "COMMON-FORM.MOBILE-NO",
    DID: "COMMON-FORM.DID",
    COUNTRY: "COMMON-FORM.COUNTRY",
    LAST_UPDATE: "COMMON-FORM.LAST-UPDATED",
    FAX_NO: "COMMON-FORM.FAX-NO",
    CONFIRM_RESET: 'COMMON-FORM.CONFIRM-RESET',
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    CODE: 'COMMON-FORM.CODE',
    DEFAULT_PROFILE: 'COMMON-FORM.DEFAULT-PROFILE',
    CUSTOMER_ASSIGNED: 'COMMON-FORM.CUSTOMER-ASSIGNED',
    WARNING: 'COMMON-FORM.WARNING',
    EXPORT: 'COMMON-FORM.EXPORT',
    ADD: 'COMMON-FORM.ADD',
    REFRESH: 'COMMON-FORM.REFRESH',
    SEARCH: 'COMMON-FORM.SEARCH',
  }

  customerCodeControl = new UntypedFormControl();
  categoryControl = new UntypedFormControl();
  descriptionControl = new UntypedFormControl();
  handledItemControl = new UntypedFormControl();

  storageCalCvList: CodeValuesItem[] = [];
  handledItemCvList: CodeValuesItem[] = [];
  CodeValuesDS?: CodeValuesDS;
  countryCodes: any = [];
  countryCodesFiltered: any = [];

  ccDS: CustomerCompanyDS;
  custCompDS: CustomerCompanyDS;
  sotDS: StoringOrderTankDS;
  tankDS: TankDS;

  packResidueItems: PackageResidueItem[] = [];
  unit_typeList: TankItem[] = []

  custCompClnCatItems: CustomerCompanyCleaningCategoryItem[] = [];
  customer_companyFilterList: CustomerCompanyItem[] = [];
  customer_companyResultList: CustomerCompanyItem[] = [];
  cleaning_categoryList?: CleaningCategoryItem[];

  pageStateType = 'Customer'
  pageIndex = 0;
  pageSize = pageSizeInfo.defaultSize;
  lastSearchCriteria: any;
  lastOrderBy: any = { customer_company: { code: "ASC" } };
  endCursor: string | undefined = undefined;
  previous_endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;

  searchField: string = "";
  selection = new SelectionModel<PackageResidueItem>(true, []);

  id?: number;
  pcForm?: UntypedFormGroup;

  constructor(
    private router: Router,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private snackBar: MatSnackBar,
    private searchStateService: SearchStateService,
    private translate: TranslateService,
    public modulePackageService: ModulePackageService
  ) {
    super();
    this.initPcForm();
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.custCompDS = new CustomerCompanyDS(this.apollo);
    this.CodeValuesDS = new CodeValuesDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.tankDS = new TankDS(this.apollo);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.countryCodes = Utility.getCountryCodes("country", true);
    this.searchStateService.clearOtherPages(this.pageStateType);
    this.loadData();
    this.initPcForm();
    this.translateLangText();
    this.initializeFilterCustomerCompany();
    // var state = history.state;
    // if (state.type == "customer-company") {
    //   let showResult = state.pagination.showResult;
    //   if (showResult) {
    //     this.searchCriteriaService = state.pagination.where;
    //     this.pageIndex = state.pagination.pageIndex;
    //     this.pageSize = state.pagination.pageSize;
    //     this.hasPreviousPage = state.pagination.hasPreviousPage;
    //     this.startCursor = state.pagination.startCursor;
    //     this.endCursor = state.pagination.endCursor;
    //     this.previous_endCursor = state.pagination.previous_endCursor;
    //     this.paginator.pageSize = this.pageSize;
    //     this.paginator.pageIndex = this.pageIndex;
    //     this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
    //   }
    // }
    // else {
    //   this.search();
    // }
  }

  initializeFilterCustomerCompany() {
    this.customerCodeControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (value && typeof value === 'object') {
          searchCriteria = value.code;
        } else {
          searchCriteria = value || '';
        }
        this.subs.sink = this.custCompDS.getOwnerLessee({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
          this.customer_companyFilterList = data
        });
      })
    ).subscribe();
  }

  initPcForm() {
    this.pcForm = this.fb.group({
      guid: [{ value: '' }],
      customer_code: this.customerCodeControl,
      default_profile: [this.unit_typeList.find(u => u.unit_type! === 'All' || null)],
      phone: [''],
      fax_no: [''],
      email: [''],
      country: ['All'],
      contact_person: [''],
      mobile_no: [''],
      description: this.descriptionControl,
      handled_item_cv: this.handledItemControl,
    });
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} - ${cc.name}` : '';
  }

  compareObjects(o1: any, o2: any): boolean {
    return BusinessLogicUtil.emptyCompareWith(o1, o2);
  }

  refresh() {
    this.loadData();
  }

  addNew() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  preventDefault(event: Event) {
    event.preventDefault(); // Prevents the form submission
  }

  addCall(event: Event) {
    event.stopPropagation(); // Stop the click event from propagating
    // Navigate to the route and pass the JSON object
    this.router.navigate(['/admin/master/customer/new/ '], {
      state: {
        id: '',
        type: 'customer-company',
        pagination: {
          where: this.lastSearchCriteria,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          hasPreviousPage: this.hasPreviousPage,
          startCursor: this.startCursor,
          endCursor: this.endCursor,
          previous_endCursor: this.previous_endCursor,

          showResult: this.ccDS.totalCount > 0

        }
      }
    });
  }

  editCall(row: CustomerCompanyItem) {
    this.router.navigate([`/admin/master/customer/new/${row.guid} `], {
      state: {
        id: row.guid,
        type: 'customer-company',
        selectedRow: row,
        pagination: {
          where: this.lastSearchCriteria,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          hasPreviousPage: this.hasPreviousPage,
          startCursor: this.startCursor,
          endCursor: this.endCursor,
          previous_endCursor: this.previous_endCursor,
          showResult: this.ccDS.totalCount > 0
        }
      }
    });
  }

  deleteItem(row: any) {

  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.packResidueItems.length;
    return numSelected === numRows;
  }

  isSelected(option: any): boolean {
    return this.customerCodeControl.value.includes(option);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.packResidueItems.forEach((row) =>
        this.selection.select(row)
      );
  }

  constructSearchCriteria() {
    const where: any = {
      and: [
        {
          customer_company: {
            type_cv: { neq: "SURVEYOR" },
            delete_dt: { eq: null }
          }
        },
        {
          customer_company: {
            delete_dt: { eq: null }
          }
        }
      ]
    };
    if (this.customerCodeControl.value) {
      const customerCode: CustomerCompanyItem = this.customerCodeControl.value;
      // where.guid = { eq: customerCode.guid };
      const customer_company: any = { guid: { eq: customerCode.guid } }
      where.and.push({ customer_company: customer_company })
    }

    if (this.pcForm!.get("default_profile")?.value?.guid) {
      const tankSearch: any = {};
      tankSearch.guid = { eq: this.pcForm!.get("default_profile")?.value?.guid };
      // where.tank = tankSearch;
      const customer_company: any = { tank: { guid: { eq: this.pcForm!.get("default_profile")?.value?.guid } } }
      where.and.push({ customer_company: customer_company })
    }

    if (this.pcForm!.value["country"] && this.pcForm!.value["country"] !== 'All') {
      // where.country = { eq: this.pcForm!.value["country"] };
      const customer_company: any = { country: { eq: this.pcForm!.value["country"] } }
      where.and.push({ customer_company: customer_company })
    }

    this.lastSearchCriteria = where;
  }

  search() {
    this.constructSearchCriteria();
    this.performSearch(this.pageSize, this.pageIndex, this.pageSize, undefined, undefined, undefined);
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string) {
    this.searchStateService.setCriteria(this.pageStateType, this.pcForm?.value);
    this.searchStateService.setPagination(this.pageStateType, {
      pageSize,
      pageIndex,
      first,
      after,
      last,
      before
    });
    console.log(this.searchStateService.getPagination(this.pageStateType))
    this.subs.sink = this.ccDS.searchCustomerCompanyWithCount(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before).subscribe(data => {
      this.customer_companyResultList = data;
      this.previous_endCursor = undefined;
      this.endCursor = this.ccDS.pageInfo?.endCursor;
      this.startCursor = this.ccDS.pageInfo?.startCursor;
      this.hasNextPage = this.ccDS.pageInfo?.hasNextPage ?? false;
      this.hasPreviousPage = this.ccDS.pageInfo?.hasPreviousPage ?? false;
      this.selection.clear();
      if (!this.hasPreviousPage)
        this.previous_endCursor = undefined;
    });
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
  }

  selectStorageCalculateCV_Description(valCode?: string): string {
    let valCodeObject: CodeValuesItem = new CodeValuesItem();
    if (this.storageCalCvList.length > 0) {
      valCodeObject = this.storageCalCvList.find((d: CodeValuesItem) => d.code_val === valCode) || new CodeValuesItem();
    }
    return valCodeObject.description || '-';
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.langText.SAVE_SUCCESS;
      this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
        successMsg = res;
        ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
      });
    }
  }

  onPageEvent(event: PageEvent) {
    const { pageIndex, pageSize, previousPageIndex } = event;
    let first: number | undefined = undefined;
    let after: string | undefined = undefined;
    let last: number | undefined = undefined;
    let before: string | undefined = undefined;
    let order: any | undefined = this.lastOrderBy;
    // Check if the page size has changed
    if (this.pageSize !== pageSize) {
      // Reset pagination if page size has changed
      this.pageIndex = 0;
      this.pageSize = pageSize;
      first = pageSize;
      after = undefined;
      last = undefined;
      before = undefined;
    } else {
      //if (pageIndex > this.pageIndex && this.hasNextPage) {
      if (pageIndex > this.pageIndex) {
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

  // searchData(where: any, order: any, first: any, after: any, last: any, before: any, pageIndex: number, previousPageIndex?: number) {
  //   if (where === null || where === undefined) {
  //     where = {}
  //   }
  //   // where = {
  //   //   and: [
  //   //     {
  //   //       customer_company: {
  //   //         type_cv: { neq: "SURVEYOR" },
  //   //         delete_dt: { eq: null }
  //   //       }
  //   //     }
  //   //   ]
  //   // };
  //   this.previous_endCursor = this.endCursor;
  //   this.subs.sink = this.ccDS.searchCustomerCompanyWithCount(where, order, first, after, last, before).subscribe(data => {
  //     this.customer_companyResultList = data;
  //     this.endCursor = this.ccDS.pageInfo?.endCursor;
  //     this.startCursor = this.ccDS.pageInfo?.startCursor;
  //     this.hasNextPage = this.ccDS.pageInfo?.hasNextPage ?? false;
  //     this.hasPreviousPage = this.ccDS.pageInfo?.hasPreviousPage ?? false;
  //     this.pageIndex = pageIndex;
  //     this.paginator.pageIndex = this.pageIndex;
  //     this.selection.clear();
  //     if (!this.hasPreviousPage)
  //       this.previous_endCursor = undefined;
  //   });
  // }

  removeSelectedRows() {
  }

  public loadData() {
    this.subs.sink = this.tankDS.search({ tariff_depot_guid: { neq: null } }, { unit_type: 'ASC' }, 100).subscribe(data => {
      this.unit_typeList = [{ guid: '', unit_type: 'All' }, ...data]
      // this.unit_typeList = [...data]
    });

    const savedCriteria = this.searchStateService.getCriteria(this.pageStateType);
    const savedPagination = this.searchStateService.getPagination(this.pageStateType);

    if (savedCriteria) {
      console.log(savedCriteria)
      this.pcForm?.patchValue(savedCriteria);
      this.constructSearchCriteria();
    }

    if (savedPagination) {
      console.log(savedPagination)
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
  onContextMenu(event: MouseEvent, item: any) {
    event.preventDefault();
    // this.contextMenuPosition.x = event.clientX + 'px';
    // this.contextMenuPosition.y = event.clientY + 'px';
    // if (this.contextMenu !== undefined && this.contextMenu.menu !== null) {
    //   this.contextMenu.menuData = { item: item };
    //   this.contextMenu.menu.focusFirstItem('mouse');
    //   this.contextMenu.openMenu();
    // }
  }

  onlyNumbersDashValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const regex = /^[0-9-]*$/;
    if (control.value && !regex.test(control.value)) {
      return { 'invalidCharacter': true };
    }
    return null;
  }

  displayLastUpdated(r: PackageResidueItem) {
    var updatedt = r.update_dt;
    if (updatedt === null) {
      updatedt = r.create_dt;
    }
    // const date = new Date(updatedt! * 1000);
    // const day = String(date.getDate()).padStart(2, '0');
    // const month = date.toLocaleString('en-US', { month: 'short' });
    // const year = date.getFullYear();   

    // Replace the '/' with '-' to get the required format


    return this.displayDate(updatedt);

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
    this.search();
  }

  resetForm() {
    this.initPcForm();
    this.customerCodeControl.reset();
  }


  cancelItem(row: CustomerCompanyItem) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        headerText: this.translatedLangText.CONFIRM_DELETE,
        action: 'new',
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result.action === 'confirmed') {
        this.deleteCustomerAndBillingBranch(row.guid!);
      }
    });
    // this.id = row.id;

    // var CanDeleteCustomer: boolean = await this.CanDeleteCustomer(row.guid!);
    // if (!CanDeleteCustomer) {
    //   let tempDirection: Direction;
    //   if (localStorage.getItem('isRtl') === 'true') {
    //     tempDirection = 'rtl';
    //   } else {
    //     tempDirection = 'ltr';
    //   }
    //   const dialogRef = this.dialog.open(MessageDialogComponent, {
    //     width: '500px',
    //     data: {
    //       headerText: this.translatedLangText.WARNING,
    //       messageText: [this.translatedLangText.CUSTOMER_ASSIGNED],
    //       act: "warn"
    //     },
    //     direction: tempDirection
    //   });
    //   dialogRef.afterClosed().subscribe(result => {
    //   });
    // }
    // else {
    //   this.deleteCustomerAndBillingBranch(row.guid!);
    // }

  }

  deleteCustomerAndBillingBranch(customerGuid: string) {
    this.ccDS.DeleteCustomerCompany([customerGuid]).subscribe(d => {
      let count = d.data.deleteCustomerCompany;
      if (count > 0) {
        this.handleSaveSuccess(count);
        this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
      }
    });
  }

  isShowDeleteIcon(row: any): boolean {
    return (this.isAllowDelete() && !row.so_count && !row.sot_count && !row.tank_info_count);
  }

  async CanDeleteCustomer(guid: string): Promise<boolean> {
    let retval: boolean = false;

    try {
      // Use firstValueFrom to convert Observable to Promise
      const result = await firstValueFrom(this.ccDS.CanDeleteCustomerCompany(guid));
      retval = (result);
    } catch (error) {
      console.error("Error fetching Customer guid:", error);
    }

    return retval;
  }


  // CanDeleteCustomer(row: CustomerCompanyItem): boolean {
  //       let retval: boolean = false;
  //       var where: any = {};
  //       try {
  //         // Use firstValueFrom to convert Observable to Promise
  //        retval = row.storing_order_tank?.length==0 && row.storing_orders?.length==0;

  //       } catch (error) {
  //         console.error("Error fetching tariff buffer guid:", error);
  //       }

  //       return retval;
  //     }

  onTabFocused() {
    this.resetForm();
    this.search();
  }

  onSortChange(event: Sort): void {
    const { active: field, direction } = event;

    // reset if no direction
    if (!direction) {
      this.lastOrderBy = null;
      return this.search();
    }

    // convert to GraphQL enum (uppercase)
    const dirEnum = direction.toUpperCase(); // 'ASC' or 'DESC'
    // or: const dirEnum = SortEnumType[direction.toUpperCase() as 'ASC'|'DESC'];

    switch (field) {
      case 'last_update_dt':
        this.lastOrderBy = {
          customer_company: {
            update_dt: dirEnum,
            create_dt: dirEnum,
          }
        };
        break;

      case 'customer_code':
        this.lastOrderBy = {
          customer_company: {
            code: dirEnum,
          }
        };
        break;

      default:
        this.lastOrderBy = null;
    }

    this.search();
  }

  AutoSearch() {
    if (Utility.IsAllowAutoSearch())
      this.search();
  }

  isAllowEdit() {
    return this.modulePackageService.hasFunctions(['MASTER_CUSTOMER_EDIT']);
  }

  isAllowAdd() {
    return this.modulePackageService.hasFunctions(['MASTER_CUSTOMER_ADD']);
  }

  isAllowDelete() {
    return this.modulePackageService.hasFunctions(['MASTER_CUSTOMER_DELETE']);
  }
}

