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
import { startWith, debounceTime, tap } from 'rxjs';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { MatTableModule } from '@angular/material/table';
import { CustomerCompanyDS } from 'app/data-sources/customer-company';
import { MatDividerModule } from '@angular/material/divider';
import { BookingDS, BookingItem } from 'app/data-sources/booking';
import { InGateDS } from 'app/data-sources/in-gate';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';


export interface DialogData {
  action?: string;
  item: StoringOrderTankItem[];
  booking: BookingItem;
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
    MatDialogClose,
    DatePipe,
    MatNativeDateModule,
    TranslateModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    CommonModule,
    NgxMaskDirective,
    MatTableModule,
    MatDividerModule,
  ],
})
export class FormDialogComponent {
  displayedColumns = [
    'tank_no',
    'customer_code',
    'eir_no',
    'eir_dt',
    'capacity',
    'tare_weight',
    'tank_status',
    'yard'
  ];
  action: string;
  dialogTitle: string;
  referenceTitle?: string;
  bookingForm: UntypedFormGroup;
  storingOrderTank: StoringOrderTankItem[];
  booking?: BookingItem;
  startDateToday = new Date();
  bookingTypeCvList?: CodeValuesItem[] = [];

  cvDS: CodeValuesDS;
  ccDS: CustomerCompanyDS;
  bkDS: BookingDS;
  igDS: InGateDS;
  lastCargoControl: UntypedFormControl;;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,

  ) {
    // Set the defaults
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.bkDS = new BookingDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.action = data.action!;
    if (this.action === 'edit') {
      this.storingOrderTank = data.item;
      this.booking = data.booking;
      this.dialogTitle = 'Edit Booking';
      this.startDateToday = Utility.convertDate(this.booking.booking_dt) as Date;
    } else {
      this.dialogTitle = 'New Booking';
      this.storingOrderTank = data.item ? data.item : [new StoringOrderTankItem()];
    }
    const existingBookTypeCvs = this.storingOrderTank.flatMap(tank =>
      (tank.booking || []).map(booking => booking.book_type_cv)
    );
    this.bookingTypeCvList = this.data.populateData.bookingTypeCvList!.filter(
      (bookingType: CodeValuesItem) => !existingBookTypeCvs.includes(bookingType?.code_val)
    );
    this.lastCargoControl = new UntypedFormControl('', [Validators.required]);
    this.bookingForm = this.createStorigOrderTankForm();
    this.initializeValueChange();
  }

  createStorigOrderTankForm(): UntypedFormGroup {
    return this.fb.group({
      reference: this.booking?.reference,
      book_type_cv: this.booking?.book_type_cv,
      booking_dt: Utility.convertDate(this.booking?.booking_dt),
      surveyor_guid: this.booking?.surveyor_guid
    });
  }

  submit() {
    if (this.bookingForm?.valid) {
      const selectedIds = this.storingOrderTank.map(item => item.guid);
      var booking: any = {
        guid: this.booking?.guid,
        sot_guid: selectedIds,
        book_type_cv: this.bookingForm.value['book_type_cv'],
        booking_dt: Utility.convertDate(this.bookingForm.value['booking_dt']),
        reference: this.bookingForm.value['reference'],
        surveyor_guid: this.bookingForm.value['surveyor_guid'] || "surveyor_guid_222",
        status_cv: this.booking?.status_cv
      }
      console.log('valid');
      console.log(booking);
      if (booking.guid) {
        this.bkDS.updateBooking([booking]).subscribe(result => {
          const returnDialog: any = {
            savedSuccess: (result?.data?.updateBooking ?? 0) > 0
          }
          this.dialogRef.close(returnDialog);
        });
      } else {
        this.bkDS.addBooking(booking).subscribe(result => {
          const returnDialog: any = {
            savedSuccess: (result?.data?.addBooking ?? 0) > 0
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
    this.bookingForm!.get('book_type_cv')!.valueChanges.pipe(
      startWith(''),
      debounceTime(100),
      tap(value => {
        if (value === 'RELEASE_ORDER') {
          this.referenceTitle = this.data.translatedLangText.JOB_NO;
        } else {
          this.referenceTitle = this.data.translatedLangText.REFERENCE;
        }
      })
    ).subscribe();
  }

  findInvalidControls() {
    const controls = this.bookingForm.controls;
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

  getYardDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.data.populateData.yardCvList);
  }

  updateValidators(validOptions: any[]) {
    this.lastCargoControl.setValidators([
      Validators.required,
      AutocompleteSelectionValidator(validOptions)
    ]);
  }
}
