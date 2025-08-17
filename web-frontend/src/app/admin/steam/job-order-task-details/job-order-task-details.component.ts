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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
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
import { JobOrderDS, JobOrderGO, JobOrderItem, JobOrderRequest, SteamJobOrderRequest, UpdateJobOrderRequest } from 'app/data-sources/job-order';
import { PackageLabourDS, PackageLabourItem } from 'app/data-sources/package-labour';
import { RepairDS, RepairItem } from 'app/data-sources/repair';
import { RepairPartDS, RepairPartItem } from 'app/data-sources/repair-part';
import { RPDamageRepairDS } from 'app/data-sources/rp-damage-repair';
import { SteamDS, SteamItem, SteamStatusRequest } from 'app/data-sources/steam';
import { SteamPartItem } from 'app/data-sources/steam-part';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TeamDS, TeamItem } from 'app/data-sources/teams';
import { TimeTableDS, TimeTableItem } from 'app/data-sources/time-table';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { Observable, Subscription } from 'rxjs';
import { CancelFormDialogComponent } from './dialogs/cancel-form-dialog/form-dialog.component';
//import { CancelFormDialogComponent } from './dialogs/cancel-form-dialog_old/cancel-form-dialog.component';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';
import { SingletonNotificationService } from '@core/service/singletonNotification.service';

