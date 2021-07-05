import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DynamicComponent, PossibleTemplateList, TemplateList} from "@dontcode/plugin-common";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'plugins-time-fields',
  templateUrl: './time-fields.component.html',
  styleUrls: ['./time-fields.component.css']
})
export class TimeFieldsComponent implements OnInit, DynamicComponent {

  @ViewChild('EDIT_DATE')
  private editDateTemplate: TemplateRef<any>;
  @ViewChild('READ_DATE')
  private readDateTemplate: TemplateRef<any>;
  @ViewChild('EDIT_DATE_TIME')
  private editDateTimeTemplate: TemplateRef<any>;
  @ViewChild('READ_DATE_TIME')
  private readDateTimeTemplate: TemplateRef<any>;
  @ViewChild('EDIT_TIME')
  private editTimeTemplate: TemplateRef<any>;
  @ViewChild('READ_TIME')
  private readTimeTemplate: TemplateRef<any>;

  name:string;
  value:any;

  constructor() { }

  ngOnInit(): void {
  }

  providesTemplates(type:string): TemplateList {
    switch (type) {
      case 'Date':
        return new TemplateList(this.readDateTemplate, null,this.editDateTemplate);
      case 'Date & Time':
        return new TemplateList(this.readDateTimeTemplate, null, this.editDateTimeTemplate);
      case 'Time':
        return new TemplateList(this.readTimeTemplate,null,this.editTimeTemplate);
      default:
        return null;
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

  setName (name:string): void {
    this.name = name;
  }

  /**
   * By default, when you select a date in the dropdown, it won't update the reactive form. So we do it manually
   * @param form
   * @param event
   */
  dateSelected(form:FormGroup, event: any) {
      // One have to trigger onBlur event as it's the only one listened to by the form...
    console.log ("Selection:", event);
    const value={};
    value[this.name]=event;
    form.patchValue(value);
  }

  setValue(val: any): void {
    this.value = val;
  }

  getValue(): any {
    return this.value;
  }

  overrideValue(value: any): any {
    // We don't need to override any value in this component
    return value;
  }

}
