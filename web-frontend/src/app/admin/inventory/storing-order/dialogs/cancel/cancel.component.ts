import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { StoringOrderItem } from 'app/data-sources/storing-order';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';

export interface DialogData {
  action: string;
  item: StoringOrderItem[];
  langText?: any;
  index?: number;
}

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.scss'],
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
    TranslateModule,
    MatFormFieldModule,
    MatDividerModule,
  ],
})
export class CancelDialogComponent {
  storingOrderTanks: StoringOrderItem[];
  index?: number;
  constructor(
    public dialogRef: MatDialogRef<CancelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    // Set the defaults
    this.storingOrderTanks = data.item;
    this.index = data.index;
  }
  onNoClick(): void {
    this.dialogRef.close('cancel');
  }
  confirmCancel(): void {
    const returnDialog: DialogData = {
      action: 'confirmed',
      item: this.storingOrderTanks,
      index: this.index
    }
    this.dialogRef.close(returnDialog);
  }
}
