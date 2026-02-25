import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

const baseUrl = 'http://localhost:3000'

@Injectable({
  providedIn: 'root',
})
export class TestService {
  constructor(private _http: HttpClient) {}

  getProducts(): Observable<any> {
    return this._http
      .get<any>(`${baseUrl}/products`)
      .pipe(retry(3), catchError(this.handleError));
  }

  handleError(err: HttpErrorResponse) {
    return throwError(() => new Error(err.message));
  }
}