import { TestBed } from '@angular/core/testing';

import { GoogleApiLoaderServiceService } from './google-api-loader.service.service';

describe('GoogleApiLoaderServiceService', () => {
  let service: GoogleApiLoaderServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleApiLoaderServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
