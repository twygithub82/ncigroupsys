
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from 'app/app.component';
import { appConfig } from 'app/app.config';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';
import { importProvidersFrom } from '@angular/core';


bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));