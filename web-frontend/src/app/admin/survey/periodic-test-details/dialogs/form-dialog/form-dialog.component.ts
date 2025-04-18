import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
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
import { Apollo } from 'apollo-angular';
import { CodeValuesDS } from 'app/data-sources/code-values';
import { CustomerCompanyDS } from 'app/data-sources/customer-company';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { SurveyDetailDS, SurveyDetailItem } from 'app/data-sources/survey-detail';
import { TankInfoDS, TankInfoItem } from 'app/data-sources/tank-info';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';

export interface DialogData {
  action?: string;
  sot: StoringOrderTankItem;
  surveyDetail: SurveyDetailItem;
  translatedLangText?: any;
  populateData?: any;
  next_test_desc?: string;
  next_test_cv?: string;
  cvDS: CodeValuesDS;
  ccDS: CustomerCompanyDS;
  surveyDS: SurveyDetailDS;
  tiDS: TankInfoDS;
  latestSurveyDetailItem?: SurveyDetailItem[];
}

@Component({
  selector: 'app-form-new-booking-dialog',
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
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  surveyForm: UntypedFormGroup;
  surveyDetail?: SurveyDetailItem;
  sot: StoringOrderTankItem;
  latestSurveyDetailItem?: SurveyDetailItem[];
  next_test_desc?: string;
  next_test_cv?: string;
  maxDate = new Date();

  cvDS: CodeValuesDS;
  ccDS: CustomerCompanyDS;
  surveyDS: SurveyDetailDS;
  tiDS: TankInfoDS;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
  ) {
    // Set the defaults
    this.cvDS = data.cvDS;
    this.ccDS = data.ccDS;
    this.surveyDS = data.surveyDS;
    this.tiDS = data.tiDS;
    this.sot = data.sot;
    this.latestSurveyDetailItem = data.latestSurveyDetailItem;
    this.surveyDetail = data.surveyDetail;
    this.action = data.action!;
    this.next_test_desc = data.next_test_desc;
    this.next_test_cv = data.next_test_cv;

    if (this.action === 'edit') {
      this.dialogTitle = data.translatedLangText.EDIT + " " + data.translatedLangText.PERIODIC_TEST_SURVEY;
      // this.startDateToday = Utility.getEarlierDate(Utility.convertDate(this.booking.booking_dt) as Date, this.startDateToday);
      this.maxDate = Utility.getLaterDate(Utility.convertDate(this.surveyDetail.survey_dt) as Date, this.maxDate);
    } else {
      this.dialogTitle = data.translatedLangText.NEW + " " + data.translatedLangText.PERIODIC_TEST_SURVEY;
    }
    this.surveyForm = this.createStorigOrderTankForm();
    this.initializeValueChange();
  }

  createStorigOrderTankForm(): UntypedFormGroup {
    const today = Utility.convertDate(new Date());
    const defaultSurveyDt = Utility.convertDateMoment(this.surveyDetail?.survey_dt) || Utility.convertDateMoment(today);
    return this.fb.group({
      survey_type_cv: 'PERIODIC_TEST',
      test_class_cv: this.surveyDetail?.test_class_cv,
      survey_dt: defaultSurveyDt,
      status_cv: [{ value: this.surveyDetail?.status_cv, disabled: this.action === 'edit' }],
      remarks: this.surveyDetail?.remarks,
      test_type_cv: [{ value: this.surveyDetail?.test_type_cv || this.data.next_test_cv, disabled: this.action === 'edit' }],
    });
  }

  submit() {
    if (this.surveyForm?.valid) {
      const surveyDt = this.surveyForm.get('survey_dt')?.value?.clone();
      const surveyDetail: any = {
        guid: this.surveyDetail?.guid,
        sot_guid: this.sot?.guid,
        survey_type_cv: 'PERIODIC_TEST',
        test_class_cv: this.surveyForm.get('test_class_cv')?.value,
        survey_dt: Utility.convertDate(surveyDt),
        status_cv: this.surveyForm.get('status_cv')?.value,
        remarks: this.surveyForm.get('remarks')?.value,
        test_type_cv: this.surveyForm.get('test_type_cv')?.value,
      };
      
      const shouldUpdate = this.shouldUpdateLastTestDt(surveyDetail, this.latestSurveyDetailItem);

      // Determine which testTypeCV to use for periodicTest
      const baseTestTypeCV = shouldUpdate.needUpdate
        ? shouldUpdate.latestItem?.test_type_cv
        : surveyDetail.test_type_cv;

      const periodicTest: any = {
        last_test_cv: baseTestTypeCV,
        next_test_cv: this.tiDS.getNextTestCv(baseTestTypeCV),
        tank_no: this.sot?.tank_no,
        test_dt: shouldUpdate?.latestItem?.survey_dt
      };

      console.log('submit surveyDetail:', surveyDetail);
      console.log('submit periodicTest:', periodicTest);
      console.log('submit shouldUpdate:', shouldUpdate);

      const isEdit = !!surveyDetail.guid;
      const saveRequest = isEdit
        ? this.surveyDS.updateSurveyDetail(surveyDetail, shouldUpdate.needUpdate ? periodicTest : undefined)
        : this.surveyDS.addSurveyDetail(surveyDetail, shouldUpdate.needUpdate ? periodicTest : undefined);

      saveRequest.subscribe(result => {
        const savedSuccess = isEdit
          ? (result?.data?.updateSurveyDetail ?? 0) > 0
          : (result?.data?.addSurveyDetail ?? 0) > 0;

        const returnDialog: any = {
          savedSuccess,
          surveyDetail,
          action: this.action
        };

        this.dialogRef.close(returnDialog);
      });
    } else {
      console.log('invalid');
      this.findInvalidControls();
    }
  }

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

  validateBookingType(value: string, booking_dt: any): void {
    // const control = this.surveyForm!.get('book_type_cv');
    // control?.setErrors(null);

    // const dateOnly = Utility.convertDate(booking_dt) as number;

    // const condition = this.action === 'edit'
    //   ? this.booking && this.booking.book_type_cv !== value
    //   : true;

    // if (
    //   condition &&
    //   this.existingBookTypeCvs!.some(
    //     booking => booking?.book_type_cv === value && (booking?.booking_dt ?? 0) >= dateOnly
    //   )
    // ) {
    //   control?.setErrors({ existed: true });
    // }
  }

  findInvalidControls() {
    const controls = this.surveyForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name);
      }
    }
  }

  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
  }

  canEdit(): boolean {
    return true;
  }

  getTankStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.data.populateData.tankStatusCvList);
  }

  getSelectedCustomerCompany(guid: string | undefined) {
    if (this.data.populateData.surveyorList) {
      return this.data.populateData.surveyorList.find((x: any) => x.guid === guid)
    }
    return undefined;
  }

  shouldUpdateLastTestDt(
    currentSurveyDetailItem: SurveyDetailItem,
    latestSurveyDetailItem?: SurveyDetailItem[]
  ): { needUpdate: boolean; latestItem: SurveyDetailItem | null } {
    if (!currentSurveyDetailItem || currentSurveyDetailItem.status_cv !== 'ACCEPTED') {
      return { needUpdate: false, latestItem: null };
    }

    // If list is empty, update is definitely needed
    if (!latestSurveyDetailItem?.length) {
      return { needUpdate: true, latestItem: currentSurveyDetailItem };
    }

    // Filter out invalid survey_dt
    const validItems = latestSurveyDetailItem.filter(
      item => typeof item.survey_dt === 'number' && isFinite(item.survey_dt)
    );

    // Check if current is already in the list
    const isCurrentLatestInList = validItems.length > 0
      ? currentSurveyDetailItem.guid === validItems.reduce((latest, item) =>
        !latest || item.survey_dt! > latest.survey_dt! ? item : latest,
        null as SurveyDetailItem | null
      )?.guid
      : false;

    // Filter out current item from comparison
    const filteredItems = validItems.filter(item => item.guid !== currentSurveyDetailItem.guid);

    // Combine current with remaining list to find latest
    const allItems = [...filteredItems, currentSurveyDetailItem];
    const latestItem = allItems.reduce((latest, item) =>
      !latest || item.survey_dt! > latest.survey_dt! ? item : latest,
      null as SurveyDetailItem | null
    );

    const needUpdate = isCurrentLatestInList
      ? true
      : latestItem?.guid === currentSurveyDetailItem.guid;

    return {
      needUpdate,
      latestItem
    };
  }
}
