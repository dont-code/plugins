import {DynamicComponent} from "./dynamic-component";
import {FormGroup} from "@angular/forms";
import {PossibleTemplateList, TemplateList} from "./template-list";

/**
 * A component that can be dynamically loaded by the dont-code framework.
 * It can integrate with a reactive form
 */
export abstract class AbstractDynamicComponent implements DynamicComponent {

  name!: string;
  value: any;
  form!: FormGroup;

  setName(name: string): void {
    this.name = name;
  }

  getValue(): any {
    return this.value;
  }

  setValue(val: any): void {
    this.value=val;
  }

  abstract providesTemplates(key?: string): TemplateList;
  abstract canProvide(key?: string): PossibleTemplateList;

  setForm(form: FormGroup): void {
    this.form=form;
  }

  managesFormControl(): boolean {
    return false;
  }

}
