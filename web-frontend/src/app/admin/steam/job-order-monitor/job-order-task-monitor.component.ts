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
import { MatNativeDateModule, MatOptionModule, ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
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
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { InGateSurveyItem } from 'app/data-sources/in-gate-survey';
import { JobItemRequest, JobOrderDS, JobOrderGO, JobOrderItem, JobOrderRequest, UpdateJobOrderRequest } from 'app/data-sources/job-order';
import { PackageLabourDS, PackageLabourItem } from 'app/data-sources/package-labour';
import { RepairDS, RepairItem } from 'app/data-sources/repair';
import { RepairPartDS, RepairPartItem } from 'app/data-sources/repair-part';
import { RPDamageRepairDS } from 'app/data-sources/rp-damage-repair';
import { SteamDS, SteamGO, SteamItem, SteamStatusRequest, SteamTemp } from 'app/data-sources/steam';
import { SteamPartItem } from 'app/data-sources/steam-part';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TeamDS, TeamItem } from 'app/data-sources/teams';
import { TimeTableDS, TimeTableItem } from 'app/data-sources/time-table';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { Observable, Subscription } from 'rxjs';
import { ConfirmDialogComponent } from './dialogs/confirm/confirm.component';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
@Component({
  selector: 'job-order-task-monitor',
  standalone: true,
  templateUrl: './job-order-task-monitor.component.html',
  styleUrl: './job-order-task-monitor.component.scss',
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
    MatCardModule,
    MatSlideToggleModule,
    MatNativeDateModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    PreventNonNumericDirective
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class SteamJobOrderTaskMonitorComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @ViewChild('picker') picker: any;
  tabIndex = 2;
  displayedColumns = [
    'seq',
    'time',
    'ther',
    'top_side',
    'bottom_side',
    'remarks',
    'action',
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
    ARE_YOU_SURE_COMPLETE: 'COMMON-FORM.ARE-YOU-SURE-COMPLETE',
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
    CURRENT_STATUS: 'COMMON-FORM.CURRENT-STATUS',
    CLEAN_STATUS: 'COMMON-FORM.CLEAN-STATUS',
    REQUIRED_TEMP: 'COMMON-FORM.REQUIRED-TEMP',
    FLASH_POINT: 'COMMON-FORM.FLASH-POINT',
    APPROVED_DATE: 'COMMON-FORM.APPROVED-DATE',
    STEAM_MONITOR: 'COMMON-FORM.STEAM-MONITOR',
    BOTTOM_SIDE: 'COMMON-FORM.BOTTOM-SIDE',
    TOP_SIDE: 'COMMON-FORM.TOP-SIDE',
    THERMOMETER: 'COMMON-FORM.THERMOMETER',
    TIME: 'COMMON-FORM.TIME',
    SELECTED_RECORD: "COMMON-FORM.SELECTED-RECORD",
    COMPLETE_STEAM: 'COMMON-FORM.COMPLETE-STEAM',
    OVER_REQUIRED_TEMP: 'COMMON-FORM.OVER-REQUIRED-TEMP',
    LOWER_REQUIRED_TEMP: 'COMMON-FORM.LOWER-REQUIRED-TEMP'

  }

  clean_statusList: CodeValuesItem[] = [];

  job_order_guid?: string | null;
  steam_guid?: string | null;

  repairForm?: UntypedFormGroup;
  steamForm?: UntypedFormGroup;

  sotItem?: StoringOrderTankItem;
  jobOrderItem?: JobOrderItem;
  steamItem?: SteamItem;
  //steamTmpRec?:SteamTemp;

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
  cleanStatusCvList: CodeValuesItem[] = [];

  teamList?: TeamItem[];

  deList: any[] = [];

  customerCodeControl = new UntypedFormControl();
  updateSelectedItem: any;

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
  ttDS: TimeTableDS;
  isOwner = false;
  reqTemp?: number = 9999;


  public disabled = false;
  public showSpinners = true;
  public showSeconds = true;
  public touchUi = false;
  public enableMeridian = true;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';

  private jobOrderSubscriptions: Subscription[] = [];

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
    this.rpDmgRepairDS = new RPDamageRepairDS(this.apollo);
    this.teamDS = new TeamDS(this.apollo);
    this.joDS = new JobOrderDS(this.apollo);
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

  initForm() {
    this.steamForm = this.fb.group({
      time: [''],
      thermometer: [''],
      top: [''],
      bottom: [''],
      remarks: [''],
      deList: ['']
    });
    const date = new Date(); // Local date and time
    date.setSeconds(0, 0);   // Remove seconds and milliseconds
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const localDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
    this.steamForm.patchValue({
      time: new Date()
    });
  }

  initializeValueChanges() {
  }

  public loadData() {
    const queries = [
      { alias: 'groupNameCv', codeValType: 'GROUP_NAME' },
      { alias: 'yesnoCv', codeValType: 'YES_NO' },
      { alias: 'soTankStatusCv', codeValType: 'TANK_STATUS' },
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'testTypeCv', codeValType: 'TEST_TYPE' },
      { alias: 'testClassCv', codeValType: 'TEST_CLASS' },
      { alias: 'partLocationCv', codeValType: 'PART_LOCATION' },
      { alias: 'damageCodeCv', codeValType: 'DAMAGE_CODE' },
      { alias: 'repairCodeCv', codeValType: 'REPAIR_CODE' },
      { alias: 'unitTypeCv', codeValType: 'UNIT_TYPE' },
      { alias: 'jobStatusCv', codeValType: 'JOB_STATUS' },
      { alias: 'processStatusCv', codeValType: 'PROCESS_STATUS' },
      { alias: 'cleanStatusCv', codeValType: 'CLEAN_STATUS' }
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
    this.cvDS.connectAlias('cleanStatusCv').subscribe(data => {
      this.cleanStatusCvList = addDefaultSelectOption(data, "Unknown");;
    });

    this.job_order_guid = this.route.snapshot.paramMap.get('id');
    this.steam_guid = this.route.snapshot.paramMap.get('steam_id');
    if (this.job_order_guid) {
      this.subs.sink = this.joDS.getJobOrderByID(this.job_order_guid).subscribe(jo => {
        if (jo?.length) {
          console.log(jo)
          this.jobOrderItem = jo[0];
          this.subscribeToJobOrderEvent(this.joDS.subscribeToJobOrderStarted.bind(this.joDS), this.job_order_guid!);
          this.subscribeToJobOrderEvent(this.joDS.subscribeToJobOrderStopped.bind(this.joDS), this.job_order_guid!);
          this.subscribeToJobOrderEvent(this.joDS.subscribeToJobOrderCompleted.bind(this.joDS), this.job_order_guid!);
          if (this.jobOrderItem.status_cv === 'PENDING') {
            this.toggleJobState(false);
          }
          if (this.steam_guid) {
            this.steamDS.getSteamIDForJobOrder(this.steam_guid, this.job_order_guid!).subscribe(steam => {
              if (steam?.length) {
                console.log(steam)
                this.steamItem = steam[0];
                this.sotItem = this.steamItem?.storing_order_tank;
                this.reqTemp = (!this.sotItem?.required_temp) ? this.reqTemp : this.sotItem?.required_temp;
                this.QuerySteamTemp();
             

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

  updateData(newData: SteamTemp[] | undefined): void {
    if (newData?.length) {
      this.deList = newData.map((row, index) => ({
        ...row,
        index: index,
        edited: false
      }));
    }
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.SAVE_SUCCESS;
      ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
      this.router.navigate(['/admin/steam/job-order']);
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
        return '';
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
    return this.joDS.canCompleteJob(this.jobOrderItem) && !this.isStarted()
  }

  toggleJobState(isStarted: boolean | undefined) {
    //this.preventDefault(event);  // Prevents the form submission
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

  completeJobItem(event: Event, repair_part: RepairPartItem) {
    this.preventDefault(event);  // Prevents the form submission
    if (this.repairPartDS.isCompleted(repair_part)) return;
    const newParam = new JobItemRequest({
      guid: repair_part.guid,
      job_order_guid: repair_part.job_order_guid,
      job_type_cv: repair_part.job_order?.job_type_cv
    });
    const param = [newParam];
    console.log(param)
    this.joDS.completeJobItem(param).subscribe(result => {
      console.log(result)
    });
  }

  completeJob(event: Event) {
    this.preventDefault(event);  // Prevents the form submission
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

  private subscribeToJobOrderEvent(
    subscribeFn: (guid: string) => Observable<any>,
    job_order_guid: string
  ) {
    const subscription = subscribeFn(job_order_guid).subscribe({
      next: (response) => {
        console.log('Received data:', response);
        const data = response.data

        let jobData: any;
        let eventType: any;

        if (data?.onJobStopped) {
          jobData = data.onJobStopped;
          eventType = 'jobStopped';
        } else if (data?.onJobStarted) {
          jobData = data.onJobStarted;
          eventType = 'jobStarted';
        } else if (data?.onJobCompleted) {
          jobData = data.onJobCompleted;
          eventType = 'onJobCompleted';
        }

        if (jobData) {
          if (this.jobOrderItem) {
            this.jobOrderItem.status_cv = jobData.job_status;
            this.jobOrderItem.start_dt = this.jobOrderItem.start_dt ?? jobData.start_time;
            this.jobOrderItem.time_table ??= [];

            const foundTimeTable = this.jobOrderItem.time_table?.filter(x => x.guid === jobData.time_table_guid);
            if (eventType === 'jobStarted') {
              if (foundTimeTable?.length) {
                foundTimeTable[0].start_time = jobData.start_time
                console.log(`Updated JobOrder ${eventType} :`, foundTimeTable[0]);
              } else {
                const startNew = new TimeTableItem({ guid: jobData.time_table_guid, start_time: jobData.start_time, stop_time: jobData.stop_time, job_order_guid: jobData.job_order_guid });
                this.jobOrderItem.time_table?.push(startNew)
                console.log(`Updated JobOrder ${eventType} :`, startNew);
              }
            } else if (eventType === 'jobStopped') {
              foundTimeTable[0].stop_time = jobData.stop_time;
              console.log(`Updated JobOrder ${eventType} :`, foundTimeTable[0]);
            }
          }
        }
      },
      error: (error) => {
        console.error('Error:', error);
      },
      complete: () => {
        console.log('Subscription completed');
      }
    });

    this.jobOrderSubscriptions.push(subscription);
  }

  private subscribeToJobItemEvent(
    subscribeFn: (guid: string, job_type: string) => Observable<any>,
    item_guid: string,
    job_type: string
  ) {
    const subscription = subscribeFn(item_guid, job_type).subscribe({
      next: (response) => {
        console.log('Received data:', response);
        const data = response.data

        let jobData: any;
        let eventType: any;

      },
      error: (error) => {
        console.error('Error:', error);
      },
      complete: () => {
        console.log('Subscription completed');
      }
    });

    this.jobOrderSubscriptions.push(subscription);
  }

  getFooterBackgroundColor(): string {
    return '' //'light-green';
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
      steaming_part: { all: { job_order: { status_cv: { eq: 'COMPLETED' } } } }
    });

    where.and.push({
      guid: { eq: steam_guid }
    })

    this.steamDS.search(where).subscribe(result => {

      if (result.length > 0) {
        var resItem: SteamItem = result[0];
        let steamStatus: SteamStatusRequest = new SteamStatusRequest();
        steamStatus.action = "COMPLETE";
        steamStatus.guid = resItem?.guid;
        steamStatus.sot_guid = resItem?.sot_guid;
        this.steamDS.updateSteamStatus(steamStatus).subscribe(result => {

          console.log(result);
        });


      }
      this.handleSaveSuccess(1);

    });

  }

  deleteEstDetail(event: Event, row: any) {
    this.preventDefault(event);
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      //width: '700px',
      disableClose: true,
      data: {
        action: 'cancel',
        index: row.index,
        item: row,
        langText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        var steamTmp: any = new SteamTemp(this.deList[row.index]);
        //var guid = steamTmp.guid;
        this.callRecordSteamingTemp(steamTmp, 'CANCEL');
        // this.resetSelectedItemForUpdating();
      }
    });

  }

  addEstDetails(event: Event) {
    this.preventDefault(event);

    let guid = null;
    if (this.updateSelectedItem) {
      var stmTmp = this.updateSelectedItem.item;
      guid = stmTmp.guid;
      var steamTmp: SteamTemp = this.GetRecordSteamingTempValue(guid!);
      this.callRecordSteamingTemp(steamTmp, 'EDIT', event);
    }
    else {
      var steamTmp: SteamTemp = this.GetRecordSteamingTempValue(guid!);
      this.callRecordSteamingTemp(steamTmp, 'NEW', event);
    }

  }

  editEstDetail(event: Event, row: any) {
    this.preventDefault(event);

    //this.updateSelectedItem=row;


    var IsEditedRow = row.edited;


    this.resetSelectedItemForUpdating();

    if (IsEditedRow) {
      row.edited = false;
      return;
    }


    this.updateSelectedItem = {
      item: row,
      index: row.index,
      action: "update",

    }
    this.updateSelectedItem.item.edited = true;
    this.patchValue(row);

  }

  resetSelectedItemForUpdating() {
    if (this.updateSelectedItem) {
      this.updateSelectedItem.item.edited = false;
      this.updateSelectedItem = null;

    }
    this.resetValue();
  }

  GetRecordSteamingTempValue(guid?: string): SteamTemp {
    var steamTmp: SteamTemp = new SteamTemp();
    //var action:string = (guid===null || guid==="")?"NEW":"UPDATE";
    steamTmp.report_dt = Number(Utility.convertDate(this.steamForm?.get("time")?.value, false, true));
    steamTmp.bottom_temp = this.steamForm?.get("bottom")?.value;
    steamTmp.top_temp = this.steamForm?.get("top")?.value;
    steamTmp.meter_temp = this.steamForm?.get("thermometer")?.value;
    steamTmp.remarks = this.steamForm?.get("remarks")?.value;;
    steamTmp.job_order_guid = this.job_order_guid!;
    steamTmp.guid = guid;
    return steamTmp;
  }

  callRecordSteamingTemp(steamTemp: SteamTemp, action?: string, event?: Event) {
    var ReqTemp: number = this.reqTemp!;
    this.steamDS.recordSteamingTemp(steamTemp, action!, ReqTemp).subscribe(result => {
      if (result.data.recordSteamingTemp) {
        let checkAction = [
          'NEW',
          'EDIT',
        ];
        if (!checkAction.includes(action!)) {
          this.QuerySteamTemp();
          this.resetSelectedItemForUpdating();
        } else {
          if (this.RequiredShowConfirmation(ReqTemp, steamTemp)) {
            let tempStatus: number = this.CheckAndGetTempStatus(steamTemp);
            this.completeSteamJob(event!, false, tempStatus);
          }
          else {
            this.QuerySteamTemp();
            this.resetSelectedItemForUpdating();
          }
        }
        //this.resetValue();
      }
    });
  }

  RequiredShowConfirmation(reqTemp: number, steamTemp: SteamTemp): boolean {
    var bRetval: boolean = false;

    bRetval = (reqTemp <= steamTemp.meter_temp! || reqTemp <= steamTemp.top_temp! || reqTemp <= steamTemp.bottom_temp!);
    return bRetval;
  }
  QuerySteamTemp() {
    this.steamDS.getSteamTemp(this.job_order_guid!).subscribe(temp => {
      if (temp?.length) {
        console.log(temp);
        this.updateData(temp);
      }
    });
  }

  patchValue(steamTmp: SteamTemp) {
    if (steamTmp) {
      const date = new Date((!steamTmp.report_dt ? steamTmp.create_dt! : steamTmp.report_dt!) * 1000);
      this.steamForm?.patchValue({
        time: date,
        thermometer: steamTmp.meter_temp,
        top: steamTmp.top_temp,
        bottom: steamTmp.bottom_temp,
        remarks: steamTmp.remarks,
      });
    }
  }

  resetValue() {

    const date = new Date();
    this.steamForm?.patchValue({
      time: date,
      thermometer: '',
      top: '',
      bottom: '',
      remarks: '',
    }, { emitEvent: false });
    this.steamForm?.get('time')?.setErrors(null);
    this.steamForm?.get('thermometer')?.setErrors(null);
    this.steamForm?.get('top')?.setErrors(null);
    this.steamForm?.get('bottom')?.setErrors(null);
  }

  completeSteamJob(event: Event, checkTemp: boolean, tempStatus: number) {
    this.preventDefault(event);
    if (checkTemp) {
      tempStatus = this.CheckAndGetTempStatus();
    }
    if (this.steamItem?.steaming_part?.length) {
      let tempDirection: Direction;
      if (localStorage.getItem('isRtl') === 'true') {
        tempDirection = 'rtl';
      } else {
        tempDirection = 'ltr';
      }
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '550px',
        disableClose: true,
        data: {
          action: 'confirm',
          item: this.steamItem,
          langText: this.translatedLangText,
          tempStatus: tempStatus,
        },
        direction: tempDirection
      });
      this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
        if (result?.action === 'confirmed') {


          let jobOrder = this.steamItem?.steaming_part?.[0]?.job_order;
          var updJobOrderReq: UpdateJobOrderRequest = new UpdateJobOrderRequest(jobOrder);
          updJobOrderReq.complete_dt = Math.floor(Date.now() / 1000);
          var updJobOrderReqs: UpdateJobOrderRequest[] = [];
          updJobOrderReqs.push(updJobOrderReq);
          var steaming: any = undefined;
          if (!this.steamItem?.storing_order_tank?.tank?.flat_rate) {
            const minItem = this.deList.reduce((minItem, item) =>
              item.report_dt < minItem.report_dt ? item : minItem
            );
            steaming = new SteamGO(this.steamItem);
            steaming.action = "EDIT";
            var startTime = minItem?.report_dt || 0;
            var endTime = Math.floor(Date.now() / 1000);
            // Calculate time difference in seconds
            const timeDiffSeconds = endTime - startTime;

            // Convert to hours (decimal)
            const decimalHours = timeDiffSeconds / 3600;

            // Round to nearest 0.25 increment
            const roundedHours = Math.round(decimalHours * 4) / 4;
            steaming.total_hour = roundedHours;
          }
          this.joDS.completeJobOrder(updJobOrderReqs, steaming).subscribe(result => {
            console.log(result);
            if (result.data.completeJobOrder > 0) {
              let stmStatus: SteamStatusRequest = new SteamStatusRequest();
              stmStatus.action = "COMPLETE";
              stmStatus.guid = this.steamItem?.guid;
              stmStatus.sot_guid = this.steamItem?.sot_guid;
              this.steamDS.updateSteamStatus(stmStatus).subscribe(result => {
                if (result.data.updateSteamingStatus > 0) {
                  console.log(result);
                  this.handleSaveSuccess(result.data.updateSteamingStatus);
                }
              });
            }
          });
          // this.resetSelectedItemForUpdating();
        }
        else {
          this.QuerySteamTemp();
          this.resetSelectedItemForUpdating();
        }
      });

    }
    // this.joDS.completeJobOrder()
  }

  DisplayEpochToDate(epochTimeInSeconds: number): string {

    let tm: Date = new Date;

    if (epochTimeInSeconds) {
      const convertedVal = Utility.convertDate(epochTimeInSeconds);
      if (convertedVal instanceof Date) {
        tm = convertedVal; // Assign only if it's a Date
      }
    }
    return tm.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  CheckAndGetTempStatus(steamTemp?: SteamTemp): number {
    const reqTemp = this.reqTemp!;
    const deTemps =this.deList.flatMap(a => [a.meter_temp, a.top_temp, a.bottom_temp]); // this.deList.map(a => a.meter_temp);
    let steamTempVal = null;

    if(steamTemp){
      steamTempVal = [steamTemp.meter_temp, steamTemp.top_temp, steamTemp.bottom_temp];
    }

    const allTemps = steamTempVal !== null ? [...deTemps, ...steamTempVal] : deTemps;

    const anyGreater = allTemps.some(temp => temp > reqTemp);
    const allLess = allTemps.every(temp => temp < reqTemp);
    const anyEqual = allTemps.some(temp => temp === reqTemp);

    if (anyGreater) return 2;
    if (allLess) return 1;
    if (anyEqual) return 0;
    return 0; // Mixed cases
  }
}