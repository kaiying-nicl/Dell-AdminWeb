import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, retry } from 'rxjs';
import { Keyword, KeywordPostBody, MappingPostBody } from '../models/keyword-model';
import { environment } from 'src/environments/environment';
import { Document } from '../models/document-model';

@Injectable({
  providedIn: 'root'
})

export class KeywordService {

  constructor(private http: HttpClient) { }
  baseUrl = `${environment.apiBaseUrl}/Keywords`;

  getKeywords(): Observable<Keyword[]> {
    return this.http.get<Keyword[]>(this.baseUrl)
      .pipe(
        retry(1),
        catchError(this.errorHandling<Keyword[]>(`getKeywords`))
      );
  }

  deleteKeyword(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`)
      .pipe(
        retry(1),
        catchError(this.errorHandling<Keyword[]>(`deleteKeyword id=${id}`))
      );
  }

  addKeyword(value: string): Observable<any> {
    var postBody = new KeywordPostBody(value);
    return this.http.post(`${this.baseUrl}`, postBody)
      .pipe(
        catchError(this.errorHandling<Keyword[]>(`addKeyword value=${value}`))
      );
  }

  updateKeyword(keyword: Keyword): Observable<any> {
    return this.http.put(`${this.baseUrl}`, keyword)
      .pipe(
        catchError(this.errorHandling<Keyword[]>(`updateKeyword keyword=${keyword}`))
      );
  }

  getMappings(keywordId: number): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.baseUrl}/${keywordId}/mappings`)
      .pipe(
        retry(1),
        catchError(this.errorHandling<Document[]>(`getMappings`))
      );
  }

  updateMappings(keywordId: number, documentIds: number[]): Observable<any> {
    var postBody = new MappingPostBody(documentIds);
    return this.http.put(`${this.baseUrl}/${keywordId}/mappings`, postBody)
      .pipe(
        catchError(this.errorHandling<Keyword[]>(`updateMappings keywordId=${keywordId}, documentIds=${documentIds.toString()}`))
      );
  }

  private errorHandling<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }
}
