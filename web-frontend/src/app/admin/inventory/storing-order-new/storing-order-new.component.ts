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
import { MatRadioModule } from '@angular/material/radio';

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
    MatRadioModule
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
    STATUS: 'COMMON-FORM.STATUS'
  }

  unit_typeList: string[] = [
    'IMO1',
    'IMO2',
    'IMO3',
    'IMO4',
    'IMO5',
    'IMO6',
  ];

  clean_statusList: string[] = [
    'Unknown',
    'Clean',
    'Dirty'
  ];

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
  dataSourceDemo = new MatTableDataSource<StoringOrderTankItem>();

  // selectedGroup?: CleanGroup;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder
  ) {
    super();
    this.initSOForm();
    this.initSOTForm();
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
  }
  initSOForm() {
    this.soForm = this.fb.group({
      customer_code: [''],
      contact_person: [''],
      so_notes: [''],
      haulier: [''],
    });
  }
  initSOTForm() {
    this.sotForm = this.fb.group({
      unit_type: [''],
      tank_no: [''],
      last_cargo: [''],
      job_no: [''],
      eta_date: [''],
      purpose_storage: [''],
      purpose_steam: [''],
      purpose_cleaning: [''],
      repair: [''],
      clean_status: [''],
      certificate: [''],
      required_temp: [''],
      flash_point: [''],
      remarks: [''],
      etr_date: [''],
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
  editCall(row: StoringOrderTankItem) {
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
          repairList: this.repairList,
          clean_statusList: this.clean_statusList,
          certificateList: this.certificateList
        }
      },
      direction: tempDirection,
      panelClass: 'dialog-container-xl',
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
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
          const data = this.dataSourceDemo.data;
          data.splice(index, 1);
          this.dataSourceDemo.data = data;
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
        eta_date: this.sotForm.value['eta_date'],
        purpose_storage: this.sotForm.value['purpose_storage'],
        purpose_steam: this.sotForm.value['purpose_steam'],
        purpose_cleaning: this.sotForm.value['purpose_cleaning'],
        repair: this.sotForm.value['repair'],
        clean_status: this.sotForm.value['clean_status'],
        certificate: this.sotForm.value['certificate'],
        required_temp: this.sotForm.value['required_temp'],
        remarks: this.sotForm.value['remarks'],
        etr_date: this.sotForm.value['etr_date'],
        st: this.sotForm.value['st'],
        o2_level: this.sotForm.value['o2_level'],
        open_on_gate: this.sotForm.value['open_on_gate']
      }
      this.updateData([...this.dataSourceDemo.data, sot]);
    } else {
      console.log('Invalid sotForm', this.sotForm?.value);
    }
  }

  submitSOForm(formDirective: any): void {
    if (this.soForm!.valid) {
      formDirective.onSubmit(undefined);  // Trigger the ngSubmit event
    } else {
      formDirective.onSubmit(undefined);
    }
  }

  updateData(newData: StoringOrderTankItem[]): void {
    this.dataSourceDemo.data = newData;
  }

  handleDelete(event: Event, row: any, index: number): void {
    event.preventDefault();  // Prevents the form submission
    event.stopPropagation(); // Stops event propagation
    this.deleteItem(row, index);
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