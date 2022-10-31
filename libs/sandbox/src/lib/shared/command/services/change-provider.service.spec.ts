import {Change, ChangeType} from '@dontcode/core';
import {TestBed} from '@angular/core/testing';

import {ChangeProviderService} from './change-provider.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {PluginCommonModule} from "@dontcode/plugin-common";


describe('CommandProviderService', () => {
  let service: ChangeProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PluginCommonModule.forRoot()]
    });
    service = TestBed.inject(ChangeProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should updates content from changes', () => {
    service.pushChange(new Change(ChangeType.UPDATE, 'creation/name', 'NewName'));
    expect(service.getJsonAt('creation')).toHaveProperty('name', "NewName");
  });
});
