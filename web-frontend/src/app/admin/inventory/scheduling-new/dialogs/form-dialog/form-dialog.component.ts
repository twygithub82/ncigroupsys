import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
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
import { Apollo } from 'apollo-angular';
import { BookingItem } from 'app/data-sources/booking';
import { CustomerCompanyDS } from 'app/data-sources/customer-company';
import { InGateDS } from 'app/data-sources/in-gate';
import { SchedulingDS, SchedulingGO, SchedulingItem } from 'app/data-sources/scheduling';
import { SchedulingSotDS, SchedulingSotItem } from 'app/data-sources/scheduling-sot';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { Utility } from 'app/utilities/utility';
import { provideNgxMask } from 'ngx-mask';
import { debounceTime, startWith, tap } from 'rxjs';


export interface DialogData {
  action?: string;
  item: StoringOrderTankItem[];
  scheduling_guid?: string;
  translatedLangText?: any;
  populateData?: any;
  index?: number;
}

@Component({
  selector: 'app-form-new-scheduling-dialog',
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
    MatCardModule,
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
  schedulingForm: UntypedFormGroup;
  storingOrderTank: StoringOrderTankItem[];
  startDateToday = new Date();
  scheduling_guid?: string;
  scheduling?: SchedulingItem;
  existingBookTypeCvs: (SchedulingSotItem | undefined)[] | undefined = [];

  ccDS: CustomerCompanyDS;
  schedulingDS: SchedulingDS;
  schedulingSotDS: SchedulingSotDS;
  igDS: InGateDS;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,

  ) {
    // Set the defaults
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.schedulingDS = new SchedulingDS(this.apollo);
    this.schedulingSotDS = new SchedulingSotDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.action = data.action!;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Scheduling';
      this.scheduling_guid = data.scheduling_guid;
      this.storingOrderTank = data.item;
    } else {
      this.dialogTitle = 'New Scheduling';
      this.storingOrderTank = data.item ? data.item : [new StoringOrderTankItem()];
    }
    this.existingBookTypeCvs = this.storingOrderTank.flatMap(tank =>
      (tank.scheduling_sot || [])
        .filter(scheduling_sot => scheduling_sot.delete_dt === null)
        .map(scheduling_sot => scheduling_sot)
    );
    this.schedulingForm = this.createForm();
    this.initializeValueChange();
  }

  createForm(): UntypedFormGroup {
    const customerCompanyGuid = this.storingOrderTank[0]?.storing_order?.customer_company_guid || '';

    const formGroup = this.fb.group({
      reference: [''],
      customer_company_guid: [customerCompanyGuid],
      book_type_cv: [''],
      scheduling_dt: [''],
      schedulingSot: this.fb.array(this.storingOrderTank.map((tank: any) => this.createTankGroup(tank)))
    });

    if (this.scheduling_guid) {
      let where: any = {
        guid: { eq: this.scheduling_guid }
      }
      where = this.schedulingDS.addDeleteDtCriteria(where);
      this.schedulingDS.searchScheduling(where)
        .subscribe(data => {
          if (this.schedulingDS.totalCount > 0) {
            const scheduling = data[0];
            this.scheduling = scheduling;
            formGroup.patchValue({
              book_type_cv: scheduling.book_type_cv,
              scheduling_dt: ''
            });

            const schedulingSotArray = formGroup.get('schedulingSot') as UntypedFormArray;
            schedulingSotArray.clear();
            scheduling.scheduling_sot!.filter(schedulingSot => schedulingSot.delete_dt === null)!.forEach((schedulingSot: any) => {
              schedulingSotArray.push(this.createScheduleTankGroup(schedulingSot));
            });
          }
        });
    }

    // Return the default form group immediately
    return formGroup;
  }

  createTankGroup(tank: any): UntypedFormGroup {
    return this.fb.group({
      sot_guid: [tank.guid],
      tank_no: [tank.tank_no],
      customer_company: [this.ccDS.displayName(tank.storing_order?.customer_company)],
      eir_no: [this.igDS.getInGateItem(tank.in_gate)?.eir_no],
      eir_dt: [this.igDS.getInGateItem(tank.in_gate)?.eir_dt],
      capacity: [this.igDS.getInGateItem(tank.in_gate)?.in_gate_survey?.capacity],
      tare_weight: [this.igDS.getInGateItem(tank.in_gate)?.in_gate_survey?.tare_weight],
      tank_status_cv: [tank.tank_status_cv],
      yard_cv: [this.igDS.getInGateItem(tank.in_gate)?.yard_cv],
      reference: [''],
      scheduling_dt: [''],
      booked: [this.checkBooking(tank.booking)],
      scheduled: [this.checkScheduling(tank.scheduling)],
    });
  }

  createScheduleTankGroup(schedulingSot: SchedulingSotItem): UntypedFormGroup {
    return this.fb.group({
      guid: [schedulingSot.guid],
      scheduling_guid: [schedulingSot.scheduling_guid],
      sot_guid: [schedulingSot.storing_order_tank?.guid],
      tank_no: [schedulingSot.storing_order_tank?.tank_no],
      status_cv: [schedulingSot.status_cv],
      customer_company: [this.ccDS.displayName(schedulingSot.storing_order_tank?.storing_order?.customer_company)],
      eir_no: [this.igDS.getInGateItem(schedulingSot.storing_order_tank?.in_gate)?.eir_no],
      eir_dt: [this.igDS.getInGateItem(schedulingSot.storing_order_tank?.in_gate)?.eir_dt],
      capacity: [this.igDS.getInGateItem(schedulingSot.storing_order_tank?.in_gate)?.in_gate_survey?.capacity],
      tare_weight: [this.igDS.getInGateItem(schedulingSot.storing_order_tank?.in_gate)?.in_gate_survey?.tare_weight],
      tank_status_cv: [schedulingSot.storing_order_tank?.tank_status_cv],
      yard_cv: [this.igDS.getInGateItem(schedulingSot.storing_order_tank?.in_gate)?.yard_cv],
      reference: [schedulingSot.reference],
      scheduling_dt: [Utility.convertDate(schedulingSot.scheduling_dt) as Date],
      startDate: [Utility.getEarlierDate(Utility.convertDate(schedulingSot.scheduling_dt) as Date, this.startDateToday)]
    });
  }

  getSchedulingArray(): UntypedFormArray {
    return this.schedulingForm.get('schedulingSot') as UntypedFormArray;
  }

  submit() {
    if (this.schedulingForm?.valid) {
      let scheduling = new SchedulingGO(this.scheduling);
      scheduling.book_type_cv = this.schedulingForm.get('book_type_cv')?.value;

      let schedulingSot: SchedulingSotItem[] = [];
      const schedulingSotForm = this.schedulingForm.value['schedulingSot']
      schedulingSotForm.forEach((s: any) => {
        schedulingSot.push(new SchedulingSotItem({
          guid: s.guid,
          scheduling_guid: s.scheduling_guid,
          sot_guid: s.sot_guid,
          status_cv: s.status_cv,
          reference: s.reference,
          scheduling_dt: Utility.convertDate(s.scheduling_dt) as number
        }))
      });

      console.log(scheduling);
      console.log(schedulingSot);
      if (scheduling.guid) {
        this.schedulingDS.updateScheduling(scheduling, schedulingSot).subscribe(result => {
          const returnDialog: any = {
            savedSuccess: (result?.data?.updateScheduling ?? 0) > 0
          }
          this.dialogRef.close(returnDialog);
        });
      } else {
        this.schedulingDS.addScheduling(scheduling, schedulingSot).subscribe(result => {
          const returnDialog: any = {
            savedSuccess: (result?.data?.addScheduling ?? 0) > 0
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
    this.schedulingForm!.get('book_type_cv')!.valueChanges.pipe(
      startWith(''),
      debounceTime(100),
      tap(value => {
        const control = this.schedulingForm!.get('book_type_cv');
        const schedulingSot = this.getSchedulingArray().controls;
        schedulingSot.forEach(s_sotForm => {
          s_sotForm!.get('scheduling_dt')?.setErrors(null);
        });
        control?.setErrors(null);
        if (value) {
          if (this.action === 'edit') {
            if (this.scheduling && this.scheduling.book_type_cv !== value && this.existingBookTypeCvs!.some(schedulingSot => schedulingSot?.scheduling?.book_type_cv === value)) {
              schedulingSot.forEach(s_sotForm => {
                s_sotForm!.get('scheduling_dt')?.setErrors(null);
                const s_sot = s_sotForm.value;
                if (s_sot.scheduling_dt) {
                  const dateOnly = Utility.convertDate(s_sot.scheduling_dt) as number;
                  if (this.existingBookTypeCvs!.some(
                    schedulingSot => schedulingSot?.scheduling?.book_type_cv === value && (schedulingSot?.scheduling_dt ?? 0) >= dateOnly
                  )) {
                    s_sotForm!.get('scheduling_dt')?.setErrors({ existed: true });
                  }
                }
              });
              // control?.setErrors({ existed: true });
            }
          } else {
            if (this.existingBookTypeCvs!.some(book_type_cv => book_type_cv?.scheduling?.book_type_cv === value)) {
              schedulingSot.forEach(s_sotForm => {
                s_sotForm!.get('scheduling_dt')?.setErrors(null);
                const s_sot = s_sotForm.value
                if (s_sot.scheduling_dt) {
                  const dateOnly = Utility.convertDate(s_sot.scheduling_dt) as number;
                  if (this.existingBookTypeCvs!.some(
                    schedulingSot => schedulingSot?.scheduling?.book_type_cv === value && (schedulingSot?.scheduling_dt ?? 0) >= dateOnly
                  )) {
                    s_sotForm!.get('scheduling_dt')?.setErrors({ existed: true });
                  }
                }
              });
              // control?.setErrors({ existed: true });
            }
          }
        }
      })
    ).subscribe();

    this.getSchedulingArray().controls.forEach(
      schedulingSotForm => {
        schedulingSotForm!.get('scheduling_dt')!.valueChanges.pipe(
          debounceTime(100),
          tap(value => {
            schedulingSotForm!.get('scheduling_dt')?.setErrors(null);
            const control = this.schedulingForm!.get('book_type_cv');
            control?.setErrors(null);
            if (value) {
              const safeSchedulingDt = value.clone();
              if (this.action === 'edit') {
                // && this.existingBookTypeCvs!.some(schedulingSot => schedulingSot?.scheduling?.book_type_cv === value)
                if (this.scheduling && this.scheduling.book_type_cv !== control?.value) {
                  const dateOnly = Utility.convertDate(safeSchedulingDt) as number;
                  if (this.existingBookTypeCvs!.some(
                    schedulingSot => schedulingSot?.scheduling?.book_type_cv === control?.value && (schedulingSot?.scheduling_dt ?? 0) >= dateOnly
                  )) {
                    schedulingSotForm!.get('scheduling_dt')?.setErrors({ existed: true });
                  }
                  // control?.setErrors({ existed: true });
                }
              } else {
                const dateOnly = Utility.convertDate(safeSchedulingDt) as number;
                if (this.existingBookTypeCvs!.some(
                  schedulingSot => schedulingSot?.scheduling?.book_type_cv === control?.value && (schedulingSot?.scheduling_dt ?? 0) >= dateOnly
                )) {
                  schedulingSotForm!.get('scheduling_dt')?.setErrors({ existed: true });
                }
                // if (this.existingBookTypeCvs!.some(book_type_cv => book_type_cv?.scheduling?.book_type_cv === control?.value)) {
                //   schedulingSot.forEach(s_sotForm => {
                //     const s_sot = s_sotForm.value
                //     if (s_sot.scheduling_dt) {
                //       debugger
                //       const dateOnly = Utility.convertDate(s_sot.scheduling_dt) as number;
                //       if (this.existingBookTypeCvs!.some(
                //         schedulingSot => schedulingSot?.scheduling?.book_type_cv === value && (schedulingSot?.scheduling_dt ?? 0) >= dateOnly
                //       )) {
                //         s_sotForm?.setErrors({ existed: true });
                //       }
                //     }
                //   });
                //   // control?.setErrors({ existed: true });
                // }
              }
            }
          })
        ).subscribe();
      }
    )

    this.schedulingForm?.get('scheduling_dt')!.valueChanges.pipe(
      startWith(''),
      debounceTime(100),
      tap(value => {
        if (value) {
          const schedulingSotForm = this.schedulingForm.get('schedulingSot') as UntypedFormArray
          schedulingSotForm.controls?.forEach((s: any) => {
            s.patchValue({
              scheduling_dt: value
            });
          });
        }
      })
    ).subscribe();
  }

  // validateBookingType(book_type_cv: string, scheduling_dt: any): void {
  //   const control = this.schedulingForm!.get('book_type_cv');
  //   control?.setErrors(null);

  //   const dateOnly = Utility.convertDate(scheduling_dt) as number;

  //   const condition = this.action === 'edit'
  //     ? this.booking && this.booking.book_type_cv !== book_type_cv
  //     : true;

  //   if (
  //     condition &&
  //     this.existingBookTypeCvs!.some(
  //       booking => booking?.book_type_cv === book_type_cv && (booking?.booking_dt ?? 0) >= dateOnly
  //     )
  //   ) {
  //     control?.setErrors({ existed: true });
  //   }
  // }

  findInvalidControls() {
    const controls = this.schedulingForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name);
      }
    }
  }

  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
  }

  checkScheduling(schedulings: SchedulingItem[] | undefined): boolean {
    if (!schedulings || !schedulings.length) return false;
    if (schedulings.some(schedule => schedule.status_cv !== "CANCELED"))
      return true;
    return false;
  }

  checkBooking(bookings: BookingItem[] | undefined): boolean {
    if (!bookings || !bookings.length) return false;
    if (bookings.some(booking => booking.book_type_cv === "RELEASE_ORDER" && booking.status_cv !== "CANCELED"))
      return true;
    return false;
  }

  getStartDate(incoming_dt?: any) {
    if (incoming_dt) {
      const cloneDate = incoming_dt.clone()
      return Utility.getEarlierDate(Utility.convertDate(cloneDate) as Date, new Date());
    }
    return new Date();
  }

  canEdit(): boolean {
    return true;
  }
}
