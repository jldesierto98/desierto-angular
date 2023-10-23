import { TestBed } from '@angular/core/testing';

import { FormActionService } from './form-action.service';

describe('FormActionService', () => {
  let service: FormActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormActionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
