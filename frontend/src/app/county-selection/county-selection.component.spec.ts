import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountySelectionComponent } from './county-selection.component';

describe('CountySelectionComponent', () => {
  let component: CountySelectionComponent;
  let fixture: ComponentFixture<CountySelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountySelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountySelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
