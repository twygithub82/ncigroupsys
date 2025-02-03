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
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
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
import { RepairItem } from 'app/data-sources/repair';
import { MatCardModule } from '@angular/material/card';

export interface DialogData {
  action?: string;
  dialogTitle?: string;
  item: RepairItem[];
  translatedLangText?: any;
  index: number;
}

@Component({
  selector: 'app-steam-job-order-task-details-cancel-form-dialog',
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
    MatCardModule
  ],
})
export class CancelFormDialogComponent {
  action?: string;
  index: number;
  dialogTitle?: string;
  repairEstList: RepairItem[];
  cancelForm: UntypedFormGroup;
  startDate = new Date();

  lastCargoControl = new UntypedFormControl();
  constructor(
    public dialogRef: MatDialogRef<CancelFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.repairEstList = data.item;
    this.cancelForm = this.createCancelForm();
    this.action = this.data.action;
    this.dialogTitle = this.data.dialogTitle;
    this.index = data.index;
  }
  createCancelForm(): UntypedFormGroup {
    return this.fb.group({
      cancelItemList: this.fb.array(this.repairEstList.map(re => this.createOrderGroup(re))),
      remarks: ['']
    });
  }
  createOrderGroup(re: any): UntypedFormGroup {
    return this.fb.group({
      customer_company_guid: [re?.storing_order_tank?.storing_order?.customer_company_guid],
      guid: [re.guid],
      estimate_no: [re.estimate_no],
      sot_guid: [re.sot_guid],
      remarks: [re.remarks, Validators.required]
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
    if (this.cancelForm.valid) {
      let cancelItemList = this.cancelForm.value['cancelItemList']
      const returnDialog: DialogData = {
        action: 'confirmed',
        item: cancelItemList,
        index: this.index
      }
      this.dialogRef.close(returnDialog);
    }
  }
  cancelItemArray(): UntypedFormArray {
    return this.cancelForm.get('cancelItemList') as UntypedFormArray;
  }
}
