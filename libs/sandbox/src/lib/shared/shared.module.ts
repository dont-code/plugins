import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandModule } from './command/command.module';
import { ChangeModule } from './change/change.module';
import { DefaultViewerComponent } from './dynamic/components/default-viewer.component';
import {PluginCommonModule} from "@dontcode/plugin-common";
import {ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import { RepositorySchema } from '@dontcode/core';


@NgModule({
  declarations: [DefaultViewerComponent],
  exports: [
    DefaultViewerComponent
  ],
    imports: [
        CommonModule,
        CommandModule,
        ChangeModule,
        PluginCommonModule,
        ReactiveFormsModule,
        InputTextModule
    ]
})
export class SharedModule { }

export * from './dynamic/components/default-viewer.component';
export * from './storage/services/indexed-db-storage.service';
export * from './change/change.module';
export * from './plugins/remote-plugin-loader.service';
export * from './command/command.module';
export * from './plugins/global-plugin-loader';
