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
import { PackageLabourItem,PackageLabourDS } from 'app/data-sources/package-labour';

export interface DialogData {
  action?: string;
  selectedValue?:number;
  // item: StoringOrderTankItem;
   langText?: any;
   selectedItems:PackageLabourItem[];
  // populateData?: any;
  // index: number;
  // sotExistedList?: StoringOrderTankItem[]
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
export class FormDialogComponent {
  displayedColumns = [
    //  'select',
      // 'img',
       'fName',
       'lName',
      // 'email',
      // 'gender',
      // 'bDate',
      // 'mobile',
      // 'actions',
    ];

  action: string;
  index?: number;
  dialogTitle?: string;

  
  storingOrderTank?: StoringOrderTankItem;
  sotExistedList?: StoringOrderTankItem[];
  last_cargoList?: TariffCleaningItem[];
  startDate = new Date();
  pcForm: UntypedFormGroup;
  lastCargoControl = new UntypedFormControl();
  custCompClnCatDS :CustomerCompanyCleaningCategoryDS;
  packLabourDS : PackageLabourDS;

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
     EDIT_PACKAGE_CLEANING:"MENUITEMS.PACKAGE.LIST.PACKAGE-CLEANING-EDIT",
     STANDARD_COST:"COMMON-FORM.STANDARD-COST",
     PACKAGE_LABOUR:"COMMON-FORM.PACKAGE-LABOUR"
  };

  
  selectedItems: PackageLabourItem[]=[];
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
    
    this.selectedItems = data.selectedItems;
    
    this.pcForm = this.createPackageLabour();
    if(this.selectedItems.length==1)
      this.pcForm.patchValue({
      
        adjusted_cost:this.selectedItems[0].cost,
        standard_cost:this.selectedItems[0].tariff_labour?.cost,
        remarks:this.selectedItems[0].remarks
      
        //storage_cal_cv:this.selectStorageCalculateCV_Description(selectedProfile.storage_cal_cv)
      });
    
         
    //this.tcDS = new TariffCleaningDS(this.apollo);
    //this.sotDS = new StoringOrderTankDS(this.apollo);
    this.custCompClnCatDS=new CustomerCompanyCleaningCategoryDS(this.apollo);
    this.packLabourDS = new PackageLabourDS(this.apollo);

    this.action = data.action!;
    this.translateLangText();
    // this.sotExistedList = data.sotExistedList;
    // if (this.action === 'edit') {
    //   this.dialogTitle = 'Edit ' + data.item.tank_no;
    //   this.storingOrderTank = data.item;
    // } else {
    //   this.dialogTitle = 'New Record';
    //   this.storingOrderTank = new StoringOrderTankItem();
    // }
    // this.index = data.index;
    // this.storingOrderTankForm = this.createStorigOrderTankForm();
    // this.initializeValueChange();

    // if (this.storingOrderTank?.tariff_cleaning) {
    //   this.lastCargoControl.setValue(this.storingOrderTank?.tariff_cleaning);
    // }
  }

  createPackageLabour(): UntypedFormGroup {
    return this.fb.group({
      selectedItems: this.selectedItems,
      adjusted_cost:[''],
      standard_cost:['-'],
      remarks:['']
    });
  }
 

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }
 

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

   

    var adjusted_price = Number(this.pcForm!.value["adjusted_cost"]);
    var remarks = this.pcForm!.value["remarks"];

    if(this.selectedItems.length==1)
    {
      var packLabour = new PackageLabourItem(this.selectedItems[0]);
      packLabour.cost= this.pcForm!.value["adjusted_cost"];
      packLabour.remarks=this.pcForm!.value["remarks"];
      packLabour.tariff_labour=undefined;
      packLabour.customer_company=undefined;
      this.packLabourDS.updatePackageLabour(packLabour).subscribe(result=>{

        if(result.data.updatePackageLabour>0)
          {
           
                    console.log('valid');
                    this.dialogRef.close(result.data.updatePackageLabour);
    
          }
      });
    }
    else if(this.selectedItems.length>1)
    {
      let pc_guids:string[] = this.selectedItems
      .map(cc => cc.guid)
      .filter((guid): guid is string => guid !== undefined);

      let cost= -1;
      if(this.pcForm!.value["adjusted_cost"]) cost = this.pcForm!.value["adjusted_cost"];

      let remarks =this.pcForm!.value["remarks"];
      this.packLabourDS.updatePackageLabours(pc_guids,cost,remarks).subscribe(result=>{

        if(result.data.updatePackageLabours>0)
          {
           
                    console.log('valid');
                    this.dialogRef.close(result.data.updatePackageLabours);
    
          }
      });

    }
    // this.custCompClnCatDS.updatePackageCleanings(pc_guids,remarks,adjusted_price).subscribe(result => {
    //   console.log(result)
    //   if(result.data.updatePackageCleans>0)
    //   {
    //       //this.handleSaveSuccess(result?.data?.updateTariffClean);
    //       const returnDialog: DialogData = {
    //         selectedValue:result.data.updatePackageCleans,
    //         selectedItems:[]
    //       }
    //       console.log('valid');
    //       this.dialogRef.close(returnDialog);
    //   }
    // });

   

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
