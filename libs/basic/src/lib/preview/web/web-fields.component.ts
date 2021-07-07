import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AbstractDynamicComponent, DynamicComponent, PossibleTemplateList, TemplateList} from "@dontcode/plugin-common";

@Component({
  selector: 'plugins-web-fields',
  templateUrl: './web-fields.component.html',
  styleUrls: ['./web-fields.component.css']
})
export class WebFieldsComponent extends AbstractDynamicComponent {

  @ViewChild('EDIT_URL')
  private editUrlTemplate: TemplateRef<any>;
  @ViewChild('READ_URL')
  private readUrlTemplate: TemplateRef<any>;
  @ViewChild('EDIT_IMAGE')
  private editImageTemplate: TemplateRef<any>;
  @ViewChild('READ_IMAGE')
  private readImageTemplate: TemplateRef<any>;

  providesTemplates(type:string): TemplateList {
    switch (type) {
      case 'Website (url)':
        return new TemplateList(this.readUrlTemplate, null,this.editUrlTemplate);
      case 'Image':
        return new TemplateList(this.readImageTemplate, null, this.editImageTemplate);
      default:
        return null;
    }
  }

  canProvide(type?: string): PossibleTemplateList {
    switch (type) {
      case 'Website (url)':
      case 'Image':
        return new PossibleTemplateList(true, false, true);
      default:
        return new PossibleTemplateList(false, false, false);
    }
  }

  calculateUrl(url: string): string {
    if (!url) return url;

    if (url.includes('//')) {
      url = url.substring(url.indexOf('//')+2);
    }

    if (url.length>20)
      return url.substring(0, 17)+'...';
    else
      return url;
  }

}
