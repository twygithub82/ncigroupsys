import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, throwError } from 'rxjs';
import { User } from '../models/user';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { JwtPayload } from '@core/models/JwtPayload';
import { environment } from 'environments/environment';
import { api_endpoints } from 'app/api-endpoints';
import { decodeToken } from 'app/utilities/jwt-util';
import { jwt_mapping } from 'app/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get currentUserName(): string {
    return this.currentUserSubject.value?.name;
  }

  login(username: string, password: string, isStaff: boolean, rememberMe: boolean): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const loginUrl = environment.apiUrl;
    const endpoint = isStaff ? api_endpoints.staff_auth : api_endpoints.user_auth;
    const url = `${loginUrl}${endpoint}`
    const body = { username, password };
    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('username', body.username);
    } else {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('username');
    }
    return this.http.post<any>(url, body, { headers })
      .pipe(map(user => {
        if (user && user.token) {

          const decodedToken = decodeToken(user.token);
          var usr = new User;
          usr.name = decodedToken[jwt_mapping.name.key]
          usr.email = decodedToken[jwt_mapping.email.key]
          usr.groupsid = decodedToken[jwt_mapping.groupsid.key]
          usr.role = decodedToken[jwt_mapping.role.key]
          usr.roles = [decodedToken[jwt_mapping.role.key]]
          usr.primarygroupsid = decodedToken[jwt_mapping.primarygroupsid.key]
          usr.token = decodedToken;
          usr.plainToken = user.token;
          usr.expiration = user.expiration;
          usr.refreshToken = user.refreshToken;
          
          localStorage.setItem('currentUser', JSON.stringify(usr));
          localStorage.setItem('currentToken', user.token);
          this.currentUserSubject.next(usr);
        }
        return user;
      }));
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
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentToken');
    this.currentUserSubject.next(new User);
    return of({ success: false });
  }

  getRememberedUsername(): string | null {
    return localStorage.getItem('rememberMe') === 'true' ? localStorage.getItem('username') : null;
  }

  getDecodedToken(): any {
    // const token = this.currentUserValue?.token;
    // return token ? decodeToken(token) : null;
  }

  getToken(): any {
    return localStorage.getItem('currentToken');
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
