import {TemplateList} from "../common-ui/template-list";

export interface DynamicComponent {

  setValue (val:any):void;
  /**
   * Returns the list of templates the component is providing
   */
  providesTemplates (): TemplateList;

}
