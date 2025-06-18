import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { CleaningCategoryItem } from 'app/data-sources/cleaning-category';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { CustomerCompanyCleaningCategoryItem } from 'app/data-sources/customer-company-category';
import { MasterEstimateTemplateDS, MasterTemplateItem, TemplateEstPartItem } from 'app/data-sources/master-template';
import { ModulePackageService } from 'app/services/module-package.service';
import { SearchCriteriaService, SearchStateService } from 'app/services/search-criteria.service';
import { ComponentUtil } from 'app/utilities/component-util';
import { pageSizeInfo, Utility } from 'app/utilities/utility';
import { debounceTime, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'app-package-repair',
  standalone: true,
  templateUrl: './estimate-template.component.html',
  styleUrl: './estimate-template.component.scss',
  imports: [
    BreadcrumbComponent,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
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
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    MatDividerModule,
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})

export class EstimateTemplateComponent extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  displayedColumns = [
    'template',
    'type',
    'last_update_dt',
  ];

  pageTitle = 'MENUITEMS.MASTER.LIST.ESTIMATE-TEMPLATE'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.MASTER.TEXT', route: '/admin/master/estimate-template' }
  ]

  translatedLangText: any = {}
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    CUSTOMER_COMPANY_NAME: 'COMMON-FORM.COMPANY-NAME',
    REPAIR: 'COMMON-FORM.REPAIR',
    REMARKS: 'COMMON-FORM.REMARKS',
    SO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    STATUS: 'COMMON-FORM.STATUS',
    UPDATE: 'COMMON-FORM.UPDATE',
    CANCEL: 'COMMON-FORM.CANCEL',
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
    BULK: 'COMMON-FORM.BULK',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    UNDO: 'COMMON-FORM.UNDO',
    CARGO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
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
    GROUP_NAME: "COMMON-FORM.GROUP-NAME",
    SUB_GROUP_NAME: "COMMON-FORM.SUB-GROUP-NAME",
    PART_NAME: "COMMON-FORM.PART-NAME",
    MIN_COST: "COMMON-FORM.MIN-COST",
    MAX_COST: "COMMON-FORM.MAX-COST",
    LENGTH: "COMMON-FORM.LENGTH",
    HANDLED_ITEM: "COMMON-FORM.HANDLED-ITEM",
    LABOUR_HOUR: "COMMON-FORM.LABOUR-HOUR",
    MATERIAL_COST: "COMMON-FORM.MATERIAL-COST",
    DIMENSION: "COMMON-FORM.DIMENSION",
    TEMPLATE: "COMMON-FORM.TEMPLATE",
    TYPE: "COMMON-FORM.TYPE",
    TEMPLATE_TYPE_GENERAL: "COMMON-FORM.TEMPLATE-TYPE-GENERAL",
    TEMPLATE_TYPE_EXCLUSIVE: "COMMON-FORM.TEMPLATE-TYPE-EXCLUSIVE",
    TOTAL_MATERIAL_COST: "COMMON-FORM.TOTAL-MATERIAL-COST",
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
    EXPORT: 'COMMON-FORM.EXPORT',
    ADD: 'COMMON-FORM.ADD',
    REFRESH: 'COMMON-FORM.REFRESH',
    SEARCH: 'COMMON-FORM.SEARCH',
  }

  customerCodeControl = new UntypedFormControl();
  templateNameControl = new UntypedFormControl();
  // template_type_cv = new UntypedFormControl();
  CodeValuesDS?: CodeValuesDS;
  masterEstTempDS: MasterEstimateTemplateDS;
  ccDS: CustomerCompanyDS;
  custCompDS: CustomerCompanyDS;

  masterTemplateItem: MasterTemplateItem[] = [];
  masterTempItemOnly: MasterTemplateItem[] = [];
  templateTypeItemCvList: CodeValuesItem[] = [];

  custCompClnCatItems: CustomerCompanyCleaningCategoryItem[] = [];
  customer_companyList: CustomerCompanyItem[] = [];
  cleaning_categoryList?: CleaningCategoryItem[];

  pageStateType = 'EstimateTemplate'
  pageIndex = 0;
  pageSize = pageSizeInfo.defaultSize;
  lastSearchCriteria: any;
  lastOrderBy: any = { template_name: "ASC" };
  endCursor: string | undefined = undefined;
  previous_endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;

  searchField: string = "";
  selection = new SelectionModel<MasterTemplateItem>(true, []);

  id?: number;
  mtForm?: UntypedFormGroup;

  constructor(
    private router: Router,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private snackBar: MatSnackBar,
    private searchStateService: SearchStateService,
    private translate: TranslateService,
    public modulePackageService: ModulePackageService
  ) {
    super();
    this.initMtForm();
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.masterEstTempDS = new MasterEstimateTemplateDS(this.apollo);
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
    this.searchStateService.clearOtherPages(this.pageStateType);
    this.loadData();
    this.translateLangText();
    this.initializeFilterCustomerCompany();
    // var state = history.state;
    // if (state.type == "estimate-template") {
    //   let showResult = state.pagination.showResult;
    //   if (showResult) {
    //     this.searchCriteriaService = state.pagination.where;
    //     this.pageIndex = state.pagination.pageIndex;
    //     this.pageSize = state.pagination.pageSize;
    //     this.hasPreviousPage = state.pagination.hasPreviousPage;
    //     this.startCursor = state.pagination.startCursor;
    //     this.endCursor = state.pagination.endCursor;
    //     this.previous_endCursor = state.pagination.previous_endCursor;
    //     this.paginator.pageSize = this.pageSize;
    //     this.paginator.pageIndex = this.pageIndex;
    //     this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
    //   }
    // }
    // else {
    //   this.search();
    // }
  }

  initMtForm() {
    this.mtForm = this.fb.group({
      customer_code: this.customerCodeControl,
      template_name: this.templateNameControl,
      part_name: [''],
      template_type_cv: ['']
    });
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} - ${cc.name}` : '';
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

  addCallSelection(event: Event) {
    event.stopPropagation(); // Stop the click event from propagating
    // Navigate to the route and pass the JSON object
    this.router.navigate(['/admin/master/estimate-template/new/ '], {
      state: {
        id: '',
        type: 'estimate-template',
        pagination: {
          where: this.lastSearchCriteria,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          hasPreviousPage: this.hasPreviousPage,
          startCursor: this.startCursor,
          endCursor: this.endCursor,
          previous_endCursor: this.previous_endCursor,

          showResult: this.masterEstTempDS.totalCount > 0

        }
      }
    });
  }

  editCall(row: TemplateEstPartItem) {
    // Navigate to the route and pass the JSON object
    this.router.navigate(['/admin/master/estimate-template/new/' + row.guid], {
      state: {
        id: row.guid,
        type: 'estimate-template',
        selectedRow: row,
        pagination: {
          where: this.lastSearchCriteria,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          hasPreviousPage: this.hasPreviousPage,
          startCursor: this.startCursor,
          endCursor: this.endCursor,
          previous_endCursor: this.previous_endCursor,
          showResult: this.masterEstTempDS.totalCount > 0
        }
      }
    });
  }

  initializeFilterCustomerCompany() {
    this.mtForm!.get('customer_code')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (typeof value === 'string') {
          searchCriteria = value;
        } else {
          searchCriteria = value.code;
        }
        this.subs.sink = this.ccDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
          this.customer_companyList = data
        });
      })
    ).subscribe();
  }

  deleteItem(row: any) {
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.masterTemplateItem.length;
    return numSelected === numRows;
  }

  isSelected(option: any): boolean {
    return this.customerCodeControl.value.includes(option);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.masterTemplateItem.forEach((row) =>
        this.selection.select(row)
      );
  }

  constructSearchCriteria() {
    const where: any = {};
    if (this.customerCodeControl.value) {
      {
        const customerCode: CustomerCompanyItem = this.customerCodeControl.value;
        //var guids = customerCodes.map(cc => cc.guid);
        where.template_est_customer = where.template_est_customer || {};
        where.template_est_customer = { some: { customer_company_guid: { eq: customerCode.guid } } };
      }
      // if (this.customerCodeControl.value.length > 0) {


      //   const customerCodes: CustomerCompanyItem[] = this.customerCodeControl.value;
      //   var guids = customerCodes.map(cc => cc.guid);
      //   where.template_est_customer = where.template_est_customer || {};
      //   where.template_est_customer = { some: { customer_company_guid: { in: guids } } };
      // }
    }

    if (this.templateNameControl.value) {
      if (this.templateNameControl.value.length > 0) {
        const template_names: string[] = this.templateNameControl.value;
        where.template_name = { in: template_names };
      }
    }

    if (this.mtForm?.get('template_type_cv')?.value) {
      const template_type = this.mtForm?.get('template_type_cv')?.value;
      where.type_cv = { eq: template_type };
    }

    if (this.mtForm?.get('part_name')?.value) {
      const partNameValue = this.mtForm.get('part_name')?.value;
      where.template_est_part = {
        ...where.template_est_part,
        some: {
          description: { contains: partNameValue }
        }
      };
    }

    this.lastSearchCriteria = where;
  }

  search() {
    this.constructSearchCriteria();
    this.performSearch(this.pageSize, this.pageIndex, this.pageSize, undefined, undefined, undefined);
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string) {
    this.searchStateService.setCriteria(this.pageStateType, this.mtForm?.value);
    this.searchStateService.setPagination(this.pageStateType, {
      pageSize,
      pageIndex,
      first,
      after,
      last,
      before
    });
    console.log(this.searchStateService.getPagination(this.pageStateType))
    this.subs.sink = this.masterEstTempDS.SearchEstimateTemplate(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {
        this.masterTemplateItem = data;
        this.previous_endCursor = undefined;
        this.endCursor = this.masterEstTempDS.pageInfo?.endCursor;
        this.startCursor = this.masterEstTempDS.pageInfo?.startCursor;
        this.hasNextPage = this.masterEstTempDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPage = this.masterEstTempDS.pageInfo?.hasPreviousPage ?? false;
        this.selection.clear();
        if (!this.hasPreviousPage)
          this.previous_endCursor = undefined;
      });

    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
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
      } else if (pageIndex == this.pageIndex) {
        first = pageSize;
        after = this.previous_endCursor;
      }
    }

    this.performSearch(pageSize, pageIndex, first, after, last, before);
  }

  removeSelectedRows() {

  }

  public loadData() {
    this.subs.sink = this.ccDS.loadItems({}, { code: 'ASC' }, 50).subscribe(data => {
      // this.customer_companyList1 = data
    });

    this.masterEstTempDS.SearchEstimateTemplateOnly({}, { template_name: 'ASC' }).subscribe(data => {
      this.masterTempItemOnly = data;
    });

    const queries = [
      { alias: 'templateType', codeValType: 'EST_TEMPLATE_TYPE' }
    ];
    this.CodeValuesDS?.getCodeValuesByType(queries);
    this.CodeValuesDS?.connectAlias('templateType').subscribe(data => {
      this.templateTypeItemCvList = addDefaultSelectOption(data, 'All');
    });

    const savedCriteria = this.searchStateService.getCriteria(this.pageStateType);
    const savedPagination = this.searchStateService.getPagination(this.pageStateType);

    if (savedCriteria) {
      this.mtForm?.patchValue(savedCriteria);
      this.constructSearchCriteria();
    }

    if (savedPagination) {
      this.pageIndex = savedPagination.pageIndex;
      this.pageSize = savedPagination.pageSize;

      this.performSearch(
        savedPagination.pageSize,
        savedPagination.pageIndex,
        savedPagination.first,
        savedPagination.after,
        savedPagination.last,
        savedPagination.before
      );
    }

    if (!savedCriteria && !savedPagination) {
      this.search();
    }
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

  GetCodeValue_Description(codeValue: String, codeValueItems: CodeValuesItem[]) {
    let retval: string = '';
    const foundItem = codeValueItems.find(item => item.code_val === codeValue);
    if (foundItem) {
      retval = foundItem.description || '';
    }

    return retval;
  }

  displayDate(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input);
  }

  displayLastUpdated(r: MasterTemplateItem) {
    var updatedt = r.update_dt;
    if (updatedt === null) {
      updatedt = r.create_dt;
    }
    return this.displayDate(updatedt);
  }

  displayTemplateType(r: MasterTemplateItem) {
    let tempType = `${this.translatedLangText.TEMPLATE_TYPE_GENERAL}`;
    if (r.type_cv?.toUpperCase() == "EXCLUSIVE") {
      tempType = this.translatedLangText.TEMPLATE_TYPE_EXCLUSIVE
    }
    return tempType;
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
    this.initMtForm();
    this.customerCodeControl.reset('');
    this.templateNameControl.reset('');
    //this.template_type_cv.reset('');
  }
}