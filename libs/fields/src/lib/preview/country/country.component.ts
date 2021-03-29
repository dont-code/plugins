import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DynamicComponent, PossibleTemplateList, TemplateList} from '@dontcode/plugin-common';
import {iso31661} from 'iso-3166';

/**
 * Display or edit a country value
 */
@Component({
  selector: 'dontcode-fields-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements DynamicComponent{
  @ViewChild('inlineView')
  private inlineView: TemplateRef<any>;

  @ViewChild('fullEditView')
  private fullEditView: TemplateRef<any>;

  value = '';
  name:string;

  countries = iso31661;
  selectedCountry;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {
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

}
