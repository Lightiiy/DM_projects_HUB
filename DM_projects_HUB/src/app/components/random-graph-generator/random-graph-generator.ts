import { Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GraphGeneratorService } from './services/graph-generator-service';
import { PercentPipe } from '@angular/common';
import { debounce, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Graph } from '../../models/graph-components.interface';

@Component({
  selector: 'dm-random-graph-generator',
  imports: [ReactiveFormsModule, PercentPipe],
  templateUrl: './random-graph-generator.html',
  styleUrl: './random-graph-generator.scss',
})
export class RandomGraphGenerator implements OnInit {
  private formBuilder = inject(FormBuilder);
  private generatorService = inject(GraphGeneratorService);
  private destroyRef = inject(DestroyRef);


  @Output() graphGenerated = new EventEmitter<Graph>();
  
  generatorForm = this.formBuilder.group({
    nodeCount: [12, [Validators.required, Validators.min(3), Validators.max(100)]],
    density: [0.2, [Validators.min(0), Validators.max(1)]],
    maxWeight: [50, [Validators.required, Validators.min(1)]]
  });

  ngOnInit() {
    this.generatorForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(values => {
      this.generateAndEmit();
    })
  }

  generateAndEmit() {
    if (this.generatorForm.invalid) return;

    const {nodeCount, density, maxWeight} = this.generatorForm.getRawValue();

    const newGraph = this.generatorService.generateErdosRenyi(
      nodeCount!,
      density!,
      maxWeight!
    );

    this.graphGenerated.emit(newGraph);
  }

}
