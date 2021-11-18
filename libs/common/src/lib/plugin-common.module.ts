import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DynamicInsertPoint} from "./common-ui/abstract-dynamic-loader-component";


@NgModule({
  imports: [CommonModule],
  declarations: [DynamicInsertPoint],
  exports: [DynamicInsertPoint]
})
export class PluginCommonModule {}

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
