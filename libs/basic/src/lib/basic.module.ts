import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { dtcde, PluginModuleInterface } from "@dontcode/core";
import { BasicPlugin } from "./declaration/basic-plugin";
import { BasicEntityComponent } from './preview/entity/basic-entity.component';
import { TableModule } from "primeng/table";
import { ListEntityComponent } from './preview/entity/list-entity.component';
import { EditEntityComponent } from './preview/entity/edit-entity.component';
import {TabViewModule} from "primeng/tabview";
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";

@NgModule({
  imports: [CommonModule, TableModule, TabViewModule, CheckboxModule, FormsModule, InputNumberModule, InputTextModule],
  declarations: [BasicEntityComponent, ListEntityComponent, EditEntityComponent],
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
