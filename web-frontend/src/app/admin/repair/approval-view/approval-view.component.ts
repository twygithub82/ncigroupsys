import { Direction } from '@angular/cdk/bidi';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TlxFormFieldComponent } from '@shared/components/tlx-form/tlx-form-field/tlx-form-field.component';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { InGateSurveyItem } from 'app/data-sources/in-gate-survey';
import { JobOrderDS, JobOrderGO, JobOrderItem, JobOrderRequest, RepJobOrderRequest } from 'app/data-sources/job-order';
import { PackageLabourDS } from 'app/data-sources/package-labour';
import { PackageRepairDS } from 'app/data-sources/package-repair';
import { RepairDS, RepairGO, RepairItem, RepairRequest, RepairStatusRequest } from 'app/data-sources/repair';
import { RepairPartDS, RepairPartItem } from 'app/data-sources/repair-part';
import { RPDamageRepairDS } from 'app/data-sources/rp-damage-repair';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TeamDS, TeamItem } from 'app/data-sources/teams';
import { UserDS } from 'app/data-sources/user';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { ModulePackageService } from 'app/services/module-package.service';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { debounceTime, startWith, tap } from 'rxjs';
import { CancelFormDialogComponent } from './dialogs/cancel-form-dialog/cancel-form-dialog.component';
import { NumericTextDirective } from 'app/directive/numeric-text.directive';

