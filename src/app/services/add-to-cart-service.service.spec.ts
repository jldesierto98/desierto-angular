import { TestBed } from '@angular/core/testing';

import { AddToCartService } from './add-to-cart-service.service';

describe('AddToCartServiceService', () => {
  let service: AddToCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddToCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
