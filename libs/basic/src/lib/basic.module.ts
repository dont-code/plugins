import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DontCode } from "@dontcode/core";
import dtcde = DontCode.dtcde;
import { BasicPlugin } from "./declaration/basic-plugin";
import { BasicEntityComponent } from './preview/entity/basic-entity.component';

@NgModule({
  imports: [CommonModule],
  declarations: [BasicEntityComponent]
})
export class BasicModule {
  constructor() {
    console.log("Basic Plugin registering");
    dtcde.registerPlugin(new BasicPlugin ());
  }

}

export * from './preview/entity/basic-entity.component';
