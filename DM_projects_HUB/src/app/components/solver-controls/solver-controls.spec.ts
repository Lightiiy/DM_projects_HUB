import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolverControls } from './solver-controls';

describe('SolverControls', () => {
  let component: SolverControls;
  let fixture: ComponentFixture<SolverControls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolverControls],
    }).compileComponents();

    fixture = TestBed.createComponent(SolverControls);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
