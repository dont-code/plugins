import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  Injector,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {PluginBaseComponent, TemplateList} from '@dontcode/plugin-common';
import {PreviewHandler} from '@dontcode/core';

/**
 * Display or edit a country value
 */
@Component({
  selector: 'dontcode-fields-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent extends PluginBaseComponent implements PreviewHandler, AfterViewInit {

  @ViewChild('inlineView')
  private inlineView: TemplateRef<any>;

  value = 'France';

  constructor(componentFactoryResolver: ComponentFactoryResolver,injector: Injector) {
    super(componentFactoryResolver, injector);
  }

  ngAfterViewInit(): void {
        console.log (this.inlineView);
    }

  protected handleChange(change) {
  }

  providesTemplates (): TemplateList {
    return new TemplateList(this.inlineView);
  }

}
