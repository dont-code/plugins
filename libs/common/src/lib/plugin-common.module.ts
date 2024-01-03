import {ModuleWithProviders, NgModule} from '@angular/core';
import {DynamicInsertPoint} from "./common-ui/abstract-dynamic-loader-component";
import {
  DontCodeChangeManager,
  DontCodeModelManager,
  DontCodePreviewManager,
  DontCodeSchemaManager,
  DontCodeStoreManager,
  dtcde
} from "@dontcode/core";
import {DONT_CODE_CORE} from "./common-global/globals";
import {BeautifierPipe} from './common-ui/pipes/beautifier.pipe';
import {DropdownModule} from "primeng/dropdown";
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {AbstractReferenceComponent} from "./common-ui/abstract-reference.component";

@NgModule({
  imports: [CommonModule, DropdownModule, ReactiveFormsModule],
  declarations: [DynamicInsertPoint, BeautifierPipe, AbstractReferenceComponent],
  exports: [DynamicInsertPoint, BeautifierPipe, AbstractReferenceComponent]
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
        {provide:DontCodeStoreManager, useValue:dtcde.getStoreManager()},
        {provide:DontCodeChangeManager, useValue:dtcde.getChangeManager()},
        BeautifierPipe
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
export * from './common-ui/dynamic-event';
export * from './common-ui/abstract-dynamic-component';
export * from './common-ui/abstract-dynamic-loader-component';
export * from './common-ui/abstract-reference.component';
export * from './common-ui/pipes/beautifier.pipe';
export * from './common-storage/entity-store.service';
export * from './common-dynamic/component-loader.service';
export * from './common-values/value.service';
export * from './common-config/common-lib-config';
export * from './common-config/common-config.service';