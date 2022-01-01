import { TestBed } from '@angular/core/testing';

import { ServerErrorGuard } from './server-error.guard';

describe('ServerErrorGuard', () => {
  let guard: ServerErrorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ServerErrorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
