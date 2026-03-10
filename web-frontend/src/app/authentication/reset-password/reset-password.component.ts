import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateService } from '@ngx-translate/core';
import { Utility } from 'app/utilities/utility';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { AuthService } from '@core/service/auth.service';
import { ComponentUtil } from 'app/utilities/component-util';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize, merge } from 'rxjs';
import { environment } from 'environments/environment';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatDividerModule,
  ],
})
export class ResetPasswordComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  translatedLangText: any = {};
  langText = {
    CHANGE_PASSWORD: 'COMMON-FORM.CHANGE-PASSWORD',
    LET_US_HELP_YOU: 'COMMON-FORM.LET-US-HELP-YOU',
    ENTER_EMAIL: 'COMMON-FORM.ENTER-EMAIL',
    NEW_PASSWORD: 'COMMON-FORM.NEW-PASSWORD',
    CREATE_NEW_PASSWORD: 'COMMON-FORM.CREATE-NEW-PASSWORD',
    CONFIRM_PASSWORD: 'COMMON-FORM.CONFIRM-PASSWORD',
    EMAIL: 'COMMON-FORM.EMAIL',
    INVALID_EMAIL: 'COMMON-FORM.INVALID-EMAIL',
    SUBMIT: 'COMMON-FORM.SUBMIT',
    LOGIN: 'COMMON-FORM.LOGIN',
    EMAIL_NOT_FOUND: 'COMMON-FORM.EMAIL-NOT-FOUND',
    SOMETHING_WENT_WRONG_TRY_AGAIN_LATER: 'COMMON-FORM.SOMETHING-WENT-WRONG-TRY-AGAIN-LATER',
    ENTER_NEW_PASSWORD_FOR: 'COMMON-FORM.ENTER-NEW-PASSWORD-FOR',
    DOES_NOT_MATCH: 'COMMON-FORM.DOES-NOT-MATCH',
    SAVE_SUCCESS: 'COMMON-FORM.ACTION-SUCCESS',
    FAILED_TO_CHANGE_PASSWORD: 'COMMON-FORM.FAILED-TO-CHANGE-PASSWORD',
    AUTH_CAPTION: 'LANDING-SIGNIN.AUTH-CAPTION',
    REQUIRED_MIN_LENGTH: "COMMON-FORM.REQUIRED-MIN-LENGTH",
    REQUIRED_UPPERCASE: "COMMON-FORM.REQURED-UPPERCASE",
    REQUIRED_LOWERCASE: "COMMON-FORM.REQUIRED-LOWERCASE",
    REQUIRED_SPECAIL_CHAR: "COMMON-FORM.REQUIRED-SPECAIL-CHAR",
    REQUIRED_NUMBER: "COMMON-FORM.REQUIRED-NUMBER",
    
  }

  authForm!: UntypedFormGroup;
  returnUrl!: string;
  token: string = '';
  email: string = '';
  username: string = '';
  loading: boolean = false;
  hidePsw = true;
  hideCPsw = true;
  cpasswordFirstCheck = true;
   minLen=8;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {
    super();
    this.translateLangText();
    this.initForm();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
      this.username = params['username'];

      // Optionally validate or trigger password reset logic here
      console.log('Token:', this.token);
      console.log('Email:', this.email);
      if (this.token && this.email) {

      } else {
        this.handleTokenEmailInvalid();
        this.router.navigate(['/authentication/signin']); 
      }
    });
    this.initValueChange();
  }

  initForm() {
    this.authForm = this.formBuilder.group({
      npassword: ['',
      [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator
      ]],
      cpassword: ['']
    });
  }

  initValueChange() {
    this.authForm.get('cpassword')!.valueChanges.subscribe(value => {
      const password = this.authForm.get('npassword')?.value;
      const cpassword = this.authForm.get('cpassword');

      if (password !== value) {
        cpassword?.setErrors({ not_match: true });

        if (this.cpasswordFirstCheck) {
          cpassword?.markAsTouched();
          cpassword?.markAsDirty();
          this.cpasswordFirstCheck = false;
        }
      } else {
        cpassword?.setErrors(null);
        this.cpasswordFirstCheck = true;
      }
    });
  }

  passwordValidator(control: any) {
  const value = control.value || '';

  const hasUppercase = /[A-Z]/.test(value);
  const hasLowercase = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  // const minLen = value.length >= 8;
  const valid = hasUppercase && hasLowercase && hasNumber && hasSpecial ;

  return !valid
    ? {
        passwordStrength: {
          hasUppercase,
          hasLowercase,
          hasNumber,
          hasSpecial
          
        }
      }
    : null;
}

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.authForm.invalid) {
      return;
    } else {
      this.loading = true;
      const emailForm = this.email;
      const newPasswordForm = this.authForm.get('npassword');
      const confirmPasswordForm = this.authForm.get('cpassword');
      if (emailForm) {
        this.subs.sink = this.authService
          .resetPassword(newPasswordForm?.value, confirmPasswordForm?.value, emailForm, this.token)
          .pipe(
            finalize(() => {
              this.loading = false; // always run after success or error
            })
          ).subscribe({
            next: (res) => {
              console.log(res)
              if (res.status == "Success") {
                this.handleChangePasswordSuccess();
                this.router.navigate(['/authentication/signin']); // or 'signin-staff' if applicable
              } else {
                this.handleTokenEmailInvalid();
              }
            },
            error: (error) => {
              console.log(error)
            },
          });
      }
    }
  }

  handleChangePasswordSuccess() {
    let successMsg = this.translatedLangText.SAVE_SUCCESS;
    ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
  }

  handleTokenEmailInvalid() {
    let successMsg = this.translatedLangText.FAILED_TO_CHANGE_PASSWORD;
    ComponentUtil.showCustomNotification('check_circle', 'snackbar-error', successMsg, 'top', 'center', this.snackBar)
  }

  get caption() {
    return environment.companyNameShort;
  }

 hasMinLength(): boolean {
  const pwd = this.authForm.get('npassword')?.value || '';
  return pwd.length >= this.minLen;
}
 hasUppercase(): boolean {
  const pwd = this.authForm.get('npassword')?.value || '';
  return /[A-Z]/.test(pwd);
}

hasLowercase(): boolean {
    const pwd = this.authForm.get('npassword')?.value || '';
  return /[a-z]/.test(pwd);
}

hasNumber(): boolean {
    const pwd = this.authForm.get('npassword')?.value || '';
  return /[0-9]/.test(pwd);
}

hasSpecialChar(): boolean {
    const pwd = this.authForm.get('npassword')?.value || '';
  return /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
}
}
