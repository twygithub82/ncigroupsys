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
import { BillingDS, BillingItem ,BillingEstimateRequest} from 'app/data-sources/billing';
import { MatCardModule } from '@angular/material/card';
import { GuidSelectionModel } from '@shared/GuidSelectionModel';
import {UpdateInvoicesDialogComponent} from '../form-dialog/update-invoices.component'

@Component({
  selector: 'app-invoices',
  standalone: true,
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss',
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
    MatCardModule
  ]
})
export class InvoicesComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'select',
    'invoice_dt',
    'invoice_no',
    'customer',
    'currency',
    // 'last_cargo',
    // 'purpose',
    // 'tank_status_cv'
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
    CURRENCY:'COMMON-FORM.CURRENCY',
    BILLING_BRANCH:'COMMON-FORM.BILLING-BRANCH',
    SAVE_SUCCESS: 'COMMON-FORM.SAVE-SUCCESS',
    CONFIRM_REMOVE_INVOICES:'COMMON-FORM.CONFIRM-REMOVE-INVOICES'
  }

  distinctCustomerCodes:any;
  selectedEstimateItem?:any;
  searchForm?: UntypedFormGroup;
  customerCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  branchCodeControl = new UntypedFormControl();

  billDS:BillingDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  cvDS: CodeValuesDS;
  tcDS: TariffCleaningDS;

  selection = new GuidSelectionModel<any>(true, []);
  billList:any[]=[];
  sotList: StoringOrderTankItem[] = [];
  customer_companyList?: CustomerCompanyItem[];
  branch_companyList?:CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];
  purposeOptionCvList: CodeValuesItem[] = [];
  eirStatusCvList: CodeValuesItem[] = [];
  tankStatusCvList: CodeValuesItem[] = [];
  tankStatusCvListDisplay: CodeValuesItem[] = [];
  yardCvList: CodeValuesItem[] = [];

  pageIndex = 0;
  pageSize = 10;
  lastSearchCriteria: any;
  lastOrderBy: any = { invoice_dt: "DESC" };
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
    this.billDS = new BillingDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);
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
      yard_cv: [''],
      invoice_no:['']
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
    this.search();
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
    const where: any ={};
       this.selectedEstimateItem=undefined;
      
      // this.calculateTotalCost();
   
       //where.status_cv={in:['COMPLETED','APPROVED']};
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
   
       if (this.searchForm!.get('last_cargo')?.value) {
        // if(!where.storing_order_tank) where.storing_order_tank={};
         
         //where.storing_order_tank.tariff_cleaning={guid:{eq:this.searchForm!.get('last_cargo')?.value.guid} };
         //where.eir_dt = { gte: Utility.convertDate(this.searchForm!.value['eir_dt_start']), lte: Utility.convertDate(this.searchForm!.value['eir_dt_end']) };

         const itm:any={or:[]};
        
         itm.or.push({cleaning:{some:{storing_order_tank:{tariff_cleaning:{guid:{eq:this.searchForm!.get('last_cargo')?.value.guid}}}}}});
         itm.or.push({repair_customer:{some:{storing_order_tank:{tariff_cleaning:{guid:{eq:this.searchForm!.get('last_cargo')?.value.guid}}}}}});
         itm.or.push({repair_owner:{some:{storing_order_tank:{tariff_cleaning:{guid:{eq:this.searchForm!.get('last_cargo')?.value.guid}}}}}});
         itm.or.push({residue:{some:{storing_order_tank:{tariff_cleaning:{guid:{eq:this.searchForm!.get('last_cargo')?.value.guid}}}}}});
         itm.or.push({steaming:{some:{storing_order_tank:{tariff_cleaning:{guid:{eq:this.searchForm!.get('last_cargo')?.value.guid}}}}}});
         itm.or.push({gateio_billing_sot:{some:{storing_order_tank:{tariff_cleaning:{guid:{eq:this.searchForm!.get('last_cargo')?.value.guid}}}}}});
         itm.or.push({lolo_billing_sot:{some:{storing_order_tank:{tariff_cleaning:{guid:{eq:this.searchForm!.get('last_cargo')?.value.guid}}}}}});
         itm.or.push({preinsp_billing_sot:{some:{storing_order_tank:{tariff_cleaning:{guid:{eq:this.searchForm!.get('last_cargo')?.value.guid}}}}}});
         itm.or.push({storage_billing_sot:{some:{storing_order_tank:{tariff_cleaning:{guid:{eq:this.searchForm!.get('last_cargo')?.value.guid}}}}}});

         where.and.push(itm);
       }
   
      
       this.lastSearchCriteria = this.billDS.addDeleteDtCriteria(where);
       this.performSearch(this.pageSize, this.pageIndex, this.pageSize, undefined, undefined, undefined);
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string) {
    this.billList =[];
    this.selection.clear();
    this.subs.sink = this.billDS.searchBillingWithBillingSOT(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
      .subscribe(data => {
        this.billList = data;
        this.endCursor = this.billDS.pageInfo?.endCursor;
        this.startCursor = this.billDS.pageInfo?.startCursor;
        this.hasNextPage = this.billDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPage = this.billDS.pageInfo?.hasPreviousPage ?? false;
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
    this.branchCodeControl.reset('');
  }

  filterDeleted(resultList: any[] | undefined): any {
    return (resultList || []).filter((row: any) => !row.delete_dt);
  }

  isAllSelected() {
    // this.calculateTotalCost();
     const numSelected = this.selection.selected.length;
     const numRows = this.billList.length;
     return numSelected === numRows;
   }
 
   /** Selects all rows if they are not all selected; otherwise clear selection. */
   masterToggle() {
      this.isAllSelected()
        ? this.selection.clear()
        : this.billList.forEach((row) =>
            this.selection.select(row)
          );
     //this.calculateTotalCost();
   }

   toggleRow(row:BillingItem)
      {
       
        this.selection.toggle(row);
        this.SelectFirstItem();
       // this.calculateTotalCost();
      }
   
      SelectFirstItem()
      {
       if(!this.selection.selected.length)
       {
         this.selectedEstimateItem=undefined;
       }
       else if(this.selection.selected.length===1)
       {
         this.selectedEstimateItem=this.selection.selected[0];
       }
      }
      CheckBoxDisable(row:BillingItem)
      {
        if(this.selectedEstimateItem?.customer_company)
        {
        if(row.customer_company?.code!=this.selectedEstimateItem.customer_company?.code)
        {
         return true;
        }
       }
        return false;
      }
   
      MasterCheckBoxDisable()
      {
        if(this.distinctCustomerCodes?.length)
        {
           return this.distinctCustomerCodes.length>1;
        }
   
        return false;
      }
   
      isItemSelected(row:BillingItem)
      {
       return this.selection.selected.some(s => s.guid === row.guid);
      }

       handleDelete(event:Event)
        {
          event.preventDefault(); // Prevents the form submission
          if(this.selection.selected.length===0) return;
          let tempDirection: Direction;
          if (localStorage.getItem('isRtl') === 'true') {
            tempDirection = 'rtl';
          } else {
            tempDirection = 'ltr';
          }
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
              headerText: this.translatedLangText.CONFIRM_REMOVE_INVOICES,
              action: 'delete',
            },
            direction: tempDirection
          });
          this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
            if (result.action === 'confirmed') {
             this.DeleteSelectedInvoices();
            }
          });
        }

    
    InvoiceUpdate(row?:BillingItem)
    {
       let billItems:BillingItem[]=[];
       if (row) {
        // If 'row' is defined, assign its contents to 'billItems'
        billItems = [row];
      } else {
        // If 'row' is not defined, assign the selected items to 'billItems'
        billItems = this.selection.selected;
      }
      this.updateInvoices(billItems);
    }

    updateInvoices(billItems:BillingItem[])
    {
       let tempDirection: Direction;
          if (localStorage.getItem('isRtl') === 'true') {
            tempDirection = 'rtl';
          } else {
            tempDirection = 'ltr';
          }
          if(billItems.length===0) return;
          const dialogRef = this.dialog.open(UpdateInvoicesDialogComponent,{
            width: '700px',
            height:'650px',
            data: {
              action: 'update',
              langText: this.langText,
              selectedItems:billItems
            },
            position: {
              top: '50px'  // Adjust this value to move the dialog down from the top of the screen
            }
              
          });
      
          this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
               if (result>0) {
                //if(result.selectedValue>0)
               // {
                  this.handleSaveSuccess(result);
                  this.onPageEvent({pageIndex:this.pageIndex,pageSize:this.pageSize,length:this.pageSize});
                //}
            }
            });

    }

    handleSaveSuccess(count: any) {
      if ((count ?? 0) > 0) {
        let successMsg = this.translatedLangText.SAVE_SUCCESS;
        this.translate.get(this.translatedLangText.SAVE_SUCCESS).subscribe((res: string) => {
          successMsg = res;
          ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
          
        });
      }
    }

    DeleteSelectedInvoices()
    {
        var estimateItems:BillingEstimateRequest[]=[]
        this.selection.selected.forEach(i=>{

          if(i.cleaning.length)
          {
              var est = this.GetEstimateItem(i.cleaning,"CUSTOMER","CLEANING");
              estimateItems=[...estimateItems,...est];
          }
          if(i.gateio_billing_sot.length)
          {
            var est = this.GetEstimateItem(i.gateio_billing_sot,"CUSTOMER","GATE");
            estimateItems=[...estimateItems,...est];
          }
          if(i.lolo_billing_sot.length)
          {
            var est = this.GetEstimateItem(i.lolo_billing_sot,"CUSTOMER","LOLO");
            estimateItems=[...estimateItems,...est];
          }
          if(i.repair_customer.length)
            {
              var est = this.GetEstimateItem(i.repair_customer,"CUSTOMER","REPAIR");
              estimateItems=[...estimateItems,...est];
            }
          if(i.repair_owner.length)
            {
              var est = this.GetEstimateItem(i.repair_owner,"OWNER","REPAIR");
              estimateItems=[...estimateItems,...est];
            }
          if(i.storage_billing_sot.length)
            {
              var est = this.GetEstimateItem(i.storage_billing_sot,"CUSTOMER","STORAGE");
              estimateItems=[...estimateItems,...est];
            }
          if(i.residue.length)
            {
              var est = this.GetEstimateItem(i.residue,"CUSTOMER","RESIDUE");
              estimateItems=[...estimateItems,...est];
            }
          if(i.steaming.length)
            {
              var est = this.GetEstimateItem(i.steaming,"CUSTOMER","STEAMING");
              estimateItems=[...estimateItems,...est];
            }

          
        });

        if(estimateItems.length)
        {
          this.RemoveEstimateFromInvoice(estimateItems);
        }
    }

    RemoveEstimateFromInvoice( billingEstimateRequests:BillingEstimateRequest[])
  {
    var updateBilling: any=null;
    // var billingEstReq:BillingEstimateRequest= new BillingEstimateRequest();
    // billingEstReq.action="CANCEL";
    // billingEstReq.billing_party=this.billingParty;
    // billingEstReq.process_guid=processGuid;
    // billingEstReq.process_type=this.processType;
    // let billingEstimateRequests:BillingEstimateRequest[]=[];
    // billingEstimateRequests.push(billingEstReq);
   
    this.billDS.updateBilling(updateBilling,billingEstimateRequests).subscribe(result=>{
      if(result.data.updateBilling)
      {
        this.handleSaveSuccess(result.data.updateBilling);
        this.search();
      }
    })

  }

    GetEstimateItem(estimates:any[],billingParty:string,processType:string):any
    {
      var retval:any=[];
      estimates.forEach(e=>{

        var updateBilling: any=null;
        var billingEstReq:BillingEstimateRequest= new BillingEstimateRequest();
        billingEstReq.action="CANCEL";
        billingEstReq.billing_party=billingParty;
        billingEstReq.process_guid=e.guid;
        billingEstReq.process_type=processType;
        
        retval.push(billingEstReq);
      });

      return retval

    }


    
}