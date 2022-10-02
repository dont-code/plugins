import {Component, TemplateRef, ViewChild} from '@angular/core';
import {AbstractDynamicComponent, PossibleTemplateList, TemplateList} from "@dontcode/plugin-common";
import {FormControl, FormGroup} from "@angular/forms";

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

  control = new FormControl(null, {updateOn:"blur"});

  isJson=false;
  type?:string;

  override setForm(form: FormGroup) {
    super.setForm(form);
    this.form.registerControl(this.name, this.control);
  }

  providesTemplates(type:string): TemplateList {
    if( this.type!=type) {
      console.warn("BasicField Type is changed from "+this.type+" to "+type);
      this.type=type;
    }
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
    this.type=type;
    return new PossibleTemplateList((type==='Boolean')?true:false, false, true);
  }

  override transformToFormGroupValue(val: any): any {
    if( this.type==='Text') {
      if( typeof val !== 'string') {
        this.isJson=true;
        return (val!=null)?JSON.stringify(val,null,2):val;
      }
    }
    return super.transformToFormGroupValue(val);
  }

  override transformFromFormGroupValue(val: any): any {
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
