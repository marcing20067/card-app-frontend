import { TestBed } from '@angular/core/testing';

import { SetsLearnService } from './sets-learn.service';

describe('SetsLearnService', () => {
  let service: SetsLearnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetsLearnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
