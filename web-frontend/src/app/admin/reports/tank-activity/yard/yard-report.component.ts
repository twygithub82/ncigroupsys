import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, FormsModule, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { NgClass, DatePipe, formatDate, CommonModule } from '@angular/common';
import { NgScrollbar } from 'ngx-scrollbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
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
import { InGateCleaningDS, InGateCleaningItem } from 'app/data-sources/in-gate-cleaning';
import { GuidSelectionModel } from '@shared/GuidSelectionModel';
import { SteamDS, SteamItem } from 'app/data-sources/steam';
import { PackageLabourDS } from 'app/data-sources/package-labour';
import { BillingDS, BillingEstimateRequest,BillingItem,BillingInputRequest } from 'app/data-sources/billing';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {report_customer_tank_activity} from 'app/data-sources/reports';
import { YardSummaryPdfComponent } from 'app/document-template/pdf/tank-activity/yard/summary-pdf/yard-summary-pdf.component';
import { YardDetailPdfComponent } from 'app/document-template/pdf/tank-activity/yard/detail-pdf/yard-detail-pdf.component';

@Component({
  selector: 'app-yard-report',
  standalone: true,
  templateUrl: './yard-report.component.html',
  styleUrl: './yard-report.component.scss',
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
    MatSlideToggleModule
  ]
})
export class TankActivitiyYardReportComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'select',
    'tank_no',
    'customer',
    'eir_no',
    'eir_dt',
    'last_cargo',
    'purpose',
    'tank_status_cv',
    'cost',
    'invoice_no',
    // 'invoiced',
    // 'action'
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
    SO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    INVOICE_DETAILS:'COMMON-FORM.INVOICE-DETAILS',
    TOTAL_COST:'COMMON-FORM.TOTAL-COST',
    SAVE_AND_SUBMIT: 'COMMON-FORM.SAVE-AND-SUBMIT',
    BILLING_BRANCH:'COMMON-FORM.BILLING-BRANCH',
    CUTOFF_DATE:'COMMON-FORM.CUTOFF-DATE',
    SAVE_SUCCESS: 'COMMON-FORM.SAVE-SUCCESS',
    INVOICED:'COMMON-FORM.INVOICED',
    CONFIRM_UPDATE_INVOICE:'COMMON-FORM.CONFIRM-UPDATE-INVOICE',
    CONFIRM_INVALID_ESTIMATE:'COMMON-FORM.CONFIRM-INVALID-ESTIMATE',
    COST:'COMMON-FORM.COST',
    CONFIRM_REMOVE_ESITMATE:'COMMON-FORM.CONFIRM-REMOVE-ESITMATE',
    DELETE:'COMMON-FORM.DELETE',
    AV_DATE:'COMMON-FORM.AV-DATE',
    CLEAN_DATE:'COMMON-FORM.CLEAN-DATE',
    CAPACITY:'COMMON-FORM.CAPACITY',
    REPAIR_COMPLETED_DATE:'COMMON-FORM.REPAIR-COMPLETED-DATE',
    TARE_WEIGHT:'COMMON-FORM.TARE-WEIGHT',
    CURRENT_STATUS:'COMMON-FORM.CURRENT-STATUS',
    DATE:'COMMON-FORM.DATE',
    INVENTORY_TYPE:'COMMON-FORM.INVENTORY-TYPE',
    SUMMARY_REPORT:'COMMON-FORM.SUMMARY-REPORT',
    DETAIL_REPORT:'COMMON-FORM.DETAIL-REPORT'
  }

  invForm?: UntypedFormGroup;
  searchForm?: UntypedFormGroup;
  customerCodeControl = new UntypedFormControl();
  branchCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();


  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  cvDS: CodeValuesDS;
  tcDS: TariffCleaningDS;
  
  stmDS:SteamDS;
  plDS:PackageLabourDS;
  billDS:BillingDS;

  distinctCustomerCodes:any;
  selectedEstimateItem?:SteamItem;
  selectedEstimateLabourCost?:number;
  stmEstList:SteamItem[]=[];
  sotList: StoringOrderTankItem[] = [];
  customer_companyList?: CustomerCompanyItem[];
  branch_companyList?:CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];
  purposeOptionCvList: CodeValuesItem[] = [];
  eirStatusCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  tankStatusCvListDisplay: CodeValuesItem[] = [];
  inventoryTypeCvList: CodeValuesItem[] = [];

  processType:string="STEAMING";
  billingParty:string="CUSTOMER";

  pageIndex = 0;
  pageSize = 100;
  lastSearchCriteria: any;
  lastOrderBy: any = { create_dt: "DESC" };
  endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;
  selection = new GuidSelectionModel<SteamItem>(true, []);
  //selection = new SelectionModel<InGateCleaningItem>(true, []);
  invoiceNoControl= new FormControl('', [Validators.required]);
  invoiceDateControl= new FormControl('', [Validators.required]);
  invoiceTotalCostControl= new FormControl('0.00');

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
    this.initInvoiceForm();
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);
    this.stmDS= new SteamDS(this.apollo);
    this.plDS=new PackageLabourDS(this.apollo);
    this.billDS= new BillingDS(this.apollo);
    this.sotDS=new StoringOrderTankDS(this.apollo);
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

  initInvoiceForm(){
    this.invForm=this.fb.group({
      inv_no:[''],
      inv_dt:['']
    })
  }
  initSearchForm() {

    this.searchForm = this.fb.group({
      customer_code: this.customerCodeControl,
      last_cargo: this.lastCargoControl,
      eir_no: [''],
      tank_no: [''],
      eir_dt_start:[''],
      eir_dt_end:[''],
      inv_type: ['MASTER_IN']
      
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
      // { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      // { alias: 'eirStatusCv', codeValType: 'EIR_STATUS' },
      // { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
      { alias: 'inventoryTypeCv', codeValType: 'INVENTORY_TYPE' },
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('inventoryTypeCv').subscribe(data => {
      this.inventoryTypeCvList = data;
    });
    // this.cvDS.connectAlias('eirStatusCv').subscribe(data => {
    //   this.eirStatusCvList = addDefaultSelectOption(data, 'All');;
    // });
    // this.cvDS.connectAlias('tankStatusCv').subscribe(data => {
    //   this.tankStatusCvListDisplay = data;
    //   this.tankStatusCvList = addDefaultSelectOption(data, 'All');
    // });
    // this.cvDS.connectAlias('yardCv').subscribe(data => {
    //   this.yardCvList = addDefaultSelectOption(data, 'All');
    // });
   // this.search();
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


  search_summary()
  {
    this.search(1);
  }

  search_detail() {
    this.search(2);
  }

  search(report_type:number)
  {

    let queryType =1;
    const where: any = {};
    this.selectedEstimateItem=undefined;
    this.selectedEstimateLabourCost=0;
    this.stmEstList =[];
    this.selection.clear();
    
    var invType:string = this.inventoryTypeCvList.find(i=>i.code_val==(this.searchForm!.get('inv_type')?.value))?.description||'';
    
    if(this.searchForm!.get('inv_type')?.value=="MASTER_OUT")
    {
       queryType=2;
    }

    if (this.searchForm!.get('tank_no')?.value) {
      where.tank_no = {contains: this.searchForm!.get('tank_no')?.value };
    }

    if (this.searchForm!.get('customer_code')?.value) {
     // if(!where.storing_order_tank) where.storing_order_tank={};
      where.storing_order={customer_company : { code:{eq: this.searchForm!.get('customer_code')?.value.code }}};
    }

    
    if (this.searchForm!.get('eir_no')?.value) {
      
      var cond :any ={ some:{eir_no:{contains: this.searchForm!.get('eir_no')?.value }}};

      if(queryType==1)
      {
        where.in_gate = cond;
      }
      else
      {
        where.out_gate = cond;
      }
    }

    var date:string=` - ${Utility.convertDateToStr(new Date())}`;
    if (this.searchForm!.get('eir_dt_start')?.value && this.searchForm!.get('eir_dt_end')?.value) {
      var cond :any ={some:{eir_dt:{gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end'],true) }}};
      date=`${Utility.convertDateToStr(new Date(this.searchForm!.get('eir_dt_start')?.value))} - ${Utility.convertDateToStr(new Date(this.searchForm!.get('eir_dt_end')?.value))}`;
      if(queryType==1)
        {
          where.in_gate={};
          where.in_gate = cond;
        }
        else
        {
          where.out_gate={};
          where.out_gate =  cond;
        }
      //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
    }
   
    if (this.searchForm!.get('last_cargo')?.value) {
      where.tariff_cleaning={guid:{eq:this.searchForm!.get('last_cargo')?.value.guid} };
    }

   
    this.lastSearchCriteria = this.stmDS.addDeleteDtCriteria(where);
    this.performSearch(this.pageSize, this.pageIndex, this.pageSize, undefined, undefined, undefined , report_type,queryType,invType,date);
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string,report_type?:number,queryType?:number,invType?:string,date?:string) {
   
    // if(queryType==1)
    // {
      this.subs.sink = this.sotDS.searchStoringOrderTanksActivityReport(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
        .subscribe(data => {
          this.sotList = data;
          this.endCursor = this.stmDS.pageInfo?.endCursor;
          this.startCursor = this.stmDS.pageInfo?.startCursor;
          this.hasNextPage = this.stmDS.pageInfo?.hasNextPage ?? false;
          this.hasPreviousPage = this.stmDS.pageInfo?.hasPreviousPage ?? false;
          this.ProcessReportCustomerTankActivity(invType!,date!,report_type!,queryType!);
          //this.checkInvoicedAndGetTotalCost();
          //this.checkInvoiced();
          //this.distinctCustomerCodes= [... new Set(this.sotList.map(item=>item.storing_order?.customer_company?.code))];
        });
      // }
      // else if(queryType==2)
      // {
      //   this.subs.sink = this.sotDS.searchStoringOrderTanksOutGate(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      //   .subscribe(data => {
      //     this.sotList = data;
      //     this.endCursor = this.stmDS.pageInfo?.endCursor;
      //     this.startCursor = this.stmDS.pageInfo?.startCursor;
      //     this.hasNextPage = this.stmDS.pageInfo?.hasNextPage ?? false;
      //     this.hasPreviousPage = this.stmDS.pageInfo?.hasPreviousPage ?? false;

      //     //this.checkInvoicedAndGetTotalCost();
      //     //this.checkInvoiced();
      //     this.ProcessReportCustomerTankActivity(invType!,date!,report_type!,queryType);
      //   });

      // }
    

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

  displayReleaseDate(sot: StoringOrderTankItem) {
    let retval:string="-";
    if(sot.out_gate?.length)
    {
      if(sot.out_gate[0]?.out_gate_survey)
      {
        const date = new Date(sot.out_gate[0]?.out_gate_survey?.create_dt! * 1000);

        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
    
        // Replace the '/' with '-' to get the required format
    
    
        return `${day}/${month}/${year}`;
      }

    }
    return retval;
  }

  displayTankPurpose(sot: StoringOrderTankItem) {
    return this.sotDS.displayTankPurpose(sot, this.getPurposeOptionDescription.bind(this));
  }

  getPurposeOptionDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.purposeOptionCvList);
  }

  getTankStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.tankStatusCvListDisplay);
  }

  displayDate(input: number | undefined): string | undefined {
    if(input===null) return "-";
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
      eir_no: '',
      tank_no: '',
      eir_dt_start:'',
      eir_dt_end:'',
      inv_type: ['MASTER_IN']
    });
    this.customerCodeControl.reset('');
    this.lastCargoControl.reset('');
  }

  isAllSelected() {
   // this.calculateTotalCost();
    const numSelected = this.selection.selected.length;
    const numRows = this.stmEstList.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {
  //    this.isAllSelected()
  //      ? this.selection.clear()
  //      : this.stmEstList.forEach((row) =>
  //          this.selection.select(row)
  //        );
  //   this.calculateTotalCost();
  // }

  AllowToSave():boolean{
    let retval:boolean=false;
    if(this.selection.selected.length>0)
    {
        if(this.invoiceDateControl.valid && this.invoiceNoControl.valid)
        {
          return true;
        }
    }

    return retval;
  }



  //    delete(event:Event){
    
  //       event.preventDefault(); // Prevents the form submission
    
  //       let tempDirection: Direction;
  //       if (localStorage.getItem('isRtl') === 'true') {
  //         tempDirection = 'rtl';
  //       } else {
  //         tempDirection = 'ltr';
  //       }
  //       const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //         data: {
  //           headerText: this.translatedLangText.CONFIRM_REMOVE_ESITMATE,
  //           action: 'delete',
  //         },
  //         direction: tempDirection
  //       });
  //       this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
  //         if (result.action === 'confirmed') {
  //           const guids=this.selection.selected.map(item => item.guid).filter((guid): guid is string => guid !== undefined);
  //           this.RemoveEstimatesFromInvoice(event,guids!);
  //         }
  //       });
  //     }


  //     RemoveEstimatesFromInvoice(event:Event, processGuid:string[])
  //     {
  //       var updateBilling: any=null;
  //       let billingEstimateRequests:BillingEstimateRequest[]=[];
  //       processGuid.forEach(g=>{
  //         var billingEstReq:BillingEstimateRequest= new BillingEstimateRequest();
  //         billingEstReq.action="CANCEL";
  //         billingEstReq.billing_party=this.billingParty;
  //         billingEstReq.process_guid=g;
  //         billingEstReq.process_type=this.processType;
  //         billingEstimateRequests.push(billingEstReq);
  //       });
       
  //       this.billDS.updateBilling(updateBilling,billingEstimateRequests).subscribe(result=>{
  //         if(result.data.updateBilling)
  //         {
  //           this.handleSaveSuccess(result.data.updateBilling);
  //           this.onCancel(event);
  //         //  this.search();
  //         }
  //       })
    
  //     }
    
  //    handleSaveSuccess(count: any) {
  //      if ((count ?? 0) > 0) {
  //        let successMsg = this.langText.SAVE_SUCCESS;
  //        this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
  //          successMsg = res;
  //          ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
  //          //this.router.navigate(['/admin/master/estimate-template']);
   
  //          // Navigate to the route and pass the JSON object
           
  //        });
  //      }
  //    }
 

  // onCancel(event:Event){
  //   event.stopPropagation();
  //   this.invoiceNoControl.reset('');
  //   this.invoiceDateControl.reset('');
  // }

  // calculateTotalCost()
  //   {
  //   this.invoiceTotalCostControl.setValue('0.00');
  //   const totalCost = this.selection.selected.reduce((accumulator, s) => {
  //     // Add buffer_cost and cleaning_cost of the current item to the accumulator
  //     //var cost:number = this.selectedEstimateLabourCost||0;
  //     var itm:any = s;
  //     return accumulator + itm.total_cost;
  //     //return accumulator+ Number(stmItm.net_cost||0);
  //   }, 0); // Initialize accumulator to 0
  //   this.invoiceTotalCostControl.setValue(totalCost.toFixed(2));
  // }
  //  toggleRow(row:SteamItem)
  //  {
    
  //    this.selection.toggle(row);
  //    this.SelectFirstItem();
  //    this.calculateTotalCost();
  //  }

  //  SelectFirstItem()
  //  {
  //   if(!this.selection.selected.length)
  //   {
  //     this.selectedEstimateItem=undefined;
  //   }
  //   else if(this.selection.selected.length===1)
  //   {
  //     this.selectedEstimateItem=this.selection.selected[0];
  //     if(this.selectedEstimateItem?.bill_to_guid)
  //     {
  //     this.getCustomerLabourPackage(this.selectedEstimateItem?.bill_to_guid!);
      
  //     }
  //   }
  //  }
  //  CheckBoxDisable(row:InGateCleaningItem)
  //  {
  //    if(this.selectedEstimateItem?.customer_company)
  //    {
  //    if(row.customer_company?.code!=this.selectedEstimateItem.customer_company?.code)
  //    {
  //     return true;
  //    }
  //   }
  //    return false;
  //  }

  //  MasterCheckBoxDisable()
  //  {
  //    if(this.distinctCustomerCodes?.length)
  //    {
  //       return this.distinctCustomerCodes.length>1;
  //    }

  //    return false;
  //  }

   
  //  getTotalCost(row:any)
  //  {
     
  //   const customer_company_guid= row.storing_order_tank?.storing_order?.customer_company?.guid;
  //   const where = {
  //     and: [
  //       { customer_company_guid: { eq: customer_company_guid } }
  //     ]
  //   };
  //   this.plDS.getCustomerPackageCost(where).subscribe(data=>{
  //     if(data.length>0)
  //     {
  //       var cost:number =data[0].cost;
  //       row.total_cost=(this.stmDS.getApprovalTotalWithLabourCost(row?.steaming_part,cost).total_mat_cost||0);
  //       //this.calculateTotalCost();
  //     }
  //   });

  //  }
   
  //  getCustomerLabourPackage(custGuid: string){

  //   const customer_company_guid= custGuid;
  //   const where = {
  //     and: [
  //       { customer_company_guid: { eq: customer_company_guid } }
  //     ]
  //   };
  //   this.plDS.getCustomerPackageCost(where).subscribe(data=>{
  //     if(data.length>0)
  //     {
  //       this.selectedEstimateLabourCost =data[0].cost;
  //       // this.stmEstList = this.stmEstList?.map(stm => {
  //       //       var stm_part=[...stm.steaming_part!];
  //       //       stm.steaming_part=stm_part?.filter(data => !data.delete_dt);
  //       //       return { ...stm, net_cost: this.calculateNetCostWithLabourCost(stm,cost) };
  //       // });
  //       this.calculateTotalCost();
  //     }
  //   });
   
  // }

  // calculateNetCostWithLabourCost(steam: SteamItem,LabourCost:number): number {
    
  //   const total = this.IsApproved(steam)?this.stmDS.getApprovalTotalWithLabourCost(steam?.steaming_part,LabourCost):this.stmDS.getTotalWithLabourCost(steam?.steaming_part,LabourCost)
  //     return total.total_mat_cost;

  // }

  // IsApproved(steam:SteamItem)
  // {
  //   const validStatus = [ 'APPROVED','COMPLETED','QC_COMPLETED']
  //   return validStatus.includes(steam!.status_cv!);
    
  // }

  // checkInvoicedAndGetTotalCost()
  // {
  //   this.stmEstList = this.stmEstList?.map(stm => {
  //             return { ...stm, invoiced: (stm.customer_billing_guid?true:false), total_cost:0 };
  //       });
  //   this.stmEstList?.forEach(stm => {
  //        this.getTotalCost(stm);
  //       });    
  // }

  // checkInvoiced()
  // {
  //   this.stmEstList = this.stmEstList?.map(stm => {
            
  //             return { ...stm, invoiced: (stm.customer_billing_guid?true:false) };
  //       });
  // }

  // handleDelete(event:Event, row:SteamItem)
  // {

  //   event.preventDefault(); // Prevents the form submission

  //   let tempDirection: Direction;
  //   if (localStorage.getItem('isRtl') === 'true') {
  //     tempDirection = 'rtl';
  //   } else {
  //     tempDirection = 'ltr';
  //   }
  //   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //     data: {
  //       headerText: this.translatedLangText.CONFIRM_REMOVE_ESITMATE,
  //       action: 'delete',
  //     },
  //     direction: tempDirection
  //   });
  //   this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
  //     if (result.action === 'confirmed') {
  //       this.RmoveEstimateFromInvoice(event,row.guid!);
  //     }
  //   });
  // }

  // RmoveEstimateFromInvoice(event:Event, processGuid:string)
  // {
  //   var updateBilling: any=null;
  //   var billingEstReq:BillingEstimateRequest= new BillingEstimateRequest();
  //   billingEstReq.action="CANCEL";
  //   billingEstReq.billing_party=this.billingParty;
  //   billingEstReq.process_guid=processGuid;
  //   billingEstReq.process_type=this.processType;
  //   let billingEstimateRequests:BillingEstimateRequest[]=[];
  //   billingEstimateRequests.push(billingEstReq);
   
  //   this.billDS.updateBilling(updateBilling,billingEstimateRequests).subscribe(result=>{
  //     if(result.data.updateBilling)
  //     {
  //       this.handleSaveSuccess(result.data.updateBilling);
  //       this.onCancel(event);
  //       //this.search();
  //     }
  //   })

  // }
   
  ProcessReportCustomerTankActivity(invType:string,date:string,report_type:number,queryType:number)
  {
    if(this.sotList.length===0) return;

    var report_customer_tank_acts:report_customer_tank_activity[]=[];
    
    this.sotList.map(s=>{

      if(s)
      {
         var repCust :report_customer_tank_activity= report_customer_tank_acts.find(r=>r.code===s.storing_order?.customer_company?.code)||new report_customer_tank_activity();
         let newCust=false;
         if(!repCust.code)
         {
           repCust.code = s.storing_order?.customer_company?.code;
           repCust.customer = s.storing_order?.customer_company?.name;
           newCust=true;
         }
         repCust.number_tank ??= 0;
         repCust.number_tank+=1;
         if(!repCust.storing_order_tank) repCust.storing_order_tank=[];
         repCust.storing_order_tank?.push(s);
         if(newCust)report_customer_tank_acts.push(repCust);



      }
    });

    if(report_type==1)
    {
    this.onExportSummary(report_customer_tank_acts,invType,date,queryType);
    }
    else
    {
      this.onExportDetail(report_customer_tank_acts,invType,date,queryType);
    }

  }

  onExportDetail(repCustomerTankActivity: report_customer_tank_activity[],invType :string, date:string,queryType:number) {
    //this.preventDefault(event);
    let cut_off_dt = new Date();

  
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(YardDetailPdfComponent, {
      width: '1200px',
      height: '80vh',
      data: {
        report_customer_tank_activity: repCustomerTankActivity,
        type:invType,
        date:date,
        queryType:queryType
      },
      // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {

    });
  }

  onExportSummary(repCustomerTankActivity: report_customer_tank_activity[],invType :string, date:string,queryType:number) {
            //this.preventDefault(event);
            let cut_off_dt = new Date();
  
          
            let tempDirection: Direction;
            if (localStorage.getItem('isRtl') === 'true') {
              tempDirection = 'rtl';
            } else {
              tempDirection = 'ltr';
            }
        
            const dialogRef = this.dialog.open(YardSummaryPdfComponent, {
              width: '850px',
             // height: '80vh',
              data: {
                report_customer_tank_activity: repCustomerTankActivity,
                type:invType,
                date:date,
                queryType:queryType
              },
              // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
              direction: tempDirection
            });
            this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      
            });
          }

  
 
}