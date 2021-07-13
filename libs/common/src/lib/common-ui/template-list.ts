import {TemplateRef} from "@angular/core";

export class TemplateList {
  forInlineView: TemplateRef<any>|null;
  forFullView: TemplateRef<any>|null;
  forFullEdit: TemplateRef<any>|null;


  constructor(forInlineView: TemplateRef<any>|null, forFullView: TemplateRef<any>|null, forFullEdit: TemplateRef<any>|null) {
    this.forInlineView = forInlineView;
    this.forFullView = forFullView;
    this.forFullEdit = forFullEdit;
  }
}

export class PossibleTemplateList {
  forInlineView: boolean;
  forFullView: boolean;
  forFullEdit: boolean;


  constructor(forInlineView: boolean, forFullView: boolean, forFullEdit: boolean) {
    this.forInlineView = forInlineView;
    this.forFullView = forFullView;
    this.forFullEdit = forFullEdit;
  }
}
