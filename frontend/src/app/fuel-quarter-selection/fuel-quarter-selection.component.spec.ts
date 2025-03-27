import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelQuarterSelectionComponent } from './fuel-quarter-selection.component';

describe('FuelQuarterSelectionComponent', () => {
  let component: FuelQuarterSelectionComponent;
  let fixture: ComponentFixture<FuelQuarterSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuelQuarterSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuelQuarterSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
