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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyItem } from 'app/data-sources/customer-company';
import { CustomerCompanyCleaningCategoryDS } from 'app/data-sources/customer-company-category';
import { PackageRepairDS, PackageRepairItem } from 'app/data-sources/package-repair';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TankDS, TankItem } from 'app/data-sources/tank';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';
import { firstValueFrom } from 'rxjs';
import { ModulePackageService } from 'app/services/module-package.service';


export interface DialogData {
  action?: string;
  selectedValue?: number;
  // item: StoringOrderTankItem;
  langText?: any;
  selectedItem: TankItem;
  // populateData?: any;
  // index: number;
  // sotExistedList?: StoringOrderTankItem[]
}

@Component({
  selector: 'app-unit-type-form-dialog',
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
    MatSlideToggleModule
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
    'mobile',
    // 'actions',
  ];

  action: string;
  index?: number;
  dialogTitle?: string;

  //packageDepotItems?: PackageDepotItem[]=[];
  //packageDepotDS?:PackageDepotDS;
  packRepairDS?: PackageRepairDS;
  packRepairItem?: PackageRepairItem[] = [];
  tankDS?: TankDS;
  CodeValuesDS?: CodeValuesDS;

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
    PACKAGE_MIN_COST: 'COMMON-FORM.PACKAGE-MIN-COST',
    PACKAGE_MAX_COST: 'COMMON-FORM.PACKAGE-MAX-COST',
    PACKAGE_DETAIL: 'COMMON-FORM.PACKAGE-DETAIL',
    PACKAGE_CLEANING_ADJUSTED_COST: "COMMON-FORM.PACKAGE-CLEANING-ADJUST-COST",
    CUSTOMER_COMPANY: "COMMON-FORM.CUSTOMER-COMPANY",
    ALIAS_NAME: "COMMON-FORM.ALIAS-NAME",
    AGREEMENT_DUE_DATE: "COMMON-FORM.AGREEMENT-DUE-DATE",
    BILLING_PROFILE: "COMMON-FORM.BILLING-PROFILE",
    PACKAGE_REPAIR: "MENUITEMS.PACKAGE.LIST.PACKAGE-REPAIR",
    PROFILE_NAME: 'COMMON-FORM.PROFILE-NAME',
    VIEW: 'COMMON-FORM.VIEW',
    DEPOT_PROFILE: 'COMMON-FORM.DEPOT-PROFILE',
    DESCRIPTION: 'COMMON-FORM.DESCRIPTION',
    PREINSPECTION_COST: "COMMON-FORM.PREINSPECTION-COST",
    LOLO_COST: "COMMON-FORM.LOLO-COST",
    STORAGE_COST: "COMMON-FORM.STORAGE-COST",
    FREE_STORAGE: "COMMON-FORM.FREE-STORAGE",
    LAST_UPDATED: "COMMON-FORM.LAST-UPDATED",
    GROUP_NAME: "COMMON-FORM.GROUP-NAME",
    SUB_GROUP_NAME: "COMMON-FORM.SUB-GROUP-NAME",
    PART_NAME: "COMMON-FORM.PART-NAME",
    MIN_COST: "COMMON-FORM.MIN-COST",
    MAX_COST: "COMMON-FORM.MAX-COST",
    LENGTH: "COMMON-FORM.LENGTH",
    MIN_LENGTH: "COMMON-FORM.MIN-LENGTH",
    MAX_LENGTH: "COMMON-FORM.MAX-LENGTH",
    MIN_LABOUR: "COMMON-FORM.MIN-LABOUR",
    MAX_LABOUR: "COMMON-FORM.MAX-LABOUR",
    HANDLED_ITEM: "COMMON-FORM.HANDLED-ITEM",
    LABOUR_HOUR: "COMMON-FORM.LABOUR-HOUR",
    MATERIAL_COST: "COMMON-FORM.MATERIAL-COST",
    DIMENSION: "COMMON-FORM.DIMENSION",
    STANDARD_COST: "COMMON-FORM.STANDARD-COST",
    PREINSPECT: 'COMMON-FORM.PREINSPECTION',
    LIFT_ON: 'COMMON-FORM.LIFT-ON',
    LIFT_OFF: 'COMMON-FORM.LIFT-OFF',
    GATE_IN: 'COMMON-FORM.GATE-IN',
    GATE_OUT: 'COMMON-FORM.GATE-OUT',
    ISO_FORMAT: 'COMMON-FORM.CHECK-DIGIT',
    SAVE: 'COMMON-FORM.SAVE',
    FLAT_RATE_ONLY: 'COMMON-FORM.FLAT-RATE-ONLY',
  };


  selectedItem: TankItem;
  //tcDS: TariffCleaningDS;
  //sotDS: StoringOrderTankDS;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    public modulePackageService: ModulePackageService
  ) {
    // Set the defaults
    super();
    this.selectedItem = data.selectedItem;
    this.pcForm = this.createTankItem();
    this.tankDS = new TankDS(this.apollo);
    this.packRepairDS = new PackageRepairDS(this.apollo);
    this.CodeValuesDS = new CodeValuesDS(this.apollo);
    this.custCompClnCatDS = new CustomerCompanyCleaningCategoryDS(this.apollo);
    this.action = data.action!;
    this.translateLangText();
    this.loadData();
  }

  createTankItem(): UntypedFormGroup {
    return this.fb.group({
      selectedItem: this.selectedItem,
      unit_type: [''],
      lift_on: [false],
      lift_off: [false],
      gate_in: [false],
      gate_out: [false],
      preinspect: [false],
      iso_format: [false],
      flat_rate: [false]
    });
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

    if (this.selectedItem) {
      var tnkItm = this.selectedItem;

      this.pcForm.patchValue({
        unit_type: tnkItm.unit_type,
        lift_on: tnkItm.lift_on,
        lift_off: tnkItm.lift_off,
        gate_in: tnkItm.gate_in,
        gate_out: tnkItm.gate_out,
        preinspect: tnkItm.preinspect,
        iso_format: tnkItm.iso_format,
        flat_rate:tnkItm.flat_rate
        // flat_rate: tnkItm.flat_rate,
        //storage_cal_cv:this.selectStorageCalculateCV_Description(selectedProfile.storage_cal_cv)
      });


    }




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
        ComponentUtil.showNotification('snackbar-success', successMsg, 'top', 'center', this.snackBar);

      });
    }
  }

  async save() {

    if (!this.pcForm?.valid) return;
    const dup: boolean = await this.checkDuplication();
    if (dup) {
      this.pcForm?.get("unit_type")?.setErrors({ duplicated: true });
      return;
    }

    if (this.selectedItem) {
      var tnkItm = new TankItem(this.selectedItem);
      tnkItm.unit_type = `${this.pcForm.get("unit_type")?.value}`;
      tnkItm.gate_in = this.pcForm.get("gate_in")?.value;
      tnkItm.gate_out = this.pcForm.get("gate_out")?.value;
      tnkItm.lift_on = this.pcForm.get("lift_on")?.value;
      tnkItm.lift_off = this.pcForm.get("lift_off")?.value;
      tnkItm.preinspect = this.pcForm.get("preinspect")?.value;
      tnkItm.iso_format = this.pcForm.get("iso_format")?.value;
      tnkItm.flat_rate = this.pcForm.get("flat_rate")?.value;
      this.tankDS?.updateTank(tnkItm).subscribe(result => {
        if (result.data.updateTank > 0) {

          console.log('valid');
          this.dialogRef.close(result.data.updateTank);

        }
      });
    }
    else {
      var tnkItm = new TankItem();
      tnkItm.unit_type = `${this.pcForm.get("unit_type")?.value}`;
      tnkItm.gate_in = this.pcForm.get("gate_in")?.value;
      tnkItm.gate_out = this.pcForm.get("gate_out")?.value;
      tnkItm.lift_on = this.pcForm.get("lift_on")?.value;
      tnkItm.lift_off = this.pcForm.get("lift_off")?.value;
      tnkItm.preinspect = this.pcForm.get("preinspect")?.value;
      tnkItm.iso_format = this.pcForm.get("iso_format")?.value;
      tnkItm.flat_rate = this.pcForm.get("flat_rate")?.value;
      this.tankDS?.addNewTank(tnkItm).subscribe(result => {
        if (result.data.addTank > 0) {

          console.log('valid');
          this.dialogRef.close(result.data.addTank);

        }
      });
    }




  }

  async checkDuplication(): Promise<boolean> {
    var retval: boolean = false;
    var tnkItm = new TankItem();

    if (this.selectedItem) {
      tnkItm = new TankItem(this.selectedItem);
    }
    tnkItm.unit_type = `${this.pcForm?.get("unit_type")?.value}`;
    const where: any = {};
    where.unit_type = { eq: `${tnkItm.unit_type}` }
    const data = await firstValueFrom(this.tankDS!.search_r1(where));
    if (data.length > 0) {
      if (tnkItm.guid) {
        var existItm = data[0];
        retval = tnkItm.guid != existItm.guid;
      }
      else {
        retval = true;
      }
    }
    return retval;
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

  GetAction(): string {

    var action: string = this.translatedLangText.NEW;
    if (this.action === 'update') {
      action = this.translatedLangText.UPDATE;
    }

    return action;
  }

  GetActionButton(): string {

    var action: string = this.translatedLangText.SAVE;
    if (this.action === 'update') {
      action = this.translatedLangText.UPDATE;
    }

    return action;
  }

}
