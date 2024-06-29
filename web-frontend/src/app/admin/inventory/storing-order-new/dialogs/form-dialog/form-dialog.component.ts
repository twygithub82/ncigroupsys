import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Utility } from 'app/utilities/utility';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DatePipe } from '@angular/common';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff_cleaning';
import { Apollo } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { startWith, debounceTime, tap } from 'rxjs';

export interface DialogData {
  action?: string;
  item: StoringOrderTankItem;
  langText?: any;
  populateData?: any;
  index: number;
}

@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  providers: [],
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
    CommonModule
  ],
})
export class FormDialogComponent {
  action: string;
  index: number;
  dialogTitle: string;
  storingOrderTankForm: UntypedFormGroup;
  storingOrderTank: StoringOrderTankItem;

  tcDS: TariffCleaningDS;
  lastCargoControl = new UntypedFormControl();
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo
  ) {
    // Set the defaults
    this.tcDS = new TariffCleaningDS(this.apollo);
    this.action = data.action!;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit ' + data.item.tank_no;
      this.storingOrderTank = data.item;
    } else {
      this.dialogTitle = 'New Record';
      this.storingOrderTank = new StoringOrderTankItem();
    }
    this.index = data.index;
    this.storingOrderTankForm = this.createStorigOrderTankForm();
    this.initializeValueChange();

    if (this.storingOrderTank.tariff_cleaning) {
      this.lastCargoControl.setValue(this.storingOrderTank.tariff_cleaning);
    }
  }
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.email,
  ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
        ? 'Not a valid email'
        : '';
  }
  createStorigOrderTankForm(): UntypedFormGroup {
    return this.fb.group({
      guid: [this.storingOrderTank.guid],
      so_guid: [this.storingOrderTank.so_guid],
      unit_type_guid: [this.storingOrderTank.unit_type_guid, [Validators.required]],
      tank_no: [this.storingOrderTank.tank_no, [Validators.required]],
      last_cargo: this.lastCargoControl,
      last_cargo_guid: [this.storingOrderTank.last_cargo_guid, [Validators.required]],
      job_no: [this.storingOrderTank.job_no, [Validators.required]],
      eta_dt: [Utility.convertDate(this.storingOrderTank.eta_dt)],
      purpose_storage: [this.storingOrderTank.purpose_storage],
      purpose_steam: [this.storingOrderTank.purpose_steam],
      purpose_cleaning: [this.storingOrderTank.purpose_cleaning],
      purpose_repair_cv: [this.storingOrderTank.purpose_repair_cv],
      clean_status_cv: [this.storingOrderTank.clean_status_cv],
      certificate_cv: [this.storingOrderTank.certificate_cv],
      required_temp: [{ value: this.storingOrderTank.required_temp, disabled: !this.storingOrderTank.purpose_steam }],
      etr_dt: [Utility.convertDate(this.storingOrderTank.etr_dt)],
      remarks: [{ value: this.storingOrderTank.tariff_cleaning?.remarks, disabled: true }],
      open_on_gate: [{ value: this.storingOrderTank.tariff_cleaning?.open_on_gate_cv, disabled: true }],
      flash_point: [this.storingOrderTank.tariff_cleaning?.flash_point]
    });
  }
  submit() {
    if (this.storingOrderTankForm?.valid) {
      var sot: StoringOrderTankItem = {
        ...this.storingOrderTank,
        unit_type_guid: this.storingOrderTankForm.value['unit_type_guid'],
        tank_no: this.storingOrderTankForm.value['tank_no'],
        last_cargo_guid: this.storingOrderTankForm.value['last_cargo_guid'],
        tariff_cleaning: this.lastCargoControl.value,
        job_no: this.storingOrderTankForm.value['job_no'],
        eta_dt: Utility.convertDate(this.storingOrderTankForm.value['eta_dt']),
        purpose_storage: this.storingOrderTankForm.value['purpose_storage'],
        purpose_steam: this.storingOrderTankForm.value['purpose_steam'],
        purpose_cleaning: this.storingOrderTankForm.value['purpose_cleaning'],
        purpose_repair_cv: this.storingOrderTankForm.value['purpose_repair_cv'],
        clean_status_cv: this.storingOrderTankForm.value['clean_status_cv'],
        certificate_cv: this.storingOrderTankForm.value['certificate_cv'],
        required_temp: this.storingOrderTankForm.value['required_temp'],
        etr_dt: Utility.convertDate(this.storingOrderTankForm.value['etr_dt'])
      }
      // var sot: StoringOrderTankItem = {
      //   guid: this.storingOrderTankForm.value['guid'],
      //   so_guid: this.storingOrderTankForm.value['so_guid'],
      //   unit_type_guid: this.storingOrderTankForm.value['unit_type_guid'],
      //   tank_no: this.storingOrderTankForm.value['tank_no'],
      //   last_cargo_guid: this.storingOrderTankForm.value['last_cargo_guid'],
      //   job_no: this.storingOrderTankForm.value['job_no'],
      //   eta_dt: Utility.convertDate(this.storingOrderTankForm.value['eta_dt']),// this.storingOrderTankForm.value['eta_dt'] ? this.storingOrderTankForm.value['eta_dt'].getTime() : this.storingOrderTankForm.value['eta_dt'],
      //   purpose_storage: this.storingOrderTankForm.value['purpose_storage'],
      //   purpose_steam: this.storingOrderTankForm.value['purpose_steam'],
      //   purpose_cleaning: this.storingOrderTankForm.value['purpose_cleaning'],
      //   purpose_repair_cv: this.storingOrderTankForm.value['repair'],
      //   clean_status_cv: this.storingOrderTankForm.value['clean_status'],
      //   certificate_cv: this.storingOrderTankForm.value['certificate'],
      //   required_temp: this.storingOrderTankForm.value['required_temp'],
      //   etr_dt: Utility.convertDate(this.storingOrderTankForm.value['etr_dt'])
      // }
      const returnDialog: DialogData = {
        item: sot,
        index: this.index
      }
      console.log('valid');
      this.dialogRef.close(returnDialog);
      // if (Utility.verifyIsoContainerCheckDigit(this.storingOrderTankForm.value['tank_no'])) {
      // } else {
      //   console.log('invalid tank no');
      //   this.storingOrderTankForm.value['tank_no'];
      // }
    } else {
      console.log('invalid');
      //this.findInvalidControls();
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
    this.storingOrderTankForm!.get('purpose_steam')!.valueChanges.subscribe(value => {
      const requiredTempControl = this.storingOrderTankForm.get('required_temp');
      if (value) {
        requiredTempControl!.enable();
      } else {
        requiredTempControl!.disable();
      }
    });

    this.storingOrderTankForm.get('tank_no')?.valueChanges.subscribe(value => {
      // Custom validation logic for tank_no
      const isValid = Utility.verifyIsoContainerCheckDigit(value);
      if (!isValid) {
        // Set custom error if the value is invalid
        this.storingOrderTankForm.get('tank_no')?.setErrors({ invalidCheckDigit: true });
      } else {
        // Clear custom error if the value is valid
        this.storingOrderTankForm.get('tank_no')?.setErrors(null);
      }
    });

    this.storingOrderTankForm!.get('last_cargo')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      tap(value => {
        var searchCriteria = '';
        if (typeof value === 'string') {
          searchCriteria = value;
        } else {
          searchCriteria = value.cargo;
          this.storingOrderTankForm!.get('last_cargo_guid')!.setValue(value.guid);
        }
        this.tcDS.loadItems({ cargo: { contains: searchCriteria } }, { cargo: 'ASC' });
      })
    ).subscribe();

    this.lastCargoControl.valueChanges.subscribe(value => {
      if (value.guid) {
        this.storingOrderTankForm.get('remarks')!.setValue(value.remarks);
        this.storingOrderTankForm.get('flash_point')!.setValue(value.flash_point);
        this.storingOrderTankForm.get('open_on_gate')!.setValue(value.open_on_gate);
      }
    });
  }
  findInvalidControls() {
    const controls = this.storingOrderTankForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name);
      }
    }
  }
  displayLastCargoFn(tc: TariffCleaningItem): string {
    return tc && tc.cargo ? `${tc.cargo}` : '';
  }
}
