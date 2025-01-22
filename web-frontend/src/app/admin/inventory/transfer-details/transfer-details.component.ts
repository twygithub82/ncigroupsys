import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Observable, fromEvent } from 'rxjs';
import { map, filter, tap, catchError, finalize, switchMap, debounceTime, startWith } from 'rxjs/operators';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { Utility } from 'app/utilities/utility';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoringOrderDS, StoringOrderGO, StoringOrderItem } from 'app/data-sources/storing-order';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem, addDefaultSelectOption } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from '@angular/material/divider';
import { ComponentUtil } from 'app/utilities/component-util';
import { StoringOrderTank, StoringOrderTankDS, StoringOrderTankGO, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from "@angular/material/tabs";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { InGateDS, InGateGO } from 'app/data-sources/in-gate';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { TransferItem } from 'app/data-sources/transfer';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { TankInfoDS, TankInfoItem } from 'app/data-sources/tank-info';
import { TransferDS } from 'app/data-sources/transfer';

@Component({
  selector: 'app-transfer-details',
  standalone: true,
  templateUrl: './transfer-details.component.html',
  styleUrl: './transfer-details.component.scss',
  imports: [
    BreadcrumbComponent,
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
    MatDividerModule,
    MatCardModule,
    MatTabsModule,
    MatGridListModule,
    MatRadioModule,
  ]
})
export class TransferDetailsComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'transfer_out_dt',
    'transfer_in_dt',
    'days',
    'location_from_cv',
    'location_to_cv',
    'update_by',
    'update_dt',
    'actions'
  ];

  pageTitleNew = 'MENUITEMS.INVENTORY.LIST.TRANSFER-DETAILS'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT',
    'MENUITEMS.INVENTORY.LIST.TRANSFER'
  ]

  translatedLangText: any = {};
  langText = {
    DETAILS: 'COMMON-FORM.DETAILS',
    STATUS: 'COMMON-FORM.STATUS',
    SO_NO: 'COMMON-FORM.SO-NO',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    CUSTOMER_NAME: 'COMMON-FORM.CUSTOMER-NAME',
    SO_DATE: 'COMMON-FORM.SO-DATE',
    NO_OF_TANKS: 'COMMON-FORM.NO-OF-TANKS',
    LAST_CARGO: 'COMMON-FORM.LAST-CARGO',
    TANK_NO: 'COMMON-FORM.TANK-NO',
    JOB_NO: 'COMMON-FORM.JOB-NO',
    PURPOSE: 'COMMON-FORM.PURPOSE',
    ETA_DATE: 'COMMON-FORM.ETA-DATE',
    NO_RESULT: 'COMMON-FORM.NO-RESULT',
    ARE_YOU_SURE_CANCEL: 'COMMON-FORM.ARE-YOU-SURE-CANCEL',
    CANCEL: 'COMMON-FORM.CANCEL',
    CLOSE: 'COMMON-FORM.CLOSE',
    TO_BE_CANCELED: 'COMMON-FORM.TO-BE-CANCELED',
    CANCELED_SUCCESS: 'COMMON-FORM.CANCELED-SUCCESS',
    ORDER_DETAILS: 'COMMON-FORM.ORDER-DETAILS',
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
    BRANCH_NAME: 'COMMON-FORM.BRANCH-NAME',
    SO_NOTES: 'COMMON-FORM.SO-NOTES',
    TANK_DETAILS: 'COMMON-FORM.TANK-DETAILS',
    EIR_NO: 'COMMON-FORM.EIR-NO',
    CLEANING_CONDITIONS: 'COMMON-FORM.CLEANING-CONDITIONS',
    CARGO_DETAILS: 'COMMON-FORM.CARGO-DETAILS',
    CARGO: 'COMMON-FORM.CARGO',
    CARGO_NAME: 'COMMON-FORM.CARGO-NAME',
    CARGO_CLASS: 'COMMON-FORM.CARGO-CLASS',
    CARGO_UN_NO: 'COMMON-FORM.CARGO-UN-NO',
    CARGO_FLASH_POINT: 'COMMON-FORM.CARGO-FLASH-POINT',
    CARGO_HAZARD_LEVEL: 'COMMON-FORM.CARGO-HAZARD-LEVEL',
    CARGO_BAN_TYPE: 'COMMON-FORM.CARGO-BAN-TYPE',
    CARGO_NATURE: 'COMMON-FORM.CARGO-NATURE',
    CLEANING_CATEGORY: 'COMMON-FORM.CLEANING-CATEGORY',
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    TOTAL_CLEANED: 'COMMON-FORM.TOTAL-CLEANED',
    IN_GATE_ALERT: 'COMMON-FORM.IN-GATE-ALERT',
    MSDS: 'COMMON-FORM.MSDS',
    IN_GATE: 'COMMON-FORM.IN-GATE',
    EIR_DATE: 'COMMON-FORM.EIR-DATE',
    HAULIER: 'COMMON-FORM.HAULIER',
    VEHICLE_NO: 'COMMON-FORM.VEHICLE-NO',
    DRIVER_NAME: 'COMMON-FORM.DRIVER-NAME',
    STORAGE: 'COMMON-FORM.STORAGE',
    OPEN_ON_GATE: 'COMMON-FORM.OPEN-ON-GATE',
    REMARKS: 'COMMON-FORM.REMARKS',
    YARD: 'COMMON-FORM.YARD',
    PRE_INSPECTION: 'COMMON-FORM.PRE-INSPECTION',
    LOLO: 'COMMON-FORM.LOLO',
    SO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    BACK: 'COMMON-FORM.BACK',
    ACCEPT: 'COMMON-FORM.ACCEPT',
    EIR_FORM: 'COMMON-FORM.EIR-FORM',
    SAVE_SUCCESS: 'COMMON-FORM.SAVE-SUCCESS',
    RESET: 'COMMON-FORM.RESET',
    INVALID_SELECTION: 'COMMON-FORM.INVALID-SELECTION',
    CONFIRM_RESET: 'COMMON-FORM.CONFIRM-RESET',
    CONFIRM_CLEAR_ALL: 'COMMON-FORM.CONFIRM-CLEAR-ALL',
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    OWNER: 'COMMON-FORM.OWNER',
    ALIAS_NAME: 'COMMON-FORM.ALIAS-NAME',
    TRANSFER_DETAILS: 'COMMON-FORM.TRANSFER-DETAILS',
    CURRENT_LOCATION: 'COMMON-FORM.CURRENT-LOCATION',
    TRANSFER_SINCE: 'COMMON-FORM.TRANSFER-SINCE',
    TRANSFER_UNTIL: 'COMMON-FORM.TRANSFER-UNTIL',
    DAYS: 'COMMON-FORM.DAYS',
    TO_YARD: 'COMMON-FORM.TO-YARD',
    FROM_YARD: 'COMMON-FORM.FROM-YARD',
    UPDATE_BY: 'COMMON-FORM.UPDATE-BY',
    UPDATE_DATE: 'COMMON-FORM.UPDATE-DATE',
    EDIT_TRANSFER_DETAILS: 'COMMON-FORM.EDIT-TRANSFER-DETAILS',
    NEW_TRANSFER_DETAILS: 'COMMON-FORM.NEW-TRANSFER-DETAILS',
    TRANSFER_LOCATION: 'COMMON-FORM.TRANSFER-LOCATION',
    ADD: 'COMMON-FORM.ADD',
    TRANSFER_IN: 'COMMON-FORM.TRANSFER-IN',
    ROLLBACK: 'COMMON-FORM.ROLLBACK',
    DELETE_SUCCESS: 'COMMON-FORM.DELETE-SUCCESS',
    CONFIRM_CANCEL: 'COMMON-FORM.CONFIRM-CANCEL',
    UPDATE: 'COMMON-FORM.UPDATE',
    CONFIRM_ROLLBACK: 'COMMON-FORM.CONFIRM-ROLLBACK',
  }

  storingOrderTankItem?: StoringOrderTankItem;

  cvDS: CodeValuesDS;
  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  tcDS: TariffCleaningDS;
  igDS: InGateDS;
  tiDS: TankInfoDS;
  transferDS: TransferDS;

  sot_guid?: string | null;
  tiItem?: TankInfoItem;

  ownerControl = new UntypedFormControl();
  ownerList?: CustomerCompanyItem[];
  customerBranch?: CustomerCompanyItem;
  soStatusCvList: CodeValuesItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  yardCvList: CodeValuesItem[] = [];
  transferList: TransferItem[] = [];

  customerCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  last_cargoList?: TariffCleaningItem[];
  cargoDetails?: TariffCleaningItem;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super();
    this.translateLangText();
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.tiDS = new TankInfoDS(this.apollo);
    this.transferDS = new TransferDS(this.apollo);
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

  refresh() {
    this.loadData();
  }

  public loadData() {
    this.sot_guid = this.route.snapshot.paramMap.get('id');
    if (this.sot_guid) {
      // EDIT
      this.subs.sink = this.sotDS.getStoringOrderTankByIDForTransferDetails(this.sot_guid).subscribe(data => {
        if (data.length > 0) {
          this.storingOrderTankItem = data[0];
          this.transferList = this.storingOrderTankItem?.transfer || [];

          if (this.storingOrderTankItem.tariff_cleaning) {
            this.cargoDetails = this.storingOrderTankItem.tariff_cleaning;
          }
          this.tiDS.getTankInfoForMovement(this.storingOrderTankItem?.tank_no!).subscribe(data => {
            this.tiItem = data[0];
          });
          this.ccDS.getCustomerBranch(this.storingOrderTankItem!.storing_order!.customer_company!.guid!).subscribe(cc => {
            if (cc.length > 0) {
              this.customerBranch = cc[0]
            }
          });
        }
      });
    } else {
      // NEW
    }

    const queries = [
      { alias: 'soStatusCv', codeValType: 'SO_STATUS' },
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'yardCv', codeValType: 'YARD' },
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('soStatusCv').subscribe(data => {
      this.soStatusCvList = data;
    });
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      this.purposeOptionCvList = data;
    });
    this.cvDS.connectAlias('yardCv').subscribe(data => {
      this.yardCvList = data;
    });
  }

  // context menu
  onContextMenu(event: MouseEvent, item: StoringOrderItem) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    if (this.contextMenu !== undefined && this.contextMenu.menu !== null) {
      this.contextMenu.menuData = { item: item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
  }

  displayDateTime(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateTimeStr(input);
  }

  displayDate(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input);
  }

  displayTankPurpose() {
    let purposes: any[] = [];
    if (this.storingOrderTankItem?.purpose_storage) {
      purposes.push(this.getPurposeOptionDescription('STORAGE'));
    }
    if (this.storingOrderTankItem?.purpose_cleaning) {
      purposes.push(this.getPurposeOptionDescription('CLEANING'));
    }
    if (this.storingOrderTankItem?.purpose_steam) {
      purposes.push(this.getPurposeOptionDescription('STEAM'));
    }
    if (this.storingOrderTankItem?.purpose_repair_cv) {
      purposes.push(this.getPurposeOptionDescription(this.storingOrderTankItem?.purpose_repair_cv));
    }
    return purposes.join('; ');
  }

  getPurposeOptionDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.purposeOptionCvList);
  }

  getYardDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.yardCvList);
  }

  initializeFilter() {
  }

  onInGateFormSubmit() {
    // if (this.inGateForm?.valid) {
    //   console.log('Valid inGateForm', this.inGateForm?.value);
    //   this.storingOrderTankItem!.storing_order!.haulier = this.inGateForm.get('haulier')?.value;
    //   this.storingOrderTankItem!.owner_guid = this.inGateForm.get('owner_guid')?.value;
    //   this.storingOrderTankItem!.job_no = this.inGateForm.get('job_no')?.value;
    //   this.storingOrderTankItem!.purpose_storage = this.inGateForm.get('purpose_storage')?.value;
    //   this.storingOrderTankItem!.last_cargo_guid = this.inGateForm.get('last_cargo_guid')?.value;
    //   let so = new StoringOrderGO(this.storingOrderTankItem!.storing_order);
    //   let sot = new StoringOrderTankGO(this.storingOrderTankItem);
    //   sot.storing_order = so;
    //   let ig = new InGateGO({
    //     guid: this.igDS.getInGateItem(this.storingOrderTankItem?.in_gate)?.guid,
    //     eir_no: this.igDS.getInGateItem(this.storingOrderTankItem?.in_gate)?.eir_no,
    //     eir_dt: Utility.convertDate(this.inGateForm.get('eir_dt')?.value) as number,
    //     so_tank_guid: this.storingOrderTankItem?.guid,
    //     driver_name: this.inGateForm.get('driver_name')?.value,
    //     vehicle_no: this.inGateForm.get('vehicle_no')?.value?.toUpperCase(),
    //     remarks: this.inGateForm.get('remarks')?.value,
    //     tank: sot,
    //     yard_cv: this.inGateForm.get('yard_cv')?.value,
    //     preinspection_cv: this.inGateForm.get('preinspection_cv')?.value,
    //     lolo_cv: this.inGateForm.get('lolo_cv')?.value,
    //     haulier: this.inGateForm.get('haulier')?.value
    //   })
    //   console.log(ig);
    //   if (ig.guid) {
    //     this.igDS.updateInGate(ig).subscribe(result => {
    //       this.handleSaveSuccess(result?.data?.updateInGate);
    //     });
    //   } else {
    //     this.igDS.addInGate(ig).subscribe(result => {
    //       this.handleSaveSuccess(result?.data?.addInGate);
    //     });
    //   }
    // } else {
    //   console.log('Invalid inGateForm', this.inGateForm?.value);
    // }
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
  }

  cleanStatusColor(clean_status_cv?: string): string {
    if (clean_status_cv === 'DIRTY') {
      return "label bg-red";
    }

    if (clean_status_cv === 'CLEAN') {
      return "label bg-green";
    }
    return "";
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.SAVE_SUCCESS;
      ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
      // query transfer again
      const where = {
        sot_guid: { eq: this.storingOrderTankItem?.guid }
      }
      this.transferDS.getTransferBySotIDForTransfer(where, { transfer_out_dt: "DESC" }).subscribe(data => {
        this.transferList = data || [];
      });
    }
  }

  handleDeleteSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.DELETE_SUCCESS;
      ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
      // query transfer again
      const where = {
        sot_guid: { eq: this.storingOrderTankItem?.guid }
      }
      this.transferDS.getTransferBySotIDForTransfer(where, { transfer_out_dt: "DESC" }).subscribe(data => {
        this.transferList = data || [];
      });
    }
  }

  hasMenuItems(row: any): boolean {
    return (
      this.transferDS.canCompleteTransfer(row) || this.transferDS.canCancel(row) || this.transferDS.canRollback(row, this.transferList)
    );
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

  addTransferDetails(event: Event, row?: TransferItem) {
    this.preventDefault(event);  // Prevents the form submission
    const lastTransfer = this.transferDS.getLastTransfer(this.transferList);
    if (row && lastTransfer?.guid !== row?.guid) {
      return;
    }
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const lastLocation = (this.transferDS.getLastLocation(this.transferList))
      || (this.igDS.getInGateItem(this.storingOrderTankItem?.in_gate)?.yard_cv);
    const addTransfer = row ?? new TransferItem({
      sot_guid: this.storingOrderTankItem?.guid,
      location_from_cv: lastLocation
    });
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '1000px',
      data: {
        item: addTransfer,
        lastLocation: lastLocation,
        action: addTransfer.guid ? 'edit' : 'new',
        translatedLangText: this.translatedLangText,
        populateData: {
          yardCvList: this.yardCvList
        },
        index: -1
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const transfer = new TransferItem({
          ...result.item,
          storing_order_tank: new StoringOrderTank(this.storingOrderTankItem)
        });

        console.log(transfer)
        this.transferDS.updateTransfer(transfer).subscribe(result => {
          console.log(result)
          if ((result?.data?.updateTransfer ?? 0) > 0) {
            this.handleSaveSuccess(result?.data?.updateTransfer);
          }
        });
      }
    });
  }

  completeTransfer(event: Event, transfer?: TransferItem) {
    this.preventDefault(event);  // Prevents the form submission
    if (transfer?.transfer_in_dt) {
      return;
    }
    const newTransfer = new TransferItem(transfer);
    newTransfer.transfer_in_dt = Utility.convertDate(new Date(), false, true) as number;
    newTransfer.storing_order_tank = new StoringOrderTank(this.storingOrderTankItem)
    newTransfer.action = "complete";
    console.log(newTransfer)
    this.transferDS.updateTransfer(newTransfer).subscribe(result => {
      console.log(result)
      if ((result?.data?.updateTransfer ?? 0) > 0) {
        this.handleSaveSuccess(result?.data?.updateTransfer);
      }
    });
  }

  rollbackTransfer(event: Event, transfer?: TransferItem) {
    this.preventDefault(event);  // Prevents the form submission
    const newTransfer = new TransferItem(transfer);
    newTransfer.transfer_in_dt = undefined;
    newTransfer.storing_order_tank = new StoringOrderTank(this.storingOrderTankItem);
    newTransfer.action = "rollback"
    console.log(newTransfer)
    this.transferDS.updateTransfer(newTransfer).subscribe(result => {
      console.log(result)
      if ((result?.data?.updateTransfer ?? 0) > 0) {
        this.handleSaveSuccess(result?.data?.updateTransfer);
      }
    });
  }

  cancelTransfer(event: Event, transfer?: TransferItem) {
    this.preventDefault(event);  // Prevents the form submission
    const newTransfer = new TransferItem(transfer);
    newTransfer.storing_order_tank = new StoringOrderTank(this.storingOrderTankItem);
    newTransfer.action = "cancel"
    console.log(newTransfer)
    this.transferDS.updateTransfer(newTransfer).subscribe(result => {
      console.log(result)
      if ((result?.data?.updateTransfer ?? 0) > 0) {
        this.handleDeleteSuccess(result?.data?.updateTransfer);
      }
    });
  }

  rollbackDialog(event: Event, transfer?: TransferItem) {
    event.preventDefault(); // Prevents the form submission

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        headerText: this.translatedLangText.CONFIRM_ROLLBACK,
        action: 'new',
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result.action === 'confirmed') {
        this.rollbackTransfer(event, transfer);
      }
    });
  }

  cancelDialog(event: Event, transfer?: TransferItem) {
    event.preventDefault(); // Prevents the form submission

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        headerText: this.translatedLangText.CONFIRM_CANCEL,
        action: 'new',
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result.action === 'confirmed') {
        //this.resetForm();
        this.cancelTransfer(event, transfer);
      }
    });
  }

  resetForm() {
    // this.inGateForm!.patchValue({
    //   haulier: this.storingOrderTankItem!.storing_order?.haulier,
    //   vehicle_no: this.igDS.getInGateItem(this.storingOrderTankItem!.in_gate)?.vehicle_no || '',
    //   driver_name: this.igDS.getInGateItem(this.storingOrderTankItem!.in_gate)?.driver_name || '',
    //   eir_dt: this.igDS.getInGateItem(this.storingOrderTankItem!.in_gate)?.eir_dt ? Utility.convertDate(this.igDS.getInGateItem(this.storingOrderTankItem!.in_gate)?.eir_dt) : new Date(),
    //   job_no: this.storingOrderTankItem!.job_no,
    //   remarks: this.igDS.getInGateItem(this.storingOrderTankItem!.in_gate)?.remarks,
    //   purpose_storage: this.storingOrderTankItem!.purpose_storage,
    //   open_on_gate: this.storingOrderTankItem!.tariff_cleaning?.open_on_gate_cv,
    //   yard_cv: this.igDS.getInGateItem(this.storingOrderTankItem!.in_gate)?.yard_cv,
    //   preinspection_cv: this.igDS.getInGateItem(this.storingOrderTankItem!.in_gate)?.preinspection_cv,
    //   lolo_cv: 'BOTH' // default BOTH
    // });

    // if (this.storingOrderTankItem!.tariff_cleaning) {
    //   this.lastCargoControl.setValue(this.storingOrderTankItem!.tariff_cleaning);
    // } else {
    //   this.lastCargoControl.reset(); // Reset the control if there's no tariff_cleaning
    // }
  }

  updateValidators(validOptions: any[]) {
    this.lastCargoControl.setValidators([
      Validators.required,
      AutocompleteSelectionValidator(validOptions)
    ]);
  }

  canCompleteTransfer(row: any): boolean {
    return (true
    );
  }
}