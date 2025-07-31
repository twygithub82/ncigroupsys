import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyItem } from 'app/data-sources/customer-company';
import { CustomerCompanyCleaningCategoryDS } from 'app/data-sources/customer-company-category';
import { PackageResidueDS, PackageResidueItem } from 'app/data-sources/package-residue';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';
import {RoleItem, RoleDS, Functions, Role_Functions} from 'app/data-sources/role';
import { debounceTime, startWith, tap } from 'rxjs';
export interface DialogData {
  action?: string;
  
  // item: StoringOrderTankItem;
  langText?: any;
  selectedItem: RoleItem;
  departmentList: CodeValuesItem[];
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
    MatTooltipModule
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
  roleDS?: RoleDS;

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
  functionsList:Functions[]=[];

  translatedLangText: any = {};
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
    FEATURES: "COMMON-FORM.FEATURES",
    CONFIRM_RESET: 'COMMON-FORM.CONFIRM-RESET',
    CLEAR_ALL: 'COMMON-FORM.CLEAR-ALL',
    GROUP_NAME:'COMMON-FORM.GROUP-NAME',
    ROLE:'COMMON-FORM.ROLE',
    DEPARTMENT:'COMMON-FORM.DEPARTMENT',
    POSITION:'COMMON-FORM.POSITION',
    TEAM:'COMMON-FORM.TEAM',
    SELECTED_FEATURES:'COMMON-FORM.SELECTED-FEATURES',
    
  };


  selectedItem: RoleItem;
  departmentCvList:CodeValuesItem[]=[];
  updatedFeatureList: any[] = [];
  featureList:Functions[]=[];
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
    this.departmentCvList=data.departmentList;
    this.pcForm = this.createPackageResidue();
    this.roleDS= new RoleDS(this.apollo);
    this.packageResidueDS = new PackageResidueDS(this.apollo);
    this.CodeValuesDS = new CodeValuesDS(this.apollo);
    this.custCompClnCatDS = new CustomerCompanyCleaningCategoryDS(this.apollo);
    this.action = data.action!;
    this.translateLangText();
    this.loadData();
    this.initializeValueChanges();
  }

  createPackageResidue(): UntypedFormGroup {
    return this.fb.group({
      selectedItem: this.selectedItem,
      description: [''],
      department: [''],
      position: [''],
      feature:['']

    });
  }

  getPageTitle() {
    return this.translatedLangText.UPDATE + ' ' + this.translatedLangText.ROLE;
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

   initializeValueChanges() {
      var searchObj = this.pcForm;
      searchObj?.get("feature")!.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        tap(value => {
          this.roleDS?.searchFunctions({ code: { contains: value } }, { code: "ASC" }, 100).subscribe(data => {
            this.functionsList = data;
          });
        })
      ).subscribe();
  
     
    }

  loadData() {
    
          if (this.selectedItem!=null) {
           
    
            this.pcForm.patchValue({
              description: this.selectedItem.description,
              position:this.selectedItem.position,
              department: this.departmentCvList.find((d: CodeValuesItem) => d.code_val === this.selectedItem.department),
            });
           if (!this.pcForm.get('department')?.value) {
              const codeValueItem: CodeValuesItem = {
                code_val: this.selectedItem.department,
                description: this.selectedItem.department
              };
              
              this.departmentCvList = [...this.departmentCvList, codeValueItem];

              this.pcForm.get('department')?.setValue(codeValueItem);
            }

           
          }
   



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

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.langText.SAVE_SUCCESS;
      this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
        successMsg = res;
        ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)

      });
    }
  }

  save() {

    if(this.selectedItem)
    {

      var roleInput = new RoleItem(this.selectedItem);
      roleInput.role_functions=[];
      var role_functions = this.selectedItem?.role_functions?.filter(
  (d: Role_Functions) => d.functions?.opt != null
);
       roleInput.role_functions = new Array<Role_Functions>();
      role_functions?.forEach((d: any) => {
        var role_functions:any=new Role_Functions();
        role_functions.functions_guid=d.guid;
        role_functions.role_guid=roleInput.guid;
        role_functions.action = d.opt=="x"?"CANCEL":"NEW";
        roleInput.role_functions!.push(role_functions);
      })
      this.roleDS?.updateRole(roleInput).subscribe((result: any) => {
         this.dialogRef.close(result.data.updateRole);
      })
    }


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

cancelFeatureItem($event: MouseEvent,index: number) {
  $event.stopPropagation();
  $event.preventDefault();
   // 1. Get the specific item from the array using its index
  var item = this.selectedItem?.role_functions?.[index]; 
  
  // 2. Check if the item exists (to prevent errors if index is out of bounds)
  if (item) {
    // 3. Mark the item by setting its 'opt' property to "X"
    item.functions!.opt = "X"; 
  }

  }
displayFunctionFn(item: any) {
  return item ? item.code : undefined;
}

isSelected(item: Functions) {
  var bRetval:boolean=false;
   if(this.selectedItem?.role_functions){     
    var fnc = this.selectedItem?.role_functions?.find((d: Role_Functions) => d.functions_guid === item.guid);
    if(fnc)
    {
      if(fnc.functions?.opt!="X")
      {
        bRetval=true;
      }
    }
   }
  return bRetval;
}

AddFunctions(){

  var item:Functions = this.pcForm.get('feature')?.value;

  var selItem = this.selectedItem?.role_functions?.find((d: Role_Functions) => d.functions_guid === item.guid);
  if(selItem)
  {
    selItem.functions!.opt="";
  }
  else
  {
    var role_functions:Role_Functions=new Role_Functions();
    role_functions.functions_guid=item.guid;
    role_functions.functions=new Functions(item);
    role_functions.functions.opt="+";
    this.selectedItem?.role_functions?.unshift(role_functions);
  }
  this.pcForm.get('feature')?.setValue(null);
  this.pcForm.get('feature')?.markAsUntouched();
}


}