@Component({
  selector: 'app-approval-view',
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
    NgClass,
    MatNativeDateModule,
    TranslateModule,
    CommonModule,
    MatLabel,
    MatTableModule,
    MatProgressSpinnerModule,
    RouterLink,
    MatRadioModule,
    MatDividerModule,
    MatMenuModule,
    MatCardModule,
    TlxFormFieldComponent,
    PreventNonNumericDirective,
    NumericTextDirective
  ]
})
export class RepairApprovalViewComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'seq',
    'subgroup_name_cv',
    'damange',
    'repair',
    'description',
    'quantity',
    'hour',
    'price',
    'material',
    'isOwner',
    'approve_part',
    'approve_qty',
    'approve_hour',
    'approve_cost'
  ];
  pageTitleDetails = 'MENUITEMS.REPAIR.LIST.APPROVAL-DETAILS'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.REPAIR.TEXT', route: '/admin/repair/approval' },
    { text: 'MENUITEMS.REPAIR.LIST.APPROVAL', route: '/admin/repair/approval' }
  ]
  translatedLangText: any = {}
  langText = {
    VIEW: 'COMMON-FORM.VIEW',
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
    APPROVE_SUCCESS: 'COMMON-FORM.APPROVE-SUCCESS',
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
    ROLLBACK_SUCCESS: 'COMMON-FORM.ROLLBACK-SUCCESS',
    ARE_YOU_SURE_CANCEL: 'COMMON-FORM.ARE-YOU-SURE-CANCEL',
    ARE_YOU_SURE_ABORT: 'COMMON-FORM.ARE-YOU-SURE-ABORT',
    ARE_YOU_SURE_ROLLBACK: 'COMMON-FORM.ARE-YOU-SURE-ROLLBACK',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    UNDO: 'COMMON-FORM.UNDO',
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
    MATERIAL: 'COMMON-FORM.MATERIAL$',
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
    ESTIMATE_DATE: 'COMMON-FORM.ESTIMATE-DATE',
    APPROVE: 'COMMON-FORM.APPROVE',
    NO_ACTION: 'COMMON-FORM.NO-ACTION',
    ROLLBACK: 'COMMON-FORM.ROLLBACK',
    BILL_DETAILS: 'COMMON-FORM.BILL-DETAILS',
    BILL_TO: 'COMMON-FORM.BILL-TO',
    APPROVE_INFO: 'COMMON-FORM.APPROVE-INFO',
    ABORT: 'COMMON-FORM.ABORT',
    APPROVAL: 'COMMON-FORM.APPROVAL',
    PERCENTAGE_SYMBOL: 'COMMON-FORM.PERCENTAGE-SYMBOL',

  }

  clean_statusList: CodeValuesItem[] = [];

  repair_guid?: string | null;

  repairForm?: UntypedFormGroup;

  sotItem?: StoringOrderTankItem;
  repairItem?: RepairItem;
  // packageLabourItem?: PackageLabourItem;
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
  processStatusCvList: CodeValuesItem[] = []

  oldJobOrderList?: (JobOrderItem | undefined)[] = [];
  customer_companyList?: CustomerCompanyItem[];

  customerCodeControl = new UntypedFormControl();

  sotDS: StoringOrderTankDS;
  cvDS: CodeValuesDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  plDS: PackageLabourDS;
  repairDS: RepairDS;
  repairPartDS: RepairPartDS;
  repDmgRepairDS: RPDamageRepairDS;
  prDS: PackageRepairDS;
  userDS: UserDS;
  joDS: JobOrderDS;
  teamDS: TeamDS;
  isOwner = false;
  canApproveFlag = false;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    public modulePackageService: ModulePackageService
  ) {
    super();
    this.translateLangText();
    this.initForm();
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.plDS = new PackageLabourDS(this.apollo);
    this.repairDS = new RepairDS(this.apollo);
    this.repairPartDS = new RepairPartDS(this.apollo);
    this.repDmgRepairDS = new RPDamageRepairDS(this.apollo);
    this.prDS = new PackageRepairDS(this.apollo);
    this.userDS = new UserDS(this.apollo);
    this.joDS = new JobOrderDS(this.apollo);
    this.teamDS = new TeamDS(this.apollo);
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
    this.repairForm = this.fb.group({
      bill_to: [''],
      job_no: [''],
      guid: [''],
      remarks: [{ value: '', disabled: true }],
      surveyor_id: [''],
      labour_cost_discount: [{ value: 0 }],
      material_cost_discount: [{ value: 0 }],
      last_test: [''],
      next_test: [''],
      // cost
      total_owner_hour: [0],
      total_lessee_hour: [0],
      total_hour: [0],
      total_owner_labour_cost: [0],
      total_lessee_labour_cost: [0],
      total_labour_cost: [0],
      total_owner_mat_cost: [0],
      total_lessee_mat_cost: [0],
      total_mat_cost: [0],
      total_owner_cost: [0],
      total_lessee_cost: [0],
      total_cost: [0],
      discount_labour_owner_cost: [0],
      discount_labour_lessee_cost: [0],
      discount_labour_cost: [0],
      discount_mat_owner_cost: [0],
      discount_mat_lessee_cost: [0],
      discount_mat_cost: [0],
      net_owner_cost: [0],
      net_lessee_cost: [0],
      net_cost: [0],
      total_owner_hour_est: [0],
      total_lessee_hour_est: [0],
      total_hour_est: [0],
      total_owner_labour_cost_est: [0],
      total_lessee_labour_cost_est: [0],
      total_labour_cost_est: [0],
      total_owner_mat_cost_est: [0],
      total_lessee_mat_cost_est: [0],
      total_mat_cost_est: [0],
      total_owner_cost_est: [0],
      total_lessee_cost_est: [0],
      total_cost_est: [0],
      discount_labour_owner_cost_est: [0],
      discount_labour_lessee_cost_est: [0],
      discount_labour_cost_est: [0],
      discount_mat_owner_cost_est: [0],
      discount_mat_lessee_cost_est: [0],
      discount_mat_cost_est: [0],
      net_owner_cost_est: [0],
      net_lessee_cost_est: [0],
      net_cost_est: [0],
    });
  }

  initializeValueChanges() {
    this.repairForm?.get('labour_cost_discount')?.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        this.calculateCost();
        this.calculateCostEst();
      })
    ).subscribe();

    this.repairForm?.get('material_cost_discount')?.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        this.calculateCost();
        this.calculateCostEst();
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
      { alias: 'processStatusCv', codeValType: 'PROCESS_STATUS' }
    ];
    this.cvDS.getCodeValuesByType(queries);

    this.cvDS.connectAlias('groupNameCv').subscribe(data => {
      this.groupNameCvList = data;
      this.updateData(this.repList);
      const subqueries: any[] = [];
      data.map(d => {
        if (d.child_code) {
          let q = { alias: d.child_code, codeValType: d.child_code };
          const hasMatch = subqueries.some(subquery => subquery.codeValType === d.child_code);
          if (!hasMatch) {
            subqueries.push(q);
          }
        }
      });
      if (subqueries.length > 0) {
        this.cvDS?.getCodeValuesByType(subqueries);
        subqueries.map(s => {
          this.cvDS?.connectAlias(s.alias).subscribe(data => {
            this.subgroupNameCvList.push(...data);
          });
        });
      }
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
    this.cvDS.connectAlias('unitTypeCv').subscribe(data => {
      this.unitTypeCvList = data;
    });
    this.cvDS.connectAlias('processStatusCv').subscribe(data => {
      this.processStatusCvList = data;
    });

    this.repair_guid = this.route.snapshot.paramMap.get('id');
    if (this.repair_guid) {
      this.subs.sink = this.repairDS.getRepairByIDForApproval(this.repair_guid).subscribe(data => {
        if (data?.length) {
          this.repairItem = data[0];
          console.log(this.repairItem);
          this.sotItem = this.repairItem?.storing_order_tank;
          this.ccDS.getCustomerAndBranch(this.sotItem?.storing_order?.customer_company?.guid!).subscribe(cc => {
            if (cc?.length) {
              const bill_to = this.repairForm?.get('bill_to');
              this.customer_companyList = cc;
              if (this.repairItem?.bill_to_guid) {
                const found = this.customer_companyList?.find(x => x.guid === this.repairItem?.bill_to_guid)
                if (found) {
                  bill_to?.setValue(found);
                }
              } else if (this.customer_companyList?.length) {
                const found = this.customer_companyList?.find(x => x.guid === this.sotItem?.storing_order?.customer_company_guid)
                if (found) {
                  bill_to?.setValue(found);
                }
              }
              if (!this.repairDS.canApprove(this.repairItem)) {
                bill_to?.disable();
              }
            }
          });
          this.populateRepair(this.repairItem);
        }

        if (this.modulePackageService.isStarterPackage()) {
          this.subs.sink = this.teamDS.getTeamListByDepartment(["REPAIR"]).subscribe(data => {
            if (data?.length) {
              this.autoAssignTeam(data);
            }
          });
        }
      });
    }
  }

  autoAssignTeam(teamList?: TeamItem[]) {
    if (this.repList?.length && (this.repairItem?.status_cv === 'PENDING' || this.repairItem?.status_cv === 'APPROVED')) {
      const selectedTeam = teamList![0];
      console.log('Auto Assigned')
      this.repList.forEach(rep => {
        rep.job_order = new JobOrderItem({
          team_guid: selectedTeam?.guid,
          team: selectedTeam
        });
      });
    }
  }

  populateRepair(repair: RepairItem) {
    this.isOwner = repair.owner_enable ?? false;
    this.isOwnerChanged();
    repair.repair_part = this.filterDeleted(repair.repair_part)
    this.repairForm?.patchValue({
      job_no: repair.job_no || this.sotItem?.job_no,
      guid: repair.guid,
      remarks: repair.remarks,
      surveyor_id: repair.aspnetusers_guid,
      labour_cost_discount: repair.labour_cost_discount,
      material_cost_discount: repair.material_cost_discount
    });
    this.updateData(repair.repair_part);
    if (!this.repairDS.canApprove(this.repairItem)) {
      this.repairForm?.get('job_no')?.disable();
    }

    if (!this.canEdit()) {
      this.repairForm?.get('surveyor_id')?.disable();
      this.repairForm?.get('labour_cost_discount')?.disable();
      this.repairForm?.get('material_cost_discount')?.disable();
      this.repairForm?.get('remarks')?.disable();
    }
  }

  // getCustomerLabourPackage(customer_company_guid: string) {
  //   const where = {
  //     and: [
  //       { customer_company_guid: { eq: customer_company_guid } }
  //     ]
  //   }
  //   this.subs.sink = this.plDS.getCustomerPackageCost(where).subscribe(data => {
  //     if (data?.length > 0) {
  //       this.packageLabourItem = data[0];
  //     }
  //   });
  // }

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

  displayCustomerCompanyName(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name}) - ${cc.type_cv === 'BRANCH' ? cc.type_cv : 'CUSTOMER'}` : '';
  }

  selectOwner($event: Event, row: RepairPartItem) {
    this.stopPropagation($event);
    row.owner = !(row.owner || false);
    this.calculateCost();
    this.calculateCostEst();
  }

  onCancel(event: Event) {
    this.preventDefault(event);
    console.log(this.repairItem)

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
        item: [this.repairItem],
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const reList = result.item.map((item: RepairItem) => new RepairGO(item));

        const repReqList = this.repList?.map((rep: RepairPartItem) => {
          return {
            guid: rep?.guid,
            approve_part: rep.approve_part ?? this.repairPartDS.is4X(rep.rp_damage_repair)
          }
        });

        var repairStatusReq: RepairStatusRequest = new RepairStatusRequest({
          guid: reList[0].guid,
          sot_guid: this.sotItem!.guid,
          action: "NA",
          remarks: reList[0].remarks,
          repairPartRequests: repReqList
        });
        console.log(repairStatusReq);
        this.repairDS.updateRepairStatus(repairStatusReq).subscribe(result => {
          console.log(result)
          if (result.data.updateRepairStatus > 0) {
            this.handleSaveSuccess(result.data.updateRepairStatus);
          }
        });
      }
    });
  }

  onRollback(event: Event) {
    this.preventDefault(event);

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
        item: [this.repairItem],
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const reList = result.item.map((item: any) => {
          const RepairRequestInput = new RepairRequest({
            customer_guid: this.sotItem?.storing_order?.customer_company?.guid,
            estimate_no: item.estimate_no,
            guid: item.guid,
            is_approved: true,
            remarks: item.remarks,
            sot_guid: item.sot_guid
          })
          return RepairRequestInput
        });
        console.log(reList);
        this.repairDS.rollbackRepair(reList).subscribe(result => {
          this.handleRollbackSuccess(result?.data?.rollbackRepair)
        });
      }
    });
  }

  onAbort(event: Event) {
    this.preventDefault(event);
    console.log(this.repairItem)

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
        item: [this.repairItem],
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const distinctJobOrders = this.repList
          .filter((item, index, self) =>
            index === self.findIndex(t => t.job_order?.guid === item.job_order?.guid &&
              (t.job_order?.team?.guid === item?.job_order?.team_guid ||
                t.job_order?.team?.description === item?.job_order?.team?.description))
          )
          .filter(item => item.job_order !== null && item.job_order !== undefined)
          .map(item => new JobOrderGO(item.job_order!));

        const repJobOrder = new RepJobOrderRequest({
          guid: this.repairItem?.guid,
          sot_guid: this.repairItem?.sot_guid,
          estimate_no: this.repairItem?.estimate_no,
          remarks: this.repairItem?.remarks,
          job_order: distinctJobOrders
        });

        console.log(repJobOrder)
        this.repairDS.abortRepair(repJobOrder).subscribe(result => {
          console.log(result)
          this.handleCancelSuccess(result?.data?.abortRepair)
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
  }

  onApprove(event: Event) {
    event.preventDefault();
    const bill_to = this.repairForm!.get('bill_to');
    bill_to?.setErrors(null);
    if (bill_to?.value) {
      let re: RepairItem = new RepairItem();
      re.guid = this.repairItem?.guid;
      re.sot_guid = this.repairItem?.sot_guid;
      re.bill_to_guid = bill_to?.value?.guid;
      re.status_cv = this.repairItem?.status_cv;
      re.owner_enable = this.isOwner;
      re.job_no = this.repairForm?.get('job_no')?.value;
      re.labour_cost_discount = Utility.convertNumber(this.repairForm?.get('labour_cost_discount')?.value, 2);
      re.material_cost_discount = Utility.convertNumber(this.repairForm?.get('material_cost_discount')?.value, 2);
      re.total_cost = Utility.convertNumber(this.repairForm?.get('net_cost')?.value, 2);
      re.total_hour = Utility.convertNumber(this.repairForm?.get('total_hour')?.value, 2);
      re.est_cost = Utility.convertNumber(this.repairForm?.get('net_cost_est')?.value, 2);
      re.total_labour_cost = Utility.convertNumber(this.repairForm?.get('total_labour_cost')?.value, 2);
      re.total_material_cost = Utility.convertNumber(this.repairForm?.get('total_mat_cost')?.value, 2);

      re.repair_part = this.repList?.map((rep: RepairPartItem) => {
        const approvePart = rep.approve_part ?? this.repairPartDS.is4X(rep.rp_damage_repair);
        return new RepairPartItem({
          ...rep,
          tariff_repair: undefined,
          rp_damage_repair: undefined,
          approve_part: approvePart,
          approve_qty: approvePart ? Utility.convertNumber((rep.approve_qty ?? rep.quantity), 2) : 0,
          approve_hour: approvePart ? Utility.convertNumber((rep.approve_hour ?? rep.hour), 2) : 0,
          approve_cost: approvePart ? Utility.convertNumber((rep.approve_cost ?? rep.material_cost), 2) : 0,
          job_order: undefined,
        });
      });
      console.log(re)
      this.repairDS.approveRepair(re).subscribe(result => {
        console.log(result)
        if ((result?.data?.approveRepair ?? 0) > 0) {
          if (this.modulePackageService.isGrowthPackage() || this.modulePackageService.isCustomizedPackage()) {
            this.handleSaveSuccess(result?.data?.approveRepair);
          } else {
            this.submitAssignJobOrder();
          }
        }
      });
    } else {
      bill_to?.setErrors({ required: true })
      bill_to?.markAsTouched();
      bill_to?.updateValueAndValidity();
    }
  }

  submitAssignJobOrder() {
    const distinctJobOrders = this.repList
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
        const filteredParts = this.repList.filter(part =>
        // ((part.job_order?.guid && part.job_order?.guid === jo?.guid) || !part.job_order?.guid) &&
        (part.job_order?.team?.guid === jo?.team_guid ||
          part.job_order?.team?.description === jo?.team?.description)
        );
        const partList = filteredParts.map(part => part.guid);
        const totalApproveHours = filteredParts.reduce((total, part) => total + (part.approve_hour || 0), 0);

        const joRequest = new JobOrderRequest();
        joRequest.guid = jo.guid;
        joRequest.job_type_cv = jo.job_type_cv ?? 'REPAIR';
        joRequest.remarks = jo.remarks;
        joRequest.sot_guid = jo.sot_guid ?? this.sotItem?.guid;
        joRequest.status_cv = jo.status_cv;
        joRequest.team_guid = jo.team_guid;
        joRequest.total_hour = jo.total_hour ?? totalApproveHours;
        joRequest.working_hour = jo.working_hour ?? 0;
        joRequest.process_guid = this.repairItem?.guid;
        joRequest.part_guid = partList;
        finalJobOrder.push(joRequest);
      }
    });
    console.log(finalJobOrder);
    const without4x = this.repList.filter(part =>
      !part.job_order?.guid && !part.job_order?.team?.guid && !this.repairPartDS.is4X(part.rp_damage_repair) && this.repairPartDS.isApproved(part)
    );
    this.joDS.assignJobOrder(finalJobOrder).subscribe(result => {
      console.log(result)
      if ((result?.data?.assignJobOrder ?? 0) > 0 && missingJobOrders?.length) {
        const jobOrderGuidToDelete = missingJobOrders.map(jo => jo?.guid!)
        this.joDS.deleteJobOrder(jobOrderGuidToDelete).subscribe(result => {
          console.log(`deleteJobOrder: ${JSON.stringify(jobOrderGuidToDelete)}, result: ${JSON.stringify(result)}`);
        });
      }

      const action = without4x?.length ? "PARTIAL_ASSIGN" : "ASSIGN";
      console.log(without4x?.length ? "some parts are not assigned" : "all parts are assigned");

      const repairStatusReq: RepairStatusRequest = new RepairStatusRequest({
        guid: this.repairItem!.guid,
        sot_guid: this.sotItem!.guid,
        action
      });

      console.log(repairStatusReq);

      this.repairDS.updateRepairStatus(repairStatusReq).subscribe(result => {
        console.log(result);
        if (result.data.updateRepairStatus > 0) {
          this.handleSaveSuccess(result.data.updateRepairStatus);
        }
      });
    });
  }

  onOwnerToggle(event: MatCheckboxChange): void {
    this.isOwner = event.checked;
    this.isOwnerChanged();
  }

  onFormSubmit() {
    this.repairForm!.get('repList')?.setErrors(null);
  }

  isOwnerChanged(): void {
    if (this.isOwner) {
      this.displayedColumns = [
        'seq',
        'subgroup_name_cv',
        'damange',
        'repair',
        'description',
        'quantity',
        'hour',
        'price',
        'material',
        'isOwner',
        'approve_part',
        'approve_qty',
        'approve_hour',
        'approve_cost'
      ];
    } else {
      this.displayedColumns = [
        'seq',
        'subgroup_name_cv',
        'damange',
        'repair',
        'description',
        'quantity',
        'hour',
        'price',
        'material',
        'approve_part',
        'approve_qty',
        'approve_hour',
        'approve_cost'
      ];
    }
  }

  updateData(newData: RepairPartItem[] | undefined): void {
    if (newData?.length) {
      newData = newData.map((row) => ({
        ...row,
        approve_qty: this.displayApproveQty(row),
        approve_hour: this.displayApproveHour(row),
        approve_cost: this.displayApproveCost(row),
        tariff_repair: {
          ...row.tariff_repair,
          sequence: this.getGroupSeq(row.tariff_repair?.group_name_cv)
        }
      }));

      newData = this.repairPartDS.sortAndGroupByGroupName(newData);
      // newData = [...this.sortREP(newData)];

      this.repList = newData.map((row, index) => ({
        ...row,
        index: index
      }));
      this.calculateCost();
      this.calculateCostEst();
    }
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.APPROVE_SUCCESS;
      ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
      this.router.navigate(['/admin/repair/approval']);
    }
  }

  handleCancelSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.CANCELED_SUCCESS;
      ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
      this.router.navigate(['/admin/repair/approval']);
    }
  }

  handleRollbackSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.REINSTATE_SUCCESS;
      ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
      this.router.navigate(['/admin/repair/approval']);
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

  getProcessStatusDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.processStatusCvList);
  }

  getGroupSeq(codeVal: string | undefined): number | undefined {
    const gncv = this.groupNameCvList.filter(x => x.code_val === codeVal);
    if (gncv.length) {
      return gncv[0].sequence;
    }
    return -1;
  }

  sortREP(newData: RepairPartItem[]): any[] {
    newData.sort((a, b) => b.create_dt! - a.create_dt!);
    return newData;
  }

  displayDamageRepairCode(damageRepair: any[], filterCode: number): string {
    return damageRepair?.filter((x: any) => x.code_type === filterCode && (!x.delete_dt && x.action !== 'cancel') || (x.delete_dt && x.action === 'edit')).map(item => {
      return item.code_cv;
    }).join('/');
  }

  displayDamageRepairCodeDescription(damageRepair: any[], filterCode: number): string {
    const concate = damageRepair?.filter((x: any) => x.code_type === filterCode && (!x.delete_dt && x.action !== 'cancel') || (x.delete_dt && x.action === 'edit')).map(item => {
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

  parse2Decimal(input: number | string | undefined) {
    return Utility.formatNumberDisplay(input);
  }

  calculateCost() {
    const ownerList = this.repList.filter(item => item.owner && !item.delete_dt && (item.approve_part ?? true));
    const lesseeList = this.repList.filter(item => !item.owner && !item.delete_dt && (item.approve_part ?? true));
    const labourDiscount = this.repairForm?.get('labour_cost_discount')?.value;
    const matDiscount = this.repairForm?.get('material_cost_discount')?.value;

    let total_hour = 0;
    let total_labour_cost = 0;
    let total_mat_cost = 0;
    let total_cost = 0;
    let discount_labour_cost = 0;
    let discount_mat_cost = 0;
    let net_cost = 0;

    const totalOwner = this.repairDS.getTotal(ownerList);
    const total_owner_hour = totalOwner.hour;
    const total_owner_labour_cost = this.repairDS.getTotalLabourCost(total_owner_hour, this.getLabourCost());
    const total_owner_mat_cost = totalOwner.total_mat_cost;
    const total_owner_cost = this.repairDS.getTotalCost(total_owner_labour_cost, total_owner_mat_cost);
    const discount_labour_owner_cost = this.repairDS.getDiscountCost(labourDiscount, total_owner_labour_cost);
    const discount_mat_owner_cost = this.repairDS.getDiscountCost(matDiscount, total_owner_mat_cost);
    const net_owner_cost = this.repairDS.getNetCost(total_owner_cost, discount_labour_owner_cost, discount_mat_owner_cost);

    this.repairForm?.get('total_owner_hour')?.setValue(this.parse2Decimal(total_owner_hour));
    this.repairForm?.get('total_owner_labour_cost')?.setValue(this.parse2Decimal(total_owner_labour_cost));
    this.repairForm?.get('total_owner_mat_cost')?.setValue(this.parse2Decimal(total_owner_mat_cost));
    this.repairForm?.get('total_owner_cost')?.setValue(this.parse2Decimal(total_owner_cost));
    this.repairForm?.get('discount_labour_owner_cost')?.setValue(this.parse2Decimal(discount_labour_owner_cost));
    this.repairForm?.get('discount_mat_owner_cost')?.setValue(this.parse2Decimal(discount_mat_owner_cost));
    this.repairForm?.get('net_owner_cost')?.setValue(this.parse2Decimal(net_owner_cost));

    total_hour += total_owner_hour;
    total_labour_cost += total_owner_labour_cost;
    total_mat_cost += total_owner_mat_cost;
    total_cost += total_owner_cost;
    discount_labour_cost += discount_labour_owner_cost;
    discount_mat_cost += discount_mat_owner_cost;
    net_cost += net_owner_cost;

    const totalLessee = this.repairDS.getTotal(lesseeList);
    const total_lessee_hour = totalLessee.hour;
    const total_lessee_labour_cost = this.repairDS.getTotalLabourCost(total_lessee_hour, this.getLabourCost());
    const total_lessee_mat_cost = totalLessee.total_mat_cost;
    const total_lessee_cost = this.repairDS.getTotalCost(total_lessee_labour_cost, total_lessee_mat_cost);
    const discount_labour_lessee_cost = this.repairDS.getDiscountCost(labourDiscount, total_lessee_labour_cost);
    const discount_mat_lessee_cost = this.repairDS.getDiscountCost(matDiscount, total_lessee_mat_cost);
    const net_lessee_cost = this.repairDS.getNetCost(total_lessee_cost, discount_labour_lessee_cost, discount_mat_lessee_cost);

    this.repairForm?.get('total_lessee_hour')?.setValue(this.parse2Decimal(total_lessee_hour));
    this.repairForm?.get('total_lessee_labour_cost')?.setValue(this.parse2Decimal(total_lessee_labour_cost));
    this.repairForm?.get('total_lessee_mat_cost')?.setValue(this.parse2Decimal(total_lessee_mat_cost));
    this.repairForm?.get('total_lessee_cost')?.setValue(this.parse2Decimal(total_lessee_cost));
    this.repairForm?.get('discount_labour_lessee_cost')?.setValue(this.parse2Decimal(discount_labour_lessee_cost));
    this.repairForm?.get('discount_mat_lessee_cost')?.setValue(this.parse2Decimal(discount_mat_lessee_cost));
    this.repairForm?.get('net_lessee_cost')?.setValue(this.parse2Decimal(net_lessee_cost));

    total_hour += total_lessee_hour;
    total_labour_cost += total_lessee_labour_cost;
    total_mat_cost += total_lessee_mat_cost;
    total_cost += total_lessee_cost;
    discount_labour_cost += discount_labour_lessee_cost;
    discount_mat_cost += discount_mat_lessee_cost;
    net_cost += net_lessee_cost;

    this.repairForm?.get('total_hour')?.setValue(this.parse2Decimal(total_hour));
    this.repairForm?.get('total_labour_cost')?.setValue(this.parse2Decimal(total_labour_cost));
    this.repairForm?.get('total_mat_cost')?.setValue(this.parse2Decimal(total_mat_cost));
    this.repairForm?.get('total_cost')?.setValue(this.parse2Decimal(total_cost));
    this.repairForm?.get('discount_labour_cost')?.setValue(this.parse2Decimal(discount_labour_cost));
    this.repairForm?.get('discount_mat_cost')?.setValue(this.parse2Decimal(discount_mat_cost));
    this.repairForm?.get('net_cost')?.setValue(this.parse2Decimal(net_cost));

    this.checkApprovePart();
  }

  calculateCostEst() {
    const ownerList = this.repList.filter(item => item.owner && !item.delete_dt);
    const lesseeList = this.repList.filter(item => !item.owner && !item.delete_dt);
    const labourDiscount = this.repairForm?.get('labour_cost_discount')?.value;
    const matDiscount = this.repairForm?.get('material_cost_discount')?.value;

    let total_hour = 0;
    let total_labour_cost = 0;
    let total_mat_cost = 0;
    let total_cost = 0;
    let discount_labour_cost = 0;
    let discount_mat_cost = 0;
    let net_cost = 0;

    const totalOwner = this.repairDS.getTotalEst(ownerList);
    const total_owner_hour = totalOwner.hour;
    const total_owner_labour_cost = this.repairDS.getTotalLabourCost(total_owner_hour, this.getLabourCost());
    const total_owner_mat_cost = totalOwner.total_mat_cost;
    const total_owner_cost = this.repairDS.getTotalCost(total_owner_labour_cost, total_owner_mat_cost);
    const discount_labour_owner_cost = this.repairDS.getDiscountCost(labourDiscount, total_owner_labour_cost);
    const discount_mat_owner_cost = this.repairDS.getDiscountCost(matDiscount, total_owner_mat_cost);
    const net_owner_cost = this.repairDS.getNetCost(total_owner_cost, discount_labour_owner_cost, discount_mat_owner_cost);

    this.repairForm?.get('total_owner_hour_est')?.setValue(this.parse2Decimal(total_owner_hour));
    this.repairForm?.get('total_owner_labour_cost_est')?.setValue(this.parse2Decimal(total_owner_labour_cost));
    this.repairForm?.get('total_owner_mat_cost_est')?.setValue(this.parse2Decimal(total_owner_mat_cost));
    this.repairForm?.get('total_owner_cost_est')?.setValue(this.parse2Decimal(total_owner_cost));
    this.repairForm?.get('discount_labour_owner_cost_est')?.setValue(this.parse2Decimal(discount_labour_owner_cost));
    this.repairForm?.get('discount_mat_owner_cost_est')?.setValue(this.parse2Decimal(discount_mat_owner_cost));
    this.repairForm?.get('net_owner_cost_est')?.setValue(this.parse2Decimal(net_owner_cost));

    total_hour += total_owner_hour;
    total_labour_cost += total_owner_labour_cost;
    total_mat_cost += total_owner_mat_cost;
    total_cost += total_owner_cost;
    discount_labour_cost += discount_labour_owner_cost;
    discount_mat_cost += discount_mat_owner_cost;
    net_cost += net_owner_cost;

    const totalLessee = this.repairDS.getTotal(lesseeList);
    const total_lessee_hour = totalLessee.hour;
    const total_lessee_labour_cost = this.repairDS.getTotalLabourCost(total_lessee_hour, this.getLabourCost());
    const total_lessee_mat_cost = totalLessee.total_mat_cost;
    const total_lessee_cost = this.repairDS.getTotalCost(total_lessee_labour_cost, total_lessee_mat_cost);
    const discount_labour_lessee_cost = this.repairDS.getDiscountCost(labourDiscount, total_lessee_labour_cost);
    const discount_mat_lessee_cost = this.repairDS.getDiscountCost(matDiscount, total_lessee_mat_cost);
    const net_lessee_cost = this.repairDS.getNetCost(total_lessee_cost, discount_labour_lessee_cost, discount_mat_lessee_cost);

    this.repairForm?.get('total_lessee_hour_est')?.setValue(this.parse2Decimal(total_lessee_hour));
    this.repairForm?.get('total_lessee_labour_cost_est')?.setValue(this.parse2Decimal(total_lessee_labour_cost));
    this.repairForm?.get('total_lessee_mat_cost_est')?.setValue(this.parse2Decimal(total_lessee_mat_cost));
    this.repairForm?.get('total_lessee_cost_est')?.setValue(this.parse2Decimal(total_lessee_cost));
    this.repairForm?.get('discount_labour_lessee_cost_est')?.setValue(this.parse2Decimal(discount_labour_lessee_cost));
    this.repairForm?.get('discount_mat_lessee_cost_est')?.setValue(this.parse2Decimal(discount_mat_lessee_cost));
    this.repairForm?.get('net_lessee_cost_est')?.setValue(this.parse2Decimal(net_lessee_cost));

    total_hour += total_lessee_hour;
    total_labour_cost += total_lessee_labour_cost;
    total_mat_cost += total_lessee_mat_cost;
    total_cost += total_lessee_cost;
    discount_labour_cost += discount_labour_lessee_cost;
    discount_mat_cost += discount_mat_lessee_cost;
    net_cost += net_lessee_cost;

    this.repairForm?.get('total_hour_est')?.setValue(this.parse2Decimal(total_hour));
    this.repairForm?.get('total_labour_cost_est')?.setValue(this.parse2Decimal(total_labour_cost));
    this.repairForm?.get('total_mat_cost_est')?.setValue(this.parse2Decimal(total_mat_cost));
    this.repairForm?.get('total_cost_est')?.setValue(this.parse2Decimal(total_cost));
    this.repairForm?.get('discount_labour_cost_est')?.setValue(this.parse2Decimal(discount_labour_cost));
    this.repairForm?.get('discount_mat_cost_est')?.setValue(this.parse2Decimal(discount_mat_cost));
    this.repairForm?.get('net_cost_est')?.setValue(this.parse2Decimal(net_cost));
  }

  filterDeleted(resultList: any[] | undefined): any {
    return (resultList || []).filter((row: any) => !row.delete_dt);
  }

  canExport(): boolean {
    return !!this.repair_guid;
  }

  canToggleOwner() {
    return !this.sotDS.isCustomerSameAsOwner(this.sotItem) && this.canEdit();
  }

  isDisabled(repairPart: RepairPartItem): boolean {
    const packageCheck = (!this.canEdit());
    const repairCheck = !this.repairDS.canApprove(this.repairItem);
    const repairPartCheck = (this.repairPartDS.is4X(repairPart?.rp_damage_repair) ?? true) || !(repairPart?.approve_part ?? true);
    // const isBilled = (!this.repairItem?.customer_billing_guid && !this.repairItem?.customer_billing_guid);
    // return (packageCheck) || (repairCheck || repairPartCheck || isBilled)
    return (packageCheck) || (repairCheck || repairPartCheck)
  }

  getLabourCost(): number | undefined {
    return this.repairItem?.labour_cost;
  }

  toggleApprovePart(event: Event, rep: RepairPartItem) {
    this.stopPropagation(event);
    if (!this.repairDS.canAmend(this.repairItem)) return;
    const previousValue = rep.approve_part;
    rep.approve_part = rep.approve_part !== null ? !rep.approve_part : false;

    if (previousValue === false && rep.approve_part === true) {
      rep.approve_qty = rep.quantity;
      rep.approve_hour = rep.hour;
      rep.approve_cost = rep.material_cost;
    }
    this.updateData(this.repList);
  }

  checkApprovePart() {
    this.canApproveFlag = this.repList.some(rep => rep.approve_part || (rep.approve_part === null && !this.repairPartDS.is4X(rep.rp_damage_repair)));
  }

  canApprove() {
    const packageCheck = (!this.modulePackageService.isGrowthPackage() && !this.modulePackageService.isCustomizedPackage());
    return this.canApproveFlag && (this.repairDS.canApprove(this.repairItem))
  }

  displayApproveQty(rep: RepairPartItem) {
    return (rep.approve_part ?? !this.repairPartDS.is4X(rep.rp_damage_repair)) ? (rep.approve_qty !== null && rep.approve_qty !== undefined ? rep.approve_qty : rep.quantity) : 0;
  }

  displayApproveHour(rep: RepairPartItem) {
    return (rep.approve_part ?? !this.repairPartDS.is4X(rep.rp_damage_repair)) ? (rep.approve_hour !== null && rep.approve_hour !== undefined ? rep.approve_hour : rep.hour) : 0;
  }

  displayApproveCost(rep: RepairPartItem) {
    return Utility.convertNumber((rep.approve_part ?? !this.repairPartDS.is4X(rep.rp_damage_repair)) ? (rep.approve_cost !== null && rep.approve_cost !== undefined ? rep.approve_cost : rep.material_cost) : 0, 2);
  }

  canEdit() {
    return this.isAllowEdit() && this.repairDS.canAmend(this.repairItem);
  }

  isAllowEdit() {
    return this.modulePackageService.hasFunctions(['REPAIR_ESTIMATE_APPROVAL_EDIT']);
  }

  isAllowDelete() {
    return this.modulePackageService.hasFunctions(['REPAIR_ESTIMATE_APPROVAL_DELETE']);
  }

  displayApproveUpdateButton() {
    return this.canEdit() && this.repairItem?.status_cv === "PENDING" ? this.translatedLangText.APPROVE : this.translatedLangText.UPDATE;
  }
}