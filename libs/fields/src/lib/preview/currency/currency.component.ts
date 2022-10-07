import {Component, TemplateRef, ViewChild} from '@angular/core';
import {AbstractDynamicComponent, PossibleTemplateList, TemplateList} from '@dontcode/plugin-common';
import country from 'all-country-data';

/**
 * Display or edit a country value
 */
@Component({
  selector: 'dontcode-fields-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent extends  AbstractDynamicComponent{
  @ViewChild('inlineView',{static:true})
  private inlineView!: TemplateRef<any>;

  @ViewChild('fullEditView',{static:true})
  private fullEditView!: TemplateRef<any>;

  currencies = new Array<{ currency:string, currencyCode:string }>();

  constructor() {
    super();
      // Prepare the list of currencies
    const currencySet = new Map<string, string>();
    country.countryCurrencyList().forEach((country: { currency: string; currency_code: string; }) => {
      if ((country.currency && country.currency_code)) {
        currencySet.set(country.currency, country.currency_code);
      }
    }); // Remove duplicates

    this.currencies=[];
    currencySet.forEach((code, key) => {
      this.currencies.push({currency: key, currencyCode:code});
    });

    this.currencies = this.currencies.sort((a, b) => {
      return a.currency.localeCompare( b.currency);
    })
  }

  providesTemplates (): TemplateList {
    return new TemplateList(this.inlineView, null, this.fullEditView);
  }

  canProvide(key?: string): PossibleTemplateList {
    return new PossibleTemplateList(true, false, true);
  }

}
