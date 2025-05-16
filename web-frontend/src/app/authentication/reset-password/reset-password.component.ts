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
  ],
})
export class ResetPasswordComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  translatedLangText: any = {};
  langText = {
    RESET_PASSWORD: 'COMMON-FORM.RESET-PASSWORD',
    LET_US_HELP_YOU: 'COMMON-FORM.LET-US-HELP-YOU',
    ENTER_EMAIL: 'COMMON-FORM.ENTER-EMAIL',
    EMAIL: 'COMMON-FORM.EMAIL',
    INVALID_EMAIL: 'COMMON-FORM.INVALID-EMAIL',
    SUBMIT: 'COMMON-FORM.SUBMIT',
    LOGIN: 'COMMON-FORM.LOGIN',
    EMAIL_NOT_FOUND: 'COMMON-FORM.EMAIL-NOT-FOUND',
    SOMETHING_WENT_WRONG_TRY_AGAIN_LATER: 'COMMON-FORM.SOMETHING-WENT-WRONG-TRY-AGAIN-LATER'
  }

  authForm!: UntypedFormGroup;
  returnUrl!: string;
  token: string = '';
  email: string = '';
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService
  ) {
    super();
    this.translateLangText();
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];

      // Optionally validate or trigger password reset logic here
      console.log('Token:', this.token);
      console.log('Email:', this.email);
    });

    this.authForm = this.formBuilder.group({
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
    });
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
      const emailForm = this.authForm.get('email');
      if (emailForm) {
        this.subs.sink = this.authService
          .forgotPassword(emailForm.value)
          .subscribe({
            next: (res) => {
              console.log(res)
            },
            error: (error) => {
              if (error.message === 'EMAIL_NOT_FOUND') {
                emailForm.setErrors({ notFound: true })
              } else {
                emailForm.setErrors({ commonError: true })
              }
            },
          });
      }
    }
  }

  onVerifyTokenEmail(token: string, email: string) {

  }
}
