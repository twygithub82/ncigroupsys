import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort, MatSortModule,Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { pageSizeInfo, Utility } from 'app/utilities/utility';
import { MatDividerModule } from '@angular/material/divider';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { CleaningCategoryItem } from 'app/data-sources/cleaning-category';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { CustomerCompanyCleaningCategoryItem } from 'app/data-sources/customer-company-category';
import { PackageResidueItem } from 'app/data-sources/package-residue';
import { SearchCriteriaService } from 'app/services/search-criteria.service';
import { ComponentUtil } from 'app/utilities/component-util';
import { FormDialogComponent } from './form-dialog/form-dialog.component';
import { UserDS ,UserItem } from 'app/data-sources/user';
import { SearchStateService } from 'app/services/search-criteria.service';

@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
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

export class UserComponent extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  displayedColumns = [
    'fName',
    // 'lName',
    'role',
    'team',
    // 'mobile',
    'bDate',
    // 'email',
  ];

  pageTitle = 'MENUITEMS.MANAGEMENT.LIST.USER'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.MANAGEMENT.TEXT', route: '/admin/management' },
  ]

  CLEANING_LAST_UPDATED_DT = 'COMMON-FORM.LAST-UPDATED'

  customerCodeControl = new UntypedFormControl();
  categoryControl = new UntypedFormControl();
  descriptionControl = new UntypedFormControl();
  handledItemControl = new UntypedFormControl();

  storageCalCvList: CodeValuesItem[] = [];
  handledItemCvList: CodeValuesItem[] = [];
  CodeValuesDS?: CodeValuesDS;

  usrDS:UserDS;
  ccDS: CustomerCompanyDS;
  // tariffResidueDS:TariffResidueDS;
  // packResidueDS:PackageResidueDS;
  // clnCatDS:CleaningCategoryDS;
  custCompDS: CustomerCompanyDS;

  userList: UserItem[] = [];

  custCompClnCatItems: CustomerCompanyCleaningCategoryItem[] = [];
  customer_companyList: CustomerCompanyItem[] = [];
  cleaning_categoryList?: CleaningCategoryItem[];

  pageIndex = 0;
  pageSize = pageSizeInfo.defaultSize;
  lastSearchCriteria: any;
  lastOrderBy: any = { userName: "ASC" };
  endCursor: string | undefined = undefined;
  previous_endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;

  searchField: string = "";
  selection = new SelectionModel<PackageResidueItem>(true, []);
  pageStateType = 'User';
  id?: number;
  pcForm?: UntypedFormGroup;
  translatedLangText: any = {}
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.CARGO-DETAILS',
    HEADER_OTHER: 'COMMON-FORM.CARGO-OTHER-DETAILS',
    CUSTOMER: "COMMON-FORM.CUSTOMER",
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    CUSTOMER_COMPANY_NAME: 'COMMON-FORM.COMPANY-NAME',
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
    SAVE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
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
    CANCELED_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    ARE_YOU_SURE_CANCEL: 'COMMON-FORM.ARE-YOU-SURE-CANCEL',
    ARE_YOU_SURE_ROLLBACK: 'COMMON-FORM.ARE-YOU-SURE-ROLLBACK',
    BULK: 'COMMON-FORM.BULK',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    UNDO: 'COMMON-FORM.UNDO',
    CARGO_NAME: 'COMMON-FORM.CARGO-NAME',
    CARGO_ALIAS: 'COMMON-FORM.CARGO-ALIAS',
    CARGO_DESCRIPTION: 'COMMON-FORM.CARGO-DESCRIPTION',
    CARGO_CLASS: 'COMMON-FORM.CARGO-CLASS',
    CARGO_CLASS_SELECT: 'COMMON-FORM.CARGO-CLASS-SELECT',
    CARGO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    PACKAGE_MIN_COST: 'COMMON-FORM.PACKAGE-MIN-COST',
    PACKAGE_MAX_COST: 'COMMON-FORM.PACKAGE-MAX-COST',
    PACKAGE_DETAIL: 'COMMON-FORM.PACKAGE-DETAIL',
    PACKAGE_CLEANING_ADJUSTED_COST: "COMMON-FORM.PACKAGE-CLEANING-ADJUST-COST",
    EMAIL: 'COMMON-FORM.EMAIL',
    CONTACT_NO: 'COMMON-FORM.CONTACT-NO',
    PROFILE_NAME: 'COMMON-FORM.PROFILE-NAME',
    VIEW: 'COMMON-FORM.VIEW',
    DEPOT_PROFILE: 'COMMON-FORM.DEPOT-PROFILE',
    PREINSPECTION_COST: "COMMON-FORM.PREINSPECTION-COST",
    LOLO_COST: "COMMON-FORM.LOLO-COST",
    STORAGE_COST: "COMMON-FORM.STORAGE-COST",
    FREE_STORAGE: "COMMON-FORM.FREE-STORAGE",
    LAST_UPDATED_DT: 'COMMON-FORM.LAST-UPDATED',
    STANDARD_COST: "COMMON-FORM.STANDARD-COST",
    CUSTOMER_COST: "COMMON-FORM.CUSTOMER-COST",
    STORAGE_CALCULATE_BY: "COMMON-FORM.STORAGE-CALCULATE-BY",
    HANDLED_ITEM: "COMMON-FORM.HANDLED-ITEM",
    COST: "COMMON-FORM.COST",
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    ALIAS_NAME: 'COMMON-FORM.ALIAS-NAME',
    CONTACT_PERSON: "COMMON-FORM.CONTACT-PERSON",
    MOBILE_NO: "COMMON-FORM.MOBILE-NO",
    DID: "COMMON-FORM.DID",
    COUNTRY: "COMMON-FORM.COUNTRY",
    LAST_UPDATE: "COMMON-FORM.LAST-UPDATED",
    FAX_NO: "COMMON-FORM.FAX-NO",
    CONFIRM_RESET: 'COMMON-FORM.CONFIRM-RESET',
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    USER: 'MENUITEMS.MANAGEMENT.LIST.USER',
    SEARCH: 'COMMON-FORM.SEARCH',
    USERNAME: 'LANDING-SIGNIN.USERNAME',
    PASSWORD: 'LANDING-SIGNIN.PASSWORD',
    NAME: 'COMMON-FORM.NAME',
    CONTACT: 'COMMON-FORM.CONTACT',
    ROLE: 'COMMON-FORM.ROLE',
    TEAM:'COMMON-FORM.TEAM'


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
    private searchStateService: SearchStateService,
    private translate: TranslateService

  ) {
    super();
    this.usrDS= new UserDS(this.apollo);
    this.initPcForm();
    this.ccDS = new CustomerCompanyDS(this.apollo);
    // this.tariffResidueDS = new TariffResidueDS(this.apollo);
    // this.packResidueDS= new PackageResidueDS(this.apollo);
    this.custCompDS = new CustomerCompanyDS(this.apollo);

    this.CodeValuesDS = new CodeValuesDS(this.apollo);
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.searchStateService.clearOtherPages(this.pageStateType);
    this.loadData();
    this.translateLangText();
    var state = history.state;
    
    if (state.type == "user") {
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
    this.search();
  }

  initPcForm() {
    this.pcForm = this.fb.group({
      // guid: [{ value: '' }],
      user: [''],
      // customer_code: this.customerCodeControl,
      // alias_name: [''],
      // phone: [''],
      // fax_no: [''],
      // email: [''],
      // country: [''],
      // contact_person: [''],
      // mobile_no: [''],
      // description: this.descriptionControl,
      // handled_item_cv: this.handledItemControl
    });
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} - ${cc.name}` : '';
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

  adjustCost() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    if (this.selection.isEmpty()) return;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '720px',
      height: 'auto',
      data: {
        action: 'update',
        langText: this.langText,
        selectedItems: this.selection.selected
      },
      position: {
        top: '50px'  // Adjust this value to move the dialog down from the top of the screen
      }

    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result > 0) {
        //if(result.selectedValue>0)
        // {
        this.handleSaveSuccess(result);
        this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
        //}
      }
    });
  }

  addCall(event: Event) {
    event.stopPropagation(); // Stop the click event from propagating

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    // if(this.selection.isEmpty()) return;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '75vw',
      data: {
        action: 'new',
        langText: this.langText,
        selectedItems: this.selection.selected
      }

    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.selectedValue > 0) {
          this.handleSaveSuccess(result.selectedValue);
          this.search();
        }
      }
    });
    // Navigate to the route and pass the JSON object
    //  this.router.navigate(['/admin/management/user/new/ '], {
    //    state: { id: '' ,
    //      type:'user',
    //      pagination:{
    //        where :this.lastSearchCriteria,
    //        pageSize:this.pageSize,
    //        pageIndex:this.pageIndex,
    //        hasPreviousPage:this.hasPreviousPage,
    //        startCursor:this.startCursor,
    //        endCursor:this.endCursor,
    //        previous_endCursor:this.previous_endCursor,

    //        showResult: this.ccDS.totalCount>0

    //      }
    //    }
    //  });
  }



  editCall(row: CustomerCompanyItem) {

    // this.router.navigate([`/admin/master/customer/new/${row.guid} `], {
    //   state: {
    //     id: row.guid,
    //     type: 'customer-company',
    //     selectedRow: row,
    //     pagination: {
    //       where: this.lastSearchCriteria,
    //       pageSize: this.pageSize,
    //       pageIndex: this.pageIndex,
    //       hasPreviousPage: this.hasPreviousPage,
    //       startCursor: this.startCursor,
    //       endCursor: this.endCursor,
    //       previous_endCursor: this.previous_endCursor,

    //       showResult: this.ccDS.totalCount > 0

    //     }
    //   }
    // });
    // // this.preventDefault(event);  // Prevents the form submission
    // let tempDirection: Direction;
    // if (localStorage.getItem('isRtl') === 'true') {
    //   tempDirection = 'rtl';
    // } else {
    //   tempDirection = 'ltr';
    // }
    // var rows :PackageResidueItem[] =[] ;
    // rows.push(row);
    // const dialogRef = this.dialog.open(FormDialogComponent,{

    //   width: '720px',
    //   height:'auto',
    //   data: {
    //     action: 'update',
    //     langText: this.langText,
    //     selectedItems:rows
    //   },
    //   position: {
    //     top: '50px'  // Adjust this value to move the dialog down from the top of the screen
    //   }

    // });

    // this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    //      //if (result) {
    //       if(result>0)
    //         {
    //           this.handleSaveSuccess(result);
    //           //this.search();
    //           this.onPageEvent({pageIndex:this.pageIndex,pageSize:this.pageSize,length:this.pageSize});
    //         }
    //   //}
    //   });

  }



  deleteItem(row: any) {

  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //  // const numRows = this.packResidueItems.length;
  //   return numSelected === numRows;
  }

  isSelected(option: any): boolean {
    return this.customerCodeControl.value.includes(option);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    // this.isAllSelected()
    //   ? this.selection.clear()
    //   : this.packResidueItems.forEach((row) =>
    //     this.selection.select(row)
    //   );
  }



  // search() {
  //   const where: any = {};

  

  //   if (this.pcForm!.value["alias"]) {
  //     where.alias = { contains: this.pcForm!.value["alias"] };
  //   }

   


  //   this.lastSearchCriteria = where;
  //   this.subs.sink = this.ccDS.search(where, this.lastOrderBy, this.pageSize).subscribe(data => {
  //     this.customer_companyList = data;
  //     // data[0].storage_cal_cv
  //     this.previous_endCursor = undefined;
  //     this.endCursor = this.ccDS.pageInfo?.endCursor;
  //     this.startCursor = this.ccDS.pageInfo?.startCursor;
  //     this.hasNextPage = this.ccDS.pageInfo?.hasNextPage ?? false;
  //     this.hasPreviousPage = this.ccDS.pageInfo?.hasPreviousPage ?? false;
  //     this.pageIndex = 0;
  //     this.paginator.pageIndex = 0;
  //     this.selection.clear();
  //     if (!this.hasPreviousPage)
  //       this.previous_endCursor = undefined;
  //   });
  // }

  selectStorageCalculateCV_Description(valCode?: string): string {
    let valCodeObject: CodeValuesItem = new CodeValuesItem();
    if (this.storageCalCvList.length > 0) {
      valCodeObject = this.storageCalCvList.find((d: CodeValuesItem) => d.code_val === valCode) || new CodeValuesItem();

      // If no match is found, description will be undefined, so you can handle it accordingly

    }
    return valCodeObject.description || '-';

  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.langText.SAVE_SUCCESS;
      this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
        successMsg = res;
        ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)

      });
    }
  }

 


  // storeSearchCriteria(where: any, order: any, first: any, after: any, last: any, before: any, pageIndex: number,
  //   previousPageIndex?: number, length?: number, hasNextPage?: boolean, hasPreviousPage?: boolean) {
  //   const sCriteria: any = {};
  //   sCriteria.where = where;
  //   sCriteria.order = order;
  //   sCriteria.first = first;
  //   sCriteria.after = after;
  //   sCriteria.last = last;
  //   sCriteria.before = before;
  //   sCriteria.pageIndex = pageIndex;
  //   sCriteria.previousPageIndex = previousPageIndex;
  //   sCriteria.length = length;
  //   sCriteria.hasNextPage = hasNextPage;
  //   sCriteria.hasPreviousPage = hasPreviousPage;

  //   this.searchCriteriaService.setCriteria(sCriteria);
  // }

  removeSelectedRows() {

  }
  public loadData() {

    this.subs.sink = this.custCompDS.loadItems({}, { code: 'ASC' }, 100).subscribe(data => {
      // this.customer_companyList1 = data
    });

    // this.subs.sink = this.tariffResidueDS.SearchTariffResidue({},{description:'ASC'}).subscribe(data=>{});

    // const queries = [
    //   { alias: 'handledItem', codeValType: 'HANDLED_ITEM' },

    // ];
    // this.CodeValuesDS?.getCodeValuesByType(queries);
    // this.CodeValuesDS?.connectAlias('handledItem').subscribe(data => {
    //   this.handledItemCvList=data;
    // });



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
  onContextMenu(event: MouseEvent, item: any) {
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

  displayLastUpdated(r: PackageResidueItem) {
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
    this.initPcForm();
    this.customerCodeControl.reset();
  }


  
    constructSearchCriteria() {
      const where: any = {
             };
  
    if (this.pcForm!.value["user"]) {
       var value= this.pcForm!.value["user"]; 
      where.or = [
        {email:{ contains: value }},
        {userName:{ contains: value }},
      ];
    }
      this.lastSearchCriteria =where;
    }
  
    search() {
      this.constructSearchCriteria();
      this.performSearch(this.pageSize, 0, this.pageSize, undefined, undefined, undefined, () => {
        this.updatePageSelection();
      });
    }
  
    performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string, callback?: () => void) {
      this.searchStateService.setCriteria(this.pageStateType, this.pcForm?.value);
      this.searchStateService.setPagination(this.pageStateType, {
        pageSize,
        pageIndex,
        first,
        after,
        last,
        before
      });
      console.log(this.searchStateService.getPagination(this.pageStateType))
      this.subs.sink = this.usrDS.searchUser(this.lastSearchCriteria, this.lastOrderBy, first, after, last, before)
        .subscribe(data => {
          this.userList = data;
          this.endCursor = this.usrDS.pageInfo?.endCursor;
          this.startCursor = this.usrDS.pageInfo?.startCursor;
          this.hasNextPage = this.usrDS.pageInfo?.hasNextPage ?? false;
          this.hasPreviousPage = this.usrDS.pageInfo?.hasPreviousPage ?? false;
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
  
      this.performSearch(pageSize, pageIndex, first, after, last, before, () => {
        this.updatePageSelection();
      });
    }

    updatePageSelection()
    {

    }

     onSortChange(event: Sort): void {
        const { active: field, direction } = event;
    
        // reset if no direction
        if (!direction) {
          this.lastOrderBy = null;
          return this.search();
        }
    
        // convert to GraphQL enum (uppercase)
        const dirEnum = direction.toUpperCase(); // 'ASC' or 'DESC'
        // or: const dirEnum = SortEnumType[direction.toUpperCase() as 'ASC'|'DESC'];
    
        switch (field) {
          case 'fName':
            this.lastOrderBy = {
              
                userName: dirEnum,
              
            };
            break;
    
          default:
            this.lastOrderBy = {userName:"ASC"};
        }
    
        this.search();
      }
    
      AutoSearch() {
        if (Utility.IsAllowAutoSearch())
          this.search();
      }

}

