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
import { PackageDepotDS,PackageDepotItem,PackageDepotGO } from 'app/data-sources/package-depot';
import { CustomerCompanyItem } from 'app/data-sources/customer-company';
import { UnsubscribeOnDestroyAdapter, TableElement, TableExportUtil } from '@shared';
import { CodeValuesDS, CodeValuesItem, addDefaultSelectOption } from 'app/data-sources/code-values';
import { TlxFormFieldComponent } from '@shared/components/tlx-form/tlx-form-field/tlx-form-field.component';

export interface DialogData {
  action?: string;
  selectedValue?:number;
  // item: StoringOrderTankItem;
   langText?: any;
   selectedItems:PackageDepotItem[];
  // populateData?: any;
  // index: number;
  // sotExistedList?: StoringOrderTankItem[]
}



@Component({
  selector: 'app-package-depot-form-dialog',
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
    TlxFormFieldComponent
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
      // 'bDate',
      // 'mobile',
      // 'actions',
    ];

  action: string;
  index?: number;
  dialogTitle?: string;

  packageDepotItems?: PackageDepotItem[]=[];
  packageDepotDS?:PackageDepotDS;
  CodeValuesDS?:CodeValuesDS;

  storageCalCvList:CodeValuesItem[]=[];

  storingOrderTank?: StoringOrderTankItem;
  sotExistedList?: StoringOrderTankItem[];
  last_cargoList?: TariffCleaningItem[];
  startDate = new Date();
  pcForm: UntypedFormGroup;
  storageCalControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  profileNameControl= new UntypedFormControl();
  custCompClnCatDS :CustomerCompanyCleaningCategoryDS;

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
    PACKAGE_MIN_COST : 'COMMON-FORM.PACKAGE-MIN-COST',
    PACKAGE_MAX_COST : 'COMMON-FORM.PACKAGE-MAX-COST',
    PACKAGE_DETAIL:'COMMON-FORM.PACKAGE-DETAIL',
    PACKAGE_CLEANING_ADJUSTED_COST:"COMMON-FORM.PACKAGE-CLEANING-ADJUST-COST",
    CUSTOMER_COMPANY:"COMMON-FORM.CUSTOMER-COMPANY",
    ALIAS_NAME:"COMMON-FORM.ALIAS-NAME",
    AGREEMENT_DUE_DATE:"COMMON-FORM.AGREEMENT-DUE-DATE",
    BILLING_PROFILE:"COMMON-FORM.BILLING-PROFILE",
    PACKAGE_DEPOT:"MENUITEMS.PACKAGE.LIST.PACKAGE-DEPOT",
    PROFILE_NAME:'COMMON-FORM.PROFILE-NAME',
    VIEW:'COMMON-FORM.VIEW',
    DEPOT_PROFILE:'COMMON-FORM.DEPOT-PROFILE',
    DESCRIPTION:'COMMON-FORM.DESCRIPTION',
    PREINSPECTION_COST:"COMMON-FORM.PREINSPECTION-COST",
    LOLO_COST:"COMMON-FORM.LOLO-COST",
    STORAGE_COST:"COMMON-FORM.STORAGE-COST",
    FREE_STORAGE:"COMMON-FORM.FREE-STORAGE",
    LAST_UPDATED_DT : 'COMMON-FORM.LAST-UPDATED',
    STANDARD_COST:"COMMON-FORM.STANDARD-COST",
    CUSTOMER_COST:"COMMON-FORM.CUSTOMER-COST",
    STORAGE_CALCULATE_BY:"COMMON-FORM.STORAGE-CALCULATE-BY",
    CARGO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    GATE_IN_COST: 'COMMON-FORM.GATE-IN-COST',
    GATE_OUT_COST: 'COMMON-FORM.GATE-OUT-COST',
    CLEANING_APPROVAL:"MENUITEMS.CLEANING.LIST.APPROVAL",
    KIV:"COMMON-FORM.KIV",
    NO_ACTION:"COMMON-FORM.NO-ACTION",
    APPROVE:"COMMON-FORM.APPROVE",
    APPROVED_DATE:"COMMON-FORM.APPROVED-DATE",
    DATE:"COMMON-FORM.DATE",
    FLAMMABLE_NOTIFICATION:"COMMON-FORM.FLAMMABLE-NOTIFICATION",
    REMARKS_NOTIFICATION:"COMMON-FORM.REMARK-NOTIFICATION",
    DETAILS:"COMMON-FORM.DETAILS",
    EIR_NO:"COMMON-FORM.EIR-NO",
    EIR_DATE:"COMMON-FORM.EIR-DATE",
    QUOTATION_DATE:"COMMON-FORM.QUOTATION-DATE",
    CARGO_NAME:"COMMON-FORM.CARGO-NAME",
    DEPOT_ESTIMATE:"COMMON-FORM.DEPOT-ESTIMATE",
    CUSTOMER_APPROVAL:"COMMON-FORM.CUSTOMER-APPROVAL",
    UPDATED_BY:"COMMON-FORM.UPDATED-BY",
    UPDATED_ON:"COMMON-FORM.UPDATED-ON",
    APPROVAL:"COMMON-FORM.APPROVAL",
    JOB_ALLOCATION:"COMMON-FORM.JOB-ALLOCATION",
    JOB_COMPLETION:"COMMON-FORM.JOB-COMPLETION",
    BILLING_DETAILS:"COMMON-FORM.BILLING-DETAILS",
    INOUT_GATE:"COMMON-FORM.INTOUT-GATE",
    CLEANING_COST_FOR:"COMMON-FORM.CLEANING-COST-FOR"

  };

  
  selectedItems: PackageDepotItem[];
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
    this.selectedItems = data.selectedItems;
    this.pcForm = this.createPackageCleaning();
    this.packageDepotDS = new PackageDepotDS(this.apollo);
    this.CodeValuesDS = new CodeValuesDS(this.apollo);
    this.custCompClnCatDS=new CustomerCompanyCleaningCategoryDS(this.apollo);
    this.action = data.action!;
    this.translateLangText();
    this.loadData();
  }

  createPackageCleaning(): UntypedFormGroup {
    return this.fb.group({
      selectedItems: this.selectedItems,
      preinspection_cost_cust:[],
      lolo_cost_cust:[],
      lolo_cost_standard:['-'],
      storage_cal_cv:this.storageCalControl,
      storage_cost_cust:[],
      storage_cost_standard:['-'],
      free_storage_days:[],
      remarks:[''],
      preinspection_cost_standard:['-'],
      gate_in_cost_cust:[''],
      gate_in_cost_standard:['-'],
      gate_out_cost_cust:[''],
      gate_out_cost_standard:['-'],
      
      profile_name:this.profileNameControl,

    });
  }
  profileChanged()
  {
    if(this.profileNameControl.value)
    {
      const selectedProfile:PackageDepotItem= this.profileNameControl.value;
      this.pcForm.patchValue({
        preinspection_cost_cust: selectedProfile.preinspection_cost,
        preinspection_cost_standard:selectedProfile.preinspection_cost,
        lolo_cost_cust:selectedProfile.lolo_cost,
        lolo_cost_standard: selectedProfile.tariff_depot?.lolo_cost,
        storage_cost_cust:selectedProfile.storage_cost,
        storage_cost_standard:selectedProfile.tariff_depot?.storage_cost,
        free_storage_days:selectedProfile.free_storage,
        gate_in_cost:selectedProfile.gate_in_cost,
        gate_out_cost:selectedProfile.gate_out_cost,
        remarks:selectedProfile.remarks,
        //storage_cal_cv:this.selectStorageCalculateCV_Description(selectedProfile.storage_cal_cv)
      });
      this.storageCalControl.setValue(this.selectStorageCalculateCV_Description(selectedProfile.storage_cal_cv));
    

    }
  }
  displayName(cc?: CustomerCompanyItem): string {
    return cc?.code ? `${cc.code} (${cc.name})` : '';
}


  displayDateFromEpoch(epoch: any) {
    if(epoch)
    {
    var updatedt= Number(epoch);
    
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

  loadData()
  {
    this.queryDepotCost();

    const queries = [
      { alias: 'storageCalCv', codeValType: 'STORAGE_CAL' },
     
    ];
    this.CodeValuesDS?.getCodeValuesByType(queries);
    this.CodeValuesDS?.connectAlias('storageCalCv').subscribe(data => {
      this.storageCalCvList=data;
   

    if(this.selectedItems.length==1)
    {
      var pckDepotItm = this.selectedItems[0];

      this.pcForm.patchValue({
        preinspection_cost_cust: pckDepotItm.preinspection_cost?.toFixed(2),
        preinspection_cost_standard:pckDepotItm.tariff_depot?.preinspection_cost?.toFixed(2),
        lolo_cost_cust:pckDepotItm.lolo_cost?.toFixed(2),
        lolo_cost_standard: pckDepotItm.tariff_depot?.lolo_cost?.toFixed(2),
        storage_cost_cust:pckDepotItm.storage_cost?.toFixed(2),
        storage_cost_standard:pckDepotItm.tariff_depot?.storage_cost?.toFixed(2),
        free_storage_days:pckDepotItm.free_storage,
        gate_in_cost_cust:pckDepotItm.gate_in_cost?.toFixed(2),
        gate_out_cost_cust:pckDepotItm.gate_out_cost?.toFixed(2),
        gate_in_cost_standard:pckDepotItm.tariff_depot?.gate_in_cost?.toFixed(2),
        gate_out_cost_standard:pckDepotItm.tariff_depot?.gate_out_cost?.toFixed(2),
        remarks:pckDepotItm.remarks,
        //storage_cal_cv:this.selectStorageCalculateCV_Description(selectedProfile.storage_cal_cv)
      });
      this.storageCalControl.setValue(this.selectStorageCalculateCV_Description(pckDepotItm.storage_cal_cv));

    }
  });

    
    
  }

  queryDepotCost()
  {
    // const where:any={ customer_company: { guid: { eq: this.selectedItem.guid } } };
    
    // this.packageDepotDS?.SearchPackageDepot(where,{},50).subscribe((data:PackageDepotItem[])=>{
    //   this.packageDepotItems=data;

    // });
  }
  
  selectStorageCalculateCV_Description(valCode?:string):CodeValuesItem
  {
    let valCodeObject: CodeValuesItem = new CodeValuesItem();
    if(this.storageCalCvList.length>0)
    {
      valCodeObject = this.storageCalCvList.find((d: CodeValuesItem) => d.code_val === valCode)|| new CodeValuesItem();
      
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

  canEdit()
  {
    return true;
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

  save() {

    if (!this.pcForm?.valid) return;

    let pd_guids:string[] = this.selectedItems
    .map(cc => cc.guid)
    .filter((guid): guid is string => guid !== undefined);

    var lolo_cost = -1;
    if (this.pcForm!.value["lolo_cost_cust"]) lolo_cost=Number(this.pcForm!.value["lolo_cost_cust"]);

    var preinspection_cost =-1;
    if (this.pcForm!.value["preinspection_cost_cust"]) preinspection_cost= Number(this.pcForm!.value["preinspection_cost_cust"]);
    var free_storage = -1;
    if(this.pcForm!.value["free_storage_days"]) free_storage= Number(this.pcForm!.value["free_storage_days"]);

    
    var storage_cost =-1;
    if(this.pcForm!.value["storage_cost_cust"]) storage_cost=Number(this.pcForm!.value["storage_cost_cust"]);

    var gate_in_cost=-1;
    if(this.pcForm!.value["gate_in_cost_cust"]) gate_in_cost=Number(this.pcForm!.value["gate_in_cost_cust"]);

    var gate_out_cost=-1;
    if(this.pcForm!.value["gate_out_cost_cust"]) gate_out_cost=Number(this.pcForm!.value["gate_out_cost_cust"]);

    var storageCalValue:String="";
    if(this.storageCalControl.value)
    {
        const storage_calCv:CodeValuesItem =  this.storageCalControl.value;
        storageCalValue = storage_calCv.code_val||"";
    }

    var storage_cal_cv = storageCalValue;
    var remarks = this.pcForm!.value["remarks"]||"";
     if(pd_guids.length==1)
     {
       if(!remarks)
       {
          remarks="--";
       }
     }
      this.packageDepotDS?.updatePackageDepots(pd_guids,free_storage,lolo_cost,preinspection_cost,storage_cost,gate_in_cost, gate_out_cost,remarks,storage_cal_cv).subscribe(result=>{
      if(result.data.updatePackageDepots>0)
      {
       
                console.log('valid');
                this.dialogRef.close(result.data.updatePackageDepots);

      }
    });

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
  
  getAction():String{
    let retval="";
    switch(this.action)
    {
      case "kiv":
        retval=this.translatedLangText.KIV;
        break;
      case "approve":
        retval=this.translatedLangText.APPROVE;
        break;
      case "noaction":
        retval = this.translatedLangText.NO_ACTION;
        break;
    }

    return retval;
  }

  ShowJobNo()
  {
     var validActions :string[]= ["kiv","approve"];
     return validActions.includes(this.action);
  }

  ShowRemarks()
  {
    var validActions :string[]= ["kiv","noaction"];
    return validActions.includes(this.action);
  }

  ShowApprovedDate()
  {
    var validActions :string[]= ["approve"];
    return validActions.includes(this.action);
  }

  ShowNoActionDate()
  {
    var validActions :string[]= ["noaction"];
    return validActions.includes(this.action);
  }

  getDescription()
  {
    return this.translatedLangText.CLEANING_COST_FOR;
  }
}
