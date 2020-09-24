import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DontCode } from "@dontcode/core";
import dtcde = DontCode.dtcde;
import { ScreenPlugin } from "./declaration/screen-plugin";
import { ScreenComponent } from './preview/screen/screen.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ScreenComponent]
})
export class ScreenModule {
  constructor() {
    console.log("Screen Plugin registering");
    dtcde.registerPlugin(new ScreenPlugin ());
  }
}

export * from './preview/screen/screen.component';
