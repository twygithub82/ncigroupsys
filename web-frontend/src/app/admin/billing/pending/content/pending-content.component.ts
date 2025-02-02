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
import {BillingDS,BillingItem,BillingSOTItem,report_billing_customer,report_billing_item}from 'app/data-sources/billing';
import {InGateCleaningItem} from 'app/data-sources/in-gate-cleaning';
import { RepairPartItem } from 'app/data-sources/repair-part';
import {RepairDS, RepairItem}from 'app/data-sources/repair';
import { ResidueItem } from 'app/data-sources/residue';
import { PackageDepotDS, PackageDepotItem } from 'app/data-sources/package-depot';
import { SteamItem } from 'app/data-sources/steam';
import { PendingSummaryPdfComponent } from 'app/document-template/pdf/pending-summary-pdf/pending-summary-pdf.component';
import {PendingInvoiceCostDetailPdfComponent} from 'app/document-template/pdf/pending-invoice-cost-detail-pdf/pending-invoice-cost-detail.component';


@Component({
  selector: 'app-pending-content',
  standalone: true,
  templateUrl: './pending-content.component.html',
  styleUrl: './pending-content.component.scss',
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
export class PendingContentComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
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
    CUTOFF_DATE:'COMMON-FORM.CUTOFF-DATE',
    PENDING_INVOICE_DETAIL:'COMMON-FORM.PENDING-INVOICE-DETAIL',
    PENDING_INVOICE_SUMMARY:'COMMON-FORM.PENDING-INVOICE-SUMMARY'
  }

  searchForm?: UntypedFormGroup;
  customerCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();

  sotDS: StoringOrderTankDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  cvDS: CodeValuesDS;
  tcDS: TariffCleaningDS;
  pdDS:PackageDepotDS;
  repDS:RepairDS;

  sotList: StoringOrderTankItem[] = [];
  customer_companyList?: CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];
  purposeOptionCvList: CodeValuesItem[] = [];
  eirStatusCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  tankStatusCvListDisplay: CodeValuesItem[] = [];
  yardCvList: CodeValuesItem[] = [];

  pageIndex = 0;
  pageSize = 100;
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
    this.pdDS= new PackageDepotDS(this.apollo);
    this.repDS= new RepairDS(this.apollo);
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
      // so_no: [''],
      customer_code: this.customerCodeControl,
      cutoff_dt:[''],
      // last_cargo: this.lastCargoControl,
      // eir_no: [''],
      // ro_no: [''],
      // eir_dt:[''],
      // release_dt:[''],
      // inv_dt_start: [''],
      // inv_dt_end: [''],
      // eir_dt_start: [''],
      // eir_dt_end: [''],
      // tank_no: [''],
      // inv_no:[''],
      // job_no: [''],
      // purpose: [''],
      // tank_status_cv: [''],
      // eir_status_cv: [''],
      // yard_cv: ['']
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

    // this.searchForm!.get('last_cargo')!.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(300),
    //   tap(value => {
    //     var searchCriteria = '';
    //     if (typeof value === 'string') {
    //       searchCriteria = value;
    //     } else {
    //       searchCriteria = value.cargo;
    //     }
    //     this.tcDS.loadItems({ cargo: { contains: searchCriteria } }, { cargo: 'ASC' }).subscribe(data => {
    //       this.last_cargoList = data
    //       this.updateValidators(this.lastCargoControl, this.last_cargoList);
    //     });
    //   })
    // ).subscribe();
  }

  public loadData() {
    // const queries = [
    //   { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
    //   { alias: 'eirStatusCv', codeValType: 'EIR_STATUS' },
    //   { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
    //   { alias: 'yardCv', codeValType: 'YARD' },
    // ];
    // this.cvDS.getCodeValuesByType(queries);
    // this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
    //   this.purposeOptionCvList = data;
    // });
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

  search(reportType:number) {
    const where: any = {};

    where.and=[];

    const itm:any={or:[]};
    itm.or.push({and:[{cleaning:{any:true }},{cleaning:{some:{customer_billing_guid:{eq:null}}}}]});
    itm.or.push({and:[{repair:{any:true }},{repair:{some:{or:[{customer_billing_guid:{eq:null}},{and:[{owner_billing_guid:{eq:null}},{owner_enable:{eq:true}}]}]}}}]});
    itm.or.push({and:[{residue:{any:true }},{residue:{some:{customer_billing_guid:{eq:null}}}}]});
    itm.or.push({and:[{steaming:{any:true }},{steaming:{some:{customer_billing_guid:{eq:null}}}}]});
    itm.or.push({and:[{billing_sot:{any:true }},{or:[{billing_sot:{some:{gateio_billing_guid:{eq:null}}}},
                                                     {billing_sot:{some:{and:[{preinsp_billing_guid:{eq:null}},{preinspection:{eq:true}}]}}},
                                                     {billing_sot:{some:{and:[{lolo_billing_guid:{eq:null}},{or:[{lift_on:{eq:true}},{lift_off:{eq:true}}]}]}}},
                                                     {billing_sot:{some:{storage_billing_guid:{eq:null}}}}
                                                    ]}]});
   // where.and.push(itm);

    if (this.searchForm!.get('cutoff_dt')?.value) {
      const approveSearch: any = {};
      approveSearch.and=[];
      approveSearch.and.push({approve_dt:{lte: Utility.convertDate(this.searchForm!.value['cutoff_dt'],true) }});
      approveSearch.and.push({approve_dt:{gt: 1600000000 }});
      //approveSearch.approve_dt={lte: Utility.convertDate(this.searchForm!.value['cutoff_dt'],true) };
      const itm:any={or:[]};
      itm.or.push({cleaning :{some:approveSearch}});
      itm.or.push({repair :{some:approveSearch}});
      itm.or.push({residue :{some:approveSearch}});
      itm.or.push({steaming :{some:approveSearch}});
      where.and.push(itm);
      //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };
    }

    if (this.searchForm!.get('customer_code')?.value) {
      const soSearch: any = {};
      if (this.searchForm!.get('customer_code')?.value) {
        soSearch.customer_company = { guid: { contains: this.searchForm!.get('customer_code')?.value.guid } };
      }
      where.storing_order = soSearch;
    }

    this.lastSearchCriteria = this.sotDS.addDeleteDtCriteria(where);
    this.performSearch(this.pageSize, this.pageIndex, this.pageSize, undefined, undefined, undefined,reportType);
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string , reportType:number=1) {
    this.subs.sink = this.sotDS.searchStoringOrderTanksEstimateDetails(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {

        this.sotList = data;
        this.endCursor = this.sotDS.pageInfo?.endCursor;
        this.startCursor = this.sotDS.pageInfo?.startCursor;
        this.hasNextPage = this.sotDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPage = this.sotDS.pageInfo?.hasPreviousPage ?? false;
        this.removeNotApproveEstimates();
        this.export_report(reportType);
      });

    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
  }

  removeNotApproveEstimates()
  {
     this.sotList= this.sotList.map(sot=>{

      sot.cleaning=sot.cleaning?.filter(c=>c.approve_dt!=null);
      sot.residue=sot.residue?.filter(c=>c.approve_dt!=null);
      sot.repair= sot.repair?.filter(c=>c.approve_dt!=null);
      sot.steaming= sot.steaming?.filter(c=>c.approve_dt!=null);
      sot.billing_sot=sot.billing_sot?.filter(c=>c.gateio_billing_guid==null
                                               ||((c.lift_off||c.lift_on)&&c.lolo_billing_guid==null)
                                               ||(c.preinsp_billing_guid==null&&c.preinspection)
                                               ||(c.storage_billing_guid==null))
        return sot;
     }).filter(sot => sot.cleaning?.length || sot.residue?.length || sot.repair?.length || sot.steaming?.length || sot.billing_sot?.length);;
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
    return this.sotDS.displayTankPurpose(sot, this.getPurposeOptionDescription.bind(this));
  }

  getPurposeOptionDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.purposeOptionCvList);
  }

  getTankStatusDescription(codeValType: string | undefined): string | undefined {
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
     cut_off_dt:''
    });
    this.customerCodeControl.reset('');
  }

   createNewReportBillingItem(sot:StoringOrderTankItem):report_billing_item
   {
      var rep_bill_item:report_billing_item= new report_billing_item();
      rep_bill_item= new report_billing_item();
      rep_bill_item.sot_guid=sot?.guid;
      if(sot?.tank_no){ rep_bill_item.tank_no= sot?.tank_no;}
      if(sot?.job_no){ rep_bill_item.job_no=sot?.job_no;}
      if(sot?.tariff_cleaning?.cargo) rep_bill_item.last_cargo=sot?.tariff_cleaning?.cargo;

      var in_gates= sot?.in_gate?.filter(v=>v.delete_dt===null||v.delete_dt===0);
      var out_gates=sot?.out_gate?.filter(v=>v.delete_dt===null||v.delete_dt===0);
      if(in_gates?.length) 
        {
          rep_bill_item.in_date=Utility.convertEpochToDateStr(in_gates?.[0]?.eir_dt);
          rep_bill_item.eir_no=in_gates?.[0]?.eir_no;
        }
      if(out_gates?.length) {
        rep_bill_item.out_date=Utility.convertEpochToDateStr(out_gates?.[0]?.eir_dt);
        rep_bill_item.eir_no=out_gates?.[0]?.eir_no;
      }

      return rep_bill_item;
   }

  calculateCleaningCost(sot:StoringOrderTankItem,rep_bill_items:report_billing_item[])//(items:InGateCleaningItem[],rep_bill_items:report_billing_item[])
    {
       
        var items:InGateCleaningItem[]= sot.cleaning!;
        if(items.length>0)
        {
          var itms = items.filter(v=>v.delete_dt===null||v.delete_dt===0);
          if(itms.length>0)
          { 
  
            itms.forEach(c=>{
              c.storing_order_tank= sot;
               let newItem=false;
              let rep_bill_item= rep_bill_items.find(item=>item.sot_guid===c.storing_order_tank?.guid);
  
              if(!rep_bill_item)
              {
                newItem=true;
                rep_bill_item= this.createNewReportBillingItem(sot);
                //rep_bill_item.sot_guid=c.storing_order_tank?.guid;
              }
              // if(c.storing_order_tank?.tank_no){ rep_bill_item.tank_no= c.storing_order_tank?.tank_no;}
              // if(c.storing_order_tank?.job_no){ rep_bill_item.job_no=c.storing_order_tank?.job_no;}
              // if(c.storing_order_tank?.tariff_cleaning?.cargo) rep_bill_item.last_cargo=c.storing_order_tank?.tariff_cleaning?.cargo;
              rep_bill_item.clean_est_no +=1;
              rep_bill_item.clean_cost = Number(Number( rep_bill_item?.clean_cost||0)+ (c.cleaning_cost||0)+ (c.buffer_cost||0)).toFixed(2);
              if(newItem)rep_bill_items.push(rep_bill_item);
              
            });
          }
        }
       
  
    }
  

    calculateGateInOutCost(sot:StoringOrderTankItem,rep_bill_items:report_billing_item[])//(items:BillingSOTItem[],rep_bill_items:report_billing_item[])
    {
       
      var items:BillingSOTItem[]=sot.billing_sot!;
        if(items.length>0)
        {
          var itms = items.filter(v=>v.delete_dt===null||v.delete_dt===0);
          if(itms.length>0)
          { 
            itms.forEach(c=>{
              c.storing_order_tank=sot;
               let newItem=false;
              let rep_bill_item= rep_bill_items.find(item=>item.sot_guid===c.storing_order_tank?.guid);
              if(!rep_bill_item)
              {
                newItem=true;
                rep_bill_item= this.createNewReportBillingItem(sot);
                // rep_bill_item= new report_billing_item();
                // rep_bill_item.sot_guid=c.storing_order_tank?.guid;
              }
              // if(c.storing_order_tank?.tank_no){ rep_bill_item.tank_no= c.storing_order_tank?.tank_no;}
              // if(c.storing_order_tank?.job_no){ rep_bill_item.job_no=c.storing_order_tank?.job_no;}
              // if(c.storing_order_tank?.tariff_cleaning?.cargo) rep_bill_item.last_cargo=c.storing_order_tank?.tariff_cleaning?.cargo;
              if(((c.gate_in_cost||0)+(c.gate_out_cost||0))>0)rep_bill_item.gateio_est_no +=1;
              rep_bill_item.gateio_cost = Number(Number( rep_bill_item?.gateio_cost||0)+ (c.gate_in_cost||0)+(c.gate_out_cost||0)).toFixed(2);
              if(newItem)rep_bill_items.push(rep_bill_item);
              
            });
          }
        }
       
  
    }
  
    calculateLOLOCost(sot:StoringOrderTankItem,rep_bill_items:report_billing_item[])//(items:BillingSOTItem[],rep_bill_items:report_billing_item[])
    {
       
        var items:BillingSOTItem[]=sot.billing_sot!;
        if(items.length>0)
        {
          var itms = items.filter(v=>v.delete_dt===null||v.delete_dt===0);
          if(itms.length>0)
          { 
            itms.forEach(c=>{
               c.storing_order_tank=sot;
               let newItem=false;
              let rep_bill_item= rep_bill_items.find(item=>item.sot_guid===c.storing_order_tank?.guid);
              if(!rep_bill_item)
              {
                newItem=true;
                rep_bill_item= this.createNewReportBillingItem(sot);
                // rep_bill_item= new report_billing_item();
                // rep_bill_item.sot_guid=c.storing_order_tank?.guid;
              }
              // if(c.storing_order_tank?.tank_no){ rep_bill_item.tank_no= c.storing_order_tank?.tank_no;}
              // if(c.storing_order_tank?.job_no){ rep_bill_item.job_no=c.storing_order_tank?.job_no;}
              // if(c.storing_order_tank?.tariff_cleaning?.cargo) rep_bill_item.last_cargo=c.storing_order_tank?.tariff_cleaning?.cargo;
              if(((c.lift_off?c.lift_off_cost!:0)+(c.lift_on?c.lift_on_cost!:0))>0)rep_bill_item.lolo_est_no +=1;
              
              rep_bill_item.lolo_cost = Number(Number( rep_bill_item?.lolo_cost||0)+ (c.lift_off?c.lift_off_cost!:0)+(c.lift_on?c.lift_on_cost!:0)).toFixed(2);
              if(newItem)rep_bill_items.push(rep_bill_item);
              
            });
          }
        }
       
  
    }
  
    calculatePreInspectionCost(sot:StoringOrderTankItem,rep_bill_items:report_billing_item[])//(items:BillingSOTItem[],rep_bill_items:report_billing_item[])
    {
       
      var items:BillingSOTItem[]=sot.billing_sot!;
        if(items.length>0)
        {
          var itms = items.filter(v=>v.delete_dt===null||v.delete_dt===0);
          if(itms.length>0)
          { 
            itms.forEach(c=>{
              c.storing_order_tank=sot;
               let newItem=false;
              let rep_bill_item= rep_bill_items.find(item=>item.sot_guid===c.storing_order_tank?.guid);
              if(!rep_bill_item)
              {
                newItem=true;
                rep_bill_item= this.createNewReportBillingItem(sot);
                // rep_bill_item= new report_billing_item();
                // rep_bill_item.sot_guid=c.storing_order_tank?.guid;
              }
              // if(c.storing_order_tank?.tank_no){ rep_bill_item.tank_no= c.storing_order_tank?.tank_no;}
              // if(c.storing_order_tank?.job_no){ rep_bill_item.job_no=c.storing_order_tank?.job_no;}
              // if(c.storing_order_tank?.tariff_cleaning?.cargo) rep_bill_item.last_cargo=c.storing_order_tank?.tariff_cleaning?.cargo;
              if((c.preinspection?c.preinspection_cost!:0)>0)rep_bill_item.preins_est_no +=1;  
              
              rep_bill_item.preins_cost = Number(Number( rep_bill_item?.preins_cost||0)+ (c.preinspection?c.preinspection_cost!:0)).toFixed(2);
              if(newItem)rep_bill_items.push(rep_bill_item);
              
            });
          }
        }
       
    }
  
    calculateStorageCost(sot:StoringOrderTankItem,rep_bill_items:report_billing_item[])
    {
       
        var items=sot.billing_sot!;
        if(items.length>0)
        {
          var itms = items.filter(v=>v.delete_dt===null||v.delete_dt===0);
          if(itms.length>0)
          { 
            itms.forEach(c=>{
  
                c.storing_order_tank=sot;
                
               let newItem=false;
              let rep_bill_item= rep_bill_items.find(item=>item.sot_guid===c.storing_order_tank?.guid);
              if(!rep_bill_item)
              {
                newItem=true;
                rep_bill_item= this.createNewReportBillingItem(sot);
                // rep_bill_item= new report_billing_item();
                // rep_bill_item.sot_guid=c.storing_order_tank?.guid;
              }
  
              // if(c.storing_order_tank?.tank_no){ rep_bill_item.tank_no= c.storing_order_tank?.tank_no;}
              // if(c.storing_order_tank?.job_no){ rep_bill_item.job_no=c.storing_order_tank?.job_no;}
              // if(c.storing_order_tank?.tariff_cleaning?.cargo) rep_bill_item.last_cargo=c.storing_order_tank?.tariff_cleaning?.cargo;
  
              let packDepotItm :PackageDepotItem=new PackageDepotItem();
              packDepotItm.storage_cal_cv=c.storage_cal_cv;
  
              let daysDifference:number =Number(this.pdDS.getStorageDays(c.storing_order_tank!,packDepotItm));
  
  
              //  var in_gates= c.storing_order_tank?.in_gate?.filter(v=>v.delete_dt===null||v.delete_dt===0);
              //  var out_gates=c.storing_order_tank?.out_gate?.filter(v=>v.delete_dt===null||v.delete_dt===0);
               rep_bill_item.days= String(daysDifference);

               if(((c.storage_cost||0)*daysDifference)>0)  rep_bill_item.storage_est_no +=1;
               rep_bill_item.storage_cost = Number((c.storage_cost||0)*daysDifference).toFixed(2);
              // if(in_gates?.length) 
              //   {
              //     rep_bill_item.in_date=Utility.convertEpochToDateStr(in_gates?.[0]?.eir_dt);
              //     rep_bill_item.eir_no=in_gates?.[0]?.eir_no;
              //   }
              // if(out_gates?.length) {
              //   rep_bill_item.out_date=Utility.convertEpochToDateStr(out_gates?.[0]?.eir_dt);
              //   rep_bill_item.eir_no=out_gates?.[0]?.eir_no;
              // }
              if(newItem)rep_bill_items.push(rep_bill_item);
              
            });
          }
        }
       
    }
  
    calculateRepairCost(sot:StoringOrderTankItem,rep_bill_items:report_billing_item[],CustomerType:number=0)//(items:RepairItem[],rep_bill_items:report_billing_item[],CustomerType:number=0)
    {
       
        var items:RepairItem[]=sot.repair!;
        if(items.length>0)
        {
          var itms = items.filter(v=>v.delete_dt===null||v.delete_dt===0);
          if(itms.length>0)
          { 
            itms.forEach(c=>{
               c.storing_order_tank=sot;
               let newItem=false;
              let rep_bill_item= rep_bill_items.find(item=>item.sot_guid===c.storing_order_tank?.guid);
              if(!rep_bill_item)
              {
                newItem=true;
                rep_bill_item=this.createNewReportBillingItem(sot);
                //rep_bill_item= new report_billing_item();
                //rep_bill_item.sot_guid=c.storing_order_tank?.guid;
              }
              // if(c.storing_order_tank?.tank_no){ rep_bill_item.tank_no= c.storing_order_tank?.tank_no;}
              // if(c.storing_order_tank?.job_no){ rep_bill_item.job_no=c.storing_order_tank?.job_no;}
              // if(c.storing_order_tank?.tariff_cleaning?.cargo) rep_bill_item.last_cargo=c.storing_order_tank?.tariff_cleaning?.cargo;

              
              const totalCost = this.repDS.calculateCost(c,c.repair_part!,c.labour_cost);
              rep_bill_item.repair_cost  = Number(Number( rep_bill_item?.repair_cost||0)+(CustomerType==0?Number(totalCost.total_lessee_mat_cost||0):Number(totalCost.total_owner_cost||0))).toFixed(2);

              if((CustomerType==0 &&Number(totalCost.total_lessee_mat_cost||0)>0)||
                (CustomerType==1 &&Number(totalCost.total_owner_cost||0)>0))
                {rep_bill_item.repair_est_no +=1;}

              if(newItem)rep_bill_items.push(rep_bill_item);
              
            });
          }
        }
     
    }
  
  
    calculateResidueCost(sot:StoringOrderTankItem,rep_bill_items:report_billing_item[])//(items:ResidueItem[],rep_bill_items:report_billing_item[])
    {
       
        var items:ResidueItem[]= sot.residue!;
        if(items.length>0)
        {
          var itms = items.filter(v=>v.delete_dt===null||v.delete_dt===0);
          if(itms.length>0)
          { 
            itms.forEach(c=>{
               c.storing_order_tank=sot;
               let newItem=false;
              let rep_bill_item = rep_bill_items.find(item=>item.sot_guid===c.storing_order_tank?.guid);
              if(!rep_bill_item)
              {
                newItem=true;
                rep_bill_item=this.createNewReportBillingItem(sot);
              }
              
              // if(c.storing_order_tank?.tank_no){ rep_bill_item.tank_no= c.storing_order_tank?.tank_no;}
              // if(c.storing_order_tank?.job_no){ rep_bill_item.job_no=c.storing_order_tank?.job_no;}
              // if(c.storing_order_tank?.tariff_cleaning?.cargo) rep_bill_item.last_cargo=c.storing_order_tank?.tariff_cleaning?.cargo;
              let total =0;
               c.residue_part?.forEach(p=>{  
                
                   if(rep_bill_item) 
                    {
                      total +=((p.approve_part ?? true)?((p.approve_cost||0)*(p.approve_qty||0)):0);
                      rep_bill_item.residue_cost  = Number(Number( rep_bill_item?.residue_cost||0)+ ((p.approve_part ?? true)?((p.approve_cost||0)*(p.approve_qty||0)):0)).toFixed(2);
                    }
  
               });
               if(total>0)  rep_bill_item.residue_est_no +=1;
              if(newItem)rep_bill_items.push(rep_bill_item);
              
            });
          }
        }
       
    }
  
    calculateSteamingCost(sot:StoringOrderTankItem,rep_bill_items:report_billing_item[])//(items:SteamItem[],rep_bill_items:report_billing_item[])
    {
       
        var items:SteamItem[]= sot.steaming!;
        if(items.length>0)
        {
           var itms = items.filter(v=>v.delete_dt===null||v.delete_dt===0);
          if(itms.length>0)
          { 
            itms.forEach(c=>{
              c.storing_order_tank=sot;
               let newItem=false;
              let rep_bill_item = rep_bill_items.find(item=>item.sot_guid===c.storing_order_tank?.guid);
              if(!rep_bill_item)
              {
                newItem=true;
                rep_bill_item=this.createNewReportBillingItem(sot);
                // rep_bill_item= new report_billing_item();
                // rep_bill_item.sot_guid=c.storing_order_tank?.guid;
              }
              
              // if(c.storing_order_tank?.tank_no){ rep_bill_item.tank_no= c.storing_order_tank?.tank_no;}
              // if(c.storing_order_tank?.job_no){ rep_bill_item.job_no=c.storing_order_tank?.job_no;}
              // if(c.storing_order_tank?.tariff_cleaning?.cargo) rep_bill_item.last_cargo=c.storing_order_tank?.tariff_cleaning?.cargo;
               let total =0;
               c.steaming_part?.forEach(p=>{
                if(rep_bill_item) 
                  {
                     total +=((p.approve_part ?? true)?((p.approve_cost||0)*(p.approve_qty||0)):0);
                     rep_bill_item.steam_cost  = Number(Number( rep_bill_item?.steam_cost||0)+ ((p.approve_part ?? true)?((p.approve_cost||0)*(p.approve_qty||0)):0)).toFixed(2);
                  }
  
               });
               if(total>0) rep_bill_item.steam_est_no +=1;
              if(newItem)rep_bill_items.push(rep_bill_item);
              
            });
          }
        }
       
    }

    calculateBillingSOT(sot:StoringOrderTankItem,rep_bill_items:report_billing_item[])//(items:BillingSOTItem[],rep_bill_items:report_billing_item[])
    {
      var items:BillingSOTItem[]=sot.billing_sot!;
      if(items.length>0)
        {
           var itms = items.filter(v=>v.delete_dt===null||v.delete_dt===0);
         //  itms = itms.map(i => ({ ...i, storing_order_tank: sot }));
          if(itms.length>0)
          {
            sot.billing_sot = itms.filter(i=>i.storage_billing_guid==null);
            if(sot.billing_sot .length) this.calculateStorageCost(sot,rep_bill_items);
            sot.billing_sot = itms.filter(i=>i.preinsp_billing_guid==null);
            if(sot.billing_sot .length) this.calculatePreInspectionCost(sot,rep_bill_items);
            sot.billing_sot = itms.filter(i=>i.lolo_billing_guid==null);
            if(sot.billing_sot .length) this.calculateLOLOCost(sot,rep_bill_items);
            sot.billing_sot = itms.filter(i=>i.gateio_billing_guid==null);
            if(sot.billing_sot .length) this.calculateGateInOutCost(sot,rep_bill_items);
            //  let storageBillingSOT = itms.filter(i=>i.storage_billing_guid==null);
            //  if(storageBillingSOT.length) this.calculateStorageCost(storageBillingSOT,rep_bill_items);
            //  let preinspBillingSOT = itms.filter(i=>i.preinsp_billing_guid==null && i.preinspection);
            //  if(preinspBillingSOT.length) this.calculatePreInspectionCost(preinspBillingSOT,rep_bill_items);
            //  let loloBillingSOT = itms.filter(i=>i.lolo_billing_guid==null && (i.lift_off||i.lift_on));
            //  if(loloBillingSOT.length) this.calculateLOLOCost(loloBillingSOT,rep_bill_items);
            //  let gateioBillingSOT= itms.filter(i=>i.gateio_billing_guid==null);
            //  if(gateioBillingSOT.length) this.calculateGateInOutCost(gateioBillingSOT,rep_bill_items);
          }
        }
    }

    export_report(reportType:number)
    {
      if(!this.sotList.length) return;
  
       var repCustomers : report_billing_customer[]=[]
       // var rpItems:report_billing_item[]=[];
  
        this.sotList.forEach(b=>{
           var repCusts = repCustomers.filter(c=>c.guid===b.storing_order?.customer_company?.guid);
           var repCust : report_billing_customer=new report_billing_customer();
           var newCust:boolean=true;
           if(repCusts.length>0)
           {
            repCust= repCusts[0];
            newCust=false;
           }
           else
           {
            repCust.guid=b.storing_order?.customer_company?.guid;
            repCust.items=[];
           }
           repCust.customer=this.ccDS.displayName(b.storing_order?.customer_company);
          //  if (this.searchForm!.get('inv_dt_start')?.value && this.searchForm!.get('inv_dt_end')?.value) {
          //     repCust.invoice_period=`${Utility.convertDateToStr(new Date(this.searchForm!.value['inv_dt_start']))} - ${Utility.convertDateToStr(new Date(this.searchForm!.value['inv_dt_end']))}`;
          //  }
           let rpBillingItm =this.createReportBillingItem(b,repCust.items!);
           repCust.items=rpBillingItm;
  
           if(newCust) repCustomers.push(repCust);

            this.checkRepairBillingForTankOwner(b,repCustomers);
          
        });
        repCustomers.map(c=>{
         
            c.items?.map(i=>{
               var total:number=0;
               total = Number(i.clean_cost||0)+Number(i.gateio_cost||0)+Number(i.lolo_cost||0)+Number(i.preins_cost||0)
                      +Number(i.storage_cost||0)+Number(i.repair_cost||0)+Number(i.residue_cost||0)+Number(i.steam_cost||0)
                      ;
              i.total= total.toFixed(2);
  
            });
  
        });
      if(reportType===1)
      {
        this.onExportSummary(repCustomers);
      }
      else if(reportType==2)
      {
        this.onExportDetail_Cost(repCustomers);

      }

      
  
    }

    checkRepairBillingForTankOwner(sot:StoringOrderTankItem, repCustomers:report_billing_customer[])
    {
      if(sot.repair?.length===0) return;
      
      let rep=sot.repair?.map(r=>{
         let repParts= r.repair_part?.filter(f=>(f.approve_part??true)&&f.owner);

         return repParts?.length! > 0 ? repParts : null;
      }).filter(p=>p!=null);
      if(rep?.length===0)return;

      var repCusts = repCustomers.filter(c=>c.guid===sot.customer_company?.guid);
           var repCust : report_billing_customer=new report_billing_customer();
           var newCust:boolean=true;
           if(repCusts.length>0)
           {
            repCust= repCusts[0];
            newCust=false;
           }
           else
           {
            repCust.guid=sot.customer_company?.guid;
            repCust.items=[];
            repCust.customer=this.ccDS.displayName(sot.customer_company);
           }
           this.calculateRepairCost(sot,repCust.items!,1);
           if(newCust) repCustomers.push(repCust);

    }
  
    createReportBillingItem(b:StoringOrderTankItem,rbItm:report_billing_item[]):report_billing_item[]
    {
      var repBillItems:report_billing_item[]=rbItm;
      var repBillingItm:report_billing_item= new report_billing_item();
  
      // if(b.cleaning?.length!>0) this.calculateCleaningCost(b.cleaning!,repBillItems);
      //if(b.repair?.length!>0) this.calculateRepairCost(b.repair!,repBillItems);
      // if(b.residue?.length!>0) this.calculateResidueCost(b.residue!,repBillItems);
      // if(b.steaming?.length!>0) this.calculateSteamingCost(b.steaming!,repBillItems);
      //if(b.billing_sot?.length!>0) this.calculateBillingSOT(b.billing_sot!,repBillItems);
      if(b.cleaning?.length!>0) this.calculateCleaningCost(b,repBillItems);
      if(b.repair?.length!>0) this.calculateRepairCost(b,repBillItems);
      if(b.residue?.length!>0) this.calculateResidueCost(b,repBillItems);
      if(b.steaming?.length!>0) this.calculateSteamingCost(b,repBillItems);
      if(b.billing_sot?.length!>0) this.calculateBillingSOT(b,repBillItems);
  
      return repBillItems;
  
    }

    onExportDetail_Cost(repCustomers: report_billing_customer[]) {
      //this.preventDefault(event);
      let cut_off_dt = new Date();

      if (this.searchForm!.get('cutoff_dt')?.value) 
      {
        cut_off_dt=this.searchForm!.get('cutoff_dt')?.value;
      }
      let tempDirection: Direction;
      if (localStorage.getItem('isRtl') === 'true') {
        tempDirection = 'rtl';
      } else {
        tempDirection = 'ltr';
      }
  
      const dialogRef = this.dialog.open(PendingInvoiceCostDetailPdfComponent, {
        width: '1000px',
        height: '80vh',
        data: {
          billing_customers:repCustomers,
          cut_off_dt: Utility.convertDateToStr(new Date(cut_off_dt))
        },
        // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
        direction: tempDirection
      });
      this.subs.sink = dialogRef.afterClosed().subscribe((result) => {

      });
    }


    onExportSummary(repCustomers: report_billing_customer[]) {
          //this.preventDefault(event);
          let cut_off_dt = new Date();

          if (this.searchForm!.get('cutoff_dt')?.value) 
          {
            cut_off_dt=this.searchForm!.get('cutoff_dt')?.value;
          }
          let tempDirection: Direction;
          if (localStorage.getItem('isRtl') === 'true') {
            tempDirection = 'rtl';
          } else {
            tempDirection = 'ltr';
          }
      
          const dialogRef = this.dialog.open(PendingSummaryPdfComponent, {
            width: '850px',
           // height: '80vh',
            data: {
              billing_customers:repCustomers,
              cut_off_dt: Utility.convertDateToStr(new Date(cut_off_dt))
            },
            // panelClass: this.eirPdf?.length ? 'no-scroll-dialog' : '',
            direction: tempDirection
          });
          this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    
          });
        }
}