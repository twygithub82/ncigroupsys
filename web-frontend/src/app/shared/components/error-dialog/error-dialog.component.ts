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
  cache: any;
  headerText?: any;
  messageText?: string;
  index: number;
}

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogActions,
    MatButtonModule,
    MatDividerModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class ErrorDialogComponent {
  index: number;
  headerText: string;
  messageText: string;
  act: string;
  translatedLangText: any = {};
  langText: any = {
    CANCEL: 'COMMON-FORM.CANCEL',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    ERROR: 'COMMON-FORM.ERROR',
    CLOSE: 'COMMON-FORM.CLOSE',
  }

  confirmForm?: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private translate: TranslateService,
    private fb: UntypedFormBuilder,
  ) {
    this.translateLangText();
    // Set the defaults
    this.initForm();
    this.headerText = data.headerText || this.langText.ERROR;
    this.messageText = data.messageText || '';
    this.index = data.index;
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
      const returnDialog: DialogData = {
        action: 'confirmed',
        cache: this.data.cache,
        index: this.index,
      }
      this.dialogRef.close(returnDialog);
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
