import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DontCode, PluginModuleInterface } from "@dontcode/core";
import dtcde = DontCode.dtcde;
import { BasicPlugin } from "./declaration/basic-plugin";
import { BasicEntityComponent } from './preview/entity/basic-entity.component';

@NgModule({
  imports: [CommonModule],
  declarations: [BasicEntityComponent],
  id:'dontcode-plugin/basic'
})
export class BasicModule implements PluginModuleInterface {
  constructor() {
    console.log("Basic Plugin registering");
    dtcde.registerPlugin(new BasicPlugin ());
  }

  // We declare the components
  exposedPreviewHandlers(): Map<string, any> {
        return new Map<string, any> ([['BasicEntityComponent', BasicEntityComponent]]);
    }

}

export * from './preview/entity/basic-entity.component';
