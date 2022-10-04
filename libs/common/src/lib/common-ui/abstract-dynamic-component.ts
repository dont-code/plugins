import {DynamicComponent} from "./dynamic-component";
import {FormControl, FormGroup} from "@angular/forms";
import {PossibleTemplateList, TemplateList} from "./template-list";

/**
 * A component that can be dynamically loaded by the dont-code framework.
 * It can integrate with a reactive form.
 * To dynamically load other Dont-code components for subFields, you should use AbstractDynamicLoaderComponent instead
 * To listen to model change, you have to derive from PluginBaseComponent instead.
 */
export abstract class AbstractDynamicComponent implements DynamicComponent {

  name!: string;
  value: any;
  form!: FormGroup;

  parentPosition:string|null=null;

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

}
