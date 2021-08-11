import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "./shared/shared.module";
import {LayoutModule} from "./layout/layout.module";
import {RoutesModule} from "./routes/routes.module";
import {
  basicDocumentApiUrlConfig,
  basicStoreApiUrlConfig,
  SANDBOX_CONFIG,
  SandboxLibConfig
} from "./shared/config/sandbox-lib-config";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./routes/home/home.component";
import {DebugPageComponent} from "./routes/debug/debug-page/debug-page.component";
import {ScreenComponent} from "./routes/screens/screen/screen.component";
import {ChangeProviderService} from "./shared/command/services/change-provider.service";
import {COMMAND_PROVIDER} from "@dontcode/plugin-common";
import {DONTCODE_DOC_API_URL, DONTCODE_STORE_API_URL} from "@dontcode/plugin-basic";

const sandboxRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dev', component: DebugPageComponent },
  { path: 'newTabDev', component: DebugPageComponent},
  { path: 'creation/:type/:id', component: ScreenComponent
  }];

@NgModule({
  imports: [CommonModule, SharedModule,LayoutModule, RoutesModule, RouterModule.forChild(sandboxRoutes)],
  exports: [SharedModule, LayoutModule],
  providers: [
    {provide:COMMAND_PROVIDER, useExisting:ChangeProviderService}
  ]
})
export class SandboxModule {
  static forRoot(config: SandboxLibConfig): ModuleWithProviders<SandboxModule> {
    return {
      ngModule: SandboxModule,
      providers: [
        {
          provide: SANDBOX_CONFIG,
          useValue: config
        }
      ]
    };
  }
}

export * from './layout/layout.module';
export * from './shared/shared.module';
