import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { CodeValuesDS, CodeValuesItem } from 'app/data-sources/code-values';
import { SchedulingSotItem } from 'app/data-sources/scheduling-sot';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';

export interface DialogData {
  action?: string;
  sot?: StoringOrderTankItem;
  schedulingSot?: SchedulingSotItem;
  translatedLangText?: any;
  populateData?: any;
  index: number;
}

@Component({
  selector: 'app-scheduling-new-cancel-form-dialog',
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
  ],
})
export class CancelFormDialogComponent {
  index: number;
  dialogTitle?: string;
  sot?: StoringOrderTankItem;
  schedulingSot?: SchedulingSotItem;
  roSotListForm: UntypedFormGroup;
  bookingTypeCvList: CodeValuesItem[] = [];

  cvDS: CodeValuesDS;
  constructor(
    public dialogRef: MatDialogRef<CancelFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
    private apollo: Apollo,
  ) {
    // Set the defaults
    this.cvDS = new CodeValuesDS(this.apollo);
    this.sot = data.sot;
    this.schedulingSot = data.schedulingSot;
    this.bookingTypeCvList = data.populateData?.bookingTypeCvList;
    this.roSotListForm = this.createRoSotListForm();
    this.index = data.index;
  }
  createRoSotListForm(): UntypedFormGroup {
    return this.fb.group({
      tank_no: this.sot?.tank_no,
      book_type_cv: this.schedulingSot?.scheduling?.book_type_cv,
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
      this.schedulingSot!.remarks = remarks;
      const returnDialog: DialogData = {
        action: 'confirmed',
        schedulingSot: this.schedulingSot,
        index: this.index
      }
      this.dialogRef.close(returnDialog);
    }
  }

  getBookTypeDescription(codeValType: string | undefined): string | undefined {
    return this.cvDS.getCodeDescription(codeValType, this.bookingTypeCvList);
  }
}
