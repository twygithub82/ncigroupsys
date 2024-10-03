import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { StoringOrderTankItem } from 'app/data-sources/storing-order-tank';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

export interface DialogData {
  action: string;
  cache: any;
  headerText?: any;
  messageText?: any[];
  previewImages: string[];
  imageDescription: string;
  focusIndex?: number;
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
    MatIconModule,
  ],
})
export class PreviewImageDialogComponent {
  currentIndex = 0;
  previewImages: string[];
  previewImage: string = "";
  imageDescription: string;
  headerText: string;
  isNextDisabled = false;
  isPreviousDisabled = true;

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
    this.previewImages = data.previewImages;
    this.imageDescription = data.imageDescription;
    this.currentIndex = data.focusIndex || 0;
    this.previewImage = data.previewImages[this.currentIndex];
  }
  onNext(): void {
    let found = false;
    while (!found) {
      this.currentIndex = (this.currentIndex + 1) % this.previewImages.length;
      if (this.previewImages[this.currentIndex]) {
        this.previewImage = this.previewImages[this.currentIndex];
        found = true;
      }
    }
    this.checkDisable();
  }
  onPrevious(): void {
    let found = false;
    while (!found) {
      this.currentIndex = (this.currentIndex - 1 + this.previewImages.length) % this.previewImages.length;
      if (this.previewImages[this.currentIndex]) {
        this.previewImage = this.previewImages[this.currentIndex];
        found = true;
      }
    }
    this.checkDisable();
  }
  onNoClick(): void {
    this.dialogRef.close('cancel');
  }
  confirm(): void {
    const returnDialog: any = {}
    this.dialogRef.close(returnDialog);
  }

  checkDisable(): void {
    this.isNextDisabled = this.currentIndex === this.previewImages.length - 1 || this.previewImages[this.currentIndex + 1] === undefined;
    this.isPreviousDisabled = this.currentIndex === 0 || this.previewImages[this.currentIndex - 1] === undefined;
  }
}
