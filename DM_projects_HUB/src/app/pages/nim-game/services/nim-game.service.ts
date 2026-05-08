import { computed, effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NimGameService {

  heaps = signal<number[]>([3,4,5]);
  isPlayerTurn = signal<boolean>(true);
  isTossing = signal<boolean>(false);
  gameStarted = signal<boolean>(false);
  winner = signal<string | null>(null);

  nimSum = computed(() => this.heaps().reduce((acc, val) => acc ^ val, 0))

  constructor() {
    effect(() => {
      if (this.gameStarted() && !this.isPlayerTurn() && !this.winner())
      {
        setTimeout(() => {
          this.compMove()
        }
        , 1000)
        console.log(this.isPlayerTurn(), this.winner(),!this.isPlayerTurn() && !this.winner());
      }
    })
  }

  startGame() {
    this.isTossing.set(true);
    this.winner.set(null);
    
    setTimeout(() => {
      const playerStarts = Math.random() > 0.5;
      this.isPlayerTurn.set(playerStarts);
      this.isTossing.set(false);
      this.gameStarted.set(true);
    }, 1500);
  }

  handlePlayerMove(heapIndex:number, amount:number) {
    if (!this.isPlayerTurn() && !this.winner()) {
      return;
    }
    this.makeMove(heapIndex, amount);

    if(!this.winner()){
      this.isPlayerTurn.set(false);
    }
  }

  private makeMove(heapIndex: number, amount:number) {
    if (this.winner() || amount < 1 || amount > this.heaps()[heapIndex] || !this.gameStarted()) {
      return;
    }

    const newHeaps = [...this.heaps()];
    newHeaps[heapIndex] -= amount;
    this.heaps.set(newHeaps);
    this.checkGameOver();
  }

  private compMove(){
    const currentHeaps = this.heaps();
    const sum = this.nimSum();

    if (sum === 0){
      const idx = currentHeaps.findIndex((h: number) => h > 0);
      this.makeMove(idx, 1);
    }
    else {
      for(let i = 0; i<currentHeaps.length; i++) {
        const targetSize = currentHeaps[i] ^ sum;
        if(targetSize< currentHeaps[i]) {
          this.makeMove(i, currentHeaps[i] - targetSize);
          break;
        }
      }
    }

    if (!this.winner()) {
      this.isPlayerTurn.set(true);
    }
  }

  reset() {
    this.heaps.set([3, 4, 5]);
    this.winner.set(null);
    this.gameStarted.set(false); 
    this.isTossing.set(false);
  }

  private checkGameOver() {
    if (this.heaps().every((h: number) => h === 0)) {
      this.winner.set(this.isPlayerTurn() ? 'Human' : 'Computer');
    }
  }
}
