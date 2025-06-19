import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ReleaseOrderSotUpdateItem } from 'app/data-sources/release-order-sot';

export interface DialogData {
  action: string;
  item: ReleaseOrderSotUpdateItem;
  translatedLangText?: any;
  index: number;
}

@Component({
  selector: 'app-release-order-details-delete',
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
  roSot: ReleaseOrderSotUpdateItem;
  index: number;
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    // Set the defaults
    this.roSot = data.item;
    this.index = data.index;
  }
  onNoClick(): void {
    this.dialogRef.close('cancel');
  }
  confirmDelete(): void {
    const returnDialog: DialogData = {
      action: 'confirmed',
      item: this.roSot,
      index: this.index
    }
    this.dialogRef.close(returnDialog);
  }
}
