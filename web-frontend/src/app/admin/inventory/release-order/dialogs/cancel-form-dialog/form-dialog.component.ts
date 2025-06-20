import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReleaseOrderItem } from 'app/data-sources/release-order';
import { GlobalMaxCharDirective } from 'app/directive/global-max-char.directive';

export interface DialogData {
  action?: string;
  item: ReleaseOrderItem[];
  translatedLangText?: any;
  index: number;
}

@Component({
  selector: 'app-release-order-cancel-form-dialog',
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
  releaseOrder: ReleaseOrderItem[];
  releaseOrderForm: UntypedFormGroup;
  startDate = new Date();

  lastCargoControl = new UntypedFormControl();
  constructor(
    public dialogRef: MatDialogRef<CancelFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private translate: TranslateService
  ) {
    // Set the defaults
    this.releaseOrder = data.item;
    this.releaseOrderForm = this.createStorigOrderForm();
    this.index = data.index;
  }
  createStorigOrderForm(): UntypedFormGroup {
    return this.fb.group({
      remarks: ['', Validators.required],
      releaseOrder: this.fb.array(this.releaseOrder.map(ro => this.createOrderGroup(ro)))
    });
  }
  createOrderGroup(ro: any): UntypedFormGroup {
    return this.fb.group({
      guid: [ro.guid],
      ro_no: [ro.ro_no],
      customer_company_guid: [ro.customer_company_guid],
      storing_order_tank: this.fb.array(ro.release_order_sot.map((rosot: any) => this.createTankGroup(rosot))),
      // remarks: [ro.remarks, Validators.required]
    });
  }
  createTankGroup(tank: any): UntypedFormGroup {
    return this.fb.group({
      tank_no: [tank.storing_order_tank.tank_no],
      status_cv: [tank.status_cv]
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmCancel(): void {
    if (this.releaseOrderForm.valid) {
      let ro = this.releaseOrderForm.get('releaseOrder')?.value?.map((s: any) => {
        return {
          ...s,
          remarks: this.releaseOrderForm.value['remarks']
        };
      });
      const returnDialog: DialogData = {
        action: 'confirmed',
        item: ro,
        index: this.index
      }
      this.dialogRef.close(returnDialog);
    }
  }
  releaseOrderArray(): UntypedFormArray {
    return this.releaseOrderForm.get('releaseOrder') as UntypedFormArray;
  }
  getReleaseOrderTanksArray(so: AbstractControl<any, any>): UntypedFormArray {
    return so.get('storing_order_tank') as UntypedFormArray;
  }
  displayTargetedSot(sotList: UntypedFormArray) {
    return sotList.controls.filter(sot => sot.get('status_cv')?.value === 'WAITING')
      .map(sot => sot.get('tank_no')?.value)
      .join(', ')
  }
}
