import { CommonModule, NgClass } from '@angular/common';
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
import { provideNgxMask } from 'ngx-mask';


export interface DialogData {
  action?: string;
  translatedLangText?: any;
  confirmForm?: any[];
}

@Component({
  selector: 'app-confirmation-in-gate-survey-form-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
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
    NgClass
  ],
})
export class EmptyFormConfirmationDialogComponent {
  action: string;
  dialogTitle: string;
  description?: string[];

  previousRemarks?: string;
  constructor(
    public dialogRef: MatDialogRef<EmptyFormConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    // Set the defaults
    this.action = data.action!;
    if (this.action === 'submit') {
      this.dialogTitle = data.translatedLangText?.ARE_YOU_SURE_TO_SUBMIT;
    } else {
      this.dialogTitle = data.translatedLangText?.ARE_YOU_SURE_TO_PUBLISH;
    }
    this.description = data.confirmForm;
  }

  submit() {
    const returnDialog: any = {
      confirmed: true
    }
    this.dialogRef.close(returnDialog);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  canEdit(): boolean {
    return true;
  }
}
