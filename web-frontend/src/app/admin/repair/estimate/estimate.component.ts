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
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { RepairDS, RepairGO, RepairItem, RepairRequest, RepairStatusRequest } from 'app/data-sources/repair';
import { StoringOrderDS, StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { CancelFormDialogComponent } from './dialogs/cancel-form-dialog/form-dialog.component';

@Component({
  selector: 'app-estimate',
  standalone: true,
  templateUrl: './estimate.component.html',
  styleUrl: './estimate.component.scss',
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
  ]
})
export class RepairEstimateComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'estimate_no',
    'job_no',
    'net_cost',
    'status_cv',
    'remarks',
    'actions'
  ];

  pageTitle = 'MENUITEMS.REPAIR.LIST.ESTIMATE'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.REPAIR.TEXT', route: '/admin/repair/estimate' }
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
    ARE_YOU_SURE_ROLLBACK: 'COMMON-FORM.ARE-YOU-SURE-ROLLBACK',
    CANCEL: 'COMMON-FORM.CANCEL',
    CLOSE: 'COMMON-FORM.CLOSE',
    TO_BE_CANCELED: 'COMMON-FORM.TO-BE-CANCELED',
    CANCELED_SUCCESS: 'COMMON-FORM.CANCELED-SUCCESS',
    ROLLBACK_SUCCESS: 'COMMON-FORM.ROLLBACK-SUCCESS',
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
    CONFIRM_CLEAR_ALL: 'COMMON-FORM.CONFIRM-CLEAR-ALL',
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    AMEND: 'COMMON-FORM.AMEND',
    ALL_REMARKS: 'COMMON-FORM.ALL-REMARKS',
    ROLLBACK: 'COMMON-FORM.ROLLBACK',
    DUPLICATE: 'COMMON-FORM.DUPLICATE',
    SELECT_TANK: 'COMMON-FORM.SELECT-TANK',
    NEW: 'COMMON-FORM.NEW',
    COPY: 'COMMON-FORM.COPY',
    NO_OF_PARTS: 'COMMON-FORM.NO-OF-PARTS',
    REMOVE_COPIED: 'COMMON-FORM.REMOVE-COPIED',
    CHANGE_REQUEST: 'COMMON-FORM.CHANGE-REQUEST',
    SEARCH: 'COMMON-FORM.SEARCH',
  }

  availableProcessStatus: string[] = [
    'APPROVED',
    'JOB_IN_PROGRESS',
    'PENDING',
    // 'COMPLETED',
    // 'NO_ACTION',
    // 'ASSIGNED',
    // 'PARTIAL_ASSIGNED',
  ]

  searchForm?: UntypedFormGroup;

  cvDS: CodeValuesDS;
  soDS: StoringOrderDS;
  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  tcDS: TariffCleaningDS;
  igDS: InGateDS;
  repairDS: RepairDS;

  sotList: StoringOrderTankItem[] = [];
  reSelection = new SelectionModel<RepairItem>(true, []);
  selectedItemsPerPage: { [key: number]: Set<string> } = {};
  processStatusCvList: CodeValuesItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  repairOptionCvList: CodeValuesItem[] = [];

  customerCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  customer_companyList?: CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];

  copiedRepair?: RepairItem;

  pageIndex = 0;
  pageSize = 10;
  lastSearchCriteria: any;
  lastOrderBy: any = { storing_order: { so_no: "DESC" } };
  endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;

  currentStartCursor: string | undefined = undefined;
  currentEndCursor: string | undefined = undefined;
  lastCursorDirection: string | undefined = undefined;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService
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
      // est_dt_start: [''],
      // est_dt_end: [''],
      est_dt: [''],
      approval_dt_start: [''],
      approval_dt_end: [''],
      est_status_cv: [''],
    });
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

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
    this.sotList.forEach(row => {
      if (selectedItems.has(row.guid!)) {
        this.reSelection.select(row);
      }
    });
  }

  cancelRow(row: RepairItem, sot: StoringOrderTankItem) {
    const found = this.reSelection.selected.some(x => x.guid === row.guid);
    let selectedList = [...this.reSelection.selected];
    if (!found) {
      // this.toggleRow(row);
      selectedList.push(row);
    }
    this.cancelSelectedRows(selectedList, sot)
  }

  cancelSelectedRows(row: RepairItem[], sot: StoringOrderTankItem) {
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
        item: [...row],
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const reList = result.item.map((item: RepairItem) => new RepairGO(item));
        var repairStatusReq: RepairStatusRequest = new RepairStatusRequest({
          guid: reList[0].guid,
          sot_guid: sot!.guid,
          action: "CANCEL",
          remarks: reList[0].remarks
        });
        console.log(repairStatusReq);
        this.repairDS.updateRepairStatus(repairStatusReq).subscribe(result => {
          console.log(result)
          if (result.data.updateRepairStatus > 0) {
            this.handleCancelSuccess(result.data.updateRepairStatus);
          }
        });
      }
    });
  }

  rollbackRow(row: RepairItem) {
    const found = this.reSelection.selected.some(x => x.guid === row.guid);
    let selectedList = [...this.reSelection.selected];
    if (!found) {
      // this.toggleRow(row);
      selectedList.push(row);
    }
    this.rollbackSelectedRows(selectedList)
  }

  rollbackSelectedRows(row: RepairItem[]) {
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
        item: [...row],
        translatedLangText: this.translatedLangText
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        const reList = result.item.map((item: any) => {
          const RepairRequestInput = new RepairRequest({
            customer_guid: item.customer_company_guid,
            estimate_no: item.estimate_no,
            guid: item.guid,
            is_approved: false,
            remarks: item.remarks,
            sot_guid: item.sot_guid
          })
          return RepairRequestInput
        });
        console.log(reList);
        this.repairDS.rollbackRepair(reList).subscribe(result => {
          this.handleRollbackSuccess(result?.data?.rollbackRepair)
          this.performSearch(this.pageSize, 0, this.pageSize);
        });
      }
    });
  }

  copyRepair(repair: RepairItem) {
    this.copiedRepair = repair;
  }

  clearCopiedRepair() {
    this.copiedRepair = undefined;
  }

  public loadData() {
    const queries = [
      { alias: 'processStatusCv', codeValType: 'PROCESS_STATUS' },
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
      { alias: 'repairOptionCv', codeValType: 'REPAIR_OPTION' },
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('processStatusCv').subscribe(data => {
      this.processStatusCvList = data;
    });
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      this.purposeOptionCvList = data;
    });
    this.cvDS.connectAlias('tankStatusCv').subscribe(data => {
      this.tankStatusCvList = data;
    });
    this.cvDS.connectAlias('repairOptionCv').subscribe(data => {
      this.repairOptionCvList = data;
    });

    this.search();
  }

  handleCancelSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.CANCELED_SUCCESS;
      ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
      this.triggerCurrentSearch();
    }
  }

  handleRollbackSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.ROLLBACK_SUCCESS;
      ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
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

  search() {
    if (this.searchForm?.invalid) return;

    const where: any = {
      tank_status_cv: { in: ['REPAIR', 'STORAGE'] },
      purpose_repair_cv: { in: ["REPAIR", "OFFHIRE"] }
    };

    if (this.searchForm!.get('tank_no')?.value) {
      where.tank_no = { contains: this.searchForm!.get('tank_no')?.value };
    }

    if (this.searchForm!.get('last_cargo')?.value) {
      where.last_cargo = { contains: this.searchForm!.get('last_cargo')?.value?.code };
    }

    if (this.searchForm!.get('eir_no')?.value || (this.searchForm!.get('eir_dt_start')?.value && this.searchForm!.get('eir_dt_end')?.value)) {
      const igSome: any = {};
      if (this.searchForm!.get('eir_no')?.value) {
        igSome.eir_no = { contains: this.searchForm!.get('eir_no')?.value };
      }

      if (this.searchForm!.get('eir_dt_start')?.value && this.searchForm!.get('eir_dt_end')?.value) {
        igSome.eir_dt = { gte: Utility.convertDate(this.searchForm!.get('eir_dt_start')?.value), lte: Utility.convertDate(this.searchForm!.get('eir_dt_end')?.value, true) };
      }

      where.in_gate = { some: igSome }
    }

    if (this.searchForm!.get('customer_code')?.value) {
      const soSome: any = {};

      if (this.searchForm!.value['customer_code']) {
        soSome.customer_company = { code: { contains: this.searchForm!.value['customer_code'].code } };
      }
    }

    if (this.searchForm!.get('est_dt')?.value || (this.searchForm!.get('est_dt_start')?.value || this.searchForm!.get('est_dt_end')?.value) || this.searchForm!.get('est_status_cv')?.value?.length) {
      let reSome: any = {};

      // if (this.searchForm!.get('est_dt_start')?.value || this.searchForm!.get('est_dt_end')?.value) {
      //   const estDtStart = this.searchForm?.get('est_dt_start')?.value;
      //   const estDtEnd = this.searchForm?.get('est_dt_end')?.value;
      //   const today = new Date();

      //   // Check if `est_dt_start` is before today and `est_dt_end` is empty
      //   if (estDtStart && new Date(estDtStart) < today && !estDtEnd) {
      //     reSome.create_dt = {
      //       gte: Utility.convertDate(estDtStart),
      //       lte: Utility.convertDate(today), // Set end date to today
      //     };
      //   } else if (estDtStart || estDtEnd) {
      //     // Handle general case where either or both dates are provided
      //     reSome.create_dt = {
      //       gte: Utility.convertDate(estDtStart || today),
      //       lte: Utility.convertDate(estDtEnd || today),
      //     };
      //   }
      // }

      if (this.searchForm!.get('est_dt')?.value) {
        const estDtStart = this.searchForm?.get('est_dt')?.value?.clone();
        reSome.create_dt = {
          gte: Utility.convertDate(estDtStart),
          lte: Utility.convertDate(estDtStart, true),
        };
      }

      if (this.searchForm!.get('est_status_cv')?.value?.length) {
        reSome.status_cv = { in: this.searchForm!.get('est_status_cv')?.value }
      }
      where.repair = { some: reSome };
    }

    if (this.searchForm!.get('repair_option_cv')?.value?.length) {
      where.purpose_repair_cv = { in: this.searchForm!.get('repair_option_cv')?.value };
    }

    this.lastSearchCriteria = this.soDS.addDeleteDtCriteria(where);
    this.performSearch(this.pageSize, this.pageIndex, this.pageSize, undefined, undefined, undefined, () => {
      this.updatePageSelection();
    });
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, callback?: () => void) {
    this.subs.sink = this.sotDS.searchStoringOrderTanksRepair(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {
        this.sotList = data.map(sot => {
          sot.repair = sot.repair?.map(rep => {
            return { ...rep, net_cost: this.calculateNetCost(rep) }
          })
          return sot;
        });
        this.endCursor = this.sotDS.pageInfo?.endCursor;
        this.startCursor = this.sotDS.pageInfo?.startCursor;
        this.hasNextPage = this.sotDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPage = this.sotDS.pageInfo?.hasPreviousPage ?? false;

        this.currentEndCursor = after;
        this.currentStartCursor = before;
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
        this.lastCursorDirection = 'forward';
        first = pageSize;
        after = this.endCursor;
      } else if (pageIndex < this.pageIndex && this.hasPreviousPage) {
        // Navigate backward
        this.lastCursorDirection = 'backward';
        last = pageSize;
        before = this.startCursor;
      }
    }

    this.performSearch(pageSize, pageIndex, first, after, last, before, () => {
      this.updatePageSelection();
    });
  }

  triggerCurrentSearch() {
    let first: number | undefined = undefined;
    let after: string | undefined = undefined;
    let last: number | undefined = undefined;
    let before: string | undefined = undefined;

    if (this.pageIndex === 0) {
      first = this.pageSize;
    } else if (this.lastCursorDirection === 'forward') {
      first = this.pageSize;
      after = this.currentEndCursor;
    } else if (this.lastCursorDirection === 'backward') {
      last = this.pageSize;
      before = this.currentStartCursor;
    }

    // Perform the search
    this.performSearch(
      this.pageSize,
      this.pageIndex,
      first,
      after,
      last,
      before,
      () => {
        this.updatePageSelection(); // Callback for UI updates
      }
    );
  }

  getProcessStatusDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.processStatusCvList);
  }

  getRepairOptionDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.repairOptionCvList);
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
  }

  initializeFilterCustomerCompany() {
    this.searchForm!.get('customer_code')!.valueChanges.pipe(
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

    this.searchForm!.get('last_cargo')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (typeof value === 'string') {
          searchCriteria = value;
        } else {
          searchCriteria = value.cargo;
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

  calculateNetCost(repair: RepairItem): any {
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
    return this.parse2Decimal(net_cost);
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
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        headerText: this.translatedLangText.CONFIRM_RESET,
        action: 'new',
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result.action === 'confirmed') {
        this.resetForm();
      }
    });
  }

  resetForm() {
    this.searchForm?.patchValue({
      so_no: '',
      so_status: '',
      tank_no: '',
      job_no: '',
      purpose: '',
      eir_dt_start: '',
      eir_dt_end: '',
      est_status_cv: '',
      repair_option_cv: '',
      est_dt: ''
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
}