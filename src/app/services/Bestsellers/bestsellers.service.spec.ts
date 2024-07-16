import { TestBed } from '@angular/core/testing';

import { BestsellersService } from './bestsellers.service';

describe('BestsellersService', () => {
  let service: BestsellersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BestsellersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
