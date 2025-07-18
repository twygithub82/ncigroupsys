import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { InGateSurveyItem } from 'app/data-sources/in-gate-survey';
import { JobOrderItem } from 'app/data-sources/job-order';
import { StoringOrderTankDS, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';


export interface DialogData {
  action?: string;
  selectedItem?: StoringOrderTankItem;
  translatedLangText?: any;
  dialogTitle?: string;
}

@Component({
  selector: 'app-cleaning-tank-info-form-dialog',
  templateUrl: './tank-info-form-dialog.component.html',
  styleUrls: ['./tank-info-form-dialog.component.scss'],
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
    MatProgressSpinnerModule,
    MatCardModule,
  ],
})
export class TankInfoFormDialogComponent extends UnsubscribeOnDestroyAdapter {
  displayedColumns = [
    'start_time',
    'stop_time',
    'duration'
  ];

  action: string;
  // index: number;
  dialogTitle: string;

  ccDS: CustomerCompanyDS;
  igDS: InGateDS;
  sotDS: StoringOrderTankDS;
  partNameControl: UntypedFormControl;
  partNameList?: string[];
  partNameFilteredList?: string[];
  dimensionList?: string[];
  lengthList?: any[];
  valueChangesDisabled: boolean = false;
  timeTableList: JobOrderItem[] = [];
  translatedLangText: any = {}
  testTypeCvList: CodeValuesItem[] = [];
  purposeOptionCvList: CodeValuesItem[] = [];
  testClassCvList: CodeValuesItem[] = [];
  natureTypeCvList: CodeValuesItem[] = [];
  sotItem?: StoringOrderTankItem;
  cvDS: CodeValuesDS;
  constructor(
    public dialogRef: MatDialogRef<TankInfoFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,

  ) {
    super();
    // Set the defaults
    this.cvDS = new CodeValuesDS(this.apollo);
    this.action = data.action!;
    this.sotItem = data.selectedItem!;
    this.dialogTitle = `${data.dialogTitle}`;
    this.translatedLangText = data.translatedLangText;
    //this.timeTableList = data.item ?? [];
    // this.index = data.index;
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.sotDS = new StoringOrderTankDS(this.apollo);
    this.partNameControl = new UntypedFormControl('', [Validators.required]);
    this.initializeValueChange();
    this.loadData();
    this.patchForm();
    this.initializePartNameValueChange();
  }

  loadData() {
    const queries = [
      { alias: 'purposeOptionCv', codeValType: 'PURPOSE_OPTION' },
      { alias: 'testTypeCv', codeValType: 'TEST_TYPE' },
      { alias: 'testClassCv', codeValType: 'TEST_CLASS' },
      { alias: 'natureTypeCv', codeValType: 'NATURE_TYPE' },
    ];
    this.cvDS.getCodeValuesByType(queries);
    this.cvDS.connectAlias('purposeOptionCv').subscribe(data => {
      this.purposeOptionCvList = data;
    });
    this.cvDS.connectAlias('testTypeCv').subscribe(data => {
      this.testTypeCvList = data;
    });
    this.cvDS.connectAlias('testClassCv').subscribe(data => {
      this.testClassCvList = data;
    });
    this.cvDS.connectAlias('natureTypeCv').subscribe(data => {
      this.natureTypeCvList = data;
    });
    if (this.sotItem) {
      this.sotDS.getStoringOrderTanksForOtherSurveyByID(this.sotItem.guid).subscribe(result => {
        if (result.length > 0) {
          result[0].tariff_cleaning = this.sotItem?.tariff_cleaning;
          this.sotItem = result[0];
        }
      });
    }
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


  displayDate(input: number | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input);
  }

  getLastTest(igs: InGateSurveyItem | undefined): string | undefined {
    if (igs) {
      const test_type = igs.last_test_cv;
      const test_class = igs.test_class_cv;
      const testDt = igs.test_dt as number;
      return this.getTestTypeDescription(test_type) + " - " + Utility.convertEpochToDateStr(testDt, 'MM/YYYY') + " - " + this.getTestClassDescription(test_class);
    }
    return "";
  }

  getNextTest(igs: InGateSurveyItem | undefined): string | undefined {
    if (igs && igs.next_test_cv && igs.test_dt) {
      const test_type = igs.last_test_cv;
      const match = test_type?.match(/^[0-9]*\.?[0-9]+/);
      const yearCount = BusinessLogicUtil.getNextTestYear(test_type);
      const resultDt = Utility.addYearsToEpoch(igs.test_dt as number, yearCount);
      return this.getTestTypeDescription(igs.next_test_cv) + " - " + Utility.convertEpochToDateStr(resultDt, 'MM/YYYY');
    }
    return "";
  }

  getTestTypeDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.testTypeCvList);
  }

  getTestClassDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.testClassCvList);
  }

  getNatureTypeDescription(codeVal: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeVal, this.natureTypeCvList)
  }

  displayTankPurpose(sot: StoringOrderTankItem) {
    return this.sotDS.displayTankPurpose(sot, this.getPurposeOptionDescription.bind(this));
  }

  getPurposeOptionDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.purposeOptionCvList);
  }

  getNatureInGateAlert() {
    return BusinessLogicUtil.getNatureInGateAlert(this.getNatureTypeDescription(this.sotItem?.tariff_cleaning?.nature_cv), this.sotItem?.tariff_cleaning?.in_gate_alert)
  }

  getBackgroundColorFromNature() {
    return Utility.getBackgroundColorFromNature(this.sotItem?.tariff_cleaning?.nature_cv);
  }
}
