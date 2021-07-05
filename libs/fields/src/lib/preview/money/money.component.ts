import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MoneyAmount} from '@dontcode/core';
import {DynamicComponent, PossibleTemplateList, TemplateList} from '@dontcode/plugin-common';

/**
 * Display or edit a country value
 */
@Component({
  selector: 'dontcode-fields-money',
  templateUrl: './money.component.html',
  styleUrls: ['./money.component.css']
})
export class MoneyComponent implements DynamicComponent, OnInit{
  @ViewChild('inlineView')
  private inlineView: TemplateRef<any>;

  @ViewChild('fullEditView')
  private fullEditView: TemplateRef<any>;

  value:MoneyAmount = new MoneyAmount();
  name:string;

  countries = new Array<{ name, alpha2code }>();
  selectedCountry;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {
  }

  ngOnInit(): void {
  }

  setName(name: string): void {
    this.name = name;
    }

  providesTemplates (key?: string): TemplateList {
    return new TemplateList(this.inlineView, null, this.fullEditView);
  }

  canProvide(key?: string): PossibleTemplateList {
      return new PossibleTemplateList(true, false, true);
  }

  getValue(): any {
    return this.value;
  }

  setValue(val: any) {
    this.value = val;
  }

  overrideValue(value: any): any {
    // We don't need to override any value in this component
    return value;
  }

}
