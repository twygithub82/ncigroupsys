import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TranslateModule } from '@ngx-translate/core';

export interface DialogData {
  action: string;
  message: string;
  langText?: any;

}

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
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
export class ConfirmDialogComponent {
  msg: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    // Set the defaults
    this.msg = data.message;

  }
  onNoClick(): void {
    this.dialogRef.close('cancel');
  }
  confirmAction(): void {
    const returnDialog: DialogData = {
      action: 'confirmed',
      message: ''

    }
    this.dialogRef.close(returnDialog);
  }
}
