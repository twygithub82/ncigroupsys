import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { Utility } from 'app/utilities/utility';

export interface DialogData {
  action?: string;
  dialogTitle?: string;
  translatedLangText?: any;
  last_qc_dt?: number;
  last_remarks?: string;
  qc_dt?: number;
  remarks?: string;
}

@Component({
  selector: 'app-repair-estimate-new-cancel-form-dialog',
  templateUrl: './cancel-form-dialog.component.html',
  styleUrls: ['./cancel-form-dialog.component.scss'],
  providers: [],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    CommonModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDatepickerModule,
],
})
export class CancelFormDialogComponent {
  action?: string;
  dialogTitle?: string;
  cancelForm: UntypedFormGroup;
  last_qc_dt?: number;
  last_remarks?: string;
  startDateQC = new Date();

  lastCargoControl = new UntypedFormControl();
  constructor(
    public dialogRef: MatDialogRef<CancelFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = this.data.action;
    if (this.action === 'overwrite') {
      this.dialogTitle = data.translatedLangText?.OVERWRITE_QC;
    } else {
      this.dialogTitle = data.translatedLangText?.ROLLBACK;
    }
    this.last_qc_dt = this.data.last_qc_dt;
    this.cancelForm = this.createCancelForm();
  }
  createCancelForm(): UntypedFormGroup {
    return this.fb.group({
      qc_dt: [Utility.convertDate(this.last_qc_dt) as Date],
      remarks: [this.data.last_remarks, Validators.required]
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmCancel(): void {
    if (this.cancelForm.valid) {
      const returnDialog: DialogData = {
        action: 'confirmed',
        qc_dt: this.cancelForm.get('qc_dt')?.value,
        remarks: this.cancelForm.get('remarks')?.value
      }
      this.dialogRef.close(returnDialog);
    }
  }
}
