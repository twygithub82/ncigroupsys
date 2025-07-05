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
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { GlobalMaxCharDirective } from 'app/directive/global-max-char.directive';
import { Utility } from 'app/utilities/utility';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

export interface DialogData {
  action?: string;
  translatedLangText?: any;
  sot: StoringOrderTankItem;
  sotDS: StoringOrderTankDS;
}

@Component({
  selector: 'app-renumber-tank-form-dialog-form-dialog',
  templateUrl: './renumber-tank-form-dialog.component.html',
  styleUrls: ['./renumber-tank-form-dialog.component.scss'],
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
    NgxMaskDirective,
    GlobalMaxCharDirective
  ],
})
export class RenumberTankFormDialogComponent {
  action: string;
  dialogTitle: string;
  sot: StoringOrderTankItem;
  sotDS: StoringOrderTankDS;
  tankForm: UntypedFormGroup;
  isTankNoValidated = false;

  constructor(
    public dialogRef: MatDialogRef<RenumberTankFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
  ) {
    // Set the defaults
    this.action = data.action!;
    this.dialogTitle = `${data.translatedLangText?.RENUMBER}`;
    this.sot = data.sot;
    this.sotDS = data.sotDS;
    this.tankForm = this.createForm();
    this.initializeValueChange();
  }

  createForm(): UntypedFormGroup {
    const formGroup = this.fb.group({
      tank_no: this.sot?.tank_no,
    });
    return formGroup;
  }

  initializeValueChange() {
    this.tankForm?.get('tank_no')!.valueChanges.subscribe(() => {
      const value = this.tankForm?.get('tank_no')!.value
      if (value) {
        const uppercaseValue = value.toUpperCase();
        this.tankForm.get('tank_no')?.setValue(uppercaseValue, { emitEvent: false });
        const isoFormatCheck = this.sot?.tank?.iso_format;

        const isValid = Utility.verifyIsoContainerCheckDigit(uppercaseValue);
        const result = isoFormatCheck === undefined
          ? isValid
          : isoFormatCheck
            ? isValid
            : true;

        if (!result) {
          this.tankForm.get('tank_no')?.setErrors({ invalidCheckDigit: true });
        } else {
          const formattedTankNo = Utility.formatContainerNumber(uppercaseValue);
          // Handle new entry or renumber
          if (formattedTankNo !== this.sot.tank_no) {
            this.tankForm.get('tank_no')?.setErrors(null);
            this.sotDS.isTankNoAvailableToAdd(formattedTankNo).subscribe({
              next: (data) => {
                if (data.length > 0) {
                  const hasWaiting = data.some(item => item.status_cv === 'WAITING' || item.status_cv === 'ACCEPTED');
                  if (hasWaiting) {
                    this.tankForm.get('tank_no')?.setErrors({ existed: true });
                    this.isTankNoValidated = false;
                  } else {
                    // Additional logic if needed when no WAITING status is found
                    this.isTankNoValidated = true;
                  }
                } else {
                  this.isTankNoValidated = true;
                }
              },
              error: (error) => {
                this.isTankNoValidated = false;
              }
            });
          } else {
            this.tankForm.get('tank_no')?.setErrors(null);
            this.isTankNoValidated = true;
          }
        }
      }
    });
  }

  submit() {
    if (this.tankForm?.valid && this.isTankNoValidated) {
      const returnDialog: any = {
        confirmed: true,
        tank_no: Utility.formatContainerNumber(this.tankForm?.get('tank_no')?.value)
      }
      this.dialogRef.close(returnDialog);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  canEdit(): boolean {
    return true;
  }
}
