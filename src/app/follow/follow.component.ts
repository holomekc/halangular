import {Component, OnDestroy, OnInit} from '@angular/core';
import {HalService} from '../hal/hal.service';
import {AppComponent} from '../app.component';
import {Menu} from '../example/menu';
import {HttpClient} from '@angular/common/http';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'hal-follow',
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.css']
})
export class FollowComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();

  constructor(private halService: HalService, private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.halService.getResourceFromStorage<Menu>(AppComponent.ENTRY).pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => {
      const link = value.getSingleLink('generateToken');

      link.isTemplated();
      console.log(link);

      const map = new Map<string, any>();
      map.set('vin', '00000000000000000');
      map.set('path', 'valueForPath');
      map.set('type', 'typeValue');
      map.set('limit', 2);

      // const map2 = new Map<string, any>([['vin', '00000000000000000'], ['path', 'valueForPath'], ['type', 'typeValue'], ['limit', 2]]);

      const url = link.getTemplatedHref(map);

      this.httpClient.get(url).subscribe(value1 => {
        console.log(value1);
      });

      console.log(url);
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
