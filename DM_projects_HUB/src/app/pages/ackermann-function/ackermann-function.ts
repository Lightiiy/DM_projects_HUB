import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AckermannFrame } from '../../models/ackermann-node.interface';

@Component({
  selector: 'dm-ackermann-function',
  imports: [ReactiveFormsModule],
  templateUrl: './ackermann-function.html',
  styleUrl: './ackermann-function.scss',
})
export class AckermannFunction {


  private formBuilder = inject(NonNullableFormBuilder);

  discoveredValues = signal<Record<string, number>>({});

  visitCounts = signal<Record<string, number>>({});

  stack = signal<AckermannFrame[]>([]);
  steps = signal(0);
  result = signal<number | null>(null);
  isRunning = signal(false);

  ackermannForm = this.formBuilder.group({
    m: [0, [Validators.required, Validators.min(0), Validators.max(4)]],
    n: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
  });

  maxM = computed(() => {
    const keys = Object.keys(this.visitCounts());
    if (keys.length === 0) return 4;
    const ms = keys.map(k => parseInt(k.split(',')[0]));
    return Math.max(...ms, 4);
  });

  maxN = computed(() => {
    const keys = Object.keys(this.visitCounts());
    if (keys.length === 0) return 5;
    const ns = keys.map(k => parseInt(k.split(',')[1]));
    return Math.max(...ns, 5);
  });

  getRange(size: number) {
    return Array.from({ length: size + 1 }, (_, i) => i);
  }

  async start() {
    const { m: startM, n: startN } = this.ackermannForm.getRawValue();
    this.isRunning.set(true);
    this.result.set(null);
    this.steps.set(0);
    this.visitCounts.set({}); 
    this.discoveredValues.set({});

    let currentStack: AckermannFrame[] = [{ m: startM, n: startN }];
    this.stack.set([...currentStack]);

    while (currentStack.length > 0) {
      this.steps.update(s => s + 1);

      const frame = currentStack.pop()!;
      const m = frame.m;
      const n = frame.n;

      this.visitCounts.update(prev => {
        const key = `${m},${n}`;
        return { ...prev, [key]: (prev[key] || 0) + 1 };
      });

      if (m === 0) {
        const res = n + 1;
        this.recordDiscovery(m, n, res);

        if (currentStack.length === 0) {
          this.result.set(res);
        } else {
          const parent = currentStack[currentStack.length - 1];
          parent.n = res;
          if (parent.n !== -1) {
            this.recordDiscovery(parent.m, parent.n, parent.n);
          }
        }
      } else if (n === 0) {
        currentStack.push({ m: m - 1, n: 1 });
      } else {
        currentStack.push({ m: m - 1, n: -1 });
        currentStack.push({ m: m, n: n - 1 });
      }

      this.stack.set([...currentStack]);
      await new Promise(r => setTimeout(r, 10));
    }
    this.isRunning.set(false);
  }

  private recordDiscovery(m: number, n: number, value: number) {
    this.discoveredValues.update(prev => ({
      ...prev,
      [`${m},${n}`]: value
    }));
  }


  getVisitColor(m: number, n: number): string {
    const counts = this.visitCounts();
    const count = counts[`${m},${n}`] || 0;
    
    if (count === 0) return '#222'; 

    const allCounts = Object.values(counts);
    const maxVisits = allCounts.length > 0 ? Math.max(...allCounts) : 1;

    const ratio = Math.min(Math.log(count + 1) / Math.log(maxVisits + 1), 1);

    return this.interpolateColor('#b02109', '#fcd2a0', ratio);
  }


  private interpolateColor(color1: string, color2: string, factor: number): string {
    // Simple hex interpolation logic
    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);

    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);

    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1)); // Adjusted for your specific palette
    const b = Math.round(b1 + factor * (b2 - b1));

    return `rgb(${r}, ${g}, ${b})`;
  }
}
