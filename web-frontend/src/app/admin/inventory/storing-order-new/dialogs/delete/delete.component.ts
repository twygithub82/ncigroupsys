import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';

export interface DialogData {
  action: string;
  item: StoringOrderTankItem;
  langText?: any;
  index: number;
}

@Component({
    selector: 'app-storing-order-new-delete',
    templateUrl: './delete.component.html',
    styleUrls: ['./delete.component.scss'],
    standalone: true,
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule,
        MatDialogClose,
        TranslateModule,
    ],
})
export class DeleteDialogComponent {
  storingOrderTank: StoringOrderTankItem;
  index: number;
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    // Set the defaults
    this.storingOrderTank = data.item;
    this.index = data.index;
  }
  onNoClick(): void {
    this.dialogRef.close('cancel');
  }
  confirmDelete(): void {
    const returnDialog: DialogData = {
      action: 'confirmed',
      item: this.storingOrderTank,
      index: this.index
    }
    this.dialogRef.close(returnDialog);
  }
}
