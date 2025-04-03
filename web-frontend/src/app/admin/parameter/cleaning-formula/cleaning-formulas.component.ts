import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
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
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { Apollo } from 'apollo-angular';
import { CleaningMethodDS, CleaningMethodItem } from 'app/data-sources/cleaning-method';
import { CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyItem } from 'app/data-sources/customer-company';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { CleaningCategoryItem } from 'app/data-sources/cleaning-category';
import { CleaningFormulaDS, CleaningFormulaItem } from 'app/data-sources/cleaning-formulas';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { Subscription } from 'rxjs';
import { FormDialogComponent } from './form-dialog/form-dialog.component';

@Component({
  selector: 'app-cleaning-formulas',
  standalone: true,
  templateUrl: './cleaning-formulas.component.html',
  styleUrl: './cleaning-formulas.component.scss',
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
    MatDividerModule
  ]
})
export class CleaningFormulasComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    // 'category_name',
    'category_description',
    'category_duration',
    'update_date'
    //'last_cargo',
    // 'so_no',
    //'customer_code'

  ];

  pageTitle = 'MENUITEMS.CLEANING-MANAGEMENT.LIST.CLEAN-FORMULA'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.HOME.TEXT', route: '/' },
    { text: 'MENUITEMS.CLEANING-MANAGEMENT.TEXT', route: '/admin/parameter/cleaning-formulas' }
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
    SEARCH: "COMMON-FORM.SEARCH",
    CATEGORY_NAME: "COMMON-FORM.CATEGORY-NAME",
    CATEGORY_DESCRIPTION: "COMMON-FORM.CATEGORY-DESCRIPTION",
    CATEGORY_COST: "COMMON-FORM.CARGO-COST",
    ADD: 'COMMON-FORM.ADD',
    REFRESH: 'COMMON-FORM.REFRESH',
    EXPORT: 'COMMON-FORM.EXPORT',
    MIN_COST: 'COMMON-FORM.PACKAGE-MIN-COST',
    MAX_COST: 'COMMON-FORM.PACKAGE-MAX-COST',
    LAST_UPDATED: 'COMMON-FORM.LAST-UPDATED',
    SAVE_SUCCESS: 'COMMON-FORM.SAVE-SUCCESS',
    CLEANING_METHOD: 'COMMON-FORM.CLEANING-PROCESS',
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    METHOD_NAME: "COMMON-FORM.METHOD-NAME",
    FORMULA_NAME: "COMMON-FORM.FORMULA-NAME",
    FORMULA_DESCRIPTION: "COMMON-FORM.DESCRIPTION",
    MIN_DURATION: "COMMON-FORM.MIN-DURATION",
    MAX_DURATION: "COMMON-FORM.MAX-DURATION",
    CLEANING_FORMULA: "MENUITEMS.CLEANING-MANAGEMENT.LIST.CLEAN-FORMULA",
    DURATION: "COMMON-FORM.DURATION-MIN"
  }

  soSelection = new SelectionModel<StoringOrderItem>(true, []);
  searchField: string = "";
  purposeOptionCvList: CodeValuesItem[] = [];
  searchForm?: UntypedFormGroup;
  customerCodeControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  customer_companyList?: CustomerCompanyItem[];
  last_cargoList?: TariffCleaningItem[];
  soStatusCvList: CodeValuesItem[] = [];

  clnMethodItem: CleaningMethodItem[] = [];
  catList: CleaningCategoryItem[] = [];
  clnFormulaList: CleaningFormulaItem[] = [];
  soList: StoringOrderItem[] = [];
  // sotDS: StoringOrderTankDS;
  // ccDS: CustomerCompanyDS;
  // soDS: StoringOrderDS;
  // catDS: CleaningCategoryDS;
  mthDS: CleaningMethodDS;
  fmlDS: CleaningFormulaDS;

  pageIndex = 0;
  pageSize = 10;
  lastSearchCriteria: any;
  lastOrderBy: any = { description: "ASC" };
  endCursor: string | undefined = undefined;
  previous_endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    // private graphqlNotificationService: GraphqlNotificationService
  ) {
    super();
    this.translateLangText();
    this.initSearchForm();
    // this.soDS = new StoringOrderDS(this.apollo);
    // this.sotDS = new StoringOrderTankDS(this.apollo);
    // this.ccDS = new CustomerCompanyDS(this.apollo);
    //this.catDS = new CleaningCategoryDS(this.apollo);
    this.mthDS = new CleaningMethodDS(this.apollo);
    this.fmlDS = new CleaningFormulaDS(this.apollo);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  messages = [];
  messageSubscription?: Subscription;

  ngOnInit() {
    this.initializeFilterCustomerCompany();
    this.translateLangText();
    this.loadData();
    // this.messageSubscription = this.graphqlNotificationService.newMessageReceived.subscribe(
    //   (message) => {
    //    // alert(message.messageReceived.event_id + " " + message.messageReceived.event_name);

    //   },
    //   (error) => console.error(error),
    // );
  }
  refresh() {
    this.onPageEvent({
      pageIndex: this.pageIndex, pageSize: this.pageSize,
      length: 0
    });
    //onPageEvent({this.pageIndex,this.pageSize}});
    // this.pageIndex=0;
    // this.paginator.pageIndex=0;
    // this.loadData();
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      name: [''],
      description: [''],
      duration_min: [''],
      duration_max: [''],

    });
  }

  displayLastUpdated(r: CleaningCategoryItem) {
    var updatedt = r.update_dt;
    if (updatedt === null) {
      updatedt = r.create_dt;
    }
    return this.displayDate(updatedt);

  }


  displayDate(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input);
  }

  canCancelSelectedRows(): boolean {
    return false;
    // return !this.soSelection.hasValue() || !this.soSelection.selected.every((item) => {
    //   const index: number = this.soList.findIndex((d) => d === item);
    //   return this.soDS.canCancel(this.soList[index]);
    // });
  }
  cancelSelectedRows(row: StoringOrderItem[]) {

  }

  public loadData() {

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
    const where: any = {};

    var order = this.lastOrderBy;



    if (this.searchForm!.value['name']) {
      where.name = { contains: this.searchForm!.value['name'] };
    }

    if (this.searchForm!.value['description']) {
      where.description = { contains: this.searchForm!.value['description'] };
    }

    if (this.searchForm!.value['min_duration']) {
      where.duration = { gte: Number(this.searchForm!.value['min_duration']) }
    }

    if (this.searchForm!.value['max_duration']) {
      where.duration = { ngt: Number(this.searchForm!.value['max_duration']) }
    }

    this.lastSearchCriteria = where;
    this.performSearch(this.pageSize, this.pageIndex, this.pageSize, undefined, undefined, undefined);
  }

  //searchData(where: any, order: any, first: any, after: any, last: any, before: any, pageIndex: number,  previousPageIndex?: number) {
  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, report_type?: number, queryType?: number) {
    this.previous_endCursor = this.endCursor;
    this.subs.sink = this.fmlDS.search(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before).subscribe(data => {
      this.clnFormulaList = data;
      this.endCursor = this.fmlDS.pageInfo?.endCursor;
      this.startCursor = this.fmlDS.pageInfo?.startCursor;
      this.hasNextPage = this.fmlDS.pageInfo?.hasNextPage ?? false;
      this.hasPreviousPage = this.fmlDS.pageInfo?.hasPreviousPage ?? false;
      this.pageIndex = pageIndex;
      this.paginator.pageIndex = this.pageIndex;
      if (!this.hasPreviousPage)
        this.previous_endCursor = undefined;

    });
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
    }
    else {
      if (pageIndex > this.pageIndex && this.hasNextPage) {
        // Navigate forward
        first = pageSize;
        after = this.endCursor;
      } else if (pageIndex < this.pageIndex && this.hasPreviousPage) {
        // Navigate backward
        last = pageSize;
        before = this.startCursor;
      } else if (pageIndex === this.pageIndex) {
        // Refresh the current page
        first = pageSize;
        after = this.previous_endCursor; // or undefined, depending on your API
      }
    }

    this.performSearch(pageSize, pageIndex, first, after, last, before);
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
  }

  initializeFilterCustomerCompany() {
  }

  addCall() {
    // this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    var row = new CleaningMethodItem();
    //  rows.push(row);
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '50wv',
      maxWidth: '600px',
      data: {
        action: 'new',
        langText: this.langText,
        selectedItem: row
      }

    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result > 0) {
        this.handleSaveSuccess(result);
        this.refresh();
        // this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });

      }
    });

  }
  editCall(row: CleaningMethodItem) {
    // this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    //  var rows :CustomerCompanyCleaningCategoryItem[] =[] ;
    //  rows.push(row);
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '50wv',
      maxWidth: '600px',
      data: {
        action: 'new',
        langText: this.langText,
        selectedItem: row
      }

    });



    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result > 0) {

        this.handleSaveSuccess(result);
        this.refresh();
        //this.search();
        // this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });

      }
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

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
  }
}