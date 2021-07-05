import {Component, TemplateRef, ViewChild} from '@angular/core';
import {MoneyAmount} from '@dontcode/core';
import {DynamicComponent, PossibleTemplateList, TemplateList} from '@dontcode/plugin-common';
import {addMethod} from "@nrwl/workspace";

/**
 * Display or edit a country value
 */
@Component({
  selector: 'dontcode-fields-eurodollar',
  templateUrl: './euro-dollar.component.html',
  styleUrls: ['./euro-dollar.component.css']
})
export class EuroDollarComponent implements DynamicComponent{
  @ViewChild('inlineView')
  private inlineView: TemplateRef<any>;

  @ViewChild('fullEditView')
  private fullEditView: TemplateRef<any>;

  value = new MoneyAmount();
  name:string;

  private amount: number = null;

  setName(name: string): void {
    this.name = name;
    }

  providesTemplates (key?:string): TemplateList {
    switch (key) {
      case 'Euro':
      case 'Dollar':
        this.value.currencyCode=(key==='Euro')?'EUR':'USD';
        return new TemplateList (this.inlineView, null, this.fullEditView);
      default:
        return null;
    }
  }

  getValue (): any {
    this.value.amount=this.amount;
    return this.value;
  }

  setValue(val: any) {
    if( val && val.value)
      this.value = val.value;
    else {
      delete this.value;
    }
    this.amount=this.value.amount;
    if (!this.amount) this.amount = null;
  }

  overrideValue(value: any): any {
    return this.getValue();
  }

  canProvide(key?: string): PossibleTemplateList {
    switch (key) {
      case 'Euro':
      case 'Dollar':
        this.value.currencyCode=(key==='Euro')?'EUR':'USD';
        return new PossibleTemplateList(true, false, true);
    }

    return new PossibleTemplateList(false, false, false);
  }

}
