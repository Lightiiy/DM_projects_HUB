import { Component, inject } from '@angular/core';
import { NimGameService } from './services/nim-game';

@Component({
  selector: 'dm-nim-game',
  imports: [],
  templateUrl: './nim-game.html',
  styleUrl: './nim-game.scss',
})
export class NimGame {
  private nimGameService = inject(NimGameService);

  isPlayerTurn = this.nimGameService.isPlayerTurn;

  heaps = this.nimGameService.heaps;

  winner = this.nimGameService.winner;

  reset = this.nimGameService.reset;

  makeMove(heapIndex: number, amount: number) {
    this.nimGameService.handlePlayerMove(heapIndex, amount);
    console.log(this.heaps(),this.isPlayerTurn);
  }
}
