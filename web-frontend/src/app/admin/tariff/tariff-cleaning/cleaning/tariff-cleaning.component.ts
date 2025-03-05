import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
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
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { Apollo } from 'apollo-angular';
import { CleaningCategoryDS, CleaningCategoryItem } from 'app/data-sources/cleaning-category';
import { CleaningMethodDS, CleaningMethodItem } from 'app/data-sources/cleaning-method';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { SearchCriteriaService } from 'app/services/search-criteria.service';
import { Utility } from 'app/utilities/utility';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import {MessageDialogComponent} from 'app/shared/components/message-dialog/message-dialog.component';
import { firstValueFrom } from 'rxjs';
import { StoringOrderTankDS } from 'app/data-sources/storing-order-tank';
import { ComponentUtil } from 'app/utilities/component-util';

@Component({
  selector: 'app-tariff-cleaning',
  standalone: true,
  templateUrl: './tariff-cleaning.component.html',
  styleUrl: './tariff-cleaning.component.scss',
  imports: [
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
    //'duplicate',
    // 'cost',
     'actions'
  ];

  pageTitle = 'MENUITEMS.TARIFF.LIST.TARIFF-CLEANING'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT',
    'MENUITEMS.TARIFF.TEXT'
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
    CARGO_NAME: 'COMMON-FORM.CARGO-NAME',
    CARGO_DESCRIPTION: 'COMMON-FORM.CARGO-DESCRIPTION',
    CARGO_CLASS: 'COMMON-FORM.CARGO-CLASS',
    CARGO_UN_NO: 'COMMON-FORM.CARGO-UN-NO',
    CARGO_METHOD: 'COMMON-FORM.CARGO-METHOD',
    CARGO_CATEGORY: 'COMMON-FORM.CARGO-CATEGORY',
    CARGO_FLASH_POINT: 'COMMON-FORM.CARGO-FLASH-POINT',
    CARGO_COST: 'COMMON-FORM.CARGO-COST',
    CARGO_HAZARD_LEVEL: 'COMMON-FORM.CARGO-HAZARD-LEVEL',
    CARGO_BAN_TYPE: 'COMMON-FORM.CARGO-BAN-TYPE',
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    TARIFF_CARGO_ASSIGNED:'COMMON-FORM.TARIFF-CARGO-ASSIGNED',
    ARE_U_SURE_DELETE:'COMMON-FORM.ARE-YOU-SURE-DELETE',
    SAVE_SUCCESS: 'COMMON-FORM.SAVE-SUCCESS',
    DELETE: 'COMMON-FORM.DELETE',
   
  }

  searchForm?: UntypedFormGroup;

  cvDS: CodeValuesDS;
  //soDS: StoringOrderDS;
  ccDS: CustomerCompanyDS;
  tcDS: TariffCleaningDS;
  cCategoryDS: CleaningCategoryDS;
  cMethodDS: CleaningMethodDS;
  sotDS:StoringOrderTankDS;

  previous_endCursor: string | undefined = undefined;
  soList: StoringOrderItem[] = [];
  soSelection = new SelectionModel<StoringOrderItem>(true, []);
  soStatusCvList: CodeValuesItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  customer_companyList?: CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];

  cCategoryList: CleaningCategoryItem[] = [];
  cMethodList: CleaningMethodItem[] = [];
  tcList: TariffCleaningItem[] = [];
  classNoCvList: CodeValuesItem[] = [];
  banTypeCvList: CodeValuesItem[] = [];
  hazardLevelCvList: CodeValuesItem[] = [];

  // classNoControl = new UntypedFormControl();
  // methodControl = new UntypedFormControl();
  categoryControl = new UntypedFormControl();
  banTypeControl = new UntypedFormControl();
  hazardLevelControl = new UntypedFormControl();

  pageIndex = 0;
  pageSize = 10;
  lastSearchCriteria: any;
  endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;
  private regex: RegExp = new RegExp(/^[0-9-]*$/);

  constructor(
    private router: Router,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private searchCriteriaService: SearchCriteriaService

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
    this.sotDS=new StoringOrderTankDS(this.apollo);
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

    var state = history.state;
    if (state.type == "tariff-cleaning") {
      let showResult = state.pagination.showResult;
      if (showResult) {
        this.searchCriteriaService = state.pagination.where;
        this.pageIndex = state.pagination.pageIndex;
        this.pageSize = state.pagination.pageSize;
        this.hasPreviousPage = state.pagination.hasPreviousPage;
        this.startCursor = state.pagination.startCursor;
        this.endCursor = state.pagination.endCursor;
        this.previous_endCursor = state.pagination.previous_endCursor;
        this.paginator.pageSize = this.pageSize;
        this.paginator.pageIndex = this.pageIndex;
        this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
      }

    }
  }
  refresh() {
    this.loadData();
    this.initSearchForm();
  }



  initSearchForm() {
    this.searchForm = this.fb.group({
      cargo_name: [''],
      class_no: [''],
      method: [''],
      category: this.categoryControl,
      hazard_level: this.hazardLevelControl,
      ban_type: this.banTypeControl,
      flash_point: [''],
      un_no: [''],

    });
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
 
  public loadData() {

    let lastSrchCriteria = this.searchCriteriaService.getCriteria();

    this.lastSearchCriteria = this.tcDS.addDeleteDtCriteria({});

    if (lastSrchCriteria.pageIndex) {
      this.pageIndex = lastSrchCriteria.pageIndex;
      this.endCursor = lastSrchCriteria.after;
      this.startCursor = lastSrchCriteria.before;
      this.hasNextPage = lastSrchCriteria.hasNextPage;
      this.hasPreviousPage = lastSrchCriteria.hasPreviousPage;
      //this.paginator.pageIndex= lastSrchCriteria.pageIndex;
    }
    else {
      lastSrchCriteria.pageIndex = 0;
      lastSrchCriteria.length = 0;
      this.endCursor = undefined;
      this.startCursor = undefined;
      this.hasNextPage = false;
      this.hasPreviousPage = false;
    }

    this.onPageEvent({ pageIndex: lastSrchCriteria.pageIndex, pageSize: this.pageSize, length: lastSrchCriteria.length })


    this.cCategoryDS.loadItems({ name: { neq: null } }, { sequence: 'ASC' }).subscribe(data => {
      if (this.cCategoryDS.totalCount > 0) {
        this.cCategoryList = data;
      }

    });

    this.cMethodDS.loadItems({ name: { neq: null } }, { sequence: 'ASC' }).subscribe(data => {
      if (this.cMethodDS.totalCount > 0) {
        this.cMethodList = data;
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


  searchData(where: any, order: any, first: any, after: any, last: any, before: any, pageIndex: number,
    previousPageIndex?: number) {
    this.previous_endCursor = after;
    this.subs.sink = this.tcDS.SearchTariffCleaning(where, order, first, after, last, before).subscribe(data => {
      this.tcList = data;
      this.endCursor = this.tcDS.pageInfo?.endCursor;
      this.startCursor = this.tcDS.pageInfo?.startCursor;
      this.hasNextPage = this.tcDS.pageInfo?.hasNextPage ?? false;
      this.hasPreviousPage = this.tcDS.pageInfo?.hasPreviousPage ?? false;
      this.pageIndex = pageIndex;
      this.paginator.pageIndex = this.pageIndex;
      //this.selection.clear();
      if (!this.hasPreviousPage)
        this.previous_endCursor = undefined;
    });
  }


  searchTC(where: any, order: any, first: any, after: any, last: any, before: any, pageIndex: number,
    previousPageIndex?: number) {

    this.tcDS.SearchTariffCleaning(where, order, first, after, last, before).subscribe(data => {
      this.tcList = data;
      let after = this.endCursor;
      let before = this.startCursor;
      this.storeSearchCriteria(where, order, first, after, last, before, pageIndex, previousPageIndex,
        this.tcDS.totalCount, this.hasNextPage, this.hasPreviousPage);
      this.endCursor = this.tcDS.pageInfo?.endCursor;
      this.startCursor = this.tcDS.pageInfo?.startCursor;
      this.hasNextPage = this.tcDS.pageInfo?.hasNextPage ?? false;
      this.hasPreviousPage = this.tcDS.pageInfo?.hasPreviousPage ?? false;
      this.paginator.pageIndex = this.pageIndex;


    });
  }


  onPageEvent(event: PageEvent) {
    const { pageIndex, pageSize, previousPageIndex } = event;
    let first: number | undefined = undefined;
    let after: string | undefined = undefined;
    let last: number | undefined = undefined;
    let before: string | undefined = undefined;
    let order: any | undefined = undefined;
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

    this.searchData(this.lastSearchCriteria, order, first, after, last, before, pageIndex, previousPageIndex);
    //}
  }



  storeSearchCriteria(where: any, order: any, first: any, after: any, last: any, before: any, pageIndex: number,
    previousPageIndex?: number, length?: number, hasNextPage?: boolean, hasPreviousPage?: boolean) {
    const sCriteria: any = {};
    sCriteria.where = where;
    sCriteria.order = order;
    sCriteria.first = first;
    sCriteria.after = after;
    sCriteria.last = last;
    sCriteria.before = before;
    sCriteria.pageIndex = pageIndex;
    sCriteria.previousPageIndex = previousPageIndex;
    sCriteria.length = length;
    sCriteria.hasNextPage = hasNextPage;
    sCriteria.hasPreviousPage = hasPreviousPage;

    this.searchCriteriaService.setCriteria(sCriteria);
  }

  search() {
    const where: any = {};

    if (this.searchForm!.value['cargo_name']) {
      where.cargo = { contains: this.searchForm!.value['cargo_name'] };
    }

    debugger
    if (this.searchForm!.value['class_no']) {
      const classNo: CodeValuesItem = this.searchForm!.value['class_no'];
      where.class_cv = { contains: classNo.code_val };
    }

    if (this.searchForm!.value['hazard_level']) {
      const hazardLevel: CodeValuesItem = this.searchForm!.value['hazard_level'];
      where.hazard_level = { contains: hazardLevel.code_val };
    }

    if (this.searchForm!.value['ban_type']) {
      const banType: CodeValuesItem = this.searchForm!.value['ban_type'];
      where.ban_type = { contains: banType.code_val };
    }

    if (this.searchForm!.value['method']) {
      const cMethod: CleaningMethodItem = this.searchForm!.value['method'];
      where.cleaning_method_guid = { contains: cMethod.guid };
    }

    if (this.searchForm!.value['category']) {
      const cCat: CleaningCategoryItem = this.searchForm!.value['category'];
      where.cleaning_category_guid = { contains: cCat.guid };
    }

    if (this.searchForm!.value['flash_point']) {
      const flashPoint: number = Number(this.searchForm!.value['flash_point']);
      where.flash_point = { eq: flashPoint };
    }

    if (this.searchForm!.value['un_no']) {
      where.un_no = { contains: this.searchForm!.value['un_no'] };
    }

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
    return cMethod && cMethod.name ? `${cMethod.name}` : '';
    //return this.ccDS.displayName(cc);
  }

  displayCodeValueFn(cValue: CodeValuesItem): string {
    return cValue && cValue.code_val ? `${cValue.code_val}` : '';
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
    this.initSearchForm();
    this.searchForm?.patchValue({
      class_no: [''],
      method: [''],
      category:[''],
      hazard_level:[''],
      ban_type:[''],
    });
    // this.classNoControl.reset();
    // this.methodControl.reset();
    this.categoryControl.reset();
    this.hazardLevelControl.reset();
    this.banTypeControl.reset();

    //this.customerCodeControl.reset('');

  }

  editCall(row: TariffCleaningItem) {


    // Navigate to the route and pass the JSON object
    this.router.navigate(['/admin/tariff/tariff-cleaning/edit/' + row.guid], {
      state: {
        id: row.guid,
        type: 'tariff-cleaning',
        selectedRow: row,
        pagination: {
          where: this.lastSearchCriteria,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          hasPreviousPage: this.hasPreviousPage,
          startCursor: this.startCursor,
          endCursor: this.endCursor,
          previous_endCursor: this.previous_endCursor,

          showResult: this.tcDS.totalCount > 0

        }
      }
    });


  }

  addCallSelection(event: Event) {
    event.stopPropagation(); // Stop the click event from propagating
    // Navigate to the route and pass the JSON object
    this.router.navigate(['/admin/tariff/tariff-cleaning/new/ '], {
      state: {
        id: '',
        type: 'tariff-cleaning',
        pagination: {
          where: this.lastSearchCriteria,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          hasPreviousPage: this.hasPreviousPage,
          startCursor: this.startCursor,
          endCursor: this.endCursor,
          previous_endCursor: this.previous_endCursor,

          showResult: this.tcDS.totalCount > 0

        }
      }
    });
  }


  async cancelItem(row: TariffCleaningItem) {
    // this.id = row.id;
   
     var cargoAssigned:boolean = await this.TariffCleaningAssigned(row.guid!);
     if(cargoAssigned)
     {
        let tempDirection: Direction;
        if (localStorage.getItem('isRtl') === 'true') {
          tempDirection = 'rtl';
        } else {
          tempDirection = 'ltr';
        }
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '500px',
          data: {
            headerText: this.translatedLangText.WARNING,
            messageText:[this.translatedLangText.TARIFF_CARGO_ASSIGNED,this.translatedLangText.ARE_U_SURE_DELETE],
            act: "warn"
          },
          direction: tempDirection
        });
      dialogRef.afterClosed().subscribe(result=>{
       
        if(result.action=="confirmed")
        {
          this.deleteTariffCleaningAndPackageCleaning(row.guid!);
        }

      });
     }
     else
     {
        this.deleteTariffCleaningAndPackageCleaning(row.guid!);
     }

  }

  deleteTariffCleaningAndPackageCleaning(tariffCleaningGuid:string)
  {
     
     this.tcDS.deleteTariffCleaning([tariffCleaningGuid]).subscribe(d=>{
        let count =d.data.deleteTariffClean;
        if(count>0)
        {
            this.handleSaveSuccess(count);
        }
     });
  }
  
  async TariffCleaningAssigned(tariffCleaningGuid: string): Promise<boolean> {
      let retval: boolean = false;
      var where: any = {};
  
      where = {and:[{tariff_cleaning:{ guid: { eq: tariffCleaningGuid }}},
                    {or:[{delete_dt:{eq:0}},{delete_dt:{eq:null}}]}] };
      
      try {
        // Use firstValueFrom to convert Observable to Promise
        const result = await firstValueFrom(this.sotDS.searchStoringOrderTanks(where, {},1));
        retval=(result.length > 0)
      } catch (error) {
        console.error("Error fetching tariff cleaning guid:", error);
      }
  
      return retval;
    }

  handleSaveSuccess(count: any) {
     if ((count ?? 0) > 0) {
       let successMsg = this.langText.SAVE_SUCCESS;
       this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
         successMsg = res;
         ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
         this.search();
       });
     }
   }
  

}
