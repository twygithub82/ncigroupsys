import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { JwtPayload } from '@core/models/JwtPayload';
import { Apollo } from 'apollo-angular';
import { jwt_mapping } from 'app/api-endpoints';
import { UserCustomerDS } from 'app/data-sources/user-customer';
import { decodeToken } from 'app/utilities/jwt-util';
import { BehaviorSubject, Observable, Subject, catchError, forkJoin, map, of, switchMap, throwError } from 'rxjs';
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
  private clientCompanyKey = 'clientCompany';

  private userCustomerDS?: UserCustomerDS;

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  tokenRefreshed = new Subject<void>();
  userLoggedIn = new Subject<void>();
  userLoggedOut = new Subject<void>();

  private regexCache = new Map<string, RegExp>();
  private readonly REFRESH_LOCK_KEY = 'tokenRefreshLock';
  private readonly REFRESH_LOCK_TTL_MS = 15000;

  constructor(private http: HttpClient, private authApiService: AuthApiService, private injector: Injector) {
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

  login(username: string, password: string, isStaff: boolean, rememberMe: boolean): Observable<any> {
    if (!this.userCustomerDS) {
      this.userCustomerDS = this.injector.get(UserCustomerDS);
    }
    if (rememberMe) {
      localStorage.setItem(this.rememberMyKey, 'true');
      localStorage.setItem(this.usernameKey, username);
    } else {
      localStorage.removeItem(this.rememberMyKey);
      localStorage.removeItem(this.usernameKey);
    }

    return this.authApiService.login(username, password, isStaff).pipe(
      switchMap(user => {
        if (user?.nextAction === "1" || user?.nextAction === "2") {
          return of(user); // caller checks nextAction and opens the appropriate popup
        }
        if (!user?.token) throw new Error('No token in login response');
        const decodedToken = decodeToken(user.token);
        const userId = decodedToken[jwt_mapping.sid.key] ?? decodedToken[jwt_mapping.sid.value];

        // Set the plain token in advance so interceptor works for getUserClaims
        const tempUserToken = new UserToken();
        tempUserToken.token = user.token;
        tempUserToken.expiration = user.expiration;
        tempUserToken.refreshToken = user.refreshToken;
        localStorage.setItem(this.tokenKey, JSON.stringify(tempUserToken));

        if (!userId) {
          console.log(`unexpected login token occurred: `, decodedToken)
        }
        return forkJoin({
          claims: this.authApiService.getUserClaims(userId),
          userCustomer: this.userCustomerDS!.getUserCustomerByUserId(userId)
        }).pipe(
          map(({ claims, userCustomer }) => {
            const guids = userCustomer.map(uc => uc.customer_company_guid);
            localStorage.setItem(this.clientCompanyKey, JSON.stringify(guids));

            const usr = new User();
            usr.id = userId;
            usr.name = decodedToken[jwt_mapping.name.key] ?? decodedToken[jwt_mapping.name.value];
            usr.email = decodedToken[jwt_mapping.email.key] ?? decodedToken[jwt_mapping.email.value];
            usr.groupsid = decodedToken[jwt_mapping.groupsid.key] ?? decodedToken[jwt_mapping.groupsid.value];
            usr.role = decodedToken[jwt_mapping.role.key] ?? decodedToken[jwt_mapping.role.value];
            usr.roles = claims.roles ?? [usr.role];
            usr.functions = claims.functions ?? [];
            usr.primarygroupsid = decodedToken[jwt_mapping.primarygroupsid.key] ?? decodedToken[jwt_mapping.primarygroupsid.value];
            usr.token = decodedToken;
            usr.plainToken = user.token;
            usr.expiration = user.expiration;
            usr.refreshToken = user.refreshToken;
            usr.isStaff = isStaff;
            usr.userdata = JSON.parse(decodedToken.userdata);

            localStorage.setItem(this.userKey, JSON.stringify(usr));
            this.currentUserSubject.next(usr);
            this.tokenRefreshed.next();
            this.userLoggedIn.next();

            return user;
          }),
          catchError(error => {
            this.logout();
            return throwError(() => error);
          })
        );
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  verify2FA(totp: any, mfaToken: string): Observable<any> {
    if (!this.userCustomerDS) {
      this.userCustomerDS = this.injector.get(UserCustomerDS);
    }

    const tempUserToken = new UserToken();
    tempUserToken.token = mfaToken;
    localStorage.setItem(this.tokenKey, JSON.stringify(tempUserToken));

    return this.authApiService.verify2FA(totp).pipe(
      switchMap(user => {
        if (!user?.token) throw new Error('No token in 2FA response');

        const decodedToken = decodeToken(user.token);
        const userId = decodedToken[jwt_mapping.sid.key] ?? decodedToken[jwt_mapping.sid.value];

        const tempUserToken = new UserToken();
        tempUserToken.token = user.token;
        tempUserToken.expiration = user.expiration;
        tempUserToken.refreshToken = user.refreshToken;
        localStorage.setItem(this.tokenKey, JSON.stringify(tempUserToken));

        if (!userId) {
          console.log(`unexpected 2FA token occurred: `, decodedToken);
        }

        return forkJoin({
          claims: this.authApiService.getUserClaims(userId),
          userCustomer: this.userCustomerDS!.getUserCustomerByUserId(userId)
        }).pipe(
          map(({ claims, userCustomer }) => {
            const guids = userCustomer.map(uc => uc.customer_company_guid);
            localStorage.setItem(this.clientCompanyKey, JSON.stringify(guids));

            const usr = new User();
            usr.id = userId;
            usr.name = decodedToken[jwt_mapping.name.key] ?? decodedToken[jwt_mapping.name.value];
            usr.email = decodedToken[jwt_mapping.email.key] ?? decodedToken[jwt_mapping.email.value];
            usr.groupsid = decodedToken[jwt_mapping.groupsid.key] ?? decodedToken[jwt_mapping.groupsid.value];
            usr.role = decodedToken[jwt_mapping.role.key] ?? decodedToken[jwt_mapping.role.value];
            usr.roles = claims.roles ?? [usr.role];
            usr.functions = claims.functions ?? [];
            usr.primarygroupsid = decodedToken[jwt_mapping.primarygroupsid.key] ?? decodedToken[jwt_mapping.primarygroupsid.value];
            usr.token = decodedToken;
            usr.plainToken = user.token;
            usr.expiration = user.expiration;
            usr.refreshToken = user.refreshToken;
            usr.isStaff = true;
            usr.userdata = JSON.parse(decodedToken.userdata);

            localStorage.setItem(this.userKey, JSON.stringify(usr));
            this.currentUserSubject.next(usr);
            this.tokenRefreshed.next();
            this.userLoggedIn.next();

            return user;
          }),
          catchError(error => {
            this.logout();
            return throwError(() => error);
          })
        );
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  refreshToken(): Observable<UserToken | null> {
    // Cross-tab mutex: if another tab is already refreshing, wait for it to finish
    // and reuse the new token it writes to localStorage instead of racing.
    const lockRaw = localStorage.getItem(this.REFRESH_LOCK_KEY);
    if (lockRaw) {
      const lock = JSON.parse(lockRaw);
      if (Date.now() - lock.timestamp < this.REFRESH_LOCK_TTL_MS) {
        return new Observable<UserToken | null>(observer => {
          const poll = setInterval(() => {
            if (!localStorage.getItem(this.REFRESH_LOCK_KEY)) {
              clearInterval(poll);
              const stored = localStorage.getItem(this.tokenKey);
              const userToken = stored ? JSON.parse(stored) : null;
              if (userToken?.token) {
                this.tokenRefreshed.next();
                observer.next(userToken);
              } else {
                observer.next(null);
              }
              observer.complete();
            }
          }, 300);
          setTimeout(() => {
            clearInterval(poll);
            observer.next(null);
            observer.complete();
          }, this.REFRESH_LOCK_TTL_MS + 2000);
        });
      }
    }

    localStorage.setItem(this.REFRESH_LOCK_KEY, JSON.stringify({ timestamp: Date.now() }));

    const currentRefreshToken = this.getRefreshToken();
    if (!currentRefreshToken) {
      localStorage.removeItem(this.REFRESH_LOCK_KEY);
      this.logout();
      return of(null);
    }

    return this.authApiService.refreshToken(currentRefreshToken, this.currentUserIsStaff).pipe(
      map(response => {
        const userToken = new UserToken();
        userToken.token = response.token;
        userToken.expiration = response.expiration;
        userToken.refreshToken = response.refreshToken;

        localStorage.setItem(this.tokenKey, JSON.stringify(userToken));
        localStorage.removeItem(this.REFRESH_LOCK_KEY);
        this.tokenRefreshed.next();

        return userToken;
      }),
      catchError(error => {
        localStorage.removeItem(this.REFRESH_LOCK_KEY);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  forgotPassword(username: string, email?: string): Observable<any> {
    return this.authApiService.forgotPassword(username, email).pipe(
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

  resetStaffPassword(password: string, userName: string): Observable<any> {
    return this.authApiService.resetStaffPassword(password, userName).pipe(
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

  getAccessToken(): string | null {
    const userToken = JSON.parse(localStorage.getItem(this.tokenKey) || '{}');
    return userToken?.token || null;
  }

  getRefreshToken(): string | null {
    const userToken = JSON.parse(localStorage.getItem(this.tokenKey) || '{}');
    return userToken?.refreshToken || null;
  }

  getTokenExpiration(): number | null {
    const userToken = JSON.parse(localStorage.getItem(this.tokenKey) || '{}');
    if (!userToken?.expiration) return null;
    return new Date(userToken.expiration).getTime(); // Convert to milliseconds
  }

  getTeams(type: string) {
    const user = JSON.parse(localStorage.getItem(this.userKey) || '{}');
    if (!user?.userdata?.length) return null;
    return user.userdata.filter((item: any) => item.department === type) || null;
  }

  getTeamsGuid(type: string) {
    const user = JSON.parse(localStorage.getItem(this.userKey) || '{}');
    if (!user?.userdata?.length) return null;
    return user.userdata.filter((item: any) => item.department === type).map((item: any) => item.guid) || null;
  }

  getClientCompany(): string[] {
    const guids = localStorage.getItem(this.clientCompanyKey);
    return guids ? JSON.parse(guids) : [];
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

  hasFunctions(expectedPatterns: string[] | undefined): boolean {
    const userFunctions = this.currentUserValue?.functions || [];

    if (!expectedPatterns || expectedPatterns.length === 0) {
      return !!this.currentUserValue?.token;
    }

    const regexes = expectedPatterns.map(p => this.getRegexFromPattern(p));
    return userFunctions.some(func => regexes.some(r => r.test(func)));
  }

  isKioskUserInGate() {
    const userRoles = this.currentUserValue.roles;
    return userRoles.some((func: string) => func == 'KIOSK_IN_GATE')
  }

  isKioskUserOutGate() {
    const userRoles = this.currentUserValue.roles;
    return userRoles.some((func: string) => func == 'KIOSK_OUT_GATE')
  }

  getLandingPage() {
    if (this.currentUserValue.token && this.isKioskUserInGate()) {
      const kioskYard: any[] = this.currentUserValue?.userdata?.filter((x: any) => x.department == "YARD")
      if (kioskYard?.length) {
        return `/kiosk/${kioskYard[0].description}/in-gate`.toLowerCase();
      }
    }

    if (this.currentUserValue.token && this.isKioskUserOutGate()) {
      const kioskYard: any[] = this.currentUserValue?.userdata?.filter((x: any) => x.department == "YARD")
      if (kioskYard?.length) {
        return `/kiosk/${kioskYard[0].description}/out-gate`.toLowerCase();
      }
    }
    return '/';
  }

  private getRegexFromPattern(pattern: string): RegExp {
    if (this.regexCache.has(pattern)) {
      return this.regexCache.get(pattern)!;
    }

    const safePattern = pattern
      .replace(/[-[\]/{}()+?.\\^$|]/g, '\\$&') // escape regex
      .replace(/\*/g, '.*'); // wildcard to regex

    const regex = new RegExp(`^${safePattern}$`);
    this.regexCache.set(pattern, regex);
    return regex;
  }
}
