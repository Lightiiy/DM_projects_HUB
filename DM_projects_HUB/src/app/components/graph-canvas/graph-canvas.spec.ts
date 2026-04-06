import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphCanvas } from './graph-canvas';

describe('GraphCanvas', () => {
  let component: GraphCanvas;
  let fixture: ComponentFixture<GraphCanvas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphCanvas],
    }).compileComponents();

    fixture = TestBed.createComponent(GraphCanvas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
