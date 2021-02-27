import { TestBed } from '@angular/core/testing';

import { EntityStoreService } from './entity-store.service';

describe('EntityStoreService', () => {
  let service: EntityStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
