import {Component, TemplateRef, ViewChild} from '@angular/core';
import {AbstractDynamicComponent, PossibleTemplateList, TemplateList,} from '@dontcode/plugin-common';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'plugins-time-fields',
  templateUrl: './time-fields.component.html',
  styleUrls: ['./time-fields.component.css'],
})
export class TimeFieldsComponent extends AbstractDynamicComponent {
  @ViewChild('EDIT_DATE', { static: true })
  private editDateTemplate!: TemplateRef<any>;
  @ViewChild('READ_DATE', { static: true })
  private readDateTemplate!: TemplateRef<any>;
  @ViewChild('EDIT_DATE_TIME', { static: true })
  private editDateTimeTemplate!: TemplateRef<any>;
  @ViewChild('READ_DATE_TIME', { static: true })
  private readDateTimeTemplate!: TemplateRef<any>;
  @ViewChild('EDIT_TIME', { static: true })
  private editTimeTemplate!: TemplateRef<any>;
  @ViewChild('READ_TIME', { static: true })
  private readTimeTemplate!: TemplateRef<any>;

  longConverter = Intl.DateTimeFormat(navigator.language, { weekday:'long', day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit', timeZoneName:'long'});
  shortConverter = Intl.DateTimeFormat(navigator.language, { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit', timeZoneName:'short'});

  providesTemplates(type: string): TemplateList {
    this.updateConverters(type);
    switch (type) {
      case 'Date':
        return new TemplateList(
          this.readDateTemplate,
          null,
          this.editDateTemplate
        );
      case 'Date & Time':
        return new TemplateList(
          this.readDateTimeTemplate,
          null,
          this.editDateTimeTemplate
        );
      case 'Time':
      default:
        return new TemplateList(
          this.readTimeTemplate,
          null,
          this.editTimeTemplate
        );
    }
  }

  updateConverters (type:string):void {
    switch (type) {
      case 'Date':
        this.longConverter = Intl.DateTimeFormat(navigator.language, { weekday:'long', day:'numeric', month:'long', year:'numeric'});
        this.shortConverter = Intl.DateTimeFormat(navigator.language, { day:'2-digit', month:'2-digit', year:'numeric'});
        break;
      case 'Date & Time':
        this.longConverter = Intl.DateTimeFormat(navigator.language, { weekday:'long', day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit', timeZoneName:'long'});
        this.shortConverter = Intl.DateTimeFormat(navigator.language, { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit', timeZoneName:'short'});
        break;
      case 'Time':
      default:
        this.longConverter = Intl.DateTimeFormat(navigator.language, { hour:'2-digit', minute:'2-digit', second:'2-digit', timeZoneName:'long'});
        this.shortConverter = Intl.DateTimeFormat(navigator.language, {hour:'2-digit', minute:'2-digit', second:'2-digit', timeZoneName:'short'});

    }
  }

  localizeLongDate (value:Date): string {
    return this.longConverter.format(value);
  }

  localizeShortDate (value:Date): string {
    return this.shortConverter.format(value);
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
  dateSelected(form: FormGroup, event: any) {
    // One have to trigger onBlur event as it's the only one listened to by the form...
    console.log('Selection:', event);
    const value: { [key: string]: any } = {};
    const control = form.get(this.name);
    if (control!=null) {
      control.setValue(event);
      control.markAsDirty();
    } else {
      console.error("Cannot set date of unknown form control with name "+this.name);
    }
  }
}
