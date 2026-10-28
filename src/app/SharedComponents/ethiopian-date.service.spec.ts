import { TestBed } from '@angular/core/testing';

import { EthiopianDateService } from './ethiopian-date.service';

describe('EthiopianDateService', () => {
  let service: EthiopianDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EthiopianDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
