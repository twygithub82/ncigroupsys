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
import { CustomerCompanyDS, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { InGateItem } from 'app/data-sources/in-gate';
import { InGateSurveyItem } from 'app/data-sources/in-gate-survey';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { SurveyDetailItem } from 'app/data-sources/survey-detail';
import { TankInfoItem } from 'app/data-sources/tank-info';
import { TransferItem } from 'app/data-sources/transfer';
import { GlobalMaxCharDirective } from 'app/directive/global-max-char.directive';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';
import { TANK_STATUS_IN_YARD, Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { provideNgxMask } from 'ngx-mask';
import { combineLatest, debounceTime, startWith, tap } from 'rxjs';


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
  selector: 'app-edit-sot-summary-form-dialog-form-dialog',
  templateUrl: './edit-sot-summary-form-dialog.component.html',
  styleUrls: ['./edit-sot-summary-form-dialog.component.scss'],
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
    GlobalMaxCharDirective
  ],
})
export class EditSotSummaryFormDialogComponent {
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
  latestTestDt = new Date();
  next_test_desc = "";

  constructor(
    public dialogRef: MatDialogRef<EditSotSummaryFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
  ) {
    // Set the defaults
    this.dialogTitle = `${data.translatedLangText?.TANK_SUMMARY_DETAILS}`;
    // this.maxDate = Utility.getLaterDate(Utility.convertDate(this.surveyDetail.survey_dt) as Date, this.maxDate);
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
    this.initialDt = Utility.convertDate(this.igs.test_dt) as Date;
    this.latestTestDt = Utility.getLaterDate(Utility.convertDate(this.initialDt) as Date, new Date());
    const formGroup = this.fb.group({
      owner_company: this.ownerCodeControl,
      customer_company: this.customerCodeControl,
      yard_cv: [{ value: this.ig?.yard_cv, disabled: !this.canEditYard() }],
      last_test_cv: this.igs?.last_test_cv,
      next_test_cv: this.igs?.next_test_cv,
      test_dt: Utility.convertDateMoment(this.igs?.test_dt),
      test_class_cv: this.igs?.test_class_cv,
      clean_status_cv: this.sot?.clean_status_cv,
      clean_status_remarks: ''
    });
    this.overwriteForm = formGroup;
    this.initializeValueChange();
    this.ownerCodeControl.setValue(this.sot?.customer_company);
    this.customerCodeControl.setValue(this.sot?.storing_order?.customer_company);
    return formGroup;
  }

  initializeValueChange() {
    this.ownerCodeControl!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (value && typeof value === 'object') {
          searchCriteria = value.code;
        } else {
          searchCriteria = value || '';
        }
        this.ccDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
          this.ownerCompanyList = data || [];
          this.updateValidators(this.ownerCodeControl, this.ownerCompanyList!);
        });
      })
    ).subscribe();

    this.customerCodeControl!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (value && typeof value === 'object') {
          searchCriteria = value.code;
        } else {
          searchCriteria = value || '';
        }
        this.ccDS.loadItems({ or: [{ name: { contains: searchCriteria } }, { code: { contains: searchCriteria } }] }, { code: 'ASC' }).subscribe(data => {
          this.customerCompanyList = data || [];
          this.updateValidators(this.customerCodeControl, this.customerCompanyList!);
        });
      })
    ).subscribe();

    combineLatest([
      this.overwriteForm.get('last_test_cv')!.valueChanges.pipe(startWith(this.overwriteForm.get('last_test_cv')!.value)),
      this.overwriteForm.get('test_dt')!.valueChanges.pipe(startWith(this.overwriteForm.get('test_dt')!.value))
    ]).subscribe(([lastTestCv, testDt]) => {
      // Handle both values here
      this.next_test_desc = this.getNextTest(lastTestCv, testDt)
    });
  }

  submit() {
    if (this.overwriteForm?.valid) {
      const igYard = this.overwriteForm.get('yard_cv')?.value;
      const testDt = this.overwriteForm.get('test_dt')?.value?.clone();
      const lastTestCv = this.overwriteForm.get('last_test_cv')?.value;
      const nextTestCv = this.overwriteForm.get('next_test_cv')?.value;
      const testClassCv = this.overwriteForm.get('test_class_cv')?.value;

      const shouldUpdate = this.latestSurveyDetailItem?.filter(x => x.status_cv === 'ACCEPTED')?.length === 0;

      const returnDialog: any = {
        tank_no: this.sot?.tank_no,
        yard_cv: igYard,
        last_test_cv: this.overwriteForm.get('last_test_cv')?.value,
        next_test_cv: this.overwriteForm.get('next_test_cv')?.value,
        test_dt: Utility.convertDate(testDt),
        test_class_cv: this.overwriteForm.get('test_class_cv')?.value,
        ti_yard_cv: !this.transferList?.length ? igYard : undefined,
        ti_last_test_cv: shouldUpdate ? lastTestCv : undefined,
        ti_test_dt: shouldUpdate ? Utility.convertDate(testDt) : undefined,
        ti_next_test_cv: shouldUpdate ? nextTestCv : undefined,
        ti_test_class_cv: shouldUpdate ? testClassCv : undefined,
        clean_status_cv: this.overwriteForm.get('clean_status_cv')?.value,
        clean_status_remarks: this.overwriteForm.get('clean_status_remarks')?.value,
      }
      this.dialogRef.close(returnDialog);
    } else {
      console.log('invalid');
      this.findInvalidControls();
    }
  }

  displayCustomerCompanyFn(cc: CustomerCompanyItem): string {
    return BusinessLogicUtil.displayName(cc);
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

  getNextTest(last_test_cv: string, test_dt?: Date): string {
    if (last_test_cv && test_dt) {
      const test_type = last_test_cv;
      const yearCount = 2.5;
      const testDt = Utility.convertDate(test_dt) as number;
      const resultDt = Utility.addYearsToEpoch(testDt, yearCount);
      const mappedVal = BusinessLogicUtil.getTestTypeMapping(test_type);
      this.overwriteForm!.get('next_test_cv')!.setValue(mappedVal);
      return this.getTestTypeDescription(mappedVal) + " - " + Utility.convertEpochToDateStr(resultDt, 'MM/YYYY');
    }
    return "";
  }

  getTestTypeDescription(codeVal: string): string | undefined {
    return BusinessLogicUtil.getCodeDescription(codeVal, this.data.populateData.testTypeCvList);
  }

  canEditYard() {
    return !this.transferList?.length && TANK_STATUS_IN_YARD.includes(this.sot?.tank_status_cv || '');
  }
}
