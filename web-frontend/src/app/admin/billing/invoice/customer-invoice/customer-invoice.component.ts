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
import { MatTableModule } from '@angular/material/table';
import { UnsubscribeOnDestroyAdapter, TableElement, TableExportUtil } from '@shared';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { Observable, fromEvent } from 'rxjs';
import { map, filter, tap, catchError, finalize, switchMap, debounceTime, startWith } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { Utility } from 'app/utilities/utility';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoringOrderDS, StoringOrderItem } from 'app/data-sources/storing-order';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem, addDefaultSelectOption } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from '@angular/material/divider';
import { ComponentUtil } from 'app/utilities/component-util';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { InGateDS, InGateItem } from 'app/data-sources/in-gate';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { CurrencyDS, CurrencyItem } from 'app/data-sources/currency';
import {BillingDS,BillingItem,BillingSOTItem,report_billing_customer,report_billing_item}from 'app/data-sources/billing';
import {InGateCleaningItem} from 'app/data-sources/in-gate-cleaning';
import { RepairPartItem } from 'app/data-sources/repair-part';
import {RepairDS, RepairItem}from 'app/data-sources/repair';
import { ResidueItem } from 'app/data-sources/residue';
import { PackageDepotDS, PackageDepotItem } from 'app/data-sources/package-depot';
import { SteamItem } from 'app/data-sources/steam';



