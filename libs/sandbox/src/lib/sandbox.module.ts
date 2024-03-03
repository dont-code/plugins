import {ModuleWithProviders, NgModule} from '@angular/core';
import {SharedModule} from "./shared/shared.module";
import {LayoutModule} from "./layout/layout.module";
import {RoutesModule} from "./routes/routes.module";
import {DONT_CODE_COMMON_CONFIG, CommonLibConfig} from "@dontcode/plugin-common";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./routes/home/home.component";
import {DebugPageComponent} from "./routes/debug/debug-page/debug-page.component";
import {ScreenComponent} from "./routes/screens/screen/screen.component";
import {ChangeProviderService} from "./shared/command/services/change-provider.service";
import {COMMAND_PROVIDER} from "@dontcode/plugin-common";

const sandboxRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dev', component: DebugPageComponent },
  { path: 'newTabDev', component: DebugPageComponent},
  { path: 'creation/:type/:id', component: ScreenComponent
  }];

@NgModule({
  imports: [SharedModule,LayoutModule, RoutesModule, RouterModule.forChild(sandboxRoutes)],
  exports: [SharedModule, LayoutModule],
  providers: [
    {provide:COMMAND_PROVIDER, useExisting:ChangeProviderService}
  ]
})
export class SandboxModule {
  static forRoot(config: CommonLibConfig): ModuleWithProviders<SandboxModule> {
    return {
      ngModule: SandboxModule,
      providers: [
        {
          provide: DONT_CODE_COMMON_CONFIG,
          useValue: config
        }
      ]
    };
  }
}

export * from './layout/layout.module';
export * from './shared/shared.module';
