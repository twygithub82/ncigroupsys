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
  previewImage: string;
  imageDescription: string;
}

@Component({
  selector: 'app-preview-image-dialog',
  templateUrl: './preview-image-dialog.component.html',
  styleUrls: ['./preview-image-dialog.component.scss'],
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
export class PreviewImageDialogComponent {
  previewImage: string;
  imageDescription: string;
  headerText: string;

  langText: any = {
    CANCEL: 'COMMON-FORM.CANCEL',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    ARE_YOU_SURE: 'COMMON-FORM.ARE-YOU-SURE'
  }

  constructor(
    public dialogRef: MatDialogRef<PreviewImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    // Set the defaults
    this.headerText = data.headerText || this.langText.ARE_YOU_SURE;
    this.previewImage = data.previewImage;
    this.imageDescription = data.imageDescription;
  }
  onNoClick(): void {
    this.dialogRef.close('cancel');
  }
  confirm(): void {
    const returnDialog: any = {}
    this.dialogRef.close(returnDialog);
  }
}
