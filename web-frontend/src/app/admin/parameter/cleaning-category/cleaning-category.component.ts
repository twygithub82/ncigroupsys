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
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { CleaningCategoryDS, CleaningCategoryItem } from 'app/data-sources/cleaning-category';
import { CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyItem } from 'app/data-sources/customer-company';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { ModulePackageService } from 'app/services/module-package.service';
import { ComponentUtil } from 'app/utilities/component-util';
import { pageSizeInfo, Utility, maxLengthDisplaySingleSelectedItem } from 'app/utilities/utility';
import { Subscription } from 'rxjs';
import { FormDialogComponent } from './form-dialog/form-dialog.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { utils } from 'xlsx';

@Component({
  selector: 'app-cleaning-category',
  standalone: true,
  templateUrl: './cleaning-category.component.html',
  styleUrl: './cleaning-category.component.scss',
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
    MatChipsModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class CleaningCategoryComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'category_name',
    'category_description',
    'category_cost',
    'update_date',
    'actions'
  ];

  pageTitle = 'MENUITEMS.CLEANING-MANAGEMENT.LIST.CLEAN-CATEGORY'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.CLEANING-MANAGEMENT.TEXT', route: '/admin/parameter/cleaning-category' }
  ]

  translatedLangText: any = {};
  separatorKeysCodes: number[] = [ENTER, COMMA];

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
    CANCELED_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    SEARCH: "COMMON-FORM.SEARCH",
    NAME: "COMMON-FORM.NAME",
    DESCRIPTION: "COMMON-FORM.DESCRIPTION",
    CATEGORY_COST: "COMMON-FORM.CARGO-COST",
    NEW: 'COMMON-FORM.NEW',
    REFRESH: 'COMMON-FORM.REFRESH',
    EXPORT: 'COMMON-FORM.EXPORT',
    MIN_COST: 'COMMON-FORM.PACKAGE-MIN-COST',
    MAX_COST: 'COMMON-FORM.PACKAGE-MAX-COST',
    LAST_UPDATED: 'COMMON-FORM.LAST-UPDATED',
    SAVE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    CATEGORY_DESCRIPTION_SELECTED: 'COMMON-FORM.SELECTED',
    CATEGORY_NAME_SELECTED: 'COMMON-FORM.SELECTED'
  }

  soSelection = new SelectionModel<StoringOrderItem>(true, []);
  searchField: string = "";
  purposeOptionCvList: CodeValuesItem[] = [];
  searchForm?: UntypedFormGroup;
  customerCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  customer_companyList?: CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];
  soStatusCvList: CodeValuesItem[] = [];

  catList: CleaningCategoryItem[] = [];
  soList: StoringOrderItem[] = [];
  catDS: CleaningCategoryDS;
  catDSList: CleaningCategoryDS;
  descList: string[] = [];
  nameList: string[] = [];

  pageIndex = 0;
  pageSize = pageSizeInfo.defaultSize;
  lastSearchCriteria: any;
  lastOrderBy: any = { name: "ASC" };
  endCursor: string | undefined = undefined;
  previous_endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    public modulePackageService: ModulePackageService,
  ) {
    super();
    this.translateLangText();
    this.initSearchForm();
    this.catDS = new CleaningCategoryDS(this.apollo);
    this.catDSList = new CleaningCategoryDS(this.apollo);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  messages = [];
  messageSubscription?: Subscription;

  ngOnInit() {
    this.initializeFilterCustomerCompany();
    this.loadData();
    this.initializeValueChanges();
  }
  refresh() {
    this.onPageEvent({
      pageIndex: this.pageIndex, pageSize: this.pageSize,
      length: 0
    });
  }

  initializeValueChanges() {
    var searchObj = this.searchForm;
    searchObj?.get("name")!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        this.catDSList.search({ name: { contains: value } }, { name: "ASC" }, 100).subscribe(data => {
          this.nameList = data.map(i => i.name || '');
        });
      })
    ).subscribe();

    searchObj?.get("description")!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        this.catDSList.search({ description: { contains: value } }, { description: "ASC" }, 100).subscribe(data => {
          this.descList = data.map(i => i.description || '');
        });
      })
    ).subscribe();
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      name: [''],
      description: [''],
      min_cost: [''],
      max_cost: [''],

    });
  }

  displayLastUpdated(r: CleaningCategoryItem) {
    var updatedt = r.update_dt;
    if (updatedt === null) {
      updatedt = r.create_dt;
    }
    return this.displayDate(updatedt);
  }

  displayDate(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input);
  }

  canCancelSelectedRows(): boolean {
    return false;
  }

  cancelSelectedRows(row: StoringOrderItem[]) {
  }

  public loadData() {
    this.search();
    // this.subs.sink = this.soDS.searchStoringOrder({}).subscribe(data => {
    //   if (this.soDS.totalCount > 0) {
    //     this.soList = data;
    //   }
    // });
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
    const where: any = {};

    var order = this.lastOrderBy;

    if (this.selectedNames.length > 0) {
      where.name = { in: this.selectedNames };
    }

    if (this.selectedDescs.length > 0) {
      where.description = { in: this.selectedDescs };
    }


    // if (this.searchForm!.value['name']) {
    //   where.name = { contains: this.searchForm!.value['name'] };
    // }

    // if (this.searchForm!.value['description']) {
    //   where.description = { contains: this.searchForm!.value['description'] };
    // }

    if (this.searchForm!.value['min_cost']) {
      where.cost = { gte: Number(this.searchForm!.value['min_cost']) }
    }

    if (this.searchForm!.value['max_cost']) {
      where.cost = { ngt: Number(this.searchForm!.value['max_cost']) }
    }

    // TODO :: search criteria
    this.previous_endCursor = this.endCursor;
    this.subs.sink = this.catDS.loadItems(where, order).subscribe(data => {
      this.catList = data;
      this.endCursor = this.catDS.pageInfo?.endCursor;
      this.startCursor = this.catDS.pageInfo?.startCursor;
      this.hasNextPage = this.catDS.pageInfo?.hasNextPage ?? false;
      this.hasPreviousPage = this.catDS.pageInfo?.hasPreviousPage ?? false;
      this.pageIndex = 0;
      this.paginator.pageIndex = this.pageIndex;
      if (!this.hasPreviousPage)
        this.previous_endCursor = undefined;
    });
  }

  searchData(where: any, order: any, first: any, after: any, last: any, before: any, pageIndex: number,
    previousPageIndex?: number) {
    this.previous_endCursor = this.endCursor;
    this.subs.sink = this.catDS.search(where, order, first, after, last, before).subscribe(data => {
      this.catList = data;
      this.endCursor = this.catDS.pageInfo?.endCursor;
      this.startCursor = this.catDS.pageInfo?.startCursor;
      this.hasNextPage = this.catDS.pageInfo?.hasNextPage ?? false;
      this.hasPreviousPage = this.catDS.pageInfo?.hasPreviousPage ?? false;
      this.pageIndex = pageIndex;
      this.paginator.pageIndex = this.pageIndex;
      if (!this.hasPreviousPage)
        this.previous_endCursor = undefined;

    });
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

    this.searchData(this.lastSearchCriteria, order, first, after, last, before, pageIndex, previousPageIndex);
    //}
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} - ${cc.name}` : '';
  }

  initializeFilterCustomerCompany() {
  }

  addCall() {
    // this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    var row = new CleaningCategoryItem();
    //  rows.push(row);
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '50vw',
      data: {
        action: 'new',
        langText: this.langText,
        selectedItem: row
      }

    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result > 0) {
        this.handleSaveSuccess(result);
        //this.search();
        this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });

      }
    });

  }
  editCall(row: CleaningCategoryItem) {
    // this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    //  var rows :CustomerCompanyCleaningCategoryItem[] =[] ;
    //  rows.push(row);
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '50vw',
      data: {
        action: 'new',
        langText: this.langText,
        selectedItem: row
      }

    });



    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result > 0) {

        this.handleSaveSuccess(result);
        //this.search();
        this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });

      }
    });

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
  }

  resetForm() {
    this.searchForm?.patchValue({
      description: '',
      name: ''
    });
    this.description_removeAllSelected();
    this.name_removeAllSelected();
  }

  handleDelete(event: Event, row: any,): void {
    event.preventDefault();
    event.stopPropagation();
    this.deleteItem(row);
  }

  deleteItem(row: CleaningCategoryItem) {

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        headerText: this.translatedLangText.ARE_YOU_SURE_DELETE,
        action: 'new',
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        this.RmoveCleaningCategory(row.guid!);
      }
    });
  }

  CanDelete(row: CleaningCategoryItem): boolean {
    if (!this.isAllowDelete()) return false;
    var bRetval: boolean = false;

    if (!bRetval) {
      bRetval = (row?.tariff_cleanings?.length || 0) === 0;
    }
    return bRetval;
  }

  RmoveCleaningCategory(guids: string) {
    this.catDS.deleteCleaningCategory([guids]).subscribe(result => {
      if (result.data.deleteCleaningCategory) {
        this.handleSaveSuccess(result.data.deleteCleaningCategory);
        this.search();
      }
    })

  }


  @ViewChild('nameInput', { static: true })
  nameInput?: ElementRef<HTMLInputElement>;
  selectedNames: any[] = [];
  name_itemSelected(row: any): boolean {
    var itm = this.selectedNames;
    var retval: boolean = false;
    const index = itm.findIndex(c => c === row);
    retval = (index >= 0);
    return retval;
  }


  name_getSelectedDisplay(): string {
    var itm = this.selectedNames;
    var retval: string = "";
    if (itm?.length > 1) {
      retval = `${itm.length} ${this.translatedLangText.CATEGORY_NAME_SELECTED}`;
    }
    else if (itm?.length == 1) {
      const maxLength = maxLengthDisplaySingleSelectedItem;
            const value=`${itm[0]}`;
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
    var cnt = this.searchForm?.get('name');
    var elmInput = this.nameInput;
    const val = event.option.value;
    const index = itm.findIndex(c => c === val);
    if (!(index >= 0)) {
      itm.push(val);
      // this.search();
    }
    else {
      itm.splice(index, 1);
     
    }

    if (elmInput) {

      elmInput.nativeElement.value = '';
      cnt?.setValue('');

    }
    this.AutoSearch();
    // this.updateFormControl();
    //this.customerCodeControl.setValue(null);
    //this.pcForm?.patchValue({ customer_code: null });
  }

  AutoSearch()
  {
    if (Utility.IsAllowAutoSearch())
        this.search();
  }
  name_onCheckboxClicked(row: any) {
    const fakeEvent = { option: { value: row } } as MatAutocompleteSelectedEvent;
    this.name_selected(fakeEvent);

  }

  name_add(event: MatChipInputEvent): void {
    var cnt = this.searchForm?.get('name');
    debugger
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



  @ViewChild('descInput', { static: true })
  descInput?: ElementRef<HTMLInputElement>;
  selectedDescs: any[] = [];
  description_itemSelected(row: any): boolean {
    var itm = this.selectedDescs;
    var retval: boolean = false;
    const index = itm.findIndex(c => c === row);
    retval = (index >= 0);
    return retval;
  }




  description_getSelectedDisplay(): string {
    var itm = this.selectedDescs;
    var retval: string = "";
    if (itm?.length > 1) {
      retval = `${itm.length} ${this.translatedLangText.CATEGORY_DESCRIPTION_SELECTED}`;
    }
    else if (itm?.length == 1) {
      const maxLength = maxLengthDisplaySingleSelectedItem;
      const value=`${itm[0]}`;
      retval = `${value.length > maxLength 
        ? value.slice(0, maxLength) + '...' 
        : value}`;
    }
    return retval;
  }



  description_removeAllSelected(): void {
    this.selectedDescs = [];
    this.AutoSearch();
  }

  description_selected(event: MatAutocompleteSelectedEvent): void {
    var itm = this.selectedDescs;
    var cnt = this.searchForm?.get('description');
    var elmInput = this.descInput;
    const val = event.option.value;
    const index = itm.findIndex(c => c === val);
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
    // this.updateFormControl();
    //this.customerCodeControl.setValue(null);
    //this.pcForm?.patchValue({ customer_code: null });
  }

  description_onCheckboxClicked(row: any) {
    const fakeEvent = { option: { value: row } } as MatAutocompleteSelectedEvent;
    this.description_selected(fakeEvent);
  }

  description_add(event: MatChipInputEvent): void {
    var cnt = this.searchForm?.get('description');
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

  parse2Decimal(figure: number | string) {
    return Utility.formatNumberDisplay(figure)
  }

  isAllowEdit() {
    return this.modulePackageService.hasFunctions(['CLEANING_MANAGEMENT_CLEANING_CATEGORY_EDIT']);
  }

  isAllowAdd() {
    return this.modulePackageService.hasFunctions(['CLEANING_MANAGEMENT_CLEANING_CATEGORY_ADD']);
  }

  isAllowDelete() {
    return this.modulePackageService.hasFunctions(['CLEANING_MANAGEMENT_CLEANING_CATEGORY_DELETE']);
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
          case 'update_date':
            this.lastOrderBy = {
                update_dt: dirEnum,
                create_dt: dirEnum,
            };
            break;
  
          case 'category_name':
            this.lastOrderBy = {
                name: dirEnum,
            };
            break;
        
          default:
            this.lastOrderBy = null;
        }
    
        this.search();
      }
}
