import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { TlxFormFieldComponent } from '@shared/components/tlx-form/tlx-form-field/tlx-form-field.component';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { InGateSurveyItem } from 'app/data-sources/in-gate-survey';
import { MasterEstimateTemplateDS, MasterTemplateItem } from 'app/data-sources/master-template';
import { PackageLabourDS, PackageLabourItem } from 'app/data-sources/package-labour';
import { PackageRepairDS } from 'app/data-sources/package-repair';
import { PackageResidueDS, PackageResidueItem } from 'app/data-sources/package-residue';
import { RepairDS, RepairItem } from 'app/data-sources/repair';
import { RepairPartDS, RepairPartItem } from 'app/data-sources/repair-part';
import { ResidueDS, ResidueGO, ResidueItem, ResiduePartRequest, ResidueStatusRequest } from 'app/data-sources/residue';
import { ResidueEstPartGO, ResiduePartItem } from 'app/data-sources/residue-part';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffResidueItem } from 'app/data-sources/tariff-residue';
import { UserDS, UserItem } from 'app/data-sources/user';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { ResidueDisposalPdfComponent } from 'app/document-template/pdf/residue-disposal-pdf/residue-disposal-pdf.component';
import { ModulePackageService } from 'app/services/module-package.service';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { CancelFormDialogComponent } from './dialogs/cancel-form-dialog/form-dialog.component';
import { UndeleteDialogComponent } from './dialogs/undelete/undelete.component';

