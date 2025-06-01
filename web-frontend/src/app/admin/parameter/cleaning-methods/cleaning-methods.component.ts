import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
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
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { CleaningCategoryDS, CleaningCategoryItem } from 'app/data-sources/cleaning-category';
import { CleaningMethodDS, CleaningMethodItem } from 'app/data-sources/cleaning-method';
import { CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyItem } from 'app/data-sources/customer-company';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { ModulePackageService } from 'app/services/module-package.service';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { debounceTime, startWith, Subscription, tap } from 'rxjs';
import { FormDialogComponent } from './form-dialog/form-dialog.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-cleaning-methods',
  standalone: true,
  templateUrl: './cleaning-methods.component.html',
  styleUrl: './cleaning-methods.component.scss',
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
    MatDividerModule,
    MatChipsModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class CleaningMethodsComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'category_name',
    'category_description',
    //'category_cost',
    'update_date',
    'actions',
    // 'so_no',
    //'customer_code'

  ];

  pageTitle = 'MENUITEMS.CLEANING-MANAGEMENT.LIST.CLEAN-PROCESS'
  breadcrumsMiddleList = [
    { text: 'MENUITEMS.CLEANING-MANAGEMENT.TEXT', route: '/admin/parameter/cleaning-methods' }
  ]

  translatedLangText: any = {};
  separatorKeysCodes: number[] = [ENTER, COMMA];

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
    NEW: 'COMMON-FORM.NEW',
    REFRESH: 'COMMON-FORM.REFRESH',
    EXPORT: 'COMMON-FORM.EXPORT',
    MIN_COST: 'COMMON-FORM.PACKAGE-MIN-COST',
    MAX_COST: 'COMMON-FORM.PACKAGE-MAX-COST',
    LAST_UPDATED: 'COMMON-FORM.LAST-UPDATED',
    SAVE_SUCCESS: 'COMMON-FORM.SAVE-SUCCESS',
    CLEANING_METHOD: 'COMMON-FORM.PROCESS-NAME',
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    METHOD_NAME: "COMMON-FORM.METHOD-NAME",
    PROCESS_NAME: "COMMON-FORM.PROCESS-NAME",
    PROCESS_DESCRIPTION: "COMMON-FORM.DESCRIPTION",
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    PROCESS_DESCRIPTION_SELECTED:'COMMON-FORM.PROCESS-DESCRIPTION-SELECTED',
    PROCESS_NAME_SELECTED:'COMMON-FORM.PROCESS-NAME-SELECTED'
  }

  searchForm?: UntypedFormGroup;
  processNameControl = new UntypedFormControl();
  descriptionControl = new UntypedFormControl();
  processNameList: string[] = [];
  descriptionList: string[] = [];

  clnMethodItem: CleaningMethodItem[] = [];
  catList: CleaningCategoryItem[] = [];
  mthDS: CleaningMethodDS;
  mthAutoCompleteDS: CleaningMethodDS;

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
    public modulePackageService: ModulePackageService,
    // private graphqlNotificationService: GraphqlNotificationService
  ) {
    super();
    this.translateLangText();
    this.initSearchForm();
    this.mthDS = new CleaningMethodDS(this.apollo);
    this.mthAutoCompleteDS = new CleaningMethodDS(this.apollo);
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
    this.loadData();
    this.initializeValueChanges();
  }

  initializeValueChanges() {
    this.processNameControl!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        this.mthAutoCompleteDS.search({ name: { contains: value } }, { name: "ASC" }, 100).subscribe(data => {
          this.processNameList = data.map(i => i.name || '');
        });
      })
    ).subscribe();

    this.descriptionControl!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        this.mthAutoCompleteDS.search({ description: { contains: value } }, { description: "ASC" }, 100).subscribe(data => {
          this.descriptionList = data.map(i => i.description || '');
        });
      })
    ).subscribe();
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      name: [''],
      description: [''],

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
    this.translateLangText();
    this.search();
    // this.subs.sink = this.soDS.searchStoringOrder({}).subscribe(data => {
    //   if (this.soDS.totalCount > 0) {
    //     this.soList = data;
    //   }
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

    if(this.selectedNames.length>0)
    {
      where.name={in: this.selectedNames};
    }

    if(this.selectedDescs.length>0)
    {
      where.description={in: this.selectedDescs};
    }

    // if (this.processNameControl?.value) {
    //   where.name = { contains: this.processNameControl?.value };
    // }

    // if (this.descriptionControl?.value) {
    //   where.description = { contains: this.descriptionControl?.value };
    // }
    this.searchData(where, order, undefined, undefined, undefined, undefined, this.pageIndex, undefined);

    // if(this.searchForm!.value['min_cost']){
    //   where.cost ={gte: Number(this.searchForm!.value['min_cost'])}
    // }

    // if(this.searchForm!.value['max_cost']){
    //   where.cost ={ngt: Number(this.searchForm!.value['max_cost'])}
    // }

    // TODO :: search criteria
    // this.previous_endCursor = this.endCursor;
    // this.subs.sink = this.mthDS.search(where, order).subscribe(data => {
    //   this.clnMethodItem = data;
    //   this.endCursor = this.mthDS.pageInfo?.endCursor;
    //   this.startCursor = this.mthDS.pageInfo?.startCursor;
    //   this.hasNextPage = this.mthDS.pageInfo?.hasNextPage ?? false;
    //   this.hasPreviousPage = this.mthDS.pageInfo?.hasPreviousPage ?? false;
    //   this.pageIndex = 0;
    //   this.paginator.pageIndex = this.pageIndex;
    //   if (!this.hasPreviousPage)
    //     this.previous_endCursor = undefined;
    // });
  }

  searchData(where: any, order: any, first: any, after: any, last: any, before: any, pageIndex: number,
    previousPageIndex?: number) {
    this.previous_endCursor = this.endCursor;
    this.subs.sink = this.mthDS.search(where, order, first, after, last, before).subscribe(data => {
      this.clnMethodItem = data.map(i => {
        i.cleaning_method_formula?.sort((a, b) => a.sequence! - b.sequence!);
        return i;
      });
      this.endCursor = this.mthDS.pageInfo?.endCursor;
      this.startCursor = this.mthDS.pageInfo?.startCursor;
      this.hasNextPage = this.mthDS.pageInfo?.hasNextPage ?? false;
      this.hasPreviousPage = this.mthDS.pageInfo?.hasPreviousPage ?? false;
      this.pageIndex = pageIndex;
      this.paginator.pageIndex = this.pageIndex;
      if (!this.hasPreviousPage)
        this.previous_endCursor = undefined;

    });
  }

  onPageEvent(event: PageEvent) {
    const { pageIndex, pageSize, previousPageIndex } = event;
    let first: number | undefined = undefined;
    let after: string | undefined = undefined;
    let last: number | undefined = undefined;
    let before: string | undefined = undefined;
    let order: any | undefined = this.lastOrderBy;
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
      else if (pageIndex == this.pageIndex) {

        first = pageSize;
        after = this.previous_endCursor;

      }
    }

    this.searchData(this.lastSearchCriteria, order, first, after, last, before, pageIndex, previousPageIndex);
    //}
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
      width: '600px',
      data: {
        action: 'new',
        langText: this.langText,
        selectedItem: row
      }
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result > 0) {
        this.handleSaveSuccess(result);
        //this.search();
        this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });

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

    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '600px',
      data: {
        action: 'new',
        langText: this.langText,
        selectedItem: row
      }
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result > 0) {
        this.handleSaveSuccess(result);
        //this.search();
        this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
      }
    });
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

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  resetDialog(event: Event) {
    event.preventDefault(); // Prevents the form submission

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    this.resetForm();
    this.search();
  }

  resetForm() {
    this.searchForm?.patchValue({
      description: '',
      name: ''
    });
  }


  handleDelete(event: Event, row: any,): void {
    event.preventDefault();
    event.stopPropagation();
    this.deleteItem(row);
  }

  deleteItem(row: CleaningMethodItem) {

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        headerText: this.translatedLangText.ARE_YOU_SURE_DELETE,
        action: 'new',
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'confirmed') {
        this.RmoveCleaningMethod(row.guid!);
      }
    });
  }

  CanDelete(row: CleaningMethodItem): boolean {
    var bRetval: boolean = false;

    if (!bRetval) {
      bRetval = (row?.tariff_cleanings?.length || 0) === 0;
    }
    return bRetval;
  }

  RmoveCleaningMethod(guids: string) {
    this.mthDS.deleteCleaningMethod([guids]).subscribe(result => {
      if (result.data.deleteCleaningMethod) {
        this.handleSaveSuccess(result.data.deleteCleaningMethod);
        this.pageIndex = 0;
        this.search();
      }
    })
  }

  displayProcessNameFn(pn: string): string {
    return pn || '';
  }

  displayDescriptionFn(pn: string): string {
    return pn || '';
  }




  
  @ViewChild('nameInput', { static: true })
  nameInput?: ElementRef<HTMLInputElement>;
  selectedNames:any[]=[];
    name_itemSelected(row: any): boolean {
       var itm=this.selectedNames;
      var retval: boolean = false;
      const index = itm.findIndex(c => c=== row);
      retval = (index >= 0);
      return retval;
    }
  
  
  
  
    name_getSelectedDisplay(): string {
      var itm=this.selectedNames;
      var retval: string = "";
      if (itm?.length > 1) {
        retval = `${itm.length} ${this.translatedLangText.PROCESS_NAME_SELECTED}`;
      }
      else if (itm?.length == 1) {
        retval = `${itm[0]}`
      }
      return retval;
    }
  
  
  
    name_removeAllSelected(): void {
      this.selectedNames=[];
    }
  
    name_selected(event: MatAutocompleteSelectedEvent): void {
      var itm=this.selectedNames;
      var cnt=this.processNameControl;
      var elmInput=this.nameInput;
      const val=event.option.value;
      const index = itm.findIndex(c => c === val);
      if (!(index >= 0)) {
        itm.push(val);
        // this.search();
      }
      else {
        itm.splice(index, 1);
        // this.search();
      }
  
      if (elmInput) {
  
        elmInput.nativeElement.value = '';
       cnt?.setValue('');
        
      }
      // this.updateFormControl();
      //this.customerCodeControl.setValue(null);
      //this.pcForm?.patchValue({ customer_code: null });
    }
  
    name_onCheckboxClicked(row: any) {
      const fakeEvent = { option: { value: row } } as MatAutocompleteSelectedEvent;
      this.name_selected(fakeEvent);
  
    }
  
    name_add(event: MatChipInputEvent): void {
      var cnt=this.processNameControl;
      const input = event.input;
      const value = event.value;
      // Add our fruit
      if ((value || '').trim()) {
        //this.fruits.push(value.trim());
      }
      // Reset the input value
      if (input) {
        input.value = '';
      }
      cnt?.setValue(null);
    }



      @ViewChild('descInput', { static: true })
  descInput?: ElementRef<HTMLInputElement>;
  selectedDescs:any[]=[];
    description_itemSelected(row: any): boolean {
       var itm=this.selectedDescs;
      var retval: boolean = false;
      const index = itm.findIndex(c => c=== row);
      retval = (index >= 0);
      return retval;
    }
  
  
  
  
    description_getSelectedDisplay(): string {
      var itm=this.selectedDescs;
      var retval: string = "";
      if (itm?.length > 1) {
        retval = `${itm.length} ${this.translatedLangText.PROCESS_DESCRIPTION_SELECTED}`;
      }
      else if (itm?.length == 1) {
        retval = `${itm[0]}`
      }
      return retval;
    }
  
  
  
    description_removeAllSelected(): void {
      this.selectedDescs=[];
    }
  
    description_selected(event: MatAutocompleteSelectedEvent): void {
      var itm=this.selectedDescs;
      var cnt=this.descriptionControl;
      var elmInput=this.descInput;
      const val=event.option.value;
      const index = itm.findIndex(c => c === val);
      if (!(index >= 0)) {
        itm.push(val);
        // this.search();
      }
      else {
        itm.splice(index, 1);
        // this.search();
      }
  
      if (elmInput) {
  
        elmInput.nativeElement.value = '';
       cnt?.setValue('');
        
      }
      // this.updateFormControl();
      //this.customerCodeControl.setValue(null);
      //this.pcForm?.patchValue({ customer_code: null });
    }
  
    description_onCheckboxClicked(row: any) {
      const fakeEvent = { option: { value: row } } as MatAutocompleteSelectedEvent;
      this.description_selected(fakeEvent);
  
    }
  
    description_add(event: MatChipInputEvent): void {
      var cnt=this.descriptionControl;
      const input = event.input;
      const value = event.value;
      // Add our fruit
      if ((value || '').trim()) {
        //this.fruits.push(value.trim());
      }
      // Reset the input value
      if (input) {
        input.value = '';
      }
      cnt?.setValue(null);
    }
}