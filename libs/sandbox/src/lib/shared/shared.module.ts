import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandModule } from './command/command.module';
import { ChangeModule } from './change/change.module';
import { DefaultViewerComponent } from './dynamic/components/default-viewer.component';


@NgModule({
  declarations: [DefaultViewerComponent],
  exports: [
    DefaultViewerComponent
  ],
  imports: [
    CommonModule,
    CommandModule,
    ChangeModule
  ]
})
export class SharedModule { }

export * from './dynamic/components/default-viewer.component';
export * from './storage/services/indexed-db-storage.service';
