import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";
import { emailEndpoints } from "app/api-endpoints";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "environments/environment";

@Injectable({ providedIn: 'root' })
export class EmailApiService {
  private readonly baseUrl = environment.fileManagerURL;

  private readonly defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  // constructor(private api: ApiService) { }
  constructor(private http: HttpClient) { }

  // email(tankNo: string, eirGroupGuid: string, receipient: string[], eirNo?: string): Observable<any> {
  //   const endpoint = emailEndpoints.newEmailJob;
  //   return this.api.post<any>(endpoint, { tankNo, eirGroupGuid, receipient, eirNo });
  // }

  email(tankNo: string, eirGroupGuid: string, receipient: string[], type: string, cc_addresses: string[] = [], bcc_addresses: string[] = [], eirNo?: string): Observable<any> {
    const params = {
      to_addresses: receipient,
      eir_group_guid: eirGroupGuid,
      tank_no: tankNo,
      type: type,
      cc_addresses: cc_addresses,
      bcc_addresses: bcc_addresses,
    }
    return this.http.post<any>(`${this.baseUrl}${emailEndpoints.newEmailJob}`, params, {
      headers: this.defaultHeaders,
      responseType: 'json' as const
    });
  }
}
