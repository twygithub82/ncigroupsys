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
  constructor(private http: HttpClient) {
  }

  uploadFiles(filesWithMetadata: { file: File, metadata: any }[]): Observable<any> {
    // Create a new FormData object
    const formData = new FormData();

    // Append each file and its corresponding metadata to the FormData object
    filesWithMetadata.forEach((item, index) => {
      formData.append(`files`, item.file, item.file.name); // Append file with a unique key
      formData.append(`metadata`, JSON.stringify(item.metadata)); // Append corresponding metadata with the same key index
    });

    // Make the POST request to upload the files
    return this.http.post<any>(`${environment.fileManagerURL}${uploadEndpoints.uploadFiles}`, formData)
      .pipe(
        map(response => {
          // Process the response if necessary
          return response;
        })
      );
  }
}
