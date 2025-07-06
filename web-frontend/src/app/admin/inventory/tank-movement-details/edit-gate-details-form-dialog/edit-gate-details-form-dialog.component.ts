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
import { InGateItem } from 'app/data-sources/in-gate';
import { OutGateItem } from 'app/data-sources/out-gate';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { GlobalMaxCharDirective } from 'app/directive/global-max-char.directive';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';


export interface DialogData {
  action?: string;
  translatedLangText?: any;
  sot?: StoringOrderTankItem;
  gateItem?: InGateItem | OutGateItem;
  populateData?: any;
}

@Component({
  selector: 'app-edit-gate-details-form-dialog',
  templateUrl: './edit-gate-details-form-dialog.component.html',
  styleUrls: ['./edit-gate-details-form-dialog.component.scss'],
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
export class EditGateDetailsFormDialogComponent {
  sot: StoringOrderTankItem;
  gateItem: InGateItem | OutGateItem;
  action?: string;

  dialogTitle: string;
  overwriteForm: UntypedFormGroup;
  valueChangesDisabled: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<EditGateDetailsFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,

  ) {
    // Set the defaults
    this.dialogTitle = data.action == "in" ? data.translatedLangText?.IN_GATE : data.translatedLangText?.OUT_GATE,  //data.translatedLangText?.OVERWRITE_CONDITION;
    this.action = data.action;
    this.sot = data.sot!;
    this.gateItem = data.gateItem!;
    this.overwriteForm = this.createForm();
  }

  createForm(): UntypedFormGroup {
    const formGroup = this.fb.group({
      job_no: this.action === 'in' ? this.sot?.job_no : this.sot?.release_job_no,
      haulier: this.sot?.storing_order?.haulier,
      vehicle_no: this.gateItem?.vehicle_no,
      driver_name: this.gateItem?.driver_name,
      remarks: this.gateItem?.remarks
    });
    return formGroup;
  }

  submit() {
    if (this.overwriteForm?.valid) {
      const returnDialog: any = {
        job_no: this.overwriteForm.get('job_no')?.value,
        haulier: this.overwriteForm.get('haulier')?.value?.toUpperCase(),
        vehicle_no: this.overwriteForm.get('vehicle_no')?.value?.toUpperCase(),
        driver_name: this.overwriteForm.get('driver_name')?.value?.toUpperCase(),
        remarks: this.overwriteForm.get('remarks')?.value
      }
      this.dialogRef.close(returnDialog);
    } else {
      console.log('invalid');
      this.findInvalidControls();
    }
  }

  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
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

  onAlphaOnly(event: Event, controlName: string): void {
    Utility.onAlphaOnly(event, this.overwriteForm?.get(controlName)!);
  }

  onAlphaNumericOnly(event: Event, controlName: string): void {
    Utility.onAlphaNumericOnly(event, this.overwriteForm?.get(controlName)!);
  }
}
