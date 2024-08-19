import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag, CdkDragHandle, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, FormsModule, ReactiveFormsModule, FormControl, UntypedFormArray } from '@angular/forms';
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
import { ReleaseOrderDS, ReleaseOrderGO, ReleaseOrderItem } from 'app/data-sources/release-order';
import { SchedulingDS, SchedulingItem, SchedulingUpdateItem } from 'app/data-sources/scheduling';
import { MatCardModule } from '@angular/material/card';
import { BookingDS, BookingItem } from 'app/data-sources/booking';
import { InGateDS } from 'app/data-sources/in-gate';
import { SchedulingSotDS, SchedulingSotItem, SchedulingSotUpdateItem } from 'app/data-sources/scheduling-sot';
import { ReleaseOrderSotGO, ReleaseOrderSotItem, ReleaseOrderSotUpdateItem } from 'app/data-sources/release-order-sot';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';

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
    MatCardModule,
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
  pageTitleNew = 'MENUITEMS.INVENTORY.LIST.RELEASE-ORDER-NEW'
  pageTitleEdit = 'MENUITEMS.INVENTORY.LIST.RELEASE-ORDER-EDIT'
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
    HAULIER: 'COMMON-FORM.HAULIER',
    ORDER_DETAILS: 'COMMON-FORM.ORDER-DETAILS',
    TANK_NO: 'COMMON-FORM.TANK-NO',
    LAST_CARGO: 'COMMON-FORM.LAST-CARGO',
    JOB_NO: 'COMMON-FORM.JOB-NO',
    REMARKS: 'COMMON-FORM.REMARKS',
    SO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    STATUS: 'COMMON-FORM.STATUS',
    UPDATE: 'COMMON-FORM.UPDATE',
    CANCEL: 'COMMON-FORM.CANCEL',
    NO_RESULT: 'COMMON-FORM.NO-RESULT',
    SAVE_SUCCESS: 'COMMON-FORM.SAVE-SUCCESS',
    BACK: 'COMMON-FORM.BACK',
    SAVE_AND_SUBMIT: 'COMMON-FORM.SAVE-AND-SUBMIT',
    ARE_YOU_SURE_DELETE: 'COMMON-FORM.ARE-YOU-SURE-DELETE',
    DELETE: 'COMMON-FORM.DELETE',
    CLOSE: 'COMMON-FORM.CLOSE',
    INVALID: 'COMMON-FORM.INVALID',
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
    RELEASE_ORDER_DATE: 'COMMON-FORM.RELEASE-ORDER-DATE',
    ADD_TANK: 'COMMON-FORM.ADD-TANK',
    REFERENCE: 'COMMON-FORM.REFERENCE',
    EIR_NO: "COMMON-FORM.EIR-NO",
    EIR_DATE: "COMMON-FORM.EIR-DATE",
    CAPACITY: "COMMON-FORM.CAPACITY",
    TARE_WEIGHT: "COMMON-FORM.TARE-WEIGHT",
    YARD: "COMMON-FORM.YARD",
    ADD: "COMMON-FORM.ADD",
    FILTER: "COMMON-FORM.FILTER",
    BOOKING_DATE: "COMMON-FORM.BOOKING-DATE",
    SCHEDULING_DATE: "COMMON-FORM.SCHEDULING-DATE"
  }

  clean_statusList: CodeValuesItem[] = [];

  ro_guid?: string | null;

  roForm?: UntypedFormGroup;
  sotForm?: UntypedFormGroup;

  releaseOrderItem: ReleaseOrderItem = new ReleaseOrderItem();
  schedulingList: SchedulingUpdateItem[] = [];
  schedulingSelection = new SelectionModel<SchedulingUpdateItem>(true, []);
  customer_companyList?: CustomerCompanyItem[];
  soStatusCvList: CodeValuesItem[] = []
  yardCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];

  customerCodeControl = new UntypedFormControl();

  cvDS: CodeValuesDS;
  ccDS: CustomerCompanyDS;
  roDS: ReleaseOrderDS;
  bookingDS: BookingDS;
  schedulingDS: SchedulingDS;
  schedulingSotDS: SchedulingSotDS;
  igDS: InGateDS;

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
    this.initForm();
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.roDS = new ReleaseOrderDS(this.apollo);
    this.bookingDS = new BookingDS(this.apollo);
    this.schedulingDS = new SchedulingDS(this.apollo);
    this.schedulingSotDS = new SchedulingSotDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.initializeValueChanges();
    this.loadData();
  }

  initForm() {
    this.roForm = this.fb.group({
      guid: [''],
      customer_code: this.customerCodeControl,
      customer_company_guid: [''],
      release_dt: [''],
      ro_no: [''],
      ro_notes: [''],
      haulier: [''],
      sotList: this.fb.array([])
    });
  }

  getReleaseOrderSotArray(): UntypedFormArray {
    return this.roForm?.get('sotList') as UntypedFormArray;
  }
  
  getFormSotGuids(): string[] {
    const sotArray = this.getReleaseOrderSotArray();
    return sotArray.controls.map(control => control.get('sot_guid')?.value);
  }

  initializeValueChanges() {
    this.roForm!.get('customer_code')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (typeof value === 'string') {
          searchCriteria = value;
          this.roForm!.get('customer_company_guid')!.setValue('');
        } else {
          searchCriteria = value.code;
          this.roForm!.get('customer_company_guid')!.setValue(value.guid);
        }
        this.subs.sink = this.ccDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
          this.customer_companyList = data
        });
      })
    ).subscribe();
  }

  public loadData() {
    this.ro_guid = this.route.snapshot.paramMap.get('id');
    if (this.ro_guid) {
      // EDIT
      this.subs.sink = this.roDS.getReleaseOrderByID(this.ro_guid).subscribe(data => {
        if (this.roDS.totalCount > 0) {
          this.releaseOrderItem = data[0];
          console.log(this.releaseOrderItem)
          this.populateROForm(this.releaseOrderItem);
        }
      });
    } else {
      this.subs.sink = this.ccDS.loadItems({}, { code: 'ASC' }).subscribe(data => {
        this.customer_companyList = data
      });
    }
    const queries = [
      { alias: 'yardCv', codeValType: 'YARD' },
      { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
      { alias: 'soStatusCv', codeValType: 'SO_STATUS' }
    ];
    this.cvDS.getCodeValuesByType(queries);

    this.cvDS.connectAlias('yardCv').subscribe(data => {
      this.yardCvList = data;
    });
    this.cvDS.connectAlias('tankStatusCv').subscribe(data => {
      this.tankStatusCvList = data;
    });
    this.cvDS.connectAlias('soStatusCv').subscribe(data => {
      this.soStatusCvList = data;
    });
  }

  populateROForm(ro: ReleaseOrderItem): void {
    this.roForm!.patchValue({
      guid: ro.guid,
      customer_code: ro.customer_company,
      customer_company_guid: ro.customer_company_guid,
      release_dt: Utility.convertDate(ro.release_dt),
      ro_no: ro.ro_no,
      ro_notes: ro.ro_notes,
      haulier: ro.haulier
    });
    if (ro.release_order_sot && ro.release_order_sot.length) {
      this.populateSOT(ro.release_order_sot);
    }
  }

  populateSOT(sotList: ReleaseOrderSotUpdateItem[]) {
    const schedulingFormArray = this.roForm!.get('sotList') as UntypedFormArray;
    schedulingFormArray.clear();  // Clear existing items

    sotList.forEach(item => {
      schedulingFormArray.push(this.createRoSotFormGroup(item));
    });
  }

  createRoSotFormGroup(item: ReleaseOrderSotUpdateItem): UntypedFormGroup {
    return this.fb.group({
      // roSot prop
      guid: [item.guid],
      ro_guid: [item.ro_guid],
      sot_guid: [item.sot_guid],
      status_cv: [item.status_cv],
      action: [item.action],
      // sot prop
      tank_no: [item.storing_order_tank?.tank_no],
      release_job_no: [item.storing_order_tank?.release_job_no],
      eir_no: [this.igDS.getInGateItem(item.storing_order_tank?.in_gate)?.eir_no],
      eir_dt: [Utility.convertEpochToDateStr(this.igDS.getInGateItem(item.storing_order_tank?.in_gate)?.eir_dt)],
      tank_status_cv: [item.storing_order_tank?.tank_status_cv],
      yard_cv: [this.igDS.getInGateItem(item.storing_order_tank?.in_gate)?.yard_cv],
      booking_dt: [Utility.convertEpochToDateStr(this.bookingDS.getBookingReleaseOrder(item.storing_order_tank?.booking)?.booking_dt)],
      schedule_dt: [Utility.convertEpochToDateStr(this.schedulingSotDS.getSchedulingSotReleaseOrder(item.storing_order_tank?.scheduling_sot)?.scheduling?.scheduling_dt)],
    });
  }

  createTankGroup(tank: any): UntypedFormGroup {
    return this.fb.group({
      sot_guid: [tank.guid],
      tank_no: [tank.tank_no],
      customer_company: [this.ccDS.displayName(tank.storing_order?.customer_company)],
      eir_no: [this.igDS.getInGateItem(tank.in_gate)?.eir_no],
      eir_dt: [this.igDS.getInGateItem(tank.in_gate)?.eir_dt],
      capacity: [this.igDS.getInGateItem(tank.in_gate)?.in_gate_survey?.capacity],
      tare_weight: [this.igDS.getInGateItem(tank.in_gate)?.in_gate_survey?.tare_weight],
      tank_status_cv: [tank.tank_status_cv],
      yard_cv: [this.igDS.getInGateItem(tank.in_gate)?.yard_cv],
      reference: [''],
      release_job_no: [tank.release_job_no],
    });
  }

  updateData(newData: SchedulingItem[]): void {
    this.schedulingList = [...newData];
    this.schedulingSelection.clear();
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
    this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const sotGuidList = this.getFormSotGuids();
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        sotIdList: sotGuidList, //this.releaseOrderItem.release_order_sot?.map((tank) => tank.sot_guid),
        action: 'new',
        translatedLangText: this.translatedLangText,
        customer_company_guid: this.roForm!.get('customer_company_guid')?.value,
        populateData: {
          tankStatusCvList: this.tankStatusCvList,
          yardCvList: this.yardCvList,
        },
        index: -1
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const selectedList = result.selectedList;
        const roSotList = selectedList.map((tank: any) => new ReleaseOrderSotUpdateItem({ sot_guid: tank.guid, storing_order_tank: new StoringOrderTankItem(tank), action: 'new' }))
        this.populateSOT(roSotList)
        // const data = [...this.schedulingList];
        // const newItem = new StoringOrderTankItem({
        //   ...result.item,
        //   actions: ['new']
        // });

        // // Add the new item to the end of the list
        // data.push(newItem);

        // this.updateData(data);
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

  cancelSelectedRows(row: SchedulingItem[]) {
    //this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(CancelFormDialogComponent, {
      data: {
        action: "cancel",
        item: [...row],
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const data = [...this.schedulingList];
        result.item.forEach((newItem: SchedulingItem) => {
          // Find the index of the item in data with the same id
          const index = data.findIndex(existingItem => existingItem.guid === newItem.guid);

          // If the item is found, update the properties
          if (index !== -1) {
            data[index] = {
              ...data[index],
              ...newItem,
              action: 'cancel'
            };
          }
        });
        this.updateData(data);
      }
    });
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

  deleteItem(row: UntypedFormControl, index: number) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const toRemove = new ReleaseOrderSotUpdateItem({storing_order_tank: new StoringOrderTankItem({tank_no: row.get("tank_no")?.value})});
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        item: toRemove,
        translatedLangText: this.translatedLangText,
        index: index,
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const sotArray = this.getReleaseOrderSotArray();
    
        // Remove the item from the FormArray
        sotArray.removeAt(index);
      }
    });
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
    this.roForm!.get('roSotList')?.setErrors(null);
    if (this.roForm?.valid) {
      const sotGuidList = this.getFormSotGuids();
      if (!sotGuidList.length) {
        this.roForm.get('roSotList')?.setErrors({ required: true });
      } else {
        let ro: ReleaseOrderGO = new ReleaseOrderGO(this.releaseOrderItem);
        ro.customer_company_guid = this.roForm.value['customer_company_guid'];
        ro.haulier = this.roForm!.get('haulier')?.value;
        ro.ro_notes = this.roForm!.get('ro_notes')?.value;
        ro.release_dt = Utility.convertDate(this.roForm!.get('release_dt')?.value) as number;

        const sotArray = this.getReleaseOrderSotArray();
        const roSot: ReleaseOrderSotItem[] = sotArray.controls.map(control => {
          const item = control.value as Partial<ReleaseOrderSotItem>;
          const sot = new StoringOrderTankGO({guid: control.get('sot_guid')?.value, release_job_no: control.get('release_job_no')?.value, tank_status_cv: control.get('tank_status_cv')?.value});
          return new ReleaseOrderSotItem({
            ...item,
            storing_order_tank: sot
          });
        });
        console.log('ro Value', ro);
        console.log('roSot Value', roSot);
        if (ro.guid) {
          this.roDS.updateReleaseOrder(ro, roSot).subscribe(result => {
            console.log(result)
            this.handleSaveSuccess(result?.data?.updateReleaseOrder);
          });
        } else {
          this.roDS.addReleaseOrder(ro, roSot).subscribe(result => {
            console.log(result)
            this.handleSaveSuccess(result?.data?.addReleaseOrder);
          });
        }
      }
    } else {
      console.log('Invalid soForm', this.roForm?.value);
    }
  }

  cancelItem(event: Event, row: StoringOrderTankItem) {
    if (this.schedulingSelection.hasValue()) {
      this.cancelSelectedRows(this.schedulingSelection.selected)
    } else {
      this.cancelSelectedRows([row])
    }
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

  handleDelete(event: Event, row: any, index: number): void {
    this.deleteItem(row, index);
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.langText.SAVE_SUCCESS;
      this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
        successMsg = res;
        ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
        this.router.navigate(['/admin/inventory/release-order']);
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
      case 'preorder':
        return 'badge-solid-pink';
      default:
        return '';
    }
  }

  getTankStatusDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.tankStatusCvList);
  }

  getYardDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.yardCvList);
  }

  getSoStatusDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.soStatusCvList);
  }
}