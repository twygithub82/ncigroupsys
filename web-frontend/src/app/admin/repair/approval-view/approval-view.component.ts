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
import { RepairEstPartDS, RepairEstPartItem } from 'app/data-sources/repair-est-part';
import { TlxFormFieldComponent } from '@shared/components/tlx-form/tlx-form-field/tlx-form-field.component';
import { PackageLabourDS, PackageLabourItem } from 'app/data-sources/package-labour';
import { RepairEstDS, RepairEstGO, RepairEstItem } from 'app/data-sources/repair-est';
import { MasterEstimateTemplateDS, MasterTemplateItem } from 'app/data-sources/master-template';
import { REPDamageRepairDS, REPDamageRepairItem } from 'app/data-sources/rep-damage-repair';
import { PackageRepairDS, PackageRepairItem } from 'app/data-sources/package-repair';
import { UserDS, UserItem } from 'app/data-sources/user';

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
export class ApprovalViewComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
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
    BILL_DETAILS: 'COMMON-FORM.BILL-DETAILS',
    BILL_TO: 'COMMON-FORM.BILL-TO'
  }

  clean_statusList: CodeValuesItem[] = [];

  repair_est_guid?: string | null;

  repairEstForm?: UntypedFormGroup;

  sotItem?: StoringOrderTankItem;
  repairEstItem?: RepairEstItem;
  packageLabourItem?: PackageLabourItem;
  repList: RepairEstPartItem[] = [];
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

  customer_companyList?: CustomerCompanyItem[];

  customerCodeControl = new UntypedFormControl();

  sotDS: StoringOrderTankDS;
  cvDS: CodeValuesDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  plDS: PackageLabourDS;
  repairEstDS: RepairEstDS;
  repairEstPartDS: RepairEstPartDS;
  repDmgRepairDS: REPDamageRepairDS;
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
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.plDS = new PackageLabourDS(this.apollo);
    this.repairEstDS = new RepairEstDS(this.apollo);
    this.repairEstPartDS = new RepairEstPartDS(this.apollo);
    this.repDmgRepairDS = new REPDamageRepairDS(this.apollo);
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
      repList: ['']
    });
  }

  initializeValueChanges() {
    this.repairEstForm?.get('est_template')?.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        if (value) {
          console.log(value);
          if (this.getCustomer()?.def_template_guid) {
            this.repairEstForm?.get('is_default_template')?.setValue(this.getCustomer()?.def_template_guid === value.guid);
          }
          // estimate
          this.repairEstForm?.get('labour_cost_discount')?.setValue(value.labour_cost_discount);
          this.repairEstForm?.get('material_cost_discount')?.setValue(value.labour_cost_discount);
          this.repairEstForm?.get('remarks')?.setValue(value.remarks);
          const repList: RepairEstPartItem[] = this.filterDeleted(value.template_est_part).map((tep: any) => {
            const package_repair = tep.tariff_repair?.package_repair;
            let material_cost = 0;
            if (package_repair?.length) {
              material_cost = package_repair[0].material_cost
            }
            const tep_damage_repair = this.filterDeleted(tep.tep_damage_repair).map((item: any) => {
              return new REPDamageRepairItem({
                code_cv: item.code_cv,
                code_type: item.code_type,
                action: 'new'
              });
            })
            return new RepairEstPartItem({
              repair_est_guid: this.repair_est_guid || undefined,
              description: tep.description,
              hour: tep.hour,
              location_cv: tep.location_cv,
              comment: tep.comment,
              quantity: tep.quantity,
              remarks: tep.remarks,
              material_cost: material_cost,
              tariff_repair_guid: tep.tariff_repair_guid,
              tariff_repair: tep.tariff_repair,
              rep_damage_repair: tep_damage_repair,
              action: "new"
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
          //       const tep_damage_repair = tep.tep_damage_repair.map((item: any) => {
          //         return new REPDamageRepairItem({
          //           guid: item.guid,
          //           rep_guid: item.rep_guid,
          //           code_cv: item.code_cv,
          //           code_type: item.code_type,
          //           action: 'new'
          //         });
          //       })

          //       return new RepairEstPartItem({
          //         description: tep.description,
          //         hour: tep.hour,
          //         location_cv: tep.location_cv,
          //         quantity: tep.quantity,
          //         remarks: tep.remarks,
          //         material_cost: material_cost,
          //         tariff_repair_guid: tep.tariff_repair_guid,
          //         tariff_repair: tep.tariff_repair,
          //         rep_damage_repair: tep_damage_repair,
          //         action: 'new',
          //       });
          //     });
          //     console.log(repList);
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
        this.calculateCost();
      })
    ).subscribe();

    this.repairEstForm?.get('material_cost_discount')?.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        this.calculateCost();
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

    this.repair_est_guid = this.route.snapshot.paramMap.get('id');
    if (this.repair_est_guid) {
      this.subs.sink = this.repairEstDS.getRepairEstByIDForApproval(this.repair_est_guid).subscribe(data => {
        if (data?.length) {
          this.repairEstItem = data[0];
          this.sotItem = this.repairEstItem?.storing_order_tank;
          this.getCustomerLabourPackage(this.sotItem?.storing_order?.customer_company?.guid!);
          this.ccDS.getCustomerAndBranch(this.sotItem?.storing_order?.customer_company?.guid!).subscribe(cc => {
            if (cc?.length) {
              this.customer_companyList = cc;
              if (this.customer_companyList?.length == 1) {
                const bill_to = this.repairEstForm?.get('bill_to');
                bill_to?.setValue(this.customer_companyList[0]);
                if (!this.canApprove()) {
                  bill_to?.disable();
                }
              }
            }
          });
          this.populateRepairEst(this.repairEstItem);
        }
      });
    }
  }

  populateRepairEst(repair_est: RepairEstItem) {
    this.isOwner = repair_est.owner_enable ?? false;
    repair_est.repair_est_part = this.filterDeleted(repair_est.repair_est_part)
    this.updateData(repair_est.repair_est_part);
    this.repairEstForm?.patchValue({
      job_no: repair_est.job_no || this.sotItem?.job_no,
      guid: repair_est.guid,
      remarks: repair_est.remarks,
      surveyor_id: repair_est.aspnetusers_guid,
      labour_cost_discount: repair_est.labour_cost_discount,
      material_cost_discount: repair_est.material_cost_discount
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
    return cc && cc.code ? `${cc.code} (${cc.name}) - ${cc.type_cv}` : '';
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
          subgroupNameCvList: this.subgroupNameCvList,
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
        const data = [...this.repList];
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
          subgroupNameCvList: this.subgroupNameCvList,
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
        const data = [...this.repList];
        const updatedItem = new RepairEstPartItem({
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

  deleteItem(event: Event, row: RepairEstPartItem, index: number) {
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
          const data: any[] = [...this.repList];
          const updatedItem = {
            ...result.item,
            delete_dt: Utility.getDeleteDtEpoch(),
            action: 'cancel'
          };
          data[result.index] = updatedItem;
          this.updateData(data); // Refresh the data source
        } else {
          const data = [...this.repList];
          data.splice(index, 1);
          this.updateData(data); // Refresh the data source
        }
      }
    });
  }

  onCancel(event: Event) {
    this.preventDefault(event);
    console.log(this.repairEstItem)

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
        item: [this.repairEstItem],
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const reList = result.item.map((item: RepairEstItem) => new RepairEstGO(item));
        console.log(reList);
        this.repairEstDS.cancelRepairEstimate(reList).subscribe(result => {
          this.handleCancelSuccess(result?.data?.cancelRepairEstimate)
        });
      }
    });
  }

  onRollback(event: Event) {
    this.preventDefault(event);
    console.log(this.repairEstItem)

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
        item: [this.repairEstItem],
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const reList = result.item.map((item: any) => {
          const RepairEstimateRequestInput = {
            customer_guid: this.sotItem?.storing_order?.customer_company?.guid,
            estimate_no: item.estimate_no,
            guid: item.guid,
            remarks: item.remarks,
            sot_guid: item.sot_guid
          }
          return RepairEstimateRequestInput
        });
        console.log(reList);
        this.repairEstDS.rollbackRepairEstimate(reList).subscribe(result => {
          this.handleRollbackSuccess(result?.data?.rollbackRepairEstimate)
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
  }

  onApprove(event: Event) {
    event.preventDefault();
    if (this.repairEstForm!.get('bill_to')?.valid) {
      let re: RepairEstItem = new RepairEstItem();
      re.guid = this.repairEstItem?.guid;
      re.sot_guid = this.repairEstItem?.sot_guid;
      re.bill_to_guid = this.repairEstForm!.get('bill_to')?.value?.guid;

      this.repList?.forEach((rep: RepairEstPartItem) => {
        rep.approve_part = rep.approve_part ?? this.repairEstPartDS.is4X(rep.rep_damage_repair);
        rep.approve_qty = (rep.approve_part ?? this.repairEstPartDS.is4X(rep.rep_damage_repair)) ? (rep.approve_qty ?? rep.quantity) : 1;
        rep.approve_hour = (rep.approve_part ?? this.repairEstPartDS.is4X(rep.rep_damage_repair)) ? (rep.approve_hour ?? rep.hour) : 0;
        rep.approve_cost = (rep.approve_part ?? this.repairEstPartDS.is4X(rep.rep_damage_repair)) ? (rep.approve_cost ?? rep.material_cost) : 0;
      })

      re.repair_est_part = this.repList?.map((rep: RepairEstPartItem) => {
        return new RepairEstPartItem({
          ...rep,
          tariff_repair: undefined,
          rep_damage_repair: undefined,
          approve_part: rep.approve_part ?? this.repairEstPartDS.is4X(rep.rep_damage_repair),
          approve_qty: (rep.approve_part ?? this.repairEstPartDS.is4X(rep.rep_damage_repair)) ? (rep.approve_qty ?? rep.quantity) : 1,
          approve_hour: (rep.approve_part ?? this.repairEstPartDS.is4X(rep.rep_damage_repair)) ? (rep.approve_hour ?? rep.hour) : 0,
          approve_cost: (rep.approve_part ?? this.repairEstPartDS.is4X(rep.rep_damage_repair)) ? (rep.approve_cost ?? rep.material_cost) : 0
        })
        // rep.approve_part = rep.approve_part ?? this.repairEstPartDS.is4X(rep.rep_damage_repair);
        // rep.approve_qty = (rep.approve_part ?? this.repairEstPartDS.is4X(rep.rep_damage_repair)) ? (rep.approve_qty ?? rep.quantity) : 1;
        // rep.approve_hour = (rep.approve_part ?? this.repairEstPartDS.is4X(rep.rep_damage_repair)) ? (rep.approve_hour ?? rep.hour) : 0;
        // rep.approve_cost = (rep.approve_part ?? this.repairEstPartDS.is4X(rep.rep_damage_repair)) ? (rep.approve_cost ?? rep.material_cost) : 0;
      });

      console.log(re)
      this.repairEstDS.approveRepairEstimate(re).subscribe(result => {
        console.log(result)
        this.handleSaveSuccess(result?.data?.approveRepairEstimate);
      });
    }
  }

  onFormSubmit() {
    this.repairEstForm!.get('repList')?.setErrors(null);
    // if (this.repairEstForm?.valid) {
    //   if (!this.repList.length) {
    //     this.repairEstForm.get('repList')?.setErrors({ required: true });
    //   } else {
    //     let re: RepairEstItem = new RepairEstItem(this.repairEstItem);

    //     const rep: RepairEstPartItem[] = this.repList.map((item: any) => {
    //       // Ensure action is an array and take the last action only
    //       const rep_damage_repair = item.rep_damage_repair.map((item: any) => {
    //         return new REPDamageRepairItem({
    //           guid: item.guid,
    //           rep_guid: item.rep_guid,
    //           code_cv: item.code_cv,
    //           code_type: item.code_type,
    //           action: item.action
    //         });
    //       });

    //       console.log(item)
    //       return new RepairEstPartItem({
    //         ...item,
    //         tariff_repair: undefined,
    //         rep_damage_repair: rep_damage_repair,
    //         action: item.action === 'new' ? 'new' : (item.action === 'cancel' ? 'cancel' : 'edit')
    //       });
    //     });
    //     re.repair_est_part = rep;
    //     re.sot_guid = this.sotItem?.guid;
    //     re.aspnetusers_guid = this.repairEstForm.get('surveyor_id')?.value;
    //     re.labour_cost_discount = Utility.convertNumber(this.repairEstForm.get('labour_cost_discount')?.value);
    //     re.material_cost_discount = Utility.convertNumber(this.repairEstForm.get('material_cost_discount')?.value);
    //     re.labour_cost = re.labour_cost || this.packageLabourItem?.cost;
    //     re.total_cost = Utility.convertNumber(this.repairEstForm.get('total_cost')?.value);
    //     re.remarks = this.repairEstForm.get('remarks')?.value;
    //     re.owner_enable = this.isOwner;

    //     let cc: any = undefined;
    //     if (this.repairEstForm?.get('is_default_template')?.value && this.repairEstForm.get('est_template')?.value?.guid) {
    //       cc = this.getCustomer();
    //       cc!.def_template_guid = this.repairEstForm.get('est_template')?.value?.guid;
    //       console.log(cc);
    //     }
    //     console.log(re);
    //     if (re.guid) {
    //       this.repairEstDS.updateRepairEstimate(re, new CustomerCompanyGO({ ...cc })).subscribe(result => {
    //         console.log(result)
    //         this.handleSaveSuccess(result?.data?.updateRepairEstimate);
    //       });
    //     } else {
    //       this.repairEstDS.addRepairEstimate(re, new CustomerCompanyGO({ ...cc })).subscribe(result => {
    //         console.log(result)
    //         this.handleSaveSuccess(result?.data?.addRepairEstimate);
    //       });
    //     }
    //   }
    // } else {
    //   console.log('Invalid repairEstForm', this.repairEstForm?.value);
    // }
  }

  updateData(newData: RepairEstPartItem[] | undefined): void {
    if (newData?.length) {
      newData = newData.map((row) => ({
        ...row,
        tariff_repair: {
          ...row.tariff_repair,
          sequence: this.getGroupSeq(row.tariff_repair?.group_name_cv)
        }
      }));

      newData = this.sortAndGroupByGroupName(newData);
      newData = [...this.sortREP(newData)];

      this.repList = newData.map((row, index) => ({
        ...row,
        index: index
      }));
      this.calculateCost();
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
      ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
      this.router.navigate(['/admin/repair/approval']);
    }
  }

  handleCancelSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.CANCELED_SUCCESS;
      ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
      this.router.navigate(['/admin/repair/approval']);
    }
  }

  handleRollbackSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.ROLLBACK_SUCCESS;
      ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
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

  canRollback(): boolean {
    return this.repairEstItem?.status_cv === 'CANCELED' || this.repairEstItem?.status_cv === 'APPROVED';
  }

  canApprove(): boolean {
    return this.repairEstItem?.status_cv === 'PENDING';
  }

  canCancel(): boolean {
    return this.repairEstItem?.status_cv === 'PENDING';
  }

  canSave(): boolean {
    return this.repairEstItem?.status_cv === 'PENDING';
  }

  isOwnerChange() {
    this.isOwner = !this.isOwner;
  }

  getBadgeClass(status: string | undefined): string {
    switch (status) {
      case 'APPROVED':
        return 'badge-solid-green';
      case 'PENDING':
        return 'badge-solid-cyan';
      case 'CANCEL':
        return 'badge-solid-red';
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

  sortREP(newData: RepairEstPartItem[]): any[] {
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
    }).join('/');
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

  parse2Decimal(figure: number | string | undefined) {
    if (typeof (figure) === 'string') {
      return parseFloat(figure).toFixed(2);
    } else if (typeof (figure) === 'number') {
      return figure.toFixed(2);
    }
    return "";
  }

  calculateCost() {
    const ownerList = this.repList.filter(item => item.owner && !item.delete_dt);
    const lesseeList = this.repList.filter(item => !item.owner && !item.delete_dt);
    const labourDiscount = this.repairEstForm?.get('labour_cost_discount')?.value;
    const matDiscount = this.repairEstForm?.get('material_cost_discount')?.value;

    let total_hour = 0;
    let total_labour_cost = 0;
    let total_mat_cost = 0;
    let total_cost = 0;
    let discount_labour_cost = 0;
    let discount_mat_cost = 0;
    let net_cost = 0;

    const totalOwner = this.repairEstDS.getTotal(ownerList);
    const total_owner_hour = totalOwner.hour;
    const total_owner_labour_cost = this.repairEstDS.getTotalLabourCost(total_owner_hour, this.getLabourCost());
    const total_owner_mat_cost = totalOwner.total_mat_cost;
    const total_owner_cost = this.repairEstDS.getTotalCost(total_owner_labour_cost, total_owner_mat_cost);
    const discount_labour_owner_cost = this.repairEstDS.getDiscountCost(labourDiscount, total_owner_labour_cost);
    const discount_mat_owner_cost = this.repairEstDS.getDiscountCost(matDiscount, total_owner_mat_cost);
    const net_owner_cost = this.repairEstDS.getNetCost(total_owner_cost, discount_labour_owner_cost, discount_mat_owner_cost);

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

    const totalLessee = this.repairEstDS.getTotal(lesseeList);
    const total_lessee_hour = totalLessee.hour;
    const total_lessee_labour_cost = this.repairEstDS.getTotalLabourCost(total_lessee_hour, this.getLabourCost());
    const total_lessee_mat_cost = totalLessee.total_mat_cost;
    const total_lessee_cost = this.repairEstDS.getTotalCost(total_lessee_labour_cost, total_lessee_mat_cost);
    const discount_labour_lessee_cost = this.repairEstDS.getDiscountCost(labourDiscount, total_lessee_labour_cost);
    const discount_mat_lessee_cost = this.repairEstDS.getDiscountCost(matDiscount, total_lessee_mat_cost);
    const net_lessee_cost = this.repairEstDS.getNetCost(total_lessee_cost, discount_labour_lessee_cost, discount_mat_lessee_cost);

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

  filterDeleted(resultList: any[] | undefined): any {
    return (resultList || []).filter((row: any) => !row.delete_dt);
  }

  canExport(): boolean {
    return !!this.repair_est_guid;
  }

  getLabourCost(): number | undefined {
    return this.repairEstItem?.labour_cost;
  }

  toggleApprovePart(rep: RepairEstPartItem) {
    if (!this.canApprove()) return;
    rep.approve_part = rep.approve_part != null ? !rep.approve_part : false;
  }

  displayApproveQty(rep: RepairEstPartItem) {
    return (rep.approve_part ?? this.repairEstPartDS.is4X(rep.rep_damage_repair)) ? (rep.approve_qty ?? rep.quantity) : 1;
  }

  displayApproveHour(rep: RepairEstPartItem) {
    return (rep.approve_part ?? this.repairEstPartDS.is4X(rep.rep_damage_repair)) ? (rep.approve_hour ?? rep.hour) : 0;
  }

  displayApproveCost(rep: RepairEstPartItem) {
    return this.parse2Decimal((rep.approve_part ?? this.repairEstPartDS.is4X(rep.rep_damage_repair)) ? (rep.approve_cost ?? rep.material_cost) : 0);
  }
}