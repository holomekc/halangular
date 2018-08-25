import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HalModule} from './hal/hal.module';
import {HttpClientModule} from '@angular/common/http';
import { FollowComponent } from './follow/follow.component';

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
