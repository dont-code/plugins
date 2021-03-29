import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {dtcde, PluginModuleInterface} from '@dontcode/core';
import {FieldsPlugin} from './declaration/fields-plugin';
import { CountryComponent } from './preview/country/country.component';
import {ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, DropdownModule],
  declarations: [CountryComponent],
  id:'dontcode-plugin/fields'
})
export class FieldsModule implements PluginModuleInterface{
  constructor() {
    console.log('Fields Plugin registering');
    dtcde.registerPlugin(new FieldsPlugin ());
  }

  // We declare the components
  exposedPreviewHandlers(): Map<string, any> {
    return new Map<string, any> ([['CountryComponent', CountryComponent]]);
  }

}

export * from './preview/country/country.component';
