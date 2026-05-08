import { Component, signal, computed } from '@angular/core';

interface StirlingRow {
  n: number;
  exact: string;
  approx: string;
  error: string;
}

@Component({
  selector: 'dm-stirling-analysis',
  templateUrl: './stirling-formula.html',
  styleUrl: './stirling-formula.scss'
})
export class StirlingFormula {

  nValue = signal(10); 
  testPoints = [1, 2, 5, 10, 20, 50, 100, 150]; 

  exactLogHeight = computed(() => {
    const n = this.nValue();
    let logSum = 0;
    for (let i = 1; i <= n; i++) logSum += Math.log(i);
    return logSum;
  });

  stirlingLogHeight = computed(() => {
    const n = this.nValue();
    if (n === 0) return 0;
    return 0.5 * Math.log(2 * Math.PI * n) + n * Math.log(n / Math.E);
  });

  currentExactValue = computed(() => {
    return this.calculateExact(this.nValue()).toString();
  });

  currentStirlingValue = computed(() => {
    const val = this.calculateStirling(this.nValue());
    return val.toExponential(4);
  });


  maxLogValue = Math.log(150) * 150;

  analysisData = computed(() => {
    return this.testPoints.map(n => {
      const exact = this.calculateExact(n);
      const approx = this.calculateStirling(n);
      const error = this.calculateRelativeError(exact, approx);

      return {
        n,
        exact: exact.toString(),
        approx: approx.toExponential(4),
        error: (error * 100).toFixed(6) + '%'
      };
    });
  });


  updateN(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.nValue.set(parseInt(val, 10));
  }

  getBarHeight(logVal: number): number {
  
    const maxVal = 712;
    return Math.max((logVal / maxVal) * 100, 2); 
  }

  private calculateExact(n: number): bigint {
    let res = BigInt(1);
    for (let i = 2; i <= n; i++) res *= BigInt(i);
    return res;
  }

  private calculateStirling(n: number): number {
    if (n === 0) return 1;
    return Math.sqrt(2 * Math.PI * n) * Math.pow(n / Math.E, n);
  }

  private calculateRelativeError(exact: bigint, approx: number): number {
    const exactNum = Number(exact);
    if (!isFinite(exactNum)) return 0;
    return Math.abs(exactNum - approx) / exactNum;
  }
}