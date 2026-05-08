import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NimGame } from './nim-game';

describe('NimGame', () => {
  let component: NimGame;
  let fixture: ComponentFixture<NimGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NimGame],
    }).compileComponents();

    fixture = TestBed.createComponent(NimGame);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
