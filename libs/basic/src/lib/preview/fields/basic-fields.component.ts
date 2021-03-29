import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DynamicComponent, PossibleTemplateList, TemplateList} from "@dontcode/plugin-common";

@Component({
  selector: 'plugins-basic-fields',
  templateUrl: './basic-fields.component.html',
  styleUrls: ['./basic-fields.component.css']
})
export class BasicFieldsComponent implements OnInit, DynamicComponent {

  @ViewChild('INPUT')
  private inputTemplate: TemplateRef<any>;
  @ViewChild('NUMERIC')
  private numericTemplate: TemplateRef<any>;
  @ViewChild('CHECK')
  private checkTemplate: TemplateRef<any>;

  name:string;
  value:any;

  constructor() { }

  ngOnInit(): void {
  }

  providesTemplates(type:string): TemplateList {
    switch (type) {
      case 'NUMERIC':
        return new TemplateList(null, null,this.numericTemplate);
      case 'CHECK':
        return new TemplateList(null, null, this.checkTemplate);
      default:
        return new TemplateList(null,null,this.inputTemplate);
    }
  }
  canProvide(type?: string): PossibleTemplateList {
    return new PossibleTemplateList(false, false, true);
  }

  setValue(val: any): void {
    this.value = val;
  }

  setName (name:string): void {
    this.name = name;
  }

}
