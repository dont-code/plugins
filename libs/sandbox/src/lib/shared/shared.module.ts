import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandModule } from './command/command.module';
import { ChangeModule } from './change/change.module';
import { DynamicInsertDirective } from './dynamic/directives/dynamic-insert.directive';
import { DefaultViewerComponent } from './dynamic/components/default-viewer.component';


@NgModule({
  declarations: [DynamicInsertDirective, DefaultViewerComponent],
  exports: [
    DynamicInsertDirective,
    DefaultViewerComponent
  ],
  imports: [
    CommonModule,
    CommandModule,
    ChangeModule
  ]
})
export class SharedModule { }

export * from './dynamic/directives/dynamic-insert.directive';
export * from './dynamic/components/default-viewer.component';
export * from './storage/services/indexed-db-storage.service';
