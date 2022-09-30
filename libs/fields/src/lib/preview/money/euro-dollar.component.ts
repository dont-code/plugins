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
  @ViewChild('inlineView',{static:true})
  private inlineView!: TemplateRef<any>;

  @ViewChild('fullEditView',{static:true})
  private fullEditView!: TemplateRef<any>;

  override value = new MoneyAmount();
  // We cannot set a null value when amount field is empty, so we have this boolean to tell us it should be null
  valueAmountDefined = false;

  control:FormControl = new FormControl(null,{updateOn:'blur'})

  converter = Intl.NumberFormat(navigator.language, { style:'currency', currency:'EUR'});

  constructor() {
    super();
  }

  providesTemplates (key?:string): TemplateList {
    switch (key) {
      case 'Euro':
      case 'Dollar':
        this.value.currencyCode=(key==='Euro')?'EUR':'USD';
        this.updateConverter ();
        return new TemplateList (this.inlineView, null, this.fullEditView);
      default:
        return new TemplateList(null, null, null);
    }
  }

  override setValue(val: any):void {
    if( val != null) {
      this.value = val;
      this.control.setValue(this.value.amount, {emitEvent: false});
      this.valueAmountDefined=true;
    } else {
      this.value = new MoneyAmount();
      this.valueAmountDefined=false;
    }
  }

  canProvide(key?: string): PossibleTemplateList {
    switch (key) {
      case 'Euro':
      case 'Dollar':
        this.value.currencyCode=(key==='Euro')?'EUR':'USD';
        this.updateConverter();
        return new PossibleTemplateList(true, false, true);
    }

    return new PossibleTemplateList(false, false, false);
  }

  updateConverter (): void {
    if (this.value?.currencyCode!=null)
      this.converter =Intl.NumberFormat(navigator.language, { style:'currency', currency:this.value.currencyCode});
  }

  localizedAmount (amount?:number): string {
    if( amount==null)
      return this.value.currencyCode??"";
    const ret= this.converter.format(amount);

    /*const chars=[];
    for (let i=0;i<ret.length;i++) {
      chars.push(ret.charCodeAt(i));
    }
    console.log("Generated:",ret, ...chars);
*/
    return ret;
  }

  /**
   * We are managing our own FormControl to store both the amount and currency
   */
  override managesFormControl(): boolean {
    return true;
  }

  override setForm(form: FormGroup) {
    super.setForm(form);
    form.registerControl(this.name, this.control);
  }

  override getValue(): any {
    if( this.valueAmountDefined)
      return this.value;
    else return null;
  }

  get amount (): number|undefined {
    if (this.valueAmountDefined)
      return this.value.amount;
    else {
      return;
    }
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
}
