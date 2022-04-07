import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AbstractDynamicComponent, DynamicComponent, PossibleTemplateList, TemplateList} from "@dontcode/plugin-common";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'plugins-time-fields',
  templateUrl: './time-fields.component.html',
  styleUrls: ['./time-fields.component.css']
})
export class TimeFieldsComponent extends AbstractDynamicComponent {

  @ViewChild('EDIT_DATE',{static:true})
  private editDateTemplate!: TemplateRef<any>;
  @ViewChild('READ_DATE',{static:true})
  private readDateTemplate!: TemplateRef<any>;
  @ViewChild('EDIT_DATE_TIME',{static:true})
  private editDateTimeTemplate!: TemplateRef<any>;
  @ViewChild('READ_DATE_TIME',{static:true})
  private readDateTimeTemplate!: TemplateRef<any>;
  @ViewChild('EDIT_TIME',{static:true})
  private editTimeTemplate!: TemplateRef<any>;
  @ViewChild('READ_TIME',{static:true})
  private readTimeTemplate!: TemplateRef<any>;

  providesTemplates(type:string): TemplateList {
    switch (type) {
      case 'Date':
        return new TemplateList(this.readDateTemplate, null,this.editDateTemplate);
      case 'Date & Time':
        return new TemplateList(this.readDateTimeTemplate, null, this.editDateTimeTemplate);
      case 'Time':
      default:
        return new TemplateList(this.readTimeTemplate,null,this.editTimeTemplate);
    }
  }

  canProvide(type?: string): PossibleTemplateList {
    switch (type) {
      case 'Date':
      case 'Date & Time':
      case 'Time':
        return new PossibleTemplateList(true, false, true);
      default:
        return new PossibleTemplateList(false, false, false);
    }
  }

  /**
   * By default, when you select a date in the dropdown, it won't update the reactive form. So we do it manually
   * @param form
   * @param event
   */
  dateSelected(form:FormGroup, event: any) {
      // One have to trigger onBlur event as it's the only one listened to by the form...
    console.log ("Selection:", event);
    const value:{[key:string]:any}={};
    value[this.name]=event;
    form.patchValue(value);
  }

}
