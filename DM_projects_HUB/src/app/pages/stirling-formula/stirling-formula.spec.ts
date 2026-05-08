import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StirlingFormula } from './stirling-formula';

describe('StirlingFormula', () => {
  let component: StirlingFormula;
  let fixture: ComponentFixture<StirlingFormula>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StirlingFormula],
    }).compileComponents();

    fixture = TestBed.createComponent(StirlingFormula);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
