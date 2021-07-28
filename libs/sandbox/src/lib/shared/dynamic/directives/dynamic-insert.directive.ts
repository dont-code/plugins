import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
  selector: '[previewUiDynamicInsert]'
})
export class DynamicInsertDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }
}
