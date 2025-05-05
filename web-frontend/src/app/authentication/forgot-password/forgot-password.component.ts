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
  ],
})
export class ForgotPasswordComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  translatedLangText: any = {};
  langText = {
    RESET_PASSWORD: 'COMMON-FORM.RESET-PASSWORD',
    LET_US_HELP_YOU: 'COMMON-FORM.LET-US-HELP-YOU',
    ENTER_EMAIL: 'COMMON-FORM.ENTER-EMAIL',
    EMAIL: 'COMMON-FORM.EMAIL',
    INVALID_EMAIL: 'COMMON-FORM.INVALID-EMAIL',
    SUBMIT: 'COMMON-FORM.SUBMIT',
    LOGIN: 'COMMON-FORM.LOGIN',
  }

  authForm!: UntypedFormGroup;
  returnUrl!: string;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
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

  onSubmit() {
    // stop here if form is invalid
    if (this.authForm.invalid) {
      return;
    } else {
      this.router.navigate(['/dashboard/main']);
    }
  }
}
