import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from "./shared/shared.module";
import {LayoutModule} from "./layout/layout.module";
import {RoutesModule} from "./routes/routes.module";
import {SANDBOX_CONFIG, SandboxLibConfig} from "./shared/config/sandbox-lib-config";

@NgModule({
  imports: [CommonModule, SharedModule,LayoutModule, RoutesModule],
  exports: [SharedModule, LayoutModule]
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
