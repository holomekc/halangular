import {Observable} from 'rxjs';
import {HalHttpOptions} from './hal-http-options';

export abstract class HalHttpAdapter {

    abstract delete<T>(url: string, options?: HalHttpOptions): Observable<T>;

    abstract get<T>(url: string, options?: HalHttpOptions): Observable<T>;

    abstract head<T>(url: string, options?: HalHttpOptions): Observable<T>;

    abstract options<T>(url: string, options?: HalHttpOptions): Observable<T>;

    abstract patch<T>(url: string, body: any | null, options?: HalHttpOptions): Observable<T>;

    abstract post<T>(url: string, body: any | null, options?: HalHttpOptions): Observable<T>;

    abstract put<T>(url: string, body: any | null, options?: HalHttpOptions): Observable<T>;
}
