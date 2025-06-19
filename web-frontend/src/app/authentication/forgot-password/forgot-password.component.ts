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
import { finalize } from 'rxjs';
import { ComponentUtil } from 'app/utilities/component-util';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
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
export class ForgotPasswordComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  translatedLangText: any = {};
  langText = {
    FORGOT_PASSWORD: 'COMMON-FORM.FORGOT-PASSWORD',
    LET_US_HELP_YOU: 'COMMON-FORM.LET-US-HELP-YOU',
    ENTER_EMAIL: 'COMMON-FORM.ENTER-EMAIL',
    EMAIL: 'COMMON-FORM.EMAIL',
    INVALID_EMAIL: 'COMMON-FORM.INVALID-EMAIL',
    SUBMIT: 'COMMON-FORM.SUBMIT',
    LOGIN: 'COMMON-FORM.LOGIN',
    EMAIL_NOT_FOUND: 'COMMON-FORM.EMAIL-NOT-FOUND',
    SOMETHING_WENT_WRONG_TRY_AGAIN_LATER: 'COMMON-FORM.SOMETHING-WENT-WRONG-TRY-AGAIN-LATER',
    EMAIL_SENT: 'COMMON-FORM.EMAIL-SENT',
    AUTH_CAPTION: 'LANDING-SIGNIN.AUTH-CAPTION'
  }

  authForm!: UntypedFormGroup;
  returnUrl!: string;
  loading: boolean = false;
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
  }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  handleResetSuccess() {
    let successMsg = this.translatedLangText.EMAIL_SENT;
    ComponentUtil.showCustomNotification('check_circle', 'snackbar-success', successMsg, 'top', 'center', this.snackBar)
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.authForm.invalid) {
      return;
    } else {
      const emailForm = this.authForm.get('email');
      if (emailForm) {
        this.loading = true;
        this.subs.sink = this.authService
          .forgotPassword(emailForm.value)
          .pipe(
            finalize(() => {
              this.loading = false; // always run after success or error
            })
          ).subscribe({
            next: (res) => {
              console.log(res)
              this.handleResetSuccess();
              this.router.navigate(['/authentication/signin-staff']); // or 'signin-staff' if applicable
            },
            error: (error) => {
              if (error.message === 'EMAIL_NOT_FOUND') {
                emailForm.setErrors({ notFound: true })
              } else {
                emailForm.setErrors({ commonError: true })
              }
            }
          });
      }
    }
  }

  get caption() {
    return environment.companyNameShort;
  }
}
