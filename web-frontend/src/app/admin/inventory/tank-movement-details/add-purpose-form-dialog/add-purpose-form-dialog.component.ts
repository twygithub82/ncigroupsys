import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, UntypedFormArray } from '@angular/forms';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StoringOrderTank, StoringOrderTankDS, StoringOrderTankGO, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Utility } from 'app/utilities/utility';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DatePipe } from '@angular/common';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { Apollo } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { startWith, debounceTime, tap } from 'rxjs';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { MatTableModule } from '@angular/material/table';
import { CustomerCompanyDS } from 'app/data-sources/customer-company';
import { MatDividerModule } from '@angular/material/divider';
import { BookingDS, BookingItem } from 'app/data-sources/booking';
import { MatCardModule } from '@angular/material/card';
import { SchedulingDS, SchedulingGO, SchedulingItem } from 'app/data-sources/scheduling';
import { ReleaseOrderDS, ReleaseOrderItem } from 'app/data-sources/release-order';
import { InGateDS } from 'app/data-sources/in-gate';
import { SchedulingSotItem } from 'app/data-sources/scheduling-sot';
import { CodeValuesItem } from 'app/data-sources/code-values';


export interface DialogData {
  type?: string;
  action?: string;
  translatedLangText?: any;
  editInfo?: string;
  remarks?: string;
  previousRemarks?: string;
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
  action: string;
  dialogTitle: string;
  tankNoteForm: UntypedFormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddPurposeFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,

  ) {
    // Set the defaults
    this.action = data.action!;
    let type = "";
    if (data.type === 'steaming') {
      type = data.translatedLangText.STEAM;
    } else if (data.type === 'cleaning') {
      type = data.translatedLangText.CLEANING;
    } else if (data.type === 'repair') {
      type = data.translatedLangText.REPAIR;
    } else if (data.type === 'storage') {
      type = data.translatedLangText.STORAGE;
    }
    const actionText = this.action === 'add' ? data.translatedLangText.ADD : data.translatedLangText.REMOVE;
    this.dialogTitle = `${actionText} ${type} Purpose`;
    this.tankNoteForm = this.createForm();
  }

  createForm(): UntypedFormGroup {
    const formGroup = this.fb.group({
      edit_info: [this.data?.editInfo],
      remarks: [this.data?.remarks]
    });
    return formGroup;
  }

  submit() {
    if (this.tankNoteForm?.valid) {
      const returnDialog: any = {
        tank_note: this.tankNoteForm.get('tank_note')?.value,
        release_note: this.tankNoteForm.get('release_note')?.value
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
    const controls = this.tankNoteForm.controls;
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
