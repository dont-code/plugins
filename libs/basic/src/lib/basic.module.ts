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
import {BeautifierPipe, PluginCommonModule} from "@dontcode/plugin-common";
import {BasicFieldsComponent} from './preview/fields/basic-fields.component';
import {DontCodeApiStoreProvider} from "./store/dont-code-api-store-provider";
import {TimeFieldsComponent} from "./preview/time/time-fields.component";
import {WebFieldsComponent} from "./preview/web/web-fields.component";
import {CalendarModule} from "primeng/calendar";
import {TooltipModule} from "primeng/tooltip";
import {FileUploadModule} from "primeng/fileupload";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {InputTextareaModule} from "primeng/inputtextarea";

@NgModule({
  imports: [CommonModule, TableModule, TabViewModule, CheckboxModule, FormsModule, InputNumberModule, InputTextModule, ToolbarModule, ButtonModule, ReactiveFormsModule, CalendarModule, TooltipModule, FileUploadModule, ConfirmDialogModule,
    PluginCommonModule.forRoot(), InputTextareaModule],
  declarations: [BasicEntityComponent, ListEntityComponent, EditEntityComponent, BasicFieldsComponent, TimeFieldsComponent, WebFieldsComponent],
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
          ['TimeFieldsComponent', TimeFieldsComponent],
          ['WebFieldsComponent', WebFieldsComponent],
          ['DontCodeApiStoreProvider', DontCodeApiStoreProvider]]);
    }

}

export * from './preview/entity/basic-entity.component';
export * from './preview/fields/basic-fields.component';
export * from './preview/time/time-fields.component';
export * from './preview/web/web-fields.component';
export * from './store/dont-code-api-store-provider';
