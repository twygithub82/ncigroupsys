import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { BillingSOTItem } from 'app/data-sources/billing';
import { TariffDepotItem } from 'app/data-sources/tariff-depot';
import { GlobalMaxCharDirective } from 'app/directive/global-max-char.directive';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';


export interface DialogData {
  action?: string;
  translatedLangText?: any;
  billingSot?: BillingSOTItem;
  tariffDepotList?: TariffDepotItem[];
  populateData?: any;
}

@Component({
  selector: 'app-overwrite-depot-cost-form-dialog',
  templateUrl: './overwrite-depot-cost-form-dialog.component.html',
  styleUrls: ['./overwrite-depot-cost-form-dialog.component.scss'],
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
    MatTableModule,
    MatDividerModule,
    MatCardModule,
    GlobalMaxCharDirective
  ],
})
export class OverwriteDepotCostFormDialogComponent {
  billingSot: BillingSOTItem;
  dialogTitle: string;
  overwriteForm: UntypedFormGroup;
  isPreinspBilled = false;
  isLonBilled = false;
  isLoffBilled = false;
  isGinBilled = false;
  isGoutBilled = false;
  isStorageBilled = false;
  constructor(
    public dialogRef: MatDialogRef<OverwriteDepotCostFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,

  ) {
    // Set the defaults
    this.dialogTitle = data.translatedLangText?.DEPOT_COST;
    this.billingSot = data.billingSot!;
    this.overwriteForm = this.createForm();
  }

  createForm(): UntypedFormGroup {
    this.isPreinspBilled = !!this.billingSot?.preinsp_billing_guid;
    this.isLonBilled = !!this.billingSot?.lon_billing_guid;
    this.isLoffBilled = !!this.billingSot?.loff_billing_guid;
    this.isGinBilled = !!this.billingSot?.gin_billing_guid;
    this.isGoutBilled = !!this.billingSot?.gout_billing_guid;
    this.isStorageBilled = !!this.billingSot?.storage_billing?.storage_detail?.length;

    const formGroup = this.fb.group({
      tariff_depot_guid: [{ value: this.billingSot?.tariff_depot_guid, disabled: (this.isPreinspBilled || this.isLonBilled || this.isLoffBilled || this.isGinBilled || this.isGoutBilled || this.isStorageBilled) }],
      preinspection: [{ value: this.convertBooleanToYesNo(this.billingSot?.preinspection), disabled: this.isPreinspBilled }],
      preinspection_cost: [{ value: this.billingSot?.preinspection_cost, disabled: this.isPreinspBilled }],
      lift_on: [{ value: this.convertBooleanToYesNo(this.billingSot?.lift_on), disabled: this.isLonBilled }],
      lift_on_cost: [{ value: this.billingSot?.lift_on_cost, disabled: this.isLonBilled }],
      lift_off: [{ value: this.convertBooleanToYesNo(this.billingSot?.lift_off), disabled: this.isLoffBilled }],
      lift_off_cost: [{ value: this.billingSot?.lift_off_cost, disabled: this.isLoffBilled }],
      gate_in: [{ value: this.convertBooleanToYesNo(this.billingSot?.gate_in), disabled: this.isGinBilled }],
      gate_in_cost: [{ value: this.billingSot?.gate_in_cost, disabled: this.isGinBilled }],
      gate_out: [{ value: this.convertBooleanToYesNo(this.billingSot?.gate_out), disabled: this.isGoutBilled }],
      gate_out_cost: [{ value: this.billingSot?.gate_out_cost, disabled: this.isGoutBilled }],
      storage_cal_cv: [{ value: this.billingSot?.storage_cal_cv, disabled: this.isStorageBilled }],
      storage_cost: [{ value: this.billingSot?.storage_cost, disabled: this.isStorageBilled }],
      free_storage: [{ value: this.billingSot?.free_storage, disabled: this.isStorageBilled }],
      depot_cost_remarks: [{ value: '', disabled: !this.canEdit() }],
    });
    return formGroup;
  }

  submit() {
    if (this.overwriteForm?.valid) {
      const returnDialog: any = {
        tariff_depot_guid: this.overwriteForm.get('tariff_depot_guid')?.value,
        preinspection: this.convertYesNoToBoolean(this.overwriteForm.get('preinspection')?.value),
        preinspection_cost: Utility.convertNumber(this.overwriteForm.get('preinspection_cost')?.value),
        lift_on: this.convertYesNoToBoolean(this.overwriteForm.get('lift_on')?.value),
        lift_on_cost: Utility.convertNumber(this.overwriteForm.get('lift_on_cost')?.value),
        lift_off: this.convertYesNoToBoolean(this.overwriteForm.get('lift_off')?.value),
        lift_off_cost: Utility.convertNumber(this.overwriteForm.get('lift_off_cost')?.value),
        gate_in: this.convertYesNoToBoolean(this.overwriteForm.get('gate_in')?.value),
        gate_in_cost: Utility.convertNumber(this.overwriteForm.get('gate_in_cost')?.value),
        gate_out: this.convertYesNoToBoolean(this.overwriteForm.get('gate_out')?.value),
        gate_out_cost: Utility.convertNumber(this.overwriteForm.get('gate_out_cost')?.value),
        storage_cal_cv: this.overwriteForm.get('storage_cal_cv')?.value,
        storage_cost: Utility.convertNumber(this.overwriteForm.get('storage_cost')?.value),
        free_storage: Utility.convertNumber(this.overwriteForm.get('free_storage')?.value),
        depot_cost_remarks: this.overwriteForm.get('depot_cost_remarks')?.value
      }

      this.dialogRef.close(returnDialog);
    } else {
      console.log('invalid');
      this.findInvalidControls();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  findInvalidControls() {
    const controls = this.overwriteForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name);
      }
    }
  }

  canEdit(): boolean {
    return (!this.isPreinspBilled || !this.isLonBilled || !this.isLoffBilled || !this.isGinBilled || !this.isGoutBilled || !this.isStorageBilled);
  }

  convertBooleanToYesNo(value: any): string {
    return Utility.booleanToYesNo(value);
  }

  convertYesNoToBoolean(value: any): boolean {
    return Utility.yesNoToBoolean(value);
  }
}
