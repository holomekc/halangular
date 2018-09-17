# Halangular

This Angular module allows to implement a HAL/JSON based http client.

## Installation

npm install halangular --save

## How to use

Create model
```typescript
import {Resource} from 'halangular';

export class EntryPoint extends Resource{
    getEmbeddedTypes(): Map<string, { new(): Resource }> {
        // no embedded content
        return new Map<string, {new(): Resource}>();
    }
}
```

use in component
```typescript
import {Component, OnInit} from '@angular/core';
import {HalMethod, HalService} from 'halangular';
import {EntryPoint} from './model/entry-point';
import {switchMap} from 'rxjs/operators';
import {EMPTY} from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {


    constructor(private halService: HalService){
    }

    ngOnInit(): void {
        this.halService.entryPoint('', HalMethod.GET, EntryPoint).pipe(switchMap(value => {
            if(value.hasLink('REL')){
                // do something. e.g. follow link

                // Instead of EntryPoint use suitable model
                return this.halService.follow(value.getSingleLink('REL'),HalMethod.GET, EntryPoint);
            }else{
                return EMPTY;
            }
        }));
    }
}
```
## Custom adapter

extend the adapter (DefaultHalHttpAdapter for Angular HttpClient already exists)

```typescript
import {HalHttpAdapter} from './hal-http-adapter';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {HalHttpOptions} from './hal-http-options';

@Injectable({
    providedIn: 'root'
})
export class CustomHalHttpAdapter extends HalHttpAdapter {
    // implement needed methods
}
```

provide in module
```typescript
{
    provide: HalHttpAdapter, useClass: CustomHalHttpAdapter, deps: [HttpClient, ...]
}
```