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
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
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
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { TankDS, TankItem } from 'app/data-sources/tank';
import { TariffCleaningDS } from 'app/data-sources/tariff-cleaning'
import { ComponentUtil } from 'app/utilities/component-util';
import { CancelFormDialogComponent } from './dialogs/cancel-form-dialog/cancel-form-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { InGateDS } from 'app/data-sources/in-gate';
import { InGateSurveyItem } from 'app/data-sources/in-gate-survey';
import { RepairEstPartItem } from 'app/data-sources/repair-est-part';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TariffLabourDS, TariffLabourItem } from 'app/data-sources/tariff-labour';
import { MasterEstimateTemplateDS, MasterTemplateItem, TemplateEstimateCustomerItem, TemplateEstPartItem, TepDamageRepairItem } from 'app/data-sources/master-template';
import { EstimateComponent } from 'app/admin/repair/estimate/estimate.component';
import { REPDamageRepairItem } from 'app/data-sources/rep-damage-repair';
import { TlxFormFieldComponent } from '@shared/components/tlx-form/tlx-form-field/tlx-form-field.component';
import { elements } from 'chart.js';
import { ContactPersonItem } from 'app/data-sources/contact-person';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { BillingBranchesItem } from 'app/data-sources/billingBranches';
import { CurrencyDS, CurrencyItem } from 'app/data-sources/currency';

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
    TlxFormFieldComponent,
  ]
})
export class BillingBranchNewComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
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
  pageTitleNew = 'MENUITEMS.MASTER.LIST.BILLING-BRANCH-NEW'
  pageTitleEdit = 'MENUITEMS.MASTER.LIST.BILLING-BRANCH-EDIT'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT',
    'MENUITEMS.MASTER.LIST.BILLING-BRANCH'
  ]
  translatedLangText: any = {}
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.HEADER',
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    CUSTOMER_DETAILS:'COMMON-FORM.CUSTOMER-DETAILS',
    ALIAS_NAME:'COMMON-FORM.ALIAS-NAME',
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
    CONTACT_PERSON:"COMMON-FORM.CONTACT-PERSON",
    JOB_TITLE:"COMMON-FORM.JOB-TITLE",
    DEPARTMENT:"COMMON-FORM.DEPARTMENT",
    DID:"COMMON-FORM.DID",
    MOBILE_NO:"COMMON-FORM.MOBILE-NO",
    COUNTRY:"COMMON-FORM.COUNTRY",
    FAX_NO:"COMMON-FORM.FAX-NO",
    EMAIL:"COMMON-FORM.EMAIL",
    PHONE:"COMMON-FORM.PHONE",
    WEB:"COMMON-FORM.WEB",
    CONVERSION_CURRENCY:"COMMON-FORM.CONVERSION-CURRENCY",
    PERSON_IN_CHARGE:"COMMON-FORM.PERSON-IN-CHARGE",
    DEFAULT_PROFILE:"COMMON-FORM.DEFAULT-PROFILE",
    COMPANY_NAME:"COMMON-FORM.COMPANY-NAME",
    CUSTOMER_NAME:"COMMON-FORM.CUSTOMER-NAME",
    CUSTOMER_COMPANY:"COMMON-FORM.CUSTOMER-COMPANY",
    CUSTOMER_TYPE:"COMMON-FORM.CUSTOMER-TYPE",
    ADDRESS_LINE1:"COMMON-FORM.ADDRESS-LINE1",
    ADDRESS_LINE2:"COMMON-FORM.ADDRESS-LINE2",
    POSTAL_CODE:"COMMON-FORM.POSTAL-CODE",
    CITY_NAME:"COMMON-FORM.CITY-NAME",
    CONTACT_PERSON_DETAILS:"COMMON-FORM.CONTACT-PERSON-DETAILS",
    BILLING_BRANCH:"COMMON-FORM.BILLING-BRANCH",
    SALUTATION:"COMMON-FORM.SALUTATION",
    NAME:"COMMON-FORM.NAME",
    INVALID_FORMAT:"COMMON-FORM.INVALID-FORMAT",
    ADD:"COMMON-FORM.ADD",
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    BRANCH_CODE:"COMMON-FORM.BRANCH-CODE",
    BRANCH_NAME:"COMMON-FORM.BRANCH-NAME"
  }

  clean_statusList: CodeValuesItem[] = [];

  branch_guid?: string | null;
  isFromBranch?:boolean=true;

  ccForm?: UntypedFormGroup;
  sotForm?: UntypedFormGroup;

  customer_code_changed: boolean = false;

  selectedTempEst?: MasterTemplateItem;
  sotItem?: StoringOrderTankItem;
  storingOrderItem: StoringOrderItem = new StoringOrderItem();
  repList = new MatTableDataSource<ContactPersonItem>();
  sotSelection = new SelectionModel<RepairEstPartItem>(true, []);
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
  satulationCvList:CodeValuesItem[]=[];

  tankItemList?:TankItem[]=[];
  customerTypeControl = new UntypedFormControl();

  // soDS: StoringOrderDS;
  // sotDS: StoringOrderTankDS;
  cvDS: CodeValuesDS;
  ccDS: CustomerCompanyDS;
  tDS: TankDS;
  curDS:CurrencyDS;
  // igDS: InGateDS;
  // trLabourDS: TariffLabourDS;
  // estTempDS: MasterEstimateTemplateDS

  trLabourItems: TariffLabourItem[] = [];
  historyState: any = {};
  billingBranchesControl= new UntypedFormControl();
  profileControl=new UntypedFormControl();
  customerTypeCvList: CodeValuesItem[]=[];
  currencyList?:CurrencyItem[]=[];
  selectedCustomerCmp: any;

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
    this.curDS= new CurrencyDS(this.apollo);
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

  GetNetCost(): string {
    var val: number = 0;

    val = Number(this.ccForm?.get("total_cost")?.value) - Number(this.ccForm?.get("labour_discount_amount")?.value) - Number(this.ccForm?.get("material_discount_amount")?.value)
    return val.toFixed(2);
  }

  initializeValueChange() {
    //this.repList.data

    // this.ccForm?.get('labour_hour')?.valueChanges.subscribe(value => {
    //   this.ccForm?.patchValue({
    //     labour_total: Number(Number(this.ccForm?.get('labour_hour')!.value) * Number(this.ccForm?.get('labour_rate')!.value)).toFixed(2)
    //   });
    // });

    // this.ccForm?.get('labour_total')!.valueChanges.subscribe(value => {

    //   var discCostAmt: number = 0;
    //   if (this.ccForm?.get('labour_discount')?.value > 0) {
    //     discCostAmt = Number(this.ccForm?.get('labour_total')!.value) * Number(Number(this.ccForm?.get('labour_discount')?.value / 100));
    //   }
    //   this.ccForm?.patchValue({
    //     total_cost: Number(Number(this.ccForm?.get('labour_total')!.value) + Number(this.ccForm?.get('total_material_cost')!.value)).toFixed(2),
    //     labour_discount_amount: discCostAmt.toFixed(2),

    //   });
    // });

    // this.ccForm?.get('total_cost')!.valueChanges.subscribe(value => {


    //   this.ccForm?.patchValue({
    //     net_cost: this.GetNetCost()


    //   });
    // });

    // this.ccForm?.get('labour_rate')!.valueChanges.subscribe(value => {

    //   this.ccForm?.patchValue({

    //     //labour_total : (Number(this.ccForm?.get('labour_rate')?.value)+Number(this.ccForm?.get('labour_additional')?.value)).toFixed(2),
    //     labour_total: Number(Number(this.ccForm?.get('labour_hour')!.value) * Number(this.ccForm?.get('labour_rate')!.value)).toFixed(2)

    //   });
    // });
    // this.ccForm?.get('labour_additional')!.valueChanges.subscribe(value => {

    //   this.ccForm?.patchValue({
    //     labour_total: (Number(this.ccForm?.get('labour_rate')?.value) + Number(this.ccForm?.get('labour_additional')?.value)).toFixed(2),

    //   });
    // });

    // this.ccForm?.get('labour_discount_amount')!.valueChanges.subscribe(value => {


    //   this.ccForm?.patchValue({
    //     net_cost: this.GetNetCost()


    //   });
    // });

    // this.ccForm?.get('material_discount_amount')!.valueChanges.subscribe(value => {


    //   this.ccForm?.patchValue({
    //     net_cost: this.GetNetCost()


    //   });
    // });



    // this.ccForm?.get('labour_discount')!.valueChanges.subscribe(value => {
    //   var discCostAmt: number = 0;
    //   if (this.ccForm?.get('labour_discount')?.value > 0) {
    //     discCostAmt = Number(this.ccForm?.get('labour_rate')!.value) * Number(Number(this.ccForm?.get('labour_discount')?.value / 100));
    //   }
    //   this.ccForm?.patchValue({
    //     labour_discount_amount: discCostAmt.toFixed(2),
    //     //net_cost:this.GetNetCost()
    //   });
    // });


    // this.ccForm?.get('material_discount')!.valueChanges.subscribe(value => {
    //   var discCostAmt: number = 0;
    //   if (this.ccForm?.get('material_discount')?.value > 0) {
    //     discCostAmt = Number(this.ccForm?.get('total_material_cost')?.value) * Number(Number(this.ccForm?.get('material_discount')?.value / 100));
    //   }
    //   this.ccForm?.patchValue({
    //     material_discount_amount: discCostAmt.toFixed(2),
    //     // net_cost:this.GetNetCost()
    //   });
    // });

    // this.ccForm?.get('total_material_cost')!.valueChanges.subscribe(value => {
    //   var discCostAmt: number = 0;
    //   if (this.ccForm?.get('material_discount')?.value > 0) {
    //     discCostAmt = Number(this.ccForm?.get('total_material_cost')?.value) * Number(Number(this.ccForm?.get('material_discount')?.value / 100));
    //   }
    //   this.ccForm?.patchValue({
    //     total_cost: Number(Number(this.ccForm?.get('labour_total')!.value) + Number(this.ccForm?.get('total_material_cost')!.value)).toFixed(2),
    //     material_discount_amount: discCostAmt.toFixed(2),

    //   });
    // });

  }

  initCCForm() {
    this.ccForm = this.fb.group({
      guid: [''],
      customer_company_guid: [''],
      customer_code:[''],
      branch_code: [''],
      branch_name: [''],
      phone:    ['',[Validators.required,
        Validators.pattern(/^\+?[1-9]\d{7,10}$/)]], // Adjust regex for your format,
      email: ['',[Validators.required, Validators.email]],
      web: [''],
      currency: [''],
      default_profile:[''],
      address1: [''],
      address2: [''],
      postal_code: [''],
      city_name: [''],
      country: ['Singapore'],
      remarks:['']
    });
  }

  initializeFilter() {
  }

