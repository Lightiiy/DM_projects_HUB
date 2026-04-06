import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaxCut } from './max-cut';

describe('MaxCut', () => {
  let component: MaxCut;
  let fixture: ComponentFixture<MaxCut>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaxCut],
    }).compileComponents();

    fixture = TestBed.createComponent(MaxCut);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
