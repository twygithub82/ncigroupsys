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
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss'],
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
export class MessageDialogComponent {
  index: number;
  headerText: string;
  act: string;
  langText: any = {
    CANCEL: 'COMMON-FORM.CANCEL',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    ARE_YOU_SURE: 'COMMON-FORM.ARE-YOU-SURE'
  }

  constructor(
    public dialogRef: MatDialogRef<MessageDialogComponent>,
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
