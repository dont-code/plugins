import { TestBed } from '@angular/core/testing';

import { ComponentLoaderService } from './component-loader.service';
import {BrowserDynamicTestingModule} from "@angular/platform-browser-dynamic/testing";
import {PluginCommonModule} from "@dontcode/plugin-common";

describe('ComponentLoaderService', () => {
  let service: ComponentLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [BrowserDynamicTestingModule,PluginCommonModule.forRoot()]});
    service = TestBed.inject(ComponentLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
