import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild,HostListener } from '@angular/core';
import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag, CdkDragHandle, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, FormsModule, ReactiveFormsModule, FormControl,AbstractControl,Validators } from '@angular/forms';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { NgClass, DatePipe, CommonModule } from '@angular/common';
import { NgScrollbar } from 'ngx-scrollbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UnsubscribeOnDestroyAdapter, TableElement, TableExportUtil } from '@shared';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { AdvanceTable } from 'app/advance-table/advance-table.model';
import { map, filter, tap, catchError, finalize, switchMap, debounceTime, startWith } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { Utility } from 'app/utilities/utility';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { StoringOrderTankDS, StoringOrderTankGO, StoringOrderTankItem, StoringOrderTankUpdateSO } from 'app/data-sources/storing-order-tank';
// import { StoringOrderService } from 'app/services/storing-order.service';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values'
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company'
import { MatRadioModule } from '@angular/material/radio';
import { Apollo } from 'apollo-angular';
import { MatDividerModule } from '@angular/material/divider';
import { StoringOrderDS, StoringOrderGO, StoringOrderItem } from 'app/data-sources/storing-order';
import { Observable, Subscription } from 'rxjs';
import { TankDS, TankItem } from 'app/data-sources/tank';
import { TariffCleaningDS, TariffCleaningGO, TariffCleaningItem } from 'app/data-sources/tariff-cleaning'
import { ComponentUtil } from 'app/utilities/component-util';
import { CleaningCategoryDS, CleaningCategoryItem } from 'app/data-sources/cleaning-category';
import { CleaningMethodDS, CleaningMethodItem } from 'app/data-sources/cleaning-method';
import { MatTabBody, MatTabGroup, MatTabHeader, MatTabsModule } from '@angular/material/tabs';
import {ExampleDataSource} from 'app/advance-table/advance-table.component';
import { AdvanceTableService } from 'app/advance-table/advance-table.service';
import { CustomerCompanyCleaningCategoryDS,CustomerCompanyCleaningCategoryItem } from 'app/data-sources/customer-company-category';
@Component({
  selector: 'app-package-cleaning',
  standalone: true,
  templateUrl: './package-cleaning.component.html',
  styleUrl: './package-cleaning.component.scss',
  imports: [
    BreadcrumbComponent,
    MatButtonModule,
    MatSidenavModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatTabsModule,
    MatTabGroup,
    MatTabHeader,
    MatTabBody,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    NgScrollbar,
    NgClass,
    DatePipe,
    MatNativeDateModule,
    TranslateModule,
    CommonModule,
    MatLabel,
    MatTableModule,
    MatPaginatorModule,
    FeatherIconsComponent,
    MatProgressSpinnerModule,
    RouterLink,
    MatRadioModule,
    MatDividerModule,
    MatMenuModule,
  ]

})
export class PackageCleaningComponent extends UnsubscribeOnDestroyAdapter
implements OnInit {
  displayedColumns = [
    'select',
    // 'img',
     'fName',
    // 'lName',
    // 'email',
    // 'gender',
    // 'bDate',
    // 'mobile',
    // 'actions',
  ];

  pageTitle = 'MENUITEMS.PACKAGE.LIST.PACKAGE-CLEANING'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT'
  ]

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
  categoryControl= new UntypedFormControl();

  ccDS: CustomerCompanyDS;
  clnCatDS:CleaningCategoryDS;
  custCompClnCat :CustomerCompanyCleaningCategoryDS;

  custCompClnCatItems : CustomerCompanyCleaningCategoryItem[]=[];
  customer_companyList?: CustomerCompanyItem[];
  cleaning_categoryList?: CleaningCategoryItem[];

   exampleDatabase?: AdvanceTableService;
   dataSource!: ExampleDataSource;
  selection = new SelectionModel<AdvanceTable>(true, []);
  id?: number;
  advanceTable?: AdvanceTable;
  pcForm?: UntypedFormGroup;
  translatedLangText: any = {}
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.CARGO-DETAILS',
    HEADER_OTHER: 'COMMON-FORM.CARGO-OTHER-DETAILS',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
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
    CARGO_NAME:'COMMON-FORM.CARGO-NAME',
    CARGO_ALIAS:'COMMON-FORM.CARGO-ALIAS',
    CARGO_DESCRIPTION:'COMMON-FORM.CARGO-DESCRIPTION',
    CARGO_CLASS:'COMMON-FORM.CARGO-CLASS',
    CARGO_CLASS_SELECT:'COMMON-FORM.CARGO-CLASS-SELECT',
    CARGO_UN_NO:'COMMON-FORM.CARGO-UN-NO',
    CARGO_METHOD:'COMMON-FORM.CARGO-METHOD',
    CARGO_CATEGORY:'COMMON-FORM.CARGO-CATEGORY',
    CARGO_FLASH_POINT:'COMMON-FORM.CARGO-FLASH-POINT',
    CARGO_COST :'COMMON-FORM.CARGO-COST',
    CARGO_HAZARD_LEVEL:'COMMON-FORM.CARGO-HAZARD-LEVEL',
    CARGO_BAN_TYPE:'COMMON-FORM.CARGO-BAN-TYPE',
    CARGO_NATURE:'COMMON-FORM.CARGO-NATURE',
    CARGO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    CARGO_ALERT :'COMMON-FORM.CARGO-ALERT',
    CARGO_NOTE :'COMMON-FORM.CARGO-NOTE',
    CARGO_CLASS_1 :"COMMON-FORM.CARGO-CALSS-1",
    CARGO_CLASS_1_4 :"COMMON-FORM.CARGO-CALSS-1-4",
    CARGO_CLASS_1_5 :"COMMON-FORM.CARGO-CALSS-1-5",
    CARGO_CLASS_1_6 :"COMMON-FORM.CARGO-CALSS-1-6",
    CARGO_CLASS_2_1 :"COMMON-FORM.CARGO-CALSS-2-1",
    CARGO_CLASS_2_2 :"COMMON-FORM.CARGO-CALSS-2-2",
    CARGO_CLASS_2_3 :"COMMON-FORM.CARGO-CALSS-2-3",
    PACKAGE_MIN_COST : 'COMMON-FORM.PACKAGE-MIN-COST',
    PACKAGE_MAX_COST : 'COMMON-FORM.PACKAGE-MAX-COST',
    PACKAGE_DETAIL:'COMMON-FORM.PACKAGE-DETAIL'

  }
  
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
   // public advanceTableService: AdvanceTableService,
    private snackBar: MatSnackBar
  ) {
    super();
    this.initTcForm();
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.clnCatDS= new CleaningCategoryDS(this.apollo);
    this.custCompClnCat=new CustomerCompanyCleaningCategoryDS(this.apollo);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.loadData();
  }

  initTcForm() {
    this.pcForm = this.fb.group({
      guid: [{value:''}],
      customer_code: this.customerCodeControl,
      cleaning_category:this.categoryControl,
      min_cost:[''],
      max_cost:['']
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
    // const dialogRef = this.dialog.open(FormDialogComponent, {
    //   data: {
    //     advanceTable: this.advanceTable,
    //     action: 'add',
    //   },
    //   direction: tempDirection,
    // });
    // this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    //   if (result === 1) {
    //     // After dialog is closed we're doing frontend updates
    //     // For add we're just pushing a new row inside DataService
    //     this.exampleDatabase?.dataChange.value.unshift(
    //       this.advanceTableService.getDialogData()
    //     );
    //     this.refreshTable();
    //     this.showNotification(
    //       'snackbar-success',
    //       'Add Record Successfully...!!!',
    //       'bottom',
    //       'center'
    //     );
    //   }
    // });
  }
  editCall(row: AdvanceTable) {
    this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    // const dialogRef = this.dialog.open(FormDialogComponent, {
    //   data: {
    //     advanceTable: row,
    //     action: 'edit',
    //   },
    //   direction: tempDirection,
    // });
    // this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    //   if (result === 1) {
    //     // When using an edit things are little different, firstly we find record inside DataService by id
    //     const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
    //       (x) => x.id === this.id
    //     );
    //     // Then you update that record using data from dialogData (values you enetered)
    //     if (foundIndex != null && this.exampleDatabase) {
    //       this.exampleDatabase.dataChange.value[foundIndex] =
    //         this.advanceTableService.getDialogData();
    //       // And lastly refresh table
    //       this.refreshTable();
    //       this.showNotification(
    //         'black',
    //         'Edit Record Successfully...!!!',
    //         'bottom',
    //         'center'
    //       );
    //     }
    //   }
    // });
  }
  deleteItem(row: AdvanceTable) {
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
   // const numRows = this.dataSource.renderedData.length;
    return true; //numSelected === numRows;
  }

  isSelected(option: any): boolean {
    return this.customerCodeControl.value.includes(option);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    // this.isAllSelected()
    //   ? this.selection.clear()
    //   : this.dataSource.renderedData.forEach((row) =>
    //       this.selection.select(row)
    //     );
  }
  search()
  {
    const where: any = {};

    if (this.customerCodeControl.value) {
      const customerCodes :CustomerCompanyItem[] = this.customerCodeControl.value;
      var guids = customerCodes.map(cc=>cc.guid);
      where.customer_company_guid = { in: guids };
    }

    if (this.categoryControl.value) {
      const guids = this.categoryControl.value;
      where.cleaning_category_guid = { in: guids };
    }

    if (this.pcForm!.value["min_cost"])
    {
      const minCost :number = Number(this.pcForm!.value["min_cost"]);
      where.adjusted_price ={gte:minCost}
    }

    if (this.pcForm!.value["max_cost"])
      {
        const maxCost :number = Number(this.pcForm!.value["max_cost"]);
        where.adjusted_price ={ngte:maxCost}
      }
    this.subs.sink = this.custCompClnCat.search(where).subscribe(data => {
       this.custCompClnCatItems=data;
    });

   
   
   

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
      this.customer_companyList = data
    });

    this.clnCatDS.loadItems({ name: { neq: null }},{ sequence: 'ASC' }).subscribe(data=>{
      if(this.clnCatDS.totalCount>0)
      {
        this.cleaning_categoryList=data;
      }

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
  onContextMenu(event: MouseEvent, item: AdvanceTable) {
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
}
