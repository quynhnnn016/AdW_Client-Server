import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

const baseUrl = 'http://localhost:3000'

@Injectable({
  providedIn: 'root',
})
export class TestService {
  constructor(private _http: HttpClient) {}

  getProducts(filters?: { name?: string; minPrice?: number | null; maxPrice?: number | null }): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      if (filters.name) params = params.set('name', filters.name);
      if (filters.minPrice !== undefined && filters.minPrice !== null) params = params.set('minPrice', String(filters.minPrice));
      if (filters.maxPrice !== undefined && filters.maxPrice !== null) params = params.set('maxPrice', String(filters.maxPrice));
    }
    return this._http
      .get<any>(`${baseUrl}/products`, { params })
      .pipe(retry(3), catchError(this.handleError));
  }

  getProduct(id: string): Observable<any> {
    return this._http
      .get<any>(`${baseUrl}/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  createProduct(payload: { name: string; price: number }): Observable<any> {
    return this._http
      .post<any>(`${baseUrl}/products`, payload)
      .pipe(catchError(this.handleError));
  }

  updateProduct(id: string, payload: { name: string; price: number }): Observable<any> {
    return this._http
      .patch<any>(`${baseUrl}/${id}`, payload)
      .pipe(catchError(this.handleError));
  }

  deleteProduct(id: string): Observable<any> {
    return this._http
      .delete<any>(`${baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  handleError(err: HttpErrorResponse) {
    return throwError(() => new Error(err.message || 'Server error'));
  }
}