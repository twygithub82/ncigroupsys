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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';
//import {CleaningCategoryDS,CleaningCategoryItem} from 'app/data-sources/cleaning-category';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { PackageSteamingDS, PackageSteamingItem } from 'app/data-sources/package-steam';
import { TankItem } from 'app/data-sources/tank';
import { TariffDepotItem } from 'app/data-sources/tariff-depot';
import { tempRangeValidator } from '../validators/temp-range.validator';

export interface DialogData {
  action?: string;
  selectedValue?: number;
  // item: StoringOrderTankItem;
  langText?: any;
  selectedItems: PackageSteamingItem[];
  // populateData?: any;
  // index: number;
  // sotExistedList?: StoringOrderTankItem[]
}

interface Condition {
  guid: { eq: string };
  tariff_depot_guid: { eq: null };
}


@Component({
  selector: 'app-tariff-residue-form-dialog',
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
    'gender',
    'cost',
    'labour',
    // 'actions',
  ];

  action: string;
  index?: number;
  dialogTitle?: string;


  pckSteamDS: PackageSteamingDS;

  tnkItems?: TankItem[];

  storingOrderTank?: StoringOrderTankItem;
  sotExistedList?: StoringOrderTankItem[];
  last_cargoList?: TariffCleaningItem[];
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
    ASSIGNED: 'COMMON-FORM.ASSIGNED',
    GATE_IN_COST: 'COMMON-FORM.GATE-IN-COST',
    GATE_OUT_COST: 'COMMON-FORM.GATE-OUT-COST',
    COST: 'COMMON-FORM.COST',
    LAST_UPDATED: "COMMON-FORM.LAST-UPDATED",
    BUFFER_TYPE: "COMMON-FORM.BUFFER-TYPE",
    TARIFF_RESIDUE: 'MENUITEMS.TARIFF.LIST.TARIFF-RESIDUE',
    MAX_TEMP: 'COMMON-FORM.MAX-TEMP',
    MIN_TEMP: 'COMMON-FORM.MIN-TEMP',
    QTY: 'COMMON-FORM.QTY',
    LABOUR: 'COMMON-FORM.LABOUR$',
    TEMP_RANGE_ERROR: 'COMMON-FORM.TEMP-RANGE-ERROR',
    TEMP_RANGE_OVERLAPS_ERROR: 'COMMON-FORM.TEMP-RANGE-OVERLAPS-ERROR',
    TARIFF_STEAM: 'MENUITEMS.TARIFF.LIST.TARIFF-STEAM',
  };
  unit_type_control = new UntypedFormControl();

  // selectedItem: TariffSteamingItem;
  //tcDS: TariffCleaningDS;
  //sotDS: StoringOrderTankDS;
  selectedItems: PackageSteamingItem[];
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
    this.selectedItems = data.selectedItems;
    //this.selectedItem = data.selectedItem;

    this.pckSteamDS = new PackageSteamingDS(this.apollo);

    this.pcForm = this.createPackageSteam();



    this.tnkItems = [];
    this.action = data.action!;
    this.translateLangText();
    this.InitValueChanges()
    if (this.action === "edit") this.patchPackageSteam(data.selectedItems);
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

  patchPackageSteam(rows: PackageSteamingItem[]) {

    if (rows.length == 1) {
      let row: PackageSteamingItem = rows[0]!;
      this.pcForm.patchValue({
        selectedItem: row,
        action: "edit",
        labour: row.labour?.toFixed(2),
        cost: row.cost?.toFixed(2),
        remarks: row.remarks
      });
    }
  }


  createPackageSteam(): UntypedFormGroup {
    return this.fb.group({
      selectedItem: null,
      action: "edit",
      labour: [''],
      // qty:[''],
      cost: [''],
      remarks: ['']

    },
      { validators: tempRangeValidator });
  }

  public InitValueChanges() {

    // this.pcForm.get("cost")?.valueChanges.subscribe(data=>{
    //   this.pcForm.patchValue({
    //     cost: this.pcForm.get("cost")?.value.toFixed(2)
    //   });
    // });

    // this.pcForm.get("labour")?.valueChanges.subscribe(data=>{
    //   this.pcForm.patchValue({
    //     labour: this.pcForm.get("labour")?.value.toFixed(2)
    //   });
    // });

  }

  GetButtonCaption() {
    if (this.pcForm!.value['action'] == "view") {
      return this.translatedLangText.CLOSE;
    }
    else {
      return this.translatedLangText.CANCEL;
    }
  }
  GetTitle() {

    if (this.action === "new") {
      return `${this.translatedLangText.NEW} ${this.translatedLangText.TARIFF_STEAM}`;
    }
    return `${this.translatedLangText.EDIT} ${this.translatedLangText.TARIFF_STEAM}`;
    //  return this.action==="new"?this.translatedLangText.NEW:this.translatedLangText.EDIT + " " + this.translatedLangText.TARIFF_STEAM;      

  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }


  canEdit() {
    return this.pcForm!.value['action'] == "new";
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

    if (this.selectedItems.length === 1) {
      let updateSteam = new PackageSteamingItem(this.selectedItems[0]);
      updateSteam.cost = Number(this.pcForm!.value['cost']);
      updateSteam.remarks = String(this.pcForm.value['remarks']);
      updateSteam.labour = Number(this.pcForm.value['labour']);
      this.pckSteamDS.updatePackageSteam(updateSteam).subscribe(result => {

        this.handleSaveSuccess(result?.data?.updatePackageSteam);
      });
    }
    else {
      let guids = this.selectedItems.map(d => {
        return d.guid;
      });
      let cost = Number(this.pcForm!.value['cost']);
      let remarks = String(this.pcForm.value['remarks']);
      let labour = Number(this.pcForm.value['labour']);
      if (!guids) {
        this.pckSteamDS.updatePackageSteams(guids, cost, labour, remarks).subscribe(result => {

          this.handleSaveSuccess(result?.data?.updatePackageSteam);
        });
      }
    }






  }

  update() {

    if (!this.pcForm?.valid) return;

    if (this.selectedItems.length === 1) {
      let updateSteam = new PackageSteamingItem(this.selectedItems[0]);
      updateSteam.cost = Number(this.pcForm!.value['cost']);
      updateSteam.remarks = String(this.pcForm.value['remarks']);
      updateSteam.labour = Number(this.pcForm.value['labour']);
      delete updateSteam.tariff_steaming;
      delete updateSteam.customer_company;
      this.pckSteamDS.updatePackageSteam(updateSteam).subscribe(result => {

        this.handleSaveSuccess(result?.data?.updatePackageSteaming);
      });
    }
    else {
      let guids = this.selectedItems?.map(d => d.guid).filter(guid => guid !== undefined) as string[];
      let cost = Number(this.pcForm!.value['cost']);
      let remarks = String(this.pcForm.value['remarks']);
      let labour = Number(this.pcForm.value['labour']);
      if (guids.length > 0) {
        this.pckSteamDS.updatePackageSteams(guids, cost, labour, remarks).subscribe(result => {

          this.handleSaveSuccess(result?.data?.updatePackageSteamings);
        });
      }
    }





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
