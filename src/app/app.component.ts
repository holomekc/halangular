import {Component, OnDestroy, OnInit} from '@angular/core';
import {HalService} from './hal/hal.service';
import {HalMethod} from './hal/hal-method';
import {Menu} from './example/menu';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'hal-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  hasGenerateToken: boolean;

  private ngUnsubscribe = new Subject<boolean>();

  constructor(private halService: HalService) {
  }

  ngOnInit(): void {

    this.halService.entryPointAndRemember('/api/menu', HalMethod.GET, Menu)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => {
      this.hasGenerateToken = value.hasLink('generateToken');
    });
  }

  request() {
    this.ngOnInit();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }


}


