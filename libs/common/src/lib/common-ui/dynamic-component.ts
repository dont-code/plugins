import {
  PreviewHandler
} from "@dontcode/core";
import {TemplateList} from "../common-ui/template-list";

export interface DynamicComponent extends PreviewHandler {
  /**
   * Returns the list of templates the component is providing
   */
  providesTemplates (): TemplateList;

}
