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
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
import { Observable, Subscription } from 'rxjs';
import { TankDS, TankItem } from 'app/data-sources/tank';
import { TariffCleaningDS } from 'app/data-sources/tariff_cleaning'
import { ComponentUtil } from 'app/utilities/component-util';

@Component({
  selector: 'app-storing-order-new',
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
    //'tank_no_validity',
    'last_cargo',
    'job_no',
    'purpose_storage',
    'purpose_cleaning',
    'purpose_steam',
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
  translatedLangText: any = {}
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
    ADD_ATLEAST_ONE: 'COMMON-FORM.ADD-ATLEAST-ONE'
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

  storingOrderItem: StoringOrderItem = new StoringOrderItem();
  selection = new SelectionModel<StoringOrderTankItem>(true, []);
  sotList = new MatTableDataSource<StoringOrderTankItem>();
  customer_companyList?: CustomerCompanyItem[];
  unit_typeList: TankItem[] = []
  clean_statusCv: CodeValuesItem[] = []
  repairCv: CodeValuesItem[] = []
  yesnoCv: CodeValuesItem[] = []

  customerCodeControl = new UntypedFormControl();

  soDS: StoringOrderDS;
  cvDS: CodeValuesDS;
  ccDS: CustomerCompanyDS;
  tDS: TankDS;
  //soSubscription: Subscription;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) {
    super();
    this.translateLangText();
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
      so_no: [''],
      so_notes: [''],
      haulier: [''],
      sotList: ['']
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
        this.subs.sink = this.ccDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
          this.customer_companyList = data
        });
      })
    ).subscribe();
  }
  public loadData() {
    this.subs.sink = this.ccDS.loadItems({}, { code: 'ASC' }).subscribe(data => {
      this.customer_companyList = data
    });
    this.so_guid = this.route.snapshot.paramMap.get('id');
    if (this.so_guid) {
      // EDIT
      this.subs.sink = this.soDS.getStoringOrderByID(this.so_guid).subscribe(data => {
        if (this.soDS.totalCount > 0) {
          this.storingOrderItem = data[0];
          this.populateSOForm(this.storingOrderItem);
        }
      });
    } else {
      // NEW
    }
    const queries = [
      { alias: 'clean_statusCv', codeValType: 'CLEAN_STATUS' },
      { alias: 'repairCv', codeValType: 'REPAIR_OPTION' },
      { alias: 'yesnoCv', codeValType: 'YES_NO' }
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.subs.sink = this.tDS.loadItems().subscribe(data => {
      this.unit_typeList = data
    });

    this.cvDS.connectAlias('repairCv').subscribe(data => {
      this.repairCv = data;
    });
    this.cvDS.connectAlias('clean_statusCv').subscribe(data => {
      this.clean_statusCv = data;
    });
    this.cvDS.connectAlias('yesnoCv').subscribe(data => {
      this.yesnoCv = data;
    });
  }
  populateSOForm(so: StoringOrderItem): void {
    this.soForm!.patchValue({
      guid: so.guid,
      customer_company_guid: so.customer_company_guid,
      customer_code: so.customer_company,
      so_no: so.so_no,
      so_notes: so.so_notes,
      haulier: so.haulier
    });
    if (so.storing_order_tank) {
      const sotList: StoringOrderTankItem[] = so.storing_order_tank.map((item: Partial<StoringOrderTankItem> | undefined) => new StoringOrderTankItem(item));
      this.updateData(sotList);
    }
  }
  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    //cc.displayName();
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
        index: -1,
        sotExistedList: this.sotList.data
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
        index: index,
        sotExistedList: this.sotList.data
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.index >= 0) {
          const data = [...this.sotList.data];
          const updatedItem = new StoringOrderTankItem({
            ...result.item,
            edited: true
          });
          data[result.index] = updatedItem;
          this.updateData(data);
        } else {
          this.updateData([...this.sotList.data, result.item]);
        }
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
      if (result?.action === 'confirmed') {
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
    this.soForm!.get('sotList')?.setErrors(null);
    if (this.soForm?.valid) {
      if (!this.sotList.data.length) {
        this.soForm.get('sotList')?.setErrors({ required: true });
      } else {
        let so: StoringOrderGO = new StoringOrderGO(this.storingOrderItem);
        so.customer_company_guid = this.soForm.value['customer_company_guid'];
        so.haulier = this.soForm.value['haulier'];
        so.so_notes = this.soForm.value['so_notes'];
  
        const sot: StoringOrderTankGO[] = this.sotList.data.map((item: Partial<StoringOrderTankGO> | undefined) => new StoringOrderTankGO(item));
        console.log('so Value', so);
        console.log('sot Value', sot);
        if (so.guid) {
          this.soDS.updateStoringOrder(so, sot).subscribe(result => {
            console.log(result)
            this.handleSaveSuccess(result);
          });
        } else {
          this.soDS.addStoringOrder(so, sot).subscribe(result => {
            console.log(result)
            this.handleSaveSuccess(result);
          });
        }
      }
    } else {
      console.log('Invalid soForm', this.soForm?.value);
    }
  }

  updateData(newData: StoringOrderTankItem[]): void {
    this.sotList.data = [...newData];
  }

  handleDelete(event: Event, row: any, index: number): void {
    event.preventDefault();  // Prevents the form submission
    event.stopPropagation(); // Stops event propagation
    this.deleteItem(row, index);
  }

  handleDuplicateRow(event: Event, row: StoringOrderTankItem): void {
    event.preventDefault();  // Prevents the form submission
    event.stopPropagation(); // Stops event propagation
    let newSot: StoringOrderTankItem = new StoringOrderTankItem();
    newSot.unit_type_guid = row.unit_type_guid;
    newSot.last_cargo_guid = row.last_cargo_guid;
    newSot.tariff_cleaning = row.tariff_cleaning;
    // newSot.purpose_cleaning = row.purpose_cleaning;
    // newSot.purpose_storage = row.purpose_storage;
    // newSot.purpose_repair_cv = row.purpose_repair_cv;
    // newSot.purpose_steam = row.purpose_steam;
    // newSot.required_temp = row.required_temp;
    newSot.clean_status_cv = row.clean_status_cv;
    newSot.certificate_cv = row.certificate_cv;
    newSot.eta_dt = row.eta_dt;
    newSot.etr_dt = row.etr_dt;
    this.editOrderDetails(event, newSot, -1);
  }

  handleSaveSuccess(result: any) {
    if ((result?.data?.addStoringOrder ?? 0) > 0 || (result?.data?.updateStoringOrder ?? 0) > 0) {
      let successMsg = this.langText.SAVE_SUCCESS;
      this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
        successMsg = res;
        ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
        this.router.navigate(['/admin/storing-order']);
      });
    }
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }
}