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
import { TariffLabourDS,TariffLabourItem } from 'app/data-sources/tariff-labour';
import { MasterEstimateTemplateDS, MasterTemplateItem, TemplateEstimateCustomerItem, TemplateEstPartItem, TepDamageRepairItem } from 'app/data-sources/master-template';
import { EstimateComponent } from 'app/admin/repair/estimate/estimate.component';
import { REPDamageRepairItem } from 'app/data-sources/rep-damage-repair';
import { TlxFormFieldComponent } from '@shared/components/tlx-form/tlx-form-field/tlx-form-field.component';

@Component({
  selector: 'app-estimate-new',
  standalone: true,
  templateUrl: './estimate-template-new.component.html',
  styleUrl: './estimate-template-new.component.scss',
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
export class EstimateTemplateNewComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
     'group_name_cv',
     'subgroup_name_cv',
     'damage',
    'repair',
    'description',
    'qty',
    'hour',
    'price',
     'material',
     'actions'
  ];
  pageTitleNew = 'MENUITEMS.REPAIR.LIST.ESTIMATE-NEW'
  pageTitleEdit = 'MENUITEMS.REPAIR.LIST.ESTIMATE-EDIT'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT',
    'MENUITEMS.REPAIR.LIST.ESTIMATE'
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
    RATE:"COMMON-FORM.RATE",
    TOTAL:"COMMON-FORM.TOTAL",
    NO_PARTS:"COMMON-FORM.NO-PARTS"
  }

  clean_statusList: CodeValuesItem[] = [];

  temp_guid?: string | null;

  tempForm?: UntypedFormGroup;
  sotForm?: UntypedFormGroup;

  selectedTempEst?:MasterTemplateItem;
  sotItem?: StoringOrderTankItem;
  storingOrderItem: StoringOrderItem = new StoringOrderItem();
  repList = new MatTableDataSource<RepairEstPartItem>();
  sotSelection = new SelectionModel<RepairEstPartItem>(true, []);
  customer_companyList?: CustomerCompanyItem[];
  groupNameCvList: CodeValuesItem[] = []
  subgroupNameCvList: CodeValuesItem[] = []
  yesnoCvList: CodeValuesItem[] = []
  soTankStatusCvList: CodeValuesItem[] = []
  purposeOptionCvList: CodeValuesItem[] = []
  testTypeCvList: CodeValuesItem[] = []
  testClassCvList: CodeValuesItem[] = []
  partLocationCvList: CodeValuesItem[] = []
  damageCodeCvList: CodeValuesItem[] = []
  repairCodeCvList: CodeValuesItem[] = []

  customerCodeControl = new UntypedFormControl();

  soDS: StoringOrderDS;
  sotDS: StoringOrderTankDS;
  cvDS: CodeValuesDS;
  ccDS: CustomerCompanyDS;
  tDS: TankDS;
  igDS: InGateDS;
  trLabourDS:TariffLabourDS;
  estTempDS:MasterEstimateTemplateDS

  trLabourItems:TariffLabourItem[]=[];
  historyState:any={};

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
    this.initTempForm();
    this.soDS = new StoringOrderDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.tDS = new TankDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.trLabourDS= new TariffLabourDS(this.apollo);
    this.estTempDS= new MasterEstimateTemplateDS(this.apollo);
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

  SetCostDecimal()
  {
    this.tempForm?.get('material_discount_amount')?.valueChanges.subscribe(value=>{
      if (value !== null && value !== '') {
        // Ensure the value has two decimal places
        const formattedValue = parseFloat(value).toFixed(2);
        this.tempForm?.get('material_discount_amount')?.setValue(formattedValue, { emitEvent: false });
        // this.tempForm.get('material_discount_amount').setValue(formattedValue, { emitEvent: false });
      }

    });
  }
  calculateCostSummary()
  {
    var totalMaterialCost:number=0;
    this.repList.data.forEach(data => {
      totalMaterialCost +=Number(data.tariff_repair?.material_cost??0);
    });

    this.tempForm?.patchValue({

      total_material_cost : Number(totalMaterialCost).toFixed(2)
     });

    //const totalCost= this.repList.data.reduce((total,part)=>total+(part.material_cost??0));
  }
 
  GetNetCost():string{
    var val:number=0;

    val = Number(this.tempForm?.get("total_cost")?.value) - Number(this.tempForm?.get("labour_discount_amount")?.value)-Number(this.tempForm?.get("material_discount_amount")?.value)
    return val.toFixed(2);
  }
   
  initializeValueChange()
  {
    //this.repList.data
    

    this.tempForm?.get('labour_total')!.valueChanges.subscribe(value=>{

      var discCostAmt:number=0;
      if(this.tempForm?.get('labour_discount')?.value>0)
      {
        discCostAmt = Number(this.tempForm?.get('labour_total')!.value)*Number(Number(this.tempForm?.get('labour_discount')?.value/100));
      }
      this.tempForm?.patchValue({
        total_cost: Number(Number(this.tempForm?.get('labour_total')!.value)+Number(this.tempForm?.get('total_material_cost')!.value)).toFixed(2),
        labour_discount_amount:discCostAmt.toFixed(2),
        
       });
    });

    this.tempForm?.get('total_cost')!.valueChanges.subscribe(value=>{

     
      this.tempForm?.patchValue({
        net_cost:this.GetNetCost()
       
        
       });
    });

    this.tempForm?.get('labour_rate')!.valueChanges.subscribe(value=>{

      this.tempForm?.patchValue({

        labour_total : (Number(this.tempForm?.get('labour_rate')?.value)+Number(this.tempForm?.get('labour_additional')?.value)).toFixed(2),
        
       });
    });
    this.tempForm?.get('labour_additional')!.valueChanges.subscribe(value=>{

      this.tempForm?.patchValue({
        labour_total :  (Number(this.tempForm?.get('labour_rate')?.value)+Number(this.tempForm?.get('labour_additional')?.value)).toFixed(2),
        
       });
    });

    this.tempForm?.get('labour_discount_amount')!.valueChanges.subscribe(value=>{

     
      this.tempForm?.patchValue({
        net_cost:this.GetNetCost()
       
        
       });
    });

    this.tempForm?.get('material_discount_amount')!.valueChanges.subscribe(value=>{

     
      this.tempForm?.patchValue({
        net_cost:this.GetNetCost()
       
        
       });
    });



    this.tempForm?.get('labour_discount')!.valueChanges.subscribe(value=>{

      var discCostAmt:number=0;
      if(this.tempForm?.get('labour_discount')?.value>0)
      {
        discCostAmt =Number(this.tempForm?.get('labour_rate')!.value)*Number(Number(this.tempForm?.get('labour_discount')?.value/100));
      }
      this.tempForm?.patchValue({
        labour_discount_amount:discCostAmt.toFixed(2),
        //net_cost:this.GetNetCost()
       });
    });


    this.tempForm?.get('material_discount')!.valueChanges.subscribe(value=>{

      var discCostAmt:number=0;
      if(this.tempForm?.get('material_discount')?.value>0)
      {
        discCostAmt = Number(this.tempForm?.get('total_material_cost')?.value)*Number(Number(this.tempForm?.get('material_discount')?.value/100));
      }
      this.tempForm?.patchValue({
        material_discount_amount:discCostAmt.toFixed(2),
       // net_cost:this.GetNetCost()
       });
    });

    this.tempForm?.get('total_material_cost')!.valueChanges.subscribe(value=>{

      var discCostAmt:number=0;
      if(this.tempForm?.get('material_discount')?.value>0)
      {
        discCostAmt = Number(this.tempForm?.get('total_material_cost')?.value)*Number(Number(this.tempForm?.get('material_discount')?.value/100));
      }
      this.tempForm?.patchValue({
        total_cost: Number(Number(this.tempForm?.get('labour_total')!.value)+Number(this.tempForm?.get('total_material_cost')!.value)).toFixed(2),
        material_discount_amount:discCostAmt.toFixed(2),
      
       });
    });

  }

  initTempForm() {
    this.tempForm = this.fb.group({
      guid: [''],
      customer_company_guid: [''],
      customer_code: this.customerCodeControl,
      template_name: [''],
      remarks: [''],
      repList:[''],
      labour_hour:['0'],
      labour_rate:['0.00'],
      labour_additional:['0.00'],
      labour_total:['0.00'],
      total_material_cost:['0.00'],
      total_cost:['0.00'],
      labour_discount:[0],
      material_discount:[0],
      labour_discount_amount:['0.00'],
      material_discount_amount:['0.00'],
      net_cost:['0.00']
    });
  }

  initializeFilter() {
  }

  public loadData() {
    this.historyState=history.state;
   
    if(this.historyState!=null)
    {
     
      this.selectedTempEst = this.historyState.selectedRow;
      this.tempForm?.patchValue({
        guid: this.selectedTempEst?.guid,
       // customer_code: this.GetCustomerCompanyForDownDrop(this.selectedTempEst?.template_est_customer!),
        template_name: this.selectedTempEst?.template_name,
        remarks: this.selectedTempEst?.remarks,
      });
      var repairEstPartItem:RepairEstPartItem[]=[];
      repairEstPartItem = this.selectedTempEst?.template_est_part
    ?.filter((item: Partial<TemplateEstPartItem> | undefined): item is Partial<TemplateEstPartItem> => item !== undefined)
    .map((item: Partial<TemplateEstPartItem>) => {
        // Transform the Partial<TemplateEstPartItem> into a RepairEstPartItem
        return {
            // Assuming the RepairEstPartItem structure, map fields accordingly:
            actions: [],  // Use default values if fields are missing
            create_by:item.create_by,
            create_dt:item.create_dt,
            description:item.description,
            guid:item.guid,
            hour:item.hour,
            location_cv:item.location_cv,
            material_cost:item.tariff_repair?.material_cost,
            qty:item.quantity,
            remarks:item.remarks,
            repair_est:undefined,
            repair_est_guid:undefined,
            tariff_repair:item.tariff_repair,
            tariff_repair_guid:item.tariff_repair_guid,
            update_by:item.update_by,
            update_dt:item.update_dt,
            repair:this.GetRepairOrDamage(item.tep_damage_repair!,0),
            damage:this.GetRepairOrDamage(item.tep_damage_repair!,1),
            // Map other fields as needed
        } as RepairEstPartItem;
    }) ?? []; // Use an empty array as a fallback if template_est_part is undefined
      this.populateSOT(repairEstPartItem!)
    }

    this.temp_guid = this.route.snapshot.paramMap.get('id');
    if (this.temp_guid?.trim()=='') {
      this.temp_guid = undefined;
    }

    this.subs.sink = this.ccDS.loadItems({}, { code: 'ASC' },20).subscribe(data => {
      this.customer_companyList = data
      if(data.length)
      {
        const selectedCustomerGuids = this.selectedTempEst?.template_est_customer?.map(customer => customer.customer_company_guid);
        const selectedCustomers = data.filter(customer =>
          selectedCustomerGuids?.includes(customer.guid)
        );

        this.tempForm?.patchValue({
          customer_code: selectedCustomers
        });
        // this.tempForm?.patchValue({
        //   customer_code: this.GetCustomerCompanyForDownDrop(this.selectedTempEst?.template_est_customer!),
        // });
      }
    });

    this.trLabourDS.SearchTariffLabour({},{create_dt:'ASC'}).subscribe(data=>{
      this.trLabourItems=data;
      if(this.trLabourItems.length>0)
      {
        this.tempForm?.patchValue({
          labour_rate:this.trLabourItems[0].cost?.toFixed(2)
        });
      }
    })

 
    const queries = [
      { alias: 'groupNameCv', codeValType: 'GROUP_NAME' },
      { alias: 'yesnoCv', codeValType: 'YES_NO' },
      { alias: 'soTankStatusCv', codeValType: 'SO_TANK_STATUS' },
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'testTypeCv', codeValType: 'TEST_TYPE' },
      { alias: 'testClassCv', codeValType: 'TEST_CLASS' },
      { alias: 'partLocationCv', codeValType: 'PART_LOCATION' },
      { alias: 'damageCodeCv', codeValType: 'DAMAGE_CODE' },
      { alias: 'repairCodeCv', codeValType: 'REPAIR_CODE' },
    ];
    this.cvDS.getCodeValuesByType(queries);

    this.cvDS.connectAlias('groupNameCv').subscribe(data => {
      this.groupNameCvList = data;
    });
    this.cvDS.connectAlias('yesnoCv').subscribe(data => {
      this.yesnoCvList = data;
    });
    this.cvDS.connectAlias('soTankStatusCv').subscribe(data => {
      this.soTankStatusCvList = data;
    });
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      this.purposeOptionCvList = data;
    });
    this.cvDS.connectAlias('testTypeCv').subscribe(data => {
      this.testTypeCvList = data;
    });
    this.cvDS.connectAlias('testClassCv').subscribe(data => {
      this.testClassCvList = data;
    });
    this.cvDS.connectAlias('partLocationCv').subscribe(data => {
      this.partLocationCvList = data;
    });
    this.cvDS.connectAlias('damageCodeCv').subscribe(data => {
      this.damageCodeCvList = data;
    });
    this.cvDS.connectAlias('repairCodeCv').subscribe(data => {
      this.repairCodeCvList = data;
    });
  }

  // GetCustomerCompanyForDownDrop(customerCompanyList:TemplateEstimateCustomerItem[]):any[]
  // {
  //   var result :any =customerCompanyList?.filter((item: Partial<TemplateEstimateCustomerItem> | undefined): item is Partial<TemplateEstimateCustomerItem> => item !== undefined)
  //   .map((item: Partial<TemplateEstimateCustomerItem>) => {
  //       // Transform the Partial<TemplateEstPartItem> into a RepairEstPartItem
  //       return {
  //         guid : item.customer_company?.guid,
  //         code : item.customer_company?.code,
  //         name : item.customer_company?.name,
  //       } as any;
  //   }) ?? [];

  //   return result;
  // }
  GetRepairOrDamage(repairDamageList:TepDamageRepairItem[],codeType:Number):any[]
  {
    var retval:any[]=[];

    var result=repairDamageList.filter( (item)=>item.code_type==codeType)
    retval = result?.filter((item: Partial<TepDamageRepairItem> | undefined): item is Partial<TepDamageRepairItem> => item !== undefined)
    .map((item: Partial<TepDamageRepairItem>) => {
        // Transform the Partial<TemplateEstPartItem> into a RepairEstPartItem
        return {
          guid : item.guid,
          rep_guid : item.tep_guid,
          code_cv : item.code_cv,
          create_dt : item.create_dt,
          code_type : item.code_type,
          create_by : item.create_by,
          update_dt : item.update_dt,
          update_by : item.update_by,
          delete_dt : item.delete_dt,
        } as RepairEstPartItem;
    }) ?? []; // Use an empty array as a fallback if template_est_part is undefined
    return retval;

  }
  // populateSOForm(so: StoringOrderItem): void {
  //   this.tempForm!.patchValue({
  //     guid: so.guid,
  //     customer_code: so.customer_company,
  //     customer_company_guid: '',//so.customer_company_guid,
  //     so_no: so.so_no,
  //     so_notes: so.so_notes,
  //     haulier: so.haulier
  //   });
  //   if (so.storing_order_tank) {
  //     this.populateSOT(so.storing_order_tank);
  //   }
  // }

  populateSOT(rep: any[]) {
    if (rep?.length) {
      const repList: RepairEstPartItem[] = rep.map((item: Partial<RepairEstPartItem> | undefined) => new RepairEstPartItem(item));
      this.updateData(repList);
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

  addEstDetails(event: Event, row?: RepairEstPartItem) {
    this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const addSot = row ?? new RepairEstPartItem();
    addSot.repair_est_guid = addSot.repair_est_guid;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        item: row ? row : addSot,
        action: 'new',
        translatedLangText: this.translatedLangText,
        populateData: {
          groupNameCvList: this.groupNameCvList,
          subgroupNameCvList: [],
          yesnoCvList: this.yesnoCvList,
          partLocationCvList: this.partLocationCvList,
          damageCodeCvList: this.damageCodeCvList,
          repairCodeCvList: this.repairCodeCvList
        },
        index: -1,
        customer_company_guid: '' //this.sotItem?.storing_order?.customer_company_guid
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data = [...this.repList.data];
        const newItem = new RepairEstPartItem({
          ...result.item,
        });
        data.push(newItem);

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
          groupNameCvList: this.groupNameCvList,
          subgroupNameCvList: [],
          yesnoCvList: this.yesnoCvList,
          partLocationCvList: this.partLocationCvList,
          damageCodeCvList: this.damageCodeCvList,
          repairCodeCvList: this.repairCodeCvList
        },
        index: index,
        customer_company_guid: this.sotItem?.storing_order?.customer_company_guid
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data = [...this.repList.data];
        const updatedItem = new RepairEstPartItem({
          ...result.item,
        });
        if (result.index >= 0) {
          data[result.index] = updatedItem;
          this.updateData(data);
        } else {
          this.updateData([...this.repList.data, result.item]);
        }
        this.calculateCostSummary();

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
        if (result.item.guid) {
          const data = [...this.repList.data];
          const updatedItem = {
            ...result.item,
            delete_dt: Utility.getDeleteDtEpoch(),
            actions: Array.isArray(data[index].actions!)
              ? [...new Set([...data[index].actions!, 'delete'])]
              : ['delete']
          };
          data[result.index] = updatedItem;
          this.updateData(data); // Refresh the data source
        } else {
          const data = [...this.repList.data];
          data.splice(index, 1);
          this.updateData(data); // Refresh the data source
        }
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
        const data = [...this.repList.data];
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
        const data = [...this.repList.data];
        result.item.forEach((newItem: RepairEstPartItem) => {
          const index = data.findIndex(existingItem => existingItem.guid === newItem.guid);

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
    const data = [...this.repList.data];
    row.forEach((newItem: RepairEstPartItem) => {
      const index = data.findIndex(existingItem => existingItem.guid === newItem.guid);

      if (index !== -1) {
        data[index] = {
          ...data[index],
          ...newItem,
          actions: Array.isArray(data[index].actions!)
            ? data[index].actions!.filter(action => action !== actionToBeRemove)
            : []
        };
      }
    });
    this.updateData(data);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.sotSelection.selected.length;
    const numRows = this.storingOrderItem.storing_order_tank?.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.sotSelection.clear()
      : this.repList.data?.forEach((row) =>
        this.sotSelection.select(row)
      );
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

  onTempFormSubmit() {
    this.tempForm!.get('repList')?.setErrors(null);
    if (this.tempForm?.valid) {
      if (!this.repList.data.length) {
        this.tempForm.get('repList')?.setErrors({ required: true });
      } else {

            var tempName = this.tempForm?.get("template_name")?.value;
            const where: any = {};
            where.template_name={eq:tempName};
            this.estTempDS.SearchEstimateTemplateOnly(where).subscribe(result=>{

            if(result.length==0 &&  this.temp_guid==undefined)
            {
              let temp: MasterTemplateItem = new MasterTemplateItem();
              temp.labour_cost_discount=this.tempForm?.get("labour_discount")?.value;
              temp.material_cost_discount=this.tempForm?.get("material_discount")?.value;
              temp.template_name=this.tempForm?.get("template_name")?.value;
              delete temp.totalMaterialCost;
              temp.type_cv="general";
              if(this.tempForm?.get("customer_code")?.value?.length>0)
              {
                
                temp.type_cv="exclusive";
                var customerCodes : CustomerCompanyItem[] = this.tempForm?.get("customer_code")?.value;
                temp.template_est_customer=[];
                customerCodes.forEach(data=>{
                  var custItem:TemplateEstimateCustomerItem = new TemplateEstimateCustomerItem();
                  custItem.action="NEW";
                  custItem.customer_company_guid=data.guid;
                  custItem.customer_company=undefined;
                  custItem.guid="";
                  temp.template_est_customer?.push(custItem)
                });
              }
              if(this.repList.data.length)
              {
                temp.template_est_part=[];
                this.repList.data.forEach(data=>{
                  var repEstItem:RepairEstPartItem = data;
                  var tempEstPartItem : TemplateEstPartItem= new TemplateEstPartItem();
                  tempEstPartItem.action="NEW";
                  tempEstPartItem.guid= "";
                  tempEstPartItem.tariff_repair_guid=data.tariff_repair_guid;
                  tempEstPartItem.hour=repEstItem.hour;
                  tempEstPartItem.quantity=repEstItem.qty;
                  tempEstPartItem.location_cv=repEstItem.location_cv;
                  tempEstPartItem.remarks=repEstItem.remarks;
                  tempEstPartItem.description=repEstItem.description;
                  tempEstPartItem.tep_damage_repair=[];
                  let dmg :REPDamageRepairItem[] = repEstItem.damage;
                  dmg.forEach(d=>{
                    let tepDamageRepairItm :TepDamageRepairItem= new TepDamageRepairItem();
                    tepDamageRepairItm.code_cv=d.code_cv;
                    tepDamageRepairItm.code_type=d.code_type;
                    tepDamageRepairItm.action="NEW";
                    tempEstPartItem.tep_damage_repair?.push(tepDamageRepairItm);
                  });
                  let rpr :REPDamageRepairItem[] = repEstItem.repair;
                  rpr.forEach(r=>{
                    let tepDamageRepairItm :TepDamageRepairItem= new TepDamageRepairItem();
                    tepDamageRepairItm.code_cv=r.code_cv;
                    tepDamageRepairItm.code_type=r.code_type;
                    tepDamageRepairItm.action="NEW";
                    tempEstPartItem.tep_damage_repair?.push(tepDamageRepairItm);
                  });
                  temp.template_est_part?.push(tempEstPartItem);
                  // data.
                  // tempEstPartItem.tep_damage_repair?.push()
                  // temp.template_est_part?.push()
                });  
              }

              this.estTempDS.AddMasterTemplate(temp).subscribe(result=>{
                var count =result.data.addTemplateEstimation;
                if(count>0)
                {
                  this.handleSaveSuccess(count);
                }
              });
            }
            else if(result.length>0 &&  this.temp_guid?.trim()=="")
            {
              this.tempForm?.get('template_name')?.setErrors({ existed: true });

            }
            
        });
        
        // let so: StoringOrderGO = new StoringOrderGO(this.storingOrderItem);
        // so.customer_company_guid = this.tempForm.value['customer_company_guid'];
        // so.haulier = this.tempForm.value['haulier'];
        // so.so_notes = this.tempForm.value['so_notes'];

        // const sot: StoringOrderTankGO[] = this.repList.data.map((item: Partial<StoringOrderTankItem>) => {
        //   // Ensure action is an array and take the last action only
        //   const actions = Array.isArray(item!.actions) ? item!.actions : [];
        //   const latestAction = actions.length > 0 ? actions[actions.length - 1] : '';

        //   return new StoringOrderTankUpdateSO({
        //     ...item,
        //     action: latestAction // Set the latest action as the single action
        //   });
        // });
        // console.log('so Value', so);
        // console.log('sot Value', sot);
        // if (so.guid) {
        //   this.soDS.updateStoringOrder(so, sot).subscribe(result => {
        //     console.log(result)
        //     this.handleSaveSuccess(result?.data?.updateStoringOrder);
        //   });
        // } else {
        //   this.soDS.addStoringOrder(so, sot).subscribe(result => {
        //     console.log(result)
        //     this.handleSaveSuccess(result?.data?.addStoringOrder);
        //   });
        // }
      }
    } else {
      console.log('Invalid soForm', this.tempForm?.value);
    }
  }

  updateData(newData: RepairEstPartItem[]): void {
    this.repList.data = [...newData];
    this.sotSelection.clear();
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
    this.addEstDetails(event, newSot);
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.langText.SAVE_SUCCESS;
      this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
        successMsg = res;
        ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
        //this.router.navigate(['/admin/master/estimate-template']);
       
        // Navigate to the route and pass the JSON object
           this.router.navigate(['/admin/master/estimate-template'], {
             state:  this.historyState
               
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

  displayDamageRepairCode(damageRepair: any[]): string {
    return damageRepair.map(item => {
      return item.code_cv;
    }).join('/');
  }

  displayDamageRepairCodeDescription(damageRepair: any[]): string {
    return damageRepair.map(item => {
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

  GoBackPrevious(event:Event)
  {
    event.stopPropagation(); // Stop the click event from propagating
 // Navigate to the route and pass the JSON object
    this.router.navigate(['/admin/master/estimate-template'], {
      state:  this.historyState
        
      }
    );
  }
}