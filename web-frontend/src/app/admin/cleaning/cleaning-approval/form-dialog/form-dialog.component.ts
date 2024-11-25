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
import { InGateCleaningDS, InGateCleaningItem } from 'app/data-sources/in-gate-cleaning';
import { MatDividerModule } from '@angular/material/divider';
import { ClnJobOrderRequest, JobOrderGO } from 'app/data-sources/job-order';

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
    TlxFormFieldComponent,
    MatDividerModule,
],
})
export class FormDialogComponent extends UnsubscribeOnDestroyAdapter {
  displayedColumns = [
    //  'select',
      // 'img',
       'index',
       'desc',
       'depot',
       'package',
      // 'total',
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
    CLOSE: 'COMMON-FORM.CLOSE',
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
    CLEANING_COST_FOR:"COMMON-FORM.CLEANING-COST-FOR",
    LAST_CARGO_CLEANING_QUOTATION :"COMMON-FORM.LAST-CARGO-CLEANING-QUOTATION",
    TOTAL_COST:"COMMON-FORM.TOTAL-COST"
  };

  
  selectedItems: any;
  selectedItem:any;
  igCleanDS:InGateCleaningDS;
  igCleanItems:any=[];
  totalCost_depot: number = 0;
  totalCost_customer: number = 0;
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
    this.igCleanDS=new InGateCleaningDS(this.apollo);
    this.packageDepotDS = new PackageDepotDS(this.apollo);
    this.CodeValuesDS = new CodeValuesDS(this.apollo);
    this.custCompClnCatDS=new CustomerCompanyCleaningCategoryDS(this.apollo);
    this.action = data.action!;
    this.translateLangText();
    this.loadData();
    
  }

  createCleaningChargesItem(){

    this.igCleanItems=[
      {
        description:this.getDescription(),
        depotEstimate:this.pcForm?.get('depot_estimate_cost')?.value,
        customerApproval:this.pcForm?.get('customer_approval_cost')?.value,
      }
    ]
    this.calculateTotalCost();
  }

  calculateTotalCost() {
    this.totalCost_depot = this.igCleanItems.reduce((acc:number, item:any) => acc + (Number(item.depotEstimate) || 0), 0);
    this.totalCost_customer = this.igCleanItems.reduce((acc:number, item:any) => acc + (Number(item.customerApproval) || 0), 0);
  }

  createPackageCleaning(): UntypedFormGroup {
    return this.fb.group({
      selectedItems: this.selectedItems,
      job_no_input:[''],
      approved_dt:[new Date()],
      no_action_dt:[new Date()],
      remarks:[''],
      tank_no:[''],
      customer:[''],
      eir_no:[''],
      eir_dt:[''],
      quotation_dt:[''],
      cargo:[''],
      job_no:['-'],
      depot_estimate_cost:[''],
      customer_approval_cost:['-'],
      update_by:[''],
      update_on:[''],
      status_cv:[''],
      approve_dt:[''],
      na_dt:['']
    });
  }

  displayDateFromEpoch(epoch: any) {
    if(epoch)
    {
      if(typeof epoch==="string") return epoch;
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
    //this.queryDepotCost();

    const queries = [
      { alias: 'storageCalCv', codeValType: 'STORAGE_CAL' },
     
    ];
    this.CodeValuesDS?.getCodeValuesByType(queries);
    this.CodeValuesDS?.connectAlias('storageCalCv').subscribe(data => {
      this.storageCalCvList=data;
   

    if(this.selectedItems.length==1)
    {
      this.selectedItem=this.selectedItems[0];
      var inGateClnItem = this.selectedItem;
      this.pcForm.patchValue({

        
        tank_no:inGateClnItem.storing_order_tank?.tank_no,
        customer:this.displayCustomerName(inGateClnItem.storing_order_tank?.storing_order?.customer_company),
         eir_no:inGateClnItem.storing_order_tank?.in_gate[0]?.eir_no,
         eir_dt:this.displayDateFromEpoch(inGateClnItem.storing_order_tank?.in_gate[0]?.eir_dt),
         quotation_dt:this.displayDateFromEpoch(inGateClnItem.storing_order_tank?.in_gate[0]?.eir_dt),
         cargo:inGateClnItem.storing_order_tank?.tariff_cleaning.cargo,
         job_no:inGateClnItem.job_no,
         depot_estimate_cost:Number(inGateClnItem.storing_order_tank?.tariff_cleaning?.cleaning_category?.cost).toFixed(2),
         customer_approval_cost: Number(inGateClnItem.cleaning_cost!)!.toFixed(2),
         update_by:inGateClnItem.approve_by,
         update_on:this.displayDateFromEpoch(inGateClnItem.approve_dt),
         job_no_input:inGateClnItem.job_no,
         status_cv:inGateClnItem.status_cv,
         approve_dt:this.displayDateFromEpoch(inGateClnItem.approve_dt),
         na_dt:this.displayDateFromEpoch(inGateClnItem.na_dt),
         remarks:inGateClnItem.remarks,
      });

      this.createCleaningChargesItem();
    //  this.storageCalControl.setValue(this.selectStorageCalculateCV_Description(pckDepotItm.storage_cal_cv));

    }
  });

    
    
  }

  displayCustomerName(cc?: CustomerCompanyItem): string {
    return String(cc?.code ? `${cc.code} (${cc.name})` : '');
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
  

  canEdit()
  {
    if(this.action!="view")
    {
    return true;
    }
    else
    {
      return false;
    }
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {
      let successMsg = this.langText.SAVE_SUCCESS;
      this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
        successMsg = res;
        ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);
        this.dialogRef.close(count);
        
      });
    }
  }


  save() {

    if (!this.pcForm?.valid) return;

    var selItem =this.selectedItems[0];
    delete selItem.storing_order_tank;
    var rep: InGateCleaningItem = new InGateCleaningItem(selItem);
    rep.action=this.action.toUpperCase();
    switch(this.action.toUpperCase())
    {
      case "APPROVE":
        rep.approve_dt=Utility.convertDate(this.pcForm.get("approved_dt")?.value) as number;
        rep.job_no=this.pcForm.get("job_no_input")?.value;
        break;
      case "KIV":
        rep.job_no= this.pcForm.get("job_no_input")?.value;
        rep.remarks=this.pcForm.get("remarks")?.value;
        break;
      case "NO_ACTION":
        rep.action="NA";
        rep.na_dt=Utility.convertDate(this.pcForm.get("no_action_dt")?.value)as number;
        rep.remarks=this.pcForm.get("remarks")?.value;
        break;
    }
   
    if(this.action.toUpperCase()==="NO_ACTION")
    {
      const distinctJobOrders :any[] =[];
      if(this.selectedItems[0].job_order)
      {
      const jobOrder:JobOrderGO = new JobOrderGO(this.selectedItems[0].job_order);
      distinctJobOrders.push(jobOrder);
      }
      const repJobOrder = new ClnJobOrderRequest({
        guid: this.selectedItems[0]?.guid,
        sot_guid: this.selectedItems[0]?.storing_order_tank?.guid,
        remarks: this.selectedItems[0]?.remarks,
        job_order: distinctJobOrders
      });
  
      console.log(repJobOrder)
      this.igCleanDS?.abortInGateCleaning(repJobOrder).subscribe(result => {
        console.log(result)
        this.handleSaveSuccess(result?.data?.abortCleaning);
      });
    }
    else
    {
      delete rep.job_order;
      this.igCleanDS.updateInGateCleaning(rep).subscribe(result=>{
          if(result.data.updateCleaning>0)
          {
          
                    console.log('valid');
                    this.handleSaveSuccess(result.data.updateCleaning);
    
          }
        });
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
      case "no_action":
        retval = this.translatedLangText.NO_ACTION;
        break;
      case "view":
        retval =this.translatedLangText.VIEW;
        break;
    }

    return retval;
  }

  ShowNoActionDtView()
  {
    if(this.action=="view")
    {
      var status_cv = this.pcForm.get('status_cv')?.value;
      var validActions :string[]= ["no_action"];
      return validActions.includes(status_cv.toLocaleLowerCase());
    }

    return false;

  }

  ShowApproveDtView()
  {
    if(this.action=="view")
    {
      var status_cv = this.pcForm.get('status_cv')?.value;
      var validActions :string[]= ["approve"];
      return validActions.includes(status_cv.toLocaleLowerCase());
    }

    return false;

  }

  ShowRemarksView()
  {
    if(this.action=="view")
    {
      var status_cv = this.pcForm.get('status_cv')?.value;
      var validActions :string[]= ["kiv","no_action"];
      return validActions.includes(status_cv.toLocaleLowerCase());
    }

    return false;

  }

  ShowStatusView()
  {
    var validActions :string[]= ["view"];
    return validActions.includes(this.action);
  }

  ShowJobNo()
  {
     var validActions :string[]= ["kiv","approve"];
     return validActions.includes(this.action);
  }

  ShowRemarks()
  {
    var validActions :string[]= ["kiv","no_action"];
    return validActions.includes(this.action);
  }

  ShowApprovedDate()
  {
    var validActions :string[]= ["approve"];
    return validActions.includes(this.action);
  }

  ShowNoActionDate()
  {
    var validActions :string[]= ["no_action"];
    return validActions.includes(this.action);
  }

  getDescription()
  {
    return `${this.translatedLangText.CLEANING_COST_FOR} ${this.pcForm?.value["cargo"]}` ;
  }

  getNatureInGateAlert()
  {
    return `${this.selectedItem.storing_order_tank?.tariff_cleaning?.nature_cv} - ${this.selectedItem.storing_order_tank?.tariff_cleaning?.in_gate_alert}` ;
  }

  getBackgroundColorFromNature()
  {
    var color='orange';
    let natureCv=this.selectedItem.storing_order_tank?.tariff_cleaning?.nature_cv;
    switch(natureCv?.toUpperCase())
    {
      
      case "HAZARDOUS":
        color='purple';
      break;
      case "TOXIC":
        color='green';
      break;
      case "GASES":
        color='cyan';
      break;
    }

    return color;
  }

  getTariffCleaningRemarks()
  {
    return this.selectedItem.storing_order_tank?.tariff_cleaning?.remarks?this.selectedItem.storing_order_tank?.tariff_cleaning?.remarks:"-";
  }


  
}
