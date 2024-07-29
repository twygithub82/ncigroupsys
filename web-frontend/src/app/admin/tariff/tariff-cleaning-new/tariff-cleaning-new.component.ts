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
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
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
import { StoringOrderDS, StoringOrderGO, StoringOrderItem } from 'app/data-sources/storing-order';
import { Observable, Subscription } from 'rxjs';
import { TankDS, TankItem } from 'app/data-sources/tank';
import { TariffCleaningDS, TariffCleaningGO, TariffCleaningItem } from 'app/data-sources/tariff-cleaning'
import { ComponentUtil } from 'app/utilities/component-util';
import { CleaningCategoryDS, CleaningCategoryItem } from 'app/data-sources/cleaning-category';
import { CleaningMethodDS, CleaningMethodItem } from 'app/data-sources/cleaning-method';
import { MatTabBody, MatTabGroup, MatTabHeader, MatTabsModule } from '@angular/material/tabs';
import { FormDialogComponent } from './form-dialog/form-dialog.component';

@Component({
  selector: 'app-tariff-cleaning-new',
  standalone: true,
  templateUrl: './tariff-cleaning-new.component.html',
  styleUrl: './tariff-cleaning-new.component.scss',
  imports: [
    BreadcrumbComponent,
    MatButtonModule,
    MatSidenavModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatTabsModule,
    MatTabGroup,
    MatTabHeader,
    MatTabBody,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    NgScrollbar,
    NgClass,
    DatePipe,
    MatNativeDateModule,
    TranslateModule,
    CommonModule,
    MatLabel,
    MatTableModule,
    MatPaginatorModule,
    FeatherIconsComponent,
    MatProgressSpinnerModule,
    RouterLink,
    MatRadioModule,
    MatDividerModule,
    MatMenuModule,
  ]
})
export class TariffCleaningNewComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  displayedColumns = [
    'select',
    // 'tank_no',
    //'tank_no_validity',
    // 'last_cargo',
    // 'job_no',
    // 'purpose_storage',
    // 'purpose_cleaning',
    // 'purpose_steam',
    // 'purpose_repair_cv',
    // 'status_cv',
    // 'certificate_cv',
    // 'actions'
  ];

  pageTitleNew = 'MENUITEMS.TARIFF.LIST.TARIFF-CLEANING-NEW'
  pageTitleEdit = 'MENUITEMS.TARIFF.LIST.TARIFF-CLEANING-EDIT'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT',
    'MENUITEMS.TARIFF.LIST.TARIFF-CLEANING'
  ]
  translatedLangText: any = {}
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.CARGO-DETAILS',
    HEADER_OTHER: 'COMMON-FORM.CARGO-OTHER-DETAILS',
    CUSTOMER_CODE: 'COMMON-FORM.CUSTOMER-CODE',
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
    
  }


  cCategoryList : CleaningCategoryItem[]=[];
  cMethodList : CleaningMethodItem[]=[];
  tcList :TariffCleaningItem[]=[];
  classNoCvList :CodeValuesItem[] = [];
  banTypeCvList :CodeValuesItem[] = [];
  hazardLevelCvList :CodeValuesItem[] = [];
  natureCvList:CodeValuesItem[]=[];
  openGateCvList:CodeValuesItem[]=[];


  classNoControl = new UntypedFormControl();
  methodControl = new UntypedFormControl();
  categoryControl = new UntypedFormControl();
  banTypeControl= new UntypedFormControl();
  hazardLevelControl= new UntypedFormControl();
  openGateControl= new UntypedFormControl();
  natureControl=new UntypedFormControl();
  tcForm?: UntypedFormGroup;

  tariffCleaningItem:TariffCleaningItem=new TariffCleaningItem();

 // storingOrderItem: StoringOrderItem = new StoringOrderItem();
  //sotList = new MatTableDataSource<StoringOrderTankItem>();
  tc_guid?: string | null;

  cvDS: CodeValuesDS;
  soDS: StoringOrderDS;
  tcDS: TariffCleaningDS;
  cCategoryDS:CleaningCategoryDS;
  cMethodDS:CleaningMethodDS;

  
  
  soList: StoringOrderItem[] = [];

  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) {
    super();
    this.translateLangText();
   // this.loadData();
   this.initTcForm();
    this.soDS = new StoringOrderDS(this.apollo);
    this.tcDS=new TariffCleaningDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.cCategoryDS= new CleaningCategoryDS(this.apollo);
    this.cMethodDS= new CleaningMethodDS(this.apollo);
   
  }

  initTcForm() {
    this.tcForm = this.fb.group({
      guid: [{value:''}],
      cargo_name: [''],
      cargo_alias:[''],
      cargo_description:[''],
      class_no: this.classNoControl,
      method: this.methodControl,
      category:this.categoryControl,
      hazard_level:this.hazardLevelControl,
      ban_type:this.banTypeControl,
      open_gate:this.openGateControl,
      flash_point:[''],
      un_no: ['', [Validators.required, this.onlyNumbersDashValidator]],
      nature:this.natureCvList,
      in_gate_alert:[''],
      depot_note:['']
    });
  }

  ngOnInit() {
    //this.initializeFilter();
    this.loadData();
  }

  populatetcForm(tc: TariffCleaningItem):void {
    //this.tcForm!.patchValue({
    this.tcForm=  this.fb.group({
      guid: tc.guid,
      cargo_name: tc.cargo,
      cargo_alias:tc.alias,
      cargo_description:tc.description,
      class_no: { value: tc.class_cv, disabled: false },
      method: { value: tc.cleaning_method_guid, disabled: false },
      category:{ value: tc.cleaning_category_guid, disabled: false },
      hazard_level:{ value: tc.hazard_level_cv, disabled: false },
      ban_type:{ value: tc.ban_type_cv, disabled: false },
     
      open_gate:{ value: tc.open_on_gate_cv, disabled: false },
      flash_point:tc.flash_point,
      un_no:[tc.un_no, [Validators.required, this.onlyNumbersDashValidator]],
      nature:{ value: tc.nature_cv, disabled: false },
      in_gate_alert:tc.in_gate_alert,
      depot_note:tc.depot_note
    });
   
  }

  public loadData() {
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
      { alias: 'banTypeCv', codeValType: 'BAN_TYPE' },
      { alias: 'openGateCv', codeValType: 'YES_NO' },
      { alias: 'natureCv', codeValType: 'NATURE_TYPE' },
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
    this.cvDS.connectAlias('openGateCv').subscribe(data => {
      this.openGateCvList = data;
    });
    this.cvDS.connectAlias('natureCv').subscribe(data => {
      this.natureCvList = data;
    });

    this.tc_guid = this.route.snapshot.paramMap.get('id');
    if(this.tc_guid)
    {
      {
        const where: any = {};
        where.guid ={eq:this.tc_guid};
       
        // EDIT
        this.subs.sink = this.tcDS.SearchTariffCleaning(where).subscribe(data => {
          if (this.tcDS.totalCount > 0) {
            this.tariffCleaningItem = data[0];
            this.populatetcForm(this.tariffCleaningItem);
           // this.populateSOForm(this.storingOrderItem);
          }
        });
      }

    }
    // else
    // {
    //   this.initTcForm();
    // }
  }

  onContextMenu(event: MouseEvent, item: AdvanceTable) {
    this.preventDefault(event);
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    if (this.contextMenu !== undefined && this.contextMenu.menu !== null) {
      this.contextMenu.menuData = { item: item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }
  preventDefault(event: Event) {
    event.preventDefault(); // Prevents the form submission
  }
  stopEventTrigger(event: Event) {
    //this.preventDefault(event);
    this.stopPropagation(event);
  }

  
  stopPropagation(event: Event) {
   // event.stopPropagation(); // Stops event propagation
  }
  
 

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  onTCFormSubmit() {
   //this.tcForm!.get('sotList')?.setErrors(null);
   //this.tcForm?.get('un_no')?.setErrors({ exited: false });
    if (this.tcForm?.valid) 
      {
      // if (!this.sotList.data.length) {
      //   this.tcForm.get('sotList')?.setErrors({ required: true });
      // } else 
     // {
        let tc: TariffCleaningItem = new TariffCleaningItem(this.tariffCleaningItem);
       // tc.guid='';
        tc.cargo=this.tcForm.value['cargo_name'];
        tc.alias=this.tcForm.value['cargo_alias'];
        tc.description=this.tcForm.value['cargo_description'];
        tc.in_gate_alert=this.tcForm.value['in_gate_alert'];
        tc.depot_note=this.tcForm.value['depot_note'];;

        tc.class_cv=this.tcForm.value['class_no'];
        tc.cleaning_category_guid=this.tcForm.value['category'];
        tc.cleaning_method_guid=this.tcForm.value['method'];
        tc.hazard_level_cv=this.tcForm.value['hazard_level'];
        tc.ban_type_cv=this.tcForm.value['ban_type'];
        tc.open_on_gate_cv=this.tcForm.value['open_gate'];
        tc.flash_point= Number(this.tcForm.value['flash_point']);
        tc.un_no=this.tcForm.value['un_no'];
        tc.nature_cv=this.tcForm.value['nature'];
        
        this.tcDS.CheckTheExistingUnNo(String(tc.un_no)).subscribe(result=>{
          if(this.tcDS.totalCount==0)
          {
            if (tc.guid) {
              this.tcDS.updateTariffCleaning(tc).subscribe(result => {
                console.log(result)
                this.handleSaveSuccess(result?.data?.updateTariffClean);
              });
            }
            else
            {
              this.tcDS.addNewTariffCleaning(tc).subscribe(result => {
                  console.log(result)
                  this.handleSaveSuccess(result?.data?.addTariffCleaning);
                });
            }
          }
          else
          {
           // let allowUpdate :boolean=true;
            let allowUpdate:boolean =true;
            for (let i = 0; i < result.length; i++) {
              if (result[i].guid != tc.guid) {
                allowUpdate = false;
                break;  // Exit the loop
              }
            }
            if(allowUpdate)
            {

              if (tc.guid) {
                this.tcDS.updateTariffCleaning(tc).subscribe(result => {
                  console.log(result)
                  this.handleSaveSuccess(result?.data?.updateTariffClean);
                });
              }
            }
            else
            {
            this.tcForm?.get('un_no')?.setErrors({ existed: true });
            }
            
            
          }
        });
       
        
      
    } 
    else {
      console.log('Invalid tcForm', this.tcForm?.value);
    }
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.langText.SAVE_SUCCESS;
      this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
        successMsg = res;
        ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
        this.router.navigate(['/admin/tariff/tariff-cleaning']);
      });
    }
  }

  onlyNumbersDashValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const regex = /^[0-9-]*$/;
    if (control.value && !regex.test(control.value)) {
      return { 'invalidCharacter': true };
    }
    return null;
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

  selectClassNo(value:string):void{
    var codeValue = new CodeValuesItem();
    codeValue.code_val=value;
    this.classNoControl.setValue(codeValue);
  }

  // @HostListener('document:keydown.enter', ['$event'])
  // handleEnterKey(event: KeyboardEvent) {
  //   if (this.tcForm?.valid) {
  //     this.onTCFormSubmit();
  //   }
  //   else
  //   {
  //    event.preventDefault();
  //   }
  // }

  addOrderDetails(event: Event) {
    this.preventDefault(event);  // Prevents the form submission
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent,{
      data: {
        action: 'new',
        langText: this.langText,
      }
        
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
         if (result) {
          if(result.selectedValue)
          {
            this.tcForm!.patchValue({
              class_no: result.selectedValue,
            });
          //this.tcForm?.setValue({"class_no":result.selectedValue});
          }
      //     //this.updateData([...this.sotList.data, result.item]);
      //     const data = [...this.sotList.data];
      //     const newItem = new StoringOrderTankItem({
      //       ...result.item,
      //       actions: ['new']
      //     });
  
      //     // Add the new item to the end of the list
      //     data.push(newItem);
  
      //     this.updateData(data);
      }
      });
    // const dialogRef = this.dialog.open(FormDialogComponent, {
    //   data: {
    //     item: new StoringOrderTankItem(),
    //     action: 'new',
    //     langText: this.langText,
    //     populateData: {
    //       unit_typeList: this.unit_typeList,
    //       repairCv: this.repairCv,
    //       clean_statusCv: this.clean_statusCv,
    //       yesnoCv: this.yesnoCv
    //     },
    //     index: -1,
    //     sotExistedList: this.sotList.data
    //   },
    //   direction: tempDirection
    // });
    // this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     //this.updateData([...this.sotList.data, result.item]);
    //     const data = [...this.sotList.data];
    //     const newItem = new StoringOrderTankItem({
    //       ...result.item,
    //       actions: ['new']
    //     });

    //     // Add the new item to the end of the list
    //     data.push(newItem);

    //     this.updateData(data);
    //   }
    // });
  }
}
