import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
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
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { InGateSurveyItem } from 'app/data-sources/in-gate-survey';
import { JobOrderDS, JobOrderGO, JobOrderItem, JobOrderRequest, JobProcessRequest, ResJobOrderRequest } from 'app/data-sources/job-order';
import { MasterEstimateTemplateDS, MasterTemplateItem } from 'app/data-sources/master-template';
import { PackageLabourItem } from 'app/data-sources/package-labour';
import { PackageRepairDS } from 'app/data-sources/package-repair';
import { PackageResidueDS, PackageResidueItem } from 'app/data-sources/package-residue';
import { RepairItem } from 'app/data-sources/repair';
import { RepairPartItem } from 'app/data-sources/repair-part';
import { ResidueDS, ResidueGO, ResidueItem, ResidueStatusRequest } from 'app/data-sources/residue';
import { ResiduePartItem } from 'app/data-sources/residue-part';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TeamDS, TeamItem } from 'app/data-sources/teams';
import { UserDS, UserItem } from 'app/data-sources/user';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility ,selected_job_task_color} from 'app/utilities/utility';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { CancelFormDialogComponent } from './dialogs/cancel-form-dialog/cancel-form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';
import { ModulePackageService } from 'app/services/module-package.service';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-residue-disposal-job-order-estimate-new',
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
    MatCardModule
  ]
})
export class JobOrderAllocationResidueDisposalComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  tabIndex = 0;
  historyState: any = {};
  displayedColumns = [
    'seq',
    'desc',
    'approve_part',
    'team',
  ];
  pageTitleDetails = 'MENUITEMS.REPAIR.LIST.JOB-ORDER'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.RESIDUE-DISPOSAL.TEXT', route: '/admin/residue-disposal/job-order', queryParams: { tabIndex: this.tabIndex } },
    { text: 'MENUITEMS.REPAIR.LIST.JOB-ORDER', route: '/admin/residue-disposal/job-order', queryParams: { tabIndex: this.tabIndex } }
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
    CANCELED_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
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
    BILLING_DETAILS: 'COMMON-FORM.BILLING-DETAILS',
    BILL_TO: 'COMMON-FORM.BILL-TO',
    BILLING_BRANCH: 'COMMON-FORM.BILLING-BRANCH',
    JOB_REFERENCE: 'COMMON-FORM.JOB-REFERENCE',
    QUANTITY: 'COMMON-FORM.QTY',
    UNIT_PRICE: 'COMMON-FORM.UNIT-PRICE',
    COST: 'COMMON-FORM.COST',
    APPROVE: 'COMMON-FORM.APPROVE',
    NO_ACTION: 'COMMON-FORM.NO-ACTION',
    ROLLBACK: 'COMMON-FORM.ROLLBACK',
    ROLLBACK_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    TEAM_ALLOCATION: 'COMMON-FORM.TEAM-ALLOCATION',
    ASSIGN: 'COMMON-FORM.ASSIGN',
    TEAM: 'COMMON-FORM.TEAM',
    REPAIR_EST_TAB_TITLE: 'COMMON-FORM.JOB-ALLOCATION',
    JOB_ORDER_TAB_TITLE: 'COMMON-FORM.JOBS',
    QC: 'COMMON-FORM.QC',
    JOB_ORDER_NO: 'COMMON-FORM.JOB-ORDER-NO',
    METHOD: "COMMON-FORM.METHOD",
    RESIDUE_DISPOSAL: 'COMMON-FORM.RESIDUE-DISPOSAL',
    APPROVE_DATE: 'COMMON-FORM.APPROVE-DATE',
    ABORT: 'COMMON-FORM.ABORT',
    VIEW: 'COMMON-FORM.VIEW',
    UNASSIGN: 'COMMON-FORM.UNASSIGN',
  }

  clean_statusList: CodeValuesItem[] = [];

  sot_guid?: string | null;
  repair_guid?: string | null;

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
  packResidueList: PackageResidueItem[] = [];
  displayPackResidueList: PackageResidueItem[] = [];
  deList: ResiduePartItem[] = [];
  oldJobOrderList?: (JobOrderItem | undefined)[] = [];

  customerCodeControl = new UntypedFormControl();

  sotDS: StoringOrderTankDS;
  cvDS: CodeValuesDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  jobOrderDS: JobOrderDS;
  residueDS: ResidueDS;
  teamDS: TeamDS;
  mtDS: MasterEstimateTemplateDS;
  prDS: PackageRepairDS;

  packResidueDS: PackageResidueDS;

  userDS: UserDS;
  isOwner = false;

  isDuplicate = false;

  updateSelectedItem: any = undefined;
  teamList?: TeamItem[];

  repSelection = new SelectionModel<ResiduePartItem>(true, []);
  cleaningTotalHours: number | undefined;
