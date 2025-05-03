import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
import { Utility } from 'app/utilities/utility';
import { MatDividerModule } from '@angular/material/divider';
import { Apollo } from 'apollo-angular';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyItem } from 'app/data-sources/customer-company';
import { CleaningCategoryItem } from 'app/data-sources/cleaning-category';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { CustomerCompanyCleaningCategoryItem } from 'app/data-sources/customer-company-category';
import { TariffLabourItem } from 'app/data-sources/tariff-labour';
import { TariffRepairDS, TariffRepairItem, TariffRepairLengthItem } from 'app/data-sources/tariff-repair';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { SearchCriteriaService } from 'app/services/search-criteria.service';
import { ComponentUtil } from 'app/utilities/component-util';
import { FormDialogComponent_Edit_Cost } from './form-dialog-edit-cost/form-dialog.component';
import { FormDialogComponent_Edit } from './form-dialog-edit/form-dialog.component';
import { FormDialogComponent_New } from './form-dialog-new/form-dialog.component';

@Component({
  selector: 'app-tariff-repair',
  standalone: true,
  templateUrl: './tariff-repair.component.html',
  styleUrl: './tariff-repair.component.scss',
  imports: [
    BreadcrumbComponent,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatCheckboxModule,
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
    MatOptionModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    MatDividerModule,
    PreventNonNumericDirective
  ]
})
export class TariffRepairComponent extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  displayedColumns = [
    'select',
    'fName',
    'gname',
    'subgroup',
    'hour',
    'bDate',
    'last_date',
    //'handle',
    'actions',
  ];

  pageTitle = 'MENUITEMS.TARIFF.LIST.TARIFF-REPAIR'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.TARIFF.TEXT', route: '/admin/tariff/tariff-repair' }
  ]

  // ccDS: CustomerCompanyDS;
  // clnCatDS:CleaningCategoryDS;
  // custCompClnCatDS :CustomerCompanyCleaningCategoryDS;
  trfRepairDS: TariffRepairDS;
  cvDS: CodeValuesDS;
  trfRepairItems: TariffRepairItem[] = [];

  custCompClnCatItems: CustomerCompanyCleaningCategoryItem[] = [];
  customer_companyList1?: CustomerCompanyItem[];
  cleaning_categoryList?: CleaningCategoryItem[];

  groupNameCvList: CodeValuesItem[] = [];
  subGroupNameCvList: CodeValuesItem[] = [];
  handledItemCvList: CodeValuesItem[] = [];
  unitTypeCvList: CodeValuesItem[] = [];

  lengthItems: TariffRepairLengthItem[] = [];
  dimensionItems: string[] = [];

  pageIndex = 0;
  pageSize = 10;
  lastSearchCriteria: any;
  lastOrderBy: any = { tariff_repair: { part_name: "ASC" } };
  endCursor: string | undefined = undefined;
  previous_endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;

  selection = new SelectionModel<TariffRepairItem>(true, []);

  id?: number;
  pcForm?: UntypedFormGroup;
  translatedLangText: any = {}
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.CARGO-DETAILS',
    HEADER_OTHER: 'COMMON-FORM.CARGO-OTHER-DETAILS',
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
    CARGO_UN_NO: 'COMMON-FORM.CARGO-UN-NO',
    CARGO_METHOD: 'COMMON-FORM.CARGO-METHOD',
    CARGO_CATEGORY: 'COMMON-FORM.CARGO-CATEGORY',
    CARGO_FLASH_POINT: 'COMMON-FORM.CARGO-FLASH-POINT',
    CARGO_COST: 'COMMON-FORM.CARGO-COST',
    CARGO_HAZARD_LEVEL: 'COMMON-FORM.CARGO-HAZARD-LEVEL',
    CARGO_BAN_TYPE: 'COMMON-FORM.CARGO-BAN-TYPE',
    CARGO_NATURE: 'COMMON-FORM.CARGO-NATURE',
    CARGO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    CARGO_NOTE: 'COMMON-FORM.CARGO-NOTE',
    PACKAGE_MIN_COST: 'COMMON-FORM.PACKAGE-MIN-COST',
    PACKAGE_MAX_COST: 'COMMON-FORM.PACKAGE-MAX-COST',
    PACKAGE_DETAIL: 'COMMON-FORM.PACKAGE-DETAIL',
    PACKAGE_CLEANING_ADJUSTED_COST: "COMMON-FORM.PACKAGE-CLEANING-ADJUST-COST",
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    COST: 'COMMON-FORM.COST',
    LAST_UPDATED: "COMMON-FORM.LAST-UPDATED",
    GROUP_NAME: "COMMON-FORM.GROUP",
    SUB_GROUP_NAME: "COMMON-FORM.SUB-GROUP",
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
    DIMENSION: "COMMON-FORM.DIMENSION",
    MATERIAL_COST$: "COMMON-FORM.MATERIAL-COST$",
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    SEARCH: 'COMMON-FORM.SEARCH',
    ADD: 'COMMON-FORM.ADD',
  }

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private snackBar: MatSnackBar,
    private searchCriteriaService: SearchCriteriaService,
    private translate: TranslateService

  ) {
    super();
    this.initPcForm();
    // this.ccDS = new CustomerCompanyDS(this.apollo);
    // this.clnCatDS= new CleaningCategoryDS(this.apollo);
    // this.custCompClnCatDS=new CustomerCompanyCleaningCategoryDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.trfRepairDS = new TariffRepairDS(this.apollo);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.loadData();
    this.translateLangText();
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  initPcForm() {
    this.pcForm = this.fb.group({
      group_name_cv: [''],
      sub_group_name_cv: [''],
      len: [''],
      dimension: [''],
      part_name: [''],
      min_len: [''],
      max_len: [''],
      min_labour: [''],
      max_labour: [''],
      min_cost: [''],
      max_cost: [''],
      handled_item_cv: ['']
    });
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
  }

  refresh() {
    this.loadData();
  }

  dupCall(row: TariffRepairItem) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent_New, {
      width: '65vw',
      //height: '90vh',
      data: {
        action: 'duplicate',
        langText: this.langText,
        selectedItem: row
      }
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result > 0) {
        this.handleSaveSuccess(result);
        if (this.trfRepairDS.totalCount > 0) {
          this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
        }
      }
    });
  }

  addCall() {
    // this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    //  var rows :CustomerCompanyCleaningCategoryItem[] =[] ;
    //  rows.push(row);
    const dialogRef = this.dialog.open(FormDialogComponent_New, {
      width: '65vw',
      //height: '90vh',
      data: {
        action: 'new',
        langText: this.langText,
        selectedItem: null
      }
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result > 0) {
        this.handleSaveSuccess(result);
        if (this.trfRepairDS.totalCount > 0) {
          this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
          //this.search();
          // this.onPageEvent({pageIndex:this.pageIndex,pageSize:this.pageSize,length:this.pageSize});
        }
      }
    });
  }

  displayGroupNameCodeValue_Description(codeValue: String) {
    return this.GetCodeValue_Description(codeValue, this.groupNameCvList);
  }

  displaySubGroupNameCodeValue_Description(codeValue: String) {
    return this.GetCodeValue_Description(codeValue, this.subGroupNameCvList);
  }

  GetCodeValue_Description(codeValue: String, codeValueItems: CodeValuesItem[]) {
    let retval: string = '';
    const foundItem = codeValueItems.find(item => item.code_val === codeValue);
    if (foundItem) {
      retval = foundItem.description || '';
    }

    return retval;
  }

  displayLastUpdated(r: TariffLabourItem) {
    var updatedt = r.update_dt;
    if (updatedt === null) {
      updatedt = r.create_dt;
    }
    return this.displayDate(updatedt);
  }

  displayDate(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input);
  }

  adjustCost() {
    // if(this.selection.selected.length==0) return;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent_Edit_Cost, {
      width: '65vw',
      //height: '90vh',
      data: {
        action: 'new',
        langText: this.langText,
        selectedItems: this.selection.selected
      }
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result > 0) {
        this.handleSaveSuccess(result);
        this.search();
      }
    });
  }

  editCallSelection() {
    if (this.selection.selected.length == 0) return;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent_Edit, {
      width: '65vw',
      //height: '1000px',
      data: {
        action: 'new',
        langText: this.langText,
        selectedItems: this.selection.selected
      }
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result > 0) {
        this.handleSaveSuccess(result);
        this.search();
      }
    });
  }

  editCall(row: TariffRepairItem) {
    // this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    var rows: TariffRepairItem[] = [];
    rows.push(row);
    const dialogRef = this.dialog.open(FormDialogComponent_Edit, {
      width: '65vw',
      //height: '1000px',
      //height: '90vh',
      data: {
        action: 'edit',
        langText: this.langText,
        selectedItems: rows
      }

    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.handleSaveSuccess(result);
        if (this.trfRepairDS.totalCount > 0) {
          this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
        }
      }
    });
  }

  cancelItem(row: TariffRepairItem) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        headerText: this.translatedLangText.ARE_U_SURE_DELETE,
        act: "warn"
      },
      direction: tempDirection
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.action == "confirmed") {
        this.deleteTariffAndPackageRepair(row.guid!);
      }
    });
  }

  deleteTariffAndPackageRepair(tariffRepairGuid: string) {
    this.trfRepairDS.deleteTariffRepair([tariffRepairGuid]).subscribe(d => {
      let count = d.data.deleteTariffRepair;
      if (count > 0) {
        this.handleSaveSuccess(count);
        this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
      }
    });
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.trfRepairItems.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.trfRepairItems.forEach((row) =>
        this.selection.select(row)
      );
  }

  search() {
    const where: any = {
      and: [
        {
          tariff_repair: {
            delete_dt: {
              eq: null
            }
          }
        }
      ]
    };

    if (this.pcForm!.get('group_name_cv')?.value) {
      if (this.pcForm!.get('group_name_cv')?.value?.length > 0) {
        const cdValues: string[] = this.pcForm!.get('group_name_cv')?.value;
        // where.group_name_cv = { in: cdValues };
        const tariff_repair: any = { group_name_cv: { in: cdValues } }
        where.and.push({ tariff_repair: tariff_repair })
      }
    }

    if (this.pcForm!.get('sub_group_name_cv')?.value) {
      if (this.pcForm!.get('sub_group_name_cv')?.value?.length > 0) {
        const cdValues: CodeValuesItem[] = this.pcForm!.get('sub_group_name_cv')?.value;
        // where.subgroup_name_cv = { in: cdValues };
        const tariff_repair: any = { subgroup_name_cv: { in: cdValues } }
        where.and.push({ tariff_repair: tariff_repair })
      }
    }

    if (this.pcForm!.value["part_name"]) {
      const description: Text = this.pcForm!.value["part_name"];
      // where.part_name = { contains: description }
      const tariff_repair: any = { part_name: { contains: description } }
      where.and.push({ tariff_repair: tariff_repair })
    }

    if (this.pcForm!.value["handled_item_cv"]) {
      const handled = this.pcForm!.value["handled_item_cv"];
      // where.part_name = { contains: description }
      if (handled === 'HANDLED') {
        where.and.push({ tank_count: { gt: 0 } })
      } else if (handled === 'NON_HANDLE') {
        where.and.push({ tank_count: { lte: 0 } })
      }
    }

    // // Handling material_cost
    // if (this.pcForm!.value["min_cost"] && this.pcForm!.value["max_cost"]) {
    //   const minCost: number = Number(this.pcForm!.value["min_cost"]);
    //   const maxCost: number = Number(this.pcForm!.value["max_cost"]);
    //   // where.material_cost = { gte: minCost, lte: maxCost };
    //   const tariff_repair: any = { material_cost: { gte: minCost, lte: maxCost } }
    //   where.and.push({ tariff_repair: tariff_repair })
    // } else if (this.pcForm!.value["min_cost"]) {
    //   const minCost: number = Number(this.pcForm!.value["min_cost"]);
    //   // where.material_cost = { gte: minCost };
    //   const tariff_repair: any = { material_cost: { gte: minCost } }
    //   where.and.push({ tariff_repair: tariff_repair })
    // } else if (this.pcForm!.value["max_cost"]) {
    //   const maxCost: number = Number(this.pcForm!.value["max_cost"]);
    //   // where.material_cost = { lte: maxCost };
    //   const tariff_repair: any = { material_cost: { lte: maxCost } }
    //   where.and.push({ tariff_repair: tariff_repair })
    // }

    // Handling Dimension
    // if (this.pcForm!.value["dimension"]) {
    //   let dimensionConditions: any = {};
    //   let selectedTarifRepairDimensionItems: string[] = this.pcForm!.value["dimension"];

    //   // Initialize tariff_repair if it doesn't exist
    //   where.and = where.and || [];
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
    //     // where.and.push(dimensionConditions);
    //     const tariff_repair: any = { or: dimensionConditions }
    //     where.and.push({ tariff_repair: tariff_repair })
    //   }
    // }

    // Handling Length
    // if (this.pcForm!.value["len"]) {
    //   let selectedTarifRepairLengthItems: TariffRepairLengthItem[] = this.pcForm!.value["len"];

    //   // Initialize tariff_repair if it doesn't exist
    //   //  where.tariff_repair = where.tariff_repair || {};
    //   where.and = where.and || [];

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
    //     where.and.push(lengthConditions);
    //   }
    // }

    // // Handling length
    // if (this.pcForm!.value["min_len"] && this.pcForm!.value["max_len"]) {
    //   const minLen: number = Number(this.pcForm!.value["min_len"]);
    //   const maxLen: number = Number(this.pcForm!.value["max_len"]);
    //   where.length = { gte: minLen, lte: maxLen };
    // } else if (this.pcForm!.value["min_len"]) {
    //   const minLen: number = Number(this.pcForm!.value["min_len"]);
    //   where.length = { gte: minLen };
    // } else if (this.pcForm!.value["max_len"]) {
    //   const maxLen: number = Number(this.pcForm!.value["max_len"]);
    //   where.length = { lte: maxLen };
    // }

    // // Handling labour_hour
    // if (this.pcForm!.value["min_labour"] && this.pcForm!.value["max_labour"]) {
    //   const minLabour: number = Number(this.pcForm!.value["min_labour"]);
    //   const maxLabour: number = Number(this.pcForm!.value["max_labour"]);
    //   where.labour_hour = { gte: minLabour, lte: maxLabour };
    // } else if (this.pcForm!.value["min_labour"]) {
    //   const minLabour: number = Number(this.pcForm!.value["min_labour"]);
    //   where.labour_hour = { gte: minLabour };
    // } else if (this.pcForm!.value["max_labour"]) {
    //   const maxLabour: number = Number(this.pcForm!.value["max_labour"]);
    //   where.labour_hour = { lte: maxLabour };
    // }
    this.lastSearchCriteria = where;
    // this.subs.sink = this.trfRepairDS.SearchTariffRepair(where, this.lastOrderBy, this.pageSize).subscribe(data => {
    //   this.trfRepairItems = data;
    //   this.previous_endCursor = undefined;
    //   this.endCursor = this.trfRepairDS.pageInfo?.endCursor;
    //   this.startCursor = this.trfRepairDS.pageInfo?.startCursor;
    //   this.hasNextPage = this.trfRepairDS.pageInfo?.hasNextPage ?? false;
    //   this.hasPreviousPage = this.trfRepairDS.pageInfo?.hasPreviousPage ?? false;
    //   this.pageIndex = 0;
    //   this.paginator.pageIndex = 0;
    //   this.selection.clear();
    //   if (!this.hasPreviousPage)
    //     this.previous_endCursor = undefined;
    // });
    this.subs.sink = this.trfRepairDS.SearchTariffRepairWithCount(where, this.lastOrderBy, this.pageSize).subscribe(data => {
      this.trfRepairItems = data;
      this.previous_endCursor = undefined;
      this.endCursor = this.trfRepairDS.pageInfo?.endCursor;
      this.startCursor = this.trfRepairDS.pageInfo?.startCursor;
      this.hasNextPage = this.trfRepairDS.pageInfo?.hasNextPage ?? false;
      this.hasPreviousPage = this.trfRepairDS.pageInfo?.hasPreviousPage ?? false;
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
      this.selection.clear();
      if (!this.hasPreviousPage)
        this.previous_endCursor = undefined;
    });
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.langText.SAVE_SUCCESS;
      this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
        successMsg = res;
        ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
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
      if (pageIndex > this.pageIndex && this.hasNextPage) {
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
      }
    }

    this.searchData(this.lastSearchCriteria, order, first, after, last, before, pageIndex, previousPageIndex);
    //}
  }

  searchData(where: any, order: any, first: any, after: any, last: any, before: any, pageIndex: number,
    previousPageIndex?: number) {
    this.previous_endCursor = after;
    this.subs.sink = this.trfRepairDS.SearchTariffRepairWithCount(where, order, first, after, last, before).subscribe(data => {
      this.trfRepairItems = data;
      this.endCursor = this.trfRepairDS.pageInfo?.endCursor;
      this.startCursor = this.trfRepairDS.pageInfo?.startCursor;
      this.hasNextPage = this.trfRepairDS.pageInfo?.hasNextPage ?? false;
      this.hasPreviousPage = this.trfRepairDS.pageInfo?.hasPreviousPage ?? false;
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
    // const totalSelect = this.selection.selected.length;
    // this.selection.selected.forEach((item) => {
    //   const index: number = this.dataSource.renderedData.findIndex(
    //     (d) => d === item
    //   );
    //   // console.log(this.dataSource.renderedData.findIndex((d) => d === item));
    //   this.exampleDatabase?.dataChange.value.splice(index, 1);
    //   this.refreshTable();
    //   this.selection = new SelectionModel<AdvanceTable>(true, []);
    // });
    // this.showNotification(
    //   'snackbar-danger',
    //   totalSelect + ' Record Delete Successfully...!!!',
    //   'bottom',
    //   'center'
    // );
  }
  public loadData() {

    this.trfRepairDS.searchDistinctLength(undefined, undefined).subscribe(data => {
      this.lengthItems = data;
    });

    this.trfRepairDS.searchDistinctDimension(undefined).subscribe(data => {
      this.dimensionItems = data;
    });

    const queries = [
      { alias: 'groupName', codeValType: 'GROUP_NAME' },
      //    { alias: 'subGroupName', codeValType: 'SUB_GROUP_NAME' },
      { alias: 'handledItem', codeValType: 'HANDLED_ITEM' },
      { alias: 'unitType', codeValType: 'UNIT_TYPE' }
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('groupName').subscribe(data => {
      this.groupNameCvList = this.sortByDescription(data);
      const subqueries: any[] = [];
      data.map(d => {

        if (d?.child_code) {
          let q = { alias: d.child_code, codeValType: d.child_code };
          const hasMatch = subqueries.some(subquery => subquery.codeValType === d.child_code);
          if (!hasMatch) {
            subqueries.push(q);
          }
        }
      });
      if (subqueries.length > 0) {
        this.cvDS.getCodeValuesByType(subqueries)
        subqueries.map(s => {
          this.cvDS.connectAlias(s.alias).subscribe(data => {
            this.subGroupNameCvList.push(...this.sortByDescription(data));
          });
        });
      }
      // this.hazardLevelCvList = addDefaultSelectOption(this.soStatusCvList, 'All');
    });
    this.cvDS.connectAlias('subGroupName').subscribe(data => {
      this.subGroupNameCvList = this.sortByDescription(data);
    });
    this.cvDS.connectAlias('handledItem').subscribe(data => {
      this.handledItemCvList = addDefaultSelectOption(data, 'All');
    });
    this.cvDS.connectAlias('unitType').subscribe(data => {
      this.unitTypeCvList = data;
    });
    this.search();
  }

  sortByDescription<T extends { description?: string }>(list: T[]): T[] {
    return [...list].sort((a, b) => (a.description || '').localeCompare(b.description || ''));
  }

  getTariffRepairAlias(row: TariffRepairItem) {
    const alias = `${this.trfRepairDS.displayRepairAlias(row)} ${this.getUnitTypeDescription(row.length_unit_cv)}`;
    return alias;
  }

  getUnitTypeDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.unitTypeCvList);
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
    this.preventDefault(event);
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

  resetDialog(event: Event) {
    this.preventDefault(event); // Prevents the form submission

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
    this.initPcForm();

    //this.customerCodeControl.reset('');
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
}