@Component({
  selector: 'app-estimate-new',
  standalone: true,
  templateUrl: './estimate-approval-new.component.html',
  styleUrl: './estimate-approval-new.component.scss',
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
    TlxFormFieldComponent,
    PreventNonNumericDirective
  ]
})
export class ResidueDisposalEstimateApprovalNewComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'seq',
    // 'group_name_cv',
    'desc',
    'qty',
    'qty_unit',
    'unit_price',
    'cost',
    'approve_part',
    "actions"

  ];
  pageTitleNew = 'MENUITEMS.REPAIR.LIST.ESTIMATE-NEW'
  pageTitleEdit = 'MENUITEMS.REPAIR.LIST.ESTIMATE-EDIT'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.RESIDUE-DISPOSAL.TEXT', route: '/admin/residue-disposal/estimate-approval' },
    { text: 'MENUITEMS.RESIDUE-DISPOSAL.LIST.RESIDUE-DISPOSAL-ESTIMATE-APPROVAL', route: '/admin/residue-disposal/estimate-approval' },
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
    SAVE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    BACK: 'COMMON-FORM.BACK',
    SAVE: 'COMMON-FORM.SAVE',
    ARE_YOU_SURE_DELETE: 'COMMON-FORM.ARE-YOU-SURE-DELETE',
    ARE_YOU_SURE_UNO: 'COMMON-FORM.ARE-YOU-SURE-UNDO',
    UNDO: 'COMMON-FORM.UNDO',
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
    ARE_YOU_SURE_ABORT: 'COMMON-FORM.ARE-YOU-SURE-ABORT',
    ARE_YOU_SURE_ROLLBACK: 'COMMON-FORM.ARE-YOU-SURE-ROLLBACK',
    CONFIRM: 'COMMON-FORM.CONFIRM',
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
    ADD_SUCCESS: 'COMMON-FORM.ADD-SUCCESS',
    ESTIMATE_DATE: 'COMMON-FORM.ESTIMATE-DATE',
    DUPLICATE_PART_DETECTED: 'COMMON-FORM.DUPLICATE-PART-DETECTED',
    BILLING_PROFILE: 'COMMON-FORM.BILLING-PROFILE',
    BILLING_DETAILS: 'COMMON-FORM.BILLING-DETAILS',
    BILLING_TO: 'COMMON-FORM.BILLING-TO',
    BILL_TO: 'COMMON-FORM.BILL-TO',
    BILLING_BRANCH: 'COMMON-FORM.BILLING-BRANCH',
    JOB_REFERENCE: 'COMMON-FORM.JOB-REFERENCE',
    QUANTITY: 'COMMON-FORM.QTY',
    UNIT_PRICE: 'COMMON-FORM.UNIT-PRICE',
    COST: 'COMMON-FORM.COST',
    ROLLBACK: 'COMMON-FORM.ROLLBACK',
    ROLLBACK_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    APPROVE: 'COMMON-FORM.APPROVE',
    ABORT: 'COMMON-FORM.ABORT',
    DETAILS: 'COMMON-FORM.DETAILS',
    TYPE: 'COMMON-FORM.TYPE',
  }

  newDesc = new FormControl(null, [Validators.required]);
  newQty = new FormControl(null, [Validators.required]);;
  newUnitPrice = new FormControl(null, [Validators.required]);;
  newQtyType = new FormControl(null, [Validators.required]);;

  clean_statusList: CodeValuesItem[] = [];

  sot_guid?: string | null;
  residue_guid?: string | null;

  residueEstForm?: UntypedFormGroup;
  sotForm?: UntypedFormGroup;

  sotItem?: StoringOrderTankItem;
  residueItem?: ResidueItem;
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
  billingBranchList: CustomerCompanyItem[] = [];
  customer_companyList?: CustomerCompanyItem[];
  packResidueList: PackageResidueItem[] = [];
  displayPackResidueList: PackageResidueItem[] = [];
  deList: any[] = [];
  reSelection = new SelectionModel<ResidueItem>(true, []);

  customerCodeControl = new UntypedFormControl();

  sotDS: StoringOrderTankDS;
  cvDS: CodeValuesDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  plDS: PackageLabourDS;
  repairEstDS: RepairDS;
  repairEstPartDS: RepairPartDS;
  residueDS: ResidueDS;

  mtDS: MasterEstimateTemplateDS;
  prDS: PackageRepairDS;

  packResidueDS: PackageResidueDS;

  userDS: UserDS;
  isOwner = false;

  isDuplicate = false;

  historyState: any = {};
  updateSelectedItem: any = undefined;
  isExportingPDF: boolean = false;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private modulePackageService: ModulePackageService
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
    this.packResidueDS = new PackageResidueDS(this.apollo);
    this.residueDS = new ResidueDS(this.apollo);

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
    this.residueEstForm = this.fb.group({
      guid: [''],
      bill_to: [''],
      // billing_branch: [''],
      job_no: [''],
      remarks: [''],
      last_test: [''],
      next_test: [''],
      desc: [''],
      qty: [''],
      unit_price: [''],
      deList: [''],
      unit_type_cv: [''],
    });
  }

  initializeValueChanges() {
    this.newDesc.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var desc_value: any = this.newDesc.value;
        this.displayPackResidueList = this.packResidueList.filter(data => data.tariff_residue?.description && data.tariff_residue?.description.includes(desc_value!));
        if (!desc_value) this.displayPackResidueList = [...this.packResidueList];
        else if (typeof desc_value === 'object' && this.updateSelectedItem === undefined) {
          this.newUnitPrice.setValue(desc_value?.cost?.toFixed(2));
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
      { alias: 'unitTypeCv', codeValType: 'RESIDUE_UNIT' },
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
      this.populateResiduePartList(this.residueItem!);
    });

    this.sot_guid = this.route.snapshot.paramMap.get('id');
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
    // let where: any = {
    //   or: [
    //     {
    //       and: [
    //         { template_est_customer: { some: { customer_company_guid: { eq: customer_company_guid }, delete_dt: { eq: null } } } },
    //         { type_cv: { eq: "EXCLUSIVE" } }
    //       ]
    //     },
    //     { type_cv: { eq: "GENERAL" } }
    //   ]
    // }
    // where = this.mtDS.addDeleteDtCriteria(where);
    // this.subs.sink = this.mtDS.searchEstimateTemplateForRepair(where, { create_dt: 'ASC' }, customer_company_guid).subscribe(data => {
    //   if (data?.length > 0) {
    //     this.templateList = data;//this.filterDeletedTemplate(data, customer_company_guid);
    //     const def_guid = this.getCustomer()?.def_template_guid;
    //     if (!this.repair_guid) {
    //       if (def_guid) {
    //         this.residueEstForm?.get('is_default_template')?.setValue(true);
    //       }

    //       const def_template = this.templateList.find(x =>
    //         def_guid ? x.guid === def_guid : x.type_cv === 'GENERAL'
    //       );

    //       if (def_guid !== def_template?.guid) {
    //         this.getCustomer()!.def_template_guid = def_guid;
    //         this.residueEstForm?.get('is_default_template')?.setValue(true);
    //       }

    //       this.residueEstForm?.get('est_template')?.setValue(def_template);
    //     }
    //   }
    // });
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
    return cc && cc.code ? `${cc.code} - ${cc.name}` : '';
  }
  displayUnitTypeFn(cc: CodeValuesItem): string {
    return cc?.description!;
  }

  displayUnitTypeCodeFn(val: string): string {
    let retval: string = '';
    return retval;
  }


  selectOwner($event: Event, row: RepairPartItem) {
    this.stopPropagation($event);
    row.owner = !(row.owner || false);
    this.calculateCost();
  }

  checkCompulsoryEst(fields: string[]): boolean {
    let isValid = true;
    if (!this.newDesc.value) {
      this.newDesc.setErrors({ required: true });
      this.newDesc.markAsTouched();
      isValid = false;
    }
    if (!this.newQty.value) {
      this.newQty?.setErrors({ required: true });
      this.newQty?.markAsTouched();
      isValid = false;
    }
    if (!this.newUnitPrice.value) {
      this.newUnitPrice.setErrors({ required: true });
      this.newUnitPrice.markAsTouched();
      isValid = false;
    }
    if (!this.newQtyType.value) {

      this.newQtyType.setErrors({ required: true });
      this.newQtyType.markAsTouched();
      isValid = false;
    }
    else if (typeof this.newQtyType.value != 'object') {
      this.newQtyType.setErrors({ required: true });
      this.newQtyType.markAsTouched();
      isValid = false;
    }
    return isValid;
    // fields.forEach(name=>{
    // if( !this.residueEstForm?.get(name)?.value)
    //   {
    //     this.residueEstForm?.get(name)?.setErrors({ required: true });
    //     this.residueEstForm?.get(name)?.markAsTouched(); // Trigger validation display
    //   }
    // });
  }

  checkDuplicationEst(item: PackageResidueItem, index: number = -1) {
    var existItems = this.deList.filter(data => data.description === item?.description)
    if (existItems.length > 0) {
      if (index == -1 || index != existItems[0].index) {
        //this.residueEstForm?.get("desc")?.setErrors({ duplicated: true });
        this.newDesc.setErrors({ duplicated: true });
      }
    }
  }

  addEstDetails(event: Event) {
    this.preventDefault(event);  // Prevents the form submission

    const isValid = this.checkCompulsoryEst(["desc", "qty", "unit_price"]);
    if (!isValid) return;
    var descObject: PackageResidueItem;

    if (typeof this.newDesc?.value === "object") {
      descObject = new PackageResidueItem(this.newDesc?.value!);
      descObject.description = descObject.tariff_residue?.description;
    } else {
      descObject = new PackageResidueItem();
      descObject.description = this.newDesc?.value!;
      descObject.cost = Number(this.newUnitPrice?.value);
    }

    var index: number = -1;
    if (this.updateSelectedItem) {
      index = this.updateSelectedItem.index;
    }
    this.checkDuplicationEst(descObject, index);
    if (!this.newDesc?.valid || !this.newQty?.valid || !this.newUnitPrice?.valid || !this.newQtyType?.valid) return;

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    let residuePartItem: any = new ResiduePartItem();
    if (index == -1) {
      residuePartItem.action = "NEW";
    }
    else {
      residuePartItem = this.deList[index];
      residuePartItem.action = residuePartItem.guid ? "EDIT" : "NEW";
    }

    residuePartItem.cost = Number(this.newUnitPrice?.value);
    residuePartItem.description = descObject.description;
    residuePartItem.quantity = Number(this.newQty?.value);
    residuePartItem.qty_unit_type_cv = this.newQtyType.value;
    residuePartItem.residue_guid = this.historyState.selectedResidue?.guid;
    residuePartItem.tariff_residue_guid = descObject.tariff_residue?.guid;

    if (index === -1) {
      var newData = [...this.deList, residuePartItem];
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

  editEstDetails(event: Event, row: ResiduePartItem, index: number) {
    this.preventDefault(event);  // Prevents the form submission

    if (row.delete_dt) return;
    var itm = this.deList[index];
    var IsEditedRow = itm.edited;


    this.resetSelectedItemForUpdating();

    if (IsEditedRow) return;


    this.updateSelectedItem = {
      item: this.deList[index],
      index: index,
      action: "update",

    }
    this.updateSelectedItem.item.edited = true;

    var descValues = this.packResidueList.filter(data => data.tariff_residue?.description === row.description);
    var descValue: any;
    if (descValues.length > 0) {
      descValue = descValues[0];
    }
    else {
      descValue = new PackageResidueItem();
      descValue.guid = row.guid;
      descValue.description = row.description;
      descValue.tariff_residue = new TariffResidueItem();
      descValue.tariff_residue.description = row.description;
      descValue.cost = Number(row.cost);

    }
    this.residueEstForm?.patchValue({
      desc: descValue,
      qty: row.quantity,
      unit_price: row.cost
    });



  }

  undeleteItem(event: Event, row: ResiduePartItem, index: number) {


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
  deleteItem(event: Event, row: ResiduePartItem, index: number) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      //width: '1000px',
      data: {
        item: row,
        langText: this.langText,
        index: index
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        if (row.guid) {
          const data: any[] = [...this.deList];
          const updatedItem = {
            ...row,
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
      width: '380px',
      data: {
        action: 'cancel',
        dialogTitle: this.translatedLangText.ARE_YOU_SURE_CANCEL,
        item: [this.residueItem],
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const reList = result.item.map((item: ResidueItem) => new ResidueGO(item));
        console.log(reList);

        let residueStatus: ResidueStatusRequest = new ResidueStatusRequest();
        residueStatus.action = "CANCEL";
        residueStatus.guid = this.residueItem?.guid;
        residueStatus.sot_guid = this.residueItem?.sot_guid;
        residueStatus.remarks = reList[0].remarks;
        this.residueDS.updateResidueStatus(residueStatus).subscribe(result => {

          this.handleCancelSuccess(result?.data?.updateResidueStatus);
          if (result?.data?.updateResidueStatus > 0) {
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
      selectedList.push(this.residueItem!);
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
      width: '380px',
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
          const ResidueEstimateRequestInput = {
            customer_guid: item.customer_company_guid,
            estimate_no: item.estimate_no,
            guid: item.guid,
            remarks: item.remarks,
            sot_guid: item.sot_guid,
            is_approved: item?.status_cv == "APPROVED"
          }
          return ResidueEstimateRequestInput;
        });
        console.log(reList);
        this.residueDS.rollbackResidue(reList).subscribe((result: { data: { rollbackResidue: any; }; }) => {
          this.handleRollbackSuccess(result?.data?.rollbackResidue)
          if (result?.data?.rollbackResidue > 0) {
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

  onExport(event: Event) {
    this.preventDefault(event);
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    this.isExportingPDF = true;
    const dialogRef = this.dialog.open(ResidueDisposalPdfComponent, {
      width: '794px',
      height: '80vh',
      data: {
        residue_guid: this.residueItem?.guid,
        estimate_no: this.residueItem?.estimate_no
      },
      // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });
    dialogRef.updatePosition({
      top: '-9999px',  // Move far above the screen
      left: '-9999px'  // Move far to the left of the screen
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      this.isExportingPDF = false;
    });
  }

  onFormSubmit() {
    this.residueEstForm!.get('desc')?.setErrors(null);
    this.residueEstForm!.get('qty')?.setErrors(null);
    this.residueEstForm!.get('unit_price')?.setErrors(null);
    this.residueEstForm!.get('deList')?.setErrors(null);

    if (!this.deList.length) {
      this.residueEstForm?.get('deList')?.setErrors({ required: true });
    }
    if (!this.residueEstForm?.valid) return;


    if (this.historyState.action === "NEW" || this.historyState.action === "DUPLICATE") {
      var newResidueItem: ResidueItem = new ResidueItem();
      var billGuid: string = (this.residueEstForm?.get("bill_to")?.value?.guid);
      newResidueItem.bill_to_guid = billGuid;
      newResidueItem.job_no = this.residueEstForm.get("job_no")?.value;
      newResidueItem.remarks = this.residueEstForm.get("remarks")?.value;
      newResidueItem.status_cv = "PENDING";
      newResidueItem.sot_guid = this.sotItem?.guid;
      newResidueItem.residue_part = [];

      this.deList.forEach(data => {
        var residuePart: ResiduePartItem = new ResiduePartItem(data);

        if (typeof residuePart.qty_unit_type_cv == 'object') {
          residuePart.qty_unit_type_cv = data.qty_unit_type_cv?.code_val;
        }
        residuePart.approve_part = ((data.approve_part == null || data.approve_part == 1) ? true : false);
        //  delete residuePart.qty_unit_type_cv;
        newResidueItem.residue_part?.push(residuePart);

      });
      newResidueItem.est_cost = this.getTotalCost();
      delete newResidueItem.customer_company;

      this.residueDS.addResidue(newResidueItem).subscribe(result => {

        if (result.data.addResidue > 0) {
          this.handleSaveSuccess(result.data.addResidue);
        }
      });
    }
    else if (this.historyState.action === "UPDATE") {
      var updResidueItem: ResidueItem = new ResidueItem(this.residueItem);
      var billGuid: string = (this.residueEstForm.get("bill_to")?.value?.guid);
      updResidueItem.bill_to_guid = billGuid;
      updResidueItem.job_no = this.residueEstForm.get("job_no")?.value;
      updResidueItem.remarks = this.residueEstForm.get("remarks")?.value;
      updResidueItem.sot_guid = this.sotItem?.guid;
      updResidueItem.residue_part = [];
      this.deList.forEach(data => {
        var residuePart: ResiduePartItem = new ResiduePartItem(data);
        if (typeof residuePart.qty_unit_type_cv == 'object') {
          residuePart.qty_unit_type_cv = data.qty_unit_type_cv?.code_val;
        }

        residuePart.approve_part = ((data.approve_part == null || data.approve_part == 1) ? true : false);
        // delete residuePart.qty_unit_type_cv;
        updResidueItem.residue_part?.push(residuePart);

      });
      updResidueItem.est_cost = this.getTotalCost();
      delete updResidueItem.customer_company;
      delete updResidueItem.storing_order_tank;

      this.residueDS.updateResidue(updResidueItem).subscribe(result => {

        if (result.data.updateResidue > 0) {
          this.handleSaveSuccess(result.data.updateResidue);
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
    //this.rollbackSelectedRows(event, row, index);
  }

  handleDelete(event: Event, row: any, index: number): void {
    this.stopEventTrigger(event);
    this.preventDefault(event);
    this.deleteItem(event, row, index);
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.langText.SAVE_SUCCESS;
      this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
        successMsg = res;
        ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
        //this.router.navigate(['/admin/master/estimate-template']);

        // Navigate to the route and pass the JSON object
        this.router.navigate(['/admin/residue-disposal/estimate-approval'], {
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
      const yearCount = BusinessLogicUtil.getNextTestYear(test_type);
      const resultDt = Utility.addYearsToEpoch(igs.test_dt as number, yearCount);
      return this.getTestTypeDescription(igs.next_test_cv) + " - " + Utility.convertEpochToDateStr(resultDt, 'MM/YYYY');
    }
    return "";
  }

  selectText(event: FocusEvent) {
    Utility.selectText(event)
  }

  parse2Decimal(figure: number | string) {
    return Utility.formatNumberDisplay(figure)
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
    return !!this.residueItem?.guid;
  }

  getLabourCost(): number | undefined {
    return this.repairEstItem?.labour_cost || this.packageLabourItem?.cost;
  }

  getPackageResidue() {
    let where: any = {};
    let custCompanyGuid: string = this.sotItem?.storing_order?.customer_company?.guid!;
    where.customer_company_guid = { eq: custCompanyGuid };

    this.packResidueDS.SearchPackageResidue(where, {}).subscribe(data => {

      this.packResidueList = data;
      this.displayPackResidueList = data;
      this.populateResiduePartList(this.residueItem!);
    });

  }

  loadBillingBranch() {
    let where: any = {};
    this.ccDS.getCustomerAndBranch(this.sotItem?.storing_order?.customer_company?.guid!).subscribe(cc => {
      if (cc?.length) {
        const bill_to = this.residueEstForm?.get('bill_to');
        this.customer_companyList = cc;
        if (this.residueItem?.bill_to_guid) {
          const found = this.customer_companyList?.find(x => x.guid === this.residueItem?.bill_to_guid)
          if (found) {
            bill_to?.setValue(found);
          }
        } else if (this.customer_companyList?.length) {
          const found = this.customer_companyList?.find(x => x.guid === this.sotItem?.storing_order?.customer_company?.guid)
          if (found) {
            bill_to?.setValue(found);
          }
        }
        if (this.residueItem && !this.residueDS.canApprove(this.residueItem)) {
          bill_to?.disable();
        }
      }
    });
    this.patchResidueEstForm(this.residueItem!);
    // let custCompanyGuid: string = this.sotItem?.storing_order?.customer_company?.guid!;
    // where.main_customer_guid = { eq: custCompanyGuid };

    // this.ccDS.search(where, {}).subscribe(data => {
    //   var def = this.createDefaultCustomerCompany("--Select--", "");

    //   this.billingBranchList = [def, ...data];;

    //   this.patchResidueEstForm(this.residueItem!);
    // });
  }

  loadHistoryState() {
    this.historyState = history.state;

    if (this.historyState.selectedRow != null) {

      this.isDuplicate = this.historyState.action === 'DUPLICATE';
      this.residue_guid = this.historyState.selectedResidue?.guid;
      this.sotItem = this.historyState.selectedRow;
      this.residueItem = this.historyState.selectedResidue;

      this.getPackageResidue();
      this.loadBillingBranch();
    }
  }

  patchResidueEstForm(residue: ResidueItem) {
    let billingGuid = "";
    if (residue) {
      billingGuid = residue.bill_to_guid!;
    }

    this.residueEstForm?.patchValue({
      job_no: residue?.job_no ? residue.job_no : this.sotItem?.job_no,
      remarks: residue?.remarks
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

  displayResiduePart(cc: any): string {
    return cc && cc.tariff_residue ? cc.tariff_residue.description : '';
  }



  resetValue() {

    //     this.newDesc.setValidators( null);
    // this.newDesc.patchValue(null, { emitEvent: false });
    //this.newDesc.updateValueAndValidity({ emitEvent: false });
    // this.newDesc.disable({ emitEvent: false });
    // this.newDesc.patchValue(null, { emitEvent: false });
    // this.newDesc.enable({ emitEvent: false });
    this.newDesc = new FormControl(null, [Validators.required]);
    this.newQty = new FormControl(null, [Validators.required]);
    this.newUnitPrice = new FormControl(null, [Validators.required]);
    this.newQtyType = new FormControl(null, [Validators.required]);
    this.initializeValueChanges();
    // this.newDesc.patchValue(null,{emitEvent:false});
    // this.newQty.patchValue(null,{emitEvent:false});
    // this.newUnitPrice.patchValue(null,{emitEvent:false});
    // this.newQtyType.patchValue(null,{emitEvent:false});
    //this.newDesc.setErrors(null);
    //this.newDesc.setValidators([Validators.required]);
    // this.newDesc.updateValueAndValidity({ emitEvent: true });
    //     this.newQty.setErrors(null);
    //     this.newUnitPrice.setErrors(null);
    //     this.newQtyType.setErrors(null);
    //     this.newDesc.setValidators([Validators.required]);
    // this.newQty.setValidators([Validators.required]);
    // this.newUnitPrice.setValidators([Validators.required]);
    // this.newQtyType.setValidators([Validators.required]);

    // this.newDesc.updateValueAndValidity({ emitEvent: false });
    // this.newQty.updateValueAndValidity({ emitEvent: false });
    // this.newUnitPrice.updateValueAndValidity({ emitEvent: false });
    // this.newQtyType.updateValueAndValidity({ emitEvent: false });

    this.residueEstForm?.patchValue({
      desc: '',
      qty: '',
      unit_price: ''
    }, { emitEvent: false });
    this.residueEstForm?.get('desc')?.setErrors(null);
    this.residueEstForm?.get('qty')?.setErrors(null);
    this.residueEstForm?.get('unit_price')?.setErrors(null);

    this.displayPackResidueList = [...this.packResidueList];

  }

  GoBackPrevious(event: Event) {
    event.stopPropagation(); // Stop the click event from propagating
    // Navigate to the route and pass the JSON object
    this.router.navigate(['/admin/residue-disposal/estimate-approval'], {
      state: this.historyState

    }
    );
  }


  populateResiduePartList(residue: ResidueItem) {

    if (residue) {
      var dataList = residue.residue_part?.map(data => {
        if (this.isDuplicate && data.description) {
          data.action = 'NEW';
          // Filter packResidueList for matching tariff_residue_guid
          const packResidue = this.packResidueList.find(res => res.tariff_residue?.guid === data.tariff_residue_guid);
          if (packResidue) {
            data.cost = packResidue.cost;
          }
        }
        var d: any = data;
        if (data.qty_unit_type_cv && this.unitTypeCvList.length > 0) {
          if (typeof data.qty_unit_type_cv === 'string') {
            d.qty_unit_type_cv = this.cvDS.getCodeObject(data.qty_unit_type_cv, this.unitTypeCvList);
          }
        }
        return new ResidueEstPartGO(d)

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

  getTotalCost(): number {
    return this.deList.reduce((acc, row) => {
      if ((row.delete_dt === null || row.delete_dt === undefined) && (row.approve_part == null || row.approve_part == true)) {
        if (this.IsApproved()) {
          return acc + ((row.approve_qty || 0) * (row.approve_cost || 0));
        }
        else {
          return acc + ((row.quantity || 0) * (row.cost || 0));
        }
      }
      return acc; // If row is approved, keep the current accumulator value
    }, 0);
  }

  getFooterBackgroundColor(): string {
    return ''; // 'light-blue';
  }

  handleRollbackSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.ROLLBACK_SUCCESS;
      ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)

    }
  }

  handleCancelSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.CANCELED_SUCCESS;
      ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)

      this.router.navigate(['/admin/residue-disposal/estimate-approval'], {
        state: this.historyState

      }
      );
    }
  }

  isAllowToSaveSubmit() {
    var NoDel = this.deList.filter(d => d.action != 'cancel');
    return (NoDel.length);
  }

  IsApprovePart(rep: ResiduePartItem) {
    return rep.approve_part;
  }

  approveRow(event: Event) {
    this.onApprove(event, this.residueItem!);
  }

  onApprove(event: Event, row: ResidueItem) {
    event.preventDefault();
    const bill_to = (this.residueEstForm?.get("bill_to")?.value?.guid);

    if (bill_to) {
      let re: ResidueItem = new ResidueItem(row);
      re.guid = this.residueItem?.guid;
      re.sot_guid = this.residueItem?.sot_guid;
      re.bill_to_guid = bill_to;
      re.status_cv = this.residueItem?.status_cv;
      re.job_no = this.residueEstForm?.get("job_no")?.value
      re.remarks = this.residueEstForm?.get("remarks")?.value
      this.deList?.forEach((rep: any) => {
        rep.approve_qty = (this.IsApproved() ? rep.approve_qty : rep.quantity);
        // rep.approve_hour = (rep.approve_part ?? !this.repairPartDS.is4X(rep.rp_damage_repair)) ? (rep.approve_hour ?? rep.hour) : 0;
        rep.approve_cost = (this.IsApproved() ? rep.approve_cost : rep.cost);
        if (typeof rep.qty_unit_type_cv == 'object') {
          rep.qty_unit_type_cv = rep.qty_unit_type_cv?.code_val;
        }
        //delete rep.qty_unit_type_cv;
      })

      re.residue_part = this.deList?.map((rep: ResiduePartItem) => {
        return new ResiduePartItem({
          ...rep,
          action: (this.residueItem?.status_cv === 'PENDING' ? ((rep.action === undefined || rep.action === null) ? 'EDIT' : rep.action) : (rep.action === undefined ? '' : rep.action)),
          tariff_residue: undefined,
          tariff_residue_guid: (rep.tariff_residue_guid ? rep.tariff_residue_guid : ''),

          approve_part: (rep.approve_part == null ? true : rep.approve_part),
          approve_qty: rep.approve_qty,
          approve_cost: rep.approve_cost
        })
      });
      delete re.storing_order_tank;
      re.total_cost = this.getTotalCost();
      console.log(re)
      this.residueDS.approveResidue(re).subscribe(result => {
        console.log(result)
        this.handleSaveSuccess(result?.data?.approveResidue);
      });
      //  }
    } else {
      bill_to?.setErrors({ required: true })
      bill_to?.markAsTouched();
      bill_to?.updateValueAndValidity();
    }
  }

  toggleApprovePart(event: Event, rep: ResiduePartItem) {
    event.stopPropagation(); // Prevents click event from bubbling up
    if (this.isDisabled()) return;
    rep.approve_part = rep.approve_part != null ? !rep.approve_part : false;
    // if(rep?.action==='' || rep?.action===null)
    //   {
    rep.action = 'EDIT';

    // }
  }

  isDisabled(): boolean {
    const validStatus = ['COMPLETED', 'QC_COMPLETED', 'JOB_IN_PROGRESS']
    return validStatus.includes(this.residueItem?.status_cv!);
  }

  updateAction(residuePart: any) {
    if (residuePart?.action === '' || residuePart?.action === null) {
      residuePart.action = 'EDIT';

    }
  }

  IsAbleToApprove() {
    var NoDel = this.deList.filter(d => ((d.delete_dt === null || d.delete_dt === undefined) && (d.approve_part == null || d.approve_part == true)));
    return (NoDel.length);
  }

  IsApproved() {
    const validStatus = ['APPROVED', 'COMPLETED', 'QC_COMPLETED']
    return validStatus.includes(this.residueItem?.status_cv!);

  }

  calculateResidueItemCost(residuePart: ResiduePartItem): number {
    let calResCost: number = 0;

    if (this.IsApproved()) {
      calResCost = residuePart.approve_cost! * residuePart.approve_qty!;
    }
    else {
      calResCost = residuePart.cost! * residuePart.quantity!;
    }

    return calResCost;

  }

  checkApprovePart() {
    return this.deList.some(de => de.approve_part || (de.approve_part === null));
  }

  canApprove() {
    return this.checkApprovePart() && this.residueDS.canApprove(this.residueItem!)
  }

  onNoAction(event: Event, row: ResidueItem) {
    this.preventDefault(event);
    console.log(this.sotItem)

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(CancelFormDialogComponent, {
      width: '380px',
      data: {
        action: 'cancel',
        dialogTitle: this.translatedLangText.ARE_YOU_SURE_ABORT,
        item: [this.residueItem],
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const reList = result.item.map((item: ResidueItem) => new ResidueGO(item));
        console.log(reList);

        let residueStatus: ResidueStatusRequest = new ResidueStatusRequest();
        residueStatus.action = "NA";
        residueStatus.guid = this.residueItem?.guid;
        residueStatus.sot_guid = this.residueItem?.sot_guid;
        residueStatus.remarks = reList[0].remarks;
        residueStatus.residuePartRequests = [];
        row.residue_part?.forEach(d => {
          var resPart: ResiduePartRequest = new ResiduePartRequest();
          resPart.guid = d.guid;
          resPart.approve_part = false;
          residueStatus.residuePartRequests?.push(resPart);
        });
        this.residueDS.updateResidueStatus(residueStatus).subscribe(result => {

          this.handleCancelSuccess(result?.data?.updateResidueStatus);
          if (result?.data?.updateResidueStatus > 0) {
            this.GoBackPrevious(event);
          }
        });
        // this.residueDS.cancelResidue(reList).subscribe(result => {
        //   this.handleCancelSuccess(result?.data?.cancelResidue)
        // });
      }
    });


    // let residueStatus : ResidueStatusRequest = new ResidueStatusRequest();
    // residueStatus.action="NA";
    // residueStatus.guid = row?.guid;
    // residueStatus.sot_guid= row?.sot_guid;
    // residueStatus.remarks='';
    // residueStatus.residuePartRequests=[];
    // row.residue_part?.forEach(d=>{
    //   var resPart :ResiduePartRequest = new ResiduePartRequest();
    //   resPart.guid=d.guid;
    //   resPart.approve_part=false;
    //   residueStatus.residuePartRequests?.push(resPart);
    // });
    //  this.residueDS.updateResidueStatus(residueStatus).subscribe(result=>{

    //   console.log(result)
    //   this.handleCancelSuccess(result?.data?.updateResidueStatus);
    //  });
    // this.residueDS.cancelResidue(reList).subscribe(result => {
    //   this.handleCancelSuccess(result?.data?.cancelResidue)
    // });
  }

  displayCustomerCompanyName(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name}) - ${cc.type_cv === 'BRANCH' ? cc.type_cv : 'CUSTOMER'}` : '';
  }
}