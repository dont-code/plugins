import {PossibleTemplateList, TemplateList} from "./template-list";
import {FormGroup} from "@angular/forms";

export interface DynamicComponent {

  setName  (name:string): void;

  setValue (val:any):void;

  getValue (): any;

  /**
   * Sets the position of the parent component in the data model
   * @param position
   */
  setParentPosition (position:string): void;

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

  /**
   * If needed, the Dont-code framework will let the component change the source values into something accepted.
   * This is only called for components that doesn't manage their own form (managesFormControl() returns false)
   * @param type
   * @param val
   */
  transformFromSource(type: string, val: any): any;

  /**
   * If needed, the Dont-code framework will let the component change the value to be stored.
   * This is only called for components that doesn't manage their own form (managesFormControl() returns false)
   * @param type
   * @param val
   */
  transformToSource(type: string, val: any): any;

}
