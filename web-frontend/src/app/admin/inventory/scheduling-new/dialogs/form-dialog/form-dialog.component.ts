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
import { SchedulingDS, SchedulingItem } from 'app/data-sources/scheduling';
import { ReleaseOrderDS, ReleaseOrderItem } from 'app/data-sources/release-order';
import { InGateDS } from 'app/data-sources/in-gate';


export interface DialogData {
  action?: string;
  item: StoringOrderTankItem[];
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
  last_cargoList?: TariffCleaningItem[];
  startDateToday = new Date();
  valueChangesDisabled: boolean = false;

  ccDS: CustomerCompanyDS;
  roDS: ReleaseOrderDS;
  igDS: InGateDS;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,

  ) {
    // Set the defaults
    this.ccDS = new CustomerCompanyDS(this.apollo);
    this.roDS = new ReleaseOrderDS(this.apollo);
    this.igDS = new InGateDS(this.apollo);
    this.action = data.action!;
    this.dialogTitle = 'New Scheduling';
    if (this.action === 'edit') {
      //this.dialogTitle = 'Edit ' + data.item.tank_no;
      this.storingOrderTank = data.item;
    } else {
      this.storingOrderTank = data.item ? data.item : [new StoringOrderTankItem()];
    }
    this.schedulingForm = this.createForm();
    this.initializeValueChange();
  }

  createForm(): UntypedFormGroup {
    const customerCompanyGuid = this.storingOrderTank[0].storing_order?.customer_company_guid
    return this.fb.group({
      booking_dt: [''],
      customer_company_guid: [customerCompanyGuid],
      haulier: [''],
      release_dt: [''],
      ro_notes: [''],
      scheduling: this.fb.array(this.storingOrderTank.map((tank: any) => this.createTankGroup(tank)))
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
      release_job_no: [tank.release_job_no],
      booked: [this.checkBooking(tank.booking)],
      scheduled: [this.checkScheduling(tank.scheduling)],
    });
  }

  getSchedulingArray(): UntypedFormArray {
    return this.schedulingForm.get('scheduling') as UntypedFormArray;
  }

  submit() {
    if (this.schedulingForm?.valid) {
      let ro = new ReleaseOrderItem();
      ro.booking_dt = Utility.convertDate(this.schedulingForm.value['booking_dt']) as number;
      ro.release_dt = Utility.convertDate(this.schedulingForm.value['release_dt']) as number;
      ro.customer_company_guid = this.schedulingForm.value['customer_company_guid'];
      ro.haulier = this.schedulingForm.value['haulier'];
      ro.ro_notes = this.schedulingForm.value['ro_notes'];
      let schedulings: SchedulingItem[] = [];
      const schedulingsForm = this.schedulingForm.value['scheduling']
      schedulingsForm.forEach((s: any) => {
        schedulings.push(new SchedulingItem({reference: s.reference, sot_guid: s.sot_guid, storing_order_tank: new StoringOrderTankGO({guid: s.sot_guid, release_job_no: s.release_job_no})}))
      });

      console.log(ro);
      console.log(schedulings);

      this.roDS.addReleaseOrder(ro, schedulings).subscribe(result => {
        const returnDialog: any = {
          savedSuccess: (result?.data?.addReleaseOrder ?? 0) > 0
        }
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
