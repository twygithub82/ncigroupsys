import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject, OnInit,ViewChild } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TranslateModule,TranslateService } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Utility } from 'app/utilities/utility';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DatePipe } from '@angular/common';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { Apollo } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { startWith, debounceTime, tap } from 'rxjs';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { MatTabBody, MatTabGroup, MatTabHeader, MatTabsModule } from '@angular/material/tabs';
import { CustomerCompanyCleaningCategoryDS,CustomerCompanyCleaningCategoryItem } from 'app/data-sources/customer-company-category';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { ComponentUtil } from 'app/utilities/component-util';
//import {CleaningCategoryDS,CleaningCategoryItem} from 'app/data-sources/cleaning-category';
import {TariffDepotItem,TariffDepotDS} from 'app/data-sources/tariff-depot';
import { elements } from 'chart.js';
import { TankDS, TankItem } from 'app/data-sources/tank';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { TariffRepairDS,TariffRepairItem } from 'app/data-sources/tariff-repair';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { stringifyForDisplay } from '@apollo/client/utilities';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PackageRepairDS, PackageRepairGO, PackageRepairItem } from 'app/data-sources/package-repair';

export interface DialogData {
  action?: string;
  selectedValue?:number;
  // item: StoringOrderTankItem;
   langText?: any;
   selectedItems:TariffRepairItem[];
  // populateData?: any;
  // index: number;
  // sotExistedList?: StoringOrderTankItem[]
}
interface Condition {
  guid: { eq: string };
  tariff_depot_guid: { eq: null };
}



@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  providers: [provideNgxMask()],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogClose,
    DatePipe,
    MatNativeDateModule,
    TranslateModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    CommonModule,
    NgxMaskDirective,
    MatTabsModule,
    MatTabGroup,
    MatTabHeader,
    MatTabBody,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    
    
    
  ],
})
export class FormDialogComponent_Edit_Cost extends UnsubscribeOnDestroyAdapter  {
  displayedColumns = [
    //  'select',
      // 'img',
       'fName',
       'lName',
       'email',
      // 'gender',
      // 'bDate',
      // 'mobile',
      // 'actions',
    ];

  action: string;
  index?: number;
  dialogTitle?: string;

  ccDS: CustomerCompanyDS;
  cvDS :CodeValuesDS;
  groupNameCvList :CodeValuesItem[] = [];
  subGroupNameCvList :CodeValuesItem[] = [];
  lengthTypeCvList :CodeValuesItem[] = [];
  unitTypeCvList : CodeValuesItem[]=[];
  allSubGroupNameCvList :CodeValuesItem[] = [];
  
  pckRepairDS: PackageRepairDS;
  tnkItems?:TankItem[]=[];
  
  storingOrderTank?: StoringOrderTankItem;
  sotExistedList?: StoringOrderTankItem[];
  last_cargoList?: TariffCleaningItem[];
  startDate = new Date();
  pcForm: UntypedFormGroup;
  lastCargoControl = new UntypedFormControl();

  groupNameControl = new UntypedFormControl();
  subGroupNameControl = new UntypedFormControl();
  lengthUnitControl=new UntypedFormControl();
  dimensionUnitControl=new UntypedFormControl();
  widthDiadmeterUnitControl = new UntypedFormControl();
  thicknessUnitControl =new UntypedFormControl();
  customerCompanyControl = new UntypedFormControl();

