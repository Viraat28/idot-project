import { TestBed } from '@angular/core/testing';

import { FuelQuarterSelectionGuard } from './fuel-quarter-selection.guard';

describe('FuelQuarterSelectionGuard', () => {
  let guard: FuelQuarterSelectionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(FuelQuarterSelectionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
