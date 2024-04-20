import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {SandboxModule} from "@dontcode/sandbox";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {environment} from "../environments/environment";
import {HttpClientModule} from "@angular/common/http";
import {BasicModule} from "@dontcode/plugin-basic";
import {FieldsModule} from "@dontcode/plugin-fields";
import {ScreenModule} from "@dontcode/plugin-screen";
import {PluginCommonModule} from "@dontcode/plugin-common";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot([], {
    enableTracing: false,
    useHash: true,
    initialNavigation: 'enabledBlocking'
}),
    PluginCommonModule.forRoot(),
    SandboxModule.forRoot({
      webSocketUrl: environment.webSocketUrl,
      documentApiUrl: environment.documentApiUrl,
      storeApiUrl: environment.storeApiUrl,
      indexedDbName: 'Dont-code Plugin Tester',
      applicationName: 'Plugin Tester',
      theme:'orange',
      templateFileUrl: 'assets/dev/templates.json'
    }),
    BasicModule,
    FieldsModule,
    ScreenModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
