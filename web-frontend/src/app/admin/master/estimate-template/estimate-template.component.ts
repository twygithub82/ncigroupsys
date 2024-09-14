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
// import { StoringOrderService } from 'app/services/storing-order.service';
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
import { FormDialogComponent } from './form-dialog/form-dialog.component';
import { ComponentUtil } from 'app/utilities/component-util';
import { PackageDepotDS,PackageDepotItem,PackageDepotGO } from 'app/data-sources/package-depot';
import { TariffDepotDS,TariffDepotItem } from 'app/data-sources/tariff-depot';
import { pack } from 'd3';
import { PackageRepairDS, PackageRepairItem } from 'app/data-sources/package-repair';
import {FormDialogComponent_Edit_Cost} from './form-dialog-edit-cost/form-dialog.component';
import { MasterEstimateTemplateDS,MasterTemplateItem } from 'app/data-sources/master-template';

@Component({
  selector: 'app-package-repair',
  standalone: true,
  templateUrl: './estimate-template.component.html',
  styleUrl: './estimate-template.component.scss',
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


export class EstimateTemplateComponent extends UnsubscribeOnDestroyAdapter
implements OnInit {
  displayedColumns = [
   // 'select',
    // // 'img',
    
    'fName',
    'dimension',
    'lName',
    // 'custCode',
    // 'custCompanyName',
     'email',
    // 'subgroup',
    // 'gender',
    // 'bDate',
    // 'mobile',
  ];

  pageTitle = 'MENUITEMS.PACKAGE.LIST.PACKAGE-REPAIR'
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
  templateNameControl= new UntypedFormControl();
  

  // groupNameControl = new UntypedFormControl();
  // subGroupNameControl = new UntypedFormControl();
  // handledItemControl = new UntypedFormControl();


  // groupNameCvList: CodeValuesItem[] = [];
  // subGroupNameCvList: CodeValuesItem[] = [];
  // handledItemCvList: CodeValuesItem[] = [];


  // storageCalCvList : CodeValuesItem[]=[];
  CodeValuesDS?:CodeValuesDS;
 // packDepotDS : PackageDepotDS;
  masterEstTempDS : MasterEstimateTemplateDS;
  ccDS: CustomerCompanyDS;
  //tariffDepotDS:TariffDepotDS;
 // clnCatDS:CleaningCategoryDS;
  custCompDS :CustomerCompanyDS;

  //packDepotItems:PackageDepotItem[]=[];
  masterTemplateItem:MasterTemplateItem[]=[];
  masterTempItemOnly:MasterTemplateItem[]=[];
  
  custCompClnCatItems : CustomerCompanyCleaningCategoryItem[]=[];
  customer_companyList: CustomerCompanyItem[]=[];
  cleaning_categoryList?: CleaningCategoryItem[];

  pageIndex = 0;
  pageSize = 10;
  lastSearchCriteria: any;
  lastOrderBy: any = { template_name: "ASC" };
  endCursor: string | undefined = undefined;
  previous_endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;
  
  searchField: string = "";
   exampleDatabase?: AdvanceTableService;
   dataSource!: ExampleDataSource;
  selection = new SelectionModel<PackageDepotItem>(true, []);
  
  id?: number;
  advanceTable?: AdvanceTable;
  mtForm?: UntypedFormGroup;
  translatedLangText: any = {}
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.CARGO-DETAILS',
    HEADER_OTHER: 'COMMON-FORM.CARGO-OTHER-DETAILS',
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
    CARGO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    PACKAGE_MIN_COST : 'COMMON-FORM.PACKAGE-MIN-COST',
    PACKAGE_MAX_COST : 'COMMON-FORM.PACKAGE-MAX-COST',
    PACKAGE_DETAIL:'COMMON-FORM.PACKAGE-DETAIL',
    PACKAGE_CLEANING_ADJUSTED_COST:"COMMON-FORM.PACKAGE-CLEANING-ADJUST-COST",
    EMAIL:'COMMON-FORM.EMAIL',
    PHONE:'COMMON-FORM.PHONE',
    PROFILE_NAME:'COMMON-FORM.PROFILE-NAME',
    VIEW:'COMMON-FORM.VIEW',
    DEPOT_PROFILE:'COMMON-FORM.DEPOT-PROFILE',
    DESCRIPTION:'COMMON-FORM.DESCRIPTION',
    PREINSPECTION_COST:"COMMON-FORM.PREINSPECTION-COST",
    LOLO_COST:"COMMON-FORM.LOLO-COST",
    STORAGE_COST:"COMMON-FORM.STORAGE-COST",
    FREE_STORAGE:"COMMON-FORM.FREE-STORAGE",
    LAST_UPDATED_DT : 'COMMON-FORM.LAST-UPDATED',
    STANDARD_COST:"COMMON-FORM.STANDARD-COST",
    CUSTOMER_COST:"COMMON-FORM.CUSTOMER-COST",
    STORAGE_CALCULATE_BY:"COMMON-FORM.STORAGE-CALCULATE-BY",
    COST: 'COMMON-FORM.COST',
    LAST_UPDATED: "COMMON-FORM.LAST-UPDATED",
    GROUP_NAME: "COMMON-FORM.GROUP-NAME",
    SUB_GROUP_NAME: "COMMON-FORM.SUB-GROUP-NAME",
    PART_NAME: "COMMON-FORM.PART-NAME",
    MIN_COST: "COMMON-FORM.MIN-COST",
    MAX_COST: "COMMON-FORM.MAX-COST",
    LENGTH: "COMMON-FORM.LENGTH",
    MIN_LENGTH: "COMMON-FORM.MIN-LENGTH",
    MAX_LENGTH: "COMMON-FORM.MAX-LENGTH",
    MIN_LABOUR: "COMMON-FORM.MIN-LABOUR",
    MAX_LABOUR: "COMMON-FORM.MAX-LABOUR",
    HANDLED_ITEM: "COMMON-FORM.HANDLED-ITEM",
    LABOUR_HOUR: "COMMON-FORM.LABOUR-HOUR",
    MATERIAL_COST: "COMMON-FORM.MATERIAL-COST",
    DIMENSION :"COMMON-FORM.DIMENSION",
    TEMPLATE_NAME:"COMMON-FORM.TEMPLATE-NAME",
    TEMPLATE_TYPE:"COMMON-FORM.TEMPLATE-TYPE",
    TEMPLATE_TYPE_GENERAL:"COMMON-FORM.TEMPLATE-TYPE-GENERAL",
    TEMPLATE_TYPE_EXCLUSIVE:"COMMON-FORM.TEMPLATE-TYPE-EXCLUSIVE",
    TOTAL_MATERIAL_COST:"COMMON-FORM.TOTAL-MATERIAL-COST"
    
     }
  
  constructor(
    private router: Router,
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
    this.initMtForm();
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.masterEstTempDS=new MasterEstimateTemplateDS(this.apollo);
    //this.tariffDepotDS = new TariffDepotDS(this.apollo);
    this.custCompDS=new CustomerCompanyDS(this.apollo);
   // this.packDepotDS = new PackageDepotDS(this.apollo);
    this.CodeValuesDS=new CodeValuesDS(this.apollo);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.loadData();
    this.translateLangText();
    var state = history.state;
    if(state.type=="estimate-template")
    {
      let showResult = state.pagination.showResult;
      if(showResult)
      {
      this.searchCriteriaService=state.pagination.where;
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

  initMtForm() {
    this.mtForm = this.fb.group({
      customer_code: this.customerCodeControl,
      template_name: this.templateNameControl,
      part_name: ['']

      
    });
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
  }

  refresh() {
    this.loadData();
  }
  addNew() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
   
  }
  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }


  preventDefault(event: Event) {
    event.preventDefault(); // Prevents the form submission
  }


  adjustCost()
  {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    //if(this.selection.isEmpty()) return;
    const dialogRef = this.dialog.open(FormDialogComponent_Edit_Cost,{
      width: '800px',
      data: {
        action: 'update',
        langText: this.langText,
        selectedItems:this.selection.selected
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
            if(this.masterTemplateItem.length>1)
                this.onPageEvent({pageIndex:this.pageIndex,pageSize:this.pageSize,length:this.pageSize});
          //}
      }
      });
  }

  addCallSelection(event: Event)
  {
    event.stopPropagation(); // Stop the click event from propagating
 // Navigate to the route and pass the JSON object
    this.router.navigate(['/admin/master/estimate-template/new/ '], {
      state: { id: '' ,
        type:'estimate-template',
        pagination:{
          where :this.lastSearchCriteria,
          pageSize:this.pageSize,
          pageIndex:this.pageIndex,
          hasPreviousPage:this.hasPreviousPage,
          startCursor:this.startCursor,
          endCursor:this.endCursor,
          previous_endCursor:this.previous_endCursor,
          
          showResult: this.masterEstTempDS.totalCount>0
          
        }
      }
    });
  }
  
  editCall(row: PackageRepairItem) {
   // this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    var rows :PackageRepairItem[] =[] ;
    rows.push(row);
    const dialogRef = this.dialog.open(FormDialogComponent,{
      
      width: '800px',
     
      data: {
        action: 'update',
        langText: this.langText,
        selectedItems:rows
      },
      position: {
        top: '50px'  // Adjust this value to move the dialog down from the top of the screen
      }
        
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
         //if (result) {
          if(result>0)
            {
              this.handleSaveSuccess(result);
              //this.search();
              if(this.masterTemplateItem.length>1)
                  this.onPageEvent({pageIndex:this.pageIndex,pageSize:this.pageSize,length:this.pageSize});
            }
      //}
      });
   
  }

  
  
  deleteItem(row: AdvanceTable) {
   
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.masterTemplateItem.length;
    return numSelected === numRows;
  }

  isSelected(option: any): boolean {
    return this.customerCodeControl.value.includes(option);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
     this.isAllSelected()
       ? this.selection.clear()
       : this.masterTemplateItem.forEach((row) =>
           this.selection.select(row)
         );
  }



  search()
  {
    const where: any = {};


    if (this.customerCodeControl.value) {
      if(this.customerCodeControl.value.length>0)
        {
         
        
          const customerCodes :CustomerCompanyItem[] = this.customerCodeControl.value;
          var guids = customerCodes.map(cc=>cc.guid);
          where.template_est_customer = where.template_est_customer || {};
          where.template_est_customer={some:{customer_company_guid : { in: guids }}};
        }
    }

    if (this.templateNameControl.value) {
      if(this.templateNameControl.value.length>0)
        {
          const template_names :string[] = this.templateNameControl.value;
          where.template_name = { in: template_names };
        }
    }

    if ( this.mtForm?.get('part_name')?.value) {
         const partNameValue = this.mtForm.get('part_name')?.value;

 
          where.template_est_part = {
            ...where.template_est_part,
            some: { 
              description: { contains: partNameValue } 
            }
          };
        
    }
    
    

      this.lastSearchCriteria=where;
    this.subs.sink = this.masterEstTempDS.SearchEstimateTemplate(where,this.lastOrderBy,this.pageSize).subscribe(data => {
       this.masterTemplateItem=data;
       let a = this.masterTemplateItem[0].getTotalMaterialCost();
              // data[0].storage_cal_cv
       this.previous_endCursor=undefined;
       this.endCursor = this.masterEstTempDS.pageInfo?.endCursor;
       this.startCursor = this.masterEstTempDS.pageInfo?.startCursor;
       this.hasNextPage = this.masterEstTempDS.pageInfo?.hasNextPage ?? false;
       this.hasPreviousPage = this.masterEstTempDS.pageInfo?.hasPreviousPage ?? false;
       this.pageIndex=0;
       this.paginator.pageIndex=0;
       this.selection.clear();
       if(!this.hasPreviousPage)
        this.previous_endCursor=undefined;
    });
  }
  // selectStorageCalculateCV_Description(valCode?:string):string
  // {
  //   let valCodeObject: CodeValuesItem = new CodeValuesItem();
  //   if(this.storageCalCvList.length>0)
  //   {
  //     valCodeObject = this.storageCalCvList.find((d: CodeValuesItem) => d.code_val === valCode)|| new CodeValuesItem();
      
  //     // If no match is found, description will be undefined, so you can handle it accordingly
      
  //   }
  //   return valCodeObject.description || '-';
    
  // }

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
      //if (pageIndex > this.pageIndex && this.hasNextPage) {
        if (pageIndex > this.pageIndex ) {
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
      this.subs.sink = this.masterEstTempDS.SearchEstimateTemplate(where,order,first,after,last,before).subscribe(data => {
        this.masterTemplateItem=data;
        this.endCursor = this.masterEstTempDS.pageInfo?.endCursor;
        this.startCursor = this.masterEstTempDS.pageInfo?.startCursor;
        this.hasNextPage = this.masterEstTempDS.pageInfo?.hasNextPage ?? false;
        this.hasPreviousPage = this.masterEstTempDS.pageInfo?.hasPreviousPage ?? false;
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
   
  }
  public loadData() {

    this.subs.sink = this.ccDS.loadItems({}, { code: 'ASC' }).subscribe(data => {
     // this.customer_companyList1 = data
    });

     this.masterEstTempDS.SearchEstimateTemplateOnly({},{template_name:'ASC'}).subscribe(data=>{
        this.masterTempItemOnly=data;
     })

   
  
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
  // displayGroupNameCodeValue_Description(codeValue: String) {
  //   return this.GetCodeValue_Description(codeValue, this.groupNameCvList);
  // }

  // displaySubGroupNameCodeValue_Description(codeValue: String) {
  //   return this.GetCodeValue_Description(codeValue, this.subGroupNameCvList);
  // }

  GetCodeValue_Description(codeValue: String, codeValueItems: CodeValuesItem[]) {
    let retval: string = '';
    const foundItem = codeValueItems.find(item => item.code_val === codeValue);
    if (foundItem) {
      retval = foundItem.description || '';
    }

    return retval;
  }
  displayLastUpdated(r: MasterTemplateItem) {
    var updatedt = r.update_dt;
    if (updatedt === null) {
      updatedt = r.create_dt;
    }
    const date = new Date(updatedt! * 1000);

    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();

    // Replace the '/' with '-' to get the required format


    return `${day}/${month}/${year}`;

  }

  displayTemplateType(r:MasterTemplateItem){
    let tempType = `${this.translatedLangText.TEMPLATE_TYPE_GENERAL}`;
    if(r.type_cv?.toUpperCase()=="EXCLUSIVE")
    {
      tempType=this.translatedLangText.TEMPLATE_TYPE_EXCLUSIVE
    }
   return tempType;
  }
}

