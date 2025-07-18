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
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { PackageLabourDS } from 'app/data-sources/package-labour';
import { PackageRepairDS } from 'app/data-sources/package-repair';
import { SteamDS, SteamItem, SteamStatusRequest } from 'app/data-sources/steam';
import { SteamPartItem } from 'app/data-sources/steam-part';
import { StoringOrderDS, StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { SearchStateService } from 'app/services/search-criteria.service';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';
import { ComponentUtil } from 'app/utilities/component-util';
import { pageSizeInfo, Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { CancelFormDialogComponent } from './dialogs/cancel-form-dialog/form-dialog.component';
import { TlxCardListComponent } from '@shared/components/tlx-card-list/tlx-card-list.component';

@Component({
  selector: 'app-estimate',
  standalone: true,
  templateUrl: './estimate-approval.component.html',
  styleUrl: './estimate-approval.component.scss',
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
    TlxCardListComponent
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class SteamEstimateApprovalComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'estimate_no',
    'net_cost',
    'status_cv',
    'remarks',
    'actions'
  ];

  pageTitle = 'MENUITEMS.STEAM.LIST.STEAM-ESTIMATE-APPROVAL'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.STEAM.TEXT', route: '/admin/steam/estimate-approval' },
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
    CONFIRM_CANCEL: 'COMMON-FORM.CONFIRM-CANCEL',
    CANCEL: 'COMMON-FORM.CANCEL',
    CLOSE: 'COMMON-FORM.CLOSE',
    TO_BE_CANCELED: 'COMMON-FORM.TO-BE-CANCELED',
    CANCELED_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    ROLLBACK_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
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
    APPROVE: 'COMMON-FORM.APPROVE',
    TANK_STATUS: 'COMMON-FORM.TANK-STATUS',
    SEARCH: 'COMMON-FORM.SEARCH',
    COST: 'COMMON-FORM.COST',
    DELETE: 'COMMON-FORM.DELETE'
  }

  availableTankStatus: string[] = [
    'STEAM',
    'STORAGE'
  ]

  availableProcessStatus: string[] = [
    'ASSIGNED',
    //'PARTIAL_ASSIGNED',
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

  isMobile = false;

  pageStateType = 'SteamEstimateApproval'
  pageIndex = 0;
  pageSize = pageSizeInfo.defaultSize;
  lastSearchCriteria: any;
  lastOrderBy: any = { storing_order: { so_no: "ASC" } };
  endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;
  previous_endCursor: any;
  plDS: PackageLabourDS;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private searchStateService: SearchStateService
  ) {
    super();
    this.translateLangText();
    this.initSearchForm();
    this.lastCargoControl = new UntypedFormControl('', [AutocompleteSelectionValidator(this.last_cargoList)]);
    this.soDS = new StoringOrderDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.steamDS = new SteamDS(this.apollo);
    this.pckRepDS = new PackageRepairDS(this.apollo);
    this.plDS = new PackageLabourDS(this.apollo);
    //this.repairEstDS = new RepairDS(this.apollo);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.updateView(window.innerWidth);

    window.addEventListener('resize', () => {
      this.updateView(window.innerWidth);
    });

    this.initializeFilterCustomerCompany();
    this.searchStateService.clearOtherPages(this.pageStateType);
    this.loadData();
  }

  private updateView(width: number): void {
    this.isMobile = width < 768;
    this.displayedColumns = this.isMobile
      ? ['estimate_no', 'status_cv', 'actions']
      : ['estimate_no', 'net_cost', 'status_cv', 'remarks', 'actions'];
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
      part_name: [''],
      status_cv: [''],
      eir_no: [''],
      job_no: [''],
      est_dt: [''],
      est_status_cv: [''],
      current_status_cv: [''],
      tank_status: [['STEAM']]
    });
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
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

  cancelRow(row: SteamItem) {
    const found = this.reSelection.selected.some(x => x.guid === row.guid);
    let selectedList = [...this.reSelection.selected];
    if (!found) {
      // this.toggleRow(row);
      selectedList.push(row);
    }
    this.cancelSelectedRows(selectedList)
  }

  cancelSelectedRows(row: SteamItem[]) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(CancelFormDialogComponent, {
      width: '380px',
      data: {
        action: 'cancel',
        dialogTitle: this.translatedLangText.CONFIRM_CANCEL,
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
      //width: '1000px',
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

  copySteamEst(steamEst: SteamItem) {
    this.copiedSteamEst = steamEst;
  }

  clearCopiedRepairEst() {
    this.copiedSteamEst = undefined;
  }

  public loadData() {
    const queries = [
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
      { alias: 'processStatusCv', codeValType: 'PROCESS_STATUS' },
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      this.purposeOptionCvList = data;
    });
    this.cvDS.connectAlias('tankStatusCv').subscribe(data => {
      this.tankStatusCvList = data;
    });
    this.cvDS.connectAlias('processStatusCv').subscribe(data => {
      this.processStatusCvList = data;
    });

    //   var actionId= this.route.snapshot.paramMap.get('id');
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
    //  else if(['pending'].includes(actionId))
    //  {
    //    const status = ["PENDING"];
    //      const where: any = {and:[
    //       { or:[{ delete_dt:{eq: null}},{ delete_dt:{eq:0}}]},
    //       { purpose_steam:{eq:true}},
    //       { tank_status_cv: { eq: 'STEAM'  } },
    //       { steaming: { some: {and: [
    //             { status_cv: { in: status } },
    //           ]}}
    //       }
    //     ]};

    //      this.lastSearchCriteria = where;
    //     this.performSearch(this.pageSize, 0, this.pageSize, undefined, undefined, undefined, () => {
    //       this.updatePageSelection();
    //     });
    //     console.log("search pending records");

    //  }
  }

  handleCancelSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.CANCELED_SUCCESS;
      ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
    }
  }

  handleRollbackSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.translatedLangText.ROLLBACK_SUCCESS;
      ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
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

  constructSearchCriteria() {
    const where: any = {
      tank_status_cv: { in: ['STEAM', 'STORAGE'] },
      purpose_steam: { eq: true }


    };

    // if (this.searchForm!.value['tank_status']) {
    //   where.tank_status_cv = { in: this.searchForm!.value['tank_status'] };
    // }
    // else {
    //   where.tank_status_cv = { in: ['STEAM', 'STORAGE'] }
    // }

    if (this.searchForm!.value['tank_no']) {
      const tankNo = this.searchForm!.get('tank_no')?.value
      where.or = [
        { tank_no: { contains: Utility.formatContainerNumber(tankNo) } },
        { tank_no: { contains: Utility.formatTankNumberForSearch(tankNo) } }
      ]
    }

    if (this.lastCargoControl?.value) {
      if (!where.tariff_cleaning) where.tariff_cleaning = {};
      where.tariff_cleaning.cargo = { contains: this.lastCargoControl?.value?.cargo };
    }


    if (this.searchForm!.value['eir_no']) {
      if (!where.in_gate) where.in_gate = {};
      where.in_gate = { some: { eir_no: { contains: this.searchForm!.value['eir_no'] } } };
    }

    if (this.searchForm!.value['eir_dt_start'] && this.searchForm!.value['eir_dt_end']) {
      if (!where.in_gate) where.in_gate = {};
      where.in_gate = { some: { eir_dt: { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) } } };
    }

    if (this.customerCodeControl?.value) {
      if (!where.storing_order) where.storing_order = {};
      where.storing_order.customer_company = { code: { contains: this.customerCodeControl?.value?.code } };
    }

    if (this.searchForm!.value['est_dt']) {
      if (!where.steaming) where.steaming = {};
      if (!where.steaming.some) where.steaming.some = {};
      where.steaming.some.create_dt = { gte: Utility.convertDate(this.searchForm!.value['est_dt']), lte: Utility.convertDate(this.searchForm!.value['est_dt'], true) };
    }

    if (this.searchForm!.value['est_status_cv'].length) {
      if (!where.steaming) where.steaming = {};
      if (!where.steaming.some) where.steaming.some = {};
      where.steaming.some.status_cv = { in: this.searchForm!.value['est_status_cv'] };
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
    console.log(this.searchStateService.getPagination(this.pageStateType))
    this.subs.sink = this.sotDS.searchStoringOrderTanksSteamEstimate(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {
        if (data) {
          var steamingStatusFilter = this.searchForm!.value['est_status_cv'];
          this.sotList = data.map(sot => {
            sot.steaming = sot.steaming?.map(stm => {
              if (steamingStatusFilter.length) {
                if (steamingStatusFilter.includes(stm.status_cv)) {
                  var stm_part = [...stm.steaming_part!];
                  stm.steaming_part = stm_part?.filter(data => !data.delete_dt);
                  return { ...stm, net_cost: this.calculateNetCost(stm) };
                }
                return {};
              }
              else if (stm.status_cv !== 'CANCELED') {
                var stm_part = [...stm.steaming_part!];
                stm.steaming_part = stm_part?.filter(data => !data.delete_dt);
                return { ...stm, net_cost: this.calculateNetCost(stm) };
              }
              else {
                return {};
              }
            });
            return sot;
          });
        }
        this.sotList = this.sotList.map(sot => {
          sot.steaming = sot.steaming?.filter(stm => Object.keys(stm).length > 0);
          return sot;
        });
        this.RefreshSotNetCost();
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
    return cc && cc.code ? `${cc.code} - ${cc.name}` : '';
  }

  initializeFilterCustomerCompany() {
    this.customerCodeControl.valueChanges.pipe
      (
        startWith(''),
        debounceTime(300),
        tap(value => {
          var searchCriteria = '';
          if (typeof value === 'string') {
            searchCriteria = value;
          } else {
            searchCriteria = `${value?.code}`;
          }
          this.subs.sink = this.ccDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
            this.customer_companyList = data
          });
        })
      ).subscribe();

    this.lastCargoControl.valueChanges.pipe(
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

  calculateNetCostWithLabourCost(steam: SteamItem, LabourCost: number): any {
    let isApproved = this.IsApproved(steam);
    let total = this.IsApproved(steam) ? this.steamDS.getApprovalTotalWithLabourCost(steam?.steaming_part, LabourCost) : this.steamDS.getTotalWithLabourCost(steam?.steaming_part, LabourCost)
    const isAutoSteam = BusinessLogicUtil.isAutoApproveSteaming(steam);
    if (isAutoSteam) {
      total.total_mat_cost = steam.rate;

      if (!steam?.flat_rate) {
        total.total_mat_cost *= isApproved ? (steam?.total_hour || 1) : 1;
      }

    }
    return Utility.formatNumberDisplay(total.total_mat_cost);

    // const custGuid = steam.storing_order_tank?.storing_order?.customer_company_guid;

    // this.getCustomerLabourPackage(custGuid!)
    // .then(packLabourItem=>{
    //   const total = this.IsApproved(steam)?this.steamDS.getApprovalTotal(steam?.steaming_part):this.steamDS.getTotal(steam?.steaming_part)
    //   return total.total_mat_cost.toFixed(2);
    // //const total = this.steamDS.getTotal(steam?.steaming_part)
    // })
    // .catch(error=>{
    //   return 0;
    // });
  }

  calculateNetCost(steam: SteamItem): any {
    let isApproved = this.IsApproved(steam);
    let total = isApproved ? this.steamDS.getApprovalTotal(steam?.steaming_part) : this.steamDS.getTotal(steam?.steaming_part);
    const isAutoSteam = BusinessLogicUtil.isAutoApproveSteaming(steam);
    if (isAutoSteam) {
      total.total_mat_cost = steam.rate;

      if (!steam?.flat_rate) {
        total.total_mat_cost *= isApproved ? (steam?.total_hour || 1) : 1;
      }

    }

    return Utility.formatNumberDisplay(total.total_mat_cost);

    // const custGuid = steam.storing_order_tank?.storing_order?.customer_company_guid;

    // this.getCustomerLabourPackage(custGuid!)
    // .then(packLabourItem=>{
    //   const total = this.IsApproved(steam)?this.steamDS.getApprovalTotal(steam?.steaming_part):this.steamDS.getTotal(steam?.steaming_part)
    //   return total.total_mat_cost.toFixed(2);
    // //const total = this.steamDS.getTotal(steam?.steaming_part)
    // })
    // .catch(error=>{
    //   return 0;
    // });
  }


  IsApproved(steam: SteamItem) {
    //const validStatus = ['APPROVED', 'COMPLETED', 'QC_COMPLETED']
    return BusinessLogicUtil.isEstimateApproved(steam);

  }
  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
  }

  updateValidators(validOptions: any[]) {
    this.lastCargoControl.setValidators([
      AutocompleteSelectionValidator(validOptions)
    ]);
  }

  displayDate(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input);
  }

  resetDialog(event: Event) {
    event.preventDefault(); // Prevents the form submission
    this.resetForm();
    this.search();
  }

  resetForm() {
    this.searchForm?.patchValue({
      tank_no: '',
      eir_dt_start: '',
      eir_dt_end: '',
      part_name: '',
      status_cv: '',
      eir_no: '',
      est_dt: '',
      est_status_cv: '',
      current_status_cv: '',
      tank_status: ['STEAM']
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

  addSteamEstimate(event: Event, row: StoringOrderItem) {
    event.stopPropagation(); // Stop the click event from propagating
    // Navigate to the route and pass the JSON object
    this.router.navigate(['/admin/steam/estimate-approval/new/', row.guid], {
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

  pasteSteamEstimate(event: Event, sot: StoringOrderItem, row: SteamItem) {
    event.stopPropagation(); // Stop the click event from propagating
    // Navigate to the route and pass the JSON object
    this.router.navigate(['/admin/steam/estimate-approval/new/', row.guid], {
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
    this.router.navigate(['/admin/steam/estimate-approval/new/', row.guid], {
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

  approveRow(event: Event, row: SteamItem) {
    event.preventDefault();

    let re: any = new SteamItem();
    re.guid = row?.guid;
    re.sot_guid = row?.sot_guid;
    re.bill_to_guid = row?.storing_order_tank?.storing_order?.customer_company_guid;;
    re.status_cv = row?.status_cv;

    re.action = "APPROVE";
    re.steaming_part = row.steaming_part?.map((rep: SteamPartItem) => {
      return new SteamPartItem({
        ...rep,
        action: 'EDIT',
        tariff_steaming_guid: (rep.tariff_steaming_guid ? rep.tariff_steaming_guid : ''),
        approve_part: (rep.approve_part == null ? true : rep.approve_part),
        approve_qty: Number(this.IsApproved(row) ? rep.approve_qty : rep.quantity),
        approve_cost: Number(this.IsApproved(row) ? rep.approve_cost : rep.cost),
        approve_labour: Number(this.IsApproved(row) ? rep.approve_labour : rep.labour),
        // approve_qty: row rep.quantity,
        // approve_cost:rep.cost,
        // approve_labour:rep.labour,
        job_order: undefined
      })
    });
    console.log(re)
    this.steamDS.approveSteaming(re).subscribe(result => {
      console.log(result)
      this.search();
    });
  }

  getCustomerLabourPackage(sot: StoringOrderTankItem) {
    const customer_company_guid = sot.storing_order?.customer_company?.guid;
    const where = {
      and: [
        { customer_company_guid: { eq: customer_company_guid } }
      ]
    };
    this.plDS.getCustomerPackageCost(where).subscribe(data => {
      if (data.length > 0) {
        const cost = data[0].cost;
        sot.steaming = sot.steaming?.map(stm => {
          var stm_part = [...stm.steaming_part!];
          stm.steaming_part = stm_part?.filter(data => !data.delete_dt);
          return { ...stm, net_cost: this.calculateNetCostWithLabourCost(stm, cost) };
        });
      }
    });

  }

  RefreshSotNetCost() {
    this.sotList.map(sot => {
      this.getCustomerLabourPackage(sot);
    });
  }

  canApprove(steamItem: SteamItem) {
    return this.steamDS.canApprove(steamItem!) && !steamItem?.steaming_part?.[0]?.tariff_steaming_guid;
  }

  getMaxDate() {
    return new Date();
  }

  // IsApproved(steamItem:SteamItem):boolean
  // {
  //   const validStatus = [ 'APPROVED','COMPLETED','QC_COMPLETED']
  //   return validStatus.includes(steamItem?.status_cv!);

  // }

}