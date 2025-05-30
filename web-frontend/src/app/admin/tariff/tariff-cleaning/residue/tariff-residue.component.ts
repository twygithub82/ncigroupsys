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
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { CleaningCategoryItem } from 'app/data-sources/cleaning-category';
import { CustomerCompanyItem } from 'app/data-sources/customer-company';
import { CustomerCompanyCleaningCategoryItem } from 'app/data-sources/customer-company-category';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { TariffLabourItem } from 'app/data-sources/tariff-labour';
import { TariffResidueDS, TariffResidueItem } from 'app/data-sources/tariff-residue';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { SearchCriteriaService } from 'app/services/search-criteria.service';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { firstValueFrom } from 'rxjs';
import { FormDialogComponent_Edit } from './form-dialog-edit/form-dialog.component';
import { FormDialogComponent_New } from './form-dialog-new/form-dialog.component';
@Component({
  selector: 'app-tariff-residue',
  standalone: true,
  templateUrl: './tariff-residue.component.html',
  styleUrl: './tariff-residue.component.scss',
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
    PreventNonNumericDirective
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class TariffResidueComponent extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  displayedColumns = [
    // 'select',
    // // 'img',
    'fName',
    'lName',
    'email',
    //  'gender',
    // 'bDate',
    // 'mobile',
    'actions',
  ];

  PROCEDURE_NAME = 'COMMON-FORM.PROCEDURE-NAME'
  PROCEDURE_DESCRIPTION = 'COMMON-FORM.DESCRIPTION'
  PROCEDURE_CLEAN_CATEGORY = 'COMMON-FORM.CLEAN-CATEGORY'
  PROCEDURE_CLEAN_GROUP = 'COMMON-FORM.CLEAN-GROUP'
  PROCEDURE_MIN_COST = 'COMMON-FORM.MIN-COST'
  PROCEDURE_MAX_COST = 'COMMON-FORM.MAX-COST'
  PROCEDURE_TOTAL_DURATION = 'COMMON-FORM.TOTAL-DURATION'
  PROCEDURE_REQUIRED = 'COMMON-FORM.IS-REQUIRED'
  PROCEDURE_STEPS = 'COMMON-FORM.PROCEDURE-STEPS'
  PROCEDURE_STEP_NAME = 'COMMON-FORM.STEP-NAME'
  PROCEDURE_STEP_DURATION = 'COMMON-FORM.STEP-DURATION'
  PROCEDURE_STEP_DURATION_TOOLTIP = 'COMMON-FORM.STEP-DURATION-TOOLTIP'
  CLEANING_GROUP_NAME = 'COMMON-FORM.GROUP-NAME'
  CLEANING_BAY = 'COMMON-FORM.BAY'

  CLEANING_LAST_UPDATED_DT = 'COMMON-FORM.LAST-UPDATED'

  customerCodeControl = new UntypedFormControl();
  categoryControl = new UntypedFormControl();

  tariffResidueDS: TariffResidueDS;

  tariffResidueItems: TariffResidueItem[] = [];
  sotDS: StoringOrderTankDS;

  custCompClnCatItems: CustomerCompanyCleaningCategoryItem[] = [];
  customer_companyList1?: CustomerCompanyItem[];
  cleaning_categoryList?: CleaningCategoryItem[];

  pageIndex = 0;
  pageSize = 10;
  lastSearchCriteria: any;
  lastOrderBy: any = { tariff_residue: { description: "ASC" } };
  endCursor: string | undefined = undefined;
  previous_endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;

  selection = new SelectionModel<TariffResidueItem>(true, []);

  id?: number;
  pcForm?: UntypedFormGroup;
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
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    COST: 'COMMON-FORM.COST',
    LAST_UPDATED: "COMMON-FORM.LAST-UPDATED",
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    TARIFF_RESIDUE_ASSIGNED: 'COMMON-FORM.TARIFF-RESIDUE-ASSIGNED',
    ARE_U_SURE_DELETE: 'COMMON-FORM.ARE-YOU-SURE-DELETE',
  }

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private snackBar: MatSnackBar,
    private searchCriteriaService: SearchCriteriaService,
    private translate: TranslateService
  ) {
    super();
    this.initTcForm();
    // this.ccDS = new CustomerCompanyDS(this.apollo);
    // this.clnCatDS= new CleaningCategoryDS(this.apollo);
    // this.custCompClnCatDS=new CustomerCompanyCleaningCategoryDS(this.apollo);
    this.tariffResidueDS = new TariffResidueDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
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
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  initTcForm() {
    this.pcForm = this.fb.group({
      guid: [{ value: '' }],
      // customer_code: this.customerCodeControl,
      // cleaning_category:this.categoryControl,
      description: [''],
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

  addCall() {
    // this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    //  var rows :CustomerCompanyCleaningCategoryItem[] =[] ;
    //  rows.push(row);
    const dialogRef = this.dialog.open(FormDialogComponent_New, {
      width: '600px',
      height: 'auto',
      data: {
        action: 'new',
        langText: this.langText,
        selectedItem: null
      }
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result > 0) {
        if (this.tariffResidueDS.totalCount > 0) {
          this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
        }

        this.handleSaveSuccess(result);
      }
    });
  }

  preventDefault(event: Event) {
    event.preventDefault(); // Prevents the form submission
  }

  displayLastUpdated(r: TariffLabourItem) {
    var updatedt = r.update_dt;
    if (updatedt === null) {
      updatedt = r.create_dt;
    }
    return this.displayDate(updatedt);

  }


  displayDate(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input);
  }

  adjustCost() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent_Edit, {
      width: '600px',
      data: {
        action: 'new',
        langText: this.langText,
        selectedItems: this.selection.selected
      }

    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.selectedValue > 0) {
          this.handleSaveSuccess(result.selectedValue);
          this.search();
        }
      }
    });
  }

  editCall(row: TariffResidueItem) {
    // this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent_Edit, {
      width: '600px',
      data: {
        action: 'edit',
        langText: this.langText,
        selectedItem: row
      }

    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //if(result.selectedValue>0)
        //{
        this.handleSaveSuccess(result);
        if (this.tariffResidueDS.totalCount > 0) {
          this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
        }
        //}
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
    const numRows = this.custCompClnCatItems.length;
    return numSelected === numRows;
  }

  isSelected(option: any): boolean {
    return this.customerCodeControl.value.includes(option);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.custCompClnCatItems.forEach((row) =>
        this.selection.select(row)
      );
  }

  search() {
    const where: any = {
      and: []
    };
    const tariff_residue: any = {
      tariff_residue: {
        delete_dt: {
          eq: null
        }
      }
    }
    where.and.push(tariff_residue);

    // if (this.pcForm!.value["description"]) {
    //   // if(!where.and) where.and=[];
    //   const description: Text = this.pcForm!.value["description"];
    //   where.and.push({ description: { contains: description } });
    // }

    // if (this.pcForm!.value["min_cost"]) {
    //   // if(!where.and) where.and=[];
    //   const minCost: number = Number(this.pcForm!.value["min_cost"]);
    //   where.and.push({ cost: { gte: minCost } });
    // }

    // if (this.pcForm!.value["max_cost"]) {
    //   //if(!where.and) where.and=[];
    //   const maxCost: number = Number(this.pcForm!.value["max_cost"]);
    //   where.and.push({ cost: { ngte: maxCost } });
    // }
    this.lastSearchCriteria = where;
    // this.subs.sink = this.tariffResidueDS.SearchTariffResidue(where, this.lastOrderBy, this.pageSize).subscribe(data => {
    //   this.tariffResidueItems = data;
    //   this.previous_endCursor = undefined;
    //   this.endCursor = this.tariffResidueDS.pageInfo?.endCursor;
    //   this.startCursor = this.tariffResidueDS.pageInfo?.startCursor;
    //   this.hasNextPage = this.tariffResidueDS.pageInfo?.hasNextPage ?? false;
    //   this.hasPreviousPage = this.tariffResidueDS.pageInfo?.hasPreviousPage ?? false;
    //   this.pageIndex = 0;
    //   this.paginator.pageIndex = 0;
    //   this.selection.clear();
    //   if (!this.hasPreviousPage)
    //     this.previous_endCursor = undefined;
    // });
    this.subs.sink = this.tariffResidueDS.SearchTariffResidueWithCount(this.lastSearchCriteria, this.lastOrderBy, this.pageSize).subscribe(data => {
      this.tariffResidueItems = data;
      this.previous_endCursor = undefined;
      this.endCursor = this.tariffResidueDS.pageInfo?.endCursor;
      this.startCursor = this.tariffResidueDS.pageInfo?.startCursor;
      this.hasNextPage = this.tariffResidueDS.pageInfo?.hasNextPage ?? false;
      this.hasPreviousPage = this.tariffResidueDS.pageInfo?.hasPreviousPage ?? false;
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
    this.subs.sink = this.tariffResidueDS.SearchTariffResidueWithCount(where, order, first, after, last, before).subscribe(data => {
      this.tariffResidueItems = data;
      this.endCursor = this.tariffResidueDS.pageInfo?.endCursor;
      this.startCursor = this.tariffResidueDS.pageInfo?.startCursor;
      this.hasNextPage = this.tariffResidueDS.pageInfo?.hasNextPage ?? false;
      this.hasPreviousPage = this.tariffResidueDS.pageInfo?.hasPreviousPage ?? false;
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
    this.search();
    // this.subs.sink = this.ccDS.loadItems({}, { code: 'ASC' }).subscribe(data => {
    //  // this.customer_companyList1 = data
    // });

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
        this.search();
      }
    });
  }

  resetForm() {
    this.initTcForm();
  }

  cancelItem(row: TariffResidueItem) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        headerText: this.translatedLangText.ARE_U_SURE_DELETE,
        act: "warn"
      },
      direction: tempDirection
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.action == "confirmed") {
        this.deleteTariffAndPackageResidue(row.guid!);
      }
    });
  }

  deleteTariffAndPackageResidue(tariffResidueGuid: string) {
    this.tariffResidueDS.deleteTariffResidue([tariffResidueGuid]).subscribe(d => {
      let count = d.data.deleteTariffResidue;
      if (count > 0) {
        this.handleSaveSuccess(count);
        if (this.tariffResidueDS.totalCount > 0) {
          this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
        }
      }
    });
  }

  async TariffResidueAssigned(tariffResidueGuid: string): Promise<boolean> {
    let retval: boolean = false;
    var where: any = {};

    where = {
      and: [{ residue: { some: { residue_part: { some: { tariff_residue_guid: { eq: tariffResidueGuid } } } } } },
      { or: [{ delete_dt: { eq: 0 } }, { delete_dt: { eq: null } }] }]
    };

    try {
      // Use firstValueFrom to convert Observable to Promise
      const result = await firstValueFrom(this.sotDS.searchStoringOrderTanks(where, {}, 1));
      retval = (result.length > 0)
    } catch (error) {
      console.error("Error fetching tariff residue guid:", error);
    }

    return retval;
  }

  parse2Decimal(input: number | string | undefined) {
    return Utility.formatNumberDisplay(input);
  }

  onTabFocused() {
    this.resetForm();
    this.search();
  }
}

