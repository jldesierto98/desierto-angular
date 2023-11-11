import { TestBed } from '@angular/core/testing';

import { CheckoutServiceService } from './checkout-service.service';

describe('CheckoutServiceService', () => {
  let service: CheckoutServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckoutServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
