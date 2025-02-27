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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { Utility } from 'app/utilities/utility';
// import { StoringOrderTankDS, StoringOrderTankGO, StoringOrderTankItem, StoringOrderTankUpdateSO } from 'app/data-sources/storing-order-tank';
import { MatDividerModule } from '@angular/material/divider';
import { Apollo } from 'apollo-angular';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
//import { StoringOrderDS, StoringOrderGO, StoringOrderItem } from 'app/data-sources/storing-order';
//import { Observable, Subscription } from 'rxjs';
//import { TankDS, TankItem } from 'app/data-sources/tank';
//import { TariffCleaningDS, TariffCleaningGO, TariffCleaningItem } from 'app/data-sources/tariff-cleaning'
//import { ComponentUtil } from 'app/utilities/component-util';
import { CleaningCategoryItem } from 'app/data-sources/cleaning-category';
//import { CleaningMethodDS, CleaningMethodItem } from 'app/data-sources/cleaning-method';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { CustomerCompanyCleaningCategoryDS, CustomerCompanyCleaningCategoryItem } from 'app/data-sources/customer-company-category';
import { PackageLabourDS, PackageLabourItem } from 'app/data-sources/package-labour';
import { SearchCriteriaService } from 'app/services/search-criteria.service';
import { ComponentUtil } from 'app/utilities/component-util';
import { FormDialogComponent } from './form-dialog/form-dialog.component';

