import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
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
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { CleaningCategoryItem } from 'app/data-sources/cleaning-category';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { CustomerCompanyCleaningCategoryItem } from 'app/data-sources/customer-company-category';
import { PackageBufferDS, PackageBufferItem } from 'app/data-sources/package-buffer';
import { PackageDepotItem } from 'app/data-sources/package-depot';
import { TariffBufferDS, TariffBufferItem } from 'app/data-sources/tariff-buffer';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { ModulePackageService } from 'app/services/module-package.service';
import { SearchCriteriaService } from 'app/services/search-criteria.service';
import { ComponentUtil } from 'app/utilities/component-util';
import { pageSizeInfo, Utility, maxLengthDisplaySingleSelectedItem } from 'app/utilities/utility';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { FormDialogComponent } from './form-dialog/form-dialog.component';

@Component({
  selector: 'app-package-buffer',
  standalone: true,
  templateUrl: './package-buffer.component.html',
  styleUrl: './package-buffer.component.scss',
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
    PreventNonNumericDirective,
    MatChipsModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})

export class PackageBufferComponent extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  displayedColumns = [
    ''
    // 'select',
    // 'customer_name',
    // 'buffer_type',
    // 'customer_cost',
    // 'tariff_cost',
    // 'last_update_dt',
  ];

  customerCodeControl = new UntypedFormControl();
  categoryControl = new UntypedFormControl();
  profileNameControl = new UntypedFormControl();

  storageCalCvList: CodeValuesItem[] = [];
  CodeValuesDS?: CodeValuesDS;

  ccDS: CustomerCompanyDS;

  tariffBuffDS: TariffBufferDS;
  packBuffDS: PackageBufferDS;
  custCompDS: CustomerCompanyDS;

  packBufferItems: PackageBufferItem[] = []

  custCompClnCatItems: CustomerCompanyCleaningCategoryItem[] = [];
  customer_companyList: CustomerCompanyItem[] = [];
  cleaning_categoryList?: CleaningCategoryItem[];
  bufferList?: TariffBufferItem[] = [];

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
  selection = new SelectionModel<PackageDepotItem>(true, []);

  selectedCustomers: any[] = [];

  separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedPackEst?: PackageBufferItem = undefined;

  id?: number;
  pcForm?: UntypedFormGroup;
  translatedLangText: any = {};
  allowSelectedAll: boolean = false;
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.CARGO-DETAILS',
    HEADER_OTHER: 'COMMON-FORM.CARGO-OTHER-DETAILS',
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
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
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    PREINSPECTION_COST: "COMMON-FORM.PREINSPECTION-COST",
    LOLO_COST: "COMMON-FORM.LOLO-COST",
    STORAGE_COST: "COMMON-FORM.STORAGE-COST",
    FREE_STORAGE: "COMMON-FORM.FREE-STORAGE",
    LAST_UPDATED_DT: 'COMMON-FORM.LAST-UPDATED',
    STANDARD_COST: "COMMON-FORM.STANDARD-COST",
    CUSTOMER_COST: "COMMON-FORM.CUSTOMER-COST",
    COST: "COMMON-FORM.COST",
    STORAGE_CALCULATE_BY: "COMMON-FORM.STORAGE-CALCULATE-BY",
    ALIAS_NAME: 'COMMON-FORM.ALIAS-NAME',
    CONTACT_PERSON: "COMMON-FORM.CONTACT-PERSON",
    MOBILE_NO: "COMMON-FORM.MOBILE-NO",
    COUNTRY: "COMMON-FORM.COUNTRY",
    FAX_NO: "COMMON-FORM.FAX-NO",
    CONFIRM_RESET: 'COMMON-FORM.CONFIRM-RESET',
    LAST_UPDATE: "COMMON-FORM.LAST-UPDATED",
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    BUFFER_TYPE: 'COMMON-FORM.BUFFER-TYPE',
    TARIFF_COST: 'COMMON-FORM.TARIFF-COST',
    EXPORT: 'COMMON-FORM.EXPORT',
    ADD: 'COMMON-FORM.ADD',
    REFRESH: 'COMMON-FORM.REFRESH',
    SEARCH: 'COMMON-FORM.SEARCH',
    ALL: 'COMMON-FORM.ALL',
    CUSTOMERS_SELECTED: 'COMMON-FORM.SELECTED',
    MULTIPLE: 'COMMON-FORM.MULTIPLE',
  }

  @ViewChild('custInput', { static: true })
  custInput?: ElementRef<HTMLInputElement>;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private snackBar: MatSnackBar,
    private searchCriteriaService: SearchCriteriaService,
    private translate: TranslateService,
    public modulePackageService: ModulePackageService
  ) {
    super();
    this.initPcForm();
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.tariffBuffDS = new TariffBufferDS(this.apollo)
    this.packBuffDS = new PackageBufferDS(this.apollo)
    this.custCompDS = new CustomerCompanyDS(this.apollo);
    this.CodeValuesDS = new CodeValuesDS(this.apollo);
    this.initializeFilterCustomerCompany();
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.loadData();
    this.displayColumnChanged();
    this.translateLangText();
    this.search();
  }

  initPcForm() {
    this.pcForm = this.fb.group({
      guid: [{ value: '' }],
      customer_code: this.customerCodeControl,
      profile_name: [''],
      customer_cost: ['']
    });
  }

  displayColumnChanged() {
    if (this.isAllowEdit() && this.getPackages()) {
      this.displayedColumns = [
        'select',
        'customer_name',
        'buffer_type',
        'customer_cost',
        'tariff_cost',
        'last_update_dt',
      ];
    } else {
      this.displayedColumns = [
        'customer_name',
        'buffer_type',
        'customer_cost',
        'tariff_cost',
        'last_update_dt',
      ];
    }
  };

  getPackages(): boolean {
    if (this.modulePackageService.isGrowthPackage() || this.modulePackageService.isCustomizedPackage())
      return true;
    else
      return false;
  }

  initializeFilterCustomerCompany() {
    this.pcForm!.get('customer_code')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (typeof value === 'string') {
          searchCriteria = value;
        } else {
          searchCriteria = value.code;
        }
        this.searchCustomerCompanyList(searchCriteria);
        // this.subs.sink = this.ccDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
        //   this.customer_companyList = data
        // });
      })
    ).subscribe();
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} - ${cc.name}` : '';
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

  adjustCost() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    if (this.selection.isEmpty()) return;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '55vw',
      //height: '80vh',
      data: {
        action: 'update',
        langText: this.langText,
        selectedItems: this.selection.selected
      },
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result > 0) {
        this.handleSaveSuccess(result);
        this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
      }
    });
  }

  editCall(row: PackageDepotItem) {
    // this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    var rows: CustomerCompanyCleaningCategoryItem[] = [];
    rows.push(row);
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '55vw',
      //maxHeight: '80vh',
      data: {
        action: 'update',
        langText: this.langText,
        selectedItems: rows
      },
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result > 0) {
        this.handleSaveSuccess(result);
        this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
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
    // const numRows = this.packBufferItems.length;
    const numRows = this.packBufferItems.filter(r => this.selectedPackEst?.tariff_buffer_guid === r.tariff_buffer_guid).length;
    return (numSelected === numRows && numSelected > 0);
  }

  isSelected(option: any): boolean {
    return this.customerCodeControl.value.includes(option);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.packBufferItems.forEach((row) =>
        this.selection.select(row)
      );
  }

  masterToggle_r1() {
    this.isAllSelected()
      ? this.resetSelection()
      : this.packBufferItems.forEach((row) => {
        if (this.selectedPackEst?.tariff_buffer_guid === row.tariff_buffer_guid) {
          this.selection.select(row)
        }
        else if (this.allowSelectedAll) {
          if (!this.selectedPackEst) this.selectedPackEst = row;
          this.selection.select(row);
        }
      }
      );
  }

  resetSelection() {
    this.selection.clear();
    this.selectedPackEst = undefined;
    //this.allowSelectedAll=false;
  }

  search() {
    this.selectedPackEst = undefined;
    this.allowSelectedAll = false;
    const where: any = {
      customer_company: { delete_dt: { eq: null } }
    };

    if (this.selectedCustomers.length > 0) {
      var custGuids = this.selectedCustomers.map(c => c.guid);
      where.customer_company_guid = { in: custGuids };
    }


    if (this.pcForm?.get("customer_cost")?.value !== null && this.pcForm?.get("customer_cost")?.value !== "") {
      const selectedCost: number = Number(this.pcForm?.get("customer_cost")?.value);
      where.cost = { eq: selectedCost }
    }

    if (this.pcForm?.get('profile_name')?.value) {
      const tariffBuffer: any = {}
      tariffBuffer.buffer_type = { eq: this.pcForm?.get('profile_name')?.value }
      where.tariff_buffer = tariffBuffer;
    }

    if (this.pcForm!.value["alias"]) {
      where.customer_company = where.customer_company || {};
      where.customer_company = { alias: { contains: this.pcForm!.value["alias"] } };
    }

    if (this.pcForm!.value["fax_no"]) {
      where.customer_company = where.customer_company || {};
      where.customer_company = { fax: { eq: this.pcForm!.value["fax_no"] } };
    }

    if (this.pcForm!.value["phone"]) {
      where.customer_company = where.customer_company || {};
      where.customer_company = { phone: { eq: this.pcForm!.value["phone"] } };
    }


    if (this.pcForm!.value["email"]) {
      where.customer_company = where.customer_company || {};
      where.customer_company = { email: { eq: this.pcForm!.value["email"] } };
    }

    if (this.pcForm!.value["country"]) {
      where.customer_company = where.customer_company || {};
      where.customer_company = { country: { eq: this.pcForm!.value["country"] } };
    }

    if (this.pcForm!.value["contact_person"]) {
      where.customer_company = where.customer_company || {};
      where.customer_company = { cc_contact_person: { some: { name: { eq: this.pcForm!.value["contact_person"] } } } };
    }

    this.lastSearchCriteria = where;
    this.subs.sink = this.packBuffDS.SearchPackageBuffer(where, this.lastOrderBy, this.pageSize).subscribe(data => {
      this.packBufferItems = data;
      // data[0].storage_cal_cv
      this.previous_endCursor = undefined;
      this.endCursor = this.packBuffDS.pageInfo?.endCursor;
      this.startCursor = this.packBuffDS.pageInfo?.startCursor;
      this.hasNextPage = this.packBuffDS.pageInfo?.hasNextPage ?? false;
      this.hasPreviousPage = this.packBuffDS.pageInfo?.hasPreviousPage ?? false;
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
      this.selection.clear();
      if (!this.hasPreviousPage)
        this.previous_endCursor = undefined;
    });
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


        //this.paginator.pageIndex=this.pageIndex;

      }
    }

    this.searchData(this.lastSearchCriteria, order, first, after, last, before, pageIndex, previousPageIndex);
    //}
  }


  searchData(where: any, order: any, first: any, after: any, last: any, before: any, pageIndex: number,
    previousPageIndex?: number) {
    this.previous_endCursor = this.endCursor;
    this.subs.sink = this.packBuffDS.SearchPackageBuffer(where, order, first, after, last, before).subscribe(data => {
      this.packBufferItems = data;
      this.endCursor = this.packBuffDS.pageInfo?.endCursor;
      this.startCursor = this.packBuffDS.pageInfo?.startCursor;
      this.hasNextPage = this.packBuffDS.pageInfo?.hasNextPage ?? false;
      this.hasPreviousPage = this.packBuffDS.pageInfo?.hasPreviousPage ?? false;
      this.pageIndex = pageIndex;
      this.paginator.pageIndex = this.pageIndex;
      this.selection.clear();
      if (!this.hasPreviousPage)
        this.previous_endCursor = undefined;
    });
  }

  storeSearchCriteria(where: any, order: any, first: any, after: any, last: any, before: any, pageIndex: number,
    previousPageIndex?: number, length?: number, hasNextPage?: boolean, hasPreviousPage?: boolean) {
    const sCriteria: any = {};
    sCriteria.where = where;
    sCriteria.order = order;
    sCriteria.first = first;
    sCriteria.after = after;
    sCriteria.last = last;
    sCriteria.before = before;
    sCriteria.pageIndex = pageIndex;
    sCriteria.previousPageIndex = previousPageIndex;
    sCriteria.length = length;
    sCriteria.hasNextPage = hasNextPage;
    sCriteria.hasPreviousPage = hasPreviousPage;

    this.searchCriteriaService.setCriteria(sCriteria);
  }

  removeSelectedRows() {

  }
  public loadData() {
    this.subs.sink = this.ccDS.loadItems({}, { code: 'ASC' }).subscribe(data => {
    });

    this.subs.sink = this.tariffBuffDS.QueryTariffBufferForSelect({}, null, 100).subscribe(data => {
      this.bufferList = data;
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
    this.customerCodeControl.reset('');
    this.selectedCustomers = [];
    this.selectedPackEst = undefined;
  }

  displayLastUpdated(r: any) {
    var updatedt = r.update_dt;
    if (updatedt === null) {
      updatedt = r.create_dt;
    }
    return this.displayDate(updatedt);

  }


  displayDate(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input);
  }

  // selected(event: MatAutocompleteSelectedEvent): void {
  //   const customer = event.option.value;
  //   const index = this.selectedCustomers.findIndex(c => c.code === customer.code);
  //   if (!(index >= 0)) {
  //     this.selectedCustomers.push(customer);
  //     this.search();
  //   }
  //   else
  //   {
  //     this.selectedCustomers.splice(index, 1);
  //     this.search();
  //   }

  //   if (this.custInput) {
  //     this.searchCustomerCompanyList('');
  //     this.custInput.nativeElement.value = '';

  //   }
  //   // this.updateFormControl();
  //   //this.customerCodeControl.setValue(null);
  //   //this.pcForm?.patchValue({ customer_code: null });
  // }

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
    this.customerCodeControl.setValue(null);
  }

  remove(cust: any): void {
    const index = this.selectedCustomers.findIndex(c => c.code === cust.code);
    if (index >= 0) {
      this.selectedCustomers.splice(index, 1);
      this.search();
    }
  }

  // displayCustomerCompanyFn(customer: any): string {
  //   if (!customer) return '';
  //   return this.selectedCustomers.map(c => ccDS.displayName(c)).join(', ');
  // }

  private updateFormControl(): void {
    // this.pcForm?.get('customer_code')?.setValue(this.selectedCustomers);
  }

  searchCustomerCompanyList(searchCriteria: string) {
    this.subs.sink = this.ccDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
      if (this.custInput?.nativeElement.value === searchCriteria) {
        this.customer_companyList = data;
      }
    });
  }

  toggleEstimate(row: PackageBufferItem) {

    this.selection.toggle(row);
    if (this.selection.selected.length == 1) {
      this.selectedPackEst = row;
    }
    else if (this.selection.selected.length == 0) {
      this.selectedPackEst = undefined;
    }
  }

  HideCheckBox(row: PackageBufferItem): boolean {
    var retval: boolean = false;

    if (this.selectedPackEst) {
      retval = !(this.selectedPackEst.tariff_buffer_guid === row.tariff_buffer_guid);
    }
    return retval;

  }

  HideSelectAllCheckBox() {
    var retval: boolean = true;

    retval = !(this.selectedPackEst);
    if (retval) {
      var first = this.packBufferItems[0];
      if (first) {
        var total = this.packBufferItems.length;
        retval = !(this.packBufferItems.filter(r => r.tariff_buffer_guid === first.tariff_buffer_guid).length === total)
        this.allowSelectedAll = !retval;
      }
    }
    return retval
  }

  onTabFocused() {
    this.resetForm();
    this.search();
  }


  itemSelected(row: CustomerCompanyItem): boolean {
    var retval: boolean = false;
    const index = this.selectedCustomers.findIndex(c => c.code === row.code);
    retval = (index >= 0);
    return retval;
  }

  getSelectedCustomersDisplay(): string {
    var retval: string = "";
    if (this.selectedCustomers?.length > 1) {
      retval = `${this.selectedCustomers.length} ${this.translatedLangText.CUSTOMERS_SELECTED}`;
    }
    else if (this.selectedCustomers?.length == 1) {
      const maxLength = maxLengthDisplaySingleSelectedItem;
      const value = `${this.selectedCustomers[0].name}`;
      retval = `${value.length > maxLength
        ? value.slice(0, maxLength) + '...'
        : value}`;
    }
    return retval;
  }

  removeAllSelectedCustomers(): void {
    this.selectedCustomers = [];
    this.AutoSearch();
  }


  selected(event: MatAutocompleteSelectedEvent): void {
    const customer = event.option.value;
    const index = this.selectedCustomers.findIndex(c => c.code === customer.code);
    if (!(index >= 0)) {
      this.selectedCustomers.push(customer);

    }
    else {
      this.selectedCustomers.splice(index, 1);

    }

    if (this.custInput) {
      this.searchCustomerCompanyList('');
      this.custInput.nativeElement.value = '';

    }
    this.AutoSearch();
    // this.updateFormControl();
    //this.customerCodeControl.setValue(null);
    //this.pcForm?.patchValue({ customer_code: null });
  }

  onCheckboxClicked(row: CustomerCompanyItem) {
    const fakeEvent = { option: { value: row } } as MatAutocompleteSelectedEvent;
    this.selected(fakeEvent);

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
          update_dt: dirEnum,
          create_dt: dirEnum,
        };
        break;

      case 'customer_name':
        this.lastOrderBy = {
          customer_company: {
            name: dirEnum,
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

  displayCurrency(amount: any) {
    return Utility.formatNumberDisplay(amount);
  }

  isAllowEdit() {
    return this.modulePackageService.hasFunctions(['PACKAGE_BUFFER_CLEANING_EDIT']);
  }

  isAllowDelete() {
    return this.modulePackageService.hasFunctions(['PACKAGE_BUFFER_CLEANING_DELETE']);
  }
}