import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag, CdkDragHandle, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { UnsubscribeOnDestroyAdapter, TableElement, TableExportUtil } from '@shared';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { ExampleDataSource } from 'app/advance-table/advance-table.component';
import { AdvanceTable } from 'app/advance-table/advance-table.model';
import { AdvanceTableService } from 'app/advance-table/advance-table.service';
import { DeleteDialogComponent } from 'app/advance-table/dialogs/delete/delete.component';
import { FormDialogComponent } from 'app/advance-table/dialogs/form-dialog/form-dialog.component';
import { Observable, fromEvent } from 'rxjs';
import { map, filter, tap, catchError, finalize, switchMap, debounceTime, startWith } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { Utility } from 'app/utilities/utility';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoringOrderDS, StoringOrderItem } from 'app/data-sources/storing-order';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem, addDefaultSelectOption } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-cleaning-procedures',
  standalone: true,
  templateUrl: './storing-order.component.html',
  styleUrl: './storing-order.component.scss',
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
  ]
})
export class StoringOrderComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'select',
    'so_no',
    'code',
    'customer_name',
    'no_of_tanks',
    'status',
    'actions'
  ];

  pageTitle = 'MENUITEMS.INVENTORY.LIST.STORING-ORDER'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT'
  ]

  STATUS = 'COMMON-FORM.STATUS'
  SO_NO = 'COMMON-FORM.SO-NO'
  CUSTOMER_CODE = 'COMMON-FORM.CUSTOMER-CODE'
  CUSTOMER_NAME = 'COMMON-FORM.CUSTOMER-NAME'
  SO_DATE = 'COMMON-FORM.SO-DATE'
  NO_OF_TANKS = 'COMMON-FORM.NO-OF-TANKS'
  LAST_CARGO = 'COMMON-FORM.LAST-CARGO'
  TANK_NO = 'COMMON-FORM.TANK-NO'
  JOB_NO = 'COMMON-FORM.JOB-NO'
  PURPOSE = 'COMMON-FORM.PURPOSE'
  ETA_DATE = 'COMMON-FORM.ETA-DATE'

  toppingList: string[] = [
    'Extra cheese',
    'Mushroom',
    'Onion',
    'Pepperoni',
    'Sausage',
    'Tomato',
  ];

  searchForm?: UntypedFormGroup;

  selection = new SelectionModel<AdvanceTable>(true, []);
  id?: number;
  advanceTable?: AdvanceTable;

  cvDS: CodeValuesDS;
  soDS: StoringOrderDS;
  ccDS: CustomerCompanyDS;
  soList: StoringOrderItem[] = [];
  soStatusCvList: CodeValuesItem[] = [];
  customerCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  customer_companyList?: Observable<CustomerCompanyItem[]>;
  loadingSoList: boolean = false;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public advanceTableService: AdvanceTableService,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo
  ) {
    super();
    this.initSearchForm();
    this.soDS = new StoringOrderDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.initializeFilterCustomerCompany();
    this.loadData();
  }
  refresh() {
    this.loadData();
    console.log("test refresh");
  }
  initSearchForm() {
    this.searchForm = this.fb.group({
      so_no: [''],
      customer_code: this.customerCodeControl,
      last_cargo: this.lastCargoControl,
      so_status: [''],
      tank_no: [''],
      job_no: [''],
      purpose: [''],
      eta_dt: [''],
    });
  }
  addNew() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: this.advanceTable,
        action: 'add',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      // if (result === 1) {
      //   // After dialog is closed we're doing frontend updates
      //   // For add we're just pushing a new row inside DataService
      //   this.exampleDatabase?.dataChange.value.unshift(
      //     this.advanceTableService.getDialogData()
      //   );
      //   this.refreshTable();
      //   this.showNotification(
      //     'snackbar-success',
      //     'Add Record Successfully...!!!',
      //     'bottom',
      //     'center'
      //   );
      // }
    });
  }
  editCall(row: AdvanceTable) {
    // this.id = row.id;
    // let tempDirection: Direction;
    // if (localStorage.getItem('isRtl') === 'true') {
    //   tempDirection = 'rtl';
    // } else {
    //   tempDirection = 'ltr';
    // }
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
    // const numSelected = this.selection.selected.length;
    // const numRows = this.dataSource.renderedData.length;
    // return numSelected === numRows;
    return false;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    // this.isAllSelected()
    //   ? this.selection.clear()
    //   : this.dataSource.renderedData.forEach((row) =>
    //     this.selection.select(row)
    //   );
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
    this.soDS.searchStoringOrder({});
    this.soDS.connect().subscribe(data => {
      this.soList = data;
    });
    this.soDS.soLoading$.subscribe(loading => {
      this.loadingSoList = loading;
    });

    const queries = [
      { alias: 'soStatusCv', codeValType: 'SO_STATUS' }
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('soStatusCv').subscribe(data => {
      this.soStatusCvList = data;
      this.soStatusCvList = addDefaultSelectOption(this.soStatusCvList, 'All');
    });

    this.customer_companyList = this.ccDS.connect();
    // this.subs.sink = fromEvent(this.filter.nativeElement, 'keyup').subscribe(
    //   () => {
    //     if (!this.dataSource) {
    //       return;
    //     }
    //     this.dataSource.filter = this.filter.nativeElement.value;
    //   }
    // );
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

  search() {
    const where: any = {};

    if (this.searchForm!.value['so_no']) {
      where.so_no = { contains: this.searchForm!.value['so_no'] };
    }

    if (this.searchForm!.value['tank_no'] || this.searchForm!.value['eta_dt']) {
      const sotSome: any = {};

      if (this.searchForm!.value['tank_no']) {
        sotSome.tank_no = { contains: this.searchForm!.value['tank_no'] };
      }

      if (this.searchForm!.value['eta_dt']) {
        sotSome.eta_dt = { gte: Utility.convertDate(this.searchForm!.value['eta_dt']), lte: Utility.convertDate(this.searchForm!.value['eta_dt']) };
      }
      where.storing_order_tank = { some: sotSome };
    }

    if (this.searchForm!.value['customer_code']) {
      where.customer_company = { code: { contains: this.searchForm!.value['customer_code'].code } };
    }

    // TODO :: search criteria

    this.soDS.searchStoringOrder(where);
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
  }

  initializeFilterCustomerCompany() {
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
        this.ccDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'DESC' });
      })
    ).subscribe();
  }
}