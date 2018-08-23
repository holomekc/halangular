import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Resource} from './resource';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class HalService {

  constructor(private httpClient: HttpClient) {
  }

  public entryPoint<T extends Resource>(url: string, type: { new(): T }): Observable<T> {
    return this.httpClient.get<T>(url, {
      headers: {
        'Accept': 'application/hal+json'
      }
    }).pipe(map(value => {
      const newType = new type();
      newType.deserialize(value);
      return newType;
    }));
  }
}
