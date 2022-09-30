import { Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { MoneyAmount } from '@dontcode/core';
import {
  AbstractDynamicLoaderComponent,
  ComponentLoaderService,
  PossibleTemplateList,
  TemplateList,
} from '@dontcode/plugin-common';
import {FormControl, FormGroup, Validators} from '@angular/forms';

/**
 * Display or edit a country value
 */
@Component({
  selector: 'dontcode-fields-money',
  templateUrl: './money.component.html',
  styleUrls: ['./money.component.css'],
})
export class MoneyComponent extends AbstractDynamicLoaderComponent {
  @ViewChild('inlineView', { static: true })
  private inlineView!: TemplateRef<any>;

  @ViewChild('fullEditView', { static: true })
  private fullEditView!: TemplateRef<any>;

  override value: MoneyAmount = new MoneyAmount();
  valueAmountDefined = false;

  converter = Intl.NumberFormat(navigator.language, { style:'currency', currency:'EUR'});

  constructor(injector: Injector, loaderService: ComponentLoaderService) {
    super(loaderService, injector);
    this.defineSubField ('currencyCode', 'Currency');
  }

  override providesTemplates(key?: string): TemplateList {
    return new TemplateList(this.inlineView, null, this.fullEditView);
  }

  override canProvide(key?: string): PossibleTemplateList {
    return new PossibleTemplateList(true, false, true);
  }

  override setForm(form: FormGroup) {
    super.setForm(form);
    this.group?.registerControl('amount', new FormControl(this.amount));
  }

  get amount(): number | undefined {
    if (this.valueAmountDefined) return this.value.amount;
    else return;
  }

  set amount(newAmount) {
    if (newAmount) {
      this.value.amount = newAmount;
      this.valueAmountDefined = true;
    } else {
      this.valueAmountDefined = false;
    }
  }

  override setValue(val: any) {
    super.setValue(val);
    if (this.value) {
      this.valueAmountDefined = true;
    } else {
      this.value = new MoneyAmount();
      this.valueAmountDefined = false;
    }
    this.updateConverter();
  }

  override getValue(): any {
    const val = super.getValue() as MoneyAmount;
    return val;
  }


  updateConverter (): void {
    if (this.value?.currencyCode!=null)
      this.converter =Intl.NumberFormat(navigator.language, { style:'currency', currency:this.value.currencyCode});
  }

  localizedAmount (amount:number|null): string {
    if( amount==null)
      return this.value?.currencyCode??"";
    const ret = this.converter.format(amount);
    return ret;
  }


  override transformToSource(type: string, val: any): any {
    const ret= super.transformToSource(type, val);
/*    if( !this.valueAmountDefined) {
      ret.amount = undefined;
    }*/
    return ret;
  }

  override transformFromSource(type: string, val: any): any {
    if (val?.amount==null) {
      this.valueAmountDefined=false;
    } else {
      this.valueAmountDefined=true;
    }
    return super.transformFromSource(type, val);
  }
}
