import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {dtcde, PluginModuleInterface} from "@dontcode/core";
import {BasicPlugin} from "./declaration/basic-plugin";
import {BasicEntityComponent} from './preview/entity/basic-entity.component';
import {TableModule} from "primeng/table";
import {ListEntityComponent} from './preview/entity/list-entity.component';
import {EditEntityComponent} from './preview/entity/edit-entity.component';
import {TabViewModule} from "primeng/tabview";
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {PluginCommonModule} from "@dontcode/plugin-common";
import {BasicFieldsComponent} from './preview/fields/basic-fields.component';
import {DontCodeApiStoreProvider} from "./store/dont-code-api-store-provider";

@NgModule({
    imports: [CommonModule, TableModule, TabViewModule, CheckboxModule, FormsModule, InputNumberModule, InputTextModule, ToolbarModule, ButtonModule, PluginCommonModule, ReactiveFormsModule],
  declarations: [BasicEntityComponent, ListEntityComponent, EditEntityComponent, BasicFieldsComponent],
  providers: [DontCodeApiStoreProvider],
  id:'dontcode-plugin/basic'
})
export class BasicModule implements PluginModuleInterface {
  constructor() {
    console.log("Basic Plugin registering");
    dtcde.registerPlugin(new BasicPlugin ());
  }

  // We declare the components
  exposedPreviewHandlers(): Map<string, any> {
        return new Map<string, any> ([['BasicEntityComponent', BasicEntityComponent],
          ['BasicFieldsComponent', BasicFieldsComponent],
          ['DontCodeApiStoreProvider', DontCodeApiStoreProvider]]);
    }

}

export * from './preview/entity/basic-entity.component';
export * from './store/dont-code-api-store-provider';
