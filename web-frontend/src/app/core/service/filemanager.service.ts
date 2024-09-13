import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, throwError } from 'rxjs';
import { User } from '../models/user';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'environments/environment';
import { api_endpoints, uploadEndpoints } from 'app/api-endpoints';
import { decodeToken } from 'app/utilities/jwt-util';
import { jwt_mapping } from 'app/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class FileManagerService {
  public loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  uploadFiles(filesWithMetadata: { file: File, metadata: any }[]): Observable<any> {
    const formData = new FormData();

    filesWithMetadata.forEach((item) => {
      formData.append(`files`, item.file, item.file.name);
      formData.append(`metadata`, JSON.stringify(item.metadata));
    });

    return this.http.post<any>(`${environment.fileManagerURL}${uploadEndpoints.uploadFiles}`, formData)
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  getFileUrlByGroupGuid(groupGuids: string[]): Observable<any> {
    this.loadingSubject.next(true);
    const requestBody = groupGuids;

    // Make the POST request with application/json content type
    return this.http.post<any>(`${environment.fileManagerURL}${uploadEndpoints.getFileUrlByGroupGuid}`, requestBody, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      map(response => {
        this.loadingSubject.next(false);
        return response;
      })
    );
  }

  deleteFile(imageUrls: string[]): Observable<any> {
    // Create a new FormData object
    const filenames = imageUrls.map(url => {
      const filenameWithExtension = url.split('/').pop(); // Extract the filename with extension
      return filenameWithExtension?.split('.').slice(0, -1).join('.'); // Remove the extension
    });
    const requestBody = filenames;
    // Make the POST request with application/json content type
    return this.http.request<any>('DELETE', `${environment.fileManagerURL}${uploadEndpoints.deleteFile}`, {
      body: requestBody,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      map(response => {
        // Process the response if necessary
        return response;
      })
    );
  }
}
