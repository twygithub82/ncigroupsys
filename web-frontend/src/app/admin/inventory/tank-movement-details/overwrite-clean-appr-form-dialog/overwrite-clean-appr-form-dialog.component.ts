import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
import { InGateCleaningItem } from 'app/data-sources/in-gate-cleaning';
import { InGateSurveyItem } from 'app/data-sources/in-gate-survey';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { GlobalMaxCharDirective } from 'app/directive/global-max-char.directive';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';
import { Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { provideNgxMask } from 'ngx-mask';

export interface DialogData {
  action?: string;
  translatedLangText?: any;
  sot?: StoringOrderTankItem;
  cleaning?: InGateCleaningItem[];
  ig?: InGateItem;
  igs?: InGateSurveyItem;
  tcDS: TariffCleaningDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  populateData: any;
}

@Component({
  selector: 'app-overwrite-clean-appr-form-dialog',
  templateUrl: './overwrite-clean-appr-form-dialog.component.html',
  styleUrls: ['./overwrite-clean-appr-form-dialog.component.scss'],
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
    MatProgressSpinnerModule,
    GlobalMaxCharDirective
  ],
})
export class OverwriteCleaningApprovalFormDialogComponent {
  displayedColumns = [
    'seq',
    'description',
    'depot_estimate',
    'customer_approval',
  ];

  sot: StoringOrderTankItem;
  cleaningItem: InGateCleaningItem;
  igItem: InGateItem;
  igsItem: InGateSurveyItem;
  last_cargoList?: TariffCleaningItem[];
  tcDS: TariffCleaningDS;
  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  dialogTitle: string;
  overwriteForm: UntypedFormGroup;
  lastCargoControl: UntypedFormControl;
  valueChangesDisabled: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<OverwriteCleaningApprovalFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
  ) {
    // Set the defaults
    this.dialogTitle = data.translatedLangText?.APPROVAL;
    this.sot = data.sot!;
    this.cleaningItem = data.cleaning![0];
    this.igItem = data.ig!;
    this.igsItem = data.igs!;
    this.tcDS = data.tcDS;
    this.ccDS = data.ccDS;
    this.igDS = data.igDS;
    this.lastCargoControl = new UntypedFormControl('', [Validators.required]);
    this.overwriteForm = this.createForm();
    this.initializeValueChange();
  }

  createForm(): UntypedFormGroup {
    const formGroup = this.fb.group({
      approve_dt: Utility.convertDate(this.cleaningItem.approve_dt),
      cleaning_cost: this.cleaningItem.cleaning_cost,
      tank_comp_guid: this.igsItem.tank_comp_guid,
      buffer_cost: this.cleaningItem.buffer_cost,
      overwrite_remarks: this.cleaningItem.overwrite_remarks
    });
    return formGroup;
  }

  initializeValueChange() {
  }

  submit() {
    if (this.overwriteForm?.valid) {
      const returnDialog: any = {
        approve_dt: Utility.convertDate(this.overwriteForm.get('approve_dt')?.value),
        cleaning_cost: this.overwriteForm.get('cleaning_cost')?.value,
        tank_comp_guid: this.overwriteForm.get('tank_comp_guid')?.value,
        buffer_cost: this.overwriteForm.get('buffer_cost')?.value,
        overwrite_remarks: this.overwriteForm.get('overwrite_remarks')?.value,
        cleaning: this.cleaningItem,
        igs: this.igsItem
      }
      this.dialogRef.close(returnDialog);
    } else {
      console.log('invalid');
      this.findInvalidControls();
    }
  }

  updateValidators(validOptions: any[]) {
    this.lastCargoControl.setValidators([
      Validators.required,
      AutocompleteSelectionValidator(validOptions)
    ]);
  }

  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
  }

  getBackgroundColorFromNature() {
    return Utility.getBackgroundColorFromNature(this.cleaningItem?.storing_order_tank?.tariff_cleaning?.nature_cv);
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

  displayDate(input: any): string | undefined {
    return Utility.convertEpochToDateStr(input);
  }

  getFooterBackgroundColor(): string {
    return '' //'light-green';
  }

  parse2Decimal(input: number | string | undefined) {
    return Utility.formatNumberDisplay(input);
  }

  getProcessStatusBadgeClass(status_cv: string | undefined) {
    return Utility.getProcessStatusBadgeClass(status_cv);
  }

  getProcessStatusDescription(codeValType: string | undefined): string | undefined {
    return BusinessLogicUtil.getCodeDescription(codeValType, this.data.populateData?.processStatusCvList);
  }
}
