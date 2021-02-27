import { TestBed } from '@angular/core/testing';

import { EntityStoreServiceService } from './entity-store.service';

describe('EntityStoreServiceService', () => {
  let service: EntityStoreServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityStoreServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
