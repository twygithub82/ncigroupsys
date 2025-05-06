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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';
//import {CleaningCategoryDS,CleaningCategoryItem} from 'app/data-sources/cleaning-category';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { TariffBufferDS, TariffBufferItem } from 'app/data-sources/tariff-buffer';
import { TariffDepotItem } from 'app/data-sources/tariff-depot';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';

export interface DialogData {
  action?: string;
  selectedValue?: number;
  // item: StoringOrderTankItem;
  langText?: any;
  selectedItem: TariffBufferItem;
  // populateData?: any;
  // index: number;
  // sotExistedList?: StoringOrderTankItem[]
}
interface Condition {
  guid: { eq: string };
  tariff_depot_guid: { eq: null };
}

@Component({
  selector: 'app-tariff-buffer-form-edit-dialog',
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
    PreventNonNumericDirective
  ],
})
export class FormDialogComponent_Edit extends UnsubscribeOnDestroyAdapter {
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


  trfBufferDS: TariffBufferDS;




  startDate = new Date();
  pcForm: UntypedFormGroup;
  lastCargoControl = new UntypedFormControl();
  //custCompClnCatDS :CustomerCompanyCleaningCategoryDS;
  //catDS :CleaningCategoryDS;
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
    SAVE_SUCCESS: 'COMMON-FORM.SAVE-SUCCESS',
    BACK: 'COMMON-FORM.BACK',
    SEARCH: 'COMMON-FORM.SEARCH',
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
    CARGO_NAME: 'COMMON-FORM.CARGO-NAME',
    CARGO_ALIAS: 'COMMON-FORM.CARGO-ALIAS',
    CARGO_DESCRIPTION: 'COMMON-FORM.CARGO-DESCRIPTION',
    CARGO_CLASS: 'COMMON-FORM.CARGO-CLASS',
    CARGO_CLASS_SELECT: 'COMMON-FORM.CARGO-CLASS-SELECT',
    CARGO_UN_NO: 'COMMON-FORM.CARGO-UN-NO',
    CARGO_METHOD: 'COMMON-FORM.CARGO-METHOD',
    CARGO_CATEGORY: 'COMMON-FORM.CARGO-CATEGORY',
    CARGO_FLASH_POINT: 'COMMON-FORM.CARGO-FLASH-POINT',
    CARGO_COST: 'COMMON-FORM.CARGO-COST',
    CARGO_HAZARD_LEVEL: 'COMMON-FORM.CARGO-HAZARD-LEVEL',
    CARGO_BAN_TYPE: 'COMMON-FORM.CARGO-BAN-TYPE',
    CARGO_NATURE: 'COMMON-FORM.CARGO-NATURE',
    CARGO_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    CARGO_NOTE: 'COMMON-FORM.CARGO-NOTE',
    CARGO_CLASS_1: "COMMON-FORM.CARGO-CALSS-1",
    CARGO_CLASS_1_4: "COMMON-FORM.CARGO-CALSS-1-4",
    CARGO_CLASS_1_5: "COMMON-FORM.CARGO-CALSS-1-5",
    CARGO_CLASS_1_6: "COMMON-FORM.CARGO-CALSS-1-6",
    CARGO_CLASS_2_1: "COMMON-FORM.CARGO-CALSS-2-1",
    CARGO_CLASS_2_2: "COMMON-FORM.CARGO-CALSS-2-2",
    CARGO_CLASS_2_3: "COMMON-FORM.CARGO-CALSS-2-3",
    PACKAGE_MIN_COST: 'COMMON-FORM.PACKAGE-MIN-COST',
    PACKAGE_MAX_COST: 'COMMON-FORM.PACKAGE-MAX-COST',
    PACKAGE_DETAIL: 'COMMON-FORM.PACKAGE-DETAIL',
    PACKAGE_CLEANING_ADJUSTED_COST: "COMMON-FORM.PACKAGE-CLEANING-ADJUST-COST",
    PROFILE_NAME: 'COMMON-FORM.PROFILE-NAME',
    VIEW: 'COMMON-FORM.VIEW',
    DEPOT_PROFILE: 'COMMON-FORM.DEPOT-PROFILE',
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    PREINSPECTION_COST: "COMMON-FORM.PREINSPECTION-COST",
    LOLO_COST: "COMMON-FORM.LOLO-COST",
    STORAGE_COST: "COMMON-FORM.STORAGE-COST",
    FREE_STORAGE: "COMMON-FORM.FREE-STORAGE",
    LAST_UPDATED_DT: 'COMMON-FORM.LAST-UPDATED',
    GATE_IN_COST: 'COMMON-FORM.GATE-IN-COST',
    GATE_OUT_COST: 'COMMON-FORM.GATE-OUT-COST',
    COST: 'COMMON-FORM.COST',
    LAST_UPDATED: "COMMON-FORM.LAST-UPDATED",
    BUFFER_TYPE: "COMMON-FORM.BUFFER-TYPE",
    BUFFER_CLEANING: 'MENUITEMS.TARIFF.LIST.TARIFF-BUFFER',
  };
  unit_type_control = new UntypedFormControl();

  selectedItem: TariffBufferItem;
  //tcDS: TariffCleaningDS;
  //sotDS: StoringOrderTankDS;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent_Edit>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
  ) {
    // Set the defaults
    super();
    this.selectedItem = data.selectedItem;
    this.trfBufferDS = new TariffBufferDS(this.apollo);
    this.pcForm = this.createTariffBuffer();

    this.action = data.action!;
    this.translateLangText();

    // const where: any = {};
    // where.tariff_depot_guid={or:[{eq:null},{eq:''}]};

    // this.subs.sink = this.tnkDS.search(where,{}).subscribe(data=>{
    //   if (this.selectedItem?.tanks) {
    //     data.unshift(...this.selectedItem.tanks);
    //   }

    //   this.unit_type_control.setValue(this.selectedItem.tanks);
    // }

    // );


  }

  createTariffBuffer(): UntypedFormGroup {
    return this.fb.group({
      selectedItem: this.selectedItem,
      action: "edit",
      buffer_type: this.selectedItem.buffer_type,
      cost: this.selectedItem.cost,
      remarks: this.selectedItem.remarks
    });
  }


  removeTypename(obj: any): any {
    return JSON.parse(JSON.stringify(obj), (key, value) =>
      key === '__typename' ? undefined : value
    );
  }

  GetButtonCaption() {
    // if(this.pcForm!.value['action']== "view")
    //   {
    //     return this.translatedLangText.CLOSE ;      
    //   }
    //   else
    //   {
    return this.translatedLangText.CANCEL;
    // }
  }
  GetTitle() {

    return this.translatedLangText.EDIT + " " + this.translatedLangText.BUFFER_CLEANING;

  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }


  canEdit() {
    return true;
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {

      console.log('valid');
      this.dialogRef.close(count);
      // let successMsg = this.langText.SAVE_SUCCESS;
      // this.translate.get(this.langText.SAVE_SUCCESS).subscribe((res: string) => {
      //   successMsg = res;
      //   ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)

      // });
    }
  }

  update() {

    if (!this.pcForm?.valid) return;

    let where: any = {};
    if (this.pcForm!.value['buffer_type']) {
      where.buffer_type = { eq: this.pcForm!.value['buffer_type'] };
    }

    this.subs.sink = this.trfBufferDS.SearchTariffBuffer(where).subscribe(data => {
      let update = true;
      if (data.length > 0) {
        var queriedRec = data[0];
        if (queriedRec.guid != this.selectedItem.guid) {
          update = false;
          this.pcForm?.get('buffer_type')?.setErrors({ existed: true });
        }
      }
      if (update) {
        var td = new TariffBufferItem(this.selectedItem);
        td.buffer_type = this.pcForm!.value['buffer_type'];
        td.cost = Number(this.pcForm!.value['cost']);
        td.remarks = this.pcForm!.value['remarks'];
        // td.package_buffer=new PackageBufferItem();
        this.trfBufferDS.updateTariffBuffer(td).subscribe(result => {
          this.handleSaveSuccess(result?.data?.updateTariffBuffer);
        });
        // let conditions:any[] = [];
        // let unit_types:TankItem[]=[];
        // let insert =true;
        // if(this.unit_type_control.value.length>0)
        // {
        //   this.unit_type_control.value.forEach((data:TankItem) => {
        //       let cond:any={guid:{eq:String(data.guid)}};
        //       conditions.push(cond);
        //       let tnk:TankItem= new TankItem();
        //       tnk.guid=data.guid;
        //       unit_types.push(tnk);
        //   });
        //   let where ={or:conditions};
        //   this.subs.sink=this.tnkDS.search(where).subscribe(data=>{
        //     for(const d of data)
        //     {
        //       if(d.tariff_depot_guid!=null && d.tariff_depot_guid!=this.selectedItem.guid)
        //       {
        //         update=false;
        //          break;
        //       }
        //     }
        //      if(update)
        //      {
        //         var updatedTD = new TariffDepotItem(this.selectedItem);
        //         updatedTD.profile_name = this.pcForm!.value['name'];
        //         updatedTD.description = this.pcForm!.value['description'];
        //         updatedTD.free_storage= this.pcForm!.value['free_storage'];
        //         updatedTD.lolo_cost= this.pcForm!.value['lolo_cost'];
        //         updatedTD.preinspection_cost= this.pcForm!.value['preinspection_cost'];
        //         updatedTD.storage_cost= this.pcForm!.value['storage_cost'];
        //         updatedTD.gate_in_cost= this.pcForm!.value['gate_in_cost'];
        //         updatedTD.gate_out_cost= this.pcForm!.value['gate_out_cost'];
        //         updatedTD.tanks = unit_types;
        //         this.trfDepotDS.updateTariffDepot(updatedTD).subscribe(result=>{
        //           this.handleSaveSuccess(result?.data?.updateTariffDepot);

        //         });
        //      }
        //      else
        //      {
        //       this.pcForm?.get('unit_types')?.setErrors({ assigned: true });
        //      }

        //     });

        // }
      }



      //   }
      //   if(insert)
      //   {
      //     let newDepot = new TariffDepotItem();
      //     newDepot.lolo_cost= Number(this.pcForm!.value['lolo_cost']);
      //     newDepot.free_storage= Number(this.pcForm.value['free_storage']);
      //     newDepot.description= String(this.pcForm.value['description']);
      //     newDepot.preinspection_cost= Number(this.pcForm.value['preinspection_cost']);
      //     newDepot.profile_name= String(this.pcForm.value['name']);
      //     newDepot.storage_cost= Number(this.pcForm.value['storage_cost']);
      //     newDepot.tanks=unit_types;
      //     this.trfDepotDS.addNewTariffDepot(newDepot).subscribe(result=>{

      //       this.handleSaveSuccess(result?.data?.addTariffDepot);
      //     });
      //   }



      // }
      // else
      // {
      //     this.pcForm?.get('name')?.setErrors({ existed: true });
      // }


    });





  }

  save() {

    if (!this.pcForm?.valid) return;

    // let cc: CleaningCategoryItem = new CleaningCategoryItem(this.selectedItem);
    // // tc.guid='';
    //  cc.name = this.pcForm.value['name'];
    //  cc.description= this.pcForm.value['description'];
    //  cc.cost = this.pcForm.value['adjusted_cost'];


    const where: any = {};
    if (this.pcForm!.value['name']) {
      where.name = { contains: this.pcForm!.value['name'] };
    }

    // this.catDS.search(where).subscribe(p=>{
    //    if(p.length==0)
    //    {
    //     if (this.selectedItem.guid) {

    //       this.catDS.updateCleaningCategory(cc).subscribe(result => {
    //         console.log(result)
    //         this.handleSaveSuccess(result?.data?.updateCleaningCategory);
    //         });

    //     }
    //     else
    //     {
    //      this.catDS.addCleaningCategory(cc).subscribe(result => {
    //       console.log(result)
    //       this.handleSaveSuccess(result?.data?.addCleaningCategory);
    //       });
    //     }

    //    }
    //    else
    //    {
    //       var allowUpdate=true;
    //       for (let i = 0; i < p.length; i++) {
    //         if (p[i].guid != this.selectedItem.guid) {
    //           allowUpdate = false;
    //           break;  // Exit the loop
    //         }
    //       }
    //       if(allowUpdate)
    //       {

    //         if (this.selectedItem.guid) {

    //           this.catDS.updateCleaningCategory(cc).subscribe(result => {
    //             console.log(result)
    //             this.handleSaveSuccess(result?.data?.updateCleaningCategory);
    //             });

    //         }
    //       }
    //       else
    //       {
    //          this.pcForm?.get('name')?.setErrors({ existed: true });
    //       }
    //    }
    // });
    // let pc_guids:string[] = this.selectedItems
    // .map(cc => cc.guid)
    // .filter((guid): guid is string => guid !== undefined);

    // var adjusted_price = Number(this.pcForm!.value["adjusted_cost"]);
    // var remarks = this.pcForm!.value["remarks"];

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

  displayLastUpdated(r: TariffDepotItem) {
    var updatedt = r.update_dt;
    if (updatedt === null) {
      updatedt = r.create_dt;
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
