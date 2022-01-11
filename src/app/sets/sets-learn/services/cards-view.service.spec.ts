import { TestBed } from '@angular/core/testing';

import { CardsViewService } from './cards-view.service';

describe('CardsViewService', () => {
  let service: CardsViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardsViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
