import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject, numberAttribute, OnInit,ViewChild } from '@angular/core';
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
import { TariffRepairDS,TariffRepairItem } from 'app/data-sources/tariff-repair';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { ComponentUtil } from 'app/utilities/component-util';
//import {CleaningCategoryDS,CleaningCategoryItem} from 'app/data-sources/cleaning-category';
import {TariffDepotItem,TariffDepotDS} from 'app/data-sources/tariff-depot';
import { TankDS,TankItem } from 'app/data-sources/tank';
import { elements } from 'chart.js';
import { UnsubscribeOnDestroyAdapter, TableElement, TableExportUtil } from '@shared';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';


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
export class FormDialogComponent_New extends UnsubscribeOnDestroyAdapter {
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
 
  cvDS :CodeValuesDS;
  groupNameCvList :CodeValuesItem[] = [];
  subGroupNameCvList :CodeValuesItem[] = [];
  lengthTypeCvList :CodeValuesItem[] = [];

  tnkItems?:TankItem[];

  trfRepairDS:TariffRepairDS;

  
  storingOrderTank?: StoringOrderTankItem;
  sotExistedList?: StoringOrderTankItem[];
  last_cargoList?: TariffCleaningItem[];
  startDate = new Date();
  pcForm: UntypedFormGroup;
  lastCargoControl = new UntypedFormControl();

  groupNameControl = new UntypedFormControl();
  subGroupNameControl = new UntypedFormControl();
  testTypeControl  = new UntypedFormControl();
  heightDiameterUnitControl = new UntypedFormControl();
  widthDiameterUnitControl = new UntypedFormControl();
  thicknessUnitControl = new UntypedFormControl();
  lengthUnitControl=new UntypedFormControl();
  costTypeControl = new UntypedFormControl();
  rebateTypeControl = new UntypedFormControl();
  jobTypeControl  = new UntypedFormControl();

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
  
 // selectedItem: TariffRepairItem;
  //tcDS: TariffCleaningDS;
  //sotDS: StoringOrderTankDS;
  
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent_New>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
  ) {
    // Set the defaults
    super();
    //this.selectedItem = data.selectedItem;
   
    this.trfRepairDS = new TariffRepairDS(this.apollo);
    this.cvDS = new CodeValuesDS(this.apollo);
    this.pcForm = this.createTariffRepair();
   
  
   
    this.action = data.action!;
    this.translateLangText();
    this.loadData()
   
  }

  createTariffRepair(): UntypedFormGroup {
    return this.fb.group({
      selectedItem: null,
      action:"new",
      group_name_cv:this.groupNameControl,
      sub_group_name_cv:this.subGroupNameControl,
      part_name:[''],
      height_diameter:[''],
      width_diameter:[''],
      thickness:[''],
      length:[''],
      length_unit_cv:this.lengthUnitControl,
      labour_hour:[''],
      material_cost:[''],

    });
  }
 
  public loadData() {

    const queries = [
      { alias: 'groupName', codeValType: 'GROUP_NAME' },
      { alias: 'subGroupName', codeValType: 'SUB_GROUP_NAME' },
      { alias: 'lengthType', codeValType: 'LENGTH_TYPE' }
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('groupName').subscribe(data => {
      this.groupNameCvList = data;
     // this.hazardLevelCvList = addDefaultSelectOption(this.soStatusCvList, 'All');
    });
    this.cvDS.connectAlias('subGroupName').subscribe(data => {
      this.subGroupNameCvList = data;
    });

    this.cvDS.connectAlias('lengthType').subscribe(data => {
      this.lengthTypeCvList = data;
    });
 
  
  }
  
  GetButtonCaption()
  {
    if(this.pcForm!.value['action']== "view")
      {
        return this.translatedLangText.CLOSE ;      
      }
      else
      {
        return this.translatedLangText.CANCEL ;
      }
  }
  GetTitle()
  {
   
      return this.translatedLangText.NEW + " " + this.translatedLangText.REPAIR;      
    
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }
  

  canEdit()
  {
    return this.pcForm!.value['action']=="new";
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

  

  save() {

    if (!this.pcForm?.valid) return;
    
    let where: any = {};
    if (this.pcForm!.value['part_name']) {
      where.part_name = { eq: this.pcForm!.value['part_name'] };
    }

    this.subs.sink= this.trfRepairDS.SearchTariffRepair(where).subscribe(data=>{
        if(data.length==0)
        {
         
          let newRepair = new TariffRepairItem();
          newRepair.part_name=String(this.pcForm.value['part_name']);
          newRepair.material_cost= Number(this.pcForm!.value['material_cost']);
          newRepair.dimension= Number(this.pcForm.value['height_diameter']);
          newRepair.width_diameter= Number(this.pcForm.value['width_diameter']);
          newRepair.group_name_cv= String(this.RetrieveCodeValue(this.pcForm.value['group_name_cv']));
          newRepair.subgroup_name_cv= String(this.RetrieveCodeValue(this.pcForm.value['sub_group_name_cv']));
          newRepair.labour_hour= Number(this.pcForm.value['labour_hour']);
          newRepair.length= Number(this.pcForm.value['length']);
          newRepair.length_unit_cv= String(this.RetrieveCodeValue(this.pcForm.value['length_unit_cv']));
          newRepair.thickness=Number(this.pcForm.value['thickness']);
          this.trfRepairDS.addNewTariffRepair(newRepair).subscribe(result=>{

            this.handleSaveSuccess(result?.data?.addTariffRepair);
          });
        }

        else
        {
            this.pcForm?.get('part_name')?.setErrors({ existed: true });
        }


    });

   

   

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