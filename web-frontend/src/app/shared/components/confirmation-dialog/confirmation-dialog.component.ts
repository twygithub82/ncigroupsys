import { NgClass } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Utility } from 'app/utilities/utility';

export interface DialogData {
  action: string;
  allowRemarks?: boolean;
  allowRemarksWithRequired?: boolean;
  cache: any;
  headerText?: any;
  messageText?: any[];
  index: number;
  remarks?: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
    MatDividerModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    NgClass,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class ConfirmationDialogComponent {
  index: number;
  headerText: string;
  act: string;
  translatedLangText: any = {};
  langText: any = {
    CANCEL: 'COMMON-FORM.CANCEL',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    ARE_YOU_SURE_DELETE: 'COMMON-FORM.ARE-YOU-SURE-DELETE',
    DELETE: 'COMMON-FORM.DELETE',
    CLOSE: 'COMMON-FORM.CLOSE',
    CONFIRM_DELETE: 'COMMON-FORM.CONFIRM-DELETE',
    REMARKS: 'COMMON-FORM.REMARKS',
  }

  confirmForm?: UntypedFormGroup;

  allowRemarks = false;
  allowRemarksWithRequired = false;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private translate: TranslateService,
    private fb: UntypedFormBuilder,
  ) {
    this.translateLangText();
    // Set the defaults
    this.initForm();
    this.headerText = data.headerText || this.langText.CONFIRM_DELETE
    this.index = data.index;
    this.allowRemarks = data.allowRemarks || false;
    this.allowRemarksWithRequired = data.allowRemarksWithRequired || false;
    this.act = data.action;
  }

  initForm() {
    this.confirmForm = this.fb.group({
      remarks: [''],
    });
  }

  onNoClick(): void {
    this.dialogRef.close('cancel');
  }

  confirm(): void {
    if (this.allowRemarksWithRequired && !this.confirmForm?.get('remarks')?.value) {
      this.confirmForm?.get('remarks')?.setErrors({ required: true });
      return;
    }
    if (this.confirmForm?.invalid) {
      return; // double safeguard
    } else {
      const returnDialog: DialogData = {
        action: 'confirmed',
        cache: this.data.cache,
        index: this.index,
        remarks: this.confirmForm?.get('remarks')?.value || '',
      }
      this.dialogRef.close(returnDialog);
    }
  }

  hideCancel(): boolean {
    return this.act == "confirm_only";
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  getCloseButtonContent(): string {
    return `${this.translatedLangText.CLOSE}`;
  }
}
