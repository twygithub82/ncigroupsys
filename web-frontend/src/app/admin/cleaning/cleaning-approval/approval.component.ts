import { Direction } from '@angular/cdk/bidi';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem, addDefaultSelectOption } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateDS, InGateItem } from 'app/data-sources/in-gate';
import { InGateCleaningDS, InGateCleaningItem } from 'app/data-sources/in-gate-cleaning';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { CleaningEstimatePdfComponent } from 'app/document-template/pdf/cleaning-estimate-pdf/cleaning-estimate-pdf.component';
import { ModulePackageService } from 'app/services/module-package.service';
import { SearchStateService } from 'app/services/search-criteria.service';
import { Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { FormDialogComponent } from './form-dialog/form-dialog.component';

@Component({
  selector: 'app-in-gate',
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
export class CleaningApprovalComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'tank_no',
    'customer',
    'eir_no',
    'eir_dt',
    'last_cargo',
    'method',
    'purpose',
    'tank_status_cv',
    'actions'
  ];

  pageTitle = 'MENUITEMS.CLEANING.LIST.APPROVAL'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.CLEANING.TEXT', route: '/admin/cleaning/approval' }
  ]

  translatedLangText: any = {};
  langText = {
    STATUS: 'COMMON-FORM.STATUS',
    SO_NO: 'COMMON-FORM.SO-NO',
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    CUSTOMER_NAME: 'COMMON-FORM.CUSTOMER-NAME',
    SO_DATE: 'COMMON-FORM.SO-DATE',
    NO_OF_TANKS: 'COMMON-FORM.NO-OF-TANKS',
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
    CANCELED_SUCCESS: 'COMMON-FORM.CANCELED-SUCCESS',
    SEARCH: 'COMMON-FORM.SEARCH',
    EIR_NO: 'COMMON-FORM.EIR-NO',
    EIR_DATE: 'COMMON-FORM.EIR-DATE',
    CONFIRM_RESET: 'COMMON-FORM.CONFIRM-RESET',
    CONFIRM_CLEAR_ALL: 'COMMON-FORM.CONFIRM-CLEAR-ALL',
    EIR_STATUS: 'COMMON-FORM.EIR-STATUS',
    TANK_STATUS: 'COMMON-FORM.TANK-STATUS',
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    KIV: "COMMON-FORM.KIV",
    NO_ACTION: "COMMON-FORM.NO-ACTION",
    APPROVE: "COMMON-FORM.APPROVE",
    APPROVED_DATE: "COMMON-FORM.APPROVED-DATE",
    QUOTATION_DATE: "COMMON-FORM.QUOTATION-DATE",
    APPROVAL_STATUS: "COMMON-FORM.APPROVAL-STATUS",
    METHOD: "COMMON-FORM.METHOD",
    EXPORT: "COMMON-FORM.EXPORT",
    APPROVED_COST: "COMMON-FORM.APPROVED-COST"
  }

  availableTankStatus: string[] = [
    'CLEANING',
    'STORAGE'
  ]

  availableProcessStatus: string[] = [
    // 'ASSIGNED',
    'APPROVED',
    // 'JOB_IN_PROGRESS',
    //'COMPLETED',
    // 'NO_ACTION',
    'KIV'
  ]

  searchForm?: UntypedFormGroup;
  customerCodeControl = new UntypedFormControl();

  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  cvDS: CodeValuesDS;
  igCleanDS: InGateCleaningDS;
  tcDS: TariffCleaningDS;

  inGateList: InGateCleaningItem[] = [];
  customer_companyList?: CustomerCompanyItem[];
  purposeOptionCvList: CodeValuesItem[] = [];
  eirStatusCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  processStatusCvList: CodeValuesItem[] = [];

  lastCargoControl = new UntypedFormControl();
  last_cargoList?: TariffCleaningItem[];

  pageStateType = 'CleaningApproval'
  pageIndex = 0;
  pageSize = 10;
  lastSearchCriteria: any;
  lastOrderBy: any = { create_dt: "DESC" };
  endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;
  previous_endCursor: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private searchStateService: SearchStateService,
    public modulePackageService: ModulePackageService
  ) {
    super();
    this.translateLangText();
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.igCleanDS = new InGateCleaningDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.lastCargoControl = new UntypedFormControl('', [AutocompleteSelectionValidator(this.last_cargoList)]);
    this.initSearchForm();
    this.initializeValueChanges();
    this.searchStateService.clearOtherPages(this.pageStateType);
    this.loadData();
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      tank_no: [''],
      customer_code: this.customerCodeControl,
      eir_no: [''],
      last_cargo: this.lastCargoControl,
      approval_status: [''],
    });
  }

  initializeValueChanges() {
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
          this.updateValidators(this.customerCodeControl, this.customer_companyList);
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
          this.updateValidators(this.lastCargoControl, this.last_cargoList);
        });
      })
    ).subscribe();
  }

  public loadData() {
    const queries = [
      { alias: 'processStatusCv', codeValType: 'PROCESS_STATUS' },
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'eirStatusCv', codeValType: 'EIR_STATUS' },
      { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      this.purposeOptionCvList = data;
    });
    this.cvDS.connectAlias('eirStatusCv').subscribe(data => {
      this.eirStatusCvList = addDefaultSelectOption(data, 'All');;
    });
    this.cvDS.connectAlias('tankStatusCv').subscribe(data => {
      this.tankStatusCvList = addDefaultSelectOption(data, 'All');
    });

    this.cvDS.connectAlias('processStatusCv').subscribe(data => {
      this.processStatusCvList = data;
    });

    const savedCriteria = this.searchStateService.getCriteria(this.pageStateType);
    const savedPagination = this.searchStateService.getPagination(this.pageStateType);

    if (savedCriteria) {
      this.searchForm?.patchValue(savedCriteria);
      this.constructSearchCriteria();
    }

    if (savedPagination) {
      this.pageIndex = savedPagination.pageIndex;
      this.pageSize = savedPagination.pageSize;

      this.searchData(
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
      storing_order_tank: {
        tank_status_cv: { in: ["CLEANING", "STORAGE"] },
        purpose_cleaning: { eq: true }
      }
    };

    if (this.searchForm!.get('tank_no')?.value) {
      const tankNo = this.searchForm!.get('tank_no')?.value;
      where.storing_order_tank.or = [
        { tank_no: { contains: Utility.formatContainerNumber(tankNo) } },
        { tank_no: { contains: Utility.formatTankNumberForSearch(tankNo) } }
      ]
      // where.storing_order_tank.tank_no = { contains: this.searchForm!.get('tank_no')?.value };
    }

    if (this.searchForm!.get('eir_no')?.value) {
      if (!where.storing_order_tank.in_gate) where.storing_order_tank.in_gate = {};
      where.storing_order_tank.in_gate = { some: { eir_no: { contains: this.searchForm!.value['eir_no'] } } };
    }

    if (this.searchForm?.get("approval_status")?.value) {
      if (this.searchForm?.get("approval_status")?.value.length > 0) {
        where.status_cv = { in: this.searchForm!.value['approval_status'] };
      }
    }
    else {
      where.status_cv = {
        in: this.availableProcessStatus
      };
    }

    if (this.searchForm!.get('start_approved_date')?.value && this.searchForm!.get('end_approved_date')?.value) {
      where.approve_dt = { gte: Utility.convertDate(this.searchForm!.value['start_approved_date']), lte: Utility.convertDate(this.searchForm!.value['end_approved_date']) };
    }

    if (this.searchForm!.get('start_quotation_date')?.value && this.searchForm!.get('end_quotation_date')?.value) {
      if (!where.storing_order_tank) where.storing_order_tank = {};
      if (!where.storing_order_tank.in_gate) where.storing_order_tank.in_gate = {};
      where.storing_order_tank.in_gate = { some: { eir_dt: { gte: Utility.convertDate(this.searchForm!.value['start_quotation_date']), lte: Utility.convertDate(this.searchForm!.value['end_quotation_date']) } } };
    }

    if (this.searchForm!.get('customer_code')?.value) {
      where.customer_company = { code: { contains: this.searchForm!.value['customer_code'].code } };
    }

    if (this.searchForm!.get('job_no')?.value) {

      where.job_no = { contains: this.searchForm!.value['job_no'].code };
    }
    this.lastSearchCriteria = where;
  }

  search() {
    this.constructSearchCriteria();
    this.searchData(this.pageSize, 0, this.pageSize, undefined, undefined, undefined);
  }

  searchData(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string) {
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
    this.previous_endCursor = after;
    this.subs.sink = this.igCleanDS.search(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before).subscribe(data => {
      this.inGateList = data;
      this.endCursor = this.igCleanDS.pageInfo?.endCursor;
      this.startCursor = this.igCleanDS.pageInfo?.startCursor;
      this.hasNextPage = this.igCleanDS.pageInfo?.hasNextPage ?? false;
      this.hasPreviousPage = this.igCleanDS.pageInfo?.hasPreviousPage ?? false;
      this.pageIndex = pageIndex;
      this.paginator.pageIndex = this.pageIndex;
      if (!this.hasPreviousPage)
        this.previous_endCursor = undefined;
    });
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

    this.searchData(pageSize, pageIndex, first, after, last, before);
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
  }

  displayTankPurpose(sot: StoringOrderTankItem) {
    return this.sotDS.displayTankPurpose(sot, this.getPurposeOptionDescription.bind(this));
  }

  getPurposeOptionDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.purposeOptionCvList);
  }

  getEirStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.eirStatusCvList);
  }

  displayDate(input: number | undefined): string | undefined {
    let retval = (input ? Utility.convertEpochToDateStr(input) : '-');
    return retval;
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  updateValidators(untypedFormControl: UntypedFormControl, validOptions: any[]) {
    untypedFormControl.setValidators([
      AutocompleteSelectionValidator(validOptions)
    ]);
  }

  resetDialog(event: Event) {
    event.preventDefault(); // Prevents the form submission
    this.resetForm();
    this.search();
  }

  resetForm() {
    this.searchForm?.patchValue({
      tank_no: '',
      eir_no: '',
      approval_status: '',

    });
    this.customerCodeControl.reset('');
    this.lastCargoControl.reset('');
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

  ApproveTank(row: InGateCleaningItem) {
    this.popupDialogForm(row, "approve");
  }

  NoActionTank(row: InGateCleaningItem) {
    this.popupDialogForm(row, "no_action");
  }

  KIVTank(row: InGateCleaningItem) {
    this.popupDialogForm(row, "kiv");
  }

  AdjustCost(row: InGateCleaningItem) {
    this.popupDialogForm(row, "cost");
  }

  ViewTank(row: InGateCleaningItem) {
    if(row.status_cv == "KIV")
      this.popupDialogForm(row, "kiv");
    else
      this.popupDialogForm(row, "view");
  }

  popupDialogForm(row: InGateItem, action: string) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    var rows: InGateCleaningItem[] = [];
    rows.push(row);
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '50vw',
      data: {
        action: action,
        langText: this.langText,
        selectedItems: rows
      },
      position: {
        top: '50px'
      }
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result > 0) {
          this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
        }
      }
    });

  }

  onRowClick(event: MouseEvent, row: any, menuTrigger: MatMenuTrigger) {
    // You can handle any logic here before opening the menu, e.g., storing the clicked row data.
    //console.log('Row clicked:', row);

    // Open the MatMenu
    menuTrigger.openMenu();
  }

  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
  }

  displayTankStatus(status: string): string {
    var retval: string = "-";

    retval = this.processStatusCvList!
      .filter(item => item.code_val === status)
      .map(item => item.description)[0]!; // Returns the description of the first match

    if (retval === "") retval = "-"
    return retval;
  }

  MenuButtonHidden(row: InGateCleaningItem) {
    const hiddenMenuStatus = ['JOB_IN_PROGRESS', "QC_COMPLETED", "COMPLETED"];
    var bRetval: Boolean = false;
    bRetval = hiddenMenuStatus.includes(row.status_cv!);
    if (!bRetval) {
      if (row.status_cv === "NO_ACTION" && row.storing_order_tank?.repair?.length! > 0) {
        var validStatus: string[] = ['APPROVED', 'PENDING', "QC_COMPLETED", "CANCEL"]
        const allPending = row.storing_order_tank?.repair?.every((item: any) => validStatus.includes(item.status_cv)) ?? false;
        bRetval = !allPending;
      }
    }
    return bRetval;

  }

  HiddenMenuApprovedCost(row: InGateCleaningItem): Boolean {
    var bRetval: Boolean = false;
    bRetval = row.status_cv != 'APPROVED';
    return bRetval;
  }

  HiddenMenu(row: InGateCleaningItem, statusMenu: String): Boolean {
    var bRetval: Boolean = false;

    bRetval = (row.status_cv === statusMenu);
    if (!bRetval) bRetval = (row.status_cv == 'JOB_IN_PROGRESS');
    if (statusMenu === "APPROVED") bRetval = (row.status_cv == 'ASSIGNED' || row.status_cv == 'APPROVED');

    return bRetval;
  }

  canExport(row: any): boolean {
    return !this.modulePackageService.isStarterPackage();
  }

  onExport(event: Event, row: any) {
    this.preventDefault(event);
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(CleaningEstimatePdfComponent, {
      width: '794px',
      height: '80vh',
      data: {
        cleaning_guid: row?.guid,
      },
      // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    });
  }
}