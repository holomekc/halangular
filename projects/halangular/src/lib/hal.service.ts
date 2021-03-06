import {Injectable} from '@angular/core';
import {Resource} from './resource';
import {Observable, Subject} from 'rxjs';
import {map, publishReplay, refCount, takeUntil} from 'rxjs/operators';
import {HalHttpAdapter} from './hal-http-adapter';
import {Link} from './link';
import {HalMethod} from './hal-method';
import {HalHttpOptions} from './hal-http-options';

// @dynamic
@Injectable({
    providedIn: 'root'
})
export class HalService {

    private cacheClearSubject = new Subject<boolean>();

    private static storage: Map<string, Observable<any>> = new Map<string, Observable<any>>();

    private static deserialize<T extends Resource>(type: { new(): T }) {
        // @dynamic
        return map((value: T) => {
            const newType = new type();
            newType.deserialize(value);
            console.log(newType);
            return newType;
        });
    }

    private static replacePathParams(url: string, options: HalHttpOptions) {
        if (!options || !options.params) {
            return url;
        }

        for (const key in options.params) {
            if (options.params.hasOwnProperty(key)) {
                // remove required
                const regex = new RegExp('/{' + key + '}');
                url = url.replace(regex, '/' + options.params[key] as string);
            }
        }

        return url;
    }

    private static removeTemplates(url: string, options: HalHttpOptions): string {
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

    private static checkMissingRequirements(url: string): string {
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

    constructor(private halHttpAdapter: HalHttpAdapter) {
    }

    public clearCache() {
        HalService.storage.clear();
        const temp = this.cacheClearSubject;
        this.cacheClearSubject = new Subject<boolean>();
        temp.next(true);
        temp.complete();
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

        const storageValue = HalService.storage.get(link.getHref());

        if (storageValue) {
            return storageValue;
        }

        let url = link.getHref();
        if (link.isTemplated()) {
            url = HalService.replacePathParams(url, options);
            url = HalService.removeTemplates(url, options);
            url = HalService.checkMissingRequirements(url);
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
        const observable = this.follow(link, method, type, body, options);

        const result = observable.pipe(takeUntil(this.cacheClearSubject), publishReplay(1), refCount());
        HalService.storage.set(link.getHref(), result);
        return result;
    }
}
