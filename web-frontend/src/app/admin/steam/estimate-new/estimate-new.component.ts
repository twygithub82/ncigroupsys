import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { TlxFormFieldComponent } from '@shared/components/tlx-form/tlx-form-field/tlx-form-field.component';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { InGateSurveyItem } from 'app/data-sources/in-gate-survey';
import { MasterEstimateTemplateDS, MasterTemplateItem } from 'app/data-sources/master-template';
import { PackageLabourDS, PackageLabourItem } from 'app/data-sources/package-labour';
import { PackageRepairDS, PackageRepairItem } from 'app/data-sources/package-repair';
import { PackageResidueItem } from 'app/data-sources/package-residue';
import { PackageSteamingDS } from 'app/data-sources/package-steam';
import { RepairDS, RepairItem } from 'app/data-sources/repair';
import { RepairPartDS, RepairPartItem } from 'app/data-sources/repair-part';
import { ResidueItem } from 'app/data-sources/residue';
import { ResiduePartItem } from 'app/data-sources/residue-part';
import { SteamDS, SteamItem, SteamStatusRequest } from 'app/data-sources/steam';
import { SteamPartGO, SteamPartItem } from 'app/data-sources/steam-part';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffResidueItem } from 'app/data-sources/tariff-residue';
import { UserDS, UserItem } from 'app/data-sources/user';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { NgScrollbar } from 'ngx-scrollbar';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { CancelFormDialogComponent } from './dialogs/cancel-form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { UndeleteDialogComponent } from './dialogs/undelete/undelete.component';

