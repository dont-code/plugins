import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AbstractDynamicComponent, DynamicComponent, PossibleTemplateList, TemplateList} from '@dontcode/plugin-common';
import country from 'all-country-data';
import {FormControl, FormGroup} from "@angular/forms";
/**
 * Display or edit a country value
 */
@Component({
  selector: 'dontcode-fields-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent extends  AbstractDynamicComponent implements OnInit{
  @ViewChild('inlineView',{static:true})
  private inlineView!: TemplateRef<any>;

  @ViewChild('fullEditView',{static:true})
  private fullEditView!: TemplateRef<any>;

  currencies = new Array<{ currency:string, currencyCode:string }>();

  ngOnInit(): void {

    const currencySet = new Map<string, string>();
    country.countryCurrencyList().forEach((country: { currency: string; currency_code: string; }) => {
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

  providesTemplates (): TemplateList {
    return new TemplateList(this.inlineView, null, this.fullEditView);
  }

  canProvide(key?: string): PossibleTemplateList {
    return new PossibleTemplateList(true, false, true);
  }

}
