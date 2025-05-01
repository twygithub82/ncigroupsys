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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FileManagerService } from '@core/service/filemanager.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS, InGateGO } from 'app/data-sources/in-gate';
import { StoringOrderGO, StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS, StoringOrderTankGO, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { debounceTime, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'app-in-gate-details',
  standalone: true,
  templateUrl: './in-gate-details.component.html',
  styleUrl: './in-gate-details.component.scss',
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
export class InGateDetailsComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  tabIndex = 0;
  displayedColumns = [
    'select',
    'so_no',
    'customer_name',
    'no_of_tanks',
    'status',
    'actions'
  ];

  pageTitleNew = 'MENUITEMS.INVENTORY.LIST.IN-GATE-DETAILS'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.INVENTORY.TEXT', route: '/admin/inventory/in-gate-main', queryParams: { tabIndex: this.tabIndex } },
    { text: 'MENUITEMS.INVENTORY.LIST.IN-GATE', route: '/admin/inventory/in-gate-main', queryParams: { tabIndex: this.tabIndex } }
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
    OPEN_AT_GATE: 'COMMON-FORM.OPEN-AT-GATE',
  }

  inGateForm?: UntypedFormGroup;

  storingOrderTankItem?: StoringOrderTankItem;

  cvDS: CodeValuesDS;
  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  tcDS: TariffCleaningDS;
  igDS: InGateDS;

  sot_guid?: string | null;
  sdsPdf: any;
  sdsPdfName: string = "";

  ownerControl = new UntypedFormControl();
  ownerList?: CustomerCompanyItem[];
  customerBranch?: CustomerCompanyItem;
  soStatusCvList: CodeValuesItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  yesnoCvList: CodeValuesItem[] = [];
  yardCvList: CodeValuesItem[] = [];
  hazardLevelCvList: CodeValuesItem[] = [];
  banTypeCvList: CodeValuesItem[] = [];
  natureTypeCvList: CodeValuesItem[] = [];

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
    private fileManagerService: FileManagerService,
  ) {
    super();
    this.translateLangText();
    this.createInGateForm();
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
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

  createInGateForm() {
    this.inGateForm = this.fb.group({
      eir_dt: [{ value: new Date(), disabled: true }],
      job_no: [''],
      haulier: [''],
      owner: this.ownerControl,
      owner_guid: [''],
      vehicle_no: [''],
      driver_name: [''],
      remarks: [''],
      last_cargo_guid: [''],
      last_cargo: this.lastCargoControl,
      purpose_storage: [''],
      open_on_gate: [{ value: '', disabled: true }],
      yard_cv: ['YARD_1'],
      preinspection_cv: ['YES'],
      lolo_cv: ['BOTH']
    });
  }

  public loadData() {
    this.sot_guid = this.route.snapshot.paramMap.get('id');
    if (this.sot_guid) {
      // EDIT
      this.subs.sink = this.sotDS.getStoringOrderTankByIDForInGate(this.sot_guid).subscribe(data => {
        if (data.length > 0) {
          this.storingOrderTankItem = data[0];
          this.ccDS.getCustomerBranch(this.storingOrderTankItem!.storing_order!.customer_company!.guid!).subscribe(cc => {
            if (cc.length > 0) {
              this.customerBranch = cc[0]
            }
            this.populateInGateForm(this.storingOrderTankItem!);
          });

          this.fileManagerService.getFileUrlByGroupGuid([this.storingOrderTankItem?.tariff_cleaning?.guid!]).subscribe({
            next: (response) => {
              console.log('Files retrieved successfully:', response);
              if (response?.length) {
                this.sdsPdf = response[0];
                this.getSDSPdfName();
              }
            },
            error: (error) => {
              console.error('Error retrieving files:', error);
            },
            complete: () => {
              console.log('File retrieval process completed.');
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
      { alias: 'hazardLevelCv', codeValType: 'HAZARD_LEVEL' },
      { alias: 'banTypeCv', codeValType: 'BAN_TYPE' },
      { alias: 'natureTypeCv', codeValType: 'NATURE_TYPE' },
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('soStatusCv').subscribe(data => {
      this.soStatusCvList = data;
    });
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      this.purposeOptionCvList = data;
    });
    this.cvDS.connectAlias('yesnoCv').subscribe(data => {
      this.yesnoCvList = data;
    });
    this.cvDS.connectAlias('yardCv').subscribe(data => {
      this.yardCvList = data;
      // if (this.yardCvList.length > 0) {
      //   this.inGateForm!.get('yard_cv')?.setValue(this.yardCvList[0].code_val);
      // }
    });
    this.cvDS.connectAlias('hazardLevelCv').subscribe(data => {
      this.hazardLevelCvList = data;
    });
    this.cvDS.connectAlias('banTypeCv').subscribe(data => {
      this.banTypeCvList = data;
    });
    this.cvDS.connectAlias('natureTypeCv').subscribe(data => {
      this.natureTypeCvList = data;
    });
  }

  populateInGateForm(sot: StoringOrderTankItem): void {
    this.inGateForm!.patchValue({
      haulier: sot.storing_order?.haulier,
      owner: sot.customer_company,
      owner_guid: sot.owner_guid,
      vehicle_no: this.igDS.getInGateItem(sot.in_gate)?.vehicle_no,
      driver_name: this.igDS.getInGateItem(sot.in_gate)?.driver_name,
      eir_dt: this.igDS.getInGateItem(sot.in_gate)?.eir_dt ? Utility.convertDate(this.igDS.getInGateItem(sot.in_gate)?.eir_dt) : new Date(),
      job_no: sot.job_no,
      remarks: this.igDS.getInGateItem(sot.in_gate)?.remarks,
      last_cargo_guid: sot.last_cargo_guid,
      last_cargo: this.lastCargoControl,
      open_on_gate: sot.tariff_cleaning?.open_on_gate_cv,
      yard_cv: this.igDS.getInGateItem(sot.in_gate)?.yard_cv || 'YARD_1',
      preinspection_cv: this.igDS.getInGateItem(sot.in_gate)?.preinspection_cv,
      lolo_cv: 'BOTH' // default BOTH
    });

    if (sot.tariff_cleaning) {
      this.lastCargoControl.setValue(sot.tariff_cleaning);
      this.cargoDetails = sot.tariff_cleaning;
      this.getSDSPdfName();
    }
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

  getSDSPdfName() {
    if (this.sdsPdf) {
      this.sdsPdfName = this.sdsPdf?.description ? this.cargoDetails?.cargo + ".pdf" : ""
    }
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
  }

  displayDate(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input);
  }

  displayTankPurpose(sot: StoringOrderTankItem) {
    return this.sotDS.displayTankPurpose(sot, this.getPurposeOptionDescription.bind(this));
  }

  getPurposeOptionDescription(codeValType?: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.purposeOptionCvList);
  }

  initializeFilter() {
    this.inGateForm!.get('last_cargo')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        if (value) {
          var searchCriteria = '';
          if (typeof value === 'string') {
            searchCriteria = value;
          } else {
            searchCriteria = value.cargo;
            this.inGateForm!.get('last_cargo_guid')!.setValue(value.guid);
            this.cargoDetails = value;
          }
          this.tcDS.loadItems({ cargo: { contains: searchCriteria } }, { cargo: 'ASC' }).subscribe(data => {
            if (JSON.stringify(data) !== JSON.stringify(this.last_cargoList)) {
              this.last_cargoList = data;
              this.updateValidators(this.last_cargoList);
              this.lastCargoControl.updateValueAndValidity();
            }
          });
        }
      })
    ).subscribe();

    this.inGateForm!.get('owner')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (typeof value === 'string') {
          searchCriteria = value;
        } else {
          searchCriteria = value?.code || '';
          this.inGateForm!.get('owner_guid')!.setValue(value?.guid);
        }
        this.subs.sink = this.ccDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }], type_cv: { in: ["OWNER", "LESSEE"] } }, { code: 'ASC' }).subscribe(data => {
          this.ownerList = data
        });
      })
    ).subscribe();
  }

  onInGateFormSubmit() {
    if (this.inGateForm?.valid) {
      console.log('Valid inGateForm', this.inGateForm?.value);
      this.storingOrderTankItem!.storing_order!.haulier = this.inGateForm.get('haulier')?.value?.toUpperCase();
      this.storingOrderTankItem!.owner_guid = this.inGateForm.get('owner_guid')?.value;
      this.storingOrderTankItem!.job_no = this.inGateForm.get('job_no')?.value;
      this.storingOrderTankItem!.last_cargo_guid = this.inGateForm.get('last_cargo_guid')?.value;
      let so = new StoringOrderGO(this.storingOrderTankItem!.storing_order);
      let sot = new StoringOrderTankGO(this.storingOrderTankItem);
      sot.storing_order = so;
      let ig = new InGateGO({
        guid: this.igDS.getInGateItem(this.storingOrderTankItem?.in_gate)?.guid,
        eir_no: this.igDS.getInGateItem(this.storingOrderTankItem?.in_gate)?.eir_no,
        eir_dt: Utility.convertDate(this.inGateForm.get('eir_dt')?.value) as number,
        so_tank_guid: this.storingOrderTankItem?.guid,
        driver_name: this.inGateForm.get('driver_name')?.value?.toUpperCase(),
        vehicle_no: this.inGateForm.get('vehicle_no')?.value?.toUpperCase(),
        remarks: this.inGateForm.get('remarks')?.value,
        tank: sot,
        yard_cv: this.inGateForm.get('yard_cv')?.value,
        preinspection_cv: 'YES',
        lolo_cv: 'BOTH',
        haulier: this.inGateForm.get('haulier')?.value
      })
      console.log(ig);
      if (ig.guid) {
        this.igDS.updateInGate(ig).subscribe(result => {
          this.handleSaveSuccess(result?.data?.updateInGate);
        });
      } else {
        this.igDS.addInGate(ig).subscribe(result => {
          this.handleSaveSuccess(result?.data?.addInGate);
        });
      }
    } else {
      console.log('Invalid inGateForm', this.inGateForm?.value);
    }
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
  }

  getHazardLevelDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.hazardLevelCvList);
  }

  getBanTypeDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.banTypeCvList);
  }

  getNatureTypeDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.natureTypeCvList);
  }

  getCleaningConditionBadgeClass(status: string | undefined): string {
    return Utility.getCleaningConditionBadgeClass(status);
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.SAVE_SUCCESS;
      ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
      this.router.navigate(['/admin/inventory/in-gate-main'], { queryParams: { tabIndex: 0 } });
    }
  }

  async onDownloadClick() {
    if (this.sdsPdf) {
      const blob = await Utility.urlToBlob(this.sdsPdf.url);
      this.downloadFile(blob, this.sdsPdfName);
    }
  }

  downloadFile(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();

    // Revoke the URL to free memory
    URL.revokeObjectURL(url);
  }

  resetDialog(event: Event) {
    event.preventDefault(); // Prevents the form submission

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    this.resetForm();
    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   data: {
    //     headerText: this.translatedLangText.CONFIRM_CLEAR_ALL,
    //     action: 'new',
    //   },
    //   direction: tempDirection
    // });
    // this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    //   if (result.action === 'confirmed') {
    //     this.resetForm();
    //   }
    // });
  }

  resetForm() {
    this.inGateForm!.patchValue({
      haulier: this.storingOrderTankItem!.storing_order?.haulier,
      vehicle_no: this.igDS.getInGateItem(this.storingOrderTankItem!.in_gate)?.vehicle_no || '',
      driver_name: this.igDS.getInGateItem(this.storingOrderTankItem!.in_gate)?.driver_name || '',
      eir_dt: this.igDS.getInGateItem(this.storingOrderTankItem!.in_gate)?.eir_dt ? Utility.convertDate(this.igDS.getInGateItem(this.storingOrderTankItem!.in_gate)?.eir_dt) : new Date(),
      job_no: this.storingOrderTankItem!.job_no,
      remarks: this.igDS.getInGateItem(this.storingOrderTankItem!.in_gate)?.remarks,
      open_on_gate: this.storingOrderTankItem!.tariff_cleaning?.open_on_gate_cv,
      yard_cv: this.igDS.getInGateItem(this.storingOrderTankItem!.in_gate)?.yard_cv,
      preinspection_cv: 'YES',
      lolo_cv: 'BOTH' // default BOTH
    });

    if (this.storingOrderTankItem!.tariff_cleaning) {
      this.lastCargoControl.setValue(this.storingOrderTankItem!.tariff_cleaning);
    } else {
      this.lastCargoControl.reset(); // Reset the control if there's no tariff_cleaning
    }
  }

  updateValidators(validOptions: any[]) {
    this.lastCargoControl.setValidators([
      Validators.required,
      AutocompleteSelectionValidator(validOptions)
    ]);
  }

  onAlphaOnly(event: Event): void {
    Utility.onAlphaOnly(event, this.inGateForm?.get("driver_name")!);
  }

  onAlphaNumericOnly(event: Event, controlName: string): void {
    Utility.onAlphaNumericOnly(event, this.inGateForm?.get(controlName)!);
  }

  getBackgroundColorFromNature() {
    return Utility.getBackgroundColorFromNature(this.storingOrderTankItem?.tariff_cleaning?.nature_cv?.toUpperCase());
  }

  getNatureInGateAlert() {
    return `${this.storingOrderTankItem?.tariff_cleaning?.nature_cv} - ${this.storingOrderTankItem?.tariff_cleaning?.in_gate_alert}`;
  }
}