  //custCompClnCatDS :CustomerCompanyCleaningCategoryDS;
  //catDS :CleaningCategoryDS;
  translatedLangText: any = {};
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
    SEARCH:'COMMON-FORM.SEARCH',
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
    PACKAGE_MIN_COST : 'COMMON-FORM.PACKAGE-MIN-COST',
    PACKAGE_MAX_COST : 'COMMON-FORM.PACKAGE-MAX-COST',
    PACKAGE_DETAIL:'COMMON-FORM.PACKAGE-DETAIL',
    PACKAGE_CLEANING_ADJUSTED_COST:"COMMON-FORM.PACKAGE-CLEANING-ADJUST-COST",
    PROFILE_NAME:'COMMON-FORM.PROFILE-NAME',
    VIEW:'COMMON-FORM.VIEW',
    DEPOT_PROFILE:'COMMON-FORM.DEPOT-PROFILE',
    DESCRIPTION:'COMMON-FORM.DESCRIPTION',
    PREINSPECTION_COST:"COMMON-FORM.PREINSPECTION-COST",
    LOLO_COST:"COMMON-FORM.LOLO-COST",
    STORAGE_COST:"COMMON-FORM.STORAGE-COST",
    FREE_STORAGE:"COMMON-FORM.FREE-STORAGE",
    LAST_UPDATED_DT : 'COMMON-FORM.LAST-UPDATED',
    ASSIGNED : 'COMMON-FORM.ASSIGNED',
    GATE_IN_COST: 'COMMON-FORM.GATE-IN-COST',
    GATE_OUT_COST: 'COMMON-FORM.GATE-OUT-COST',
    COST : 'COMMON-FORM.COST',
    LAST_UPDATED:"COMMON-FORM.LAST-UPDATED",
    GROUP_NAME:"COMMON-FORM.GROUP-NAME",
    SUB_GROUP_NAME:"COMMON-FORM.SUB-GROUP-NAME",
    PART_NAME:"COMMON-FORM.PART-NAME",
    MIN_COST:"COMMON-FORM.MIN-COST",
    MAX_COST:"COMMON-FORM.MAX-COST",
    LENGTH:"COMMON-FORM.LENGTH",
    MIN_LENGTH:"COMMON-FORM.MIN-LENGTH",
    MAX_LENGTH:"COMMON-FORM.MAX-LENGTH",
    MIN_LABOUR:"COMMON-FORM.MIN-LABOUR",
    MAX_LABOUR:"COMMON-FORM.MAX-LABOUR",
    HANDLED_ITEM:"COMMON-FORM.HANDLED-ITEM",
    LABOUR_HOUR:"COMMON-FORM.LABOUR-HOUR",
    MATERIAL_COST:"COMMON-FORM.MATERIAL-COST",
    TEST_TYPE:"COMMON-FORM.TEST-TYPE",
    DIMENSION:"COMMON-FORM.DIMENSION",
    HEIGHT_DIAMETER:"COMMON-FORM.HEIGHT-DIAMETER",
    WIDTH_DIAMETER:"COMMON-FORM.WIDTH-DIAMETER",
    THICKNESS:"COMMON-FORM.THICKNESS",
    COST_TYPE:"COMMON-FORM.COST-TYPE",
    REBATE_TYPE:"COMMON-FORM.REBATE-TYPE",
    JOB_TYPE:"COMMON-FORM.JOB-TYPE"
  };
  unit_type_control = new UntypedFormControl();
  
  selectedItems: PackageRepairItem[];
  //tcDS: TariffCleaningDS;
  //sotDS: StoringOrderTankDS;
  
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent_Edit_Cost>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
  ) {
    // Set the defaults
    super();
    this.selectedItems = data.selectedItems;
     //this.tnkDS = new TankDS(this.apollo);
     this.ccDS= new CustomerCompanyDS(this.apollo);
     this.cvDS = new CodeValuesDS(this.apollo);
     this.pckRepairDS =new PackageRepairDS(this.apollo);
    this.pcForm = this.createPackageRepair();
    this.action = data.action!;
    this.translateLangText();
    this.loadData();

    // if(this.selectedItems.length==1)
    // {
    //   var rec = this.selectedItems[0];
    //   this.pcForm.patchValue({
    //     group_name_cv: this.groupNameControl ,
    //     sub_group_name_cv:this.subGroupNameControl,
    //     part_name:rec.part_name,
    //     height_diameter:rec.dimension,
    //     height_diameter_unit_cv:this.dimensionUnitControl,
    //     width_diameter:rec.width_diameter,
    //     width_diameter_unit_cv: this.widthDiadmeterUnitControl,
    //     thickness:rec.width_diameter,
    //     thickness_unit_cv:this.thicknessUnitControl,
    //     length:rec.length,
    //     length_unit_cv:this.lengthUnitControl,
    //     labour_hour:rec.labour_hour,
    //     material_cost:rec.material_cost,
    //   });
    //}
   
  }

  createPackageRepair(): UntypedFormGroup {
    return this.fb.group({
      selectedItems: this.selectedItems,
      action:this.action,
      group_name_cv:this.groupNameControl,
      sub_group_name_cv:this.subGroupNameControl,
      customer_code:this.customerCompanyControl,
      part_name:[''],
      material_cost_percentage:[''],
     
    });
  }
 

  GetButtonCaption()
  {
    // if(this.pcForm!.value['action']== "view")
    //   {
    //     return this.translatedLangText.CLOSE ;      
    //   }
    //   else
    //   {
        return this.translatedLangText.CANCEL ;
      // }
  }
  GetTitle()
  {
   
      return this.translatedLangText.EDIT + " " + this.translatedLangText.MATERIAL_COST;      
    
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }
  
  public loadData() {

    this.subs.sink = this.ccDS.loadItems({}, { code: 'ASC' }).subscribe(data => {
      // this.customer_companyList1 = data
     });
 
    const queries = [
      { alias: 'groupName', codeValType: 'GROUP_NAME' },
      //{ alias: 'subGroupName', codeValType: 'SUB_GROUP_NAME' },
     // { alias: 'unitType', codeValType: 'UNIT_TYPE' }
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('groupName').subscribe(data => {
      this.groupNameCvList = data;
      const subqueries :any[]= [];
       data.map(d=>{
        
         if(d.child_code)
         {
           let q ={alias:d.child_code,codeValType:d.child_code};
           const hasMatch = subqueries.some(subquery => subquery.codeValType === d.child_code);
           if(!hasMatch)
           {
             subqueries.push(q);

           }
         }
       });
       if(subqueries.length>0)
       {

       
       this.cvDS.getCodeValuesByType(subqueries)
       subqueries.map(s=>{
          this.cvDS.connectAlias(s.alias).subscribe(data => {
            this.allSubGroupNameCvList.push(...data);
         
          });

       });
     
      }
     
     // this.hazardLevelCvList = addDefaultSelectOption(this.soStatusCvList, 'All');
    });
   

 

    this.pcForm?.get('group_name_cv')?.valueChanges.subscribe(value => {
      console.log('Selected value:', value);
      var aliasName =value.child_code;
      if(aliasName===undefined) return;
      const subqueries :any[]=  [{ alias: aliasName, codeValType: aliasName }];
      this.cvDS.getCodeValuesByType(subqueries);
      this.cvDS.connectAlias(aliasName).subscribe(data => {
        this.subGroupNameCvList = data;
        if(this.selectedItems.length==1)
         { 
           var rec=this.selectedItems[0];
           var subgroupNameCodeValue=this.GetCodeValue(rec.tariff_repair?.subgroup_name_cv!,this.subGroupNameCvList);
           this.subGroupNameControl.setValue(subgroupNameCodeValue);
          }

      });
      // Handle value changes here
    });
  
  }

   isFieldRequired()
   {
    return this.selectedItems.length==1;
   }

  canEdit()
  {
    return true;
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return cc && cc.code ? `${cc.code} (${cc.name})` : '';
  }
  
  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {

      console.log('valid');
      this.dialogRef.close(count);
      // let successMsg = this.langText.SAVE_SUCCESS;
      // this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
      //   successMsg = res;
      //   ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
        
      // });
    }
  }

  getGroupNameCodeValue (codeValue:String)
  {
    return this.GetCodeValue(codeValue,this.groupNameCvList);
  }

  getSubGroupNameCodeValue (codeValue:String)
  {
    return this.GetCodeValue(codeValue,this.allSubGroupNameCvList);
  }

  getUnitTypeCodeValue (codeValue:String)
  {
    return this.GetCodeValue(codeValue,this.unitTypeCvList);
  }

  GetCodeValue(codeValue:String, codeValueItems:CodeValuesItem[])
  {
   
    return codeValueItems.find(item => item.code_val === codeValue);
    
  }


  RetrieveCodeValue(CdValue :CodeValuesItem):String
  {
    let retCodeValue:String='';

    if(CdValue)
    {
      retCodeValue=CdValue.code_val||'';
    }
    return retCodeValue;

  }
  
  update() {

    
    if (!this.pcForm?.valid) return;
    
    var trfRepairItem = new TariffRepairItem();
    trfRepairItem.part_name=this.pcForm!.value['part_name'];
    
    trfRepairItem.subgroup_name_cv=String(this.RetrieveCodeValue(this.pcForm!.value['sub_group_name_cv']));
    trfRepairItem.group_name_cv=String(this.RetrieveCodeValue(this.pcForm!.value['group_name_cv']));
    trfRepairItem.material_cost=(Number(this.pcForm!.value['material_cost_percentage'])/100)+1;

    let guids= undefined;
    if (this.customerCompanyControl.value) {
      if(this.customerCompanyControl.value.length>0)
        {
         
        
          const customerCodes :CustomerCompanyItem[] = this.customerCompanyControl.value;
          guids = customerCodes.map(cc=>cc.guid);
         
        }
    }

    //var material_cost_percentage=(Number(this.pcForm!.value['material_cost_percentage'])/100)+1;
  
    this.pckRepairDS.updatePackageRepairs_MaterialCost(trfRepairItem.group_name_cv,trfRepairItem.subgroup_name_cv,trfRepairItem.part_name,guids,trfRepairItem.material_cost).subscribe(result=>{
      this.handleSaveSuccess(result?.data?.updatePackageRepair_MaterialCost);

    });

    

  

   

  }

  
  
  displayLastUpdated(r: TariffDepotItem) {
    var updatedt= r.update_dt;
    if(updatedt===null)
    {
      updatedt= r.create_dt;
    }
    const date = new Date(updatedt! * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();   

   // Replace the '/' with '-' to get the required format
 

    return `${day}/${month}/${year}`;

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
  
}