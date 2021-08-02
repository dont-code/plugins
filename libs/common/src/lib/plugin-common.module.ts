import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DynamicInsertPoint} from "./common-ui/abstract-dynamic-loader-component";


@NgModule({
  imports: [CommonModule],
  declarations: [DynamicInsertPoint],
  exports: [DynamicInsertPoint]
})
export class PluginCommonModule {}
