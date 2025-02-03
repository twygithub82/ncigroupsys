import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose, MatDialog } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
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
import { TariffRepairDS, TariffRepairItem } from 'app/data-sources/tariff-repair';
import { addDefaultSelectOption, CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { RepairPartItem } from 'app/data-sources/repair-part';
import { RPDamageRepairDS, RPDamageRepairItem } from 'app/data-sources/rp-damage-repair';
import { PackageRepairDS, PackageRepairItem } from 'app/data-sources/package-repair';
import { Direction } from '@angular/cdk/bidi';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { JobOrderItem } from 'app/data-sources/job-order';


export interface DialogData {
  action?: string;
  item?: JobOrderItem[];
  translatedLangText?: any;
  populateData?: any;
  index: number;
}

@Component({
  selector: 'app-residue-disposal-job-order-task-details-form-dialog',
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

  displayTimeTaken(stop_time: number | undefined, start_time: number | undefined): string | undefined {
    if (!stop_time || !start_time) return '';
    const timeTakenMs = stop_time - start_time;

    const hours = Math.floor(timeTakenMs / 3600);
    const minutes = Math.floor((timeTakenMs % 3600) / 60);

    return `${hours} hr ${minutes} min`;
  }
}
