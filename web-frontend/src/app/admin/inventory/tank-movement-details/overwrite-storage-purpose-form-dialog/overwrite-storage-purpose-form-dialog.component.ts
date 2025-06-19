import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { CustomerCompanyDS } from 'app/data-sources/customer-company';
import { InGateDS, InGateItem } from 'app/data-sources/in-gate';
import { InGateSurveyItem } from 'app/data-sources/in-gate-survey';
import { PackageLabourItem } from 'app/data-sources/package-labour';
import { SteamItem } from 'app/data-sources/steam';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';

export interface DialogData {
  action?: string;
  translatedLangText?: any;
  sot?: StoringOrderTankItem;
  steamItem?: SteamItem;
  packageLabourItem?: PackageLabourItem;
  ig?: InGateItem;
  igs?: InGateSurveyItem;
  tcDS: TariffCleaningDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  populateData: any;
}

@Component({
  selector: 'app-overwrite-storage-purpose-form-dialog',
  templateUrl: './overwrite-storage-purpose-form-dialog.component.html',
  styleUrls: ['./overwrite-storage-purpose-form-dialog.component.scss'],
  providers: [provideNgxMask()],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
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
    MatProgressSpinnerModule
  ],
})
export class OverwriteStorageFormDialogComponent {
  displayedColumns = [
    'seq',
    'desc',
    'qty',
    'unit_price',
    'hour',
    'cost',
    'approve_part'
  ];

  sot: StoringOrderTankItem;
  tcDS: TariffCleaningDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  dialogTitle: string;
  overwriteForm: UntypedFormGroup;
  valueChangesDisabled: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<OverwriteStorageFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
  ) {
    // Set the defaults
    this.dialogTitle = `${data.translatedLangText?.OVERWRITE} ${data.translatedLangText?.STORAGE}`;
    this.sot = data.sot!;
    this.tcDS = data.tcDS;
    this.ccDS = data.ccDS;
    this.igDS = data.igDS;
    this.overwriteForm = this.createForm();
    this.initializeValueChange();
  }

  createForm(): UntypedFormGroup {
    const formGroup = this.fb.group({
      storage_cal_cv: [{ value: this.sot?.billing_sot?.storage_cal_cv, disabled: !this.canEdit() }],
      // overwrite_remarks: [{ value: this.sot?.billing_sot?.re, disabled: !this.canEdit() }]
    });
    return formGroup;
  }

  initializeValueChange() {
  }

  submit() {
    if (this.overwriteForm?.valid) {
      const returnDialog: any = {
        storage_cal_cv: this.overwriteForm.get('storage_cal_cv')?.value?.guid,
        overwrite_remarks: this.overwriteForm.get('overwrite_remarks')?.value,
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
    // return !this.steamItem?.customer_billing_guid;
    return true;
  }

  displayDate(input: any): string | undefined {
    return Utility.convertEpochToDateStr(input);
  }

  preventDefault(event: Event) {
    event.preventDefault(); // Prevents the form submission
  }
}
