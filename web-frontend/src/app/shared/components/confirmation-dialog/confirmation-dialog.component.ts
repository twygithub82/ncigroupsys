import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TranslateModule } from '@ngx-translate/core';

export interface DialogData {
  action: string;
  cache: any;
  headerText?: any;
  messageText?: any[];
  index: number;
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
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
export class ConfirmationDialogComponent {
  index: number;
  headerText: string;
  act: string;
  langText: any = {
    CANCEL: 'COMMON-FORM.CANCEL',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    ARE_YOU_SURE: 'COMMON-FORM.ARE-YOU-SURE',
    DELETE: 'COMMON-FORM.DELETE',
    CLOSE: 'COMMON-FORM.CLOSE',
  }

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    // Set the defaults
    this.headerText = data.headerText || this.langText.ARE_YOU_SURE
    this.index = data.index;
    this.act = data.action;
  }
  onNoClick(): void {
    this.dialogRef.close('cancel');
  }
  confirm(): void {
    const returnDialog: DialogData = {
      action: 'confirmed',
      cache: this.data.cache,
      index: this.index
    }
    this.dialogRef.close(returnDialog);
  }
  hideCancel(): boolean {
    return this.act == "confirm_only";
  }
}
