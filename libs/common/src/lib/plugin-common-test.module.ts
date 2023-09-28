import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {PluginModuleInterface} from "@dontcode/core";
import {PluginCommonModule} from "./plugin-common.module";

@NgModule({
  imports: [CommonModule, PluginCommonModule],
  declarations: [],
  exports: [],
  id:'dontcode-plugin/common-test-module'
})
export class PluginCommonTestModule  implements PluginModuleInterface{
  public static previewHandlers = new Map<string, any>();
  exposedPreviewHandlers(): Map<string, any> {
    return PluginCommonTestModule.previewHandlers;
  }
}

export * from './common-test/common-test-manager';
