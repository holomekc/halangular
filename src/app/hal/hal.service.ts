import {Injectable} from '@angular/core';
import {Resource} from './resource';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class HalService {

  private storage: Map<string, Subject<Resource>> = new Map<string, Subject<Resource>>();

  private static deserialize<T extends Resource>(type: { new(): T }) {
    return map((value: T) => {
      const newType = new type();
      newType.deserialize(value);
      return newType;
    });
  }

  constructor() {
  }

  static entryPoint<T extends Resource>(observable: Observable<T>, type: { new(): T }): Observable<T> {
    return observable.pipe(HalService.deserialize(type));
  }

  public store<T extends Resource>(key: string, item: Observable<T>): Observable<T> {
    return item.pipe(map(value => {

      const subject = this.storage.get(key);

      if (subject) {
        subject.next(value);
      } else {
        this.storage.set(key, new BehaviorSubject(value));
      }
      return value;
    }));
  }

  public storeEntryPoint<T extends Resource>(observable: Observable<T>, type: { new(): T }, key: string): Observable<T> {
    return this.store(key, HalService.entryPoint(observable, type));
  }

  public getResourceFromStorage<T extends Resource>(key: string): Observable<T> {
    let subject = (this.storage.get(key) as Subject<T>);

    if (!subject) {
      subject = new Subject<T>();
      this.storage.set(key, subject);
    }

    return subject.asObservable();
  }
}
