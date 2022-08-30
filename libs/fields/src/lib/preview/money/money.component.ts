import { Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { MoneyAmount } from '@dontcode/core';
import {
  AbstractDynamicLoaderComponent,
  ComponentLoaderService,
  PossibleTemplateList,
  TemplateList,
} from '@dontcode/plugin-common';
import { FormControl, FormGroup } from '@angular/forms';

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

  control: FormControl = new FormControl(null, { updateOn: 'blur' });

  converter = Intl.NumberFormat(navigator.language, { style:'currency', currency:'EUR'});

  constructor(injector: Injector, loaderService: ComponentLoaderService) {
    super(loaderService, injector);
  }

  override providesTemplates(key?: string): TemplateList {
    return new TemplateList(this.inlineView, null, this.fullEditView);
  }

  override canProvide(key?: string): PossibleTemplateList {
    return new PossibleTemplateList(true, false, true);
  }

  /**
   * We are managing our own FormControl to store both the amount and currency
   */
  override managesFormControl(): boolean {
    return true;
  }

  override setForm(form: FormGroup) {
    super.setForm(form);
    if (this.group) {
      this.group.registerControl('amount', this.control);
      this.preloadCurrencyField();
    } else throw new Error('Group must be created before setting parent form');
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
    this.control.setValue(newAmount);
  }

  template(): TemplateRef<any> | null {
    const comp = this.componentsByFormName.get('currencyCode');
    if (comp) return comp.providesTemplates().forFullEdit;
    else throw new Error('Cannot find component handling currencyCode');
  }

  override setValue(val: any) {
    super.setValue(val);
    if (this.value) {
      this.valueAmountDefined = true;
    } else {
      this.value = new MoneyAmount();
      this.valueAmountDefined = false;
    }
    this.setSubFieldValue('currencyCode', 'Currency',this.value.currencyCode);
    this.updateConverter();
  }

  override getValue(): any {
    const val = super.getValue() as MoneyAmount;
    val.currencyCode = this.getSubFieldValue( 'currencyCode','Currency');

    return val;
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.preloadCurrencyField();
  }

  updateConverter (): void {
    if (this.value?.currencyCode!=null)
      this.converter =Intl.NumberFormat(navigator.language, { style:'currency', currency:this.value.currencyCode});
  }

  localizedAmount (amount:number): string {
    const ret = this.converter.format(amount);
    return ret;
  }

  preloadCurrencyField() {
    // Only load currency component to the cache in edit mode
    if ((this.group!=null)&&(this.dynamicInsertPoint!=null)) {
      this.loadSubField(
        'currencyCode',
        'Currency',
        this.value.currencyCode
      ).then(() => {
        // Nothing to do
      });
    }
  }
}
