import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AckermannFunction } from './ackermann-function';

describe('AckermannFunction', () => {
  let component: AckermannFunction;
  let fixture: ComponentFixture<AckermannFunction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AckermannFunction],
    }).compileComponents();

    fixture = TestBed.createComponent(AckermannFunction);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
