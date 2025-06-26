import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
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
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { CustomerCompanyItem } from 'app/data-sources/customer-company';
import { CustomerCompanyCleaningCategoryItem } from 'app/data-sources/customer-company-category';
import { TankDS, TankItem } from 'app/data-sources/tank';
import { TariffDepotDS, TariffDepotItem } from 'app/data-sources/tariff-depot';
import { ModulePackageService } from 'app/services/module-package.service';
import { SearchStateService } from 'app/services/search-criteria.service';
import { ComponentUtil } from 'app/utilities/component-util';
import { pageSizeInfo, Utility } from 'app/utilities/utility';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import { FormDialogComponent_Edit } from './form-dialog-edit/form-dialog.component';
import { FormDialogComponent_New } from './form-dialog-new/form-dialog.component';
import { FormDialogComponent_View } from './form-dialog-view/form-dialog.component';

@Component({
  selector: 'app-tariff-depot',
  standalone: true,
  templateUrl: './tariff-depot.component.html',
  styleUrl: './tariff-depot.component.scss',
  imports: [
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
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
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: TlxMatPaginatorIntl }
  ]
})
export class TariffDepotComponent extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  displayedColumns = [
    'fName',
    'lName',
    'mobile',
    'actions',
  ];

  unit_type_control = new UntypedFormControl();

  tnkDS: TankDS;
  tfDepotDS: TariffDepotDS;
  

  tariffDepotItems: TariffDepotItem[] = [];
  tankItemList: TankItem[] = [];
  profileList:String[]=[];

  pageStateType = 'TariffDepot'
  pageIndex = 0;
  pageSize = pageSizeInfo.defaultSize;
  lastSearchCriteria: any;
  lastOrderBy: any = { tariff_depot: { profile_name: "ASC" } };
  endCursor: string | undefined = undefined;
  previous_endCursor: string | undefined = undefined;
  startCursor: string | undefined = undefined;
  hasNextPage = false;
  hasPreviousPage = false;

  selection = new SelectionModel<CustomerCompanyCleaningCategoryItem>(true, []);

  id?: number;
  tdForm?: UntypedFormGroup;
  translatedLangText: any = {}
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.CARGO-DETAILS',
    HEADER_OTHER: 'COMMON-FORM.CARGO-OTHER-DETAILS',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
    CUSTOMER_COMPANY_NAME: 'COMMON-FORM.COMPANY-NAME',
    UNIT_TYPE: 'COMMON-FORM.UNIT-TYPE',
    REMARKS: 'COMMON-FORM.REMARKS',
    SO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    STATUS: 'COMMON-FORM.STATUS',
    UPDATE: 'COMMON-FORM.UPDATE',
    CANCEL: 'COMMON-FORM.CANCEL',
    NO_RESULT: 'COMMON-FORM.NO-RESULT',
    SAVE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    BACK: 'COMMON-FORM.BACK',
    SEARCH: 'COMMON-FORM.SEARCH',
    SAVE_AND_SUBMIT: 'COMMON-FORM.SAVE-AND-SUBMIT',
    ARE_YOU_SURE_DELETE: 'COMMON-FORM.ARE-YOU-SURE-DELETE',
    CONFIRM_DELETE: 'COMMON-FORM.CONFIRM-DELETE',
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
    CONFIRM: 'COMMON-FORM.CONFIRM',
    UNDO: 'COMMON-FORM.UNDO',
    CARGO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    CARGO_NOTE: 'COMMON-FORM.CARGO-NOTE',
    PACKAGE_MIN_COST: 'COMMON-FORM.PACKAGE-MIN-COST',
    PACKAGE_MAX_COST: 'COMMON-FORM.PACKAGE-MAX-COST',
    PACKAGE_DETAIL: 'COMMON-FORM.PACKAGE-DETAIL',
    PROFILE_NAME: 'COMMON-FORM.PROFILE-NAME',
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    VIEW: 'COMMON-FORM.VIEW',
    ASSIGNED: 'COMMON-FORM.ASSIGNED',
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    EXPORT: 'COMMON-FORM.EXPORT',
    ADD: 'COMMON-FORM.ADD',
    REFRESH: 'COMMON-FORM.REFRESH',
    CLEANING_LAST_UPDATED_DT: 'COMMON-FORM.LAST-UPDATED'
  }

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private snackBar: MatSnackBar,
    private searchStateService: SearchStateService,
    private translate: TranslateService,
    public modulePackageService: ModulePackageService
  ) {
    super();
    this.initTdForm();
    this.tnkDS = new TankDS(this.apollo);
    this.tfDepotDS = new TariffDepotDS(this.apollo);
    this.initializeFilterValues();
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
  }

  initTdForm() {
    this.tdForm = this.fb.group({
      profile_name: [''],
      description: [''],
      unit_type: this.unit_type_control
    });
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} - ${cc.name}` : '';
  }

  displayUnitTypeFn(tnk?: TankItem): string {
    return tnk?.unit_type || '';
  }

  refresh() {
    this.searchStateService.clearOtherPages(this.pageStateType);
    this.loadData();
  }

  addNew() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    // const dialogRef = this.dialog.open(FormDialogComponent, {
    //   data: {
    //     advanceTable: this.advanceTable,
    //     action: 'add',
    //   },
    //   direction: tempDirection,
    // });
    // this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    //   if (result === 1) {
    //     // After dialog is closed we're doing frontend updates
    //     // For add we're just pushing a new row inside DataService
    //     this.exampleDatabase?.dataChange.value.unshift(
    //       this.advanceTableService.getDialogData()
    //     );
    //     this.refreshTable();
    //     this.showNotification(
    //       'snackbar-success',
    //       'Add Record Successfully...!!!',
    //       'bottom',
    //       'center'
    //     );
    //   }
    // });
  }

  initializeFilterValues() {
     this.tdForm!.get('profile_name')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (value && typeof value === 'object') {
          searchCriteria = value.profile_name;
        } else {
          searchCriteria = value || '';
        }
        this.subs.sink = this.tfDepotDS.SearchTariffDepot({ or: [{ profile_name: { contains: searchCriteria } }] }, [{ profile_name: 'ASC' }]).subscribe(data => {

          this.profileList = data
          .map(item => item.profile_name)
          .filter((name): name is string => name !== undefined);

        });
      })
    ).subscribe();

    this.tdForm!.get('unit_type')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (value && typeof value === 'object') {
          searchCriteria = value.unit_type;
        } else {
          searchCriteria = value || '';
        }
        this.subs.sink = this.tnkDS.search({ or: [{ unit_type: { contains: searchCriteria } }] }, [{ unit_type: 'ASC' }]).subscribe(data => {
          this.tankItemList = data;
        });
      })
    ).subscribe();
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
    const dialogRef = this.dialog.open(FormDialogComponent_View, {
      width: '600px',
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
  }

  displayLastUpdated(r: any) {
    var updatedt = r.update_dt;
    if (updatedt === null) {
      updatedt = r.create_dt;
    }
    return this.displayDate(updatedt);

  }


  displayDate(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tariffDepotItems.length;
    return numSelected === numRows;
  }

  isSelected(option: any): boolean {
    return true;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    //  this.isAllSelected()
    //    ? this.selection.clear()
    //    : this.custCompClnCatItems.forEach((row) =>
    //        this.selection.select(row)
    //      );
  }

  constructSearchCriteria() {
    const where: any = {
      and: [
        {
          tariff_depot: {
            delete_dt: {
              eq: null
            }
          }
        }
      ]
    };

    if (this.tdForm!.get("description")?.value) {
      let desc = this.tdForm!.get("description")?.value;
      where.description = { contains: desc }
    }

    const unitType = this.tdForm!.get("unit_type")?.value;
    if (unitType && typeof unitType === 'object') {
      const tankSome: any = {};
      tankSome.unit_type = { contains: unitType?.unit_type };
      // where.tanks = { some: tankSome }
      const tariff_depot: any = { tanks: { some: tankSome } }
      where.and.push({ tariff_depot: tariff_depot })
    }

    if (this.tdForm!.value["profile_name"]) {
      let name = this.tdForm!.value["profile_name"];
      // where.profile_name = { contains: name }
      const tariff_depot: any = { profile_name: { contains: name } }
      where.and.push({ tariff_depot: tariff_depot })
    }

    this.lastSearchCriteria = where;
  }

  search() {
    this.constructSearchCriteria();
    this.performSearch(this.pageSize, this.pageIndex, this.pageSize, undefined, undefined, undefined);
  }

  performSearch(pageSize: number, pageIndex: number, first?: number, after?: string, last?: number, before?: string) {
    this.searchStateService.setCriteria(this.pageStateType, this.tdForm?.value);
    this.searchStateService.setPagination(this.pageStateType, {
      pageSize,
      pageIndex,
      first,
      after,
      last,
      before
    });
    console.log(this.searchStateService.getPagination(this.pageStateType))
    this.subs.sink = this.tfDepotDS.SearchTariffDepotWithCount(this.lastSearchCriteria, this.lastOrderBy, this.pageSize).subscribe(data => {
      this.tariffDepotItems = data;
      this.previous_endCursor = undefined;
      this.endCursor = this.tfDepotDS.pageInfo?.endCursor;
      this.startCursor = this.tfDepotDS.pageInfo?.startCursor;
      this.hasNextPage = this.tfDepotDS.pageInfo?.hasNextPage ?? false;
      this.hasPreviousPage = this.tfDepotDS.pageInfo?.hasPreviousPage ?? false;
      this.pageIndex = 0;
      this.paginator.pageIndex = 0;
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
  }

  searchData(where: any, order: any, first: any, after: any, last: any, before: any, pageIndex: number,
    previousPageIndex?: number) {
    this.previous_endCursor = this.endCursor;
    this.subs.sink = this.tfDepotDS.SearchTariffDepotWithCount(where, order, first, after, last, before).subscribe(data => {
      this.tariffDepotItems = data;
      this.endCursor = this.tfDepotDS.pageInfo?.endCursor;
      this.startCursor = this.tfDepotDS.pageInfo?.startCursor;
      this.hasNextPage = this.tfDepotDS.pageInfo?.hasNextPage ?? false;
      this.hasPreviousPage = this.tfDepotDS.pageInfo?.hasPreviousPage ?? false;
      this.pageIndex = pageIndex;
      this.paginator.pageIndex = this.pageIndex;
      if (!this.hasPreviousPage)
        this.previous_endCursor = undefined;
    });
  }

  public loadData() {
    this.subs.sink = this.tnkDS.loadItems().subscribe(data => {
      this.tankItemList = data;
    });

    const savedCriteria = this.searchStateService.getCriteria(this.pageStateType);
    const savedPagination = this.searchStateService.getPagination(this.pageStateType);

    if (savedCriteria) {
      this.tdForm?.patchValue(savedCriteria);
      this.constructSearchCriteria();
    }

    if (savedPagination) {
      this.pageIndex = savedPagination.pageIndex;
      this.pageSize = savedPagination.pageSize;

      this.performSearch(
        savedPagination.pageSize,
        savedPagination.pageIndex,
        savedPagination.first,
        savedPagination.after,
        savedPagination.last,
        savedPagination.before
      );
    }

    if (!savedCriteria && !savedPagination) {
      this.search();
    }
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
    const dialogRef = this.dialog.open(FormDialogComponent_New, {
       disableClose: true,
      width: '600px',
      height: 'auto',
      data: {
        action: 'view',
        langText: this.langText,
        selectedItem: null
      }

    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result > 0) {
        this.handleSaveSuccess(result);

        if (this.tariffDepotItems.length > 0)
          this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
      }
    });
  }

  editCall(row: TariffDepotItem) {
    // this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(FormDialogComponent_Edit, {
      disableClose: true,
      width: '600px',
      data: {
        action: 'edit',
        langText: this.langText,
        selectedItem: row
      }
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result > 0) {
        this.handleSaveSuccess(result);
        this.onPageEvent({ pageIndex: this.pageIndex, pageSize: this.pageSize, length: this.pageSize });
      }
    });
  }

  cancelItem(row: TariffDepotItem) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      //width: '400px',
      data: {
        headerText: this.translatedLangText.ARE_YOU_SURE_DELETE,
        act: "warn"
      },
      direction: tempDirection
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.action == "confirmed") {
        this.deleteTariffDepotAndPackageDepot(row.guid!);
      }
    });
  }

  deleteTariffDepotAndPackageDepot(tariffDepotGuid: string) {
    this.tfDepotDS.deleteTariffDepot([tariffDepotGuid]).subscribe(d => {
      let count = d.data.deleteTariffDepot;
      if (count > 0) {
        this.handleSaveSuccess(count);
        this.search();
      }
    });
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
    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   data: {
    //     headerText: this.translatedLangText.CONFIRM_RESET,
    //     action: 'new',
    //   },
    //   direction: tempDirection
    // });
    // this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    //   if (result.action === 'confirmed') {
    //     this.resetForm();
    //   }
    // });
  }

  resetForm() {
    this.tdForm?.patchValue({
      profile_name: '',
      description: ''
    });
    this.unit_type_control.reset();
  }

  onTabFocused() {
    this.resetForm();
    this.search();
  }

  isAllowEdit() {
    return this.modulePackageService.hasFunctions(['TARIFF_DEPOT_COST_EDIT']);
  }

  isAllowAdd() {
    return this.modulePackageService.hasFunctions(['TARIFF_DEPOT_COST_ADD']);
  }

  isAllowDelete() {
    return this.modulePackageService.hasFunctions(['TARIFF_DEPOT_COST_DELETE']);
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
          case 'mobile':
            this.lastOrderBy = {
              tariff_depot: {
                update_dt: dirEnum,
                create_dt: dirEnum,
              },
            };
            break;
              
          case 'fName':
          this.lastOrderBy = {
            tariff_depot: {
              profile_name: dirEnum
            },
          };
          break;
          default:
            this.lastOrderBy = null;
        }
    
        this.search();
      }
}
