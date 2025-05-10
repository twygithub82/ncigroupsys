import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { TlxFormFieldComponent } from '@shared/components/tlx-form/tlx-form-field/tlx-form-field.component';
import { Apollo } from 'apollo-angular';
import { BookingItem } from 'app/data-sources/booking';
import { CodeValuesDS } from 'app/data-sources/code-values';
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
  schedulingForm?: UntypedFormGroup;
  storingOrderTank: StoringOrderTankItem[];
  startDateToday = new Date();
  scheduling_guid?: string;
  scheduling?: SchedulingItem;
  existingBookTypeCvs: (SchedulingSotItem | undefined)[] | undefined = [];
  dataSource: AbstractControl[] = [];

  cvDS: CodeValuesDS;
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
    this.cvDS = new CodeValuesDS(this.apollo);
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.schedulingDS = new SchedulingDS(this.apollo);
    this.schedulingSotDS = new SchedulingSotDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.action = data.action!;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Schedule';
      this.scheduling_guid = data.scheduling_guid;
      this.storingOrderTank = data.item;
    } else {
      this.dialogTitle = 'New Schedule';
      this.storingOrderTank = data.item ? data.item : [new StoringOrderTankItem()];
    }
    this.existingBookTypeCvs = this.storingOrderTank.flatMap(tank =>
      (tank.scheduling_sot || [])
        .filter(scheduling_sot => scheduling_sot.delete_dt === null)
        .map(scheduling_sot => scheduling_sot)
    );
    this.createForm();
  }

  createForm(): void {
    const customerCompanyGuid = this.storingOrderTank[0]?.storing_order?.customer_company_guid || '';

    // 1. Create an empty form with empty FormArray
    this.schedulingForm = this.fb.group({
      reference: [''],
      customer_company_guid: [customerCompanyGuid],
      book_type_cv: ['', Validators.required],
      scheduling_dt: [''],
      schedulingSot: this.fb.array([])  // Empty initially
    });

    // 2. Populate array for new creation
    if (!this.scheduling_guid) {
      const array = this.getSchedulingArray();
      this.storingOrderTank.forEach(tank => array.push(this.createTankGroup(tank)));
      this.dataSource = array.controls;
      return;
    }

    // 3. Handle edit mode (fetch existing scheduling)
    const where = this.schedulingDS.addDeleteDtCriteria({ guid: { eq: this.scheduling_guid } });

    this.schedulingDS.searchScheduling(where).subscribe(data => {
      if (this.schedulingDS.totalCount === 0) return;

      const scheduling = data[0];
      this.scheduling = scheduling;

      this.schedulingForm?.patchValue({
        book_type_cv: scheduling.book_type_cv,
        scheduling_dt: Utility.convertDateMoment(scheduling.scheduling_sot?.[0]?.scheduling_dt)
      });

      const array = this.getSchedulingArray();

      scheduling.scheduling_sot?.filter(item => item.delete_dt === null)
        .forEach(item => array.push(this.createScheduleTankGroup(item)));

      this.dataSource = array.controls;
      this.initializeValueChange();
    });
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
      scheduling_dt: ['', Validators.required],
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
      scheduling_dt: [Utility.convertDateMoment(schedulingSot.scheduling_dt)],
      startDate: [Utility.getEarlierDate(Utility.convertDate(schedulingSot.scheduling_dt) as Date, this.startDateToday)]
    });
  }

  getSchedulingArray(): UntypedFormArray {
    return this.schedulingForm?.get('schedulingSot') as UntypedFormArray;
  }

  submit() {
    if (this.schedulingForm?.get('book_type_cv')?.value) {
      let scheduling = new SchedulingGO(this.scheduling);
      scheduling.book_type_cv = this.schedulingForm.get('book_type_cv')?.value;

      this.getSchedulingArray().controls.forEach(ctrl => {
        console.log(ctrl.get('reference')?.value); // ✅ expect actual string
      });

      let schedulingSot: SchedulingSotItem[] = [];
      this.getSchedulingArray().controls.forEach((group: AbstractControl) => {
        const fg = group as UntypedFormGroup;

        schedulingSot.push(new SchedulingSotItem({
          guid: fg.get('guid')?.value,
          scheduling_guid: fg.get('scheduling_guid')?.value,
          sot_guid: fg.get('sot_guid')?.value,
          status_cv: fg.get('status_cv')?.value,
          reference: fg.get('reference')?.value,
          scheduling_dt: Utility.convertDate(fg.get('scheduling_dt')?.value) as number
        }));
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
    this.schedulingForm?.get('book_type_cv')!.valueChanges.pipe(
      startWith(''),
      debounceTime(100),
      tap(value => {
        const control = this.schedulingForm?.get('book_type_cv');
        const schedulingSotArray = this.getSchedulingArray().controls;

        if (!value) return;

        const currentBookType = value;
        const isEditMode = this.action === 'edit';
        const baseBookType = this.scheduling?.book_type_cv;
        const isDuplicate = (bookType: string, date?: number) =>
          this.existingBookTypeCvs!.some(s =>
            s?.scheduling?.book_type_cv === bookType &&
            (!date || (s?.scheduling_dt ?? 0) >= date)
          );

        const shouldCheck = isEditMode ? currentBookType !== baseBookType : true;
        if (!shouldCheck) return;

        let duplicateFound = false;

        schedulingSotArray.forEach(s_sotForm => {
          const ctrl = s_sotForm.get('scheduling_dt');
          const dt = ctrl?.value;
          const dateOnly = dt ? Utility.convertDate(dt) as number : null;

          // Check for duplication
          if (dateOnly && isDuplicate(currentBookType, dateOnly)) {
            ctrl?.setErrors({ ...(ctrl.errors || {}), existed: true });
            duplicateFound = true;
          }
        });

        // Optional: if you want to flag book_type_cv control too
        // if (duplicateFound) {
        //   control?.setErrors({ ...(control.errors || {}), existed: true });
        // }

        // ✳️ Clean up existed errors only (preserving required)
        schedulingSotArray.forEach(s_sotForm => {
          const ctrl = s_sotForm.get('scheduling_dt');
          if (ctrl?.errors?.['existed'] && !isDuplicate(currentBookType, Utility.convertDate(ctrl.value) as number)) {
            const { ['existed']: _, ...rest } = ctrl.errors || {};
            ctrl.setErrors(Object.keys(rest).length ? rest : null);
          }
        });

        if (control?.errors?.['existed'] && !duplicateFound) {
          const { ['existed']: _, ...rest } = control.errors || {};
          control.setErrors(Object.keys(rest).length ? rest : null);
        }
      })
    ).subscribe();

    this.getSchedulingArray().controls.forEach(
      schedulingSotForm => {
        schedulingSotForm.get('scheduling_dt')!.valueChanges
          .pipe(
            debounceTime(100),
            tap(value => {
              const control = this.schedulingForm!.get('book_type_cv');
              const ctrl = schedulingSotForm.get('scheduling_dt');
              if (!value || !control?.value) return;

              const dateOnly = Utility.convertDate(value) as number;
              const currentBookType = control.value;

              let isDuplicate = false;

              if (this.action === 'edit' && this.scheduling) {
                // Skip checking against the current record being edited
                isDuplicate = this.existingBookTypeCvs!.some(s =>
                  s?.scheduling?.book_type_cv === currentBookType &&
                  s?.scheduling?.guid !== this.scheduling!.guid &&
                  (s?.scheduling_dt ?? 0) >= dateOnly
                );
              } else {
                // Normal add mode duplicate check
                isDuplicate = this.existingBookTypeCvs!.some(
                  s => s?.scheduling?.book_type_cv === currentBookType &&
                    (s?.scheduling_dt ?? 0) >= dateOnly
                );
              }

              const errors = { ...ctrl?.errors };

              if (isDuplicate) {
                ctrl?.setErrors({ ...errors, existed: true });
              } else if (errors?.['existed']) {
                const { ['existed']: _, ...rest } = errors;
                ctrl?.setErrors(Object.keys(rest).length ? rest : null);
              }
            })
          )
          .subscribe();
      }
    )

    this.schedulingForm?.get('scheduling_dt')!.valueChanges.pipe(
      startWith(''),
      debounceTime(100),
      tap(value => {
        if (value) {
          const schedulingSotForm = this.schedulingForm?.get('schedulingSot') as UntypedFormArray
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
    const controls = this.schedulingForm?.controls;
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

  removeSot(event: Event, index: number): void {
    event.stopPropagation(); // optional: prevent ripple or row click
    const formArray = this.getSchedulingArray();
    if (formArray && formArray.length > index) {
      formArray.removeAt(index);
    }
  }

  displayDate(input: number | null | undefined): string | undefined {
    return Utility.convertEpochToDateStr(input as number);
  }

  getTankStatusDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.data.populateData.tankStatusCvList);
  }

  getYardDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.data.populateData.yardCvList);
  }
}
