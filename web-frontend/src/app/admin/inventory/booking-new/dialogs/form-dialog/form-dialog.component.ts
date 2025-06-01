import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { TlxFormFieldComponent } from '@shared/components/tlx-form/tlx-form-field/tlx-form-field.component';
import { Apollo } from 'apollo-angular';
import { BookingDS, BookingItem } from 'app/data-sources/booking';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { CustomerCompanyDS } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { ModulePackageService } from 'app/services/module-package.service';
import { BusinessLogicUtil } from 'app/utilities/businesslogic-util';
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
    MatTooltipModule,
    TlxFormFieldComponent,
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
    'yard',
    'reference',
    'action'
  ];
  action: string;
  dialogTitle: string;
  referenceTitle?: string;
  bookingForm: UntypedFormGroup;
  storingOrderTank: StoringOrderTankItem[];
  booking: BookingItem = new BookingItem();
  startDateToday = new Date();
  existingBookTypeCvs: (BookingItem | undefined)[] | undefined = [];

  bookTypeCvControl = new UntypedFormControl();
  bookingTypeCvList: CodeValuesItem[] = [];

  cvDS: CodeValuesDS;
  ccDS: CustomerCompanyDS;
  bkDS: BookingDS;
  igDS: InGateDS;
  dataSource: AbstractControl[] = [];
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
    private modulePackageService: ModulePackageService
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
    this.bookingForm = this.createStorigOrderTankForm();
    this.initializeValueChange();
  }

  createStorigOrderTankForm(): UntypedFormGroup {
    const bookType = BusinessLogicUtil.findCodeValue(this.booking?.book_type_cv, this.data.populateData?.bookingTypeCvList);
    this.bookTypeCvControl.setValue(bookType);
    this.bookingForm = this.fb.group({
      reference: [''],
      book_type_cv: this.bookTypeCvControl,
      booking_dt: [Utility.convertDateMoment(this.booking?.booking_dt)],
      test_class_cv: [this.booking?.test_class_cv],
      sotList: this.fb.array(this.storingOrderTank.map(tank => this.createTankRowForm(tank)))
    });

    if (!this.canEdit()) {
      this.bookingForm.get('reference')?.disable();
      this.bookTypeCvControl?.disable();
      this.bookingForm.get('booking_dt')?.disable();
      this.bookingForm.get('test_class_cv')?.disable();
    }

    this.dataSource = [...this.sotList().controls];
    return this.bookingForm;
  }

  createTankRowForm(tank: any): UntypedFormGroup {
    return this.fb.group({
      sot: [tank],
      reference: [{ value: tank.reference || this.booking?.reference || '', disabled: !this.canEdit() }]
    });
  }

  sotList(): UntypedFormArray {
    return this.bookingForm.get('sotList') as UntypedFormArray;
  }

  submit() {
    if (this.bookingForm?.valid) {
      const bookDt = this.bookingForm.get('booking_dt')?.value?.clone();
      const selectedIds = this.sotList().controls.map((group: any) => {
        const sot = group.get('sot')?.value; // full tank object
        return {
          guid: this.booking?.guid,
          sot_guid: sot?.guid,  // safely get the guid from tank object
          book_type_cv: this.bookTypeCvControl?.value?.code_val,
          booking_dt: Utility.convertDate(bookDt),
          reference: group.get('reference')?.value,
          test_class_cv: this.bookingForm.get('test_class_cv')?.value,
          status_cv: this.booking?.status_cv
        };
      });
      const withGuid = selectedIds.filter((item: any) => item.guid);
      const withoutGuid = selectedIds.filter((item: any) => !item.guid);
      console.log(selectedIds);

      if (withGuid.length > 0) {
        this.bkDS.updateBooking(withGuid).subscribe(result => {
          const returnDialog: any = {
            savedSuccess: (result?.data?.updateBooking ?? 0) > 0
          };
          this.dialogRef.close(returnDialog);
        });
      }

      if (withoutGuid.length > 0) {
        for (const i of withoutGuid) {
          this.bkDS.addBooking(i).subscribe(result => {
            const returnDialog: any = {
              savedSuccess: (result?.data?.addBooking ?? 0) > 0
            };
            this.dialogRef.close(returnDialog);
          });
        }
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
    this.bookTypeCvControl!.valueChanges.pipe(
      startWith(''),
      debounceTime(100),
      tap(value => {
        if (value && value.code_val) {
          this.bookingTypeCvList = this.data.populateData?.bookingTypeCvList?.filter((x: any) => x.code_val === value.code_val) || [];
        } else {
          this.bookingTypeCvList = this.data.populateData?.bookingTypeCvList?.filter((x: any) => x.code_val.toUpperCase().includes(value.toUpperCase())) || [];
        }

        if (this.bookingTypeCvList.length === 1) {
          const booking_dt = this.bookingForm!.get('booking_dt')?.value;
          this.validateBookingType(value?.code_val, booking_dt);
        }
      })
    ).subscribe();

    this.bookingForm!.get('booking_dt')!.valueChanges.pipe(
      startWith(''),
      debounceTime(100),
      tap(booking_dt => {
        if (booking_dt) {
          const safeBookingDt = booking_dt.clone();
          const value = this.bookTypeCvControl?.value?.code_val;
          this.validateBookingType(value, safeBookingDt);
        }
      })
    ).subscribe();
  }

  validateBookingType(value: string, booking_dt: any): void {
    const control = this.bookTypeCvControl;
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
    return this.isAllowEdit() && this.booking.status_cv !== 'CANCELLED';
  }

  getTankStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.data.populateData.tankStatusCvList);
  }

  getYardDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.data.populateData.yardCvList);
  }

  removeSot(event: Event, index: number): void {
    event.stopPropagation();

    // Remove from the FormArray
    this.sotList().removeAt(index);
    this.dataSource = [...this.sotList().controls];
  }

  isAllowEdit() {
    return this.modulePackageService.hasFunctions(['INVENTORY_BOOKING_EDIT']);
  }

  displayCodeValueFn(cv: CodeValuesItem): string {
    return cv?.description || '';
  }
}
