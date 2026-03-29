import { NgClass } from '@angular/common';
import { Component, ElementRef, Inject, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Utility } from 'app/utilities/utility';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface DialogData {
  action: string;
  tokenPayload?: any;
  totp?: string;
}

@Component({
  selector: 'app-twofa-dialog',
  templateUrl: './twofa-dialog.component.html',
  styleUrls: ['./twofa-dialog.component.scss'],
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
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
})
export class TwoFADialogComponent {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;
  tokenPayload: any;
  headerText: string = "";
  initialAction: string;
  act: string;
  translatedLangText: any = {};
  langText: any = {
    CLOSE: 'COMMON-FORM.CLOSE',
    PROCEED_TO_VERIFY: 'COMMON-FORM.PROCEED-TO-VERIFY',
    SUBMIT: 'COMMON-FORM.SUBMIT',
    TOTP_REQUIRED: 'COMMON-FORM.TOTP-REQUIRED',
    SCAN_QR_INSTRUCTION: 'COMMON-FORM.SCAN-QR-INSTRUCTION',
    SCAN_QR_THEN_PROCEED: 'COMMON-FORM.SCAN-QR-THEN-PROCEED',
    ENTER_TOTP_INSTRUCTION: 'COMMON-FORM.ENTER-TOTP-INSTRUCTION',
    TOTP_CODE: 'COMMON-FORM.TOTP-CODE',
    TOTP_INVALID: 'COMMON-FORM.TOTP-INVALID',
    REGISTER_TOTP: 'COMMON-FORM.REGISTER-TOTP',
    VERIFY_TOTP: 'COMMON-FORM.VERIFY-TOTP',
    BACK: 'COMMON-FORM.BACK',
  }

  twoFAForm?: UntypedFormGroup;
  otpIndices = [0, 1, 2, 3, 4, 5];
  private otpDigits: string[] = ['', '', '', '', '', ''];

  constructor(
    public dialogRef: MatDialogRef<TwoFADialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private translate: TranslateService,
    private fb: UntypedFormBuilder,
  ) {
    this.translateLangText();
    // Set the defaults
    this.initForm();
    this.tokenPayload = data.tokenPayload;
    this.initialAction = data.action;
    this.act = data.action;
  }

  initForm() {
    this.twoFAForm = this.fb.group({
      totp: [''],
    });
  }

  onNoClick(): void {
    this.dialogRef.close('cancel');
  }

  next(): void {
    if (this.act === '2' && this.twoFAForm?.invalid) {
      return; // double safeguard
    } else if (this.act === '1') {
      this.act = '2'; // move to 2FA input step
    } else if (this.act === '2' && this.twoFAForm?.valid) {
      const returnDialog: DialogData = {
        action: 'confirmed',
        totp: this.totpControl.value,
      }
      this.dialogRef.close(returnDialog);
    }
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  getHeaderContent(): string {
    if (this.act === '1')
      return `${this.translatedLangText.REGISTER_TOTP}`;
    return `${this.translatedLangText.VERIFY_TOTP}`;
  }

  getSubmitButtonContent(): string {
    if (this.act === '1')
      return `${this.translatedLangText.PROCEED_TO_VERIFY}`;
    return `${this.translatedLangText.SUBMIT}`;
  }

  getCloseButtonContent(): string {
    return `${this.translatedLangText.CLOSE}`;
  }

  get totpControl(): FormControl {
    return this.twoFAForm!.get('totp') as FormControl;
  }

  getOtpDigit(index: number): string {
    return this.otpDigits[index];
  }

  onOtpKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (this.otpDigits[index]) {
        // Clear current box
        this.otpDigits[index] = '';
      } else if (index > 0) {
        // Move back and clear previous
        this.otpDigits[index - 1] = '';
        this.focusBox(index - 1);
      }
      this.syncToFormControl();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      this.focusBox(index - 1);
    } else if (event.key === 'ArrowRight' && index < 5) {
      this.focusBox(index + 1);
    }
  }

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const digit = input.value.replace(/\D/g, '').slice(-1); // only last numeric char

    this.otpDigits[index] = digit;
    input.value = digit; // normalize display

    if (digit && index < 5) {
      this.focusBox(index + 1);
    }

    this.syncToFormControl();
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text') ?? '';
    const digits = pasted.replace(/\D/g, '').slice(0, 6).split('');

    digits.forEach((d, i) => {
      this.otpDigits[i] = d;
    });

    // Fill remaining with empty
    for (let i = digits.length; i < 6; i++) {
      this.otpDigits[i] = '';
    }

    // Sync display values
    const inputs = this.otpInputs.toArray();
    this.otpDigits.forEach((d, i) => {
      if (inputs[i]) inputs[i].nativeElement.value = d;
    });

    // Focus last filled or next empty
    const nextFocus = Math.min(digits.length, 5);
    this.focusBox(nextFocus);
    this.syncToFormControl();
  }

  private focusBox(index: number): void {
    const inputs = this.otpInputs.toArray();
    inputs[index]?.nativeElement.focus();
  }

  private syncToFormControl(): void {
    const combined = this.otpDigits.join('');
    this.totpControl.setValue(combined);
    this.totpControl.markAsTouched();

    if (combined.length === 6) {
      this.totpControl.setErrors(null);
    } else {
      this.totpControl.setErrors({ required: true });
    }
  }

  back() {
    this.act = '1';
    this.otpDigits = ['', '', '', '', '', ''];
    this.twoFAForm?.reset();
  }
}