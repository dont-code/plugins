import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AbstractDynamicComponent, DynamicComponent, PossibleTemplateList, TemplateList} from "@dontcode/plugin-common";

@Component({
  selector: 'plugins-basic-fields',
  templateUrl: './basic-fields.component.html',
  styleUrls: ['./basic-fields.component.css']
})
export class BasicFieldsComponent extends AbstractDynamicComponent {

  @ViewChild('INPUT')
  private inputTemplate: TemplateRef<any>;
  @ViewChild('NUMERIC')
  private numericTemplate: TemplateRef<any>;
  @ViewChild('CHECK')
  private checkTemplate: TemplateRef<any>;
  @ViewChild('LIST_CHECK')
  private listCheckTemplate: TemplateRef<any>;

  providesTemplates(type:string): TemplateList {
    switch (type) {
      case 'Number':
        return new TemplateList(null, null,this.numericTemplate);
      case 'Boolean':
        return new TemplateList(this.listCheckTemplate, null, this.checkTemplate);
      default:
        return new TemplateList(null,null,this.inputTemplate);
    }
  }
  canProvide(type?: string): PossibleTemplateList {
    return new PossibleTemplateList((type==='Boolean')?true:false, false, true);
  }

}
