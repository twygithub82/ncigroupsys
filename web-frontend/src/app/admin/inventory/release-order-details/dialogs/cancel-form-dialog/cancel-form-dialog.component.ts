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
import { SchedulingItem } from 'app/data-sources/scheduling';
import { ReleaseOrderSotItem } from 'app/data-sources/release-order-sot';

export interface DialogData {
  action?: string;
  item: ReleaseOrderSotItem[];
  translatedLangText?: any;
  index: number;
}

@Component({
  selector: 'app-release-order-details-cancel-form-dialog',
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
  roSotList: ReleaseOrderSotItem[];
  roSotListForm: UntypedFormGroup;
  startDate = new Date();

  lastCargoControl = new UntypedFormControl();
  constructor(
    public dialogRef: MatDialogRef<CancelFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.roSotList = data.item;
    this.roSotListForm = this.createRoSotListForm();
    this.index = data.index;
  }
  createRoSotListForm(): UntypedFormGroup {
    return this.fb.group({
      roSotList: this.fb.array(this.roSotList.map(roSot => this.createTankGroup(roSot))),
      remarks: ['', Validators.required]
    });
  }
  createTankGroup(roSot: any): UntypedFormGroup {
    return this.fb.group({
      tank_no: [roSot.storing_order_tank?.tank_no],
      status_cv: [roSot.status_cv],
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirm(): void {
    if (this.roSotListForm.valid) {
      const remarks = this.roSotListForm.value['remarks']
      this.roSotList.forEach(row => row.remarks = remarks);
      const returnDialog: DialogData = {
        action: 'confirmed',
        item: this.roSotList,
        index: this.index
      }
      this.dialogRef.close(returnDialog);
    }
  }
  getRoSotListArray(): UntypedFormArray {
    return this.roSotListForm.get('roSotList') as UntypedFormArray;
  }
}
