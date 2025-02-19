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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
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
import { AdvanceTable } from 'app/advance-table/advance-table.model';
import { BillingBranchesItem, BillingContactPersonItem, BillingCustomerItem } from 'app/data-sources/billingBranches';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { ContactPersonItem, ContactPersonItemAction } from 'app/data-sources/contact-person';
import { CurrencyDS, CurrencyItem } from 'app/data-sources/currency';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { MasterTemplateItem, TemplateEstPartItem, TepDamageRepairItem } from 'app/data-sources/master-template';
import { RepairPartItem } from 'app/data-sources/repair-part';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TankDS, TankItem } from 'app/data-sources/tank';
import { TariffLabourItem } from 'app/data-sources/tariff-labour';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { CancelFormDialogComponent } from './dialogs/cancel-form-dialog/cancel-form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';

@Component({
  selector: 'app-group-new',
  standalone: true,
  templateUrl: './group-new.component.html',
  styleUrl: './group-new.component.scss',
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
    MatRadioModule,
    MatDividerModule,
    MatMenuModule,
    MatCardModule,
  ]
})
export class GroupNewComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'index',
    'group_name_cv',
    'subgroup_name_cv',
    'damage',
    'repair',
    'description',
    'quantity',
    // 'hour',
    // 'price',
    // 'material',
    'actions'
  ];
  pageTitleNew = 'MENUITEMS.MANAGEMENT.LIST.GROUP-NEW'
  pageTitleEdit = 'MENUITEMS.MANAGEMENT.LIST.GROUP-EDIT'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT',
    'MENUITEMS.MANAGEMENT.TEXT'
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
    PHONE: "COMMON-FORM.PHONE",
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
    GROUP_DETAILS: 'COMMON-FORM.GROUP-DETAILS'

  }

  clean_statusList: CodeValuesItem[] = [];

  customer_guid?: string | null;

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


  // soDS: StoringOrderDS;
  // sotDS: StoringOrderTankDS;
  cvDS: CodeValuesDS;
  ccDS: CustomerCompanyDS;
  tDS: TankDS;
  curDS: CurrencyDS;
  // igDS: InGateDS;
  // trLabourDS: TariffLabourDS;
  // estTempDS: MasterEstimateTemplateDS

  trLabourItems: TariffLabourItem[] = [];
  historyState: any = {};
  billingBranchesControl = new UntypedFormControl();
  profileControl = new UntypedFormControl();
  customerTypeCvList: CodeValuesItem[] = [];
  selectedCustomerCmp?: CustomerCompanyItem;
  billingBranch?: CustomerCompanyItem[] = [];
  currencyList?: CurrencyItem[] = [];
  phone_regex: any = /^\+?[1-9]\d{0,2}(-\d{3}-\d{3}-\d{4}|\d{7,10})$/;
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
    // this.soDS = new StoringOrderDS(this.apollo);
    // this.sotDS = new StoringOrderTankDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.tDS = new TankDS(this.apollo);
    this.curDS = new CurrencyDS(this.apollo);
    // this.igDS = new InGateDS(this.apollo);
    // this.trLabourDS = new TariffLabourDS(this.apollo);
    // this.estTempDS = new MasterEstimateTemplateDS(this.apollo);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.initializeFilter();
    this.initializeValueChange();
    this.loadData();
    this.SetCostDecimal();

  }

  SetCostDecimal() {
    this.ccForm?.get('material_discount_amount')?.valueChanges.subscribe(value => {
      if (value !== null && value !== '') {
        // Ensure the value has two decimal places
        const formattedValue = parseFloat(value).toFixed(2);
        this.ccForm?.get('material_discount_amount')?.setValue(formattedValue, { emitEvent: false });
        // this.ccForm.get('material_discount_amount').setValue(formattedValue, { emitEvent: false });
      }

    });
  }
  calculateCostSummary() {

  }

  GetNetCost(): string {
    var val: number = 0;

    val = Number(this.ccForm?.get("total_cost")?.value) - Number(this.ccForm?.get("labour_discount_amount")?.value) - Number(this.ccForm?.get("material_discount_amount")?.value)
    return val.toFixed(2);
  }

  initializeValueChange() {


  }

  initCCForm() {
    this.ccForm = this.fb.group({
      guid: [''],
      customer_company_guid: [''],
      customer_code: [''],
      customer_name: [''],
      customer_type: [''],
      billing_branches: [''],
      phone: ['', [Validators.required,
      Validators.pattern(this.phone_regex)]], // Adjust regex for your format,
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
      repList: []
    });
  }

  initializeFilter() {
  }

  SortRepairEstPart(items: TemplateEstPartItem[]): TemplateEstPartItem[] {
    var retval: TemplateEstPartItem[] = items.sort((a, b) => b.create_dt! - a.create_dt!);

    return retval;
  }

  PatchCustomerCompanyData() {
    if (this.historyState.customerCompany.customerCompanyData) {

      var cust: CustomerCompanyItem = this.historyState.customerCompany.customerCompanyData;
      var contactPsn: ContactPersonItem[] = this.historyState.customerCompany.contactPerson;
      this.ccForm?.patchValue({

        address1: cust.address_line1,
        address2: cust.address_line2,
        customer_code: cust.code,
        customer_name: cust.name,
        city_name: cust.city,
        billing_branches: this.getBillingBranches(cust.guid!),
        country: cust.country,
        email: cust.email,
        remarks: cust.remarks,
        web: cust.website,
        phone: cust.phone,
        postal_code: cust.postal,
        default_profile: this.getDefaultTank(cust.def_tank_guid!),
        customer_type: this.getCustomerTypeCvObject(cust.type_cv!)

      });
      var existContact = contactPsn?.map((row) => ({
        ...row
      }));
      this.customer_guid = cust.guid;
      this.updateData(existContact!);
      this.refreshBillingBranches();
    }

  }
  PatchSelectedRowValue() {
    this.historyState = history.state;

    if (this.historyState.selectedRow != null) {

      this.selectedCustomerCmp = this.historyState.selectedRow;

      // if(this.customer_companyList)
      //   {
      //     this.customer_companyList = this.customer_companyList.filter(data=>data.guid!==this.selectedCustomerCmp?.guid);
      //   }

      if (this.historyState.customerCompany) {
        this.PatchCustomerCompanyData();
      }
      else {
        const contactPerson = this.selectedCustomerCmp?.cc_contact_person?.filter(value => value.delete_dt == null);
        this.selectedCustomerCmp!.cc_contact_person = contactPerson;
        this.ccForm?.patchValue({
          guid: this.selectedCustomerCmp?.guid,
          customer_code: this.selectedCustomerCmp?.code,
          customer_name: this.selectedCustomerCmp?.name,
          customer_type: this.getCustomerTypeCvObject(this.selectedCustomerCmp?.type_cv!),
          phone: this.selectedCustomerCmp?.phone,
          email: this.selectedCustomerCmp?.email,
          web: this.selectedCustomerCmp?.website,
          billing_branches: this.getBillingBranches(this.selectedCustomerCmp?.guid!),
          currency: this.getCurrency(this.selectedCustomerCmp?.currency?.guid!),
          default_profile: this.getDefaultTank(this.selectedCustomerCmp?.def_tank_guid!),
          address1: this.selectedCustomerCmp?.address_line1,
          address2: this.selectedCustomerCmp?.address_line2,
          postal_code: this.selectedCustomerCmp?.postal,
          city_name: this.selectedCustomerCmp?.city,
          country: this.selectedCustomerCmp?.country,
          remarks: this.selectedCustomerCmp?.remarks,
        });

        var existContact = this.selectedCustomerCmp?.cc_contact_person!.map((row) => ({
          ...row,
          action: ''
        }));
        this.updateData(existContact!);
        this.refreshBillingBranches();
      }
    }
    else if (this.historyState.customerCompany) // New Customer Company and New Billing Branch
    {
      this.PatchCustomerCompanyData();
    }
    else {
      this.refreshBillingBranches();
    }

  }


  public loadData() {

    this.initializeFilterCustomerCompany();

    this.customer_guid = this.route.snapshot.paramMap.get('id');
    if (this.customer_guid?.trim() == '') {
      this.customer_guid = undefined;
    }

    this.curDS.search({}, { sequence: 'ASC' }, 100).subscribe(data => {
      this.currencyList = data;


      if (this.historyState.customerCompany) {
        var cust: CustomerCompanyItem = this.historyState.customerCompany.customerCompanyData;
        this.ccForm?.patchValue({
          currency: this.getCurrency(cust.currency_guid!),
        })
      }
      else if (this.selectedCustomerCmp) {
        this.ccForm?.patchValue({
          currency: this.getCurrency(this.selectedCustomerCmp?.currency?.guid!),
        })
      }

    });


    this.tDS.search({}, { unit_type: 'ASC' }).subscribe(data => {
      this.tankItemList = data;


      if (this.historyState.customerCompany) {
        var cust: CustomerCompanyItem = this.historyState.customerCompany.customerCompanyData;
        this.ccForm?.patchValue({
          default_profile: this.getDefaultTank(cust.def_tank_guid!),
        })
      }
      else if (this.selectedCustomerCmp) {
        this.ccForm?.patchValue({
          default_profile: this.getDefaultTank(this.selectedCustomerCmp?.def_tank_guid!),
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
      this.customerTypeCvList = this.customerTypeCvList
        // .filter(data => data.code_val !== "BRANCH") // Filters out items where data.value is not "branch"
        .map(data => {
          // You can apply a transformation here if needed
          return data;  // Or transform data in some way
        });
      if (this.customerTypeCvList.length > 0)
        this.PatchSelectedRowValue();
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

        this.calculateCostSummary();
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
        // if (result.item.guid) {
        //   const data: any[] = [...this.repList.data];
        //   const updatedItem = {
        //     ...result.item,
        //     delete_dt: Utility.getDeleteDtEpoch(),
        //     actions: Array.isArray(data[index].actions!)
        //       ? [...new Set([...data[index].actions!, 'delete'])]
        //       : ['delete']
        //   };
        //   data[result.index] = updatedItem;
        //   this.updateData(data); // Refresh the data source
        // } else {
        const data = [...this.repList.data];
        data.splice(index, 1);
        this.updateData(data); // Refresh the data source
        // }
        this.calculateCostSummary();
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

  onCustomerFormSubmit() {
    this.ccForm!.get('repList')?.setErrors(null);
    if (this.ccForm?.valid) {
      if (!this.repList.data.length) {
        this.ccForm.get('repList')?.setErrors({ required: true });
      } else {

        var customerCode = this.ccForm?.get("customer_code")?.value;
        const where: any = {};
        where.code = { eq: customerCode };
        this.ccDS.search(where).subscribe(result => {

          if (result.length == 0 && this.customer_guid == undefined) {
            this.insertNewCustomer();

          }
          else if (result.length > 0) {
            if (this.customer_guid == undefined) {
              this.ccForm?.get('customer_code')?.setErrors({ existed: true });
            }
            else {

              this.updateExistCustomer();

            }


          }
          else if (result.length == 0 && this.selectedTempEst != undefined) {
            this.updateExistCustomer();
          }
        });
        // var tempName = this.ccForm?.get("template_name")?.value;
        // const where: any = {};
        // where.template_name = { eq: tempName };
        // this.estTempDS.SearchEstimateTemplateOnly(where).subscribe(result => {

        //   if (result.length == 0 && this.selectedTempEst == undefined) {

        //     let temp: MasterTemplateItem = new MasterTemplateItem();
        //     temp.labour_cost_discount = this.ccForm?.get("labour_discount")?.value;
        //     temp.material_cost_discount = this.ccForm?.get("material_discount")?.value;
        //     temp.template_name = this.ccForm?.get("template_name")?.value;
        //     delete temp.totalMaterialCost;
        //     temp.type_cv = "GENERAL";
        //     if (this.ccForm?.get("customer_code")?.value?.length > 0) {

        //       temp.type_cv = "EXCLUSIVE";
        //       var customerCodes: CustomerCompanyItem[] = this.ccForm?.get("customer_code")?.value;
        //       temp.template_est_customer = [];
        //       customerCodes.forEach(data => {
        //         var custItem: TemplateEstimateCustomerItem = new TemplateEstimateCustomerItem();
        //         custItem.action = "NEW";
        //         custItem.customer_company_guid = data.guid;
        //         custItem.customer_company = undefined;
        //         custItem.guid = "";
        //         temp.template_est_customer?.push(custItem)
        //       });
        //     }
        //     if (this.repList.data.length) {
        //       temp.template_est_part = [];
        //       this.repList.data.forEach(data => {
        //         var repEstItem: any = data;
        //         var tempEstPartItem: TemplateEstPartItem = new TemplateEstPartItem();
        //         tempEstPartItem.action = "NEW";
        //         tempEstPartItem.guid = "";
        //         tempEstPartItem.tariff_repair_guid = data.tariff_repair_guid;
        //         tempEstPartItem.hour = repEstItem.hour;
        //         tempEstPartItem.quantity = repEstItem.quantity;
        //         tempEstPartItem.location_cv = repEstItem.location_cv;
        //         tempEstPartItem.remarks = repEstItem.remarks;
        //         tempEstPartItem.description = repEstItem.description;
        //         tempEstPartItem.tep_damage_repair = [];
        //         let dmg: TepDamageRepairItem[] = repEstItem.tep_damage_repair!;
        //         dmg.forEach(d => {
        //           let tepDamageRepairItm: TepDamageRepairItem = new TepDamageRepairItem();
        //           tepDamageRepairItm.code_cv = d.code_cv;
        //           tepDamageRepairItm.code_type = d.code_type;
        //           tepDamageRepairItm.action = "NEW";
        //           tempEstPartItem.tep_damage_repair?.push(tepDamageRepairItm);
        //         });
        //         temp.template_est_part?.push(tempEstPartItem);
        //         // data.
        //         // tempEstPartItem.tep_damage_repair?.push()
        //         // temp.template_est_part?.push()
        //       });
        //     }

        //     this.estTempDS.AddMasterTemplate(temp).subscribe(result => {
        //       var count = result.data.addTemplateEstimation;
        //       if (count > 0) {
        //         this.handleSaveSuccess(count);
        //       }
        //     });

        //   }
        //   else if (result.length > 0) {
        //     if (this.selectedTempEst == undefined) {
        //       this.ccForm?.get('template_name')?.setErrors({ existed: true });
        //     }
        //     else {

        //       this.updateExistTemplate();

        //     }


        //   }
        //   else if(result.length==0 && this.selectedTempEst!=undefined)
        //   {
        //     this.updateExistTemplate();
        //   }


        // });


      }
    } else {
      console.log('Invalid soForm', this.ccForm?.value);
    }
  }

  insertNewCustomer() {

    var cust: CustomerCompanyItem = new CustomerCompanyItem();
    cust.address_line1 = this.ccForm?.get("address1")?.value;
    cust.address_line2 = this.ccForm?.get("address2")?.value;
    cust.code = this.ccForm?.get("customer_code")?.value;
    cust.name = this.ccForm?.get("customer_name")?.value;
    cust.city = this.ccForm?.get("city_name")?.value;
    cust.country = this.ccForm?.get("country")?.value;
    cust.currency = this.ccForm?.get("currency")?.value;
    cust.email = this.ccForm?.get("email")?.value;
    cust.remarks = this.ccForm?.get("remarks")?.value;
    cust.website = this.ccForm?.get("web")?.value;

    cust.phone = this.ccForm?.get("phone")?.value;
    cust.postal = this.ccForm?.get("postal_code")?.value;
    if (this.ccForm?.get("default_profile")?.value) {
      let defTank = this.ccForm?.get("default_profile")?.value as TankItem;
      cust.def_tank_guid = defTank.guid;
    }
    if (this.ccForm?.get("currency")?.value) {
      cust.currency_guid = cust.currency?.guid;
    }
    else {
      cust.currency_guid = "-";

    }
    delete cust.currency;
    cust.type_cv = (this.ccForm?.get("customer_type")?.value as CodeValuesItem).code_val;

    var contactPerson = this.repList.data.map((row) => ({
      ...row,
      title_cv: row.title_cv,
      action: 'NEW'
    }));


    var billingBranches: BillingBranchesItem[] = [];
    if (this.ccForm?.get("billing_branches")?.value) {

    }
    this.ccDS.AddCustomerCompany(cust, contactPerson, billingBranches).subscribe(result => {


      var count = result.data.addCustomerCompany;
      if (count > 0) {
        this.handleSaveSuccess(count);
      }
    });

  }

  updateExistCustomer() {

    if (this.selectedCustomerCmp) {
      var selectedCusCmp = new CustomerCompanyItem(this.selectedCustomerCmp);

      selectedCusCmp.address_line1 = this.ccForm?.get("address1")?.value;
      selectedCusCmp.address_line2 = this.ccForm?.get("address2")?.value;
      selectedCusCmp.code = this.ccForm?.get("customer_code")?.value;
      selectedCusCmp.name = this.ccForm?.get("customer_name")?.value;
      selectedCusCmp.city = this.ccForm?.get("city_name")?.value;
      selectedCusCmp.country = this.ccForm?.get("country")?.value;
      selectedCusCmp.currency = this.ccForm?.get("currency")?.value;
      selectedCusCmp.email = this.ccForm?.get("email")?.value;
      selectedCusCmp.remarks = this.ccForm?.get("remarks")?.value;
      selectedCusCmp.website = this.ccForm?.get("web")?.value;


      selectedCusCmp.phone = this.ccForm?.get("phone")?.value;
      selectedCusCmp.postal = this.ccForm?.get("postal_code")?.value;


      if (this.ccForm?.get("default_profile")?.value) {
        let defTank = this.ccForm?.get("default_profile")?.value as TankItem;
        selectedCusCmp.def_tank_guid = defTank.guid;
      }

      if (this.ccForm?.get("currency")?.value) {
        let currency = this.ccForm?.get("currency")?.value;
        selectedCusCmp.currency_guid = currency?.guid;
      }
      else {
        selectedCusCmp.currency_guid = "-";

      }
      delete selectedCusCmp.currency;
      selectedCusCmp.type_cv = (this.ccForm?.get("customer_type")?.value as CodeValuesItem).code_val;

      var existContactPerson = selectedCusCmp?.cc_contact_person?.map((row) => ({
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




      var billingBranches: BillingBranchesItem[] = [];
      if (this.ccForm?.get("billing_branches")?.value) {


        var b = this.ccForm?.get("billing_branches")?.value as CustomerCompanyItem;
        let billing_branch = new BillingBranchesItem();
        billing_branch.branchCustomer = new BillingCustomerItem(b);

        if (b.main_customer_guid !== this.selectedCustomerCmp.guid) {
          billing_branch.branchCustomer.action = b.guid == "" ? "NEW" : "EDIT";
          billing_branch.branchCustomer.main_customer_guid = this.selectedCustomerCmp?.guid;


        }
        else {
          billing_branch.branchCustomer.action = "";
        }


        delete billing_branch.branchCustomer.update_by;
        delete billing_branch.branchCustomer.update_dt;
        delete billing_branch.branchCustomer.create_by;
        delete billing_branch.branchCustomer.create_dt;
        delete billing_branch.branchCustomer.delete_dt;
        delete billing_branch.branchCustomer.cc_contact_person;
        delete billing_branch.branchCustomer.currency;

        billing_branch.branchContactPerson = [];
        b.cc_contact_person?.forEach(p => {

          let person = new BillingContactPersonItem(p);
          person.action = p.guid == "" ? "NEW" : "";
          billing_branch.branchContactPerson?.push(person);
        });


        //check and remove the existing Billing branch if new billing branch selected.
        var existingBillingBranchCust = this.getBillingBranches(selectedCusCmp?.guid!);
        if (existingBillingBranchCust) {
          if (existingBillingBranchCust?.guid !== billing_branch?.branchCustomer.guid!) {
            let exist_billing_branch = new BillingBranchesItem();
            exist_billing_branch.branchCustomer = new BillingCustomerItem(existingBillingBranchCust);
            exist_billing_branch.branchCustomer.action = "EDIT";
            exist_billing_branch.branchCustomer.main_customer_guid = "";

            delete exist_billing_branch.branchCustomer.update_by;
            delete exist_billing_branch.branchCustomer.update_dt;
            delete exist_billing_branch.branchCustomer.create_by;
            delete exist_billing_branch.branchCustomer.create_dt;
            delete exist_billing_branch.branchCustomer.delete_dt;
            delete exist_billing_branch.branchCustomer.cc_contact_person;
            delete exist_billing_branch.branchCustomer.currency;

            billingBranches.push(exist_billing_branch);
          }
        }

        billingBranches.push(billing_branch);



      }


      delete selectedCusCmp.update_by;
      delete selectedCusCmp.update_dt;
      delete selectedCusCmp.create_by;
      delete selectedCusCmp.create_dt;
      delete selectedCusCmp.delete_dt;
      delete selectedCusCmp.cc_contact_person;


      var existContactPersons = existContactPerson?.map((node: any) => new ContactPersonItemAction(node));

      this.ccDS.UpdateCustomerCompany(selectedCusCmp, existContactPersons, billingBranches).subscribe(result => {


        var count = result.data.updateCustomerCompany;
        if (count > 0) {
          this.handleSaveSuccess(count);
        }
      });

    }
    else {
      this.insertNewCustomer();
    }

  }

  updateData(newData: any[]): void {
    this.repList.data = [...newData];
    this.sotSelection.clear();
    this.ccForm?.get('repList')?.setErrors(null);
  }

  handleDelete(event: Event, row: any, index: number): void {
    this.deleteItem(row, index);
  }

  cancelItem(event: Event, row: RepairPartItem) {
    // this.id = row.id;
    if (this.sotSelection.hasValue()) {
      this.cancelSelectedRows(this.sotSelection.selected)
    } else {
      this.cancelSelectedRows([row])
    }
  }

  rollbackItem(event: Event, row: RepairPartItem) {
    // this.id = row.id;
    if (this.sotSelection.hasValue()) {
      this.rollbackSelectedRows(this.sotSelection.selected)
    } else {
      this.rollbackSelectedRows([row])
    }
  }

  undoAction(event: Event, row: RepairPartItem, action: string) {
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
    newSot.clean_status_cv = row.clean_status_cv;
    newSot.certificate_cv = row.certificate_cv;
    newSot.so_guid = row.so_guid;
    newSot.eta_dt = row.eta_dt;
    newSot.etr_dt = row.etr_dt;
    //this.addEstDetails(event, newSot);
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.langText.SAVE_SUCCESS;
      this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
        successMsg = res;
        ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
        //this.router.navigate(['/admin/master/estimate-template']);

        // Navigate to the route and pass the JSON object
        this.router.navigate(['/admin/master/customer'], {
          state: this.historyState

        }
        );
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

  getCustomerTypeCvObject(codeValType: string): CodeValuesItem | undefined {
    return this.cvDS.getCodeObject(codeValType, this.customerTypeCvList);
  }

  displayDateTime(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateTimeStr(input);
  }

  displayDate(input: Date): string {
    return Utility.convertDateToStr(input);
  }

  addBillingBranch(event: Event) {
    event.stopPropagation(); // Stop the click event from propagating
    // Navigate to the route and pass the JSON object

    if (!this.ccForm?.get("customer_code")?.value!) {

      return;
    }

    var updContactPerson = this.repList.data.map((row) => ({
      ...row,
      title_cv: row.title_cv

    }));

    let billingBranches = this.billingBranch?.map(row => ({ ...row }));

    var cust: CustomerCompanyItem = new CustomerCompanyItem();
    cust.guid = this.selectedCustomerCmp?.guid;
    cust.address_line1 = this.ccForm?.get("address1")?.value;
    cust.address_line2 = this.ccForm?.get("address2")?.value;
    cust.code = this.ccForm?.get("customer_code")?.value;
    cust.name = this.ccForm?.get("customer_name")?.value;
    cust.city = this.ccForm?.get("city_name")?.value;
    cust.country = this.ccForm?.get("country")?.value;
    cust.currency = this.ccForm?.get("currency")?.value;
    cust.email = this.ccForm?.get("email")?.value;
    cust.remarks = this.ccForm?.get("remarks")?.value;
    cust.website = this.ccForm?.get("web")?.value;

    cust.phone = this.ccForm?.get("phone")?.value;
    cust.postal = this.ccForm?.get("postal_code")?.value;
    if (this.ccForm?.get("default_profile")?.value) {
      let defTank = this.ccForm?.get("default_profile")?.value as TankItem;
      cust.def_tank_guid = defTank.guid;
    }
    if (this.ccForm?.get("currency")?.value) {
      cust.currency_guid = cust.currency?.guid;
    }


    cust.type_cv = (this.ccForm?.get("customer_type")?.value as CodeValuesItem).code_val;


    let custCmp: any = {
      customerCompanyData: cust,
      contactPerson: updContactPerson,
      billingBranches: billingBranches,
      newBillingBranchCode: ''
    };
    this.historyState.customerCompany = custCmp;

    this.router.navigate(['/admin/master/billing-branch/new/ '], {
      state: this.historyState

    }
    );
  }

  GoBackPrevious(event: Event) {
    event.stopPropagation(); // Stop the click event from propagating
    // Navigate to the route and pass the JSON object
    this.router.navigate(['/admin/master/customer'], {
      state: this.historyState

    }
    );
  }

  GetEstimationPrice(row: any): string {
    var retval: string = "0.00";

    retval = Number(Number(row.tariff_repair.material_cost || 0) * Number(row.quantity || 0)).toFixed(2);
    return retval;
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
        headerText: this.translatedLangText.CONFIRM_RESET,
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

  getBillingBranchesCode(code: string): CustomerCompanyItem | undefined {
    if (this.customer_companyList?.length) {
      const custCmp = this.customer_companyList?.filter((x: any) => x.code === code).map(item => {
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
    this.ccForm!.get('billing_branches')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (typeof value === 'string') {
          searchCriteria = value;
        } else {
          searchCriteria = value.code;
        }
        this.subs.sink = this.ccDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
          this.customer_companyList = data
        });
      })
    ).subscribe();
  }

  refreshBillingBranches() {

    let selGuid: string | undefined = undefined;
    let selBillingCode: string | undefined = undefined;
    if (this.historyState.customerCompany) {
      selGuid = this.historyState.customerCompany.customerCompanyData.guid;
      selBillingCode = this.historyState.customerCompany.newBillingBranchCode;

    }
    else if (this.selectedCustomerCmp) {
      selGuid = this.selectedCustomerCmp.guid!;
    }


    this.subs.sink = this.ccDS.loadItems({}, { code: 'ASC' }, 100).subscribe(data => {

      if (data.length) {
        if (this.selectedCustomerCmp) {
          data = data.filter(item => item.guid !== this.selectedCustomerCmp?.guid);


        }


        this.customer_companyList = data

        if (selBillingCode) {
          this.ccForm?.patchValue({
            billing_branches: this.getBillingBranchesCode(selBillingCode),
          })
        }
        else if (selGuid!) {
          this.ccForm?.patchValue({
            billing_branches: this.getBillingBranches(selGuid),
          })
        }


      }
    });
  }
}