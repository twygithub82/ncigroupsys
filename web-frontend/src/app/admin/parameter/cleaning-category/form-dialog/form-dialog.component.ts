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
import { CleaningCategoryDS, CleaningCategoryItem } from 'app/data-sources/cleaning-category';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';
export interface DialogData {
  action?: string;
  selectedValue?: number;
  // item: StoringOrderTankItem;
  langText?: any;
  selectedItem: CleaningCategoryItem;
  // populateData?: any;
  // index: number;
  // sotExistedList?: StoringOrderTankItem[]
}

@Component({
  selector: 'app-cleaning-category-form-dialog',
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
export class FormDialogComponent {
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


  storingOrderTank?: StoringOrderTankItem;
  sotExistedList?: StoringOrderTankItem[];
  last_cargoList?: TariffCleaningItem[];
  startDate = new Date();
  pcForm: UntypedFormGroup;
  lastCargoControl = new UntypedFormControl();
  //custCompClnCatDS :CustomerCompanyCleaningCategoryDS;
  catDS: CleaningCategoryDS;
  translatedLangText: any = {};
  langText = {
    NEW: 'COMMON-FORM.NEW',
    ADD: 'COMMON-FORM.ADD',
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
    SAVE_AND_SUBMIT: 'COMMON-FORM.SAVE',
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
    CATEGORY_NAME: "COMMON-FORM.CATEGORY-NAME",
    CATEGORY_DESCRIPTION: "COMMON-FORM.CATEGORY-DESCRIPTION",
    CATEGORY_COST: "COMMON-FORM.CARGO-COST",
    CLEANING_CATEGORY: "COMMON-FORM.CLEANING-CATEGORY",
    CATEGORY: "COMMON-FORM.CATEGORY"
  };


  selectedItem: CleaningCategoryItem;
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

    this.selectedItem = data.selectedItem;

    this.pcForm = this.createCleaningCategory();
    //this.tcDS = new TariffCleaningDS(this.apollo);
    //this.sotDS = new StoringOrderTankDS(this.apollo);
    //this.custCompClnCatDS=new CustomerCompanyCleaningCategoryDS(this.apollo);
    this.catDS = new CleaningCategoryDS(this.apollo);

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

  createCleaningCategory(): UntypedFormGroup {
    return this.fb.group({
      selectedItem: this.selectedItem,
      adjusted_cost: this.selectedItem.cost?.toFixed(2),
      name: this.selectedItem.name,
      description: this.selectedItem.description,
      remarks: ['']
    });
  }

  GetButtonCaption() {
    if (this.selectedItem.name !== undefined) {
      return this.translatedLangText.UPDATE;
    }
    else {
      return this.translatedLangText.SAVE_AND_SUBMIT;
    }
  }
  GetTitle() {
    if (this.selectedItem.name !== undefined) {
      return this.translatedLangText.UPDATE + " " + this.translatedLangText.CATEGORY;
    }
    else {
      return this.translatedLangText.NEW + " " + this.translatedLangText.CATEGORY;
    }
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }
  // tabs = Array.from(Array(20).keys());

  // @ViewChild('tabGroup')
  // tabGroup;

  // scrollTabs(event: Event) {
  //   const children = this.tabGroup._tabHeader._elementRef.nativeElement.children;
  //   const back = children[0];
  //   const forward = children[2];
  //   if (event.deltaY > 0) {
  //     forward.click();
  //   } else {
  //     back.click();
  //   }
  // }




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

      console.log('valid');
      this.dialogRef.close(count);
    }
  }

  save() {
    if (!this.pcForm?.valid) return;
    let cc: CleaningCategoryItem = new CleaningCategoryItem(this.selectedItem);
    // tc.guid='';
    cc.name = this.pcForm.value['name'];
    cc.description = this.pcForm.value['description'];
    cc.cost = Utility.convertNumber(this.pcForm.value['adjusted_cost'], 2);
    delete cc.tariff_cleanings

    const where: any = {};
    if (this.pcForm!.value['name']) {
      where.name = { eq: this.pcForm!.value['name'] };
    }

    this.catDS.search(where).subscribe(p => {
      if (p.length == 0) {
        if (this.selectedItem.guid) {
          this.catDS.updateCleaningCategory(cc).subscribe(result => {
            console.log(result)
            this.handleSaveSuccess(result?.data?.updateCleaningCategory);
          });
        } else {
          this.catDS.addCleaningCategory(cc).subscribe(result => {
            console.log(result)
            this.handleSaveSuccess(result?.data?.addCleaningCategory);
          });
        }
      } else {
        var allowUpdate = true;
        for (let i = 0; i < p.length; i++) {
          if (p[i].guid != this.selectedItem.guid) {
            allowUpdate = false;
            break;  // Exit the loop
          }
        }
        if (allowUpdate) {
          if (this.selectedItem.guid) {
            this.catDS.updateCleaningCategory(cc).subscribe(result => {
              console.log(result)
              this.handleSaveSuccess(result?.data?.updateCleaningCategory);
            });
          }
        }
        else {
          this.pcForm?.get('name')?.setErrors({ existed: true });
        }
      }
    });
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
