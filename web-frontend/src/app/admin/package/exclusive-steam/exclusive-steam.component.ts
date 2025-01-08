import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild,HostListener } from '@angular/core';
import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag, CdkDragHandle, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, FormsModule, ReactiveFormsModule, FormControl,AbstractControl,Validators } from '@angular/forms';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { NgClass, DatePipe, CommonModule } from '@angular/common';
import { NgScrollbar } from 'ngx-scrollbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UnsubscribeOnDestroyAdapter, TableElement, TableExportUtil } from '@shared';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { AdvanceTable } from 'app/advance-table/advance-table.model';
import { map, filter, tap, catchError, finalize, switchMap, debounceTime, startWith } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { Utility } from 'app/utilities/utility';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { StoringOrderTankDS, StoringOrderTankGO, StoringOrderTankItem, StoringOrderTankUpdateSO } from 'app/data-sources/storing-order-tank';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values'
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company'
import { MatRadioModule } from '@angular/material/radio';
import { Apollo } from 'apollo-angular';
import { MatDividerModule } from '@angular/material/divider';
//import { StoringOrderDS, StoringOrderGO, StoringOrderItem } from 'app/data-sources/storing-order';
//import { Observable, Subscription } from 'rxjs';
//import { TankDS, TankItem } from 'app/data-sources/tank';
//import { TariffCleaningDS, TariffCleaningGO, TariffCleaningItem } from 'app/data-sources/tariff-cleaning'
//import { ComponentUtil } from 'app/utilities/component-util';
import { CleaningCategoryDS, CleaningCategoryItem } from 'app/data-sources/cleaning-category';
//import { CleaningMethodDS, CleaningMethodItem } from 'app/data-sources/cleaning-method';
import { MatTabBody, MatTabGroup, MatTabHeader, MatTabsModule } from '@angular/material/tabs';
import {ExampleDataSource} from 'app/advance-table/advance-table.component';
import { AdvanceTableService } from 'app/advance-table/advance-table.service';
import { CustomerCompanyCleaningCategoryDS,CustomerCompanyCleaningCategoryItem } from 'app/data-sources/customer-company-category';
import {SearchCriteriaService} from 'app/services/search-criteria.service';
import { FormDialogComponent_New } from './form-dialog-new/form-dialog.component';
import { FormDialogComponent_Edit } from './form-dialog-edit/form-dialog.component';
import { ComponentUtil } from 'app/utilities/component-util';
import { TariffLabourDS,TariffLabourItem } from 'app/data-sources/tariff-labour';
import { TariffResidueDS,TariffResidueItem } from 'app/data-sources/tariff-residue';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { TariffSteamingDS, TariffSteamingItem } from 'app/data-sources/tariff-steam';
import { DeleteDialogComponent } from 'app/advance-table/dialogs/delete/delete.component';
import { PackageSteamingDS, PackageSteamingItem } from 'app/data-sources/package-steam';
import { PackageResidueItem } from 'app/data-sources/package-residue';
import { ExclusiveSteamingItem, PackageSteamingExclusiveDS } from 'app/data-sources/exclusive-steam';
@Component({
  selector: 'app-exclusive-residue',
  standalone: true,
  templateUrl: './exclusive-steam.component.html',
  styleUrl: './exclusive-steam.component.scss',
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
  ]
})
export class ExclusiveSteamComponent extends UnsubscribeOnDestroyAdapter
implements OnInit {
  displayedColumns = [
   // 'select',
    // // 'img',
       'customerCode',
       'companyName',
      'minTemp',
      'maxTemp',
      'cost',
      'labour',
     // 'qty',
      'lastUpdate',
      
    // 'mobile',
     'actions',
  ];

  pageTitle = 'MENUITEMS.PACKAGE.LIST.EXCLUSIVE-STEAMING'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT',
    'MENUITEMS.PACKAGE.TEXT'
  ]

  PROCEDURE_NAME = 'COMMON-FORM.PROCEDURE-NAME'
  PROCEDURE_DESCRIPTION = 'COMMON-FORM.DESCRIPTION'
  PROCEDURE_CLEAN_CATEGORY = 'COMMON-FORM.CLEAN-CATEGORY'
  PROCEDURE_CLEAN_GROUP = 'COMMON-FORM.CLEAN-GROUP'
  PROCEDURE_MIN_COST = 'COMMON-FORM.MIN-COST'
  PROCEDURE_MAX_COST = 'COMMON-FORM.MAX-COST'
  PROCEDURE_TOTAL_DURATION = 'COMMON-FORM.TOTAL-DURATION'
  PROCEDURE_REQUIRED = 'COMMON-FORM.IS-REQUIRED'
  PROCEDURE_STEPS = 'COMMON-FORM.PROCEDURE-STEPS'
  PROCEDURE_STEP_NAME = 'COMMON-FORM.STEP-NAME'
  PROCEDURE_STEP_DURATION = 'COMMON-FORM.STEP-DURATION'
  PROCEDURE_STEP_DURATION_TOOLTIP = 'COMMON-FORM.STEP-DURATION-TOOLTIP'
  CLEANING_GROUP_NAME = 'COMMON-FORM.GROUP-NAME'
  CLEANING_BAY = 'COMMON-FORM.BAY'
  
  CLEANING_LAST_UPDATED_DT = 'COMMON-FORM.LAST-UPDATED'

  customerCodeControl = new UntypedFormControl();
  categoryControl= new UntypedFormControl();
  
   ccDS: CustomerCompanyDS;
   packSteamExclDS:PackageSteamingExclusiveDS;

  // clnCatDS:CleaningCategoryDS;
  // custCompClnCatDS :CustomerCompanyCleaningCategoryDS;
  //packSteamDS : PackageSteamingDS;

  //tariffSteamItems : TariffSteamingItem[]=[];
  customer_companyList?: CustomerCompanyItem[];
  custCompClnCatItems : CustomerCompanyCleaningCategoryItem[]=[];
  
  packageSteamItems:PackageSteamingItem[]=[];

  pageIndex = 0;
  pageSize = 10;
  lastSearchCriteria: any;
  lastOrderBy: any = { create_dt: "ASC" };
  endCursor: string | undefined = undefined;
  previous_endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;
  

   exampleDatabase?: AdvanceTableService;
   dataSource!: ExampleDataSource;
  selection = new SelectionModel<PackageSteamingItem>(true, []);
  
  id?: number;
  advanceTable?: AdvanceTable;
  pcForm?: UntypedFormGroup;
  translatedLangText: any = {}
  
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.CARGO-DETAILS',
    HEADER_OTHER: 'COMMON-FORM.CARGO-OTHER-DETAILS',
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    CUSTOMER_COMPANY_NAME:'COMMON-FORM.COMPANY-NAME',
    SO_NO: 'COMMON-FORM.SO-NO',
    SO_NOTES: 'COMMON-FORM.SO-NOTES',
    HAULIER: 'COMMON-FORM.HAULIER',
    ORDER_DETAILS: 'COMMON-FORM.ORDER-DETAILS',
    UNIT_TYPE: 'COMMON-FORM.UNIT-TYPE',
    TANK_NO: 'COMMON-FORM.TANK-NO',
    PURPOSE: 'COMMON-FORM.PURPOSE',
    STORAGE: 'COMMON-FORM.STORAGE',
    STEAM: 'COMMON-FORM.STEAM',
    CLEANING: 'COMMON-FORM.CLEANING',
    REPAIR: 'COMMON-FORM.REPAIR',
    LAST_CARGO: 'COMMON-FORM.LAST-CARGO',
    CLEAN_STATUS: 'COMMON-FORM.CLEAN-STATUS',
    CERTIFICATE: 'COMMON-FORM.CERTIFICATE',
    REQUIRED_TEMP: 'COMMON-FORM.REQUIRED-TEMP',
    FLASH_POINT: 'COMMON-FORM.FLASH-POINT',
    JOB_NO: 'COMMON-FORM.JOB-NO',
    ETA_DATE: 'COMMON-FORM.ETA-DATE',
    REMARKS: 'COMMON-FORM.REMARKS',
    ETR_DATE: 'COMMON-FORM.ETR-DATE',
    ST: 'COMMON-FORM.ST',
    O2_LEVEL: 'COMMON-FORM.O2-LEVEL',
    OPEN_ON_GATE: 'COMMON-FORM.OPEN-ON-GATE',
    SO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    STATUS: 'COMMON-FORM.STATUS',
    UPDATE: 'COMMON-FORM.UPDATE',
    CANCEL: 'COMMON-FORM.CANCEL',
    STORING_ORDER: 'MENUITEMS.INVENTORY.LIST.STORING-ORDER',
    NO_RESULT: 'COMMON-FORM.NO-RESULT',
    SAVE_SUCCESS: 'COMMON-FORM.SAVE-SUCCESS',
    BACK: 'COMMON-FORM.BACK',
    SAVE_AND_SUBMIT: 'COMMON-FORM.SAVE-AND-SUBMIT',
    ARE_YOU_SURE_DELETE: 'COMMON-FORM.ARE-YOU-SURE-DELETE',
    DELETE: 'COMMON-FORM.DELETE',
    CLOSE: 'COMMON-FORM.CLOSE',
    INVALID: 'COMMON-FORM.INVALID',
    EXISTED: 'COMMON-FORM.EXISTED',
    DUPLICATE: 'COMMON-FORM.DUPLICATE',
    SELECT_ATLEAST_ONE: 'COMMON-FORM.SELECT-ATLEAST-ONE',
    ADD_ATLEAST_ONE: 'COMMON-FORM.ADD-ATLEAST-ONE',
    ROLLBACK_STATUS: 'COMMON-FORM.ROLLBACK-STATUS',
    CANCELED_SUCCESS: 'COMMON-FORM.CANCELED-SUCCESS',
    ARE_YOU_SURE_CANCEL: 'COMMON-FORM.ARE-YOU-SURE-CANCEL',
    ARE_YOU_SURE_ROLLBACK: 'COMMON-FORM.ARE-YOU-SURE-ROLLBACK',
    BULK: 'COMMON-FORM.BULK',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    UNDO: 'COMMON-FORM.UNDO',
    CARGO_NAME:'COMMON-FORM.CARGO-NAME',
    CARGO_ALIAS:'COMMON-FORM.CARGO-ALIAS',
    CARGO_DESCRIPTION:'COMMON-FORM.CARGO-DESCRIPTION',
    CARGO_CLASS:'COMMON-FORM.CARGO-CLASS',
    CARGO_CLASS_SELECT:'COMMON-FORM.CARGO-CLASS-SELECT',
    CARGO_UN_NO:'COMMON-FORM.CARGO-UN-NO',
    CARGO_METHOD:'COMMON-FORM.CARGO-METHOD',
    CARGO_CATEGORY:'COMMON-FORM.CARGO-CATEGORY',
    CARGO_FLASH_POINT:'COMMON-FORM.CARGO-FLASH-POINT',
    CARGO_COST :'COMMON-FORM.CARGO-COST',
    CARGO_HAZARD_LEVEL:'COMMON-FORM.CARGO-HAZARD-LEVEL',
    CARGO_BAN_TYPE:'COMMON-FORM.CARGO-BAN-TYPE',
    CARGO_NATURE:'COMMON-FORM.CARGO-NATURE',
    CARGO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    CARGO_ALERT :'COMMON-FORM.CARGO-ALERT',
    CARGO_NOTE :'COMMON-FORM.CARGO-NOTE',
    CARGO_CLASS_1 :"COMMON-FORM.CARGO-CALSS-1",
    CARGO_CLASS_1_4 :"COMMON-FORM.CARGO-CALSS-1-4",
    CARGO_CLASS_1_5 :"COMMON-FORM.CARGO-CALSS-1-5",
    CARGO_CLASS_1_6 :"COMMON-FORM.CARGO-CALSS-1-6",
    CARGO_CLASS_2_1 :"COMMON-FORM.CARGO-CALSS-2-1",
    CARGO_CLASS_2_2 :"COMMON-FORM.CARGO-CALSS-2-2",
    CARGO_CLASS_2_3 :"COMMON-FORM.CARGO-CALSS-2-3",
    PACKAGE_MIN_COST : 'COMMON-FORM.PACKAGE-MIN-COST',
    PACKAGE_MAX_COST : 'COMMON-FORM.PACKAGE-MAX-COST',
    PACKAGE_MIN_LABOUR : 'COMMON-FORM.PACKAGE-MIN-LABOUR',
    PACKAGE_MAX_LABOUR : 'COMMON-FORM.PACKAGE-MAX-LABOUR',
    PACKAGE_DETAIL:'COMMON-FORM.PACKAGE-DETAIL',
    PACKAGE_CLEANING_ADJUSTED_COST:"COMMON-FORM.PACKAGE-CLEANING-ADJUST-COST",
    DESCRIPTION : 'COMMON-FORM.DESCRIPTION',
    COST : 'COMMON-FORM.COST',
    LAST_UPDATED:"COMMON-FORM.LAST-UPDATED",
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    MAX_TEMP:'COMMON-FORM.MAX-TEMP',
    MIN_TEMP:'COMMON-FORM.MIN-TEMP',
    QTY:'COMMON-FORM.QTY',
    LABOUR:'COMMON-FORM.LABOUR',
    CONFIRM_DELETE:'COMMON-FORM.CONFIRM-DELETE'
     }
  
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
   // public advanceTableService: AdvanceTableService,
    private snackBar: MatSnackBar,
    private searchCriteriaService: SearchCriteriaService,
    private translate: TranslateService

  ) {
    super();
    this.initTcForm();
     this.ccDS = new CustomerCompanyDS(this.apollo);
    // this.clnCatDS= new CleaningCategoryDS(this.apollo);
    // this.custCompClnCatDS=new CustomerCompanyCleaningCategoryDS(this.apollo);
    this.packSteamExclDS= new PackageSteamingExclusiveDS(this.apollo);
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
    this.translateLangText();
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }
  
  initTcForm() {
    this.pcForm = this.fb.group({
      guid: [{value:''}],
      customer_code: [''],
      min_cost:[''],
      max_cost:[''],
      min_labour:[''],
      max_labour:['']
      
    });
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
  }

  refresh() {
    this.loadData();
  }

   addCall() {
    // this.preventDefault(event);  // Prevents the form submission
     let tempDirection: Direction;
     if (localStorage.getItem('isRtl') === 'true') {
       tempDirection = 'rtl';
     } else {
       tempDirection = 'ltr';
     }
    //  var rows :CustomerCompanyCleaningCategoryItem[] =[] ;
    //  rows.push(row);
     const dialogRef = this.dialog.open(FormDialogComponent_New,{
       width: '600px',
       height:'auto',
       data: {
         action: 'new',
         langText: this.langText,
         selectedItem:null
       }
         
     });

     this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result>0) {
           this.handleSaveSuccess(result);
           //this.search();
          // this.onPageEvent({pageIndex:this.pageIndex,pageSize:this.pageSize,length:this.pageSize});
    
      }
   });
    }
  
  addNew() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }


  }

  preventDefault(event: Event) {
    event.preventDefault(); // Prevents the form submission
  }

  displayLastUpdated(r: TariffLabourItem) {
    var updatedt= r.update_dt;
    if(updatedt===null)
    {
      updatedt= r.create_dt;
    }
    const date = new Date(updatedt! * 1000);
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();   

   // Replace the '/' with '-' to get the required format
 

    return `${day}/${month}/${year}`;

  }
  adjustCost()
  {
    if(this.selection.selected.length===0  )return;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent_New,{
      width: '1000px',
      data: {
        action: 'edit',
        langText: this.langText,
        selectedItems:this.selection.selected
      }
        
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
         
          if(result>0)
          {
            this.handleSaveSuccess(result);
            //this.search();
            if(this.packSteamExclDS.totalCount>0)
            {
              this.onPageEvent({pageIndex:this.pageIndex,pageSize:this.pageSize,length:this.pageSize});
            }
          //}
          }
    
      });
  }

  editCall(row: ExclusiveSteamingItem) {
     // this.preventDefault(event);  // Prevents the form submission
     let tempDirection: Direction;
     if (localStorage.getItem('isRtl') === 'true') {
       tempDirection = 'rtl';
     } else {
       tempDirection = 'ltr';
     }
    //  var rows :CustomerCompanyCleaningCategoryItem[] =[] ;
    //  rows.push(row);
     const dialogRef = this.dialog.open(FormDialogComponent_New,{
       width: '600px',
       height:'auto',
       data: {
         action: 'edit',
         langText: this.langText,
         selectedItem:row
       }
         
     });

     this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result>0) {
           this.handleSaveSuccess(result);
           //this.search();
          // this.onPageEvent({pageIndex:this.pageIndex,pageSize:this.pageSize,length:this.pageSize});
    
      }
   });
   
  }

  
  deleteItem(event:Event,row: ExclusiveSteamingItem) {
    
    event.preventDefault(); // Prevents the form submission

    let msgText= `${this.ccDS.displayName(row.package_steaming?.customer_company)} - ${row.tariff_cleaning?.cargo}`;
    let msgText1=`Temp- min :${row.temp_min} , max:${row.temp_max}`;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        headerText: this.translatedLangText.CONFIRM_DELETE,
        messageText:[msgText,msgText1],
        action: 'new',
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result.action === 'confirmed') {
        this.deleteExclusiveSteam(row);
      }
    });
    
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.packageSteamItems.length;
    return numSelected === numRows;
  }

  isSelected(option: any): boolean {
    return this.customerCodeControl.value.includes(option);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
     this.isAllSelected()
       ? this.selection.clear()
       : this.packageSteamItems.forEach((row) =>
           this.selection.select(row)
         );
  }



  search()
  {
    const where: any = {
      and:[]
    };

    if (this.pcForm!.get('customer_code')?.value) {
      const soSome: any = {};

      
      where.and.push({package_steaming:{customer_company : { code: { contains: this.pcForm!.value['customer_code'].code } }}});
      
    }

    if (this.pcForm!.value["min_labour"])
      {
        
        const minLabour :number = Number(this.pcForm!.value["min_labour"]);
        where.and.push({package_steaming:{labour :{gte:minLabour}}})
      }
  
      if (this.pcForm!.value["max_labour"])
        {
         
          const maxLabour :number = Number(this.pcForm!.value["max_labour"]);
          where.and.push({package_steaming:{labour :{ngte:maxLabour}}})
          
        }

    if (this.pcForm!.value["min_cost"])
    {
      
      const minCost :number = Number(this.pcForm!.value["min_cost"]);
      where.and.push({package_steaming:{cost :{gte:minCost}}})
    }

    if (this.pcForm!.value["max_cost"])
      {
       
        const maxCost :number = Number(this.pcForm!.value["max_cost"]);
        where.and.push({package_steaming:{cost :{ngte:maxCost}}})
        
      }
      this.lastSearchCriteria=where;
    this.subs.sink = this.packSteamExclDS.SearchExclusiveSteam(where,this.lastOrderBy,this.pageSize).subscribe(data => {
       this.packageSteamItems=data;
       this.previous_endCursor=undefined;
       this.endCursor = this.packSteamExclDS.pageInfo?.endCursor;
       this.startCursor = this.packSteamExclDS.pageInfo?.startCursor;
       this.hasNextPage = this.packSteamExclDS.pageInfo?.hasNextPage ?? false;
       this.hasPreviousPage = this.packSteamExclDS.pageInfo?.hasPreviousPage ?? false;
       this.pageIndex=0;
       this.paginator.pageIndex=0;
       this.selection.clear();
       if(!this.hasPreviousPage)
        this.previous_endCursor=undefined;
    });
  }
  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.langText.SAVE_SUCCESS;
      this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
        successMsg = res;
        ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
        
      });
    }
  }

  onPageEvent(event: PageEvent) {
    const { pageIndex, pageSize,previousPageIndex } = event;
    let first : number| undefined = undefined;
    let after: string | undefined = undefined;
    let last: number | undefined = undefined;
    let before: string | undefined = undefined;
    let order:any|undefined=this.lastOrderBy;
    // Check if the page size has changed
    if (this.pageSize !== pageSize) {
      // Reset pagination if page size has changed
      this.pageIndex = 0;
      this.pageSize=pageSize;
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
      else if (pageIndex==this.pageIndex)
      {
        
          first = pageSize;
          after = this.previous_endCursor;
     
          
          //this.paginator.pageIndex=this.pageIndex;
          
      }
    }

      this.searchData(this.lastSearchCriteria,order,first,after,last,before,pageIndex,previousPageIndex);
    //}
  }

   searchData(where :any, order:any, first:any, after:any, last:any,before:any , pageIndex:number,
    previousPageIndex?:number)
    {
      this.previous_endCursor=this.endCursor;
      this.subs.sink = this.packSteamExclDS.SearchExclusiveSteam(where,order,first,after,last,before).subscribe(data => {
        this.packageSteamItems=data;
        this.endCursor = this.packSteamExclDS.pageInfo?.endCursor;
        this.startCursor = this.packSteamExclDS.pageInfo?.startCursor;
        this.hasNextPage = this.packSteamExclDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPage = this.packSteamExclDS.pageInfo?.hasPreviousPage ?? false;
        this.pageIndex=pageIndex;
        this.paginator.pageIndex=this.pageIndex;
        this.selection.clear();
        if(!this.hasPreviousPage)
          this.previous_endCursor=undefined;
     });
    }
  
  storeSearchCriteria(where :any, order:any, first:any, after:any, last:any,before:any, pageIndex:number,
    previousPageIndex?:number,length?:number,hasNextPage?:boolean, hasPreviousPage?:boolean)
  {
    const sCriteria: any = {};
    sCriteria.where = where;
    sCriteria.order = order;
    sCriteria.first = first;
    sCriteria.after = after;
    sCriteria.last = last;
    sCriteria.before = before;
    sCriteria.pageIndex= pageIndex;
    sCriteria.previousPageIndex=previousPageIndex;
    sCriteria.length = length;
    sCriteria.hasNextPage=hasNextPage;
    sCriteria.hasPreviousPage=hasPreviousPage;
    
    this.searchCriteriaService.setCriteria(sCriteria);
  }

  removeSelectedRows() {
    // const totalSelect = this.selection.selected.length;
    // this.selection.selected.forEach((item) => {
    //   const index: number = this.dataSource.renderedData.findIndex(
    //     (d) => d === item
    //   );
    //   // console.log(this.dataSource.renderedData.findIndex((d) => d === item));
    //   this.exampleDatabase?.dataChange.value.splice(index, 1);
    //   this.refreshTable();
    //   this.selection = new SelectionModel<AdvanceTable>(true, []);
    // });
    // this.showNotification(
    //   'snackbar-danger',
    //   totalSelect + ' Record Delete Successfully...!!!',
    //   'bottom',
    //   'center'
    // );
  }

  initializeFilterCustomerCompany() {
    this.pcForm!.get('customer_code')!.valueChanges.pipe(
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

    
  }

  public loadData() {

   
  
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
  onContextMenu(event: MouseEvent, item: AdvanceTable) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    if (this.contextMenu !== undefined && this.contextMenu.menu !== null) {
      this.contextMenu.menuData = { item: item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }

  onlyNumbersDashValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const regex = /^[0-9-]*$/;
    if (control.value && !regex.test(control.value)) {
      return { 'invalidCharacter': true };
    }
    return null;
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
    this.initTcForm();
    
    //this.customerCodeControl.reset('');
   
  }

  deleteExclusiveSteam(exclusiveSteam:ExclusiveSteamingItem)
  {
    let exclusiveSteamGuid :String = exclusiveSteam.guid!;
    this.packSteamExclDS.deleteExclusiveSteam([exclusiveSteamGuid]).subscribe(result=>{
      if(result.data.deleteSteamingExclusive>0)
      {
        this.handleSaveSuccess(result.data.deleteSteamingExclusive);
        this.onPageEvent({pageIndex:this.pageIndex,pageSize:this.pageSize,length:this.pageSize});
      }
    })
  }
}