@Component({
  selector: 'app-package-labour',
  standalone: true,
  templateUrl: './package-labour.component.html',
  styleUrl: './package-labour.component.scss',
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
export class PackageLabourComponent extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  displayedColumns = [
    'select',
    'fName',
    'lName',
    'email',
    'gender',
  ];

  CLEANING_LAST_UPDATED_DT = 'COMMON-FORM.LAST-UPDATED'

  customerCodeControl = new UntypedFormControl();
  categoryControl = new UntypedFormControl();

  ccDS: CustomerCompanyDS;

  custCompClnCatDS: CustomerCompanyCleaningCategoryDS;
  packLabourDS: PackageLabourDS;

  custCompClnCatItems: CustomerCompanyCleaningCategoryItem[] = [];
  customer_companyList1?: CustomerCompanyItem[];
  cleaning_categoryList?: CleaningCategoryItem[];
  pack_labourList?: PackageLabourItem[];

  pageIndex = 0;
  pageSize = 10;
  lastSearchCriteria: any;
  lastOrderBy: any = { customer_company: { code: "ASC" }, cleaning_category: { sequence: "ASC" } };
  endCursor: string | undefined = undefined;
  previous_endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;

  selection = new SelectionModel<CustomerCompanyCleaningCategoryItem>(true, []);

  id?: number;
  plForm?: UntypedFormGroup;
  translatedLangText: any = {}
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.CARGO-DETAILS',
    HEADER_OTHER: 'COMMON-FORM.CARGO-OTHER-DETAILS',
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
    SAVE_SUCCESS: 'COMMON-FORM.SAVE-SUCCESS',
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
    CANCELED_SUCCESS: 'COMMON-FORM.CANCELED-SUCCESS',
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
    CARGO_UN_NO: 'COMMON-FORM.CARGO-UN-NO',
    CARGO_METHOD: 'COMMON-FORM.CARGO-METHOD',
    CARGO_CATEGORY: 'COMMON-FORM.CARGO-CATEGORY',
    CARGO_FLASH_POINT: 'COMMON-FORM.CARGO-FLASH-POINT',
    CARGO_COST: 'COMMON-FORM.CARGO-COST',
    CARGO_HAZARD_LEVEL: 'COMMON-FORM.CARGO-HAZARD-LEVEL',
    CARGO_BAN_TYPE: 'COMMON-FORM.CARGO-BAN-TYPE',
    CARGO_NATURE: 'COMMON-FORM.CARGO-NATURE',
    CARGO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    CARGO_ALERT: 'COMMON-FORM.CARGO-ALERT',
    CARGO_NOTE: 'COMMON-FORM.CARGO-NOTE',
    CARGO_CLASS_1: "COMMON-FORM.CARGO-CALSS-1",
    CARGO_CLASS_1_4: "COMMON-FORM.CARGO-CALSS-1-4",
    CARGO_CLASS_1_5: "COMMON-FORM.CARGO-CALSS-1-5",
    CARGO_CLASS_1_6: "COMMON-FORM.CARGO-CALSS-1-6",
    CARGO_CLASS_2_1: "COMMON-FORM.CARGO-CALSS-2-1",
    CARGO_CLASS_2_2: "COMMON-FORM.CARGO-CALSS-2-2",
    CARGO_CLASS_2_3: "COMMON-FORM.CARGO-CALSS-2-3",
    PACKAGE_MIN_COST: 'COMMON-FORM.PACKAGE-MIN-COST',
    PACKAGE_MAX_COST: 'COMMON-FORM.PACKAGE-MAX-COST',
    PACKAGE_DETAIL: 'COMMON-FORM.PACKAGE-DETAIL',
    PACKAGE_CLEANING_ADJUSTED_COST: "COMMON-FORM.PACKAGE-CLEANING-ADJUST-COST",
    COST: "COMMON-FORM.COST",
    CLEANING_LAST_UPDATED_DT: 'COMMON-FORM.LAST-UPDATED',
    PACKAGE_LABOUR: "COMMON-FORM.PACKAGE-LABOUR",
    CONFIRM_RESET: 'COMMON-FORM.CONFIRM-RESET',
    CUSTOMER_COST: "COMMON-FORM.CUSTOMER-COST",
    STANDARD_COST: "COMMON-FORM.STANDARD-COST",

    LAST_UPDATE: "COMMON-FORM.LAST-UPDATED",
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL'
  }

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    // public advanceTableService: AdvanceTableService,
    private snackBar: MatSnackBar,
    private searchCriteriaService: SearchCriteriaService,
    private translate: TranslateService

  ) {
    super();
    this.initPlForm();
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.packLabourDS = new PackageLabourDS(this.apollo);
    this.custCompClnCatDS = new CustomerCompanyCleaningCategoryDS(this.apollo);
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.loadData();
    this.translateLangText();
    this.search();
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  initPlForm() {
    this.plForm = this.fb.group({
      guid: [{ value: '' }],
      customer_code: this.customerCodeControl,
      min_cost: [''],
      max_cost: ['']
    });
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
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
      width: '600px',
      data: {
        action: 'new',
        langText: this.langText,
        selectedItems: this.selection.selected
      }

    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result > 0) {
        //  if(result.selectedValue>0)
        // {
        this.handleSaveSuccess(result);
        if (this.packLabourDS.totalCount > 0)
          this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
        //}
      }
    });
  }
  editCall(row: PackageLabourItem) {
    // this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    var rows: PackageLabourItem[] = [];
    rows.push(row);
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '600px',
      data: {
        action: 'new',
        langText: this.langText,
        selectedItems: rows
      }

    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result > 0) {
        // if(result.selectedValue>0)
        //{
        this.handleSaveSuccess(result);
        //this.search();
        if (this.packLabourDS.totalCount > 0)
          this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
        // }
      }
    });

  }


  deleteItem(row: any) {
    // this.id = row.id;
    // let tempDirection: Direction;
    // if (localStorage.getItem('isRtl') === 'true') {
    //   tempDirection = 'rtl';
    // } else {
    //   tempDirection = 'ltr';
    // }
    // const dialogRef = this.dialog.open(DeleteDialogComponent, {
    //   data: row,
    //   direction: tempDirection,
    // });
    // this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    //   if (result === 1) {
    //     const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
    //       (x) => x.id === this.id
    //     );
    //     // for delete we use splice in order to remove single object from DataService
    //     if (foundIndex != null && this.exampleDatabase) {
    //       this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
    //       this.refreshTable();
    //       this.showNotification(
    //         'snackbar-danger',
    //         'Delete Record Successfully...!!!',
    //         'bottom',
    //         'center'
    //       );
    //     }
    //   }
    // });
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.pack_labourList?.length;
    return numSelected === numRows;
  }

  isSelected(option: any): boolean {
    return this.customerCodeControl.value.includes(option);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.pack_labourList?.forEach((row) =>
        this.selection.select(row)
      );
  }



  search() {
    const where: any = {};

    if (this.customerCodeControl.value) {
      if (this.customerCodeControl.value.length > 0) {


        const customerCodes: CustomerCompanyItem[] = this.customerCodeControl.value;
        var guids = customerCodes.map(cc => cc.guid);
        where.customer_company_guid = { in: guids };
      }
    }


    if (this.plForm!.value["min_cost"] && this.plForm!.value["max_cost"]) {
      const minCost: number = Number(this.plForm!.value["min_cost"]);
      const maxCost: number = Number(this.plForm!.value["max_cost"]);
      where.cost = { gte: minCost, lte: maxCost };
    } else if (this.plForm!.value["min_cost"]) {
      const minCost: number = Number(this.plForm!.value["min_cost"]);
      where.cost = { gte: minCost };
    } else if (this.plForm!.value["max_cost"]) {
      const maxCost: number = Number(this.plForm!.value["max_cost"]);
      where.cost = { lte: maxCost };
    }

    this.lastSearchCriteria = where;
    this.subs.sink = this.packLabourDS.search(where, this.lastOrderBy, this.pageSize).subscribe(data => {
      this.pack_labourList = data;
      this.previous_endCursor = undefined;
      this.endCursor = this.packLabourDS.pageInfo?.endCursor;
      this.startCursor = this.packLabourDS.pageInfo?.startCursor;
      this.hasNextPage = this.packLabourDS.pageInfo?.hasNextPage ?? false;
      this.hasPreviousPage = this.packLabourDS.pageInfo?.hasPreviousPage ?? false;
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
      this.selection.clear();
      if (!this.hasPreviousPage)
        this.previous_endCursor = undefined;
    });
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.langText.SAVE_SUCCESS;
      this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
        successMsg = res;
        ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);

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


        //this.paginator.pageIndex=this.pageIndex;

      }
    }

    this.searchData(this.lastSearchCriteria, order, first, after, last, before, pageIndex, previousPageIndex);
    //}
  }

  searchData(where: any, order: any, first: any, after: any, last: any, before: any, pageIndex: number,
    previousPageIndex?: number) {
    this.previous_endCursor = this.endCursor;
    this.subs.sink = this.packLabourDS.search(where, order, first, after, last, before).subscribe(data => {
      this.pack_labourList = data;
      this.endCursor = this.packLabourDS.pageInfo?.endCursor;
      this.startCursor = this.packLabourDS.pageInfo?.startCursor;
      this.hasNextPage = this.packLabourDS.pageInfo?.hasNextPage ?? false;
      this.hasPreviousPage = this.packLabourDS.pageInfo?.hasPreviousPage ?? false;
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
    // const totalSelect = this.selection.selected.length;
    // this.selection.selected.forEach((item) => {
    //   const index: number = this.dataSource.renderedData.findIndex(
    //     (d) => d === item
    //   );
    //   // console.log(this.dataSource.renderedData.findIndex((d) => d === item));
    //   this.exampleDatabase?.dataChange.value.splice(index, 1);
    //   this.refreshTable();
    //   this.selection = new SelectionModel<AdvanceTable>(true, []);
    // });
    // this.showNotification(
    //   'snackbar-danger',
    //   totalSelect + ' Record Delete Successfully...!!!',
    //   'bottom',
    //   'center'
    // );
  }
  public loadData() {

    this.subs.sink = this.ccDS.loadItems({}, { code: 'ASC' }).subscribe(data => {
      // this.customer_companyList1 = data
    });

    // this.clnCatDS.loadItems({ name: { neq: null }},{ sequence: 'ASC' }).subscribe(data=>{
    //   if(this.clnCatDS.totalCount>0)
    //   {
    //     this.cleaning_categoryList=data;
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
  onContextMenu(event: MouseEvent, item: any) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    if (this.contextMenu !== undefined && this.contextMenu.menu !== null) {
      this.contextMenu.menuData = { item: item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }

  onlyNumbersDashValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const regex = /^[0-9-]*$/;
    if (control.value && !regex.test(control.value)) {
      return { 'invalidCharacter': true };
    }
    return null;
  }


  displayLastUpdated(r: PackageLabourItem) {
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
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        headerText: this.translatedLangText.CONFIRM_RESET,
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
    this.initPlForm();

    this.customerCodeControl.reset('');

  }
}
