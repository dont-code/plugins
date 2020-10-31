import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DontCode, PluginModuleInterface } from "@dontcode/core";
import dtcde = DontCode.dtcde;
import { ScreenPlugin } from "./declaration/screen-plugin";
import { ScreenComponent } from './preview/screen/screen.component';
import { BasicEntityComponent } from "@dontcode/plugin-basic";

@NgModule({
  imports: [CommonModule],
  declarations: [ScreenComponent]
})
export class ScreenModule implements PluginModuleInterface {
  constructor() {
    console.log("Screen Plugin registering");
    dtcde.registerPlugin(new ScreenPlugin ());
  }
  // We declare the components
  exposedPreviewHandlers(): Map<string, any> {
    return new Map<string, any> ([['ScreenComponent', ScreenComponent]]);
  }
}

export * from './preview/screen/screen.component';
