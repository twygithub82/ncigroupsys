import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatPaginatorModule, MatPaginator,PageEvent } from '@angular/material/paginator';
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
import { StoringOrderDS, StoringOrderGO, StoringOrderItem } from 'app/data-sources/storing-order';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem, addDefaultSelectOption } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from '@angular/material/divider';
import { ComponentUtil } from 'app/utilities/component-util';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import {CleaningCategoryDS,CleaningCategoryItem } from 'app/data-sources/cleaning-category';
import {CleaningMethodDS,CleaningMethodItem} from 'app/data-sources/cleaning-method';
import { sequence } from '@angular/animations';

@Component({
  selector: 'app-tariff-cleaning',
  standalone: true,
   templateUrl: './tariff-cleaning.component.html',
  styleUrl: './tariff-cleaning.component.scss',
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
export class TariffCleaningComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
   //'select',
    'cargo',
    'desc',
    'class',
    'un_no',
    'method',
    'flash_point',
    'category',
    'cost',
   // 'actions'
  ];

  pageTitle = 'MENUITEMS.TARIFF.LIST.TARIFF-CLEANING'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT'
  ]

  translatedLangText: any = {};
  langText = {
    STATUS: 'COMMON-FORM.STATUS',
    SO_NO: 'COMMON-FORM.SO-NO',
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
    ADD: 'COMMON-FORM.ADD',
    REFRESH: 'COMMON-FORM.REFRESH',
    EXPORT: 'COMMON-FORM.EXPORT',
    REMARKS: 'COMMON-FORM.REMARKS',
    SO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    CARGO_NAME:'COMMON-FORM.CARGO-NAME',
    CARGO_DESCRIPTION:'COMMON-FORM.CARGO-DESCRIPTION',
    CARGO_CLASS:'COMMON-FORM.CARGO-CLASS',
    CARGO_UN_NO:'COMMON-FORM.CARGO-UN-NO',
    CARGO_METHOD:'COMMON-FORM.CARGO-METHOD',
    CARGO_CATEGORY:'COMMON-FORM.CARGO-CATEGORY',
    CARGO_FLASH_POINT:'COMMON-FORM.CARGO-FLASH-POINT',
    CARGO_COST :'COMMON-FORM.CARGO-COST',
    CARGO_HAZARD_LEVEL:'COMMON-FORM.CARGO-HAZARD-LEVEL',
    CARGO_BAN_TYPE:'COMMON-FORM.CARGO-BAN-TYPE'
  }

  searchForm?: UntypedFormGroup;

  cvDS: CodeValuesDS;
  //soDS: StoringOrderDS;
  ccDS: CustomerCompanyDS;
  tcDS: TariffCleaningDS;
  cCategoryDS:CleaningCategoryDS;
  cMethodDS:CleaningMethodDS;

  
  
  
  soList: StoringOrderItem[] = [];
  soSelection = new SelectionModel<StoringOrderItem>(true, []);
  soStatusCvList: CodeValuesItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  customer_companyList?: CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];

  cCategoryList : CleaningCategoryItem[]=[];
  cMethodList : CleaningMethodItem[]=[];
  tcList :TariffCleaningItem[]=[];
  classNoCvList :CodeValuesItem[] = [];
  banTypeCvList :CodeValuesItem[] = [];
  hazardLevelCvList :CodeValuesItem[] = [];


  classNoControl = new UntypedFormControl();
  methodControl = new UntypedFormControl();
  categoryControl = new UntypedFormControl();
  banTypeControl= new UntypedFormControl();
  hazardLevelControl= new UntypedFormControl();

  pageIndex = 0;
  pageSize = 10;
  lastSearchCriteria: any;
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
   // this.soDS = new StoringOrderDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.tcDS = new TariffCleaningDS(this.apollo);
    this.cCategoryDS = new CleaningCategoryDS(this.apollo);
    this.cMethodDS = new CleaningMethodDS(this.apollo);
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
   // this.initializeFilterCustomerCompany();
    this.loadData();
  }
  refresh() {
    this.loadData();
    this.initSearchForm();
  }
  initSearchForm() {
    this.searchForm = this.fb.group({
      cargo_name: [''],
      class_no: this.classNoControl,
      method: this.methodControl,
      category:this.categoryControl,
      hazard_level:this.hazardLevelControl,
      ban_type:this.banTypeControl,
      flash_point:[''],
      un_no:['']
      // so_status: [''],
      // tank_no: [''],
      // job_no: [''],
      // purpose: [''],
      // eta_dt: [''],
      // cln_mth:[''],
    });
  }
  cancelItem(row: StoringOrderItem) {
    // this.id = row.id;
    this.cancelSelectedRows([row])
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
   // const numSelected = this.soSelection.selected.length;
   // const numRows = this.soDS.totalCount;
   // return numSelected === numRows;
   return false;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.soSelection.clear()
      : this.soList.forEach((row) =>
        this.soSelection.select(row)
      );
  }
  canCancelSelectedRows(): boolean {
    return !this.soSelection.hasValue() || !this.soSelection.selected.every((item) => {
      const index: number = this.soList.findIndex((d) => d === item);
      //return this.soDS.canCancel(this.soList[index]);
      return false;
    });
  }
  cancelSelectedRows(row: StoringOrderItem[]) {
    // let tempDirection: Direction;
    // if (localStorage.getItem('isRtl') === 'true') {
    //   tempDirection = 'rtl';
    // } else {
    //   tempDirection = 'ltr';
    // }
    // const dialogRef = this.dialog.open(CancelFormDialogComponent, {
    //   data: {
    //     item: [...row],
    //     langText: this.langText
    //   },
    //   direction: tempDirection
    // });
    // this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    //   if (result?.action === 'confirmed') {
    //     const so = result.item.map((item: StoringOrderItem) => new StoringOrderGO(item));
    //     this.soDS.cancelStoringOrder(so).subscribe(result => {
    //       if ((result?.data?.cancelStoringOrder ?? 0) > 0) {
    //         let successMsg = this.langText.CANCELED_SUCCESS;
    //         this.translate.get(this.langText.CANCELED_SUCCESS).subscribe((res: string) => {
    //           successMsg = res;
    //           ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
    //           this.loadData();
    //         });
    //       }
    //     });
    //   }
    // });
  }
  public loadData() {
    // this.subs.sink = this.soDS.searchStoringOrder({}).subscribe(data => {
    //   if (this.soDS.totalCount > 0) {
    //     this.soList = data;
    //   }
    // });

    // this.tcDS.loadItemsWithCategoryMethod({}).subscribe(data=>{
    //   if(this.tcDS.totalCount>0)
    //   {
    //     this.tcList=data;
    //   }

    // });
    this.lastSearchCriteria=this.tcDS.addDeleteDtCriteria({});
    this.tcDS.SearchTariffCleaning(this.lastSearchCriteria).subscribe(data => {
      this.tcList = data;
      this.endCursor = this.tcDS.pageInfo?.endCursor;
      this.startCursor = this.tcDS.pageInfo?.startCursor;
      this.hasNextPage = this.tcDS.pageInfo?.hasNextPage ?? false;
      this.hasPreviousPage = this.tcDS.pageInfo?.hasPreviousPage ?? false;
    });

    this.cCategoryDS.loadItems({ name: { neq: null }},{ sequence: 'ASC' }).subscribe(data=>{
      if(this.cCategoryDS.totalCount>0)
      {
        this.cCategoryList=data;
      }

    });

    this.cMethodDS.loadItems({ name: { neq: null }},{ sequence: 'ASC' }).subscribe(data=>{
      if(this.cMethodDS.totalCount>0)
      {
        this.cMethodList=data;
      }

    });

    const queries = [
      { alias: 'ctHazardLevelCv', codeValType: 'HAZARD_LEVEL' },
      { alias: 'classNoCv', codeValType: 'CLASS_NO' },
      { alias: 'banTypeCv', codeValType: 'BAN_TYPE' }
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('ctHazardLevelCv').subscribe(data => {
      this.hazardLevelCvList = data;
     // this.hazardLevelCvList = addDefaultSelectOption(this.soStatusCvList, 'All');
    });
    this.cvDS.connectAlias('classNoCv').subscribe(data => {
      this.classNoCvList = data;
    });
    this.cvDS.connectAlias('banTypeCv').subscribe(data => {
      this.banTypeCvList = data;
    });
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

  onPageEvent(event: PageEvent) {
    const { pageIndex, pageSize } = event;
    let first = pageSize;
    let after: string | undefined = undefined;
    let last: number | undefined = undefined;
    let before: string | undefined = undefined;
    let order:any|undefined=undefined;
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

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    this.tcDS.SearchTariffCleaning(this.lastSearchCriteria,order, first, after, last, before).subscribe(data => {
      this.tcList = data;
      this.endCursor = this.tcDS.pageInfo?.endCursor;
      this.startCursor = this.tcDS.pageInfo?.startCursor;
      this.hasNextPage = this.tcDS.pageInfo?.hasNextPage ?? false;
      this.hasPreviousPage = this.tcDS.pageInfo?.hasPreviousPage ?? false;
    });
  }

  search() {
    const where: any = {};

    if (this.searchForm!.value['cargo_name']) {
      where.cargo = { contains: this.searchForm!.value['cargo_name'] };
    }

    if (this.searchForm!.value['class_no']) {
      const classNo:CodeValuesItem = this.searchForm!.value['class_no'];
      where.class_cv = { contains: classNo.code_val };
    }

    if (this.searchForm!.value['hazard_level']) {
      const hazardLevel:CodeValuesItem = this.searchForm!.value['hazard_level'];
      where.hazard_level = { contains: hazardLevel.code_val };
    }

    if (this.searchForm!.value['ban_type']) {
      const banType:CodeValuesItem = this.searchForm!.value['ban_type'];
      where.ban_type = { contains: banType.code_val };
    }

    if (this.searchForm!.value['method']) {
       const cMethod :CleaningMethodItem =this.searchForm!.value['method'];
      where.cleaning_method_guid = { contains: cMethod.guid };
    }

    if (this.searchForm!.value['category']) {
      const cCat :CleaningCategoryItem =this.searchForm!.value['category'];
     where.cleaning_category_guid = { contains: cCat.guid };
   }

   if (this.searchForm!.value['flash_point']) {
    const flashPoint :number =Number(this.searchForm!.value['flash_point']);
      where.flash_point = { eq: flashPoint };
    }

    if (this.searchForm!.value['un_no']) {
        where.un_no = { contains: this.searchForm!.value['un_no'] };
    }
    // if (this.searchForm!.value['so_status']) {
    //   where.status_cv = { contains: this.searchForm!.value['so_status'] };
    // }

    // if (this.searchForm!.value['tank_no'] || this.searchForm!.value['eta_dt']) {
    //   const sotSome: any = {};

    //   if (this.searchForm!.value['tank_no']) {
    //     sotSome.tank_no = { contains: this.searchForm!.value['tank_no'] };
    //   }

    //   if (this.searchForm!.value['eta_dt']) {
    //     sotSome.eta_dt = { gte: Utility.convertDate(this.searchForm!.value['eta_dt']), lte: Utility.convertDate(this.searchForm!.value['eta_dt']) };
    //   }
    //   where.storing_order_tank = { some: sotSome };
    // }

    // if (this.searchForm!.value['customer_code']) {
    //   where.customer_company = { code: { contains: this.searchForm!.value['customer_code'].code } };
    // }

    // // TODO :: search criteria
    this.subs.sink = this.tcDS.SearchTariffCleaning(where).subscribe(data => {
      this.tcList = data;
    });
  }

 
  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
    //return this.ccDS.displayName(cc);
  }

  displayCategoryFn(cCat: CleaningCategoryItem): string {
    return cCat && cCat.name ? `${cCat.name}` : '';
    //return this.ccDS.displayName(cc);
  }

  displayMethodFn(cMethod: CleaningMethodItem): string {
    return  cMethod && cMethod.name ? `${cMethod.name}` : '';
    //return this.ccDS.displayName(cc);
  }

  displayCodeValueFn(cValue: CodeValuesItem): string {
    return  cValue && cValue.code_val ? `${cValue.code_val}` : '';
    //return this.ccDS.displayName(cc);
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
        });
      })
    ).subscribe();
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }
  
  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
  }
}