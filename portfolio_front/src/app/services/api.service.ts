import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private static baseURL: string = 'http://localhost:8080';
  constructor(private http: HttpClient) { }

  get<T>(url: string): Observable<T> {
    return this.http
      .get<T>(`${ApiService.baseURL}${url}`)
      .pipe(catchError(this.handleError));
  }

  post<T>(url: string, data: any): Observable<T> {
    return this.http
      .post<T>(`${ApiService.baseURL}${url}`, data)
      .pipe(catchError(this.handleError));
  }

  put<T>(url: string, data: any): Observable<T> {
    return this.http
      .put<T>(`${ApiService.baseURL}${url}`, data)
      .pipe(catchError(this.handleError));
  }

  patch<T>(url: string, data: any): Observable<T> {
    return this.http
      .patch<T>(`${ApiService.baseURL}${url}`, data)
      .pipe(catchError(this.handleError));
  }

  delete<T>(url: string): Observable<T> {
    return this.http
      .delete<T>(`${ApiService.baseURL}${url}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    var errorMessage = {
      message: error?.error?.message,
      status: error.status,
    };

    return throwError(() => errorMessage);
  }
}
