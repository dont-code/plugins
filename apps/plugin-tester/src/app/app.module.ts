import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {SandboxModule} from "@dontcode/sandbox";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {environment} from "../environments/environment";
import {HttpClientModule} from "@angular/common/http";
import {BasicModule, DONTCODE_STORE_API_URL} from "@dontcode/plugin-basic";
import {FieldsModule} from "@dontcode/plugin-fields";
import {ScreenModule} from "@dontcode/plugin-screen";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot([], {
      enableTracing: false,   // <-- debugging purposes only
      useHash: true,
      relativeLinkResolution: 'corrected',
      initialNavigation: 'enabledBlocking'
    }),
    SandboxModule.forRoot({
      webSocketUrl: environment.webSocketUrl,
      indexedDbName: 'Dont-code Plugin Tester',
      applicationName: 'Plugin Tester'
    }),
    BasicModule,
    FieldsModule,
    ScreenModule
  ],
  providers: [{
    provide: DONTCODE_STORE_API_URL,
    useValue: environment.storeApiUrl
  }],
  bootstrap: [AppComponent]
})
export class AppModule {}
