import {Component, OnDestroy, OnInit} from '@angular/core';
import {HalService} from './hal/hal.service';
import {HttpClient} from '@angular/common/http';
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

  public static ENTRY = 'ENTRY';

  hasGenerateToken: boolean;

  private ngUnsubscribe = new Subject<boolean>();

  constructor(private halService: HalService, private httpClient: HttpClient) {
  }

  ngOnInit(): void {

    this.halService.entryPointAndRemember('/api/menu', HalMethod.GET, Menu)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => {
      this.hasGenerateToken = value.hasLink('generateToken');
    });


    // this.halService.storeEntryPoint(this.httpClient.get<Menu>('/api/menu', {
    //   headers: {
    //     'Accept': 'application/hal+json'
    //   }
    // }), Menu, AppComponent.ENTRY)
    //   .subscribe(value => {
    //     // console.log(value);
    //     // console.log(value.hasLink('generateToken'));
    //     this.hasGenerateToken = value.hasLink('generateToken');
    //   });
  }

  request() {
    this.ngOnInit();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }


}


