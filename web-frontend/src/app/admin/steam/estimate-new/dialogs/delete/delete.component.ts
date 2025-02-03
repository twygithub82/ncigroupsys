import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TranslateModule } from '@ngx-translate/core';
import { RepairPartItem } from 'app/data-sources/repair-part';

export interface DialogData {
  action: string;
  item: RepairPartItem;
  langText?: any;
  index: number;
}

@Component({
    selector: 'app-steam-estimate-new-delete',
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
  rep: RepairPartItem;
  index: number;
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    // Set the defaults
    this.rep = data.item;
    this.index = data.index;
  }
  onNoClick(): void {
    this.dialogRef.close('cancel');
  }
  confirmDelete(): void {
    const returnDialog: DialogData = {
      action: 'confirmed',
      item: this.rep,
      index: this.index
    }
    this.dialogRef.close(returnDialog);
  }
}
