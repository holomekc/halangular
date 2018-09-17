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
