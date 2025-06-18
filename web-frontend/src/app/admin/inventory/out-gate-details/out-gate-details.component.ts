import { Direction } from '@angular/cdk/bidi';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { OutGateDS, OutGateItem } from 'app/data-sources/out-gate';
import { ReleaseOrderGO } from 'app/data-sources/release-order';
import { ReleaseOrderSotDS, ReleaseOrderSotGO, ReleaseOrderSotItem } from 'app/data-sources/release-order-sot';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS, StoringOrderTankGO, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { ModulePackageService } from 'app/services/module-package.service';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { InGateDS } from 'app/data-sources/in-gate';

@Component({
  selector: 'app-out-gate-details',
  standalone: true,
  templateUrl: './out-gate-details.component.html',
  styleUrl: './out-gate-details.component.scss',
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
export class OutGateDetailsComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  tabIndex = "out-gate";
  displayedColumns = [
    'select',
    'so_no',
    'customer_name',
    'no_of_tanks',
    'status',
    'actions'
  ];

  pageTitleNew = 'MENUITEMS.INVENTORY.LIST.OUT-GATE-DETAILS'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.INVENTORY.TEXT', route: '/admin/inventory/out-gate-main', queryParams: { tabIndex: this.tabIndex } },
    { text: 'MENUITEMS.INVENTORY.LIST.OUT-GATE', route: '/admin/inventory/out-gate-main', queryParams: { tabIndex: this.tabIndex } }
  ]

  translatedLangText: any = {};
  langText = {
    DETAILS: 'COMMON-FORM.DETAILS',
    STATUS: 'COMMON-FORM.STATUS',
    RO_NO: 'COMMON-FORM.RO-NO',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    CUSTOMER_NAME: 'COMMON-FORM.CUSTOMER-NAME',
    RO_DATE: 'COMMON-FORM.RO-DATE',
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
    CANCELED_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    ORDER_DETAILS: 'COMMON-FORM.ORDER-DETAILS',
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
    ALIAS_NAME: 'COMMON-FORM.ALIAS-NAME',
    NOTES: 'COMMON-FORM.NOTES',
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
    OUT_GATE: 'COMMON-FORM.OUT-GATE',
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
    SAVE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    RESET: 'COMMON-FORM.RESET',
    INVALID_SELECTION: 'COMMON-FORM.INVALID-SELECTION',
    CONFIRM_RESET: 'COMMON-FORM.CONFIRM-RESET',
    CONFIRM_CLEAR_ALL: 'COMMON-FORM.CONFIRM-CLEAR-ALL',
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    BRANCH_NAME: 'COMMON-FORM.BRANCH-NAME'
  }

  outGateForm?: UntypedFormGroup;

  storingOrderTankItem?: StoringOrderTankItem;
  roSotItem?: ReleaseOrderSotItem;
  customerBranch?: CustomerCompanyItem;

  cvDS: CodeValuesDS;
  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  tcDS: TariffCleaningDS;
  ogDS: OutGateDS;
  igDS: InGateDS;
  roSotDS: ReleaseOrderSotDS;

  sot_guid?: string | null;
  eir_no?: string | null;

  soStatusCvList: CodeValuesItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  yesnoCv: CodeValuesItem[] = [];
  yardCv: CodeValuesItem[] = [];
  loloCv: CodeValuesItem[] = [];

  customerCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  last_cargoList?: TariffCleaningItem[];

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    public modulePackage: ModulePackageService
  ) {
    super();
    this.translateLangText();
    this.createOutGateForm();
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);
    this.ogDS = new OutGateDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.roSotDS = new ReleaseOrderSotDS(this.apollo);
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

  createOutGateForm() {
    this.outGateForm = this.fb.group({
      eir_dt: [{ value: new Date(), disabled: true }],
      release_job_no: [''],
      haulier: [''],
      vehicle_no: [''],
      driver_name: [''],
      remarks: [''],
      last_cargo_guid: [''],
      last_cargo: this.lastCargoControl,
      purpose_storage: [''],
      open_on_gate: [{ value: '', disabled: true }],
      yard_cv: [''],
      preinspection_cv: [''],
      lolo_cv: ['BOTH'] // default BOTH
    });
  }

  public loadData() {
    this.sot_guid = this.route.snapshot.paramMap.get('id');
    if (this.sot_guid) {
      // EDIT
      // this.subs.sink = this.sotDS.getStoringOrderTankByIDForOutGate(this.sot_guid).subscribe(data => {
      //   if (this.sotDS.totalCount > 0) {
      //     this.storingOrderTankItem = data[0];
      //     this.populateOutGateForm(this.storingOrderTankItem);
      //   }
      // });
      this.subs.sink = this.roSotDS.getReleaseOrderSotForOutGate(this.sot_guid).subscribe(data => {
        if (data.length > 0) {
          this.roSotItem = data.find(x => x.status_cv === 'WAITING');
          this.eir_no = this.igDS.getInGateItem(this.roSotItem?.storing_order_tank?.in_gate)?.eir_no
          console.log(this.roSotItem);
          this.storingOrderTankItem = this.roSotItem?.storing_order_tank;
          this.populateOutGateForm(this.storingOrderTankItem, this.roSotItem);
          this.ccDS.getCustomerBranch(this.roSotItem!.release_order!.customer_company!.guid!).subscribe(cc => {
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
      { alias: 'yesnoCv', codeValType: 'YES_NO' },
      { alias: 'yardCv', codeValType: 'YARD' },
      { alias: 'loloCv', codeValType: 'LOLO' }
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('soStatusCv').subscribe(data => {
      this.soStatusCvList = data;
    });
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      this.purposeOptionCvList = data;
    });
    this.cvDS.connectAlias('yesnoCv').subscribe(data => {
      this.yesnoCv = data;
    });
    this.cvDS.connectAlias('yardCv').subscribe(data => {
      this.yardCv = data;
    });
    this.cvDS.connectAlias('loloCv').subscribe(data => {
      this.loloCv = data;
    });
  }

  populateOutGateForm(sot: StoringOrderTankItem | undefined, roSot: ReleaseOrderSotItem | undefined): void {
    this.outGateForm!.patchValue({
      haulier: roSot?.release_order?.haulier,
      vehicle_no: this.ogDS.getOutGateItem(sot?.out_gate)?.vehicle_no,
      driver_name: this.ogDS.getOutGateItem(sot?.out_gate)?.driver_name,
      eir_dt: this.ogDS.getOutGateItem(sot?.out_gate)?.eir_dt ? Utility.convertDate(this.ogDS.getOutGateItem(sot?.out_gate)?.eir_dt) : new Date(),
      release_job_no: sot?.release_job_no,
      remarks: this.ogDS.getOutGateItem(sot?.out_gate)?.remarks,
      yard_cv: this.ogDS.getOutGateItem(sot?.out_gate)?.yard_cv || sot?.tank_info?.yard_cv,
      // last_cargo_guid: sot.last_cargo_guid,
      // last_cargo: this.lastCargoControl,
    });

    // if (sot.tariff_cleaning) {
    //   this.lastCargoControl.setValue(sot.tariff_cleaning);
    // }
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

  getROSotStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.soStatusCvList);
  }

  initializeFilter() {
    // this.outGateForm!.get('last_cargo')!.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(300),
    //   tap(value => {
    //     var searchCriteria = '';
    //     if (typeof value === 'string') {
    //       searchCriteria = value;
    //     } else {
    //       searchCriteria = value.cargo;
    //       this.outGateForm!.get('last_cargo_guid')!.setValue(value.guid);
    //     }
    //     this.tcDS.loadItems({ cargo: { contains: searchCriteria } }, { cargo: 'ASC' }).subscribe(data => {
    //       if (JSON.stringify(data) !== JSON.stringify(this.last_cargoList)) {
    //         this.last_cargoList = data;
    //         this.updateValidators(this.last_cargoList);
    //         this.lastCargoControl.updateValueAndValidity();
    //       }
    //     });
    //   })
    // ).subscribe();
  }

  onOutGateFormSubmit() {
    if (this.outGateForm?.valid) {
      console.log('Valid outGateForm', this.outGateForm?.value);
      let ro: any = new ReleaseOrderGO(this.roSotItem?.release_order);
      ro.haulier = this.outGateForm.get('haulier')?.value?.toUpperCase();
      ro.release_order_sot = [new ReleaseOrderSotGO(this.roSotItem)];

      const sot = new StoringOrderTankGO(this.storingOrderTankItem);
      sot.release_job_no = this.outGateForm.get('release_job_no')?.value;

      const og = new OutGateItem({
        ...this.ogDS.getOutGateItem(this.storingOrderTankItem?.out_gate),
        eir_dt: Utility.convertDate(this.outGateForm.get('eir_dt')?.value) as number,
        driver_name: this.outGateForm.get('driver_name')?.value?.toUpperCase(),
        vehicle_no: this.outGateForm.get('vehicle_no')?.value?.toUpperCase(),
        remarks: this.outGateForm.get('remarks')?.value,
        so_tank_guid: sot.guid,
        haulier: this.outGateForm.get('haulier')?.value,
        yard_cv: this.outGateForm.get('yard_cv')?.value,
        tank: sot
      })
      console.log('OutGate', og);
      console.log('ReleaseOrder', ro);
      if (og.guid) {
        this.ogDS.updateOutGate(og, ro).subscribe(result => {
          console.log(result?.data)
          this.handleSaveSuccess(result?.data?.updateOutGate);
        });
      } else {
        const publishOutGateSurvey = true;// this.modulePackage.isGrowthPackage() || this.modulePackage.isCustomizedPackage();
        console.log('hasOutSurvey', publishOutGateSurvey)
        this.ogDS.addOutGate(og, ro, publishOutGateSurvey).subscribe(result => {
          console.log(result?.data)
          this.handleSaveSuccess(result?.data?.addOutGate?.affected);
        });
      }
    } else {
      console.log('Invalid inGateForm', this.outGateForm?.value);
    }
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  getCleaningConditionBadgeClass(status: string | undefined): string {
    return Utility.getCleaningConditionBadgeClass(status);
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.SAVE_SUCCESS;
      ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
      this.router.navigate(['/admin/inventory/out-gate-main'], { queryParams: { tabIndex: this.tabIndex } });
    }
  }

  resetDialog(event: Event) {
    event.preventDefault(); // Prevents the form submission

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        headerText: this.translatedLangText.CONFIRM_CLEAR_ALL,
        action: 'new',
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result.action === 'confirmed') {
        this.resetForm();
      }
    });
  }

  resetForm() {
    this.populateOutGateForm(this.storingOrderTankItem, this.roSotItem);
  }

  updateValidators(validOptions: any[]) {
    this.lastCargoControl.setValidators([
      Validators.required,
      AutocompleteSelectionValidator(validOptions)
    ]);
  }

  onAlphaOnly(event: Event, controlName: string): void {
    Utility.onAlphaOnly(event, this.outGateForm?.get(controlName)!);
  }

  onAlphaNumericOnly(event: Event, controlName: string): void {
    Utility.onAlphaNumericOnly(event, this.outGateForm?.get(controlName)!);
  }
}