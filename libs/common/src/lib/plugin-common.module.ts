import {InjectionToken, ModuleWithProviders, NgModule} from '@angular/core';
import {DynamicInsertPoint} from "./common-ui/abstract-dynamic-loader-component";
import {
  Core,
  DontCodeModelManager,
  DontCodePreviewManager,
  DontCodeSchemaManager,
  DontCodeStoreManager,
  dtcde
} from "@dontcode/core";
import {DONT_CODE_CORE} from "./common-global/globals";

@NgModule({
  imports: [],
  declarations: [DynamicInsertPoint],
  exports: [DynamicInsertPoint]
})
export class PluginCommonModule {
  /**
   * Injects the DontCode core components into Angular's Dependency injection
   * @param config
   */
  static forRoot(): ModuleWithProviders<PluginCommonModule> {
    return {
      ngModule: PluginCommonModule,
      providers: [
        {provide:DONT_CODE_CORE, useValue: dtcde},
        {provide:DontCodeSchemaManager, useValue:dtcde.getSchemaManager()},
        {provide:DontCodeModelManager, useValue:dtcde.getModelManager()},
        {provide:DontCodePreviewManager, useValue:dtcde.getPreviewManager()},
        {provide:DontCodeStoreManager, useValue:dtcde.getStoreManager()}
      ]
    }
  }
}

export * from './common-global/globals';
export * from './common-handler/abstract-plugin-handler';
export * from './common-handler/plugin-handler-helper';
export * from './common-ui/plugin-base.component';
export * from './common-ui/template-list';
export * from './common-ui/dynamic-component';
export * from './common-ui/abstract-dynamic-component';
export * from './common-ui/abstract-dynamic-loader-component';
export * from './common-storage/entity-store.service';
export * from './common-dynamic/component-loader.service';
