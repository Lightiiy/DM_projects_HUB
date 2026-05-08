import { computed, effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NimGameService {

  heaps = signal<number[]>([3,4,5]);
  isPlayerTurn = signal<boolean>(true);
  winner = signal<string | null>(null);

  nimSum = computed(() => this.heaps().reduce((acc, val) => acc ^ val, 0))

  constructor() {
    effect(() => {
      if (!this.isPlayerTurn() && !this.winner())
      {
        setTimeout(() => 
          this.compMove()
        , 500)
        console.log(this.isPlayerTurn(), this.winner(),!this.isPlayerTurn() && !this.winner());
      }
    })
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
    if (this.winner() || amount < 1 || amount > this.heaps()[heapIndex]) {
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
      const idx = currentHeaps.findIndex(h => h > 0);
      this.makeMove(idx, 1);
    }
    else {
      for(let i =0; i<currentHeaps.length; i++) {
        const targetSize = currentHeaps[i] ^ sum;
        if(targetSize< currentHeaps[i]) {
          console.log('I am making this move: ', i, currentHeaps[i] - targetSize);
          this.makeMove(i, currentHeaps[i] - targetSize);
          break;
        }
      }
    }

    this.isPlayerTurn.set(true);
  }

  reset() {
    this.heaps.set([3,4,5]);
    this.isPlayerTurn.set(true);
    this.winner.set(null);
  }

  private checkGameOver() {
    if (this.heaps().every(h => h === 0)) {
      this.winner.set(this.isPlayerTurn() ? 'Human' : 'AI');
      return true;
    }
    return false;
  }
}
