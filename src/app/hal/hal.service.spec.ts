import { TestBed, inject } from '@angular/core/testing';

import { HalService } from './hal.service';

describe('HalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HalService]
    });
  });

  it('should be created', inject([HalService], (service: HalService) => {
    expect(service).toBeTruthy();
  }));
});
