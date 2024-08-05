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
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { map, filter, tap, catchError, finalize, switchMap, debounceTime, startWith } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { Utility } from 'app/utilities/utility';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { StoringOrderTankDS, StoringOrderTankGO, StoringOrderTankItem, StoringOrderTankUpdateSO } from 'app/data-sources/storing-order-tank';
import { StoringOrderService } from 'app/services/storing-order.service';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values'
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company'
import { MatRadioModule } from '@angular/material/radio';
import { Apollo } from 'apollo-angular';
import { MatDividerModule } from '@angular/material/divider';
import { StoringOrderDS, StoringOrderGO, StoringOrderItem } from 'app/data-sources/storing-order';
import { Observable, Subscription } from 'rxjs';
import { TankDS, TankItem } from 'app/data-sources/tank';
import { TariffCleaningDS } from 'app/data-sources/tariff-cleaning'
import { ComponentUtil } from 'app/utilities/component-util';
import { CancelFormDialogComponent } from './dialogs/cancel-form-dialog/cancel-form-dialog.component';
import { ReleaseOrderDS, ReleaseOrderItem } from 'app/data-sources/release-order';
import { SchedulingDS, SchedulingItem } from 'app/data-sources/scheduling';

@Component({
  selector: 'app-release-order-details',
  standalone: true,
  templateUrl: './release-order-details.component.html',
  styleUrl: './release-order-details.component.scss',
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
    MatMenuModule,
  ]
})
export class ReleaseOrderDetailsComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'select',
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
  pageTitle = 'MENUITEMS.INVENTORY.LIST.RELEASE-ORDER-EDIT'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT',
    'MENUITEMS.INVENTORY.LIST.STORING-ORDER'
  ]
  translatedLangText: any = {}
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.HEADER',
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
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
    INVALID_SELECTION: 'COMMON-FORM.INVALID-SELECTION',
    EXCEEDED: 'COMMON-FORM.EXCEEDED',
    MUST_MORE_THAN_ZERO: 'COMMON-FORM.MUST-MORE-THAN-ZERO',
    RO_NOTES: 'COMMON-FORM.RO-NOTES',
    RELEASE_ORDER_DATE: 'COMMON-FORM.RELEASE-ORDER-DATE'
  }

  clean_statusList: CodeValuesItem[] = [];

  ro_guid?: string | null;

  roForm?: UntypedFormGroup;
  sotForm?: UntypedFormGroup;

  releaseOrderItem: ReleaseOrderItem = new ReleaseOrderItem();
  storingOrderItem: StoringOrderItem = new StoringOrderItem();
  schedulingList = new MatTableDataSource<SchedulingItem>();
  schedulingSelection = new SelectionModel<SchedulingItem>(true, []);
  customer_companyList?: CustomerCompanyItem[];
  unit_typeList: TankItem[] = []
  clean_statusCv: CodeValuesItem[] = []
  repairCv: CodeValuesItem[] = []
  yesnoCv: CodeValuesItem[] = []
  tankStatusCvList: CodeValuesItem[] = []

  customerCodeControl = new UntypedFormControl();

  soDS: StoringOrderDS;
  sotDS: StoringOrderTankDS;
  cvDS: CodeValuesDS;
  ccDS: CustomerCompanyDS;
  tDS: TankDS;
  roDS: ReleaseOrderDS;
  schedulingDS: SchedulingDS;
  
  startDateRO = new Date();

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
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.tDS = new TankDS(this.apollo);
    this.roDS = new ReleaseOrderDS(this.apollo);
    this.schedulingDS = new SchedulingDS(this.apollo);
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
    this.roForm = this.fb.group({
      guid: [''],
      release_dt: [''],
      ro_no: [''],
      ro_notes: [''],
      haulier: [''],
      sotList: ['']
    });
  }

  initializeFilter() {
  }

  public loadData() {
    this.ro_guid = this.route.snapshot.paramMap.get('id');
    if (this.ro_guid) {
      // EDIT
      this.subs.sink = this.roDS.getReleaseOrderByID(this.ro_guid).subscribe(data => {
        if (this.roDS.totalCount > 0) {
          this.releaseOrderItem = data[0];
          console.log(this.releaseOrderItem);
          this.populateROForm(this.releaseOrderItem);
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
      { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' }
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.subs.sink = this.tDS.loadItems().subscribe(data => {
      this.unit_typeList = data
    });

    this.cvDS.connectAlias('repairCv').subscribe(data => {
      this.repairCv = addDefaultSelectOption(data, "No Repair");
    });
    this.cvDS.connectAlias('clean_statusCv').subscribe(data => {
      this.clean_statusCv = addDefaultSelectOption(data, "Unknown");;
    });
    this.cvDS.connectAlias('yesnoCv').subscribe(data => {
      this.yesnoCv = data;
    });
    this.cvDS.connectAlias('tankStatusCv').subscribe(data => {
      this.tankStatusCvList = data;
    });
  }

  reloadSOT() {
    if (this.ro_guid) {
      // EDIT
      const where: any = { ro_guid: { eq: this.ro_guid } };
      this.subs.sink = this.sotDS.reloadStoringOrderTanks(where).subscribe(data => {
        if (data.length > 0) {
          this.storingOrderItem.storing_order_tank = data;
          this.populateSOT(data);
        }
      });
    }
  }

  populateROForm(ro: ReleaseOrderItem): void {
    this.roForm!.patchValue({
      guid: ro.guid,
      release_dt: Utility.convertDate(ro.release_dt),
      ro_no: ro.ro_no,
      ro_notes: ro.ro_notes,
      haulier: ro.haulier
    });
    if (ro.scheduling && ro.scheduling.length) {
      this.populateSOT(ro.scheduling);
    }
  }

  populateSOT(scheduling: SchedulingItem[]) {
    if (scheduling?.length) {
      const list: SchedulingItem[] = scheduling.map((item: Partial<SchedulingItem> | undefined) => new SchedulingItem(item));
      console.log(list);
      this.updateData(list);
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
    addSot.so_guid = addSot.so_guid ?? this.ro_guid;
    const dialogRef = this.dialog.open(FormDialogComponent, {
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
        sotExistedList: this.schedulingList.data
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data = [...this.schedulingList.data];
        const newItem = new StoringOrderTankItem({
          ...result.item,
          actions: ['new']
        });

        // Add the new item to the end of the list
        data.push(newItem);

        this.updateData(data);
      }
    });
  }

  editOrderDetails(event: Event, row: StoringOrderTankItem, index: number) {
    // this.preventDefault(event);  // Prevents the form submission
    // let tempDirection: Direction;
    // if (localStorage.getItem('isRtl') === 'true') {
    //   tempDirection = 'rtl';
    // } else {
    //   tempDirection = 'ltr';
    // }
    // const dialogRef = this.dialog.open(FormDialogComponent, {
    //   data: {
    //     item: row,
    //     action: 'edit',
    //     translatedLangText: this.translatedLangText,
    //     populateData: {
    //       unit_typeList: this.unit_typeList,
    //       repairCv: this.repairCv,
    //       clean_statusCv: this.clean_statusCv,
    //       yesnoCv: this.yesnoCv
    //     },
    //     index: index,
    //     sotExistedList: this.schedulingList.data
    //   },
    //   direction: tempDirection
    // });
    // this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     if (result.index >= 0) {
    //       const data = [...this.schedulingList.data];
    //       let actions = Array.isArray(data[index].actions!) ? [...data[index].actions!] : [];
    //       if (!actions.includes('new')) {
    //         actions = [...new Set([...actions, 'edit'])];
    //       }
    //       const updatedItem = new SchedulingItem({
    //         ...result.item,
    //         actions: actions
    //       });
    //       data[result.index] = updatedItem;
    //       this.updateData(data);
    //     } else {
    //       this.updateData([...this.schedulingList.data, result.item]);
    //     }
    //   }
    // });
  }

  cancelSelectedRows(row: StoringOrderTankItem[]) {
    // //this.preventDefault(event);  // Prevents the form submission
    // let tempDirection: Direction;
    // if (localStorage.getItem('isRtl') === 'true') {
    //   tempDirection = 'rtl';
    // } else {
    //   tempDirection = 'ltr';
    // }
    // const dialogRef = this.dialog.open(CancelFormDialogComponent, {
    //   data: {
    //     action: "cancel",
    //     item: [...row],
    //     translatedLangText: this.translatedLangText
    //   },
    //   direction: tempDirection
    // });
    // this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    //   if (result?.action === 'confirmed') {
    //     const data = [...this.schedulingList.data];
    //     result.item.forEach((newItem: StoringOrderTankItem) => {
    //       // Find the index of the item in data with the same id
    //       const index = data.findIndex(existingItem => existingItem.guid === newItem.guid);

    //       // If the item is found, update the properties
    //       if (index !== -1) {
    //         data[index] = {
    //           ...data[index],
    //           ...newItem,
    //           actions: Array.isArray(data[index].actions!)
    //             ? [...new Set([...data[index].actions!, 'cancel'])]
    //             : ['cancel']
    //         };
    //       }
    //     });
    //     this.updateData(data);
    //     // const sot = result.item.map((item: StoringOrderTankItem) => new StoringOrderTankGO(item));
    //     // this.sotDS.cancelStoringOrderTank(sot).subscribe(result => {
    //     //   if ((result?.data?.cancelStoringOrderTank ?? 0) > 0) {
    //     //     let successMsg = this.translatedLangText.CANCELED_SUCCESS;
    //     //     ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
    //     //     this.reloadSOT();
    //     //   }
    //     // });
    //   }
    // });
  }

  rollbackSelectedRows(row: StoringOrderTankItem[]) {
    // //this.preventDefault(event);  // Prevents the form submission
    // let tempDirection: Direction;
    // if (localStorage.getItem('isRtl') === 'true') {
    //   tempDirection = 'rtl';
    // } else {
    //   tempDirection = 'ltr';
    // }
    // const dialogRef = this.dialog.open(CancelFormDialogComponent, {
    //   data: {
    //     action: "rollback",
    //     item: [...row],
    //     translatedLangText: this.translatedLangText
    //   },
    //   direction: tempDirection
    // });
    // this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    //   if (result?.action === 'confirmed') {
    //     const data = [...this.schedulingList.data];
    //     result.item.forEach((newItem: StoringOrderTankItem) => {
    //       const index = data.findIndex(existingItem => existingItem.guid === newItem.guid);

    //       if (index !== -1) {
    //         data[index] = {
    //           ...data[index],
    //           ...newItem,
    //           actions: Array.isArray(data[index].actions!)
    //             ? [...new Set([...data[index].actions!, 'rollback'])]
    //             : ['rollback']
    //         };
    //       }
    //     });
    //     this.updateData(data);
    //     // const sot = result.item.map((item: StoringOrderTankItem) => new StoringOrderTankGO(item));
    //     // this.sotDS.rollbackStoringOrderTank(sot).subscribe(result => {
    //     //   if ((result?.data?.rollbackStoringOrderTank ?? 0) > 0) {
    //     //     let successMsg = this.translatedLangText.CANCELED_SUCCESS;
    //     //     ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
    //     //     this.reloadSOT();
    //     //   }
    //     // });
    //   }
    // });
  }

  undoTempAction(row: StoringOrderTankItem[], actionToBeRemove: string) {
    // const data = [...this.schedulingList.data];
    // row.forEach((newItem: StoringOrderTankItem) => {
    //   const index = data.findIndex(existingItem => existingItem.guid === newItem.guid);

    //   if (index !== -1) {
    //     data[index] = {
    //       ...data[index],
    //       ...newItem,
    //       actions: Array.isArray(data[index].actions!)
    //         ? data[index].actions!.filter(action => action !== actionToBeRemove)
    //         : []
    //     };
    //   }
    // });
    // this.updateData(data);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    // const numSelected = this.sotSelection.selected.length;
    // const numRows = this.storingOrderItem.storing_order_tank?.length;
    // return numSelected === numRows;
    return false;
  }

  masterToggle() {
    // this.isAllSelected()
    //   ? this.sotSelection.clear()
    //   : this.schedulingList.data?.forEach((scheduling) =>
    //     this.sotSelection.select(scheduling)
    //   );
  }

  // context menu
  onContextMenu(event: MouseEvent, item: AdvanceTable) {
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
    this.roForm!.get('sotList')?.setErrors(null);
    if (this.roForm?.valid) {
      if (!this.schedulingList.data.length) {
        this.roForm.get('sotList')?.setErrors({ required: true });
      } else {
        let so: StoringOrderGO = new StoringOrderGO(this.storingOrderItem);
        so.customer_company_guid = this.roForm.value['customer_company_guid'];
        so.haulier = this.roForm.value['haulier'];
        so.so_notes = this.roForm.value['so_notes'];

        const sot: StoringOrderTankGO[] = this.schedulingList.data.map((item: Partial<StoringOrderTankItem>) => {
          // Ensure action is an array and take the last action only
          const actions = Array.isArray(item!.actions) ? item!.actions : [];
          const latestAction = actions.length > 0 ? actions[actions.length - 1] : '';

          return new StoringOrderTankUpdateSO({
            ...item,
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
      console.log('Invalid soForm', this.roForm?.value);
    }
  }

  updateData(newData: SchedulingItem[]): void {
    this.schedulingList.data = [...newData];
    this.schedulingSelection.clear();
  }

  cancelItem(event: Event, row: StoringOrderTankItem) {
    // this.id = row.id;
    // if (this.sotSelection.hasValue()) {
    //   this.cancelSelectedRows(this.sotSelection.selected)
    // } else {
    //   this.cancelSelectedRows([row])
    // }
  }

  rollbackItem(event: Event, row: StoringOrderTankItem) {
    // this.id = row.id;
    // if (this.sotSelection.hasValue()) {
    //   this.rollbackSelectedRows(this.sotSelection.selected)
    // } else {
    //   this.rollbackSelectedRows([row])
    // }
  }

  undoAction(event: Event, row: StoringOrderTankItem, action: string) {
    // this.id = row.id;
    // this.stopPropagation(event);
    // if (this.sotSelection.hasValue()) {
    //   this.undoTempAction(this.sotSelection.selected, action)
    // } else {
    //   this.undoTempAction([row], action)
    // }
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
        ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
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
    if (!actions?.length) return "";
    return actions[actions.length - 1];
  }

  getBadgeClass(action: string): string {
    switch (action) {
      case 'new':
        return 'badge-solid-green';
      case 'edit':
        return 'badge-solid-cyan';
      case 'rollback':
        return 'badge-solid-blue';
      case 'cancel':
        return 'badge-solid-orange';
      default:
        return '';
    }
  }

  getRepairDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.repairCv);
  }

  getYesNoDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.yesnoCv);
  }
}