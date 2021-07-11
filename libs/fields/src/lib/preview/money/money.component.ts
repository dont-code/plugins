import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MoneyAmount} from '@dontcode/core';
import {
  AbstractDynamicComponent,
  ComponentLoaderService,
  DynamicComponent,
  PossibleTemplateList,
  TemplateList
} from '@dontcode/plugin-common';
import {FormControl, FormGroup} from '@angular/forms';
import {AbstractDynamicLoaderComponent} from '@dontcode/plugin-common';

/**
 * Display or edit a country value
 */
@Component({
  selector: 'dontcode-fields-money',
  templateUrl: './money.component.html',
  styleUrls: ['./money.component.css']
})
export class MoneyComponent extends AbstractDynamicLoaderComponent{
  @ViewChild('inlineView')
  private inlineView: TemplateRef<any>;

  @ViewChild('fullEditView')
  private fullEditView: TemplateRef<any>;

  value:MoneyAmount = new MoneyAmount();
  control:FormControl = new FormControl(null,{updateOn:'blur'})

  constructor(protected loaderService: ComponentLoaderService) {
    super(loaderService );
  }

  providesTemplates (key?: string): TemplateList {
    return new TemplateList(this.inlineView, null, this.fullEditView);
  }

  canProvide(key?: string): PossibleTemplateList {
      return new PossibleTemplateList(true, false, true);
  }

  /**
   * We are managing our own FormControl to store both the amount and currency
   */
  managesFormControl(): boolean {
    return true;
  }

  setForm(form: FormGroup) {
    super.setForm(form);
    this.group.registerControl('amount', this.control);

  }

  get amount (): number {
    return this.value.amount;
  }

  set amount (newAmount){
    this.value.amount=newAmount;
    this.control.setValue(newAmount);
  }

  template () {
    return this.componentsByFormName.get('currencyCode').providesTemplates().forFullEdit;
  }

  setValue(val: any) {
    super.setValue(val);
    if (!this.value)
      this.value = new MoneyAmount();
    this.setSubFieldValue ('currencyCode',this.value.currencyCode);
  }

  getValue(): any {
    const val= super.getValue() as MoneyAmount;
    val.currencyCode = this.getSubFieldValue('currencyCode');

    return val;
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.group) {
        // Only load currency component in edit mode
      this.loadSubField('Currency', 'currencyCode', this.value.currencyCode).then(() => {
        // Nothing to do
      });
    }

  }
}
