import { TestBed } from '@angular/core/testing';

import { DevChangePushService } from './dev-change-push.service';
import {ChangeListenerService} from "@dontcode/sandbox";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('DevChangePushService', () => {
  let service: DevChangePushService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ChangeListenerService
      ]});
    service = TestBed.inject(DevChangePushService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
