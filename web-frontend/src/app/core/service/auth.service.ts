import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtPayload } from '@core/models/JwtPayload';
import { jwt_mapping } from 'app/api-endpoints';
import { decodeToken } from 'app/utilities/jwt-util';
import { BehaviorSubject, Observable, Subject, catchError, map, of, throwError } from 'rxjs';
import { User, UserToken } from '../models/user';
import { AuthApiService } from './auth-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userKey = 'currentUser';
  private tokenKey = 'userToken';
  private rememberMyKey = 'rememberMe';
  private usernameKey = 'username';

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  tokenRefreshed = new Subject<void>();
  userLoggedIn = new Subject<void>();
  userLoggedOut = new Subject<void>();

  constructor(private http: HttpClient, private authApiService: AuthApiService) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem(this.userKey) || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get currentUserName(): string {
    return this.currentUserSubject.value?.name;
  }

  public get currentUserIsStaff(): boolean {
    return !!this.currentUserSubject.value?.isStaff;
  }

  // login(username: string, password: string, isStaff: boolean, rememberMe: boolean): Observable<any> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   const endpoint = isStaff ? api_full_endpoints.staff_auth : api_full_endpoints.user_auth;
  //   const url = `${endpoint}`
  //   const body = { username, password };
  //   if (rememberMe) {
  //     localStorage.setItem(this.rememberMyKey, 'true');
  //     localStorage.setItem(this.usernameKey, body.username);
  //   } else {
  //     localStorage.removeItem(this.rememberMyKey);
  //     localStorage.removeItem(this.usernameKey);
  //   }
  //   return this.http.post<any>(url, body, { headers })
  //     .pipe(
  //       map(user => {
  //         if (user && user.token) {
  //           const decodedToken = decodeToken(user.token);
  //           var usr = new User;
  //           usr.name = decodedToken[jwt_mapping.name.key]
  //           usr.email = decodedToken[jwt_mapping.email.key]
  //           usr.groupsid = decodedToken[jwt_mapping.groupsid.key]
  //           usr.role = decodedToken[jwt_mapping.role.key]
  //           usr.roles = [decodedToken[jwt_mapping.role.key]]
  //           usr.primarygroupsid = decodedToken[jwt_mapping.primarygroupsid.key]
  //           usr.token = decodedToken;
  //           usr.plainToken = user.token;
  //           usr.expiration = user.expiration;
  //           usr.refreshToken = user.refreshToken;
  //           usr.isStaff = isStaff;

  //           const userToken = new UserToken;
  //           userToken.token = usr.plainToken;
  //           userToken.expiration = usr.expiration;
  //           userToken.refreshToken = usr.refreshToken;

  //           localStorage.setItem(this.userKey, JSON.stringify(usr));
  //           localStorage.setItem(this.tokenKey, JSON.stringify(userToken));
  //           this.currentUserSubject.next(usr);
  //           this.tokenRefreshed.next();
  //           this.userLoggedIn.next();
  //         }
  //         return user;
  //       }),
  //       catchError(error => {
  //         this.logout();
  //         return throwError(() => error);
  //       })
  //     );
  // }

  login(username: string, password: string, isStaff: boolean, rememberMe: boolean): Observable<any> {
    if (rememberMe) {
      localStorage.setItem(this.rememberMyKey, 'true');
      localStorage.setItem(this.usernameKey, username);
    } else {
      localStorage.removeItem(this.rememberMyKey);
      localStorage.removeItem(this.usernameKey);
    }

    const authRequest$ = this.authApiService.login(username, password, isStaff);

    return authRequest$.pipe(
      map(user => {
        if (user && user.token) {
          const decodedToken = decodeToken(user.token);

          const usr = new User();
          usr.name = decodedToken[jwt_mapping.name.key];
          usr.email = decodedToken[jwt_mapping.email.key];
          usr.groupsid = decodedToken[jwt_mapping.groupsid.key];
          usr.role = decodedToken[jwt_mapping.role.key];
          usr.roles = [usr.role];
          usr.primarygroupsid = decodedToken[jwt_mapping.primarygroupsid.key];
          usr.token = decodedToken;
          usr.plainToken = user.token;
          usr.expiration = user.expiration;
          usr.refreshToken = user.refreshToken;
          usr.isStaff = isStaff;

          const userToken = new UserToken();
          userToken.token = usr.plainToken;
          userToken.expiration = usr.expiration;
          userToken.refreshToken = usr.refreshToken;

          localStorage.setItem(this.userKey, JSON.stringify(usr));
          localStorage.setItem(this.tokenKey, JSON.stringify(userToken));

          this.currentUserSubject.next(usr);
          this.tokenRefreshed.next();
          this.userLoggedIn.next();
        }

        return user;
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  // refreshToken(): Observable<UserToken | null> {
  //   const currentRefreshToken = this.getRefreshToken();
  //   if (!currentRefreshToken) {
  //     this.logout();
  //     return of(null);;
  //   }

  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   const endpoint = this.currentUserIsStaff ? api_full_endpoints.staff_refresh_token : api_full_endpoints.user_refresh_token;
  //   const url = `${endpoint}`
  //   const body = { refreshToken: currentRefreshToken };
  //   console.log('refreshToken body: ', body)
  //   return this.http.post<any>(url, body, { headers })
  //     .pipe(
  //       map(response => {
  //         const expTime = new Date(response.expiration).getTime();
  //         const now = Date.now();

  //         console.log('refreshToken body: ', body)
  //         // Reject if new token is about to expire in < 5 min
  //         // if (expTime - now < 5 * 60 * 1000) {
  //         //   throw new Error('Received a near-expired token, aborting');
  //         // }

  //         const userToken = new UserToken();
  //         userToken.token = response.token;
  //         userToken.expiration = response.expiration;
  //         userToken.refreshToken = response.refreshToken;

  //         localStorage.setItem('userToken', JSON.stringify(userToken));
  //         this.tokenRefreshed.next();
  //         console.log('token is refreshed: ', userToken);

  //         return userToken;
  //       }),
  //       catchError(error => {
  //         this.logout();
  //         return throwError(() => error);
  //       })
  //     );
  // }

  refreshToken(): Observable<UserToken | null> {
    const currentRefreshToken = this.getRefreshToken();
    if (!currentRefreshToken) {
      this.logout();
      return of(null);
    }

    const refreshRequest$ = this.authApiService.refreshToken(currentRefreshToken, this.currentUserIsStaff)

    return refreshRequest$.pipe(
      map(response => {
        const expTime = new Date(response.expiration).getTime();
        const now = Date.now();

        // Optional: uncomment to reject short-lived token
        // if (expTime - now < 5 * 60 * 1000) {
        //   throw new Error('Received a near-expired token, aborting');
        // }

        const userToken = new UserToken();
        userToken.token = response.token;
        userToken.expiration = response.expiration;
        userToken.refreshToken = response.refreshToken;

        localStorage.setItem(this.tokenKey, JSON.stringify(userToken));
        this.tokenRefreshed.next();

        return userToken;
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.authApiService.forgotPassword(email).pipe(
      map(response => response),
      catchError((error: HttpErrorResponse) => {
        const msg = error.error?.message?.[0];

        if (error.status === 400 && msg === 'The email is not yet registered') {
          return throwError(() => new Error('EMAIL_NOT_FOUND'));
        }

        return throwError(() => new Error('GENERIC_ERROR'));
      })
    );
  }

  resetPassword(password: string, confirmPassword: string, email: string, token: string): Observable<any> {
    return this.authApiService.resetPassword(password, confirmPassword, email, token).pipe(
      map(response => response),
      catchError((error: HttpErrorResponse) => {
        const msg = error.error?.message?.[0];

        if (error.status === 400) {
          return throwError(() => new Error('INVALID_TOKEN'));
        }

        return throwError(() => new Error('GENERIC_ERROR'));
      })
    );
  }

  ok(body?: {
    id: number;
    img: string;
    username: string;
    firstName: string;
    lastName: string;
    token: JwtPayload;
  }) {
    return of(new HttpResponse({ status: 200, body }));
  }
  error(message: string) {
    return throwError(message);
  }

  logout() {
    // remove local storage when log user out
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(new User);
    this.userLoggedOut.next();
    return of({ success: false });
  }

  getRememberedUsername(): string | null {
    return localStorage.getItem(this.rememberMyKey) === 'true' ? localStorage.getItem(this.usernameKey) : null;
  }

  getDecodedToken(): any {
    // const token = this.currentUserValue?.token;
    // return token ? decodeToken(token) : null;
  }

  getAccessToken(): string | null {
    const userToken = JSON.parse(localStorage.getItem('userToken') || '{}');
    return userToken?.token || null;
  }

  getRefreshToken(): string | null {
    const userToken = JSON.parse(localStorage.getItem('userToken') || '{}');
    return userToken?.refreshToken || null;
  }

  getTokenExpiration(): number | null {
    const userToken = JSON.parse(localStorage.getItem(this.tokenKey) || '{}');
    if (!userToken?.expiration) return null;
    return new Date(userToken.expiration).getTime(); // Convert to milliseconds
  }

  hasRole(expectedRoles: string[] | undefined): boolean {
    const userRoles = this.currentUserValue?.roles || [];
    const userRole = this.currentUserValue?.role || '';
    // If no specific role is required, as long as the user is logged in, return true
    if (!expectedRoles || expectedRoles.length === 0) {
      return !!this.currentUserValue.token;
    }

    // Check if any of the user's roles match any of the expected roles
    return userRoles.some(userRole => userRole.toLowerCase() === 'sa') || expectedRoles.some(role => userRoles.some(userRole => userRole.toLowerCase() === role.toLowerCase())) || expectedRoles.some(role => role.toLowerCase() === userRole.toLowerCase());
  }
}
