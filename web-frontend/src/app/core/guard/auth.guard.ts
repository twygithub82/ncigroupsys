import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) { }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.currentUserValue && this.authService.currentUserValue.token) {
      const expectedRole = route.data['expectedRole'];
      if (!this.authService.hasRole(expectedRole)) {
        this.router.navigate(['not-authorized']);
        return false;
      }
      return true;
    } else {
      this.router.navigate(['/authentication/signin-staff']);
      return false;
    }
  }
}
