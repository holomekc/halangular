import {Injectable} from '@angular/core';
import {Resource} from './resource';
import {Observable, of} from 'rxjs';
import {map, share} from 'rxjs/operators';
import {HalHttpAdapter} from './hal-http-adapter';
import {Link} from './link';
import {HalMethod} from './hal-method';
import {HalHttpOptions} from './hal-http-options';

@Injectable({
  providedIn: 'root'
})
export class HalService {

  private storage: Map<string, Observable<any>> = new Map<string, Observable<any>>();

  private static deserialize<T extends Resource>(type: { new(): T }) {
    return map((value: T) => {
      const newType = new type();
      newType.deserialize(value);
      return newType;
    });
  }

  constructor(private halHttpAdapter: HalHttpAdapter) {
  }

  public entryPoint<T extends Resource>(url: string, method: HalMethod, type: { new(): T }, body?: any,
                                        options?: HalHttpOptions): Observable<T> {
    return this.follow(new Link('entryPoint', url, false), method, type, body, options);
  }

  public entryPointAndRemember<T extends Resource>(url: string, method: HalMethod, type: { new(): T }, body?: any,
                                                   options?: HalHttpOptions): Observable<T> {
    return this.followAndRemember(new Link('entryPoint', url, false), method, type, body, options);
  }

  public follow<T extends Resource>(link: Link, method: HalMethod, type: { new(): T }, body?: any,
                                    options?: HalHttpOptions): Observable<T> {

    const storageValue = this.storage.get(link.getHref());

    if (storageValue) {
      return storageValue;
    }

    let url = link.getHref();
    if (link.isTemplated()) {
      url = this.removeTemplates(url, options);
      url = this.checkMissingRequirements(url);
    }

    switch (method) {
      case HalMethod.DELETE:
        return this.halHttpAdapter.delete<T>(url, options).pipe(HalService.deserialize(type));
      case HalMethod.GET:
        return this.halHttpAdapter.get<T>(url, options).pipe(HalService.deserialize(type));
      case HalMethod.HEAD:
        return this.halHttpAdapter.head<T>(url, options).pipe(HalService.deserialize(type));
      case HalMethod.OPTIONS:
        return this.halHttpAdapter.options<T>(url, options).pipe(HalService.deserialize(type));
      case HalMethod.PATCH:
        return this.halHttpAdapter.patch<T>(url, body, options).pipe(HalService.deserialize(type));
      case HalMethod.POST:
        return this.halHttpAdapter.post<T>(url, body, options).pipe(HalService.deserialize(type));
      case HalMethod.PUT:
        return this.halHttpAdapter.put<T>(url, body, options).pipe(HalService.deserialize(type));
    }
  }

  public followAndRemember<T extends Resource>(link: Link, method: HalMethod, type: { new(): T }, body?: any, options?: HalHttpOptions) {
    const observable = this.follow(link, method, type, body, options).pipe(share());
    observable.subscribe(value => {
      this.storage.set(link.getHref(), of(value));
    });
    return observable;
  }

  private removeTemplates(url: string, options: HalHttpOptions): string {
    if (!options || !options.params) {
      return url;
    }

    for (const key in options.params) {
      if (options.params.hasOwnProperty(key)) {
        // remove required
        let regex = new RegExp(key + '={' + key + '}');
        url = url.replace(regex, '');

        // remove optional
        regex = new RegExp('({&([^}]+?)?),?' + key + '(([^}]+)?(\}))');
        url = url.replace(regex, '$1$3');
      }
    }
    // remove not set optionals
    const optionalParams = /{&.*?}/;
    const opResult = optionalParams.exec(url);
    if (opResult) {
      console.log(opResult);
      url = url.replace(optionalParams, '');
    }

    return url;
  }

  private checkMissingRequirements(url: string): string {
    const requiredParams = /{.*?}/;
    const reResult = requiredParams.exec(url);
    if (reResult) {
      console.error('Required param not set: ' + reResult[0]);
      console.error(reResult);
      return url.replace(requiredParams, '');
    } else {
      return url.replace('\?', '');
    }
  }
}
