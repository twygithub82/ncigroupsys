import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, Router, NavigationStart, NavigationEnd, RouterModule } from '@angular/router';
import { PageLoaderComponent } from './layout/page-loader/page-loader.component';
import { AuthService } from '@core/service/auth.service';
import { Subscription, timer, fromEvent, merge } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime } from 'rxjs/operators';
import { RefreshTokenDialogComponent } from '@shared/components/refresh-token-dialog/refresh-token-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageLoaderComponent,

  ],
  providers: [],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private isRefreshing = false; // Prevent multiple simultaneous refresh calls
  private refreshPromptTimer: Subscription | null = null;
  private userActivitySubscription: Subscription | null = null;

  currentUrl!: string;
  constructor(public _router: Router, private authService: AuthService, private dialog: MatDialog, private router: Router) {
    this._router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.currentUrl = routerEvent.url.substring(
          routerEvent.url.lastIndexOf('/') + 1
        );
      }
      if (routerEvent instanceof NavigationEnd) {
        /* empty */
      }
      window.scrollTo(0, 0);
    });
  }

  ngOnInit() {
    this.startAutoLogoutTimer();
    this.detectUserActivity();
    this.authService.tokenRefreshed.subscribe(() => this.resetAutoLogoutTimer());
    this.authService.userLoggedOut.subscribe(() => {
      this.clearAllTimers();
      this.userActivitySubscription?.unsubscribe();
      this.router.navigate(['/authentication/signin-staff']);
    });
  }

  ngOnDestroy() {
    this.clearAllTimers();
    this.userActivitySubscription?.unsubscribe();
  }

  private detectUserActivity() {
    const activityEvents: Array<keyof DocumentEventMap> = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
  
    this.userActivitySubscription = merge(
      ...activityEvents.map(event => fromEvent<MouseEvent | KeyboardEvent | TouchEvent>(document, event))
    )
      .pipe(debounceTime(500)) // Prevent excessive calls (wait 500ms before reacting)
      .subscribe(() => {
        const tokenExpiration = this.authService.getTokenExpiration();
        const now = Date.now();
        const timeLeft = tokenExpiration ? tokenExpiration - now : 0; // Remaining token time in ms
  
        if (timeLeft > 300000) {
          console.log('User is active - but still > 300000...');
          return;
        }
        if (this.isRefreshing) {
          console.log('User is active - but refreshing...');
          return;
        }
  
        console.log('User is active - start refresh token...');
        this.isRefreshing = true; // Set flag to avoid duplicate requests
  
        this.authService.refreshToken().subscribe({
          next: () => {
            console.log('Token refreshed due to user activity');
            this.isRefreshing = false; // Reset flag after successful refresh
          },
          error: () => {
            console.error('Token refresh failed - Logging out user');
            this.isRefreshing = false; // Reset flag on failure
            this.authService.logout();
          }
        });
      });
  }

  private startAutoLogoutTimer() {
    const tokenExpiration = this.authService.getTokenExpiration();
    if (!tokenExpiration) return;

    const now = Date.now();
    const expiresInMs = tokenExpiration - now;
    const refreshPromptTime = expiresInMs - 60000;

    console.log(`Token expired in ${expiresInMs}`);
    if (expiresInMs <= 0) {
      this.authService.logout();
    } else {
      // Set a timer to prompt for refresh 1 minute before expiration
      if (refreshPromptTime > 0) {
        this.refreshPromptTimer = timer(refreshPromptTime).subscribe(() => {
          this.showRefreshDialog();
        });
      }
    }
  }

  private clearAllTimers() {
    this.refreshPromptTimer?.unsubscribe();
    this.refreshPromptTimer = null;
  }

  private resetAutoLogoutTimer() {
    console.log('resetAutoLogoutTimer');
    this.clearAllTimers();
    this.startAutoLogoutTimer();
  }

  private showRefreshDialog() {
    const dialogRef = this.dialog.open(RefreshTokenDialogComponent, {
      width: '800px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response === 'renew') {
        console.log('User selected renew');
        this.authService.refreshToken().subscribe({
          next: () => {
          },
          error: () => {
            console.error('Token refresh failed - Logging out user');
            this.authService.logout();
          }
        });
      } else if (response === 'logout') {
        console.log('User selected logout');
        this.authService.logout();
      } else if (response === 'timeout') {
        console.log('Auto logout');
        this.authService.logout();
      } else {
        console.log('User declined token refresh - Logout will proceed on expiration');
      }
    });
  }
}
