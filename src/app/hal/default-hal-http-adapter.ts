import {HalHttpAdapter} from './hal-http-adapter';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {HalHttpOptions} from './hal-http-options';

@Injectable({
  providedIn: 'root'
})
export class DefaultHalHttpAdapter extends HalHttpAdapter {

  constructor(private httpClient: HttpClient) {
    super();
  }

  private static addDefaultHeaders(options?: any) {
    if (!options) {
      options = {};
    }
    if (!options.headers) {
      options.headers = {};
    }
    options.headers['Content-Type'] = 'application/hal+json';
    return options;
  }


  delete<T>(url: string, options?: HalHttpOptions): Observable<T> {
    options = DefaultHalHttpAdapter.addDefaultHeaders(options);
    return this.httpClient.delete<T>(url, this.toHttpClientOptions(options));
  }

  private toHttpClientOptions(options: HalHttpOptions): {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
      [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  } {
    return options;
  }

  get<T>(url: string, options?: HalHttpOptions): Observable<T> {
    options = DefaultHalHttpAdapter.addDefaultHeaders(options);
    return this.httpClient.get<T>(url, this.toHttpClientOptions(options));
  }

  head<T>(url: string, options?: HalHttpOptions): Observable<T> {
    options = DefaultHalHttpAdapter.addDefaultHeaders(options);
    return this.httpClient.head<T>(url, this.toHttpClientOptions(options));
  }

  options<T>(url: string, options?: HalHttpOptions): Observable<T> {
    options = DefaultHalHttpAdapter.addDefaultHeaders(options);
    return this.httpClient.options<T>(url, this.toHttpClientOptions(options));
  }

  patch<T>(url: string, body: any | null, options?: HalHttpOptions): Observable<T> {
    options = DefaultHalHttpAdapter.addDefaultHeaders(options);
    return this.httpClient.patch<T>(url, body, this.toHttpClientOptions(options));
  }

  post<T>(url: string, body: any | null, options?: HalHttpOptions): Observable<T> {
    options = DefaultHalHttpAdapter.addDefaultHeaders(options);
    return this.httpClient.post<T>(url, body, this.toHttpClientOptions(options));
  }

  put<T>(url: string, body: any | null, options?: HalHttpOptions): Observable<T> {
    options = DefaultHalHttpAdapter.addDefaultHeaders(options);
    return this.httpClient.put<T>(url, body, this.toHttpClientOptions(options));
  }

}
