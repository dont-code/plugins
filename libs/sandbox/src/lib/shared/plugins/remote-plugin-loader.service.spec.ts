import { TestBed } from '@angular/core/testing';

import { RemotePluginLoaderService } from './remote-plugin-loader.service';

describe('RemotePluginLoaderService', () => {
  let service: RemotePluginLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemotePluginLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
