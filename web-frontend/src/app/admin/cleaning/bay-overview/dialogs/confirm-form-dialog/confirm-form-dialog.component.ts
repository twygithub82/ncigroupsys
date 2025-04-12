import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { JobOrderItem } from 'app/data-sources/job-order';

export interface DialogData {
  action: string;
  item: JobOrderItem;
  langText?: any;
  confirmStatement?:string;
  index: number;
  remarks:string;
}

@Component({
  selector: 'app-cleaning-estimate-new-confirm-form-dialog',
  templateUrl: './confirm-form-dialog.component.html',
  styleUrls: ['./confirm-form-dialog.component.scss'],
  providers: [],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
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
export class ConfirmationDialogComponent {
  jobItm: JobOrderItem;
  index: number;
  pcForm: UntypedFormGroup;
  confirmStatement?:string;
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: UntypedFormBuilder,
  ) {
    // Set the defaults
    this.confirmStatement=data.confirmStatement;
    this.jobItm = data.item;
    this.index = data.index;
    this.pcForm = this.createPackageCleaning();
  }
  onNoClick(): void {
    this.dialogRef.close('cancel');
  }
  confirmDelete(): void {
    const returnDialog: any = {
      action: 'confirmed',
      item: this.jobItm,
      index: this.index,
      // remarks: this.pcForm.value["remarks"]
    }
    this.dialogRef.close(returnDialog);
  }

   createPackageCleaning(): UntypedFormGroup {
      return this.fb.group({
        // remarks:['']
      });
    }
}
