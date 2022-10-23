import {DynamicComponent} from "./dynamic-component";
import {FormControl, FormGroup} from "@angular/forms";
import {PossibleTemplateList, TemplateList} from "./template-list";
import {DynamicEventSource, DynamicEventType} from "./dynamic-event";
import {Subscription} from "rxjs";
import {Component, OnDestroy} from "@angular/core";

/**
 * A component that can be dynamically loaded by the dont-code framework.
 * It can integrate with a reactive form.
 * To dynamically load other Dont-code components for subFields, you should use AbstractDynamicLoaderComponent instead
 * To listen to model change, you have to derive from PluginBaseComponent instead.
 */
@Component({template:''})
export abstract class AbstractDynamicComponent implements DynamicComponent, OnDestroy{

  name!: string;
  value: any;
  form!: FormGroup;

  parentPosition:string|null=null;

  subscriptions = new Subscription();

  setName(name: string): void {
    this.name = name;
  }

  getValue(): any {
    if (this.form!=null)
      this.updateValueFromForm();
    return this.value;
  }

  setValue(val: any): void {
    this.value=val;

    if (this.form!=null)
      this.hydrateValueToForm ();
  }

  setParentPosition(position: string) {
    this.parentPosition=position;
  }

  abstract providesTemplates(key?: string): TemplateList;
  abstract canProvide(key?: string): PossibleTemplateList;

  setForm(form: FormGroup): void {
    this.form=form;
    if ((this.form!=null) && (this.name!=null)) {
      this.createAndRegisterFormControls();
    }
  }

  getForm (): FormGroup {
    return this.form;
  }

  /**
   * By default registers a single control with the name this.name
   * @protected
   */
  protected createAndRegisterFormControls (): void {
    const control = new FormControl (null, {updateOn:'blur'});
    this.form.registerControl(this.name, control);
  }
  /**
   * This method allows components to generate a value manageable in FormControl from the original value (set by setValue ())
   * By default the same value is used
   * @param val
   */
  transformToFormGroupValue(val: any): any {
    return val;
  }

  /**
   * From the values in FormControl to a value manageable by the Dont-code Framework. Will be called by getValue
   * By default the same value is used
   * @param val
   */
  transformFromFormGroupValue(val: any): any {
    return val;
  }

  /**
   * Updates the form with the value
   */
  hydrateValueToForm ():void {
    if (this.name!=null) {
      const control = this.form.get(this.name);
      if( control==null) {
        throw new Error("No form control for the name "+this.name);
      } else {
        const formValue = this.transformToFormGroupValue(this.value);
        control.setValue(formValue, { emitEvent: false });
      }
    }
  }

  /**
   * Retrieve value from the Angular form, and converts it to a value that can be stored
   * @return true if value have been updated
   */
  updateValueFromForm ():boolean {
    if (this.name==null)
      return false;
    const control = this.form.get(this.name);
    if( control==null) {
      throw new Error("No form control for the name "+this.name);
    } else {
      if (control.dirty) {
        this.value= this.transformFromFormGroupValue(control.value);
        control.markAsPristine({onlySelf: true});
        return true;
      }
    }
    return false;
  }

  /**
   * Returns a string that can best display the value or null if it's already a string
   * @param value
   */
  public static toBeautifyString (value:unknown, maxLength?:number): string|null {
    if( value == null)
      return null;

    let ret="";

    if ( Array.isArray(value)) {
      value = value[0];
    }
    // Try to see if we have json or Date or something else
    switch (typeof value) {
      case "string": {
        ret = value;
        break;
      }
      case "object": {
        if (value instanceof Date) {
          ret = value.toLocaleDateString();
        } else {
          ret = JSON.stringify(value, null, 2);
        }
        break;
      }
      case "undefined": {
        break;
      }
      default: {
        ret = (value as any).toLocaleString();
      }
    }

    if( maxLength!=null) {
      if (ret.length> maxLength) {
        ret = ret.substring(0,maxLength-3)+'...';
      }
    }

    return ret;
  }

  listEventSources(): DynamicEventSource[] {
    return [];
  }

  selectEventSourceFor(type: DynamicEventType, name?: string): DynamicEventSource | null {
    const sources=this.listEventSources();
    for (const src of sources) {
      if( src.type===type) {
        if (name==null)
          return src;
        else if (src.name==name) {
          return src;
        }
      }
    }
    return null;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
