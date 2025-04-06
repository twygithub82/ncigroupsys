import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { BookingDS, BookingItem } from 'app/data-sources/booking';
import { CodeValuesDS } from 'app/data-sources/code-values';
import { CustomerCompanyDS } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { Utility } from 'app/utilities/utility';
import { AutocompleteSelectionValidator } from 'app/utilities/validator';
import { provideNgxMask } from 'ngx-mask';
import { debounceTime, startWith, tap } from 'rxjs';

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
  existingBookTypeCvs: (BookingItem | undefined)[] | undefined = [];

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
      this.startDateToday = Utility.getEarlierDate(Utility.convertDate(this.booking.booking_dt) as Date, this.startDateToday);
    } else {
      this.dialogTitle = 'New Booking';
      this.storingOrderTank = data.item ? data.item : [new StoringOrderTankItem()];
    }
    this.existingBookTypeCvs = this.storingOrderTank.flatMap(tank =>
      (tank.booking || []).filter(booking => booking.delete_dt === null).map(booking => booking)
    );
    this.lastCargoControl = new UntypedFormControl('', [Validators.required]);
    this.bookingForm = this.createStorigOrderTankForm();
    this.initializeValueChange();
  }

  createStorigOrderTankForm(): UntypedFormGroup {
    return this.fb.group({
      reference: [this.booking?.reference],
      book_type_cv: [this.booking?.book_type_cv],
      booking_dt: [Utility.convertDate(this.booking?.booking_dt)],
      test_class_cv: [this.booking?.test_class_cv]
    });
  }

  submit() {
    if (this.bookingForm?.valid) {
      const selectedIds = this.storingOrderTank.map(item => item.guid);
      var booking: any = {
        guid: this.booking?.guid,
        sot_guid: selectedIds,
        book_type_cv: this.bookingForm.get('book_type_cv')?.value,
        booking_dt: Utility.convertDate(this.bookingForm.get('booking_dt')?.value),
        reference: this.bookingForm.get('reference')?.value,
        test_class_cv: this.bookingForm.get('test_class_cv')?.value,
        status_cv: this.booking?.status_cv
      }
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
        const booking_dt = this.bookingForm!.get('booking_dt')?.value;
        this.validateBookingType(value, booking_dt);
      })
    ).subscribe();

    this.bookingForm!.get('booking_dt')!.valueChanges.pipe(
      startWith(''),
      debounceTime(100),
      tap(booking_dt => {
        if (booking_dt) {
          const safeBookingDt = booking_dt.clone();
          const value = this.bookingForm!.get('book_type_cv')?.value;
          this.validateBookingType(value, safeBookingDt);
        }
      })
    ).subscribe();
  }

  validateBookingType(value: string, booking_dt: any): void {
    const control = this.bookingForm!.get('book_type_cv');
    control?.setErrors(null);
  
    const dateOnly = Utility.convertDate(booking_dt) as number;
  
    const condition = this.action === 'edit'
      ? this.booking && this.booking.book_type_cv !== value
      : true;
  
    if (
      condition &&
      this.existingBookTypeCvs!.some(
        booking => booking?.book_type_cv === value && (booking?.booking_dt ?? 0) >= dateOnly
      )
    ) {
      control?.setErrors({ existed: true });
    }
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

  displayDate(input: number | null | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input as number);
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
