import { Direction } from '@angular/cdk/bidi';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FileManagerService } from '@core/service/filemanager.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TlxFormFieldComponent } from '@shared/components/tlx-form/tlx-form-field/tlx-form-field.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyGO, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { InGateSurveyItem } from 'app/data-sources/in-gate-survey';
import { MasterEstimateTemplateDS, MasterTemplateItem } from 'app/data-sources/master-template';
import { PackageLabourDS, PackageLabourItem } from 'app/data-sources/package-labour';
import { PackageRepairDS } from 'app/data-sources/package-repair';
import { RepairDS, RepairGO, RepairItem } from 'app/data-sources/repair';
import { RepairPartDS, RepairPartItem } from 'app/data-sources/repair-part';
import { RPDamageRepairItem } from 'app/data-sources/rp-damage-repair';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { UserDS, UserItem } from 'app/data-sources/user';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { RepairEstimatePdfComponent } from 'app/document-template/pdf/repair-estimate-pdf/repair-estimate-pdf.component';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { Observable } from 'rxjs';
import { debounceTime, startWith, tap } from 'rxjs/operators';

export interface DialogData {
  repair_guid?: string;
  sot_guid?: string;

}

@Component({
  selector: 'app-preview-repair-estimate',
  standalone: true,
  templateUrl: './preview-repair-estimate.component.html',
  styleUrl: './preview-repair-estimate.component.scss',
  imports: [
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
    TlxFormFieldComponent,
    PreventNonNumericDirective,
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})


export class PreviewRepairEstFormDialog extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'seq',
    // 'group_name_cv',
    'subgroup_name_cv',
    'damange',
    'repair',
    'description',
    'quantity',
    'hour',
    'price',
    'material',
    'isOwner'
  ];
  pageTitleNew = 'MENUITEMS.REPAIR.LIST.ESTIMATE-NEW'
  pageTitleEdit = 'MENUITEMS.REPAIR.LIST.ESTIMATE-EDIT'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.REPAIR.TEXT', route: '/admin/repair/estimate' },
    { text: 'MENUITEMS.REPAIR.LIST.ESTIMATE', route: '/admin/repair/estimate' }
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
    REPAIR_ESTIMATE_DETAILS: 'COMMON-FORM.REPAIR-ESITMATE-DETAILS'
  }

  sot_guid?: string | null;
  repair_guid?: string | null;

  repairForm?: UntypedFormGroup;
  sotForm?: UntypedFormGroup;

  sotItem?: StoringOrderTankItem;
  repairItem?: RepairItem;
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
  clean_statusList: CodeValuesItem[] = [];
  surveyorList: UserItem[] = []
  customer_companyList?: CustomerCompanyItem[];

  customerCodeControl = new UntypedFormControl();
  dialogTitle: string = '';

  sotDS: StoringOrderTankDS;
  cvDS: CodeValuesDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  plDS: PackageLabourDS;
  repairDS: RepairDS;
  repairPartDS: RepairPartDS;
  mtDS: MasterEstimateTemplateDS;
  prDS: PackageRepairDS;
  userDS: UserDS;
  isOwner = false;

  repairEstimatePdf: any;
  isDuplicate = false;
  isFileActionLoading$: Observable<boolean> = this.fileManagerService.actionLoading$;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PreviewRepairEstFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private router: Router,
    private translate: TranslateService,
    private fileManagerService: FileManagerService,
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
    this.mtDS = new MasterEstimateTemplateDS(this.apollo);
    this.prDS = new PackageRepairDS(this.apollo);
    this.userDS = new UserDS(this.apollo);

  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.loadData();
  }

  initForm() {
    this.repairForm = this.fb.group({
      guid: [''],
      remarks: [''],
      surveyor_id: [''],
      labour_cost_discount: [0],
      material_cost_discount: [0],
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
      repList: ['']
    });
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
    this.cvDS.connectAlias('processStatusCv').subscribe(data => {
      this.processStatusCvList = data;
    });

    this.getSurveyorList();

    this.repair_guid = this.data.repair_guid;

    this.subs.sink = this.repairDS.getRepairByIDForApproval(this.repair_guid!).subscribe(data => {
      if (data?.length) {
        this.repairItem = data[0];
        this.sotItem = this.repairItem?.storing_order_tank;
        this.ccDS.getCustomerAndBranch(this.sotItem?.storing_order?.customer_company?.guid!).subscribe(cc => {
          if (cc?.length) {
            const bill_to = this.repairForm?.get('bill_to');
            this.customer_companyList = cc;
            if (this.repairItem?.bill_to_guid) {
              const found = this.customer_companyList?.filter(x => x.guid === this.repairItem?.bill_to_guid)
              if (found?.length) {
                bill_to?.setValue(found[0]);
              }
            } else if (this.customer_companyList?.length == 1) {
              bill_to?.setValue(this.customer_companyList[0]);
            }
            if (!this.repairDS.canApprove(this.repairItem)) {
              bill_to?.disable();
            }
          }
        });
        this.populateRepair(this.repairItem);
      }
    });
  }

  populateRepair(repair: RepairItem | undefined) {
    this.populateFoundRepair(repair!);

    this.fileManagerService.getFileUrlByGroupGuid([this.repair_guid!]).subscribe({
      next: (response) => {
        console.log('Files retrieved successfully:', response);
        if (response?.length) {
          this.repairEstimatePdf = response.filter((f: any) => f.description === 'REPAIR_ESTIMATE');
        }
      },
      error: (error) => {
        console.error('Error retrieving files:', error);
      },
      complete: () => {
        console.log('File retrieval process completed.');
      }
    });
    this.isOwnerChanged();
  }

  populateFoundRepair(repair: RepairItem) {
    this.repairItem = repair;
    this.isOwner = (repair!.owner_enable ?? false);
    this.repairItem!.repair_part = this.filterDeleted(repair!.repair_part).map((rep: any) => {
      return rep;
    });
    console.log(this.repairItem!.repair_part);
    this.updateData(this.repairItem!.repair_part);
    this.repairForm?.patchValue({
      guid: this.repairItem!.guid,
      remarks: this.repairItem!.remarks,
      surveyor_id: this.repairItem!.aspnetusers_guid,
      labour_cost_discount: this.repairItem!.labour_cost_discount,
      material_cost_discount: this.repairItem!.material_cost_discount
    });

    this.repairForm?.get('surveyor_id')?.disable();
    this.repairForm?.get('labour_cost_discount')?.disable();
    this.repairForm?.get('material_cost_discount')?.disable();
    this.repairForm?.get('remarks')?.disable();
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
    this.calculateCostEst();
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

  onExport(event: Event) {
    this.preventDefault(event);
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(RepairEstimatePdfComponent, {
      width: '794px',
      height: '80vh',
      data: {
        type: this.sotItem?.purpose_repair_cv,
        repair_guid: this.repairItem?.guid,
        customer_company_guid: this.sotItem?.storing_order?.customer_company_guid,
        estimate_no: this.repairItem?.estimate_no,
        repairEstimatePdf: this.repairEstimatePdf
      },
      // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });
    this.subs.sink = dialogRef.componentInstance.repairEstimateEvent.subscribe((result) => {
      console.log(`Event received from MatDialog: repairEstimateEvent type = ${result?.type}`);
      if (result?.type === 'uploaded') {
        this.repairEstimatePdf = result?.repairEstimatePdf;
      }
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    });
  }

  updateData(newData: RepairPartItem[] | undefined): void {
    if (newData?.length) {
      newData = newData.map((row) => ({
        ...row,
        approve_qty: BusinessLogicUtil.displayApproveQty(row),
        approve_hour: BusinessLogicUtil.displayApproveHour(row),
        approve_cost: BusinessLogicUtil.displayApproveCost(row),
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
    } else {
      this.repList = [];
      this.calculateCost();
      this.calculateCostEst();
    }
  }

  // handleDelete(event: Event, row: any, index: number): void {
  //   this.deleteItem(event, row, index);
  // }

  handleDuplicateRow(event: Event, row: StoringOrderTankItem): void {
    let newSot: StoringOrderTankItem = new StoringOrderTankItem();
    newSot.unit_type_guid = row.unit_type_guid;
    newSot.last_cargo_guid = row.last_cargo_guid;
    newSot.tariff_cleaning = row.tariff_cleaning;
    newSot.clean_status_cv = row.clean_status_cv;
    newSot.certificate_cv = row.certificate_cv;
    newSot.so_guid = row.so_guid;
    newSot.eta_dt = row.eta_dt;
    newSot.etr_dt = row.etr_dt;
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
      this.dialogTitle = this.translatedLangText.REPAIR_ESTIMATE_DETAILS;
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

  canToggleOwner() {
    return !this.sotDS.isCustomerSameAsOwner(this.sotItem) && this.repairDS.canAmend(this.repairItem);
  }

  onOwnerToggle(event: MatCheckboxChange): void {
    this.isOwner = event.checked;
    this.isOwnerChanged();
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
        'isOwner'
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
        'material'
      ];
    }
  }

  isAnyItemEdited(): boolean {
    return true;//!this.storingOrderItem.status_cv || (this.sotList?.data.some(item => item.action) ?? false);
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

  getProcessStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.processStatusCvList);
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
    return damageRepair?.filter((x: any) => x.code_type === filterCode && ((!x.delete_dt && x.action !== 'cancel') || (x.delete_dt && x.action === 'rollback'))).map(item => {
      return item.code_cv;
    }).join('/');
  }

  displayDamageRepairCodeDescription(damageRepair: any[], filterCode: number): string {
    const concate = damageRepair?.filter((x: any) => x.code_type === filterCode && ((!x.delete_dt && x.action !== 'cancel') || (x.delete_dt && x.action === 'rollback'))).map(item => {
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

    const totalLessee = this.repairDS.getTotalEst(lesseeList);
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
    return !!this.repair_guid;
  }

  getLabourCost(): number | undefined {
    return this.repairItem?.labour_cost;
  }

  getDisplayLabourCost(): string {
    return this.parse2Decimal(this.getLabourCost())
  }

  hasMenuItems(row: any): boolean {
    return (
      this.repairDS.canAmend(this.repairItem)
    );
  }
  onClose(event: Event) {
    event.stopPropagation();
    event.preventDefault(); // Prevents the form submission
    this.dialogRef.close();
  }
}