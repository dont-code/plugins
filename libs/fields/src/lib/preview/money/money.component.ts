import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MoneyAmount} from '@dontcode/core';
import {AbstractDynamicComponent, DynamicComponent, PossibleTemplateList, TemplateList} from '@dontcode/plugin-common';

/**
 * Display or edit a country value
 */
@Component({
  selector: 'dontcode-fields-money',
  templateUrl: './money.component.html',
  styleUrls: ['./money.component.css']
})
export class MoneyComponent extends AbstractDynamicComponent{
  @ViewChild('inlineView')
  private inlineView: TemplateRef<any>;

  @ViewChild('fullEditView')
  private fullEditView: TemplateRef<any>;

  value:MoneyAmount = new MoneyAmount();

  countries = new Array<{ name, alpha2code }>();
  selectedCountry;

  providesTemplates (key?: string): TemplateList {
    return new TemplateList(this.inlineView, null, this.fullEditView);
  }

  canProvide(key?: string): PossibleTemplateList {
      return new PossibleTemplateList(true, false, true);
  }

}
