import { Direction } from '@angular/cdk/bidi';
import { COMMA, ENTER, M } from '@angular/cdk/keycodes';
import { CommonModule, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { TlxMatPaginatorIntl } from '@shared/components/tlx-paginator-intl/tlx-paginator-intl';
import { Apollo } from 'apollo-angular';
import { CleaningCategoryItem } from 'app/data-sources/cleaning-category';
import { CleaningMethodDS, CleaningMethodItem } from 'app/data-sources/cleaning-method';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyItem } from 'app/data-sources/customer-company';
import { CustomerCompanyCleaningCategoryDS } from 'app/data-sources/customer-company-category';
import { PackageResidueDS, PackageResidueItem } from 'app/data-sources/package-residue';
import { RoleDS } from 'app/data-sources/role';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { TeamDS } from 'app/data-sources/teams';
import { UserDS, UserFunctionLinkage, UserGO, UserItem } from 'app/data-sources/user';
import { UserRoleLinkage } from 'app/data-sources/userrole';
import { ModulePackageService } from 'app/services/module-package.service';
import { ComponentUtil } from 'app/utilities/component-util';
import { maxLengthDisplaySingleSelectedItem, pageSizeInfo, Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';
import { debounceTime, startWith, Subscription, tap } from 'rxjs';
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { strongPasswordValidator } from 'app/utilities/validator';
// import { FormDialogComponent } from './form-dialog/form-dialog.component';
export interface DialogData {
  action?: string;
  selectedValue?: number;
  // item: StoringOrderTankItem;
  langText?: any;
  selectedItem: UserItem;
  // populateData?: any;
  // index: number;
  // sotExistedList?: StoringOrderTankItem[]
}



@Component({
  selector: 'app-management-user-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  providers: [provideNgxMask()],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatNativeDateModule,
    TranslateModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
     
    
  ],
})
export class FormDialogComponent extends UnsubscribeOnDestroyAdapter {

  displayedColumns = [
    //  'select',
    // 'img',
    'fName',
    'lName',
    'email',
    'gender',
    'bDate',
    // 'mobile',
    // 'actions',
  ];

  action: string;
  index?: number;
  dialogTitle?: string;

  packageResidueItems?: PackageResidueItem[] = [];
  packageResidueDS?: PackageResidueDS;
  CodeValuesDS?: CodeValuesDS;
  userDs?: UserDS;
  teamDs?: TeamDS;
  roleDs?: RoleDS;
  storageCalCvList: CodeValuesItem[] = [];

  storingOrderTank?: StoringOrderTankItem;
  sotExistedList?: StoringOrderTankItem[];
  last_cargoList?: TariffCleaningItem[];
  startDate = new Date();
  pcForm: UntypedFormGroup;
  storageCalControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  profileNameControl = new UntypedFormControl();
  custCompClnCatDS: CustomerCompanyCleaningCategoryDS;

