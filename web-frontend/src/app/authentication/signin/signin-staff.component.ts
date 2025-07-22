import { Direction } from '@angular/cdk/bidi';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ErrorDialogComponent } from '@shared/components/error-dialog/error-dialog.component';
import { ComponentUtil } from 'app/utilities/component-util';
import { Utility } from 'app/utilities/utility';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-signin-staff',
  templateUrl: './signin-staff.component.html',
  styleUrls: ['./signin-staff.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    MatCheckboxModule,
    MatDividerModule,
  ],
})
export class SigninStaffComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  authForm!: UntypedFormGroup;
  submitted = false;
  loading = false;
  error = '';
  hide = true;

  translatedLangText: any = {};
  langText = {
    SOFTWARE_NAME: 'SOFTWARE-NAME.TEXT',
    SIGNIN: 'LANDING-SIGNIN.SIGNIN',
    WELCOME: 'LANDING-SIGNIN.WELCOME',
    ADMIN: 'LANDING-SIGNIN.ADMIN',
    PORTAL: 'LANDING-SIGNIN.PORTAL',
    USERNAME: 'LANDING-SIGNIN.USERNAME',
    PASSWORD: 'LANDING-SIGNIN.PASSWORD',
    REMEMBER: 'LANDING-SIGNIN.REMEMBER',
    FORGOTPASSWORD: 'LANDING-SIGNIN.FORGOTPASSWORD',
    LOGIN: 'LANDING-SIGNIN.LOGIN',
    AUTH_CAPTION: 'LANDING-SIGNIN.AUTH-CAPTION',
    PROCEDURE_REQUIRED: 'COMMON-FORM.IS-REQUIRED',
    FAILED_TO_LOGIN: 'LANDING-SIGNIN.FAILED-TO-LOGIN'
  }

  rememberMe = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
  ) {
    super();
    this.translateLangText();
  }

  ngOnInit() {
    const rememberedUsername = this.authService.getRememberedUsername();
    this.authForm = this.formBuilder.group({
      username: [rememberedUsername, Validators.required],
      password: ['', Validators.required],
    });

    if (rememberedUsername) {
      this.rememberMe = true;
    } else {
      this.rememberMe = false;
    }

    if (this.authService.currentUserValue.token) {
      // User is logged in, navigate to the dashboard or home
      this.router.navigate(['/']);
    }
    this.dialog.closeAll();
  }

  translateLangText() {
    Utility.translateAllLangText(this.translate, this.langText).subscribe((translations: any) => {
      this.translatedLangText = translations;
    });
  }

  get f() {
    return this.authForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.error = '';
    if (this.authForm.invalid) {
      this.error = 'Username and Password not valid !';
      return;
    } else {
      this.subs.sink = this.authService
        .login(this.f['username'].value, this.f['password'].value, true, this.rememberMe)
        .subscribe({
          next: (res) => {
            const token = this.authService.currentUserValue?.token;
            if (token) {
              this.router.navigate(['/']);
            } else {
              // ComponentUtil.showNotification('snackbar-success', this.translatedLangText.FAILED_TO_LOGIN, 'center', 'center', this.snackBar);
              // this.error = 'Invalid Login';
              this.errorDialog();
            }
          },
          error: (error) => {
            // this.error = 'Error login';
            const username = error?.error?.username;
            console.log(username)
            this.errorDialog();
            // ComponentUtil.showNotification('snackbar-success', this.translatedLangText.FAILED_TO_LOGIN, 'center', 'center', this.snackBar);
            this.submitted = false;
            this.loading = false;
          },
        });
    }
  }

  get caption() {
    return environment.companyNameShort;
  }

  errorDialog() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      data: {
        messageText: this.translatedLangText.FAILED_TO_LOGIN,
        action: 'error',
      },
      direction: tempDirection
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    });
  }
}
