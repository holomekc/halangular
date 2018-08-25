import {Component, OnInit} from '@angular/core';
import {HalService} from './hal/hal.service';
import {Menu} from './example/menu';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'hal-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public static ENTRY = 'ENTRY';

  hasGenerateToken: boolean;

  constructor(private halService: HalService, private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.halService.storeEntryPoint(this.httpClient.get<Menu>('/api/menu', {
      headers: {
        'Accept': 'application/hal+json'
      }
    }), Menu, AppComponent.ENTRY)
      .subscribe(value => {
        // console.log(value);
        // console.log(value.hasLink('generateToken'));
        this.hasGenerateToken = value.hasLink('generateToken');
      });
  }

  request() {
    this.ngOnInit();
  }


}


