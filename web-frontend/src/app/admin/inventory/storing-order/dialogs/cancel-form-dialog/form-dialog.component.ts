import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { GlobalMaxCharDirective } from 'app/directive/global-max-char.directive';

export interface DialogData {
  action?: string;
  item: StoringOrderItem[];
  translatedLangText?: any;
  index: number;
}

@Component({
  selector: 'app-storing-order-cancel-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  providers: [],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    CommonModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    GlobalMaxCharDirective
  ],
})
export class CancelFormDialogComponent {
  index: number;
  dialogTitle?: string;
  storingOrder: StoringOrderItem[];
  storingOrderForm: UntypedFormGroup;
  startDate = new Date();

  lastCargoControl = new UntypedFormControl();
  constructor(
    public dialogRef: MatDialogRef<CancelFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.storingOrder = data.item;
    this.storingOrderForm = this.createStorigOrderForm();
    this.index = data.index;
  }
  createStorigOrderForm(): UntypedFormGroup {
    return this.fb.group({
      remarks: ['', Validators.required],
      storingOrder: this.fb.array(this.storingOrder.map(so => this.createOrderGroup(so)))
    });
  }
  createOrderGroup(so: any): UntypedFormGroup {
    return this.fb.group({
      guid: [so.guid],
      so_no: [so.so_no],
      customer_company_guid: [so.customer_company_guid],
      storing_order_tank: this.fb.array(so.storing_order_tank.map((tank: any) => this.createTankGroup(tank))),
      // remarks: [so.remarks, Validators.required]
    });
  }
  createTankGroup(tank: any): UntypedFormGroup {
    return this.fb.group({
      tank_no: [tank.tank_no],
      status_cv: [tank.status_cv]
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmCancel(): void {
    if (this.storingOrderForm.valid) {
      let so = this.storingOrderForm.value['storingOrder'].map((s: any) => {
        return {
          ...s,
          remarks: this.storingOrderForm.value['remarks']
        };
      });
      const returnDialog: DialogData = {
        action: 'confirmed',
        item: so,
        index: this.index
      }
      console.log('returnDialog', returnDialog);
      this.dialogRef.close(returnDialog);
    }
  }
  storingOrderArray(): UntypedFormArray {
    return this.storingOrderForm.get('storingOrder') as UntypedFormArray;
  }
  getStoringOrderTanksArray(so: AbstractControl<any, any>): UntypedFormArray {
    return so.get('storing_order_tank') as UntypedFormArray;
  }
  displayTargetedSo(soList: UntypedFormArray) {
    return soList.controls.map(so => so.get('so_no')?.value)
      .join(', ')
  }
  displayTargetedSot(sotList: UntypedFormArray) {
    return sotList.controls.filter(sot => sot.get('status_cv')?.value === 'WAITING' || sot.get('status_cv')?.value === 'PREORDER')
      .map(sot => sot.get('tank_no')?.value)
      .join(', ')
  }
}
