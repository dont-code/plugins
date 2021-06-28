import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DynamicComponent, PossibleTemplateList, TemplateList} from "@dontcode/plugin-common";

@Component({
  selector: 'plugins-web-fields',
  templateUrl: './web-fields.component.html',
  styleUrls: ['./web-fields.component.css']
})
export class WebFieldsComponent implements OnInit, DynamicComponent {

  @ViewChild('EDIT_URL')
  private editUrlTemplate: TemplateRef<any>;
  @ViewChild('READ_URL')
  private readUrlTemplate: TemplateRef<any>;
  @ViewChild('EDIT_IMAGE')
  private editImageTemplate: TemplateRef<any>;
  @ViewChild('READ_IMAGE')
  private readImageTemplate: TemplateRef<any>;

  name:string;
  value:any;

  constructor() { }

  ngOnInit(): void {
  }

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

  setValue(val: any): void {
    this.value = val;
  }

  setName (name:string): void {
    this.name = name;
  }

  calculateUrl(url: string): string {
      if (url.includes('//')) {
        url = url.substring(url.indexOf('//')+2);
      }

      if (url.length>20)
        return url.substring(0, 17)+'...';
      else
        return url;
  }
}
