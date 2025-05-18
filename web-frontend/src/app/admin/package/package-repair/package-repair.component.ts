import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { CleaningCategoryItem } from 'app/data-sources/cleaning-category';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { CustomerCompanyCleaningCategoryItem } from 'app/data-sources/customer-company-category';
import { PackageDepotItem } from 'app/data-sources/package-depot';
import { PackageRepairDS, PackageRepairItem } from 'app/data-sources/package-repair';
import { TariffRepairDS, TariffRepairItem, TariffRepairLengthItem } from 'app/data-sources/tariff-repair';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { ModulePackageService } from 'app/services/module-package.service';
import { SearchCriteriaService } from 'app/services/search-criteria.service';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { debounceTime, startWith, tap } from 'rxjs';
import { FormDialogComponent_Edit_Cost } from './form-dialog-edit-cost/form-dialog.component';
import { FormDialogComponent } from './form-dialog/form-dialog.component';

@Component({
  selector: 'app-package-repair',
  standalone: true,
  templateUrl: './package-repair.component.html',
  styleUrl: './package-repair.component.scss',
  imports: [
    BreadcrumbComponent,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatCheckboxModule,
    FeatherIconsComponent,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatPaginatorModule,
    TranslateModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    MatDividerModule,
    PreventNonNumericDirective,
    MatChipsModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})

export class PackageRepairComponent extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  displayedColumns = [
    // 'select',
    // //'custCode',
    // 'custCompanyName',
    // 'PartName',
    // 'group',
    // 'subgroup',
    // 'labour_hour',
    // 'material_cost',
    // 'mobile',
    ''
  ];

  pageTitle = 'MENUITEMS.PACKAGE.LIST.PACKAGE-REPAIR'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.PACKAGE.TEXT', route: '/admin/package/package-repair' }
  ]

  minMaterialCost: number = -20;
  maxMaterialCost: number = 20;

  customerCodeControl = new UntypedFormControl();
  categoryControl = new UntypedFormControl();
  profileNameControl = new UntypedFormControl();

  lengthControl = new UntypedFormControl();
  dimensionControl = new UntypedFormControl();

  groupNameControl = new UntypedFormControl();
  subGroupNameControl = new UntypedFormControl();
  partNameControl = new UntypedFormControl();

  lengthItems: TariffRepairLengthItem[] = [];
  dimensionItems: string[] = [];

  partNameList: string[] = [];
  groupNameCvList: CodeValuesItem[] = [];
  subGroupNameCvList: CodeValuesItem[] = [];
  allSubGroupNameCvList: CodeValuesItem[] = [];
  handledItemCvList: CodeValuesItem[] = [];
  unitTypeCvList: CodeValuesItem[] = [];

  storageCalCvList: CodeValuesItem[] = [];
  CodeValuesDS: CodeValuesDS;
  trfRepairDS: TariffRepairDS;
  packRepairDS: PackageRepairDS;
  ccDS: CustomerCompanyDS;
  custCompDS: CustomerCompanyDS;


  packRepairItems: PackageRepairItem[] = [];

  custCompClnCatItems: CustomerCompanyCleaningCategoryItem[] = [];
  customer_companyList: CustomerCompanyItem[] = [];
  cleaning_categoryList?: CleaningCategoryItem[];

  pageIndex = 0;
  pageSize = 10;
  lastSearchCriteria: any;
  lastOrderBy: any = { customer_company: { code: "ASC" } };
  endCursor: string | undefined = undefined;
  previous_endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;

  searchField: string = "";
  selection = new SelectionModel<PackageDepotItem>(true, []);

  selectedCustomers: any[] = [];

  separatorKeysCodes: number[] = [ENTER, COMMA];

  id?: number;
  pcForm?: UntypedFormGroup;
  translatedLangText: any = {}
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.CARGO-DETAILS',
    HEADER_OTHER: 'COMMON-FORM.CARGO-OTHER-DETAILS',
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    CUSTOMER_COMPANY_NAME: 'COMMON-FORM.COMPANY-NAME',
    SO_NO: 'COMMON-FORM.SO-NO',
    SO_NOTES: 'COMMON-FORM.SO-NOTES',
    HAULIER: 'COMMON-FORM.HAULIER',
    ORDER_DETAILS: 'COMMON-FORM.ORDER-DETAILS',
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
    CARGO_NAME: 'COMMON-FORM.CARGO-NAME',
    CARGO_ALIAS: 'COMMON-FORM.CARGO-ALIAS',
    CARGO_DESCRIPTION: 'COMMON-FORM.CARGO-DESCRIPTION',
    CARGO_CLASS: 'COMMON-FORM.CARGO-CLASS',
    CARGO_CLASS_SELECT: 'COMMON-FORM.CARGO-CLASS-SELECT',
    CARGO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    PACKAGE_MIN_COST: 'COMMON-FORM.PACKAGE-MIN-COST',
    PACKAGE_MAX_COST: 'COMMON-FORM.PACKAGE-MAX-COST',
    PACKAGE_DETAIL: 'COMMON-FORM.PACKAGE-DETAIL',
    PACKAGE_CLEANING_ADJUSTED_COST: "COMMON-FORM.PACKAGE-CLEANING-ADJUST-COST",
    EMAIL: 'COMMON-FORM.EMAIL',
    CONTACT_NO: 'COMMON-FORM.CONTACT-NO',
    PROFILE_NAME: 'COMMON-FORM.PROFILE-NAME',
    VIEW: 'COMMON-FORM.VIEW',
    DEPOT_PROFILE: 'COMMON-FORM.DEPOT-PROFILE',
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    PREINSPECTION_COST: "COMMON-FORM.PREINSPECTION-COST",
    LOLO_COST: "COMMON-FORM.LOLO-COST",
    STORAGE_COST: "COMMON-FORM.STORAGE-COST",
    FREE_STORAGE: "COMMON-FORM.FREE-STORAGE",
    LAST_UPDATED_DT: 'COMMON-FORM.LAST-UPDATED',
    STANDARD_COST: "COMMON-FORM.STANDARD-COST",
    CUSTOMER_COST: "COMMON-FORM.CUSTOMER-COST",
    STORAGE_CALCULATE_BY: "COMMON-FORM.STORAGE-CALCULATE-BY",
    COST: 'COMMON-FORM.COST',
    LAST_UPDATED: "COMMON-FORM.LAST-UPDATED",
    GROUP: "COMMON-FORM.GROUP",
    SUB_GROUP: "COMMON-FORM.SUB-GROUP",
    PART_NAME: "COMMON-FORM.PART-NAME",
    MIN_COST: "COMMON-FORM.MIN-COST",
    MAX_COST: "COMMON-FORM.MAX-COST",
    LENGTH: "COMMON-FORM.LENGTH",
    MIN_LENGTH: "COMMON-FORM.MIN-LENGTH",
    MAX_LENGTH: "COMMON-FORM.MAX-LENGTH",
    MIN_LABOUR: "COMMON-FORM.MIN-LABOUR",
    MAX_LABOUR: "COMMON-FORM.MAX-LABOUR",
    HANDLED_ITEM: "COMMON-FORM.HANDLED-ITEM",
    LABOUR_HOUR: "COMMON-FORM.LABOUR-HOUR",
    MATERIAL_COST: "COMMON-FORM.MATERIAL-COST",
    MATERIAL_COST$: "COMMON-FORM.MATERIAL-COST$",
    DIMENSION: "COMMON-FORM.DIMENSION",
    CONFIRM_RESET: 'COMMON-FORM.CONFIRM-RESET',
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    ALIAS_NAME: 'COMMON-FORM.ALIAS-NAME',
    EXPORT: 'COMMON-FORM.EXPORT',
    SEARCH: 'COMMON-FORM.SEARCH',
    CUSTOMERS_SELECTED: 'COMMON-FORM.CUSTOMERS-SELECTED',
  }

  @ViewChild('custInput', { static: true })
  custInput?: ElementRef<HTMLInputElement>;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    // public advanceTableService: AdvanceTableService,
    private snackBar: MatSnackBar,
    private searchCriteriaService: SearchCriteriaService,
    private translate: TranslateService,
    public modulePackageService: ModulePackageService

  ) {
    super();
    this.initPcForm();
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.trfRepairDS = new TariffRepairDS(this.apollo);
    this.packRepairDS = new PackageRepairDS(this.apollo);
    this.custCompDS = new CustomerCompanyDS(this.apollo);
    this.CodeValuesDS = new CodeValuesDS(this.apollo);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.initializeValueChange();
    this.initializeFilterCustomerCompany();
    this.loadData();
    this.displayColumnChanged();
    this.translateLangText();
    //this.search();
  }

  initPcForm() {
    this.pcForm = this.fb.group({
      customer_code: this.customerCodeControl,
      part_name: this.partNameControl,
      group_name_cv: this.groupNameControl,
      sub_group_name_cv: this.subGroupNameControl,
      labour_hour: [''],
      material_cost: [''],
      handled_item_cv: ['']
    });
  }

  displayColumnChanged() {
    if (this.getPackages()) {
      this.displayedColumns = [
        'select',
        'custCompanyName',
        'PartName',
        'group',
        'subgroup',
        'labour_hour',
        'material_cost',
        'last_update',
      ];
    } else {
      this.displayedColumns = [
        'custCompanyName',
        'PartName',
        'group',
        'subgroup',
        'labour_hour',
        'material_cost',
        'last_update',
      ];
    }
  };

  getPackages(): boolean {
    if (this.modulePackageService.isGrowthPackage() || this.modulePackageService.isCustomizedPackage())
      return true;
    else
      return false;
  }

  initializeFilterCustomerCompany() {
    this.pcForm!.get('customer_code')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (typeof value === 'string') {
          searchCriteria = value;
        } else {
          searchCriteria = value.code;
        }
        this.searchCustomerCompanyList(searchCriteria);
        // this.subs.sink = this.ccDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
        //   this.customer_companyList = data
        // });
      })
    ).subscribe();


  }


  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
  }

  displayPartNameFn(pn: string): string {
    return pn;
  }

  refresh() {
    this.loadData();
  }
  addNew() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

  }
  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }


  preventDefault(event: Event) {
    event.preventDefault(); // Prevents the form submission
  }


  adjustCost() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    //if(this.selection.isEmpty()) return;
    const dialogRef = this.dialog.open(FormDialogComponent_Edit_Cost, {
      width: '80vw',
      // height: '80vh',
      data: {
        action: 'update',
        langText: this.langText,
        selectedItems: this.selection.selected
      },
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result > 0) {
        //if(result.selectedValue>0)
        // {
        this.handleSaveSuccess(result);
        if (this.packRepairItems.length > 1)
          this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
        //}
      }
    });
  }

  editCallSelection() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    if (this.selection.isEmpty()) return;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '65vw',
      //height: '80vh',
      data: {
        action: 'update',
        langText: this.langText,
        selectedItems: this.selection.selected
      },
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result > 0) {
        //if(result.selectedValue>0)
        // {
        this.handleSaveSuccess(result);
        if (this.packRepairItems.length > 1)
          this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
        //}
      }
    });
  }

  editCall(row: PackageRepairItem) {
    // this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    var rows: PackageRepairItem[] = [];
    rows.push(row);
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '65vw',
      //height: '80vh',
      data: {
        action: 'update',
        langText: this.langText,
        selectedItems: rows
      },
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result > 0) {
        this.handleSaveSuccess(result);
        if (this.packRepairItems.length > 1)
          this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
      }
    });
  }

  deleteItem(row: any) {

  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.packRepairItems.length;
    return numSelected === numRows;
  }

  isSelected(option: any): boolean {
    return this.customerCodeControl.value.includes(option);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.packRepairItems.forEach((row) =>
        this.selection.select(row)
      );
  }

  search() {
    const where: any = {
      customer_company: { delete_dt: { eq: null } }
    };

    if (this.selectedCustomers.length > 0) {
      var custGuids = this.selectedCustomers.map(c => c.guid);
      where.customer_company_guid = { in: custGuids };
    }

    if (this.groupNameControl.value?.code_val) {

      const cdValues: CodeValuesItem[] = [this.groupNameControl.value];
      var codes = cdValues.map(cc => cc.code_val);
      where.tariff_repair = where.tariff_repair || {};
      where.tariff_repair.group_name_cv = { in: codes };

    }

    if (this.subGroupNameControl.value?.code_val) {

      const cdValues: CodeValuesItem[] = [this.subGroupNameControl.value];
      var codes = cdValues.map(cc => cc.code_val);
      where.tariff_repair = where.tariff_repair || {};
      where.tariff_repair.subgroup_name_cv = { in: codes };

    }

    if (this.pcForm!.value["part_name"]) {
      const description: Text = this.pcForm!.value["part_name"];
      where.tariff_repair = where.tariff_repair || {};
      where.tariff_repair.part_name = { contains: description }
    }

    // Handling material_cost
    if (this.pcForm!.value["material_cost"]) {
      const selectedCost: number = Number(this.pcForm!.value["material_cost"]);
      where.material_cost = { eq: selectedCost }
    }
    // if (this.pcForm!.value["min_cost"] && this.pcForm!.value["max_cost"]) {
    //   const minCost: number = Number(this.pcForm!.value["min_cost"]);
    //   const maxCost: number = Number(this.pcForm!.value["max_cost"]);
    //   where.material_cost = { gte: minCost, lte: maxCost };
    // } else if (this.pcForm!.value["min_cost"]) {
    //   const minCost: number = Number(this.pcForm!.value["min_cost"]);
    //   where.material_cost = { gte: minCost };
    // } else if (this.pcForm!.value["max_cost"]) {
    //   const maxCost: number = Number(this.pcForm!.value["max_cost"]);
    //   where.material_cost = { lte: maxCost };
    // }

    const unifiedConditions: any[] = [];

    // // Handling Dimension
    // if (this.pcForm!.value["dimension"]) {
    //   let dimensionConditions: any = {};
    //   let selectedTarifRepairDimensionItems: string[] = this.pcForm!.value["dimension"];

    //   // Initialize tariff_repair if it doesn't exist
    //   where.tariff_repair = where.tariff_repair || {};
    //   where.tariff_repair.and = where.tariff_repair.and || [];

    //   dimensionConditions.or = [];
    //   selectedTarifRepairDimensionItems.forEach((item) => {
    //     const condition: any = {};

    //     // Only add condition if item is defined (non-undefined)
    //     if (item !== undefined && item !== null && item !== '') {
    //       condition.dimension = { eq: item };
    //     }

    //     if (Object.keys(condition).length > 0) {
    //       dimensionConditions.or.push(condition);
    //     }
    //   });

    //   // Push condition to 'and' if it has valid properties
    //   if (dimensionConditions.or.length > 0) {
    //     where.tariff_repair.and.push(dimensionConditions);
    //   }
    // }

    // // Handling Length
    // if (this.pcForm!.value["len"]) {
    //   let selectedTarifRepairLengthItems: TariffRepairLengthItem[] = this.pcForm!.value["len"];

    //   // Initialize tariff_repair if it doesn't exist
    //   where.tariff_repair = where.tariff_repair || {};
    //   where.tariff_repair.and = where.tariff_repair.and || [];

    //   const lengthConditions: any = {};
    //   lengthConditions.or = [];
    //   selectedTarifRepairLengthItems.forEach((item) => {
    //     const condition: any = {};

    //     // Add condition for length if defined
    //     if (item.length !== undefined) {
    //       condition.length = { eq: item.length };
    //     }

    //     // Add condition for length_unit_cv if it exists
    //     if (item.length_unit_cv) {
    //       condition.length_unit_cv = { eq: item.length_unit_cv };
    //     }

    //     // Push condition to 'or' if it has valid properties
    //     if (Object.keys(condition).length > 0) {
    //       lengthConditions.or.push(condition);
    //     }
    //   });

    //   // Push length conditions to 'and' if it has valid properties
    //   if (lengthConditions.or.length > 0) {
    //     where.tariff_repair.and.push(lengthConditions);
    //   }
    // }

    // // Handling length
    // if (this.pcForm!.value["min_len"] && this.pcForm!.value["max_len"]) {
    //   const minLen: number = Number(this.pcForm!.value["min_len"]);
    //   const maxLen: number = Number(this.pcForm!.value["max_len"]);
    //   where.tariff_repair = where.tariff_repair || {};
    //   where.tariff_repair.length = { gte: minLen, lte: maxLen };
    // } else if (this.pcForm!.value["min_len"]) {
    //   const minLen: number = Number(this.pcForm!.value["min_len"]);
    //   where.tariff_repair = where.tariff_repair || {};
    //   where.tariff_repair.length = { gte: minLen };
    // } else if (this.pcForm!.value["max_len"]) {
    //   const maxLen: number = Number(this.pcForm!.value["max_len"]);
    //   where.tariff_repair = where.tariff_repair || {};
    //   where.tariff_repair.length = { lte: maxLen };
    // }

    // // Handling labour_hour
    if (this.pcForm!.value["labour_hour"]) {
      const selectedHour: number = Number(this.pcForm!.value["labour_hour"]);
      where.labour_hour = { eq: selectedHour }
    }
    // if (this.pcForm!.value["min_labour"] && this.pcForm!.value["max_labour"]) {
    //   const minLabour: number = Number(this.pcForm!.value["min_labour"]);
    //   const maxLabour: number = Number(this.pcForm!.value["max_labour"]);
    //   where.tariff_repair = where.tariff_repair || {};
    //   where.tariff_repair.labour_hour = { gte: minLabour, lte: maxLabour };
    // } else if (this.pcForm!.value["min_labour"]) {
    //   const minLabour: number = Number(this.pcForm!.value["min_labour"]);
    //   where.tariff_repair = where.tariff_repair || {};
    //   where.tariff_repair.labour_hour = { gte: minLabour };
    // } else if (this.pcForm!.value["max_labour"]) {
    //   const maxLabour: number = Number(this.pcForm!.value["max_labour"]);
    //   where.tariff_repair = where.tariff_repair || {};
    //   where.tariff_repair.labour_hour = { lte: maxLabour };
    // }

    this.lastSearchCriteria = where;
    this.subs.sink = this.packRepairDS.SearchPackageRepair(where, this.lastOrderBy, this.pageSize).subscribe(data => {
      this.packRepairItems = data;
      // data[0].storage_cal_cv
      this.previous_endCursor = undefined;
      this.endCursor = this.packRepairDS.pageInfo?.endCursor;
      this.startCursor = this.packRepairDS.pageInfo?.startCursor;
      this.hasNextPage = this.packRepairDS.pageInfo?.hasNextPage ?? false;
      this.hasPreviousPage = this.packRepairDS.pageInfo?.hasPreviousPage ?? false;
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
      this.selection.clear();
      if (!this.hasPreviousPage)
        this.previous_endCursor = undefined;
    });
  }

  selectStorageCalculateCV_Description(valCode?: string): string {
    let valCodeObject: CodeValuesItem = new CodeValuesItem();
    if (this.storageCalCvList.length > 0) {
      valCodeObject = this.storageCalCvList.find((d: CodeValuesItem) => d.code_val === valCode) || new CodeValuesItem();

      // If no match is found, description will be undefined, so you can handle it accordingly

    }
    return valCodeObject.description || '-';

  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.langText.SAVE_SUCCESS;
      this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
        successMsg = res;
        ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
      });
    }
  }

  onPageEvent(event: PageEvent) {
    const { pageIndex, pageSize, previousPageIndex } = event;
    let first: number | undefined = undefined;
    let after: string | undefined = undefined;
    let last: number | undefined = undefined;
    let before: string | undefined = undefined;
    let order: any | undefined = this.lastOrderBy;
    // Check if the page size has changed
    if (this.pageSize !== pageSize) {
      // Reset pagination if page size has changed
      this.pageIndex = 0;
      this.pageSize = pageSize;
      first = pageSize;
      after = undefined;
      last = undefined;
      before = undefined;
    } else {
      //if (pageIndex > this.pageIndex && this.hasNextPage) {
      if (pageIndex > this.pageIndex) {
        // Navigate forward
        first = pageSize;
        after = this.endCursor;
      } else if (pageIndex < this.pageIndex && this.hasPreviousPage) {
        // Navigate backward
        last = pageSize;
        before = this.startCursor;
      }
      else if (pageIndex == this.pageIndex) {

        first = pageSize;
        after = this.previous_endCursor;


        //this.paginator.pageIndex=this.pageIndex;

      }
    }

    this.searchData(this.lastSearchCriteria, order, first, after, last, before, pageIndex, previousPageIndex);
    //}
  }

  searchData(where: any, order: any, first: any, after: any, last: any, before: any, pageIndex: number,
    previousPageIndex?: number) {
    this.previous_endCursor = this.endCursor;
    this.subs.sink = this.packRepairDS.SearchPackageRepair(where, order, first, after, last, before).subscribe(data => {
      this.packRepairItems = data;
      this.endCursor = this.packRepairDS.pageInfo?.endCursor;
      this.startCursor = this.packRepairDS.pageInfo?.startCursor;
      this.hasNextPage = this.packRepairDS.pageInfo?.hasNextPage ?? false;
      this.hasPreviousPage = this.packRepairDS.pageInfo?.hasPreviousPage ?? false;
      this.pageIndex = pageIndex;
      this.paginator.pageIndex = this.pageIndex;
      this.selection.clear();
      if (!this.hasPreviousPage)
        this.previous_endCursor = undefined;
    });
  }

  storeSearchCriteria(where: any, order: any, first: any, after: any, last: any, before: any, pageIndex: number,
    previousPageIndex?: number, length?: number, hasNextPage?: boolean, hasPreviousPage?: boolean) {
    const sCriteria: any = {};
    sCriteria.where = where;
    sCriteria.order = order;
    sCriteria.first = first;
    sCriteria.after = after;
    sCriteria.last = last;
    sCriteria.before = before;
    sCriteria.pageIndex = pageIndex;
    sCriteria.previousPageIndex = previousPageIndex;
    sCriteria.length = length;
    sCriteria.hasNextPage = hasNextPage;
    sCriteria.hasPreviousPage = hasPreviousPage;

    this.searchCriteriaService.setCriteria(sCriteria);
  }

  removeSelectedRows() {

  }
  public loadData() {
    this.trfRepairDS.searchDistinctLength(undefined, undefined).subscribe(data => {
      this.lengthItems = data;
    });

    this.trfRepairDS.searchDistinctDimension(undefined).subscribe(data => {
      this.dimensionItems = data;
    });

    this.subs.sink = this.ccDS.loadItems({}, { code: 'ASC' }).subscribe(data => {
    });

    const queries = [
      { alias: 'groupName', codeValType: 'GROUP_NAME' },
      //    { alias: 'subGroupName', codeValType: 'SUB_GROUP_NAME' },
      { alias: 'handledItem', codeValType: 'HANDLED_ITEM' },
      { alias: 'unitType', codeValType: 'UNIT_TYPE' }
    ];
    this.CodeValuesDS?.getCodeValuesByType(queries);
    this.CodeValuesDS?.connectAlias('groupName').subscribe(data => {
      this.groupNameCvList = this.sortByDescription(data);

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
        this.CodeValuesDS?.getCodeValuesByType(subqueries)
        subqueries.map(s => {
          this.CodeValuesDS?.connectAlias(s.alias).subscribe(data => {
            data = this.sortByDescription(data)
            this.allSubGroupNameCvList.push(...data);
          });
        });
      }
    });
    // this.CodeValuesDS?.connectAlias('subGroupName').subscribe(data => {
    //   this.subGroupNameCvList = this.sortByDescription(data);
    // });
    this.CodeValuesDS?.connectAlias('handledItem').subscribe(data => {

      this.handledItemCvList = addDefaultSelectOption(data, 'All');
    });
    this.CodeValuesDS.connectAlias('unitType').subscribe(data => {
      this.unitTypeCvList = data;
    });
    //this.search();
  }

  sortByDescription<T extends { description?: string }>(list: T[]): T[] {
    return [...list].sort((a, b) => (a.description || '').localeCompare(b.description || ''));
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  // export table data in excel file
  exportExcel() {
    // key name with space add in brackets
    // const exportData: Partial<TableElement>[] =
    //   this.dataSource.filteredData.map((x) => ({
    //     'First Name': x.fName,
    //     'Last Name': x.lName,
    //     Email: x.email,
    //     Gender: x.gender,
    //     'Birth Date': formatDate(new Date(x.bDate), 'yyyy-MM-dd', 'en') || '',
    //     Mobile: x.mobile,
    //     Address: x.address,
    //     Country: x.country,
    //   }));

    // TableExportUtil.exportToExcel(exportData, 'excel');
  }

  // context menu
  onContextMenu(event: MouseEvent, item: any) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    if (this.contextMenu !== undefined && this.contextMenu.menu !== null) {
      this.contextMenu.menuData = { item: item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }

  onlyNumbersDashValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const regex = /^[0-9-]*$/;
    if (control.value && !regex.test(control.value)) {
      return { 'invalidCharacter': true };
    }
    return null;
  }

  displayGroupNameCodeValue_Description(codeValue: String) {
    return this.GetCodeValue_Description(codeValue, this.groupNameCvList);
  }

  displaySubGroupNameCodeValue_Description(codeValue: String) {
    return this.GetCodeValue_Description(codeValue, this.subGroupNameCvList);
  }

  getTariffRepairAlias(row: TariffRepairItem) {
    const alias = `${this.trfRepairDS.displayRepairAlias(row)} ${this.getUnitTypeDescription(row.length_unit_cv)}`;
    return alias;
  }

  getUnitTypeDescription(codeVal: string | undefined): string | undefined {
    return this.CodeValuesDS.getCodeDescription(codeVal, this.unitTypeCvList);
  }

  GetCodeValue_Description(codeValue: String, codeValueItems: CodeValuesItem[]) {
    let retval: string = '';
    const foundItem = codeValueItems.find(item => item.code_val === codeValue);
    if (foundItem) {
      retval = foundItem.description || '';
    }
    return retval;
  }

  displayLastUpdated(r: PackageRepairItem) {
    var updatedt = r.update_dt;
    if (updatedt === null) {
      updatedt = r.create_dt;
    }
    return this.displayDate(updatedt);

  }


  displayDate(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input);
  }

  resetDialog(event: Event) {
    event.preventDefault(); // Prevents the form submission

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    this.resetForm();
    this.search();
    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   data: {
    //     headerText: this.translatedLangText.CONFIRM_RESET,
    //     action: 'new',
    //   },
    //   direction: tempDirection
    // });
    // this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    //   if (result.action === 'confirmed') {
    //     this.resetForm();
    //   }
    // });
  }

  resetForm() {
    this.customerCodeControl.reset('');
    this.partNameControl.reset('');
    this.groupNameControl.reset('');
    this.subGroupNameControl.reset('');
    this.pcForm?.get('labour_hour')?.reset('');
    this.pcForm?.get('material_cost')?.reset('');
    this.pcForm?.get('handled_item_cv')?.reset('');
    this.selectedCustomers = [];
  }

  initializeValueChange() {
    // this.groupNameControl.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(300),
    //   tap(value => {
    //     this.trfRepairDS.searchDistinctPartName(undefined, undefined, value).subscribe(data => {
    //       this.partNameList = data
    //     });
    //   })
    // ).subscribe();

    this.pcForm?.get('group_name_cv')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        const subgroupName = this.pcForm?.get('sub_group_name_cv');
        if (value) {

          if (value.child_code) {
            this.subGroupNameCvList = this.allSubGroupNameCvList.filter((sgcv: CodeValuesItem) => sgcv.code_val_type === value.child_code)
            if ((this.subGroupNameCvList?.length ?? 0) > 1) {
              this.subGroupNameCvList = addDefaultSelectOption(this.subGroupNameCvList, 'All', '');
              subgroupName?.enable();
            } else {
              subgroupName?.disable();
            }
          } else {
            subgroupName?.setValue('');
            subgroupName?.disable();
          }
        } else {
          subgroupName?.disable();
        }
      })
    ).subscribe();



    this.pcForm?.get('sub_group_name_cv')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        const groupName = this.pcForm?.get('group_name_cv')?.value;
        const partName = this.pcForm?.get('part_name');
        if (groupName) {
          this.trfRepairDS.searchDistinctPartName(groupName.code_val, value?.code_val || '').subscribe(data => {
            this.partNameList = data;
            partName?.setValue('');
          });
        }
      })
    ).subscribe();
  }


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our fruit
    if ((value || '').trim()) {
      //this.fruits.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.customerCodeControl.setValue(null);
  }

  remove(cust: any): void {
    const index = this.selectedCustomers.findIndex(c => c.code === cust.code);
    if (index >= 0) {
      this.selectedCustomers.splice(index, 1);

    }
  }

  // displayCustomerCompanyFn(customer: any): string {
  //   if (!customer) return '';
  //   return this.selectedCustomers.map(c => ccDS.displayName(c)).join(', ');
  // }

  private updateFormControl(): void {
    // this.pcForm?.get('customer_code')?.setValue(this.selectedCustomers);
  }

  searchCustomerCompanyList(searchCriteria: string) {
    this.subs.sink = this.ccDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
      if (this.custInput?.nativeElement.value === searchCriteria) {
        this.customer_companyList = data;
      }
    });
  }

  itemSelected(row: CustomerCompanyItem): boolean {
    var retval: boolean = false;
    const index = this.selectedCustomers.findIndex(c => c.code === row.code);
    retval = (index >= 0);
    return retval;
  }




  getSelectedCustomersDisplay(): string {
    var retval: string = "";
    if (this.selectedCustomers?.length > 1) {
      retval = `${this.selectedCustomers.length} ${this.translatedLangText.CUSTOMERS_SELECTED}`;
    }
    else if (this.selectedCustomers?.length == 1) {
      retval = `${this.selectedCustomers[0].name}`
    }
    return retval;
  }

  removeAllSelectedCustomers(): void {
    this.selectedCustomers = [];
  }


  selected(event: MatAutocompleteSelectedEvent): void {
    const customer = event.option.value;
    const index = this.selectedCustomers.findIndex(c => c.code === customer.code);
    if (!(index >= 0)) {
      this.selectedCustomers.push(customer);
      this.search();
    }
    else {
      this.selectedCustomers.splice(index, 1);
      this.search();
    }

    if (this.custInput) {
      this.searchCustomerCompanyList('');
      this.custInput.nativeElement.value = '';

    }
    // this.updateFormControl();
    //this.customerCodeControl.setValue(null);
    //this.pcForm?.patchValue({ customer_code: null });
  }

  onCheckboxClicked(row: CustomerCompanyItem) {
    const fakeEvent = { option: { value: row } } as MatAutocompleteSelectedEvent;
    this.selected(fakeEvent);

  }

}
// export function addDefaultSelectOption(list: CodeValuesItem[], desc: string = '-- Select --', val: string = ''): CodeValuesItem[] {
//   // Check if the list already contains the default value
//   const containsDefault = list.some(item => item.code_val === val);

//   // If the default value is not present, add it to the list
//   if (!containsDefault) {
//     // Create a new array with the default option added at the beginning
//     return [{ code_val: val, description: desc }, ...list];
//   }

//   return list;
// }
