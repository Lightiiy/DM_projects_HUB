import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchToBipartite } from './switch-to-bipartite';

describe('SwitchToBipartite', () => {
  let component: SwitchToBipartite;
  let fixture: ComponentFixture<SwitchToBipartite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchToBipartite],
    }).compileComponents();

    fixture = TestBed.createComponent(SwitchToBipartite);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
