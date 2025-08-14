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
import { CustomerCompanyCleaningCategoryDS } from 'app/data-sources/customer-company-category';
import { PackageBufferDS, PackageBufferItem } from 'app/data-sources/package-buffer';
import { PackageLabourItem } from 'app/data-sources/package-labour';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { ModulePackageService } from 'app/services/module-package.service';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';

export interface DialogData {
  action?: string;
  selectedValue?: number;
  // item: StoringOrderTankItem;
  langText?: any;
  selectedItems: PackageBufferItem[];
  // populateData?: any;
  // index: number;
  // sotExistedList?: StoringOrderTankItem[]
}

@Component({
  selector: 'app-package-buffer-form-dialog',
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
    'profile',
    'fName',
    'lName',
    'customerCost',
    'tariffCost'
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
  custCompClnCatDS: CustomerCompanyCleaningCategoryDS;
  //packLabourDS : PackageLabourDS;
  packBufferDS: PackageBufferDS;

  translatedLangText: any = {};
  langText = {
    NEW: 'COMMON-FORM.NEW',
    EDIT: 'COMMON-FORM.EDIT',
    HEADER: 'COMMON-FORM.CARGO-DETAILS',
    HEADER_OTHER: 'COMMON-FORM.CARGO-OTHER-DETAILS',
    CUSTOMER: 'COMMON-FORM.CUSTOMER',
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
    PACKAGE_CLEANING_UPDATED_COST: "COMMON-FORM.PACKAGE-CLEANING-UPDATE-COST",
    EDIT_PACKAGE_CLEANING: "MENUITEMS.PACKAGE.LIST.PACKAGE-CLEANING-EDIT",
    STANDARD_COST: "COMMON-FORM.STANDARD-COST",
    PACKAGE_LABOUR: "COMMON-FORM.PACKAGE-LABOUR",
    COST: "COMMON-FORM.COST",
    PACKAGE_BUFFER: 'MENUITEMS.PACKAGE.LIST.PACKAGE-BUFFER',
    LAST_UPDATE: "COMMON-FORM.LAST-UPDATED",
    CUSTOMER_COST: "COMMON-FORM.CUSTOMER-COST",
    PROFILE_NAME: 'COMMON-FORM.PROFILE-NAME',
    TARIFF_COST: 'COMMON-FORM.TARIFF-COST',
    TYPE: 'COMMON-FORM.TYPE'
  };
  selectedItems: PackageBufferItem[] = [];
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private modulePackageService: ModulePackageService
  ) {
    // Set the defaults
    this.selectedItems = data.selectedItems;

    this.pcForm = this.createPackageLabour();
    if (this.selectedItems.length == 1) {
      this.pcForm.patchValue({
        adjusted_cost: this.selectedItems[0].cost?.toFixed(2),
        standard_cost: this.selectedItems[0].tariff_buffer?.cost?.toFixed(2),
        remarks: this.selectedItems[0].remarks
      });
    }
    this.custCompClnCatDS = new CustomerCompanyCleaningCategoryDS(this.apollo);
    this.packBufferDS = new PackageBufferDS(this.apollo);

    this.action = data.action!;
    this.translateLangText();

    if (!this.canEdit()) {
      this.pcForm.get('adjusted_cost')?.disable()
      this.pcForm.get('standard_cost')?.disable()
      this.pcForm.get('remarks')?.disable()
    }
  }

  createPackageLabour(): UntypedFormGroup {
    return this.fb.group({
      selectedItems: this.selectedItems,
      adjusted_cost: [''],
      standard_cost: ['-'],
      remarks: ['']
    });
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
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
    var adjusted_price = Number(this.pcForm!.value["adjusted_cost"]);
    var remarks = this.pcForm!.value["remarks"];

    if (this.selectedItems.length == 1) {
      var packLabour = new PackageLabourItem(this.selectedItems[0]);
      packLabour.cost = Number(this.pcForm!.value["adjusted_cost"]);
      packLabour.remarks = this.pcForm!.value["remarks"];
      packLabour.tariff_labour = undefined;
      packLabour.customer_company = undefined;
      this.packBufferDS.updatePackageBuffer(packLabour).subscribe(result => {
        if (result.data.updatePackageBuffer > 0) {

          console.log('valid');
          this.dialogRef.close(result.data.updatePackageBuffer);

        }
      });
    }
    else if (this.selectedItems.length > 1) {
      let pc_guids: string[] = this.selectedItems
        .map(cc => cc.guid)
        .filter((guid): guid is string => guid !== undefined);

      let cost = -1;
      if (this.pcForm!.value["adjusted_cost"]) cost = this.pcForm!.value["adjusted_cost"];

      let remarks = this.pcForm!.value["remarks"];
      this.packBufferDS.updatePackageBuffers(pc_guids, cost, remarks).subscribe(result => {

        if (result.data.updatePackageBuffers > 0) {

          console.log('valid');
          this.dialogRef.close(result.data.updatePackageBuffers);

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

  displayCustomerCompanyFn(code: string, name: string): string {
    return code && name ? `${code} (${name})` : '';
  }

  displayCurrency(amount: any) {
    return Utility.formatNumberDisplay(amount);
  }

  getCostLabel(): string {
    var retval = this.translatedLangText.COST;
    if (this.selectedItems.length > 1) {
      // retval = retval.replace("$","%");
    }
    return retval;
  }

  canEdit() {
    return this.isAllowEdit();
  }

  isAllowEdit() {
    return this.modulePackageService.hasFunctions(['PACKAGE_BUFFER_CLEANING_EDIT']);
  }
}
