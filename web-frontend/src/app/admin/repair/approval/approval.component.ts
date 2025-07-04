import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem, addDefaultSelectOption } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { RepairDS, RepairItem } from 'app/data-sources/repair';
import { StoringOrderDS, StoringOrderGO, StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { ModulePackageService } from 'app/services/module-package.service';
import { SearchStateService } from 'app/services/search-criteria.service';
import { ComponentUtil } from 'app/utilities/component-util';
import { pageSizeInfo, Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { CancelFormDialogComponent } from './dialogs/cancel-form-dialog/form-dialog.component';


@Component({
  selector: 'app-approval',
  standalone: true,
  templateUrl: './approval.component.html',
  styleUrl: './approval.component.scss',
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
    RouterLink,
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
    MatCardModule,
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class RepairApprovalComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  // displayedColumns = [
  //   'tank_no',
  //   'customer',
  //   'eir_no',
  //   'eir_dt',
  //   'last_cargo',
  //   'tank_status_cv'
  // ];

  displayedColumns = [
    'tank_no',
    'customer',
    'eir_dt',
    'estimate_no',
    'estimate_date',
    'net_cost',
    'status_cv'
  ];

  pageTitle = 'MENUITEMS.REPAIR.LIST.APPROVAL'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.REPAIR.TEXT', route: '/admin/repair/approval' }
  ]

  translatedLangText: any = {};
  langText = {
    STATUS: 'COMMON-FORM.STATUS',
    SO_NO: 'COMMON-FORM.SO-NO',
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
    EIR_DATE: 'COMMON-FORM.EIR-DATE',
    EIR_NO: 'COMMON-FORM.EIR-NO',
    PART_NAME: 'COMMON-FORM.PART-NAME',
    LAST_CARGO: 'COMMON-FORM.LAST-CARGO',
    TANK_NO: 'COMMON-FORM.TANK-NO',
    JOB_NO: 'COMMON-FORM.JOB-NO',
    PURPOSE: 'COMMON-FORM.PURPOSE',
    ETA_DATE: 'COMMON-FORM.ETA-DATE',
    NO_RESULT: 'COMMON-FORM.NO-RESULT',
    ARE_YOU_SURE_CANCEL: 'COMMON-FORM.ARE-YOU-SURE-CANCEL',
    CANCEL: 'COMMON-FORM.CANCEL',
    CLOSE: 'COMMON-FORM.CLOSE',
    TO_BE_CANCELED: 'COMMON-FORM.TO-BE-CANCELED',
    CANCELED_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    ADD: 'COMMON-FORM.ADD',
    REFRESH: 'COMMON-FORM.REFRESH',
    EXPORT: 'COMMON-FORM.EXPORT',
    REMARKS: 'COMMON-FORM.REMARKS',
    SO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    INVALID_SELECTION: 'COMMON-FORM.INVALID-SELECTION',
    ACCEPTED: 'COMMON-FORM.ACCEPTED',
    WAITING: 'COMMON-FORM.WAITING',
    CANCELED: 'COMMON-FORM.CANCELED',
    TANKS: 'COMMON-FORM.TANKS',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    BILL_COMPLETED: 'COMMON-FORM.BILL-COMPLETED',
    REPAIR_JOB_NO: 'COMMON-FORM.REPAIR-JOB-NO',
    REPAIR_TYPE: 'COMMON-FORM.REPAIR-TYPE',
    ESTIMATE_DATE: 'COMMON-FORM.ESTIMATE-DATE',
    APPROVAL_DATE: 'COMMON-FORM.APPROVAL-DATE',
    ESTIMATE_STATUS: 'COMMON-FORM.ESTIMATE-STATUS',
    CURRENT_STATUS: 'COMMON-FORM.CURRENT-STATUS',
    ESTIMATE_NO: 'COMMON-FORM.ESTIMATE-NO',
    NET_COST: 'COMMON-FORM.NET-COST',
    COST: 'COMMON-FORM.CARGO-COST',
    CONFIRM_CLEAR_ALL: 'COMMON-FORM.CONFIRM-CLEAR-ALL',
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    AMEND: 'COMMON-FORM.AMEND',
    CHANGE_REQUEST: 'COMMON-FORM.CHANGE-REQUEST',
    SEARCH: 'COMMON-FORM.SEARCH',
  }

  availableProcessStatus: string[] = [
    'APPROVED',
    'JOB_IN_PROGRESS',
    'PENDING',
    // 'COMPLETED',
    'NO_ACTION',
    //'ASSIGNED',
    //'PARTIAL_ASSIGNED',
  ]

  searchForm?: UntypedFormGroup;

  cvDS: CodeValuesDS;
  soDS: StoringOrderDS;
  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  tcDS: TariffCleaningDS;
  igDS: InGateDS;
  repairDS: RepairDS;

  repList: RepairItem[] = [];
  reSelection = new SelectionModel<RepairItem>(true, []);
  selectedItemsPerPage: { [key: number]: Set<string> } = {};
  soStatusCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  processStatusCvList: CodeValuesItem[] = [];
  repairOptionCvList: CodeValuesItem[] = [];

  customerCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  customer_companyList?: CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];

  pageStateType = 'RepairApproval'
  pageIndex = 0;
  pageSize = pageSizeInfo.defaultSize;
  lastSearchCriteria: any;
  lastOrderBy: any = { estimate_no: "DESC" };
  endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;

  // availableProcessStatus: string[] = [
  //   'PENDING',
  //   'APPROVED',
  //   'JOB_IN_PROGRESS',
  //   'COMPLETED'
  // ]

  constructor(
    private route: ActivatedRoute,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private searchStateService: SearchStateService,
    public modulePackageService: ModulePackageService,

  ) {
    super();
    this.translateLangText();
    this.initSearchForm();
    this.lastCargoControl = new UntypedFormControl('', [Validators.required, AutocompleteSelectionValidator(this.last_cargoList)]);
    this.soDS = new StoringOrderDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.repairDS = new RepairDS(this.apollo);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.initializeFilterCustomerCompany();
    this.searchStateService.clearOtherPages(this.pageStateType);
    this.loadData();
  }

  refresh() {
    this.refreshTable();
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      tank_no: [''],
      customer_code: this.customerCodeControl,
      last_cargo: this.lastCargoControl,
      eir_dt_start: [''],
      eir_dt_end: [''],
      eir_no: [''],
      repair_option_cv: [''],
      est_dt: [''],
      approval_dt_start: [''],
      approval_dt_end: [''],
      est_status_cv: ['']
    });
  }

  cancelItem(row: StoringOrderItem) {
    // this.id = row.id;
    this.cancelSelectedRows([row])
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set();
    const numSelected = selectedItems.size;
    const numRows = this.repList.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.clearPageSelection();
    } else {
      this.selectAllOnPage();
    }
  }

  /** Clear selection on the current page */
  clearPageSelection() {
    const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set();
    this.repList.forEach(row => {
      this.reSelection.deselect(row);
      selectedItems.delete(row.guid!);
    });
    this.selectedItemsPerPage[this.pageIndex] = selectedItems;
  }

  /** Select all items on the current page */
  selectAllOnPage() {
    const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set();
    this.repList.forEach(row => {
      this.reSelection.select(row);
      selectedItems.add(row.guid!);
    });
    this.selectedItemsPerPage[this.pageIndex] = selectedItems;
  }

  /** Handle row selection */
  toggleRow(row: RepairItem) {
    this.reSelection.toggle(row);
    const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set();
    if (this.reSelection.isSelected(row)) {
      selectedItems.add(row.guid!);
    } else {
      selectedItems.delete(row.guid!);
    }
    this.selectedItemsPerPage[this.pageIndex] = selectedItems;
  }

  /** Update selection for the current page */
  updatePageSelection() {
    this.reSelection.clear();
    const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set();
    this.repList.forEach(row => {
      if (selectedItems.has(row.guid!)) {
        this.reSelection.select(row);
      }
    });
  }

  cancelSelectedRows(row: StoringOrderItem[]) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(CancelFormDialogComponent, {
      data: {
        item: [...row],
        langText: this.langText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const so = result.item.map((item: StoringOrderItem) => new StoringOrderGO(item));
        this.soDS.cancelStoringOrder(so).subscribe(result => {
          if ((result?.data?.cancelStoringOrder ?? 0) > 0) {
            let successMsg = this.langText.CANCELED_SUCCESS;
            this.translate.get(this.langText.CANCELED_SUCCESS).subscribe((res: string) => {
              successMsg = res;
              ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
              this.refreshTable();
            });
          }
        });
      }
    });
  }

  public loadData() {
    const queries = [
      { alias: 'soStatusCv', codeValType: 'SO_STATUS' },
      { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
      { alias: 'processStatusCv', codeValType: 'PROCESS_STATUS' },
      { alias: 'repairOptionCv', codeValType: 'REPAIR_OPTION' },
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('soStatusCv').subscribe(data => {
      this.soStatusCvList = addDefaultSelectOption(data, 'All');
    });
    this.cvDS.connectAlias('tankStatusCv').subscribe(data => {
      this.tankStatusCvList = data;
    });
    this.cvDS.connectAlias('processStatusCv').subscribe(data => {
      this.processStatusCvList = data;
    });
    this.cvDS.connectAlias('repairOptionCv').subscribe(data => {
      this.repairOptionCvList = data;
    });


    //  var actionId= this.route.snapshot.paramMap.get('id');
    // if(!actionId)
    {
      const savedCriteria = this.searchStateService.getCriteria(this.pageStateType);
      const savedPagination = this.searchStateService.getPagination(this.pageStateType);

      if (savedCriteria) {
        this.searchForm?.patchValue(savedCriteria);
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
    // else if(actionId==="pending")
    // {
    //     const where: any = {and:[
    //   { storing_order_tank:{ purpose_repair_cv: { in: ["OFFHIRE","REPAIR"] } }}, 
    //   { storing_order_tank:{ tank_status_cv: { eq: "REPAIR" } }},
    //   { status_cv: { in: ["PENDING"] } }
    // ]};


    //   this.lastSearchCriteria = where;
    //     this.performSearch(this.pageSize, 0, this.pageSize, undefined, undefined, undefined, () => {
    //       this.updatePageSelection();
    //     });
    //   console.log("search pending records");
    // }
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
  onContextMenu(event: MouseEvent, item: StoringOrderItem) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    if (this.contextMenu !== undefined && this.contextMenu.menu !== null) {
      this.contextMenu.menuData = { item: item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }

  constructSearchCriteria() {
    const where: any = {
      //status_cv: { in: ['PENDING', 'APPROVED'] },
    };

    if (this.searchForm!.get('tank_no')?.value || (this.searchForm!.get('eir_dt_start')?.value && this.searchForm!.get('eir_dt_end')?.value) ||
      this.searchForm!.get('repair_option_cv')?.value?.length || this.searchForm!.get('customer_code')?.value ||
      this.searchForm!.get('eir_no')?.value || (this.searchForm!.get('eir_dt_start')?.value && this.searchForm!.get('eir_dt_end')?.value)) {
      const sotSome: any = {};

      if (this.searchForm!.get('last_cargo')?.value) {
        sotSome.last_cargo = { contains: this.searchForm!.get('last_cargo')?.value.code };
      }

      if (this.searchForm!.get('tank_no')?.value) {
        const tankNo = this.searchForm!.get('tank_no')?.value;
        sotSome.or = [
          { tank_no: { contains: Utility.formatContainerNumber(tankNo) } },
          { tank_no: { contains: Utility.formatTankNumberForSearch(tankNo) } }
        ];
      }

      if (this.searchForm!.get('repair_option_cv')?.value?.length) {
        sotSome.purpose_repair_cv = { in: this.searchForm!.get('repair_option_cv')?.value };
      } else {
        sotSome.purpose_repair_cv = { neq: null };
      }

      if (this.searchForm!.get('customer_code')?.value) {
        const soSome: any = {};
        soSome.customer_company = { code: { contains: this.searchForm!.get('customer_code')?.value.code } };

        sotSome.storing_order = soSome;
      }

      if (this.searchForm!.get('eir_no')?.value || (this.searchForm!.get('eir_dt_start')?.value && this.searchForm!.get('eir_dt_end')?.value)) {
        const igSome: any = {};
        if (this.searchForm!.get('eir_no')?.value) {
          igSome.eir_no = { contains: this.searchForm!.get('eir_no')?.value };
        }

        if (this.searchForm!.get('eir_dt_start')?.value && this.searchForm!.get('eir_dt_end')?.value) {
          igSome.eir_dt = { gte: Utility.convertDate(this.searchForm!.get('eir_dt_start')?.value), lte: Utility.convertDate(this.searchForm!.get('eir_dt_end')?.value, true) };
        }

        sotSome.in_gate = { some: igSome };
      }

      where.storing_order_tank = sotSome;
    }

    if (this.searchForm!.get('est_status_cv')?.value?.length) {
      where.status_cv = { in: this.searchForm!.get('est_status_cv')?.value }
    } else {
      where.status_cv = { in: this.availableProcessStatus }
    }

    if (this.searchForm!.get('est_dt')?.value) {
      where.create_dt = { gte: Utility.convertDate(this.searchForm!.get('est_dt')?.value), lte: Utility.convertDate(this.searchForm!.get('est_dt')?.value, true) };
    }

    if (this.searchForm!.get('approval_dt_start')?.value && this.searchForm!.get('approval_dt_end')?.value) {
      where.approve_dt = { gte: Utility.convertDate(this.searchForm!.get('approval_dt_start')?.value), lte: Utility.convertDate(this.searchForm!.get('approval_dt_end')?.value, true) };
    }

    this.lastSearchCriteria = this.soDS.addDeleteDtCriteria(where);
  }

  search() {
    this.constructSearchCriteria();
    this.performSearch(this.pageSize, 0, this.pageSize, undefined, undefined, undefined, () => {
      this.updatePageSelection();
    });
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, callback?: () => void) {
    this.searchStateService.setCriteria(this.pageStateType, this.searchForm?.value);
    this.searchStateService.setPagination(this.pageStateType, {
      pageSize,
      pageIndex,
      first,
      after,
      last,
      before
    });
    this.subs.sink = this.repairDS.searchRepair(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {
        this.repList = data.map(re => {
          return { ...re, net_cost: this.calculateNetCost(re) }
        });
        this.endCursor = this.repairDS.pageInfo?.endCursor;
        this.startCursor = this.repairDS.pageInfo?.startCursor;
        this.hasNextPage = this.repairDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPage = this.repairDS.pageInfo?.hasPreviousPage ?? false;
      });

    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
  }

  onPageEvent(event: PageEvent) {
    const { pageIndex, pageSize } = event;
    let first: number | undefined = undefined;
    let after: string | undefined = undefined;
    let last: number | undefined = undefined;
    let before: string | undefined = undefined;

    // Check if the page size has changed
    if (this.pageSize !== pageSize) {
      // Reset pagination if page size has changed
      this.pageIndex = 0;
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
    }

    this.performSearch(pageSize, pageIndex, first, after, last, before, () => {
      this.updatePageSelection();
    });
  }

  // mergeCriteria(criteria: any) {
  //   return {
  //     and: [
  //       { delete_dt: { eq: null } },
  //       criteria
  //     ]
  //   };
  // }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} - ${cc.name}` : '';
  }

  initializeFilterCustomerCompany() {
    this.searchForm!.get('customer_code')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (value && typeof value === 'object') {
          searchCriteria = value.code;
        } else {
          searchCriteria = value || '';
        }
        this.subs.sink = this.ccDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
          this.customer_companyList = data
        });
      })
    ).subscribe();

    this.searchForm!.get('last_cargo')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (value && typeof value === 'object') {
          searchCriteria = value.cargo;
        } else {
          searchCriteria = value || '';
        }
        this.tcDS.loadItems({ cargo: { contains: searchCriteria } }, { cargo: 'ASC' }).subscribe(data => {
          this.last_cargoList = data
          this.updateValidators(this.last_cargoList);
        });
      })
    ).subscribe();
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  getTankStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.tankStatusCvList);
  }

  calculateNetCost(repair: RepairItem): any { // HBDA 122361-2
    const total = this.repairDS.getTotal(repair?.repair_part)
    const labourDiscount = repair.labour_cost_discount;
    const matDiscount = repair.material_cost_discount;

    const total_hour = total.hour;
    const total_labour_cost = this.repairDS.getTotalLabourCost(total_hour, repair?.labour_cost);
    const total_mat_cost = total.total_mat_cost;
    const total_cost = total_labour_cost + total_mat_cost;
    const discount_labour_cost = this.repairDS.getDiscountCost(labourDiscount, total_labour_cost);
    const discount_mat_cost = this.repairDS.getDiscountCost(matDiscount, total_mat_cost);
    const net_cost = this.repairDS.getNetCost(total_cost, discount_labour_cost, discount_mat_cost);
    return Utility.formatNumberDisplay(net_cost);
  }

  parse2Decimal(input: number | string | undefined) {
    return Utility.formatNumberDisplay(input);
  }

  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
  }

  updateValidators(validOptions: any[]) {
    this.lastCargoControl.setValidators([
      Validators.required,
      AutocompleteSelectionValidator(validOptions)
    ]);
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
  }

  resetForm() {
    this.searchForm?.patchValue({
      tank_no: '',
      eir_dt_start: '',
      eir_dt_end: '',
      eir_no: '',
      repair_option_cv: '',
      est_dt: '',
      approval_dt_start: '',
      approval_dt_end: '',
      est_status_cv: ''
    });
    this.customerCodeControl.reset('');
    this.lastCargoControl.reset('');
  }

  filterDeleted(resultList: any[] | undefined): any {
    return (resultList || []).filter((row: any) => !row.delete_dt);
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

  getProcessStatusDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.processStatusCvList);
  }

  getMaxDate() {
    return new Date();
  }
}