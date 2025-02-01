import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from "rxjs";
import { AuthService } from "../service/auth.service";
import { api_endpoints } from "app/api-endpoints";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let accessToken = this.authService.getAccessToken();
    if (accessToken && (request.url.includes(api_endpoints.staff_refresh_token) || request.url.includes(api_endpoints.user_refresh_token))) {
      request = this.addToken(request, accessToken);
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 && !this.isRefreshing) {
            return this.handle401Error(request, next);
          }
          return throwError(() => error);
        })
      );
    }

    const tokenExpiration = this.authService.getTokenExpiration();
    const now = Date.now();
    const timeLeft = tokenExpiration ? tokenExpiration - now : 0;

    if (timeLeft <= 120000 && !this.isRefreshing) {
      return this.refreshTokenAndRetry(request, next);
    }

    if (accessToken) {
      request = this.addToken(request, accessToken);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isRefreshing) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((newToken) => {
          this.isRefreshing = false;
          if (newToken) {
            this.refreshTokenSubject.next(newToken.token);
            request = this.addToken(request, newToken.token);
          }
          return next.handle(request);
        }),
        catchError(error => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => error);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => next.handle(this.addToken(request, token!)))
      );
    }
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private refreshTokenAndRetry(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.authService.refreshToken().pipe(
      switchMap(newToken => {
        this.isRefreshing = false;
        if (newToken) {
          this.refreshTokenSubject.next(newToken.token);
          request = this.addToken(request, newToken.token);
        }
        return next.handle(request);
      }),
      catchError(error => {
        this.isRefreshing = false;
        this.authService.logout();
        return throwError(() => error);
      })
    );
  }
}