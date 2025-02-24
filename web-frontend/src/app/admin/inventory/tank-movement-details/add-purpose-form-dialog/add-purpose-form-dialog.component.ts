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
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { provideNgxMask } from 'ngx-mask';


export interface DialogData {
  type?: string;
  action?: string;
  translatedLangText?: any;
  sot?: StoringOrderTankItem;
  populateData?: any;
}

@Component({
  selector: 'app-add-purpose-form-dialog',
  templateUrl: './add-purpose-form-dialog.component.html',
  styleUrls: ['./add-purpose-form-dialog.component.scss'],
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
export class AddPurposeFormDialogComponent {
  type: string = "";
  action: string;
  dialogTitle: string;
  sot: StoringOrderTankItem;
  purposeForm: UntypedFormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddPurposeFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,

  ) {
    // Set the defaults
    this.action = data.action!;
    this.sot = data.sot!;
    this.type = data.type!;
    let typeDesc = "";
    if (data.type === 'steaming') {
      typeDesc = data.translatedLangText.STEAM;
    } else if (data.type === 'cleaning') {
      typeDesc = data.translatedLangText.CLEANING;
    } else if (data.type === 'repair') {
      typeDesc = data.translatedLangText.REPAIR;
    } else if (data.type === 'storage') {
      typeDesc = data.translatedLangText.STORAGE;
    }
    const actionText = this.action === 'add' ? data.translatedLangText.ADD : data.translatedLangText.REMOVE;
    this.dialogTitle = `${actionText} ${typeDesc} Purpose`;
    this.purposeForm = this.createForm();
  }

  createForm(): UntypedFormGroup {
    const formGroup = this.fb.group({
      job_no: [this.getPreviousJobNo()],
      purpose_repair_cv: [this.sot.purpose_repair_cv],
      required_temp: [this.sot.required_temp, [Validators.max((this.sot.tariff_cleaning?.flash_point ?? 0) - 1), Validators.min(0)]],
      remarks: [this.getPreviousRemarks()]
    });
    return formGroup;
  }

  initializeValueChange() {
  }

  submit() {
    if (this.purposeForm?.valid) {
      const returnDialog: any = {
        job_no: this.purposeForm.get('job_no')?.value,
        purpose_repair_cv: this.purposeForm.get('purpose_repair_cv')?.value,
        required_temp: this.action === 'add' ? this.purposeForm.get('required_temp')?.value : null,
        remarks: this.purposeForm.get('remarks')?.value
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
    const controls = this.purposeForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name);
      }
    }
  }

  canEdit(): boolean {
    return true;
  }

  getPreviousRemarks() {
    if (this.type === 'storage') {
      return this.sot?.storage_remarks;
    } else if (this.type === 'cleaning') {
      return this.sot?.cleaning_remarks;
    } else if (this.type === 'steaming') {
      return this.sot?.steaming_remarks;
    } else if (this.type === 'repair') {
      return this.sot?.repair_remarks;
    }
    return "";
  }

  getPreviousJobNo() {
    if (this.type === 'storage') {
      return "";
    } else if (this.type === 'cleaning') {
      return this.sot?.job_no;
    } else if (this.type === 'steaming') {
      return this.sot?.job_no;
    } else if (this.type === 'repair') {
      return this.sot?.job_no;
    }
    return "";
  }

  preventDefault(event: Event) {
    event.preventDefault(); // Prevents the form submission
  }
}
