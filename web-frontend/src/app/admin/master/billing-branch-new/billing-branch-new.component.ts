import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { Apollo } from 'apollo-angular';
import { BillingBranchesItem, BillingContactPersonItem, BillingCustomerItem } from 'app/data-sources/billingBranches';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { ContactPersonItem, ContactPersonItemAction } from 'app/data-sources/contact-person';
import { CurrencyDS, CurrencyItem } from 'app/data-sources/currency';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { MasterTemplateItem, TepDamageRepairItem } from 'app/data-sources/master-template';
import { RepairPartItem } from 'app/data-sources/repair-part';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TankDS, TankItem } from 'app/data-sources/tank';
import { TariffLabourItem } from 'app/data-sources/tariff-labour';
import { ComponentUtil } from 'app/utilities/component-util';
import { DEFAULT_COUNTRY_CODE, Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { CancelFormDialogComponent } from './dialogs/cancel-form-dialog/cancel-form-dialog.component';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';

@Component({
  selector: 'app-billing-branch-new',
  standalone: true,
  templateUrl: './billing-branch-new.component.html',
  styleUrl: './billing-branch-new.component.scss',
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
    MatProgressSpinnerModule,
    MatRadioModule,
    MatDividerModule,
    MatMenuModule,
    MatCardModule,
  ],
})
export class BillingBranchNewComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  tabIndex = 1;
  displayedColumns = [
    'index',
    'group_name_cv',
    'subgroup_name_cv',
    'damage',
    'repair',
    'description',
    'quantity',
    'actions'
  ];
  pageTitleNew = 'MENUITEMS.MASTER.LIST.BILLING-BRANCH-NEW'
  pageTitleEdit = 'MENUITEMS.MASTER.LIST.BILLING-BRANCH-EDIT'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.MASTER.TEXT', route: '/admin/master/customer', queryParams: { tabIndex: this.tabIndex } },
    { text: 'MENUITEMS.MASTER.LIST.BILLING-BRANCH', route: '/admin/master/customer', queryParams: { tabIndex: this.tabIndex } }
  ]
  translatedLangText: any = {}
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.HEADER',
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    CUSTOMER_DETAILS: 'COMMON-FORM.CUSTOMER-DETAILS',
    ALIAS_NAME: 'COMMON-FORM.ALIAS-NAME',
    SO_NO: 'COMMON-FORM.SO-NO',
    SO_NOTES: 'COMMON-FORM.SO-NOTES',
    HAULIER: 'COMMON-FORM.HAULIER',
    TANK_DETAILS: 'COMMON-FORM.TANK-DETAILS',
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
    SAVE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
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
    ROLLBACK_STATUS: 'COMMON-FORM.ROLLBACK-STATUS',
    CANCELED_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    ARE_YOU_SURE_CANCEL: 'COMMON-FORM.ARE-YOU-SURE-CANCEL',
    ARE_YOU_SURE_ROLLBACK: 'COMMON-FORM.ARE-YOU-SURE-ROLLBACK',
    BULK: 'COMMON-FORM.BULK',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    UNDO: 'COMMON-FORM.UNDO',
    INVALID_SELECTION: 'COMMON-FORM.INVALID-SELECTION',
    EXCEEDED: 'COMMON-FORM.EXCEEDED',
    MUST_MORE_THAN_ZERO: 'COMMON-FORM.MUST-MORE-THAN-ZERO',
    OWNER: 'COMMON-FORM.OWNER',
    EIR_NO: 'COMMON-FORM.EIR-NO',
    EIR_DATE: 'COMMON-FORM.EIR-DATE',
    LAST_TEST: 'COMMON-FORM.LAST-TEST',
    GROUP: 'COMMON-FORM.GROUP',
    SUBGROUP: 'COMMON-FORM.SUBGROUP',
    DAMAGE: 'COMMON-FORM.DAMAGE',
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    QTY: 'COMMON-FORM.QTY',
    HOUR: 'COMMON-FORM.HOUR',
    PRICE: 'COMMON-FORM.PRICE',
    MATERIAL: 'COMMON-FORM.MATERIAL',
    TEMPLATE: 'COMMON-FORM.TEMPLATE',
    PART_DETAILS: 'COMMON-FORM.PART-DETAILS',
    GROUP_NAME: 'COMMON-FORM.GROUP-NAME',
    SUBGROUP_NAME: 'COMMON-FORM.SUBGROUP-NAME',
    LOCATION: 'COMMON-FORM.LOCATION',
    PART_NAME: 'COMMON-FORM.PART-NAME',
    DIMENSION: 'COMMON-FORM.DIMENSION',
    LENGTH: 'COMMON-FORM.LENGTH',
    PREFIX_DESC: 'COMMON-FORM.PREFIX-DESC',
    MATERIAL_COST: 'COMMON-FORM.MATERIAL-COST',
    IQ: 'COMMON-FORM.IQ',
    ESTIMATE_DETAILS: 'COMMON-FORM.ESTIMATE-DETAILS',
    ESTIMATE_SUMMARY: 'COMMON-FORM.ESTIMATE-SUMMARY',
    LABOUR: 'COMMON-FORM.LABOUR',
    TOTAL_COST: 'COMMON-FORM.TOTAL-COST',
    LABOUR_DISCOUNT: 'COMMON-FORM.LABOUR-DISCOUNT',
    MATERIAL_DISCOUNT: 'COMMON-FORM.MATERIAL-DISCOUNT',
    NET_COST: 'COMMON-FORM.NET-COST',
    CONVERTED_TO: 'COMMON-FORM.CONVERTED-TO',
    ESTIMATE_NO: 'COMMON-FORM.ESTIMATE-NO',
    SURVEYOR_NAME: 'COMMON-FORM.SURVEYOR-NAME',
    INTERNAL_QC_BY: 'COMMON-FORM.INTERNAL-QC-BY',
    RATE: "COMMON-FORM.RATE",
    TOTAL: "COMMON-FORM.TOTAL",
    NO_PARTS: "COMMON-FORM.NO-PARTS",
    NO_CONTACT_PERSON: "COMMON-FORM.NO-CONTACT-PERSON",
    PART: 'COMMON-FORM.PART',
    CONTACT_PERSON: "COMMON-FORM.CONTACT-PERSON",
    JOB_TITLE: "COMMON-FORM.JOB-TITLE",
    DEPARTMENT: "COMMON-FORM.DEPARTMENT",
    DID: "COMMON-FORM.DID",
    MOBILE_NO: "COMMON-FORM.MOBILE-NO",
    COUNTRY: "COMMON-FORM.COUNTRY",
    FAX_NO: "COMMON-FORM.FAX-NO",
    EMAIL: "COMMON-FORM.EMAIL",
    CONTACT_NO: "COMMON-FORM.CONTACT-NO",
    WEB: "COMMON-FORM.WEB",
    CONVERSION_CURRENCY: "COMMON-FORM.CONVERSION-CURRENCY",
    PERSON_IN_CHARGE: "COMMON-FORM.PERSON-IN-CHARGE",
    DEFAULT_PROFILE: "COMMON-FORM.DEFAULT-PROFILE",
    COMPANY_NAME: "COMMON-FORM.COMPANY-NAME",
    CUSTOMER_NAME: "COMMON-FORM.CUSTOMER-NAME",
    CUSTOMER_COMPANY: "COMMON-FORM.CUSTOMER-COMPANY",
    CUSTOMER_TYPE: "COMMON-FORM.CUSTOMER-TYPE",
    ADDRESS_LINE1: "COMMON-FORM.ADDRESS-LINE1",
    ADDRESS_LINE2: "COMMON-FORM.ADDRESS-LINE2",
    POSTAL_CODE: "COMMON-FORM.POSTAL-CODE",
    CITY_NAME: "COMMON-FORM.CITY-NAME",
    CONTACT_PERSON_DETAILS: "COMMON-FORM.CONTACT-PERSON-DETAILS",
    BILLING_BRANCH: "COMMON-FORM.BILLING-BRANCH",
    SALUTATION: "COMMON-FORM.SALUTATION",
    NAME: "COMMON-FORM.NAME",
    INVALID_FORMAT: "COMMON-FORM.INVALID-FORMAT",
    ADD: "COMMON-FORM.ADD",
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    BRANCH_CODE: "COMMON-FORM.BRANCH-CODE",
    BRANCH_NAME: "COMMON-FORM.BRANCH-NAME",
    BILLING_BRANCH_DETAILS: "COMMON-FORM.BILLING-BRANCH-DETAILS",
    SAME: "COMMON-FORM.SAME",
    MIN_3_ALPHA: 'COMMON-FORM.MIN-3-ALPHA',
    ONLY_ALPHA_NUMERIC: 'COMMON-FORM.ONLY-ALPHA-NUMERIC',
    S_N: 'COMMON-FORM.S_N'
  }

  clean_statusList: CodeValuesItem[] = [];

  branch_guid?: string | null;
  isFromBranch?: boolean = true;

  ccForm?: UntypedFormGroup;
  sotForm?: UntypedFormGroup;

  customer_code_changed: boolean = false;

  selectedTempEst?: MasterTemplateItem;
  sotItem?: StoringOrderTankItem;
  storingOrderItem: StoringOrderItem = new StoringOrderItem();
  repList = new MatTableDataSource<ContactPersonItemAction>();
  sotSelection = new SelectionModel<RepairPartItem>(true, []);
  customer_companyList?: CustomerCompanyItem[];
  groupNameCvList: CodeValuesItem[] = [];
  allSubGroupNameCvList: CodeValuesItem[] = [];
  subgroupNameCvList: CodeValuesItem[] = [];
  yesnoCvList: CodeValuesItem[] = [];
  soTankStatusCvList: CodeValuesItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  testTypeCvList: CodeValuesItem[] = [];
  testClassCvList: CodeValuesItem[] = [];
  partLocationCvList: CodeValuesItem[] = [];
  damageCodeCvList: CodeValuesItem[] = [];
  repairCodeCvList: CodeValuesItem[] = [];
  satulationCvList: CodeValuesItem[] = [];

  tankItemList?: TankItem[] = [];
  customerTypeControl = new UntypedFormControl();
  customerCodeControl = new UntypedFormControl();

  cvDS: CodeValuesDS;
  ccDS: CustomerCompanyDS;
  tDS: TankDS;
  curDS: CurrencyDS;

  trLabourItems: TariffLabourItem[] = [];
  historyState: any = {};
  billingBranchesControl = new UntypedFormControl();
  profileControl = new UntypedFormControl();
  customerTypeCvList: CodeValuesItem[] = [];
  currencyList?: CurrencyItem[] = [];
  selectedBillingBranch: any;
  phone_regex: any = /([0-9]{7,10})$/; // 7–10 digits
  countryCodes: any = [];
  countryCodesFiltered: any = [];

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
    this.initCCForm();
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.tDS = new TankDS(this.apollo);
    this.curDS = new CurrencyDS(this.apollo);

    this.countryCodes = Utility.getCountryCodes();
    this.countryCodesFiltered = this.countryCodes;
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.initializeValueChange();
    this.loadData();
  }

  calculateCostSummary() {
    // var totalMaterialCost: number = 0;
    // var totalLabourHours: number = 0;
    // this.repList.data.forEach(data => {
    //   totalMaterialCost += (data.tariff_repair?.material_cost ?? 0) * (data.quantity ?? 0);
    //   totalLabourHours += (data.hour ?? 0);
    // });
    // this.ccForm?.patchValue({
    //   total_material_cost: Number(totalMaterialCost).toFixed(2),
    //   labour_hour: totalLabourHours
    // });

    //const totalCost= this.repList.data.reduce((total,part)=>total+(part.material_cost??0));
  }

  initializeValueChange() {
    this.ccForm?.get('country_code')?.valueChanges.subscribe(value => {
      if (typeof value === 'string') {
        this.countryCodesFiltered = this.countryCodes.filter((country: any) =>
          country.code.toLowerCase().includes(value.toLowerCase()) || country.country.toLowerCase().includes(value.toLowerCase()) || country.iso.toLowerCase().includes(value.toLowerCase())
        );
      } else if (value && typeof value === 'object') {
        this.countryCodesFiltered = this.countryCodes.filter((country: any) =>
          country?.code?.toLowerCase().includes(value?.code?.toLowerCase())
        );
        console.log(value)
        this.ccForm?.get('country')?.setValue(value?.country);
      } else {
        this.countryCodesFiltered = this.countryCodes;
      }
    });
  }

  initCCForm() {
    this.ccForm = this.fb.group({
      guid: [''],
      // customer_company_guid: [''],
      customer_code: this.customerCodeControl,
      branch_code: ['', [
        Validators.required,
        Validators.minLength(3), // Minimum 3 characters
        Validators.maxLength(6), // Maximum 6 characters
        Validators.pattern('^[A-Za-z]+$') // Only alphabets
      ]],
      branch_name: [''],
      country_code: [DEFAULT_COUNTRY_CODE],
      phone: ['', [Validators.required, Validators.pattern(this.phone_regex)]], // Adjust regex for your format,
      email: ['', [Validators.required, Validators.email]],
      web: [''],
      currency: [''],
      default_profile: [''],
      address1: [''],
      address2: [''],
      postal_code: [''],
      city_name: [''],
      country: ['Singapore'],
      remarks: [''],
      repList: ['']
    });
  }

  patchData(currentBillingBranch: CustomerCompanyItem) {
    if (currentBillingBranch) {
      const patchCountryCodeValue = Utility.getCountryCodeObject(currentBillingBranch.country_code, this.countryCodes);
      this.ccForm?.patchValue({
        guid: currentBillingBranch.guid,
        branch_code: currentBillingBranch.code,
        branch_name: currentBillingBranch.name,
        country_code: patchCountryCodeValue,
        phone: currentBillingBranch.phone,
        email: currentBillingBranch.email,
        web: currentBillingBranch.email,
        currency: this.getCurrency(currentBillingBranch?.currency?.guid!),
        default_profile: this.getDefaultTank(currentBillingBranch.def_tank_guid!),
        address1: currentBillingBranch.address_line1,
        address2: currentBillingBranch.address_line2,
        postal_code: currentBillingBranch.postal,
        city_name: currentBillingBranch.city,
        country: currentBillingBranch.country,
        remarks: currentBillingBranch.remarks,
      });

      this.customerCodeControl.setValue(this.getCustomerCompanyItem(currentBillingBranch.main_customer_guid!))

      var existContact = currentBillingBranch?.cc_contact_person!.map((row) => ({
        ...row,
        action: ''
      }));
      this.updateData(existContact!);
    }
  }

  public loadData() {
    this.initializeFilterCustomerCompany();
    this.historyState = history.state;

    if (this.historyState.customerCompany) {
      this.isFromBranch = false;
    } else if (this.historyState) {
      this.selectedBillingBranch = this.historyState.selectedRow;
      this.patchData(this.selectedBillingBranch);
    }

    this.curDS.search({}, { sequence: 'ASC' }, 100).subscribe(data => {
      this.currencyList = data;
      if (this.selectedBillingBranch) {
        this.ccForm?.patchValue({
          currency: this.getCurrency(this.selectedBillingBranch?.currency?.guid!),
        })
      }
    });

    this.branch_guid = this.route.snapshot.paramMap.get('id');
    if (this.branch_guid?.trim() == '') {
      this.branch_guid = undefined;
    }

    this.subs.sink = this.ccDS.loadItems({}, { code: 'ASC' }, 20).subscribe(data => {
      this.customer_companyList = data
      if (data.length) {
        if (!this.isFromBranch) // data from Customer company
        {
          let selectedCustomer = this.historyState.customerCompany.customerCompanyData;
          if (selectedCustomer.guid) {
            var selectedCustomers = data.filter(customer => customer.guid == selectedCustomer.guid);
            if (selectedCustomers.length)
              selectedCustomer = selectedCustomers[0];
            else
              this.customer_companyList.unshift(selectedCustomer);
          }
          else {
            this.customer_companyList.unshift(selectedCustomer);
          }
          this.ccForm?.patchValue({
            customer_code: selectedCustomer
          });
          this.customerCodeControl?.disable();
        }
        else if (this.selectedBillingBranch) // data from billing branch
        {
          var selectedCustomers = data.filter(customer => customer.guid == this.selectedBillingBranch.main_customer_guid);
          if (selectedCustomers.length) {
            this.ccForm?.patchValue({
              customer_code: selectedCustomers[0]
            });
          }
        }
      }
    });

    this.tDS.search({}, { unit_type: 'ASC' }).subscribe(data => {
      this.tankItemList = data;
      if (this.selectedBillingBranch) {
        this.ccForm?.patchValue({
          default_profile: this.getDefaultTank(this.selectedBillingBranch?.def_tank_guid!),
        })
      }
    })

    const queries = [
      { alias: 'customerTypeCv', codeValType: 'CUSTOMER_TYPE' },
      { alias: 'satulationCv', codeValType: 'PERSON_TITLE' },
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('customerTypeCv').subscribe(data => {
      this.customerTypeCvList = data;
    });
    this.cvDS.connectAlias('satulationCv').subscribe(data => {
      this.satulationCvList = data;
    });
  }


  GetRepairOrDamage(repairDamageList: TepDamageRepairItem[], codeType: Number): any[] {
    var retval: any[] = [];
    var result = repairDamageList.filter((item) => item.code_type == codeType)
    retval = result?.filter((item: Partial<TepDamageRepairItem> | undefined): item is Partial<TepDamageRepairItem> => item !== undefined)
      .map((item: Partial<TepDamageRepairItem>) => {
        return {
          guid: item.guid,
          rep_guid: item.tep_guid,
          code_cv: item.code_cv,
          create_dt: item.create_dt,
          code_type: item.code_type,
          create_by: item.create_by,
          update_dt: item.update_dt,
          update_by: item.update_by,
          delete_dt: item.delete_dt,
        } as RepairPartItem;
      }) ?? [];
    return retval.sort((a, b) => (a.code_cv ?? 0) - (b.code_cv ?? 0));
  }

  populateSOT(rep: any[]) {
    if (rep?.length) {
      this.updateData(rep);
    }
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} - ${cc.name}` : '';
  }

  displayCountryCodeFn(cc: any): string {
    return cc && cc.country ? `${cc.iso?.toUpperCase()} ${cc.code}` : '';
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

  addContactPerson(event: Event, row?: ContactPersonItem) {
    this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const cntPerson = row ?? new ContactPersonItem();

    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '1000px',
      data: {
        item: row ? row : cntPerson,
        action: 'new',
        translatedLangText: this.translatedLangText,
        populateData: {
          satulationCvList: this.satulationCvList
        },
        index: -1,
        customer_company_guid: '' //this.sotItem?.storing_order?.customer_company_guid
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data: any = [...this.repList.data];
        const newItem = new ContactPersonItemAction({
          ...result.item,
          action: "NEW"
        });
        data.unshift(newItem);
        this.updateData(data);

        //this.calculateCostSummary();
      }
    });
  }


  editContactPerson(event: Event, row: ContactPersonItem, index: number) {
    this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '1000px',
      data: {
        item: row,
        action: 'edit',
        translatedLangText: this.translatedLangText,
        populateData: {
          satulationCvList: this.satulationCvList
        },
        index: index,
        customer_company_guid: this.sotItem?.storing_order?.customer_company_guid
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data: any[] = [...this.repList.data];
        const updatedItem = new ContactPersonItemAction({
          ...result.item,
          action: "EDIT"
        });
        if (result.index >= 0) {
          data[result.index] = updatedItem;
          this.updateData(data);
        } else {
          this.updateData([...this.repList.data, result.item]);
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
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        headerText: this.translatedLangText.CONFIRM_DELETE,
        action: 'new',
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const data = [...this.repList.data];
        data.splice(index, 1);
        this.updateData(data); // Refresh the data source
        // }
        //this.calculateCostSummary();
      }
    });
  }

  cancelSelectedRows(row: RepairPartItem[]) {
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
        const data: any[] = [...this.repList.data];
        result.item.forEach((newItem: RepairPartItem) => {
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

  rollbackSelectedRows(row: RepairPartItem[]) {
    //this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(CancelFormDialogComponent, {
      data: {
        action: "rollback",
        item: [...row],
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const data: any[] = [...this.repList.data];
        result.item.forEach((newItem: RepairPartItem) => {
          const index = data.findIndex((existingItem: any) => existingItem.guid === newItem.guid);

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

  undoTempAction(row: RepairPartItem[], actionToBeRemove: string) {
    const data: any[] = [...this.repList.data];
    row.forEach((newItem: RepairPartItem) => {
      const index = data.findIndex((existingItem: any) => existingItem.guid === newItem.guid);

      if (index !== -1) {
        data[index] = {
          ...data[index],
          ...newItem,
          actions: Array.isArray(data[index].actions!)
            ? data[index].actions!.filter((action: any) => action !== actionToBeRemove)
            : []
        };
      }
    });
    this.updateData(data);
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

  onBillingBranchSubmit() {
    this.ccForm!.get('repList')?.setErrors(null);
    this.findInvalidControls();
    if (this.ccForm?.valid) {
      if (!this.repList.data.length) {
        this.ccForm.get('repList')?.setErrors({ required: true });
      } else {
        var customerCode = this.ccForm?.get("branch_code")?.value?.toUpperCase();
        var mainCustomer = this.customerCodeControl?.value as CustomerCompanyItem;
        if (customerCode == mainCustomer?.code) {
          this.ccForm.get('branch_code')?.setErrors({ duplicated: true });
          return;
        }

        const where: any = {};
        where.code = { eq: customerCode };
        this.ccDS.search(where).subscribe(result => {
          if (result.length == 0 && this.branch_guid == undefined) {
            if (this.customerCodeControl?.value) {
              let mainCust = this.customerCodeControl?.value as CustomerCompanyItem;
              if (mainCust.guid) {
                this.UpdateCustomerBillingBranches();
              }
              else {
                this.insertNewBillingBranch();
              }
            }
            else {
              this.insertNewBillingBranch();
            }
          }
          else if (result.length > 0 && this.branch_guid == undefined) {
            this.ccForm?.get('branch_code')?.setErrors({ existed: true });
          }
          else if (result.length > 0 && this.branch_guid != undefined) {
            if (this.customerCodeControl?.value) {
              this.UpdateCustomerBillingBranches();
            }
            else {
              this.UpdateBillingBranches();
            }
          }
        });
      }
    } else {
      console.log('Invalid soForm', this.ccForm?.value);
    }
  }

  UpdateBillingBranches() {
    var selectedBillingBranch: CustomerCompanyItem = new CustomerCompanyItem(this.selectedBillingBranch);
    var cust: CustomerCompanyItem = new CustomerCompanyItem(selectedBillingBranch);

    cust.address_line1 = this.ccForm?.get("address1")?.value;
    cust.address_line2 = this.ccForm?.get("address2")?.value;
    cust.code = this.ccForm?.get("branch_code")?.value?.toUpperCase();
    cust.name = this.ccForm?.get("branch_name")?.value;
    cust.city = this.ccForm?.get("city_name")?.value;
    cust.country = this.ccForm?.get("country")?.value;
    cust.currency = this.ccForm?.get("currency")?.value;
    cust.email = this.ccForm?.get("email")?.value;
    cust.remarks = this.ccForm?.get("remarks")?.value;
    cust.website = this.ccForm?.get("web")?.value;
    cust.type_cv = "BRANCH";
    cust.phone = this.ccForm?.get("phone")?.value;
    cust.postal = this.ccForm?.get("postal_code")?.value;
    cust.main_customer_guid = '';
    if (this.ccForm?.get("default_profile")?.value) {
      let defTank = this.ccForm?.get("default_profile")?.value as TankItem;
      cust.def_tank_guid = defTank.guid;
    }
    if (this.ccForm?.get("currency")?.value) {
      cust.currency_guid = cust.currency?.guid;
    }

    var existContactPerson = selectedBillingBranch?.cc_contact_person?.map((row) => ({
      ...row,
      title_cv: row.title_cv,
      action: 'CANCEL'
    }));

    var updContactPerson = this.repList.data.map((row) => ({
      ...row,
      title_cv: row.title_cv

    }));

    updContactPerson.forEach(data => {

      var matchContact = existContactPerson?.filter(d => d.guid === data.guid);
      let Cnt: any = new ContactPersonItem();

      if (matchContact?.length! > 0) {
        Cnt = matchContact![0];
        Cnt.action = data.action;

      }
      else {

        Cnt.action = "NEW";

      }
      Cnt.did = data.did;
      Cnt.email = data.email;
      Cnt.job_title = data.job_title;
      Cnt.name = data.name;
      Cnt.phone = data.phone;
      Cnt.title_cv = data.title_cv;
      Cnt.department = data.department;

      if (Cnt.action === "NEW") {
        existContactPerson?.push(Cnt);
      }


    });

    delete cust.update_by;
    delete cust.update_dt;
    delete cust.create_by;
    delete cust.create_dt;
    delete cust.delete_dt;
    delete cust.cc_contact_person;
    delete cust.currency;

    var existContactPersons = existContactPerson?.map((node: any) => new ContactPersonItemAction(node));
    this.ccDS.UpdateCustomerCompany(cust, existContactPersons, undefined).subscribe(result => {
      var count = result.data.updateCustomerCompany;
      if (count > 0) {
        this.handleSaveSuccess(count);
      }
    });
  }

  UpdateCustomerBillingBranches() {
    const mainCustomer: CustomerCompanyItem = new CustomerCompanyItem(this.customerCodeControl?.value!);
    if (mainCustomer.guid) {
      delete mainCustomer.update_by;
      delete mainCustomer.update_dt;
      delete mainCustomer.create_by;
      delete mainCustomer.create_dt;
      delete mainCustomer.delete_dt;
      delete mainCustomer.cc_contact_person;
      delete mainCustomer.currency;
      var cust: CustomerCompanyItem = new CustomerCompanyItem();
      if (this.selectedBillingBranch) {
        cust = new CustomerCompanyItem(this.selectedBillingBranch);
      }
      cust.address_line1 = this.ccForm?.get("address1")?.value;
      cust.address_line2 = this.ccForm?.get("address2")?.value;
      cust.code = this.ccForm?.get("branch_code")?.value?.toUpperCase();
      cust.name = this.ccForm?.get("branch_name")?.value;
      cust.city = this.ccForm?.get("city_name")?.value;
      cust.country = this.ccForm?.get("country")?.value;
      cust.currency = this.ccForm?.get("currency")?.value;
      cust.email = this.ccForm?.get("email")?.value;
      cust.remarks = this.ccForm?.get("remarks")?.value;
      cust.website = this.ccForm?.get("web")?.value;
      cust.type_cv = "BRANCH";
      cust.phone = this.ccForm?.get("phone")?.value;
      cust.postal = this.ccForm?.get("postal_code")?.value;
      cust.country_code = this.ccForm?.get("country_code")?.value?.code;
      if (this.ccForm?.get("default_profile")?.value) {
        let defTank = this.ccForm?.get("default_profile")?.value as TankItem;
        cust.def_tank_guid = defTank.guid;
      }
      if (this.ccForm?.get("currency")?.value) {
        cust.currency_guid = cust.currency?.guid;
      }

      delete cust.currency;

      var selectedBillingBranch: CustomerCompanyItem = new CustomerCompanyItem(this.selectedBillingBranch);
      var existContactPerson = selectedBillingBranch?.cc_contact_person?.map((row) => ({
        ...row,
        title_cv: row.title_cv,
        action: 'CANCEL'
      }));

      if (!existContactPerson) existContactPerson = [];
      var updContactPerson = this.repList.data.map((row) => ({
        ...row,
        title_cv: row.title_cv

      }));

      updContactPerson.forEach(data => {
        var matchContact = existContactPerson?.filter(d => d.guid === data.guid);
        let Cnt: any = new ContactPersonItem();
        if (matchContact?.length! > 0) {
          Cnt = matchContact![0];
          Cnt.action = data.action;
        }
        else {
          Cnt.action = "NEW";
        }
        Cnt.did = data.did;
        Cnt.email = data.email;
        Cnt.job_title = data.job_title;
        Cnt.name = data.name;
        Cnt.phone = data.phone;
        Cnt.title_cv = data.title_cv;
        Cnt.department = data.department;
        if (Cnt.action === "NEW") {
          existContactPerson?.push(Cnt);
        }
      });

      var billingBranches: BillingBranchesItem[] = [];
      var exist_billing_branch: BillingBranchesItem = new BillingBranchesItem();
      let customerCmp = this.getBillingBranches(mainCustomer.guid!);
      if (customerCmp) {
        exist_billing_branch.branchCustomer = new BillingCustomerItem(customerCmp);
        exist_billing_branch.branchCustomer!.action = "EDIT";
        exist_billing_branch.branchCustomer!.main_customer_guid = "";

        delete exist_billing_branch.branchCustomer.update_by;
        delete exist_billing_branch.branchCustomer.update_dt;
        delete exist_billing_branch.branchCustomer.create_by;
        delete exist_billing_branch.branchCustomer.create_dt;
        delete exist_billing_branch.branchCustomer.delete_dt;
        delete exist_billing_branch.branchCustomer.cc_contact_person;
        delete exist_billing_branch.branchCustomer.currency;

        billingBranches.push(exist_billing_branch);
      }

      var new_billing_branch: BillingBranchesItem = new BillingBranchesItem();
      new_billing_branch.branchCustomer = new BillingCustomerItem(cust);
      new_billing_branch.branchCustomer.main_customer_guid = mainCustomer.guid;
      if (this.selectedBillingBranch) { new_billing_branch.branchCustomer.action = "EDIT"; }
      else { new_billing_branch.branchCustomer.action = "NEW"; }

      new_billing_branch.branchContactPerson = [];
      existContactPerson?.forEach(p => {
        let person = new BillingContactPersonItem(p);
        person.action = p.action;

        new_billing_branch.branchContactPerson?.push(person);
      });

      delete new_billing_branch.branchCustomer.update_by;
      delete new_billing_branch.branchCustomer.update_dt;
      delete new_billing_branch.branchCustomer.create_by;
      delete new_billing_branch.branchCustomer.create_dt;
      delete new_billing_branch.branchCustomer.delete_dt;
      delete new_billing_branch.branchCustomer.cc_contact_person;
      delete new_billing_branch.branchCustomer.currency;

      billingBranches.push(new_billing_branch);
      this.ccDS.UpdateCustomerCompany(mainCustomer, undefined, billingBranches).subscribe(result => {
        var count = result.data.updateCustomerCompany;
        if (count > 0) {
          if (this.historyState.customerCompany) {
            this.historyState.customerCompany.newBillingBranchCode = cust.code;
          }
          this.handleSaveSuccess(count);
        }
      });
    }
    else {
      this.customerCodeControl?.setErrors({ required: true });
    }
  }

  insertNewBillingBranch() {
    var cust: CustomerCompanyItem = new CustomerCompanyItem();
    cust.address_line1 = this.ccForm?.get("address1")?.value;
    cust.address_line2 = this.ccForm?.get("address2")?.value;
    cust.code = this.ccForm?.get("branch_code")?.value?.toUpperCase();
    cust.name = this.ccForm?.get("branch_name")?.value;
    cust.city = this.ccForm?.get("city_name")?.value;
    cust.country = this.ccForm?.get("country")?.value;
    cust.currency = this.ccForm?.get("currency")?.value;
    cust.email = this.ccForm?.get("email")?.value;
    cust.remarks = this.ccForm?.get("remarks")?.value;
    cust.website = this.ccForm?.get("web")?.value;
    cust.type_cv = "BRANCH";
    cust.phone = this.ccForm?.get("phone")?.value;
    cust.country_code = this.ccForm?.get("country_code")?.value?.code;
    cust.postal = this.ccForm?.get("postal_code")?.value;

    const mainCustomer: CustomerCompanyItem = this.customerCodeControl?.value!;
    if (mainCustomer) {
      cust.main_customer_guid = mainCustomer.guid;
    }

    if (this.ccForm?.get("default_profile")?.value) {
      let defTank = this.ccForm?.get("default_profile")?.value as TankItem;
      cust.def_tank_guid = defTank.guid;
    }
    if (this.ccForm?.get("currency")?.value) {
      cust.currency_guid = cust.currency?.guid;
    }

    delete cust.currency;

    var contactPerson = this.repList.data.map((row) => ({
      ...row,
      title_cv: row.title_cv,
      action: 'NEW'
    }));
    this.ccDS.AddCustomerCompany(cust, contactPerson, undefined).subscribe(result => {
      var count = result.data.addCustomerCompany;
      if (count > 0) {
        if (this.historyState.customerCompany) {
          this.historyState.customerCompany.newBillingBranchCode = cust.code;
        }
        this.handleSaveSuccess(count);
      }
    });
  }

  updateData(newData: any[]): void {
    this.repList.data = [...newData];
    this.sotSelection.clear();
    this.ccForm?.get('repList')?.setErrors(null);
  }

  handleDelete(event: Event, row: any, index: number): void {
    event.preventDefault(); // Prevents the form submission
    event.stopPropagation();
    this.deleteItem(row, index);
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.langText.SAVE_SUCCESS;
      this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
        successMsg = res;
        ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
        if (!this.isFromBranch) {
          this.router.navigate(['/admin/master/customer/new/ '], {
            state: this.historyState,
            queryParams: { tabIndex: this.tabIndex }
          });
        }
        else {
          // Navigate to the route and pass the JSON object
          this.router.navigate(['/admin/master/customer'], {
            state: this.historyState,
            queryParams: { tabIndex: this.tabIndex }
          });
        }
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

  getGroupNameDescription(code_val: string): string | undefined {
    return this.cvDS.getCodeDescription(code_val, this.groupNameCvList);
  }
  getSubGroupNameDescription(code_val: string): string | undefined {
    return this.cvDS.getCodeDescription(code_val, this.allSubGroupNameCvList);
  }
  getYesNoDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.yesnoCvList);
  }

  getSoStatusDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.soTankStatusCvList);
  }

  displayDateTime(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateTimeStr(input);
  }

  displayDate(input: Date): string {
    return Utility.convertDateToStr(input);
  }

  GoBackPrevious(event: Event) {
    event.stopPropagation(); // Stop the click event from propagating
    // Navigate to the route and pass the JSON object
    if (this.isFromBranch) {
      this.router.navigate(['/admin/master/customer'], {
        state: this.historyState,
        queryParams: { tabIndex: this.tabIndex }
      });
    }
    else {
      this.router.navigate(['/admin/master/customer/new/ '], {
        state: this.historyState,
        queryParams: { tabIndex: this.tabIndex }
      });
    }
  }

  GetEstimationPrice(row: any): string {
    var retval: string = "0.00";

    retval = Number(Number(row.tariff_repair.material_cost || 0) * Number(row.quantity || 0)).toFixed(2);
    return retval;
  }


  resetDialog(event: Event) {
    event.preventDefault(); // Prevents the form submission

    this.resetForm();
  }

  resetForm() {
    this.initCCForm();
  }

  getCurrency(guid: string): CurrencyItem | undefined {
    if (this.currencyList?.length! > 0 && guid) {
      const curItm = this.currencyList?.filter((x: any) => x.guid === guid).map(item => {
        return item;
      });
      if (curItm?.length! > 0)
        return curItm![0];
      else
        return undefined;
    }
    return undefined;

  }

  getCustomerCompanyItem(guid: string): CustomerCompanyItem | undefined {
    if (this.customer_companyList?.length) {
      const custCmp = this.customer_companyList?.filter((x: any) => x.guid === guid).map(item => {
        return item;
      });
      if (custCmp?.length! > 0)
        return custCmp[0];
      else
        return undefined;
    }
    return undefined;
  }

  getBillingBranches(guid: string): CustomerCompanyItem | undefined {
    if (this.customer_companyList?.length) {
      const custCmp = this.customer_companyList?.filter((x: any) => x.main_customer_guid === guid).map(item => {
        return item;
      });
      if (custCmp?.length! > 0)
        return custCmp[0];
      else
        return undefined;
    }
    return undefined;
  }

  initializeFilterCustomerCompany() {
    this.customerCodeControl!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        if (!value) return;
        var searchCriteria = '';
        if (value && typeof value === 'object') {
          searchCriteria = value.code;
        } else {
          searchCriteria = value || '';
        }
        this.subs.sink = this.ccDS.loadItems(
          {
            and: [
              {
                or: [
                  { main_customer_guid: { eq: '' } },
                  { main_customer_guid: { eq: null } }
                ]
              },
              {
                or: [
                  { name: { contains: searchCriteria } },
                  { code: { contains: searchCriteria } }
                ]
              }
            ]
          },
          { code: 'ASC' }).subscribe(data => {
            this.customer_companyList = data
            this.updateValidators(this.customer_companyList)
          });
      })
    ).subscribe();
  }

  getDefaultTank(guid: string): TankItem | undefined {
    if (this.tankItemList?.length! > 0) {
      const tnkItm = this.tankItemList?.filter((x: any) => x.guid === guid).map(item => {
        return item;
      });
      if (tnkItm?.length! > 0)
        return tnkItm![0];
      else
        return undefined;
    }
    return undefined;
  }

  onAlphaOnly(event: Event): void {
    Utility.onAlphaOnly(event, this.ccForm?.get("branch_code")!);
  }

  onNumericOnly(event: Event): void {
    Utility.onNumericOnly(event, this.ccForm?.get("phone")!);
  }

  findInvalidControls() {
    const controls = this.ccForm?.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name);
      } else {
        console.log(name, controls[name]);
      }
    }
  }

  updateValidators(validOptions: any[]) {
    this.customerCodeControl?.setValidators([
      Validators.required,
      AutocompleteSelectionValidator(validOptions)
    ]);
  }
}