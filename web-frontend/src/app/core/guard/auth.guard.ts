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
    if (this.authService.currentUserValue && this.authService.currentUserValue.token) {
      // Logged-in user

      const expectedFunctions = route.data['expectedFunctions'];
      if (expectedFunctions) {
        const start = performance.now();
        const hasFunc = this.authService.hasFunctions(expectedFunctions);
        const duration = performance.now() - start;

        if (duration > 10) {
          console.warn(
            `[AuthGuard] hasFunctions() check took ${duration.toFixed(2)} ms for route: ${state.url}`
          );
        }

        if (!hasFunc) {
          this.router.navigate(['not-authorized']);
          return false;
        }
      }

      // const expectedRole = route.data['expectedRole'];
      // if (expectedRole && !this.authService.hasRole(expectedRole)) {
      //   this.router.navigate(['not-authorized']);
      //   return false;
      // }

      return true;
    } else {
      this.router.navigate(['/authentication/signin-staff']);
      return false;
    }
  }
}
