import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Apollo } from 'apollo-angular';
import { BillingSOTItem } from 'app/data-sources/billing';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyItem } from 'app/data-sources/customer-company';
import { CustomerCompanyCleaningCategoryDS } from 'app/data-sources/customer-company-category';
import { InGateDS } from 'app/data-sources/in-gate';
import { PackageRepairDS, PackageRepairItem } from 'app/data-sources/package-repair';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';

export interface DialogData {
  action?: string;
  selectedValue?: number;
  // item: StoringOrderTankItem;
  langText?: any;
  selectedItem: BillingSOTItem;
  // populateData?: any;
  // index: number;
  // sotExistedList?: StoringOrderTankItem[]
}

@Component({
  selector: 'app-lolo-billing-form-dialog',
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
export class FormDialogComponent extends UnsubscribeOnDestroyAdapter {
  displayedColumns = [
    //  'select',
    // 'img',
    'fName',
    'lName',
    //'email',
    'gender',
    // 'bDate',
    'mobile',
    // 'actions',
  ];

  action: string;
  index?: number;
  dialogTitle?: string;
  minMaterialCost: number = -20;
  maxMaterialCost: number = 20;
  //packageDepotItems?: PackageDepotItem[]=[];
  //packageDepotDS?:PackageDepotDS;
  packRepairDS?: PackageRepairDS;
  igDS: InGateDS;
  packRepairItem?: PackageRepairItem[] = [];

  CodeValuesDS?: CodeValuesDS;

  storageCalCvList: CodeValuesItem[] = [];
  invoiceTypeCvList: CodeValuesItem[] = [];

  storingOrderTank?: StoringOrderTankItem;
  sotExistedList?: StoringOrderTankItem[];
  last_cargoList?: TariffCleaningItem[];
  startDate = new Date();
  pcForm: UntypedFormGroup;
  storageCalControl = new UntypedFormControl();
  lastCargoControl = new UntypedFormControl();
  profileNameControl = new UntypedFormControl();
  custCompClnCatDS: CustomerCompanyCleaningCategoryDS;
  billingItems: any[] = [];
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
    REPAIR_COST: "COMMON-FORM.REPAIR-COST",
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
    TARIFF_COST: "COMMON-FORM.TARIFF-COST",
    CANNOT_EXCEED: "COMMON-FORM.CANNOT-EXCEED",
    CANNOT_SMALLER: "COMMON-FORM.CANNOT-SMALLER",
    SMALLER_THAN: "COMMON-FORM.SMALLER-THAN",
    CARGO_REQUIRED: 'COMMON-FORM.IS-REQUIRED'
  };


  selectedItem: BillingSOTItem;
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
    this.langText = data.langText;
    this.billingItems = this.transformList(this.selectedItem)
    this.pcForm = this.createPackageRepair();
    this.packRepairDS = new PackageRepairDS(this.apollo);
    this.CodeValuesDS = new CodeValuesDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.custCompClnCatDS = new CustomerCompanyCleaningCategoryDS(this.apollo);
    this.action = data.action!;
    this.translateLangText();
    this.loadData();

    // if(this.selectedItems.length>1)
    // {
    //   this.EnableValidator('material_cost');
    //   this.EnableValidator('labour_hour');
    // }
  }

  createPackageRepair(): UntypedFormGroup {
    return this.fb.group({
      selectedItem: this.selectedItem,
      material_cost: [],
      labour_hour: [],
      remarks: [''],

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

    const queries = [
      // { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      // { alias: 'eirStatusCv', codeValType: 'EIR_STATUS' },
      // { alias: 'tankStatusCv', codeValType: 'TANK_STATUS' },
      // { alias: 'depotCv', codeValType: 'DEPOT_STATUS' },
      { alias: 'invoiceTypeCv', codeValType: 'INVOICE_TYPE' },
    ];
    this.CodeValuesDS?.getCodeValuesByType(queries);

    this.CodeValuesDS?.connectAlias('invoiceTypeCv').subscribe(data => {
      this.invoiceTypeCvList = data;
    });
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

  EnableValidator(path: string) {
    this.pcForm.get(path)?.setValidators([
      Validators.min(this.minMaterialCost),
      Validators.max(this.maxMaterialCost),
      Validators.required  // If you have a required validator
    ]);
    this.pcForm.get(path)?.updateValueAndValidity();  // Revalidate the control
  }

  DisableValidator(path: string) {
    this.pcForm.get(path)?.clearValidators();
    this.pcForm.get(path)?.updateValueAndValidity();
  }


  canEdit() {
    return false;
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

    // if (!this.pcForm?.valid) return;

    // if (this.selectedItems.length > 1) {
    //   let pd_guids: string[] = this.selectedItems
    //     .map(cc => cc.guid)
    //     .filter((guid): guid is string => guid !== undefined);




    //    var material_cost = 1;
    //    if (this.pcForm!.value["material_cost"]) material_cost = (Number(this.pcForm!.value['material_cost']) / 100) + 1;
    //    var labour_hour = 1;
    //    if (this.pcForm!.value["labour_hour"]) labour_hour = (Number(this.pcForm!.value["labour_hour"])/100)+1;

    //   // var remarks = this.pcForm!.value["remarks"] || "";
    //   // if (pd_guids.length == 1) {
    //   //   if (!remarks) {
    //   //     remarks = "--";
    //   //   }
    //   // }
    //   this.packRepairDS?.updatePackageRepairsByPercentage(pd_guids, material_cost, labour_hour).subscribe(result => {
    //     if (result.data.updatePackageRepair_ByPercentage > 0) {

    //       console.log('valid');
    //       this.dialogRef.close(result.data.updatePackageRepair_ByPercentage);

    //     }
    //   });
    // }
    // else {
    //   var packRepairItm = new PackageRepairItem(this.selectedItems[0]);
    //   packRepairItm.tariff_repair = undefined; packRepairItm.customer_company = undefined;
    //   packRepairItm.material_cost = Number(this.pcForm!.value["material_cost"]);
    //   packRepairItm.labour_hour = Number(this.pcForm!.value["labour_hour"]);
    //   packRepairItm.remarks = this.pcForm!.value["remarks"];
    //   this.packRepairDS?.updatePackageRepair(packRepairItm).subscribe(result => {
    //     if (result.data.updatePackageRepair > 0) {

    //       console.log('valid');
    //       this.dialogRef.close(result.data.updatePackageRepair);

    //     }
    //   });
    // }



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

  getMaterialCostLabel() {
    //var lbl = this.translatedLangText.MATERIAL_COST + (this.selectedItems.length>1?'($)':'');
    var lbl = this.translatedLangText.MATERIAL_COST + ' $';
    return lbl;
  }

  getLabourHourLabel() {
    //var lbl = this.translatedLangText.LABOUR_HOUR + (this.selectedItems.length>1?'(%)':'');
    var lbl = this.translatedLangText.LABOUR_HOUR;
    return lbl;
  }

  displayDate(input: number | undefined): string | undefined {
    if (input === null) return "-";
    return Utility.convertEpochToDateStr(input);
  }


  displayNumber(value: number) {
    return Utility.formatNumberDisplay(value);
  }

  transformList(item: any): any[] {

    var transformedList: any[] = [];
    if (item.lon_billing) {
      transformedList.push({
        guid: `${item.guid}-1`,
        billing_type: "LIFT_ON",
        invoice_no: item.lon_billing?.invoice_no || '',
        invoice_dt: item.lon_billing?.invoice_dt || 0,
        cost: (item.lon_billing) ? this.displayNumber(item.lift_on_cost!) : '-'
      });
    }

    //if (item.gout_billing) 
    if (item.loff_billing) {
      transformedList.push({
        guid: `${item.guid}-2`,
        billing_type: "LIFT_OFF",
        invoice_no: item.loff_billing?.invoice_no || '',
        invoice_dt: item.loff_billing?.invoice_dt || 0,
        cost: (item.loff_billing) ? this.displayNumber(item.lift_off_cost!) : '-'
      });
    }

    return transformedList;
  }

  DisplayEirNo(row: any) {
    //if (row.billing_type == "GATE_IN") {
    return this.igDS.getInGateItem(row.storing_order_tank?.in_gate)?.eir_no
    // }
    // else {
    //   return this.ogDS.getOutGateItem(row.storing_order_tank?.out_gate)?.eir_no
    // }
  }

  DisplayEirDate(row: any) {
    //if (row.billing_type == "GATE_IN") {
    return this.displayDate(this.igDS.getInGateItem(row.storing_order_tank?.in_gate)?.eir_dt);
    // }
    // else {
    //   return this.ogDS.getOutGateItem(row.storing_order_tank?.out_gate)?.eir_dt
    // }
  }

  DisplayCost(row: any) {
    return row.cost;

  }

  DisplayTankNo(row: any) {
    return row.storing_order_tank?.tank_no || "-";

  }

  DisplayBillingType(billing_type: string) {
    return this.CodeValuesDS?.getCodeDescription(billing_type, this.invoiceTypeCvList);
  }
}
