import {TemplateRef} from "@angular/core";

export class TemplateList {
  forInlineView: TemplateRef<any>;
  forFullView: TemplateRef<any>;
  forFullEdit: TemplateRef<any>;


  constructor(forInlineView?: TemplateRef<any>, forFullView?: TemplateRef<any>, forFullEdit?: TemplateRef<any>) {
    this.forInlineView = forInlineView;
    this.forFullView = forFullView;
    this.forFullEdit = forFullEdit;
  }
}
