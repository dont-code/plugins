import {Component, TemplateRef, ViewChild} from '@angular/core';
import {AbstractDynamicComponent, PossibleTemplateList, TemplateList} from "@dontcode/plugin-common";

@Component({
  selector: 'plugins-basic-fields',
  templateUrl: './basic-fields.component.html',
  styleUrls: ['./basic-fields.component.css']
})
export class BasicFieldsComponent extends AbstractDynamicComponent {

  @ViewChild('INPUT')
  private inputTemplate!: TemplateRef<any>;
  @ViewChild('NUMERIC')
  private numericTemplate!: TemplateRef<any>;
  @ViewChild('CHECK')
  private checkTemplate!: TemplateRef<any>;
  @ViewChild('LIST_CHECK')
  private listCheckTemplate!: TemplateRef<any>;

  isJson=false;

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

  override transformFromSource(type: string, val: any): any {
    if( type==='Text') {
      if( typeof val !== 'string') {
        this.isJson=true;
        return (val!=null)?JSON.stringify(val,null,2):val;
      }
    }
    return super.transformFromSource(type, val);
  }

  override transformToSource(type: string, val: any): any {
    if( this.isJson) {
      try {
        const ret=JSON.parse(val);
        return ret;
      } catch (error) {
        console.error("Cannot convert field with name "+this.name+" from text String to an object");
      }
    } else
      return val;
  }
}