SortRepairEstPart(items:TemplateEstPartItem[]):TemplateEstPartItem[]{
  if(items.length==0) return [];
var retval:TemplateEstPartItem[]= items.sort((a, b) => b.create_dt! - a.create_dt!);

  return retval;
}

  public loadData() {
    this.historyState = history.state;

    if(this.historyState.customerCompany)
    {
      this.isFromBranch=false;
      
    }

  
    this.curDS.search({},{sequence:'ASC'},100).subscribe(data=>{
      this.currencyList=data;

      
     if(this.selectedCustomerCmp)
      {
        this.ccForm?.patchValue({
          currency:this.getCurrency(this.selectedCustomerCmp?.currency?.guid!),
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

        if(!this.isFromBranch)
        {
          let selectedCustomer = this.historyState.customerCompany.customerCompanyData;
          if(selectedCustomer.guid)
          {
            var selectedCustomers=data.filter(customer=>customer.guid==selectedCustomer.guid);
            if(selectedCustomers.length)
              selectedCustomer=selectedCustomers[0];
            else
              this.customer_companyList.unshift(selectedCustomer);
          }
          else
          {
            this.customer_companyList.unshift(selectedCustomer);
          }
          this.ccForm?.patchValue({
              customer_code: selectedCustomer
            });
            this.ccForm?.get('customer_code')?.disable();
        }
    
      }
    });

    this.tDS.search({}, { unit_type: 'ASC' }).subscribe(data => {
      this.tankItemList = data;
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
        } as RepairEstPartItem;
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
      width:'1000px',
      data: {
        item: row ? row : cntPerson,
        action: 'new',
        translatedLangText: this.translatedLangText,
        populateData: {
          satulationCvList:this.satulationCvList
        },
        index: -1,
        customer_company_guid: '' //this.sotItem?.storing_order?.customer_company_guid
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data: any = [...this.repList.data];
        const newItem = new ContactPersonItem({
          ...result.item,
        });
        data.unshift(newItem);
        this.updateData(data);

        this.calculateCostSummary();
      }
    });
  }

  
  editEstDetails(event: Event, row: RepairEstPartItem, index: number) {
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
          satulationCvList:this.satulationCvList
        },
        index: index,
        customer_company_guid: this.sotItem?.storing_order?.customer_company_guid
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data: any[] = [...this.repList.data];
        const updatedItem = new ContactPersonItem({
          ...result.item,
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

  cancelSelectedRows(row: RepairEstPartItem[]) {
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
        result.item.forEach((newItem: RepairEstPartItem) => {
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

  rollbackSelectedRows(row: RepairEstPartItem[]) {
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
        result.item.forEach((newItem: RepairEstPartItem) => {
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

  undoTempAction(row: RepairEstPartItem[], actionToBeRemove: string) {
    const data: any[] = [...this.repList.data];
    row.forEach((newItem: RepairEstPartItem) => {
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

  onBillingBranchSubmit() {
    this.ccForm!.get('repList')?.setErrors(null);
    if (this.ccForm?.valid) {
      if (!this.repList.data.length) {
        this.ccForm.get('repList')?.setErrors({ required: true });
      } else {

        var customerCode = this.ccForm?.get("branch_code")?.value;
        const where: any = {};
        where.code = { eq: customerCode };
        this.ccDS.search(where).subscribe(result => {

          if (result.length == 0 && this.branch_guid == undefined) {
              this.insertNewBillingBranch();
            
          }
          else if (result.length > 0 && this.branch_guid == undefined) {
          
              this.ccForm?.get('branch_code')?.setErrors({ existed: true });
          }
    });
       
      }
    } else {
      console.log('Invalid soForm', this.ccForm?.value);
    }
  }

  insertNewBillingBranch() {

    var cust:CustomerCompanyItem=new CustomerCompanyItem();
    cust.address_line1=this.ccForm?.get("address1")?.value;
    cust.address_line2=this.ccForm?.get("address2")?.value;
    cust.code=this.ccForm?.get("branch_code")?.value;
    cust.name=this.ccForm?.get("branch_name")?.value;
    cust.city=this.ccForm?.get("city_name")?.value;
    cust.country=this.ccForm?.get("country")?.value;
    cust.currency=this.ccForm?.get("currency")?.value;
    cust.email=this.ccForm?.get("email")?.value;
    cust.remarks=this.ccForm?.get("remarks")?.value;
    cust.website=this.ccForm?.get("web")?.value;
    cust.type_cv="BRANCH";
    cust.phone=this.ccForm?.get("phone")?.value;
    cust.postal=this.ccForm?.get("postal_code")?.value;
    
    if(this.ccForm?.get("customer_code")?.value)
    {
       const customer:CustomerCompanyItem = this.ccForm?.get("customer_code")?.value!;
      cust.main_customer_guid=customer.guid;
    }

    if(this.ccForm?.get("default_profile")?.value)
    {
      let defTank =this.ccForm?.get("default_profile")?.value as TankItem;
      cust.def_tank_guid=defTank.guid;
    }
    if(this.ccForm?.get("currency")?.value)
    {
      cust.currency_guid= cust.currency?.guid;
    }
    else
    {
      cust.currency_guid="-";
      
    }
    delete cust.currency;
  //  cust.type_cv= (this.ccForm?.get("customer_type")?.value as CodeValuesItem).code_val;

    var contactPerson =  this.repList.data.map((row) => ({
      ...row,
      title_cv : row.title_cv,
      action:'NEW'
    }));

    
    var billingBranches:BillingBranchesItem[]=[]; 
    if(this.ccForm?.get("billing_branches")?.value)
    {
   
    }
    this.ccDS.AddCustomerCompany(cust,contactPerson,billingBranches).subscribe(result => {


      var count = result.data.addCustomerCompany;
      if (count > 0) {
        this.handleSaveSuccess(count);
      }
    });
  
  }

  updateExistTemplate() {

    // // const tempEstimateCustomerItems: TemplateEstimateCustomerItem[] = this.selectedTempEst!.template_est_customer!.map((node: any) => new TemplateEstimateCustomerItem(node));
    
    // // this.selectedTempEst!.template_name=this.ccForm?.get("template_name")?.value;
    // // this.selectedTempEst!.labour_cost_discount=this.ccForm?.get("labour_discount")?.value;
    // // this.selectedTempEst!.remarks=this.ccForm?.get("remarks")?.value;
    // // this.selectedTempEst!.material_cost_discount=this.ccForm?.get("material_discount")?.value;
    // // this.selectedTempEst!.template_est_customer=tempEstimateCustomerItems;
    // // var existdata_cust=this.selectedTempEst!.template_est_customer;
    // // existdata_cust?.forEach(value=>{value.action="CANCEL";value.customer_company=undefined;});
    // // this.selectedTempEst!.type_cv="GENERAL";
    // // if(this.ccForm?.get("customer_code")?.value?.length>0)
    // //   {
    // //     var newdata_cust = this.ccForm?.get('customer_code')?.value;
    // //     this.selectedTempEst!.type_cv="EXCLUSIVE";
    // //     var customerCodes : CustomerCompanyItem[] = this.ccForm?.get("customer_code")?.value;
    // //     //temp.template_est_customer=[];
    // //     customerCodes.forEach(data=>{
    // //          const found=existdata_cust.filter(value=>value.customer_company_guid===data.guid);
    // //         if(found!.length>0)
    // //         {
    // //           found[0].action=""; 
    // //           found[0].customer_company=undefined;

    // //     }
    // //     else {
    // //       var custItem: TemplateEstimateCustomerItem = new TemplateEstimateCustomerItem();
    // //       custItem.action = "NEW";
    // //       custItem.customer_company_guid = data.guid;
    // //       custItem.customer_company = undefined;
    // //       custItem.guid = "";
    // //       this.selectedTempEst!.template_est_customer?.push(custItem)
    // //     }

    // //   });

    // // }
    // // const tempEstimatePartItems: TemplateEstPartItem[] = this.selectedTempEst!.template_est_part!.map((node: any) => new TemplateEstPartItem(node));
    // // this.selectedTempEst!.template_est_part = tempEstimatePartItems;
    // // this.selectedTempEst!.template_est_part.forEach(value => {
    // //   value.action = "CANCEL"; 
    // //   value.tariff_repair=undefined;
    // //   value.tep_damage_repair= value.tep_damage_repair?.map((node:any)=>new TepDamageRepairItem(node));

    // // });

    // // if(this.repList.data.length>0)
    // // {
    // //   this.repList.data.forEach(value=>{
        
    // //     var existData = this.selectedTempEst?.template_est_part?.filter(data=>data.guid===value.guid);
    // //     if(existData?.length!>0)
    // //     {
    // //       var childNodeUpdated:Boolean=false;
    // //       //if template estimate part found
    // //       existData![0]!.action = "";
    // //       existData![0]!.tariff_repair = undefined;
    // //       existData![0]!.tep_damage_repair = existData![0]!.tep_damage_repair!.map((node: any) => new TepDamageRepairItem(node));
    // //       //set all the tep_damage_repair action to cancel first
    // //       existData![0]!.tep_damage_repair.forEach(value => {value.action = "CANCEL";});

    // //       // consolidate new repair + new damage to tep_damage_repair
    // //       var rep_damage_repairItems=value.tep_damage_repair!;
        
    // //         rep_damage_repairItems.forEach(repItm=>{
    // //           var existRepItm = existData![0]!.tep_damage_repair?.filter(data=>data.code_cv===repItm.code_cv && data.code_type===repItm.code_type);
    // //           if(existRepItm?.length!>0)
    // //           {
    // //             //set the damage or repair  to unchange
    // //             existRepItm![0]!.action="";
    // //           }
    // //           else
    // //           {
    // //             let tepDamageRepairItm :TepDamageRepairItem= new TepDamageRepairItem();
    // //             tepDamageRepairItm.code_cv=repItm.code_cv;
    // //             tepDamageRepairItm.code_type=repItm.code_type;
    // //             tepDamageRepairItm.action="NEW";
    // //             //add new damage or repair 
    // //             existData![0].tep_damage_repair!.push(tepDamageRepairItm);
    // //             childNodeUpdated=true;
    // //           }
    // //         });
    // //         if(childNodeUpdated) existData![0]!.action="EDIT";

    // //     }
    // //     else {
    // //       var repEstItem: TemplateEstPartItem = value;
    // //       var tempEstPartItem: TemplateEstPartItem = new TemplateEstPartItem();
    // //       tempEstPartItem.action = "NEW";
    // //       tempEstPartItem.guid = "";
    // //       tempEstPartItem.tariff_repair_guid = value.tariff_repair_guid;
    // //       tempEstPartItem.hour = repEstItem.hour;
    // //       tempEstPartItem.quantity = repEstItem.quantity;
    // //       tempEstPartItem.location_cv = repEstItem.location_cv;
    // //       tempEstPartItem.remarks = repEstItem.remarks;
    // //       tempEstPartItem.description = repEstItem.description;
    // //       tempEstPartItem.tep_damage_repair = [];
    // //       let dmg: TepDamageRepairItem[] = repEstItem.tep_damage_repair!.map((node:any)=>new TepDamageRepairItem(node));;
    // //       dmg.forEach(d => {
    // //         let tepDamageRepairItm: TepDamageRepairItem = new TepDamageRepairItem();
    // //         tepDamageRepairItm.code_cv = d.code_cv;
    // //         tepDamageRepairItm.code_type = d.code_type;
    // //         tepDamageRepairItm.action = "NEW";
    // //         tempEstPartItem.tep_damage_repair?.push(tepDamageRepairItm);
    // //       });
    // //       this.selectedTempEst?.template_est_part?.push(tempEstPartItem);
    // //     }
    // //   });
    // }
   
    //delete this.selectedTempEst!.totalMaterialCost;
    // this.estTempDS.UpdateMasterTemplate(this.selectedTempEst).subscribe(result => {
    //   var count = result.data.updateTemplateEstimation;
    //   if (count > 0) {
    //     this.handleSaveSuccess(count);
    //   }
    // });
  }

  updateData(newData: any[]): void {
    this.repList.data = [...newData];
    this.sotSelection.clear();
    this.ccForm?.get('repList')?.setErrors(null);
  }

  handleDelete(event: Event, row: any, index: number): void {
    this.deleteItem(row, index);
  }

  cancelItem(event: Event, row: RepairEstPartItem) {
    // this.id = row.id;
    if (this.sotSelection.hasValue()) {
      this.cancelSelectedRows(this.sotSelection.selected)
    } else {
      this.cancelSelectedRows([row])
    }
  }

  rollbackItem(event: Event, row: RepairEstPartItem) {
    // this.id = row.id;
    if (this.sotSelection.hasValue()) {
      this.rollbackSelectedRows(this.sotSelection.selected)
    } else {
      this.rollbackSelectedRows([row])
    }
  }

  undoAction(event: Event, row: RepairEstPartItem, action: string) {
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
    //this.addEstDetails(event, newSot);
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.langText.SAVE_SUCCESS;
      this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
        successMsg = res;
        ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
        //this.router.navigate(['/admin/master/estimate-template']);

        if(this.isFromBranch)
        {
          this.router.navigate(['/admin/master/customer/new/ '], {
            state: this.historyState

          }
          );
        }
        else{
          // Navigate to the route and pass the JSON object
          this.router.navigate(['/admin/master/billing-branch'], {
            state: this.historyState

          }
          );
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

  getGroupNameDescription(code_val:string): string | undefined{
    return this.cvDS.getCodeDescription(code_val, this.groupNameCvList);
  }
  getSubGroupNameDescription(code_val:string): string | undefined{
    return this.cvDS.getCodeDescription(code_val, this.allSubGroupNameCvList);
  }
  getYesNoDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.yesnoCvList);
  }

  getSoStatusDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.soTankStatusCvList);
  }

  displayTankPurpose(sot: StoringOrderTankItem) {
    let purposes: any[] = [];
    if (sot?.purpose_storage) {
      purposes.push(this.getPurposeOptionDescription('STORAGE'));
    }
    if (sot?.purpose_cleaning) {
      purposes.push(this.getPurposeOptionDescription('CLEANING'));
    }
    if (sot?.purpose_steam) {
      purposes.push(this.getPurposeOptionDescription('STEAM'));
    }
    if (sot?.purpose_repair_cv) {
      purposes.push(this.getPurposeOptionDescription(sot?.purpose_repair_cv));
    }
    return purposes.join('; ');
  }

  getPurposeOptionDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.purposeOptionCvList);
  }

  getTestTypeDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.testTypeCvList);
  }

  getTestClassDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.testClassCvList);
  }

  getDamageCodeDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.damageCodeCvList);
  }

  getRepairCodeDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.repairCodeCvList);
  }

  displayDamageRepairCode(damageRepair: any[], filterCode: number): string {
    return damageRepair.filter((x: any) => x.code_type === filterCode).map(item => {
      return item.code_cv;
    }).join('/');
  }

  displayDamageRepairCodeDescription(damageRepair: any[], filterCode: number): string {
    return damageRepair.filter((x: any) => x.code_type === filterCode).map(item => {
      const codeCv = item.code_cv;
      const description = `(${codeCv})` + (item.code_type == 0 ? this.getDamageCodeDescription(codeCv) : this.getRepairCodeDescription(codeCv));
      return description ? description : '';
    }).join('/');
  }

  displayDateTime(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateTimeStr(input);
  }

  displayDate(input: Date): string {
    return Utility.convertDateToStr(input);
  }

  getLastTest(igs: InGateSurveyItem | undefined): string | undefined {
    if (igs) {
      const test_type = igs.last_test_cv;
      const test_class = igs.test_class_cv;
      const testDt = igs.test_dt as number;
      return this.getTestTypeDescription(test_type) + " - " + Utility.convertEpochToDateStr(testDt, 'MM/YYYY') + " - " + this.getTestClassDescription(test_class);
    }
    return "";
  }

  GoBackPrevious(event: Event) {
    event.stopPropagation(); // Stop the click event from propagating
    // Navigate to the route and pass the JSON object
    if(this.isFromBranch)
    {
      this.router.navigate(['/admin/master/billing-branch'], {
        state: this.historyState

      }
      );
    }
    else
    {
      this.router.navigate(['/admin/master/customer/new/ '], {
        state: this.historyState

      }
      );
    }
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

  getCurrency(guid:string):CurrencyItem|undefined
  {
    if(this.currencyList?.length!>0 && guid)
    {
      const curItm= this.currencyList?.filter((x: any) => x.guid === guid).map(item => {
        return item;});
        if(curItm?.length!>0)
          return curItm![0];
        else
          return undefined;

    }
    return undefined;
    
  }
}