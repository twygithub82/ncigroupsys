import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) { }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;
    const url = state.url.toLowerCase();

    if (!currentUser?.token) {
      this.router.navigate(['/authentication/signin-staff']);
      return false;
    }

    const isKioskUser = this.authService.isKioskUserInGate() || this.authService.isKioskUserOutGate();
    const isKioskRoute = url.startsWith('/kiosk/');

    if (isKioskUser && !isKioskRoute) {
      this.router.navigateByUrl('/not-authorized');
      return false;
    }

    if (!isKioskUser && isKioskRoute) {
      this.router.navigateByUrl('/not-authorized');
      return false;
    }

    const expectedFunctions = route.data['expectedFunctions'];
    if (expectedFunctions && !this.authService.hasFunctions(expectedFunctions)) {
      this.router.navigateByUrl('/not-authorized');
      return false;
    }

    return true;
  }
}
