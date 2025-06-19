import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
import { GlobalMaxCharDirective } from 'app/directive/global-max-char.directive';
import { Utility } from 'app/utilities/utility';
import * as moment from 'moment';
import { provideNgxMask } from 'ngx-mask';

export interface DialogData {
  action?: string;
  dialogTitle?: string;
  translatedLangText?: any;
  last_qc_dt?: number;
  complete_dt?: number;
  last_remarks?: string;
  qc_dt?: number;
  remarks?: string;
  messageText?: string;
}

@Component({
  selector: 'app-confirmation-remarks-form-dialog',
  templateUrl: './confirmation-remarks-form-dialog.component.html',
  styleUrls: ['./confirmation-remarks-form-dialog.component.scss'],
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
export class ConfirmationRemarksFormDialogComponent {
  action?: string;
  dialogTitle?: string;
  confirmationForm: UntypedFormGroup;
  last_qc_dt?: number;
  complete_dt?: number;
  estCompleteDt?: moment.Moment;
  last_remarks?: string;
  startDateQC = new Date();

  constructor(
    public dialogRef: MatDialogRef<ConfirmationRemarksFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,

  ) {
    // Set the defaults
    this.action = this.data.action;
    if (this.action === 'overwrite') {
      this.dialogTitle = data.dialogTitle || data.translatedLangText?.OVERWRITE_QC;
    } else {
      this.dialogTitle = data.dialogTitle || data.translatedLangText?.ROLLBACK;
    }
    this.last_qc_dt = this.data.last_qc_dt;
    this.complete_dt = this.data.complete_dt;
    const completeDt = Utility.convertDateMoment(this.complete_dt);
    this.estCompleteDt = Utility.convertDateMoment(Utility.convertDate(completeDt)) as moment.Moment;
    this.confirmationForm = this.createForm();
  }

  createForm(): UntypedFormGroup {
    const lastDt = Utility.convertDateMoment(this.last_qc_dt);
    return this.fb.group({
      qc_dt: [Utility.convertDateMoment(Utility.convertDate(lastDt))],
      remarks: [this.data.last_remarks]
    });
  }

  confirmCancel(): void {
    const qcDt = this.confirmationForm.get('qc_dt')?.value?.clone();
    if (this.confirmationForm.valid) {
      const returnDialog: DialogData = {
        action: 'confirmed',
        qc_dt: qcDt,
        remarks: this.confirmationForm.get('remarks')?.value
      }
      this.dialogRef.close(returnDialog);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  findInvalidControls() {
    const controls = this.confirmationForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name);
      }
    }
  }

  canEdit(): boolean {
    return true;
  }
}
