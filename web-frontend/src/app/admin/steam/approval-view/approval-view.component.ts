import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag, CdkDragHandle, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
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
import { StoringOrderTank, StoringOrderTankDS, StoringOrderTankGO, StoringOrderTankItem, StoringOrderTankUpdateSO } from 'app/data-sources/storing-order-tank';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values'
import { CustomerCompanyDS, CustomerCompanyGO, CustomerCompanyItem } from 'app/data-sources/customer-company'
import { MatRadioModule } from '@angular/material/radio';
import { Apollo } from 'apollo-angular';
import { MatDividerModule } from '@angular/material/divider';
import { StoringOrderDS, StoringOrderGO, StoringOrderItem } from 'app/data-sources/storing-order';
import { Observable, of, Subscription } from 'rxjs';
import { TankDS, TankItem } from 'app/data-sources/tank';
import { TariffCleaningDS } from 'app/data-sources/tariff-cleaning'
import { ComponentUtil } from 'app/utilities/component-util';
import { CancelFormDialogComponent } from './dialogs/cancel-form-dialog/cancel-form-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { InGateDS } from 'app/data-sources/in-gate';
import { InGateSurveyItem } from 'app/data-sources/in-gate-survey';
import { RepairPartDS, RepairPartItem } from 'app/data-sources/repair-part';
import { TlxFormFieldComponent } from '@shared/components/tlx-form/tlx-form-field/tlx-form-field.component';
import { PackageLabourDS, PackageLabourItem } from 'app/data-sources/package-labour';
import { RepairDS, RepairGO, RepairItem } from 'app/data-sources/repair';
import { MasterEstimateTemplateDS, MasterTemplateItem } from 'app/data-sources/master-template';
import { RPDamageRepairGO, RPDamageRepairItem } from 'app/data-sources/rp-damage-repair';
import { PackageRepairDS, PackageRepairItem } from 'app/data-sources/package-repair';
import { UserDS, UserItem } from 'app/data-sources/user';
import { PackageResidueDS, PackageResidueItem } from 'app/data-sources/package-residue';
import { ResidueDS, ResidueGO, ResidueItem, ResidueStatusRequest } from 'app/data-sources/residue';
import { ResidueEstPartGO, ResiduePartItem } from 'app/data-sources/residue-part';
import { TariffResidueItem } from 'app/data-sources/tariff-residue';
import {SteamDS,SteamItem, SteamStatusRequest,SteamPartRequest} from 'app/data-sources/steam';
import {SteamPartItem} from 'app/data-sources/steam-part';
@Component({
  selector: 'app-estimate-new',
  standalone: true,
  templateUrl: './approval-view.component.html',
  styleUrl: './approval-view.component.scss',
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
    TlxFormFieldComponent
  ]
})
export class SteamApprovalViewComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'seq',
    // 'group_name_cv',
     'desc',
     'qty',
     'unit_price',
     'hour',
     'cost',
     'approve_part',
     //"actions"
   
  ];
  pageTitleDetails = 'MENUITEMS.STEAM.LIST.STEAM-APPROVAL'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT',
    'MENUITEMS.STEAM.LIST.STEAM-APPROVAL'
  ]
  translatedLangText: any = {}
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.HEADER',
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    SO_NO: 'COMMON-FORM.SO-NO',
    TANK_DETAILS: 'COMMON-FORM.TANK-DETAILS',
    UNIT_TYPE: 'COMMON-FORM.UNIT-TYPE',
    TANK_NO: 'COMMON-FORM.TANK-NO',
    PURPOSE: 'COMMON-FORM.PURPOSE',
    STORAGE: 'COMMON-FORM.STORAGE',
    STEAM: 'COMMON-FORM.STEAM',
    CLEANING: 'COMMON-FORM.CLEANING',
    REPAIR: 'COMMON-FORM.REPAIR',
    LAST_CARGO: 'COMMON-FORM.LAST-CARGO',
    JOB_NO: 'COMMON-FORM.JOB-NO',
    REMARKS: 'COMMON-FORM.REMARKS',
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
    CONFIRM: 'COMMON-FORM.CONFIRM',
    UNDO: 'COMMON-FORM.UNDO',
    INVALID_SELECTION: 'COMMON-FORM.INVALID-SELECTION',
    EXCEEDED: 'COMMON-FORM.EXCEEDED',
    OWNER: 'COMMON-FORM.OWNER',
    EIR_NO: 'COMMON-FORM.EIR-NO',
    EIR_DATE: 'COMMON-FORM.EIR-DATE',
    LAST_TEST: 'COMMON-FORM.LAST-TEST',
    NEXT_TEST: 'COMMON-FORM.NEXT-TEST',
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
    MATERIAL_COST: 'COMMON-FORM.MATERIAL-COST$',
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
    RATE: 'COMMON-FORM.RATE',
    LESSEE: 'COMMON-FORM.LESSEE',
    TOTAL: 'COMMON-FORM.TOTAL',
    PART: 'COMMON-FORM.PART',
    FILTER: 'COMMON-FORM.FILTER',
    DEFAULT: 'COMMON-FORM.DEFAULT',
    COMMENT: 'COMMON-FORM.COMMENT',
    EXPORT: 'COMMON-FORM.EXPORT',
    ADD_ANOTHER: 'COMMON-FORM.ADD-ANOTHER',
    SAVE: 'COMMON-FORM.SAVE',
    ADD_SUCCESS: 'COMMON-FORM.ADD-SUCCESS',
    ESTIMATE_DATE: 'COMMON-FORM.ESTIMATE-DATE',
    DUPLICATE_PART_DETECTED: 'COMMON-FORM.DUPLICATE-PART-DETECTED',
    BILLING_PROFILE:'COMMON-FORM.BILLING-PROFILE',
    BILLING_TO:'COMMON-FORM.BILLING-TO',
    BILLING_BRANCH:'COMMON-FORM.BILLING-BRANCH',
    DEPOT_REFERENCE:'COMMON-FORM.DEPOT-REFERENCE',
    QUANTITY:'COMMON-FORM.QTY',
    UNIT_PRICE:'COMMON-FORM.UNIT-PRICE',
    COST:'COMMON-FORM.COST',
    APPROVE: 'COMMON-FORM.APPROVE',
    NO_ACTION: 'COMMON-FORM.NO-ACTION',
    ROLLBACK: 'COMMON-FORM.ROLLBACK',
    ROLLBACK_SUCCESS: 'COMMON-FORM.ROLLBACK-SUCCESS',
    JOB_REFERENCE:"COMMON-FORM.JOB-REFERENCE"
  }

  clean_statusList: CodeValuesItem[] = [];

  sot_guid?: string | null;
  repair_guid?: string | null;

  steamEstForm?: UntypedFormGroup;
  sotForm?: UntypedFormGroup;

  sotItem?: StoringOrderTankItem;
  steamItem?:SteamItem;
  repairEstItem?: RepairItem;
  packageLabourItem?: PackageLabourItem;
  repList: RepairPartItem[] = [];
  groupNameCvList: CodeValuesItem[] = []
  subgroupNameCvList: CodeValuesItem[] = []
  yesnoCvList: CodeValuesItem[] = []
  soTankStatusCvList: CodeValuesItem[] = []
  purposeOptionCvList: CodeValuesItem[] = []
  testTypeCvList: CodeValuesItem[] = []
  testClassCvList: CodeValuesItem[] = []
  partLocationCvList: CodeValuesItem[] = []
  // damageCodeCvList: CodeValuesItem[] = []
  // repairCodeCvList: CodeValuesItem[] = []
  unitTypeCvList: CodeValuesItem[] = []
  templateList: MasterTemplateItem[] = []
  surveyorList: UserItem[] = []
  billingBranchList:CustomerCompanyItem[]=[];
  packResidueList:PackageResidueItem[]=[];
  displayPackResidueList:PackageResidueItem[]=[];
  deList:any[]=[];
  

  customerCodeControl = new UntypedFormControl();

  sotDS: StoringOrderTankDS;
  cvDS: CodeValuesDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  plDS: PackageLabourDS;
  // repairEstDS: RepairDS;
  // repairEstPartDS: RepairPartDS;
  steamDs:SteamDS;
  
  mtDS: MasterEstimateTemplateDS;
  // prDS: PackageRepairDS;
  
  packResidueDS:PackageResidueDS;

  // userDS: UserDS;
  isOwner = false;

  isDuplicate = false;

  historyState: any = {};
  updateSelectedItem:any=undefined;
  editRow ={ qty:new FormControl('0'), cost :new FormControl('0'),labour:new FormControl('0'),index:0}; 
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
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
     this.plDS = new PackageLabourDS(this.apollo);
    // this.repairEstDS = new RepairDS(this.apollo);
    // this.repairEstPartDS = new RepairPartDS(this.apollo);
    this.mtDS = new MasterEstimateTemplateDS(this.apollo);
    // this.prDS = new PackageRepairDS(this.apollo);
    // this.userDS = new UserDS(this.apollo);
    this.packResidueDS= new PackageResidueDS(this.apollo);
    this.steamDs=new SteamDS(this.apollo);

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
    console.log('initForm');
    this.steamEstForm = this.fb.group({
      guid: [''],
      customer_code:[''],
      billing_branch:[''],
      job_no:[''],
      est_template: [''],
      is_default_template: [''],
      remarks: [''],
      surveyor_id: [''],
      labour_cost_discount: [0],
      material_cost_discount: [0],
      last_test: [''],
      next_test: [''],
      desc:[''],
      qty:[''],
      unit_price:[''],
   
      deList: ['']
    });
  }

  initializeValueChanges() {
   

    console.log('initializeValueChanges');
    this.steamEstForm?.get('desc')?.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var desc_value = this.steamEstForm?.get("desc")?.value;
        this.displayPackResidueList= this.packResidueList.filter(data=> data.description && data.description.includes(desc_value));
        if(!desc_value) this.displayPackResidueList= [...this.packResidueList];
        else if(typeof desc_value==='object' && this.updateSelectedItem===undefined)
        {
          this.steamEstForm?.patchValue({

             unit_price: desc_value?.cost.toFixed(2)
          });
        }

      })
    ).subscribe();
  }

  public loadData() {
    const queries = [
      { alias: 'groupNameCv', codeValType: 'GROUP_NAME' },
      { alias: 'yesnoCv', codeValType: 'YES_NO' },
      { alias: 'soTankStatusCv', codeValType: 'SO_TANK_STATUS' },
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'testTypeCv', codeValType: 'TEST_TYPE' },
      { alias: 'testClassCv', codeValType: 'TEST_CLASS' },
      { alias: 'partLocationCv', codeValType: 'PART_LOCATION' },
      // { alias: 'damageCodeCv', codeValType: 'DAMAGE_CODE' },
      // { alias: 'repairCodeCv', codeValType: 'REPAIR_CODE' },
      { alias: 'unitTypeCv', codeValType: 'UNIT_TYPE' },
    ];
    this.cvDS.getCodeValuesByType(queries);

    
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
    // this.cvDS.connectAlias('damageCodeCv').subscribe(data => {
    //   this.damageCodeCvList = data;
    // });
    // this.cvDS.connectAlias('repairCodeCv').subscribe(data => {
    //   this.repairCodeCvList = data;
    // });
    this.cvDS.connectAlias('unitTypeCv').subscribe(data => {
      this.unitTypeCvList = data;
    });


    //this.getSurveyorList();

    this.sot_guid = this.route.snapshot.paramMap.get('id');
   //this.repair_guid = this.route.snapshot.paramMap.get('repair_est_id');

    this.route.data.subscribe(routeData => {
      this.isDuplicate = routeData['action'] === 'duplicate';
      this.loadHistoryState();
    });
  }

  getCustomerLabourPackage(customer_company_guid: string) {
    const where = {
      and: [
        { customer_company_guid: { eq: customer_company_guid } }
      ]
    }
    this.subs.sink = this.plDS.getCustomerPackageCost(where).subscribe(data => {
      if (data?.length > 0) {
        this.packageLabourItem = data[0];
      }
    });
  }

  getCustomer() {
    return this.sotItem?.storing_order?.customer_company;
  }


  // getCustomerCost(customer_company_guid: string | undefined, tariff_repair_guid: string[] | undefined) {
  //   const where = {
  //     and: [
  //       { customer_company_guid: { eq: customer_company_guid } },
  //       {
  //         or: [
  //           { tariff_repair_guid: { in: tariff_repair_guid } }
  //         ]
  //       }
  //     ]
  //   };

  //   return this.prDS.getCustomerPackageCost(where);
  // }

 

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
  }

 


  checkCompulsoryEst(fields:string[])
  {
    fields.forEach(name=>{
    if( !this.steamEstForm?.get(name)?.value)
      {
        this.steamEstForm?.get(name)?.setErrors({ required: true });
        this.steamEstForm?.get(name)?.markAsTouched(); // Trigger validation display
      }
    });
  }

  deleteItem(event: Event, row: ResiduePartItem, index: number) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '1000px',
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
          const data: any[] = [...this.deList];
          const updatedItem = {
            ...result.item,
            delete_dt: Utility.getDeleteDtEpoch(),
            action: 'cancel'
          };
          data[result.index] = updatedItem;
          this.updateData(data); // Refresh the data source
        } else {
          const data = [...this.deList];
          data.splice(index, 1);
          this.updateData(data); // Refresh the data source
        }

        this.resetSelectedItemForUpdating();
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
      width: '1000px',
      data: {
        action: "cancel",
        item: [...row],
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const data: any[] = [...this.repList];
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
      width: '1000px',
      data: {
        action: "rollback",
        item: [...row],
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const data: any[] = [...this.repList];
        result.item.forEach((newItem: RepairPartItem) => {
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

  undoTempAction(row: any[], actionToBeRemove: string) {
    const data: any[] = [...this.repList];
    row.forEach((newItem: any) => {
      const index = data.findIndex(existingItem => existingItem.guid === newItem.guid);

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

  

  updateData(newData: SteamPartItem[] | undefined): void {
    if (newData?.length) {
      this.deList = newData.map((row, index) => ({
        ...row,
        approve_labour: (this.steamItem?.status_cv==='PENDING')?row.labour:(row.approve_labour?row.approve_labour:row.labour),
        approve_cost: (this.steamItem?.status_cv==='PENDING')?row.cost:(row.approve_cost?row.approve_cost:row.cost),
        approve_qty:(this.steamItem?.status_cv==='PENDING')?row.quantity:(row.approve_qty?row.approve_qty:row.quantity),
        index: index
      }));
      
      //this.calculateCost();
    }
    else
    {
      this.deList=[];
      
    }
  }

  handleDelete(event: Event, row: any, index: number): void {
    this.deleteItem(event, row, index);
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
        this.router.navigate(['/admin/steam/approval'], {
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

  isOwnerChange() {
    this.isOwner = !this.isOwner;
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

 

  sortAndGroupByGroupName(repList: any[]): any[] {
    const groupedRepList: any[] = [];
    let currentGroup = '';

    const sortedList = repList.sort((a, b) => {
      if (a.tariff_repair!.sequence !== b.tariff_repair.sequence) {
        return a.tariff_repair.sequence - b.tariff_repair.sequence;
      }

      if (a.tariff_repair.subgroup_name_cv !== b.tariff_repair.subgroup_name_cv) {
        if (!a.tariff_repair.subgroup_name_cv) return 1;
        if (!b.tariff_repair.subgroup_name_cv) return -1;

        return a.tariff_repair.subgroup_name_cv.localeCompare(b.tariff_repair.subgroup_name_cv);
      }

      return b.create_dt! - a.create_dt!;
    });

    sortedList.forEach(item => {
      const groupName = item.tariff_repair.group_name_cv;

      const isGroupHeader = groupName !== currentGroup;

      if (isGroupHeader) {
        currentGroup = groupName;
      }

      groupedRepList.push({
        ...item,
        isGroupHeader: isGroupHeader,
        group_name_cv: item.tariff_repair.group_name_cv,
        subgroup_name_cv: item.tariff_repair.subgroup_name_cv,
      });
    });

    return groupedRepList;
  }

  sortREP(newData: RepairPartItem[]): any[] {
    newData.sort((a, b) => b.create_dt! - a.create_dt!);
    return newData;
  }

  displayDamageRepairCode(damageRepair: any[], filterCode: number): string {
    return damageRepair?.filter((x: any) => x.code_type === filterCode && !x.delete_dt && x.action !== 'cancel').map(item => {
      return item.code_cv;
    }).join('/');
  }

  

  displayDateTime(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateTimeStr(input);
  }

  displayDate(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input);
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

  getNextTest(igs: InGateSurveyItem | undefined): string | undefined {
    if (igs && igs.next_test_cv && igs.test_dt) {
      const test_type = igs.last_test_cv;
      const match = test_type?.match(/^[0-9]*\.?[0-9]+/);
      const yearCount = parseFloat(match ? match[0] : "0");
      const resultDt = Utility.addYearsToEpoch(igs.test_dt as number, yearCount);
      return this.getTestTypeDescription(igs.next_test_cv) + " - " + Utility.convertEpochToDateStr(resultDt, 'MM/YYYY');
    }
    return "";
  }

  selectText(event: FocusEvent) {
    Utility.selectText(event)
  }

  parse2Decimal(figure: number | string) {
    if (typeof (figure) === 'string') {
      return parseFloat(figure).toFixed(2);
    } else if (typeof (figure) === 'number') {
      return figure.toFixed(2);
    }
    return "";
  }

  
  canExport(): boolean {
    return !!this.repair_guid;
  }

  getLabourCost(): number | undefined {
    return this.repairEstItem?.labour_cost || this.packageLabourItem?.cost;
  }

  getPackageSteam()
  {
    // let where:any={};
    // let custCompanyGuid:string = this.sotItem?.storing_order?.customer_company?.guid!;
    // where.customer_company_guid = {eq:custCompanyGuid};

    // this.packResidueDS.SearchPackageResidue(where,{}).subscribe(data=>{

    //   this.packResidueList=data;
    //   this.displayPackResidueList=data;
    // });

  }

  loadBillingBranch()
  {
    let where:any={};
    let custCompanyGuid:string = this.sotItem?.storing_order?.customer_company?.guid!;
    if(custCompanyGuid)
    {
      where.main_customer_guid = {eq:custCompanyGuid};

      this.ccDS.search(where,{}).subscribe(data=>{
        var def =this.createDefaultCustomerCompany("--Select--","");

        this.billingBranchList=[def, ...data];;

        this.patchSteamEstForm(this.steamItem!);
        console.log('loadBillingBranch-1');
      });
    }
    else
    {
      var def =this.createDefaultCustomerCompany("--Select--","");
      this.billingBranchList=[];
      this.billingBranchList.push(def);
      this.patchSteamEstForm(this.steamItem!);
      console.log('loadBillingBranch-2');
    }

  }

  loadHistoryState()
  {
    this.historyState = history.state;

    if (this.historyState.selectedRow != null) {

      this.steamItem=this.historyState.selectedRow;
      this.sotItem = this.steamItem?.storing_order_tank;
      
     // this.getPackageSteam();
      this.loadBillingBranch();
      var ccGuid = this.sotItem?.storing_order?.customer_company?.guid;
      this.getCustomerLabourPackage(ccGuid!);
      
      
    }
  }

  patchSteamEstForm(steam:SteamItem)
  {
    let billingGuid= "";
    if(steam)
    {
      billingGuid=steam.bill_to_guid!;
    }
    this.populateSteamPartList(steam);
    this.steamEstForm?.patchValue({

      customer_code : this.ccDS.displayName(this.sotItem?.storing_order?.customer_company),
      job_no:steam?steam.job_no:this.sotItem?.job_no,
       billing_branch:this.getBillingBranch(billingGuid),
       remarks:steam?.remarks

    });
  }

  getBillingBranch(billingGuid:string):CustomerCompanyItem
  {
    let ccItem:CustomerCompanyItem= this.billingBranchList[0] ;
     let ccItems=this.billingBranchList.filter(data=>data.guid==billingGuid);

     if(ccItems.length>0)
     {
       ccItem=ccItems[0]!;
     }

     return ccItem;

  }
  createDefaultCustomerCompany(code:string, name:string):CustomerCompanyItem
  {
    let ccItem:CustomerCompanyItem=new CustomerCompanyItem();
    ccItem.code=code;
    ccItem.name=name;
    return ccItem

  }

  displayResiduePart(cc: any): string {
    return cc && cc.tariff_residue ? cc.tariff_residue.description : '';
  }

  

  resetValue(){

    this.steamEstForm?.patchValue({
      desc:'',
      qty:'',
      unit_price:''
    },{emitEvent:false});
    this.steamEstForm?.get('desc')?.setErrors(null);
    this.steamEstForm?.get('qty')?.setErrors(null);
    this.steamEstForm?.get('unit_price')?.setErrors(null);
    this.displayPackResidueList=[...this.packResidueList];
  
  }

  GoBackPrevious(event: Event) {
    event.stopPropagation(); // Stop the click event from propagating
    // Navigate to the route and pass the JSON object
    this.router.navigate(['/admin/steam/approval'], {
      state: this.historyState

    }
    );
  }

  populateSteamPartList(steam:SteamItem){

    if(steam)
    {
      var dataList = steam.steaming_part?.map(data=>new SteamPartItem(data) );
      this.updateData(dataList);
    }
  }
  
  resetSelectedItemForUpdating()
  {
    if(this.updateSelectedItem)
    {
      this.updateSelectedItem.item.edited=false;
      this.updateSelectedItem=null;
      this.resetValue();
    }
  }
  IsApprovePart(rep: ResiduePartItem) {
    return rep.approve_part;
  }

  toggleApprovePart(event:Event,rep: ResiduePartItem) {
    event.stopPropagation(); // Prevents click event from bubbling up
    if (!this.steamDs.canApprove(this.steamItem!)) return;
    rep.approve_part = rep.approve_part != null ? !rep.approve_part : false;
  }

  onNoAction(event: Event) {
    this.preventDefault(event);
    console.log(this.sotItem)

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(CancelFormDialogComponent, {
      width: '1000px',
      data: {
        action: 'cancel',
        dialogTitle: this.translatedLangText.ARE_YOU_SURE_CANCEL,
        item: [this.steamItem],
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const reList = result.item.map((item: ResidueItem) => new ResidueGO(item));
        console.log(reList);

        let steamStatus : SteamStatusRequest = new SteamStatusRequest();
        steamStatus.action="NA";
        steamStatus.guid = this.steamItem?.guid;
        steamStatus.sot_guid= this.steamItem?.sot_guid;
        steamStatus.remarks = reList[0].remarks;
        steamStatus.steamingPartRequests=[];
        this.deList.forEach(d=>{
          var stmPart :SteamPartRequest = new SteamPartRequest();
          stmPart.guid=d.guid;
          stmPart.approve_part=false;
          steamStatus.steamingPartRequests?.push(stmPart);
        });
        this.steamDs.updateSteamStatus(steamStatus).subscribe(result=>{

          this.handleCancelSuccess(result?.data?.updateSteamingStatus);
         });
        // this.residueDS.cancelResidue(reList).subscribe(result => {
        //   this.handleCancelSuccess(result?.data?.cancelResidue)
        // });
      }
    });
  }


  onCancel(event: Event) {
    this.preventDefault(event);
    console.log(this.sotItem)

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(CancelFormDialogComponent, {
      width: '1000px',
      data: {
        action: 'cancel',
        dialogTitle: this.translatedLangText.ARE_YOU_SURE_CANCEL,
        item: [this.steamItem],
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const reList = result.item.map((item: ResidueItem) => new ResidueGO(item));
        console.log(reList);

        let steamStatus : SteamStatusRequest = new SteamStatusRequest();
        steamStatus.action="CANCEL";
        steamStatus.guid = this.steamItem?.guid;
        steamStatus.sot_guid= this.steamItem?.sot_guid;
        steamStatus.remarks = reList[0].remarks;
        steamStatus.steamingPartRequests=[];
         this.steamDs.updateSteamStatus(steamStatus).subscribe(result=>{

          this.handleCancelSuccess(result?.data?.updateSteamingStatus);
         });
        // this.residueDS.cancelResidue(reList).subscribe(result => {
        //   this.handleCancelSuccess(result?.data?.cancelResidue)
        // });
      }
    });
  }

  onRollback(event: Event) {
    this.preventDefault(event);
    console.log(this.sotItem)

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(CancelFormDialogComponent, {
      width: '1000px',
      data: {
        action: 'rollback',
        dialogTitle: this.translatedLangText.ARE_YOU_SURE_ROLLBACK,
        item: [this.steamItem],
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const reList = result.item.map((item: any) => {
          const RepairRequestInput = {
            customer_guid: this.sotItem?.storing_order?.customer_company?.guid,
            estimate_no: item?.estimate_no,
            guid: item?.guid,
            remarks: item.remarks,
            sot_guid: item.sot_guid,
            is_approved:this.steamItem?.status_cv!="PENDING"
          }
          return RepairRequestInput
        });
        console.log(reList);
        // if(this.residueItem?.status_cv=="PENDING")
        // {
      
          this.steamDs.rollbackSteam(reList[0]).subscribe(result => {
            this.handleRollbackSuccess(result?.data?.rollbackSteaming)
          });
        // }
        // else
        // {
        //   this.residueDS.rollbackResidueApproval(reList[0]).subscribe(result => {
        //     this.handleRollbackSuccess(result?.data?.rollbackResidueApproval)
        //   });
        // }
      }
    });
  }

  handleCancelSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.CANCELED_SUCCESS;
      ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
      this.router.navigate(['/admin/steam/approval'], {
        state: this.historyState

      }
      );
    }
  }

  handleRollbackSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.ROLLBACK_SUCCESS;
      ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
      this.router.navigate(['/admin/steam/approval'], {
        state: this.historyState

      }
      );
    }
  }

  onApprove(event: Event) {
    event.preventDefault();
    const bill_to =(this.steamEstForm?.get("billing_branch")?.value?this.sotItem?.storing_order?.customer_company?.guid:this.steamEstForm?.get("billing_branch")?.value?.guid);
   
    if (bill_to) {
      let re: any = new SteamItem();
      re.guid = this.steamItem?.guid;
      re.sot_guid = this.steamItem?.sot_guid;
      re.bill_to_guid = bill_to;
      re.status_cv=this.steamItem?.status_cv;
      // this.deList?.forEach((rep: ResiduePartItem) => {
      //   rep.approve_part = rep.approve_part ?? !this.repairPartDS.is4X(rep.rp_damage_repair);
      //   rep.approve_qty = (rep.approve_part ?? !this.repairPartDS.is4X(rep.rp_damage_repair)) ? (rep.approve_qty ?? rep.quantity) : 1;
      //   rep.approve_hour = (rep.approve_part ?? !this.repairPartDS.is4X(rep.rp_damage_repair)) ? (rep.approve_hour ?? rep.hour) : 0;
      //   rep.approve_cost = (rep.approve_part ?? !this.repairPartDS.is4X(rep.rp_damage_repair)) ? (rep.approve_cost ?? rep.material_cost) : 0;
      // })
      re.action="APPROVE";
      re.steaming_part = this.deList?.map((rep: SteamPartItem) => {
        return new SteamPartItem({
          ...rep,
          action:'',
         // tariff_residue: undefined,
          approve_part: rep.approve_part,
          approve_qty:rep.approve_qty,
          approve_cost:rep.approve_cost,
          approve_labour:rep.approve_labour,
          job_order:undefined
        })
      });
      console.log(re)
      this.steamDs.approveSteaming(re).subscribe(result => {
        console.log(result)
        this.handleSaveSuccess(result?.data?.approveSteaming);
      });
    } else {
      bill_to?.setErrors({ required: true })
      bill_to?.markAsTouched();
      bill_to?.updateValueAndValidity();
    }
  }

  onSave(event: Event) {
    event.preventDefault();
    const bill_to =(this.steamEstForm?.get("billing_branch")?.value?this.sotItem?.storing_order?.customer_company?.guid:this.steamEstForm?.get("billing_branch")?.value?.guid);
   
    if (bill_to) {
      let re: SteamItem = new SteamItem();
      re.guid = this.steamItem?.guid;
      re.sot_guid = this.steamItem?.sot_guid;
      re.bill_to_guid = bill_to;
      re.status_cv=this.steamItem?.status_cv;
      
      // this.deList?.forEach((rep: ResiduePartItem) => {
      //   rep.approve_part = rep.approve_part ?? !this.repairPartDS.is4X(rep.rp_damage_repair);
      //   rep.approve_qty = (rep.approve_part ?? !this.repairPartDS.is4X(rep.rp_damage_repair)) ? (rep.approve_qty ?? rep.quantity) : 1;
      //   rep.approve_hour = (rep.approve_part ?? !this.repairPartDS.is4X(rep.rp_damage_repair)) ? (rep.approve_hour ?? rep.hour) : 0;
      //   rep.approve_cost = (rep.approve_part ?? !this.repairPartDS.is4X(rep.rp_damage_repair)) ? (rep.approve_cost ?? rep.material_cost) : 0;
      // })

      re.steaming_part = this.deList?.map((stm: SteamPartItem) => {
        return new SteamPartItem({
          ...stm,
//          tariff_residue: undefined,
          approve_part: stm.approve_part,
          // approve_qty:rep.approve_qty,
          // approve_cost:rep.approve_cost
        })
      });
      
      console.log(re)
      this.steamDs.updateSteam(re).subscribe(result => {
        console.log(result)
        this.handleSaveSuccess(result?.data?.updateResidue);
      });
    } else {
      bill_to?.setErrors({ required: true })
      bill_to?.markAsTouched();
      bill_to?.updateValueAndValidity();
    }
  }

  addEstDetails(event: Event) {
    
    this.preventDefault(event);  // Prevents the form submission
    
    var descObject :PackageResidueItem;

    if(typeof this.steamEstForm?.get("desc")?.value==="object")
    {
      descObject = new PackageResidueItem(this.steamEstForm?.get("desc")?.value);
      descObject.description = descObject.tariff_residue?.description;
    }
    else
    {
      descObject = new PackageResidueItem();
      descObject.description= this.steamEstForm?.get("desc")?.value;
      descObject.cost= Number(this.steamEstForm?.get("unit_price")?.value);
    }


    this.checkCompulsoryEst(["desc","qty","unit_price"]);
    var index :number =-1;
    if(this.updateSelectedItem)
    {
      index = this.updateSelectedItem.index;
    }
    this.checkDuplicationEst(descObject,index);
    if(!this.steamEstForm?.valid)return;
    

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    
    let residuePartItem = new ResiduePartItem();
    if(index==-1)
    {
      residuePartItem.action="NEW";
    }
    else
    {
      residuePartItem = this.deList[index];
      residuePartItem.action = residuePartItem.guid?"EDIT":"NEW";
    }

    residuePartItem.approve_cost= Number(this.steamEstForm?.get("unit_price")?.value);
    residuePartItem.description= descObject.description;
    residuePartItem.approve_qty=this.steamEstForm?.get("qty")?.value;
    residuePartItem.residue_guid = this.historyState.selectedResidue?.guid;
    residuePartItem.tariff_residue_guid=descObject.tariff_residue?.guid;

    if(index===-1)
    {
      var newData =[...this.deList,residuePartItem];
      this.updateData(newData);
    }
  this.resetSelectedItemForUpdating();
  }

  checkDuplicationEst(item:PackageResidueItem ,index:number=-1)
  {
    var existItems = this.deList.filter(data=>data.description===item?.description)
    if(existItems.length>0)
    {
      if(index==-1 || index!=existItems[0].index)
      {
        this.steamEstForm?.get("desc")?.setErrors({ duplicated: true });
      }
    }
  }

  
  CancelEditEstDetails(event: Event)
  {
    this.preventDefault(event);  // Prevents the form submission
    this.resetSelectedItemForUpdating();
    // this.updateSelectedItem=undefined;
    // this.resetValue();
  }

  editEstDetails(event: Event, row: SteamPartItem, index: number) {
    this.preventDefault(event);  // Prevents the form submission

    const status_NotEditable:string[]=['CANCELED','JOB_IN_PROGRESS'];
    if( status_NotEditable.includes(this.steamItem?.status_cv!)) return;

    var itm =this.deList[index];
    var IsEditedRow = itm.edited;
  

    this.resetSelectedItemForUpdating();

    if(!IsEditedRow)
      {
        this.editRow.qty.setValue( String(row.approve_qty));
        this.editRow.cost.setValue( row.approve_cost!.toFixed(2));
        this.editRow.labour.setValue(String(row.approve_labour));
        this.editRow.index=index;
        this.updateSelectedItem ={
          item:this.deList[index],
          index:index,
          action:"update",
          
        }
        this.updateSelectedItem.item.edited=true;
        return;
      }
      else
      { 
          var updItem = this.deList[this.editRow.index];
          updItem.action="EDIT";
          updItem.approve_qty=Number(this.editRow?.qty.value);
          updItem.approve_cost=Number(this.editRow?.cost.value);
          updItem.approve_labour=Number(this.editRow?.labour.value);
          // var newData =[...this.deList];
          // this.updateData(newData);
      }
      

   
    
  }

  // getTotalCost(): number {
  //   return this.deList.reduce((acc, row) => {
  //     if (row.approve_part!==false) {
  //       return acc + ((row.approve_qty || 0) * (row.approve_cost || 0));
  //     }
  //     return acc; // If row is approved, keep the current accumulator value
  //   }, 0);
  // }

  getFooterBackgroundColor():string{
    return 'light-green';
  }

  getTotalLabourHours():string{
    let ret=0;
    if(this.deList.length>0)
    {
        this.deList.map(d=>ret+=d.approve_labour);
    }
    return String(ret);
  }
  
  getTotalLabourCost():string{
    let ret=0;
    if(this.deList.length>0)
    {
      
        this.deList.map(d=>
          ret+= d.approve_labour * this.packageLabourItem?.cost!);
    }
    return ret.toFixed(2);
  }

   
  getTotalCost(): number {
    return this.deList.reduce((acc, row) => {
      if (row.delete_dt===undefined ||row.delete_dt===null ) {
        return acc + ((row.approve_qty || 0) * (row.approve_cost || 0)+((row.approve_labour||0)*(this.packageLabourItem?.cost||0)));
      }
      return acc; // If row is approved, keep the current accumulator value
    }, 0);
  }
  selectAllText(event: FocusEvent): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.select();
  }

  isAllowToApprove()
  {
    var NoDel=this.deList.filter(d=>d.approve_part==null ||d.approve_part===true);
    return (NoDel.length);
  }
}