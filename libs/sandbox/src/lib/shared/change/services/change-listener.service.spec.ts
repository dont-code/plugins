import { TestBed } from '@angular/core/testing';

import { ChangeListenerService } from './change-listener.service';

describe('ChangeListenerService', () => {
  let service: ChangeListenerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangeListenerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
