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
import { TeamDS, TeamItem } from 'app/data-sources/teams';
import { JobOrderDS, JobOrderGO, JobOrderItem, JobOrderRequest, JobProcessRequest, ResJobOrderRequest, SteamJobOrderRequest } from 'app/data-sources/job-order';
import { SteamDS,SteamItem, SteamStatusRequest } from 'app/data-sources/steam';
import {SteamPartItem} from 'app/data-sources/steam-part';

@Component({
  selector: 'app-estimate-new',
  standalone: true,
  templateUrl: './job-order-allocation.component.html',
  styleUrl: './job-order-allocation.component.scss',
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
export class JobOrderAllocationSteamComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'seq',
    // 'group_name_cv',
     'desc',
    //  'qty',
    //  'unit_price',
    //  'cost',
     'approve_part',
     'team',
     //"actions"
   
  ];
  pageTitleDetails = 'MENUITEMS.REPAIR.LIST.JOB-ORDER'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT',
    'MENUITEMS.REPAIR.LIST.JOB-ORDER'
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
    TEAM_ALLOCATION: 'COMMON-FORM.TEAM-ALLOCATION',
    ASSIGN: 'COMMON-FORM.ASSIGN',
    TEAM: 'COMMON-FORM.TEAM',
    REPAIR_EST_TAB_TITLE: 'COMMON-FORM.JOB-ALLOCATION',
    JOB_ORDER_TAB_TITLE: 'COMMON-FORM.JOBS',
    QC: 'COMMON-FORM.QC',
    JOB_ORDER_NO: 'COMMON-FORM.JOB-ORDER-NO',
    METHOD:"COMMON-FORM.METHOD",
    RESIDUE_DISPOSAL:'COMMON-FORM.RESIDUE-DISPOSAL',
    APPROVE_DATE: 'COMMON-FORM.APPROVE-DATE',
    ABORT: 'COMMON-FORM.ABORT'

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
  damageCodeCvList: CodeValuesItem[] = []
  repairCodeCvList: CodeValuesItem[] = []
  unitTypeCvList: CodeValuesItem[] = []
  templateList: MasterTemplateItem[] = []
  surveyorList: UserItem[] = []
  billingBranchList:CustomerCompanyItem[]=[];
  packResidueList:PackageResidueItem[]=[];
  displayPackResidueList:PackageResidueItem[]=[];
  deList:ResiduePartItem[]=[];
  oldJobOrderList?: (JobOrderItem | undefined)[] = [];

  customerCodeControl = new UntypedFormControl();

  sotDS: StoringOrderTankDS;
  cvDS: CodeValuesDS;
  ccDS: CustomerCompanyDS;
   igDS: InGateDS;
   jobOrderDS:JobOrderDS;
  // plDS: PackageLabourDS;
  // repairEstDS: RepairDS;
  // repairEstPartDS: RepairPartDS;
  steamDs:SteamDS;
  teamDS:TeamDS;
  mtDS: MasterEstimateTemplateDS;
  prDS: PackageRepairDS;
  
  packResidueDS:PackageResidueDS;

  userDS: UserDS;
  isOwner = false;

  isDuplicate = false;

  historyState: any = {};
  updateSelectedItem:any=undefined;
  teamList?: TeamItem[];

  repSelection = new SelectionModel<ResiduePartItem>(true, []);
  cleaningTotalHours: number | undefined;
  
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
    // this.plDS = new PackageLabourDS(this.apollo);
    // this.repairEstDS = new RepairDS(this.apollo);
    // this.repairEstPartDS = new RepairPartDS(this.apollo);
    this.mtDS = new MasterEstimateTemplateDS(this.apollo);
    this.prDS = new PackageRepairDS(this.apollo);
    this.userDS = new UserDS(this.apollo);
    this.packResidueDS= new PackageResidueDS(this.apollo);
    this.steamDs=new SteamDS(this.apollo);
    this.teamDS=new TeamDS(this.apollo);
    this.jobOrderDS=new JobOrderDS(this.apollo);

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
      deList: [''],
      team_allocation:[''],
      
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
        else if(typeof desc_value==='object')
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
      { alias: 'damageCodeCv', codeValType: 'DAMAGE_CODE' },
      { alias: 'repairCodeCv', codeValType: 'REPAIR_CODE' },
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
    this.cvDS.connectAlias('damageCodeCv').subscribe(data => {
      this.damageCodeCvList = data;
    });
    this.cvDS.connectAlias('repairCodeCv').subscribe(data => {
      this.repairCodeCvList = data;
    });
    this.cvDS.connectAlias('unitTypeCv').subscribe(data => {
      this.unitTypeCvList = data;
    });


    //this.getSurveyorList();

    this.sot_guid = this.route.snapshot.paramMap.get('id');
   //this.repair_guid = this.route.snapshot.paramMap.get('repair_est_id');

   this.subs.sink = this.teamDS.getTeamListByDepartment(["REPAIR"]).subscribe(data => {
    if (data?.length) {
      this.teamList = data;
    }
  });

    this.route.data.subscribe(routeData => {
      this.isDuplicate = routeData['action'] === 'duplicate';
      this.loadHistoryState();
    });
  }

  getCustomerLabourPackage(customer_company_guid: string) {
    // const where = {
    //   and: [
    //     { customer_company_guid: { eq: customer_company_guid } }
    //   ]
    // }
    // this.subs.sink = this.plDS.getCustomerPackageCost(where).subscribe(data => {
    //   if (data?.length > 0) {
    //     this.packageLabourItem = data[0];
    //   }
    // });
  }

  getCustomer() {
    return this.sotItem?.storing_order?.customer_company;
  }


  getCustomerCost(customer_company_guid: string | undefined, tariff_repair_guid: string[] | undefined) {
    const where = {
      and: [
        { customer_company_guid: { eq: customer_company_guid } },
        {
          or: [
            { tariff_repair_guid: { in: tariff_repair_guid } }
          ]
        }
      ]
    };

    return this.prDS.getCustomerPackageCost(where);
  }

 

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

  

  updateData(newData: ResiduePartItem[] | undefined): void {
    if (newData?.length) {
      this.deList = newData.map((row, index) => ({
        ...row,
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
        this.router.navigate(['/admin/steam/job-order'], {
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

  // displayDamageRepairCodeDescription(damageRepair: any[], filterCode: number): string {
  //   const concate = damageRepair?.filter((x: any) => x.code_type === filterCode && !x.delete_dt && x.action !== 'cancel').map(item => {
  //     const codeCv = item.code_cv;
  //     const description = `(${codeCv})` + (item.code_type == 0 ? this.getDamageCodeDescription(codeCv) : this.getRepairCodeDescription(codeCv));
  //     return description ? description : '';
  //   }).join('\n');

  //   return concate;
  // }

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
       this.packResidueList=this.steamItem?.steaming_part!;
      this.displayPackResidueList=this.steamItem?.steaming_part!;
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
        var def =this.createDefaultCustomerCompany("---","");

        this.billingBranchList=[def, ...data];;

        this.patchSteamEstForm(this.steamItem!);
       // console.log('loadBillingBranch-1');
      });
    }
    else
    {
      var def =this.createDefaultCustomerCompany("---","");
      this.billingBranchList=[];
      this.billingBranchList.push(def);
      this.patchSteamEstForm(this.steamItem!);
      //console.log('loadBillingBranch-2');
    }

  }

  loadHistoryState()
  {
    this.historyState = history.state;

    if (this.historyState.selectedRow != null) {

      this.steamItem=this.historyState.selectedRow;
      this.sotItem = this.steamItem?.storing_order_tank;
      
      this.getPackageSteam();
      this.loadBillingBranch();
      
      
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
      job_no:this.sotItem?.job_no,
       billing_branch:this.getBillingBranch(billingGuid),
       remarks:steam?.remarks

    });
  }

  getBillingBranch(billingGuid:string):string
  {
    let ccItem:CustomerCompanyItem= this.billingBranchList[0] ;
     let ccItems=this.billingBranchList.filter(data=>data.guid==billingGuid);

     if(ccItems.length>0)
     {
       ccItem=ccItems[0]!;
     }

     return this.ccDS.displayName(ccItem);

  }
  createDefaultCustomerCompany(code:string, name:string):CustomerCompanyItem
  {
    let ccItem:CustomerCompanyItem=new CustomerCompanyItem();
    ccItem.code=code;
    ccItem.name=name;
    return ccItem

  }

  displaySteamPart(cc: any): string {
    return cc && cc.tariff_steaming ? cc.tariff_steaming.description : '';
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
    this.router.navigate(['/admin/steam/job-order'], {
      state: this.historyState

    }
    );
  }

  populateSteamPartList(steam:SteamItem){

    if(steam)
    {
      steam.steaming_part = this.filterDeleted(steam.steaming_part);
      
      var dataList = steam.steaming_part?.map(data=>new SteamPartItem(data) );

      

      this.oldJobOrderList = steam.steaming_part?.filter((item, index, self) => {
        const jobOrder = item.job_order;
        const teamDescription = jobOrder?.team?.description;
        if (!teamDescription) {
          return false;
        }
        return index === self.findIndex(
          (t) =>
            t.job_order?.team?.description === teamDescription
        );
      })
        .map(item => item.job_order);

      this.updateData(dataList);
    }
  }
  
  filterDeleted(resultList: any[] | undefined): any {
    return (resultList || []).filter((row: any) => !row.delete_dt);
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

  toggleApprovePart(rep: ResiduePartItem) {
    if (!this.steamDs.canApprove(this.steamItem!)) return;
    rep.approve_part = rep.approve_part != null ? !rep.approve_part : false;
  }

  onCancel(event: Event) {
    this.preventDefault(event);
    // console.log(this.sotItem)

    // let tempDirection: Direction;
    // if (localStorage.getItem('isRtl') === 'true') {
    //   tempDirection = 'rtl';
    // } else {
    //   tempDirection = 'ltr';
    // }
    // const dialogRef = this.dialog.open(CancelFormDialogComponent, {
    //   width: '1000px',
    //   data: {
    //     action: 'cancel',
    //     dialogTitle: this.translatedLangText.ARE_YOU_SURE_CANCEL,
    //     item: [this.residueItem],
    //     translatedLangText: this.translatedLangText
    //   },
    //   direction: tempDirection
    // });
    // this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    //   if (result?.action === 'confirmed') {
    //     const reList = result.item.map((item: ResidueItem) => new ResidueGO(item));
    //     console.log(reList);
    //     this.steamDs.cancelResidue(reList).subscribe(result => {
    //       this.handleCancelSuccess(result?.data?.cancelResidue)
    //     });
    //   }
    // });
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
            sot_guid: item.sot_guid
          }
          return RepairRequestInput
        });
        console.log(reList);
        this.steamDs.rollbackSteam(reList).subscribe(result => {
          this.handleRollbackSuccess(result?.data?.rollbackResidue)
        });
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

  toggleRep(row: SteamPartItem) {
    
    if (!this.jobOrderDS.canJobAllocate(row?.job_order)) 
        return;
    this.repSelection.toggle(row);
  }

   /** Whether the number of selected elements matches the total number of rows. */
   isAllSelected() {
    const numSelected = this.repSelection.selected.length;
    const numRows = this.deList.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.repSelection.clear()
      : this.deList.forEach((row) =>{
          if(row.approve_part==null || row.approve_part)
          {
            this.repSelection.select(row)
          }
        }
        );
 }

  assignTeam(event: Event) {
    const selectedRep = this.repSelection.selected;
    const selectedTeam = this.steamEstForm?.get('team_allocation');
    const oldTeamFound = this.oldJobOrderList?.find(oldJob => oldJob?.team?.guid === selectedTeam?.value?.guid)

    selectedRep.forEach(rep => {
      rep.job_order = oldTeamFound
        ? new JobOrderItem({
          ...oldTeamFound,
          team_guid: selectedTeam?.value?.guid,
          team: selectedTeam?.value
        })
        : new JobOrderItem({
          team_guid: selectedTeam?.value?.guid,
          team: selectedTeam?.value
        });
    })
    console.log(selectedRep)
    this.repSelection.clear();
    selectedTeam?.setValue('')
    // const selectedRep = this.repSelection.selected;
    // const selectedTeam = this.residueEstForm?.get('team_allocation');
    // selectedRep.forEach(rep => {
    //   rep.job_order = new JobOrderItem({
    //     ...rep.job_order,
    //     team_guid: selectedTeam?.value?.guid,
    //     team: selectedTeam?.value
    //   });
    // })
    // console.log(selectedRep)
    // this.repSelection.clear();
    // selectedTeam?.setValue('')
    // this.residueEstForm?.get('deList')?.setErrors(null);
    
  }
  isAssignEnabled() {
    return this.repSelection.hasValue() && this.steamEstForm?.get('team_allocation')?.value;
  }


  onApprove(event: Event) {
    event.preventDefault();
    const bill_to =(this.steamEstForm?.get("billing_branch")?.value?this.sotItem?.storing_order?.customer_company?.guid:this.steamEstForm?.get("billing_branch")?.value?.guid);
   
    if (bill_to) {
      let re: ResidueItem = new ResidueItem();
      re.guid = this.steamItem?.guid;
      re.sot_guid = this.steamItem?.sot_guid;
      re.bill_to_guid = bill_to;
   re.residue_part = this.deList?.map((rep: ResiduePartItem) => {
        return new ResiduePartItem({
          ...rep,
          tariff_residue: undefined,
          approve_part: rep.approve_part,
        })
      });
      console.log(re)
      this.steamDs.approveSteaming(re).subscribe(result => {
        console.log(result)
        this.handleSaveSuccess(result?.data?.approveResidue);
      });
    } else {
      bill_to?.setErrors({ required: true })
      bill_to?.markAsTouched();
      bill_to?.updateValueAndValidity();
    }
  }

  save() {
    // const distinctJobOrders = this.repList
    //   .filter((item, index, self) =>
    //     index === self.findIndex(t => t.job_order?.guid === item.job_order?.guid &&
    //       (t.job_order?.team?.guid === item?.job_order?.team_guid ||
    //         t.job_order?.team?.description === item?.job_order?.team?.description))
    //   )
    //   .filter(item => item.job_order !== null && item.job_order !== undefined)
    //   .map(item => item.job_order);
    const distinctJobOrders = this.deList
      .filter((item, index, self) => {
        const jobOrder = item.job_order;
        const teamDescription = jobOrder?.team?.description;
        if (!teamDescription) {
          return false;
        }
        return index === self.findIndex(
          (t) =>
            t.job_order?.team?.description === teamDescription
        );
      })
      .map(item => item.job_order);

    const missingJobOrders = this.oldJobOrderList?.filter(
      oldJob =>
        !distinctJobOrders.some(
          distinctJob =>
            distinctJob?.guid === oldJob?.guid &&
            distinctJob?.team?.description === oldJob?.team?.description
        )
    );
    console.log(missingJobOrders);

    const finalJobOrder: any[] = [];
    distinctJobOrders?.forEach(jo => {
      if (jo) {
        const filteredParts = this.deList.filter(part =>
        // ((part.job_order?.guid && part.job_order?.guid === jo?.guid) || !part.job_order?.guid) &&
        (part.job_order?.team?.guid === jo?.team_guid ||
          part.job_order?.team?.description === jo?.team?.description)
        );
        const partList = filteredParts.map(part => part.guid);
        const totalApproveHours =3;

        const joRequest = new JobOrderRequest();
        joRequest.guid = jo.guid;
        joRequest.job_type_cv = jo.job_type_cv ?? 'STEAM';
        joRequest.remarks = jo.remarks;
        joRequest.sot_guid = jo.sot_guid ?? this.sotItem?.guid;
        joRequest.status_cv = jo.status_cv;
        joRequest.team_guid = jo.team_guid;
        joRequest.total_hour = jo.total_hour ?? totalApproveHours;
        joRequest.working_hour = jo.working_hour ?? 0;
        joRequest.process_guid = this.steamItem?.guid;
        joRequest.part_guid = partList;
        finalJobOrder.push(joRequest);
      }
    });
    
    console.log(finalJobOrder);
    // const without4x = this.repList.filter(part =>
    //   !part.job_order?.guid && !part.job_order?.team?.guid && !this.repairPartDS.is4X(part.rp_damage_repair)
    // );
    this.jobOrderDS.assignJobOrder(finalJobOrder).subscribe(result => {
      console.log(result)
      if ((result?.data?.assignJobOrder ?? 0) > 0 && missingJobOrders?.length) {
        const jobOrderGuidToDelete = missingJobOrders.map(jo => jo?.guid!)
        this.jobOrderDS.deleteJobOrder(jobOrderGuidToDelete).subscribe(result => {
          console.log(`deleteJobOrder: ${jobOrderGuidToDelete}, result: ${result}`);
        });
      }

      var act="PARTIAL_ASSIGN";
      if(this.isAllAssignedToTeam()) {
        console.log("all parts are assigned");
        act="ASSIGN";
        // var residueStatusReq: ResidueStatusRequest = new ResidueStatusRequest({
        //   guid: this.residueItem!.guid,
        //   sot_guid: this.sotItem!.guid,
        //   action: "ASSIGN"
        // });
        // console.log(residueStatusReq);
        // this.residueDS.updateResidueStatus(residueStatusReq).subscribe(result => {
        //   console.log(result)
        //   if (result.data.updateResidueStatus > 0) {
        //     this.handleSaveSuccess(result.data.updateResidueStatus);
        //   }
        // });
      } 
      var steamStatusReq: SteamStatusRequest = new SteamStatusRequest({
          guid: this.steamItem!.guid,
          sot_guid: this.sotItem!.guid,
          action:act
        });
        console.log(steamStatusReq);
        this.steamDs.updateSteamStatus(steamStatusReq).subscribe(result => {
          console.log(result)
          if (result.data.updateSteamingStatus > 0) {
            this.handleSaveSuccess(result.data.updateSteamingStatus);
          }
        });
    });
  }



  isAllAssignedToTeam(): boolean {

    return this.deList.every(
      (data) =>
        { 
          //  let bRet=!data.approve_part?true:data.approve_part;
          //  if(bRet)
          //  {
          //     if(!data.job_order?.team_guid)
          //     {
          //        return false;
          //     }
          //  }
          //  return bRet;

          let bRet=data.approve_part==null?true:data.approve_part;
          if(bRet)
          {
             if(!data.job_order?.team_guid)
             {
                return false;
             }
          }
          return true;
        }

    );

    // let retval = true;
  
    // this.deList.forEach((data) => {
    //   if (!data.job_order?.team?.description && data.approve_part) {
    //     retval = false;
    //   }
    // });
  
    // return retval;
  }

  updateJobProcessStatus(residueGuid:string, job_type:string,process_status:string)
  {
    
         var updateJobProcess :JobProcessRequest= new JobProcessRequest();
         updateJobProcess.guid=residueGuid;
         updateJobProcess.job_type_cv=job_type;
         updateJobProcess.process_status=process_status;

         this.jobOrderDS?.updateJobProcessStatus(updateJobProcess).subscribe(result=>{
          if(result.data.updateJobProcessStatus>0)
          {
            this.handleSaveSuccess(result.data.updateJobProcessStatus);
          }

         });
     

  }

  onAbort(event: Event) {
    this.preventDefault(event);
    console.log(this.steamItem)

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
        dialogTitle: this.translatedLangText.ARE_YOU_SURE_ABORT,
        item: [this.steamItem],
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const distinctJobOrders = this.deList
          .filter((item, index, self) =>
            index === self.findIndex(t => t.job_order?.guid === item.job_order?.guid &&
              (t.job_order?.team?.guid === item?.job_order?.team_guid ||
                t.job_order?.team?.description === item?.job_order?.team?.description))
          )
          .filter(item => item.job_order !== null && item.job_order !== undefined)
          .map(item => new JobOrderGO(item.job_order!));

        const steamJobOrder = new SteamJobOrderRequest({
          guid: this.steamItem?.guid,
          sot_guid: this.steamItem?.sot_guid,
         // estimate_no: this.steamItem?.estimate_no,
          remarks: result.item[0]?.remarks,
          job_order: distinctJobOrders
        });

        console.log(steamJobOrder)
         this.steamDs.abortSteaming(steamJobOrder).subscribe(result => {
           console.log(result)
           this.handleCancelSuccess(result?.data?.abortSteaming)
         });
      }
    });
  }
  
}