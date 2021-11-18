import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AbstractDynamicComponent, PossibleTemplateList, TemplateList} from '@dontcode/plugin-common';
import * as i18nCountries from 'i18n-iso-countries';
import countryDataEn from 'i18n-iso-countries/langs/en.json'
import {FormGroup} from "@angular/forms";

/**
 * Display or edit a country value
 */
@Component({
  selector: 'dontcode-fields-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent extends AbstractDynamicComponent {
  @ViewChild('inlineView',{static:true})
  private inlineView!: TemplateRef<any>;

  @ViewChild('fullEditView',{static:true})
  private fullEditView!: TemplateRef<any>;

  providesTemplates (): TemplateList {
    return new TemplateList(this.inlineView, null, this.fullEditView);
  }

  canProvide(key?: string): PossibleTemplateList {
    return new PossibleTemplateList(true, false, true);
  }

}
