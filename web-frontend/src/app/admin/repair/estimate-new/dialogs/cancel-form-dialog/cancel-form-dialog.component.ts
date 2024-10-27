import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, UntypedFormArray, AbstractControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';

export interface DialogData {
  action?: string;
  item: StoringOrderTankItem[];
  langText?: any;
  translatedLangText?: any;
  index: number;
}

@Component({
  selector: 'app-repair-estimate-new-cancel-form-dialog',
  templateUrl: './cancel-form-dialog.component.html',
  styleUrls: ['./cancel-form-dialog.component.scss'],
  providers: [],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    MatFormFieldModule,
    MatInputModule,
    MatDialogClose,
    TranslateModule,
    CommonModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class CancelFormDialogComponent {
  index: number;
  dialogTitle?: string;
  storingOrderTank: StoringOrderTankItem[];
  storingOrderTankForm: UntypedFormGroup;
  startDate = new Date();

  lastCargoControl = new UntypedFormControl();
  constructor(
    public dialogRef: MatDialogRef<CancelFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.storingOrderTank = data.item;
    this.storingOrderTankForm = this.createStorigOrderForm();
    this.index = data.index;
  }
  createStorigOrderForm(): UntypedFormGroup {
    return this.fb.group({
      storingOrderTank: this.fb.array(this.storingOrderTank.map(sot => this.createTankGroup(sot))),
      remarks: ['', Validators.required]
    });
  }
  createTankGroup(sot: any): UntypedFormGroup {
    return this.fb.group({
      tank_no: [sot.tank_no],
      status_cv: [sot.status_cv],
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirm(): void {
    if (this.storingOrderTankForm.valid) {
      let remarks = this.storingOrderTankForm.value['remarks']
      this.storingOrderTank.forEach(row => row.remarks = remarks);
      const returnDialog: DialogData = {
        action: 'confirmed',
        item: this.storingOrderTank,
        index: this.index
      }
      this.dialogRef.close(returnDialog);
    }
  }
  getStoringOrderTanksArray(): UntypedFormArray {
    return this.storingOrderTankForm.get('storingOrderTank') as UntypedFormArray;
  }
}
