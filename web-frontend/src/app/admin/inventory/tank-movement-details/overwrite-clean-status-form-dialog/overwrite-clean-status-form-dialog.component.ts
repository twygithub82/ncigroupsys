import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
import { InGateCleaningItem } from 'app/data-sources/in-gate-cleaning';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { provideNgxMask } from 'ngx-mask';
import { debounceTime, startWith, tap } from 'rxjs';


export interface DialogData {
  action?: string;
  translatedLangText?: any;
  sot?: StoringOrderTankItem;
  populateData?: any;
}

@Component({
  selector: 'app-overwrite-clean-status-form-dialog',
  templateUrl: './overwrite-clean-status-form-dialog.component.html',
  styleUrls: ['./overwrite-clean-status-form-dialog.component.scss'],
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
export class OverwriteCleanStatusFormDialogComponent {
  sot: StoringOrderTankItem;
  last_cargoList?: TariffCleaningItem[];
  dialogTitle: string;
  overwriteForm: UntypedFormGroup;
  valueChangesDisabled: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<OverwriteCleanStatusFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,

  ) {
    // Set the defaults
    this.dialogTitle = data.translatedLangText?.OVERWRITE_CONDITION;
    this.sot = data.sot!;
    this.overwriteForm = this.createForm();
  }

  createForm(): UntypedFormGroup {
    const formGroup = this.fb.group({
      clean_status_cv: this.sot?.clean_status_cv,
      clean_status_remarks: this.sot?.clean_status_remarks
    });
    return formGroup;
  }

  submit() {
    if (this.overwriteForm?.valid) {
      const returnDialog: any = {
        clean_status_cv: this.overwriteForm.get('clean_status_cv')?.value,
        clean_status_remarks: this.overwriteForm.get('clean_status_remarks')?.value
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
}
