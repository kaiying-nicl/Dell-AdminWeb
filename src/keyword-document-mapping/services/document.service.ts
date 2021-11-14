import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, retry } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Document } from '../models/document-model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http: HttpClient) { }
  baseUrl = `${environment.apiBaseUrl}/Documents`;

  getDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(this.baseUrl)
      .pipe(
        retry(1),
        catchError(this.errorHandling<Document[]>(`getDocuments`))
      );
  }

  private errorHandling<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }
}
