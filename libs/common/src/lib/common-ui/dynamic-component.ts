import {PossibleTemplateList, TemplateList} from "../common-ui/template-list";
import {FormGroup} from "@angular/forms";

export interface DynamicComponent {

  setName  (name:string): void;

  setValue (val:any):void;

  getValue (): any;

  canProvide (key?:string): PossibleTemplateList;
  /**
   * Returns the list of templates the component is providing
   * Optionally it can provides a different list depending on the provided key.
   */
  providesTemplates (key?:string): TemplateList;

  /**
   * Sets the formgroup to use in case of edition
   * @param form
   */
  setForm (form: FormGroup): void;

  /**
   * Is the component managing its own FormControl or does it rely on the framework to create one for it ?
   */
  managesFormControl (): boolean;
}
