import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";
import { api_endpoints } from "app/api-endpoints";

@Injectable({ providedIn: 'root' })
export class EmailApiService {
  constructor(private api: ApiService) { }

  email(tankNo: string, eirGroupGuid: string, receipient: string[]): Observable<any> {
    const endpoint = api_endpoints.email;
    return this.api.post<any>(endpoint, { tankNo, eirGroupGuid, receipient });
  }
}
