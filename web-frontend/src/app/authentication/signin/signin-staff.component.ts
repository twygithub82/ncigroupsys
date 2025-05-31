import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
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

  SOFTWARE_NAME = 'SOFTWARE-NAME.TEXT'
  SIGNIN = 'LANDING-SIGNIN.SIGNIN'
  WELCOME = 'LANDING-SIGNIN.WELCOME'
  ADMIN = 'LANDING-SIGNIN.ADMIN'
  PORTAL = 'LANDING-SIGNIN.PORTAL'
  USERNAME = 'LANDING-SIGNIN.USERNAME'
  PASSWORD = 'LANDING-SIGNIN.PASSWORD'
  REMEMBER = 'LANDING-SIGNIN.REMEMBER'
  FORGOTPASSWORD = 'LANDING-SIGNIN.FORGOTPASSWORD'
  LOGIN = 'LANDING-SIGNIN.LOGIN'
  AUTH_CAPTION = 'LANDING-SIGNIN.AUTH-CAPTION'

  PROCEDURE_REQUIRED = 'COMMON-FORM.IS-REQUIRED'

  rememberMe = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    const rememberedUsername = this.authService.getRememberedUsername();
    this.authForm = this.formBuilder.group({
      username: [rememberedUsername, Validators.required],
      password: ['P@ssw0rd', Validators.required], // TODO:: remove after
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
              this.error = 'Invalid Login';
            }
          },
          error: (error) => {
            console.log(error);
            this.error = 'Error login';
            this.submitted = false;
            this.loading = false;
          },
        });
    }
  }

  get caption() {
    return environment.companyNameShort;
  }
}
