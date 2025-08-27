import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
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
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Apollo } from 'apollo-angular';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TankDS, TankItem } from 'app/data-sources/tank';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { TariffDepotDS, TariffDepotItem } from 'app/data-sources/tariff-depot';
import { NumericTextDirective } from 'app/directive/numeric-text.directive';
import { PreventNonNumericDirective } from 'app/directive/prevent-non-numeric.directive';
import { ModulePackageService } from 'app/services/module-package.service';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';

export interface DialogData {
  action?: string;
  selectedValue?: number;
  langText?: any;
  selectedItem: TariffDepotItem;
}

@Component({
  selector: 'app-tariff-depot-form-dialog',
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
    PreventNonNumericDirective,
    NumericTextDirective
  ],
})
export class FormDialogComponent_Edit extends UnsubscribeOnDestroyAdapter implements OnInit {
  displayedColumns = [
    'fName',
    'lName',
    'email',
  ];

  action: string;
  index?: number;
  dialogTitle?: string;

  tnkDS: TankDS;
  trfDepotDS: TariffDepotDS;

  tnkItems?: TankItem[] = [];

  storingOrderTank?: StoringOrderTankItem;
  sotExistedList?: StoringOrderTankItem[];
  last_cargoList?: TariffCleaningItem[];
  startDate = new Date();
  pcForm: UntypedFormGroup;
  lastCargoControl = new UntypedFormControl();
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
    PACKAGE_MIN_COST: 'COMMON-FORM.PACKAGE-MIN-COST',
    PACKAGE_MAX_COST: 'COMMON-FORM.PACKAGE-MAX-COST',
    PACKAGE_DETAIL: 'COMMON-FORM.PACKAGE-DETAIL',
    PACKAGE_CLEANING_ADJUSTED_COST: "COMMON-FORM.PACKAGE-CLEANING-ADJUST-COST",
    PROFILE_NAME: 'COMMON-FORM.PROFILE-NAME',
    PROFILE: 'COMMON-FORM.PROFILE',
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
  };
  unit_type_control = new UntypedFormControl();

  selectedItem: TariffDepotItem;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent_Edit>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private modulePackageService: ModulePackageService
  ) {
    // Set the defaults
    super();
    this.selectedItem = data.selectedItem;
    this.tnkDS = new TankDS(this.apollo);
    this.trfDepotDS = new TariffDepotDS(this.apollo);
    this.pcForm = this.createTariffDepot();
    this.pcForm.get('last_updated')?.setValue(this.displayLastUpdated(this.selectedItem));
    this.action = data.action!;
    this.translateLangText();

    const where: any = {};
    where.tariff_depot_guid = { or: [{ eq: null }, { eq: '' }] };
    const order: any = { unit_type: 'ASC' };
    this.subs.sink = this.tnkDS.search(where, order).subscribe(data => {
      if (this.selectedItem?.tanks) {
        data.unshift(...this.selectedItem.tanks);
      }
      this.tnkItems = data;
      this.unit_type_control.setValue(this.selectedItem.tanks);
    });
  }

  ngOnInit() {
    if (!this.canEdit()) {
      this.pcForm?.get('name')?.disable()
      this.pcForm?.get('description')?.disable()
      this.pcForm?.get('preinspection_cost')?.disable()
      this.pcForm?.get('lolo_cost')?.disable()
      this.pcForm?.get('storage_cost')?.disable()
      this.pcForm?.get('free_storage')?.disable()
      this.pcForm?.get('gate_in_cost')?.disable()
      this.pcForm?.get('gate_out_cost')?.disable()
      this.unit_type_control?.disable()
      this.pcForm?.get('last_updated')?.disable()
    }
  }

  createTariffDepot(): UntypedFormGroup {
    return this.fb.group({
      selectedItem: this.selectedItem,
      action: this.action,
      name: this.selectedItem.profile_name,
      description: this.selectedItem.description,
      preinspection_cost: this.selectedItem.preinspection_cost,
      lolo_cost: this.selectedItem.lolo_cost,
      storage_cost: this.selectedItem.storage_cost,
      free_storage: this.selectedItem.free_storage,
      gate_in_cost: this.selectedItem.gate_in_cost,
      gate_out_cost: this.selectedItem.gate_out_cost,
      unit_types: this.unit_type_control,
      last_updated: ['']
    });
  }

  GetButtonCaption() {
    return this.translatedLangText.CANCEL;
  }

  GetTitle() {
    return this.translatedLangText.EDIT + " " + this.translatedLangText.PROFILE;
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  canEdit() {
    return this.isAllowEdit() && !!this.selectedItem?.guid;
  }

  handleSaveSuccess(count: any) {
    if ((count ?? 0) > 0) {

      console.log('valid');
      this.dialogRef.close(count);
    }
  }

  update() {
    if (!this.pcForm?.valid) return;

    let where: any = {};
    if (this.pcForm!.value['name']) {
      where.profile_name = { eq: this.pcForm!.value['name'] };
    }

    this.subs.sink = this.trfDepotDS.SearchTariffDepot(where).subscribe(data => {
      let update = true;
      if (data.length > 0) {
        var queriedRec = data[0];
        if (queriedRec.guid != this.selectedItem.guid) {
          update = false;
          this.pcForm?.get('name')?.setErrors({ existed: true });
        }
      }
      if (update) {
        let conditions: any[] = [];
        let unit_types: TankItem[] = [];
        let insert = true;
        if (this.unit_type_control.value.length > 0) {
          this.unit_type_control.value.forEach((data: TankItem) => {
            let cond: any = { guid: { eq: String(data.guid) } };
            conditions.push(cond);
            let tnk: TankItem = new TankItem();
            tnk.guid = data.guid;
            unit_types.push(tnk);
          });
          let where = { or: conditions };
          this.subs.sink = this.tnkDS.search(where).subscribe(data => {
            for (const d of data) {
              if (d.tariff_depot_guid != null && d.tariff_depot_guid != this.selectedItem.guid) {
                update = false;
                break;
              }
            }
            if (update) {
              // var updatedTD = new TariffDepotItem(this.selectedItem);
              // updatedTD.profile_name = this.pcForm!.value['name'];
              // updatedTD.description = this.pcForm!.value['description'];
              // updatedTD.free_storage = Utility.convertNumber(this.pcForm!.value['free_storage']);
              // updatedTD.lolo_cost = Utility.convertNumber(this.pcForm!.value['lolo_cost'], 2);
              // updatedTD.preinspection_cost = Utility.convertNumber(this.pcForm!.value['preinspection_cost'], 2);
              // updatedTD.storage_cost = Utility.convertNumber(this.pcForm!.value['storage_cost'], 2);
              // updatedTD.gate_in_cost = Utility.convertNumber(this.pcForm!.value['gate_in_cost'], 2);
              // updatedTD.gate_out_cost = Utility.convertNumber(this.pcForm!.value['gate_out_cost'], 2);
              // updatedTD.tanks = unit_types;
              // this.trfDepotDS.updateTariffDepot(updatedTD).subscribe(result => {
              //   this.handleSaveSuccess(result?.data?.updateTariffDepot);
              // });
              this.performUpdate(unit_types);
            } else {
              this.pcForm?.get('unit_types')?.setErrors({ assigned: true });
            }
          });
        }
        else {
          // No value selected, allow null in unit_types
          unit_types = [];
          this.performUpdate(unit_types);
        }
      }
    });
  }


  performUpdate(unit_types: TankItem[]) {
    const updatedTD = new TariffDepotItem(this.selectedItem);
    updatedTD.profile_name = this.pcForm!.value['name'];
    updatedTD.description = this.pcForm!.value['description'];
    updatedTD.free_storage = Utility.convertNumber(this.pcForm!.value['free_storage']);
    updatedTD.lolo_cost = Utility.convertNumber(this.pcForm!.value['lolo_cost'], 2);
    updatedTD.preinspection_cost = Utility.convertNumber(this.pcForm!.value['preinspection_cost'], 2);
    updatedTD.storage_cost = Utility.convertNumber(this.pcForm!.value['storage_cost'], 2);
    updatedTD.gate_in_cost = Utility.convertNumber(this.pcForm!.value['gate_in_cost'], 2);
    updatedTD.gate_out_cost = Utility.convertNumber(this.pcForm!.value['gate_out_cost'], 2);
    updatedTD.tanks = unit_types;

    this.trfDepotDS.updateTariffDepot(updatedTD).subscribe(result => {
      this.handleSaveSuccess(result?.data?.updateTariffDepot);
    });
  }


  displayLastUpdated(r: TariffDepotItem) {
    return Utility.convertEpochToDateStr(r.update_dt || r.create_dt)
  }

  onAlphaNumericWithSpace(event: Event, controlName: string): void {
    Utility.onAlphaNumericWithSpace(event, this.pcForm?.get(controlName)!);
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

  isAllowEdit() {
    return this.modulePackageService.hasFunctions(['TARIFF_DEPOT_COST_EDIT']);
  }
}
