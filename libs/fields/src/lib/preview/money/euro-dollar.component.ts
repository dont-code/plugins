import {Component, TemplateRef, ViewChild} from '@angular/core';
import {MoneyAmount} from '@dontcode/core';
import {AbstractDynamicComponent, PossibleTemplateList, TemplateList} from '@dontcode/plugin-common';
import {FormControl, FormGroup} from '@angular/forms';

/**
 * Display or edit a country value
 */
@Component({
  selector: 'dontcode-fields-eurodollar',
  templateUrl: './euro-dollar.component.html',
  styleUrls: ['./euro-dollar.component.css']
})
export class EuroDollarComponent extends AbstractDynamicComponent{
  @ViewChild('inlineView')
  private inlineView!: TemplateRef<any>;

  @ViewChild('fullEditView')
  private fullEditView!: TemplateRef<any>;

  value = new MoneyAmount();

  control:FormControl = new FormControl(null,{updateOn:'blur'})

  providesTemplates (key?:string): TemplateList {
    switch (key) {
      case 'Euro':
      case 'Dollar':
        this.value.currencyCode=(key==='Euro')?'EUR':'USD';
        return new TemplateList (this.inlineView, null, this.fullEditView);
      default:
        return new TemplateList(null, null, null);
    }
  }

  setValue(val: any):void {
    if( val) {
      this.value = val;
      this.control.setValue(this.value.amount, {emitEvent: false});
    } else {
      this.value = new MoneyAmount();
    }
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

  /**
   * We are managing our own FormControl to store both the amount and currency
   */
  managesFormControl(): boolean {
    return true;
  }

  setForm(form: FormGroup) {
    super.setForm(form);
    form.registerControl(this.name, this.control);
  }

  get amount (): number {
    return this.value.amount;
  }

  set amount (newAmount){
    this.value.amount=newAmount;
    this.control.setValue(newAmount);
  }
}
