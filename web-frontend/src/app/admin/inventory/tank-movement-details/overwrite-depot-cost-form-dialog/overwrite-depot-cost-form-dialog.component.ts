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
import { BOOLEAN_YES_NO, Utility } from 'app/utilities/utility';
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
  ],
})
export class OverwriteDepotCostFormDialogComponent {
  billingSot: BillingSOTItem;
  dialogTitle: string;
  overwriteForm: UntypedFormGroup;
  constructor(
    public dialogRef: MatDialogRef<OverwriteDepotCostFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,

  ) {
    // Set the defaults
    this.dialogTitle = data.translatedLangText?.OVERWRITE_JOB_NO;
    this.billingSot = data.billingSot!;
    this.overwriteForm = this.createForm();
  }

  createForm(): UntypedFormGroup {
    const formGroup = this.fb.group({
      tariff_depot_guid: [this.billingSot?.tariff_depot_guid],
      preinspection: [this.convertBooleanToYesNo(this.billingSot?.preinspection)],
      preinspection_cost: [this.billingSot?.preinspection_cost],
      lift_on: [this.convertBooleanToYesNo(this.billingSot?.lift_on)],
      lift_on_cost: [this.billingSot?.lift_on_cost],
      lift_off: [this.convertBooleanToYesNo(this.billingSot?.lift_off)],
      lift_off_cost: [this.billingSot?.lift_off_cost],
      gate_in: [this.convertBooleanToYesNo(this.billingSot?.gate_in)],
      gate_in_cost: [this.billingSot?.gate_in_cost],
      gate_out: [this.convertBooleanToYesNo(this.billingSot?.gate_out)],
      gate_out_cost: [this.billingSot?.gate_out_cost],
      storage_cal_cv: [this.billingSot?.storage_cal_cv],
      storage_cost: [this.billingSot?.storage_cost],
      free_storage: [this.billingSot?.free_storage],
      depot_cost_remarks: [this.billingSot?.depot_cost_remarks],
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
    return true;
  }

  convertBooleanToYesNo(value: any): string {
    return Utility.booleanToYesNo(value);
  }

  convertYesNoToBoolean(value: any): boolean {
    return Utility.yesNoToBoolean(value);
  }
}
