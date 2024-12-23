import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, UntypedFormArray, AbstractControl } from '@angular/forms';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Utility } from 'app/utilities/utility';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DatePipe } from '@angular/common';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { Apollo } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { startWith, debounceTime, tap } from 'rxjs';
import { ComponentUtil } from 'app/utilities/component-util';
import { MatDividerModule } from '@angular/material/divider';
import { RepairItem } from 'app/data-sources/repair';
import { MatCardModule } from '@angular/material/card';

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
