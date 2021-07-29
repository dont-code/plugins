import { TestBed } from '@angular/core/testing';

import { DevChangePushService } from './dev-change-push.service';

describe('DevChangePushService', () => {
  let service: DevChangePushService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevChangePushService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
