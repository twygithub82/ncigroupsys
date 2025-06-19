import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { ReleaseOrderSotItem } from 'app/data-sources/release-order-sot';
import { GlobalMaxCharDirective } from 'app/directive/global-max-char.directive';

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
    TranslateModule,
    CommonModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    GlobalMaxCharDirective
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
