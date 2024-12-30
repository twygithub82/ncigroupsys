import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { NgClass, DatePipe, formatDate, CommonModule } from '@angular/common';
import { NgScrollbar } from 'ngx-scrollbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatRowDef, MatTableModule } from '@angular/material/table';
import { UnsubscribeOnDestroyAdapter, TableElement, TableExportUtil } from '@shared';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { Observable, fromEvent } from 'rxjs';
import { map, filter, tap, catchError, finalize, switchMap, debounceTime, startWith } from 'rxjs/operators';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { Utility } from 'app/utilities/utility';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoringOrderDS, StoringOrderGO, StoringOrderItem } from 'app/data-sources/storing-order';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem, addDefaultSelectOption } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from '@angular/material/divider';
import { CancelFormDialogComponent } from './dialogs/cancel-form-dialog/form-dialog.component';
import { ComponentUtil } from 'app/utilities/component-util';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { InGateDS } from 'app/data-sources/in-gate';
import { MatCardModule } from '@angular/material/card';

// import { RepairEstDS, RepairEstGO, RepairEstItem } from 'app/data-sources/repair-est';
// import { RepairEstPartItem } from 'app/data-sources/repair-est-part';
import { ResidueDS,ResidueItem, ResiduePartRequest, ResidueStatusRequest } from 'app/data-sources/residue';
import { RepairItem } from 'app/data-sources/repair';
import { ResiduePartItem } from 'app/data-sources/residue-part';

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
    FeatherIconsComponent,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatPaginatorModule,
    DatePipe,
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
export class ResidueDisposalEstimateApprovalComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
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
    //'approve_part',
    'actions'
  ];

  pageTitle = 'MENUITEMS.RESIDUE-DISPOSAL.LIST.RESIDUE-DISPOSAL-ESTIMATE-APPROVAL'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT'
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
    RESIDUE_JOB_NO: 'COMMON-FORM.RESIDUE-JOB-NO',
    APPROVE: 'COMMON-FORM.APPROVE',
    NO_ACTION: 'COMMON-FORM.NO-ACTION',
    
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

  cvDS: CodeValuesDS;
  soDS: StoringOrderDS;
  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  tcDS: TariffCleaningDS;
  igDS: InGateDS;
  residueDS:ResidueDS;
 // repairEstDS: RepairDS;

  sotList: StoringOrderTankItem[] = [];
  reSelection = new SelectionModel<ResidueItem>(true, []);
  selectedItemsPerPage: { [key: number]: Set<string> } = {};
  reStatusCvList: CodeValuesItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  processStatusCvList:CodeValuesItem[]=[];

  customerCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  customer_companyList?: CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];

  copiedResidueEst?: ResidueItem;

  pageIndex = 0;
  pageSize = 10;
  lastSearchCriteria: any;
  lastOrderBy: any = { storing_order: { so_no: "DESC" } };
  endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;
  previous_endCursor:any;
  

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
    this.residueDS= new ResidueDS(this.apollo);
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

    if(state.type=="residue-estimate")
    {
      let showResult = state.pagination.showResult;
      if(showResult)
      {
      this.lastSearchCriteria=state.pagination.where;
      this.pageIndex=state.pagination.pageIndex;
      this.pageSize= state.pagination.pageSize;
      this.hasPreviousPage=state.pagination.hasPreviousPage;
      this.startCursor=state.pagination.startCursor;
      this.endCursor=state.pagination.endCursor;
      this.previous_endCursor=state.pagination.previous_endCursor;
      this.paginator.pageSize=this.pageSize;
      this.paginator.pageIndex=this.pageIndex;
      this.onPageEvent({pageIndex:this.pageIndex,pageSize:this.pageSize,length:this.pageSize});
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
      last_cargo:[''],
      eir_dt_start: [''],
      eir_dt_end: [''],
      part_name: [''],
      bill_completed_cv: [''],
      status_cv: [''],
      eir_no: [''],
      residue_job_no: [''],
      repair_type_cv: [''],
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
         const reList = result.item.map((item: ResidueItem) => new ResidueItem(item));
         console.log(reList);

         let residueStatus : ResidueStatusRequest = new ResidueStatusRequest();
         residueStatus.action="CANCEL";
         residueStatus.guid = row[0]?.guid;
         residueStatus.sot_guid= row[0]?.sot_guid;
         residueStatus.remarks=reList[0].remarks;
          this.residueDS.updateResidueStatus(residueStatus).subscribe(result=>{
 
            this.handleCancelSuccess(result?.data?.UpdateResidueStatus)
            this.performSearch(this.pageSize, 0, this.pageSize);
          });
        //  this.residueDS.cancelResidue(reList).subscribe((result: { data: { cancelResidue: any; }; }) => {
        //    this.handleCancelSuccess(result?.data?.cancelResidue)
        //    this.performSearch(this.pageSize, 0, this.pageSize);
        //  });
      }
    });
  }
  

  rollbackRow(row: ResidueItem) {
    const found = this.reSelection.selected.some(x => x.guid === row.guid);
    let selectedList = [...this.reSelection.selected];
    if (!found) {
      // this.toggleRow(row);
      selectedList.push(row);
    }
    this.rollbackSelectedRows(selectedList)
  }

  rollbackSelectedRows(row: ResidueItem[]) {
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
          const ResidueEstimateRequestInput = {
            customer_guid: item.customer_company_guid,
            estimate_no: item.estimate_no,
            guid: item.guid,
            remarks: item.remarks,
            sot_guid: item.sot_guid,
            is_approved:item?.status_cv=="APPROVED"
          }
          return ResidueEstimateRequestInput;
        });
        console.log(reList);
        this.residueDS.rollbackResidue(reList).subscribe((result: { data: { rollbackResidue: any; }; }) => {
          this.handleRollbackSuccess(result?.data?.rollbackResidue)
          this.performSearch(this.pageSize, 0, this.pageSize);
        });
      }
    });
  }

  
  copyResidueEst(residueEst: ResidueItem) {
    this.copiedResidueEst = residueEst;
  }

  clearCopiedRepairEst() {
    this.copiedResidueEst = undefined;
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
      tank_status_cv: { in: ['CLEANING','STORAGE','REPAIR','STEAM'] }
    };

    if (this.searchForm!.value['tank_no']) {
      where.tank_no = { contains: this.searchForm!.value['tank_no'] };
    }

    if (this.searchForm!.value['last_cargo']) {
      
      if(!where.tariff_cleaning) where.tariff_cleaning={};

       where.tariff_cleaning.cargo = { contains: this.searchForm!.value['last_cargo'].cargo };
    }


    if (this.searchForm!.value['eir_no']) {
      if(!where.in_gate) where.in_gate={};
      where.in_gate = {some:{ eir_no:{contains: this.searchForm!.value['eir_no'] }}};
    }

    if (this.searchForm!.value['eir_dt_start'] && this.searchForm!.value['eir_dt_end']) {
      if(!where.in_gate) where.in_gate={};
      where.in_gate = {some:{eir_dt:{ gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) }}};
      //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
    }


    if (this.searchForm!.value['customer_code']) {
        where.customer_company = { code: { contains: this.searchForm!.value['customer_code'].code } };
    }

    
    if (this.searchForm!.value['part_name'] )
      {
        if(!where.residue) where.residue={};
        where.residue.some = {residue_part:{some:{description:{contains:this.searchForm!.value['part_name']}} }};
      }
    
    if ( this.searchForm!.value['residue_job_no'])
      {
        
        if(!where.residue) where.residue={};
        where.residue = {some:{ job_no:{contains: this.searchForm!.value['job_no'] }}};
      }

    if (this.searchForm!.value['est_dt_start'] && this.searchForm!.value['est_dt_end'])
      {
        if(!where.residue) where.residue={};
        if(!where.residue.some) where.residue.some={};
        where.residue.some.create_dt = { gte: Utility.convertDate(this.searchForm!.value['est_dt_start']), lte: Utility.convertDate(this.searchForm!.value['est_dt_end']) };
      }
        
    if (this.searchForm!.value['approval_dt_start'] && this.searchForm!.value['approval_dt_end'])
      {
        if(!where.residue) where.residue={};
        if(!where.residue.some) where.residue.some={};
        where.residue.some.approve_dt = { gte: Utility.convertDate(this.searchForm!.value['approval_dt_start']), lte: Utility.convertDate(this.searchForm!.value['approval_dt_end']) };
      }

      if (this.searchForm!.value['est_status_cv']!==undefined&&this.searchForm!.value['est_status_cv'].length>0 )
      {
        if(!where.residue) where.residue={};
        if(!where.residue.some) where.residue.some={};
        where.residue.some.status_cv={in:this.searchForm!.value['est_status_cv']} ;
      }
    // if (this.searchForm!.value['part_name'] || this.searchForm!.value['est_dt_start'] || this.searchForm!.value['est_dt_end']) {
    //   let reSome: any = {};

    //   if (this.searchForm!.value['part_name']) {
    //     reSome = {
    //       repair_est_part: {
    //         some: {
    //           tariff_repair: {
    //             part_name: { contains: this.searchForm!.value['part_name'] }
    //           }
    //         }
    //       }
    //     };
    //   }

    //   if (this.searchForm!.value['est_dt_start'] && this.searchForm!.value['est_dt_end']) {
    //     reSome.create_dt = { gte: Utility.convertDate(this.searchForm!.value['est_dt_start']), lte: Utility.convertDate(this.searchForm!.value['est_dt_end']) };
    //   }
    //   where.repair_est = { some: reSome };
    // }

   

    this.lastSearchCriteria = this.soDS.addDeleteDtCriteria(where);
    this.performSearch(this.pageSize, this.pageIndex, this.pageSize, undefined, undefined, undefined, () => {
      this.updatePageSelection();
    });
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, callback?: () => void) {
    this.subs.sink = this.sotDS.searchStoringOrderTanksResidueEstimate(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {
        this.sotList = data.map(sot => {
          sot.residue = sot.residue?.map(res => {
             var res_part=[...res.residue_part!];
             res.residue_part=res_part?.filter(data => !data.delete_dt);
            return { ...res, net_cost: this.calculateNetCost(res) }
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

  calculateNetCost(residue: ResidueItem): any {
    

    const total = this.IsApproved(residue)?this.residueDS.getApproveTotal(residue?.residue_part):this.residueDS.getTotal(residue?.residue_part)
     
     return total.total_mat_cost.toFixed(2);
  }

  IsApproved(residueItem:ResidueItem)
  {
    const validStatus = [ 'APPROVED','COMPLETED','QC_COMPLETED']
    return validStatus.includes(residueItem!.status_cv!);
    
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
      tank_no: '',
      customer_code: '',
      last_cargo:'',
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

  addResidueEstimate(event: Event, row:StoringOrderItem)
  {
    event.stopPropagation(); // Stop the click event from propagating
 // Navigate to the route and pass the JSON object
    this.router.navigate(['/admin/residue-disposal/estimate-approval/new/',row.guid], {
      state: { id: '' ,
        action:"NEW",
        selectedResidue:undefined,
        selectedRow:row,
        type:'residue-estimate',
        pagination:{
          where :this.lastSearchCriteria,
          pageSize:this.pageSize,
          pageIndex:this.pageIndex,
          hasPreviousPage:this.hasPreviousPage,
          startCursor:this.startCursor,
          endCursor:this.endCursor,
          previous_endCursor:this.previous_endCursor,
          
          showResult: this.sotDS.totalCount>0
          
        }
      }
    });
  }

  pasteResidueEstimate(event: Event, sot:StoringOrderItem, row:ResidueItem)
  {
    event.stopPropagation(); // Stop the click event from propagating
 // Navigate to the route and pass the JSON object
    this.router.navigate(['/admin/residue-disposal/estimate/new/',row.guid], {
      state: { id: '' ,
        action:"DUPLICATE",
        selectedResidue:row,
        selectedRow:sot,
        type:'residue-estimate',
        pagination:{
          where :this.lastSearchCriteria,
          pageSize:this.pageSize,
          pageIndex:this.pageIndex,
          hasPreviousPage:this.hasPreviousPage,
          startCursor:this.startCursor,
          endCursor:this.endCursor,
          previous_endCursor:this.previous_endCursor,
          
          showResult: this.sotDS.totalCount>0
          
        }
      }
    });
  }
  updateResidueEstimate(event: Event, sot:StoringOrderItem, row:ResidueItem)
  {
    event.stopPropagation(); // Stop the click event from propagating
 // Navigate to the route and pass the JSON object
    this.router.navigate(['/admin/residue-disposal/estimate-approval/new/',row.guid], {
      state: { id: '' ,
        action:"UPDATE",
        selectedResidue:row,
        selectedRow:sot,
        type:'residue-estimate',
        pagination:{
          where :this.lastSearchCriteria,
          pageSize:this.pageSize,
          pageIndex:this.pageIndex,
          hasPreviousPage:this.hasPreviousPage,
          startCursor:this.startCursor,
          endCursor:this.endCursor,
          previous_endCursor:this.previous_endCursor,
          
          showResult: this.sotDS.totalCount>0
          
        }
      }
    });
  }

  approveRow(event:Event,row: ResidueItem) {
    const found = this.reSelection.selected.some(x => x.guid === row.guid);
    let selectedList = [...this.reSelection.selected];
    if (!found) {
      // this.toggleRow(row);
      selectedList.push(row);
    }
    this.onApprove(event,row);
  }

   onNoAction(event: Event,row: ResidueItem) {
      this.preventDefault(event);
          
     
          let residueStatus : ResidueStatusRequest = new ResidueStatusRequest();
          residueStatus.action="NA";
          residueStatus.guid = row?.guid;
          residueStatus.sot_guid= row?.sot_guid;
          residueStatus.remarks='';
          residueStatus.residuePartRequests=[];
          row.residue_part?.forEach(d=>{
            var resPart :ResiduePartRequest = new ResiduePartRequest();
            resPart.guid=d.guid;
            resPart.approve_part=false;
            residueStatus.residuePartRequests?.push(resPart);
          });
           this.residueDS.updateResidueStatus(residueStatus).subscribe(result=>{
  
            console.log(result)
            this.search();
           });
          // this.residueDS.cancelResidue(reList).subscribe(result => {
          //   this.handleCancelSuccess(result?.data?.cancelResidue)
          // });
        }
      
    
 
   onApprove(event:Event,row: ResidueItem) {
       event.preventDefault();
       // const bill_to =(this.residueEstForm?.get("billing_branch")?.value?this.sotItem?.storing_order?.customer_company?.guid:this.residueEstForm?.get("billing_branch")?.value?.guid);
       
      // if (bill_to) {
          let re: ResidueItem = new ResidueItem(row);
          
           re.guid = row?.guid;
           re.sot_guid = row?.sot_guid;
           re.bill_to_guid = row?.storing_order_tank?.storing_order?.customer_company_guid;
           re.status_cv=row?.status_cv;
          // re.job_no=this.residueEstForm?.get("job_no")?.value
         //  re.remarks=this.residueEstForm?.get("remarks")?.value
          re.residue_part?.forEach((rep: any) => {
            rep.approve_qty = (this.IsApproved(row)?rep.approve_qty : rep.quantity) ;
           // rep.approve_hour = (rep.approve_part ?? !this.repairPartDS.is4X(rep.rp_damage_repair)) ? (rep.approve_hour ?? rep.hour) : 0;
            rep.approve_cost = (this.IsApproved(row)?rep.approve_cost : rep.cost);
          })
    
          re.residue_part = re.residue_part?.map((rep: ResiduePartItem) => {
            return new ResiduePartItem({
              ...rep,
              tariff_residue: undefined,
              approve_part: rep.approve_part,
               approve_qty:rep.approve_qty,
               approve_cost:rep.approve_cost
            })
          });
          delete re.storing_order_tank;
           console.log(re)
           this.residueDS.approveResidue(re).subscribe(result => {
             console.log(result)
             this.search();
            // this.handleSaveSuccess(result?.data?.approveResidue);
           });
      //  }
        //  } else {
        //    bill_to?.setErrors({ required: true })
        //    bill_to?.markAsTouched();
        //    bill_to?.updateValueAndValidity();
        //  }
      }
}