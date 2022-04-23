import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {dtcde, PluginModuleInterface} from '@dontcode/core';
import {FieldsPlugin} from './declaration/fields-plugin';
import { CountryComponent } from './preview/country/country.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import {PluginCommonModule} from '@dontcode/plugin-common';
import {CurrencyComponent} from './preview/currency/currency.component';
import {EuroDollarComponent} from './preview/money/euro-dollar.component';
import {MoneyComponent} from './preview/money/money.component';
import {InputNumberModule} from 'primeng/inputnumber';
import {RatingComponent} from "./preview/rating/rating.component";
import {RatingModule} from "primeng/rating";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  imports: [CommonModule,HttpClientModule,
    ReactiveFormsModule, DropdownModule, PluginCommonModule, InputNumberModule, FormsModule, RatingModule],
  declarations: [CountryComponent, CurrencyComponent, EuroDollarComponent, MoneyComponent, RatingComponent],
  id:'dontcode-plugin/fields'
})
export class FieldsModule implements PluginModuleInterface{
  constructor() {
    console.log('Fields Plugin registering');
    dtcde.registerPlugin(new FieldsPlugin ());
  }

  // We declare the components
  exposedPreviewHandlers(): Map<string, any> {
    return new Map<string, any> ([
      ['CountryComponent', CountryComponent],
      ['CurrencyComponent', CurrencyComponent],
      ['EuroDollarComponent', EuroDollarComponent],
      ['MoneyComponent', MoneyComponent],
      ['RatingComponent', RatingComponent]]);
  }

}

export * from './preview/country/country.component';
export * from './preview/currency/currency.component';
export * from './preview/money/money.component';
export * from './preview/money/euro-dollar.component';
export * from './preview/rating/rating.component';