@Component({
  selector: 'app-customer-invoice',
  standalone: true,
  templateUrl: './customer-invoice.component.html',
  styleUrl: './customer-invoice.component.scss',
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
  ]
})
export class CustomerInvoiceComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'tank_no',
    'customer',
    'eir_no',
    'eir_dt',
    'last_cargo',
    'purpose',
    'tank_status_cv'
  ];

  pageTitle = 'MENUITEMS.INVENTORY.LIST.TANK-MOVEMENT'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT'
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
    RO_NO: 'COMMON-FORM.RO-NO',
    RELEASE_DATE:'COMMON-FORM.RELEASE-DATE',
    INVOICE_DATE:'COMMON-FORM.INVOICE-DATE',
    INVOICE_NO:'COMMON-FORM.INVOICE-NO',
    BILLING_CURRENCY:'COMMON-FORM.BILLING-CURRENCY',
    BILLING_BRANCH:'COMMON-FORM.BILLING-BRANCH',
  }

  searchForm?: UntypedFormGroup;
  customerCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  branchCodeControl = new UntypedFormControl();

  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  cvDS: CodeValuesDS;
  tcDS: TariffCleaningDS;
  curDS: CurrencyDS;
  billDS:BillingDS;
  repDS:RepairDS;
  pdDS:PackageDepotDS;

  sotList: StoringOrderTankItem[] = [];
  customer_companyList?: CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];
  purposeOptionCvList: CodeValuesItem[] = [];
  eirStatusCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  tankStatusCvListDisplay: CodeValuesItem[] = [];
  yardCvList: CodeValuesItem[] = [];

  currencyList:CurrencyItem[]=[];
  branch_companyList:CustomerCompanyItem[]=[]

  billList:BillingItem[]=[];

  pageIndex = 0;
  pageSize = 10;
  lastSearchCriteria: any;
  lastOrderBy: any = { create_dt: "DESC" };
  endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;

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
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);
    this.curDS=new CurrencyDS(this.apollo);
    this.billDS=new BillingDS(this.apollo);
    this.repDS=new RepairDS(this.apollo);
    this.pdDS=new PackageDepotDS(this.apollo);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.initializeValueChanges();
    // this.lastCargoControl = new UntypedFormControl('', [Validators.required, AutocompleteSelectionValidator(this.last_cargoList)]);
    this.loadData();
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      so_no: [''],
      customer_code: this.customerCodeControl,
      branch_code:this.branchCodeControl,
      last_cargo: this.lastCargoControl,
      currency:[''],
      eir_no: [''],
      ro_no: [''],
      eir_dt:[''],
      release_dt:[''],
      inv_dt_start: [''],
      inv_dt_end: [''],
      eir_dt_start: [''],
      eir_dt_end: [''],
      tank_no: [''],
      inv_no:[''],
      job_no: [''],
      purpose: [''],
      tank_status_cv: [''],
      eir_status_cv: [''],
      yard_cv: ['']
    });
  }

  initializeValueChanges() {
    this.searchForm!.get('customer_code')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        this.branch_companyList=[];
        this.branchCodeControl.reset('');
        if (typeof value === 'string') {
          searchCriteria = value;
        } else {
          searchCriteria = value.code;
        }
        this.subs.sink = this.ccDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
          this.customer_companyList = data
          this.updateValidators(this.customerCodeControl, this.customer_companyList);
          if(!this.customerCodeControl.invalid)
          {
            if(this.customerCodeControl.value?.guid)
            {
              let mainCustomerGuid = this.customerCodeControl.value.guid;
              this.ccDS.loadItems({main_customer_guid:{eq:mainCustomerGuid}}).subscribe(data=>{
                this.branch_companyList=data;
                this.updateValidators(this.branchCodeControl, this.branch_companyList);
              });
            }
          }
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
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'eirStatusCv', codeValType: 'EIR_STATUS' },
      { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
      { alias: 'yardCv', codeValType: 'YARD' },
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      this.purposeOptionCvList = data;
    });
    this.cvDS.connectAlias('eirStatusCv').subscribe(data => {
      this.eirStatusCvList = addDefaultSelectOption(data, 'All');;
    });
    this.cvDS.connectAlias('tankStatusCv').subscribe(data => {
      this.tankStatusCvListDisplay = data;
      this.tankStatusCvList = addDefaultSelectOption(data, 'All');
    });
    this.cvDS.connectAlias('yardCv').subscribe(data => {
      this.yardCvList = addDefaultSelectOption(data, 'All');
    });

    this.curDS.search({},{sequence:'ASC'},100).subscribe(data=>{
      this.currencyList=data;
    });
    //this.search();
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
    const where: any = {};

    if (this.searchForm!.get('tank_no')?.value) {
      where.tank_no = { contains: this.searchForm!.get('tank_no')?.value };
    }

    if (this.searchForm!.get('eir_status_cv')?.value) {
      where.eir_status_cv = { contains: this.searchForm!.get('eir_status_cv')?.value };
    }

    if (this.searchForm!.get('eir_dt_start')?.value && this.searchForm!.get('eir_dt_end')?.value) {
      where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
    }

    if (this.searchForm!.get('customer_code')?.value) {
      const soSearch: any = {};
      if (this.searchForm!.get('customer_code')?.value) {
        soSearch.customer_company = { guid: { contains: this.searchForm!.get('customer_code')?.value.guid } };
      }
      where.storing_order = soSearch;
    }

   

    this.lastSearchCriteria = this.sotDS.addDeleteDtCriteria(where);
    this.performSearch(this.pageSize, this.pageIndex, this.pageSize, undefined, undefined, undefined);
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string) {
    this.subs.sink = this.sotDS.searchStoringOrderTankForMovement(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {
        this.sotList = data;
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

    this.performSearch(pageSize, pageIndex, first, after, last, before);
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
  }

  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
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

  getPurposeOptionDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.purposeOptionCvList);
  }

  getTankStatusDescription(codeValType: string): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.tankStatusCvListDisplay);
  }

  displayDate(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input);
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

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        headerText: this.translatedLangText.CONFIRM_CLEAR_ALL,
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
      eir_no: '',
      eir_dt_start: '',
      eir_dt_end: '',
      tank_no: '',
      job_no: '',
      purpose: '',
      tank_status_cv: '',
      eir_status_cv: ''
    });
    this.customerCodeControl.reset('');
  }

  searchBilling() {
      const where: any ={};
      
         where.and=[];
  
         const itm:any={or:[]};
         itm.or.push({cleaning:{any:true }});
         itm.or.push({repair_customer:{any: true }});
         itm.or.push({repair_owner:{any: true }});
         itm.or.push({residue:{any: true }});
         itm.or.push({steaming:{any: true }});
         itm.or.push({gateio_billing_sot:{any: true }});
         itm.or.push({lolo_billing_sot:{any: true }});
         itm.or.push({preinsp_billing_sot:{any: true }});
         itm.or.push({storage_billing_sot:{any: true }});
         where.and.push(itm);
  
  
         where.guid={neq:null};
         if (this.searchForm!.get('tank_no')?.value) {
          const itm:any={or:[]};
          
          itm.or.push({cleaning:{some:{storing_order_tank:{tank_no:{contains: this.searchForm!.get('tank_no')?.value}}}}});
          itm.or.push({repair_customer:{some:{storing_order_tank:{tank_no:{contains: this.searchForm!.get('tank_no')?.value}}}}});
          itm.or.push({repair_owner:{some:{storing_order_tank:{tank_no:{contains: this.searchForm!.get('tank_no')?.value}}}}});
          itm.or.push({residue:{some:{storing_order_tank:{tank_no:{contains: this.searchForm!.get('tank_no')?.value}}}}});
          itm.or.push({steaming:{some:{storing_order_tank:{tank_no:{contains: this.searchForm!.get('tank_no')?.value}}}}});
          itm.or.push({gateio_billing_sot:{some:{storing_order_tank:{tank_no:{contains: this.searchForm!.get('tank_no')?.value}}}}});
          itm.or.push({lolo_billing_sot:{some:{storing_order_tank:{tank_no:{contains: this.searchForm!.get('tank_no')?.value}}}}});
          itm.or.push({preinsp_billing_sot:{some:{storing_order_tank:{tank_no:{contains: this.searchForm!.get('tank_no')?.value}}}}});
          itm.or.push({storage_billing_sot:{some:{storing_order_tank:{tank_no:{contains: this.searchForm!.get('tank_no')?.value}}}}});
          where.and.push(itm);
          // where.storing_order_tank = { tank_no: {contains: this.searchForm!.get('tank_no')?.value }};
         }
     
         if(this.searchForm!.get('invoice_no')?.value)
           {
             where.invoice_no={contains: this.searchForm!.get('invoice_no')?.value};
           }
     
         if (this.searchForm!.get('customer_code')?.value) {
           if(!where.customer_company) where.customer_company={};
           where.customer_company = { code:{eq: this.searchForm!.get('customer_code')?.value.code }};
           // where.storing_order_tank={customer_company:{code:{eq: this.searchForm!.get('customer_code')?.value.code }}};
         }
     
         if(this.searchForm!.get('branch_code')?.value)
         {
  
          const itm:any={or:[]};
          
          itm.or.push({cleaning:{some:{storing_order_tank:{storing_order:{eq: this.searchForm!.get('branch_code')?.value.guid}}}}});
          itm.or.push({repair_customer:{some:{storing_order_tank:{storing_order:{eq: this.searchForm!.get('branch_code')?.value.guid}}}}});
          itm.or.push({repair_owner:{some:{storing_order_tank:{storing_order:{eq: this.searchForm!.get('branch_code')?.value.guid}}}}});
          itm.or.push({residue:{some:{storing_order_tank:{storing_order:{eq: this.searchForm!.get('branch_code')?.value.guid}}}}});
          itm.or.push({steaming:{some:{storing_order_tank:{storing_order:{eq: this.searchForm!.get('branch_code')?.value.guid}}}}});
          itm.or.push({gateio_billing_sot:{some:{storing_order_tank:{storing_order:{eq: this.searchForm!.get('branch_code')?.value.guid}}}}});
          itm.or.push({lolo_billing_sot:{some:{storing_order_tank:{storing_order:{eq: this.searchForm!.get('branch_code')?.value.guid}}}}});
          itm.or.push({preinsp_billing_sot:{some:{storing_order_tank:{storing_order:{eq: this.searchForm!.get('branch_code')?.value.guid}}}}});
          itm.or.push({storage_billing_sot:{some:{storing_order_tank:{storing_order:{eq: this.searchForm!.get('branch_code')?.value.guid}}}}});
          where.and.push(itm);
         }
     
         if (this.searchForm!.get('eir_dt')?.value) {
          //  if(!where.storing_order_tank) where.storing_order_tank={};
          //  where.storing_order_tank.in_gate = { some:{and:[{eir_dt:{lte: Utility.convertDate(this.searchForm!.value['eir_dt'],true) }},
          //      {or:[{delete_dt:{eq:0}},{delete_dt:{eq:null}}]}]}};
  
           const itm:any={or:[]};
          
           itm.or.push({cleaning:{some:{storing_order_tank:{in_gate:{some:{and:[{eir_dt:{lte: Utility.convertDate(this.searchForm!.value['eir_dt'],true) }},
           {or:[{delete_dt:{eq:0}},{delete_dt:{eq:null}}]}]}}}}}});
           itm.or.push({repair_customer:{some:{storing_order_tank:{in_gate:{some:{and:[{eir_dt:{lte: Utility.convertDate(this.searchForm!.value['eir_dt'],true) }},
           {or:[{delete_dt:{eq:0}},{delete_dt:{eq:null}}]}]}}}}}});
           itm.or.push({repair_owner:{some:{storing_order_tank:{in_gate:{some:{and:[{eir_dt:{lte: Utility.convertDate(this.searchForm!.value['eir_dt'],true) }},
           {or:[{delete_dt:{eq:0}},{delete_dt:{eq:null}}]}]}}}}}});
           itm.or.push({residue:{some:{storing_order_tank:{in_gate:{some:{and:[{eir_dt:{lte: Utility.convertDate(this.searchForm!.value['eir_dt'],true) }},
           {or:[{delete_dt:{eq:0}},{delete_dt:{eq:null}}]}]}}}}}});
           itm.or.push({steaming:{some:{storing_order_tank:{in_gate:{some:{and:[{eir_dt:{lte: Utility.convertDate(this.searchForm!.value['eir_dt'],true) }},
           {or:[{delete_dt:{eq:0}},{delete_dt:{eq:null}}]}]}}}}}});
           itm.or.push({gateio_billing_sot:{some:{storing_order_tank:{in_gate:{some:{and:[{eir_dt:{lte: Utility.convertDate(this.searchForm!.value['eir_dt'],true) }},
           {or:[{delete_dt:{eq:0}},{delete_dt:{eq:null}}]}]}}}}}});
           itm.or.push({lolo_billing_sot:{some:{storing_order_tank:{in_gate:{some:{and:[{eir_dt:{lte: Utility.convertDate(this.searchForm!.value['eir_dt'],true) }},
           {or:[{delete_dt:{eq:0}},{delete_dt:{eq:null}}]}]}}}}}});
           itm.or.push({preinsp_billing_sot:{some:{storing_order_tank:{in_gate:{some:{and:[{eir_dt:{lte: Utility.convertDate(this.searchForm!.value['eir_dt'],true) }},
           {or:[{delete_dt:{eq:0}},{delete_dt:{eq:null}}]}]}}}}}});
           itm.or.push({storage_billing_sot:{some:{storing_order_tank:{in_gate:{some:{and:[{eir_dt:{lte: Utility.convertDate(this.searchForm!.value['eir_dt'],true) }},
           {or:[{delete_dt:{eq:0}},{delete_dt:{eq:null}}]}]}}}}}});
  
           where.and.push(itm);
         }
         if (this.searchForm!.get('eir_no')?.value) {
          //  if(!where.storing_order_tank) where.storing_order_tank={};
          //  where.storing_order_tank.in_gate = { some:{eir_no:{contains: this.searchForm!.get('eir_no')?.value }}};
  
           const itm:any={or:[]};
          
           itm.or.push({cleaning:{some:{storing_order_tank:{in_gate:{some:{eir_no:{contains: this.searchForm!.get('eir_no')?.value }}}}}}});
           itm.or.push({repair_customer:{some:{storing_order_tank:{in_gate:{some:{eir_no:{contains: this.searchForm!.get('eir_no')?.value }}}}}}});
           itm.or.push({repair_owner:{some:{storing_order_tank:{in_gate:{some:{eir_no:{contains: this.searchForm!.get('eir_no')?.value }}}}}}});
           itm.or.push({residue:{some:{storing_order_tank:{in_gate:{some:{eir_no:{contains: this.searchForm!.get('eir_no')?.value }}}}}}});
           itm.or.push({steaming:{some:{storing_order_tank:{in_gate:{some:{eir_no:{contains: this.searchForm!.get('eir_no')?.value }}}}}}});
           itm.or.push({gateio_billing_sot:{some:{storing_order_tank:{in_gate:{some:{eir_no:{contains: this.searchForm!.get('eir_no')?.value }}}}}}});
           itm.or.push({lolo_billing_sot:{some:{storing_order_tank:{in_gate:{some:{eir_no:{contains: this.searchForm!.get('eir_no')?.value }}}}}}});
           itm.or.push({preinsp_billing_sot:{some:{storing_order_tank:{in_gate:{some:{eir_no:{contains: this.searchForm!.get('eir_no')?.value }}}}}}});
           itm.or.push({storage_billing_sot:{some:{storing_order_tank:{in_gate:{some:{eir_no:{contains: this.searchForm!.get('eir_no')?.value }}}}}}});
  
           where.and.push(itm);
         }
     
         if (this.searchForm!.get('inv_dt_start')?.value && this.searchForm!.get('inv_dt_end')?.value) {
           //if(!where.gateio_billing) where.gateio_billing={};
           where.invoice_dt={gte: Utility.convertDate(this.searchForm!.value['inv_dt_start']), lte: Utility.convertDate(this.searchForm!.value['inv_dt_end'],true) };
           //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
         }
     
        //  if (this.searchForm!.get('cutoff_dt')?.value) {
           
        //    where.create_dt={lte: Utility.convertDate(this.searchForm!.value['cutoff_dt'],true) };
        //    //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
        //  }
     
         if (this.searchForm!.get('release_dt')?.value) {
          //  if(!where.storing_order_tank) where.storing_order_tank={};
          //  where.storing_order_tank.out_gate={some:{out_gate_survey:{and:[{create_dt:{lte:Utility.convertDate(this.searchForm!.value['release_dt'],true)}},
          //  {or:[{delete_dt:{eq:0}},{delete_dt:{eq:null}}]}]}}};
           //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
  
           const itm:any={or:[]};
          
           itm.or.push({cleaning:{some:{storing_order_tank:{out_gate:{some:{out_gate_survey:{and:[{create_dt:{lte:Utility.convertDate(this.searchForm!.value['release_dt'],true)}},
           {or:[{delete_dt:{eq:0}},{delete_dt:{eq:null}}]}]}}}}}}});
           itm.or.push({repair_customer:{some:{storing_order_tank:{out_gate:{some:{out_gate_survey:{and:[{create_dt:{lte:Utility.convertDate(this.searchForm!.value['release_dt'],true)}},
           {or:[{delete_dt:{eq:0}},{delete_dt:{eq:null}}]}]}}}}}}});
           itm.or.push({repair_owner:{some:{storing_order_tank:{out_gate:{some:{out_gate_survey:{and:[{create_dt:{lte:Utility.convertDate(this.searchForm!.value['release_dt'],true)}},
           {or:[{delete_dt:{eq:0}},{delete_dt:{eq:null}}]}]}}}}}}});
           itm.or.push({residue:{some:{storing_order_tank:{out_gate:{some:{out_gate_survey:{and:[{create_dt:{lte:Utility.convertDate(this.searchForm!.value['release_dt'],true)}},
           {or:[{delete_dt:{eq:0}},{delete_dt:{eq:null}}]}]}}}}}}});
           itm.or.push({steaming:{some:{storing_order_tank:{out_gate:{some:{out_gate_survey:{and:[{create_dt:{lte:Utility.convertDate(this.searchForm!.value['release_dt'],true)}},
           {or:[{delete_dt:{eq:0}},{delete_dt:{eq:null}}]}]}}}}}}});
           itm.or.push({gateio_billing_sot:{some:{storing_order_tank:{out_gate:{some:{out_gate_survey:{and:[{create_dt:{lte:Utility.convertDate(this.searchForm!.value['release_dt'],true)}},
           {or:[{delete_dt:{eq:0}},{delete_dt:{eq:null}}]}]}}}}}}});
           itm.or.push({lolo_billing_sot:{some:{storing_order_tank:{out_gate:{some:{out_gate_survey:{and:[{create_dt:{lte:Utility.convertDate(this.searchForm!.value['release_dt'],true)}},
           {or:[{delete_dt:{eq:0}},{delete_dt:{eq:null}}]}]}}}}}}});
           itm.or.push({preinsp_billing_sot:{some:{storing_order_tank:{out_gate:{some:{out_gate_survey:{and:[{create_dt:{lte:Utility.convertDate(this.searchForm!.value['release_dt'],true)}},
           {or:[{delete_dt:{eq:0}},{delete_dt:{eq:null}}]}]}}}}}}});
           itm.or.push({storage_billing_sot:{some:{storing_order_tank:{out_gate:{some:{out_gate_survey:{and:[{create_dt:{lte:Utility.convertDate(this.searchForm!.value['release_dt'],true)}},
           {or:[{delete_dt:{eq:0}},{delete_dt:{eq:null}}]}]}}}}}}});
  
           where.and.push(itm);
         }
     
        
         this.lastSearchCriteria = this.billDS.addDeleteDtCriteria(where);
         this.performBillingSearch(this.pageSize, this.pageIndex, this.pageSize, undefined, undefined, undefined);
    }

    performBillingSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string) {
      this.subs.sink = this.billDS.searchBillingWithBillingSOT(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
        .subscribe(data => {
          this.billList = data;
          this.export_report();
        });
  
      // this.pageSize = pageSize;
      // this.pageIndex = pageIndex;
    }
  export_report()
  {
     var repCustomers : report_billing_customer[]=[]
     // var rpItems:report_billing_item[]=[];

      this.billList.forEach(b=>{
         var repCusts = repCustomers.filter(c=>c.guid===b.bill_to_guid);
         var repCust : report_billing_customer=new report_billing_customer();
         var newCust:boolean=true;
         if(repCusts.length>0)
         {
          repCust= repCusts[0];
          newCust=false;
         }
         repCust.customer=b.customer_company?.name;
         if (this.searchForm!.get('inv_dt_start')?.value && this.searchForm!.get('inv_dt_end')?.value) {
            repCust.invoice_period=`${this.displayDate(this.searchForm!.get('inv_dt_start')?.value)} - ${this.displayDate(this.searchForm!.get('inv_dt_end')?.value)}`;
         }
         let rpBillingItm =this.createReportBillingItem(b);

      });

  }

  createReportBillingItem(b:BillingItem):report_billing_item[]
  {
    var repBillItems:report_billing_item[]=[];
    var repBillingItm:report_billing_item= new report_billing_item();

    var sot_guids:string[]=[];
    if(b.cleaning?.length!>0) this.calculateCleaningCost(b.cleaning!,repBillItems);
    if(b.gateio_billing_sot?.length!>0) this.calculateGateInOutCost(b.gateio_billing_sot!,repBillItems);
    if(b.lolo_billing_sot?.length!>0) this.calculateLOLOCost(b.lolo_billing_sot!,repBillItems);
    if(b.preinsp_billing_sot?.length!>0)this.calculatePreInspectionCost(b.preinsp_billing_sot!,repBillItems);
    if(b.repair_customer?.length!>0) this.calculateRepairCost(b.preinsp_billing_sot!,repBillItems);
    if(b.repair_owner?.length!>0) this.calculateRepairCost(b.repair_owner!,repBillItems,1);
    if(b.residue?.length!>0) this.calculateResidueCost(b.residue!,repBillItems);
    if(b.storage_billing_sot?.length!>0)this.calculateStorageCost(b.storage_billing_sot!,repBillItems);
    if(b.steaming?.length!>0)sot_guids= this.distinctSOT(b.steaming!,sot_guids);
    
    
     // repBillingItm.job_no = b.
      //repBillingItm.clean_cost =this.calculateCleaningCost(b.cleaning!);

    return repBillItems;

  }

  distinctSOT(estimate:any[],sot_guids:string[]):string[]
  {
    //var sGuids:string[]=sot_guids;

   var distinctSotGuids= [... new Set(estimate.map(item=>item.storing_order_tank?.guid))];
   const sGuids = [...new Set([...sot_guids, ...distinctSotGuids])];

    return sGuids;

  }
  calculateCleaningCost(items:InGateCleaningItem[],rep_bill_items:report_billing_item[])
  {
     var retval :string ="";

      if(items.length>0)
      {
        var itms = items.filter(v=>v.delete_dt===null||v.delete_dt===0);
        if(itms.length>0)
        { 
          itms.forEach(c=>{
             let newItem=false;
            let rep_bill_item= rep_bill_items.find(item=>item.sot_guid===c.storing_order_tank?.guid);
            if(!rep_bill_item)
            {
              newItem=true;
              rep_bill_item= new report_billing_item();
              rep_bill_item.sot_guid=c.storing_order_tank?.guid;
            }
            rep_bill_item.clean_cost = Number(Number( rep_bill_item?.clean_cost||0)+ (c.cleaning_cost||0)+ (c.buffer_cost||0)).toFixed(2);
            if(newItem)rep_bill_items.push(rep_bill_item);
            
          });
        }
      }
     return retval;

  }

  calculateGateInOutCost(items:BillingSOTItem[],rep_bill_items:report_billing_item[])
  {
     var retval :string ="";

      if(items.length>0)
      {
        var itms = items.filter(v=>v.delete_dt===null||v.delete_dt===0);
        if(itms.length>0)
        { 
          itms.forEach(c=>{
             let newItem=false;
            let rep_bill_item= rep_bill_items.find(item=>item.sot_guid===c.storing_order_tank?.guid);
            if(!rep_bill_item)
            {
              newItem=true;
              rep_bill_item= new report_billing_item();
              rep_bill_item.sot_guid=c.storing_order_tank?.guid;
            }
            c.preinspection
            rep_bill_item.gateio_cost = Number(Number( rep_bill_item?.gateio_cost||0)+ (c.gate_in_cost||0)+(c.gate_out_cost||0)).toFixed(2);
            if(newItem)rep_bill_items.push(rep_bill_item);
            
          });
        }
      }
     return retval;

  }

  calculateLOLOCost(items:BillingSOTItem[],rep_bill_items:report_billing_item[])
  {
     var retval :string ="";

      if(items.length>0)
      {
        var itms = items.filter(v=>v.delete_dt===null||v.delete_dt===0);
        if(itms.length>0)
        { 
          itms.forEach(c=>{
             let newItem=false;
            let rep_bill_item= rep_bill_items.find(item=>item.sot_guid===c.storing_order_tank?.guid);
            if(!rep_bill_item)
            {
              newItem=true;
              rep_bill_item= new report_billing_item();
              rep_bill_item.sot_guid=c.storing_order_tank?.guid;
            }
            c.preinspection
            rep_bill_item.lolo_cost = Number(Number( rep_bill_item?.lolo_cost||0)+ (c.lift_off?c.lift_off_cost!:0)+(c.lift_on?c.lift_on_cost!:0)).toFixed(2);
            if(newItem)rep_bill_items.push(rep_bill_item);
            
          });
        }
      }
     return retval;

  }

  calculatePreInspectionCost(items:BillingSOTItem[],rep_bill_items:report_billing_item[])
  {
     var retval :string ="";

      if(items.length>0)
      {
        var itms = items.filter(v=>v.delete_dt===null||v.delete_dt===0);
        if(itms.length>0)
        { 
          itms.forEach(c=>{
             let newItem=false;
            let rep_bill_item= rep_bill_items.find(item=>item.sot_guid===c.storing_order_tank?.guid);
            if(!rep_bill_item)
            {
              newItem=true;
              rep_bill_item= new report_billing_item();
              rep_bill_item.sot_guid=c.storing_order_tank?.guid;
            }
            c.preinspection
            rep_bill_item.preins_cost = Number(Number( rep_bill_item?.preins_cost||0)+ (c.preinspection?c.preinspection_cost!:0)).toFixed(2);
            if(newItem)rep_bill_items.push(rep_bill_item);
            
          });
        }
      }
     return retval;
  }

  calculateStorageCost(items:BillingSOTItem[],rep_bill_items:report_billing_item[])
  {
     var retval :string ="";

      if(items.length>0)
      {
        var itms = items.filter(v=>v.delete_dt===null||v.delete_dt===0);
        if(itms.length>0)
        { 
          itms.forEach(c=>{

          
              
             let newItem=false;
            let rep_bill_item= rep_bill_items.find(item=>item.sot_guid===c.storing_order_tank?.guid);
            if(!rep_bill_item)
            {
              newItem=true;
              rep_bill_item= new report_billing_item();
              rep_bill_item.sot_guid=c.storing_order_tank?.guid;
            }
            let packDepotItm :PackageDepotItem=new PackageDepotItem();
            packDepotItm.storage_cal_cv=c.storage_cal_cv;

            let daysDifference:number =Number(this.pdDS.getStorageDays(c.storing_order_tank!,packDepotItm));


             var in_gates= c.storing_order_tank?.in_gate?.filter(v=>v.delete_dt===null||v.delete_dt===0);
             var out_gates=c.storing_order_tank?.out_gate?.filter(v=>v.delete_dt===null||v.delete_dt===0);
             rep_bill_item.days=daysDifference.toFixed(2);
             rep_bill_item.storage_cost = Number((c.storage_cost||0)*daysDifference).toFixed(2);
            if(in_gates?.length) rep_bill_item.in_date=Utility.convertEpochToDateStr(in_gates?.[0]?.eir_dt);
            if(out_gates?.length) rep_bill_item.out_date=Utility.convertEpochToDateStr(out_gates?.[0]?.eir_dt);
            if(newItem)rep_bill_items.push(rep_bill_item);
            
          });
        }
      }
     return retval;
  }

  calculateRepairCost(items:RepairItem[],rep_bill_items:report_billing_item[],CustomerType:number=0)
  {
     var retval :string ="";

      if(items.length>0)
      {
        var itms = items.filter(v=>v.delete_dt===null||v.delete_dt===0);
        if(itms.length>0)
        { 
          itms.forEach(c=>{
             let newItem=false;
            let rep_bill_item= rep_bill_items.find(item=>item.sot_guid===c.storing_order_tank?.guid);
            if(!rep_bill_item)
            {
              newItem=true;
              rep_bill_item= new report_billing_item();
              rep_bill_item.sot_guid=c.storing_order_tank?.guid;
            }
            
            const totalCost = this.repDS.calculateCost(c,c.repair_part!,c.labour_cost);
            rep_bill_item.repair_cost  = Number(Number( rep_bill_item?.repair_cost||0)+(CustomerType==0?Number(totalCost.total_lessee_mat_cost||0):Number(totalCost.total_owner_cost||0))).toFixed(2);
            if(newItem)rep_bill_items.push(rep_bill_item);
            
          });
        }
      }
     return retval;
  }


  calculateResidueCost(items:ResidueItem[],rep_bill_items:report_billing_item[])
  {
     var retval :string ="";

      if(items.length>0)
      {
        var itms = items.filter(v=>v.delete_dt===null||v.delete_dt===0);
        if(itms.length>0)
        { 
          itms.forEach(c=>{
             let newItem=false;
            let rep_bill_item = rep_bill_items.find(item=>item.sot_guid===c.storing_order_tank?.guid);
            if(!rep_bill_item)
            {
              newItem=true;
              rep_bill_item= new report_billing_item();
              rep_bill_item.sot_guid=c.storing_order_tank?.guid;
            }
            
            
             c.residue_part?.forEach(p=>{  
                 if(rep_bill_item) rep_bill_item.residue_cost  = Number(Number( rep_bill_item?.residue_cost||0)+ (p.approve_part?((p.approve_cost||0)*(p.approve_qty||0)):0)).toFixed(2);

             });
       
            if(newItem)rep_bill_items.push(rep_bill_item);
            
          });
        }
      }
     return retval;
  }

  calculateSteamingCost(items:SteamItem[],rep_bill_items:report_billing_item[])
  {
     var retval :string ="";

      if(items.length>0)
      {
         var itms = items.filter(v=>v.delete_dt===null||v.delete_dt===0);
        if(itms.length>0)
        { 
          itms.forEach(c=>{
             let newItem=false;
            let rep_bill_item = rep_bill_items.find(item=>item.sot_guid===c.storing_order_tank?.guid);
            if(!rep_bill_item)
            {
              newItem=true;
              rep_bill_item= new report_billing_item();
              rep_bill_item.sot_guid=c.storing_order_tank?.guid;
            }
            
            
             c.steaming_part?.forEach(p=>{
              if(rep_bill_item)  rep_bill_item.steam_cost  = Number(Number( rep_bill_item?.steam_cost||0)+ (p.approve_part?((p.approve_cost||0)*(p.approve_qty||0)):0)).toFixed(2);

             });
       
            if(newItem)rep_bill_items.push(rep_bill_item);
            
          });
        }
      }
     return retval;
  }

 
  
}