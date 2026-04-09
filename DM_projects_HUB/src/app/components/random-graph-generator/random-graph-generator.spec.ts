import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomGraphGenerator } from './random-graph-generator';

describe('RandomGraphGenerator', () => {
  let component: RandomGraphGenerator;
  let fixture: ComponentFixture<RandomGraphGenerator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RandomGraphGenerator],
    }).compileComponents();

    fixture = TestBed.createComponent(RandomGraphGenerator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
