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
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { StoringOrderDS, StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { CancelFormDialogComponent } from './dialogs/cancel-form-dialog/form-dialog.component';

// import { RepairEstDS, RepairEstGO, RepairEstItem } from 'app/data-sources/repair-est';
// import { RepairEstPartItem } from 'app/data-sources/repair-est-part';
import { PackageRepairDS } from 'app/data-sources/package-repair';
import { ResidueItem } from 'app/data-sources/residue';
import { SteamDS, SteamItem, SteamStatusRequest } from 'app/data-sources/steam';

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
export class SteamEstimateComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  // displayedColumns = [
  //   'tank_no',
  //   'customer',
  //   'eir_no',
  //   'eir_dt',
  //   'last_cargo',
  //   'tank_status_cv'
  // ];

  displayedColumns = [
    // 'select',
    'estimate_no',
    'net_cost',
    'status_cv',
    'remarks',
    'actions'
  ];

  pageTitle = 'MENUITEMS.STEAM.LIST.STEAM-ESTIMATE'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.STEAM.TEXT', route: '/admin/steam/estimate' },
    { text: 'MENUITEMS.STEAM.LIST.ESTIMATE', route: '/admin/steam/estimate' },
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

  }


  availableProcessStatus: string[] = [
    'ASSIGNED',
    'PARTIAL_ASSIGNED',
    'APPROVED',
    'JOB_IN_PROGRESS',
    'COMPLETED',
    'PENDING',
    'NO_ACTION'

  ]
  searchForm?: UntypedFormGroup;

  pckRepDS: PackageRepairDS;
  cvDS: CodeValuesDS;
  soDS: StoringOrderDS;
  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  tcDS: TariffCleaningDS;
  igDS: InGateDS;
  steamDS: SteamDS;
  // repairEstDS: RepairDS;

  sotList: StoringOrderTankItem[] = [];
  reSelection = new SelectionModel<SteamItem>(true, []);
  selectedItemsPerPage: { [key: number]: Set<string> } = {};
  reStatusCvList: CodeValuesItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  processStatusCvList: CodeValuesItem[] = [];

  customerCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  customer_companyList?: CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];

  copiedSteamEst?: SteamItem;

  pageIndex = 0;
  pageSize = 10;
  lastSearchCriteria: any;
  lastOrderBy: any = { storing_order: { so_no: "ASC" } };
  endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;
  previous_endCursor: any;


  constructor(
    private router: Router,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,

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
    this.steamDS = new SteamDS(this.apollo);
    this.pckRepDS = new PackageRepairDS(this.apollo);
    //this.repairEstDS = new RepairDS(this.apollo);
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
    var state = history.state;

    if (state.type == "steam-estimate") {
      let showResult = state.pagination.showResult;
      if (showResult) {
        this.lastSearchCriteria = state.pagination.where;
        this.pageIndex = state.pagination.pageIndex;
        this.pageSize = state.pagination.pageSize;
        this.hasPreviousPage = state.pagination.hasPreviousPage;
        this.startCursor = state.pagination.startCursor;
        this.endCursor = state.pagination.endCursor;
        this.previous_endCursor = state.pagination.previous_endCursor;
        this.paginator.pageSize = this.pageSize;
        this.paginator.pageIndex = this.pageIndex;
        this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
      }

    }
  }

  refresh() {
    this.refreshTable();
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      tank_no: [''],
      customer_code: [''],
      last_cargo: [''],
      eir_dt_start: [''],
      eir_dt_end: [''],
      part_name: [''],
      bill_completed_cv: [''],
      status_cv: [''],
      eir_no: [''],
      job_no: [''],
      //      repair_type_cv: [''],
      est_dt_start: [''],
      est_dt_end: [''],
      approval_dt_start: [''],
      approval_dt_end: [''],
      est_status_cv: [''],
      current_status_cv: ['']
    });
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  toggleRow(row: ResidueItem) {
    // this.reSelection.toggle(row);
    // const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set();
    // if (this.reSelection.isSelected(row)) {
    //   selectedItems.add(row.guid!);
    // } else {
    //   selectedItems.delete(row.guid!);
    // }
    // this.selectedItemsPerPage[this.pageIndex] = selectedItems;
  }

  /** Update selection for the current page */
  updatePageSelection() {
    // this.reSelection.clear();
    // const selectedItems = this.selectedItemsPerPage[this.pageIndex] || new Set();
    // this.sotList.forEach(row => {
    //   if (selectedItems.has(row.guid!)) {
    //     this.reSelection.select(row);
    //   }
    // });
  }

  cancelRow(row: ResidueItem) {
    const found = this.reSelection.selected.some(x => x.guid === row.guid);
    let selectedList = [...this.reSelection.selected];
    if (!found) {
      // this.toggleRow(row);
      selectedList.push(row);
    }
    this.cancelSelectedRows(selectedList)
  }

  cancelSelectedRows(row: ResidueItem[]) {
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
        const reList = result.item.map((item: SteamItem) => new SteamItem(item));
        console.log(reList);

        let steamStatus: SteamStatusRequest = new SteamStatusRequest();
        steamStatus.action = "CANCEL";
        steamStatus.guid = row[0]?.guid;
        steamStatus.sot_guid = row[0]?.sot_guid;
        steamStatus.remarks = reList[0].remarks;
        this.steamDS.updateSteamStatus(steamStatus).subscribe(result => {

          this.handleCancelSuccess(result?.data?.UpdateSteamStatus)
          this.performSearch(this.pageSize, 0, this.pageSize);
        });
        //  this.residueDS.cancelResidue(reList).subscribe((result: { data: { cancelResidue: any; }; }) => {
        //    this.handleCancelSuccess(result?.data?.cancelResidue)
        //    this.performSearch(this.pageSize, 0, this.pageSize);
        //  });
      }
    });
  }

  rollbackRow(row: SteamItem) {
    const found = this.reSelection.selected.some(x => x.guid === row.guid);
    let selectedList = [...this.reSelection.selected];
    if (!found) {
      // this.toggleRow(row);
      selectedList.push(row);
    }
    this.rollbackSelectedRows(selectedList)
  }

  rollbackSelectedRows(row: SteamItem[]) {
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
          const SteamEstimateRequestInput = {
            customer_guid: item.customer_company_guid,
            estimate_no: item.estimate_no,
            guid: item.guid,
            remarks: item.remarks,
            sot_guid: item.sot_guid,
            is_approved: item?.status_cv == "APPROVED"
          }
          return SteamEstimateRequestInput;
        });
        console.log(reList);
        this.steamDS.rollbackSteam(reList).subscribe((result: { data: { rollbackSteaming: any; }; }) => {
          this.handleRollbackSuccess(result?.data?.rollbackSteaming)
          this.performSearch(this.pageSize, 0, this.pageSize);
        });
      }
    });
  }


  copyResidueEst(steamEst: SteamItem) {
    this.copiedSteamEst = steamEst;
  }

  clearCopiedRepairEst() {
    this.copiedSteamEst = undefined;
  }

  public loadData() {
    this.search();

    const queries = [
      //{ alias: 'reStatusCv', codeValType: 'REP_EST_STATUS' },
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
      { alias: 'processStatusCv', codeValType: 'PROCESS_STATUS' },
    ];
    this.cvDS.getCodeValuesByType(queries);
    // this.cvDS.connectAlias('soStatusCv').subscribe(data => {
    //   this.processStatusCvList = addDefaultSelectOption(data, 'All');
    // });
    // this.cvDS.connectAlias('reStatusCv').subscribe(data => {
    //   this.reStatusCvList = addDefaultSelectOption(data, 'All');
    // });
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      this.purposeOptionCvList = data;
    });
    this.cvDS.connectAlias('tankStatusCv').subscribe(data => {
      this.tankStatusCvList = data;
    });
    this.cvDS.connectAlias('processStatusCv').subscribe(data => {
      this.processStatusCvList = data;
    });
  }

  handleCancelSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.CANCELED_SUCCESS;
      ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
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
    const where: any = {
      tank_status_cv: { in: ['STEAM', 'STORAGE'] }
    };

    if (this.searchForm!.value['tank_no']) {
      where.tank_no = { contains: this.searchForm!.value['tank_no'] };
    }

    if (this.searchForm!.value['last_cargo']) {

      if (!where.tariff_cleaning) where.tariff_cleaning = {};

      where.tariff_cleaning.cargo = { contains: this.searchForm!.value['last_cargo'].cargo };
    }


    if (this.searchForm!.value['eir_no']) {
      if (!where.in_gate) where.in_gate = {};
      where.in_gate = { some: { eir_no: { contains: this.searchForm!.value['eir_no'] } } };
    }

    if (this.searchForm!.value['eir_dt_start'] && this.searchForm!.value['eir_dt_end']) {
      if (!where.in_gate) where.in_gate = {};
      where.in_gate = { some: { eir_dt: { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) } } };
      //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
    }


    if (this.searchForm!.value['customer_code']) {
      where.customer_company = { code: { contains: this.searchForm!.value['customer_code'].code } };
    }


    if (this.searchForm!.value['part_name']) {
      if (!where.residue) where.residue = {};
      where.residue.some = { residue_part: { some: { description: { contains: this.searchForm!.value['part_name'] } } } };
    }

    if (this.searchForm!.value['residue_job_no']) {

      if (!where.residue) where.residue = {};
      where.residue = { some: { job_no: { contains: this.searchForm!.value['job_no'] } } };
    }

    if (this.searchForm!.value['est_dt_start'] && this.searchForm!.value['est_dt_end']) {
      if (!where.residue) where.residue = {};
      if (!where.residue.some) where.residue.some = {};
      where.residue.some.create_dt = { gte: Utility.convertDate(this.searchForm!.value['est_dt_start']), lte: Utility.convertDate(this.searchForm!.value['est_dt_end']) };
    }

    if (this.searchForm!.value['approval_dt_start'] && this.searchForm!.value['approval_dt_end']) {
      if (!where.residue) where.residue = {};
      if (!where.residue.some) where.residue.some = {};
      where.residue.some.approve_dt = { gte: Utility.convertDate(this.searchForm!.value['approval_dt_start']), lte: Utility.convertDate(this.searchForm!.value['approval_dt_end']) };
    }

    if (this.searchForm!.value['est_status_cv'] !== undefined && this.searchForm!.value['est_status_cv'].length > 0) {
      if (!where.residue) where.residue = {};
      if (!where.residue.some) where.residue.some = {};
      where.residue.some.status_cv = { in: this.searchForm!.value['est_status_cv'] };
    }

    this.lastSearchCriteria = this.soDS.addDeleteDtCriteria(where);
    this.performSearch(this.pageSize, this.pageIndex, this.pageSize, undefined, undefined, undefined, () => {
      this.updatePageSelection();
    });
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, callback?: () => void) {
    this.subs.sink = this.sotDS.searchStoringOrderTanksSteamEstimate(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {
        this.sotList = data.map(sot => {
          sot.steaming = sot.steaming?.map(stm => {
            var stm_part = [...stm.steaming_part!];
            stm.steaming_part = stm_part?.filter(data => !data.delete_dt);
            return { ...stm, net_cost: this.calculateNetCost(stm) }
          })

          return sot;
        });
        this.endCursor = this.sotDS.pageInfo?.endCursor;
        this.startCursor = this.sotDS.pageInfo?.startCursor;
        this.hasNextPage = this.sotDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPage = this.sotDS.pageInfo?.hasPreviousPage ?? false;
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

  getProcessStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.processStatusCvList);
  }

  getTankStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.tankStatusCvList);
  }

  calculateNetCost(steam: SteamItem): any {


    const total = this.steamDS.getTotal(steam?.steaming_part)

    return total.total_mat_cost.toFixed(2);
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
    this.searchForm?.patchValue({
      tank_no: '',
      customer_code: '',
      last_cargo: '',
      eir_dt_start: '',
      eir_dt_end: '',
      part_name: '',
      bill_completed_cv: '',
      status_cv: '',
      eir_no: '',
      residue_job_no: '',
      est_dt_start: '',
      est_dt_end: '',
      approval_dt_start: '',
      approval_dt_end: '',
      est_status_cv: '',
      current_status_cv: ''
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

  addResidueEstimate(event: Event, row: StoringOrderItem) {
    event.stopPropagation(); // Stop the click event from propagating
    // Navigate to the route and pass the JSON object
    this.router.navigate(['/admin/steam/estimate/new/', row.guid], {
      state: {
        id: '',
        action: "NEW",
        selectedSteam: undefined,
        selectedRow: row,
        type: 'steam-estimate',
        pagination: {
          where: this.lastSearchCriteria,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          hasPreviousPage: this.hasPreviousPage,
          startCursor: this.startCursor,
          endCursor: this.endCursor,
          previous_endCursor: this.previous_endCursor,

          showResult: this.sotDS.totalCount > 0

        }
      }
    });
  }

  pasteSteamEstimate(event: Event, sot: StoringOrderItem, row: ResidueItem) {
    event.stopPropagation(); // Stop the click event from propagating
    // Navigate to the route and pass the JSON object
    this.router.navigate(['/admin/steam/estimate/new/', row.guid], {
      state: {
        id: '',
        action: "DUPLICATE",
        selectedSteam: row,
        selectedRow: sot,
        type: 'steam-estimate',
        pagination: {
          where: this.lastSearchCriteria,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          hasPreviousPage: this.hasPreviousPage,
          startCursor: this.startCursor,
          endCursor: this.endCursor,
          previous_endCursor: this.previous_endCursor,

          showResult: this.sotDS.totalCount > 0

        }
      }
    });
  }
  updateSteamEstimate(event: Event, sot: StoringOrderItem, row: SteamItem) {
    event.stopPropagation(); // Stop the click event from propagating
    // Navigate to the route and pass the JSON object
    this.router.navigate(['/admin/steam/estimate/new/', row.guid], {
      state: {
        id: '',
        action: "UPDATE",
        selectedSteam: row,
        selectedRow: sot,
        type: 'steam-estimate',
        pagination: {
          where: this.lastSearchCriteria,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          hasPreviousPage: this.hasPreviousPage,
          startCursor: this.startCursor,
          endCursor: this.endCursor,
          previous_endCursor: this.previous_endCursor,

          showResult: this.sotDS.totalCount > 0

        }
      }
    });
  }
}