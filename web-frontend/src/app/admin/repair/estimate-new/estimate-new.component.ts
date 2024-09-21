import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag, CdkDragHandle, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
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
import { StoringOrderService } from 'app/services/storing-order.service';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values'
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company'
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
import { RepairEstPartDS, RepairEstPartItem } from 'app/data-sources/repair-est-part';
import { TlxFormFieldComponent } from '@shared/components/tlx-form/tlx-form-field/tlx-form-field.component';
import { PackageLabourDS, PackageLabourItem } from 'app/data-sources/package-labour';
import { RepairEstDS } from 'app/data-sources/repair-est';
import { MasterEstimateTemplateDS, MasterTemplateItem } from 'app/data-sources/master-template';
import { REPDamageRepairItem } from 'app/data-sources/rep-damage-repair';
import { PackageRepairDS, PackageRepairItem } from 'app/data-sources/package-repair';
import { UserDS, UserItem } from 'app/data-sources/user';

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
export class EstimateNewComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'group_name_cv',
    'subgroup_name_cv',
    'damange',
    'repair',
    'description',
    'quantity',
    'hour',
    'price',
    'material',
    'isOwner',
    'actions'
  ];
  pageTitleNew = 'MENUITEMS.REPAIR.LIST.ESTIMATE-NEW'
  pageTitleEdit = 'MENUITEMS.REPAIR.LIST.ESTIMATE-EDIT'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT',
    'MENUITEMS.REPAIR.LIST.ESTIMATE'
  ]
  translatedLangText: any = {}
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.HEADER',
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    SO_NO: 'COMMON-FORM.SO-NO',
    SO_NOTES: 'COMMON-FORM.SO-NOTES',
    HAULIER: 'COMMON-FORM.HAULIER',
    TANK_DETAILS: 'COMMON-FORM.TANK-DETAILS',
    UNIT_TYPE: 'COMMON-FORM.UNIT-TYPE',
    TANK_NO: 'COMMON-FORM.TANK-NO',
    PURPOSE: 'COMMON-FORM.PURPOSE',
    STORAGE: 'COMMON-FORM.STORAGE',
    STEAM: 'COMMON-FORM.STEAM',
    CLEANING: 'COMMON-FORM.CLEANING',
    REPAIR: 'COMMON-FORM.REPAIR',
    LAST_CARGO: 'COMMON-FORM.LAST-CARGO',
    CLEAN_STATUS: 'COMMON-FORM.CLEAN-STATUS',
    CERTIFICATE: 'COMMON-FORM.CERTIFICATE',
    REQUIRED_TEMP: 'COMMON-FORM.REQUIRED-TEMP',
    FLASH_POINT: 'COMMON-FORM.FLASH-POINT',
    JOB_NO: 'COMMON-FORM.JOB-NO',
    ETA_DATE: 'COMMON-FORM.ETA-DATE',
    REMARKS: 'COMMON-FORM.REMARKS',
    ETR_DATE: 'COMMON-FORM.ETR-DATE',
    ST: 'COMMON-FORM.ST',
    O2_LEVEL: 'COMMON-FORM.O2-LEVEL',
    OPEN_ON_GATE: 'COMMON-FORM.OPEN-ON-GATE',
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
    BULK: 'COMMON-FORM.BULK',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    UNDO: 'COMMON-FORM.UNDO',
    INVALID_SELECTION: 'COMMON-FORM.INVALID-SELECTION',
    EXCEEDED: 'COMMON-FORM.EXCEEDED',
    MUST_MORE_THAN_ZERO: 'COMMON-FORM.MUST-MORE-THAN-ZERO',
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
    IQ: 'COMMON-FORM.IQ',
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
    INTERNAL_QC_BY: 'COMMON-FORM.INTERNAL-QC-BY',
    RATE: 'COMMON-FORM.RATE',
    LESSEE: 'COMMON-FORM.LESSEE',
    TOTAL: 'COMMON-FORM.TOTAL',
    PART: 'COMMON-FORM.PART'
  }

  clean_statusList: CodeValuesItem[] = [];

  sot_guid?: string | null;

  repairEstForm?: UntypedFormGroup;
  sotForm?: UntypedFormGroup;

  sotItem?: StoringOrderTankItem;
  packageLabourItem?: PackageLabourItem;
  repList = new MatTableDataSource<RepairEstPartItem>();
  repSelection = new SelectionModel<RepairEstPartItem>(true, []);
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

  customerCodeControl = new UntypedFormControl();

  soDS: StoringOrderDS;
  sotDS: StoringOrderTankDS;
  cvDS: CodeValuesDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  plDS: PackageLabourDS;
  repairEstDS: RepairEstDS;
  repairEstPartDS: RepairEstPartDS;
  mtDS: MasterEstimateTemplateDS;
  prDS: PackageRepairDS;
  userDS: UserDS;
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
    this.soDS = new StoringOrderDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.plDS = new PackageLabourDS(this.apollo);
    this.repairEstDS = new RepairEstDS(this.apollo);
    this.repairEstPartDS = new RepairEstPartDS(this.apollo);
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
    this.initializeValueChanges();
    this.loadData();
  }

  initForm() {
    this.repairEstForm = this.fb.group({
      guid: [''],
      customer_company_guid: [''],
      customer_code: this.customerCodeControl,
      est_template: [''],
      remarks: [''],
      surveyor_name_cv: [''],
      internal_qc_by: [''],
      labour_cost_discount: [0],
      material_cost_discount: [0],
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
    });
  }

  initializeValueChanges() {
    this.repairEstForm?.get('est_template')?.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        if (value) {
          console.log(value);
          // estimate
          this.repairEstForm?.get('labour_cost_discount')?.setValue(value.labour_cost_discount);
          this.repairEstForm?.get('material_cost_discount')?.setValue(value.labour_cost_discount);
          this.repairEstForm?.get('remarks')?.setValue(value.remarks);
          const repList: RepairEstPartItem[] = value.template_est_part.map((tep: any) => {
            return new RepairEstPartItem({
              description: tep.description,
              hour: tep.hour,
              location_cv: tep.location_cv,
              quantity: tep.quantity,
              remarks: tep.remarks,
              material_cost: tep.tariff_repair?.package_repair?.material_cost,
              tariff_repair_guid: tep.tariff_repair_guid,
              tariff_repair: tep.tariff_repair,
              damage: tep.tep_damage_repair.filter((x: any) => x.code_type === 0).map((damage: any) => new REPDamageRepairItem(damage)),
              repair: tep.tep_damage_repair.filter((x: any) => x.code_type === 1).map((repair: any) => new REPDamageRepairItem(repair)),
            });
          });
          this.updateData(repList);
          // estimate part
          // const tariff_repair_guid = value.template_est_part.map((tep: any) => tep.tariff_repair_guid);
          // this.getCustomerCost(this.sotItem?.storing_order?.customer_company_guid, tariff_repair_guid).pipe(
          //   switchMap(data => {
          //     let material_cost = 0;
          //     if (data && data.length) {
          //       material_cost = data[0].material_cost;
          //       console.log('Customer Package Cost Data:', data);
          //     }

          //     const repList: RepairEstPartItem[] = value.template_est_part.map((tep: any) => {
          //       return new RepairEstPartItem({
          //         description: tep.description,
          //         hour: tep.hour,
          //         location_cv: tep.location_cv,
          //         quantity: tep.quantity,
          //         remarks: tep.remarks,
          //         material_cost: material_cost,
          //         tariff_repair_guid: tep.tariff_repair_guid,
          //         tariff_repair: tep.tariff_repair,
          //         damage: tep.tep_damage_repair.filter((x: any) => x.code_type === 0).map((damage: any) => new REPDamageRepairItem(damage)),
          //         repair: tep.tep_damage_repair.filter((x: any) => x.code_type === 1).map((repair: any) => new REPDamageRepairItem(repair)),
          //       });
          //     });
          //     this.updateData(repList);

          //     return of(repList);
          //   })
          // ).subscribe();
        }
      })
    ).subscribe();

    this.repairEstForm?.get('labour_cost_discount')?.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        if (value) {
          // estimate
          this.calculateCost();
        }
      })
    ).subscribe();

    this.repairEstForm?.get('material_cost_discount')?.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        if (value) {
          // estimate
          this.calculateCost();
        }
      })
    ).subscribe();
  }

  public loadData() {
    this.sot_guid = this.route.snapshot.paramMap.get('id');
    if (this.sot_guid) {
      this.subs.sink = this.sotDS.getStoringOrderTankByIDForRepairEst(this.sot_guid).subscribe(data => {
        if (this.sotDS.totalCount > 0) {
          this.sotItem = data[0];
          console.log(this.sotItem.storing_order?.customer_company_guid);
          this.getCustomerLabourPackage(this.sotItem.storing_order?.customer_company_guid!);
          this.getTemplateList(this.sotItem.storing_order?.customer_company_guid!);
        }
      });
    }
    this.getSurveyorList();
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

    this.cvDS.connectAlias('groupNameCv').subscribe(data => {
      this.groupNameCvList = data;
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

  getTemplateList(customer_company_guid: string) {
    const where = {
      or: [
        {
          and: [
            { template_est_customer: { some: { customer_company_guid: { eq: customer_company_guid } } } },
            { type_cv: { eq: "EXCLUSIVE" } }
          ]
        },
        { type_cv: { eq: "GENERAL" } }
      ]
    }
    this.subs.sink = this.mtDS.searchEstimateTemplateForRepair(where, {}).subscribe(data => {
      if (data?.length > 0) {
        this.templateList = data;
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

  populateForm(so: StoringOrderItem): void {
    this.repairEstForm!.patchValue({
      guid: so.guid,
      customer_code: so.customer_company,
      customer_company_guid: so.customer_company_guid,
      so_no: so.so_no,
      so_notes: so.so_notes,
      haulier: so.haulier
    });
    if (so.storing_order_tank) {
      this.populateSOT(so.storing_order_tank);
    }
  }

  populateSOT(rep: RepairEstPartItem[]) {
    if (rep?.length) {
      const repList: RepairEstPartItem[] = rep.map((item: Partial<RepairEstPartItem> | undefined) => new RepairEstPartItem(item));
      this.updateData(repList);
    }
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
  }

  selectOwner($event: Event, row: RepairEstPartItem) {
    this.stopPropagation($event);
    row.owner = !(row.owner || false);
    this.calculateCost();
  }

  addEstDetails(event: Event, row?: RepairEstPartItem) {
    this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const addSot = row ?? new RepairEstPartItem();
    addSot.repair_est_guid = addSot.repair_est_guid;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '1000px',
      data: {
        item: row ? row : addSot,
        action: 'new',
        translatedLangText: this.translatedLangText,
        populateData: {
          groupNameCvList: this.groupNameCvList,
          subgroupNameCvList: [],
          yesnoCvList: this.yesnoCvList,
          partLocationCvList: this.partLocationCvList,
          damageCodeCvList: this.damageCodeCvList,
          repairCodeCvList: this.repairCodeCvList,
          unitTypeCvList: this.unitTypeCvList
        },
        index: -1,
        customer_company_guid: this.sotItem?.storing_order?.customer_company_guid
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data = [...this.repList.data];
        const newItem = new RepairEstPartItem({
          ...result.item,
        });
        data.push(newItem);

        this.updateData(data);
      }
    });
  }

  editEstDetails(event: Event, row: RepairEstPartItem, index: number) {
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
        populateData: {
          groupNameCvList: this.groupNameCvList,
          subgroupNameCvList: [],
          yesnoCvList: this.yesnoCvList,
          partLocationCvList: this.partLocationCvList,
          damageCodeCvList: this.damageCodeCvList,
          repairCodeCvList: this.repairCodeCvList,
          unitTypeCvList: this.unitTypeCvList
        },
        index: index,
        customer_company_guid: this.sotItem?.storing_order?.customer_company_guid
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data = [...this.repList.data];
        const updatedItem = new RepairEstPartItem({
          ...result.item,
        });
        if (result.index >= 0) {
          data[result.index] = updatedItem;
          this.updateData(data);
        } else {
          this.updateData([...this.repList.data, result.item]);
        }
      }
    });
  }

  deleteItem(row: StoringOrderTankItem, index: number) {
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
          const data = [...this.repList.data];
          const updatedItem = {
            ...result.item,
            delete_dt: Utility.getDeleteDtEpoch(),
            actions: Array.isArray(data[index].actions!)
              ? [...new Set([...data[index].actions!, 'delete'])]
              : ['delete']
          };
          data[result.index] = updatedItem;
          this.updateData(data); // Refresh the data source
        } else {
          const data = [...this.repList.data];
          data.splice(index, 1);
          this.updateData(data); // Refresh the data source
        }
      }
    });
  }

  cancelSelectedRows(row: RepairEstPartItem[]) {
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
        const data = [...this.repList.data];
        result.item.forEach((newItem: RepairEstPartItem) => {
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

  rollbackSelectedRows(row: RepairEstPartItem[]) {
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
        const data = [...this.repList.data];
        result.item.forEach((newItem: RepairEstPartItem) => {
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

  undoTempAction(row: RepairEstPartItem[], actionToBeRemove: string) {
    const data = [...this.repList.data];
    row.forEach((newItem: RepairEstPartItem) => {
      const index = data.findIndex(existingItem => existingItem.guid === newItem.guid);

      if (index !== -1) {
        data[index] = {
          ...data[index],
          ...newItem,
          actions: Array.isArray(data[index].actions!)
            ? data[index].actions!.filter(action => action !== actionToBeRemove)
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

  onFormSubmit() {
    // this.repairEstForm!.get('sotList')?.setErrors(null);
    if (this.repairEstForm?.valid) {
      // if (!this.repList.data.length) {
      //   this.repairEstForm.get('sotList')?.setErrors({ required: true });
      // } else {
      //   let so: StoringOrderGO = new StoringOrderGO(this.storingOrderItem);
      //   so.customer_company_guid = this.repairEstForm.value['customer_company_guid'];
      //   so.haulier = this.repairEstForm.value['haulier'];
      //   so.so_notes = this.repairEstForm.value['so_notes'];

      //   const sot: StoringOrderTankGO[] = this.repList.data.map((item: Partial<StoringOrderTankItem>) => {
      //     // Ensure action is an array and take the last action only
      //     const actions = Array.isArray(item!.actions) ? item!.actions : [];
      //     const latestAction = actions.length > 0 ? actions[actions.length - 1] : '';

      //     return new StoringOrderTankUpdateSO({
      //       ...item,
      //       action: latestAction // Set the latest action as the single action
      //     });
      //   });
      //   console.log('so Value', so);
      //   console.log('sot Value', sot);
      //   if (so.guid) {
      //     this.soDS.updateStoringOrder(so, sot).subscribe(result => {
      //       console.log(result)
      //       this.handleSaveSuccess(result?.data?.updateStoringOrder);
      //     });
      //   } else {
      //     this.soDS.addStoringOrder(so, sot).subscribe(result => {
      //       console.log(result)
      //       this.handleSaveSuccess(result?.data?.addStoringOrder);
      //     });
      //   }
      // }
    } else {
      console.log('Invalid repairEstForm', this.repairEstForm?.value);
    }
  }

  updateData(newData: RepairEstPartItem[]): void {
    this.repList.data = [...newData];
    this.calculateCost();
  }

  handleDelete(event: Event, row: any, index: number): void {
    this.deleteItem(row, index);
  }

  cancelItem(event: Event, row: RepairEstPartItem) {
    // this.id = row.id;
    if (this.repSelection.hasValue()) {
      this.cancelSelectedRows(this.repSelection.selected)
    } else {
      this.cancelSelectedRows([row])
    }
  }

  rollbackItem(event: Event, row: StoringOrderTankItem) {
    // this.id = row.id;
    if (this.repSelection.hasValue()) {
      this.rollbackSelectedRows(this.repSelection.selected)
    } else {
      this.rollbackSelectedRows([row])
    }
  }

  undoAction(event: Event, row: StoringOrderTankItem, action: string) {
    // this.id = row.id;
    this.stopPropagation(event);
    if (this.repSelection.hasValue()) {
      this.undoTempAction(this.repSelection.selected, action)
    } else {
      this.undoTempAction([row], action)
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
    this.addEstDetails(event, newSot);
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.langText.SAVE_SUCCESS;
      this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
        successMsg = res;
        ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
        this.router.navigate(['/admin/inventory/storing-order']);
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

  getLastAction(actions: string[]): string {
    return actions[actions.length - 1];
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

  getDamageCodeDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.damageCodeCvList);
  }

  getRepairCodeDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.repairCodeCvList);
  }

  displayDamageRepairCode(damageRepair: any[]): string {
    return damageRepair.map(item => {
      return item.code_cv;
    }).join('/');
  }

  displayDamageRepairCodeDescription(damageRepair: any[]): string {
    return damageRepair.map(item => {
      const codeCv = item.code_cv;
      const description = `(${codeCv})` + (item.code_type == 0 ? this.getDamageCodeDescription(codeCv) : this.getRepairCodeDescription(codeCv));
      return description ? description : '';
    }).join('/');
  }

  displayDateTime(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateTimeStr(input);
  }

  displayDate(input: Date): string {
    return Utility.convertDateToStr(input);
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
    const ownerList = this.repList.data.filter(item => item.owner);
    const lesseeList = this.repList.data.filter(item => !item.owner);
    const labourDiscount = this.repairEstForm?.get('labour_cost_discount')?.value;
    const matDiscount = this.repairEstForm?.get('material_cost_discount')?.value;

    let total_hour = 0;
    let total_labour_cost = 0;
    let total_mat_cost = 0;
    let total_cost = 0;
    let discount_labour_cost = 0;
    let discount_mat_cost = 0;
    let net_cost = 0;

    const totalOwner = this.getTotal(ownerList);
    const total_owner_hour = totalOwner.hour;
    const total_owner_labour_cost = (total_owner_hour * (this.packageLabourItem?.cost ?? 0));
    const total_owner_mat_cost = totalOwner.total_mat_cost;
    const total_owner_cost = total_owner_labour_cost + total_owner_mat_cost;
    const discount_labour_owner_cost = (labourDiscount * total_owner_labour_cost) / 100;
    const discount_mat_owner_cost = (matDiscount * total_owner_mat_cost) / 100;
    const net_owner_cost = total_owner_cost - discount_labour_owner_cost - discount_mat_owner_cost;

    this.repairEstForm?.get('total_owner_hour')?.setValue(total_owner_hour.toFixed(2));
    this.repairEstForm?.get('total_owner_labour_cost')?.setValue(total_owner_labour_cost.toFixed(2));
    this.repairEstForm?.get('total_owner_mat_cost')?.setValue(total_owner_mat_cost.toFixed(2));
    this.repairEstForm?.get('total_owner_cost')?.setValue(total_owner_cost.toFixed(2));
    this.repairEstForm?.get('discount_labour_owner_cost')?.setValue(discount_labour_owner_cost.toFixed(2));
    this.repairEstForm?.get('discount_mat_owner_cost')?.setValue(discount_mat_owner_cost.toFixed(2));
    this.repairEstForm?.get('net_owner_cost')?.setValue(net_owner_cost.toFixed(2));

    total_hour += total_owner_hour;
    total_labour_cost += total_owner_labour_cost;
    total_mat_cost += total_owner_mat_cost;
    total_cost += total_owner_cost;
    discount_labour_cost += discount_labour_owner_cost;
    discount_mat_cost += discount_mat_owner_cost;
    net_cost += net_owner_cost;

    const totalLessee = this.getTotal(lesseeList);
    const total_lessee_hour = totalLessee.hour;
    const total_lessee_labour_cost = (total_lessee_hour * (this.packageLabourItem?.cost ?? 0));
    const total_lessee_mat_cost = totalLessee.total_mat_cost;
    const total_lessee_cost = total_lessee_labour_cost + total_lessee_mat_cost;
    const discount_labour_lessee_cost = (labourDiscount * total_lessee_labour_cost) / 100;
    const discount_mat_lessee_cost = (matDiscount * total_lessee_mat_cost) / 100;
    const net_lessee_cost = total_lessee_cost - discount_labour_lessee_cost - discount_mat_lessee_cost;

    this.repairEstForm?.get('total_lessee_hour')?.setValue(total_lessee_hour.toFixed(2));
    this.repairEstForm?.get('total_lessee_labour_cost')?.setValue(total_lessee_labour_cost.toFixed(2));
    this.repairEstForm?.get('total_lessee_mat_cost')?.setValue(total_lessee_mat_cost.toFixed(2));
    this.repairEstForm?.get('total_lessee_cost')?.setValue(total_lessee_cost.toFixed(2));
    this.repairEstForm?.get('discount_labour_lessee_cost')?.setValue(discount_labour_lessee_cost.toFixed(2));
    this.repairEstForm?.get('discount_mat_lessee_cost')?.setValue(discount_mat_lessee_cost.toFixed(2));
    this.repairEstForm?.get('net_lessee_cost')?.setValue(net_lessee_cost.toFixed(2));

    total_hour += total_lessee_hour;
    total_labour_cost += total_lessee_labour_cost;
    total_mat_cost += total_lessee_mat_cost;
    total_cost += total_lessee_cost;
    discount_labour_cost += discount_labour_lessee_cost;
    discount_mat_cost += discount_mat_lessee_cost;
    net_cost += net_lessee_cost;

    this.repairEstForm?.get('total_hour')?.setValue(total_hour.toFixed(2));
    this.repairEstForm?.get('total_labour_cost')?.setValue(total_labour_cost.toFixed(2));
    this.repairEstForm?.get('total_mat_cost')?.setValue(total_mat_cost.toFixed(2));
    this.repairEstForm?.get('total_cost')?.setValue(total_cost.toFixed(2));
    this.repairEstForm?.get('discount_labour_cost')?.setValue(discount_labour_cost.toFixed(2));
    this.repairEstForm?.get('discount_mat_cost')?.setValue(discount_mat_cost.toFixed(2));
    this.repairEstForm?.get('net_cost')?.setValue(net_cost.toFixed(2));
  }

  getTotal(ownerList: any[]): any {
    const totalSums = ownerList.reduce((totals: any, owner) => {
      return {
        hour: (totals.hour ?? 0) + (owner.hour ?? 0),
        total_mat_cost: totals.total_mat_cost + (((owner.quantity ?? 0) * (owner.material_cost ?? 0)))
      };
    }, { hour: 0, total_mat_cost: 0 });
    return totalSums;
  }
}