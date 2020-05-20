import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DontCode } from "@dontcode/core";
import dtcde = DontCode.dtcde;
import { ScreenPlugin } from "./declaration/screen-plugin";

@NgModule({
  imports: [CommonModule],
})
export class ScreenModule {
  constructor() {
    console.log("Hey I'm there");
    dtcde.registerPlugin(new ScreenPlugin ());
  }
}
