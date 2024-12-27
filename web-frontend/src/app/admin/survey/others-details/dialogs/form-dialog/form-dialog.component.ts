import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
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
import { startWith, debounceTime, tap, combineLatest } from 'rxjs';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { MatTableModule } from '@angular/material/table';
import { CustomerCompanyDS, CustomerCompanyGO, CustomerCompanyItem } from 'app/data-sources/customer-company';
import { MatDividerModule } from '@angular/material/divider';
import { BookingDS, BookingItem } from 'app/data-sources/booking';
import { InGateDS } from 'app/data-sources/in-gate';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { SurveyDetailDS, SurveyDetailItem } from 'app/data-sources/survey-detail';


export interface DialogData {
  action?: string;
  sot: StoringOrderTankItem;
  surveyDetail: SurveyDetailItem;
  surveyDS: SurveyDetailDS;
  translatedLangText?: any;
  populateData?: any;
  index?: number;
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
  maxDate = new Date();

  cvDS: CodeValuesDS;
  ccDS: CustomerCompanyDS;
  surveyDS: SurveyDetailDS;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,

  ) {
    // Set the defaults
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.surveyDS = data.surveyDS;
    this.sot = data.sot;
    this.surveyDetail = data.surveyDetail;
    this.action = data.action!;
    if (this.action === 'edit') {
      this.dialogTitle = data.translatedLangText.EDIT_SURVEY;
      // this.startDateToday = Utility.getEarlierDate(Utility.convertDate(this.booking.booking_dt) as Date, this.startDateToday);
      this.maxDate = Utility.getLaterDate(Utility.convertDate(this.surveyDetail.survey_dt) as Date, this.maxDate);
    } else {
      this.dialogTitle = data.translatedLangText.NEW_SURVEY;
    }
    this.surveyForm = this.createStorigOrderTankForm();
    this.initializeValueChange();
  }

  createStorigOrderTankForm(): UntypedFormGroup {
    return this.fb.group({
      survey_type_cv: this.surveyDetail?.survey_type_cv,
      test_class_cv: this.surveyDetail?.test_class_cv,
      // customer_company_guid: this.getSelectedCustomerCompany(this.surveyDetail?.customer_company_guid),
      survey_dt: Utility.convertDate(this.surveyDetail?.survey_dt),
      status_cv: this.surveyDetail?.status_cv,
      remarks: this.surveyDetail?.remarks,
    });
  }

  submit() {
    if (this.surveyForm?.valid) {
      var surveyDetail: any = {
        guid: this.surveyDetail?.guid,
        sot_guid: this.sot?.guid,
        survey_type_cv: this.surveyForm.get('survey_type_cv')?.value,
        customer_company_guid: this.surveyForm.get('customer_company_guid')?.value?.guid,
        customer_company: new CustomerCompanyGO(this.surveyForm.get('customer_company_guid')?.value),
        survey_dt: Utility.convertDate(this.surveyForm.get('survey_dt')?.value),
        status_cv: this.surveyForm.get('status_cv')?.value,
        remarks: this.surveyForm.get('remarks')?.value,
      }
      console.log(surveyDetail);
      if (surveyDetail.guid) {
        this.surveyDS.updateSurveyDetail(surveyDetail).subscribe(result => {
          const returnDialog: any = {
            savedSuccess: (result?.data?.updateSurveyDetail ?? 0) > 0,
            surveyDetail: surveyDetail,
            action: this.action
          }
          this.dialogRef.close(returnDialog);
        });
      } else {
        this.surveyDS.addSurveyDetail(surveyDetail).subscribe(result => {
          const returnDialog: any = {
            savedSuccess: (result?.data?.addSurveyDetail ?? 0) > 0,
            action: this.action
          }
          this.dialogRef.close(returnDialog);
        });
      }
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

  // getSelectedCustomerCompany(guid: string | undefined) {
  //   if (this.data.populateData.surveyorList) {
  //     return this.data.populateData.surveyorList.find((x: any) => x.guid === guid)
  //   }
  //   return undefined;
  // }
}
