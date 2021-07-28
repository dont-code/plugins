import { TestBed } from '@angular/core/testing';

import { DevTemplateManagerService } from './dev-template-manager.service';
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe('DevTemplateManagerService', () => {
  let service: DevTemplateManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(DevTemplateManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
