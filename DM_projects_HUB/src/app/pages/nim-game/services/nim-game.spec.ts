import { TestBed } from '@angular/core/testing';

import { NimGame } from './nim-game';

describe('NimGame', () => {
  let service: NimGame;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NimGame);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
