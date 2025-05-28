import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { StoringOrderDS, StoringOrderGO, StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS, StoringOrderTankGO, StoringOrderTankItem, StoringOrderTankUpdateSO } from 'app/data-sources/storing-order-tank';
import { TankDS, TankItem } from 'app/data-sources/tank';
import { ModulePackageService } from 'app/services/module-package.service';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { CancelFormDialogComponent } from './dialogs/cancel-form-dialog/cancel-form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';

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
    NgClass,
    MatNativeDateModule,
    TranslateModule,
    CommonModule,
    MatLabel,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    RouterLink,
    MatRadioModule,
    MatDividerModule,
    MatMenuModule,
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class StoringOrderNewComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    // 'tank_no',
    // 'last_cargo',
    // 'job_no',
    // 'purpose_storage',
    // 'purpose_cleaning',
    // 'purpose_steam',
    // 'purpose_repair_cv',
    // 'status_cv',
    // 'certificate_cv',
    // 'actions'
    ''
  ];
  pageTitleNew = 'MENUITEMS.INVENTORY.LIST.STORING-ORDER-NEW'
  pageTitleEdit = 'MENUITEMS.INVENTORY.LIST.STORING-ORDER-EDIT'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.INVENTORY.TEXT', route: '/admin/inventory/storing-order' },
    { text: 'MENUITEMS.INVENTORY.LIST.STORING-ORDER', route: '/admin/inventory/storing-order' }
  ]
  translatedLangText: any = {}
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.HEADER',
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    SO_NO: 'COMMON-FORM.SO-NO',
    NOTES: 'COMMON-FORM.NOTES',
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
    OPEN_AT_GATE: 'COMMON-FORM.OPEN-AT-GATE',
    SO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    STATUS: 'COMMON-FORM.STATUS',
    PROCESS: 'COMMON-FORM.PROCESS',
    UPDATE: 'COMMON-FORM.UPDATE',
    CANCEL: 'COMMON-FORM.CANCEL',
    STORING_ORDER: 'MENUITEMS.INVENTORY.LIST.STORING-ORDER',
    NO_RESULT: 'COMMON-FORM.NO-RESULT',
    SAVE_SUCCESS: 'COMMON-FORM.SAVE-SUCCESS',
    BACK: 'COMMON-FORM.BACK',
    SAVE_AND_SUBMIT: 'COMMON-FORM.SAVE',
    ARE_YOU_SURE_DELETE: 'COMMON-FORM.ARE-YOU-SURE-DELETE',
    DELETE: 'COMMON-FORM.DELETE',
    CLOSE: 'COMMON-FORM.CLOSE',
    INVALID: 'COMMON-FORM.INVALID',
    EXISTED: 'COMMON-FORM.EXISTED',
    DUPLICATE: 'COMMON-FORM.DUPLICATE',
    SELECT_ATLEAST_ONE: 'COMMON-FORM.SELECT-ATLEAST-ONE',
    ADD_ATLEAST_ONE: 'COMMON-FORM.ADD-ATLEAST-ONE',
    ROLLBACK_STATUS: 'COMMON-FORM.REINSTATE',
    CANCELED_SUCCESS: 'COMMON-FORM.CANCELED-SUCCESS',
    ARE_YOU_SURE_CANCEL: 'COMMON-FORM.ARE-YOU-SURE-CANCEL',
    ARE_YOU_SURE_ROLLBACK: 'COMMON-FORM.ARE-YOU-SURE-ROLLBACK',
    BULK: 'COMMON-FORM.BULK',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    UNDO: 'COMMON-FORM.UNDO',
    INVALID_SELECTION: 'COMMON-FORM.INVALID-SELECTION',
    EXCEEDED: 'COMMON-FORM.EXCEEDED',
    MUST_MORE_THAN_ZERO: 'COMMON-FORM.MUST-MORE-THAN-ZERO'
  }

  clean_statusList: CodeValuesItem[] = [];

  so_guid?: string | null;

  soForm?: UntypedFormGroup;
  sotForm?: UntypedFormGroup;

  storingOrderItem: StoringOrderItem = new StoringOrderItem();
  sotList = new MatTableDataSource<StoringOrderTankItem>();
  sotSelection = new SelectionModel<StoringOrderTankItem>(true, []);
  customer_companyList?: CustomerCompanyItem[];
  unit_typeList: TankItem[] = []
  clean_statusCv: CodeValuesItem[] = []
  repairCv: CodeValuesItem[] = []
  yesnoCv: CodeValuesItem[] = []
  soTankStatusCvList: CodeValuesItem[] = []

  customerCodeControl = new UntypedFormControl();

  soDS: StoringOrderDS;
  sotDS: StoringOrderTankDS;
  cvDS: CodeValuesDS;
  ccDS: CustomerCompanyDS;
  tDS: TankDS;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    public modulePackageService: ModulePackageService
  ) {
    super();
    this.translateLangText();
    this.initSOForm();
    this.soDS = new StoringOrderDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.tDS = new TankDS(this.apollo);
    this.detectColumnChange();
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
    this.displayColumnChanged();
  }

  initSOForm() {
    this.soForm = this.fb.group({
      guid: [''],
      customer_company_guid: ['', Validators.required],
      customer_code: [{ value: this.customerCodeControl }, [Validators.required]],
      so_no: [''],
      so_notes: [''],
      haulier: [''],
      sotList: ['']
    });
  }

  displayColumnChanged() {
    if (this.getPackages()) {
      this.displayedColumns = [
        'tank_no',
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
    } else {
      this.displayedColumns = [
        'tank_no',
        'last_cargo',
        'job_no',
        'purpose_storage',
        'purpose_cleaning',
        //'purpose_steam',
        'purpose_repair_cv',
        'status_cv',
        'certificate_cv',
        'actions'
      ];
    }
  };

  getPackages(): boolean {
    if (this.modulePackageService.isGrowthPackage() || this.modulePackageService.isCustomizedPackage())
      return true;
    else
      return false;
  }

  initializeFilter() {
    this.customerCodeControl!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (value && typeof value === 'object') {
          searchCriteria = value.code;
          this.soForm!.get('customer_company_guid')!.setValue(value.guid);
        } else {
          searchCriteria = value || '';
          this.soForm!.get('customer_company_guid')!.setValue(null);
        }
        this.subs.sink = this.ccDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
          this.customer_companyList = data
          this.updateValidators(this.customer_companyList)
        });
      })
    ).subscribe();
  }

  public loadData() {
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
      this.subs.sink = this.ccDS.loadItems({}, { code: 'ASC' }).subscribe(data => {
        this.customer_companyList = data
      });
    }
    const queries = [
      { alias: 'clean_statusCv', codeValType: 'CLEAN_STATUS' },
      { alias: 'repairCv', codeValType: 'REPAIR_OPTION' },
      { alias: 'yesnoCv', codeValType: 'YES_NO' },
      { alias: 'soTankStatusCv', codeValType: 'SO_TANK_STATUS' }
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.subs.sink = this.tDS.search({ tariff_depot_guid: { neq: null } }, null, 100).subscribe(data => {
      this.unit_typeList = data
    });

    this.cvDS.connectAlias('repairCv').subscribe(data => {
      this.repairCv = addDefaultSelectOption(data, "No Repair");
    });
    this.cvDS.connectAlias('clean_statusCv').subscribe(data => {
      this.clean_statusCv = addDefaultSelectOption(data, "Unknown");
    });
    this.cvDS.connectAlias('yesnoCv').subscribe(data => {
      this.yesnoCv = data;
    });
    this.cvDS.connectAlias('soTankStatusCv').subscribe(data => {
      this.soTankStatusCvList = data;
    });
  }

  populateSOForm(so: StoringOrderItem): void {
    this.soForm!.patchValue({
      guid: so.guid,
      customer_code: so.customer_company,
      customer_company_guid: so.customer_company_guid,
      so_no: so.so_no,
      so_notes: so.so_notes,
      haulier: so.haulier
    });
    if (so.storing_order_tank) {
      this.populateSOT(so.storing_order_tank);
    }

    if (!this.soDS.canAdd(this.storingOrderItem)) {
      this.soForm?.get('customer_code')?.disable();
      this.soForm?.get('so_notes')?.disable();
      this.soForm?.get('haulier')?.disable();
    }
  }

  populateSOT(sot: StoringOrderTankItem[]) {
    if (sot?.length) {
      const sotList: StoringOrderTankItem[] = sot.map((item: Partial<StoringOrderTankItem> | undefined) => new StoringOrderTankItem(item));
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

  addOrderDetails(event: Event, row?: StoringOrderTankItem) {
    this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const addSot = row ?? new StoringOrderTankItem();
    addSot.so_guid = addSot.so_guid ?? this.so_guid;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      disableClose: true,
      data: {
        item: row ? row : addSot,
        action: 'new',
        translatedLangText: this.translatedLangText,
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
        const data = [...this.sotList.data];
        const newItem = new StoringOrderTankItem({
          ...result.item,
          //actions: ['new']
        });

        // Add the new item to the end of the list
        data.push(newItem);

        this.updateData(data);
      }
    });
  }

  editOrderDetails(event: Event, row: StoringOrderTankItem, index: number) {
    this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      disableClose: true,
      data: {
        item: row,
        action: 'edit',
        translatedLangText: this.translatedLangText,
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
          // let actions = Array.isArray(data[index].actions!) ? [...data[index].actions!] : [];
          // if (!actions.includes('new')) {
          //   actions = [...new Set([...actions, 'edit'])];
          // }
          const updatedItem = new StoringOrderTankItem({
            ...result.item,
            //actions: actions
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
            delete_dt: Utility.getDeleteDtEpoch(),
            actions: Array.isArray(data[index].actions!)
              ? [...new Set([...data[index].actions!, 'delete'])]
              : ['delete']
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

  cancelSelectedRows(row: StoringOrderTankItem[]) {
    //this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(CancelFormDialogComponent, {
      disableClose: true,
      data: {
        action: "cancel",
        item: [...row],
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const data = [...this.sotList.data];
        result.item.forEach((newItem: StoringOrderTankItem) => {
          // Find the index of the item in data with the same id
          const index = data.findIndex(existingItem => existingItem.guid === newItem.guid);

          // If the item is found, update the properties
          if (index !== -1) {
            data[index] = {
              ...data[index],
              ...newItem,
              actions: Array.isArray(data[index].actions!)
                ? [...new Set([...data[index].actions!, 'cancel'])]
                : ['cancel']
            };
          }
        });
        this.updateData(data);
      }
    });
  }

  rollbackSelectedRows(row: StoringOrderTankItem[]) {
    //this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(CancelFormDialogComponent, {
      disableClose: true,
      data: {
        action: "rollback",
        item: [...row],
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const data = [...this.sotList.data];
        result.item.forEach((newItem: StoringOrderTankItem) => {
          const index = data.findIndex(existingItem => existingItem.guid === newItem.guid);

          if (index !== -1) {
            data[index] = {
              ...data[index],
              ...newItem,
              actions: Array.isArray(data[index].actions!)
                ? [...new Set([...data[index].actions!, 'rollback'])]
                : ['rollback']
            };
          }
        });
        this.updateData(data);
      }
    });
  }

  undoTempAction(row: StoringOrderTankItem[], actionToBeRemove: string) {
    const data = [...this.sotList.data];
    row.forEach((newItem: StoringOrderTankItem) => {
      const index = data.findIndex(existingItem => existingItem.guid === newItem.guid);

      if (index !== -1) {
        data[index] = {
          ...data[index],
          ...newItem,
          actions: Array.isArray(data[index].actions!)
            ? data[index].actions!.filter(action => action !== actionToBeRemove)
            : []
        };
      }
    });
    this.updateData(data);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.sotSelection.selected.length;
    const numRows = this.storingOrderItem.storing_order_tank?.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.sotSelection.clear()
      : this.sotList.data?.forEach((row) =>
        this.sotSelection.select(row)
      );
  }

  // context menu
  onContextMenu(event: MouseEvent, item: any) {
    this.preventDefault(event);
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    if (this.contextMenu !== undefined && this.contextMenu.menu !== null) {
      this.contextMenu.menuData = { item: item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }

  onEnterKey(event: Event) {
    event.preventDefault();
    // Add any additional logic if needed
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

        const sot: StoringOrderTankGO[] = this.sotList.data.map((item: Partial<StoringOrderTankItem>) => {
          // Ensure action is an array and take the last action only
          const actions = Array.isArray(item!.actions) ? item!.actions : [];
          const latestAction = actions.length > 0 ? actions[actions.length - 1] : '';
          return new StoringOrderTankUpdateSO({
            ...item,
            owner_guid: item.owner_guid || so.customer_company_guid,
            action: latestAction // Set the latest action as the single action
          });
        });
        console.log('so Value', so);
        console.log('sot Value', sot);
        if (so.guid) {
          this.soDS.updateStoringOrder(so, sot).subscribe(result => {
            console.log(result)
            this.handleSaveSuccess(result?.data?.updateStoringOrder);
          });
        } else {
          this.soDS.addStoringOrder(so, sot).subscribe(result => {
            console.log(result)
            this.handleSaveSuccess(result?.data?.addStoringOrder);
          });
        }
      }
    } else {
      console.log('Invalid soForm', this.soForm?.value);
    }
  }

  updateData(newData: StoringOrderTankItem[]): void {
    this.sotList.data = [...newData];
    this.sotSelection.clear();
  }

  handleDelete(event: Event, row: any, index: number): void {
    this.deleteItem(row, index);
  }

  cancelItem(event: Event, row: StoringOrderTankItem) {
    // this.id = row.id;
    if (this.sotSelection.hasValue()) {
      this.cancelSelectedRows(this.sotSelection.selected)
    } else {
      this.cancelSelectedRows([row])
    }
  }

  rollbackItem(event: Event, row: StoringOrderTankItem) {
    // this.id = row.id;
    if (this.sotSelection.hasValue()) {
      this.rollbackSelectedRows(this.sotSelection.selected)
    } else {
      this.rollbackSelectedRows([row])
    }
  }

  undoAction(event: Event, row: StoringOrderTankItem, action: string) {
    // this.id = row.id;
    this.stopPropagation(event);
    if (this.sotSelection.hasValue()) {
      this.undoTempAction(this.sotSelection.selected, action)
    } else {
      this.undoTempAction([row], action)
    }
  }

  handleDuplicateRow(event: Event, row: StoringOrderTankItem): void {
    //this.stopEventTrigger(event);
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
    newSot.so_guid = row.so_guid;
    newSot.eta_dt = row.eta_dt;
    newSot.etr_dt = row.etr_dt;
    this.addOrderDetails(event, newSot);
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.langText.SAVE_SUCCESS;
      this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
        successMsg = res;
        ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
        this.router.navigate(['/admin/inventory/storing-order']);
      });
    }
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  stopEventTrigger(event: Event) {
    this.preventDefault(event);
    this.stopPropagation(event);
  }

  stopPropagation(event: Event) {
    event.stopPropagation(); // Stops event propagation
  }

  preventDefault(event: Event) {
    event.preventDefault(); // Prevents the form submission
  }

  isAnyItemEdited(): boolean {
    return true;//!this.storingOrderItem.status_cv || (this.sotList?.data.some(item => item.action) ?? false);
  }

  getLastAction(actions: string[]): string {
    return actions[actions.length - 1];
  }

  getBadgeClass(action: string): string {
    switch (action) {
      case 'new':
        return 'badge badge-solid-green';
      case 'edit':
        return 'badge badge-solid-cyan';
      case 'rollback':
        return 'badge badge-solid-blue';
      case 'cancel':
        return 'badge badge-solid-orange';
      case 'preorder':
        return 'badge badge-solid-pink';
      default:
        return '';
    }
  }

  getYesNoDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.yesnoCv);
  }

  getRepairDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.repairCv);
  }

  getSoStatusDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.soTankStatusCvList);
  }

  hasMenuItems(row: any): boolean {
    return (
      this.soDS.canAdd(this.storingOrderItem) ||
      this.sotDS.canAddRemove(row) ||
      (!row.actions.includes('cancel') && this.sotDS.canCancel(row)) ||
      (!row.actions.includes('rollback') && this.sotDS.canRollbackStatus(row)) ||
      row.actions.includes('cancel') ||
      row.actions.includes('rollback')
    );
  }

  detectColumnChange() {
    if (this.modulePackageService.isGrowthPackage() || this.modulePackageService.isCustomizedPackage()) {
      this.displayedColumns = [
        'tank_no',
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
    } else {
      this.displayedColumns = [
        'tank_no',
        'last_cargo',
        'job_no',
        'purpose_storage',
        'purpose_cleaning',
        'purpose_repair_cv',
        'status_cv',
        'certificate_cv',
        'actions'
      ];
    }
  }

  updateValidators(validOptions: any[]) {
    this.customerCodeControl.setValidators([
      Validators.required,
      AutocompleteSelectionValidator(validOptions)
    ]);
  }
}