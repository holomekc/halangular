import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HalModule} from 'halangular';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HalModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
