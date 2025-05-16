import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";
import { api_endpoints } from "app/api-endpoints";

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private api: ApiService) { }

  login(username: string, password: string, isStaff: boolean): Observable<any> {
    const endpoint = isStaff ? api_endpoints.staff_auth : api_endpoints.user_auth;
    return this.api.post<any>(endpoint, { username, password });
  }

  // logout(): Observable<any> {
  //   return this.api.post('auth/logout', {});
  // }

  refreshToken(refreshToken: string, isStaff: boolean): Observable<any> {
    const endpoint = isStaff ? api_endpoints.staff_refresh_token : api_endpoints.user_refresh_token;
    return this.api.post<any>(endpoint, { refreshToken });
  }

  forgotPassword(email: string): Observable<any> {
    const endpoint = `${api_endpoints.user_forgot_password}?mail=${encodeURIComponent(email)}`;
    return this.api.post<any>(endpoint, {});
  }

  resetPasswordPost(password: string, confirmPassword: string, email: string, token: string): Observable<any> {
    const endpoint = api_endpoints.user_post_reset_password;
    return this.api.post<any>(endpoint, { password: password, confirmPassword: confirmPassword, email: email, token: token });
  }

  resetPasswordGet(token: string, email: string): Observable<any> {
    const endpoint = api_endpoints.user_get_reset_password;
    return this.api.get<any>(endpoint, { token: token, email: email });
  }
}