  teamNameControl = new UntypedFormControl();
  teamNameList: any[] = [];
  roleNameList:any[]=[];
  adhocFuntionList:any[]=[];
  updatedRoleList: any[] = [];
  updatedTeamList:any[] =[];
  updatedAdhocList: any[] = [];
  updatedRoleFeaturesList: any[] = [];
  translatedLangText: any = {};
   separatorKeysCodes: number[] = [ENTER, COMMA];
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.CARGO-DETAILS',
    HEADER_OTHER: 'COMMON-FORM.CARGO-OTHER-DETAILS',
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
    PACKAGE_MIN_COST: 'COMMON-FORM.PACKAGE-MIN-COST',
    PACKAGE_MAX_COST: 'COMMON-FORM.PACKAGE-MAX-COST',
    PACKAGE_DETAIL: 'COMMON-FORM.PACKAGE-DETAIL',
    PACKAGE_CLEANING_ADJUSTED_COST: "COMMON-FORM.PACKAGE-CLEANING-ADJUST-COST",
    CUSTOMER_COMPANY: "COMMON-FORM.CUSTOMER-COMPANY",
    ALIAS_NAME: "COMMON-FORM.ALIAS-NAME",
    AGREEMENT_DUE_DATE: "COMMON-FORM.AGREEMENT-DUE-DATE",
    BILLING_PROFILE: "COMMON-FORM.BILLING-PROFILE",
    PACKAGE_DEPOT: "MENUITEMS.PACKAGE.LIST.PACKAGE-DEPOT",
    PROFILE_NAME: 'COMMON-FORM.PROFILE-NAME',
    VIEW: 'COMMON-FORM.VIEW',
    DEPOT_PROFILE: 'COMMON-FORM.DEPOT-PROFILE',
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    PREINSPECTION_COST: "COMMON-FORM.PREINSPECTION-COST",
    LOLO_COST: "COMMON-FORM.LOLO-COST",
    STORAGE_COST: "COMMON-FORM.STORAGE-COST",
    FREE_STORAGE: "COMMON-FORM.FREE-STORAGE",
    LAST_UPDATED_DT: 'COMMON-FORM.LAST-UPDATED',
    STANDARD_COST: "COMMON-FORM.STANDARD-COST",
    CUSTOMER_COST: "COMMON-FORM.CUSTOMER-COST",
    STORAGE_CALCULATE_BY: "COMMON-FORM.STORAGE-CALCULATE-BY",
    CARGO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    GATE_IN_COST: 'COMMON-FORM.GATE-IN-COST',
    GATE_OUT_COST: 'COMMON-FORM.GATE-OUT-COST',
    COST: "COMMON-FORM.COST",
    USER: 'MENUITEMS.MANAGEMENT.LIST.USER',
    USERNAME: 'LANDING-SIGNIN.USERNAME',
    PASSWORD: 'LANDING-SIGNIN.PASSWORD',
    CONFIRM_PASSWORD: 'LANDING-SIGNIN.CONFIRM-PASSWORD',
    NAME: 'COMMON-FORM.NAME',
    EMAIL: 'COMMON-FORM.EMAIL',
    CONTACT_NO: 'COMMON-FORM.CONTACT-NO',
    TEAM:'COMMON-FORM.TEAM',
    ROLE:'COMMON-FORM.ROLE',
    ADHOC:'COMMON-FORM.ADHOC',
    POSITION:'COMMON-FORM.POSITION',
    SELECTED_ROLES:'COMMON-FORM.SELECTED-ROLES',
    SELECTED_TEAMS:'COMMON-FORM.SELECTED-TEAMS',
    SELECTED_ADHOC:'COMMON-FORM.SELECTED-ADHOC',
    SELECTED_FEATURES:'COMMON-FORM.SELECTED-FEATURES',
    DISABLE:'COMMON-FORM.DISABLE',
    MIN_8_CHARS: "COMMON-FORM.MIN-8-CHARS",
    MUST_ONE_UPPERCASE: "COMMON-FORM.MUST-ONE-UPPERCASE",
    MUST_ONE_LOWERCASE: "COMMON-FORM.MUST-ONE-LOWERCASE",
    MUST_ONE_NUMBER: "COMMON-FORM.MUST-ONE-NUMBER",
    MUST_ONE_SPECIAL: "COMMON-FORM.MUST-ONE-SPECIAL"
  };

 
  selectedItem: UserItem;
  //tcDS: TariffCleaningDS;
  //sotDS: StoringOrderTankDS;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
  ) {
    // Set the defaults
    super();
    this.selectedItem = data.selectedItem;
    this.pcForm = this.createUserProfile();
    this.packageResidueDS = new PackageResidueDS(this.apollo);
    this.CodeValuesDS = new CodeValuesDS(this.apollo);
    this.custCompClnCatDS = new CustomerCompanyCleaningCategoryDS(this.apollo);
    this.userDs=new UserDS(this.apollo);
    this.teamDs = new TeamDS(this.apollo);
    this.roleDs=new RoleDS(this.apollo);
    this.loadData();
    this.action = data.action!;
    this.translateLangText();
    
    this.initializeValueChanges();
  }

  createUserProfile(): UntypedFormGroup {
    return this.fb.group({
      selectedItem: this.selectedItem,
      name: [''],
      contact: [''],
      email: [''],
      username: [''],
      pwd: ['', [Validators.required, strongPasswordValidator()]],
      confirm_pwd: ['', Validators.required],
      role: [''],
      team: this.teamNameControl,
      adhoc: [''],
    });
  }


  initializeValueChanges() {
    var searchObj = this.pcForm;
    // searchObj?.get("name")!.valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(300),
    //   tap(value => {
    //     this.fmlDS.search({ name: { contains: value } }, { name: "ASC" }, 100).subscribe(data => {
    //       this.nameList = data.map(i => i.name || '');
    //     });
    //   })
    // ).subscribe();

    searchObj?.get("team")!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
     tap(value => {

       var searchCriteria = '';
        if (value && typeof value === 'object') {
          searchCriteria = value.department_cv;
        } else {
          searchCriteria = value || '';
        }

       this.teamDs?.loadItems(
          {
            or: [
              { description: { contains: searchCriteria } },
              { department_cv: { contains: searchCriteria } }
            ]
          },
          { description: "ASC" },
          100
        ).subscribe(data => {this.teamNameList = data.filter(desc =>!this.updatedTeamList.some(t => t.team_guid == desc.guid));});
      })
    ).subscribe();

    searchObj?.get("role")!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
     tap(value => {

       var searchCriteria = '';
        if (value && typeof value === 'object') {
          searchCriteria = value.department;
        } else {
          searchCriteria = value || '';
        }


       this.roleDs?.searchRolesWithFunctions(
          {
            or: [
              { description: { contains: searchCriteria } },
              { department: { contains: searchCriteria } }
            ]
          },
          { description: "ASC" },
          100
        ).subscribe(data => {this.roleNameList = data.filter(desc =>!this.updatedRoleList.some(t =>t.role?.guid == desc.guid));});})
    ).subscribe();

      searchObj?.get("adhoc")!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
     tap(value => {

       var searchCriteria = '';
        if (value && typeof value === 'object') {
          searchCriteria = value.code;
        } else {
          searchCriteria = value || '';
        }


       this.roleDs?.searchFunctions(
          {
           code: { contains: searchCriteria } 
          },
          { code: "ASC" },
          100
        ).subscribe(data => {
          this.adhocFuntionList = data.filter(f =>!this.updatedRoleFeaturesList.some(t =>t.functions?.guid == f.guid))
          this.adhocFuntionList = this.adhocFuntionList.filter(f =>!this.updatedAdhocList.some(t =>t.functions?.guid == f.guid));
        });
      })
    ).subscribe();
  }

  getPageTitle() {
    return this.translatedLangText.UPDATE + ' ' + this.translatedLangText.USER;
  }
 
  displayName(cc?: CustomerCompanyItem): string {
    return cc?.code ? `${cc.code} (${cc.name})` : '';
  }

  displayDateFromEpoch(epoch: any) {
    if (epoch) {
      var updatedt = Number(epoch);

      const date = new Date(updatedt! * 1000);
      const day = String(date.getDate()).padStart(2, '0');
      const month = date.toLocaleString('en-US', { month: 'short' });
      const year = date.getFullYear();

      // Replace the '/' with '-' to get the required format


      return `${day}/${month}/${year}`;
    }
    return `-`;

  }
  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  loadData() {
    this.queryDepotCost();

    const queries = [
      { alias: 'storageCalCv', codeValType: 'STORAGE_CAL' },

    ];
    this.CodeValuesDS?.getCodeValuesByType(queries);
    this.CodeValuesDS?.connectAlias('storageCalCv').subscribe(data => {
      this.storageCalCvList = data;


      if (this.selectedItem) {
        
        var where:any ={};
        where.userName={eq: this.selectedItem.userName};
        this.userDs?.searchUserWithDetails(where).subscribe((data)=>{
          
          if(data?.length>0){
           data.forEach(user=>{
           user.team_user= user.team_user?.filter(
              (obj, index, self) =>
                index === self.findIndex(t => t.team_guid === obj.team_guid)
            );
           user.user_functions= user.user_functions?.filter(
               (obj, index, self) =>
                index === self.findIndex(t => t.functions_guid === obj.functions_guid)
           )
          });
            var usr= data[0];
            this.pcForm.patchValue({
             username: usr.userName,
             email: usr.email
            });
            this.updatedRoleList=usr.user_role!;
            this.roleNameList = this.roleNameList.filter(desc =>!this.updatedRoleList.some(t =>t.role?.guid == desc.guid));
            this.updatedTeamList=usr.team_user!;
            this.teamNameList = this.teamNameList.filter(desc =>!this.updatedTeamList.some(t => t.team_guid == desc.guid));
           // usr.user_functions=usr.user_functions?.filter(f=>f.delete_dt===null);
            this.updatedAdhocList=usr.user_functions!;
            var remItems = usr.user_functions?.filter(f =>!f.adhoc && f.delete_dt===null);
            this.updateRoleFeatureList();
            this.adhocFuntionList = this.adhocFuntionList.filter(f =>!this.updatedRoleFeaturesList.some(t =>t.functions?.guid == f.guid));
            this.adhocFuntionList = this.adhocFuntionList.filter(f =>!this.updatedAdhocList.some(t =>t.functions?.guid == f.guid));
            for (const f of this.updatedRoleFeaturesList ?? []) {
                if (!f?.functions) continue; // skip if functions is null/undefined

                f.is_disabled = (remItems ?? []).some(
                  r => r.functions_guid === f.functions_guid
                );
              }
          //  this.updatedRoleFeaturesList.forEach(f => {
          //   f.functions.is_disabled = (remItems ?? []).find(r => r.functions_guid === f.functions_guid)!==null;
          // });
                // this.updatedRoleList.forEach(r=>{
            //   this.updatedRoleFeaturesList.push(...r.role.role_functions!);
            // });
          }

        })

      

      }
    });



  }

  updateRoleFeatureList(){
      this.updatedRoleFeaturesList=[];
      this.updatedRoleList.forEach(r=>{
              if(!r.is_deleted)
              {
                  this.updatedRoleFeaturesList.push(...r.role.role_functions!);
              }
      });
      this.updatedRoleFeaturesList.forEach(f=>{
        if(!f.functions)return;
        
        var found=this.updatedAdhocList.find(a=>a.functions_guid===f.functions.guid);
        if(found===false)
        {
          found.array.forEach((element:any) => { element.is_disabled=true; });           
        }
      })
  }
  queryDepotCost() {
    // const where:any={ customer_company: { guid: { eq: this.selectedItem.guid } } };

    // this.packageDepotDS?.SearchPackageDepot(where,{},50).subscribe((data:PackageDepotItem[])=>{
    //   this.packageDepotItems=data;

    // });
  }

  selectStorageCalculateCV_Description(valCode?: string): CodeValuesItem {
    let valCodeObject: CodeValuesItem = new CodeValuesItem();
    if (this.storageCalCvList.length > 0) {
      valCodeObject = this.storageCalCvList.find((d: CodeValuesItem) => d.code_val === valCode) || new CodeValuesItem();

      // If no match is found, description will be undefined, so you can handle it accordingly

    }
    return valCodeObject;

  }



  // selectClassNo(value:string):void{
  //   const returnDialog: DialogData = {
  //     selectedValue:value
  //   }
  //   console.log('valid');
  //   this.dialogRef.close(returnDialog);
  // }

  canEdit() {
    return true;
  }

  // handleSaveSuccess(count: any) {
  //   if ((count ?? 0) > 0) {
  //     let successMsg = this.langText.SAVE_SUCCESS;
  //     this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
  //       successMsg = res;
  //       ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)

  //     });
  //     this.closeDialog();
  //   }
  // }

  save() {

  //  if (!this.pcForm?.valid) return;

    var user:any = new UserItem(this.selectedItem);
    var teamList:any[]=[];
    this.updatedTeamList.forEach(t=>{
      if(t.action)
      {
        const newItem={
          ...t.team,
          action: t.action,}  
        delete newItem.team;
        delete newItem.userId ; 
        delete newItem.team_guid;
        delete newItem.is_deleted;
        delete newItem.__typename;
        
        teamList.push(newItem);
      }
    });

    var roleList:any[]=[];
    this.updatedRoleList.forEach(r=>{
      if(r.action)
      {
        delete r.role.__typename;
        delete r.role.role_functions;
        r.role.action=r.action;
        roleList.push(r.role);
      }
    });
    
    var adhocList:any[]=[];
    this.updatedAdhocList.forEach(a=>{
      if(a.action)
      {
        
         const newItem = {
          action: a.action,
          addhoc:true,
          guid:  a.action=="NEW"? a.functions.guid:a.guid,
          remarks:''
        };
       
        adhocList.push(newItem);
      }
    });

    this.updatedRoleFeaturesList.forEach(f=>{
      if(f.action)
      {
        var newItem :  any;
        if(f.is_disabled)
        {
          newItem = {
            action: "NEW",
            addhoc: false,
            guid: f.functions.guid,
            remarks:''
          };
          var selItm =this.updatedAdhocList.find(f=>f.functions_guid===f.functions_guid);
           if(selItm)
          {
            newItem.action="EDIT";
            newItem.guid=selItm.guid;
          }
           adhocList.push(newItem);
        }
        else{
           newItem = {
            action: "CANCEL",
            addhoc: true,
            guid: f.functions.guid,
            remarks:''
          };
          var itm=this.updatedAdhocList.find(f=>f.functions_guid===f.functions_guid);
          if(itm)
          {
            newItem.guid=itm.guid;
            adhocList.push(newItem);
          }
        }

        
     
         
        
       }
    });
    
     this.userDs?.updateUser(user,roleList,teamList,adhocList).subscribe((result)=>{

        this.dialogRef.close(result.data.updateUser);
     })

  }

  markFormGroupTouched(formGroup: UntypedFormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control instanceof UntypedFormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control!.markAsTouched();
      }
    });
  }
  onNoClick(): void {
     this.dialogRef.close();
  }


 

      @ViewChild('teamInput', { static: true })
      teamInput?: ElementRef<HTMLInputElement>;
      @ViewChild('roleInput', { static: true })
      roleInput?: ElementRef<HTMLInputElement>;
       @ViewChild('adhocInput', { static: true })
      adhocInput?: ElementRef<HTMLInputElement>;
      selectedNames: any[] = [];
      
    
      onTeamSelected(event: MatAutocompleteSelectedEvent): void {
        var itm = this.selectedNames;
        var cnt = this.teamNameControl.value;
         const newItem = {
          ...cnt,
          team:cnt,
          action: "NEW"
        };
        // cnt.value.action="NEW";
        this.updatedTeamList.push(newItem);
        if (this.teamInput && this.teamInput.nativeElement) {
            this.teamInput.nativeElement.value = '';
          }
        //   if (event.chipInput && event.chipInput.inputElement) {
        //   event.chipInput.inputElement.value = '';
        // }
         const cntValue = this.teamNameControl.value;

  // Make sure cntValue is an object before adding action
 

  
        // cnt?.setValue(null);
     
      }
      // name_add(event: MatChipInputEvent): void {
      //   var cnt = this.teamNameControl;
      //   const input = event.input;
      //   const value = event.value;
      //   // Add our fruit
      //   if ((value || '').trim()) {
      //     //this.fruits.push(value.trim());
      //   }
      //   // Reset the input value
      //   // 
      //  if (event.chipInput && event.chipInput.inputElement) {
      //     event.chipInput.inputElement.value = '';
      //   }
      //   cnt?.setValue(null);
      // }
      cancelTeamtem(item:any)
      {
        item.is_deleted=true;
        if(item.action==="NEW")
        {
          const index = this.updatedTeamList.indexOf(item);
            if (index > -1) {
              this.updatedTeamList.splice(index, 1); // removes the element
            }
        }
        else
        {
           item.action="CANCEL";
        }
      }


      onRoleSelected(event: MatAutocompleteSelectedEvent): void {
        var itm = this.selectedNames;
        var cnt = this.pcForm?.get('role')?.value;
        var roleLink = new UserRoleLinkage();
        roleLink.role_guid = cnt.guid;
        roleLink.role = cnt;
         const newItem = {
          ...roleLink,
          action: "NEW"
        };

          const index = this.updatedTeamList.indexOf(newItem);
            if (index > -1) {
              this.updatedRoleList.splice(index, 1); // removes the element
            }
        // cnt.value.action="NEW";
        this.updatedRoleList.push(newItem);
        if (this.roleInput && this.roleInput.nativeElement) {
            this.roleInput.nativeElement.value = '';
          }
       

  
     this.pcForm?.get('role')?.setValue(null);
     this.updateRoleFeatureList();
      }

      cancelRoleItem(item:any)
      {
        item.is_deleted=true;
        if(item.action==="NEW")
        {
          const index = this.updatedTeamList.indexOf(item);
            if (index > -1) {
              this.updatedRoleList.splice(index, 1); // removes the element
            }
        }
        else
        {
           item.action="CANCEL";
        }
        this.updateRoleFeatureList();
      }

      toggleFunction(f:any)
      {
        f.is_disabled=f.is_disabled?false:true;
        f.action="EDIT";
        
      }
      
        onAdhocSelected(event: MatAutocompleteSelectedEvent): void {
        var itm = this.selectedNames;
        var cnt = this.pcForm?.get('adhoc')?.value;
       var itmLink = new UserFunctionLinkage();
          itmLink.adhoc = true;
          itmLink.functions = cnt;
          itmLink.functions_guid = cnt.guid;
         const newItem = {
          ...itmLink,
          action: "NEW"
        };

         
        // cnt.value.action="NEW";
        this.updatedAdhocList.unshift(newItem);
        if (this.adhocInput && this.adhocInput.nativeElement) {
            this.adhocInput.nativeElement.value = '';
          }
       

  
        this.pcForm?.get('adhoc')?.setValue(null);
        // this.adhocFuntionList = this.adhocFuntionList.filter(item => item.guid !== cnt.guid);
    //  this.updateRoleFeatureList();
      }

      cancelAdhocItem(item:any)
      {
        item.is_deleted=true;
        if(item.action==="NEW")
        {
          const index = this.updatedTeamList.indexOf(item);
            if (index > -1) {
              this.updatedRoleList.splice(index, 1); // removes the element
            }
        }
        else
        {
           item.action="CANCEL";
           item.adhoc=false;
        }
       
      }

      allowChangePassword():boolean
      {
        var retval:boolean=false;
        var pwd = this.pcForm?.get('pwd')?.value;
        var cfmpwd = this.pcForm?.get('confirm_pwd')?.value;
        retval=pwd && cfmpwd && pwd===cfmpwd;
        return retval;
      }

      changePassword()
      {

      }
}
