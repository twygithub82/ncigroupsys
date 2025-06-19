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
import { OutGateItem } from 'app/data-sources/out-gate';
import { ModulePackageService } from 'app/services/module-package.service';
import { provideNgxMask } from 'ngx-mask';


export interface DialogData {
  action?: string;
  translatedLangText?: any;
  remarksTitle?: string;
  previousRemarks?: string;
  out_gate: OutGateItem;
}

@Component({
  selector: 'app-form-out-gate-survey-form-dialog',
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
    MatTableModule,
    MatDividerModule,
    MatCardModule,
  ],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  remarksTitle?: string;
  remarksForm: UntypedFormGroup;
  out_gate: OutGateItem;

  previousRemarks?: string;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private modulePackageService: ModulePackageService

  ) {
    // Set the defaults
    this.action = data.action!;
    this.remarksTitle = data.remarksTitle;
    this.previousRemarks = data.previousRemarks;
    this.out_gate = data.out_gate;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Remarks';
    } else {
      this.dialogTitle = 'New Remarks';
    }
    this.remarksForm = this.createForm();
  }

  createForm(): UntypedFormGroup {
    const formGroup = this.fb.group({
      remarks: [{ value: this.previousRemarks, disabled: !this.isAllowEdit() }],
    });
    return formGroup;
  }

  submit() {
    if (this.remarksForm?.valid) {
      const returnDialog: any = {
        remarks: this.remarksForm.get('remarks')?.value
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
    const controls = this.remarksForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name);
      }
    }
  }

  canEdit() {
    return this.isAllowEdit() && (!this.out_gate?.eir_status_cv || this.out_gate?.eir_status_cv === 'PENDING' || this.out_gate?.eir_status_cv === 'YET_TO_SURVEY');
  }

  isAllowEdit() {
    return this.modulePackageService.hasFunctions(['INVENTORY_OUT_GATE_SURVEY_EDIT']);
  }
}
