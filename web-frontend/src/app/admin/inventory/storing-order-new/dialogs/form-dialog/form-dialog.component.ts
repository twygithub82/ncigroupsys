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
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Utility } from 'app/utilities/utility';

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
    MatNativeDateModule,
    MatMomentDateModule,
    TranslateModule,
    MatCheckboxModule
  ],
})
export class FormDialogComponent {
  action: string;
  index: number;
  dialogTitle: string;
  storingOrderTankForm: UntypedFormGroup;
  storingOrderTank: StoringOrderTankItem;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action!;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit ' + data.item.tank_no;
      this.storingOrderTank = data.item;
    } else {
      this.dialogTitle = 'New Record';
      const blankObject = {} as StoringOrderTankItem;
      this.storingOrderTank = new StoringOrderTankItem();
    }
    this.index = data.index;
    this.storingOrderTankForm = this.createStorigOrderTankForm();
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
      unit_type: [this.storingOrderTank.unit_type_guid, [Validators.required]],
      tank_no: [this.storingOrderTank.tank_no, [Validators.required]],
      last_cargo: [this.storingOrderTank.last_cargo_guid, [Validators.required]],
      job_no: [this.storingOrderTank.job_no, [Validators.required]],
      eta_date: [this.storingOrderTank.eta_date ? new Date(this.storingOrderTank.eta_date) : ''],
      purpose_storage: [this.storingOrderTank.purpose_storage],
      purpose_steam: [this.storingOrderTank.purpose_steam],
      purpose_cleaning: [this.storingOrderTank.purpose_cleaning],
      repair: [this.storingOrderTank.repair],
      clean_status: [this.storingOrderTank.clean_status],
      certificate: [this.storingOrderTank.certificate],
      required_temp: [this.storingOrderTank.required_temp],
      remarks: [this.storingOrderTank.remarks],
      etr_date: [this.storingOrderTank.etr_date ? new Date(this.storingOrderTank.etr_date) : ''],
      st: [this.storingOrderTank.st],
      o2_level: [this.storingOrderTank.o2_level],
      open_on_gate: [this.storingOrderTank.open_on_gate]
    });
  }
  submit() {
    // emppty stuff
    var sot: StoringOrderTankItem = {
      guid: '',
      so_guid: '',
      unit_type_guid: this.storingOrderTankForm.value['unit_type'],
      tank_no: this.storingOrderTankForm.value['tank_no'],
      last_cargo_guid: this.storingOrderTankForm.value['last_cargo'],
      job_no: this.storingOrderTankForm.value['job_no'],
      eta_date: this.storingOrderTankForm.value['eta_date'].getTime(),
      purpose_storage: this.storingOrderTankForm.value['purpose_storage'],
      purpose_steam: this.storingOrderTankForm.value['purpose_steam'],
      purpose_cleaning: this.storingOrderTankForm.value['purpose_cleaning'],
      repair: this.storingOrderTankForm.value['repair'],
      clean_status: this.storingOrderTankForm.value['clean_status'],
      certificate: this.storingOrderTankForm.value['certificate'],
      required_temp: this.storingOrderTankForm.value['required_temp'],
      remarks: this.storingOrderTankForm.value['remarks'],
      etr_date: this.storingOrderTankForm.value['etr_date'].getTime(),
      st: this.storingOrderTankForm.value['st'],
      o2_level: this.storingOrderTankForm.value['o2_level'],
      open_on_gate: this.storingOrderTankForm.value['open_on_gate']
    }
    const returnDialog: DialogData = {
      item: sot,
      index: this.index
    }
    this.dialogRef.close(returnDialog);
  }
  onNoClick(): void {
    this.dialogRef.close('cancel');
  }
}
