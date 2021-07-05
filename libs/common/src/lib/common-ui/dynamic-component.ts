import {PossibleTemplateList, TemplateList} from "../common-ui/template-list";

export interface DynamicComponent {

  setName  (name:string): void;

  setValue (val:any):void;

  getValue (): any;

  /**
   * Give the option for the DynamicComponent to modify the value before it is stored.
   * This allows using a different storing model than the Reactive or non Reactive Form model
   * @param value
   */
  overrideValue (value:any): any;

  canProvide (key?:string): PossibleTemplateList;
  /**
   * Returns the list of templates the component is providing
   * Optionally it can provides a different list depending on the provided key.
   */
  providesTemplates (key?:string): TemplateList;

}
