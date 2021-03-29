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

export class PossibleTemplateList {
  forInlineView: boolean;
  forFullView: boolean;
  forFullEdit: boolean;


  constructor(forInlineView?: boolean, forFullView?: boolean, forFullEdit?: boolean) {
    this.forInlineView = forInlineView;
    this.forFullView = forFullView;
    this.forFullEdit = forFullEdit;
  }
}
