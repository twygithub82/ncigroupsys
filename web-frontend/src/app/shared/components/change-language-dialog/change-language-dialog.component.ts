import { NgClass } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LanguageService } from '@core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Utility } from 'app/utilities/utility';

export interface DialogData {
}

@Component({
  selector: 'app-change-language-dialog',
  templateUrl: './change-language-dialog.component.html',
  styleUrls: ['./change-language-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDividerModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    NgClass,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class ChangeLanguageDialogComponent {
  translatedLangText: any = {};
  langText: any = {
    CANCEL: 'COMMON-FORM.CANCEL',
    CONFIRM: 'COMMON-FORM.CONFIRM',
    ARE_YOU_SURE_DELETE: 'COMMON-FORM.ARE-YOU-SURE-DELETE',
    DELETE: 'COMMON-FORM.DELETE',
    CLOSE: 'COMMON-FORM.CLOSE',
    CONFIRM_DELETE: 'COMMON-FORM.CONFIRM-DELETE',
    REMARKS: 'COMMON-FORM.REMARKS',
    SELECT_LANGUAGE: 'COMMON-FORM.SELECT-LANGUAGE',
  }

  confirmForm?: UntypedFormGroup;

  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'Arabic', flag: 'assets/images/flags/ar.svg', lang: 'ar' },
  ];
  langStoreValue?: string;

  constructor(
    public dialogRef: MatDialogRef<ChangeLanguageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private translate: TranslateService,
    private fb: UntypedFormBuilder,
    public languageService: LanguageService,
  ) {
    this.translateLangText();
    this.langStoreValue = localStorage.getItem('lang') as string;
    this.initForm();
  }

  initForm() {
    this.confirmForm = this.fb.group({
      remarks: [''],
    });
  }

  // onNoClick(): void {
  //   this.dialogRef.close('cancel');
  // }

  // confirm(): void {
  //   if (!this.langStoreValue) {
  //     return;
  //   } else {
  //     const returnDialog: DialogData = {
  //       language: 'confirmed',
  //       remarks: this.confirmForm?.get('remarks')?.value || '',
  //     }
  //     this.dialogRef.close(returnDialog);
  //   }
  // }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  getCloseButtonContent(): string {
    return `${this.translatedLangText.CLOSE}`;
  }

  setLanguage(lang: string) {
    this.langStoreValue = lang;
    this.languageService.setLanguage(this.langStoreValue);
    const returnDialog: DialogData = {
      language: 'confirmed',
    }
    this.dialogRef.close(returnDialog);
  }
}