@Component({
  selector: 'app-estimate-new',
  standalone: true,
  templateUrl: './estimate-new.component.html',
  styleUrl: './estimate-new.component.scss',
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
    MatCardModule
  ]
})
export class SteamEstimateNewComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'seq',
    // 'group_name_cv',
    'desc',
    'qty',
    'unit_price',
    'hour',
    'cost',
    "actions"

  ];
  footerColumns1 = [
    'seq',
    // 'group_name_cv',
    'desc',
    'qty',
    'unit_price',
    'hour',
    'cost',
    "actions"

  ];


  pageTitleNew = 'MENUITEMS.STEAM.LIST.ESTIMATE-NEW'
  pageTitleEdit = 'MENUITEMS.STEAM.LIST.ESTIMATE-EDIT'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT',
    'MENUITEMS.RESIDUE-DISPOSAL.LIST.RESIDUE-DISPOSAL-ESTIMATE'
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
    ARE_YOU_SURE_UNDO: 'COMMON-FORM.ARE-YOU-SURE-UNDO',
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
    BILLING_PROFILE: 'COMMON-FORM.BILLING-PROFILE',
    BILLING_TO: 'COMMON-FORM.BILLING-TO',
    BILLING_BRANCH: 'COMMON-FORM.BILLING-BRANCH',
    JOB_REFERENCE: 'COMMON-FORM.JOB-REFERENCE',
    QUANTITY: 'COMMON-FORM.QTY',
    UNIT_PRICE: 'COMMON-FORM.UNIT-PRICE',
    COST: 'COMMON-FORM.COST',
    ROLLBACK: 'COMMON-FORM.ROLLBACK',
    ROLLBACK_SUCCESS: 'COMMON-FORM.ROLLBACK-SUCCESS',


  }

  clean_statusList: CodeValuesItem[] = [];

  sot_guid?: string | null;
  steam_guid?: string | null;

  steamEstForm?: UntypedFormGroup;
  sotForm?: UntypedFormGroup;

  sotItem?: StoringOrderTankItem;
  steamItem?: SteamItem;
  //repairEstItem?: RepairItem;
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
  billingBranchList: CustomerCompanyItem[] = [];
  packSteamList: PackageRepairItem[] = [];
  displayPackSteamList: PackageRepairItem[] = [];
  deList: any[] = [];
  reSelection = new SelectionModel<ResidueItem>(true, []);

  customerCodeControl = new UntypedFormControl();

  sotDS: StoringOrderTankDS;
  cvDS: CodeValuesDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  plDS: PackageLabourDS;
  packRepDS: PackageRepairDS;
  repairEstDS: RepairDS;
  repairEstPartDS: RepairPartDS;
  steamDS: SteamDS;

  mtDS: MasterEstimateTemplateDS;
  prDS: PackageRepairDS;

  packSteamDS: PackageSteamingDS;

  userDS: UserDS;
  isOwner = false;

  isDuplicate = false;

  historyState: any = {};
  updateSelectedItem: any = undefined;

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
    this.repairEstDS = new RepairDS(this.apollo);
    this.repairEstPartDS = new RepairPartDS(this.apollo);
    this.mtDS = new MasterEstimateTemplateDS(this.apollo);
    this.prDS = new PackageRepairDS(this.apollo);
    this.userDS = new UserDS(this.apollo);
    this.packSteamDS = new PackageSteamingDS(this.apollo);
    this.steamDS = new SteamDS(this.apollo);
    this.packRepDS = new PackageRepairDS(this.apollo);

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
    this.steamEstForm = this.fb.group({
      guid: [''],
      customer_code: [''],
      billing_branch: [''],
      job_no: [''],
      remarks: [''],
      last_test: [''],
      next_test: [''],
      desc: [''],
      qty: [''],
      unit_price: [''],
      hour: [''],
      labour: [''],
      deList: ['']
    });
  }

  initializeValueChanges() {



    this.steamEstForm?.get('desc')?.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var desc_value = this.steamEstForm?.get("desc")?.value;
        if (typeof desc_value === 'object' && this.updateSelectedItem === undefined) {
          this.steamEstForm?.patchValue({

            unit_price: desc_value?.material_cost?.toFixed(2),
            qty: 1,
            hour: desc_value?.labour_hour ? desc_value?.labour_hour : 0,
          });
        }
        else if (desc_value) {
          this.getPackageSteamAlias(desc_value);
        }

        // this.displayPackSteamList= this.packSteamList.filter(data=> data.tariff_repair?.alias && data.tariff_repair?.alias?.includes(desc_value));
        // if(!desc_value) this.displayPackSteamList= [...this.packSteamList];
        // else if(typeof desc_value==='object' && this.updateSelectedItem===undefined)
        // {
        //   this.steamEstForm?.patchValue({

        //      unit_price: desc_value?.material_cost?.toFixed(2),
        //      qty: 1,
        //      hour: desc_value?.labour_hour?desc_value?.labour_hour:0,
        //   });
        // }

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
    this.cvDS.connectAlias('unitTypeCv').subscribe(data => {
      this.unitTypeCvList = data;
    });


    //this.getSurveyorList();

    this.sot_guid = this.route.snapshot.paramMap.get('id');
    this.steam_guid = this.route.snapshot.paramMap.get('steam_est_id');

    this.route.data.subscribe(routeData => {
      this.isDuplicate = routeData['action'] === 'duplicate';
      this.loadHistoryState();
    });
  }



  populateRepairEst(repair_est: RepairItem[] | undefined, isDuplicate: boolean) {
    // if (this.isDuplicate) {
    //   if (this.repair_est_guid) {
    //     this.res.getRepairEstByID(this.repair_est_guid, this.sotItem?.storing_order?.customer_company_guid!).subscribe(data => {
    //       if (this.repairEstDS.totalCount > 0) {
    //         const found = data;
    //         if (found?.length) {
    //           this.populateFoundRepairEst(found[0]!, isDuplicate);
    //         }
    //       }
    //     });
    //   }
    // } else {
    //   if (repair_est?.length) {
    //     const found = repair_est.filter(x => x.guid === this.repair_est_guid);
    //     if (found?.length) {
    //       this.populateFoundRepairEst(found[0]!, isDuplicate);
    //     }
    //   }
    // }
  }

  populateFoundRepairEst(repairEst: RepairPartItem, isDuplicate: boolean) {
    // this.repairEstItem = isDuplicate ? new RepairPartItem() : repairEst;
    // this.isOwner = !isDuplicate ? (repairEst!.owner ?? false) : false;
    // this.repairEstItem!.repair_part = this.filterDeleted(repairEst!.repair_part).map((rep: any) => {
    //   if (isDuplicate) {
    //     const package_repair = rep.tariff_repair?.package_repair;
    //     let material_cost = rep.material_cost;
    //     if (isDuplicate && package_repair?.length) {
    //       material_cost = package_repair[0].material_cost;
    //     }

    //     const rep_damage_repair = this.filterDeleted(rep.rep_damage_repair).map((rep_d_r: any) => {
    //       rep_d_r.guid = undefined;
    //       rep_d_r.action = 'new';
    //       return rep_d_r;
    //     });

    //     return {
    //       ...rep,
    //       rep_damage_repair: rep_damage_repair,
    //       material_cost: material_cost,
    //       guid: null,
    //       repair_est_guid: null,
    //       action: 'new'
    //     };
    //   }

    //   return rep;
    // });
    // this.updateData(this.repairEstItem!.repair_est_part);
    // this.residueEstForm?.patchValue({
    //   guid: !isDuplicate ? this.repairEstItem!.guid : '',
    //   remarks: this.repairEstItem!.remarks,
    //   surveyor_id: this.repairEstItem!.aspnetusers_guid,
    //   labour_cost_discount: this.repairEstItem!.labour_cost_discount,
    //   material_cost_discount: this.repairEstItem!.material_cost_discount
    // });
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

  getTemplateList(customer_company_guid: string) {
    let where: any = {
      or: [
        {
          and: [
            { template_est_customer: { some: { customer_company_guid: { eq: customer_company_guid }, delete_dt: { eq: null } } } },
            { type_cv: { eq: "EXCLUSIVE" } }
          ]
        },
        { type_cv: { eq: "GENERAL" } }
      ]
    }
    where = this.mtDS.addDeleteDtCriteria(where);
    this.subs.sink = this.mtDS.searchEstimateTemplateForRepair(where, { create_dt: 'ASC' }, customer_company_guid).subscribe(data => {
      if (data?.length > 0) {
        this.templateList = data;//this.filterDeletedTemplate(data, customer_company_guid);
        const def_guid = this.getCustomer()?.def_template_guid;
        if (!this.steam_guid) {
          if (def_guid) {
            this.steamEstForm?.get('is_default_template')?.setValue(true);
          }

          const def_template = this.templateList.find(x =>
            def_guid ? x.guid === def_guid : x.type_cv === 'GENERAL'
          );

          if (def_guid !== def_template?.guid) {
            this.getCustomer()!.def_template_guid = def_guid;
            this.steamEstForm?.get('is_default_template')?.setValue(true);
          }

          this.steamEstForm?.get('est_template')?.setValue(def_template);
        }
      }
    });
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

  getSurveyorList() {
    const where = { aspnetuserroles: { some: { aspnetroles: { Role: { eq: "Surveyor" } } } } }
    this.subs.sink = this.userDS.searchUser(where).subscribe(data => {
      if (data?.length > 0) {
        this.surveyorList = data;
      }
    });
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
  }

  selectOwner($event: Event, row: RepairPartItem) {
    this.stopPropagation($event);
    row.owner = !(row.owner || false);
    this.calculateCost();
  }


  checkCompulsoryEst(fields: string[]) {
    fields.forEach(name => {
      //if( !this.steamEstForm?.get(name)?.value)
      if (this.steamEstForm?.get(name)?.value == null || this.steamEstForm?.get(name)?.value === "") {
        this.steamEstForm?.get(name)?.setErrors({ required: true });
        this.steamEstForm?.get(name)?.markAsTouched(); // Trigger validation display
      }
    });
  }

  checkDuplicationEst(item: PackageResidueItem, index: number = -1) {
    var existItems = this.deList.filter(data => data.description === item?.description)
    if (existItems.length > 0) {
      if (index == -1 || index != existItems[0].index) {
        this.steamEstForm?.get("desc")?.setErrors({ duplicated: true });
      }
    }
  }

  addEstDetails(event: Event) {

    this.preventDefault(event);  // Prevents the form submission

    var descObject: SteamPartItem;

    if (typeof this.steamEstForm?.get("desc")?.value === "object") {
      var repItm: RepairPartItem = this.steamEstForm?.get("desc")?.value;

      descObject = new SteamPartItem();
      descObject.description = repItm.tariff_repair?.alias;
    }
    else {
      descObject = new SteamPartItem();
      descObject.description = this.steamEstForm?.get("desc")?.value;

    }
    descObject.cost = this.steamEstForm?.get("unit_price")?.value;
    descObject.labour = this.steamEstForm?.get("hour")?.value;
    descObject.quantity = this.steamEstForm?.get("qty")?.value;


    this.checkCompulsoryEst(["desc", "qty", "hour", "unit_price"]);
    var index: number = -1;
    if (this.updateSelectedItem) {
      index = this.updateSelectedItem.index;
    }
    this.checkDuplicationEst(descObject, index);
    if (!this.steamEstForm?.valid) return;


    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }


    let steamPartItem = new SteamPartItem();
    if (index == -1) {
      steamPartItem.action = "NEW";
    }
    else {
      steamPartItem = this.deList[index];
      steamPartItem.action = steamPartItem.guid ? "EDIT" : "NEW";
    }

    steamPartItem.cost = Number(this.steamEstForm?.get("unit_price")?.value);
    steamPartItem.description = descObject.description;
    steamPartItem.quantity = descObject.quantity;
    steamPartItem.labour = descObject.labour;
    steamPartItem.cost = descObject.cost;
    // residuePartItem.tariff_residue_guid=descObject.tariff_residue?.guid;

    if (index === -1) {
      var newData = [...this.deList, steamPartItem];
      this.updateData(newData);
    }
    this.resetSelectedItemForUpdating();
  }

  CancelEditEstDetails(event: Event) {
    this.preventDefault(event);  // Prevents the form submission
    this.resetSelectedItemForUpdating();
    // this.updateSelectedItem=undefined;
    // this.resetValue();
  }

  editEstDetails(event: Event, row: SteamPartItem, index: number) {
    this.preventDefault(event);  // Prevents the form submission

    if (row.delete_dt) return;
    var itm = this.deList[index];
    var IsEditedRow = itm.edited;


    this.resetSelectedItemForUpdating();

    if (IsEditedRow) {
      itm.edited = false;
      return;
    }


    this.updateSelectedItem = {
      item: this.deList[index],
      index: index,
      action: "update",

    }
    this.updateSelectedItem.item.edited = true;

    var descValues = this.packSteamList.filter(data => data.tariff_repair?.alias === row.description);
    var descValue: any;
    if (descValues.length > 0) {
      descValue = descValues[0];
    }
    else {
      descValue = new SteamPartItem();
      descValue.guid = row.guid;
      descValue.description = row.description;
      descValue.tariff_residue = new TariffResidueItem();
      descValue.tariff_residue.description = row.description;
      descValue.cost = Number(row.cost);

    }
    this.steamEstForm?.patchValue({
      desc: descValue,
      qty: row.quantity,
      hour: row.labour,
      unit_price: row.cost
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
        const reList = result.item.map((item: SteamItem) => new SteamItem(item));
        console.log(reList);

        let steamStatus: SteamStatusRequest = new SteamStatusRequest();
        steamStatus.action = "CANCEL";
        steamStatus.guid = this.steamItem?.guid;
        steamStatus.sot_guid = this.steamItem?.sot_guid;
        steamStatus.remarks = reList[0].remarks;
        this.steamDS.updateSteamStatus(steamStatus).subscribe(result => {

          this.handleCancelSuccess(result?.data?.updateSteamingStatus);
          if (result?.data?.updateSteamingStatus > 0) {
            this.GoBackPrevious(event);
          }
        });
        // this.residueDS.cancelResidue(reList).subscribe(result => {
        //   this.handleCancelSuccess(result?.data?.cancelResidue)
        // });
      }
    });
  }

  rollbackRow(event: Event) {
    this.preventDefault(event)
    const found = false;
    let selectedList = [...this.reSelection.selected];
    if (!found) {
      // this.toggleRow(row);
      selectedList.push(this.steamItem!);
    }
    this.rollbackSelectedRows(event, selectedList)
  }

  rollbackSelectedRows(event: Event, row: ResidueItem[]) {
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
        item: [...row],
        translatedLangText: this.translatedLangText

      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {

        const reList = result.item.map((item: any) => {
          const SteamEstimateRequestInput = {
            customer_guid: item.customer_company_guid,
            estimate_no: item.estimate_no,
            guid: item.guid,
            remarks: item.remarks,
            sot_guid: item.sot_guid,
            is_approved: item?.status_cv == "APPROVED"
          }
          return SteamEstimateRequestInput;
        });
        console.log(reList);
        this.steamDS.rollbackSteam(reList).subscribe((result: { data: { rollbackSteaming: any; }; }) => {
          this.handleRollbackSuccess(result?.data?.rollbackSteaming)
          if (result?.data?.rollbackSteaming > 0) {
            this.GoBackPrevious(event);
          }
          //this.performSearch(this.pageSize, 0, this.pageSize);
        });
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

  addRepairEstPart(result: any) {
    const data = [...this.repList];
    const newItem = new RepairPartItem({
      ...result.item,
    });
    data.push(newItem);

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

  onFormSubmit() {

    this.steamEstForm!.get('desc')?.setErrors(null);
    this.steamEstForm!.get('qty')?.setErrors(null);
    this.steamEstForm!.get('unit_price')?.setErrors(null);
    this.steamEstForm!.get('deList')?.setErrors(null);
    this.steamEstForm!.get('hour')?.setErrors(null);

    if (!this.isPartValid()) {
      this.steamEstForm?.get('deList')?.setErrors({ required: true });
    }

    if (!this.steamEstForm?.valid) return;


    if (this.historyState.action === "NEW" || this.historyState.action === "DUPLICATE") {
      var newSteamItem: any = new SteamItem();
      var billGuid: string = (this.steamEstForm?.get("billing_branch")?.value ? this.sotItem?.storing_order?.customer_company?.guid : this.steamEstForm?.get("billing_branch")?.value?.guid);
      if (!this.steamEstForm?.get("billing_branch")?.value) {
        billGuid = "";
      }
      newSteamItem.action = "NEW";
      newSteamItem.bill_to_guid = billGuid;
      newSteamItem.job_no = this.steamEstForm.get("job_no")?.value;
      newSteamItem.remarks = this.steamEstForm.get("remarks")?.value;
      newSteamItem.status_cv = "PENDING";
      newSteamItem.sot_guid = this.sotItem?.guid;
      newSteamItem.total_cost = this.getTotalCost();
      newSteamItem.steaming_part = [];
      this.deList.forEach(data => {
        var steamPart: SteamPartItem = new SteamPartItem(data);
        newSteamItem.steaming_part?.push(steamPart);

      });

      this.steamDS.addSteam(newSteamItem).subscribe(result => {

        if (result.data.addSteaming > 0) {
          this.handleSaveSuccess(result.data.addSteaming);
        }
      });

    }
    else if (this.historyState.action === "UPDATE") {
      var updSteamItem: any = new SteamItem(this.steamItem);
      var billGuid: string = (this.steamEstForm.get("billing_branch")?.value ? this.steamEstForm.get("billing_branch")?.value?.guid : this.sotItem?.storing_order?.customer_company?.guid);
      if (!this.steamEstForm?.get("billing_branch")?.value) {
        billGuid = "";
      }
      updSteamItem.action = "EDIT";
      updSteamItem.bill_to_guid = billGuid;
      updSteamItem.job_no = this.steamEstForm.get("job_no")?.value;
      updSteamItem.remarks = this.steamEstForm.get("remarks")?.value;
      updSteamItem.sot_guid = this.sotItem?.guid;
      updSteamItem.steaming_part = [];
      updSteamItem.total_cost = this.getTotalCost();
      this.deList.forEach(data => {
        var steamPart: SteamPartItem = new SteamPartItem(data);
        steamPart.action = !data.action ? '' : data.action;
        updSteamItem.steaming_part?.push(steamPart);

      });

      // delete updSteamItem.customer_company;
      delete updSteamItem.storing_order_tank;

      this.steamDS.updateSteam(updSteamItem).subscribe(result => {

        if (result.data.updateSteaming > 0) {
          this.handleSaveSuccess(result.data.updateSteaming);
        }
      });

    }

  }

  updateData(newData: ResiduePartItem[] | undefined): void {
    if (newData?.length) {
      this.deList = newData.map((row, index) => ({
        ...row,
        index: index
      }));

      //this.calculateCost();
    }
    else {
      this.deList = [];

    }
  }

  handleRollback(event: Event, row: any, index: number): void {
    this.stopEventTrigger(event);
    this.preventDefault(event);
    // this.rollbackSelectedRows(event, row, index);
  }

  handleDelete(event: Event, row: any, index: number): void {
    this.stopEventTrigger(event);
    this.preventDefault(event);
    this.deleteItem(event, row, index);
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

        // Navigate to the route and pass the JSON object
        this.router.navigate(['/admin/steam/estimate'], {
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
    return this.sotDS.displayTankPurpose(sot, this.getPurposeOptionDescription.bind(this));
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

  getGroupNameCodeDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.groupNameCvList);
  }

  getSubgroupNameCodeDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.subgroupNameCvList);
  }

  getGroupSeq(codeVal: string | undefined): number | undefined {
    const gncv = this.groupNameCvList.filter(x => x.code_val === codeVal);
    if (gncv.length) {
      return gncv[0].sequence;
    }
    return -1;
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

  displayDamageRepairCodeDescription(damageRepair: any[], filterCode: number): string {
    const concate = damageRepair?.filter((x: any) => x.code_type === filterCode && !x.delete_dt && x.action !== 'cancel').map(item => {
      const codeCv = item.code_cv;
      const description = `(${codeCv})` + (item.code_type == 0 ? this.getDamageCodeDescription(codeCv) : this.getRepairCodeDescription(codeCv));
      return description ? description : '';
    }).join('\n');

    return concate;
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

  calculateCost() {

  }

  filterDeletedTemplate(resultList: MasterTemplateItem[] | undefined, customer_company_guid: string): any {
    return (resultList || [])
      .filter((row: MasterTemplateItem) =>
        !row.delete_dt && (
          row.type_cv === 'GENERAL' || (row.type_cv === 'EXCLUSIVE' &&
            row.template_est_customer?.some(customer =>
              customer.customer_company_guid === customer_company_guid && !customer.delete_dt
            ))
        )
      );
  }

  filterDeleted(resultList: any[] | undefined): any {
    return (resultList || []).filter((row: any) => !row.delete_dt);
  }

  canExport(): boolean {
    return !!this.steam_guid;
  }

  // getLabourCost(): number | undefined {
  //   return this.repairEstItem?.labour_cost || this.packageLabourItem?.cost;
  // }

  getPackageSteamAlias(alias?: string) {
    let where: any = {};
    let custCompanyGuid: string = this.sotItem?.storing_order?.customer_company?.guid!;
    where.and = [];
    where.and.push({ customer_company_guid: { eq: custCompanyGuid } });
    //where.customer_company_guid = {eq:custCompanyGuid};
    if (alias) where.and.push({ tariff_repair: { alias: { contains: alias } } });

    this.packRepDS.SearchPackageRepair(where, {}).subscribe(data => {

      this.displayPackSteamList = data;

    });

    // this.packResidueDS.SearchPackageResidue(where,{}).subscribe(data=>{

    //   this.packResidueList=data;
    //   this.displayPackResidueList=data;
    //   this.populateResiduePartList(this.residueItem!);
    // });

  }

  getPackageSteam() {
    let where: any = {};
    let custCompanyGuid: string = this.sotItem?.storing_order?.customer_company?.guid!;
    where.customer_company_guid = { eq: custCompanyGuid };

    this.packRepDS.SearchPackageRepair(where, {}).subscribe(data => {

      this.packSteamList = data;
      this.displayPackSteamList = this.packSteamList;
      // this.displayPackResidueList=data;
      this.populateSteamPartList(this.steamItem!);
      //this.populateResiduePartList(this.residueItem!);
    });

    // this.packResidueDS.SearchPackageResidue(where,{}).subscribe(data=>{

    //   this.packResidueList=data;
    //   this.displayPackResidueList=data;
    //   this.populateResiduePartList(this.residueItem!);
    // });

  }

  loadBillingBranch() {
    let where: any = {};
    let custCompanyGuid: string = this.sotItem?.storing_order?.customer_company?.guid!;
    where.main_customer_guid = { eq: custCompanyGuid };

    this.ccDS.search(where, {}).subscribe(data => {
      var def = this.createDefaultCustomerCompany("--Select--", "");

      this.billingBranchList = [def, ...data];;

      this.patchSteamEstForm(this.steamItem!);
    });

  }

  loadHistoryState() {
    this.historyState = history.state;

    if (this.historyState.selectedRow != null) {

      this.isDuplicate = this.historyState.action === 'DUPLICATE';
      this.sotItem = this.historyState.selectedRow;
      this.steamItem = this.historyState.selectedSteam;
      this.getPackageSteam();
      this.loadBillingBranch();
      var ccGuid = this.sotItem?.storing_order?.customer_company?.guid;
      this.getCustomerLabourPackage(ccGuid!);


    }
  }

  patchSteamEstForm(steam: SteamItem) {
    let billingGuid = "";
    if (steam) {
      billingGuid = steam.bill_to_guid!;
    }

    this.steamEstForm?.patchValue({

      customer_code: this.ccDS.displayName(this.sotItem?.storing_order?.customer_company),
      job_no: steam?.job_no ? steam.job_no : this.sotItem?.job_no,
      billing_branch: this.getBillingBranch(billingGuid),
      remarks: steam?.remarks

    });
  }

  getBillingBranch(billingGuid: string): CustomerCompanyItem {
    let ccItem: CustomerCompanyItem = this.billingBranchList[0];
    let ccItems = this.billingBranchList.filter(data => data.guid == billingGuid);

    if (ccItems.length > 0) {
      ccItem = ccItems[0]!;
    }

    return ccItem;

  }
  createDefaultCustomerCompany(code: string, name: string): CustomerCompanyItem {
    let ccItem: CustomerCompanyItem = new CustomerCompanyItem();
    ccItem.code = code;
    ccItem.name = name;
    return ccItem

  }

  displaySteamPart(cc: any): string {
    return cc && cc.tariff_repair ? cc.tariff_repair.alias : '';
  }



  resetValue() {

    this.steamEstForm?.patchValue({
      desc: '',
      qty: '',
      unit_price: '',
      hour: ''
    }, { emitEvent: false });
    this.steamEstForm?.get('desc')?.setErrors(null);
    this.steamEstForm?.get('qty')?.setErrors(null);
    this.steamEstForm?.get('unit_price')?.setErrors(null);
    this.steamEstForm?.get('hour')?.setErrors(null);
    this.displayPackSteamList = [...this.packSteamList];

  }

  GoBackPrevious(event: Event) {
    event.stopPropagation(); // Stop the click event from propagating
    // Navigate to the route and pass the JSON object
    this.router.navigate(['/admin/steam/estimate'], {
      state: this.historyState

    }
    );
  }

  populateSteamPartList(steam: SteamItem) {

    if (steam) {
      var dataList = steam.steaming_part?.map(data => {
        if (this.isDuplicate && data.description) {
          data.action = 'NEW';
          // Filter packResidueList for matching tariff_residue_guid
          // const packSteam = this.packSteamList.find(res => res.tariff_repair?.guid === data.tariff_steaming_guid);
          // if (packSteam) {
          //     data.cost = packSteam.cost;
          // }
        }

        return new SteamPartGO(data)

      });
      this.updateData(dataList);
    }
  }

  resetSelectedItemForUpdating() {
    if (this.updateSelectedItem) {
      this.updateSelectedItem.item.edited = false;
      this.updateSelectedItem = null;

    }
    this.resetValue();
  }



  getFooterBackgroundColor(): string {
    return 'light-green';
  }

  handleRollbackSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.ROLLBACK_SUCCESS;
      ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);

    }
  }

  handleCancelSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.CANCELED_SUCCESS;
      ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);


    }
  }

  getTotalLabourHours(): string {
    let ret = 0;
    if (this.deList.length > 0) {
      this.deList.map(d => ret += d.labour);
    }
    return String(ret);
  }

  getTotalLabourCost(): string {
    let ret = 0;
    if (this.deList.length > 0) {
      this.deList.map(d =>
        ret += d.labour * this.packageLabourItem?.cost!);
    }
    return ret.toFixed(2);
  }


  getTotalCost(): number {
    return this.deList.reduce((acc, row) => {
      if (row.delete_dt === undefined || row.delete_dt === null) {
        return acc + ((row.quantity || 0) * (row.cost || 0) + ((row.labour || 0) * (this.packageLabourItem?.cost || 0)));
      }
      return acc; // If row is approved, keep the current accumulator value
    }, 0);
  }

  undeleteItem(event: Event, row: SteamItem, index: number) {
    //  if(row.guid){

    //   const data: any[] = [...this.deList];
    //   const updatedItem = {
    //     ...row,
    //     delete_dt: null,
    //     action: ''
    //   };

    //   data[index] = updatedItem;
    //   this.updateData(data); // Refresh the data source
    //  }

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(UndeleteDialogComponent, {
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
            delete_dt: null,
            action: ''
          };
          data[result.index] = updatedItem;
          this.updateData(data); // Refresh the data source
        }
        this.resetSelectedItemForUpdating();
      }
    });

  }

  isPartValid(): Boolean {
    if (this.deList.length > 0) {
      return this.deList.some(row => row.delete_dt === undefined || row.delete_dt === null);
    }
    return false;
  }
  isAllowToSaveSubmit() {
    var NoDel = this.deList.filter(d => d.action != 'cancel');
    return (NoDel.length);
  }
}