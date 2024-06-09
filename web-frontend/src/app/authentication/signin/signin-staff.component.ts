import { Component, OnInit, NgModule } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Utility } from 'app/utilities/utility'
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
    MatCheckboxModule
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
  
  PROCEDURE_REQUIRED = 'COMMON-FORM.IS-REQUIRED'

  rememberMe = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
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
            if (res) {
              if (res) {
                const token = this.authService.currentUserValue.token;
                if (token) {
                  this.router.navigate(['/']);
                }
              } else {
                this.error = 'Invalid Login';
              }
            } else {
              this.error = 'Invalid Login';
            }
          },
          error: (error) => {
            console.log(error)
            this.error = 'Error login';
            this.submitted = false;
            this.loading = false;
          },
        });
    }
  }
}
