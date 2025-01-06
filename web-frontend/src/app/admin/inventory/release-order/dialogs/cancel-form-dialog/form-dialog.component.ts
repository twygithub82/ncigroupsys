import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, UntypedFormArray, AbstractControl } from '@angular/forms';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Utility } from 'app/utilities/utility';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DatePipe } from '@angular/common';
import { TariffCleaningDS, TariffCleaningItem } from 'app/data-sources/tariff-cleaning';
import { Apollo } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { startWith, debounceTime, tap } from 'rxjs';
import { ComponentUtil } from 'app/utilities/component-util';
import { MatDividerModule } from '@angular/material/divider';
import { ReleaseOrderItem } from 'app/data-sources/release-order';

export interface DialogData {
  action?: string;
  item: ReleaseOrderItem[];
  langText?: any;
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
    this.translate.get(data.langText.ARE_YOU_SURE_CANCEL).subscribe((res: string) => {
      this.dialogTitle = res;
    });
    this.index = data.index;
  }
  createStorigOrderForm(): UntypedFormGroup {
    return this.fb.group({
      releaseOrder: this.fb.array(this.releaseOrder.map(ro => this.createOrderGroup(ro)))
    });
  }
  createOrderGroup(ro: any): UntypedFormGroup {
    return this.fb.group({
      guid: [ro.guid],
      ro_no: [ro.ro_no],
      customer_company_guid: [ro.customer_company_guid],
      storing_order_tank: this.fb.array(ro.release_order_sot.map((rosot: any) => this.createTankGroup(rosot.storing_order_tank))),
      remarks: [ro.remarks, Validators.required]
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
    if (this.releaseOrderForm.valid) {
      let ro = this.releaseOrderForm.get('releaseOrder')?.value
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
}
