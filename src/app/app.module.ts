import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HalModule} from './hal/hal.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FollowComponent} from './follow/follow.component';
import {HalHttpAdapter} from './hal/hal-http-adapter';
import {DefaultHalHttpAdapter} from './hal/default-hal-http-adapter';

@NgModule({
  declarations: [
    AppComponent,
    FollowComponent
  ],
  imports: [
    BrowserModule,
    HalModule,
    HttpClientModule
  ],
  providers: [
    {provide: HalHttpAdapter, useClass: DefaultHalHttpAdapter, deps: [HttpClient]}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
