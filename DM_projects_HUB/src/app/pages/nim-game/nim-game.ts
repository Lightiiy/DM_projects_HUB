import { Component, inject, signal } from '@angular/core';
import { NimGameService } from './services/nim-game.service';

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

  gameStarted = this.nimGameService.gameStarted;

  isTossing = this.nimGameService.isTossing;

  flickerBit = signal<string>('0')

  constructor(){
    setInterval(() => {
      if (this.isTossing()) {
        this.flickerBit.set(Math.random() > 0.5 ? '1' : '0')
      }
    }, 100)
  }

  makeMove(heapIndex: number, amount: number) {
    this.nimGameService.handlePlayerMove(heapIndex, amount);
  }

  startGame() {
    this.nimGameService.startGame();
  }


}