@Component({
  selector: 'job-order-task-details',
  standalone: true,
  templateUrl: './job-order-task-details.component.html',
  styleUrl: './job-order-task-details.component.scss',
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
    MatProgressSpinnerModule,
    RouterLink,
    MatRadioModule,
    MatDividerModule,
    MatMenuModule,
    MatCardModule,
    MatSlideToggleModule,
  ]
})
export class SteamJobOrderTaskDetailsComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  tabIndex = 1;
  displayedColumns = [
    'seq',
    'desc',
    'approve_part',
    'team',
  ];
  pageTitleDetails = 'MENUITEMS.STEAM.LIST.JOB'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.STEAM.TEXT', route: '/admin/steam/job-order', queryParams: { tabIndex: this.tabIndex } },
    { text: 'MENUITEMS.STEAM.LIST.JOB-ORDER', route: '/admin/steam/job-order', queryParams: { tabIndex: this.tabIndex } },
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
    ROLLBACK_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
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
    ESTIMATE_DATE: 'COMMON-FORM.ESTIMATE-DATE',
    APPROVE: 'COMMON-FORM.APPROVE',
    NO_ACTION: 'COMMON-FORM.NO-ACTION',
    ROLLBACK: 'COMMON-FORM.ROLLBACK',
    TEAM_DETAILS: 'COMMON-FORM.TEAM-DETAILS',
    TEAM: 'COMMON-FORM.TEAM',
    UPDATE_BY: 'COMMON-FORM.UPDATE-BY',
    UPDATE_DATE: 'COMMON-FORM.UPDATE-DATE',
    ESTIMATE: 'COMMON-FORM.ESTIMATE',
    APPROVAL: 'COMMON-FORM.APPROVAL',
    JOB_ALLOCATION: 'COMMON-FORM.JOB-ALLOCATION',
    QC_DETAILS: 'COMMON-FORM.QC-DETAILS',
    SAVE_ANOTHER: 'COMMON-FORM.SAVE-ANOTHER',
    TEAM_ALLOCATION: 'COMMON-FORM.TEAM-ALLOCATION',
    ASSIGN: 'COMMON-FORM.ASSIGN',
    JOB_DETAILS: 'COMMON-FORM.JOB-DETAILS',
    START_STOP_JOB: 'COMMON-FORM.START-STOP-JOB',
    COMPLETE_JOB: 'COMMON-FORM.COMPLETE-JOB',
    START_TIME: 'COMMON-FORM.START-TIME',
    STOP_TIME: 'COMMON-FORM.STOP-TIME',
    TIME_HISTORY: 'COMMON-FORM.TIME-HISTORY',
    START_JOB: 'COMMON-FORM.START-JOB',
    STOP_JOB: 'COMMON-FORM.STOP-JOB',
    COMPLETE: 'COMMON-FORM.COMPLETE',
    JOB_ORDER_NO: 'COMMON-FORM.JOB-ORDER-NO',
    DURATION: 'COMMON-FORM.DURATION',
    PAUSE_JOB: 'COMMON-FORM.PAUSE-JOB',
    APPROVED: 'COMMON-FORM.APPROVED',
  }

  clean_statusList: CodeValuesItem[] = [];

  job_order_guid?: string | null;
  steam_guid?: string | null;

  repairForm?: UntypedFormGroup;
  steamForm?: UntypedFormGroup;

  sotItem?: StoringOrderTankItem;
  jobOrderItem?: JobOrderItem;
  steamItem?: SteamItem;


  repairItem?: RepairItem;
  packageLabourItem?: PackageLabourItem;
  repSelection = new SelectionModel<RepairPartItem>(true, []);
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
  jobStatusCvList: CodeValuesItem[] = [];
  processStatusCvList: CodeValuesItem[] = [];

  teamList?: TeamItem[];

  private joSubscriptions = new Map<string, Subscription>();

  deList: any[] = [];

  customerCodeControl = new UntypedFormControl();

  sotDS: StoringOrderTankDS;
  cvDS: CodeValuesDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  plDS: PackageLabourDS;
  repairDS: RepairDS;
  repairPartDS: RepairPartDS;
  rpDmgRepairDS: RPDamageRepairDS;

  steamDS: SteamDS;

  teamDS: TeamDS;
  joDS: JobOrderDS;
  joTimeTblDS: JobOrderDS;
  ttDS: TimeTableDS;
  isOwner = false;

  private jobOrderSubscriptions: Subscription[] = [];

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private notificationService: SingletonNotificationService
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
    this.rpDmgRepairDS = new RPDamageRepairDS(this.apollo);
    this.teamDS = new TeamDS(this.apollo);
    this.joDS = new JobOrderDS(this.apollo);
    this.joTimeTblDS = new JobOrderDS(this.apollo);
    this.ttDS = new TimeTableDS(this.apollo);
    this.steamDS = new SteamDS(this.apollo);
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

  override ngOnDestroy(): void {
    // Unsubscribe all job order subscriptions
    this.joSubscriptions.forEach(sub => sub.unsubscribe());
    this.joSubscriptions.clear();

    // Unsubscribe other component-level subscriptions (if using SubSink or similar)
    this.subs.unsubscribe();
  }

  initForm() {
    this.steamForm = this.fb.group({
      deList: ['']
    });

    this.repairForm = this.fb.group({
      team_allocation: [''],
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
      repList: ['']
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
    this.cvDS.connectAlias('jobStatusCv').subscribe(data => {
      this.jobStatusCvList = data;
    });
    this.cvDS.connectAlias('processStatusCv').subscribe(data => {
      this.processStatusCvList = data;
    });

    this.job_order_guid = this.route.snapshot.paramMap.get('id');
    this.steam_guid = this.route.snapshot.paramMap.get('steam_id');
    if (this.job_order_guid) {
      this.subs.sink = this.joDS.getJobOrderByID(this.job_order_guid).subscribe(jo => {
        if (jo?.length) {
          console.log(jo)
          // this.jobOrderItem = jo[0];
          // this.jobOrderItem.time_table = this.jobOrderItem.time_table?.filter(d => d.delete_dt == null || d.delete_dt == 0);
          // this.subscribeToJobOrderEvent(this.joDS.subscribeToJobOrderStarted.bind(this.joDS), this.job_order_guid!);
          // this.subscribeToJobOrderEvent(this.joDS.subscribeToJobOrderStopped.bind(this.joDS), this.job_order_guid!);
          // this.subscribeToJobOrderEvent(this.joDS.subscribeToJobOrderCompleted.bind(this.joDS), this.job_order_guid!);

          const newGuids = new Set<string>();
          this.jobOrderItem = jo[0];
          const guid = this.jobOrderItem.guid!;
          newGuids.add(guid);

          if (this.joSubscriptions.has(guid)) {
            // Already subscribed — skip to avoid duplication
            return;
          }

          const sub = this.notificationService.subscribe(guid, (msg) => {
            this.processJobStatusChange(msg);
          });

          this.joSubscriptions.set(guid, sub);

          // Unsubscribe and remove old subscriptions no longer needed
          Array.from(this.joSubscriptions.keys()).forEach(guid => {
            if (!newGuids.has(guid)) {
              this.joSubscriptions.get(guid)!.unsubscribe();
              this.joSubscriptions.delete(guid);
            }
          });

          if (this.steam_guid) {
            this.steamDS.getSteamIDForJobOrder(this.steam_guid, this.job_order_guid!).subscribe(steam => {
              if (steam?.length) {
                console.log(steam)
                this.steamItem = steam[0];
                this.sotItem = this.steamItem?.storing_order_tank;
                this.populateSteam(this.steamItem);
              }
            });
          }
        }
      });
      this.subs.sink = this.teamDS.getTeamListByDepartment(["REPAIR"]).subscribe(data => {
        if (data?.length) {
          this.teamList = data;
        }
      });
    }
  }

  refreshTime_table(job_order_guid: string) {
    this.subs.sink = this.joTimeTblDS.getJobOrderByID(job_order_guid).subscribe(jo => {
      if (jo?.length) {
        console.log(jo)
        this.jobOrderItem = jo[0];
        this.jobOrderItem.time_table = this.jobOrderItem.time_table?.filter(d => d.delete_dt == null || d.delete_dt == 0);
      }
    });

  }
  populateSteam(steam: SteamItem) {

    steam.steaming_part = this.filterDeleted(steam.steaming_part)
    this.updateData(steam.steaming_part);
    this.steamForm?.patchValue({
      deList: this.deList
    });
  }

  populateRepair(repair: RepairItem) {
    this.isOwner = repair.owner_enable ?? false;
    repair.repair_part = this.filterDeleted(repair.repair_part)
    this.updateData(repair.repair_part);
    this.repairForm?.patchValue({
      job_no: repair.job_no || this.sotItem?.job_no,
      guid: repair.guid,
      remarks: repair.remarks,
      surveyor_id: repair.aspnetusers_guid,
      labour_cost_discount: repair.labour_cost_discount,
      material_cost_discount: repair.material_cost_discount
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

  displayCustomerCompanyName(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name}) - ${cc.type_cv}` : '';
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

  onFormSubmit() {
    const distinctJobOrders = this.repList
      .filter((item, index, self) =>
        index === self.findIndex(t => t.job_order?.guid === item.job_order?.guid &&
          (t.job_order?.team?.guid === item?.job_order?.team_guid ||
            t.job_order?.team?.description === item?.job_order?.team?.description))
      )
      .filter(item => item !== null && item !== undefined)
      .map(item => item.job_order);

    const finalJobOrder: any[] = [];
    distinctJobOrders.forEach(jo => {
      if (jo) {
        const filteredParts = this.repList.filter(part =>
          part.job_order?.guid === jo?.guid &&
          (part.job_order?.team?.guid === jo?.team_guid ||
            part.job_order?.team?.description === jo?.team?.description)
        );
        console.log(filteredParts)
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
        joRequest.part_guid = partList;
        finalJobOrder.push(joRequest);
      }
    });
    console.log(finalJobOrder);
    this.joDS.assignJobOrder(finalJobOrder).subscribe(result => {
      console.log(result)
      this.handleSaveSuccess(result?.data?.assignJobOrder);
    });
  }

  updateData(newData: SteamItem[] | undefined): void {
    if (newData?.length) {


      this.deList = newData.map((row, index) => ({
        ...row,
        index: index
      }));
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
      let successMsg = this.translatedLangText.SAVE_SUCCESS;
      ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
      this.router.navigate(['/admin/steam/job-order'], { queryParams: { tabIndex: this.tabIndex } });
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

  canRollback(): boolean {
    return this.repairItem?.status_cv === 'CANCELED' || this.repairItem?.status_cv === 'APPROVED';
  }

  getBadgeClass(status: string | undefined): string {
    switch (status) {
      case 'APPROVED':
        return 'badge-solid-green';
      case 'PENDING':
        return 'badge-solid-cyan';
      case 'CANCEL':
      case 'NO_ACTION':
        return 'badge-solid-red';
      case 'JOB_IN_PROGRESS':
        return 'badge-solid-purple';
      default:
        return 'badge-solid-blue';
    }
  }

  getYesNoDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.yesnoCvList);
  }

  getSoStatusDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.soTankStatusCvList);
  }

  getJobStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.jobStatusCvList);
  }

  getProcessStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.processStatusCvList);
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
    return damageRepair?.filter((x: any) => x.code_type === filterCode && !x.delete_dt && x.action !== 'cancel').map(item => {
      const codeCv = item.code_cv;
      const description = `(${codeCv})` + (item.code_type == 0 ? this.getDamageCodeDescription(codeCv) : this.getRepairCodeDescription(codeCv));
      return description ? description : '';
    }).join('\n');
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

  parse2Decimal(input: number | string | undefined) {
    return Utility.formatNumberDisplay(input);
  }

  filterDeleted(resultList: any[] | undefined): any {
    return (resultList || []).filter((row: any) => !row.delete_dt);
  }

  canExport(): boolean {
    return !!this.job_order_guid;
  }

  getLabourCost(): number | undefined {
    return this.repairItem?.labour_cost;
  }

  displayApproveQty(rep: RepairPartItem) {
    return (rep.approve_part ?? this.repairPartDS.is4X(rep.rp_damage_repair)) ? (rep.approve_qty ?? rep.quantity) : 1;
  }

  displayApproveHour(rep: RepairPartItem) {
    return (rep.approve_part ?? this.repairPartDS.is4X(rep.rp_damage_repair)) ? (rep.approve_hour ?? rep.hour) : 0;
  }

  displayApproveCost(rep: RepairPartItem) {
    return this.parse2Decimal((rep.approve_part ?? this.repairPartDS.is4X(rep.rp_damage_repair)) ? (rep.approve_cost ?? rep.material_cost) : 0);
  }

  toggleRep(row: RepairPartItem) {
    if (this.repairPartDS.is4X(row.rp_damage_repair) || row.job_order_guid) return;
    this.repSelection.toggle(row);
  }

  isStarted() {
    return this.jobOrderItem?.time_table?.some(x => x?.start_time && !x?.stop_time);
  }

  canStartJob() {
    return this.joDS.canStartJob(this.jobOrderItem)
  }

  // canCompleteJob() {
  //   return this.repairPartDS.canCompleteJob(this.repairItem?.repair_part) && this.joDS.canStartJob(this.jobOrderItem)
  // }

  canCompleteJob() {
    return this.joDS.canCompleteJob(this.jobOrderItem)
  }

  toggleJobState(event: Event, isStarted: boolean | undefined) {
    this.preventDefault(event);  // Prevents the form submission
    if (!isStarted) {
      const param = [new TimeTableItem({ job_order_guid: this.jobOrderItem?.guid, job_order: new JobOrderGO({ ...this.jobOrderItem }) })];
      console.log(param)
      this.ttDS.startJobTimer(param, this.steam_guid!).subscribe(result => {
        console.log(result)
        if ((result?.data?.startJobTimer ?? 0) > 0) {
          const firstJobPart = this.jobOrderItem?.steaming_part?.[0];
          if (firstJobPart?.steaming?.status_cv === 'ASSIGNED') {
            const steamStatusReq: SteamStatusRequest = new SteamStatusRequest({
              guid: firstJobPart!.steaming.guid,
              sot_guid: this.jobOrderItem?.sot_guid,
              action: "IN_PROGRESS",
            });
            console.log(steamStatusReq);
            this.steamDS.updateSteamStatus(steamStatusReq).subscribe(result => {
              console.log(result);
            });
          }
        }
      });
    } else {
      const found = this.jobOrderItem?.time_table?.filter(x => x?.start_time && !x?.stop_time);
      if (found?.length) {
        const newParam = new TimeTableItem(found[0]);
        newParam.stop_time = Utility.convertDate(new Date()) as number;
        newParam.job_order = new JobOrderGO({ ...this.jobOrderItem });
        const param = [newParam];
        console.log(param)
        this.ttDS.stopJobTimer(param).subscribe(result => {
          console.log(result)
        });
      }
    }
  }

  // completeJobItem(event: Event, repair_part: RepairPartItem) {
  //   this.preventDefault(event);  // Prevents the form submission
  //   if (this.repairPartDS.isCompleted(repair_part)) return;
  //   const newParam = new JobItemRequest({
  //     guid: repair_part.guid,
  //     job_order_guid: repair_part.job_order_guid,
  //     job_type_cv: repair_part.job_order?.job_type_cv
  //   });
  //   const param = [newParam];
  //   console.log(param)
  //   this.joDS.completeJobItem(param).subscribe(result => {
  //     console.log(result)
  //   });
  // }

  completeJob(event: Event) {
    this.preventDefault(event);  // Prevents the form submission
    if (this.isStarted()) {
      const found = this.jobOrderItem?.time_table?.find(x => x?.start_time && !x?.stop_time);
      if (found) {
        const newParam = new TimeTableItem(found);
        newParam.stop_time = Utility.convertDate(new Date()) as number;
        newParam.job_order = new JobOrderGO({ ...this.jobOrderItem });
        const param = [newParam];
        console.log(param)
        this.ttDS.stopJobTimer(param).subscribe(result => {
          this.completeJobOrder();
        });
      }
    } else {
      this.completeJobOrder();
    }
  }

  completeJobOrder(): void {
    const newParam = new UpdateJobOrderRequest({
      guid: this.jobOrderItem?.guid,
      remarks: this.jobOrderItem?.remarks,
      start_dt: this.jobOrderItem?.start_dt,
      complete_dt: this.jobOrderItem?.complete_dt ?? Utility.convertDate(new Date()) as number
    });
    const param = [newParam];
    console.log(param)
    this.joDS.completeJobOrder(param).subscribe(result => {
      if (result.data.completeJobOrder > 0) {
        this.UpdateSteamStatusCompleted(this.steamItem?.guid!);
      }
    });
  }

  viewTimeTableDetails(event: Event) {
    this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '700px',
        disableClose: true,
      data: {
        item: this.jobOrderItem?.time_table,
        action: 'new',
        translatedLangText: this.translatedLangText,
        populateData: {},
        index: -1
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => { });
  }

  // private subscribeToJobOrderEvent(
  //   subscribeFn: (guid: string) => Observable<any>,
  //   job_order_guid: string
  // ) {
  //   const subscription = subscribeFn(job_order_guid).subscribe({
  //     next: (response) => {
  //       console.log('Received data:', response);
  //       const data = response.data

  //       let jobData: any;
  //       let eventType: any;

  //       if (data?.onJobStopped) {
  //         jobData = data.onJobStopped;
  //         eventType = 'jobStopped';
  //       } else if (data?.onJobStarted) {
  //         jobData = data.onJobStarted;
  //         eventType = 'jobStarted';
  //       } else if (data?.onJobCompleted) {
  //         jobData = data.onJobCompleted;
  //         eventType = 'onJobCompleted';
  //       }

  //       if (jobData) {
  //         if (this.jobOrderItem) {
  //           this.jobOrderItem.status_cv = jobData.job_status;
  //           this.jobOrderItem.start_dt = this.jobOrderItem.start_dt ?? jobData.start_time;
  //           this.jobOrderItem.time_table ??= [];

  //           const foundTimeTable = this.jobOrderItem.time_table?.filter(x => x.guid === jobData.time_table_guid);
  //           if (eventType === 'jobStarted') {
  //             if (foundTimeTable?.length) {
  //               foundTimeTable[0].start_time = jobData.start_time
  //               console.log(`Updated JobOrder ${eventType} :`, foundTimeTable[0]);
  //             } else {
  //               const startNew = new TimeTableItem({ guid: jobData.time_table_guid, start_time: jobData.start_time, stop_time: jobData.stop_time, job_order_guid: jobData.job_order_guid });
  //               this.jobOrderItem.time_table?.push(startNew)
  //               console.log(`Updated JobOrder ${eventType} :`, startNew);
  //             }
  //           } else if (eventType === 'jobStopped') {
  //             foundTimeTable[0].stop_time = jobData.stop_time;
  //             console.log(`Updated JobOrder ${eventType} :`, foundTimeTable[0]);
  //           }
  //         }
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error:', error);
  //     },
  //     complete: () => {
  //       console.log('Subscription completed');
  //     }
  //   });

  //   this.jobOrderSubscriptions.push(subscription);
  // }

  processJobStatusChange(response: any) {
    console.log('Received data:', response);
    const event_name = response.event_name;
    const data = response.payload

    if (data) {
      if (this.jobOrderItem) {
        this.jobOrderItem.status_cv = data.job_status;
        this.jobOrderItem.start_dt = this.jobOrderItem.start_dt ?? data.start_time;
        this.jobOrderItem.time_table ??= [];

        const foundTimeTable = this.jobOrderItem.time_table?.filter(x => x.guid === data.time_table_guid);
        if (event_name === 'onJobStarted') {
          if (foundTimeTable?.length) {
            foundTimeTable[0].start_time = data.start_time
          } else {
            const startNew = new TimeTableItem({ guid: data.time_table_guid, start_time: data.start_time, stop_time: data.stop_time, job_order_guid: data.job_order_guid });
            this.jobOrderItem.time_table?.push(startNew)
          }
        } else if (event_name === 'onJobStopped') {
          foundTimeTable[0].stop_time = data.stop_time;
        }
        console.log(`Updated JobOrder ${event_name} :`, this.jobOrderItem);
      }
    }
  }

  getFooterBackgroundColor(): string {
    return ''//'light-green';
  }

  IsApprovePart(rep: SteamPartItem) {
    return rep.approve_part;
  }

  getTotalCost(): number {
    return this.deList.reduce((acc, row) => {
      if (row.approve_part !== false) {
        return acc + ((row.approve_qty || 0) * (row.approve_cost || 0));
      }
      return acc; // If row is approved, keep the current accumulator value
    }, 0);
  }

  UpdateSteamStatusCompleted(steam_guid: string) {
    const where: any = {
      and: []
    };

    where.and.push({
      steaming_part: {
        all: {
          or: [
            {
              job_order: {
                status_cv: { eq: 'COMPLETED' }
              }
            },
            {
              approve_part: { eq: false }
            },
            { delete_dt: { neq: 0 } },
            { delete_dt: { neq: null } },
          ]
        }
      }
    });

    where.and.push({
      guid: { eq: steam_guid }
    })

    this.steamDS.search(where).subscribe(result => {

      if (result.length > 0) {
        var stmItem: SteamItem = result[0];
        let steamStatus: SteamStatusRequest = new SteamStatusRequest();
        steamStatus.action = "COMPLETE";
        steamStatus.guid = stmItem?.guid;
        steamStatus.sot_guid = stmItem?.sot_guid;
        this.steamDS.updateSteamStatus(steamStatus).subscribe(result => {

          console.log(result);
        });


      }
      this.handleSaveSuccess(1);

    });

  }

  canRollbackJob() {
    return this.joDS.canRollbackJobWithCompleted(this.jobOrderItem) && !this.isStarted();
    //(this.jobOrderItem?.status_cv=='COMPLETED'|| this.joDS.canRollbackJob(this.jobOrderItem)) && this.steamDS.canRollbackJobInProgress(this.steamItem) && !this.isStarted();
  }

  ConvertSystemToPascalCase(str?: string):string {
    
    var retval =str||'-';
    if(retval.toUpperCase()==="SYSTEM")
    {
      retval =  Utility.toPascalCase(retval);
    }
    return retval;  
  }


  rollbackJob(event: Event) {
    this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(CancelFormDialogComponent, {
      width: '380px',
      disableClose: true,
      data: {
        action: 'rollback',
        dialogTitle: this.translatedLangText.ARE_YOU_SURE_ROLLBACK,
        item: [this.steamItem],
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const stmJobOrder = new SteamJobOrderRequest({
          guid: this.steamItem?.guid,
          sot_guid: this.steamItem?.sot_guid,
          job_order: [new JobOrderGO({ ...this.jobOrderItem, remarks: result.remarks })],
          sot_status: this.sotItem?.tank_status_cv,
          remarks: result.item[0].remarks
        });

        console.log(stmJobOrder)
        if (this.jobOrderItem?.status_cv === 'JOB_IN_PROGRESS') {
          this.joDS.rollbackJobInProgressSteaming([stmJobOrder]).subscribe(result => {
            console.log(result)
            if ((result?.data?.rollbackJobInProgressSteaming ?? 0) > 0) {
              this.handleSaveSuccess(result?.data?.rollbackJobInProgressSteaming);
            }
          });
        }
        else if (this.jobOrderItem?.status_cv === 'COMPLETED') {
          this.steamDS.rollbackCompletedSteaming([stmJobOrder]).subscribe(result => {
            console.log(result)
            if ((result?.data?.rollbackCompletedSteaming ?? 0) > 0) {
              this.handleSaveSuccess(result?.data?.rollbackCompletedSteaming);
            }
          });
        }
      }
    });
  }
}