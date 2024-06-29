import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag, CdkDragHandle, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
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
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { map, filter, tap, catchError, finalize, switchMap, debounceTime, startWith } from 'rxjs/operators';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { Utility } from 'app/utilities/utility';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { StoringOrderTankDS, StoringOrderTankGO, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { StoringOrderService } from 'app/services/storing-order.service';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values'
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company'
import { MatRadioModule } from '@angular/material/radio';
import { Apollo } from 'apollo-angular';
import { MatDividerModule } from '@angular/material/divider';
import { StoringOrderDS, StoringOrderGO, StoringOrderItem } from 'app/data-sources/storing-order';
import { Observable } from 'rxjs';
import { TankDS, TankItem } from 'app/data-sources/tank';
import { TariffCleaningDS } from 'app/data-sources/tariff_cleaning'

@Component({
  selector: 'app-cleaning-procedures',
  standalone: true,
  templateUrl: './storing-order-new.component.html',
  styleUrl: './storing-order-new.component.scss',
  imports: [
    BreadcrumbComponent,
    MatButtonModule,
    MatSidenavModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
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
  ]
})
export class StoringOrderNewComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    //'select',
    'tank_no',
    'tank_no_validity',
    'last_cargo',
    'job_no',
    'purpose_storage',
    'purpose_steam',
    'purpose_cleaning',
    'purpose_repair_cv',
    'status_cv',
    'certificate_cv',
    'actions'
  ];
  pageTitleNew = 'MENUITEMS.INVENTORY.LIST.STORING-ORDER-NEW'
  pageTitleEdit = 'MENUITEMS.INVENTORY.LIST.STORING-ORDER-EDIT'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT',
    'MENUITEMS.INVENTORY.LIST.STORING-ORDER'
  ]
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.HEADER',
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
    STORING_ORDER: 'MENUITEMS.INVENTORY.LIST.STORING-ORDER'
  }

  clean_statusList: CodeValuesItem[] = [];

  repairList: string[] = [
    'No Repair',
    'Repair',
    'Offhire'
  ];

  certificateList: string[] = [
    'Yes',
    'No'
  ];

  so_guid?: string | null;

  soForm?: UntypedFormGroup;
  sotForm?: UntypedFormGroup;

  storingOrderItem: StoringOrderItem = {}
  selection = new SelectionModel<StoringOrderTankItem>(true, []);
  sotList = new MatTableDataSource<StoringOrderTankItem>();
  customer_companyList?: Observable<CustomerCompanyItem[]>;
  unit_typeList: TankItem[] = []
  clean_statusCv: CodeValuesItem[] = []
  repairCv: CodeValuesItem[] = []
  yesnoCv: CodeValuesItem[] = []

  customerCodeControl = new UntypedFormControl();

  soDS: StoringOrderDS;
  cvDS: CodeValuesDS;
  ccDS: CustomerCompanyDS;
  tDS: TankDS;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private route: ActivatedRoute
  ) {
    super();
    this.initSOForm();
    this.soDS = new StoringOrderDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.tDS = new TankDS(this.apollo);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.initializeFilter();
    this.loadData();
  }
  initSOForm() {
    this.soForm = this.fb.group({
      guid: [''],
      customer_company_guid: [''],
      customer_code: this.customerCodeControl,
      so_notes: [''],
      haulier: [''],
    });
  }
  initializeFilter() {
    this.soForm!.get('customer_code')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (typeof value === 'string') {
          searchCriteria = value;
        } else {
          searchCriteria = value.code;
          this.soForm!.get('customer_company_guid')!.setValue(value.guid);
        }
        this.ccDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' });
      })
    ).subscribe();
  }
  public loadData() {
    this.customer_companyList = this.ccDS.connect();
    this.so_guid = this.route.snapshot.paramMap.get('id');
    if (this.so_guid) {
      // EDIT
      this.soDS.getStoringOrderByID(this.so_guid);
      this.soDS.connect().subscribe(data => {
        if (data && data[0]) {
          this.storingOrderItem = data[0];
          this.populateSOForm(this.storingOrderItem);
        }
      });
    } else {
      // NEW
      //this.pageTitle = `${this.langText.NEW} ${this.langText.STORING_ORDER}` //'MENUITEMS.INVENTORY.LIST.STORING-ORDER-NEW';
    }
    const queries = [
      { alias: 'clean_statusCv', codeValType: 'CLEAN_STATUS' },
      { alias: 'repairCv', codeValType: 'REPAIR_OPTION' },
      { alias: 'yesnoCv', codeValType: 'YES_NO' }
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.tDS.loadItems();

    this.cvDS.connectAlias('repairCv').subscribe(data => {
      this.repairCv = data;
    });
    this.cvDS.connectAlias('clean_statusCv').subscribe(data => {
      this.clean_statusCv = data;
    });
    this.cvDS.connectAlias('yesnoCv').subscribe(data => {
      this.yesnoCv = data;
    });
    this.tDS.connect().subscribe(data => {
      this.unit_typeList = data
    });
  }
  populateSOForm(so: StoringOrderItem): void {
    this.soForm!.patchValue({
      guid: so.guid,
      customer_company_guid: so.customer_company_guid,
      customer_code: so.customer_company,
      so_notes: so.so_notes,
      haulier: so.haulier
    });
    if (so.storing_order_tank) {
      const sotList: StoringOrderItem[] = so.storing_order_tank.map((item: Partial<StoringOrderTankGO> | undefined) => new StoringOrderTankItem(item));
      this.updateData(sotList);
    }
  }
  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
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
  addOrderDetails(event: Event) {
    event.preventDefault();  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        item: new StoringOrderTankItem(),
        action: 'new',
        langText: this.langText,
        populateData: {
          unit_typeList: this.unit_typeList,
          repairCv: this.repairCv,
          clean_statusCv: this.clean_statusCv,
          yesnoCv: this.yesnoCv
        },
        index: -1
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateData([...this.sotList.data, result.item]);
      }
    });
  }
  editOrderDetails(event: Event, row: StoringOrderTankItem, index: number) {
    event.preventDefault();  // Prevents the form submission
    //this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        item: row,
        action: 'edit',
        langText: this.langText,
        populateData: {
          unit_typeList: this.unit_typeList,
          repairCv: this.repairCv,
          clean_statusCv: this.clean_statusCv,
          yesnoCv: this.yesnoCv
        },
        index: index
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data = [...this.sotList.data];
        const updatedItem = {
          ...result.item,
          edited: true
        };
        data[result.index] = updatedItem;
        this.updateData(data);
      }
    });
  }
  deleteItem(row: StoringOrderTankItem, index: number) {
    //this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        item: row,
        langText: this.langText,
        index: index
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result.action === 'confirmed') {
        if (result.item.guid) {
          const data = [...this.sotList.data];
          const updatedItem = {
            ...result.item,
            delete_dt: Utility.getDeleteDtEpoch()
          };
          data[result.index] = updatedItem;
          this.updateData(data); // Refresh the data source
        } else {
          const data = [...this.sotList.data];
          data.splice(index, 1);
          this.updateData(data); // Refresh the data source
        }
      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = 0;//this.storingOrderTanksDS.renderedData.length;
    return numSelected === numRows;
  }

  masterToggle() {
    // this.isAllSelected()
    //   ? this.selection.clear()
    //   : this.storingOrderTanksDS.renderedData.forEach((row) =>
    //       this.selection.select(row)
    //     );
  }

  applyFilter() {
    this.sotList.filterPredicate = (data: StoringOrderTankItem, filter: string) => {
      // Return true if delete_dt is null (row will be shown), otherwise false
      return data.delete_dt === null;
    };
    this.sotList.filter = 'apply'; // Trigger the filter with a non-empty string
    console.log(this.sotList.data)
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

  onSOFormSubmit() {
    if (this.soForm?.valid) {
      var so: StoringOrderGO = {
        guid: this.soForm.value['guid'],
        customer_company_guid: this.soForm.value['customer_company_guid'],
        haulier: this.soForm.value['haulier'],
        so_no: this.soForm.value['so_no'],
        so_notes: this.soForm.value['so_notes']
      }
      const sot: StoringOrderTankGO[] = this.sotList.data.map((item: Partial<StoringOrderTankGO> | undefined) => new StoringOrderTankGO(item));
      console.log('so Value', so);
      console.log('sot Value', sot);
      if (so.guid) {
        this.soDS.updateStoringOrder(so, sot).subscribe(result => {
          console.log(result)
        });
      } else {
        this.soDS.addStoringOrder(so, sot).subscribe(result => {
          console.log(result)
        });
      }
    } else {
      console.log('Invalid soForm', this.soForm?.value);
    }
  }

  onSOTFormSubmit() {
    if (this.sotForm?.valid) {
      // var sot: StoringOrderTankItem = {
      //   guid: '',
      //   so_guid: '',
      //   unit_type_guid: this.sotForm.value['unit_type'],
      //   tank_no: this.sotForm.value['tank_no'],
      //   last_cargo_guid: this.sotForm.value['last_cargo'],
      //   job_no: this.sotForm.value['job_no'],
      //   eta_dt: Utility.convertToEpoch(this.sotForm.value['eta_dt']),
      //   purpose_storage: this.sotForm.value['purpose_storage'],
      //   purpose_steam: this.sotForm.value['purpose_steam'],
      //   purpose_cleaning: this.sotForm.value['purpose_cleaning'],
      //   purpose_repair_cv: this.sotForm.value['repair'],
      //   clean_status_cv: this.sotForm.value['clean_status'],
      //   certificate_cv: this.sotForm.value['certificate'],
      //   required_temp: this.sotForm.value['required_temp'],
      //   remarks: this.sotForm.value['remarks'],
      //   etr_dt: Utility.convertToEpoch(this.sotForm.value['etr_dt']),
      //   open_on_gate_cv: this.sotForm.value['open_on_gate']
      // }
      // this.updateData([...this.sotList.data, sot]);
    } else {
      console.log('Invalid sotForm', this.sotForm?.value);
    }
  }

  updateData(newData: StoringOrderTankItem[]): void {
    this.sotList.data = [...newData];
    //this.applyFilter();
  }

  handleDelete(event: Event, row: any, index: number): void {
    event.preventDefault();  // Prevents the form submission
    event.stopPropagation(); // Stops event propagation
    this.deleteItem(row, index);
  }
}