import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  Injector,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {DynamicComponent, PluginBaseComponent, TemplateList} from '@dontcode/plugin-common';
import {Change, PreviewHandler} from '@dontcode/core';

/**
 * Display or edit a country value
 */
@Component({
  selector: 'dontcode-fields-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements DynamicComponent{
  @ViewChild('inlineView')
  private inlineView: TemplateRef<any>;

  value = '';
  name:string;

  constructor() {
  }

  setName(name: string): void {
    this.name = name;
    }

  providesTemplates (): TemplateList {
    return new TemplateList(this.inlineView);
  }

  setValue(val: any) {
    this.value = val;
  }

}
