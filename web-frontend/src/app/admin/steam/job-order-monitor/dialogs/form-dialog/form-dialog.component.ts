import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS } from 'app/data-sources/code-values';
import { JobOrderItem } from 'app/data-sources/job-order';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';


export interface DialogData {
  action?: string;
  item?: JobOrderItem[];
  translatedLangText?: any;
  populateData?: any;
  index: number;
}

@Component({
  selector: 'app-steam-job-order-monitor-form-dialog',
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
  ],
})
export class FormDialogComponent extends UnsubscribeOnDestroyAdapter {
  displayedColumns = [
    'start_time',
    'stop_time',
    'duration'
  ];

  action: string;
  index: number;
  dialogTitle: string;

  partNameControl: UntypedFormControl;
  partNameList?: string[];
  partNameFilteredList?: string[];
  dimensionList?: string[];
  lengthList?: any[];
  valueChangesDisabled: boolean = false;
  timeTableList: JobOrderItem[] = [];

  cvDS: CodeValuesDS;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,

  ) {
    super();
    // Set the defaults
    this.cvDS = new CodeValuesDS(this.apollo);
    this.action = data.action!;
    this.dialogTitle = `${data.translatedLangText.TIME_HISTORY}`;
    this.timeTableList = data.item ?? [];
    this.index = data.index;
    this.partNameControl = new UntypedFormControl('', [Validators.required]);
    this.initializeValueChange();
    this.patchForm();
    this.initializePartNameValueChange();
  }

  patchForm() { }

  markFormGroupTouched(formGroup: UntypedFormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control instanceof UntypedFormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control!.markAsTouched();
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  initializeValueChange() {
  }

  initializePartNameValueChange() {
  }

  displayDateTime(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateTimeStr(input);
  }

  displayTimeTaken(stop_time: number | undefined, start_time: number | undefined): string {
    return Utility.getDisplayTimeTaken(stop_time, start_time);
  }
}
