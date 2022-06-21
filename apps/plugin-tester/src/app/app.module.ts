import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {SandboxModule} from "@dontcode/sandbox";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {environment} from "../environments/environment";
import {HttpClientModule} from "@angular/common/http";
import {BasicModule, DONTCODE_STORE_API_URL, DONTCODE_DOC_API_URL} from "@dontcode/plugin-basic";
import {FieldsModule} from "@dontcode/plugin-fields";
import {ScreenModule} from "@dontcode/plugin-screen";
import {
  basicDocumentApiUrlConfig,
  basicStoreApiUrlConfig,
  SANDBOX_CONFIG
} from "@dontcode/sandbox";
import {PluginCommonModule} from "@dontcode/plugin-common";

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
    PluginCommonModule.forRoot(),
    SandboxModule.forRoot({
      webSocketUrl: environment.webSocketUrl,
      documentUrl: environment.documentApiUrl,
      storeUrl: environment.storeApiUrl,
      indexedDbName: 'Dont-code Plugin Tester',
      applicationName: 'Plugin Tester',
      theme:'orange',
      templateFileUrl: 'assets/dev/templates.json'
    }),
    BasicModule,
    FieldsModule,
    ScreenModule
  ],
  providers: [
    {
      provide: DONTCODE_STORE_API_URL,
      useFactory:basicStoreApiUrlConfig,
      deps:[SANDBOX_CONFIG]
    },{
      provide: DONTCODE_DOC_API_URL,
      useFactory:basicDocumentApiUrlConfig,
      deps:[SANDBOX_CONFIG]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
