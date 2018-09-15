import {Component, OnDestroy, OnInit} from '@angular/core';
import {HalService} from '../hal/hal.service';
import {Subject} from 'rxjs';
import {HalMethod} from '../hal/hal-method';
import {Menu} from '../example/menu';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'hal-follow',
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.css']
})
export class FollowComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();

  constructor(private halService: HalService) {
  }

  ngOnInit() {
    this.halService.entryPoint('/api/menu', HalMethod.GET, Menu)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => {
      console.log(value);

      if (value.hasLink('generateToken')) {
        this.halService.follow(value.getSingleLink('generateToken'), HalMethod.GET, Menu, null,
          {params: {vin: '12345'}}).subscribe(value1 => {
          console.log(value1);
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
