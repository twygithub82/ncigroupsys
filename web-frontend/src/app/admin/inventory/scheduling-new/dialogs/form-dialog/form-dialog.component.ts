import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, UntypedFormArray } from '@angular/forms';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StoringOrderTank, StoringOrderTankDS, StoringOrderTankGO, StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
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
import { MatCardModule } from '@angular/material/card';
import { SchedulingDS, SchedulingGO, SchedulingItem } from 'app/data-sources/scheduling';
import { ReleaseOrderDS, ReleaseOrderItem } from 'app/data-sources/release-order';
import { InGateDS } from 'app/data-sources/in-gate';
import { SchedulingSotItem } from 'app/data-sources/scheduling-sot';
import { CodeValuesItem } from 'app/data-sources/code-values';


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
  existingBookTypeCvs: (string | undefined)[] | undefined = [];

  ccDS: CustomerCompanyDS;
  schedulingDS: SchedulingDS;
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
        .map(scheduling_sot => scheduling_sot.scheduling?.book_type_cv)
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
            this.startDateToday = Utility.getEarlierDate(Utility.convertDate(this.scheduling.scheduling_dt) as Date, this.startDateToday);
            formGroup.patchValue({
              reference: scheduling.reference,
              book_type_cv: scheduling.book_type_cv,
              scheduling_dt: Utility.convertDate(this.scheduling.scheduling_dt) as Date
            });

            const schedulingSotArray = formGroup.get('schedulingSot') as UntypedFormArray;
            schedulingSotArray.clear();
            scheduling.scheduling_sot!.forEach((schedulingTank: any) => {
              schedulingSotArray.push(this.createScheduleTankGroup(schedulingTank));
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
      booked: [this.checkBooking(tank.booking)],
      scheduled: [this.checkScheduling(tank.scheduling)],
    });
  }

  createScheduleTankGroup(schedulingTank: SchedulingSotItem): UntypedFormGroup {
    return this.fb.group({
      guid: [schedulingTank.guid],
      scheduling_guid: [schedulingTank.scheduling_guid],
      sot_guid: [schedulingTank.storing_order_tank?.guid],
      tank_no: [schedulingTank.storing_order_tank?.tank_no],
      status_cv: [schedulingTank.status_cv],
      customer_company: [this.ccDS.displayName(schedulingTank.storing_order_tank?.storing_order?.customer_company)],
      eir_no: [this.igDS.getInGateItem(schedulingTank.storing_order_tank?.in_gate)?.eir_no],
      eir_dt: [this.igDS.getInGateItem(schedulingTank.storing_order_tank?.in_gate)?.eir_dt],
      capacity: [this.igDS.getInGateItem(schedulingTank.storing_order_tank?.in_gate)?.in_gate_survey?.capacity],
      tare_weight: [this.igDS.getInGateItem(schedulingTank.storing_order_tank?.in_gate)?.in_gate_survey?.tare_weight],
      tank_status_cv: [schedulingTank.storing_order_tank?.tank_status_cv],
      yard_cv: [this.igDS.getInGateItem(schedulingTank.storing_order_tank?.in_gate)?.yard_cv]
    });
  }

  getSchedulingArray(): UntypedFormArray {
    return this.schedulingForm.get('schedulingSot') as UntypedFormArray;
  }

  submit() {
    if (this.schedulingForm?.valid) {
      let scheduling = new SchedulingGO(this.scheduling);
      scheduling.reference = this.schedulingForm.value['reference'];
      //scheduling.status_cv = this.schedulingForm.value['status_cv'];
      scheduling.book_type_cv = this.schedulingForm.value['book_type_cv'];
      scheduling.scheduling_dt = Utility.convertDate(this.schedulingForm.value['scheduling_dt']) as number;

      let schedulingSot: SchedulingSotItem[] = [];
      const schedulingSotForm = this.schedulingForm.value['schedulingSot']
      schedulingSotForm.forEach((s: any) => {
        schedulingSot.push(new SchedulingSotItem({
          guid: s.guid,
          scheduling_guid: s.scheduling_guid,
          sot_guid: s.sot_guid,
          status_cv: s.status_cv
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
        control?.setErrors(null);
        if (this.action === 'edit') {
          if (this.scheduling && this.scheduling.book_type_cv !== value && this.existingBookTypeCvs!.includes(value)) {
            control?.setErrors({ existed: true });
          }
        } else {
          if (this.existingBookTypeCvs!.includes(value)) {
            control?.setErrors({ existed: true });
          }
        }
      })
    ).subscribe();
  }

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

  canEdit(): boolean {
    return true;
  }
}
