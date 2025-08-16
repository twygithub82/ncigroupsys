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
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { CleaningCategoryItem } from 'app/data-sources/cleaning-category';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { CustomerCompanyCleaningCategoryItem } from 'app/data-sources/customer-company-category';
import { PackageResidueItem } from 'app/data-sources/package-residue';
import { TankDS, TankItem } from 'app/data-sources/tank';
import { ModulePackageService } from 'app/services/module-package.service';
import { SearchStateService } from 'app/services/search-criteria.service';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';
import { ComponentUtil } from 'app/utilities/component-util';
import { pageSizeInfo, Utility } from 'app/utilities/utility';
import { debounceTime, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'app-billing-branch',
  standalone: true,
  templateUrl: './billing-branch.component.html',
  styleUrl: './billing-branch.component.scss',
  imports: [
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
    MatProgressBarModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})

export class BillingBranchComponent extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  displayedColumns = [
    'desc',
    'fName',
    'lName',
    'category',
    'bDate',
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
    COUNTRY: "COMMON-FORM.COUNTRY",
    LAST_UPDATE: "COMMON-FORM.LAST-UPDATED",
    FAX_NO: "COMMON-FORM.FAX-NO",
    CONFIRM_RESET: 'COMMON-FORM.CONFIRM-RESET',
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    BILLING_BRANCH: "COMMON-FORM.BILLING-BRANCH",
    BRANCH_CODE: "COMMON-FORM.BRANCH-CODE",
    BRANCH: "COMMON-FORM.BRANCH",
    SAME: "COMMON-FORM.SAME",
    MAIN_CUSTOMER: "COMMON-FORM.MAIN-CUSTOMER",
    DEFAULT_PROFILE: 'COMMON-FORM.DEFAULT-PROFILE',
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
  tankDS: TankDS;

  ccDS: CustomerCompanyDS;
  // tariffResidueDS:TariffResidueDS;
  // packResidueDS:PackageResidueDS;
  // clnCatDS:CleaningCategoryDS;
  custCompDS: CustomerCompanyDS;

  packResidueItems: PackageResidueItem[] = [];
  unit_typeList: TankItem[] = []

  custCompClnCatItems: CustomerCompanyCleaningCategoryItem[] = [];
  customer_companyList: CustomerCompanyItem[] = [];
  all_customer_companyList: CustomerCompanyItem[] = [];
  all_branch_List: CustomerCompanyItem[] = [];
  cleaning_categoryList?: CleaningCategoryItem[];

  pageStateType = 'Branch'
  pageIndex = 0;
  pageSize = pageSizeInfo.defaultSize;
  lastSearchCriteria: any;
  //lastOrderBy: any = { code: "ASC" };
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
    // public advanceTableService: AdvanceTableService,
    private snackBar: MatSnackBar,
    private searchStateService: SearchStateService,
    private translate: TranslateService,
    private modulePackageService: ModulePackageService
  ) {
    super();
    this.initPcForm();
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.custCompDS = new CustomerCompanyDS(this.apollo);
    this.CodeValuesDS = new CodeValuesDS(this.apollo);
    this.tankDS = new TankDS(this.apollo);
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
    this.translateLangText();
    this.initializeFilterCustomerCompany();
  }

  initPcForm() {
    this.pcForm = this.fb.group({
      guid: [{ value: '' }],
      customer_code: this.customerCodeControl,
      default_profile: [this.unit_typeList.find(u => u.unit_type! === 'All' || null)],
      branch_code: [''],
      phone: [''],
      fax_no: [''],
      email: [''],
      country: [''],
      contact_person: [''],
      mobile_no: [''],
      description: this.descriptionControl,
      handled_item_cv: this.handledItemControl
    });
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} - ${cc.name}` : '';
  }

  refresh() {
    this.loadData();
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  preventDefault(event: Event) {
    event.preventDefault(); // Prevents the form submission
  }

  addBillingBranch(event: Event) {
    event.stopPropagation(); // Stop the click event from propagating
    // Navigate to the route and pass the JSON object
    this.router.navigate(['/admin/master/customer/billing-branch/new/'], {
      state: {
        id: '',
        type: 'billing-branch',
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

  editBillingBranch(row: CustomerCompanyItem) {
    this.router.navigate([`/admin/master/customer/billing-branch/new/${row.guid} `], {
      state: {
        id: row.guid,
        type: 'billing-branch',
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
    const where: any = {};

    where.and = [
      { customer_company: { main_customer_guid: { neq: null } } },
      { customer_company: { main_customer_guid: { neq: "" } } },
      { customer_company: { type_cv: { in: ["BRANCH"] } } },
      { customer_company: { delete_dt: { eq: null } } }
    ];
    if (this.customerCodeControl.value) {
      const customerCode: CustomerCompanyItem = this.customerCodeControl.value;
      if (where.customer_company == null) where.customer_company = {};
      where.customer_company.guid = { eq: customerCode.guid };
    }

    if (this.pcForm!.value["branch_code"]) {
      var branch = this.pcForm!.value["branch_code"];
      where.and = [{ customer_company: { code: { contains: branch.code } } }];
    }

    if (this.pcForm!.get("default_profile")?.value?.guid) {
      const tankSearch: any = {};
      tankSearch.guid = { eq: this.pcForm!.get("default_profile")?.value?.guid };
      if (where.customer_company == null) where.customer_company = {};
      where.customer_company.tank = tankSearch;
    }

    if (this.pcForm!.value["country"]) {
      if (where.customer_company == null) where.customer_company = {};
      where.customer_company.country = { contains: this.pcForm!.value["country"] };
    }

    if (this.pcForm!.value["contact_person"]) {
      if (where.customer_company == null) where.customer_company = {};
      where.customer_company.cc_contact_person = { some: { name: { eq: this.pcForm!.value["contact_person"] } } };
    }

    this.lastSearchCriteria = where;
  }

  constructSearchCriteria1() {
    const where: any = {};

    where.and = [
      { main_customer_guid: { neq: null } },
      { main_customer_guid: { neq: "" } },
      { type_cv: { in: ["BRANCH"] } },
      { delete_dt: { eq: null } }
    ];
    if (this.customerCodeControl.value) {
      const customerCode: CustomerCompanyItem = this.customerCodeControl.value;
      where.guid = { eq: customerCode.guid };
    }

    if (this.pcForm!.value["branch_code"]) {
      where.and = [{ code: { contains: this.pcForm!.value["branch_code"] } }, { type_cv: { eq: 'BRANCH' } }];
    }

    if (this.pcForm!.get("default_profile")?.value?.guid) {
      const tankSearch: any = {};
      tankSearch.guid = { eq: this.pcForm!.get("default_profile")?.value?.guid };
      where.tank = tankSearch;
    }

    if (this.pcForm!.value["country"]) {
      where.country = { contains: this.pcForm!.value["country"] };
    }

    if (this.pcForm!.value["contact_person"]) {
      where.cc_contact_person = { some: { name: { eq: this.pcForm!.value["contact_person"] } } };
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

    // this.subs.sink = this.ccDS.search(this.lastSearchCriteria, this.lastOrderBy, this.pageSize).subscribe(data =>
    this.subs.sink = this.ccDS.searchCustomerCompanyWithCount(this.lastSearchCriteria, this.lastOrderBy, this.pageSize).subscribe(data => {
      this.customer_companyList = data;
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

      // If no match is found, description will be undefined, so you can handle it accordingly

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

  initializeFilterCustomerCompany() {
    // this.pcForm!.get('customer_code')!.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(300),
    //   tap(value => {
    //     var searchCriteria = '';
    //     if (value && typeof value === 'object') {
    //       searchCriteria = value.code;
    //     } else {
    //       searchCriteria = value || '';
    //     }
    //     this.subs.sink = this.custCompDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
    //       this.all_branch_List = data.filter(d => d.type_cv == "BRANCH");
    //     });
    //   })
    // ).subscribe();
  }

  public loadData() {
    var cond: any = {};
    cond.type_cv = { in: ["OWNER", "BRANCH", "LEESSEE"] }
    this.subs.sink = this.custCompDS.searchAll(cond, { code: 'ASC' }).subscribe(data => {
      this.all_customer_companyList = data.filter(d => ["OWNER", "BRANCH", "LEESSEE"].includes(d.type_cv!))
      this.all_branch_List = data.filter(d => d.type_cv == "BRANCH");
    });
    this.subs.sink = this.tankDS.search({ tariff_depot_guid: { neq: null } }, { unit_type: 'ASC' }, 100).subscribe(data => {
      this.unit_typeList = [{ guid: '', unit_type: 'All' }, ...data]
      //this.unit_typeList = data;
    });

    const savedCriteria = this.searchStateService.getCriteria(this.pageStateType);
    const savedPagination = this.searchStateService.getPagination(this.pageStateType);

    if (savedCriteria) {
      this.pcForm?.patchValue(savedCriteria);
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

  compareObjects(o1: any, o2: any): boolean {
    return BusinessLogicUtil.emptyCompareWith(o1, o2);
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

  getMainCustomerCode(row: CustomerCompanyItem): String | undefined {
    const mainCustItem = this.getCustomerCompanyItem(row.main_customer_guid!);
    if (mainCustItem) return mainCustItem.code;
    return "-";
  }

  getCustomerCompanyItem(guid: string): CustomerCompanyItem | undefined {
    if (this.customer_companyList?.length) {
      const custCmp = this.all_customer_companyList?.filter((x: any) => x.guid === guid).map(item => {
        return item;
      });
      if (custCmp?.length! > 0)
        return custCmp[0];
      else
        return undefined;
    }
    return undefined;
  }

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
      case 'bDate':
        this.lastOrderBy = {
          customer_company: {

            update_dt: dirEnum,
            create_dt: dirEnum,
          }
        };
        break;

      case 'fName':
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

  isShowDeleteIcon(row: any): boolean {
    return (this.isAllowDelete() && !row.so_count && !row.sot_count && !row.tank_info_count);
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
  }

  deleteCustomerAndBillingBranch(customerGuid: string) {
    this.ccDS.DeleteCustomerCompany([customerGuid]).subscribe(d => {
      let count = d.data.deleteCustomerCompany;
      if (count > 0) {
        this.handleSaveSuccess(count);
        this.refreshTable();
        //this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
      }
    });
  }

  isAllowEdit() {
    return this.modulePackageService.hasFunctions(['MASTER_BILLING_BRANCH_EDIT']);
  }

  isAllowAdd() {
    return this.modulePackageService.hasFunctions(['MASTER_BILLING_BRANCH_ADD']);
  }

  isAllowDelete() {
    return this.modulePackageService.hasFunctions(['MASTER_BILLING_BRANCH_DELETE']);
  }
}

