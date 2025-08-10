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
import { StoringOrderTankDS, StoringOrderTankGO, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { GlobalMaxCharDirective } from 'app/directive/global-max-char.directive';
import { provideNgxMask } from 'ngx-mask';


export interface DialogData {
  action?: string;
  translatedLangText?: any;
  sot?: StoringOrderTankItem;
}

@Component({
  selector: 'app-overwrite-job-no-form-dialog',
  templateUrl: './overwrite-job-no-form-dialog.component.html',
  styleUrls: ['./overwrite-job-no-form-dialog.component.scss'],
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
export class OverwriteJobNoFormDialogComponent {
  sot: StoringOrderTankItem;
  dialogTitle: string;
  overwriteForm: UntypedFormGroup;
  isPreinspBilled = false;
  isLonBilled = false;
  isLoffBilled = false;
  isGinBilled = false;
  isGoutBilled = false;
  constructor(
    public dialogRef: MatDialogRef<OverwriteJobNoFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,

  ) {
    // Set the defaults
    this.dialogTitle = data.translatedLangText?.JOB_NO;
    this.sot = data.sot!;
    this.overwriteForm = this.createForm();
  }

  createForm(): UntypedFormGroup {
    this.isPreinspBilled = !!this.sot?.billing_sot?.preinsp_billing_guid;
    this.isLonBilled = !!this.sot?.billing_sot?.lon_billing_guid;
    this.isLoffBilled = !!this.sot?.billing_sot?.loff_billing_guid;
    this.isGinBilled = !!this.sot?.billing_sot?.gin_billing_guid;
    this.isGoutBilled = !!this.sot?.billing_sot?.gout_billing_guid;

    const formGroup = this.fb.group({
      preinspect_job_no: [{ value: this.sot?.preinspect_job_no, disabled: this.isPreinspBilled }],
      liftoff_job_no: [{ value: this.sot?.liftoff_job_no, disabled: this.isLonBilled }],
      lifton_job_no: [{ value: this.sot?.lifton_job_no, disabled: this.isLoffBilled }],
      job_no: [{ value: this.sot?.job_no, disabled: this.isGinBilled }],
      release_job_no: [{ value: this.sot?.release_job_no, disabled: this.isGoutBilled }],
      job_no_remarks: [{ value: '', disabled: !this.canEdit() }],
    });
    return formGroup;
  }

  submit() {
    if (this.overwriteForm?.valid) {
      const returnDialog: any = {
        preinspect_job_no: this.overwriteForm.get('preinspect_job_no')?.value,
        liftoff_job_no: this.overwriteForm.get('liftoff_job_no')?.value,
        lifton_job_no: this.overwriteForm.get('lifton_job_no')?.value,
        job_no: this.overwriteForm.get('job_no')?.value,
        release_job_no: this.overwriteForm.get('release_job_no')?.value,
        job_no_remarks: this.overwriteForm.get('job_no_remarks')?.value
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
    return (!this.isPreinspBilled || !this.isLonBilled || !this.isLoffBilled || !this.isGinBilled || !this.isGoutBilled);
  }
}
