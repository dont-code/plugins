import {PossibleTemplateList, TemplateList} from "../common-ui/template-list";

export interface DynamicComponent {

  setName  (name:string): void;

  setValue (val:any):void;

  canProvide (key?:string): PossibleTemplateList;
  /**
   * Returns the list of templates the component is providing
   * Optionally it can provides a different list depending on the provided key.
   */
  providesTemplates (key?:string): TemplateList;

}