selectedJobTaskClass =selected_job_task_color;
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
    this.mtDS = new MasterEstimateTemplateDS(this.apollo);
    this.prDS = new PackageRepairDS(this.apollo);
    this.userDS = new UserDS(this.apollo);
    this.packResidueDS = new PackageResidueDS(this.apollo);
    this.residueDS = new ResidueDS(this.apollo);
    this.teamDS = new TeamDS(this.apollo);
    this.jobOrderDS = new JobOrderDS(this.apollo);
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
    this.residueEstForm = this.fb.group({
      guid: [''],
      bill_to: [''],
      billing_branch: [''],
      job_no: [''],
      est_template: [''],
      is_default_template: [''],
      remarks: [''],
      surveyor_id: [''],
      labour_cost_discount: [0],
      material_cost_discount: [0],
      last_test: [''],
      next_test: [''],
      desc: [''],
      qty: [''],
      unit_price: [''],
      deList: [''],
      team_allocation: [''],
    });
  }

  initializeValueChanges() {
    console.log('initializeValueChanges');
    this.residueEstForm?.get('desc')?.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var desc_value = this.residueEstForm?.get("desc")?.value;
        this.displayPackResidueList = this.packResidueList.filter(data => data.description && data.description.includes(desc_value));
        if (!desc_value) this.displayPackResidueList = [...this.packResidueList];
        else if (typeof desc_value === 'object') {
          this.residueEstForm?.patchValue({
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

    this.sot_guid = this.route.snapshot.paramMap.get('id');

    this.subs.sink = this.teamDS.getTeamListByDepartment(["RESIDUE_DISPOSAL"]).subscribe(data => {
      if (data?.length) {
        this.teamList = data;
      }
    });

    this.route.data.subscribe(routeData => {
      this.isDuplicate = routeData['action'] === 'duplicate';
      this.loadHistoryState();
    });
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
    return cc && cc.code ? `${cc.code} - ${cc.name}` : '';
  }




  checkCompulsoryEst(fields: string[]) {
    fields.forEach(name => {
      if (!this.residueEstForm?.get(name)?.value) {
        this.residueEstForm?.get(name)?.setErrors({ required: true });
        this.residueEstForm?.get(name)?.markAsTouched(); // Trigger validation display
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
        ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
        // Navigate to the route and pass the JSON object
        this.router.navigate(['/admin/residue-disposal/job-order'], {
          state: this.historyState
        });
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

  canExport(): boolean {
    return !!this.repair_guid;
  }

  getLabourCost(): number | undefined {
    return this.repairEstItem?.labour_cost || this.packageLabourItem?.cost;
  }

  getPackageResidue() {
    this.packResidueList = this.residueItem?.residue_part!;
    this.displayPackResidueList = this.residueItem?.residue_part!;
    // let where:any={};
    // let custCompanyGuid:string = this.sotItem?.storing_order?.customer_company?.guid!;
    // where.customer_company_guid = {eq:custCompanyGuid};

    // this.packResidueDS.SearchPackageResidue(where,{}).subscribe(data=>{

    //   this.packResidueList=data;
    //   this.displayPackResidueList=data;
    // });

  }

  loadBillingBranch() {
    let where: any = {};
    let custCompanyGuid: string = this.sotItem?.storing_order?.customer_company?.guid!;
    if (custCompanyGuid) {
      where.main_customer_guid = { eq: custCompanyGuid };

      this.ccDS.search(where, {}).subscribe(data => {
        var def = this.createDefaultCustomerCompany("---", "");

        this.billingBranchList = [def, ...data];;

        this.patchResidueEstForm(this.residueItem!);
        console.log('loadBillingBranch-1');
      });
    }
    else {
      var def = this.createDefaultCustomerCompany("---", "");
      this.billingBranchList = [];
      this.billingBranchList.push(def);
      this.patchResidueEstForm(this.residueItem!);
      console.log('loadBillingBranch-2');
    }

  }

  loadHistoryState() {
    this.historyState = history.state;
    if (this.historyState.selectedRow != null) {

      this.residueItem = this.historyState.selectedRow;
      this.sotItem = this.residueItem?.storing_order_tank;

      this.getPackageResidue();
      this.loadBillingBranch();

      if (!this.canEdit()) {
        this.residueEstForm?.get('team_allocation')?.disable()
      }
    }
  }

  patchResidueEstForm(residue: ResidueItem) {
    let billingGuid = "";
    if (residue) {
      billingGuid = residue.bill_to_guid!;
    }
    this.populateResiduePartList(residue);
    this.residueEstForm?.patchValue({
      bill_to: this.ccDS.displayName(this.sotItem?.storing_order?.customer_company),
      job_no: this.sotItem?.job_no,
      billing_branch: this.getBillingBranch(billingGuid),
      remarks: residue?.remarks

    });
  }

  getBillingBranch(billingGuid: string): string {
    let ccItem: CustomerCompanyItem = this.billingBranchList[0];
    let ccItems = this.billingBranchList.filter(data => data.guid == billingGuid);

    if (ccItems.length > 0) {
      ccItem = ccItems[0]!;
    }

    return this.ccDS.displayName(ccItem);

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
    this.router.navigate(['/admin/residue-disposal/job-order'], {
      state: this.historyState,
    });
  }

  populateResiduePartList(residue: ResidueItem) {

    if (residue) {
      residue.residue_part = this.filterDeleted(residue.residue_part);

      var dataList = residue.residue_part?.map(data => new ResiduePartItem(data));



      this.oldJobOrderList = residue.residue_part?.filter((item, index, self) => {
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

  resetSelectedItemForUpdating() {
    if (this.updateSelectedItem) {
      this.updateSelectedItem.item.edited = false;
      this.updateSelectedItem = null;
      this.resetValue();
    }
  }
  IsApprovePart(rep: ResiduePartItem) {
    return rep.approve_part;
  }

  toggleApprovePart(rep: ResiduePartItem) {
    if (!this.residueDS.canApprove(this.residueItem!)) return;
    rep.approve_part = rep.approve_part != null ? !rep.approve_part : false;
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
        item: [this.residueItem],
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const reList = result.item.map((item: ResidueItem) => new ResidueGO(item));
        console.log(reList);
        this.residueDS.cancelResidue(reList).subscribe(result => {
          this.handleCancelSuccess(result?.data?.cancelResidue)
        });
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
        item: [this.residueItem],
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
        this.residueDS.rollbackResidue(reList).subscribe(result => {
          this.handleRollbackSuccess(result?.data?.rollbackResidue)
        });
      }
    });
  }

  handleCancelSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.CANCELED_SUCCESS;
      ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
      this.router.navigate(['/admin/residue-disposal/job-order'], {
        state: this.historyState
      });
    }
  }

  handleRollbackSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.ROLLBACK_SUCCESS;
      ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
      this.router.navigate(['/admin/residue-disposal/job-order'], {
        state: this.historyState
      });
    }
  }

  toggleRep(row: ResiduePartItem) {
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
      : this.deList.forEach((row) => {
        if (row.approve_part === null || row.approve_part) {
          this.repSelection.select(row)
        }
      }
      );
  }

  assignTeam(event: Event) {
    const selectedRep = this.repSelection.selected;
    const selectedTeam = this.residueEstForm?.get('team_allocation');
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
    return this.repSelection.hasValue() && this.residueEstForm?.get('team_allocation')?.value;
  }

  isAnyAssignedToTeam() {
    return this.deList.some(item => !!item.job_order?.team?.guid);
  }

  onApprove(event: Event) {
    event.preventDefault();
    const bill_to = (this.residueEstForm?.get("billing_branch")?.value ? this.sotItem?.storing_order?.customer_company?.guid : this.residueEstForm?.get("billing_branch")?.value?.guid);

    if (bill_to) {
      let re: ResidueItem = new ResidueItem();
      re.guid = this.residueItem?.guid;
      re.sot_guid = this.residueItem?.sot_guid;
      re.bill_to_guid = bill_to;
      re.residue_part = this.deList?.map((rep: ResiduePartItem) => {
        return new ResiduePartItem({
          ...rep,
          tariff_residue: undefined,
          approve_part: rep.approve_part,
        })
      });
      console.log(re)
      this.residueDS.approveResidue(re).subscribe(result => {
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
        const totalApproveHours = 3;

        const joRequest = new JobOrderRequest();
        joRequest.guid = jo.guid;
        joRequest.job_type_cv = jo.job_type_cv ?? 'RESIDUE';
        joRequest.remarks = jo.remarks;
        joRequest.sot_guid = jo.sot_guid ?? this.sotItem?.guid;
        joRequest.status_cv = jo.status_cv;
        joRequest.team_guid = jo.team_guid;
        joRequest.total_hour = jo.total_hour ?? totalApproveHours;
        joRequest.working_hour = jo.working_hour ?? 0;
        joRequest.process_guid = this.residueItem?.guid;
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

      if ((result?.data?.assignJobOrder ?? 0) > 0) {
        var act = "PARTIAL_ASSIGN";
        if (this.isAllAssignedToTeam()) {
          console.log("all parts are assigned");
          act = "ASSIGN";
          const allJobInProgress = finalJobOrder.every(x => x.status_cv == 'JOB_IN_PROGRESS');
          if (allJobInProgress) {
            act = "IN_PROGRESS";
          }
        }
        var residueStatusReq: ResidueStatusRequest = new ResidueStatusRequest({
          guid: this.residueItem!.guid,
          sot_guid: this.sotItem!.guid,
          action: act
        });
        console.log(residueStatusReq);
        this.residueDS.updateResidueStatus(residueStatusReq).subscribe(result => {
          console.log(result)
          if (result.data.updateResidueStatus > 0) {
            this.handleSaveSuccess(result.data.updateResidueStatus);
          }
        });

      }

    });
  }

  isAllAssignedToTeam(): boolean {
    return this.deList.every(
      (data) => {
        let bRet = data.approve_part == null ? true : data.approve_part;
        if (bRet) {
          if (!data.job_order?.team_guid) {
            return false;
          }
        }
        return true;
      }
    );
  }

  updateJobProcessStatus(residueGuid: string, job_type: string, process_status: string) {
    var updateJobProcess: JobProcessRequest = new JobProcessRequest();
    updateJobProcess.guid = residueGuid;
    updateJobProcess.job_type_cv = job_type;
    updateJobProcess.process_status = process_status;

    this.jobOrderDS?.updateJobProcessStatus(updateJobProcess).subscribe(result => {
      if (result.data.updateJobProcessStatus > 0) {
        this.handleSaveSuccess(result.data.updateJobProcessStatus);
      }
    });
  }

  canSave(): boolean {
    const validStatus = ['ASSIGNED', 'PENDING', 'APPROVED', 'PARTIAL_ASSIGNED', 'CANCELED', 'NO_ACTION']
    var allowSave: boolean = validStatus.includes(this.residueItem?.status_cv!);
    // if (this.deList?.length) {
    //   var itms = this.deList.filter(itm => (itm.job_order?.status_cv == "PENDING" || itm.job_order == null || itm.job_order?.status_cv == null));
    //   allowSave = itms.length > 0;
    // }
    return allowSave && this.canEdit();
  }

  canRollBack(): boolean {
    var validActions: string[] = ["COMPLETED"];
    var selItem = this.residueItem;
    if (validActions.includes(selItem?.status_cv || '')) {
      return (selItem?.residue_part?.length! > 0);
    }
    else {
      return false;
    }
  }

  rollbackJobs(event: Event) {
    this.preventDefault(event);
    console.log(this.residueItem);

    const distinctJobOrders = this.deList
      .filter((item, index, self) =>
        index === self.findIndex(t => t.job_order?.guid === item.job_order?.guid &&
          (t.job_order?.team?.guid === item?.job_order?.team_guid ||
            t.job_order?.team?.description === item?.job_order?.team?.description))
      )
      .filter(item => item.job_order !== null && item.job_order !== undefined)
      .map(item => new JobOrderGO(item.job_order!));

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
        item: [this.residueItem],
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const reList = result.item.map((item: any) => {
          const residueJobOrder = {
            estimate_no: item?.estimate_no,
            guid: item?.guid,
            remarks: item.remarks,
            sot_guid: item.sot_guid,
            sot_status: this.residueItem?.storing_order_tank?.tank_status_cv,
            job_order: distinctJobOrders
          }
          return residueJobOrder
        });
        console.log(reList);
        if (this.residueItem?.status_cv == "COMPLETED") {
          this.residueDS.rollbackCompletedResidue(reList).subscribe(result => {
            this.handleRollbackSuccess(result?.data?.rollbackCompletedResidue)
          });
        }
        else if (this.residueItem?.status_cv == "JOB_IN_PROGRESS") {
          this.jobOrderDS.rollbackJobInProgressResidue(reList).subscribe(result => {
            this.handleRollbackSuccess(result?.data?.rollbackJobInProgressResidue)
          });
        }
      }
    });
  }

  onAbort(event: Event) {
    this.preventDefault(event);
    console.log(this.residueItem)

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
        item: [this.residueItem],
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

        const residueJobOrder = new ResJobOrderRequest({
          guid: this.residueItem?.guid,
          sot_guid: this.residueItem?.sot_guid,
          estimate_no: this.residueItem?.estimate_no,
          remarks: result.item[0]?.remarks,
          job_order: distinctJobOrders
        });

        console.log(residueJobOrder)
        this.residueDS.abortResidue(residueJobOrder).subscribe(result => {
          console.log(result)
          this.handleCancelSuccess(result?.data?.abortResidue)
        });
      }
    });
  }

  ConfirmUnassignTeam(event: Event, row: ResidueItem) {
    this.stopEventTrigger(event);
    this.ConfirmUnassignDialog(event, row);
  }

  ConfirmUnassignDialog(event: Event, row: ResidueItem) {
    event.preventDefault(); // Prevents the form submission

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        headerText: this.translatedLangText.CONFIRM_TEAM_UNASSIGN,
        action: 'new',
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result.action === 'confirmed') {
        this.UnassignEstimate(row);
      }
    });
  }

  UnassignEstimate(row: ResidueItem) {
    this.subs.sink = this.residueDS.rollbackAssigneddResidue([row.guid!])
      .subscribe((result: any) => {
        if (result.data.rollbackAssignedResidue) {
          this.handleRollbackSuccess(result.data.rollbackAssignedResidue);
        }
      });
  }

  canUnassignTeam(row: ResidueItem | undefined) {
    return this.isAllowDelete() && (row?.status_cv === 'ASSIGNED' || row?.status_cv === 'PARTIAL_ASSIGNED') && !row.complete_dt;
  }

  canEdit() {
    return this.isAllowEdit() && this.residueDS.canAssign(this.residueItem);
  }

  isAllowEdit() {
    return this.modulePackageService.hasFunctions(['RESIDUE_DISPOSAL_JOB_ALLOCATION_EDIT']);
  }

  isAllowDelete() {
    return this.modulePackageService.hasFunctions(['RESIDUE_DISPOSAL_JOB_ALLOCATION_DELETE']);
  }
}