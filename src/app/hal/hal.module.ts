import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HalService} from './hal.service';

export * from './resource';
export * from './link';
export * from './hal.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [HalService]
})
export class HalModule {
}

