import {Component, Injector, TemplateRef, ViewChild} from '@angular/core';
import {MoneyAmount} from '@dontcode/core';
import {
  AbstractDynamicLoaderComponent,
  ComponentLoaderService,
  PossibleTemplateList,
  TemplateList
} from '@dontcode/plugin-common';
import {FormControl, FormGroup} from '@angular/forms';

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
  private inlineView!: TemplateRef<any>;

  @ViewChild('fullEditView')
  private fullEditView!: TemplateRef<any>;

  value:MoneyAmount = new MoneyAmount();
  valueAmountDefined = false;

  control:FormControl = new FormControl(null,{updateOn:'blur'})

  constructor(injector:Injector, loaderService: ComponentLoaderService) {
    super(loaderService, injector );
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
    if( this.group)
      this.group.registerControl('amount', this.control);
    else
      throw new Error ('Group must be created before setting parent form');

  }

  get amount (): number|undefined {
    if (this.valueAmountDefined)
      return this.value.amount;
    else
      return;
  }

  set amount (newAmount){
    if (newAmount) {
      this.value.amount=newAmount;
      this.valueAmountDefined=true;
    } else {
      this.valueAmountDefined=false;
    }
    this.control.setValue(newAmount);
  }

  template (): TemplateRef<any>|null {
    const comp =this.componentsByFormName.get('currencyCode');
    if (comp)
      return comp.providesTemplates().forFullEdit;
    else throw new Error ('Cannot find component handling currencyCode');
  }

  setValue(val: any) {
    super.setValue(val);
    if (this.value) {
      this.valueAmountDefined=true;
    } else {
      this.value = new MoneyAmount();
      this.valueAmountDefined=false;
    }
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
