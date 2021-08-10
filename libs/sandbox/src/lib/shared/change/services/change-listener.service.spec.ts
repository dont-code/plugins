import { TestBed } from '@angular/core/testing';

import { ChangeListenerService } from './change-listener.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('ChangeListenerService', () => {
  let service: ChangeListenerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });
    service = TestBed.inject(ChangeListenerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
