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
import { RepairPartDS, RepairPartItem } from 'app/data-sources/repair-part';
import { TlxFormFieldComponent } from '@shared/components/tlx-form/tlx-form-field/tlx-form-field.component';
import { PackageLabourDS, PackageLabourItem } from 'app/data-sources/package-labour';
import { RepairDS, RepairGO, RepairItem } from 'app/data-sources/repair';
import { MasterEstimateTemplateDS, MasterTemplateItem } from 'app/data-sources/master-template';
import { RPDamageRepairItem } from 'app/data-sources/rp-damage-repair';
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
export class RepairEstimateNewComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
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
    DUPLICATE_PART_DETECTED: 'COMMON-FORM.DUPLICATE-PART-DETECTED'
  }

  clean_statusList: CodeValuesItem[] = [];

  sot_guid?: string | null;
  repair_guid?: string | null;

  repairForm?: UntypedFormGroup;
  sotForm?: UntypedFormGroup;

  sotItem?: StoringOrderTankItem;
  repairItem?: RepairItem;
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

  customerCodeControl = new UntypedFormControl();

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

  isDuplicate = false;

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
    this.repairForm = this.fb.group({
      guid: [''],
      est_template: [''],
      is_default_template: [''],
      remarks: [''],
      surveyor_id: [''],
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
      repList: ['']
    });
  }

  initializeValueChanges() {
    this.repairForm?.get('est_template')?.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        if (value) {
          console.log(value);
          if (this.getCustomer()?.def_template_guid) {
            this.repairForm?.get('is_default_template')?.setValue(this.getCustomer()?.def_template_guid === value.guid);
          }
          // estimate
          this.repairForm?.get('labour_cost_discount')?.setValue(value.labour_cost_discount);
          this.repairForm?.get('material_cost_discount')?.setValue(value.labour_cost_discount);
          this.repairForm?.get('remarks')?.setValue(value.remarks);
          const repList: RepairPartItem[] = this.filterDeleted(value.template_est_part).map((tep: any) => {
            const package_repair = tep.tariff_repair?.package_repair;
            let material_cost = 0;
            if (package_repair?.length) {
              material_cost = package_repair[0].material_cost
            }
            const tep_damage_repair = this.filterDeleted(tep.tep_damage_repair).map((item: any) => {
              return new RPDamageRepairItem({
                code_cv: item.code_cv,
                code_type: item.code_type,
                action: 'new'
              });
            })
            return new RepairPartItem({
              repair_guid: this.repair_guid || undefined,
              description: tep.description,
              hour: !this.repairPartDS.is4X(tep_damage_repair) ? tep.hour : 0,
              location_cv: tep.location_cv,
              comment: tep.comment,
              quantity: !this.repairPartDS.is4X(tep_damage_repair) ? tep.quantity : 0,
              remarks: tep.remarks,
              material_cost: material_cost,
              tariff_repair_guid: tep.tariff_repair_guid,
              tariff_repair: tep.tariff_repair,
              rp_damage_repair: tep_damage_repair,
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

          //     const repList: RepairPartItem[] = value.template_est_part.map((tep: any) => {
          //       const tep_damage_repair = tep.tep_damage_repair.map((item: any) => {
          //         return new RPDamageRepairItem({
          //           guid: item.guid,
          //           rp_guid: item.rp_guid,
          //           code_cv: item.code_cv,
          //           code_type: item.code_type,
          //           action: 'new'
          //         });
          //       })

          //       return new RepairPartItem({
          //         description: tep.description,
          //         hour: tep.hour,
          //         location_cv: tep.location_cv,
          //         quantity: tep.quantity,
          //         remarks: tep.remarks,
          //         material_cost: material_cost,
          //         tariff_repair_guid: tep.tariff_repair_guid,
          //         tariff_repair: tep.tariff_repair,
          //         rp_damage_repair: tep_damage_repair,
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

    this.repairForm?.get('labour_cost_discount')?.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        this.calculateCost();
      })
    ).subscribe();

    this.repairForm?.get('material_cost_discount')?.valueChanges.pipe(
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

    this.getSurveyorList();

    this.sot_guid = this.route.snapshot.paramMap.get('id');
    this.repair_guid = this.route.snapshot.paramMap.get('repair_id');

    this.route.data.subscribe(routeData => {
      this.isDuplicate = routeData['action'] === 'duplicate';
      if (this.sot_guid) {
        this.subs.sink = this.sotDS.getStoringOrderTankByIDForRepair(this.sot_guid).subscribe(data => {
          if (this.sotDS.totalCount > 0) {
            this.sotItem = data[0];
            this.populateRepair(this.sotItem.repair, this.isDuplicate);
            console.log("Customer company: " + this.sotItem.storing_order?.customer_company_guid);
            this.getCustomerLabourPackage(this.sotItem.storing_order?.customer_company_guid!);
            this.getTemplateList(this.sotItem.storing_order?.customer_company_guid!);
          }
        });
      }
    });
  }

  populateRepair(repair: RepairItem[] | undefined, isDuplicate: boolean) {
    if (this.isDuplicate) {
      if (this.repair_guid) {
        this.repairDS.getRepairByID(this.repair_guid, this.sotItem?.storing_order?.customer_company_guid!).subscribe(data => {
          if (this.repairDS.totalCount > 0) {
            const found = data;
            if (found?.length) {
              this.populateFoundRepair(found[0]!, isDuplicate);
            }
          }
        });
      }
    } else {
      if (repair?.length) {
        const found = repair.filter(x => x.guid === this.repair_guid);
        if (found?.length) {
          this.populateFoundRepair(found[0]!, isDuplicate);
        }
      }
    }
  }

  populateFoundRepair(repair: RepairItem, isDuplicate: boolean) {
    this.repairItem = isDuplicate ? new RepairItem() : repair;
    this.isOwner = !isDuplicate ? (repair!.owner_enable ?? false) : false;
    this.repairItem!.repair_part = this.filterDeleted(repair!.repair_part).map((rep: any) => {
      if (isDuplicate) {
        const package_repair = rep.tariff_repair?.package_repair;
        let material_cost = rep.material_cost;
        if (isDuplicate && package_repair?.length) {
          material_cost = package_repair[0].material_cost;
        }

        const rp_damage_repair = this.filterDeleted(rep.rp_damage_repair).map((rp_d_r: any) => {
          rp_d_r.guid = undefined;
          rp_d_r.action = 'new';
          return rp_d_r;
        });

        return {
          ...rep,
          rp_damage_repair: rp_damage_repair,
          material_cost: material_cost,
          guid: null,
          repair_guid: null,
          action: 'new'
        };
      }

      return rep;
    });
    this.updateData(this.repairItem!.repair_part);
    this.repairForm?.patchValue({
      guid: !isDuplicate ? this.repairItem!.guid : '',
      remarks: this.repairItem!.remarks,
      surveyor_id: this.repairItem!.aspnetusers_guid,
      labour_cost_discount: this.repairItem!.labour_cost_discount,
      material_cost_discount: this.repairItem!.material_cost_discount
    });

    const isEditable = this.repairDS.canAmend(this.repairItem);
    this.repairForm?.get('surveyor_id')?.[isEditable ? 'enable' : 'disable']();
    this.repairForm?.get('labour_cost_discount')?.[isEditable ? 'enable' : 'disable']();
    this.repairForm?.get('material_cost_discount')?.[isEditable ? 'enable' : 'disable']();
    this.repairForm?.get('remarks')?.[isEditable ? 'enable' : 'disable']();
    this.repairForm?.get('')?.[isEditable ? 'enable' : 'disable']();
    this.repairForm?.get('')?.[isEditable ? 'enable' : 'disable']();
    this.repairForm?.get('')?.[isEditable ? 'enable' : 'disable']();
    this.repairForm?.get('')?.[isEditable ? 'enable' : 'disable']();
    this.repairForm?.get('')?.[isEditable ? 'enable' : 'disable']();
    this.repairForm?.get('')?.[isEditable ? 'enable' : 'disable']();
    this.repairForm?.get('')?.[isEditable ? 'enable' : 'disable']();
    this.repairForm?.get('')?.[isEditable ? 'enable' : 'disable']();
    this.repairForm?.get('')?.[isEditable ? 'enable' : 'disable']();
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
        if (!this.repair_guid) {
          if (def_guid) {
            this.repairForm?.get('is_default_template')?.setValue(true);
          }

          const def_template = this.templateList.find(x =>
            def_guid ? x.guid === def_guid : x.type_cv === 'GENERAL'
          );

          if (def_guid !== def_template?.guid) {
            this.getCustomer()!.def_template_guid = def_guid;
            this.repairForm?.get('is_default_template')?.setValue(true);
          }

          this.repairForm?.get('est_template')?.setValue(def_template);
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

  addEstDetails(event: Event, row?: RepairPartItem) {
    this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const addSot = row ?? new RepairPartItem();
    addSot.repair_guid = addSot.repair_guid;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '1000px',
      data: {
        repair: this.repairItem,
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
        customer_company_guid: this.sotItem?.storing_order?.customer_company_guid,
        existedPart: this.repList
      },
      direction: tempDirection
    });
    dialogRef.componentInstance.dataSubject.subscribe((result) => {
      this.addRepairPart(result)
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addRepairPart(result)
      }
    });
  }

  editEstDetails(event: Event, row: RepairPartItem, index: number) {
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
        repair: this.repairItem,
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
        customer_company_guid: this.sotItem?.storing_order?.customer_company_guid,
        existedPart: this.repList
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

  deleteItem(event: Event, row: RepairPartItem, index: number) {
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

  addRepairPart(result: any) {
    const data = [...this.repList];
    const newItem = new RepairPartItem({
      ...result.item,
    });
    data.push(newItem);

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
    this.repairForm!.get('repList')?.setErrors(null);
    if (this.repairForm?.valid) {
      if (!this.repList.length) {
        this.repairForm.get('repList')?.setErrors({ required: true });
      } else {
        let re: RepairItem = new RepairGO(this.repairItem);

        const rep: RepairPartItem[] = this.repList.map((item: any) => {
          // Ensure action is an array and take the last action only
          const rp_damage_repair = item.rp_damage_repair.map((item: any) => {
            return new RPDamageRepairItem({
              guid: item.guid,
              rp_guid: item.rp_guid,
              code_cv: item.code_cv,
              code_type: item.code_type,
              action: item.action
            });
          });

          console.log(item)
          return new RepairPartItem({
            ...item,
            tariff_repair: undefined,
            rp_damage_repair: rp_damage_repair,
            action: (!item.guid || item.action === 'new') ? 'new' : (item.action === 'cancel' ? 'cancel' : 'edit')
          });
        });
        re.repair_part = rep;
        re.sot_guid = this.sotItem?.guid;
        re.aspnetusers_guid = this.repairForm.get('surveyor_id')?.value;
        re.labour_cost_discount = Utility.convertNumber(this.repairForm.get('labour_cost_discount')?.value);
        re.material_cost_discount = Utility.convertNumber(this.repairForm.get('material_cost_discount')?.value);
        re.labour_cost = this.getLabourCost();
        re.total_hour = Utility.convertNumber(this.repairForm.get('total_hour')?.value, 2);
        re.total_cost = Utility.convertNumber(this.repairForm.get('net_cost')?.value, 2);
        re.remarks = this.repairForm.get('remarks')?.value;
        re.owner_enable = this.isOwner;
        re.job_no = re.job_no ?? this.sotItem?.job_no;

        let cc: any = undefined;
        if (this.repairForm?.get('is_default_template')?.value && this.repairForm.get('est_template')?.value?.guid) {
          cc = this.getCustomer();
          cc!.def_template_guid = this.repairForm.get('est_template')?.value?.guid;
          cc = new CustomerCompanyGO({ ...cc });
          console.log(cc);
        }

        // remove the object
        re.aspnetsuser = undefined;

        console.log(re);
        if (re.guid) {
          this.repairDS.updateRepair(re, cc).subscribe(result => {
            console.log(result)
            this.handleSaveSuccess(result?.data?.updateRepair);
          });
        } else {
          this.repairDS.addRepair(re, cc).subscribe(result => {
            console.log(result)
            this.handleSaveSuccess(result?.data?.addRepair);
          });
        }
      }
    } else {
      console.log('Invalid repairForm', this.repairForm?.value);
    }
  }

  updateData(newData: RepairPartItem[] | undefined): void {
    if (newData?.length) {
      newData = newData.map((row) => ({
        ...row,
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
    }
  }

  handleDelete(event: Event, row: any, index: number): void {
    this.deleteItem(event, row, index);
  }

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

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      ComponentUtil.showNotification('snackbar-success', this.translatedLangText.SAVE_SUCCESS, 'top', 'center', this.snackBar);
      this.router.navigate(['/admin/repair/estimate']);
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

    this.repairForm?.get('total_owner_hour')?.setValue(total_owner_hour.toFixed(2));
    this.repairForm?.get('total_owner_labour_cost')?.setValue(total_owner_labour_cost.toFixed(2));
    this.repairForm?.get('total_owner_mat_cost')?.setValue(total_owner_mat_cost.toFixed(2));
    this.repairForm?.get('total_owner_cost')?.setValue(total_owner_cost.toFixed(2));
    this.repairForm?.get('discount_labour_owner_cost')?.setValue(discount_labour_owner_cost.toFixed(2));
    this.repairForm?.get('discount_mat_owner_cost')?.setValue(discount_mat_owner_cost.toFixed(2));
    this.repairForm?.get('net_owner_cost')?.setValue(net_owner_cost.toFixed(2));

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

    this.repairForm?.get('total_lessee_hour')?.setValue(total_lessee_hour.toFixed(2));
    this.repairForm?.get('total_lessee_labour_cost')?.setValue(total_lessee_labour_cost.toFixed(2));
    this.repairForm?.get('total_lessee_mat_cost')?.setValue(total_lessee_mat_cost.toFixed(2));
    this.repairForm?.get('total_lessee_cost')?.setValue(total_lessee_cost.toFixed(2));
    this.repairForm?.get('discount_labour_lessee_cost')?.setValue(discount_labour_lessee_cost.toFixed(2));
    this.repairForm?.get('discount_mat_lessee_cost')?.setValue(discount_mat_lessee_cost.toFixed(2));
    this.repairForm?.get('net_lessee_cost')?.setValue(net_lessee_cost.toFixed(2));

    total_hour += total_lessee_hour;
    total_labour_cost += total_lessee_labour_cost;
    total_mat_cost += total_lessee_mat_cost;
    total_cost += total_lessee_cost;
    discount_labour_cost += discount_labour_lessee_cost;
    discount_mat_cost += discount_mat_lessee_cost;
    net_cost += net_lessee_cost;

    this.repairForm?.get('total_hour')?.setValue(total_hour.toFixed(2));
    this.repairForm?.get('total_labour_cost')?.setValue(total_labour_cost.toFixed(2));
    this.repairForm?.get('total_mat_cost')?.setValue(total_mat_cost.toFixed(2));
    this.repairForm?.get('total_cost')?.setValue(total_cost.toFixed(2));
    this.repairForm?.get('discount_labour_cost')?.setValue(discount_labour_cost.toFixed(2));
    this.repairForm?.get('discount_mat_cost')?.setValue(discount_mat_cost.toFixed(2));
    this.repairForm?.get('net_cost')?.setValue(net_cost.toFixed(2));
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
    return this.repairItem?.labour_cost || this.packageLabourItem?.cost;
  }

  hasMenuItems(row: any): boolean {
    return (
      this.repairDS.canAmend(this.repairItem)
    );
  }
}