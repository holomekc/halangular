import {Component, OnInit} from '@angular/core';
import {HalService} from './hal/hal.service';
import {Menu} from './example/menu';

@Component({
  selector: 'hal-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'halangular';


  constructor(private halService: HalService) {
  }

  ngOnInit(): void {
    this.halService.entryPoint('/api/menu', Menu).subscribe(value => {
      console.log(value);
      console.log(value.hasLink('generateToken'));
      value.getLink('generateToken');
    });
  }
}


