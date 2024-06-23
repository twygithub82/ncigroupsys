import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag, CdkDragHandle, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { fromEvent } from 'rxjs';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { Utility } from 'app/utilities/utility';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { StoringOrderService } from 'app/services/storing-order.service';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values'
import { CustomerCompanyDS } from 'app/data-sources/customer-company'
import { MatRadioModule } from '@angular/material/radio';
import { Apollo } from 'apollo-angular';
import { MatDividerModule } from '@angular/material/divider';

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
    'repair',
    'status',
    'certificate',
    'actions'
  ];
  pageTitle = 'MENUITEMS.INVENTORY.LIST.STORING-ORDER-NEW'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT',
    'MENUITEMS.INVENTORY.LIST.STORING-ORDER'
  ]
  langText = {
    NEW: 'COMMON-FORM.NEW',
    HEADER: 'COMMON-FORM.HEADER',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    SO_NO: 'COMMON-FORM.SO-NO',
    CONTACT_PERSON: 'COMMON-FORM.CONTACT-PERSON',
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
    CANCEL: 'COMMON-FORM.CANCEL'
  }

  unit_typeList: string[] = [
    'IMO1',
    'IMO2',
    'IMO3',
    'IMO4',
    'IMO5',
    'IMO6',
  ];

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

  soForm?: UntypedFormGroup;
  sotForm?: UntypedFormGroup;
  customerCodeControl = new UntypedFormControl();

  storingOrderService?: StoringOrderService;
  selection = new SelectionModel<StoringOrderTankItem>(true, []);
  sotList = new MatTableDataSource<StoringOrderTankItem>();
  //customer_companyList: CodeValuesItem[] = []
  //unit_typeList: CodeValuesItem[] = []
  clean_statusCv: CodeValuesItem[] = []
  repairCv: CodeValuesItem[] = []
  yesnoCv: CodeValuesItem[] = []

  // selectedGroup?: CleanGroup;
  cvDS: CodeValuesDS;
  ccDS: CustomerCompanyDS;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo
  ) {
    super();
    this.initSOForm();
    this.initSOTForm();
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
    this.loadData();
  }
  public loadData() {
    const queries = [
      { alias: 'clean_statusCv', codeValType: 'CLEAN_STATUS' },
      { alias: 'repairCv', codeValType: 'REPAIR_OPTION'},
      { alias: 'yesnoCv', codeValType: 'YES_NO'}
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.ccDS.loadItems({}, { code: { contains: 'N' } });

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
  initSOForm() {
    this.soForm = this.fb.group({
      customer_code: [''],
      contact_person: [''],
      so_notes: [''],
      haulier: [''],
    });
    // this.clean_statusCv = this.cleanStatusCodeValTest();
    // this.repairCv = this.repairCodeValTest();
    // this.yesnoCv = this.yesnoCodeValTest();
  }
  initSOTForm() {
    this.sotForm = this.fb.group({
      unit_type: [''],
      tank_no: [''],
      last_cargo: [''],
      job_no: [''],
      eta_dt: [''],
      purpose_storage: [''],
      purpose_steam: [''],
      purpose_cleaning: [''],
      repair: [''],
      clean_status: [''],
      certificate: [''],
      required_temp: [''],
      flash_point: [''],
      remarks: [''],
      etr_dt: [''],
      st: [''],
      o2_level: [''],
      open_on_gate: ['']
    });
  }
  displayCleanGroupFn(group: CleanGroup): string {
    return group && group.groupName ? group.groupName : '';
  }
  onSelectCleanGroup(event: any) {
    // this.selectedGroup = event.option.value;
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
    //this.id = row.id;
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
        // Update the item at the specified index
        // const data = this.sotList.data;
        // data[result.index] = result.item;
        // this.updateData(data); // Refresh the data source
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
        // Update the item at the specified index
        const data = this.sotList.data;
        data[result.index] = result.item;
        this.updateData(data); // Refresh the data source
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
      data: row,
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        if (row.guid) {
          // TODO :: update delete dt
        } else {
          const data = this.sotList.data;
          data.splice(index, 1);
          this.sotList.data = data;
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
      console.log('soForm Value', this.soForm.value);
    } else {
      console.log('Invalid soForm', this.soForm?.value);
    }
  }

  onSOTFormSubmit() {
    if (this.sotForm?.valid) {
      var sot: StoringOrderTankItem = {
        guid: '',
        so_guid: '',
        unit_type_guid: this.sotForm.value['unit_type'],
        tank_no: this.sotForm.value['tank_no'],
        last_cargo_guid: this.sotForm.value['last_cargo'],
        job_no: this.sotForm.value['job_no'],
        eta_dt: Utility.convertToEpoch(this.sotForm.value['eta_dt']),
        purpose_storage: this.sotForm.value['purpose_storage'],
        purpose_steam: this.sotForm.value['purpose_steam'],
        purpose_cleaning: this.sotForm.value['purpose_cleaning'],
        purpose_repair_cv: this.sotForm.value['repair'],
        clean_status_cv: this.sotForm.value['clean_status'],
        certificate_cv: this.sotForm.value['certificate'],
        required_temp: this.sotForm.value['required_temp'],
        remarks: this.sotForm.value['remarks'],
        etr_dt: Utility.convertToEpoch(this.sotForm.value['etr_dt']),
        st: this.sotForm.value['st'],
        o2_level: this.sotForm.value['o2_level'],
        open_on_gate_cv: this.sotForm.value['open_on_gate']
      }
      this.updateData([...this.sotList.data, sot]);
    } else {
      console.log('Invalid sotForm', this.sotForm?.value);
    }
  }

  updateData(newData: StoringOrderTankItem[]): void {
    this.sotList.data = newData;
  }

  handleDelete(event: Event, row: any, index: number): void {
    event.preventDefault();  // Prevents the form submission
    event.stopPropagation(); // Stops event propagation
    this.deleteItem(row, index);
  }

  cleanStatusCodeValTest(): CodeValuesItem[] {
    return [
      new CodeValuesItem({ description: 'Unknown', codeValType: 'CLEAN_STATUS', codeValue: 'UNKNOWN' }),
      new CodeValuesItem({ description: 'Clean', codeValType: 'CLEAN_STATUS', codeValue: 'CLEAN' }),
      new CodeValuesItem({ description: 'Dirty', codeValType: 'CLEAN_STATUS', codeValue: 'DIRTY' })
    ]
  }

  repairCodeValTest(): CodeValuesItem[] {
    return [
      new CodeValuesItem({ description: 'Repair', codeValType: 'REPAIR_OPTION', codeValue: 'REPAIR' }),
      new CodeValuesItem({ description: 'No Repair', codeValType: 'REPAIR_OPTION', codeValue: 'NO_REPAIR' }),
      new CodeValuesItem({ description: 'Offhire', codeValType: 'REPAIR_OPTION', codeValue: 'OFFHIRE' })
    ]
  }

  yesnoCodeValTest(): CodeValuesItem[] {
    return [
      new CodeValuesItem({ description: 'Yes', codeValType: 'YES_NO', codeValue: 'Y' }),
      new CodeValuesItem({ description: 'No', codeValType: 'YES_NO', codeValue: 'N' })
    ]
  }
}

export class CleanGroup {
  id: string;
  groupName: string = ""
  category: string = ""
  minCost: number = 0
  maxCost: number = 0
  latUpdateDt: string = ""
  constructor(step: CleanGroup) {
    this.id = step.id || this.getRandomID();
    this.groupName = step.groupName || '';
    this.category = step.category || ''
    this.minCost = step.minCost || 0
    this.maxCost = step.maxCost || 0
    this.latUpdateDt = step.latUpdateDt || ''
  }
  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }
}