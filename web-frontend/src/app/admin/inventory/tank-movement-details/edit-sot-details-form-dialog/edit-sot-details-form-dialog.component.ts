import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
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
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateItem } from 'app/data-sources/in-gate';
import { InGateSurveyItem } from 'app/data-sources/in-gate-survey';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { SurveyDetailItem } from 'app/data-sources/survey-detail';
import { TankInfoItem } from 'app/data-sources/tank-info';
import { TransferItem } from 'app/data-sources/transfer';
import { ExclusiveToggleDirective } from 'app/directive/exclusive-toggle.directive';
import { NumericTextDirective } from 'app/directive/numeric-text.directive';
import { Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { provideNgxMask } from 'ngx-mask';


export interface DialogData {
  action?: string;
  translatedLangText?: any;
  sot?: StoringOrderTankItem;
  ig?: InGateItem;
  igs?: InGateSurveyItem;
  ti?: TankInfoItem;
  latestSurveyDetailItem?: SurveyDetailItem[];
  transferList?: TransferItem[];
  ccDS?: CustomerCompanyDS;
  populateData?: any;
}

@Component({
  selector: 'app-edit-sot-details-form-dialog-form-dialog',
  templateUrl: './edit-sot-details-form-dialog.component.html',
  styleUrls: ['./edit-sot-details-form-dialog.component.scss'],
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
    NumericTextDirective,
    MatButtonToggleModule,
    ExclusiveToggleDirective
  ],
})
export class EditSotDetailsFormDialogComponent {
  sot: StoringOrderTankItem;
  ig: InGateItem;
  igs: InGateSurveyItem;
  ti: TankInfoItem;
  latestSurveyDetailItem: SurveyDetailItem[];
  transferList: TransferItem[];
  ownerCompanyList?: CustomerCompanyItem[];
  customerCompanyList?: CustomerCompanyItem[];

  dialogTitle: string;
  ownerCodeControl = new UntypedFormControl();
  customerCodeControl = new UntypedFormControl();
  overwriteForm: UntypedFormGroup;
  ccDS: CustomerCompanyDS;
  valueChangesDisabled: boolean = false;
  initialDt = new Date();
  maxManuDOMDt: Date = new Date();
  next_test_desc = "";

  constructor(
    public dialogRef: MatDialogRef<EditSotDetailsFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
  ) {
    // Set the defaults
    this.dialogTitle = `${data.translatedLangText?.OVERWRITE} ${data.translatedLangText?.TANK_DETAILS}`;
    this.sot = data.sot!;
    this.ig = data.ig!;
    this.igs = data.igs!;
    this.ti = data.ti!;
    this.latestSurveyDetailItem = data.latestSurveyDetailItem!;
    this.transferList = data.transferList!;
    this.ccDS = data.ccDS!;
    this.overwriteForm = this.createForm();
  }

  createForm(): UntypedFormGroup {
    this.initialDt = Utility.convertDate(this.igs.dom_dt) as Date;
    this.maxManuDOMDt = Utility.getLaterDate(Utility.convertDate(this.igs.dom_dt) as Date, new Date());
    const a = this.patchStringToArrayValue(this.igs?.btm_dis_comp_cv);
    const formGroup = this.fb.group({
      unit_type_guid: this.sot?.unit_type_guid,
      cladding_cv: this.igs?.cladding_cv,
      tare_weight: this.igs?.tare_weight,
      btm_dis_comp_cv: [this.patchStringToArrayValue(this.igs?.btm_dis_comp_cv)],
      manufacturer_cv: this.igs?.manufacturer_cv,
      dom_dt: Utility.convertDateMoment(this.igs?.dom_dt),
      capacity: this.igs?.capacity,
      max_weight_cv: this.igs?.max_weight_cv,
      walkway_cv: this.igs?.walkway_cv
    });
    this.overwriteForm = formGroup;
    return formGroup;
  }

  initializeValueChange() {
  }

  submit() {
    if (this.overwriteForm?.valid) {
      const unit_type_guid = this.overwriteForm.get('unit_type_guid')?.value;
      const cladding_cv = this.overwriteForm.get('cladding_cv')?.value;
      const tare_weight = this.overwriteForm.get('tare_weight')?.value;
      const btm_dis_comp_cv = this.overwriteForm.get('btm_dis_comp_cv')?.value?.[0];
      const manufacturer_cv = this.overwriteForm.get('manufacturer_cv')?.value;
      const dom_dt = this.overwriteForm.get('dom_dt')?.value?.clone();
      const capacity = this.overwriteForm.get('capacity')?.value;
      const max_weight_cv = this.overwriteForm.get('max_weight_cv')?.value;
      const walkway_cv = this.overwriteForm.get('walkway_cv')?.value;
      
      const returnDialog: any = {
        unit_type_guid: unit_type_guid,
        cladding_cv: cladding_cv,
        tare_weight: Utility.convertNumber(tare_weight),
        btm_dis_comp_cv: btm_dis_comp_cv,
        manufacturer_cv: manufacturer_cv,
        dom_dt: Utility.convertDate(dom_dt),
        capacity: Utility.convertNumber(capacity),
        max_weight_cv: max_weight_cv,
        walkway_cv: walkway_cv
      }
      this.dialogRef.close(returnDialog);
    } else {
      console.log('invalid');
      this.findInvalidControls();
    }
  }

  patchStringToArrayValue(arrayVal: string | undefined) {
    return Utility.patchStringToArrayValue(arrayVal)
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

  updateValidators(control: UntypedFormControl, validOptions: any[]) {
    control.setValidators([
      Validators.required,
      AutocompleteSelectionValidator(validOptions)
    ]);
  }

  onNumericOnly(event: Event, controlName: string): void {
    Utility.onNumericOnly(event, this.overwriteForm?.get(controlName)!);
  }
}
