import {MoneyAmount} from '@dontcode/core';
import {Component, TemplateRef, ViewChild} from '@angular/core';
import {AbstractDynamicComponent, PossibleTemplateList, TemplateList} from '@dontcode/plugin-common';
import {FormControl, FormGroup} from "@angular/forms";

/**
 * EuroDollarComponent is just a specialized MoneyComponent to display only EUR or USD
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
    if (val==null) {
      val = new MoneyAmount();
      val.currencyCode=this.value.currencyCode;
    } else {
      if ((val.currencyCode!=this.value.currencyCode) && (this.value.currencyCode!=null)) {
        console.warn ("Setting currencyCode to "+val.currencyCode+" that is different from the component one ("+this.value.currencyCode+")");
      }
    }
    super.setValue(val);
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

  override transformToFormGroupValue(val: any): any {
    if (val?.amount==null) {
      return null;
    } else {
      return val.amount;
    }
  }

  override transformFromFormGroupValue(val: any): any {
    this.value.amount=val;
    return this.value;
  }

}
