import { Direction } from '@angular/cdk/bidi';
import { CommonModule, NgClass } from '@angular/common';
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
import { MatFormFieldModule } from '@angular/material/form-field';
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
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { InGateSurveyItem } from 'app/data-sources/in-gate-survey';
import { JobOrderDS, JobOrderGO, JobProcessRequest, ResJobOrderRequest } from 'app/data-sources/job-order';
import { PackageLabourDS } from 'app/data-sources/package-labour';
import { PackageRepairDS } from 'app/data-sources/package-repair';
import { RepairDS, RepairItem } from 'app/data-sources/repair';
import { RepairPartDS, RepairPartItem } from 'app/data-sources/repair-part';
import { ResidueDS, ResidueItem } from 'app/data-sources/residue';
import { ResiduePartItem } from 'app/data-sources/residue-part';
import { RPDamageRepairDS } from 'app/data-sources/rp-damage-repair';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { UserDS } from 'app/data-sources/user';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';

@Component({
  selector: 'app-estimate-qc',
  standalone: true,
  templateUrl: './estimate-qc.component.html',
  styleUrl: './estimate-qc.component.scss',
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
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    RouterLink,
    MatRadioModule,
    MatDividerModule,
    MatMenuModule,
    MatCardModule
  ]
})
export class ResidueQCViewComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
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
  pageTitleDetails = 'MENUITEMS.REPAIR.LIST.APPROVAL-DETAILS'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT',
    'MENUITEMS.REPAIR.LIST.APPROVAL'
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
    ESTIMATE_DATE: 'COMMON-FORM.ESTIMATE-DATE',
    APPROVE: 'COMMON-FORM.APPROVE',
    NO_ACTION: 'COMMON-FORM.NO-ACTION',
    ROLLBACK: 'COMMON-FORM.ROLLBACK',
    BILL_DETAILS: 'COMMON-FORM.BILL-DETAILS',
    BILL_TO: 'COMMON-FORM.BILL-TO',
    APPROVE_INFO: 'COMMON-FORM.APPROVE-INFO',
    TEAM: 'COMMON-FORM.TEAM',
    QC_DATE: 'COMMON-FORM.QC-DATE',
    ESTIMATE: 'COMMON-FORM.ESTIMATE',
    APPROVAL: 'COMMON-FORM.APPROVAL',
    JOB_ALLOCATION: 'COMMON-FORM.JOB-ALLOCATION',
    QC_DETAILS: 'COMMON-FORM.QC-DETAILS',
    UPDATE_BY: 'COMMON-FORM.UPDATE-BY',
    UPDATE_DATE: 'COMMON-FORM.UPDATE-DATE',
    QC_COMPLETE: 'COMMON-FORM.QC-COMPLETE',
  }

  availableProcessStatus: string[] = [
    // 'APPROVED',
    'JOB_IN_PROGRESS',
    // 'COMPLETED',
    'QC_COMPLETED'
  ]


  clean_statusList: CodeValuesItem[] = [];

  residue_guid?: string | null;

  residueForm?: UntypedFormGroup;

  sotItem?: StoringOrderTankItem;
  repairItem?: RepairItem;
  residueItem?: ResidueItem;
  // packageLabourItem?: PackageLabourItem;
  repList: RepairPartItem[] = [];
  deList: any[] = [];
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
  jobStatusCvList: CodeValuesItem[] = []
  processStatusCvList: CodeValuesItem[] = []

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

  residueDS: ResidueDS;
  userDS: UserDS;
  joDS: JobOrderDS;
  isOwner = false;

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
    this.repairDS = new RepairDS(this.apollo);
    this.repairPartDS = new RepairPartDS(this.apollo);
    this.repDmgRepairDS = new RPDamageRepairDS(this.apollo);
    this.prDS = new PackageRepairDS(this.apollo);
    this.userDS = new UserDS(this.apollo);
    this.joDS = new JobOrderDS(this.apollo);
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
    this.residueForm = this.fb.group({
      bill_to: [''],
      job_no: [''],
      guid: [''],
      remarks: [{ value: '', disabled: true }],
      surveyor_id: [''],
      labour_cost_discount: [{ value: 0, disabled: true }],
      material_cost_discount: [{ value: 0, disabled: true }],
      last_test: [''],
      next_test: [''],
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
      deList: ['']
    });
  }

  initializeValueChanges() {
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
      { alias: 'jobStatusCv', codeValType: 'JOB_STATUS' },
      { alias: 'processStatusCv', codeValType: 'PROCESS_STATUS' },
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
    this.cvDS.connectAlias('jobStatusCv').subscribe(data => {
      this.jobStatusCvList = data;
    });
    this.cvDS.connectAlias('processStatusCv').subscribe(data => {
      this.processStatusCvList = data;
    });

    this.residue_guid = this.route.snapshot.paramMap.get('id');
    if (this.residue_guid) {
      this.subs.sink = this.residueDS.getResidueIDForJobOrder(this.residue_guid, undefined).subscribe(data => {
        if (data?.length) {
          this.residueItem = data[0];
          console.log(this.residueItem);
          this.sotItem = this.residueItem?.storing_order_tank;
          this.ccDS.getCustomerAndBranch(this.sotItem?.storing_order?.customer_company?.guid!).subscribe(cc => {
            // if (cc?.length) {
            //   const bill_to = this.residueForm?.get('bill_to');
            //   this.customer_companyList = cc;
            //   if (this.repairItem?.bill_to_guid) {
            //     const found = this.customer_companyList?.filter(x => x.guid === this.repairItem?.bill_to_guid)
            //     if (found?.length) {
            //       bill_to?.setValue(found[0]);
            //     }
            //   } else if (this.customer_companyList?.length == 1) {
            //     bill_to?.setValue(this.customer_companyList[0]);
            //   }
            //   if (!this.repairDS.canApprove(this.repairItem)) {
            //     bill_to?.disable();
            //   }
            // }
          });
          this.populateResidue(this.residueItem);
        }
      });
    }
  }

  populateResidue(residue: ResidueItem) {
    // this.isOwner = repair.owner_enable ?? false;
    residue.residue_part = this.filterDeleted(residue.residue_part)
    this.residueForm?.patchValue({
      job_no: residue.job_no || this.sotItem?.job_no,
      guid: residue.guid,
      remarks: residue.remarks,
      // surveyor_id: repair.aspnetusers_guid,
      // labour_cost_discount: repair.labour_cost_discount,
      // material_cost_discount: repair.material_cost_discount
    });
    this.updateData(residue.residue_part);
    if (!this.residueDS.canApprove(this.residueItem!)) {
      this.residueForm?.get('job_no')?.disable();
    }
  }

  populateRepair(repair: RepairItem) {
    // this.isOwner = repair.owner_enable ?? false;
    // repair.repair_part = this.filterDeleted(repair.repair_part)
    // this.repairForm?.patchValue({
    //   job_no: repair.job_no || this.sotItem?.job_no,
    //   guid: repair.guid,
    //   remarks: repair.remarks,
    //   surveyor_id: repair.aspnetusers_guid,
    //   labour_cost_discount: repair.labour_cost_discount,
    //   material_cost_discount: repair.material_cost_discount
    // });
    // this.updateData(repair.repair_part);
    // if (!this.repairDS.canApprove(this.repairItem)) {
    //   this.repairForm?.get('job_no')?.disable();
    // }
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
  }

  editApproveDetails(event: Event, row: RepairPartItem, index: number) {
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
        index: index,
        repairItem: this.repairItem
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data = [...this.repList];
        const updatedItem = new RepairPartItem({
          ...result.item,
        });
        if (result.index >= 0) {
          data[result.index] = updatedItem;
          this.updateData(data);
        } else {
          this.updateData([...this.repList, result.item]);
        }
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

  onQCComplete(event: Event) {
    event.preventDefault();
    const distinctJobOrders = this.deList
      .filter((item, index, self) =>
        index === self.findIndex(t => t.job_order?.guid === item.job_order?.guid &&
          (t.job_order?.team?.guid === item?.job_order?.team_guid ||
            t.job_order?.team?.description === item?.job_order?.team?.description))
      )
      .filter(item => item.job_order !== null && item.job_order !== undefined)
      .map(item => new JobOrderGO(item.job_order!));

    const resJobOrder = new ResJobOrderRequest({
      guid: this.residueItem?.guid,
      sot_guid: this.residueItem?.sot_guid,
      remarks: this.repairItem?.remarks,
      job_order: distinctJobOrders
    });

    console.log(resJobOrder)
    this.joDS.completeQCResidue(resJobOrder).subscribe(result => {
      console.log(result)
      this.handleSaveSuccess(result?.data?.completeQCResidue);
    });
  }

  onFormSubmit() {
    this.residueForm!.get('deList')?.setErrors(null);
  }

  updateJobProcessStatus(repair_guid: string, process_status: string) {
    var updateJobProcess: JobProcessRequest = new JobProcessRequest();
    updateJobProcess.guid = repair_guid;
    updateJobProcess.job_type_cv = "RESIDUE";
    updateJobProcess.process_status = process_status;

    this.joDS.updateJobProcessStatus(updateJobProcess).subscribe(result => {
      console.log(result)
      if (result.data.updateJobProcessStatus > 0) {
        this.handleSaveSuccess(result.data.updateJobProcessStatus);
      }
    });
  }

  updateData(newData: RepairPartItem[] | undefined): void {
    if (newData?.length) {
      // newData = newData.map((row) => ({
      //   ...row,
      //   tariff_repair: {
      //     ...row.tariff_repair,
      //     sequence: this.getGroupSeq(row.tariff_repair?.group_name_cv)
      //   }
      // }));

      // newData = this.repairPartDS.sortAndGroupByGroupName(newData);
      // newData = [...this.sortREP(newData)];

      this.deList = newData.map((row, index) => ({
        ...row,
        index: index
      }));
      // this.calculateCost();
      // this.getCalculateCost();
    }
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.SAVE_SUCCESS;
      ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
      this.router.navigate(['/admin/residue-disposal/job-order']);
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

  getBadgeClass(status: string | undefined): string {
    switch (status) {
      case 'APPROVED':
      case 'QC_COMPLETED':
        return 'badge-solid-green';
      case 'PENDING':
        return 'badge-solid-cyan';
      case 'CANCEL':
      case 'NO_ACTION':
        return 'badge-solid-red';
      case 'JOB_IN_PROGRESS':
        return 'badge-solid-purple';
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

  getJobStatusDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.jobStatusCvList);
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
    if (!input) return 'NA';
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

  filterDeleted(resultList: any[] | undefined): any {
    return (resultList || []).filter((row: any) => !row.delete_dt);
  }

  canExport(): boolean {
    return !!this.residue_guid;
  }

  IsApprovePart(rep: ResiduePartItem) {
    return rep.approve_part;
  }
}