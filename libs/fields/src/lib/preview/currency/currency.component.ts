import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DynamicComponent, PossibleTemplateList, TemplateList} from '@dontcode/plugin-common';
import country from 'all-country-data';
/**
 * Display or edit a country value
 */
@Component({
  selector: 'dontcode-fields-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements DynamicComponent, OnInit{
  @ViewChild('inlineView')
  private inlineView: TemplateRef<any>;

  @ViewChild('fullEditView')
  private fullEditView: TemplateRef<any>;

  value = '';
  name:string;

  currencies = new Array<{ currency, currencyCode }>();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {
  }

  ngOnInit(): void {

    const currencySet = new Map<string, string>();
    country.countryCurrencyList().forEach(country => {
      if ((country.currency && country.currency_code)) {
        currencySet.set(country.currency, country.currency_code);
      }
    }); // Remove duplicates

   this.currencies=[];
   currencySet.forEach((value1, key) => {
     this.currencies.push({currency: key, currencyCode:value1});
   });

   this.currencies = this.currencies.sort((a, b) => {
     return a.currency.localeCompare( b.currency);
   })
  }

  setName(name: string): void {
    this.name = name;
    }

  providesTemplates (): TemplateList {
    return new TemplateList(this.inlineView, null, this.fullEditView);
  }

  setValue(val: any) {
    this.value = val;
  }

  canProvide(key?: string): PossibleTemplateList {
    return new PossibleTemplateList(true, false, true);
  }

  getValue(): any {
    return this.value;
  }

  overrideValue(value: any): any {
    // We don't need to override any value in this component
    return value;
  }

}
