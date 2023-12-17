import {ChangeDetectorRef, Component, Injector, TemplateRef, ViewChild} from '@angular/core';
import {MoneyAmount} from '@dontcode/core';
import {
  AbstractDynamicLoaderComponent,
  ComponentLoaderService, DynamicComponent,
  PossibleTemplateList, SubFieldInfo,
  TemplateList,
} from '@dontcode/plugin-common';
import {FormControl} from '@angular/forms';

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
  protected inlineView!: TemplateRef<any>;

  @ViewChild('fullEditView', { static: true })
  protected fullEditView!: TemplateRef<any>;

  override value: MoneyAmount = new MoneyAmount();

  converter: Intl.NumberFormat | null = null;

  constructor(loaderService: ComponentLoaderService, injector: Injector, ref: ChangeDetectorRef ) {
    super(loaderService, injector, ref);
    // We use Dont-code framework to find the component that will manage the currency selection
    this.defineSubField ('currencyCode', 'Currency');
  }

  override providesTemplates(key?: string): TemplateList {
    return new TemplateList(this.inlineView, null, this.fullEditView);
  }

  override canProvide(key?: string): PossibleTemplateList {
    return new PossibleTemplateList(true, false, true);
  }

  override createAndRegisterFormControls (): void {
    this.form.registerControl('amount', new FormControl(null, {updateOn:"blur"}));
  }

  override loadSubField(subField: string | SubFieldInfo, type: string, subValue: any): Promise<DynamicComponent | null> {
//    console.debug ("Loading SubField ", subField);
    return super.loadSubField(subField, type, subValue);
  }

  getAmountSafe(): number | undefined {
    return this.value?.amount;
  }

  override setValue(val: any) {
    if( val==null) {
      val = new MoneyAmount();
    }
    super.setValue(val);
    this.updateConverter();
  }

  updateConverter (): void {
    if (this.value?.currencyCode!=null)
      this.converter =Intl.NumberFormat(navigator.language, { style:'currency', currency:this.value.currencyCode});
    else
      this.converter = null;
  }

  localizedAmount (amount:number|undefined): string {
    if( amount==null)
      return this.value?.currencyCode??"";
    if (this.converter!=null)
      return this.converter?.format(amount);
    else
      return amount.toString();
  }

  override subFieldFullEditTemplate(subField: string | SubFieldInfo): TemplateRef<any> | null {
    const ret= super.subFieldFullEditTemplate(subField);
    return ret;
  }

}
