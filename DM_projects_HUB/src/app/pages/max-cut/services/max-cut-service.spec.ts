import { TestBed } from '@angular/core/testing';

import { MaxCutService } from './max-cut-service';

describe('MaxCutService', () => {
  let service: MaxCutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaxCutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
